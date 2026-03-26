import pool from "../db/index.js";

export const normalUploadInsertDB = async (postId, fileUrl, userId, cloudPath) => {
    const res = await pool.query(`
        INSERT INTO uploads 
        ("postId", "fileUrl", "uploadedByUserId", "cloudPath") 
        VALUES ($1, $2, $3, $4) 
        RETURNING *`, [postId, fileUrl, userId, cloudPath]);
    return res.rows[0];
};

export const uploadImagePostImageEdit = async (image, userId, postId) => {
    const res = await pool.query(`
        UPDATE uploads 
        SET "fileUrl" = $1 
        WHERE "uploadedByUserId" = $2 
        AND "postId" = $3 
        RETURNING "fileUrl"`, [image, userId, postId]);
    return res.rows[0];
};

export const fetchPostUpdateTime = async (userId, postId) => {
    const res = await pool.query(`
        SELECT * FROM uploads 
        WHERE "uploadedByUserId" = $1 
        AND "postId" = $2`, [userId, postId]);
    return res.rows[0];
};

export const deleteUploadFileUrl = async (postId, usersId) => {
    const res = await pool.query(`
        DELETE FROM uploads 
        WHERE "postId" = $1 
        AND "uploadedByUserId" = $2 
        RETURNING "fileUrl";`, [postId, usersId]);
    return res.rows[0];
};