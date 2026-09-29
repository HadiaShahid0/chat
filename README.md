# 💬 MERN Real-Time Chat Application

A full-stack real-time chat application built with **React, Node.js, Express, MySQL, Sequelize, Socket.IO, and WebRTC**.

The application provides secure authentication, Google reCAPTCHA protection, email OTP verification, Multi-Factor Authentication (MFA), password recovery, one-to-one real-time messaging, message delivery and seen status, user profile management, real-time audio calling, automated backend testing with Vitest, and interactive API documentation using Swagger/OpenAPI.

---

# 📌 Features

## 🔐 Authentication

* User registration
* User login
* User logout
* JWT-based authentication
* Authentication using HTTP-only cookies
* Password hashing with bcrypt
* Protected API routes
* Logged-in user verification
* Secure password verification
* CAPTCHA protection during registration

---

## 🤖 Google reCAPTCHA

The registration process is protected using **Google reCAPTCHA v2** to help prevent automated bot registrations.

### Features

* Google reCAPTCHA v2 integration
* CAPTCHA token generation on the frontend
* CAPTCHA token verification on the backend
* Google reCAPTCHA API integration
* Invalid CAPTCHA handling
* Missing CAPTCHA token validation
* CAPTCHA verification before registration

### CAPTCHA Flow

```text
User Registration
       │
       ▼
Complete Registration Form
       │
       ▼
Google reCAPTCHA
       │
       ▼
CAPTCHA Token
       │
       ▼
Backend
       │
       ▼
Google reCAPTCHA Verification
       │
    ┌──┴──┐
    │     │
 Invalid  Valid
    │     │
    ▼     ▼
 Error   Continue Registration
```

---

## 📧 Email OTP Verification

The application uses **Nodemailer** to send OTP verification emails.

### Features

* Generate one-time passwords
* Send OTP through email
* Verify email using OTP
* OTP expiration handling
* Invalid OTP validation
* Time-limited verification codes
* Pending registration handling

### Registration OTP Flow

```text
User Registration
       │
       ▼
CAPTCHA Verification
       │
       ▼
Check Existing User
       │
       ▼
Hash Password
       │
       ▼
Create Pending User
       │
       ▼
Generate OTP
       │
       ▼
Send OTP Email
       │
       ▼
User Enters OTP
       │
       ▼
Verify OTP
       │
    ┌──┴──┐
 Invalid  Valid
    │     │
    ▼     ▼
 Error  Create User
          │
          ▼
      Registration Complete
```

---

# 🛡️ Multi-Factor Authentication

The application supports **TOTP-based Multi-Factor Authentication (MFA)** using authenticator applications.

### Features

* Enable MFA
* Generate an authenticator secret
* Generate an `otpauth` URI
* Generate MFA QR code
* Scan QR code using an authenticator application
* Verify authenticator codes
* Disable MFA
* MFA verification during login
* Short-lived MFA JWT
* TOTP-based authentication

Compatible authenticator applications include:

* Google Authenticator
* Microsoft Authenticator
* Authy
* Other TOTP-compatible applications

### MFA Setup

```text
User opens MFA settings
          │
          ▼
POST /api/mfa/setup
          │
          ▼
Generate Secret
          │
          ▼
Generate OTPAuth URI
          │
          ▼
Generate QR Code
          │
          ▼
User scans QR Code
          │
          ▼
Authenticator Application
          │
          ▼
6-Digit TOTP Code
          │
          ▼
POST /api/mfa/verify
          │
          ▼
MFA Enabled
```

### MFA Login

```text
Email + Password
       │
       ▼
Credentials Valid
       │
       ▼
Is MFA Enabled?
       │
    ┌──┴──┐
    │     │
   No    Yes
    │     │
    │     ▼
    │  Generate MFA JWT
    │     │
    │     ▼
    │  User Enters TOTP
    │     │
    │     ▼
    │  Verify MFA JWT
    │     │
    │     ▼
    │  Verify TOTP
    │     │
    └──┬──┘
       │
       ▼
 Generate Normal JWT
       │
       ▼
HTTP-only Cookie
       │
       ▼
Login Successful
```

---

# 🔑 Forgot Password

