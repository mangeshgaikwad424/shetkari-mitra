import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import { useNotifications } from "../context/NotificationContext";
import { LanguageContext } from "../context/LanguageContext";
import { useContext } from "react";

export default function FarmerDashboard() {
  const { lang } = useContext(LanguageContext);
  const NAV = lang === "mr" ? [
    { id: "home", label: "डॅशबोर्ड", icon: "🏠" },
    { id: "tractors", label: "ट्रॅक्टर मिळवा", icon: "🚜" },
    { id: "labour", label: "मजूर मिळवा", icon: "👷" },
    { id: "bookings", label: "माझे बुकिंग", icon: "📅" },
    { id: "earnings", label: "कमाई", icon: "💰" },
    { id: "schemes", label: "शासकीय योजना", icon: "📋" },
    { id: "crop", label: "पीक डॉक्टर", icon: "🌿" },
    { id: "notifications", label: "सूचना", icon: "🔔" },
    { id: "profile", label: "प्रोफाईल", icon: "👤" },
    { id: "settings", label: "सेटिंग्ज", icon: "⚙️" },
  ] : [
    { id: "home", label: "Dashboard", icon: "🏠" },
    { id: "tractors", label: "Hire Tractor", icon: "🚜" },
    { id: "labour", label: "Hire Labour", icon: "👷" },
    { id: "bookings", label: "My Bookings", icon: "📅" },
    { id: "earnings", label: "Earnings", icon: "💰" },
    { id: "schemes", label: "Govt Schemes", icon: "📋" },
    { id: "crop", label: "Crop Doctor", icon: "🌿" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const { user, logout } = useAuth();
  const { getListingsByType, createBooking, getBookingsForUser } = useBooking();
  const { getForUser } = useNotifications();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("home");
  const [bookingModal, setBookingModal] = useState(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingMsg, setBookingMsg] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const myNotifs = getForUser(user?.email || "");
  const unreadNotifs = myNotifs.filter(n => !n.read).length;
  const myBookings = getBookingsForUser(user?.email) || [];
  const tractors = getListingsByType("tractor");
  const labours = getListingsByType("labour");

  const stats = lang === "mr" ? [
    { label: "सक्रिय नोंदणी", value: "८", sub: "या आठवड्यात +२", subColor: "#16a34a", icon: "🌾", iconBg: "#dcfce7" },
    { label: "एकूण कमाई", value: "₹२४,५००", sub: "या महिन्यात +१८%", subColor: "#16a34a", icon: "💰", iconBg: "#dcfce7" },
    { label: "माझे बुकिंग", value: myBookings.length || "०", sub: "१ आगामी", subColor: "#16a34a", icon: "📅", iconBg: "#dcfce7" },
    { label: "योजना लाभ", value: "₹८,२००", sub: "२ योजनांचा लाभ घेतला", subColor: "#16a34a", icon: "🏦", iconBg: "#dcfce7" },
  ] : [
    { label: "Active Listings", value: "8", sub: "+2 this week", subColor: "#16a34a", icon: "🌾", iconBg: "#dcfce7" },
    { label: "Total Earnings", value: "₹24,500", sub: "+18% this month", subColor: "#16a34a", icon: "💰", iconBg: "#dcfce7" },
    { label: "My Bookings", value: myBookings.length || "0", sub: "1 upcoming", subColor: "#16a34a", icon: "📅", iconBg: "#dcfce7" },
    { label: "Scheme Benefits", value: "₹8,200", sub: "2 schemes availed", subColor: "#16a34a", icon: "🏦", iconBg: "#dcfce7" },
  ];

  const recentActivity = [
    { message: "Tractor booking request sent to Suresh Patil", status: "Pending", time: "2 hours ago", icon: "🚜", statusBg: "#fef9c3", statusColor: "#92400e" },
    { message: "Labour request accepted by Ganesh Kadam", status: "Accepted", time: "5 hours ago", icon: "✅", statusBg: "#dcfce7", statusColor: "#15803d" },
    { message: "Payment of ₹2,000 received", status: "Completed", time: "1 day ago", icon: "💵", statusBg: "#dbeafe", statusColor: "#1d4ed8" },
    { message: "Crop listing (Wheat) updated", status: "Updated", time: "2 days ago", icon: "📋", statusBg: "#f3f4f6", statusColor: "#374151" },
  ];

  const barData = [10, 15, 12, 18, 14, 20, 16];
  const maxBar = Math.max(...barData);

  const handleBook = (item) => {
    setBookingModal(item);
    setBookingDate("");
    setBookingMsg("");
    setBookingSuccess("");
  };

  const confirmBooking = () => {
    createBooking(user, bookingModal, bookingDate, bookingMsg);
    setBookingSuccess("Booking request sent successfully! 🎉");
    setTimeout(() => setBookingModal(null), 2000);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif", background: "#f8fafc" }}>

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 49 }}
        />
      )}

      {/* ─── SIDEBAR ─── */}
      <aside style={{
        width: 220, background: "linear-gradient(180deg,#14532d 0%,#052e16 100%)",
        display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
        transform: sidebarOpen ? "translateX(0)" : undefined,
        transition: "transform 0.25s ease",
      }}
      className={`farmer-sidebar${sidebarOpen ? " sidebar-open" : ""}`}>
        {/* Logo */}
        <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>🌾</span>
            <div>
              <div style={{ fontWeight: 800, color: "#fff", fontSize: 14, lineHeight: 1.2 }}>Shetkari Mitra</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Farmer</div>
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
            <button key={n.id} onClick={() => n.id === "schemes" ? navigate("/schemes") : n.id === "crop" ? navigate("/crop") : setActiveTab(n.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 8, marginBottom: 2,
                background: activeTab === n.id ? "rgba(74,222,128,0.15)" : "transparent",
                color: activeTab === n.id ? "#4ade80" : "rgba(255,255,255,0.65)",
                border: activeTab === n.id ? "1px solid rgba(74,222,128,0.2)" : "1px solid transparent",
                cursor: "pointer", fontSize: 13, fontWeight: 600, textAlign: "left", transition: "all 0.2s",
              }}>
              <span style={{ fontSize: 17 }}>{n.icon}</span>
              {n.label}
              {n.id === "notifications" && unreadNotifs > 0 && (
                <span style={{ marginLeft: "auto", background: "#ef4444", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>{unreadNotifs}</span>
              )}
              {n.id === "bookings" && myBookings.filter(b => b.status === "pending").length > 0 && (
                <span style={{ marginLeft: "auto", background: "#f59e0b", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>
                  {myBookings.filter(b => b.status === "pending").length}
                </span>
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

      {/* ─── MAIN CONTENT ─── */}
      <div style={{ marginLeft: 220, flex: 1 }} className="farmer-main">

        {/* Top Bar */}
        <header style={{
          background: "#fff", borderBottom: "1px solid #e5e7eb",
          padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center",
          position: "sticky", top: 0, zIndex: 40,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Hamburger for mobile */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="sidebar-hamburger"
              style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#374151", display: "none" }}
            >
              ☰
            </button>
            <div>
              <div style={{ fontSize: 13, color: "#9ca3af" }}>{lang === "mr" ? "पुन्हा स्वागत आहे," : "Welcome back,"}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{user?.name || (lang === "mr" ? "शेतकरी" : "Farmer")} 👋</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>📍 {user?.village || "Maharashtra"}, India</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
            {/* Bell */}
            <button onClick={() => setActiveTab("notifications")}
              style={{ position: "relative", background: "none", border: "none", fontSize: 20, cursor: "pointer", padding: 6 }}>
              🔔
              {unreadNotifs > 0 && (
                <span style={{ position: "absolute", top: 0, right: 0, background: "#ef4444", color: "#fff", borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>
                  {unreadNotifs}
                </span>
              )}
            </button>

            {/* Profile */}
            <button onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#14532d,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15 }}>
                {user?.name?.charAt(0)?.toUpperCase() || "F"}
              </div>
              <span style={{ fontSize: 11, color: "#6b7280" }}>▼</span>
            </button>

            {showProfileMenu && (
              <div style={{ position: "absolute", top: 52, right: 0, background: "#fff", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb", width: 180, zIndex: 100 }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6" }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{user?.name}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{user?.email}</div>
                  <div style={{ fontSize: 11, color: "#16a34a", marginTop: 2, fontWeight: 600 }}>🌾 Farmer</div>
                </div>
                <button onClick={() => navigate("/")} style={{ width: "100%", padding: "10px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", color: "#374151", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                  🏡 Home Page
                </button>
                <button onClick={() => { logout(); navigate("/login"); }}
                  style={{ width: "100%", padding: "10px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left", color: "#ef4444", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main style={{ padding: 28 }}>

          {/* ── DASHBOARD HOME ── */}
          {activeTab === "home" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
                {stats.map((s, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{s.label}</div>
                      <div style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "8px 0 4px" }}>{s.value}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: s.subColor }}>{s.sub}</div>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
                  </div>
                ))}
              </div>

              {/* Earnings Chart + Quick Actions */}
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>

                {/* Bar Chart */}
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{lang === "mr" ? "कमाईचा आढावा" : "Earnings Overview"}</div>
                    <select style={{ fontSize: 12, border: "1px solid #d1d5db", borderRadius: 8, padding: "5px 10px", background: "#fff", color: "#374151" }}>
                      <option>{lang === "mr" ? "या महिन्यात" : "This Month"}</option>
                      <option>{lang === "mr" ? "मागील महिन्यात" : "Last Month"}</option>
                      <option>{lang === "mr" ? "गेल्या ३ महिन्यांत" : "Last 3 Months"}</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140 }}>
                    {barData.map((h, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <div style={{
                          width: "100%", background: "linear-gradient(to top,#16a34a,#4ade80)",
                          borderRadius: "5px 5px 0 0", height: `${(h / maxBar) * 110}px`, transition: "height 0.4s ease",
                        }} />
                        <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>{['M','T','W','T','F','S','S'][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions + Alerts */}
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{lang === "mr" ? "जलद कृती" : "Quick Actions"}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {(lang === "mr" ? [
                      { label: "ट्रॅक्टर मिळवा", icon: "🚜", color: "#f0fdf4", border: "#bbf7d0", text: "#15803d", action: () => setActiveTab("tractors") },
                      { label: "मजूर मिळवा", icon: "👷", color: "#fef9c3", border: "#fde047", text: "#854d0e", action: () => setActiveTab("labour") },
                      { label: "माझे बुकिंग", icon: "📅", color: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8", action: () => setActiveTab("bookings") },
                      { label: "शासकीय योजना", icon: "📋", color: "#fdf4ff", border: "#e9d5ff", text: "#7e22ce", action: () => navigate("/schemes") },
                    ] : [
                      { label: "Hire Tractor", icon: "🚜", color: "#f0fdf4", border: "#bbf7d0", text: "#15803d", action: () => setActiveTab("tractors") },
                      { label: "Hire Labour", icon: "👷", color: "#fef9c3", border: "#fde047", text: "#854d0e", action: () => setActiveTab("labour") },
                      { label: "My Bookings", icon: "📅", color: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8", action: () => setActiveTab("bookings") },
                      { label: "Govt Schemes", icon: "📋", color: "#fdf4ff", border: "#e9d5ff", text: "#7e22ce", action: () => navigate("/schemes") },
                    ]).map((a, i) => (
                      <button key={i} onClick={a.action}
                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px", borderRadius: 10, border: `1px solid ${a.border}`, background: a.color, color: a.text, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                        <span style={{ fontSize: 18 }}>{a.icon}</span>{a.label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#111827", marginBottom: 8 }}>📢 {lang === "mr" ? "सतर्कता आणि टिपा" : "Alerts & Tips"}</div>
                    {(lang === "mr" ? ["खरीप पेरणी हंगाम १ जूनपासून सुरू होत आहे", "गव्हाच्या हमीभावात ८% वाढ", "पंतप्रधान किसान योजनेचा नवीन हप्ता जुलैमध्ये अपेक्षित"] : ["Kharif sowing season starts June 1st", "MSP for wheat increased by 8%", "New PM-KISAN installment due in July"]).map((tip, i) => (
                      <div key={i} style={{ display: "flex", gap: 8, padding: "8px 10px", background: "#f0fdf4", borderRadius: 8, marginBottom: 6, alignItems: "flex-start" }}>
                        <span style={{ color: "#16a34a", fontWeight: 700 }}>•</span>
                        <span style={{ fontSize: 12, color: "#374151" }}>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upcoming Bookings (live) */}
              {myBookings.filter(b => b.status === "accepted").length > 0 && (
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{lang === "mr" ? "आगामी बुकिंग" : "Upcoming Bookings"}</div>
                    <button onClick={() => setActiveTab("bookings")} style={{ fontSize: 12, color: "#16a34a", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>{lang === "mr" ? "सर्व पहा →" : "View All →"}</button>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                    {myBookings.filter(b => b.status === "accepted").slice(0, 3).map((b, i) => (
                      <div key={i} style={{ padding: "14px", background: "#f0fdf4", borderRadius: 10, border: "1px solid #bbf7d0" }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{b.listingTitle || b.title}</div>
                        <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>📅 {b.date}</div>
                        <div style={{ fontSize: 11, color: "#6b7280" }}>By: {b.ownerName}</div>
                        <span style={{ display: "inline-block", marginTop: 8, fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 20, background: "#dcfce7", color: "#15803d" }}>✅ Confirmed</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Activity + Top Services */}
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{lang === "mr" ? "अलीकडील क्रियाकलाप" : "Recent Activity"}</div>
                    <button style={{ fontSize: 12, color: "#16a34a", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>{lang === "mr" ? "सर्व पहा →" : "View All →"}</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {recentActivity.map((a, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#f9fafb", borderRadius: 10, border: "1px solid #f3f4f6" }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{a.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{a.message}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{a.time}</div>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: a.statusBg, color: a.statusColor, whiteSpace: "nowrap" }}>{a.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 14 }}>{lang === "mr" ? "प्रसिद्ध सेवा" : "Top Services"}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {(lang === "mr" ? [
                      { title: "ट्रॅक्टर भाड्याने", count: "१२०+ ट्रॅक्टर्स", icon: "🚜", tab: "tractors", bg: "#f0fdf4", border: "#bbf7d0" },
                      { title: "मजूर सेवा", count: "२००+ कामगार", icon: "👷", tab: "labour", bg: "#fef9c3", border: "#fde047" },
                      { title: "पीक डॉक्टर", count: "तज्ज्ञांचा सल्ला", icon: "🌿", link: "/crop", bg: "#f0fdf4", border: "#bbf7d0" },
                    ] : [
                      { title: "Tractor Rental", count: "120+ Tractors", icon: "🚜", tab: "tractors", bg: "#f0fdf4", border: "#bbf7d0" },
                      { title: "Labour Services", count: "200+ Workers", icon: "👷", tab: "labour", bg: "#fef9c3", border: "#fde047" },
                      { title: "Crop Doctor", count: "Expert advice", icon: "🌿", link: "/crop", bg: "#f0fdf4", border: "#bbf7d0" },
                    ]).map((s, i) => (
                      <button key={i}
                        onClick={() => s.tab ? setActiveTab(s.tab) : navigate(s.link || "/crop")}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", background: s.bg, borderRadius: 10, border: `1px solid ${s.border}`, cursor: "pointer", textAlign: "left" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{s.title}</div>
                          <div style={{ fontSize: 11, color: "#6b7280" }}>{s.count}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── HIRE TRACTOR ── */}
          {activeTab === "tractors" && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 20 }}>🚜 Available Tractors</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
                {tractors.map((t, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #fef9c3" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{t.title}</div>
                        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>👤 {t.ownerName}</div>
                      </div>
                      <span style={{ background: "#fef9c3", color: "#92400e", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, height: "fit-content" }}>🚜 Tractor</span>
                    </div>
                    <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#6b7280", marginBottom: 14, flexWrap: "wrap" }}>
                      <span>📍 {t.location}</span>
                      <span>💰 {t.price}</span>
                      {t.rating && <span>⭐ {t.rating}</span>}
                    </div>
                    <button onClick={() => handleBook(t)}
                      style={{ width: "100%", background: "#ca8a04", color: "#fff", border: "none", borderRadius: 10, padding: "11px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                      Book Now
                    </button>
                  </div>
                ))}
                {tractors.length === 0 && (
                  <div style={{ gridColumn: "span 2", textAlign: "center", padding: 48, color: "#9ca3af" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🚜</div>
                    <p>No tractors available right now.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── HIRE LABOUR ── */}
          {activeTab === "labour" && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 20 }}>👷 Available Labour</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
                {labours.map((l, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #ffedd5" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{l.ownerName}</div>
                        <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>🔧 {l.skill || l.title}</div>
                      </div>
                      <span style={{ background: "#ffedd5", color: "#9a3412", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, height: "fit-content" }}>👷 Labour</span>
                    </div>
                    <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#6b7280", marginBottom: 14, flexWrap: "wrap" }}>
                      <span>📍 {l.location}</span>
                      <span>💰 {l.price}</span>
                      {l.rating && <span>⭐ {l.rating}</span>}
                    </div>
                    <button onClick={() => handleBook(l)}
                      style={{ width: "100%", background: "#ea580c", color: "#fff", border: "none", borderRadius: 10, padding: "11px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                      Hire Now
                    </button>
                  </div>
                ))}
                {labours.length === 0 && (
                  <div style={{ gridColumn: "span 2", textAlign: "center", padding: 48, color: "#9ca3af" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>👷</div>
                    <p>No labour available right now.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── MY BOOKINGS ── */}
          {activeTab === "bookings" && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 20 }}>📅 My Bookings</h2>
              {myBookings.length === 0 ? (
                <div style={{ background: "#fff", borderRadius: 14, padding: 48, textAlign: "center", border: "1px solid #f3f4f6" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                  <p style={{ color: "#9ca3af", fontSize: 15 }}>No bookings yet. Hire a tractor or labour to get started!</p>
                  <button onClick={() => setActiveTab("tractors")}
                    style={{ marginTop: 16, background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                    Browse Tractors
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {myBookings.map((b, i) => (
                    <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", border: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                          {b.listingType === "tractor" ? "🚜" : "👷"}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{b.listingTitle || b.title}</div>
                          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Owner: {b.ownerName} · 📅 {b.date}</div>
                          {b.message && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>"{b.message}"</div>}
                        </div>
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
                        background: b.status === "pending" ? "#fef9c3" : b.status === "accepted" ? "#dcfce7" : "#fee2e2",
                        color: b.status === "pending" ? "#92400e" : b.status === "accepted" ? "#15803d" : "#b91c1c",
                      }}>{b.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── EARNINGS ── */}
          {activeTab === "earnings" && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 20 }}>💰 Earnings Report</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 20 }}>
                {[
                  { label: "This Month", value: "₹8,500", trend: "+18%" },
                  { label: "Last Month", value: "₹7,200", trend: "+12%" },
                  { label: "Total Earned", value: "₹24,500", trend: "YTD" },
                ].map((e, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{e.label}</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: "8px 0 4px" }}>{e.value}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#16a34a" }}>{e.trend}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", border: "1px solid #f3f4f6" }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 16 }}>Recent Transactions</div>
                {[
                  { date: "25 May", desc: "Wheat crop sale - Mandi", amount: "₹3,200", status: "Received" },
                  { date: "22 May", desc: "Labour payment received", amount: "₹800", status: "Received" },
                  { date: "20 May", desc: "Tractor booking - Ramesh", amount: "₹1,200", status: "Paid" },
                ].map((p, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "#f9fafb", borderRadius: 10, marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{p.desc}</div>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>{p.date}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#16a34a" }}>{p.amount}</div>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "#dcfce7", color: "#15803d" }}>{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeTab === "notifications" && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 20 }}>🔔 Notifications</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {myNotifs.length === 0 ? (
                  <div style={{ background: "#fff", borderRadius: 14, padding: 48, textAlign: "center", border: "1px solid #f3f4f6" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
                    <p style={{ color: "#9ca3af" }}>No notifications yet. Book a tractor or labour to get started!</p>
                  </div>
                ) : myNotifs.map((n, i) => (
                  <div key={i} style={{
                    background: n.read ? "#fff" : "#f0fdf4", borderRadius: 12, padding: "16px 20px",
                    border: n.read ? "1px solid #f3f4f6" : "1px solid #bbf7d0",
                    display: "flex", gap: 14, alignItems: "flex-start",
                  }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                      {n.type === "booking_request" ? "🚜" : n.type === "booking_update" ? "✅" : "🔔"}
                    </div>
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

          {/* ── PROFILE ── */}
          {activeTab === "profile" && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 20 }}>👤 My Profile</h2>
              <div style={{ background: "#fff", borderRadius: 14, padding: "28px", border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#14532d,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 36, fontWeight: 800 }}>
                    {user?.name?.charAt(0)?.toUpperCase() || "F"}
                  </div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{user?.name}</div>
                    <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>🌾 Farmer · {user?.village || "Maharashtra"}</div>
                    <div style={{ fontSize: 13, color: "#16a34a", fontWeight: 600, marginTop: 4 }}>📧 {user?.email}</div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                  {[
                    { label: "Total Bookings", value: myBookings.length },
                    { label: "Active Since", value: "2024" },
                    { label: "Village", value: user?.village || "N/A" },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: "16px", background: "#f0fdf4", borderRadius: 10, border: "1px solid #bbf7d0" }}>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>{item.label}</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", marginTop: 4 }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── OTHER TABS PLACEHOLDER ── */}
          {!["home","tractors","labour","bookings","earnings","notifications","profile"].includes(activeTab) && (
            <div style={{ background: "#fff", borderRadius: 14, padding: 48, textAlign: "center", border: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>{NAV.find(n => n.id === activeTab)?.icon}</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>{NAV.find(n => n.id === activeTab)?.label}</h2>
              <p style={{ color: "#9ca3af" }}>This section is coming soon.</p>
            </div>
          )}

        </main>
      </div>

      {/* ── BOOKING MODAL ── */}
      {bookingModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#111827", marginBottom: 4 }}>Book: {bookingModal.title || bookingModal.ownerName}</h3>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>Owner: {bookingModal.ownerName} · {bookingModal.price}</p>
            {bookingSuccess ? (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 16, color: "#15803d", textAlign: "center", fontWeight: 600 }}>{bookingSuccess}</div>
            ) : (
              <>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Select Date</label>
                <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 14, boxSizing: "border-box" }} />
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Message (optional)</label>
                <textarea value={bookingMsg} onChange={e => setBookingMsg(e.target.value)}
                  placeholder="Any special requirements..."
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 14px", marginBottom: 18, fontSize: 13, resize: "none", height: 80, boxSizing: "border-box" }} />
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setBookingModal(null)}
                    style={{ flex: 1, border: "1px solid #d1d5db", background: "#fff", color: "#374151", borderRadius: 10, padding: "11px", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
                    Cancel
                  </button>
                  <button onClick={confirmBooking} disabled={!bookingDate}
                    style={{ flex: 1, background: bookingDate ? "#16a34a" : "#9ca3af", color: "#fff", border: "none", borderRadius: 10, padding: "11px", fontWeight: 700, cursor: bookingDate ? "pointer" : "not-allowed", fontSize: 14 }}>
                    Send Request
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}