const Signature = require('../models/Signature.model')
const Document = require('../models/Documents.model')
const { PDFDocument } = require('pdf-lib')
const fs = require('fs')
const path = require('path')
const logAudit = require('../utils/audit')

// Save signature coordinates
exports.saveSignature = async (req, res) => {
  try {
    const { documentId, x, y, page, width, height, signingToken } = req.body

    const doc = await Document.findById(documentId)
    if (!doc) return res.status(404).json({ message: 'Document not found' })

    if (doc.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const signature = await Signature.create({
      document: documentId,
      owner: req.user.id,
      signingToken: signingToken || null,
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
exports.embedSignature = async (req, res) => {
  try {
    const { token, signatureImage } = req.body

    const doc = await Document.findOne({ signingToken: token })
    if (!doc) return res.status(404).json({ message: 'Document not found' })

    if (doc.signingTokenExpiry < new Date()) {
      return res.status(400).json({ message: 'Signing link has expired' })
    }

    // Only get signatures for this token
    const signatures = await Signature.find({ 
      document: doc._id,
      signingToken: token
    })

    console.log('Signatures for this token:', signatures.length)

    // Load existing signed PDF if available — else load original
    const pdfFilename = doc.signedFilename || doc.filename
    const pdfPath = path.join(__dirname, '..', 'uploads', pdfFilename)
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
  const { width: pageWidth, height: pageHeight } = page.getSize()

  // Direct ratio — no complex scaling
  const scaleX = pageWidth / 700
  const scaleY = scaleX  // same scale for both axes

  const pdfX = sig.x * scaleX
  const pdfY = pageHeight - (sig.y * scaleX) - (60 * scaleX)

  page.drawImage(signatureImageEmbed, {
    x: Math.max(0, pdfX),
    y: Math.max(0, pdfY),
    width: 150 * scaleX,
    height: 50 * scaleX
  })
}
    }

    // Same filename — overwrite signed PDF to keep all signatures
    const signedFilename = doc.signedFilename || `signed-${doc.filename}`
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