import express from "express";
import {
  createBooking, getMyBookings, updateBookingStatus,
  getListings, createListing,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Listings
router.get("/listings", getListings); // public
router.post("/listings", protect, createListing);

// Bookings — all protected
router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.patch("/:id/status", protect, updateBookingStatus);

export default router;
