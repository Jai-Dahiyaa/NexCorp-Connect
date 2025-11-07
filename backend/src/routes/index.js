import signUp from "./localAuth.routes.js";
import oauth from "./OAuth.routes.js"

export default function registerRoutes (app) {
  app.use('/auth', signUp);
  app.use('/api/v1/oauth/', oauth)
};