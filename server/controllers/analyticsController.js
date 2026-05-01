import ActivityLog from "../models/ActivityLog.js";
import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";
import User from "../models/User.js";

// ─── LOG AN ACTIVITY ───────────────────────────────────────────────────────────
export const logActivity = async (req, res) => {
  try {
    const { action, description, metadata } = req.body;
    const ip = req.ip || req.headers["x-forwarded-for"] || "";

    const log = await ActivityLog.create({
      userId: req.user.id,
      userEmail: req.user.email,
      userName: req.user.name,
      userRole: req.user.role,
      action,
      description,
      metadata: metadata || {},
      ip,
    });

    res.status(201).json({ log });
  } catch (err) {
    res.status(500).json({ msg: "Failed to log activity", error: err.message });
  }
};

// ─── GET MY ACTIVITY LOG ───────────────────────────────────────────────────────
export const getMyActivity = async (req, res) => {
  try {
    const logs = await ActivityLog.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch activity", error: err.message });
  }
};

// ─── ADMIN: GET ALL USERS ──────────────────────────────────────────────────────
export const adminGetAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch users", error: err.message });
  }
};

// ─── ADMIN: FULL ANALYTICS ─────────────────────────────────────────────────────
export const adminGetAnalytics = async (req, res) => {
  try {
    const [
      totalUsers,
      farmerCount,
      tractorCount,
      labourCount,
      govCount,
      totalBookings,
      pendingBookings,
      acceptedBookings,
      rejectedBookings,
      totalListings,
      tractorListings,
      labourListings,
      recentLogs,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "farmer" }),
      User.countDocuments({ role: "tractor" }),
      User.countDocuments({ role: "labour" }),
      User.countDocuments({ role: "government" }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "accepted" }),
      Booking.countDocuments({ status: "rejected" }),
      Listing.countDocuments(),
      Listing.countDocuments({ type: "tractor" }),
      Listing.countDocuments({ type: "labour" }),
      ActivityLog.find({}).sort({ createdAt: -1 }).limit(50),
    ]);

    // Top farmers who book most
    const topFarmers = await Booking.aggregate([
      { $group: { _id: "$farmerId", farmerName: { $first: "$farmerName" }, bookings: { $sum: 1 } } },
      { $sort: { bookings: -1 } },
      { $limit: 10 },
    ]);

    // Most booked tractor owners
    const topTractorOwners = await Booking.aggregate([
      { $match: { listingType: "tractor" } },
      { $group: { _id: "$ownerId", ownerName: { $first: "$ownerName" }, bookings: { $sum: 1 } } },
      { $sort: { bookings: -1 } },
      { $limit: 10 },
    ]);

    // Most booked labour
    const topLabour = await Booking.aggregate([
      { $match: { listingType: "labour" } },
      { $group: { _id: "$ownerId", ownerName: { $first: "$ownerName" }, bookings: { $sum: 1 } } },
      { $sort: { bookings: -1 } },
      { $limit: 10 },
    ]);

    // Bookings per day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const bookingsPerDay = await Booking.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Recent registrations
    const recentUsers = await User.find({}).select("-password").sort({ createdAt: -1 }).limit(10);

    // Recent bookings
    const recentBookings = await Booking.find({}).sort({ createdAt: -1 }).limit(20);

    res.json({
      stats: {
        totalUsers, farmerCount, tractorCount, labourCount, govCount,
        totalBookings, pendingBookings, acceptedBookings, rejectedBookings,
        totalListings, tractorListings, labourListings,
      },
      topFarmers,
      topTractorOwners,
      topLabour,
      bookingsPerDay,
      recentUsers,
      recentBookings,
      recentActivity: recentLogs,
    });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch analytics", error: err.message });
  }
};

// ─── ADMIN: GET ACTIVITY LOGS BY ROLE OR USER ─────────────────────────────────
export const adminGetLogs = async (req, res) => {
  try {
    const { role, userId, action, limit = 100 } = req.query;
    const filter = {};
    if (role) filter.userRole = role;
    if (userId) filter.userId = userId;
    if (action) filter.action = action;

    const logs = await ActivityLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({ logs });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch logs", error: err.message });
  }
};
