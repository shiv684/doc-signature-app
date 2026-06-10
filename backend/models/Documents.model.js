const mongoose = require('mongoose')

const documentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  filepath: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['pending', 'signed', 'rejected'], 
    default: 'pending' 
  },
  signerEmail: { type: String },
  signingToken: { type: String },
  signingTokenExpiry: { type: Date }
}, { timestamps: true })

module.exports = mongoose.model('Document', documentSchema)