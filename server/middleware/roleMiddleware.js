/**
 * roleMiddleware.js
 * Restrict access to specific roles after `protect` has run.
 * Usage:  router.get("/admin/...", protect, requireRole("government"), handler)
 */
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ msg: "Not authenticated" });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ msg: `Access denied. Required role: ${roles.join(" or ")}` });
  }
  next();
};
