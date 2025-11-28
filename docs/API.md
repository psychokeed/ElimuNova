# API Documentation

This document describes the HTTP API for ElimuNova. It lists endpoints, HTTP methods, request/response examples, authentication flow, and common error codes. Use this as a reference for frontend and third-party integrations.

Base URL

- Local (development): http://localhost:3000/api
- Production: https://<YOUR_PRODUCTION_DOMAIN>/api

Authentication

ElimuNova uses JWT access tokens for authenticated requests and (optionally) refresh tokens to obtain new access tokens.

Authentication flow

1. Client registers or logs in using /api/auth/register or /api/auth/login.
2. Server returns an accessToken (JWT) and optionally a refreshToken.
3. Client includes the accessToken in the Authorization header for protected endpoints: Authorization: Bearer <accessToken>
4. When the access token expires, client can call /api/auth/refresh with the refreshToken to obtain a new access token.
5. On logout, call /api/auth/logout to invalidate the refresh token.

Auth headers

- Authorization: Bearer <accessToken>
- Content-Type: application/json

Endpoints

1) POST /api/auth/register
- Description: Create a new user account.
- Request body (application/json):
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "s3cr3t"
  }
- Success response (201 Created):
  {
    "user": { "id": "user_123", "name": "Jane Doe", "email": "jane@example.com" },
    "accessToken": "<jwt>",
    "refreshToken": "<refresh-token>"
  }
- Errors: 400 (validation), 409 (email already in use)

2) POST /api/auth/login
- Description: Authenticate a user and return tokens.
- Request body:
  {
    "email": "jane@example.com",
    "password": "s3cr3t"
  }
- Success response (200 OK):
  {
    "user": { "id": "user_123", "name": "Jane Doe", "email": "jane@example.com" },
    "accessToken": "<jwt>",
    "refreshToken": "<refresh-token>"
  }
- Errors: 400, 401 (invalid credentials)

3) POST /api/auth/refresh
- Description: Exchange a refresh token for a new access token.
- Request body:
  {
    "refreshToken": "<refresh-token>"
  }
- Success response (200 OK):
  {
    "accessToken": "<new-jwt>",
    "refreshToken": "<new-refresh-token>" // optional
  }
- Errors: 401 (invalid/expired refresh token)

4) POST /api/auth/logout
- Description: Invalidate refresh token / server-side logout.
- Request body:
  {
    "refreshToken": "<refresh-token>"
  }
- Success response (204 No Content)

5) GET /api/courses
- Description: List available courses (public or filtered by query).
- Query params: ?page=1&limit=20&search=algebra
- Success response (200 OK):
  {
    "data": [
      { "id": "course_1", "title": "Math 101", "description": "Intro to math", "authorId": "user_1" }
    ],
    "meta": { "page": 1, "limit": 20, "total": 42 }
  }

6) POST /api/courses  (Protected)
- Description: Create a new course. Requires Authorization header.
- Request body:
  {
    "title": "New Course",
    "description": "Course description",
    "tags": ["math", "algebra"]
  }
- Success response (201 Created):
  { "id": "course_123", "title": "New Course", "description": "Course description", "authorId": "user_123" }
- Errors: 400 (validation), 401 (unauthenticated)

7) GET /api/courses/:id
- Description: Get course details including basic lesson list.
- Success response (200 OK):
  {
    "id": "course_123",
    "title": "New Course",
    "description": "Course description",
    "lessons": [ { "id": "lesson_1", "title": "Lesson one" } ]
  }
- Errors: 404 (not found)

8) PUT /api/courses/:id  (Protected)
- Description: Update a course (owner or admin only).
- Request body: partial or full course object
- Success response (200 OK): updated course object
- Errors: 401, 403 (forbidden), 404

9) DELETE /api/courses/:id  (Protected)
- Description: Delete a course (owner or admin only).
- Success response: 204 No Content
- Errors: 401, 403, 404

10) GET /api/courses/:courseId/lessons
- Description: List lessons for a course
- Success response (200 OK):
  [ { "id": "lesson_1", "title": "Intro", "duration": 300 } ]

11) POST /api/courses/:courseId/lessons  (Protected)
- Description: Add a lesson to a course (author only)
- Request body:
  {
    "title": "Lesson title",
    "content": "<markdown or html>",
    "resources": ["https://..."],
    "duration": 300
  }
- Success response (201 Created): created lesson object

12) GET /api/lessons/:id
- Description: Get a lesson's content
- Success response (200 OK): lesson object with content

13) PUT /api/lessons/:id  (Protected)
14) DELETE /api/lessons/:id  (Protected)

15) GET /api/users/:id/progress  (Protected)
- Description: Get a user's progress for courses/lessons
- Success response (200 OK):
  {
    "userId": "user_123",
    "progress": [
      { "courseId": "course_1", "completedLessons": ["lesson_1", "lesson_2"], "percent": 60 }
    ]
  }

16) PUT /api/users/:id/progress  (Protected)
- Description: Update progress for a user (frontend should call this as user completes a lesson)
- Request body example:
  {
    "courseId": "course_1",
    "lessonId": "lesson_3",
    "completed": true
  }
- Success response (200 OK): updated progress object

Request & Response examples (curl)

Login example:

curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"s3cr3t"}'

Response:

200 OK
{
  "user": { "id": "user_123", "name": "Jane Doe", "email": "jane@example.com" },
  "accessToken": "eyJhbGci...",
  "refreshToken": "rftkn_abc123"
}

Create course example (protected):

curl -X POST "http://localhost:3000/api/courses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <accessToken>" \
  -d '{"title":"New Course","description":"Desc"}'

Response (201 Created):
{
  "id": "course_123",
  "title": "New Course",
  "description": "Desc",
  "authorId": "user_123"
}

Error codes

Standard error response format:
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Detailed human-readable message",
    "details": { "field": "email", "issue": "invalid format" }
  }
}

Common HTTP status codes and causes:
- 200 OK — Successful GET/PUT
- 201 Created — Resource created
- 204 No Content — Successful action with no body (e.g., DELETE)
- 400 Bad Request — Validation failed or malformed request
- 401 Unauthorized — Missing/invalid authentication
- 403 Forbidden — Authenticated but not authorized
- 404 Not Found — Resource does not exist
- 409 Conflict — Uniqueness or state conflict (e.g., email already used)
- 422 Unprocessable Entity — Semantic validation failed
- 500 Internal Server Error — Unexpected server failure

Example error:

400 Bad Request
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload",
    "details": [ { "field": "email", "message": "Email is required" } ]
  }
}

Pagination

Endpoints that return lists support pagination via query params: page (1-based) and limit. Responses include a meta object with total counts.

Rate limiting

If implemented, 429 Too Many Requests may be returned with a Retry-After header.

Versioning

Consider prefixing the API with a version: /api/v1/... for future breaking changes.

Extending this doc

- Replace base URLs with your production domain.
- Add real endpoint paths and schema types (OpenAPI/Swagger) if available.
- Optionally add an OpenAPI spec (swagger.json or YAML) under /docs/openapi.yaml

---

Generated on: 2025-11-28 12:51:03