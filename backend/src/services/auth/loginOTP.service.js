import AppError from '../../utils/appError.js';
import * as userModel from '../../models/users.models.js';

const loginOTPService = async (email) => {
  if (!email) throw new AppError('email is missing', 404);

  const result = await userModel.userLoginOTPQuery(email);
  if(!result) throw new AppError('user not find please try again', 404);

  return { result };
};

export default loginOTPService;
