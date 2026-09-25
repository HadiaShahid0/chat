import express from "express";

import protect from "../middleware/authMiddleware/authMiddleware.js";

import { createMulter } from "../middleware/uploadMiddleware/multer.js";

import {
  getCurrentUser,
  updateProfile,
  uploadProfileImage,
  getAllUsers,
} from "../controllers/userController/userController.js";

const router = express.Router();

const upload = createMulter("profileAvatars");

/**
 * @swagger
 * /api/users/me:
 *    get:
 *      summary: Get Current logged-in user
 *      tags:
 *        - Users

 *      responses:
 *        200:
 *          description: Successfully get the logged-in user
 *        401:
 *          description: Unauthorized
 */
router.get("/me", protect, getCurrentUser);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: User Updated
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/profile", protect, updateProfile);

/**
 * @swagger
 * /api/users/profile-image:
 *   put:
 *     summary: Upload profile image
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profileImage
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile image uploaded successfully
 *       401:
 *         description: Unauthorized
 */
router.put(
  "/profile-image",
  protect,
  upload.single("profileImage"),
  uploadProfileImage,
);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllUsers);

export default router;
