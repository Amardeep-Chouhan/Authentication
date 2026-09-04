# AuthEngine 🔐

A production-style authentication backend built with **Node.js, Express.js, MongoDB, and JWT**.

AuthEngine implements email OTP verification, password authentication, access/refresh tokens, session management, refresh-token rotation, and multi-device logout.

---

## 🚀 Features

* User registration & login
* Email verification with 6-digit OTP
* OTP hashing before database storage
* OTP expiration with MongoDB TTL
* Password hashing
* JWT access tokens
* JWT refresh tokens
* Refresh-token rotation
* Session management
* Logout from current session
* Logout from all devices
* HTTP-only refresh-token cookies
* Protected user profile endpoint
* Gmail OAuth2 email delivery
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
Send OTP via Email
       ↓
User Submits OTP
       ↓
Hash Submitted OTP
       ↓
Validate Email + OTP Hash + Expiry
       ↓
Mark User as Verified
       ↓
Delete OTP
```

### Login

```text
Email + Password
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

Instead, the OTP is hashed before storage:

```text
OTP: 482913
     ↓
  SHA-256
     ↓
OTP Hash
     ↓
MongoDB
```

Each OTP has an expiration time of **10 minutes**:

```js
expiresAt: new Date(Date.now() + 10 * 60 * 1000)
```

During verification, the API checks that the OTP has not expired:

```js
expiresAt: { $gt: new Date() }
```

MongoDB's TTL index automatically removes expired OTP documents.

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
│   └── env.js
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

server.js
package.json
```

---

## 🧩 Core Components

### `auth.controller.js`

Handles the main authentication operations:

* Registration
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

Uses **Nodemailer with Gmail OAuth2** to send OTP verification emails.

### `utils.js`

Contains reusable OTP utilities:

```js
generateOtp()
getOtpHtml(otp)
```

### `session.model.js`

Stores authentication session information including:

* User
* Refresh-token hash
* IP address
* User agent
* Revocation status

---

## 🛠️ Tech Stack

| Technology   | Purpose               |
| ------------ | --------------------- |
| Node.js      | Runtime               |
| Express.js   | Backend framework     |
| MongoDB      | Database              |
| Mongoose     | MongoDB ODM           |
| JWT          | Authentication tokens |
| Nodemailer   | Email delivery        |
| Gmail OAuth2 | Email authentication  |
| Crypto       | Hashing               |
| JavaScript   | Programming language  |

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

### 2. Navigate to the project

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

| Method | Endpoint         | Description                   |
| ------ | ---------------- | ----------------------------- |
| `POST` | `/register`      | Register a new user           |
| `POST` | `/login`         | Login with email and password |
| `POST` | `/verify-email`  | Verify email using OTP        |
| `GET`  | `/get-me`        | Get authenticated user        |
| `POST` | `/refresh-token` | Refresh access token          |
| `POST` | `/logout`        | Logout current session        |
| `POST` | `/logout-all`    | Logout from all sessions      |

---

## 🔒 Security Concepts

AuthEngine demonstrates several real-world authentication concepts:

* Password hashing
* OTP hashing
* OTP expiration
* MongoDB TTL indexes
* JWT authentication
* Refresh-token rotation
* HTTP-only cookies
* Session management
* Session revocation
* OAuth2 authentication
* Environment-based secrets

---

## 🎯 Project Goal

AuthEngine was built to understand and implement a **production-style authentication architecture** rather than a simple email/password login system.

The project focuses on the complete authentication lifecycle:

```text
Identity
   ↓
Verification
   ↓
Authentication
   ↓
Sessions
   ↓
Tokens
   ↓
Logout
```

---

## 📜 License

This project is intended for learning and personal use.
