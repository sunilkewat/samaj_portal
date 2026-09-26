const express = require('express');
const router = express.Router();
const postsController = require('./posts.controller');
const { authenticate } = require('../../middleware/auth.middleware');
const { upload } = require('../../middleware/upload.middleware');

router.use(authenticate);

router.get('/', postsController.getFeed);
router.post('/', upload.array('media', 5), postsController.createPost);
router.post('/:id/like', postsController.toggleLike);
router.post('/:id/comments', postsController.addComment);
router.post('/:id/share', postsController.trackShare);

module.exports = router;
