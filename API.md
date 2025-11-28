# ElimuNova API Documentation

This document describes the HTTP API for ElimuNova: endpoints, methods, request/response examples, authentication flow, and error codes.

## Base URL

- Production (replace with your deployed URL): https://api.example.com
- Local (development): http://localhost:3000

## Content type

All request and response bodies are JSON unless otherwise noted. Use header:

Content-Type: application/json

## Authentication

ElimuNova uses JWT bearer tokens for authentication.

1. **Login**  
- **Endpoint**: POST /api/auth/login  
- **Body**:  
  {  
    "email": "user@example.com",  
    "password": "securepassword"  
  }  
- **Success response (200)**:  
  {  
    "accessToken": "<jwt-access-token>",  
    "refreshToken": "<jwt-refresh-token>",  
    "expiresIn": 3600,  
    "user": { "id": "123", "email": "user@example.com", "role": "student" }  
  }  
- **Notes**: accessToken is used in Authorization header: Authorization: Bearer <accessToken>

2. **Refresh token**  
- **Endpoint**: POST /api/auth/refresh  
- **Body (if using body)**: { "refreshToken": "<refresh-token>" }  
- **Success response (200)**: { "accessToken": "<new-access-token>", "expiresIn": 3600 }  
- Alternatively the refresh token may be stored in an HttpOnly cookie; follow server implementation.

3. **Logout**  
- **Endpoint**: POST /api/auth/logout  
- **Body**: none (or { "refreshToken": "<refresh>" } if required)  
- **Success response**: 200 OK

## Endpoints

Note: Replace :id and :courseId, :lessonId with resource IDs.

### Users
- **GET /api/users**  
  - **Description**: List users (admin only)  
  - **Query params**: page, perPage, q (search)  
  - **Response (200)**: { "data": [ {"id","email","role"} ], "meta": {"page":1,"perPage":10,"total":50} }

- **GET /api/users/:id**  
  - **Description**: Get user details  
  - **Response (200)**: { "id": "123", "email": "user@example.com", "role": "student" }

- **POST /api/users**  
  - **Description**: Create/register a user  
  - **Body**: { "email": "user@example.com", "password": "...", "name": "User Name" }  
  - **Response (201)**: { "id": "123", "email": "user@example.com", "name": "User Name" }

- **PUT /api/users/:id**  
  - **Description**: Update user (self or admin)  
  - **Body example**: { "name": "New Name" }  
  - **Response (200)**: updated user object

- **DELETE /api/users/:id**  
  - **Description**: Delete user (admin)  
  - **Response**: 204 No Content

### Courses
- **GET /api/courses**  
  - **Description**: List public courses  
  - **Query params**: page, perPage, q, category  
  - **Response example (200)**:  
    {  
      "data": [ { "id": "c1", "title": "Intro to X", "authorId": "123" } ],  
      "meta": { "page":1, "perPage":10, "total": 12 }  
    }

- **POST /api/courses**  
  - **Description**: Create a course (authenticated instructors/admins)  
  - **Body example**:  
    {  
      "title": "New Course",  
      "description": "Course description",  
      "visibility": "public" // or "private"  
    }  
  - **Response (201)**: created course object

- **GET /api/courses/:id**  
  - **Description**: Get course details including metadata  
  - **Response (200)**: course object with lessons summary

- **PUT /api/courses/:id**  
  - **Description**: Update course  
  - **Response (200)**: updated course object

- **DELETE /api/courses/:id**  
  - **Description**: Delete course  
  - **Response**: 204 No Content

### Lessons
- **GET /api/courses/:courseId/lessons**  
  - **Description**: List lessons for a course  
  - **Response (200)**: { "data": [ {"id":"l1","title":"Lesson 1"} ] }

- **POST /api/courses/:courseId/lessons**  
  - **Description**: Create a lesson in a course  
  - **Body example**:  
    {  
      "title": "Lesson 1",  
      "content": "<p>HTML or markdown content</p>",  
      "order": 1  
    }  
  - **Response (201)**: created lesson object

- **GET /api/lessons/:id**  
  - **Description**: Get lesson detail (content, resources)  
  - **Response (200)**: lesson object

- **PUT /api/lessons/:id**  
  - **Description**: Update lesson  
  - **Response (200)**: updated lesson object

- **DELETE /api/lessons/:id**  
  - **Description**: Delete lesson  
  - **Response**: 204 No Content

### Quizzes & Submissions
- **POST /api/lessons/:lessonId/quizzes**  
  - Create a quiz for a lesson (instructor)  
  - **Body example**:  
    {  
      "title": "Quiz 1",  
      "questions": [ { "text": "Q1?", "type": "multiple_choice", "choices": ["A","B"], "answer": 0 } ]  
    }  
  - **Response (201)**: quiz object

- **GET /api/quizzes/:id**  
  - Get quiz details (questions without answers for students)

- **POST /api/quizzes/:id/submit**  
  - Submit answers  
  - **Body example**:  
    { "answers": [ { "questionId": "q1", "answer": "A" } ] }  
  - **Response (200)**: { "score": 85, "correct": 17, "total": 20, "feedbackUrl": "/submissions/123" }

- **GET /api/users/:userId/submissions**  
  - List user submissions and progress

### Image / File uploads
- Files are typically uploaded via a multipart/form-data endpoint, e.g. POST /api/uploads  
- **Response**: { "url": "https://cdn.example.com/uploads/abcd.png" }

## Request & Response Examples (curl)

1) **Login**

```bash
curl -X POST https://api.example.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

2) **Get courses (public)**

```bash
curl https://api.example.com/api/courses
```

3) **Create a course (authenticated)**

```bash
curl -X POST https://api.example.com/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -d '{"title":"New Course","description":"..."}'
```

## Error codes & response format

ElimuNova uses standard HTTP status codes. Error responses are returned as JSON with a consistent shape.

### Common status codes:
- 200 OK — Successful GET/PUT/POST (non-create)
- 201 Created — Resource created
- 204 No Content — Resource deleted or no content
- 400 Bad Request — Malformed request
- 401 Unauthorized — Missing or invalid authentication
- 403 Forbidden — Authenticated but not authorized
- 404 Not Found — Resource not found
- 422 Unprocessable Entity — Validation error (response contains validation details)
- 429 Too Many Requests — Rate limit exceeded
- 500 Internal Server Error — Unexpected server error

### Error response example (validation)
**Status**: 422

```json
{
  "error": {
    "code": "validation_error",
    "message": "Validation failed",
    "details": {
      "email": "Email is required",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

### Auth error example
**Status**: 401

```json
{
  "error": { "code": "unauthorized", "message": "Authentication required" }
}
```

### Rate limit example
**Status**: 429

```json
{
  "error": { "code": "rate_limited", "message": "Too many requests, try again later" }
}
```

## Best practices & notes

- Always send Content-Type: application/json for JSON endpoints.
- Include Authorization: Bearer <token> for protected endpoints.
- Use pagination for list endpoints (page, perPage).
- Sanitize and validate content on the client and server.
- Use HTTPS in production.

## Versioning

- Consider versioning the API with a prefix (e.g., /api/v1/...) for future breaking changes.
