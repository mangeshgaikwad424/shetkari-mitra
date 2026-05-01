import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import { useNotifications } from "../context/NotificationContext";
import { LanguageContext } from "../context/LanguageContext";

// Simple SVG line chart
function LineChart({ data, color = "#16a34a" }) {
  const w = 400, h = 120, pad = 32;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => [
    pad + (i / (data.length - 1)) * (w - pad * 2),
    h - pad - ((v - min) / range) * (h - pad * 2)
  ]);
  const polyline = pts.map(p => p.join(",")).join(" ");
  const area = `${pts[0][0]},${h - pad} ` + pts.map(p => p.join(",")).join(" ") + ` ${pts[pts.length - 1][0]},${h - pad}`;
  const labels = ["1 May", "8 May", "15 May", "22 May", "31 May"];
  const yLabels = ["₹0", "₹20K", "₹40K", "₹48,750"];

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
      {yLabels.reverse().map((l, i) => (
        <text key={i} x={pad - 4} y={pad + i * (h - pad * 2) / 3 + 4} textAnchor="end" fontSize="7" fill="#9ca3af">{l}</text>
      ))}
      {/* X labels */}
      {labels.map((l, i) => (
        <text key={i} x={pad + (i / (labels.length - 1)) * (w - pad * 2)} y={h - 4} textAnchor="middle" fontSize="7" fill="#9ca3af">{l}</text>
      ))}
      {/* Area */}
      <polygon points={area} fill="url(#tractor_area)" />
      {/* Line */}
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      {/* Dot highlight */}
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill={color} />)}
      {/* Tooltip marker */}
      <circle cx={pts[3][0]} cy={pts[3][1]} r="5" fill={color} />
      <text x={pts[3][0]} y={pts[3][1] - 10} textAnchor="middle" fontSize="8" fill={color} fontWeight="700">₹48,750</text>
    </svg>
  );
}

