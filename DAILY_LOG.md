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

## 2026-02-14

### Project Post Creation (Role-Based Access)

- Implemented Project Post Create API.
- Developed dedicated service layer for project creation logic.
- Built controller function to handle request validation and response structure.
- Added role-based access control:
  - Only Admin and Company roles are allowed to create project posts.
- Created custom role-check middleware function.
- Integrated middleware into route to enforce authorization.
- Ensured clean separation of concerns:
  - Controller → request/response handling
  - Service → business logic
  - Middleware → role validation
- Validated request body and ensured proper error handling for unauthorized access.
- Structured consistent JSON response format for successful project creation.
- Maintained scalability for future role expansion.

## 2026-02-15

### API Documentation with Swagger

- Integrated Swagger for complete API documentation.
- Documented all existing endpoints with:
  - Route path
  - HTTP method
  - Request body schema
  - Query parameters
  - Path parameters
  - Response structure
  - Status codes
- Structured tags for modular clarity (Auth, Posts, Projects, Comments, Notifications).
- Added example request and response payloads.
- Improved API readability and testing workflow.
- Verified Swagger UI rendering and endpoint validation.

### Security & Architecture Review

- Identified potential vulnerability areas in:
  - Role-based access control enforcement.
  - Request body validation gaps.
  - Unauthorized access edge cases.
- Reviewed middleware flow to ensure:
  - Proper token verification
  - Role validation before service execution
- Marked improvement areas for:
  - Input sanitization
  - Error message standardization
  - Better status code usage

### Improvements in Codebase

- Strengthened API structure consistency.
- Improved route-level authorization clarity.
- Enhanced documentation for maintainability and onboarding.

### Architecture Improvements

- Strengthened RBAC (Role-Based Access Control) implementation.
- Improved modular structure for better maintainability.
- Ensured secure project creation flow aligned with system permissions.


## 2026-02-16

### API Security & Response Structure Improvement

- Planned implementation to hash database ID before sending it in API responses.
- Decided to avoid exposing raw database IDs to the client side.
- Researched secure hashing approaches for masking identifiers.
- Designed strategy to integrate hashed ID transformation inside response layer.

- Planned and prepared to implement rate limiting middleware.
- Target: Prevent brute force attacks and API abuse.
- Decided to apply rate limiting at route level for sensitive endpoints.
- Ensured middleware-based scalable approach for future security extensions.

- Improved API response structure standardization.
- Added `status` field in successful responses.
- Defined consistent JSON format for both success and error cases.
- Ensured cleaner controller-level response handling.

- Studied basic website attack concepts:
  - SQL Injection
  - XSS (Cross-Site Scripting)
  - Brute Force Attacks
  - Basic Denial-of-Service patterns
- Identified backend security improvement areas based on attack study.
- Planned to strengthen validation and protection mechanisms accordingly.

- Focused on production-level backend mindset.
- Emphasized clean architecture and scalable security practices.

## 2026-02-17

### Database Security, UUID Strategy & Injection Prevention

- Studied why exposing incremental database IDs can create security risks.
- Decided to prefer UUID instead of auto-increment integer IDs in PostgreSQL.
- Understood that UUIDs are non-predictable and safer for public APIs.
- Researched advantages of UUID in distributed and microservice-based systems.
- Planned to use UUID as primary key with default generation at database level.

- Explored PostgreSQL UUID extension setup.
- Reviewed how to enable `uuid-ossp` extension.
- Designed table structure using UUID as PRIMARY KEY.
- Ensured future scalability and uniqueness across services.

- Deeply studied SQL Injection attack mechanism.
- Understood how raw string concatenation in queries creates vulnerability.
- Reviewed real-world injection examples and exploitation patterns.
- Identified high-risk areas in login and search queries.
- Planned strict use of parameterized queries and prepared statements.
- Decided to enforce validation layer before database interaction.

- Studied rate limiting concepts for API protection.
- Learned different algorithms:
  - Fixed Window
  - Sliding Window
  - Token Bucket
- Planned middleware-based rate limiting implementation.
- Target: Protect authentication and sensitive endpoints.
- Ensured scalable design for future Redis-based distributed rate limiting.

- Strengthened backend security mindset.
- Focused on secure-by-default architecture decisions.
- Emphasized production-level thinking instead of only feature implementation.
- Improved understanding of how small security decisions impact system safety.

