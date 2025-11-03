import pool from '../db/db.js';

// Local Auth

export const findByEmail = async (email) => {
  const res = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  return res.rows[0];
};

export const createUsers = async (email, password) => {
  const res = await pool.query(`INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *`, [
    email,
    password,
  ]);
  return res.rows[0];
};

export const insertUserRole = async (email, role) => {
  const res = await pool.query(`UPDATE users SET role = $1 WHERE email = $2 RETURNING *`, [
    role,
    email,
  ]);
  return res.rows[0];
};

export const getPassworsLogin = async (email) => {
  const res = await pool.query(`SELECT password FROM users WHERE email = $1`, [email]);
  return res.rows[0];
};

export const loginUserGet = async (password) => {
  const res = await pool.query(`SELECT * FROM users WHERE password = $1`, [password]);
  return res.rows[0];
};

export const statusChangeTrue = async (email) => {
  const res = await pool.query(`UPDATE Users SET status = 'true' WHERE email = $1 RETURNING id, email, status`, [email]);
  return res.rows[0];
};

export const statusChangeFalse = async (email) => {
  const res = await pool.query(`UPDATE Users SET status = 'false' WHERE email = $1 RETURNING id, email, status`, [email]);
  return res.rows[0];
};

export const refreshRouteGetUsers = async (email) => {
  const res = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  return res.rows[0];
};

export const forgetUserPassword = async (email, password) => {
  const res = await pool.query(`UPDATE users SET password = $1 WHERE email = $2`, [
    password,
    email,
  ]);
  return res.rows[0];
};

export const userLoginOTPQuery = async (email) => {
  const res = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  return res.rows[0];
};

// OAuth

export const oauthLoginSocial = async (email) => {
  const res = await pool.query(`INSERT INTO users (email) VALUES ($1) RETURNING id, email`, [
    email,
  ]);
  return res.rows[0];
};
