import express from "express";

import {
  getMessages,
} from "../controllers/messageController/messageController.js";

import protect from "../middleware/authMiddleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/messages/{userId}:
 *   get:
 *     summary: Get chat messages
 *     description: Retrieves all messages between the logged-in user and another user.
 *     tags:
 *       - Messages
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the other user
 *         example: 5
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User or messages not found
 */
router.get("/:userId", protect, getMessages);

export default router;