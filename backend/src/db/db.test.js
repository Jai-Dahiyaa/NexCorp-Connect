import dotenv from 'dotenv';
import { Pool } from 'pg';
import logger from '../config/logger.js';

dotenv.config({ path: '.env.test' });

const testPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE, 
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

testPool.connect((err) => {
  if (err) {
    logger.error('TEST DATABASE Connection error', { stack: err.stack });
  } else {
    logger.info('TEST DATABASE Successfully connected');
  }
});

export default testPool;
