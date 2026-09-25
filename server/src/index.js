import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import routes from "./routes/index.js";
import socketHelper from "./utils/socketHelper.js";

import "./models/index.js";
import sequelize from "./config/db.js";

import { swaggerUiServe, swaggerUiSetup } from "./utils/swagger.js";

const app = express();

// Connect MongoDB

// Connect to MySQL
try {
  await sequelize.authenticate();

  console.log("MySQL connected successfully.");

  // Create/update tables
  await sequelize.sync();

  console.log("Database synchronized.");
} catch (error) {
  console.error("Database connection failed:", error);
}

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO
const io = socketHelper(server);

// Make io available in controllers
app.set("io", io);

// Middleware
app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/api-docs", swaggerUiServe, swaggerUiSetup);
// Static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "src/uploads")));

// Routes
routes(app);

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
