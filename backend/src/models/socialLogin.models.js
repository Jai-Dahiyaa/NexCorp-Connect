import pool from "../db/index.js";

export const findUserInSocail = async (id) => {
  const res = await pool.query("SELECT * FROM social_login WHERE user_id = $1", [id]);
  return res.rows[0];
};

export const socialLoginDataInsert = async (user_id, platform, platformUserId) => {
  const res = await pool.query(
    "INSERT INTO social_login (\"user_id\", \"provider\", \"provider_user_id\") VALUES ($1, $2, $3) RETURNING \"user_id\", \"provider\", \"provider_user_id\";",[user_id, platform, platformUserId]
  );
  return res.rows[0];
};

export const updateSocialLogin = async (user_id) => {
  const res = await pool.query(
    "UPDATE social_login SET updated_at = NOW() WHERE user_id = $1 RETURNING *",
    [user_id]
  );
  return res.rows[0];
};
