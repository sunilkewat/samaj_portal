const crypto = require('crypto');

/**
 * Generate cryptographically secure 6-digit numeric OTP
 */
const generateOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

module.exports = { generateOtp };
