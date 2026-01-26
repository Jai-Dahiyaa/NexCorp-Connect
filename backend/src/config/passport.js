import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';

const commonCallback = async (accessToken, refreshToken, profile, done) => {
  try {
    profile.accessToken = accessToken;
    profile.provider = profile.provider || 'unknown';

    if (profile.provider === 'google') {
      profile.email = profile.emails?.[0]?.value || null;
      profile.photo = profile.photos?.[0]?.value || null;
      profile.name = profile.displayName || 'NoName';
    } else if (profile.provider === 'github') {
      profile.email = profile.emails?.[0]?.value || profile._json?.email || null;
      profile.photo = profile._json?.avatar_url || null;
      profile.name = profile.displayName || profile.username || 'NoName';
    }

    return done(null, profile);
  } catch (err) {
    return done(err, null);
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    commonCallback
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    commonCallback
  )
);

export default passport;
