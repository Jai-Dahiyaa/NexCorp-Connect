import { Router } from "express";
import { verifyAccessToken } from "../middleware/verifyToken.js";
import { postControllerFunction, postEditController, deletePostControllerFunc, announcementStatusChangeController, interestProjectController, assignUserProjectController, projectCreateController, projectStatusController } from "../controller/posts/posts.controller.js";
import upload from "../middleware/multerConfig.js";
import authroizeRoles from "../middleware/roleAuthorize.middleware.js";

const router = Router();


/**
 * @swagger
 * /posts/create:
 *   post:
 *     summary: Create a new post
 *     description: Creates a new post with title, description, type, and an optional image upload. 
 *                  Only authenticated users with a valid access token can create posts.
 *     tags:
 *       - Posts
 *     security:
 *       - cookieAuth: []   # Access token from cookies
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My First Project"
 *               description:
 *                 type: string
 *                 example: "This is a demo project description."
 *               type:
 *                 type: string
 *                 example: "project"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image file for the post
 *     responses:
 *       200:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User post successfully create
 *                 postInsert:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: "My First Project"
 *                     description:
 *                       type: string
 *                       example: "This is a demo project description."
 *                     type:
 *                       type: string
 *                       example: "project"
 *                     image:
 *                       type: string
 *                       example: "https://cloudinary.com/demo-image.png"
 *                     status:
 *                       type: string
 *                       enum: [open, in_progress, complete, expired, on_hold]
 *                       example: "open"
 *       400:
 *         description: Missing or invalid access token
 *       404:
 *         description: Required post data missing
 *       500:
 *         description: Post creation failed
 */
router.post("/create", verifyAccessToken, upload.single("image"), postControllerFunction);

/**
 * @swagger
 * /posts/edit/{id}:
 *   patch:
 *     summary: Edit an existing post
 *     description: Allows the creator or assigned user to edit a post's title, description, or image. 
 *                  Requires a valid access token from cookies.
 *     tags:
 *       - Posts
 *     security:
 *       - cookieAuth: []   # Access token from cookies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post to edit
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Project Title"
 *               description:
 *                 type: string
 *                 example: "Updated description of the project."
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional new image file for the post
 *     responses:
 *       200:
 *         description: Post edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post Edit successfully
 *                 postEditResult:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: "Updated Project Title"
 *                     description:
 *                       type: string
 *                       example: "Updated description of the project."
 *                     type:
 *                       type: string
 *                       example: "project"
 *                     image:
 *                       type: string
 *                       example: "https://cloudinary.com/demo-image.png"
 *                     status:
 *                       type: string
 *                       enum: [open, in_progress, complete, expired, on_hold]
 *                       example: "in_progress"
 *       400:
 *         description: Missing or invalid access token
 *       404:
 *         description: Post edit data not provided
 *       500:
 *         description: Post update failed
 */
router.patch("/edit/:id", verifyAccessToken, upload.single("image"), postEditController);

/**
 * @swagger
 * /posts/delete/{id}:
 *   delete:
 *     summary: Delete a post
 *     description: Deletes a post by its ID. Only authenticated users with a valid access token can delete their own posts. 
 *                  After deletion, a notification event is queued for the user.
 *     tags:
 *       - Posts
 *     security:
 *       - cookieAuth: []   # Access token from cookies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the post to delete
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post Delete successfull
 *                 result:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: "My First Project"
 *                     description:
 *                       type: string
 *                       example: "This is a demo project description."
 *                     type:
 *                       type: string
 *                       example: "project"
 *                     image:
 *                       type: string
 *                       example: "https://cloudinary.com/demo-image.png"
 *                     status:
 *                       type: string
 *                       enum: [open, in_progress, complete, expired, on_hold]
 *                       example: "expired"
 *       400:
 *         description: Missing or invalid access token
 *       404:
 *         description: Post not found or deletion failed
 *       500:
 *         description: Server error during deletion
 */
router.delete("/delete/:id", verifyAccessToken, deletePostControllerFunc);

/**
 * @swagger
 * /posts/status-change/{id}:
 *   post:
 *     summary: Change the status of an announcement post
 *     description: Allows the creator or assigned user to change the status of an announcement post. 
 *                  Status can be set to either `expire` or `active`. Requires a valid access token from cookies.
 *     tags:
 *       - Announcements
 *     security:
 *       - cookieAuth: []   # Access token from cookies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the announcement post to change status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [expire, active]
 *                 example: expire
 *     responses:
 *       200:
 *         description: Status changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Status Change successFully
 *                 statusChangeResult:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: "My First Project"
 *                     description:
 *                       type: string
 *                       example: "This is a demo project description."
 *                     type:
 *                       type: string
 *                       example: "announcement"
 *                     image:
 *                       type: string
 *                       example: "https://cloudinary.com/demo-image.png"
 *                     status:
 *                       type: string
 *                       enum: [expire, active]
 *                       example: "active"
 *       400:
 *         description: Missing or invalid access token
 *       404:
 *         description: Status data missing or post not found
 *       500:
 *         description: Server error during status change
 */
