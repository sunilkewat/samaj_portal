const authService = require('./auth.service');
const { ApiResponse } = require('../../utils/apiResponse');

class AuthController {
  async register(req, res, next) {
    try {
      const ip = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || 'Unknown';
      const result = await authService.register(req.body, ip, userAgent);
      return res.status(201).json(new ApiResponse(201, result, 'Member registered successfully'));
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      req.body.identifier = req.body.identifier || req.body.mobileNumber;
      const ip = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || 'Unknown';
      const result = await authService.login(req.body, ip, userAgent);
      return res.status(200).json(new ApiResponse(200, result, 'Login successful'));
    } catch (error) {
      next(error);
    }
  }

  async sendOtp(req, res, next) {
    try {
      const { identifier, purpose } = req.body;
      const result = await authService.sendOtp(identifier, purpose);
      return res.status(200).json(new ApiResponse(200, result, 'OTP sent'));
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(req, res, next) {
    try {
      const ip = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || 'Unknown';
      const result = await authService.verifyOtp(req.body, ip, userAgent);
      return res.status(200).json(new ApiResponse(200, result, 'OTP verified'));
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshAccessToken(refreshToken);
      return res.status(200).json(new ApiResponse(200, result, 'Token refreshed'));
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.logout(refreshToken);
      return res.status(200).json(new ApiResponse(200, result, 'Logged out successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getDevices(req, res, next) {
    try {
      const devices = await authService.getUserDevices(req.user.id);
      return res.status(200).json(new ApiResponse(200, devices, 'User devices retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async revokeDevice(req, res, next) {
    try {
      const { deviceId } = req.params;
      const result = await authService.revokeDevice(deviceId, req.user.id);
      return res.status(200).json(new ApiResponse(200, result, 'Device revoked'));
    } catch (error) {
      next(error);
    }
  }

  async me(req, res, next) {
    try {
      const { passwordHash: _, ...safeUser } = req.user;
      return res.status(200).json(new ApiResponse(200, safeUser, 'Current user profile'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
