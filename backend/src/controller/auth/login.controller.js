import loginService from '../../services/auth/login.service.js';
import catchAsync from '../../utils/catchAsync.js';
import AppError from '../../utils/appError.js';
import utilsToken from '../../utils/token.js';

const loginController = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError('Email and Password Both Required', 402);

  const users = await loginService(email, password);

  const payload = {
    id: users.users.id,
    email: users.users.email,
    role: users.users.role,
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

  res.status(200).json({ message: 'Welcome Back', users: users.users });
});

export default loginController;
