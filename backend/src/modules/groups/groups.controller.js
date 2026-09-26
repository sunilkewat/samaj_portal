const groupsService = require('./groups.service');
const { ApiResponse } = require('../../utils/apiResponse');

class GroupsController {
  async createGroup(req, res, next) {
    try {
      const group = await groupsService.createGroup(req.user.id, req.body);
      return res.status(201).json(new ApiResponse(201, group, 'Group created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getGroups(req, res, next) {
    try {
      const userId = req.user ? req.user.id : null;
      const groups = await groupsService.getGroups(userId);
      return res.status(200).json(new ApiResponse(200, groups, 'Groups retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async joinGroup(req, res, next) {
    try {
      const { id } = req.params;
      const membership = await groupsService.joinGroup(req.user.id, id);
      return res.status(200).json(new ApiResponse(200, membership, 'Joined group'));
    } catch (error) {
      next(error);
    }
  }

  async addMember(req, res, next) {
    try {
      const { id } = req.params;
      const { userId, role } = req.body;
      const membership = await groupsService.addMember(req.user.id, id, userId, role);

      // Broadcast member added event to group
      const chatNamespace = req.app.get('chatNamespace');
      if (chatNamespace) {
        chatNamespace.to(`group_${id}`).emit('member_added', {
          groupId: id,
          user: membership.user,
        });
      }

      return res.status(201).json(new ApiResponse(201, membership, 'Member added to group successfully'));
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req, res, next) {
    try {
      const { id } = req.params;
      const message = await groupsService.sendMessage(req.user.id, id, req.body, req.file);

      // Broadcast to socket room
      const chatNamespace = req.app.get('chatNamespace');
      if (chatNamespace) {
        chatNamespace.to(`group_${id}`).emit('new_message', {
          id: message.id,
          groupId: id,
          senderId: message.senderId,
          senderName: message.sender?.profile
            ? `${message.sender.profile.firstName} ${message.sender.profile.lastName}`
            : 'सदस्य',
          senderGotra: message.sender?.profile?.samajGotra || 'कश्यप',
          text: message.messageText,
          mediaUrl: message.mediaUrl,
          mediaType: message.mediaType,
          time: new Date(message.createdAt).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        });
      }

      return res.status(201).json(new ApiResponse(201, message, 'Message sent'));
    } catch (error) {
      next(error);
    }
  }

  async getMessages(req, res, next) {
    try {
      const { id } = req.params;
      const messages = await groupsService.getMessages(id, req.query);
      return res.status(200).json(new ApiResponse(200, messages, 'Messages retrieved'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GroupsController();
