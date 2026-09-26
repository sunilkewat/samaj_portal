const prisma = require('../../database/prisma');
const { ApiError } = require('../../utils/apiResponse');
const { uploadToStorage } = require('../../config/firebase');

class MatrimonialService {
  /**
   * Create or update user's matrimonial biodata
   */
  async upsertProfile(userId, data) {
    const existing = await prisma.matrimonialProfile.findUnique({
      where: { userId },
    });

    const payload = {
      gender: data.gender,
      dob: new Date(data.dob),
      heightCm: data.heightCm ? parseInt(data.heightCm, 10) : null,
      maritalStatus: data.maritalStatus || 'NEVER_MARRIED',
      gotraSelf: data.gotraSelf,
      gotraMother: data.gotraMother || null,
      highestDegree: data.highestDegree,
      employedIn: data.employedIn || null,
      occupationTitle: data.occupationTitle || null,
      annualIncome: data.annualIncome || null,
      workCity: data.workCity || null,
      workState: data.workState || null,
      workCountry: data.workCountry || 'India',
      diet: data.diet || null,
      aboutCandidate: data.aboutCandidate || null,
      partnerPref: data.partnerPref || null,
      horoscopeUrl: data.horoscopeUrl || null,
      isPhotoBlurred: Boolean(data.isPhotoBlurred),
    };

    if (existing) {
      return prisma.matrimonialProfile.update({
        where: { id: existing.id },
        data: payload,
        include: { photos: true },
      });
    }

    return prisma.matrimonialProfile.create({
      data: {
        userId,
        ...payload,
      },
      include: { photos: true },
    });
  }

  /**
   * Search matrimonial profiles with community filters
   */
  async searchProfiles(currentUserId, { gender, minAge, maxAge, gotra, city, maritalStatus, page = 1, limit = 20 }) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const take = Math.min(30, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * take;

    const now = new Date();
    let maxDob = undefined;
    let minDob = undefined;

    if (minAge) {
      maxDob = new Date(now.getFullYear() - parseInt(minAge, 10), now.getMonth(), now.getDate());
    }
    if (maxAge) {
      minDob = new Date(now.getFullYear() - parseInt(maxAge, 10) - 1, now.getMonth(), now.getDate());
    }

    const where = {
      isActive: true,
      deletedAt: null,
      userId: { not: currentUserId }, // Exclude self
      ...(gender && { gender }),
      ...(gotra && { gotraSelf: { not: gotra } }), // Hindu gotra exclusion principle
      ...(city && { workCity: { equals: city, mode: 'insensitive' } }),
      ...(maritalStatus && { maritalStatus }),
      ...(minDob || maxDob ? {
        dob: {
          ...(minDob && { gte: minDob }),
          ...(maxDob && { lte: maxDob }),
        },
      } : {}),
    };

    const [totalCount, profiles] = await Promise.all([
      prisma.matrimonialProfile.count({ where }),
      prisma.matrimonialProfile.findMany({
        where,
        skip,
        take,
        include: {
          photos: {
            where: { isPrimary: true },
            take: 1,
          },
          user: {
            select: {
              profile: {
                select: { firstName: true, lastName: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      profiles,
      pagination: {
        totalCount,
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  }

  /**
   * Upload Matrimonial Photo to Firebase Storage (livetdsbucket)
   */
  async uploadPhoto(userId, file, isPrimary = false) {
    if (!file) throw new ApiError(400, 'Image file is required');

    const profile = await prisma.matrimonialProfile.findUnique({ where: { userId } });
    if (!profile) throw new ApiError(404, 'Please create a matrimonial profile first');

    const destination = `samaj_matrimonial/${userId}/photo_${Date.now()}_${file.originalname}`;
    let photoUrl = '';
    try {
      photoUrl = await uploadToStorage(file.buffer, destination, file.mimetype);
    } catch (e) {
      photoUrl = `https://storage.googleapis.com/livetdsbucket/${destination}`;
    }

    if (isPrimary) {
      await prisma.matrimonialPhoto.updateMany({
        where: { profileId: profile.id },
        data: { isPrimary: false },
      });
    }

    return prisma.matrimonialPhoto.create({
      data: {
        profileId: profile.id,
        photoUrl,
        isPrimary: Boolean(isPrimary),
      },
    });
  }

  /**
   * Send Interest Proposal
   */
  async sendInterest(senderId, receiverId, message) {
    if (senderId === receiverId) {
      throw new ApiError(400, 'Cannot send interest to yourself');
    }

    return prisma.matrimonialInterest.upsert({
      where: {
        senderId_receiverId: { senderId, receiverId },
      },
      update: {
        status: 'PENDING',
        message,
      },
      create: {
        senderId,
        receiverId,
        message,
      },
    });
  }

  /**
   * Respond to Interest (Accept / Reject)
   */
  async respondInterest(receiverId, interestId, status) {
    const interest = await prisma.matrimonialInterest.findFirst({
      where: { id: interestId, receiverId },
    });

    if (!interest) {
      throw new ApiError(404, 'Interest proposal not found');
    }

    return prisma.matrimonialInterest.update({
      where: { id: interestId },
      data: { status },
    });
  }
}

module.exports = new MatrimonialService();
