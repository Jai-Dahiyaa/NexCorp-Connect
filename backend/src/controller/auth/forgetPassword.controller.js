import catchAsync from '../../utils/catchAsync.js';
import AppError from '../../utils/appError.js';
import userForgetPasswordService from '../../services/auth/forgetPassword.service.js';
import sendForgetPasswordEmai from '../../utils/email.js';
import redisClient from '../../config/redis.js';
import { generateOTP } from '../../utils/otpGenerate.js';
import bcrypt from 'bcrypt';
import * as userModel from '../../models/users.models.js';
import jwt from 'jsonwebtoken';
import utilsToken from '../../utils/token.js';

const forgetUserPasswordController = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) throw new AppError('Email require please enter', 404);

  const findUsers = await userModel.findByEmail(email);

  if (!findUsers) throw new AppError('User are not found', 404);

  const verifyOTP = generateOTP();

  await redisClient.set(`otp:forgetPass:${email}`, verifyOTP, {EX: 300})

  const hashOTP = await bcrypt.hash(verifyOTP, 10);

  await sendForgetPasswordEmai(email, 'Forget PASSWORD', verifyOTP);

  await redisClient.set(`otp:reset-pass:${email}`, hashOTP, { EX: 300 });

  //redirect verify forgetOTP Password route
  res.status(200).json({ message: 'otp send successfully your email'});
});

const forgetPaawordOTPVerify = catchAsync(async (req, res) => {
  const { email, otp } = req.body;

  const redisKey = `otp:reset-pass:${email}`;
  const hashOTP = await redisClient.get(redisKey);

  const verifyOTP = bcrypt.compare(otp, hashOTP);

  if (!verifyOTP) throw new AppError('OTP is invalid please try again', 403);

  const payload = {
    email: email,
  };

  const forgetToken = utilsToken.accessTokenGenerate(payload);

  await redisClient.set(`otp:session-token:${forgetToken}`, email, { EX: 300 });

  res.cookie('reset-session', forgetToken, {
    httpOnly: true,
    secure: true,
    maxAge: 15 * 60 * 1000,
  });

  //redirect new password route
  res.status(200).json({ message: 'Password Reset OTP Verify' });
});

const resetNewUserPassword = catchAsync(async (req, res) => {
  const { pass1, pass2 } = req.body;
  const resetSession = req.cookies?.['reset-session'];

  if (!pass1 || !pass2) throw new AppError('Please enter your correct password', 403);
  if (pass1 !== pass2) throw new AppError('Passwords do not match', 403);
  if (!resetSession) throw new AppError('Please try to verify a OTP Thanks', 403);

  // const verifyToken = jwt.verify(resetSession, process.env.ACCESS_TOKEN);
  // if (!verifyToken)
  //   throw new AppError('Password is not reset please try again otp verify please', 403);

  const redisKey = `otp:session-token:${resetSession}`;
  const redisEmail = await redisClient.get(redisKey);

  if (!redisEmail) throw new AppError('Please a verify OTP please', 403);

  const decode = jwt.decode(resetSession);
  if (!decode.email && !redisEmail) throw new AppError('First setup is otp verify please', 403);
  if(decode.email !== redisEmail) throw new AppError('email is not match please try again', 403);

  await userForgetPasswordService(redisEmail, pass1);
  
  // res.clearCookie('reset-session', {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'development',
  //   sameSite: 'Strict',
  //   path: '/',
  // });

  //redirect login route
  res.status(200).json({ message: 'Your password change successfull' });
});

export default {
  forgetUserPasswordController,
  forgetPaawordOTPVerify,
  resetNewUserPassword,
};
