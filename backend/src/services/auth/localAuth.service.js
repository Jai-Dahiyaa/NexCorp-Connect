import bcrypt from 'bcrypt';
import * as usersModel from '../../models/users.models.js';
import AppError from '../../utils/appError.js';
import { generateOTP } from '../../utils/otpGenerate.js';
import redisClient from '../../config/redis.js';
import { emailQueue } from '../../jobs/queue/email.queue.js';

export const createUser = async (email, password) => {
  if (!email || !password) throw new AppError('Email and password are required', 400);

  const findUser = await usersModel.findByEmail(email);
  if (findUser) throw new AppError(`Email already exists`, 409);

  const passwordHash = await bcrypt.hash(password, 10);
  //password store in redis
  await redisClient.set(`pass:${email}`, password, { EX: 300 });

  //OTP generate and store
  const verifyOTPGenerate = await generateOTP();
  if (!verifyOTPGenerate)
    throw new AppError(`Problem in server not generate OTP please try next time`, 500);

  await redisClient.set(`otp:${email}`, verifyOTPGenerate, { EX: 300 });

  //OTP send on gamil
  await redisClient.set(`signup:${email}`, JSON.stringify(passwordHash), { EX: 3000 });

  //send OTP to user
  await emailQueue.add('sendEmail', { to: email, subject: 'Signup OTP', otp: verifyOTPGenerate });
  console.log("✅ Job pushed to queue");
};
