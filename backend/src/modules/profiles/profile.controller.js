const profileService = require('./profile.service');
const { ApiResponse } = require('../../utils/apiResponse');

class ProfileController {
  async getMyProfile(req, res, next) {
    try {
      const profile = await profileService.getMyProfile(req.user.id);
      return res.status(200).json(new ApiResponse(200, profile, 'User profile retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const updated = await profileService.updateProfile(req.user.id, req.body);
      return res.status(200).json(new ApiResponse(200, updated, 'Profile updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async uploadAvatar(req, res, next) {
    try {
      const result = await profileService.uploadAvatar(req.user.id, req.file);
      return res.status(200).json(new ApiResponse(200, result, 'Profile photo uploaded'));
    } catch (error) {
      next(error);
    }
  }

  async uploadCover(req, res, next) {
    try {
      const result = await profileService.uploadCover(req.user.id, req.file);
      return res.status(200).json(new ApiResponse(200, result, 'Cover photo uploaded'));
    } catch (error) {
      next(error);
    }
  }

  async addFamilyMember(req, res, next) {
    try {
      const member = await profileService.addFamilyMember(req.user.id, req.body);
      return res.status(201).json(new ApiResponse(201, member, 'Family member added'));
    } catch (error) {
      next(error);
    }
  }

  async updateFamilyMember(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await profileService.updateFamilyMember(req.user.id, id, req.body);
      return res.status(200).json(new ApiResponse(200, updated, 'Family member updated'));
    } catch (error) {
      next(error);
    }
  }

  async deleteFamilyMember(req, res, next) {
    try {
      const { id } = req.params;
      const result = await profileService.deleteFamilyMember(req.user.id, id);
      return res.status(200).json(new ApiResponse(200, result, 'Family member deleted'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProfileController();
