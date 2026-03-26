import express from "express";
import signUpController from "../controller/auth/localAuth.controller.js";
import signUpOTPVerifyController from "../controller/auth/AuthVerifyOTP.controller.js";
import roleAssignController from "../controller/auth/roleAssign.controller.js";
import loginController from "../controller/auth/login.controller.js";
import statusChangeController from "../controller/auth/status.controller.js";
import { verifyAccessToken, verifyRefreshToken } from "../middleware/verifyToken.js";
import refreshTokenController from "../controller/auth/refreshToken.controller.js";
import logoutController from "../controller/auth/logout.controller.js";
import forgetPassword from "../controller/auth/forgetPassword.controller.js";
import loginOTPController from "../controller/auth/loginOTP.controller.js";
import { validate } from "../middleware/validate.middlewre.js";
import {
  signUpSchema,
  signUpOTPSchema,
  roleAssignSchema,
  loginSchema,
  statusChangeSchema,
  refreshTokenSchema,
  forgetPasswordSchema,
  forgetOTPVerifySchema,
  resetPasswordSchema,
  loginOTPSendSchema,
  loginOTPVerifySchema,
} from "../validators/auth.validation.js";

const router = express.Router();

/**
 * @swagger
 * /auth/signUp:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with email and password. 
 *                  An OTP is generated and sent to the user's email for verification. 
 *                  Password is temporarily stored in Redis until OTP verification.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jai@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "StrongPass@123"
 *     responses:
 *       200:
 *         description: OTP sent successfully to user's email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Send OTP on your email
 *       400:
 *         description: Email and password are required
 *       401:
 *         description: Payload not created properly
 *       404:
 *         description: Token not generated or user not found
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Server error during signup or OTP generation
 */
router.post("/signUp", validate(signUpSchema), signUpController);

/**
 * @swagger
 * /auth/signUpOTP:
 *   post:
 *     summary: Verify signup OTP
 *     description: Verifies the OTP sent to the user's email during signup. 
 *                  If valid, registers the user and issues an access token stored in cookies.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jai@example.com"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully, user registered and token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: OTP Verify user successfully register
 *                 users:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     email:
 *                       type: string
 *                       example: "jai@example.com"
 *       402:
 *         description: Token not generated
 *       403:
 *         description: Expired or invalid OTP
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error during OTP verification
 */
router.post("/signUpOTP", validate(signUpOTPSchema), signUpOTPVerifyController);

/**
 * @swagger
 * /auth/roleassign:
 *   post:
 *     summary: Assign a role to a user
 *     description: Allows an authenticated user to be assigned a role (e.g., admin, company, user). 
 *                  Requires a valid access token from cookies or Authorization header. 
 *                  Generates new access and refresh tokens, stores refresh token with user agent and IP.
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []   # Access token from cookies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, company, user]
 *                 example: "company"
 *     responses:
 *       200:
 *         description: Role assigned successfully, new tokens issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User Register Sucessfully
 *                 users:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     email:
 *                       type: string
 *                       example: "jai@example.com"
 *                     role:
 *                       type: string
 *                       example: "company"
 *                     provider:
 *                       type: string
 *                       example: "google"
 *       401:
 *         description: Missing or invalid access token
 *       403:
 *         description: Required role not provided
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error during role assignment or token generation
 */
router.post("/roleassign", validate(roleAssignSchema), roleAssignController);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user with email and password. 
 *                  Issues new access and refresh tokens, stores refresh token with user agent and IP, 
 *                  and sets both tokens in cookies.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jai@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "StrongPass@123"
 *     responses:
 *       200:
 *         description: User logged in successfully, tokens issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome Back
 *                 users:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     email:
 *                       type: string
 *                       example: "jai@example.com"
 *                     role:
 *                       type: string
 *                       enum: [admin, company, user]
 *                       example: "user"
 *       401:
 *         description: Missing or invalid refresh token
 *       402:
 *         description: Email and password both required
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error during login or token generation
 */
router.post("/login", validate(loginSchema), loginController);

/**
 * @swagger
 * /auth/statusChange:
 *   post:
 *     summary: Change user status
 *     description: Allows an authenticated user to change their status to either `true` (active) or `false` (inactive). 
 *                  Requires a valid access token from cookies.
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []   # Access token from cookies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [true, false]
 *                 example: true
 *     responses:
 *       200:
 *         description: User status changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User Status SuccessFull Change
 *                 user:
 *                   type: string
 *                   example: "active"
 *       401:
 *         description: Missing or invalid access token
 *       404:
 *         description: Status not provided or user not found
 *       500:
 *         description: Server error during status change
 */
router.post(
  "/statusChange",
  verifyAccessToken,
  validate(statusChangeSchema),
  statusChangeController
);

