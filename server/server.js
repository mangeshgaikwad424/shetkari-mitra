import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ─── MIDDLEWARE ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── REQUEST LOGGER (DEV) ────────────────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ─── MONGODB CONNECTION ──────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    seedDefaultListings();
  })
  .catch((err) => console.log("❌ MongoDB error:", err));

// ─── SEED DEMO LISTINGS ──────────────────────────────────────────────────────
import Listing from "./models/Listing.js";
async function seedDefaultListings() {
  const count = await Listing.countDocuments();
  if (count === 0) {
    await Listing.insertMany([
      { type: "tractor", ownerEmail: "ramesh@tractor.com", ownerName: "Ramesh Patil", title: "Mahindra 575 DI", location: "Akola", price: "₹800/day", available: true, rating: 4.8, phone: "9876543210" },
      { type: "tractor", ownerEmail: "suresh@tractor.com", ownerName: "Suresh Jadhav", title: "John Deere 5050D", location: "Washim", price: "₹1200/day", available: true, rating: 4.5, phone: "9765432109" },
      { type: "labour", ownerEmail: "mohan@labour.com", ownerName: "Mohan Shinde", title: "Harvesting Expert", location: "Amravati", price: "₹400/day", available: true, rating: 4.6, phone: "9654321098", skill: "Harvesting" },
      { type: "labour", ownerEmail: "sita@labour.com", ownerName: "Sita Bai", title: "Sowing Specialist", location: "Yavatmal", price: "₹350/day", available: true, rating: 4.7, phone: "9543210987", skill: "Sowing" },
    ]);
    console.log("✅ Seeded default listings");
  }
}

// ─── IMPORT ROUTES ───────────────────────────────────────────────────────────
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import mandiRoutes from "./routes/mandiRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import tractorRoutes from "./routes/tractorRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import schemeRoutes from "./routes/schemeRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

// ─── API v1 ROUTES ───────────────────────────────────────────────────────────
// All routes under /api/v1/
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/mandi", mandiRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/tractors", tractorRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/schemes", schemeRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/messages", messageRoutes);

// ─── LEGACY ROUTES (backwards compat) ───────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/mandi", mandiRoutes);
app.use("/api/analytics", analyticsRoutes);

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", version: "v1", timestamp: new Date().toISOString() })
);

app.get("/api/v1/health", (_req, res) =>
  res.json({ status: "ok", version: "v1", timestamp: new Date().toISOString() })
);

// ─── 404 HANDLER ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// ─── GLOBAL ERROR HANDLER ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ msg: "Internal server error", error: err.message });
});

// ─── SERVER ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT} — API v1 ready`));
