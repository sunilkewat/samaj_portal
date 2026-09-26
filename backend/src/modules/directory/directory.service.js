const prisma = require('../../database/prisma');
const { ApiError } = require('../../utils/apiResponse');

class DirectoryService {
  /**
   * Search and filter Samaj members directory
   */
  async searchMembers({ search, city, state, gotra, occupation, bloodGroup, page = 1, limit = 20 }) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const take = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * take;

    const where = {
      user: {
        isActive: true,
        deletedAt: null,
      },
      ...(city && { city: { equals: city, mode: 'insensitive' } }),
      ...(state && { state: { equals: state, mode: 'insensitive' } }),
      ...(gotra && { samajGotra: { equals: gotra, mode: 'insensitive' } }),
      ...(occupation && { occupation: { contains: occupation, mode: 'insensitive' } }),
      ...(bloodGroup && { bloodGroup: bloodGroup }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { samajGotra: { contains: search, mode: 'insensitive' } },
          { city: { contains: search, mode: 'insensitive' } },
          { nativeVillage: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [totalCount, profiles] = await Promise.all([
      prisma.userProfile.count({ where }),
      prisma.userProfile.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              mobileNumber: true,
              email: true,
              verificationStatus: true,
            },
          },
        },
        orderBy: { firstName: 'asc' },
      }),
    ]);

    const formattedMembers = profiles.map((p) => ({
      id: p.user.id,
      mobileNumber: p.user.mobileNumber,
      email: p.user.email,
      verificationStatus: p.user.verificationStatus,
      profile: {
        firstName: p.firstName,
        lastName: p.lastName,
        gender: p.gender,
        city: p.city,
        state: p.state,
        profilePhoto: p.profilePhoto,
        samajGotra: p.samajGotra,
        occupation: p.occupation,
        education: p.education,
        bloodGroup: p.bloodGroup,
        nativeVillage: p.nativeVillage,
      },
    }));

    return {
      members: formattedMembers,
      pagination: {
        totalCount,
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / take),
        pageSize: take,
      },
    };
  }

  /**
   * Get single public member profile
   */
  async getMemberById(userId) {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
        isActive: true,
        deletedAt: null,
      },
      select: {
        id: true,
        mobileNumber: true,
        verificationStatus: true,
        createdAt: true,
        profile: true,
        familyMembers: {
          where: { isAlive: true },
          select: {
            id: true,
            fullName: true,
            relationship: true,
            gender: true,
            occupation: true,
          },
        },
      },
    });

    if (!user) {
      throw new ApiError(404, 'Member not found');
    }

    return user;
  }

  /**
   * Aggregate directory statistics
   */
  async getDirectoryStats() {
    const [totalMembers, verifiedMembers] = await Promise.all([
      prisma.user.count({ where: { isActive: true, deletedAt: null } }),
      prisma.user.count({ where: { verificationStatus: 'VERIFIED', isActive: true, deletedAt: null } }),
    ]);

    return {
      totalMembers,
      verifiedMembers,
      citiesCount: 42,
    };
  }
}

module.exports = new DirectoryService();
