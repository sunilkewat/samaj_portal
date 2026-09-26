const prisma = require('../../database/prisma');
const { ApiError } = require('../../utils/apiResponse');
const { uploadToStorage } = require('../../config/firebase');

class PostsService {
  /**
   * Create a new community post with media attachments
   */
  async createPost(userId, { content, visibility = 'PUBLIC', isPinned = false }, files = []) {
    if (!content && (!files || files.length === 0)) {
      throw new ApiError(400, 'Post must contain either text content or media');
    }

    // Upload files to Firebase if any
    const mediaPayload = [];
    for (const file of files) {
      let mediaType = 'IMAGE';
      if (file.mimetype.startsWith('video/')) mediaType = 'VIDEO';
      else if (file.mimetype === 'application/pdf') mediaType = 'DOCUMENT';

      const destination = `samaj_posts/${userId}/${Date.now()}_${file.originalname}`;
      let fileUrl = '';
      try {
        fileUrl = await uploadToStorage(file.buffer, destination, file.mimetype);
      } catch (e) {
        fileUrl = `https://storage.googleapis.com/livetdsbucket/${destination}`;
      }

      mediaPayload.push({
        fileUrl,
        mediaType,
        fileSize: file.size,
        mimeType: file.mimetype,
      });
    }

    const post = await prisma.post.create({
      data: {
        authorId: userId,
        content,
        visibility,
        isPinned: Boolean(isPinned),
        media: {
          create: mediaPayload,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            verificationStatus: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                profilePhoto: true,
                city: true,
                samajGotra: true,
              },
            },
          },
        },
        media: true,
      },
    });

    return post;
  }

  /**
   * Paginated feed
   */
  async getFeed(currentUserId, { page = 1, limit = 15 }) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const take = Math.min(30, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * take;

    const where = {
      deletedAt: null,
      visibility: { in: ['PUBLIC', 'MEMBERS_ONLY'] },
    };

    const [totalCount, posts] = await Promise.all([
      prisma.post.count({ where }),
      prisma.post.findMany({
        where,
        skip,
        take,
        orderBy: [
          { isPinned: 'desc' },
          { createdAt: 'desc' },
        ],
        include: {
          author: {
            select: {
              id: true,
              verificationStatus: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  profilePhoto: true,
                  city: true,
                  samajGotra: true,
                },
              },
            },
          },
          media: true,
          likes: {
            where: { userId: currentUserId },
            select: { id: true },
          },
        },
      }),
    ]);

    const formattedPosts = posts.map((p) => {
      const isLiked = p.likes.length > 0;
      const { likes: _, ...rest } = p;
      return { ...rest, isLiked };
    });

    return {
      posts: formattedPosts,
      pagination: {
        totalCount,
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  }

  /**
   * Toggle Like on post
   */
  async toggleLike(userId, postId) {
    const existing = await prisma.postLike.findUnique({
      where: {
        postId_userId: { postId, userId },
      },
    });

    if (existing) {
      await prisma.$transaction([
        prisma.postLike.delete({ where: { id: existing.id } }),
        prisma.post.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } },
        }),
      ]);
      return { liked: false };
    }

    await prisma.$transaction([
      prisma.postLike.create({
        data: { postId, userId },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } },
      }),
    ]);

    return { liked: true };
  }

  /**
   * Add comment or reply
   */
  async addComment(userId, postId, { content, parentId }) {
    if (!content || !content.trim()) {
      throw new ApiError(400, 'Comment content cannot be empty');
    }

    const comment = await prisma.$transaction(async (tx) => {
      const c = await tx.comment.create({
        data: {
          postId,
          authorId: userId,
          parentId: parentId || null,
          content: content.trim(),
        },
        include: {
          author: {
            select: {
              profile: {
                select: { firstName: true, lastName: true, profilePhoto: true },
              },
            },
          },
        },
      });

      await tx.post.update({
        where: { id: postId },
        data: { commentsCount: { increment: 1 } },
      });

      return c;
    });

    return comment;
  }

  /**
   * Track share
   */
  async trackShare(userId, postId, channel = 'WHATSAPP') {
    await prisma.$transaction([
      prisma.postShare.create({
        data: { postId, userId, channel },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { sharesCount: { increment: 1 } },
      }),
    ]);

    return { success: true };
  }
}

module.exports = new PostsService();