The application provides a secure password recovery flow using email OTP verification.

### Password Reset Flow

```text
Forgot Password
       │
       ▼
Enter Email
       │
       ▼
Check Email
       │
       ▼
Generate Reset OTP
       │
       ▼
Send OTP Email
       │
       ▼
User Enters OTP
       │
       ▼
Verify OTP
       │
       ▼
Generate Password Reset JWT
       │
       ▼
Create New Password
       │
       ▼
Hash Password with bcrypt
       │
       ▼
Update Password in Database
       │
       ▼
Password Reset Successful
```

### Features

* Forgot-password request
* Password reset OTP generation
* Password reset OTP email
* OTP expiration
* OTP validation
* Short-lived password reset JWT
* Reset token type validation
* New password hashing with bcrypt
* Password update in database

---

# 💬 Real-Time Messaging

* One-to-one chat
* Real-time message sending and receiving
* Socket.IO integration
* Persistent messages in MySQL
* Sequelize ORM
* Message delivery status
* Message seen status
* User-specific Socket.IO rooms
* Chat history
* Real-time updates without refreshing the page

---

# 📞 Real-Time Audio Calling

The application supports **one-to-one real-time audio calling using WebRTC**.

### Features

* One-to-one audio calls
* WebRTC peer-to-peer communication
* Real-time audio streaming
* Call initiation
* Incoming call handling
* Call acceptance
* Call rejection
* Call ending
* Microphone access using the MediaDevices API
* WebRTC offer/answer exchange
* ICE candidate exchange
* Socket.IO-based WebRTC signaling

---

# 👤 User Profile

* View current user profile
* Update profile information
* Upload profile picture
* View other users
* Enable MFA
* Disable MFA

---

# 📚 API Documentation

The backend uses:

* OpenAPI 3.0
* Swagger UI
* swagger-jsdoc
* swagger-ui-express

Swagger documentation includes:

* Authentication APIs
* User APIs
* Message APIs
* MFA APIs
* Password recovery APIs
* Request bodies
* Responses
* HTTP status codes
* Interactive API testing

Swagger UI is available at:

```text
http://localhost:5000/api-docs
```

---

# 🛠️ Tech Stack

## Frontend

| Technology          | Purpose                             |
| ------------------- | ----------------------------------- |
| React               | Frontend user interface             |
| Vite                | Frontend development and build tool |
| React Router        | Client-side routing                 |
| React Icons         | UI icons                            |
| Socket.IO Client    | Real-time communication             |
| WebRTC              | Peer-to-peer audio calling          |
| MediaDevices API    | Microphone access                   |
| Google reCAPTCHA v2 | Bot protection                      |

## Backend

| Technology           | Purpose                                            |
| -------------------- | -------------------------------------------------- |
| Node.js              | Backend runtime                                    |
| Express.js           | REST API                                           |
| MySQL                | Relational database                                |
| Sequelize            | ORM for MySQL                                      |
| Socket.IO            | Real-time communication and WebRTC signaling       |
| JWT                  | Authentication and temporary authentication tokens |
| bcryptjs             | Password hashing                                   |
| Cookie Parser        | Cookie handling                                    |
| Multer               | Profile image uploads                              |
| dotenv               | Environment variables                              |
| Nodemailer           | Email and OTP sending                              |
| otplib               | TOTP/MFA implementation                            |
| qrcode               | MFA QR-code generation                             |
| swagger-jsdoc        | Generate OpenAPI documentation from comments       |
| swagger-ui-express   | Swagger API documentation interface                |
| OpenAPI              | API specification                                  |
| Vitest               | Backend automated testing                          |
| Google reCAPTCHA API | CAPTCHA verification                               |

---

# 📁 Project Structure

