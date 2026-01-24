import logger from '../config/logger.js';
import pkg from 'redis';
const { createClient } = pkg;

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => {
  logger.error(`Redis connection error: ${err?.message || err}`);
});

redisClient.on('connect', () => {
  logger.info('Redis client connected successfully');
});

redisClient.on('ready', () => {
  logger.info('Redis is ready to use');
});

async function connectRedis() {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (err) {
    logger.error(`Redis initial connect failed: ${err?.message || err}`);
    setTimeout(connectRedis, 2000);
  }
}

connectRedis();

export default redisClient;

export async function closeRedis() {
  if (redisClient.isOpen) {
    await redisClient.quit();
  }
}
