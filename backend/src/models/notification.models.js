import pool from "../db/index.js";

export const deletePostNotification = async (userId, postId, actionType, message) => {

    const res = await pool.query(
        `INSERT INTO notifications 
         ("userId", "postId", "actionType", "message") 
         VALUES 
         ($1, $2, $3, $4) RETURNING *;`,
        [userId, postId, actionType, message]
    );
    return res.rows[0];

};