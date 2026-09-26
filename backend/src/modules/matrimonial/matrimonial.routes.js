const express = require('express');
const router = express.Router();
const matrimonialController = require('./matrimonial.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { upload } = require('../../middleware/upload.middleware');

router.use(authenticate);

router.post('/profile', matrimonialController.upsertProfile);
router.get('/profiles', matrimonialController.searchProfiles);
router.post('/photos', upload.single('photo'), matrimonialController.uploadPhoto);
router.post('/interests', matrimonialController.sendInterest);
router.put('/interests/:id', matrimonialController.respondInterest);

module.exports = router;
