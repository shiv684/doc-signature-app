const mongoose = require('mongoose')

const signatureSchema = new mongoose.Schema({
  document: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Document', 
    required: true 
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  page: { type: Number, default: 1 },
  width: { type: Number, default: 200 },
  height: { type: Number, default: 60 }
}, { timestamps: true })

module.exports = mongoose.model('Signature', signatureSchema)