```text
chat/
│
├── client/
│   ├── public/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── features/
│   │   ├── routes/
│   │   │   └── appRoutes.jsx
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │
│   │   ├── controllers/
│   │   │   ├── authController/
│   │   │   ├── messageController/
│   │   │   ├── mfaController/
│   │   │   └── userController/
│   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware/
│   │   │   └── uploadMiddleware/
│   │
│   │   ├── models/
│   │   │   ├── userModel.js
│   │   │   ├── messageModel.js
│   │   │   └── pendingUsers.js
│   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── messageRoutes.js
│   │   │   ├── mfaRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   └── index.js
│   │
│   │   ├── services/
│   │   │   ├── authServices.js
│   │   │   ├── captchaService.js
│   │   │   ├── messageServices.js
│   │   │   ├── mfaServices.js
│   │   │   └── userServices.js
│   │
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   ├── socketHelper.js
│   │   │   ├── nodemailer.js
│   │   │   └── swagger.js
│   │
│   │   ├── uploads/
│   │   │   └── profileAvatars/
│   │
│   │   └── index.js
│   │
│   └── package.json
│
├── .gitignore
└── README.md
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/HadiaShahid0/chat.git
```

Move into the project:

```bash
cd chat
```

---

# ⚙️ Backend Setup

Move into the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

---

# 🔑 Environment Variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

JWT_SECRET_KEY=your_jwt_secret

EMAIL=your_email
PASS=your_email_password

RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
```

## Environment Variables

| Variable               | Description                            |
| ---------------------- | -------------------------------------- |
| `PORT`                 | Port on which the backend server runs  |
| `DB_HOST`              | MySQL database host                    |
| `DB_PORT`              | MySQL database port                    |
| `DB_USER`              | MySQL username                         |
| `DB_PASSWORD`          | MySQL password                         |
| `DB_NAME`              | MySQL database name                    |
| `JWT_SECRET_KEY`       | Secret key used for JWT authentication |
| `EMAIL`                | Email address used by Nodemailer       |
| `PASS`                 | Email/SMTP password or app password    |
| `RECAPTCHA_SECRET_KEY` | Google reCAPTCHA secret key            |

> ⚠️ Never commit your `.env` file to GitHub.

---

# 📦 Required Backend Packages

The project uses packages for authentication, email verification, MFA, CAPTCHA, API documentation, database management, and testing.

```bash
npm install bcryptjs jsonwebtoken cookie-parser nodemailer otplib qrcode multer sequelize mysql2 swagger-jsdoc swagger-ui-express
```

For development:

```bash
npm install -D vitest
```

---

# ▶️ Run the Backend

From the `server` directory:

```bash
npm run dev
```

Or:

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

The backend HTTP server is also used by Socket.IO for real-time communication.

---

# 💻 Frontend Setup

Open another terminal and move into the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

---

# ▶️ Run the Frontend

Start the Vite development server:

```bash
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

---

# 🌐 Application Flow

```text
                    ┌──────────────┐
                    │     User     │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   Register   │
                    └──────┬───────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ Google CAPTCHA   │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ Email OTP Verify │
                  └────────┬─────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │     Login    │
                    └──────┬───────┘
                           │
                    ┌──────┴──────┐
                    │             │
                    ▼             ▼
              MFA Disabled    MFA Enabled
                    │             │
                    │             ▼
                    │       Authenticator
                    │          Code
                    │             │
                    └──────┬──────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Application  │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
            Chat        Audio Call    Profile
```

---

# 🔐 Authentication

## Registration

The user provides:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "captchaToken": "captcha-token"
}
```

The registration process:

1. Receives registration information.
2. Verifies the Google reCAPTCHA token.
3. Checks whether the email already exists.
4. Checks for an existing pending registration.
5. Hashes the password using bcrypt.
6. Generates a verification OTP.
7. Creates a pending user record.
8. Sends the OTP through email.
9. User verifies the OTP.
10. The pending user is converted into a verified user account.

---

# 🔑 Login

The user provides:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

The login process:

1. Finds the user by email.
2. Compares the password using bcrypt.
3. Checks whether MFA is enabled.
4. If MFA is disabled, generates a normal JWT.
5. If MFA is enabled, generates a short-lived MFA JWT.
6. The user enters the authenticator code.
7. The MFA JWT and authenticator code are verified.
8. A normal authentication JWT is generated.
9. The JWT is stored in an HTTP-only cookie.

---

# 📧 Email OTP Verification

The application uses **Nodemailer** for email OTP delivery.

## OTP Flow

```text
Register
   │
   ▼
Generate OTP
   │
   ▼
