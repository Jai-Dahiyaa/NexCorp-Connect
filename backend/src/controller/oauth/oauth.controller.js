import AppError from '../../utils/appError.js';
import oauthServiceFunction from '../../services/oauth/oauth.service.js';
import catchAsync from '../../utils/catchAsync.js';
import token from '../../utils/token.js';

async function refetchProfile(accessToken, provider) {
  let url;
  if (provider === 'google') url = 'https://www.googleapis.com/oauth2/v3/userinfo';
  else if (provider === 'github') url = 'https://api.github.com/user';
  else throw new Error(`Unsupported provider: ${provider}`);
  const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to refetch profile from ${provider}: ${text}`);
  }
  return await response.json();
}

const oauthController = catchAsync(async (req, res) => {
  const profile = req.user;
  if (!profile?.provider || !profile?.accessToken) {
    throw new AppError('OAuth provider or token missing', 400);
  }

  const result = await oauthServiceFunction(profile);
  if (!result) throw new AppError('User data not insert please try again', 400);

  if (!result?.user?.id || !result?.user?.email) {
    for (let i = 0; i < 2; i++) {
      await new Promise((res) => setTimeout(res, 500));
      const refreshedProfile = await refetchProfile(profile.accessToken, profile.provider);
      result = await oauthServiceFunction(refreshedProfile);
      if (result?.user?.id && result?.user?.email) break;
    }
  }

  if (!result?.user?.id || !result?.user?.email) {
    throw new AppError('OAuth profile incomplete, please try again', 400);
  }

  const payload = {
    id: result.user.id ?? null,
    email: result.user.email ?? null,
    platform: result.social.platform_name ?? 'unknown',
  };

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
