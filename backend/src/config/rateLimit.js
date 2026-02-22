import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "./redis.js"

export const limiter = rateLimit({
    store: new RedisStore({
        sendCommand: (...args) => redisClient.sendCommand(args),
    }),
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: false,
        message: "Too many request, please try again later"
    }
})