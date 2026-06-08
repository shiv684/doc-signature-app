const Document = require('../models/Documents.model')

// PDF upload
exports.uploadDoc = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'file not received' })

    const doc = await Document.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      filepath: req.file.path,
      owner: req.user.id
    })

    res.status(201).json({ message: 'File upload successfullly', doc })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// Saare documents lao
exports.getDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ owner: req.user.id }).sort({ createdAt: -1 })
    res.status(200).json(docs)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}