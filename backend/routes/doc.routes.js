const express = require('express')
const router = express.Router()
const { uploadDoc, getDocuments } = require('../controllers/doc.controller')
const authMiddleware = require('../middleware/auth.middleware')
const upload = require('../config/multer')

router.post('/upload', authMiddleware, upload.single('pdf'), uploadDoc)
router.get('/', authMiddleware, getDocuments)

module.exports = router