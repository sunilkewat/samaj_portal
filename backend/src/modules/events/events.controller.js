const eventsService = require('./events.service');
const { ApiResponse } = require('../../utils/apiResponse');

class EventsController {
  async createEvent(req, res, next) {
    try {
      const event = await eventsService.createEvent(req.body);
      return res.status(201).json(new ApiResponse(201, event, 'Event created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getEvents(req, res, next) {
    try {
      const result = await eventsService.getEvents(req.query);
      return res.status(200).json(new ApiResponse(200, result, 'Events retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async rsvp(req, res, next) {
    try {
      const { id } = req.params;
      const reg = await eventsService.rsvp(req.user.id, id, req.body);
      return res.status(200).json(new ApiResponse(200, reg, 'RSVP recorded'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EventsController();
