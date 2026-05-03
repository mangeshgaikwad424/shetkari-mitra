import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// ─────────────────────────────────────────
// ✅ LOAD ENV FIRST (VERY IMPORTANT)
// ─────────────────────────────────────────
dotenv.config();

// ─────────────────────────────────────────
// ✅ DEBUG ENV (FOR EMAIL ISSUE)
// ─────────────────────────────────────────
console.log("📧 EMAIL_USER:", process.env.EMAIL_USER ? "Loaded ✅" : "Missing ❌");
console.log("🔑 EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌");
console.log("🌐 FRONTEND_URL:", process.env.FRONTEND_URL);

// ─────────────────────────────────────────
// ✅ CREATE APP
// ─────────────────────────────────────────
const app = express();

// ─────────────────────────────────────────
// ✅ CORS - ALLOW MULTIPLE ORIGINS
// ─────────────────────────────────────────
const allowedOrigins = [
  "https://shetkari-mitra-six.vercel.app",
  "https://shetkari-mitra-hmjovu2r-mangeshgaikwad424s-projects.vercel.app",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────
// ✅ REQUEST LOGGER (DEV)
// ─────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`📩 ${req.method} ${req.url}`);
    next();
  });
}

// ─────────────────────────────────────────
// ✅ MONGODB CONNECTION
// ─────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  });

// ─────────────────────────────────────────
// ✅ IMPORT ROUTES
// ─────────────────────────────────────────
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import mandiRoutes from "./routes/mandiRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import tractorRoutes from "./routes/tractorRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import schemeRoutes from "./routes/schemeRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

// ─────────────────────────────────────────
// ✅ ROUTES
// ─────────────────────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/mandi", mandiRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/tractors", tractorRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/schemes", schemeRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/messages", messageRoutes);

// Optional legacy routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

// ─────────────────────────────────────────
// ✅ HEALTH CHECK
// ─────────────────────────────────────────
app.get("/", (_req, res) => {
  res.send("🚀 Shetkari Mitra Backend Running");
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// ─────────────────────────────────────────
// ❌ 404 HANDLER
// ─────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// ─────────────────────────────────────────
// ❌ ERROR HANDLER
// ─────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({
    msg: "Internal server error",
    error: err.message,
  });
});

// ─────────────────────────────────────────
// ✅ START SERVER
// ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});