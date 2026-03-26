import { Router } from "express";
import { commentCreateController, deleteCommentController, fetchCommentController } from "../controller/comments/comments.controller.js";
import { verifyAccessToken } from "../middleware/verifyToken.js";

const router = Router();

/**
 * @swagger
 * /comments/create/{id}:
 *   post:
 *     summary: Create a new comment on a post
 *     description: Allows an authenticated user to add a comment to a specific post. 
 *                  Requires a valid access token from cookies.
 *     tags:
 *       - Comments
 *     security:
 *       - cookieAuth: []   # Access token from cookies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "This project looks amazing, great work!"
 *     responses:
 *       200:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comment Create Successfully
 *                 commentResult:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 15
 *                     postId:
 *                       type: integer
 *                       example: 1
 *                     userId:
 *                       type: integer
 *                       example: 5
 *                     comment:
 *                       type: string
 *                       example: "This project looks amazing, great work!"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-02-15T09:20:00Z"
 *       400:
 *         description: Missing or invalid access token
 *       404:
 *         description: Comment data missing or post not found
 *       500:
 *         description: Server error during comment creation
 */
router.post("/create/:id", verifyAccessToken, commentCreateController);

/**
 * @swagger
 * /comments/delete/{id}:
 *   delete:
 *     summary: Delete a comment
 *     description: Deletes a comment by its ID. Only authenticated users with a valid access token can delete their own comments.
 *     tags:
 *       - Comments
 *     security:
 *       - cookieAuth: []   # Access token from cookies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comment Delete Successfully
 *                 deleteResult:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 15
 *                     postId:
 *                       type: integer
 *                       example: 1
 *                     userId:
 *                       type: integer
 *                       example: 5
 *                     comment:
 *                       type: string
 *                       example: "This project looks amazing, great work!"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-02-15T09:20:00Z"
 *       400:
 *         description: Missing or invalid access token
 *       401:
 *         description: Access token missing or invalid
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error during comment deletion
 */
router.delete("/delete/:id", verifyAccessToken, deleteCommentController);

/**
 * @swagger
 * /comments/post/{id}:
 *   get:
 *     summary: Fetch all comments for a post
 *     description: Retrieves all comments associated with a specific post. 
 *                  Requires a valid access token from cookies.
 *     tags:
 *       - Comments
 *     security:
 *       - cookieAuth: []   # Access token from cookies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post to fetch comments for
 *     responses:
 *       200:
 *         description: Comments fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Comment Fetch Successfully
 *                 fetchResult:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 15
 *                       postId:
 *                         type: integer
 *                         example: 1
 *                       userId:
 *                         type: integer
 *                         example: 5
 *                       comment:
 *                         type: string
 *                         example: "This project looks amazing, great work!"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-02-15T09:20:00Z"
 *       400:
 *         description: Missing or invalid access token
 *       404:
 *         description: Post ID missing or comments not found
 *       500:
 *         description: Server error during comment fetch
 */
router.get("/post/:id", verifyAccessToken, fetchCommentController);

export default router;