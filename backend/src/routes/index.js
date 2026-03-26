import signUp from "./localAuth.routes.js";
import oauth from "./OAuth.routes.js";
import profile from "./profile.routes.js";
import posts from "./posts.routes.js";
import comments from "./comments.routes.js";
import openai from "./openai.routes.js"

export default function registerRoutes (app) {
  app.use("/auth", signUp);
  app.use("/api/v1/oauth/", oauth);
  app.use("/profiles", profile);
  app.use("/posts", posts);
  app.use("/comments", comments);
  app.use("/ai", openai)
};