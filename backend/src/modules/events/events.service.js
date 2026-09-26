const prisma = require('../../database/prisma');
const { ApiError } = require('../../utils/apiResponse');

class EventsService {
  /**
   * Create an event / sammelan announcement
   */
  async createEvent(data) {
    if (!data.title || !data.venueCity || !data.startDateTime) {
      throw new ApiError(400, 'Title, venue city, and start date are required');
    }

    return prisma.event.create({
      data: {
        title: data.title,
        description: data.description || '',
        bannerUrl: data.bannerUrl || null,
        venueName: data.venueName || 'Samaj Bhawan',
        venueCity: data.venueCity,
        venueState: data.venueState || '',
        startDateTime: new Date(data.startDateTime),
        endDateTime: data.endDateTime ? new Date(data.endDateTime) : new Date(data.startDateTime),
        organizer: data.organizer || 'Samaj Executive Board',
        entryFee: data.entryFee ? parseFloat(data.entryFee) : 0.0,
      },
    });
  }

  /**
   * List upcoming and past events
   */
  async getEvents({ status = 'UPCOMING', page = 1, limit = 10 }) {
    const pageNum = Math.max(1, parseInt(page, 10));
    const take = Math.min(20, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * take;

    const where = {
      deletedAt: null,
      ...(status && { status }),
    };

    const [totalCount, events] = await Promise.all([
      prisma.event.count({ where }),
      prisma.event.findMany({
        where,
        skip,
        take,
        orderBy: { startDateTime: 'asc' },
        include: {
          _count: {
            select: { registrations: true },
          },
        },
      }),
    ]);

    return {
      events,
      pagination: {
        totalCount,
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / take),
      },
    };
  }

  /**
   * RSVP / Register for event
   */
  async rsvp(userId, eventId, { rsvp = 'GOING', guestCount = 1, notes }) {
    return prisma.eventRegistration.upsert({
      where: {
        eventId_userId: { eventId, userId },
      },
      update: {
        rsvp,
        guestCount: parseInt(guestCount, 10) || 1,
        notes,
      },
      create: {
        eventId,
        userId,
        rsvp,
        guestCount: parseInt(guestCount, 10) || 1,
        notes,
      },
    });
  }
}

module.exports = new EventsService();
