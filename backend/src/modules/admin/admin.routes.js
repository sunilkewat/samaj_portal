const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const { authenticate } = require('../../middleware/auth.middleware');

router.use(authenticate);

router.get('/dashboard', adminController.getDashboard);
router.get('/members/pending', adminController.getPendingMembers);
router.put('/members/:id/verify', adminController.verifyMember);
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;
