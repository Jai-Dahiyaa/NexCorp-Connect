import dotenv from 'dotenv';
import { Pool } from 'pg';
import logger from '../config/logger.js';

dotenv.config({ path: '.env.test' });

const testPool = new Pool({
  connectionString: process.env.DATABASE_URL
});

testPool.connect((err) => {
  if (err) {
    logger.error('TEST DATABASE Connection error', { stack: err.stack });
  } else {
    logger.info('TEST DATABASE Successfully connected');
  }
});

export default testPool;
