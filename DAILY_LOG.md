## 2026-01-31
-Add sessions table schema in prisma.schema
-Create sessions.models.js file for sessions service
-Sessions service add in complete localAuth
-Refresh token api code rewirte and clean structure
-Logout api code again rewrite and clean structure

## 2026-02-01
-Learn Socket.io how to config and how work
-Socket.io use for message and notification service
-Planing add load balance service in APIs

## 2026-02-02
- Solved the complete OAuth login flow (find user → check social_login → insert/update → return final object)
- Finalized token system design (role-based mini token + platform-aware token)
- Fixed query errors (parameter binding $1 issue, clarified ON CONFLICT / upsert logic)
- Implemented safe object declaration and key-value update patterns
- Decided profile overwrite strategy (first-time user → store profile, returning user → only update tokens)
- Confirmed final architecture (provider_user_id is stable, role assignment handled through internal DB)

## 2026-02-03
- Added Users, Sessions, Social Login modules
- Implemented Profiles with role-based fields
- Designed Issues, Status Logs, Comments, Uploads, Notifications
- Established schema relations and middleware role extraction plan

## 2026-02-05
- Defined Prisma schema for Posts and Uploads tables
- Established relations: Post ↔ Upload, Post ↔ User (creator + assignee), Upload ↔ User (uploader)
- Resolved ambiguous relation error with proper relation names
- Successfully ran migration without issues
- Created model files for Post and Upload in project structure

# DAILY_LOG - 06 Feb 2026
## Work Done
- Implemented **Normal Post Create API** with Cloudinary integration.
- Multer configured with **diskStorage** to get file path.
- Cloudinary direct upload function added (path-based).
- Successfully inserted post data into DB with image URL.
- Validated request body fields for completeness.
- Discussed and planned **role-based posts** (Normal, Announcement, Project).
- Clarified flow for **Delete/Edit APIs** using post ID from frontend.
- Prepared roadmap for upcoming services: **Notifications** and **Comments**.

## Output Example
```json
{
  "message": "User post successfully create",
  "postInsert": {
    "id": 10,
    "title": "final post create",
    "description": "final description",
    "type": "normal",
    "image": "https://res.cloudinary.com/.../post%20image/qquqo50haxquj4mmk0ol.jpg"
  }
}

# DAILY_LOG - 07 Feb 2026
## Completed
- Added **Post API** to the project.
- Refined controller and service logic:
- Removed unnecessary checks, kept only essential flow.
- Implemented token verification and selective field updates.
- Integrated Cloudinary for image upload in edit flow.
- Tested with token and confirmed updates:
- Single field update works.
- Multiple field updates work.
- Unchanged fields retain old values.
- Response object structured cleanly:

## Output Example
  ```json
  {
    "id": 11,
    "image": "https://res.cloudinary.com/...jpg",
    "title": "code refine",
    "description": "Code refine with rrs",
    "type": "normal"
  }

# Daily Log – 9 Feb 2026 (Planned)

## Planned Tasks
- **Notification Service**
  - Design and finalize notifications table schema.
  - Implement insertNotification function (triggered on post create/edit/delete).
  - Build fetchNotifications API (GET /notifications).
  - Build markAsRead API (PATCH /notifications/:id).
  - Integrate BullMQ queue for async notification insert.
  - Plan Socket.IO integration for real-time push.

## Notes
- Focus on notification service first before comments.
- Ensure schema supports all post types (normal, announcement, project).
- Keep response structure consistent with posts API.


# Daily Log - 9 Feb 2026
- Added Notification model in Prisma schema with relation to Post
- Migrated schema to database
- Updated DB config to use DATABASE_URL for universal connection
- Fixed worker env loading issue by running from project root
- Worker now connects to DB and processes jobs
- Identified foreign key violation on postId when post is deleted
- Next step: adjust relation strategy (Cascade/SetNull) to handle deletes


# Daily Log - 10 Feb 2026
- Configured socket.io with proper connection and join handling
- Fixed server initialization (single config source of truth)
- Worker restricted to DB insert only, emit handled in controller
- Verified notification delivery with test client
- Cleaned architecture for scalable notification pipeline

# Daily Log - 11 Feb 2026
-Finalized Prisma schema for comments table with foreign keys (postId → posts.  id, userId → users.id) and cascade delete
-Added indexing on postId for optimized comment fetch queries
-Structured three core APIs for comment system: Insert (POST), Select (GET), Delete (DELETE)
-Defined query flow for each API using Prisma (create, findMany, delete)
-Prepared architecture for integrating notification system with comment events (similar to delete case with BullMQ + socket emit)

# Daily Log – 12 Feb 2026
-Implemented Prisma schema for comments table with foreign keys (postId → posts.id, userId → users.id) and cascade delete.
-Built three core APIs for comment system:
# Create (POST /comments)
# Fetch (GET /comments/post/:id)
# Delete (DELETE /comments/:id)

-Structured controller + service layer separation for clean architecture.
-Integrated centralized error handling using AppError + middleware, returning JSON format with statusCode, message, timestamp.
-Debugged issue with req.user.id being undefined → fixed by attaching decoded token in middleware.
-Verified that res.rows returns array of comments, not just rows[0].
-Prepared architecture for future notification system integration (BullMQ + Socket.IO emit on comment events).