Create Pending User
   │
   ▼
Send OTP Email
   │
   ▼
User Enters OTP
   │
   ▼
Verify OTP
   │
   ├── Invalid ──► Show Error
   │
   ├── Expired ──► Show Error
   │
   └── Valid
         │
         ▼
   Create User Account
```

---

# 🔑 Forgot Password

## Request Reset OTP

```http
POST /api/auth/forgot-password
```

Request:

```json
{
  "email": "john@example.com"
}
```

The backend:

1. Checks whether the email exists.
2. Generates a reset OTP.
3. Stores the OTP and expiration time.
4. Sends the OTP through email.

---

## Verify Reset OTP

```http
POST /api/auth/verify-reset-otp
```

Request:

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

If the OTP is valid, the backend generates a short-lived password-reset JWT.

---

## Reset Password

```http
POST /api/auth/reset-password
```

Request:

```json
{
  "resetToken": "password-reset-jwt",
  "newPassword": "newPassword123"
}
```

The backend:

1. Verifies the reset JWT.
2. Checks the token type.
3. Finds the user.
4. Hashes the new password using bcrypt.
5. Updates the password in MySQL.
6. Returns a successful response.

---

# 🔒 Multi-Factor Authentication

The application implements **TOTP-based MFA** using `otplib`.

## MFA Setup

```text
User opens MFA settings
          │
          ▼
POST /api/mfa/setup
          │
          ▼
Generate Secret
          │
          ▼
Create OTPAuth URL
          │
          ▼
Generate QR Code
          │
          ▼
User scans QR Code
          │
          ▼
Authenticator App
          │
          ▼
Generates 6-digit code
          │
          ▼
POST /api/mfa/verify
          │
          ▼
MFA Enabled
```

---

# 📞 WebRTC Audio Calling

The application supports **one-to-one audio calling using WebRTC**.

WebRTC provides peer-to-peer audio communication between browsers, while Socket.IO acts as the signaling channel.

## Audio Call Architecture

```text
             Socket.IO Signaling

                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
       User A               User B
          │                   │
          │      WebRTC       │
          └─────────┬─────────┘
                    │
                    ▼
             Peer Connection
                    │
                    ▼
             Real-Time Audio
```

---

# 🎙️ Microphone Access

The browser's MediaDevices API is used to request microphone access:

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
});
```

The returned audio stream is added to the WebRTC peer connection.

---

# 🔌 Socket.IO Real-Time Communication

Socket.IO is used for:

* Real-time messaging
* User connection management
* User-specific rooms
* Message delivery events
* Message seen events
* Audio call signaling
* WebRTC offer exchange
* WebRTC answer exchange
* ICE candidate exchange
* Call acceptance
* Call rejection
* Call ending

---

# 📞 WebRTC Signaling

Socket.IO is used as the signaling channel for WebRTC.

```text
Call Request
     │
     ▼
Offer
     │
     ▼
Answer
     │
     ▼
ICE Candidates
     │
     ▼
WebRTC Connection
     │
     ▼
Real-Time Audio
```

The actual audio communication is handled by **WebRTC**, not Socket.IO.

---

# 🖼️ Profile Image Uploads

Profile images are uploaded using **Multer**.

Uploaded images are stored in:

```text
server/src/uploads/profileAvatars/
```

---

# 📚 Swagger API Documentation

The backend uses:

* OpenAPI 3.0
* swagger-jsdoc
* swagger-ui-express

Swagger documentation is generated from comments written above the routes.

## Swagger UI

After starting the backend, open:

```text
http://localhost:5000/api-docs
```

Swagger UI allows developers to:

* View available APIs
* Read API descriptions
* View request bodies
* View response information
* View HTTP status codes
* Test APIs directly from the browser

---

# 🔌 REST API Endpoints

## Authentication

Base URL:

```text
http://localhost:5000/api/auth
```

| Method | Endpoint            | Description                   |
| ------ | ------------------- | ----------------------------- |
| POST   | `/register`         | Register a new user           |
| POST   | `/login`            | Login user                    |
| GET    | `/verify`           | Verify authenticated user     |
| POST   | `/logout`           | Logout user                   |
| POST   | `/verify-otp`       | Verify registration email OTP |
| POST   | `/verify-mfa`       | Verify MFA during login       |
| POST   | `/forgot-password`  | Request password reset OTP    |
| POST   | `/verify-reset-otp` | Verify password reset OTP     |
| POST   | `/reset-password`   | Reset user password           |

