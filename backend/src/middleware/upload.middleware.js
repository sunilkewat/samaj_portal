const multer = require('multer');
const { ApiError } = require('../utils/apiResponse');

// Memory storage for direct Firebase Storage stream/buffer upload
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    // Images
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg',
    'image/gif',
    // Videos
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'video/x-msvideo',
    'video/mkv',
    'video/3gpp',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    // Audio
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/mp3',
  ];

  if (
    allowedMimeTypes.includes(file.mimetype) ||
    file.mimetype.startsWith('image/') ||
    file.mimetype.startsWith('video/') ||
    file.mimetype.startsWith('audio/')
  ) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Invalid file format. Only Images, Videos, PDFs, and Audio files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB max size
  },
  fileFilter,
});

module.exports = { upload };
