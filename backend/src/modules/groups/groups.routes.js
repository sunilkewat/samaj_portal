const express = require('express');
const router = express.Router();
const groupsController = require('./groups.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { upload } = require('../../middleware/upload.middleware');

router.use(authenticate);

router.get('/', groupsController.getGroups);
router.post('/', groupsController.createGroup);
router.post('/:id/join', groupsController.joinGroup);
router.get('/:id/messages', groupsController.getMessages);
router.post('/:id/messages', upload.single('media'), groupsController.sendMessage);

module.exports = router;
