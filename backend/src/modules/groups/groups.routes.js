const express = require('express');
const router = express.Router();
const groupsController = require('./groups.controller');
const { authenticate, optionalAuthenticate } = require('../../middleware/auth.middleware');
const { upload } = require('../../middleware/upload.middleware');

router.get('/', optionalAuthenticate, groupsController.getGroups);
router.post('/', authenticate, groupsController.createGroup);
router.post('/:id/join', authenticate, groupsController.joinGroup);
router.get('/:id/members', authenticate, groupsController.getGroupMembers);
router.post('/:id/members', authenticate, groupsController.addMember);
router.delete('/:id/members/:userId', authenticate, groupsController.removeMember);
router.patch('/:id/members/:userId/role', authenticate, groupsController.updateMemberRole);
router.get('/:id/messages', authenticate, groupsController.getMessages);
router.post('/:id/messages', authenticate, upload.single('media'), groupsController.sendMessage);

module.exports = router;
