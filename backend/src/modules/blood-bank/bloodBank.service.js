const prisma = require('../../database/prisma');
const { ApiError } = require('../../utils/apiResponse');
const { sendPushNotification } = require('../../config/firebase');

class BloodBankService {
  /**
   * Register or update self as emergency blood donor
   */
  async registerDonor(userId, { bloodGroup, city, state, isAvailable = true }) {
    return prisma.bloodDonor.upsert({
      where: { userId },
      update: {
        bloodGroup,
        city,
        state,
        isAvailable: Boolean(isAvailable),
      },
      create: {
        userId,
        bloodGroup,
        city,
        state,
        isAvailable: Boolean(isAvailable),
      },
    });
  }

  /**
   * Search available donors by blood group and city
   */
  async searchDonors({ bloodGroup, city }) {
    return prisma.bloodDonor.findMany({
      where: {
        isAvailable: true,
        ...(bloodGroup && { bloodGroup }),
        ...(city && { city: { equals: city, mode: 'insensitive' } }),
      },
      include: {
        user: {
          select: {
            mobileNumber: true,
            profile: {
              select: { firstName: true, lastName: true, profilePhoto: true },
            },
          },
        },
      },
    });
  }

  /**
   * Emergency Blood SOS broadcast to matching donors
   */
  async createSosRequest(userId, data) {
    if (!data.patientName || !data.hospitalName || !data.hospitalCity || !data.bloodGroup || !data.contactNumber) {
      throw new ApiError(400, 'All SOS emergency details are required');
    }

    const request = await prisma.bloodRequest.create({
      data: {
        requestedById: userId,
        patientName: data.patientName,
        hospitalName: data.hospitalName,
        hospitalCity: data.hospitalCity,
        bloodGroup: data.bloodGroup,
        unitsNeeded: data.unitsNeeded ? parseInt(data.unitsNeeded, 10) : 1,
        contactNumber: data.contactNumber,
        urgencyLevel: data.urgencyLevel || 'CRITICAL',
      },
    });

    // Find matching donors in the same city with active devices for Push Notification
    const matchingDonors = await prisma.bloodDonor.findMany({
      where: {
        bloodGroup: data.bloodGroup,
        city: { equals: data.hospitalCity, mode: 'insensitive' },
        isAvailable: true,
      },
      include: {
        user: {
          include: {
            devices: true,
          },
        },
      },
    });

    // Dispatch FCM notifications asynchronously
    for (const donor of matchingDonors) {
      for (const device of donor.user.devices) {
        if (device.fcmToken) {
          sendPushNotification(device.fcmToken, {
            title: `🚨 EMERGENCY: ${data.bloodGroup} Blood Needed!`,
            body: `${data.hospitalCity} के ${data.hospitalName} में मरीज ${data.patientName} को तत्काल रक्त की आवश्यकता है। संपर्क: ${data.contactNumber}`,
            data: { requestId: request.id, type: 'BLOOD_SOS' },
          }).catch((err) => console.warn('FCM dispatch error:', err.message));
        }
      }
    }

    return { request, notifiedDonorsCount: matchingDonors.length };
  }
}

module.exports = new BloodBankService();
