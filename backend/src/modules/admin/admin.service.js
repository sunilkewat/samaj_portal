const prisma = require('../../database/prisma');
const { ApiError } = require('../../utils/apiResponse');

class AdminService {
  /**
   * Executive Dashboard Statistics
   */
  async getDashboardStats() {
    const [
      totalMembers,
      pendingVerifications,
      totalPosts,
      totalMatrimonial,
      totalBloodDonors,
    ] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.user.count({ where: { verificationStatus: 'PENDING', deletedAt: null } }),
      prisma.post.count({ where: { deletedAt: null } }),
      prisma.matrimonialProfile.count({ where: { deletedAt: null } }),
      prisma.bloodDonor.count({ where: { isAvailable: true } }),
    ]);

    return {
      totalMembers,
      pendingVerifications,
      totalPosts,
      totalMatrimonial,
      totalBloodDonors,
    };
  }

  /**
   * Pending member approvals
   */
  async getPendingMembers({ page = 1, limit = 20 }) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const take = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * take;

    const where = {
      verificationStatus: 'PENDING',
      deletedAt: null,
    };

    const [totalCount, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take,
        include: { profile: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      members: users,
      pagination: {
        totalCount,
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  }

  /**
   * Verify or reject member KYC
   */
  async verifyMember(adminUserId, targetUserId, status, actionNote) {
    if (!['VERIFIED', 'REJECTED', 'SUSPENDED'].includes(status)) {
      throw new ApiError(400, 'Invalid status update');
    }

    const updated = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: targetUserId },
        data: { verificationStatus: status },
        include: { profile: true },
      });

      await tx.auditLog.create({
        data: {
          userId: adminUserId,
          action: `MEMBER_${status}`,
          entity: 'users',
          entityId: targetUserId,
          metadata: { note: actionNote || '' },
        },
      });

      return user;
    });

    return updated;
  }

  /**
   * Fetch audit logs
   */
  async getAuditLogs({ page = 1, limit = 50 }) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const take = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * take;

    const [totalCount, logs] = await Promise.all([
      prisma.auditLog.count(),
      prisma.auditLog.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              mobileNumber: true,
              profile: {
                select: { firstName: true, lastName: true },
              },
            },
          },
        },
      }),
    ]);

    return {
      logs,
      pagination: {
        totalCount,
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  }
}

module.exports = new AdminService();
