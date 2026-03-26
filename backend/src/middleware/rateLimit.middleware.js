import { rateLimiter } from "../config/rateLimit.js";

export const limiter = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch {
    res.status(429).json({
      status: false,
      message: "Too many requests, please try again later",
    });
  }
};
