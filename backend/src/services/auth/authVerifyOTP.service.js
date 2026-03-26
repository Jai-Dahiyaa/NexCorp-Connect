import redisClient from "../../config/redis.js";
import * as userModel from "../../models/users.models.js";
import AppError from "../../utils/appError.js";

const signUpOTPVerify = async (email, enteredOtp) => {
  const redisKeyOTP = `otp:${email}`;
  const redisKeyPass = `signup:${email}`;

  const storedOTP = await redisClient.get(redisKeyOTP);
  const storedPass = await redisClient.get(redisKeyPass);

  if (!storedOTP) throw new AppError("OTP expired or not found");
  if (!enteredOtp) throw new AppError("Valid OTP Required", 402);
  if (enteredOtp !== storedOTP) throw new AppError("Invalid OTP");
  if (!storedPass) throw new AppError("password not required", 404);

  const newUser = await userModel.createUsers(email, storedPass);

  await redisClient.del(redisKeyOTP);
  await redisClient.del(redisKeyPass);

  return { id: newUser.id, email: newUser.email };
};

export default signUpOTPVerify;
