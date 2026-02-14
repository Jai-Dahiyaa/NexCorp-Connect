# NexCorp Connect - Backend Development Log

Project Type: Scalable Backend System  
Tech Stack: Node.js, Express.js, Prisma ORM, PostgreSQL, Socket.IO, BullMQ, Cloudinary  

---

## 2026-01-31

- Designed and implemented Sessions table schema in Prisma.
- Created sessions.model.js for session service abstraction.
- Integrated session management into Local Authentication module.
- Refactored Refresh Token API with improved structure and clarity.
- Rewrote Logout API with clean token invalidation logic.

---

## 2026-02-01

- Studied and configured Socket.IO fundamentals.
- Planned real-time messaging and notification architecture.
- Researched load balancing strategies for scalable API deployment.

---

## 2026-02-02

- Implemented complete OAuth login flow:
  - Find user
  - Validate social login
  - Insert or update logic
  - Return structured response
- Finalized token system design:
  - Role-based mini token
  - Platform-aware token handling
- Fixed raw query parameter binding issue ($1).
- Clarified ON CONFLICT / upsert logic.
- Implemented safe object mutation patterns.
- Defined profile overwrite strategy:
  - First-time user → store profile
  - Returning user → update tokens only
- Finalized authentication architecture.

---

## 2026-02-03

- Added core modules:
  - Users
  - Sessions
  - Social Login
- Implemented role-based profile system.
- Designed relational schema for:
  - Issues
  - Status Logs
  - Comments
  - Uploads
  - Notifications
- Planned middleware-based role extraction.

---

## 2026-02-05

- Defined Prisma schema for Posts and Uploads.
- Established relations:
  - Post ↔ Upload
  - Post ↔ User (creator and assignee)
  - Upload ↔ User (uploader)
- Resolved ambiguous relation errors with named relations.
- Successfully executed database migration.
- Structured model layer for Post and Upload.

---

## 2026-02-06

### Post Creation System

- Implemented Normal Post Create API.
- Configured Multer using diskStorage.
- Integrated Cloudinary with path-based direct upload.
- Inserted post data into database with image URL.
- Added request body validation.
- Designed role-based post types:
  - Normal
  - Announcement
  - Project
- Defined Delete and Edit flow using Post ID.
- Planned Notification and Comment services.

---

## 2026-02-07

### Post Update System

- Refined Post controller and service layer.
- Removed unnecessary validations.
- Implemented selective field updates.
- Integrated Cloudinary into edit workflow.
- Verified:
  - Single field update
  - Multiple field updates
  - Safe retention of unchanged fields
- Structured clean JSON response format.

---

## 2026-02-09

### Notification System (Phase 1)

- Designed Notifications table schema.
- Implemented insertNotification logic.
- Built APIs:
  - GET /notifications
  - PATCH /notifications/:id
- Integrated BullMQ for asynchronous notification processing.
- Planned Socket.IO real-time push integration.

### Worker and Database Stability

- Migrated updated schema successfully.
- Standardized DATABASE_URL configuration.
- Fixed worker environment loading issue.
- Identified foreign key violation when post is deleted.
- Planned cascade or setNull strategy for delete handling.

---

## 2026-02-10

### Real-Time Notification Pipeline

- Configured Socket.IO with proper connection and join handling.
- Centralized server initialization (single configuration source).
- Restricted Worker responsibility to DB insert only.
- Moved real-time emit logic to controller layer.
- Verified notification delivery using test client.
- Cleaned and optimized notification architecture for scalability.

---

## 2026-02-11

### Comment System Design

- Finalized Prisma schema for comments table:
  - postId → posts.id
  - userId → users.id
  - Cascade delete enabled
- Added indexing on postId for optimized queries.
- Designed APIs:
  - Insert (POST)
  - Fetch (GET)
  - Delete (DELETE)
- Defined Prisma query flow:
  - create
  - findMany
  - delete
- Planned integration with notification system using BullMQ and Socket emit.

---

## 2026-02-12

### Comment System Implementation

- Implemented Comments table with foreign keys and cascade delete.
- Built core APIs:
  - POST /comments
  - GET /comments/post/:id
  - DELETE /comments/:id
- Applied controller and service layer separation.
- Integrated centralized error handling using AppError middleware.
- Fixed issue with undefined req.user.id by attaching decoded token in middleware.
- Verified array-based comment response handling.
- Prepared architecture for notification triggers on comment events.

---

## 2026-02-13

### Advanced Post Features

- Added Interest table with Post-User relation.
- Implemented Announcement:
  - Create
  - Status update
- Implemented Project workflow:
  - Create project
  - Assign user
  - Manage status transitions
- Integrated Interest system for project participants.
- Added ownership validation in queries.
- Cleaned structured response handling.

---

# Architectural Highlights

- Layered architecture (Controller → Service → Database)
- Prisma ORM with strong relational integrity
- Role-based authentication and token strategy
- OAuth integration
- Asynchronous job queue using BullMQ
- Real-time notification system with Socket.IO
- Cloudinary integration for media storage
- Centralized error handling middleware
- Scalable modular backend design
