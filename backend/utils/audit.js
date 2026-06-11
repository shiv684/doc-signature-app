const Audit = require('../models/Audit.model')

const logAudit = async (docId, action, performedBy, req) => {
  try {
    await Audit.create({
      document: docId,
      action,
      performedBy,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    })
  } catch (err) {
    console.error('Audit log failed:', err.message)
  }
}

module.exports = logAudit