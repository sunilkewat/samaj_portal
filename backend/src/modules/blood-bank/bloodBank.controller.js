const bloodBankService = require('./bloodBank.service');
const { ApiResponse } = require('../../utils/apiResponse');

class BloodBankController {
  async registerDonor(req, res, next) {
    try {
      const donor = await bloodBankService.registerDonor(req.user.id, req.body);
      return res.status(200).json(new ApiResponse(200, donor, 'Donor registered successfully'));
    } catch (error) {
      next(error);
    }
  }

  async searchDonors(req, res, next) {
    try {
      const donors = await bloodBankService.searchDonors(req.query);
      return res.status(200).json(new ApiResponse(200, donors, 'Donors retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async createSosRequest(req, res, next) {
    try {
      const result = await bloodBankService.createSosRequest(req.user.id, req.body);
      return res.status(201).json(new ApiResponse(201, result, 'Emergency SOS sent to community donors'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BloodBankController();
