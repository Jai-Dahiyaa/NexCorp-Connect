import { Router } from "express";
import { findUserProfileController, userProfileDataInsert } from "../controller/profile/getUserProfile.controller.js";
import { verifyAccessToken } from "../middleware/verifyToken.js";
import upload from "../middleware/multerConfig.js";

const router = Router();

/**
 * @swagger
 * /profiles/user:
 *   post:
 *     summary: Fetch user profile
 *     description: Retrieves the authenticated user's profile details based on their access token. 
 *                  Requires a valid access token from cookies.
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []   # Access token from cookies
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User profile fetch
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     name:
 *                       type: string
 *                       example: "Jai Dahiya"
 *                     email:
 *                       type: string
 *                       example: "jai@example.com"
 *                     role:
 *                       type: string
 *                       enum: [admin, company, user]
 *                       example: "user"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-02-15T09:00:00Z"
 *       401:
 *         description: Missing or invalid access token / role not provided
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error during profile fetch
 */
router.post("/user", verifyAccessToken, findUserProfileController);

/**
 * @swagger
 * /profiles/user-data-insert:
 *   patch:
 *     summary: Insert or update user profile data
 *     description: Allows an authenticated user to insert or update their profile data, including optional avatar image upload. 
 *                  Requires a valid access token from cookies.
 *     tags:
 *       - Users
 *     security:
 *       - cookieAuth: []   # Access token from cookies
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jai Dahiya"
 *               email:
 *                 type: string
 *                 example: "jai@example.com"
 *               phone:
 *                 type: string
 *                 example: "+91-9876543210"
 *               bio:
 *                 type: string
 *                 example: "Backend developer passionate about scalable APIs."
 *               avatar_url:
 *                 type: string
 *                 format: binary
 *                 description: Optional avatar image file for the user profile
 *     responses:
 *       200:
 *         description: User profile data inserted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User successfully add
 *                 userDataInsertHere:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     name:
 *                       type: string
 *                       example: "Jai Dahiya"
 *                     email:
 *                       type: string
 *                       example: "jai@example.com"
 *                     role:
 *                       type: string
 *                       enum: [admin, company, user]
 *                       example: "user"
 *                     avatar_url:
 *                       type: string
 *                       example: "https://cloudinary.com/user-avatar.png"
 *                     bio:
 *                       type: string
 *                       example: "Backend developer passionate about scalable APIs."
 *       400:
 *         description: Missing or invalid access token
 *       404:
 *         description: Token missing or user role not found
 *       500:
 *         description: Server error during profile data insert
 */
router.patch("/user-data-insert", verifyAccessToken, upload.single("avatar_url"), userProfileDataInsert);

export default router;