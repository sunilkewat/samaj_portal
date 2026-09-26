const directoryService = require('./directory.service');
const { ApiResponse } = require('../../utils/apiResponse');

class DirectoryController {
  async searchMembers(req, res, next) {
    try {
      const result = await directoryService.searchMembers(req.query);
      return res.status(200).json(new ApiResponse(200, result, 'Members retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async getMemberById(req, res, next) {
    try {
      const { id } = req.params;
      const member = await directoryService.getMemberById(id);
      return res.status(200).json(new ApiResponse(200, member, 'Member details retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async getStats(req, res, next) {
    try {
      const stats = await directoryService.getDirectoryStats();
      return res.status(200).json(new ApiResponse(200, stats, 'Directory stats retrieved'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DirectoryController();
