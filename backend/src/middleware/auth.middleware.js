const { verifyAccessToken } = require('../utils/token.util');
const { ApiError } = require('../utils/apiResponse');
const prisma = require('../database/prisma');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication token is required');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        profile: true,
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user || !user.isActive || user.deletedAt) {
      throw new ApiError(401, 'User account is inactive or not found');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Token expired. Please refresh your session.',
        code: 'TOKEN_EXPIRED',
      });
    }
    return res.status(401).json({
      status: 'fail',
      message: error.message || 'Invalid authentication token',
    });
  }
};

const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyAccessToken(token);
      if (decoded && decoded.userId) {
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
          include: {
            profile: true,
            userRoles: {
              include: {
                role: true,
              },
            },
          },
        });
        if (user && user.isActive && !user.deletedAt) {
          req.user = user;
        }
      }
    }
  } catch (error) {
    // Gracefully ignore token errors for optional authentication
  }
  next();
};

module.exports = { authenticate, optionalAuthenticate };
