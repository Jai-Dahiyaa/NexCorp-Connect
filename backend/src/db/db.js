import dotenv from 'dotenv';
import { Pool } from 'pg';
import logger from '../config/logger.js';

dotenv.config();

let pool = null;

if (process.env.NODE_ENV !== 'test') {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  pool.connect((err) => {
    if (err) {
      logger.error('DATABASE Connection error', { stack: err.stack });
    } else {
      logger.info('DATABASE Successfully connected');
    }
  });
}

export default pool;

