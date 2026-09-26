const express = require('express');
const router = express.Router();
const postsController = require('./posts.controller');
const { authenticate, optionalAuthenticate } = require('../../middleware/auth.middleware');
const { upload } = require('../../middleware/upload.middleware');

// Public feed with optional auth (so guests can read, and logged-in users see like state)
router.get('/', optionalAuthenticate, postsController.getFeed);

// Protected routes (Login required)
router.post('/', authenticate, upload.array('media', 10), postsController.createPost);
router.post('/:id/like', authenticate, postsController.toggleLike);
router.post('/:id/comments', authenticate, postsController.addComment);
router.post('/:id/share', authenticate, postsController.trackShare);

module.exports = router;
