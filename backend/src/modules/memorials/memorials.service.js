const prisma = require('../../database/prisma');
const { ApiError } = require('../../utils/apiResponse');
const { uploadToStorage } = require('../../config/firebase');

class MemorialsService {
  /**
   * Create obituary / memorial announcement
   */
  async createMemorial(userId, data, files = []) {
    if (!data.fullName || !data.dateOfDeath) {
      throw new ApiError(400, 'Full name and date of death are required');
    }

    const photoPayload = [];
    for (const file of files) {
      const destination = `samaj_memorials/${Date.now()}_${file.originalname}`;
      let photoUrl = '';
      try {
        photoUrl = await uploadToStorage(file.buffer, destination, file.mimetype);
      } catch (e) {
        photoUrl = `https://storage.googleapis.com/livetdsbucket/${destination}`;
      }
      photoPayload.push({ photoUrl, caption: data.caption || null });
    }

    const memorial = await prisma.memorial.create({
      data: {
        createdById: userId,
        fullName: data.fullName,
        gender: data.gender || 'MALE',
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        dateOfDeath: new Date(data.dateOfDeath),
        nativeVillage: data.nativeVillage || null,
        biography: data.biography || null,
        familyDetails: data.familyDetails || null,
        isApproved: true, // or require admin approval
        photos: {
          create: photoPayload,
        },
      },
      include: {
        photos: true,
        createdBy: {
          select: {
            profile: {
              select: { firstName: true, lastName: true },
            },
          },
        },
      },
    });

    return memorial;
  }

  /**
   * List memorials
   */
  async getMemorials({ page = 1, limit = 20 }) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const take = Math.min(30, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * take;

    const where = {
      isApproved: true,
      deletedAt: null,
    };

    const [totalCount, memorials] = await Promise.all([
      prisma.memorial.count({ where }),
      prisma.memorial.findMany({
        where,
        skip,
        take,
        orderBy: { dateOfDeath: 'desc' },
        include: {
          photos: true,
          _count: {
            select: { tributes: true },
          },
        },
      }),
    ]);

    return {
      memorials,
      pagination: {
        totalCount,
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  }

  /**
   * Add tribute / light candle (दीप प्रज्ज्वलन)
   */
  async addTribute(userId, memorialId, { message, isCandleLit = true }) {
    if (!message || !message.trim()) {
      throw new ApiError(400, 'Condolence message cannot be empty');
    }

    return prisma.memorialTribute.create({
      data: {
        memorialId,
        userId,
        message: message.trim(),
        isCandleLit: Boolean(isCandleLit),
      },
      include: {
        user: {
          select: {
            profile: {
              select: { firstName: true, lastName: true, city: true },
            },
          },
        },
      },
    });
  }
}

module.exports = new MemorialsService();
