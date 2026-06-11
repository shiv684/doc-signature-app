const Audit = require('../models/Audit.model')

// Get audit logs for a document
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await Audit.find({ document: req.params.docId })
      .sort({ createdAt: -1 })

    res.status(200).json(logs)
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message })
  }
}