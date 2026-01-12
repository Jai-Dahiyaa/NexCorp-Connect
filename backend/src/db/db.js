import dotenv from 'dotenv';
import { Pool } from 'pg';
import logger from '../config/logger.js';

dotenv.config();

let pool = null;

if (process.env.NODE_ENV !== 'test') {
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
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

