markdown
# 🚀 IssueLog Backend API

A real-world backend system designed to connect students, companies, and business owners on a shared platform for problem-solving, hiring, and collaboration. Built with Node.js, Express, PostgreSQL, and Redis, this project enables secure authentication, role-based access, and scalable issue tracking.

---

## 🎯 Purpose

Many students lack access to real-world platforms where they can showcase their skills. Companies struggle to find the right talent, and business owners often lack technical support to solve operational challenges.

**IssueLog bridges this gap** by allowing:
- 🧑‍🎓 Students to solve real company tasks and gain experience
- 🏢 Companies to post tasks and hire based on performance
- 💼 Business owners to submit problems and get them solved
- 🛡️ Admins to moderate, manage complaints, and maintain platform integrity

---

## 🧱 Tech Stack

| Layer        | Technology              |
|--------------|--------------------------|
| Language     | Node.js (ES Modules)     |
| Framework    | Express.js               |
| Database     | PostgreSQL (`pg`)        |
| Auth         | Passport.js (JWT + OAuth)|
| OAuth        | Google, GitHub, LinkedIn |
| Cache        | Redis                    |
| Validation   | Joi                      |
| Docs         | Swagger JSDoc + YAML     |
| Testing      | Jest + Supertest         |
| Jobs         | Bull + Cron              |
| Security     | Helmet + CORS            |
| Logging      | Winston + Morgan         |
| File Upload  | Cloudinary               |
| Linting      | ESLint + Prettier        |

---

## 🔐 Role-Based Access Control

| Role     | Description |
|----------|-------------|
| `student` | Can register, solve tasks, and collaborate |
| `company` | Can post tasks, review solutions, and hire |
| `admin`   | Can manage users, handle complaints, and moderate platform |

---

## 📂 Folder Structure

backend/ ├── src/ │ ├── routes/ │ ├── controller/ │ ├── services/ │ ├── models/ │ ├── config/ │ ├── validators/ │ └── jobs/ ├── test/ ├── README.md

Code

---

## 🔗 API Endpoints (Core Modules)

| Method | Route                     | Description                  |
|--------|---------------------------|------------------------------|
| POST   | `/signup`                 | Register user with OTP       |
| POST   | `/verify-otp`             | Verify OTP via Redis         |
| POST   | `/assign-role`            | Assign role after verification |
| GET    | `/auth/google`            | Google OAuth login           |
| GET    | `/auth/github`            | GitHub OAuth login           |
| GET    | `/auth/linkedin`          | LinkedIn OAuth login         |
| POST   | `/complaint`              | Submit complaint (student/company) |
| GET    | `/admin/users`            | Admin view all users         |
| DELETE | `/admin/user/:id`         | Admin delete user profile    |

---

## 🧪 Testing Strategy

- ✅ Jest + Supertest for route testing  
- ✅ OTP flow and Redis validation  
- ✅ OAuth callback and token handling  
- ✅ Role-based access test cases (planned)

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Clone the repo
git clone https://github.com/Jai-Dahiyaa/IssueLog.git

# Navigate to backend
cd IssueLog/backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start server
npm run dev

### 🗓️ Daily Sprint Log — 26 Oct

# **🧪 Test Hour (1hr):**
# - [x] /roleassign route test pass
# - [ ] Add invalid role test

# **🛠️ Project Hour (1hr):**
# - [x] OAuth callback cleanup
# - [ ] Add status controller logic

# ⏱️ Total: 2hr | ✅ Progress: On track

