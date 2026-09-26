const express = require('express');
const router = express.Router();
const bloodBankController = require('./bloodBank.controller');
const { authenticate } = require('../../middleware/auth.middleware');

router.use(authenticate);

router.get('/donors', bloodBankController.searchDonors);
router.post('/register-donor', bloodBankController.registerDonor);
router.post('/sos-request', bloodBankController.createSosRequest);

module.exports = router;
