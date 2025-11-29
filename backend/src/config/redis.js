import logger from "../config/logger.js"
import pkg from 'redis';
const { createClient } = pkg;

const redisClient = createClient({
  url: process.env.REDIS_URL,
}) 

redisClient.on('error', (err) => {
  logger.error('Redis connection error:', err.message);
});

redisClient.on('connect', () => {
  logger.info('Redis client connected successfully');
});

redisClient.on('ready', () => {
  logger.info('Redis is ready to use');
});

await redisClient.connect();

export default redisClient;