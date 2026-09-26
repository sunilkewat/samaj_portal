const memorialsService = require('./memorials.service');
const { ApiResponse } = require('../../utils/apiResponse');

class MemorialsController {
  async createMemorial(req, res, next) {
    try {
      const files = req.files || [];
      const memorial = await memorialsService.createMemorial(req.user.id, req.body, files);
      return res.status(201).json(new ApiResponse(201, memorial, 'Memorial created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getMemorials(req, res, next) {
    try {
      const result = await memorialsService.getMemorials(req.query);
      return res.status(200).json(new ApiResponse(200, result, 'Memorials retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async addTribute(req, res, next) {
    try {
      const { id } = req.params;
      const tribute = await memorialsService.addTribute(req.user.id, id, req.body);
      return res.status(201).json(new ApiResponse(201, tribute, 'Tribute submitted'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MemorialsController();
