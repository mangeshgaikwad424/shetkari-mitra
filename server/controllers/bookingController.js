import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";
import ActivityLog from "../models/ActivityLog.js";

// ─── CREATE BOOKING ────────────────────────────────────────────────────────────
export const createBooking = async (req, res) => {
  try {
    const { listingId, date, message } = req.body;
    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ msg: "Listing not found" });

    const farmer = req.user; // from JWT
    const booking = await Booking.create({
      farmerId: farmer.id,
      farmerEmail: farmer.email,
      farmerName: farmer.name,
      farmerPhone: farmer.phone || "N/A",
      ownerId: listing.ownerEmail,
      ownerName: listing.ownerName,
      ownerPhone: listing.phone || "N/A",
      listingId: listing._id.toString(),
      listingTitle: listing.title,
      listingType: listing.type,
      date,
      message,
    });

    // Log the booking activity
    await ActivityLog.create({
      userId: farmer.id,
      userEmail: farmer.email,
      userName: farmer.name,
      userRole: farmer.role,
      action: listing.type === "tractor" ? "book_tractor" : "book_labour",
      description: `${farmer.name} booked ${listing.type} "${listing.title}" from ${listing.ownerName} for ${date}`,
      metadata: { bookingId: booking._id, listingId: listing._id, listingType: listing.type, ownerName: listing.ownerName, date },
    });

    res.status(201).json({ booking });
  } catch (err) {
    res.status(500).json({ msg: "Booking failed", error: err.message });
  }
};

// ─── GET BOOKINGS FOR USER ─────────────────────────────────────────────────────
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.find({
      $or: [{ farmerId: userId }, { ownerId: req.user.email }],
    }).sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch bookings", error: err.message });
  }
};

// ─── UPDATE BOOKING STATUS ─────────────────────────────────────────────────────
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ msg: "Booking not found" });

    // Log accept/reject by tractor or labour owner
    await ActivityLog.create({
      userId: req.user.id,
      userEmail: req.user.email,
      userName: req.user.name,
      userRole: req.user.role,
      action: status === "accepted" ? "booking_accepted" : "booking_rejected",
      description: `${req.user.name} ${status} booking from ${booking.farmerName} for "${booking.listingTitle}"`,
      metadata: { bookingId: booking._id, farmerName: booking.farmerName, listingTitle: booking.listingTitle, status },
    });

    res.json({ booking });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update booking", error: err.message });
  }
};

// ─── GET ALL LISTINGS ──────────────────────────────────────────────────────────
export const getListings = async (req, res) => {
  try {
    const { type } = req.query;
    const filter = { available: true };
    if (type) filter.type = type;
    const listings = await Listing.find(filter).sort({ createdAt: -1 });
    res.json({ listings });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch listings", error: err.message });
  }
};

// ─── CREATE LISTING ────────────────────────────────────────────────────────────
export const createListing = async (req, res) => {
  try {
    const listing = await Listing.create({
      ...req.body,
      ownerEmail: req.user.email,
      ownerName: req.user.name,
    });
    res.status(201).json({ listing });
  } catch (err) {
    res.status(500).json({ msg: "Failed to create listing", error: err.message });
  }
};

// ─── UPDATE LISTING ───────────────────────────────────────────────────────────
export const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findOne({
      _id: req.params.id,
      ownerEmail: req.user.email,
    });

    if (!listing) {
      return res.status(404).json({ msg: "Listing not found" });
    }

    Object.assign(listing, req.body);
    await listing.save();

    await ActivityLog.create({
      userId: req.user.id,
      userEmail: req.user.email,
      userName: req.user.name,
      userRole: req.user.role,
      action: "update_listing",
      description: `${req.user.name} updated listing "${listing.title}"`,
      metadata: { listingId: listing._id, listingType: listing.type, available: listing.available },
    });

    res.json({ listing });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update listing", error: err.message });
  }
};
