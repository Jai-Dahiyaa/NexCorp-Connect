import AppError from '../../utils/appError.js';
import oauthServiceFunction from '../../services/oauth/oauth.service.js';
import catchAsync from '../../utils/catchAsync.js';
import token from '../../utils/token.js';

const oauthController = catchAsync(async (req, res) => {
  const profile = req.user;
  if (!profile) throw new AppError('Please try again problem in server', 500);

  const result = await oauthServiceFunction(profile);
  if (!result) throw new AppError('User data not insert please try again', 400);

  const payload = {
    id: result.user.id,
    email: result.user.email,
    platform: result.social.platform_name
  };

  if (!payload.id && !payload.email) throw new AppError('Please try again right way', 400);

  const tokenGenerate = token.accessTokenGenerate(payload);

  res.cookie('accessToken', tokenGenerate, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 25 * 60 * 1000,
  });

  res.status(200).json({ message: 'Users successfully register', user: result.user });
});

export default oauthController;
