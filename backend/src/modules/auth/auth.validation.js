const Joi = require('joi');

const registerSchema = Joi.object({
  mobileNumber: Joi.string().pattern(/^[6-9]\d{9}$/).required().messages({
    'string.pattern.base': 'Please enter a valid 10-digit Indian mobile number',
  }),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).max(32).required(),
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName: Joi.string().trim().min(2).max(50).required(),
  gender: Joi.string().valid('MALE', 'FEMALE', 'OTHER').required(),
  city: Joi.string().trim().required(),
  state: Joi.string().trim().required(),
  samajGotra: Joi.string().trim().optional(),
  occupation: Joi.string().trim().optional(),
  bloodGroup: Joi.string().valid('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE').optional(),
});

const loginSchema = Joi.object({
  identifier: Joi.string().required().messages({
    'any.required': 'Mobile number or email is required',
  }),
  password: Joi.string().required(),
  deviceType: Joi.string().valid('ANDROID', 'IOS', 'WEB').default('WEB'),
  fcmToken: Joi.string().optional(),
  deviceModel: Joi.string().optional(),
});

const sendOtpSchema = Joi.object({
  identifier: Joi.string().required(),
  purpose: Joi.string().valid('LOGIN', 'REGISTRATION', 'FORGOT_PASSWORD').default('LOGIN'),
});

const verifyOtpSchema = Joi.object({
  identifier: Joi.string().required(),
  otpCode: Joi.string().length(6).required(),
  purpose: Joi.string().valid('LOGIN', 'REGISTRATION', 'FORGOT_PASSWORD').default('LOGIN'),
  fcmToken: Joi.string().optional(),
  deviceType: Joi.string().valid('ANDROID', 'IOS', 'WEB').default('WEB'),
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).max(32).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,
  refreshTokenSchema,
  changePasswordSchema,
};
