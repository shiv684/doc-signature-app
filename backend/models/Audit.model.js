const mongoose = require('mongoose')

const auditSchema = new mongoose.Schema({
  document: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Document', 
    required: true 
  },
  action: { 
    type: String, 
    enum: ['viewed', 'signed', 'rejected', 'link_generated'],
    required: true 
  },
  performedBy: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String }
}, { timestamps: true })

module.exports = mongoose.model('Audit', auditSchema)