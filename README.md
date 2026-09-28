# 💬 MERN Real-Time Chat Application

A full-stack real-time chat application built with **React, Node.js, Express, MongoDB, Socket.IO, and WebRTC**. The application provides secure authentication, email OTP verification, Multi-Factor Authentication (MFA), one-to-one real-time messaging, message delivery and seen status, user profile management, real-time audio calling, and interactive API documentation using Swagger/OpenAPI.

---

## 📌 Features

### 🔐 Authentication

* User registration
* User login
* User logout
* JWT-based authentication
* Authentication using HTTP-only cookies
* Password hashing with bcrypt
* Protected API routes
* Logged-in user verification
* Secure password verification

### 📧 Email OTP Verification

* Generate a one-time password (OTP)
* Send OTP through email using Nodemailer
* Verify email using OTP
* OTP expiration handling
* Invalid OTP validation
* Time-limited verification codes

### 🛡️ Multi-Factor Authentication

The application supports **TOTP-based Multi-Factor Authentication (MFA)** using an authenticator application.

* Enable MFA from the application
* Generate an authenticator secret
* Generate a QR code for MFA setup
* Scan the QR code using an authenticator application
* Verify authenticator codes
* Disable MFA
* MFA verification during login
* TOTP-based authentication

Compatible authenticator applications include:

* Google Authenticator
* Microsoft Authenticator
* Authy
* Other TOTP-compatible authenticator applications

### 💬 Real-Time Messaging

* One-to-one chat
* Real-time message sending and receiving
* Socket.IO integration
* Persistent messages in MongoDB
* Message delivery status
* Message seen status
* Chat rooms
* User-specific Socket.IO rooms
* Chat history
* Real-time updates without refreshing the page

### 📞 Real-Time Audio Calling

The application supports **one-to-one real-time audio calling using WebRTC**.

* One-to-one audio calls
* WebRTC peer-to-peer communication
* Real-time audio streaming
* Call initiation
* Incoming call handling
* Call acceptance
* Call rejection
* Call ending
* Microphone access using browser MediaDevices API
* WebRTC offer/answer exchange
* ICE candidate exchange
* Socket.IO-based WebRTC signaling

### 👤 User Profile

* View current user profile
* Update profile information
* Upload profile picture
* View other users
* Unable and Disable MFA

### 📚 API Documentation

* OpenAPI 3.0 specification
* Swagger UI
* API endpoint documentation
* Request and response documentation
* Authentication API documentation
* User API documentation
* Message API documentation
* MFA API documentation
* Interactive API testing through Swagger UI

---

# 🛠️ Tech Stack

## Frontend

| Technology       | Purpose                             |
| ---------------- | ----------------------------------- |
| React            | Frontend user interface             |
| Vite             | Frontend development and build tool |
| React Router     | Client-side routing                 |
| React Icons      | UI icons                            |
| Socket.IO Client | Real-time communication             |
| WebRTC           | Peer-to-peer audio calling          |
| MediaDevices API | Microphone access                   |

## Backend

| Technology         | Purpose                                      |
| ------------------ | -------------------------------------------- |
| Node.js            | Backend runtime                              |
| Express.js         | REST API                                     |
| MongoDB            | Database                                     |
| Mongoose           | MongoDB ODM                                  |
| Socket.IO          | Real-time communication and WebRTC signaling |
| WebRTC             | Peer-to-peer audio communication             |
| JWT                | Authentication                               |
| bcryptjs           | Password hashing                             |
| Cookie Parser      | Cookie handling                              |
| Multer             | Profile image uploads                        |
| dotenv             | Environment variables                        |
| Nodemailer         | Email and OTP sending                        |
| otplib             | TOTP/MFA implementation                      |
| qrcode             | MFA QR-code generation                       |
| swagger-jsdoc      | Generate OpenAPI documentation from comments |
| swagger-ui-express | Swagger API documentation interface          |
| OpenAPI            | API specification                            |

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
│   │
│   │   ├── components/
│   │
│   │   ├── features/
│   │
│   │   ├── routes/
│   │   │   └── appRoutes.jsx
│   │
│   │   ├── services/
│   │
│   │
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
│   │   │   └── messageModel.js
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
│   │   │   ├── messageServices.js
│   │   │   ├── mfaServices.js
│   │   │   └── userServices.js
│   │
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   ├── socketHelper.js
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

