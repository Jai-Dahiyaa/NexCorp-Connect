import signUp from "./localAuth.routes.js";

export default function registerRoutes (app) {
  app.use('/auth', signUp);
};