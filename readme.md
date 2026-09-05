# AuthEngine 🔐

A production-style authentication backend built with **Node.js, Express.js, MongoDB, and JWT**, focused on secure authentication, email verification, session management, and token security.

---

## 🚀 Features

* User registration & login
* Email verification with 6-digit OTP
* SHA-256 OTP hashing
* 10-minute OTP expiration
* MongoDB TTL-based OTP cleanup
* OTP verification rate limiting
* Authentication endpoint rate limiting
* Password hashing
* JWT access & refresh tokens
* Refresh-token rotation
* Session management
* Logout from current session
* Logout from all devices
* HTTP-only refresh-token cookies
* Gmail OAuth2 email delivery
* Protected user profile endpoint
* Environment-based configuration

---

## 🔐 Authentication Flow

### Registration & Email Verification

```text
User Registration
       ↓
Create User
       ↓
Generate 6-Digit OTP
       ↓
Hash OTP
       ↓
Store OTP Hash + User + Email + Expiry
       ↓
Send OTP via Gmail
       ↓
User Submits OTP
       ↓
Rate Limit Check
       ↓
Hash Submitted OTP
       ↓
Validate Email + OTP Hash + Expiry
       ↓
Mark User as Verified
       ↓
Delete OTP
```

### Login Flow

```text
Email + Password
       ↓
Rate Limit Check
       ↓
Find User
       ↓
Check Email Verification
       ↓
Hash Password
       ↓
Validate Password
       ↓
Generate Access Token
       ↓
Generate Refresh Token
       ↓
Create Session
       ↓
Return Access Token
+ HTTP-Only Refresh Token Cookie
```

---

## 🛡️ OTP Security

OTP codes are **never stored directly** in MongoDB.

The OTP is hashed before storage:

```text
OTP: 482913
     ↓
  SHA-256
     ↓
OTP Hash
     ↓
MongoDB
```

Each OTP is valid for **10 minutes**:

```js
expiresAt: new Date(Date.now() + 10 * 60 * 1000)
```

During verification, the API checks that the OTP has not expired:

```js
expiresAt: { $gt: new Date() }
```

MongoDB's TTL index automatically removes expired OTP documents.

### OTP Rate Limiting

OTP verification is protected with a stricter rate limit:

```text
5 attempts / 10 minutes
```

This helps reduce brute-force attempts against the 6-digit OTP.

---

## 🚦 Rate Limiting

Authentication endpoints are protected using `express-rate-limit`.

### Authentication Limiter

```text
10 requests / 15 minutes
```

Applied to:

* Registration
* Login
* Refresh token

### OTP Limiter

```text
5 requests / 10 minutes
```

Applied to:

* Email verification

When the limit is exceeded, the API returns a `429 Too Many Requests` response.

---

## 🔑 Token Architecture

AuthEngine uses two JWT tokens.

### Access Token

* Short-lived
* Expires in 15 minutes
* Used to access protected resources

### Refresh Token

* Expires in 7 days
* Stored in an HTTP-only cookie
* Used to generate new access tokens
* Stored as a SHA-256 hash in the database

### Refresh Token Rotation

```text
Refresh Token
      ↓
Verify Token
      ↓
Hash Token
      ↓
Find Active Session
      ↓
Generate New Access Token
      ↓
Generate New Refresh Token
      ↓
Replace Stored Token Hash
```

---

## 📁 Project Structure

```text
src/
├── config/
│   └── config.js
│
├── controllers/
│   └── auth.controller.js
│
├── lib/
│   ├── db.js
│   └── env.js
│
├── middleware/
│   └── rateLimiter.js
│
├── models/
│   ├── user.model.js
│   ├── otp.model.js
│   └── session.model.js
│
├── routes/
│   └── auth.routes.js
│
├── services/
│   └── email.service.js
│
└── utils/
    └── utils.js

app.js
server.js
package.json
```

---

## 🧩 Core Components

### `auth.controller.js`

Handles:

* User registration
* Login
* Email verification
* Get current user
* Refresh token
* Logout
* Logout from all devices

### `otp.model.js`

Stores OTP information:

```text
email
user
otpHash
expiresAt
createdAt
updatedAt
```

### `email.service.js`

Uses **Nodemailer + Gmail OAuth2** to send OTP verification emails.

### `utils.js`

Contains reusable OTP utilities:

```js
generateOtp()
getOtpHtml(otp)
```

### `rateLimiter.js`

Provides separate rate-limit policies for authentication and OTP verification.

### `session.model.js`

Stores authentication session information including:

* User
* Refresh-token hash
* IP address
* User agent
* Revocation status

---

## 🛠️ Tech Stack

| Technology         | Purpose              |
| ------------------ | -------------------- |
| Node.js            | Runtime              |
| Express.js         | Backend framework    |
| MongoDB            | Database             |
| Mongoose           | MongoDB ODM          |
| JWT                | Authentication       |
| Nodemailer         | Email delivery       |
| Gmail OAuth2       | Email authentication |
| Crypto             | Hashing              |
| Express Rate Limit | API abuse protection |
| JavaScript         | Programming language |

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GOOGLE_USER=your_email@gmail.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REFRESH_TOKEN=your_google_refresh_token
```

> **Never commit your `.env` file to GitHub.**

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/auth-engine.git
```

### 2. Navigate into the project

```bash
cd auth-engine
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file and add the required credentials.

### 5. Start the development server

```bash
npm run dev
```

---

## 🔌 API Endpoints

| Method | Endpoint                  | Description                   |
| ------ | ------------------------- | ----------------------------- |
| `POST` | `/api/auth/register`      | Register a new user           |
| `POST` | `/api/auth/login`         | Login with email and password |
| `POST` | `/api/auth/verify-email`  | Verify email using OTP        |
| `GET`  | `/api/auth/get-me`        | Get authenticated user        |
| `GET`  | `/api/auth/refresh-token` | Refresh access token          |
| `GET`  | `/api/auth/logout`        | Logout current session        |
| `GET`  | `/api/auth/logout-all`    | Logout from all sessions      |

---

## 🧪 API Testing

The authentication APIs were tested using **Postman**.

Tested flows include:

* User registration
* Email OTP verification
* Invalid OTP handling
* Expired OTP handling
* Login
* Accessing authenticated user data
* Access token refresh
* Logout
* Logout from all devices
* Rate-limit behavior

A Postman collection can be imported to reproduce the API tests.

---

## 🔒 Security Concepts

AuthEngine demonstrates practical backend security concepts including:

* Password hashing
* OTP hashing
* OTP expiration
* MongoDB TTL indexes
* OTP brute-force protection
* API rate limiting
* JWT authentication
* Refresh-token rotation
* HTTP-only cookies
* Session management
* Session revocation
* Gmail OAuth2 authentication
* Environment-based secrets

---

## 🎯 Project Goal

AuthEngine was built to understand and implement a **production-style authentication architecture** rather than a basic email/password login system.

The project covers the complete authentication lifecycle:

```text
Identity
   ↓
Email Verification
   ↓
Authentication
   ↓
Session Creation
   ↓
Token Management
   ↓
Token Refresh
   ↓
Logout
```

---

## 📌 Future Improvements

* Password reset flow
* OTP resend with cooldown
* Password hashing with Argon2id
* Centralized error handling
* Request validation with Zod
* Redis-backed rate limiting
* Refresh-token reuse detection
* API documentation with Swagger/OpenAPI

---

## 📜 License

This project is intended for learning and personal use.