Open a terminal and move into the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000

DB_HOST=YOUR_DB_HOST
DB_PORT=PORT
DB_USER=your_db_username
DB_PASSWORD= your_db_password
DB_NAME= your_db_name

JWT_SECRET_KEY=your_jwt_secret
SALT_ROUND= number

EMAIL=your_email
PASS=your_email_password
```

### Environment Variables

| Variable         | Description                               |
| ---------------- | ----------------------------------------- |
| `PORT`           | Port on which the backend server runs     |
| `SQL`            | SQL configuration                         |
| `JWT_SECRET_KEY` | Secret key used for JWT authentication    |
| `EMAIL_USER`     | Email address used for sending OTP emails |
| `EMAIL_PASSWORD` | Email/SMTP credential used by Nodemailer  |

> ⚠️ Never commit your `.env` file to GitHub.

---

# 📦 Required Backend Packages

The application uses the following packages for email verification, MFA, and API documentation:

```bash
npm install nodemailer otplib qrcode swagger-jsdoc swagger-ui-express
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

Open another terminal.

From the project root:

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

The main application flow is:

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
                 ┌────────────────────┐
                 │ Email OTP Verify   │
                 └─────────┬──────────┘
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
  "password": "password123"
}
```

The registration process:

1. Checks whether the email already exists.
2. Hashes the password using bcrypt.
3. Creates the user.
4. Generates an OTP.
5. Sends the OTP through email.
6. User verifies the OTP.
7. The account becomes verified.

---

## Login

The user provides:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

The login process:

1. Finds the user by email.
2. Compares the provided password with the hashed password.
3. Checks whether MFA is enabled.
4. If MFA is disabled, authentication is completed.
5. If MFA is enabled, the user must provide an authenticator code.
6. After successful verification, a JWT is generated.
7. The JWT is stored in an HTTP-only cookie.

---

# 📧 Email OTP Verification

The application uses **Nodemailer** to send OTP verification emails.

## OTP Flow

```text
Register
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
   ├── Invalid ──► Show Error
   │
   └── Valid
         │
         ▼
   Account Verified
```

OTP verification includes:

* Random OTP generation
* Email delivery
* OTP expiration
* OTP validation
* Invalid OTP handling

---

# 🔒 Multi-Factor Authentication

The application implements **TOTP-based MFA** using an authenticator application.

## MFA Setup Flow

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

The MFA implementation generates a secret and an `otpauth` URI, which is converted into a QR code that can be scanned by an authenticator application.

---

## MFA Login Flow

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
    │  MFA Code
    │     │
    │     ▼
    │  Verify TOTP
    │     │
    └──┬──┘
       │
       ▼
 Generate JWT
       │
       ▼
 Login Successful
```

---

# 📞 WebRTC Audio Calling

The application supports **one-to-one audio calling using WebRTC**.

WebRTC provides peer-to-peer communication between two browsers, while Socket.IO is used as the signaling mechanism to exchange the information required to establish the connection.

## Audio Call Architecture

```text
             Socket.IO Signaling
                    │
          ┌─────────┴─────────┐
          │                   │
          ▼                   ▼
       User A               User B
          │                   │
          │    WebRTC         │
          └─────────┬─────────┘
                    │
                    ▼
             Peer Connection
                    │
                    ▼
             Real-Time Audio
```

---

## WebRTC Call Flow

