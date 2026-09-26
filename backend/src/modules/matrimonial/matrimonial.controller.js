const matrimonialService = require('./matrimonial.service');
const { ApiResponse } = require('../../utils/apiResponse');

class MatrimonialController {
  async upsertProfile(req, res, next) {
    try {
      const profile = await matrimonialService.upsertProfile(req.user.id, req.body);
      return res.status(200).json(new ApiResponse(200, profile, 'Matrimonial profile saved'));
    } catch (error) {
      next(error);
    }
  }

  async searchProfiles(req, res, next) {
    try {
      const result = await matrimonialService.searchProfiles(req.user.id, req.query);
      return res.status(200).json(new ApiResponse(200, result, 'Profiles retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async uploadPhoto(req, res, next) {
    try {
      const isPrimary = req.body.isPrimary === 'true' || req.body.isPrimary === true;
      const photo = await matrimonialService.uploadPhoto(req.user.id, req.file, isPrimary);
      return res.status(201).json(new ApiResponse(201, photo, 'Photo uploaded'));
    } catch (error) {
      next(error);
    }
  }

  async sendInterest(req, res, next) {
    try {
      const { receiverId, message } = req.body;
      const interest = await matrimonialService.sendInterest(req.user.id, receiverId, message);
      return res.status(200).json(new ApiResponse(200, interest, 'Interest sent successfully'));
    } catch (error) {
      next(error);
    }
  }

  async respondInterest(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const result = await matrimonialService.respondInterest(req.user.id, id, status);
      return res.status(200).json(new ApiResponse(200, result, `Interest ${status.toLowerCase()}`));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MatrimonialController();
