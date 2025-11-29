import * as userModel from '../../models/users.models.js';
import AppError from '../../utils/appError.js';
import bcrypt from 'bcrypt';

const userForgetPasswordService = async (email, password) => {
  if (!email || !password) throw new AppError('missing email and password', 404);

    const hashPass = await bcrypt.hash(password, 10);
  
  //   const redisPassKey = `otp:forget-pass:${decode.email}`;
  //   await redisClient.set(redisPassKey, JSON.stringify(hashPass), { EX: 300 });

  // const redisPassKey = `otp:forget-pass:${email}`;
  // const stringHashPass = await redisClient.get(redisPassKey);

  // if (!stringHashPass) throw new AppError('Error in server please try sometime later', 500);

  // const redisPassInBcrypt = JSON.parse(stringHashPass);
  // const verifyHashPass = await bcrypt.compare(password, redisPassInBcrypt);

  const users = await userModel.forgetUserPassword(email, hashPass);

  return { message: 'SuccessFully update your Password', users };
};

export default userForgetPasswordService;
