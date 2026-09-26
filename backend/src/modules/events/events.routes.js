const express = require('express');
const router = express.Router();
const eventsController = require('./events.controller');
const { authenticate } = require('../../middleware/auth.middleware');

router.use(authenticate);

router.get('/', eventsController.getEvents);
router.post('/', eventsController.createEvent);
router.post('/:id/rsvp', eventsController.rsvp);

module.exports = router;
