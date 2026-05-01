import express from "express";
import { logActivity, getMyActivity, adminGetAnalytics, adminGetAllUsers, adminGetLogs } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Any logged-in user can log their own activity & view their own log
router.post("/log", protect, logActivity);
router.get("/my", protect, getMyActivity);

// Government only — role-guarded admin endpoints
router.get("/admin/analytics", protect, requireRole("government"), adminGetAnalytics);
router.get("/admin/users", protect, requireRole("government"), adminGetAllUsers);
router.get("/admin/logs", protect, requireRole("government"), adminGetLogs);

export default router;
