import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useNotifications } from "./NotificationContext";
import api from "../services/api";
import { logActivity } from "../services/analytics";

export const BookingContext = createContext();

// Demo listings shown when backend is unreachable
const DEMO_LISTINGS = [
  { _id: "t1", id: "t1", type: "tractor", ownerEmail: "ramesh@tractor.com", ownerName: "Ramesh Patil", title: "Mahindra 575 DI", location: "Akola", price: "₹800/day", available: true, rating: 4.8, phone: "9876543210" },
  { _id: "t2", id: "t2", type: "tractor", ownerEmail: "suresh@tractor.com", ownerName: "Suresh Jadhav", title: "John Deere 5050D", location: "Washim", price: "₹1200/day", available: true, rating: 4.5, phone: "9765432109" },
  { _id: "l1", id: "l1", type: "labour", ownerEmail: "mohan@labour.com", ownerName: "Mohan Shinde", title: "Harvesting Expert", location: "Amravati", price: "₹400/day", available: true, rating: 4.6, phone: "9654321098", skill: "Harvesting" },
  { _id: "l2", id: "l2", type: "labour", ownerEmail: "sita@labour.com", ownerName: "Sita Bai", title: "Sowing Specialist", location: "Yavatmal", price: "₹350/day", available: true, rating: 4.7, phone: "9543210987", skill: "Sowing" },
];

export function BookingProvider({ children }) {
  const { addNotification } = useNotifications();
  const [bookings, setBookings] = useState([]);
  const [listings, setListings] = useState(DEMO_LISTINGS);
  const [loading, setLoading] = useState(false);
  const [bookingsLoaded, setBookingsLoaded] = useState(false);

  // ── Load listings from MongoDB on mount ──────────────────────────────────────
  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const res = await api.get("/bookings/listings");
      if (res.data.listings?.length > 0) {
        setListings(res.data.listings.map(l => ({ ...l, id: l._id })));
      }
    } catch {
      setListings(DEMO_LISTINGS);
    }
  };

  // ── Load bookings for logged-in user ─────────────────────────────────────────
  const fetchMyBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/bookings/my");
      const fetched = (res.data.bookings || []).map(b => ({ ...b, id: b._id }));
      setBookings(fetched);
      setBookingsLoaded(true);
    } catch {
      // keep existing in-memory bookings
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-fetch when token exists (user is logged in)
  useEffect(() => {
    const token = localStorage.getItem("shetkari_token");
    if (token && !bookingsLoaded) {
      fetchMyBookings();
    }
  }, [fetchMyBookings, bookingsLoaded]);

  // ── Farmer books a tractor/labour — persists to MongoDB ──────────────────────
  const createBooking = useCallback(async (farmer, listing, date, message) => {
    try {
      const res = await api.post("/bookings", {
        listingId: listing._id || listing.id,
        date,
        message,
      });
      const booking = { ...res.data.booking, id: res.data.booking._id };
      setBookings(prev => [...prev, booking]);

      // Notify the owner
      addNotification(listing.ownerEmail, {
        type: "booking_request",
        title: "New Booking Request! 🎉",
        message: `${farmer.name} wants to book your "${listing.title}" on ${date}`,
        bookingId: booking._id,
        from: farmer.name,
      });

      // Log to analytics (fire-and-forget)
      logActivity(
        listing.type === "tractor" ? "book_tractor" : "book_labour",
        `Booked "${listing.title}" from ${listing.ownerName} for ${date}`,
        { bookingId: booking._id, listingType: listing.type, date }
      );

      return booking;
    } catch {
      // Optimistic local fallback when backend is unreachable
      const booking = {
        _id: "b" + Date.now(),
        id: "b" + Date.now(),
        farmerId: farmer._id || farmer.email,
        farmerName: farmer.name,
        farmerPhone: farmer.phone || "N/A",
        ownerId: listing.ownerEmail,
        ownerName: listing.ownerName,
        listingId: listing._id || listing.id,
        listingTitle: listing.title,
        listingType: listing.type,
        date,
        message,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      setBookings(prev => [...prev, booking]);
      addNotification(listing.ownerEmail, {
        type: "booking_request",
        title: "New Booking Request! 🎉",
        message: `${farmer.name} wants to book your "${listing.title}" on ${date}`,
        bookingId: booking._id,
        from: farmer.name,
      });
      return booking;
    }
  }, [addNotification]);

  // ── Owner accepts/rejects booking ────────────────────────────────────────────
  const updateBookingStatus = useCallback(async (bookingId, status, owner) => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status });

      // Log to analytics
      logActivity(
        status === "accepted" ? "booking_accepted" : "booking_rejected",
        `${status} a booking request`,
        { bookingId, status }
      );
    } catch { /* optimistic */ }

    setBookings(prev => {
      const updated = prev.map(b => (b._id === bookingId || b.id === bookingId) ? { ...b, status } : b);
      const booking = updated.find(b => b._id === bookingId || b.id === bookingId);
      if (booking) {
        const emoji = status === "accepted" ? "✅" : "❌";
        addNotification(booking.farmerId, {
          type: "booking_update",
          title: `Booking ${status === "accepted" ? "Accepted" : "Rejected"}! ${emoji}`,
          message: `${owner.name} has ${status} your booking for "${booking.listingTitle}" on ${booking.date}`,
          bookingId,
        });
      }
      return updated;
    });
  }, [addNotification]);

  // ── Add a new listing (persists to MongoDB) ──────────────────────────────────
  const addListing = useCallback(async (owner, listingData) => {
    try {
      const res = await api.post("/bookings/listings", listingData);
      const newListing = { ...res.data.listing, id: res.data.listing._id };
      setListings(prev => [...prev, newListing]);

      // Log to analytics
      logActivity(
        "add_listing",
        `Added ${listingData.type} listing: ${listingData.title}`,
        { listingType: listingData.type, title: listingData.title }
      );

      return newListing;
    } catch {
      const newListing = {
        _id: "l" + Date.now(), id: "l" + Date.now(),
        ownerEmail: owner.email, ownerName: owner.name,
        available: true, rating: 0,
        phone: owner.phone || "N/A",
        ...listingData
      };
      setListings(prev => [...prev, newListing]);
      return newListing;
    }
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const getBookingsForUser = useCallback((emailOrId) => {
    return bookings.filter(b =>
      b.farmerId === emailOrId || b.ownerId === emailOrId ||
      b.farmerId === emailOrId?.toString()
    );
  }, [bookings]);

  const getListingsByType = useCallback((type) => {
    return listings.filter(l => l.type === type && l.available);
  }, [listings]);

  return (
    <BookingContext.Provider value={{
      bookings, listings, loading, bookingsLoaded,
      createBooking, updateBookingStatus, addListing,
      getBookingsForUser, getListingsByType,
      fetchMyBookings, fetchListings,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);
