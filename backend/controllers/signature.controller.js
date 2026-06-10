const Signature = require('../models/Signature.model')
const Document = require('../models/Documents.model')

// Save signature coordinates
exports.saveSignature = async (req, res) => {
  try {
    const { documentId, x, y, page, width, height } = req.body

    // Check if document exists
    const doc = await Document.findById(documentId)
    if (!doc) return res.status(404).json({ message: 'Document not found' })

    // Check if owner
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