const NAV = [
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

export default function TractorDashboard() {
  const { user, logout } = useAuth();
  const { getBookingsForUser, updateBookingStatus, addListing, getListingsByType } = useBooking();
  const { getForUser } = useNotifications();
  const { lang } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ title: "", location: "", price: "", phone: "" });
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const NAV = lang === "mr" ? [
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
  const myListings = getListingsByType("tractor").filter(l => l.ownerEmail === user?.email);
  const myNotifs = getForUser(user?.email || "");
  const unreadNotifs = myNotifs.filter(n => !n.read).length;

  const handleStatus = (bookingId, status) => {
    updateBookingStatus(bookingId, status, user);
  };

  const handleAddListing = (e) => {
    e.preventDefault();
    addListing(user, { type: "tractor", ...form });
    setShowAddForm(false);
    setForm({ title: "", location: "", price: "", phone: "" });
  };

  const earningsData = [12000, 22000, 18000, 35000, 28000, 48750];
  const tractorStatuses = [
    { name: "Mahindra 575", status: "Available", statusColor: "#16a34a", bg: "#f0fdf4" },
    { name: "Swaraj 744 FE", status: "On Rent", statusColor: "#d97706", bg: "#fef9c3" },
    { name: "John Deere 5050", status: "Available", statusColor: "#16a34a", bg: "#f0fdf4" },
  ];
  const upcomingBookings = [
    { name: "Ramesh Patil", date: "25 May, 10:00 AM", tractor: "Mahindra 575", status: "Confirmed", color: "#16a34a", bg: "#f0fdf4" },
    { name: "Vikas Shinde", date: "26 May, 02:00 PM", tractor: "Swaraj 744 FE", status: "Pending", color: "#d97706", bg: "#fef9c3" },
    { name: "Ganesh Jadhav", date: "28 May, 09:00 AM", tractor: "John Deere 5050", status: "Confirmed", color: "#16a34a", bg: "#f0fdf4" },
  ];
  const recentActivity = [
    { msg: "Booking request from Ramesh Patil", badge: "New", badgeColor: "#3b82f6", badgeBg: "#dbeafe", time: "2 hours ago" },
    { msg: "Booking completed by Vikas Shinde", badge: "Completed", badgeColor: "#16a34a", badgeBg: "#dcfce7", time: "1 day ago" },
    { msg: "Payment received ₹6,500", badge: "Paid", badgeColor: "#16a34a", badgeBg: "#dcfce7", time: "1 day ago" },
    { msg: "Tractor Mahindra 575 under service", badge: "Service", badgeColor: "#f59e0b", badgeBg: "#fef9c3", time: "2 days ago" },
  ];

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
            <button key={n.id} onClick={() => setActiveTab(n.id)}
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
            <button style={{ position: "relative", background: "none", border: "none", fontSize: 20, cursor: "pointer", padding: 6 }}>
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

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
                {lang === "mr" ? [
                { label: "एकूण ट्रॅक्टर", value: myListings.length || "3", sub: "सक्रिय", icon: "🚜", iconBg: "#dcfce7" },
                { label: "या महिन्याचे बुकिंग", value: "12", sub: "+ 20%", subColor: "#16a34a", icon: "📅", iconBg: "#dbeafe" },
                { label: "एकूण कमाई", value: "₹48,750", sub: "+ 18%", subColor: "#16a34a", icon: "💰", iconBg: "#dcfce7" },
                { label: "उपलब्धता", value: "85%", sub: "उत्तम", subColor: "#16a34a", icon: "✅", iconBg: "#dcfce7" },
              ] : [
                { label: "Total Tractors", value: myListings.length || "3", sub: "Active", icon: "🚜", iconBg: "#dcfce7" },
                { label: "Bookings This Month", value: "12", sub: "+ 20%", subColor: "#16a34a", icon: "📅", iconBg: "#dbeafe" },
                { label: "Total Earnings", value: "₹48,750", sub: "+ 18%", subColor: "#16a34a", icon: "💰", iconBg: "#dcfce7" },
                { label: "Availability", value: "85%", sub: "Excellent", subColor: "#16a34a", icon: "✅", iconBg: "#dcfce7" },
              ].map((s, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "20px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{s.label}</div>
                      <div style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "8px 0 4px" }}>{s.value}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: s.subColor || "#6b7280" }}>{s.sub}</div>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
                  </div>
                ))}
              </div>

              {/* Chart + Upcoming Bookings */}
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
                {/* Line Chart */}
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{lang === "mr" ? "कमाईचा आढावा" : "Earnings Overview"}</div>
                    <select style={{ fontSize: 12, border: "1px solid #d1d5db", borderRadius: 8, padding: "5px 10px", background: "#fff", color: "#374151" }}>
                      <option>This Month ▾</option>
                    </select>
                  </div>
                  <LineChart data={earningsData} color="#16a34a" />
                </div>

                {/* Upcoming Bookings */}
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>Upcoming Bookings</div>
                    <button style={{ fontSize: 12, color: "#16a34a", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View All</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {upcomingBookings.map((b, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#f9fafb", borderRadius: 10, border: "1px solid #f3f4f6" }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#1a3a2a,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 14 }}>
                          {b.name.charAt(0)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{b.name}</div>
                          <div style={{ fontSize: 11, color: "#6b7280" }}>{b.date}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>{b.tractor}</div>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: b.bg, color: b.color }}>{b.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tractor Status + Recent Activity */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Tractor Status */}
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 14 }}>{lang === "mr" ? "ट्रॅक्टर माहिती" : "Tractor Status"}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {tractorStatuses.map((t, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: t.bg, borderRadius: 10, border: `1px solid ${t.statusColor}30` }}>
                        <span style={{ fontSize: 24 }}>🚜</span>
                        <div style={{ flex: 1, fontWeight: 600, fontSize: 13, color: "#111827" }}>{t.name}</div>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "#fff", color: t.statusColor, border: `1px solid ${t.statusColor}50` }}>{t.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>Recent Activity</div>
                    <button style={{ fontSize: 12, color: "#16a34a", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View All</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {recentActivity.map((a, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "#f9fafb", borderRadius: 10 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{a.msg}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{a.time}</div>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: a.badgeBg, color: a.badgeColor, whiteSpace: "nowrap" }}>{a.badge}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 16 }}>{lang === "mr" ? "जलद क्रिती" : "Quick Actions"}</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                  {(lang === "mr" ? [
                    { label: "ट्रॅक्टर जोडा", icon: "🚜", color: "#f0fdf4", border: "#bbf7d0", text: "#15803d", action: () => setActiveTab("tractors") },
                    { label: "उपलब्धता अपडेट", icon: "✅", color: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8", action: () => setActiveTab("availability") },
                    { label: "सेवा विनंती", icon: "🔧", color: "#fdf4ff", border: "#e9d5ff", text: "#7e22ce", action: () => setActiveTab("requests") },
                    { label: "बुकिंग पहा", icon: "📅", color: "#fef9c3", border: "#fde047", text: "#854d0e", action: () => setActiveTab("bookings") },
                  ] : [
                    { label: "Add Tractor", icon: "🚜", color: "#f0fdf4", border: "#bbf7d0", text: "#15803d", action: () => setActiveTab("tractors") },
                    { label: "Update Availability", icon: "✅", color: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8", action: () => setActiveTab("availability") },
                    { label: "Service Request", icon: "🔧", color: "#fdf4ff", border: "#e9d5ff", text: "#7e22ce", action: () => setActiveTab("requests") },
                    { label: "View Bookings", icon: "📅", color: "#fef9c3", border: "#fde047", text: "#854d0e", action: () => setActiveTab("bookings") },
                  ]).map((a, i) => (
                    <button key={i} onClick={a.action}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "18px 12px", borderRadius: 12, border: `1px solid ${a.border}`, background: a.color, color: a.text, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>
                      <span style={{ fontSize: 24 }}>{a.icon}</span>{a.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Earnings Summary + Notifications */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Earnings Summary */}
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 16 }}>Earnings Summary</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    {/* Donut */}
                    <div style={{ position: "relative", width: 110, height: 110, flexShrink: 0 }}>
                      <svg width="110" height="110" viewBox="0 0 110 110">
                        <circle cx="55" cy="55" r="42" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                        <circle cx="55" cy="55" r="42" fill="none" stroke="#16a34a" strokeWidth="12"
                          strokeDasharray={`${0.55 * 264} 264`} strokeLinecap="round" transform="rotate(-90 55 55)" />
                        <circle cx="55" cy="55" r="42" fill="none" stroke="#3b82f6" strokeWidth="12"
                          strokeDasharray={`${0.3 * 264} 264`} strokeLinecap="round"
                          strokeDashoffset={`${-(0.55 * 264)}`} transform="rotate(-90 55 55)" />
                      </svg>
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>₹48,750</div>
                        <div style={{ fontSize: 9, color: "#6b7280" }}>Total</div>
                      </div>
                    </div>
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                      {[
                        { label: "This Month", value: "₹48,750", color: "#16a34a" },
                        { label: "Last Month", value: "₹41,300", color: "#3b82f6" },
                        { label: "2 Months Ago", value: "₹35,600", color: "#9ca3af" },
                      ].map((e, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", background: e.color }} />
                          <div style={{ flex: 1, fontSize: 12, color: "#6b7280" }}>{e.label}</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{e.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>Notifications</div>
                    <button style={{ fontSize: 12, color: "#16a34a", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View All</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {myNotifs.length === 0 ? [
                      { msg: "New booking request received", time: "2 hours ago", icon: "📅", color: "#ef4444" },
                      { msg: "Payment of ₹6,500 received", time: "1 day ago", icon: "💰", color: "#16a34a" },
                      { msg: "Tractor service reminder", time: "2 days ago", icon: "🔧", color: "#f59e0b" },
                    ].map((n, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 12px", background: "#f9fafb", borderRadius: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${n.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{n.icon}</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{n.msg}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{n.time}</div>
                        </div>
                      </div>
                    )) : myNotifs.slice(0, 3).map((n, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 12px", background: n.read ? "#f9fafb" : "#f0fdf4", borderRadius: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🔔</div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{n.title}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{n.message?.slice(0, 50)}...</div>
                        </div>
                      </div>
                    ))}
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
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>🚜 My Tractors</h2>
                <button onClick={() => setShowAddForm(!showAddForm)} style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>+ Add Tractor</button>
              </div>
              {showAddForm && (
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", marginBottom: 20, border: "1px solid #bbf7d0" }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 16, color: "#111827" }}>Add New Tractor</h3>
                  <form onSubmit={handleAddListing} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[["Equipment name (e.g. Mahindra 575 DI)", "title"], ["Location (e.g. Akola)", "location"], ["Price (e.g. ₹800/day)", "price"], ["Contact phone", "phone"]].map(([ph, key]) => (
                      <input key={key} required placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                        style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 14px", fontSize: 14, boxSizing: "border-box" }} />
                    ))}
                    <div style={{ display: "flex", gap: 10 }}>
                      <button type="submit" style={{ flex: 1, background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "11px", fontWeight: 700, cursor: "pointer" }}>List Tractor</button>
                      <button type="button" onClick={() => setShowAddForm(false)} style={{ flex: 1, background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 10, padding: "11px", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                {myListings.map((l, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                    <div style={{ background: "linear-gradient(135deg,#1a3a2a,#16a34a)", height: 100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>🚜</div>
                    <div style={{ padding: 16 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{l.title}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>📍 {l.location}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>💰 {l.price}</div>
                      <span style={{ display: "inline-block", marginTop: 8, background: "#dcfce7", color: "#15803d", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20 }}>✓ Active</span>
                    </div>
                  </div>
                ))}
                {myListings.length === 0 && (
                  <div style={{ gridColumn: "span 3", textAlign: "center", padding: 48, color: "#9ca3af" }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🚜</div>
                    <p>No tractors listed yet. Add your first tractor!</p>
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