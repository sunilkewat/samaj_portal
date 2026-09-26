const adminService = require('./admin.service');
const { ApiResponse } = require('../../utils/apiResponse');

class AdminController {
  async getDashboard(req, res, next) {
    try {
      const stats = await adminService.getDashboardStats();
      return res.status(200).json(new ApiResponse(200, stats, 'Admin dashboard stats retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async getPendingMembers(req, res, next) {
    try {
      const result = await adminService.getPendingMembers(req.query);
      return res.status(200).json(new ApiResponse(200, result, 'Pending members retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async verifyMember(req, res, next) {
    try {
      const { id } = req.params;
      const { status, note } = req.body;
      const user = await adminService.verifyMember(req.user.id, id, status, note);
      return res.status(200).json(new ApiResponse(200, user, `Member status changed to ${status}`));
    } catch (error) {
      next(error);
    }
  }

  async getAuditLogs(req, res, next) {
    try {
      const logs = await adminService.getAuditLogs(req.query);
      return res.status(200).json(new ApiResponse(200, logs, 'Audit logs retrieved'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
