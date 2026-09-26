const express = require('express');
const router = express.Router();
const groupsController = require('./groups.controller');
const { authenticate, optionalAuthenticate } = require('../../middleware/auth.middleware');
const { upload } = require('../../middleware/upload.middleware');

router.get('/', optionalAuthenticate, groupsController.getGroups);
router.post('/', authenticate, groupsController.createGroup);
router.post('/:id/join', authenticate, groupsController.joinGroup);
router.get('/:id/messages', optionalAuthenticate, groupsController.getMessages);
router.post('/:id/messages', authenticate, upload.single('media'), groupsController.sendMessage);

module.exports = router;
