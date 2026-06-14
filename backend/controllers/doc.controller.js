const Document = require('../models/Documents.model')
const Signature = require('../models/Signature.model')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const logAudit = require('../utils/audit')

// Upload PDF
exports.uploadDoc = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file received' })

    const doc = await Document.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      filepath: req.file.path,
      owner: req.user.id
    })

    res.status(201).json({ message: 'File uploaded successfully', doc })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
}

// Get all documents
exports.getDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ owner: req.user.id }).sort({ createdAt: -1 })
    res.status(200).json(docs)
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
}

// Generate signing link
exports.generateSigningLink = async (req, res) => {
  try {
    const { docId, signerEmail } = req.body

    const doc = await Document.findById(docId)
    if (!doc) return res.status(404).json({ message: 'Document not found' })

    if (doc.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiry = new Date()
    expiry.setDate(expiry.getDate() + 7)

    doc.signerEmail = signerEmail
    doc.signingToken = token
    doc.signingTokenExpiry = expiry
    await doc.save()

    // Audit log
    await logAudit(docId, 'link_generated', req.user.id, req)

    const signingLink = `http://localhost:5173/sign-request/${token}`
    res.status(200).json({ message: 'Signing link generated successfully', signingLink })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
}

// Get document by signing token
exports.getDocByToken = async (req, res) => {
  try {
    const doc = await Document.findOne({ signingToken: req.params.token })
    if (!doc) return res.status(404).json({ message: 'Invalid or expired link' })

    if (doc.signingTokenExpiry < new Date()) {
      return res.status(400).json({ message: 'Signing link has expired' })
    }

    // Audit log — document viewed
    await logAudit(doc._id, 'viewed', doc.signerEmail || 'unknown', req)

    res.status(200).json(doc)
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
}

// Accept or reject document
exports.updateDocStatus = async (req, res) => {
  try {
    const { token, status } = req.body

    if (!['signed', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const doc = await Document.findOne({ signingToken: token })
    if (!doc) return res.status(404).json({ message: 'Document not found' })

    if (doc.signingTokenExpiry < new Date()) {
      return res.status(400).json({ message: 'Signing link has expired' })
    }

    doc.status = status
    await doc.save()

    // Audit log — signed or rejected
    await logAudit(doc._id, status, doc.signerEmail || 'unknown', req)

    res.status(200).json({ message: `Document ${status} successfully`, doc })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
}

// Delete document
exports.deleteDoc = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id)
    if (!doc) return res.status(404).json({ message: 'Document not found' })

    if (doc.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    // Delete original file
    const filePath = path.join(__dirname, '..', 'uploads', doc.filename)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

    // Delete signed file if exists
    if (doc.signedFilename) {
      const signedPath = path.join(__dirname, '..', 'uploads', doc.signedFilename)
      if (fs.existsSync(signedPath)) fs.unlinkSync(signedPath)
    }

    // Delete signatures from DB
    await Signature.deleteMany({ document: doc._id })

    // Delete document from DB
    await Document.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: 'Document deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
}