import dotenv from "dotenv";
import { Pool } from "pg";
import logger from "../config/logger.js";

dotenv.config();

let pool = null;

if (process.env.NODE_ENV !== "test") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  pool.connect((err, client, release) => {
    if (err) { logger.error("DATABASE Connection error", { stack: err.stack }); } else {
      logger.info("DATABASE Successfully connected"); 
      release(); 
    }
  });
}

export default pool;

