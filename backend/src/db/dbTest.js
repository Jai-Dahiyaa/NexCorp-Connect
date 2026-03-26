import dotenv from "dotenv";
import { Pool } from "pg";
import logger from "../config/logger.js";

if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
}

let testPool = null;

if (process.env.NODE_ENV === "test") {
  testPool = new Pool({
    connectionString: process.env.DATABASE_URL 
  });

  testPool.query("SELECT 1")
    .then(() => logger.info("TEST DATABASE Successfully connected"))
    .catch(err => logger.error("TEST DATABASE Connection error", { stack: err.stack }));
}

export default testPool;