## 2026-02-18

### AppError Refactor & Cloudinary Upload Implementation

- Refactored AppError utility file structure.
- Simplified constructor and improved error handling design.
- Cleaned up unnecessary code for better maintainability.

- Implemented path-wise image upload in Cloudinary.
- Added dynamic folder structure support.
- Improved organization and reusability of upload utility.

- Maintained structured commit format (REFECTOR, FEAT).
- Focused on clean and scalable backend architecture.

## 2026-02-21  

### Redis Rate Limiting, Cluster Setup & PM2 Integration  

- Implemented Redis-based rate limiting mechanism.  
- Combined Redis-backed limiter with normal in-memory rate limiting logic.  
- Optimized request throttling to handle high concurrency efficiently.  

- Manually configured Node.js cluster mode to utilize multi-core CPU architecture.  
- Improved application scalability and load distribution across worker processes.  
- Added proper worker restart handling for fault tolerance.  

- Installed and configured PM2 process manager.  
- Enabled process monitoring and automatic restarts.  
- Prepared production-ready setup with cluster compatibility.  

- Maintained structured commit format (FEAT, CONFIG).  
- Focused on backend scalability, performance, and production deployment readiness.

## 2026-02-25  

### ESLint Setup, Rate Limiting Middleware & Git CLI Practice  

- Configured ESLint with proper Node.js environment and custom rule definitions.  
- Enforced consistent code style and improved error detection across backend modules.  
- Resolved linting issues to maintain clean and production-ready codebase.  

- Implemented centralized rate limiting using dedicated middleware.  
- Applied middleware at application level for API protection.  
- Maintained clean separation of concerns between routes and middleware layer.  

- Practiced Git command-line workflow in depth.  
- Improved understanding of staging, branching, rebasing, and commit structuring.  
- Strengthened version control practices for scalable development.  

- Maintained structured commit format (FEAT, CONFIG, CHORE).  
- Focused on backend stability, maintainability, and development discipline.  

## 2026-02-26  

### Test Database Setup, Prisma Migration Fix & Project Cleanup  

- Diagnosed and resolved Prisma migration permission errors in local test database.  
- Identified schema-level permission issue (`public` schema) in PostgreSQL.  
- Switched database context properly before dropping active database.  
- Recreated test database with correct ownership to ensure migration compatibility.  

- Successfully executed fresh Prisma migration after database reset.  
- Verified proper schema generation and migration persistence.  
- Ensured separation between production and test database environments.  

- Removed unnecessary `prisma.config.ts` file to restore default environment variable loading.  
- Fixed `DATABASE_URL` resolution issue by relying on `.env` configuration.  
- Cleaned up redundant TypeScript setup (removed `tsconfig.json` from JS-based backend).  
- Clarified project architecture: Node.js + Express (JavaScript) with Prisma ORM.  

- Strengthened understanding of PostgreSQL roles, schema permissions, and database ownership.  
- Improved debugging workflow across Prisma, TypeScript, and PostgreSQL layers.  
- Maintained clean development environment and configuration discipline.  


## 2026-02-27  

### Signup & OTP Verification API Testing + Jest Configuration + DB Environment Handling  

- Implemented test cases for Signup API.  
- Covered success case (valid user creation).  
- Covered failure cases (duplicate email, invalid payload validation).  
- Ensured proper response structure and status code validation.  

- Wrote comprehensive test cases for OTP Verification API.  
- Validated correct OTP flow.  
- Tested invalid OTP scenario handling.  
- Tested expired OTP logic (where applicable).  
- Verified database state changes after successful verification.  

- Introduced centralized `db/index.js` configuration.  
- Implemented environment-based database switching logic.  
- Configured system to use **test database** when running test command.  
- Ensured main database remains untouched during testing.  
- Improved isolation between development and testing environments.  

- Configured Jest testing framework.  
- Set up test environment configuration.  
- Integrated Jest with project structure.  
- Ensured proper test execution via npm scripts.  
- Verified test database connection during test runs.  

- Strengthened understanding of test-driven backend workflow.  
- Improved API validation and error-handling testing patterns.  
- Enhanced knowledge of environment-based configuration management.  
- Maintained clean backend architecture with controlled DB usage during testing.  

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