router.post("/status-change/:id", verifyAccessToken, announcementStatusChangeController);

/**
 * @swagger
 * /posts/project/{id}/interests:
 *   get:
 *     summary: Add interest to a project
 *     description: Allows an authenticated user to express interest in a project. 
 *                  Requires a valid access token from cookies. Returns the interest record created.
 *     tags:
 *       - Projects
 *     security:
 *       - cookieAuth: []   # Access token from cookies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the project to express interest in
 *     responses:
 *       200:
 *         description: Interest added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Your interest add in this project please wait to connect
 *                 interestResult:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     postId:
 *                       type: integer
 *                       example: 1
 *                     userId:
 *                       type: integer
 *                       example: 5
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-02-15T09:00:00Z"
 *       400:
 *         description: Missing or invalid access token
 *       404:
 *         description: Interest data missing or project not found
 *       500:
 *         description: Server error during interest creation
 */
router.get("/project/:id/interests", verifyAccessToken, interestProjectController);

/**
 * @swagger
 * /posts/project/{id}/assign:
 *   get:
 *     summary: Assign a user to a project
 *     description: Allows an authenticated user to be assigned to a project. 
 *                  Requires a valid access token from cookies. Returns the assignment record created.
 *     tags:
 *       - Projects
 *     security:
 *       - cookieAuth: []   # Access token from cookies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the project to assign the user to
 *     responses:
 *       200:
 *         description: Project assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project assign successfully
 *                 assignProjectResult:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 20
 *                     postId:
 *                       type: integer
 *                       example: 1
 *                     userId:
 *                       type: integer
 *                       example: 7
 *                     assignedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2026-02-15T09:05:00Z"
 *       400:
 *         description: Missing or invalid access token
 *       404:
 *         description: Assignment data missing or project not found
 *       500:
 *         description: Server error during assignment
 */
router.get("/project/:id/assign", verifyAccessToken, assignUserProjectController);

/**
 * @swagger
 * /posts/create-project:
 *   post:
 *     summary: Create a new project
 *     description: Creates a new project with title, description, type, and an optional image upload. 
 *                  Only authenticated users with roles `admin` or `company` can create projects.
 *     tags:
 *       - Projects
 *     security:
 *       - cookieAuth: []   # Access token from cookies
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "AI Backend Development"
 *               description:
 *                 type: string
 *                 example: "Building a scalable backend system using Node.js and Redis."
 *               type:
 *                 type: string
 *                 example: "project"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image file for the project
 *     responses:
 *       200:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User Project successfully create
 *                 projectResult:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 100
 *                     title:
 *                       type: string
 *                       example: "AI Backend Development"
 *                     description:
 *                       type: string
 *                       example: "Building a scalable backend system using Node.js and Redis."
 *                     type:
 *                       type: string
 *                       example: "project"
 *                     image:
 *                       type: string
 *                       example: "https://cloudinary.com/project-image.png"
 *                     status:
 *                       type: string
 *                       enum: [open, in_progress, complete, expired, on_hold]
 *                       example: "open"
 *       400:
 *         description: Missing or invalid access token
 *       404:
 *         description: Required project data missing
 *       500:
 *         description: Project creation failed
 */
router.post("/create-project", verifyAccessToken, authroizeRoles(["admin", "company"]), upload.single("image"), projectCreateController);

/**
 * @swagger
 * /posts/project/{id}/status-change:
 *   post:
 *     summary: Change the status of a project
 *     description: Allows the creator or assigned user to change the status of a project. 
 *                  Valid status values are `open`, `in_progress`, `complete`, `expired`, and `on_hold`. 
 *                  Requires a valid access token from cookies.
 *     tags:
 *       - Projects
 *     security:
 *       - cookieAuth: []   # Access token from cookies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the project to change status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [open, in_progress, complete, expired, on_hold]
 *                 example: in_progress
 *     responses:
 *       200:
 *         description: Project status changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project status change successfully
 *                 projectStatusChangeResult:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 100
 *                     title:
 *                       type: string
 *                       example: "AI Backend Development"
 *                     description:
 *                       type: string
 *                       example: "Building a scalable backend system using Node.js and Redis."
 *                     type:
 *                       type: string
 *                       example: "project"
 *                     image:
 *                       type: string
 *                       example: "https://cloudinary.com/project-image.png"
 *                     status:
 *                       type: string
 *                       enum: [open, in_progress, complete, expired, on_hold]
 *                       example: "in_progress"
 *       400:
 *         description: Missing or invalid access token
 *       402:
 *         description: Invalid status value provided
 *       404:
 *         description: Status object missing or project not found
 *       500:
 *         description: Server error during status change
 */
router.post("/project/:id/status-change", verifyAccessToken, projectStatusController);

export default router;