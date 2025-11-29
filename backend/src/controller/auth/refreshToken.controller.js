import AppError from '../../utils/appError.js';
import catchAsync from '../../utils/catchAsync.js';
import refreshTokenService from '../../services/auth/refreshToken.service.js';
import jwt from 'jsonwebtoken';
import utilsToken from '../../utils/token.js';

const refreshTokenController = catchAsync(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if (!token) throw new AppError('Token is missing', 401);

  const decode = jwt.verify(token, process.env.REFRESH_TOKEN);

  const users = await refreshTokenService(decode.email);

  const newPayload = {
    id: users.id,
    email: users.email,
    role: users.role,
  };

  const newAccessToken = utilsToken.accessTokenGenerate(newPayload);
  const newRefreshToken = utilsToken.refreshTokenGenerate(newPayload);

  res.cookie('accessToken', newAccessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 25 * 60 * 1000,
  });

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 3 * 24 * 60 * 60 * 1000,
  });

  res
    .status(200)
    .json({ message: 'access and refresh token generate successfully', users: users.users });
});

export default refreshTokenController;
