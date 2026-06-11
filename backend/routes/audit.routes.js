const express = require('express')
const router = express.Router()
const { getAuditLogs } = require('../controllers/audit.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.get('/:docId', authMiddleware, getAuditLogs)

module.exports = router