/**
 * analytics.js — Frontend helper to log user activities to the backend
 * All calls are fire-and-forget (never block UI)
 */
import api from "./api";

/**
 * Log an activity event to MongoDB
 * @param {string} action  - e.g. "book_tractor", "view_mandi", "login"
 * @param {string} description - Human-readable description
 * @param {object} metadata  - Any extra data to store
 */
export const logActivity = async (action, description, metadata = {}) => {
  try {
    await api.post("/analytics/log", { action, description, metadata });
  } catch {
    // Silently ignore — activity logging must never break the UI
  }
};

/**
 * Fetch analytics dashboard data (government/admin only)
 */
export const fetchAdminAnalytics = async () => {
  const res = await api.get("/analytics/admin/analytics");
  return res.data;
};

/**
 * Fetch all activity logs (optionally filtered)
 */
export const fetchActivityLogs = async ({ role, userId, action, limit } = {}) => {
  const params = {};
  if (role) params.role = role;
  if (userId) params.userId = userId;
  if (action) params.action = action;
  if (limit) params.limit = limit;
  const res = await api.get("/analytics/admin/logs", { params });
  return res.data.logs;
};

/**
 * Fetch my own activity log
 */
export const fetchMyActivity = async () => {
  const res = await api.get("/analytics/my");
  return res.data.logs;
};
