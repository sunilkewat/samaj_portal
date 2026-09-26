const express = require('express');
const router = express.Router();
const memorialsController = require('./memorials.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { upload } = require('../../middleware/upload.middleware');

router.use(authenticate);

router.get('/', memorialsController.getMemorials);
router.post('/', upload.array('photos', 5), memorialsController.createMemorial);
router.post('/:id/tribute', memorialsController.addTribute);

module.exports = router;
