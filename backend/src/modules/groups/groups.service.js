const prisma = require('../../database/prisma');
const { ApiError } = require('../../utils/apiResponse');
const { uploadToStorage } = require('../../config/firebase');

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
          where: { userId },
          select: { role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return groups.map((g) => ({
      ...g,
      isMember: g.members.length > 0,
      myRole: g.members[0]?.role || null,
    }));
  }

  /**
   * Join public group
   */
  async joinGroup(userId, groupId) {
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
   * Post message in group chat
   */
  async sendMessage(userId, groupId, { messageText }, file) {
    const isMember = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: { groupId, userId },
      },
    });

    if (!isMember) {
      throw new ApiError(403, 'Must be a group member to send messages');
    }

    let mediaUrl = null;
    let mediaType = null;

    if (file) {
      if (file.mimetype.startsWith('image/')) mediaType = 'IMAGE';
      else if (file.mimetype.startsWith('audio/')) mediaType = 'AUDIO';
      else mediaType = 'DOCUMENT';

      const destination = `samaj_chat/${groupId}/${Date.now()}_${file.originalname}`;
      try {
        mediaUrl = await uploadToStorage(file.buffer, destination, file.mimetype);
      } catch (e) {
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
