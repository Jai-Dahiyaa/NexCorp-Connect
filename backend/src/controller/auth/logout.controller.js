import AppError from '../../utils/appError.js';
import catchAsync from '../../utils/catchAsync.js';
import jwt from 'jsonwebtoken';

const logoutController = catchAsync(async (req, res) => {
  const token = req.cookies?.accessToken;

  if (!token) throw new AppError('accessToken is missing', 401);

  const decode = jwt.verify(token, process.env.ACCESS_TOKEN);

  if (decode) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      path: '/',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      path: '/',
    });

    res.status(200).json({ message: 'successfully logged out' });
  }
});

export default logoutController;
