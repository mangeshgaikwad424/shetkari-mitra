import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getConversations,
  getMessages,
  sendMessage,
  getUnreadCount,
} from "../controllers/messageController.js";

const router = express.Router();

// All message routes are protected
router.get("/conversations", protect, getConversations);
router.get("/unread-count", protect, getUnreadCount);
router.get("/:otherEmail", protect, getMessages);
router.post("/", protect, sendMessage);

export default router;
