import pool from '../db/db.js';

export const profileInserData = async (fullName, avatar, user_id) => {
  const res = await pool.query(
    `INSERT INTO profiles (full_name, avatar_url, user_id) VALUES ($1, $2, $3) RETURNING *`,
    [fullName, avatar, user_id]
  );
  return res.rows[0];
};

export const profileFind = async (user_id) => {
  const res = await pool.query(`SELECT id, user_id FROM profiles WHERE user_id = $1`, [user_id]);
  return res.rows[0];
};

export const profileInsertUserId = async (user_id) => {
  const res = await pool.query(`INSERT INTO profiles (user_id) VALUES ($1) RETURNING id, user_id`, [
    user_id,
  ]);
  console.log('Insert id: ', res.rows[0]);
  return res.rows[0];
};

export const studentBaseProfileFetch = async (user_id, role) => {
  const res = await pool.query(
    `SELECT users.id, profiles.id, users.email, profiles.full_name, profiles.avatar_url, profiles.phone, profiles.bio, profiles.dob,
    profiles.profile_source, profiles.created_at, profiles.updated_at, profiles.course, profiles.year, profiles.college_name
    FROM profiles
    INNER JOIN users
    ON users.id = profiles.user_id
    WHERE users.id = $1 AND users.role = $2;`,
    [user_id, role]
  );
  return res.rows[0];
};
