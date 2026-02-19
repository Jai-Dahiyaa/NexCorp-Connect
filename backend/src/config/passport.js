import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';

const googleCallback = async (accessToken, refreshToken, profile, done) => {
  try {
    const userProfile = {
      provider: "google",
      id: profile.id,
      email: profile.emails?.[0]?.value || null,
      name: profile.displayName || "NoName",
      photo: profile.photos?.[0]?.value || null,
      accessToken,
      refreshToken
    };

    return done(null, userProfile);
  } catch (err) {
    console.error("Google OAuth Error:", err);
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
    googleCallback
  )
);

const githubCallback = async (accessToken, refreshToken, profile, done) => {
  try {
    const userProfile = {
      provider: "github",
      id: profile.id,
      email: profile.emails?.[0]?.value || profile._json?.email || null,
      name: profile.displayName || profile.username || "NoName",
      photo: profile._json?.avatar_url || null,
      accessToken,
      refreshToken
    };

    return done(null, userProfile);
  } catch (err) {
    console.error("GitHub OAuth Error:", err);
    return done(err, null);
  }
};

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    githubCallback
  )
);

export default passport;
