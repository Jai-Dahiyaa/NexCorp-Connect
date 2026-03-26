import pool from "./db.js";
import testPool from "./dbTest.js";

const dbPool = process.env.NODE_ENV === "test" ? testPool : pool; 

export default dbPool;