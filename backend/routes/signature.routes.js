const express = require('express')
const router = express.Router()
const { saveSignature, getSignatures } = require('../controllers/signature.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/', authMiddleware, saveSignature)
router.get('/:docId', authMiddleware, getSignatures)

module.exports = router