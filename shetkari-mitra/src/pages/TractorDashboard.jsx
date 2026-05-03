import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import { useNotifications } from "../context/NotificationContext";
import { useChat } from "../context/ChatContext";
import { LanguageContext } from "../context/LanguageContext";

const INITIAL_LISTING_FORM = {
  title: "",
  location: "",
  price: "",
  phone: "",
  image: "",
  available: true,
};

function parseAmount(value) {
  return Number(String(value || "").replace(/[^\d.]/g, "")) || 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatCompactCurrency(value) {
  const amount = Number(value || 0);
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${Math.round(amount / 1000)}K`;
  return `₹${Math.round(amount)}`;
}

function toDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return parsed;
  const fallback = new Date(`${value} ${new Date().getFullYear()}`);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

function getDateKey(value) {
  const date = value instanceof Date ? value : toDate(value);
  if (!date) return "";
  return date.toISOString().split("T")[0];
}

function LineChart({ data, labels, color = "#16a34a" }) {
  const safeData = data?.length ? data : [0, 0, 0, 0, 0];
  const w = 400, h = 140, pad = 32;
  const max = Math.max(...safeData, 1);
  const min = Math.min(...safeData, 0);
  const range = max - min || 1;
  const pts = safeData.map((v, i) => [
    pad + (i / Math.max(safeData.length - 1, 1)) * (w - pad * 2),
    h - pad - ((v - min) / range) * (h - pad * 2)
  ]);
  const polyline = pts.map(p => p.join(",")).join(" ");
  const area = `${pts[0][0]},${h - pad} ` + pts.map(p => p.join(",")).join(" ") + ` ${pts[pts.length - 1][0]},${h - pad}`;
  const xLabels = labels?.length === safeData.length ? labels : safeData.map((_, i) => `P${i + 1}`);
  const ySteps = [1, 0.67, 0.33, 0].map(step => formatCompactCurrency(max * step));
  const highlightIndex = safeData.length - 1;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="tractor_area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0, 1, 2, 3].map(i => (
        <line key={i} x1={pad} x2={w - pad} y1={pad + i * (h - pad * 2) / 3} y2={pad + i * (h - pad * 2) / 3}
          stroke="#e5e7eb" strokeWidth="1" />
      ))}
      {/* Y labels */}
      {ySteps.map((l, i) => (
        <text key={i} x={pad - 4} y={pad + i * (h - pad * 2) / 3 + 4} textAnchor="end" fontSize="7" fill="#9ca3af">{l}</text>
      ))}
      {/* X labels */}
      {xLabels.map((l, i) => (
        <text key={i} x={pad + (i / Math.max(xLabels.length - 1, 1)) * (w - pad * 2)} y={h - 4} textAnchor="middle" fontSize="7" fill="#9ca3af">{l}</text>
      ))}
      {/* Area */}
      <polygon points={area} fill="url(#tractor_area)" />
      {/* Line */}
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      {/* Dot highlight */}
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill={color} />)}
      {/* Tooltip marker */}
      <circle cx={pts[highlightIndex][0]} cy={pts[highlightIndex][1]} r="5" fill={color} />
      <text x={pts[highlightIndex][0]} y={pts[highlightIndex][1] - 10} textAnchor="middle" fontSize="8" fill={color} fontWeight="700">{formatCompactCurrency(safeData[highlightIndex])}</text>
    </svg>
  );
}

export default function TractorDashboard() {
  const { user, logout } = useAuth();
  const { getBookingsForUser, updateBookingStatus, addListing, updateListing, getOwnerListings } = useBooking();
  const { getForUser, markAllRead } = useNotifications();
  const { getConversations, getUnreadCount } = useChat();
  const { lang } = useContext(LanguageContext);
  const navigate = useNavigate();
  const mr = lang === "mr";
  const [activeTab, setActiveTab] = useState("home");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingListingId, setEditingListingId] = useState(null);
  const [form, setForm] = useState(INITIAL_LISTING_FORM);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const NAV = mr ? [
    { id: "home", label: "डॅशबोर्ड", icon: "🏠" },
    { id: "tractors", label: "माझे ट्रॅक्टर", icon: "🚜" },
    { id: "bookings", label: "बुकिंग", icon: "📅" },
    { id: "earnings", label: "कमाई", icon: "💰" },
    { id: "availability", label: "उपलब्धता", icon: "✅" },
    { id: "requests", label: "सेवा विनंती", icon: "🔧" },
    { id: "messages", label: "संदेश", icon: "💬" },
    { id: "notifications", label: "सूचना", icon: "🔔" },
    { id: "profile", label: "प्रोफाईल", icon: "👤" },
    { id: "settings", label: "सेटिंग्ज", icon: "⚙️" },
  ] : [
    { id: "home", label: "Dashboard", icon: "🏠" },
    { id: "tractors", label: "My Tractors", icon: "🚜" },
    { id: "bookings", label: "Bookings", icon: "📅" },
    { id: "earnings", label: "Earnings", icon: "💰" },
    { id: "availability", label: "Availability", icon: "✅" },
    { id: "requests", label: "Service Requests", icon: "🔧" },
    { id: "messages", label: "Messages", icon: "💬" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const myBookings = getBookingsForUser(user?.email).filter(b => b.ownerId === user?.email);
  const pendingBookings = myBookings.filter(b => b.status === "pending");
  const acceptedBookings = myBookings.filter(b => b.status === "accepted");
  const myListings = getOwnerListings(user?.email, "tractor");
  const activeListings = myListings.filter(l => l.available !== false);
  const myNotifs = getForUser(user?.email || "");
  const unreadNotifs = myNotifs.filter(n => !n.read).length;
  const conversations = getConversations(user?.email || "");
  const unreadMessages = getUnreadCount(user?.email || "");
  const sectionCardStyle = {
    background: "#fff",
    borderRadius: 18,
    padding: "22px 24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    border: "1px solid #f3f4f6",
  };
  const tractorLookup = myListings.reduce((acc, listing) => {
    acc[listing._id || listing.id] = listing;
    return acc;
  }, {});
  const totalEarnings = acceptedBookings.reduce((sum, booking) => {
    const amount = parseAmount(tractorLookup[booking.listingId]?.price || booking.amount || 0);
    return sum + amount;
  }, 0);
  const averageTicket = acceptedBookings.length ? Math.round(totalEarnings / acceptedBookings.length) : 0;
  const averageRating = myListings.length
    ? (myListings.reduce((sum, listing) => sum + Number(listing.rating || 0), 0) / myListings.length).toFixed(1)
    : "0.0";
  const utilization = myListings.length ? Math.round((activeListings.length / myListings.length) * 100) : 0;
  const earningsData = totalEarnings > 0
    ? [0.2, 0.4, 0.62, 0.82, 1].map(step => Math.max(1000, Math.round(totalEarnings * step)))
    : [4200, 8600, 11200, 14900, 18750];
  const earningsLabels = mr ? ["आ1", "आ2", "आ3", "आ4", "आ5"] : ["W1", "W2", "W3", "W4", "W5"];
  const today = new Date();
  const calendarDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return date;
  });
  const availabilityLegend = {
    available: { short: mr ? "उ" : "A", label: mr ? "उपलब्ध" : "Available", bg: "#dcfce7", color: "#15803d" },
    requested: { short: mr ? "वि" : "R", label: mr ? "विनंती" : "Requested", bg: "#fef3c7", color: "#a16207" },
    booked: { short: mr ? "बु" : "B", label: mr ? "बुक" : "Booked", bg: "#dbeafe", color: "#1d4ed8" },
    paused: { short: mr ? "थां" : "P", label: mr ? "थांबवले" : "Paused", bg: "#fee2e2", color: "#b91c1c" },
  };
  const feedbackListings = myListings.filter(listing => Number(listing.rating || 0) > 0);

  const handleStatus = (bookingId, status) => {
    updateBookingStatus(bookingId, status, user);
  };

  const resetListingForm = () => {
    setEditingListingId(null);
    setForm(INITIAL_LISTING_FORM);
    setShowAddForm(false);
  };

  const startEditListing = (listing) => {
    setEditingListingId(listing._id || listing.id);
    setForm({
      title: listing.title || "",
      location: listing.location || "",
      price: listing.price || "",
      phone: listing.phone || "",
      image: listing.image || "",
      available: listing.available !== false,
    });
    setShowAddForm(true);
  };

  const toggleAvailability = async (listing) => {
    await updateListing(listing._id || listing.id, { available: listing.available === false });
  };

  const getAvailabilityForDay = (listing, day) => {
    if (listing.available === false) return availabilityLegend.paused;
    const booking = myBookings.find((item) => {
      const sameListing = [listing._id, listing.id].includes(item.listingId);
      const sameDay = getDateKey(item.date) === getDateKey(day);
      return sameListing && sameDay && item.status !== "rejected";
    });
    if (!booking) return availabilityLegend.available;
    return booking.status === "accepted" ? availabilityLegend.booked : availabilityLegend.requested;
  };

  const handleAddListing = async (e) => {
    e.preventDefault();
    const payload = { type: "tractor", ...form };
    if (editingListingId) await updateListing(editingListingId, payload);
    else await addListing(user, payload);
    resetListingForm();
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif", background: "#f8fafc" }}>

      {/* SIDEBAR */}
      <aside style={{ width: 220, background: "linear-gradient(180deg,#1a3a2a 0%,#0f2419 100%)", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        {/* Logo */}
        <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>🚜</span>
            <div>
              <div style={{ fontWeight: 800, color: "#fff", fontSize: 14, lineHeight: 1.2 }}>{lang === "mr" ? "शेतकरी मित्र" : "Shetkari Mitra"}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{lang === "mr" ? "ट्रॅक्टर मालक" : "Tractor Owner"}</div>
            </div>
          </div>
        </div>

        {/* Go to Main Site */}
        <div style={{ padding: "10px 10px 0" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "9px 12px", borderRadius: 8,
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.8)", cursor: "pointer", fontSize: 12, fontWeight: 600,
              transition: "all 0.2s",
            }}>
            <span style={{ fontSize: 15 }}>🏡</span> {lang === "mr" ? "मुख्य पानावर जा" : "Go to Home Page"}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 10px", overflowY: "auto" }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => n.id === "messages" ? navigate("/messages") : setActiveTab(n.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 8, marginBottom: 2,
                background: activeTab === n.id ? "rgba(74,222,128,0.15)" : "transparent",
                color: activeTab === n.id ? "#4ade80" : "rgba(255,255,255,0.65)",
                border: activeTab === n.id ? "1px solid rgba(74,222,128,0.2)" : "1px solid transparent",
                cursor: "pointer", fontSize: 13, fontWeight: 600, textAlign: "left", transition: "all 0.2s",
                position: "relative",
              }}>
              <span style={{ fontSize: 17 }}>{n.icon}</span>
              {n.label}
              {n.id === "notifications" && unreadNotifs > 0 && (
                <span style={{ marginLeft: "auto", background: "#ef4444", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>{unreadNotifs}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={() => { logout(); navigate("/login"); }}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, background: "transparent", color: "rgba(255,255,255,0.5)", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            🚪 {lang === "mr" ? "लॉगआउट" : "Logout"}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div style={{ marginLeft: 220, flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <header style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 40 }}>
          <div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 2 }}>{lang === "mr" ? "पुन्हा स्वागत आहे," : "Welcome back,"}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{user?.name || (lang === "mr" ? "सुरेश पाटील" : "Suresh Patil")} 👋</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>📍 {lang === "mr" ? "महाराष्ट्र, भारत" : "Maharashtra, India"}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
            <button onClick={() => setActiveTab("notifications")} style={{ position: "relative", background: "none", border: "none", fontSize: 20, cursor: "pointer", padding: 6 }}>
              🔔
              {unreadNotifs > 0 && <span style={{ position: "absolute", top: 0, right: 0, background: "#ef4444", color: "#fff", borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>{unreadNotifs}</span>}
            </button>
            <button onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#1a3a2a,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15 }}>
                {user?.name?.charAt(0)?.toUpperCase() || "T"}
              </div>
              <span style={{ fontSize: 11, color: "#6b7280" }}>▼</span>
            </button>
            {showProfileMenu && (
              <div style={{ position: "absolute", top: 52, right: 0, background: "#fff", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb", width: 180, zIndex: 100 }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{user?.name}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{user?.email}</div>
                </div>
                <button onClick={() => { logout(); navigate("/login"); }}
                  style={{ width: "100%", padding: "12px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", color: "#ef4444", fontSize: 13, fontWeight: 600 }}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main style={{ padding: 28, flex: 1 }}>

          {/* DASHBOARD HOME */}
          {activeTab === "home" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ ...sectionCardStyle, background: "linear-gradient(135deg,#0f2419,#166534 58%,#16a34a 100%)", color: "#fff", overflow: "hidden", position: "relative" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
                  <div style={{ maxWidth: 620 }}>
                    <div style={{ fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.75, fontWeight: 700 }}>
                      {mr ? "ट्रॅक्टर होम" : "Tractor Home"}
                    </div>
                    <h2 style={{ fontSize: 30, fontWeight: 900, margin: "8px 0 10px" }}>
                      {mr ? "ट्रॅक्टर मालक डॅशबोर्ड" : "Tractor Owner Dashboard"}
                    </h2>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.82)", margin: 0 }}>
                      {mr
                        ? "तुमचे ट्रॅक्टर, उपलब्धता, बुकिंग विनंत्या, कमाई, संदेश आणि सेटिंग्ज आता या एका होम पेजवर व्यवस्थापित करा."
                        : "Manage tractors, availability, booking requests, earnings, messages, and settings from this single home page."}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      onClick={() => {
                        setEditingListingId(null);
                        setForm(INITIAL_LISTING_FORM);
                        setShowAddForm(true);
                      }}
                      style={{ background: "#fff", color: "#166534", border: "none", borderRadius: 12, padding: "11px 18px", fontWeight: 800, cursor: "pointer" }}
                    >
                      {mr ? "+ ट्रॅक्टर जोडा" : "+ Add Tractor"}
                    </button>
                    <button
                      onClick={() => setActiveTab("bookings")}
                      style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 12, padding: "11px 18px", fontWeight: 700, cursor: "pointer" }}
                    >
                      {mr ? "बुकिंग विनंत्या" : "Booking Requests"}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
                {[
                  { label: mr ? "एकूण ट्रॅक्टर" : "Total Tractors", value: myListings.length, sub: mr ? `${activeListings.length} सक्रिय` : `${activeListings.length} active`, icon: "🚜", iconBg: "#dcfce7" },
                  { label: mr ? "प्रलंबित विनंत्या" : "Pending Requests", value: pendingBookings.length, sub: mr ? "तातडीने प्रतिसाद द्या" : "Respond quickly", icon: "📅", iconBg: "#fef3c7" },
                  { label: mr ? "एकूण कमाई" : "Total Earnings", value: formatCurrency(totalEarnings), sub: acceptedBookings.length ? `${acceptedBookings.length} ${mr ? "पूर्ण बुकिंग" : "confirmed bookings"}` : (mr ? "पहिल्या बुकिंगची वाट पाहत आहे" : "Waiting for first booking"), icon: "💰", iconBg: "#dbeafe" },
                  { label: mr ? "उपलब्धता" : "Availability", value: `${utilization}%`, sub: unreadMessages ? `${unreadMessages} ${mr ? "नवीन संदेश" : "new messages"}` : (mr ? "सर्व नियंत्रणाखाली" : "Everything under control"), icon: "✅", iconBg: "#dcfce7" },
                ].map((item, index) => (
                  <div key={index} style={{ ...sectionCardStyle, padding: "20px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>{item.label}</div>
                      <div style={{ fontSize: 26, fontWeight: 900, color: "#111827", margin: "8px 0 4px" }}>{item.value}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7280" }}>{item.sub}</div>
                    </div>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: item.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                      {item.icon}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(360px,1fr))", gap: 20 }}>
                <div style={{ ...sectionCardStyle, display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>{mr ? "ट्रॅक्टर जोडा / संपादित करा" : "Add / Edit Tractors"}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{mr ? "इमेज, किंमत आणि उपलब्धता थेट इथून अपडेट करा." : "Update image, pricing, and availability directly from here."}</div>
                    </div>
                    <button
                      onClick={() => {
                        if (showAddForm) resetListingForm();
                        else {
                          setEditingListingId(null);
                          setForm(INITIAL_LISTING_FORM);
                          setShowAddForm(true);
                        }
                      }}
                      style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "10px 16px", fontWeight: 700, cursor: "pointer" }}
                    >
                      {showAddForm ? (mr ? "फॉर्म बंद करा" : "Close Form") : (mr ? "नवीन ट्रॅक्टर" : "New Tractor")}
                    </button>
                  </div>

                  {showAddForm && (
                    <form onSubmit={handleAddListing} style={{ background: "#f9fafb", borderRadius: 14, border: "1px solid #e5e7eb", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                        {editingListingId ? (mr ? "ट्रॅक्टर संपादित करा" : "Edit Tractor") : (mr ? "नवीन ट्रॅक्टर जोडा" : "Add New Tractor")}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
                        {[
                          [mr ? "ट्रॅक्टर नाव" : "Tractor name", "title"],
                          [mr ? "लोकेशन" : "Location", "location"],
                          [mr ? "किंमत" : "Pricing", "price"],
                          [mr ? "फोन नंबर" : "Contact phone", "phone"],
                          [mr ? "इमेज URL" : "Image URL", "image"],
                        ].map(([label, key]) => (
                          <input
                            key={key}
                            required={key !== "image"}
                            placeholder={label}
                            value={form[key]}
                            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                            style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 12px", fontSize: 13, boxSizing: "border-box" }}
                          />
                        ))}
                        <select
                          value={form.available ? "available" : "paused"}
                          onChange={(e) => setForm({ ...form, available: e.target.value === "available" })}
                          style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 12px", fontSize: 13, background: "#fff" }}
                        >
                          <option value="available">{mr ? "उपलब्ध" : "Available"}</option>
                          <option value="paused">{mr ? "अनुपलब्ध" : "Unavailable"}</option>
                        </select>
                      </div>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <button type="submit" style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "10px 16px", fontWeight: 700, cursor: "pointer" }}>
                          {editingListingId ? (mr ? "बदल जतन करा" : "Save Changes") : (mr ? "ट्रॅक्टर सूचीबद्ध करा" : "List Tractor")}
                        </button>
                        <button type="button" onClick={resetListingForm} style={{ background: "#fff", color: "#374151", border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 16px", fontWeight: 700, cursor: "pointer" }}>
                          {mr ? "रद्द करा" : "Cancel"}
                        </button>
                      </div>
                    </form>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14 }}>
                    {myListings.map((listing) => (
                      <div key={listing._id || listing.id} style={{ border: "1px solid #e5e7eb", borderRadius: 16, overflow: "hidden", background: "#fff" }}>
                        <div
                          style={{
                            height: 124,
                            background: listing.image ? `linear-gradient(rgba(15,23,42,0.18), rgba(15,23,42,0.18)), url(${listing.image})` : "linear-gradient(135deg,#1a3a2a,#16a34a)",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: 14,
                            color: "#fff",
                          }}
                        >
                          <span style={{ fontSize: 34 }}>{listing.image ? "" : "🚜"}</span>
                          <span style={{ background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>
                            {listing.available === false ? (mr ? "थांबवले" : "Paused") : (mr ? "लाइव्ह" : "Live")}
                          </span>
                        </div>
                        <div style={{ padding: 14 }}>
                          <div style={{ fontWeight: 800, fontSize: 15, color: "#111827" }}>{listing.title}</div>
                          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>📍 {listing.location}</div>
                          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>💰 {listing.price}</div>
                          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>📞 {listing.phone || (mr ? "फोन नाही" : "No phone")}</div>
                          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                            <button onClick={() => startEditListing(listing)} style={{ flex: 1, minWidth: 90, background: "#fff", color: "#166534", border: "1px solid #bbf7d0", borderRadius: 10, padding: "9px 12px", fontWeight: 700, cursor: "pointer" }}>
                              {mr ? "संपादित" : "Edit"}
                            </button>
                            <button onClick={() => toggleAvailability(listing)} style={{ flex: 1, minWidth: 110, background: listing.available === false ? "#dcfce7" : "#fee2e2", color: listing.available === false ? "#166534" : "#b91c1c", border: "none", borderRadius: 10, padding: "9px 12px", fontWeight: 700, cursor: "pointer" }}>
                              {listing.available === false ? (mr ? "उपलब्ध करा" : "Make Live") : (mr ? "थांबवा" : "Pause")}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {myListings.length === 0 && (
                      <div style={{ border: "1px dashed #cbd5e1", borderRadius: 16, padding: 24, textAlign: "center", color: "#6b7280" }}>
                        <div style={{ fontSize: 38, marginBottom: 10 }}>🚜</div>
                        <div style={{ fontWeight: 700, color: "#111827", marginBottom: 4 }}>{mr ? "अजून कोणताही ट्रॅक्टर नाही" : "No tractors listed yet"}</div>
                        <div style={{ fontSize: 12 }}>{mr ? "पहिला ट्रॅक्टर जोडून डॅशबोर्ड सुरू करा." : "Add your first tractor to start managing it here."}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ ...sectionCardStyle, display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>{mr ? "उपलब्धता कॅलेंडर" : "Availability Calendar"}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{mr ? "पुढील 7 दिवसांसाठी ट्रॅक्टर स्थिती." : "Preview your tractor status for the next 7 days."}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {Object.values(availabilityLegend).map((item) => (
                      <span key={item.label} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: item.bg, color: item.color, borderRadius: 999, padding: "5px 10px", fontSize: 11, fontWeight: 700 }}>
                        <span>{item.short}</span>{item.label}
                      </span>
                    ))}
                  </div>
                  {myListings.length === 0 ? (
                    <div style={{ background: "#f9fafb", border: "1px dashed #d1d5db", borderRadius: 16, padding: 26, textAlign: "center", color: "#6b7280" }}>
                      {mr ? "कॅलेंडर पाहण्यासाठी आधी ट्रॅक्टर जोडा." : "Add tractors first to preview the calendar."}
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: `160px repeat(${calendarDays.length}, minmax(42px,1fr))`, gap: 8, alignItems: "center" }}>
                      <div />
                      {calendarDays.map((day) => (
                        <div key={getDateKey(day)} style={{ textAlign: "center", fontSize: 11, color: "#6b7280", fontWeight: 700 }}>
                          <div>{day.toLocaleDateString("en-IN", { weekday: "short" })}</div>
                          <div>{day.getDate()}</div>
                        </div>
                      ))}
                      {myListings.slice(0, 3).map((listing) => (
                        <div key={listing._id || listing.id} style={{ display: "contents" }}>
                          <div style={{ padding: "10px 12px", borderRadius: 12, background: "#f9fafb", border: "1px solid #eef2f7" }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{listing.title}</div>
                            <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>{listing.price}</div>
                          </div>
                          {calendarDays.map((day) => {
                            const state = getAvailabilityForDay(listing, day);
                            return (
                              <div key={`${listing._id || listing.id}-${getDateKey(day)}`} style={{ height: 44, borderRadius: 12, background: state.bg, color: state.color, border: `1px solid ${state.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800 }}>
                                {state.short}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(360px,1fr))", gap: 20 }}>
                <div style={{ ...sectionCardStyle, display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>{mr ? "बुकिंग विनंत्या" : "Booking Requests"}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{mr ? "नवीन शेतकरी विनंत्यांना तत्काळ प्रतिसाद द्या." : "Respond to new farmer requests right from home."}</div>
                    </div>
                    <button onClick={() => setActiveTab("bookings")} style={{ background: "none", border: "none", color: "#16a34a", fontWeight: 700, cursor: "pointer" }}>
                      {mr ? "सर्व पहा" : "View all"}
                    </button>
                  </div>
                  {pendingBookings.length === 0 ? (
                    <div style={{ background: "#f9fafb", borderRadius: 16, padding: 28, textAlign: "center", color: "#6b7280" }}>
                      <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
                      {mr ? "आत्ता कोणतीही प्रलंबित विनंती नाही." : "No pending requests right now."}
                    </div>
                  ) : (
                    pendingBookings.slice(0, 3).map((booking) => (
                      <div key={booking.id || booking._id} style={{ border: "1px solid #fef3c7", background: "#fffbeb", borderRadius: 14, padding: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{booking.farmerName || booking.farmerEmail}</div>
                            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{booking.listingTitle}</div>
                            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>📅 {booking.date}</div>
                          </div>
                          <span style={{ background: "#fff", color: "#92400e", borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 800, height: "fit-content" }}>
                            {mr ? "प्रलंबित" : "Pending"}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => handleStatus(booking.id || booking._id, "accepted")} style={{ flex: 1, background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "9px 12px", fontWeight: 700, cursor: "pointer" }}>
                            {mr ? "स्वीकारा" : "Accept"}
                          </button>
                          <button onClick={() => handleStatus(booking.id || booking._id, "rejected")} style={{ flex: 1, background: "#fff", color: "#b91c1c", border: "1px solid #fecaca", borderRadius: 10, padding: "9px 12px", fontWeight: 700, cursor: "pointer" }}>
                            {mr ? "नकार द्या" : "Reject"}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ ...sectionCardStyle, display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>{mr ? "कमाई विश्लेषण" : "Earnings Analytics"}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{mr ? "होम पेजवरूनच कमाई ट्रेंड आणि प्रति बुकिंग मूल्य पाहा." : "Track your trend and booking value directly from the home page."}</div>
                    </div>
                    <button onClick={() => setActiveTab("earnings")} style={{ background: "none", border: "none", color: "#16a34a", fontWeight: 700, cursor: "pointer" }}>
                      {mr ? "तपशील" : "Details"}
                    </button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 12 }}>
                    {[
                      { label: mr ? "एकूण कमाई" : "Total Earned", value: formatCurrency(totalEarnings) },
                      { label: mr ? "प्रति बुकिंग" : "Avg / Booking", value: formatCurrency(averageTicket) },
                      { label: mr ? "कन्फर्म बुकिंग" : "Confirmed", value: acceptedBookings.length },
                    ].map((metric) => (
                      <div key={metric.label} style={{ background: "#f9fafb", borderRadius: 14, padding: 14, border: "1px solid #eef2f7" }}>
                        <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 700 }}>{metric.label}</div>
                        <div style={{ fontSize: 20, fontWeight: 900, color: "#111827", marginTop: 6 }}>{metric.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "#f9fafb", borderRadius: 16, border: "1px solid #eef2f7", padding: "16px 14px 8px" }}>
                    <LineChart data={earningsData} labels={earningsLabels} color="#16a34a" />
                  </div>
                  {totalEarnings === 0 && (
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      {mr ? "पहिली कन्फर्म बुकिंग झाल्यावर वास्तविक कमाई डेटा इथे अपडेट होईल." : "Real earnings will update here after your first confirmed booking."}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(360px,1fr))", gap: 20 }}>
                <div style={{ ...sectionCardStyle, display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>{mr ? "फीडबॅक आणि रेटिंग" : "Feedback & Ratings"}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{mr ? "तुमच्या ट्रॅक्टरवरील रेटिंग आणि ग्राहक अनुभव." : "Monitor tractor ratings and customer trust signals."}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, borderRadius: 16, background: "linear-gradient(135deg,#fff7ed,#fffbeb)", border: "1px solid #fde68a" }}>
                    <div style={{ fontSize: 34, fontWeight: 900, color: "#111827" }}>{averageRating}</div>
                    <div>
                      <div style={{ color: "#f59e0b", fontSize: 18 }}>
                        {[...Array(5)].map((_, index) => <span key={index}>{index < Math.round(Number(averageRating)) ? "★" : "☆"}</span>)}
                      </div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                        {feedbackListings.length
                          ? `${feedbackListings.length} ${mr ? "रेटेड ट्रॅक्टर" : "rated tractors"}`
                          : (mr ? "अजून रेटिंग आलेले नाही" : "No ratings yet")}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {feedbackListings.length === 0 ? (
                      <div style={{ background: "#f9fafb", borderRadius: 16, padding: 24, textAlign: "center", color: "#6b7280" }}>
                        {mr ? "बुकिंग पूर्ण झाल्यावर ग्राहक रेटिंग इथे दिसतील." : "Customer ratings will appear here once bookings are completed."}
                      </div>
                    ) : (
                      feedbackListings.slice(0, 3).map((listing) => (
                        <div key={listing._id || listing.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "12px 14px", background: "#f9fafb", borderRadius: 14, border: "1px solid #eef2f7" }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{listing.title}</div>
                            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{listing.location}</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ color: "#f59e0b", fontSize: 13 }}>
                              {[...Array(5)].map((_, index) => <span key={index}>{index < Math.round(Number(listing.rating || 0)) ? "★" : "☆"}</span>)}
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 800, color: "#111827", marginTop: 4 }}>{Number(listing.rating || 0).toFixed(1)}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div style={{ ...sectionCardStyle, display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>{mr ? "संदेश" : "Messages"}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{mr ? "शेतकऱ्यांशी झालेले ताजे संभाषण." : "Stay on top of your latest conversations with farmers."}</div>
                    </div>
                    <button onClick={() => navigate("/messages")} style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "9px 14px", fontWeight: 700, cursor: "pointer" }}>
                      {mr ? "मेसेज उघडा" : "Open Messages"}
                    </button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 12 }}>
                    <div style={{ background: "#f0fdf4", borderRadius: 14, padding: 14 }}>
                      <div style={{ fontSize: 11, color: "#15803d", fontWeight: 700 }}>{mr ? "न वाचलेले" : "Unread"}</div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: "#111827", marginTop: 6 }}>{unreadMessages}</div>
                    </div>
                    <div style={{ background: "#eff6ff", borderRadius: 14, padding: 14 }}>
                      <div style={{ fontSize: 11, color: "#1d4ed8", fontWeight: 700 }}>{mr ? "संभाषणे" : "Conversations"}</div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: "#111827", marginTop: 6 }}>{conversations.length}</div>
                    </div>
                  </div>
                  {conversations.length === 0 ? (
                    <div style={{ background: "#f9fafb", borderRadius: 16, padding: 24, textAlign: "center", color: "#6b7280" }}>
                      {mr ? "अजून कोणतेही संभाषण सुरू झालेले नाही." : "No conversations started yet."}
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {conversations.slice(0, 3).map((conversation) => (
                        <div key={conversation.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#f9fafb", borderRadius: 14, border: "1px solid #eef2f7" }}>
                          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#14532d,#16a34a)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                            {(conversation.lastMsg?.fromName || conversation.other || "?").charAt(0).toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{conversation.lastMsg?.fromName || conversation.lastMsg?.toName || conversation.other}</div>
                            <div style={{ fontSize: 11, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 4 }}>
                              {conversation.lastMsg?.text || (mr ? "नवीन संदेश नाही" : "No recent message")}
                            </div>
                          </div>
                          {conversation.unread > 0 && (
                            <span style={{ minWidth: 24, height: 24, borderRadius: 999, background: "#ef4444", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, padding: "0 8px" }}>
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(360px,1fr))", gap: 20 }}>
                <div style={{ ...sectionCardStyle, display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>{mr ? "सूचना" : "Notifications"}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{mr ? "नवीन अपडेट्स, पेमेंट्स आणि बुकिंग अलर्ट." : "Watch booking alerts, payments, and important updates."}</div>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      {unreadNotifs > 0 && (
                        <button onClick={() => markAllRead(user?.email || "")} style={{ background: "#fff", color: "#166534", border: "1px solid #bbf7d0", borderRadius: 10, padding: "9px 12px", fontWeight: 700, cursor: "pointer" }}>
                          {mr ? "सर्व वाचले" : "Mark all read"}
                        </button>
                      )}
                      <button onClick={() => setActiveTab("notifications")} style={{ background: "none", border: "none", color: "#16a34a", fontWeight: 700, cursor: "pointer" }}>
                        {mr ? "सर्व पहा" : "View all"}
                      </button>
                    </div>
                  </div>
                  {myNotifs.length === 0 ? (
                    <div style={{ background: "#f9fafb", borderRadius: 16, padding: 24, textAlign: "center", color: "#6b7280" }}>
                      {mr ? "आत्ता कोणतीही सूचना नाही." : "No notifications yet."}
                    </div>
                  ) : (
                    myNotifs.slice(0, 3).map((notification) => (
                      <div key={notification.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", background: notification.read ? "#f9fafb" : "#f0fdf4", borderRadius: 14, border: notification.read ? "1px solid #eef2f7" : "1px solid #bbf7d0" }}>
                        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>🔔</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{notification.title}</div>
                          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{notification.message}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>{toDate(notification.time)?.toLocaleString("en-IN")}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ ...sectionCardStyle, display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>{mr ? "प्रोफाइल आणि सेटिंग्ज" : "Profile & Settings"}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{mr ? "तुमची अकाउंट माहिती आणि मुख्य प्राधान्ये." : "Your account snapshot and key preferences in one card."}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 16, background: "#f9fafb", border: "1px solid #eef2f7" }}>
                    <div style={{ width: 58, height: 58, borderRadius: "50%", background: "linear-gradient(135deg,#14532d,#16a34a)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900 }}>
                      {user?.name?.charAt(0)?.toUpperCase() || "T"}
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>{user?.name || (mr ? "ट्रॅक्टर मालक" : "Tractor Owner")}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{user?.email}</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
                    {[
                      { label: mr ? "भूमिका" : "Role", value: mr ? "ट्रॅक्टर मालक" : "Tractor Owner" },
                      { label: mr ? "फोन" : "Phone", value: user?.phone || (mr ? "जोडलेला नाही" : "Not added") },
                      { label: mr ? "भाषा" : "Language", value: mr ? "मराठी" : "English" },
                      { label: mr ? "सूचना" : "Alerts", value: unreadNotifs ? `${unreadNotifs} ${mr ? "नवीन" : "new"}` : (mr ? "अप-टू-डेट" : "Up to date") },
                    ].map((item) => (
                      <div key={item.label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 14 }}>
                        <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 700 }}>{item.label}</div>
                        <div style={{ fontSize: 13, color: "#111827", fontWeight: 800, marginTop: 6 }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button onClick={() => navigate("/messages")} style={{ background: "#fff", color: "#166534", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 14px", fontWeight: 700, cursor: "pointer" }}>
                      {mr ? "संदेश उघडा" : "Open Messages"}
                    </button>
                    <button onClick={() => { logout(); navigate("/login"); }} style={{ background: "#fee2e2", color: "#b91c1c", border: "none", borderRadius: 10, padding: "10px 14px", fontWeight: 700, cursor: "pointer" }}>
                      {mr ? "लॉगआउट" : "Logout"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BOOKING REQUESTS */}
          {activeTab === "bookings" && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 20 }}>📅 Booking Requests</h2>
              {pendingBookings.length === 0 ? (
                <div style={{ background: "#fff", borderRadius: 14, padding: 48, textAlign: "center", border: "1px solid #f3f4f6" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                  <p style={{ color: "#9ca3af" }}>No pending booking requests. All caught up!</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
                  {pendingBookings.map((b, i) => (
                    <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #fef9c3" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15 }}>{b.farmerName || b.farmerEmail}</div>
                          <div style={{ fontSize: 12, color: "#6b7280" }}>Equipment: {b.listingTitle}</div>
                          <div style={{ fontSize: 12, color: "#6b7280" }}>📅 {b.date}</div>
                        </div>
                        <span style={{ background: "#fef9c3", color: "#92400e", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, height: "fit-content" }}>Pending</span>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => handleStatus(b.id || b._id, "accepted")} style={{ flex: 1, background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "10px", fontWeight: 700, cursor: "pointer" }}>✓ Accept</button>
                        <button onClick={() => handleStatus(b.id || b._id, "rejected")} style={{ flex: 1, background: "#fee2e2", color: "#b91c1c", border: "none", borderRadius: 10, padding: "10px", fontWeight: 700, cursor: "pointer" }}>✗ Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* All bookings history */}
              {myBookings.length > 0 && (
                <>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#374151", margin: "24px 0 12px" }}>All Bookings History</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {myBookings.map((b, i) => (
                      <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", border: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{b.farmerName}</div>
                          <div style={{ fontSize: 12, color: "#6b7280" }}>{b.listingTitle} · {b.date}</div>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
                          background: b.status === "pending" ? "#fef9c3" : b.status === "accepted" ? "#dcfce7" : "#fee2e2",
                          color: b.status === "pending" ? "#92400e" : b.status === "accepted" ? "#15803d" : "#b91c1c"
                        }}>{b.status}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* MY TRACTORS */}
          {activeTab === "tractors" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>🚜 {mr ? "माझे ट्रॅक्टर" : "My Tractors"}</h2>
                <button
                  onClick={() => {
                    if (showAddForm) resetListingForm();
                    else {
                      setEditingListingId(null);
                      setForm(INITIAL_LISTING_FORM);
                      setShowAddForm(true);
                    }
                  }}
                  style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}
                >
                  {showAddForm ? (mr ? "फॉर्म बंद करा" : "Close Form") : (mr ? "+ ट्रॅक्टर जोडा" : "+ Add Tractor")}
                </button>
              </div>
              {showAddForm && (
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", marginBottom: 20, border: "1px solid #bbf7d0" }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 16, color: "#111827" }}>
                    {editingListingId ? (mr ? "ट्रॅक्टर संपादित करा" : "Edit Tractor") : (mr ? "नवीन ट्रॅक्टर जोडा" : "Add New Tractor")}
                  </h3>
                  <form onSubmit={handleAddListing} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
                      {[
                        [mr ? "ट्रॅक्टर नाव" : "Tractor name", "title"],
                        [mr ? "लोकेशन" : "Location", "location"],
                        [mr ? "किंमत" : "Pricing", "price"],
                        [mr ? "फोन नंबर" : "Contact phone", "phone"],
                        [mr ? "इमेज URL" : "Image URL", "image"],
                      ].map(([ph, key]) => (
                        <input key={key} required={key !== "image"} placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                          style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 14px", fontSize: 14, boxSizing: "border-box" }} />
                      ))}
                      <select
                        value={form.available ? "available" : "paused"}
                        onChange={(e) => setForm({ ...form, available: e.target.value === "available" })}
                        style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 14px", fontSize: 14, background: "#fff" }}
                      >
                        <option value="available">{mr ? "उपलब्ध" : "Available"}</option>
                        <option value="paused">{mr ? "अनुपलब्ध" : "Unavailable"}</option>
                      </select>
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button type="submit" style={{ flex: 1, background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "11px", fontWeight: 700, cursor: "pointer" }}>
                        {editingListingId ? (mr ? "बदल जतन करा" : "Save Changes") : (mr ? "ट्रॅक्टर सूचीबद्ध करा" : "List Tractor")}
                      </button>
                      <button type="button" onClick={resetListingForm} style={{ flex: 1, background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 10, padding: "11px", fontWeight: 700, cursor: "pointer" }}>
                        {mr ? "रद्द करा" : "Cancel"}
                      </button>
                    </div>
                  </form>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
                {myListings.map((l) => (
                  <div key={l._id || l.id} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                    <div
                      style={{
                        background: l.image ? `linear-gradient(rgba(15,23,42,0.18), rgba(15,23,42,0.18)), url(${l.image})` : "linear-gradient(135deg,#1a3a2a,#16a34a)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height: 110,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 14,
                        color: "#fff",
                      }}
                    >
                      <span style={{ fontSize: 34 }}>{l.image ? "" : "🚜"}</span>
                      <span style={{ background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 700 }}>
                        {l.available === false ? (mr ? "थांबवले" : "Paused") : (mr ? "सक्रिय" : "Active")}
                      </span>
                    </div>
                    <div style={{ padding: 16 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{l.title}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>📍 {l.location}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>💰 {l.price}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>📞 {l.phone || (mr ? "फोन नाही" : "No phone")}</div>
                      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        <button onClick={() => startEditListing(l)} style={{ flex: 1, background: "#fff", color: "#166534", border: "1px solid #bbf7d0", borderRadius: 10, padding: "9px 12px", fontWeight: 700, cursor: "pointer" }}>
                          {mr ? "संपादित" : "Edit"}
                        </button>
                        <button onClick={() => toggleAvailability(l)} style={{ flex: 1, background: l.available === false ? "#dcfce7" : "#fee2e2", color: l.available === false ? "#166534" : "#b91c1c", border: "none", borderRadius: 10, padding: "9px 12px", fontWeight: 700, cursor: "pointer" }}>
                          {l.available === false ? (mr ? "उपलब्ध करा" : "Make Live") : (mr ? "थांबवा" : "Pause")}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {myListings.length === 0 && (
                  <div style={{ textAlign: "center", padding: 48, color: "#9ca3af", border: "1px dashed #d1d5db", borderRadius: 14 }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🚜</div>
                    <p>{mr ? "अजून ट्रॅक्टर सूचीबद्ध नाही. पहिला ट्रॅक्टर जोडा!" : "No tractors listed yet. Add your first tractor!"}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* EARNINGS */}
          {activeTab === "earnings" && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 20 }}>💰 Earnings Report</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 20 }}>
                {[
                  { label: "This Month", value: "₹18,750", trend: "+15%" },
                  { label: "Last Month", value: "₹16,200", trend: "+8%" },
                  { label: "Total Earned", value: "₹48,750", trend: "YTD" },
                ].map((e, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{e.label}</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: "8px 0 4px" }}>{e.value}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#16a34a" }}>{e.trend}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", border: "1px solid #f3f4f6" }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 16 }}>Payment History</div>
                {[
                  { date: "25 May", job: "Ploughing - Ramesh Patil", amount: "₹1,600", status: "Completed" },
                  { date: "24 May", job: "Harvesting - Vikas Shinde", amount: "₹2,000", status: "Completed" },
                  { date: "23 May", job: "Tilling - Suresh Kumar", amount: "₹1,200", status: "Pending" },
                ].map((p, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "#f9fafb", borderRadius: 10, marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{p.job}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>{p.date}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#16a34a" }}>{p.amount}</div>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                        background: p.status === "Completed" ? "#dcfce7" : "#fef9c3",
                        color: p.status === "Completed" ? "#15803d" : "#92400e"
                      }}>{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 20 }}>🔔 Notifications</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {myNotifs.length === 0 ? (
                  <div style={{ background: "#fff", borderRadius: 14, padding: 48, textAlign: "center", color: "#9ca3af" }}>No notifications yet.</div>
                ) : myNotifs.map((n, i) => (
                  <div key={i} style={{ background: n.read ? "#fff" : "#f0fdf4", borderRadius: 12, padding: "16px 20px", border: n.read ? "1px solid #f3f4f6" : "1px solid #bbf7d0", display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🔔</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{n.title}</div>
                      <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{n.message}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>{new Date(n.time).toLocaleString()}</div>
                    </div>
                    {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a", flexShrink: 0, marginTop: 4 }} />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {!["home", "bookings", "tractors", "earnings", "notifications"].includes(activeTab) && (
            <div style={{ background: "#fff", borderRadius: 14, padding: 48, textAlign: "center", border: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{NAV.find(n => n.id === activeTab)?.icon}</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>{NAV.find(n => n.id === activeTab)?.label}</h2>
              <p style={{ color: "#9ca3af" }}>This section is coming soon.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
