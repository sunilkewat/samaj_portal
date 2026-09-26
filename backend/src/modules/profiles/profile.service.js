const prisma = require('../../database/prisma');
const { ApiError } = require('../../utils/apiResponse');
const { uploadToStorage } = require('../../config/firebase');

class ProfileService {
  /**
   * Fetch current user's profile with family members
   */
  async getMyProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        mobileNumber: true,
        email: true,
        verificationStatus: true,
        isProfileComplete: true,
        createdAt: true,
        profile: true,
        familyMembers: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user;
  }

  /**
   * Update personal profile information
   */
  async updateProfile(userId, data) {
    const updated = await prisma.userProfile.update({
      where: { userId },
      data: {
        ...(data.firstName && { firstName: data.firstName }),
        ...(data.lastName && { lastName: data.lastName }),
        ...(data.gender && { gender: data.gender }),
        ...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth) }),
        ...(data.bloodGroup && { bloodGroup: data.bloodGroup }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.occupation !== undefined && { occupation: data.occupation }),
        ...(data.education !== undefined && { education: data.education }),
        ...(data.samajGotra !== undefined && { samajGotra: data.samajGotra }),
        ...(data.samajCategory !== undefined && { samajCategory: data.samajCategory }),
        ...(data.nativeVillage !== undefined && { nativeVillage: data.nativeVillage }),
        ...(data.addressLine1 !== undefined && { addressLine1: data.addressLine1 }),
        ...(data.addressLine2 !== undefined && { addressLine2: data.addressLine2 }),
        ...(data.city && { city: data.city }),
        ...(data.state && { state: data.state }),
        ...(data.pincode !== undefined && { pincode: data.pincode }),
        ...(data.country && { country: data.country }),
      },
    });

    return updated;
  }

  /**
   * Upload Profile Avatar to Firebase Storage (livetdsbucket)
   */
  async uploadAvatar(userId, file) {
    if (!file) throw new ApiError(400, 'Image file is required');

    const destination = `samaj_profiles/${userId}/avatar_${Date.now()}_${file.originalname}`;
    let fileUrl = '';

    try {
      fileUrl = await uploadToStorage(file.buffer, destination, file.mimetype);
    } catch (err) {
      console.warn('Firebase upload fallback to mock url:', err.message);
      fileUrl = `https://storage.googleapis.com/livetdsbucket/${destination}`;
    }

    const updated = await prisma.userProfile.update({
      where: { userId },
      data: { profilePhoto: fileUrl },
    });

    return { profilePhoto: fileUrl, profile: updated };
  }

  /**
   * Upload Cover Photo to Firebase Storage
   */
  async uploadCover(userId, file) {
    if (!file) throw new ApiError(400, 'Image file is required');

    const destination = `samaj_profiles/${userId}/cover_${Date.now()}_${file.originalname}`;
    let fileUrl = '';

    try {
      fileUrl = await uploadToStorage(file.buffer, destination, file.mimetype);
    } catch (err) {
      fileUrl = `https://storage.googleapis.com/livetdsbucket/${destination}`;
    }

    const updated = await prisma.userProfile.update({
      where: { userId },
      data: { coverPhoto: fileUrl },
    });

    return { coverPhoto: fileUrl, profile: updated };
  }

  /**
   * Add family member
   */
  async addFamilyMember(userId, memberData) {
    return prisma.userFamilyMember.create({
      data: {
        userId,
        fullName: memberData.fullName,
        relationship: memberData.relationship,
        gender: memberData.gender,
        age: memberData.age ? parseInt(memberData.age, 10) : null,
        occupation: memberData.occupation || null,
        education: memberData.education || null,
        isAlive: memberData.isAlive !== undefined ? memberData.isAlive : true,
      },
    });
  }

  /**
   * Update family member
   */
  async updateFamilyMember(userId, memberId, memberData) {
    const existing = await prisma.userFamilyMember.findFirst({
      where: { id: memberId, userId },
    });

    if (!existing) {
      throw new ApiError(404, 'Family member record not found');
    }

    return prisma.userFamilyMember.update({
      where: { id: memberId },
      data: {
        ...(memberData.fullName && { fullName: memberData.fullName }),
        ...(memberData.relationship && { relationship: memberData.relationship }),
        ...(memberData.gender && { gender: memberData.gender }),
        ...(memberData.age !== undefined && { age: parseInt(memberData.age, 10) }),
        ...(memberData.occupation !== undefined && { occupation: memberData.occupation }),
        ...(memberData.education !== undefined && { education: memberData.education }),
        ...(memberData.isAlive !== undefined && { isAlive: memberData.isAlive }),
      },
    });
  }

  /**
   * Delete family member
   */
  async deleteFamilyMember(userId, memberId) {
    const existing = await prisma.userFamilyMember.findFirst({
      where: { id: memberId, userId },
    });

    if (!existing) {
      throw new ApiError(404, 'Family member record not found');
    }

    await prisma.userFamilyMember.delete({
      where: { id: memberId },
    });

    return { message: 'Family member removed successfully' };
  }
}

module.exports = new ProfileService();
