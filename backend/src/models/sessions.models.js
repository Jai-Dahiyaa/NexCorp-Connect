import pool from "../db/index.js";

export const insertSessionsTokenFromRoleFile = async (userId, refreshToken, expires_at, user_agent, ip_address) => {
    const res = await pool.query("INSERT INTO sessions (\"user_id\", \"refreshToken\", \"expires_at\", \"user_agent\", \"ip_address\") VALUES ($1, $2, $3, $4, $5) RETURNING \"refreshToken\";", [userId, refreshToken, expires_at, user_agent, ip_address]);
    return res.rows[0];
};

export const insertSessionsTokenFromLoginFile = async (userId, refreshToken, expires_at, user_agent, ip_address) => {
    const res = await pool.query("INSERT INTO sessions (\"user_id\", \"refreshToken\", \"expires_at\", \"user_agent\", \"ip_address\") VALUES ($1, $2, $3, $4, $5) RETURNING \"refreshToken\";", [userId, refreshToken, expires_at, user_agent, ip_address]);
    return res.rows[0];
};

export const insertSessionsTokenFromLoginOTPFile = async (userId, refreshToken, expires_at, user_agent, ip_address) => {
    const res = await pool.query("INSERT INTO sessions (\"user_id\", \"refreshToken\", \"expires_at\", \"user_agent\", \"ip_address\") VALUES ($1, $2, $3, $4, $5) RETURNING \"refreshToken\";", [userId, refreshToken, expires_at, user_agent, ip_address]);
    return res.rows[0];
};

export const accessTokenReGenerateWithRefresh = async (userId) => {
    const res = await pool.query("SELECT \"refreshToken\" FROM sessions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1", [userId]);
    return res.rows[0];
};

export const logoutWithRefresh = async (userId) => {
    const res = await pool.query("SELECT \"refreshToken\" FROM sessions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1", [userId]);
    return res.rows[0];
};