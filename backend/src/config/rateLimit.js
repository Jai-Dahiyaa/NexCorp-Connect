import { RateLimiterRedis } from "rate-limiter-flexible";
import redisClient from "./redis.js";

export const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: 100,       
  duration: 900,     
  blockDuration: 60, 
});