```text
Caller
  │
  ▼
Start Audio Call
  │
  ▼
Send Call Request
  │
  │ Socket.IO
  ▼
Receiver
  │
  ├── Reject ──────► Call Ended
  │
  └── Accept
       │
       ▼
Create RTCPeerConnection
       │
       ▼
Get Microphone Stream
       │
       ▼
Create WebRTC Offer
       │
       ▼
Send Offer
       │
       ▼
Receiver Creates Answer
       │
       ▼
Send Answer
       │
       ▼
Exchange ICE Candidates
       │
       ▼
Establish Peer Connection
       │
       ▼
Real-Time Audio
       │
       ▼
End Call
```

---

## Microphone Access

The browser's MediaDevices API is used to access the user's microphone.

```javascript
const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
});
```

The returned audio stream is added to the WebRTC peer connection.

---

## WebRTC Offer

The caller creates an SDP offer:

```javascript
const offer = await peerConnection.createOffer();

await peerConnection.setLocalDescription(offer);
```

The offer is then sent to the receiver through Socket.IO.

---

## WebRTC Answer

The receiver sets the received offer as the remote description and creates an answer:

```javascript
await peerConnection.setRemoteDescription(offer);

const answer = await peerConnection.createAnswer();

await peerConnection.setLocalDescription(answer);
```

The answer is then sent back to the caller through Socket.IO.

---

## ICE Candidate Exchange

WebRTC uses ICE candidates to discover a suitable network path between the two peers.

```javascript
peerConnection.onicecandidate = (event) => {
  if (event.candidate) {
    // Send ICE candidate through Socket.IO
  }
};
```

After the required signaling information is exchanged, the browsers establish the peer-to-peer connection.

---

# 🔌 Socket.IO Real-Time Communication

Socket.IO is used for:

* Real-time messaging
* User connection management
* Chat rooms
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

## Important Socket Events

### `join`

Used when a user joins their personal Socket.IO room.

```javascript
socket.emit("join", userId);
```

---

### `openChat`

Used when a user opens a conversation.

```javascript
socket.emit("openChat", {
  userId,
  otherUserId,
});
```

---

### `closeChat`

Used when a user closes a conversation.

```javascript
socket.emit("closeChat", {
  userId,
  otherUserId,
});
```

---

### `sendMessage`

Used to send a message in real time.

```javascript
socket.emit("sendMessage", {
  senderId,
  receiverId,
  text,
});
```

---

### `receiveMessage`

Used to receive a new message.

```javascript
socket.on("receiveMessage", (message) => {
  // Update chat UI
});
```

---

### `messageSent`

Notifies the sender that the message was successfully saved.

---

### `messageDelivered`

Notifies the sender that the message was delivered to the receiver.

---

### `messagesSeen`

Used when messages have been viewed by the receiver.

---

### `markSeen`

Used to mark messages as seen.

```javascript
socket.emit("markSeen", {
  receiverId,
  senderId,
});
```

---

# 📞 WebRTC Signaling

Socket.IO is used as the signaling channel for WebRTC.

The signaling process exchanges:

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
```

The actual audio communication is handled by **WebRTC**, not Socket.IO.

---

# 🖼️ Profile Image Uploads

Profile images are uploaded using **Multer**.

Uploaded profile images are stored in:

```text
server/src/uploads/profileAvatars/
```

The Express server exposes the uploads directory so that profile images can be accessed by the frontend.

---

# 📚 Swagger API Documentation

The backend uses:

* **OpenAPI 3.0**
* **swagger-jsdoc**
* **swagger-ui-express**

Swagger documentation is generated from API documentation comments written above the routes.

## Swagger UI

After starting the backend, open:

```text
http://localhost:5000/api-docs
```

Swagger UI allows developers to:

* View available APIs
* Read API descriptions
* View request parameters
* View request bodies
* View response schemas
* View HTTP status codes
* Test APIs directly from the browser

---

# 🔌 REST API Endpoints

## Authentication

Base URL:

```text
http://localhost:5000/api/auth
```

| Method | Endpoint      | Description               |
| ------ | ------------- | ------------------------- |
| POST   | `/register`   | Register a new user       |
| POST   | `/login`      | Login user                |
| GET    | `/verify`     | Verify authenticated user |
| POST   | `/logout`     | Logout user               |
| POST   | `/verify-otp` | Verify email OTP          |
| POST   | `/verify-mfa` | Verify MFA during login   |

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

### Setup

```http
POST /api/mfa/setup
```

Requires authentication.

Example response:

```json
{
  "qrCode": "data:image/png;base64,..."
}
```

### Verify MFA Setup

```http
POST /api/mfa/verify
```

Request:

```json
{
  "token": "123456"
}
```

### Disable MFA

```http
POST /api/mfa/disable
```

Requires authentication.

---

# 🗄️ Database

The application uses **MongoDB** with **Mongoose**.

## User

The user model contains information such as:

```text
name
email
password
socketId
profileImage
status
lastSeen
createdAt
updatedAt
```

The email is unique and user records contain timestamps.

---

## Message

Messages contain information such as:

```text
sender
receiver
message
status
createdAt
updatedAt
```

Messages are persisted in MongoDB and their status can be updated when they are delivered or seen.

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
                  MongoDB
```

