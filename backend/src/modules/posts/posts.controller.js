const postsService = require('./posts.service');
const { ApiResponse } = require('../../utils/apiResponse');

class PostsController {
  async createPost(req, res, next) {
    try {
      const files = req.files || [];
      const post = await postsService.createPost(req.user.id, req.body, files);
      return res.status(201).json(new ApiResponse(201, post, 'Post created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getFeed(req, res, next) {
    try {
      const result = await postsService.getFeed(req.user.id, req.query);
      return res.status(200).json(new ApiResponse(200, result, 'Feed retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async toggleLike(req, res, next) {
    try {
      const { id } = req.params;
      const result = await postsService.toggleLike(req.user.id, id);
      return res.status(200).json(new ApiResponse(200, result, result.liked ? 'Post liked' : 'Post unliked'));
    } catch (error) {
      next(error);
    }
  }

  async addComment(req, res, next) {
    try {
      const { id } = req.params;
      const comment = await postsService.addComment(req.user.id, id, req.body);
      return res.status(201).json(new ApiResponse(201, comment, 'Comment added'));
    } catch (error) {
      next(error);
    }
  }

  async trackShare(req, res, next) {
    try {
      const { id } = req.params;
      const { channel } = req.body;
      const result = await postsService.trackShare(req.user.id, id, channel);
      return res.status(200).json(new ApiResponse(200, result, 'Share tracked'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PostsController();
