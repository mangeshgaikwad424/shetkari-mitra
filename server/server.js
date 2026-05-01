import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import Listing from "./models/Listing.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import mandiRoutes from "./routes/mandiRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import tractorRoutes from "./routes/tractorRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import schemeRoutes from "./routes/schemeRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const app = express();

// ─── MIDDLEWARE ─────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── LOGGER (DEV ONLY) ─────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
}

// ─── ROUTES ────────────────────────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/mandi", mandiRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/tractors", tractorRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/schemes", schemeRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/messages", messageRoutes);

// Health
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok" })
);

// ─── ERROR HANDLER ─────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// ─── SEED FUNCTION ─────────────────────────────────────
async function seedDefaultListings() {
  try {
    const count = await Listing.countDocuments();
    if (count === 0) {
      await Listing.insertMany([
        { type: "tractor", ownerEmail: "ramesh@tractor.com", ownerName: "Ramesh Patil", title: "Mahindra 575 DI", location: "Akola", price: "₹800/day", available: true },
        { type: "tractor", ownerEmail: "suresh@tractor.com", ownerName: "Suresh Jadhav", title: "John Deere 5050D", location: "Washim", price: "₹1200/day", available: true }
      ]);
      console.log("✅ Seeded data");
    }
  } catch (err) {
    console.log("Seed error:", err.message);
  }
}

// ─── START SERVER ONLY AFTER DB CONNECTS ───────────────
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI missing in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    await seedDefaultListings();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Startup Error:", err.message);
    process.exit(1); // VERY IMPORTANT for Render
  }
}

startServer();