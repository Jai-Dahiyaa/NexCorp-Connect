import pool from "../db/index.js";

export const insertCommentDB = async (postId, userId, content) => {
    const res = await pool.query(`
        INSERT INTO 
        comments ("postId", "userId", "content") 
        VALUES ($1, $2, $3) 
        RETURNING *;`,
        [postId, userId, content]);
    return res.rows[0];
};

export const deleteCommentDB = async (userId, id) => {
    const res = await pool.query(`
        DELETE FROM comments 
        WHERE "userId" = $1 AND "id" = $2 
        RETURNING *;`, [userId, id]);
    return res.rows[0];
};

export const fetchCommentsDB = async (postId) => {
    const res = await pool.query(`
         SELECT * FROM comments 
         WHERE "postId" = $1 
         ORDER BY "created_at" DESC; 
        `, [postId]);
    return res.rows;
};