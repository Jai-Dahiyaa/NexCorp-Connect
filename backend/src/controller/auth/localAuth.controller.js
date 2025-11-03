import { createUser } from '../../services/auth/localAuth.service.js';
import catchAsync from '../../utils/catchAsync.js';
import AppError from '../../utils/appError.js';

const signUpController = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError('Required email and password both');
  await createUser(email, password);
  res.status(200).json({ message: 'Send OTP on your email' });
});

export default signUpController;