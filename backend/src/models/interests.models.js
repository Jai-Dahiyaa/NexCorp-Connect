import pool from "../db/index.js";

export const interestsInsertUser = async (postId, userId) => {
    const res = await pool.query(
       `INSERT INTO interests ("postId", "userId") 
        VALUES ($1, $2) 
        RETURNING *;`,
        [postId, userId]
    );
    return res.rows[0];
};
