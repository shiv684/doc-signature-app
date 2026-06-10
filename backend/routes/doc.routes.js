const express = require('express')
const router = express.Router()
const { 
  uploadDoc, 
  getDocuments, 
  generateSigningLink,
  getDocByToken,
  updateDocStatus
} = require('../controllers/doc.controller')
const authMiddleware = require('../middleware/auth.middleware')
const upload = require('../config/multer')

// Protected routes
router.post('/upload', authMiddleware, upload.single('pdf'), uploadDoc)
router.get('/', authMiddleware, getDocuments)
router.post('/generate-link', authMiddleware, generateSigningLink)

// Public routes — no auth needed
router.get('/sign/:token', getDocByToken)
router.post('/update-status', updateDocStatus)

module.exports = router