import { Router } from "express";
import passport from "../config/passport.js";
import oauthController from "../controller/oauth/oauth.controller.js";

const router = Router();

// Google OAuth
/**
 * @swagger
 * /api/v1/oauth/google:
 *   get:
 *     summary: Redirect user to Google OAuth2 login
 *     description: Initiates Google OAuth2 authentication by redirecting the user to Google's login page.
 *     tags:
 *       - OAuth
 *     responses:
 *       302:
 *         description: Redirect to Google login page
 */
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

/**
 * @swagger
 * /api/v1/oauth/google/callback:
 *   get:
 *     summary: Handle Google OAuth2 callback and authenticate user
 *     description: Handles the callback from Google after authentication, verifies the user, issues tokens, and sets access cookies.
 *     tags:
 *       - OAuth
 *     responses:
 *       200:
 *         description: User authenticated via Google and tokens issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Users successfully register
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     email:
 *                       type: string
 *                       example: "jai@example.com"
 *                     provider:
 *                       type: string
 *                       example: "google"
 *       401:
 *         description: Invalid or expired Google token
 *       404:
 *         description: User not found or not registered
 *       500:
 *         description: Server error during Google OAuth
 */
router.get("/google/callback", passport.authenticate("google", { session: false }), oauthController);


// GitHub OAuth
/**
 * @swagger
 * /api/v1/oauth/github:
 *   get:
 *     summary: Redirect user to GitHub OAuth2 login
 *     description: Initiates GitHub OAuth2 authentication by redirecting the user to GitHub's login page.
 *     tags:
 *       - OAuth
 *     responses:
 *       302:
 *         description: Redirect to GitHub login page
 */
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

/**
 * @swagger
 * /api/v1/oauth/github/callback:
 *   get:
 *     summary: Handle GitHub OAuth2 callback and authenticate user
 *     description: Handles the callback from GitHub after authentication, verifies the user, issues tokens, and sets access cookies.
 *     tags:
 *       - OAuth
 *     responses:
 *       200:
 *         description: User authenticated via GitHub and tokens issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Users successfully register
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 7
 *                     email:
 *                       type: string
 *                       example: "jai@example.com"
 *                     provider:
 *                       type: string
 *                       example: "github"
 *       401:
 *         description: Invalid or expired GitHub token
 *       404:
 *         description: User not found or not registered
 *       500:
 *         description: Server error during GitHub OAuth
 */
router.get("/github/callback", passport.authenticate("github", { session: false }), oauthController);


export default router;