---

## Users

Base URL:

```text
http://localhost:5000/api/users
```

| Method | Endpoint         | Description          |
| ------ | ---------------- | -------------------- |
| GET    | `/me`            | Get current user     |
| PUT    | `/profile`       | Update profile       |
| PUT    | `/profile-image` | Upload profile image |
| GET    | `/`              | Get users            |

---

## Messages

Base URL:

```text
http://localhost:5000/api/messages
```

| Method | Endpoint   | Description                    |
| ------ | ---------- | ------------------------------ |
| GET    | `/:userId` | Get messages with another user |

---

## MFA

Base URL:

```text
http://localhost:5000/api/mfa
```

| Method | Endpoint   | Description                              |
| ------ | ---------- | ---------------------------------------- |
| POST   | `/setup`   | Start MFA setup                          |
| POST   | `/verify`  | Verify authenticator code and enable MFA |
| POST   | `/disable` | Disable MFA                              |

---

# 🗄️ Database

The application uses **MySQL** as its relational database and **Sequelize** as the ORM.

## User Model

The user model contains fields such as:

```text
id
name
email
password
profileImage
mfaEnabled
mfaSecret
resetPasswordOtp
resetPasswordOtpExpiredAt
createdAt
updatedAt
```

The email field is unique.

---

## Pending User Model

Pending registrations are temporarily stored before email verification.

```text
id
name
email
password
otp
otpExpiredAt
createdAt
updatedAt
```

After successful OTP verification, the pending user is converted into a regular user account.

---

## Message Model

Messages contain information such as:

```text
id
senderId
receiverId
message
status
createdAt
updatedAt
```

Messages are persisted in MySQL and their delivery/seen status can be updated.

---

# 🧩 Application Architecture

The backend follows a layered architecture:

```text
                    Client

                      │

                      ▼

                   Routes

                      │

                      ▼

                 Controllers

                      │

                      ▼

                   Services

                      │

                      ▼

                   Models

                      │

                      ▼

                 Sequelize

                      │

                      ▼

                    MySQL
```

### Routes

Define API endpoints.

### Controllers

Handle HTTP requests and responses.

### Services

Contain the application's business logic.

### Models

Define Sequelize database models.

### Middleware

Handles authentication and file uploads.

### Utils

Contains reusable functionality such as:

* JWT helpers
* Socket.IO helpers
* Nodemailer configuration
* Swagger configuration

---

# 🔄 Authentication Architecture

```text
React Client
     │
     │ Login / Register
     ▼
Express Route
     │
     ▼
Auth Controller
     │
     ▼
Auth Service
     │
     ├── bcrypt
     │
     ├── Sequelize
     │
     ├── MySQL
     │
     └── JWT
     │
     ▼
HTTP-only Cookie
     │
     ▼
Protected API Requests
```

For MFA-enabled users:

```text
Login
  │
  ▼
Password Verification
  │
  ▼
MFA Enabled?
  │
  ▼
Generate Short-lived MFA JWT
  │
  ▼
Verify Authenticator Code
  │
  ▼
Generate Normal JWT
  │
  ▼
HTTP-only Cookie
```

---

# 💬 Real-Time Chat Architecture

```text
React Client
      │
      │ Socket.IO
      ▼
Socket.IO Server
      │
      ├── User Rooms
      ├── Chat Events
      ├── Message Events
      ├── Delivery Events
      └── Seen Events
      │
      ▼
Message Service
      │
      ▼
Sequelize
      │
      ▼
MySQL
```

---

# 📞 Audio Calling Architecture

```text
React Client
      │
      │ Socket.IO Signaling
      ▼
Socket.IO Server
      │
      ├── Call Request
      ├── Accept / Reject
      ├── WebRTC Offer
      ├── WebRTC Answer
      ├── ICE Candidates
      └── End Call
      │
      ▼
WebRTC Peer Connection
      │
      ├──────────────┐
      ▼              ▼
    User A         User B
      │              │
      └── Audio ─────┘
```

