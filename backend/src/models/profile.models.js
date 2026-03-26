import pool from "../db/index.js";

export const profileInserDataOAuth = async (fullName, avatar, user_id) => {
  const res = await pool.query(
    "INSERT INTO profiles (full_name, avatar_url, user_id) VALUES ($1, $2, $3) RETURNING full_name, avatar_url, user_id",
    [fullName, avatar, user_id]
  );
  return res.rows[0];
};

export const profileFind = async (user_id) => {
  const res = await pool.query("SELECT id, user_id FROM profiles WHERE user_id = $1", [user_id]);
  return res.rows[0];
};

export const profileInsertUserId = async (user_id) => {
  const res = await pool.query("INSERT INTO profiles (user_id) VALUES ($1) RETURNING id, user_id", [
    user_id,
  ]);
  return res.rows[0];
};

export const studentBaseProfileFetch = async (user_id, role) => {
  const res = await pool.query(
    `SELECT users.id AS usersID, profiles.id AS profiles_ID, users.email, users.role, profiles.full_name, profiles.avatar_url, profiles.phone, profiles.bio, profiles.dob,
    profiles.profile_source, profiles.created_at, profiles.updated_at, profiles.course, profiles.year, profiles.college_name
    FROM profiles
    INNER JOIN users
    ON users.id = profiles.user_id
    WHERE users.id = $1 AND users.role = $2;`,
    [user_id, role]
  );
  return res.rows[0];
};

export const companyBaseProfileFetch = async (user_id, role) => {
  const res = await pool.query(
    `SELECT users.id AS usersID, profiles.id AS profiles_ID, users.email, users.role, profiles.company_name, profiles.avatar_url, profiles.phone, profiles.bio,
    profiles.profile_source, profiles.created_at, profiles.updated_at, profiles.industry, profiles.experience_year, profiles.department
    FROM profiles
    INNER JOIN users
    ON users.id = profiles.user_id
    WHERE users.id = $1 AND users.role = $2;`,
    [user_id, role]
  );
  return res.rows[0];
};

export const employeeBaseProfileFetch = async (user_id, role) => {
  const res = await pool.query(
    `SELECT users.id AS usersID, profiles.id AS profiles_ID, users.email, users.role, profiles.full_name, profiles.company_name, profiles.avatar_url, profiles.phone, profiles.bio,
    profiles.dob, profiles.profile_source, profiles.created_at, profiles.updated_at, profiles.industry, profiles.experience_year, profiles.department
    FROM profiles
    INNER JOIN users
    ON users.id = profiles.user_id
    WHERE users.id = $1 AND users.role = $2;`,
    [user_id, role]
  );
  return res.rows[0];
};

export const adminBaseProfileFetch = async (user_id, role) => {
  const res = await pool.query(
    `SELECT users.id AS usersID, profiles.id AS profiles_ID, users.email, users.role, users.status, profiles.full_name, profiles.company_name, profiles.avatar_url, profiles.phone, profiles.bio,
    profiles.created_at, profiles.updated_at, profiles.department
    FROM profiles
    INNER JOIN users
    ON users.id = profiles.user_id
    WHERE users.id = $1 AND users.role = $2;`,
    [user_id, role]
  );
  return res.rows[0];
};

export const advanceFieldUpdate = async (field, bodyData, id) => {
  const res = await pool.query(`UPDATE profiles SET ${field} = $1, updated_at = NOW() WHERE user_id = $2 RETURNING ${field}, updated_at`, [bodyData, id]);
  return res.rows[0];
};

export const advanceFieldNameUpdate = async (field, bodyData, id) => {
  const res = await pool.query(`UPDATE profiles SET ${field} = $1, manual_name_set = 'true' updated_at = NOW() WHERE user_id = $2 RETURNING ${field}, updated_at`, [bodyData, id]);
  return res.rows[0];
};

export const advanceFieldImageUpdate = async (field, bodyData, id) => {
  const res = await pool.query(`UPDATE profiles SET ${field} = $1, manual_image_set = 'true', updated_at = NOW() WHERE user_id = $2 RETURNING ${field}, updated_at`, [bodyData, id]);
  return res.rows[0];
};
