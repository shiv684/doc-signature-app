const Signature = require('../models/Signature.model')
const Document = require('../models/Documents.model')
const { PDFDocument } = require('pdf-lib')
const fs = require('fs')
const path = require('path')
const logAudit = require('../utils/audit')

// Save signature coordinates
exports.saveSignature = async (req, res) => {
  try {
    const { documentId, x, y, page, width, height } = req.body

    const doc = await Document.findById(documentId)
    if (!doc) return res.status(404).json({ message: 'Document not found' })

    if (doc.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const signature = await Signature.create({
      document: documentId,
      owner: req.user.id,
      x, y, page, width, height
    })

    res.status(201).json({ message: 'Signature saved successfully', signature })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
}

// Get signatures for a document
exports.getSignatures = async (req, res) => {
  try {
    const signatures = await Signature.find({ document: req.params.docId })
    res.status(200).json(signatures)
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
}

// Embed signature image into PDF
// Embed signature image into PDF
exports.embedSignature = async (req, res) => {
  try {
    const { token, signatureImage } = req.body

    const doc = await Document.findOne({ signingToken: token })
    if (!doc) return res.status(404).json({ message: 'Document not found' })

    if (doc.signingTokenExpiry < new Date()) {
      return res.status(400).json({ message: 'Signing link has expired' })
    }

    const signatures = await Signature.find({ document: doc._id })

    console.log('Signatures found:', signatures.length)
    console.log('Signatures:', signatures)

    const pdfPath = path.join(__dirname, '..', 'uploads', doc.filename)
    const pdfBytes = fs.readFileSync(pdfPath)
    const pdfDoc = await PDFDocument.load(pdfBytes)

    const imageData = signatureImage.replace(/^data:image\/png;base64,/, '')
    const imageBytes = Buffer.from(imageData, 'base64')
    const signatureImageEmbed = await pdfDoc.embedPng(imageBytes)

    const pages = pdfDoc.getPages()

    if (signatures.length === 0) {
      // No saved coordinates — embed on first page center
      const firstPage = pages[0]
      const { width, height } = firstPage.getSize()
      firstPage.drawImage(signatureImageEmbed, {
        x: width / 2 - 100,
        y: height / 2 - 30,
        width: 200,
        height: 60
      })
    } else {
      for (const sig of signatures) {
        const pageIndex = (sig.page || 1) - 1
        const page = pages[pageIndex]
        const { height: pageHeight } = page.getSize()

        // PDF y starts from bottom, browser y starts from top
        // Page renders at 700px width in browser
        const scaleX = page.getWidth() / 700
        const scaleY = page.getHeight() / (700 * 1.414)

        const pdfX = sig.x * scaleX
        const pdfY = pageHeight - (sig.y * scaleY) - ((sig.height || 60) * scaleY)

        console.log('Embedding at:', { pdfX, pdfY, pageHeight })

        page.drawImage(signatureImageEmbed, {
          x: pdfX,
          y: pdfY,
          width: (sig.width || 200) * scaleX,
          height: (sig.height || 60) * scaleY
        })
      }
    }

    const signedFilename = `signed-${doc.filename}`
    const signedPath = path.join(__dirname, '..', 'uploads', signedFilename)
    const signedPdfBytes = await pdfDoc.save()
    fs.writeFileSync(signedPath, signedPdfBytes)

    doc.status = 'signed'
    doc.signedFilename = signedFilename
    await doc.save()

    await logAudit(doc._id, 'signed', doc.signerEmail || 'unknown', req)

    res.status(200).json({ 
      message: 'Document signed successfully',
      signedFilename 
    })
  } catch (err) {
    console.error('EMBED ERROR:', err)
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
}