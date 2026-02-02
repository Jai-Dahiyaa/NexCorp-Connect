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
