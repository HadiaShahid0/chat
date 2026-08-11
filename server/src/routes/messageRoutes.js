import express from "express";

import {
  getMessages,
} from "../controllers/messageController/messageController.js";

import protect from "../middleware/authMiddleware/authMiddleware.js";

const router = express.Router();


// Get chat messages
router.get(
  "/:userId",
  protect,
  getMessages,
);


export default router;