import pool from '../db/db.js';

export const profileInserData = async (fullName, avatar, user_id) => {
  const res = await pool.query(`INSERT INTO profiles (full_name, avatar_url, user_id) VALUES ($1, $2, $3) RETURNING *`, [fullName, avatar, user_id]);
  return res.rows[0];
}

// export const profileUpdate = async (fullname, avatar, user_id) => {
//   const res = await pool.query(`UPDATE profiles SET full_name = $1, avatar_url = $2 WHERE user_id = $3`, [fullname, avatar, user_id]);
//   return res.rows[0]
// }