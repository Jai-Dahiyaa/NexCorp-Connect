import catchAsync from '../../utils/catchAsync.js';
import AppError from '../../utils/appError.js';
import utilsToken from '../../utils/token.js';
import loginOTPService from '../../services/auth/loginOTP.service.js';
import * as userModels from '../../models/users.models.js';
import { generateOTP } from '../../utils/otpGenerate.js';
import redisClient from '../../config/redis.js';
import sendLoginOtpEmail from '../../utils/email.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const loginOTPController = catchAsync(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new AppError('Please enter your email', 404);

  const findUsers = await userModels.findByEmail(email);
  if (!findUsers) throw new AppError('User not found Please Register First', 403);

  const loginOtp = generateOTP();

  await sendLoginOtpEmail(email, 'Login OTP', loginOtp);

  await redisClient.set(`otp:loginOTP:${email}`, loginOtp, { EX: 300 });

  const payload = {
    email: email,
  };

  const generateLoginOTPToken = await utilsToken.accessTokenGenerate(payload);

  await redisClient.set(`token:loginToken:${generateLoginOTPToken}`, email, { EX: 300 });

  res.cookie('login-otp', generateLoginOTPToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 15 * 60 * 1000,
  });

  res.status(200).json({ message: 'Login OTP send your email Successfully' });
});

const loginOTPuserVerify = catchAsync(async (req, res) => {
  const { otp } = req.body;
  const token = req.cookies?.['login-otp'];
  if (!otp) throw new AppError('Please enter OTP', 404);
  if (!token) throw new AppError('Please enter valid token please', 403);

  const loginTokenVerify = jwt.verify(token, process.env.ACCESS_TOKEN);
  if (!loginTokenVerify)
    throw new AppError('token is missing please first otp generate with your email', 404);

  const redisTokenKey = `token:loginToken:${token}`;
  const redisGetTokenEmail = await redisClient.get(redisTokenKey);
  console.log('token email in redis', redisGetTokenEmail);

  const decode = jwt.decode(token);
  if (!decode) throw new AppError('please generate otp first', 404);

  if (!decode.email && !redisGetTokenEmail)
    throw new AppError('Email is chane please try right email', 403);

  const redisOTPKey = `otp:loginOTP:${decode.email}`;
  const redisGetOTP = await redisClient.get(redisOTPKey);

  const verifyOtp = bcrypt.compare(redisGetOTP, otp);
  if (!verifyOtp) throw new AppError('otp is not valid try again', 403);
  if (!redisGetOTP) throw new AppError('Please first otp generte your email', 403);

  if (!redisGetOTP && !otp) throw new AppError('Invalied OTP', 403);

  const users = await loginOTPService(redisGetTokenEmail);

  const payload = {
    id: users.id,
    email: users.email,
    role: users.role,
  };

  const accessToken = utilsToken.accessTokenGenerate(payload);
  const refreshToken = utilsToken.refreshTokenGenerate(payload);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 25 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  res.clearCookie('login-otp', {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    path: '/',
  });

  res.status(200).json({ message: 'User Login SuccessFully', users: users.result });
});

export default {
  loginOTPController,
  loginOTPuserVerify,
};
