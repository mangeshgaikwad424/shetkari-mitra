import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useNotifications } from "./NotificationContext";
import { useChat } from "./ChatContext";
import api from "../services/api";
import { logActivity } from "../services/analytics";

export const BookingContext = createContext();
const LISTINGS_STORAGE_KEY = "shetkari_listings";

// Demo listings shown when backend is unreachable
const DEMO_LISTINGS = [
  { _id: "t1", id: "t1", type: "tractor", ownerEmail: "ramesh@tractor.com", ownerName: "Ramesh Patil", title: "Mahindra 575 DI", location: "Akola", price: "₹800/day", image: "", available: true, rating: 4.8, phone: "9876543210" },
  { _id: "t2", id: "t2", type: "tractor", ownerEmail: "suresh@tractor.com", ownerName: "Suresh Jadhav", title: "John Deere 5050D", location: "Washim", price: "₹1200/day", image: "", available: true, rating: 4.5, phone: "9765432109" },
  { _id: "l1", id: "l1", type: "labour", ownerEmail: "mohan@labour.com", ownerName: "Mohan Shinde", title: "Harvesting Expert", location: "Amravati", price: "₹400/day", available: true, rating: 4.6, phone: "9654321098", skill: "Harvesting" },
  { _id: "l2", id: "l2", type: "labour", ownerEmail: "sita@labour.com", ownerName: "Sita Bai", title: "Sowing Specialist", location: "Yavatmal", price: "₹350/day", available: true, rating: 4.7, phone: "9543210987", skill: "Sowing" },
];

function loadStoredListings() {
  try {
    const stored = localStorage.getItem(LISTINGS_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : null;
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

export function BookingProvider({ children }) {
  const { addNotification } = useNotifications();
  const { sendMessage } = useChat();
  const [bookings, setBookings] = useState([]);
  const [listings, setListings] = useState(() => loadStoredListings() || DEMO_LISTINGS);
  const [loading, setLoading] = useState(false);
  const [bookingsLoaded, setBookingsLoaded] = useState(false);

  useEffect(() => {
    localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(listings));
  }, [listings]);

  const fetchListings = useCallback(async () => {
    try {
      const res = await api.get("/bookings/listings");
      if (res.data.listings?.length > 0) {
        setListings(res.data.listings.map(l => ({ ...l, id: l._id })));
      }
    } catch {
      setListings(loadStoredListings() || DEMO_LISTINGS);
    }
  }, []);

  // ── Load listings from MongoDB on mount ──────────────────────────────────────
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

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
        farmerEmail: farmer.email || "",
        farmerName: farmer.name,
        farmerPhone: farmer.phone || "N/A",
        ownerId: listing.ownerEmail,
        ownerName: listing.ownerName,
        ownerPhone: listing.phone || "N/A",
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
    const existingBooking = bookings.find(b => b._id === bookingId || b.id === bookingId);
    const listing = listings.find(l => (l._id === existingBooking?.listingId || l.id === existingBooking?.listingId));
    const ownerPhone = listing?.phone || existingBooking?.ownerPhone || owner?.phone || "N/A";
    const farmerNotificationKey = existingBooking?.farmerEmail || existingBooking?.farmerId;
    const acceptedMessage = `Your booking for "${existingBooking?.listingTitle}" on ${existingBooking?.date} is confirmed. Contact ${owner?.name || existingBooking?.ownerName} at ${ownerPhone} and come on the booked date.`;
    const initialChatMessage = `Booking confirmed for "${existingBooking?.listingTitle}" on ${existingBooking?.date}. You can contact me on ${ownerPhone}. Please come on the booked date.`;

    try {
      await api.patch(`/bookings/${bookingId}/status`, { status });

      // Log to analytics
      logActivity(
        status === "accepted" ? "booking_accepted" : "booking_rejected",
        `${status} a booking request`,
        { bookingId, status }
      );
    } catch { /* optimistic */ }

    setBookings(prev => prev.map(b => (
      b._id === bookingId || b.id === bookingId
        ? { ...b, status, ownerPhone }
        : b
    )));

    if (existingBooking) {
      const emoji = status === "accepted" ? "✅" : "❌";
      const notificationMessage = status === "accepted"
        ? acceptedMessage
        : `${owner.name} has rejected your booking for "${existingBooking.listingTitle}" on ${existingBooking.date}.`;

      if (farmerNotificationKey) {
        addNotification(farmerNotificationKey, {
          type: "booking_update",
          title: `Booking ${status === "accepted" ? "Accepted" : "Rejected"}! ${emoji}`,
          message: notificationMessage,
          bookingId,
          ownerPhone,
        });
      }

      if (
        status === "accepted" &&
        existingBooking.status !== "accepted" &&
        existingBooking.farmerEmail &&
        owner?.email
      ) {
        sendMessage(
          owner.email,
          owner.name,
          existingBooking.farmerEmail,
          existingBooking.farmerName,
          initialChatMessage
        );
      }
    }
  }, [addNotification, bookings, listings, sendMessage]);

  // ── Add a new listing (persists to MongoDB) ──────────────────────────────────
  const addListing = useCallback(async (owner, listingData) => {
    try {
      const res = await api.post("/bookings/listings", listingData);
      const newListing = { ...res.data.listing, id: res.data.listing._id };
      setListings(prev => [newListing, ...prev]);

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
      setListings(prev => [newListing, ...prev]);
      return newListing;
    }
  }, []);

  const updateListing = useCallback(async (listingId, listingData) => {
    try {
      const res = await api.patch(`/bookings/listings/${listingId}`, listingData);
      const updatedListing = { ...res.data.listing, id: res.data.listing._id };
      setListings(prev => prev.map(l => (l._id === listingId || l.id === listingId) ? updatedListing : l));
      return updatedListing;
    } catch {
      let patchedListing = null;
      setListings(prev => prev.map(l => {
        if (l._id === listingId || l.id === listingId) {
          patchedListing = { ...l, ...listingData };
          return patchedListing;
        }
        return l;
      }));
      return patchedListing;
    }
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const getBookingsForUser = useCallback((userRef) => {
    const email = typeof userRef === "string" ? userRef : userRef?.email;
    const id = typeof userRef === "string" ? userRef : (userRef?.id || userRef?._id);

    return bookings.filter(b =>
      b.farmerId === id ||
      b.farmerId === email ||
      b.farmerEmail === email ||
      b.ownerId === id ||
      b.ownerId === email
    );
  }, [bookings]);

  const getListingsByType = useCallback((type) => {
    return listings.filter(l => l.type === type && l.available);
  }, [listings]);

  const getOwnerListings = useCallback((ownerEmail, type) => {
    return listings.filter(l =>
      l.ownerEmail === ownerEmail &&
      (!type || l.type === type)
    );
  }, [listings]);

  return (
    <BookingContext.Provider value={{
      bookings, listings, loading, bookingsLoaded,
      createBooking, updateBookingStatus, addListing, updateListing,
      getBookingsForUser, getListingsByType, getOwnerListings,
      fetchMyBookings, fetchListings,
    }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => useContext(BookingContext);
