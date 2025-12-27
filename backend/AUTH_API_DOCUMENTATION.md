# GearGuard Authentication API Documentation

## Base URL
```
http://localhost:3001/api/auth
```

## Endpoints

### 1. User Signup (Register)
**Endpoint:** `POST /api/auth/signup`

**Description:** Register a new portal user

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

**Validation Rules:**
- `name`: Required, minimum 2 characters
- `email`: Required, must be valid email format, must be unique
- `password`: Required, minimum 8 characters, must contain:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one special character (@$!%*?&)

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "portal"
  }
}
```

**Error Responses:**
- **400 Bad Request** - Validation errors or duplicate email
```json
{
  "success": false,
  "message": "Email Id should not be a duplicate in database"
}
```

---

### 2. User Login
**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "portal"
  }
}
```

**Error Responses:**
- **404 Not Found** - Email not found
```json
{
  "success": false,
  "message": "Account not exist"
}
```

- **401 Unauthorized** - Wrong password
```json
{
  "success": false,
  "message": "Invalid Password"
}
```

---

### 3. Forgot Password
**Endpoint:** `POST /api/auth/forgot-password`

**Description:** Request password reset (validates email exists)

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset instructions sent to your email",
  "email": "john@example.com"
}
```

**Error Responses:**
- **404 Not Found** - Email not found
```json
{
  "success": false,
  "message": "Account not exist"
}
```

---

## Testing with cURL

### Signup
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass@123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass@123"
  }'
```

### Forgot Password
```bash
curl -X POST http://localhost:3001/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

## Security Features

1. **Password Hashing:** All passwords are hashed using bcryptjs with 12 salt rounds
2. **JWT Tokens:** Stateless authentication with 7-day expiration
3. **Input Validation:** Comprehensive validation using express-validator
4. **Role-Based Access:** Signup creates portal users only
5. **Error Handling:** Secure error messages without exposing sensitive data

## Environment Variables

Required in `.env`:
```
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRES_IN=7d
```

## Database Schema

The User model includes:
- `id` (UUID, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password_hash` (String)
- `role` (Enum: admin, manager, technician, portal)
- `created_at` (DateTime)

## Notes

- All signup requests create users with `role='portal'`
- JWT tokens should be stored securely on the client side
- Include the token in subsequent requests using `Authorization: Bearer <token>`
- Password reset functionality is basic - production systems should implement email verification

