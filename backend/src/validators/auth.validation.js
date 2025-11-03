import Joi from 'joi';

export const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const signUpOTPSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

export const roleAssignSchema = Joi.object({
  role: Joi.string().valid('users','employee','admin').required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const statusChangeSchema = Joi.object({
  status: Joi.boolean().required(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

export const forgetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const forgetOTPVerifySchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

export const resetPasswordSchema = Joi.object({
  pass1: Joi.string().min(6).required(),
  pass2: Joi.string().valid(Joi.ref('pass1')).required(),
});

export const loginOTPSendSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const loginOTPVerifySchema = Joi.object({
  otp: Joi.string().length(6).required(),
});