### Routes

Define API endpoints.

### Controllers

Handle HTTP requests and responses.

### Services

Contain the application's business logic.

### Models

Define MongoDB schemas.

### Middleware

Handles authentication and file uploads.

### Utils

Contains reusable functionality such as:

* JWT helpers
* Socket.IO functionality
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
     ├── MongoDB
     │
     └── JWT
     │
     ▼
HTTP-only Cookie
     │
     ▼
Protected API Requests
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
      │
      ├── Chat Rooms
      │
      ├── Message Events
      │
      └── Delivery/Seen Events
      │
      ▼
Message Service
      │
      ▼
MongoDB
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

# 🔐 Security

The application uses several security mechanisms:

* Password hashing with bcrypt
* JWT authentication
* HTTP-only cookies
* Protected API routes
* Password verification
* TOTP-based MFA
* Environment variables for secrets
* CORS configuration
* Mongoose schema validation
* OTP expiration
* Authentication middleware

### Production Security Recommendations

For production deployment:

* Use HTTPS.
* Enable secure cookies.
* Restrict CORS to trusted frontend origins.
* Use a strong JWT secret.
* Keep database credentials private.
* Keep email credentials private.
* Never expose server secrets to the React client.
* Configure production SMTP credentials securely.

---

# 🧪 Testing

The backend uses **Vitest** for automated testing.

Testing includes service and controller use cases such as:

* User registration
* Existing email validation
* Password hashing
* User login
* Invalid login credentials
* User verification
* Logout
* Current user retrieval
* Profile updates
* Profile image upload handling
* Message operations
* Authentication middleware

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
* ✅ MongoDB
* ✅ Mongoose
* ✅ User registration
* ✅ User login
* ✅ User logout
* ✅ JWT authentication
* ✅ HTTP-only authentication cookies
* ✅ Protected routes
* ✅ Password hashing
* ✅ User profile management
* ✅ Profile image upload
* ✅ One-to-one real-time messaging
* ✅ Socket.IO integration
* ✅ Message delivery status
* ✅ Message seen status
* ✅ Email OTP verification
* ✅ Nodemailer integration
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
* ✅ Backend testing with Vitest

---

# 👩‍💻 Author

## Hadia Shahid

GitHub:

https://github.com/HadiaShahid0

Repository:

https://github.com/HadiaShahid0/chat

---

# ❤️ Acknowledgement

This project was built as a full-stack learning project to practice and demonstrate:

* React
* Vite
* Node.js
* Express.js
* MongoDB
* Mongoose
* REST APIs
* JWT authentication
* bcrypt
* HTTP-only cookies
* Protected routes
* Socket.IO
* WebRTC
* Peer-to-peer communication
* MediaDevices API
* Multer
* Nodemailer
* Email OTP verification
* Multi-Factor Authentication
* TOTP
* QR-code generation
* Swagger
* OpenAPI
* API testing
* Vitest
* Backend architecture
* Real-time application development
