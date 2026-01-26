import signUp from "./localAuth.routes.js";
import oauth from "./OAuth.routes.js"
import profile from "./profile.routes.js"

export default function registerRoutes (app) {
  app.use('/auth', signUp);
  app.use('/api/v1/oauth/', oauth);
  app.use('/profiles', profile)
};