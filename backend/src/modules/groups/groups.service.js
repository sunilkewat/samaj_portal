const prisma = require('../../database/prisma');
const { ApiError } = require('../../utils/apiResponse');
const { uploadToStorage } = require('../../config/firebase');

const isUUID = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

class GroupsService {
  /**
   * Create a community group (e.g. City Chapter, Youth Wing, Elders Committee)
   */
  async createGroup(userId, { name, description, groupType = 'PUBLIC' }) {
    if (!name || !name.trim()) {
      throw new ApiError(400, 'Group name is required');
    }

    return prisma.$transaction(async (tx) => {
      const group = await tx.group.create({
        data: {
          name: name.trim(),
          description,
          groupType,
          createdById: userId,
          members: {
            create: {
              userId,
              role: 'OWNER',
            },
          },
        },
        include: { members: true },
      });

      return group;
    });
  }

  /**
   * List groups
   */
  async getGroups(userId) {
    const groups = await prisma.group.findMany({
      where: { deletedAt: null },
      include: {
        _count: {
          select: { members: true },
        },
        members: {
          where: { userId: userId || '00000000-0000-0000-0000-000000000000' },
          select: { role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return groups.map((g) => {
      const myRole = g.members[0]?.role || null;
      const isCreator = userId && g.createdById === userId;
      return {
        ...g,
        isMember: g.members.length > 0 || isCreator,
        myRole: myRole || (isCreator ? 'OWNER' : null),
        isAdmin: ['OWNER', 'ADMIN'].includes(myRole) || isCreator,
      };
    });
  }

  /**
   * Join public group
   */
  async joinGroup(userId, groupId) {
    if (!isUUID(groupId)) throw new ApiError(400, 'Invalid group ID format');
    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (!group) throw new ApiError(404, 'Group not found');

    return prisma.groupMember.upsert({
      where: {
        groupId_userId: { groupId, userId },
      },
      update: {},
      create: {
        groupId,
        userId,
        role: 'MEMBER',
      },
    });
  }

  /**
   * Get all members and admins of a group
   */
  async getGroupMembers(groupId) {
    if (!isUUID(groupId)) return [];
    const members = await prisma.groupMember.findMany({
      where: { groupId },
      include: {
        user: {
          select: {
            id: true,
            mobileNumber: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                samajGotra: true,
                city: true,
                profilePhoto: true,
              },
            },
          },
        },
      },
      orderBy: [
        { role: 'asc' }, // OWNER, ADMIN, MODERATOR, MEMBER
        { joinedAt: 'asc' },
      ],
    });

    return members.map((m) => ({
      id: m.id,
      userId: m.userId,
      role: m.role,
      isAdmin: ['OWNER', 'ADMIN'].includes(m.role),
      isOwner: m.role === 'OWNER',
      name: m.user?.profile
        ? `${m.user.profile.firstName || ''} ${m.user.profile.lastName || ''}`.trim()
        : 'सदस्य',
      gotra: m.user?.profile?.samajGotra || 'केवट',
      city: m.user?.profile?.city || '',
      photo: m.user?.profile?.profilePhoto || null,
      joinedAt: m.joinedAt,
    }));
  }

  /**
   * Update member role (e.g. promote member to ADMIN or demote to MEMBER)
   * Only group OWNER or ADMIN can perform this action!
   */
  async updateMemberRole(requesterId, groupId, targetUserId, newRole) {
    if (!isUUID(groupId) || !isUUID(targetUserId)) throw new ApiError(400, 'Invalid ID format');
    
    const validRoles = ['OWNER', 'ADMIN', 'MODERATOR', 'MEMBER'];
    if (!validRoles.includes(newRole)) {
      throw new ApiError(400, 'Invalid role. Must be OWNER, ADMIN, MODERATOR, or MEMBER');
    }

    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (!group) throw new ApiError(404, 'Group not found');

    // Requester must be OWNER or ADMIN
    const requester = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: requesterId } },
    });
    const isAuthorized = (requester && ['OWNER', 'ADMIN'].includes(requester.role)) || group.createdById === requesterId;
    if (!isAuthorized) {
      throw new ApiError(403, 'केवल ग्रुप एडमिन ही सदस्य की भूमिका बदल सकते हैं (Only group admins can change roles)');
    }

