const bcrypt = require('bcryptjs');
const prisma = require('../../database/prisma');
const { ApiError } = require('../../utils/apiResponse');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../../utils/token.util');
const { generateOtp } = require('../../utils/otp.util');

class AuthService {
  /**
   * Register a new member with password and profile
   */
  async register(data, ip, userAgent) {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { mobileNumber: data.mobileNumber },
          ...(data.email ? [{ email: data.email }] : []),
        ],
      },
    });

    if (existing) {
      if (existing.mobileNumber === data.mobileNumber) {
        throw new ApiError(400, 'Mobile number already registered in Samaj Portal');
      }
      throw new ApiError(400, 'Email address already registered in Samaj Portal');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    // Create User and Profile in a single transactional unit
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          mobileNumber: data.mobileNumber,
          email: data.email || null,
          passwordHash,
          isProfileComplete: true,
          profile: {
            create: {
              firstName: data.firstName,
              lastName: data.lastName,
              gender: data.gender,
              city: data.city,
              state: data.state,
              samajGotra: data.samajGotra || null,
              occupation: data.occupation || null,
              bloodGroup: data.bloodGroup || null,
            },
          },
        },
        include: { profile: true },
      });

      // Audit Log entry
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_REGISTERED',
          entity: 'users',
          entityId: user.id,
          ipAddress: ip,
          userAgent,
        },
      });

      return user;
    });

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    // Store refresh token session (7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.userSession.create({
      data: {
        userId: newUser.id,
        refreshToken,
        ipAddress: ip,
        userAgent,
        expiresAt,
      },
    });

    const { passwordHash: _, ...safeUser } = newUser;
    return { user: safeUser, accessToken, refreshToken };
  }

  /**
   * Authenticate user with Mobile or Email + Password
   */
  async login({ identifier, password, deviceType, fcmToken, deviceModel }, ip, userAgent) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { mobileNumber: identifier },
          { email: identifier },
        ],
      },
      include: {
        profile: true,
        userRoles: {
          include: { role: true },
        },
      },
    });

    if (!user || !user.isActive || user.deletedAt) {
      throw new ApiError(401, 'Invalid mobile number/email or password');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid mobile number/email or password');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Record session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.userSession.create({
      data: {
        userId: user.id,
        refreshToken,
        ipAddress: ip,
        userAgent,
        expiresAt,
      },
    });

    // Update FCM token if provided for mobile/push
    if (fcmToken) {
      await prisma.userDevice.upsert({
        where: { fcmToken },
        update: {
          userId: user.id,
          deviceType: deviceType || 'WEB',
          deviceModel: deviceModel || null,
          lastActiveAt: new Date(),
        },
        create: {
          userId: user.id,
          fcmToken,
          deviceType: deviceType || 'WEB',
          deviceModel: deviceModel || null,
        },
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const { passwordHash: _, ...safeUser } = user;
    return { user: safeUser, accessToken, refreshToken };
  }

  /**
   * Generate and send 6-digit OTP
   */
  async sendOtp(identifier, purpose = 'LOGIN') {
    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins validity

    await prisma.otpVerification.create({
      data: {
        identifier,
        otpCode,
        purpose,
        expiresAt,
      },
    });

    // In production: send via SMS/Email. In dev: logged to console
    console.log(`[OTP Gateway] Sent OTP ${otpCode} to ${identifier} (Purpose: ${purpose})`);

    return {
      identifier,
      purpose,
      message: 'OTP sent successfully. Valid for 5 minutes.',
      ...(process.env.NODE_ENV !== 'production' && { devOtpPreview: otpCode }),
    };
  }

  /**
   * Verify OTP and optionally issue session
   */
  async verifyOtp({ identifier, otpCode, purpose, fcmToken, deviceType }, ip, userAgent) {
    const record = await prisma.otpVerification.findFirst({
      where: {
        identifier,
        otpCode,
        purpose,
        isUsed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      throw new ApiError(400, 'Invalid or expired OTP code');
    }

    // Mark OTP as consumed
    await prisma.otpVerification.update({
      where: { id: record.id },
      data: { isUsed: true },
    });

    // If login purpose, retrieve user and issue tokens
    if (purpose === 'LOGIN') {
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ mobileNumber: identifier }, { email: identifier }],
        },
        include: { profile: true },
      });

      if (!user) {
        throw new ApiError(404, 'No account found with this identifier. Please register first.');
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      return { user, accessToken, refreshToken, verified: true };
    }

    return { verified: true, message: 'OTP verified successfully' };
  }

  /**
   * Refresh Token rotation
   */
  async refreshAccessToken(refreshToken) {
    const decoded = verifyRefreshToken(refreshToken);
    const session = await prisma.userSession.findFirst({
      where: {
        refreshToken,
        userId: decoded.userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: {
          include: { profile: true },
        },
      },
    });

    if (!session || !session.user) {
      throw new ApiError(401, 'Invalid or expired session. Please login again.');
    }

    const newAccessToken = generateAccessToken(session.user);
    const newRefreshToken = generateRefreshToken(session.user);

    // Revoke old session and store new one (Token Rotation)
    await prisma.$transaction([
      prisma.userSession.update({
        where: { id: session.id },
        data: { revokedAt: new Date() },
      }),
      prisma.userSession.create({
        data: {
          userId: session.userId,
          refreshToken: newRefreshToken,
          ipAddress: session.ipAddress,
          userAgent: session.userAgent,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  /**
   * Revoke session on logout
   */
  async logout(refreshToken) {
    if (refreshToken) {
      await prisma.userSession.updateMany({
        where: { refreshToken },
        data: { revokedAt: new Date() },
      });
    }
    return { message: 'Logged out successfully' };
  }

  /**
   * Fetch active logged-in devices
   */
  async getUserDevices(userId) {
    return prisma.userDevice.findMany({
      where: { userId },
      orderBy: { lastActiveAt: 'desc' },
    });
  }

  /**
   * Revoke device
   */
  async revokeDevice(deviceId, userId) {
    await prisma.userDevice.deleteMany({
      where: { id: deviceId, userId },
    });
    return { message: 'Device removed successfully' };
  }
}

module.exports = new AuthService();