/**
 * @swagger
 * /auth/refreshToken:
 *   post:
 *     summary: Refresh access token
 *     description: Issues a new access token using a valid refresh token stored in cookies. 
 *                  Requires a valid refresh token. Verifies the token against the database and regenerates a new access token.
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []   # Refresh token from cookies
 *     responses:
 *       200:
 *         description: New access token issued successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: New access token issued
 *       401:
 *         description: Missing or invalid refresh token
 *       404:
 *         description: Refresh token not found in database
 *       500:
 *         description: Server error during token refresh
 */
router.post(
  "/refreshToken",
  verifyRefreshToken,
  validate(refreshTokenSchema),
  refreshTokenController
);

/**
 * @swagger
 * /auth/loggedOut:
 *   post:
 *     summary: User logout
 *     description: Logs out the authenticated user by clearing both access and refresh tokens from cookies. 
 *                  Requires a valid refresh token from cookies to verify and invalidate the session.
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []   # Refresh token from cookies
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: successfully logged out
 *       401:
 *         description: Missing or invalid refresh token
 *       404:
 *         description: Refresh token not found in database
 *       500:
 *         description: Server error during logout
 */
router.post("/loggedOut", verifyAccessToken, logoutController);

/**
 * @swagger
 * /auth/forgetPassword:
 *   post:
 *     summary: Request password reset OTP
 *     description: Sends a one-time password (OTP) to the user's email for password reset. 
 *                  OTP is stored temporarily in Redis and sent via email queue. 
 *                  The OTP must be verified in the next step to reset the password.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jai@example.com"
 *     responses:
 *       200:
 *         description: OTP sent successfully to user's email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: otp send successfully your email
 *       404:
 *         description: Email not provided or user not found
 *       500:
 *         description: Server error during OTP generation or sending
 */
router.post(
  "/forgetPassword",
  validate(forgetPasswordSchema),
  forgetPassword.forgetUserPasswordController
);

/**
 * @swagger
 * /auth/forget-otp-verify:
 *   post:
 *     summary: Verify forget password OTP
 *     description: Verifies the OTP sent to the user's email for password reset. 
 *                  If valid, deletes the OTP from Redis, issues a temporary reset session token, 
 *                  and stores it in cookies for the next step (resetting the password).
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jai@example.com"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully, reset session token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password Reset OTP Verify
 *       403:
 *         description: Invalid or expired OTP
 *       404:
 *         description: Email not provided or OTP not found
 *       500:
 *         description: Server error during OTP verification
 */
router.post(
  "/forget-otp-verify",
  validate(forgetOTPVerifySchema),
  forgetPassword.forgetPaawordOTPVerify
);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     description: Resets the user's password after verifying OTP and session token. 
 *                  Requires a valid reset session cookie issued during OTP verification. 
 *                  Ensures both password fields match before updating the user's password.
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []   # Reset session token from cookies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pass1:
 *                 type: string
 *                 format: password
 *                 example: "NewStrongPass@123"
 *               pass2:
 *                 type: string
 *                 format: password
 *                 example: "NewStrongPass@123"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your password change successfull
 *       403:
 *         description: Invalid or mismatched passwords, missing reset session, or OTP not verified
 *       404:
 *         description: Reset session or email not found
 *       500:
 *         description: Server error during password reset
 */
router.post("/reset-password", validate(resetPasswordSchema), forgetPassword.resetNewUserPassword);

/**
 * @swagger
 * /auth/login-otp:
 *   post:
 *     summary: Send login OTP
 *     description: Sends a one-time password (OTP) to the user's email for login authentication. 
 *                  OTP is stored temporarily in Redis and a login session token is issued in cookies for verification.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jai@example.com"
 *     responses:
 *       200:
 *         description: Login OTP sent successfully to user's email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login OTP send your email Successfully
 *       403:
 *         description: User not found or not registered
 *       404:
 *         description: Email not provided
 *       500:
 *         description: Server error during OTP generation or sending
 */
router.post("/login-otp", validate(loginOTPSendSchema), loginOTPController.loginOTPController);

/**
 * @swagger
 * /auth/otp-login-verify:
 *   post:
 *     summary: Verify login OTP
 *     description: Verifies the OTP sent to the user's email for login. 
 *                  If valid, deletes OTP and login token from Redis, authenticates the user, 
 *                  and issues new access and refresh tokens stored in cookies.
 *     tags:
 *       - Auth
 *     security:
 *       - cookieAuth: []   # Login OTP token from cookies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully, user logged in and tokens issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User Login SuccessFully
 *                 users:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     email:
 *                       type: string
 *                       example: "jai@example.com"
 *                     role:
 *                       type: string
 *                       enum: [admin, company, user]
 *                       example: "user"
 *       401:
 *         description: Missing or invalid refresh token
 *       403:
 *         description: Invalid or expired OTP / token missing
 *       404:
 *         description: Email not found or OTP not generated
 *       500:
 *         description: Server error during OTP verification or token generation
 */
router.post(
  "/otp-login-verify",
  validate(loginOTPVerifySchema),
  loginOTPController.loginOTPuserVerify
);

export default router;