    const updated = await prisma.groupMember.update({
      where: { groupId_userId: { groupId, userId: targetUserId } },
      data: { role: newRole },
      include: {
        user: {
          select: {
            id: true,
            profile: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });

    return updated;
  }

  /**
   * Add a member to group (Only Group Admins/Owner can add members!)
   */
  async addMember(requesterId, groupId, targetUserId, role = 'MEMBER') {
    if (!isUUID(groupId)) throw new ApiError(400, 'Invalid group ID format');
    const group = await prisma.group.findUnique({ where: { id: groupId } });
    if (!group) throw new ApiError(404, 'Group not found');

    // PERMISSION CHECK: Only OWNER or ADMIN can add members!
    const requesterMembership = await prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId: requesterId } },
    });
    const isGroupAdmin = (requesterMembership && ['OWNER', 'ADMIN'].includes(requesterMembership.role)) || group.createdById === requesterId;
    if (!isGroupAdmin) {
      throw new ApiError(403, 'केवल ग्रुप एडमिन ही इस समूह में नए सदस्य जोड़ सकते हैं (Only Group Admins can add members to this group)');
    }

    if (!isUUID(targetUserId)) {
      return {
        id: `member-${Date.now()}`,
        groupId,
        userId: targetUserId,
        role,
        user: { id: targetUserId, profile: { firstName: 'सदस्य', lastName: '' } },
      };
    }

    const membership = await prisma.groupMember.upsert({
      where: {
        groupId_userId: { groupId, userId: targetUserId },
      },
      update: { role },
      create: {
        groupId,
        userId: targetUserId,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            profile: {
              select: { firstName: true, lastName: true, profilePhoto: true, samajGotra: true },
            },
          },
        },
      },
    });

    return membership;
  }

  /**
   * Post message in group chat
   */
  async sendMessage(userId, groupId, { messageText }, file) {
    if (!isUUID(groupId)) throw new ApiError(400, 'Invalid group ID format');
    let isMember = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: { groupId, userId },
      },
    });

    if (!isMember) {
      // Auto-join public group so members can chat seamlessly
      const group = await prisma.group.findUnique({ where: { id: groupId } });
      if (group && group.groupType === 'PUBLIC') {
        isMember = await prisma.groupMember.create({
          data: { groupId, userId, role: 'MEMBER' },
        });
      } else {
        throw new ApiError(403, 'Must be a group member to send messages');
      }
    }

    let mediaUrl = null;
    let mediaType = null;

    if (file) {
      if (file.mimetype.startsWith('image/')) mediaType = 'IMAGE';
      else if (file.mimetype.startsWith('video/')) mediaType = 'VIDEO';
      else if (file.mimetype.startsWith('audio/')) mediaType = 'AUDIO';
      else mediaType = 'DOCUMENT';

      const safeName = (file.originalname || 'file').replace(/[^a-zA-Z0-9._-]/g, '_');
      const destination = `samaj_chat/${groupId}/${Date.now()}_${safeName}`;
      try {
        mediaUrl = await uploadToStorage(file.buffer, destination, file.mimetype);
      } catch (e) {
        console.warn('Firebase upload error, fallback to URL:', e.message);
        mediaUrl = `https://storage.googleapis.com/livetdsbucket/${destination}`;
      }
    }

    const message = await prisma.groupMessage.create({
      data: {
        groupId,
        senderId: userId,
        messageText: messageText || null,
        mediaUrl,
        mediaType,
      },
      include: {
        sender: {
          select: {
            id: true,
            profile: {
              select: { firstName: true, lastName: true, profilePhoto: true },
            },
          },
        },
      },
    });

    return message;
  }

  /**
   * Get chat history
   */
  async getMessages(groupId, { page = 1, limit = 50 }) {
    if (!isUUID(groupId)) return [];
    const pageNum = Math.max(1, parseInt(page, 10));
    const take = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * take;

    const messages = await prisma.groupMessage.findMany({
      where: { groupId, deletedAt: null },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            profile: {
              select: { firstName: true, lastName: true, profilePhoto: true },
            },
          },
        },
      },
    });

    return messages.reverse();
  }
}

module.exports = new GroupsService();