---

# 🤖 CAPTCHA Architecture

```text
React Registration Form
          │
          ▼
Google reCAPTCHA v2
          │
          ▼
CAPTCHA Token
          │
          ▼
Express Backend
          │
          ▼
CAPTCHA Service
          │
          ▼
Google reCAPTCHA API
          │
      ┌───┴────┐
      │        │
    Failed   Success
      │        │
      ▼        ▼
    Error   Registration
```

The CAPTCHA secret key remains on the backend and is never exposed to the React client.

---

# 🔐 Security

The application uses several security mechanisms:

* Password hashing with bcrypt
* JWT authentication
* HTTP-only cookies
* Protected API routes
* Password verification
* TOTP-based MFA
* Short-lived MFA JWT
* Short-lived password reset JWT
* Google reCAPTCHA v2
* OTP expiration
* Authentication middleware
* Environment variables for secrets
* CORS configuration
* Sequelize model validation
* Email OTP verification
* CAPTCHA verification

---

# 🧪 Testing

The backend uses **Vitest** for automated testing.

Testing covers both services and controllers.

### Authentication Testing

* User registration
* Existing email validation
* CAPTCHA verification
* Password hashing
* Email OTP generation
* Email OTP verification
* Invalid OTP handling
* Expired OTP handling
* User login
* Invalid login credentials
* MFA login flow
* User verification
* Logout

### Password Recovery Testing

* Forgot-password success
* Missing email
* Non-existing email
* Password reset email failure
* Reset OTP verification
* Invalid reset OTP
* Expired reset OTP
* Invalid reset token
* Expired reset token
* Password update
* Missing user during password reset

### MFA Testing

* MFA setup
* MFA setup failure
* MFA verification
* Invalid authenticator code
* MFA disable
* MFA login
* Invalid MFA token
* Expired MFA session

### Other Testing

* User services
* User controllers
* Message services
* Message controllers
* Authentication middleware
* Profile operations

Run the tests from the `server` directory:

```bash
npm test
```

If a test watch script is configured:

```bash
npm run test:watch
```

---

# 🧰 Useful Commands

## Client

Install dependencies:

```bash
cd client
npm install
```

Start development server:

```bash
npm run dev
```

Build production application:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

---

## Server

Install dependencies:

```bash
cd server
npm install
```

Start development server:

```bash
npm run dev
```

Start production server:

```bash
npm start
```

Run tests:

```bash
npm test
```

---

# 🚧 Current Development Status

The application currently includes:

* ✅ React frontend
* ✅ Vite
* ✅ Node.js backend
* ✅ Express REST API
* ✅ MySQL
* ✅ Sequelize
* ✅ User registration
* ✅ Google reCAPTCHA v2
* ✅ User login
* ✅ User logout
* ✅ JWT authentication
* ✅ HTTP-only authentication cookies
* ✅ Protected routes
* ✅ Password hashing
* ✅ Email OTP verification
* ✅ Pending registration flow
* ✅ Forgot-password functionality
* ✅ Password reset OTP
* ✅ Password reset JWT
* ✅ Password update and hashing
* ✅ User profile management
* ✅ Profile image upload
* ✅ One-to-one real-time messaging
* ✅ Socket.IO integration
* ✅ Message delivery status
* ✅ Message seen status
* ✅ Multi-Factor Authentication
* ✅ TOTP authentication
* ✅ Authenticator QR-code generation
* ✅ MFA verification
* ✅ MFA disable functionality
* ✅ WebRTC audio calling
* ✅ Peer-to-peer audio communication
* ✅ WebRTC signaling with Socket.IO
* ✅ WebRTC offer/answer exchange
* ✅ ICE candidate exchange
* ✅ Audio call accept/reject/end flow
* ✅ Swagger API documentation
* ✅ OpenAPI 3.0
* ✅ Swagger UI
* ✅ Backend service testing with Vitest
* ✅ Backend controller testing with Vitest

---

# 👩‍💻 Author

## Hadia Shahid

GitHub: Hadia Shahid

Repository: MERN Real-Time Chat Application

---