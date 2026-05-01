import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load env variables
dotenv.config();

const app = express();

// ─────────────────────────────────────────────────────────────
// ✅ MIDDLEWARE
// ─────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*", // allow all (safe for now)
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────────────────────
// ✅ REQUEST LOGGER (DEV ONLY)
// ─────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`📩 ${req.method} ${req.url}`);
    next();
  });
}

// ─────────────────────────────────────────────────────────────
// ✅ MONGODB CONNECTION (FIXED)
// ─────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in environment variables");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    seedDefaultListings();
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  });

// ─────────────────────────────────────────────────────────────
// ✅ MODELS
// ─────────────────────────────────────────────────────────────
import Listing from "./models/Listing.js";

// ─────────────────────────────────────────────────────────────
// ✅ SEED DATA
// ─────────────────────────────────────────────────────────────
async function seedDefaultListings() {
  try {
    const count = await Listing.countDocuments();

    if (count === 0) {
      await Listing.insertMany([
        {
          type: "tractor",
          ownerEmail: "ramesh@tractor.com",
          ownerName: "Ramesh Patil",
          title: "Mahindra 575 DI",
          location: "Akola",
          price: "₹800/day",
          available: true,
          rating: 4.8,
          phone: "9876543210",
        },
        {
          type: "tractor",
          ownerEmail: "suresh@tractor.com",
          ownerName: "Suresh Jadhav",
          title: "John Deere 5050D",
          location: "Washim",
          price: "₹1200/day",
          available: true,
          rating: 4.5,
          phone: "9765432109",
        },
        {
          type: "labour",
          ownerEmail: "mohan@labour.com",
          ownerName: "Mohan Shinde",
          title: "Harvesting Expert",
          location: "Amravati",
          price: "₹400/day",
          available: true,
          rating: 4.6,
          phone: "9654321098",
          skill: "Harvesting",
        },
        {
          type: "labour",
          ownerEmail: "sita@labour.com",
          ownerName: "Sita Bai",
          title: "Sowing Specialist",
          location: "Yavatmal",
          price: "₹350/day",
          available: true,
          rating: 4.7,
          phone: "9543210987",
          skill: "Sowing",
        },
      ]);

      console.log("✅ Seeded default listings");
    }
  } catch (err) {
    console.error("❌ Seed error:", err.message);
  }
}

// ─────────────────────────────────────────────────────────────
// ✅ ROUTES
// ─────────────────────────────────────────────────────────────
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import mandiRoutes from "./routes/mandiRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import tractorRoutes from "./routes/tractorRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import schemeRoutes from "./routes/schemeRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

// API v1
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/mandi", mandiRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/tractors", tractorRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/schemes", schemeRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/messages", messageRoutes);

// Legacy (optional)
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

// ─────────────────────────────────────────────────────────────
// ✅ HEALTH CHECK (VERY IMPORTANT FOR RENDER)
// ─────────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.send("🚀 Shetkari Mitra Backend Running");
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// ─────────────────────────────────────────────────────────────
// ❌ 404 HANDLER
// ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// ─────────────────────────────────────────────────────────────
// ❌ ERROR HANDLER
// ─────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({
    msg: "Internal server error",
    error: err.message,
  });
});

// ─────────────────────────────────────────────────────────────
// ✅ SERVER START
// ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});