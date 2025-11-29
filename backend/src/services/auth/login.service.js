import bcrypt from 'bcrypt';
import * as useraModel from '../../models/users.models.js';
import AppError from '../../utils/appError.js';

const loginService = async (email, password) => {
  if (!email) throw new AppError('Please enter your email', 404);

  const registerUser = await useraModel.findByEmail(email);

  if (!registerUser) throw new AppError('User not register Please signUp', 404);

  const loginPassword = await useraModel.getPassworsLogin(email);

  if (!loginPassword) throw new AppError('Password not add Retry signUp', 402);

  const hashPassword = loginPassword.password;
  const originalConvert = JSON.parse(hashPassword);

  if (!bcrypt.compareSync(password, originalConvert)) throw new AppError('Password incorrect', 401);

  const result = await useraModel.loginUserGet(loginPassword.password);

  const users = {
    id: result.id,
    email: result.email,
    role: result.role,
    status: result.status,
    created_at: result.created_at  
  }

  return { message: `user login successfully`, users };
};

export default loginService;
