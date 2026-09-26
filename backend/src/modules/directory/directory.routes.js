const express = require('express');
const router = express.Router();
const directoryController = require('./directory.controller');
const { authenticate } = require('../../middleware/auth.middleware');

router.use(authenticate);

router.get('/', directoryController.searchMembers);
router.get('/stats', directoryController.getStats);
router.get('/:id', directoryController.getMemberById);

module.exports = router;
