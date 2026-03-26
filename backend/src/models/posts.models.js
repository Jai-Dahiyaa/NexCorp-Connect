import pool from "../db/index.js";

export const normalPostInsertDB = async (userId, title, description, type) => {
    const res = await pool.query(`
        INSERT INTO posts 
        ("createdByUserId", "title", "description", "type", "updatedAt") 
        VALUES ($1, $2, $3, $4, NOW()) 
        RETURNING "id", "createdByUserId", "title", "description", "type", "updatedAt", "createdAt";`, [userId, title, description, type]);
    return res.rows[0];
};

export const postTitleUpdate = async (title, userId, postId) => {
    const res = await pool.query(`
        UPDATE posts 
        SET "title" = $1, "updatedAt" = NOW() 
        WHERE "createdByUserId" = $2 AND "id" = $3 
        RETURNING "id", "createdByUserId", "title", "description", "type", "createdAt", "updatedAt";`, [title, userId, postId]);
    return res.rows[0];
};

export const postDescriptionUpdate = async (description, userId, postId) => {
    const res = await pool.query(`
        UPDATE posts 
        SET "description" = $1, "updatedAt" = NOW() 
        WHERE "createdByUserId" = $2 AND id = $3 
        RETURNING "id", "createdByUserId", "title", "description", "type", "createdAt", "updatedAt";`, [description, userId, postId]);
    return res.rows[0];
};

export const fetchPostData = async (userId, postId) => {
    const res = await pool.query(`
        SELECT * FROM posts 
        WHERE "createdByUserId" = $1 
        AND "id" = $2`, [userId, postId]);
    return res.rows[0];
};

export const deleteUserPostFunc = async (userId, postId) => {
    const res = await pool.query(` 
        UPDATE posts 
        SET "isDeleted" = true 
        WHERE "createdByUserId" = $1 AND "id" = $2 
        RETURNING "id", "title", "description"; `, [userId, postId]);
    return res.rows[0];
};

export const announcementPostCreate = async (userId, title, descripton, type) => {
    const res = await pool.query(`
        INSERT INTO posts 
        ("createdByUserId", "title", "description", "type", "status", "updatedAt") 
        VALUES ($1, $2, $3, $4, 'active', NOW()) 
        RETURNING "id", "title", "description", "type", "createdByUserId", "createdAt", "updatedAt";
        `, [userId, title, descripton, type]);

    return res.rows[0];
};

export const changeAnnouncementStatus = async (status, postId, userId) => {
    const res = await pool.query(`
        UPDATE posts 
        SET "status" = $1 
        WHERE "id" = $2 AND "createdByUserId" = $3 
        RETURNING "status";
        `, [status, postId, userId]);
    return res.rows[0];
};

export const projectPostCreate = async (userId, title, descripton, type) => {
    const res = await pool.query(`
        INSERT INTO posts 
        ("createdByUserId", "title", "description", "type", "status","updatedAt") 
        VALUES ($1, $2, $3, $4, 'active', NOW()) 
        RETURNING "id", "title", "description", "type", "createdByUserId", "assignedToUserId", "createdAt", "updatedAt";
        `, [userId, title, descripton, type]);

    return res.rows[0];
};

export const assignProjectUser = async (assignUserId, postId) => {
    const res = await pool.query(`
        UPDATE posts 
        SET "assignedToUserId" = $1, "updatedAt" = NOW() 
        WHERE "id" = $2 
        RETURNING "assignedToUserId";
        `, [assignUserId, postId]);
    return res.rows[0];
};

export const projectStatusChange = async (Pstatus, userId, postId) => {
    const res = await pool.query(`
        UPDATE posts 
        SET "status" = $1, "updatedAt" = NOW()
        WHERE "id" = $3 
        AND ("createdByUserId" = $2 OR "assignedToUserId" = $2)
        RETURNING "status";
        `, [Pstatus, userId, postId]);
    return res.rows[0];
};