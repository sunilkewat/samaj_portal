const express = require('express');
const router = express.Router();
const profileController = require('./profile.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { upload } = require('../../middleware/upload.middleware');

// All profile endpoints require authentication
router.use(authenticate);

router.get('/me', profileController.getMyProfile);
router.put('/me', profileController.updateProfile);
router.post('/avatar', upload.single('photo'), profileController.uploadAvatar);
router.post('/cover', upload.single('photo'), profileController.uploadCover);

// Family Members management
router.post('/family', profileController.addFamilyMember);
router.put('/family/:id', profileController.updateFamilyMember);
router.delete('/family/:id', profileController.deleteFamilyMember);

module.exports = router;
