import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getNotifications,
  markAllRead,
  markOneRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.patch("/read-all", protect, markAllRead);
router.patch("/:id/read", protect, markOneRead);

export default router;
