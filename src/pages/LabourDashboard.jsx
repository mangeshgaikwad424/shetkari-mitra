import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import { useNotifications } from "../context/NotificationContext";
import { LanguageContext } from "../context/LanguageContext";
import { useContext } from "react";

// Simple line chart component
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

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="labour_area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map(i => (
        <line key={i} x1={pad} x2={w - pad} y1={pad + i * (h - pad * 2) / 3} y2={pad + i * (h - pad * 2) / 3}
          stroke="#e5e7eb" strokeWidth="1" />
      ))}
      {["₹0", "₹5K", "₹10K", "₹15,750"].reverse().map((l, i) => (
        <text key={i} x={pad - 4} y={pad + i * (h - pad * 2) / 3 + 4} textAnchor="end" fontSize="7" fill="#9ca3af">{l}</text>
      ))}
      {labels.map((l, i) => (
        <text key={i} x={pad + (i / (labels.length - 1)) * (w - pad * 2)} y={h - 4} textAnchor="middle" fontSize="7" fill="#9ca3af">{l}</text>
      ))}
      <polygon points={area} fill="url(#labour_area)" />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill={color} />)}
      <circle cx={pts[3][0]} cy={pts[3][1]} r="5" fill={color} />
      <text x={pts[3][0]} y={pts[3][1] - 10} textAnchor="middle" fontSize="8" fill={color} fontWeight="700">₹15,750</text>
    </svg>
  );
}

const makeNAV = (mr) => [
  { id: "home", label: mr ? "डॅशबोर्ड" : "Dashboard", icon: "🏠" },
  { id: "work", label: mr ? "कामाच्या संधी" : "Work Opportunities", icon: "💼" },
  { id: "bookings", label: mr ? "माझे बुकिंग" : "My Bookings", icon: "📅" },
  { id: "earnings", label: mr ? "कमाई" : "Earnings", icon: "💰" },
  { id: "skills", label: mr ? "कौशल्ये व प्रोफाइल" : "Skills & Profile", icon: "🏅" },
  { id: "payments", label: mr ? "देयके" : "Payments", icon: "💳" },
  { id: "messages", label: mr ? "संदेश" : "Messages", icon: "💬" },
  { id: "notifications", label: mr ? "सूचना" : "Notifications", icon: "🔔" },
  { id: "settings", label: mr ? "सेटिंग्ज" : "Settings", icon: "⚙️" },
];

export default function LabourDashboard() {
  const { lang } = useContext(LanguageContext);
  const mr = lang === "mr";
  const NAV = makeNAV(mr);
  const { user, logout } = useAuth();
  const { getBookingsForUser, updateBookingStatus, addListing, getListingsByType } = useBooking();
  const { getForUser } = useNotifications();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ title: "", skill: "", location: "", price: "", phone: "" });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const myBookings = getBookingsForUser(user?.email).filter(b => b.ownerId === user?.email);
  const pendingBookings = myBookings.filter(b => b.status === "pending");
  const myListings = getListingsByType("labour").filter(l => l.ownerEmail === user?.email);
  const myNotifs = getForUser(user?.email || "");
  const unreadNotifs = myNotifs.filter(n => !n.read).length;

  const handleStatus = (bookingId, status) => {
    updateBookingStatus(bookingId, status, user);
  };

  const handleAddListing = (e) => {
    e.preventDefault();
    addListing(user, { type: "labour", ...form });
    setShowAddForm(false);
    setForm({ title: "", skill: "", location: "", price: "", phone: "" });
  };

  const earningsData = [4000, 8000, 6500, 11000, 9000, 15750];
  const upcomingJobs = [
    { title: "Wheat Harvesting", date: "25 May, 07:00 AM", location: "Pune", status: "Confirmed", color: "#16a34a", bg: "#dcfce7" },
    { title: "Sugarcane Cutting", date: "26 May, 08:00 AM", location: "Satara", status: "Confirmed", color: "#16a34a", bg: "#dcfce7" },
    { title: "Cotton Picking", date: "28 May, 07:30 AM", location: "Solapur", status: "Pending", color: "#d97706", bg: "#fef9c3" },
  ];
  const availableWork = [
    { title: "Soybean Harvesting", date: "27 May, 07:00 AM", location: "Pune", rate: "₹800 / Day", img: "🌱" },
    { title: "Vegetable Picking", date: "27 May, 09:00 AM", location: "Pune", rate: "₹600 / Day", img: "🥦" },
    { title: "Farm Cleaning", date: "28 May, 08:00 AM", location: "Pune", rate: "₹500 / Day", img: "🚜" },
  ];
  const recentActivity = [
    { msg: "Booking completed", earnings: "+₹800", date: "22 May", icon: "✅", color: "#16a34a" },
    { msg: "Payment received", earnings: "+₹600", date: "20 May", icon: "💰", color: "#16a34a" },
    { msg: "New job confirmed", earnings: "+₹700", date: "18 May", icon: "📅", color: "#16a34a" },
    { msg: "Profile updated", earnings: "", date: "15 May", icon: "📝", color: "#6b7280" },
  ];
  const skills = ["Harvesting", "Planting", "Weeding", "Irrigation", "Pesticide Spraying", "Tractor Helper"];
  const profileCompletion = [
    { label: "Profile Info", done: true },
    { label: "Skills Added", done: true },
    { label: "ID Verified", done: true },
    { label: "Bank Details", done: false },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif", background: "#f8fafc" }}>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 49 }} />
      )}

      {/* SIDEBAR */}
      <aside style={{ width: 220, background: "linear-gradient(180deg,#14532d 0%,#052e16 100%)", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50 }}
        className={`farmer-sidebar${sidebarOpen ? " sidebar-open" : ""}`}>
        {/* Logo */}
        <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>👷</span>
            <div>
              <div style={{ fontWeight: 800, color: "#fff", fontSize: 14, lineHeight: 1.2 }}>Shetkari Mitra</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Labour</div>
            </div>
          </div>
        </div>

        {/* Go to Main Site */}
        <div style={{ padding: "10px 10px 0" }}>
          <button onClick={() => navigate("/")} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.2s" }}>
            <span style={{ fontSize: 15 }}>🏡</span> {mr ? "मुख्य पानावर जा" : "Go to Home Page"}
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
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div style={{ marginLeft: 220, flex: 1 }} className="farmer-main">
        {/* Top Bar */}
        <header style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="sidebar-hamburger" style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#374151", display: "none" }}>☰</button>
            <div>
              <div style={{ fontSize: 13, color: "#9ca3af" }}>{mr ? "पुन्हा स्वागत आहे," : "Welcome back,"}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{user?.name || (mr ? "मजूर" : "Worker")} 👋</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>📍 Maharashtra, India</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
            <button style={{ position: "relative", background: "none", border: "none", fontSize: 20, cursor: "pointer", padding: 6 }}>
              🔔
              {unreadNotifs > 0 && <span style={{ position: "absolute", top: 0, right: 0, background: "#ef4444", color: "#fff", borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>{unreadNotifs}</span>}
            </button>
            <button onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#14532d,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15 }}>
                {user?.name?.charAt(0)?.toUpperCase() || "L"}
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

        <main style={{ padding: 28 }}>

          {/* DASHBOARD HOME */}
          {activeTab === "home" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
                {[
                  { label: "Jobs Completed", value: "28", sub: "+8 this month", icon: "👤", iconBg: "#ede9fe" },
                  { label: "Total Earnings", value: "₹15,750", sub: "+15%", subColor: "#16a34a", icon: "💰", iconBg: "#dcfce7" },
                  { label: "Upcoming Jobs", value: "3", sub: "Scheduled", subColor: "#16a34a", icon: "📅", iconBg: "#dcfce7" },
                  { label: "Rating", value: "4.8", sub: "Excellent", subColor: "#f59e0b", icon: "⭐", iconBg: "#fef9c3" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{s.label}</div>
                      <div style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "8px 0 4px" }}>{s.value}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: s.subColor || "#6b7280" }}>{s.sub}</div>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
                  </div>
                ))}
              </div>

              {/* Chart + Upcoming Jobs */}
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>Earnings Overview</div>
                    <select style={{ fontSize: 12, border: "1px solid #d1d5db", borderRadius: 8, padding: "5px 10px", background: "#fff" }}>
                      <option>This Month ▾</option>
                    </select>
                  </div>
                  <LineChart data={earningsData} color="#16a34a" />
                </div>

                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>Upcoming Jobs</div>
                    <button style={{ fontSize: 12, color: "#16a34a", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View All</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {upcomingJobs.map((j, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 12px", background: "#f9fafb", borderRadius: 10, border: "1px solid #f3f4f6" }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: j.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🌾</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{j.title}</div>
                          <div style={{ fontSize: 10, color: "#6b7280" }}>{j.date}</div>
                          <div style={{ fontSize: 10, color: "#9ca3af" }}>📍 {j.location}</div>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: j.bg, color: j.color, whiteSpace: "nowrap" }}>{j.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Available Work + Recent Activity */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>Available Work</div>
                    <button style={{ fontSize: 12, color: "#16a34a", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View All</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {availableWork.map((w, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px", background: "#f0fdf4", borderRadius: 10, border: "1px solid #bbf7d0" }}>
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{w.img}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{w.title}</div>
                          <div style={{ fontSize: 11, color: "#6b7280" }}>{w.date}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>📍 {w.location}</div>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", whiteSpace: "nowrap" }}>{w.rate}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>Recent Activity</div>
                    <button style={{ fontSize: 12, color: "#16a34a", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View All</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {recentActivity.map((a, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", background: "#f9fafb", borderRadius: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: a.color === "#16a34a" ? "#dcfce7" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{a.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{a.msg}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>{a.date}</div>
                        </div>
                        {a.earnings && <div style={{ fontSize: 12, fontWeight: 700, color: "#16a34a" }}>{a.earnings}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 16 }}>Quick Actions</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                  {[
                    { label: "Browse Jobs", icon: "🔍", color: "#f0fdf4", border: "#bbf7d0", text: "#15803d", action: () => setActiveTab("work") },
                    { label: "Update Skills", icon: "🏅", color: "#f0fdf4", border: "#bbf7d0", text: "#15803d", action: () => setActiveTab("skills") },
                    { label: "My Bookings", icon: "📅", color: "#dcfce7", border: "#86efac", text: "#15803d", action: () => setActiveTab("bookings") },
                    { label: "Payment History", icon: "💳", color: "#fef9c3", border: "#fde047", text: "#854d0e", action: () => setActiveTab("payments") },
                  ].map((a, i) => (
                    <button key={i} onClick={a.action}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "18px 12px", borderRadius: 12, border: `1px solid ${a.border}`, background: a.color, color: a.text, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>
                      <span style={{ fontSize: 24 }}>{a.icon}</span>{a.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills + Profile Completion */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 14 }}>Skills</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {skills.map((s, i) => (
                      <span key={i} style={{ padding: "6px 14px", borderRadius: 20, background: "#dcfce7", color: "#15803d", fontSize: 12, fontWeight: 600 }}>{s}</span>
                    ))}
                  </div>
                </div>

                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 16 }}>Profile Completion</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    {/* Circle */}
                    <div style={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>
                      <svg width="90" height="90" viewBox="0 0 90 90">
                        <circle cx="45" cy="45" r="36" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                        <circle cx="45" cy="45" r="36" fill="none" stroke="#16a34a" strokeWidth="8"
                          strokeDasharray={`${0.85 * 226} 226`} strokeLinecap="round" transform="rotate(-90 45 45)" />
                      </svg>
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#16a34a" }}>85%</div>
                        <div style={{ fontSize: 9, color: "#9ca3af" }}>Completed</div>
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      {profileCompletion.map((p, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <span style={{ fontSize: 14 }}>{p.done ? "✅" : "⭕"}</span>
                          <span style={{ fontSize: 12, color: p.done ? "#111827" : "#9ca3af", fontWeight: p.done ? 600 : 400 }}>{p.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BOOKING REQUESTS */}
          {activeTab === "bookings" && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 20 }}>📅 Job Requests</h2>
              {pendingBookings.length === 0 ? (
                <div style={{ background: "#fff", borderRadius: 14, padding: 48, textAlign: "center", border: "1px solid #f3f4f6" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                  <p style={{ color: "#9ca3af" }}>No pending requests right now.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
                  {pendingBookings.map((b, i) => (
                    <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #ede9fe" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 15 }}>{b.farmerName || b.farmerEmail}</div>
                          <div style={{ fontSize: 12, color: "#6b7280" }}>📅 {b.date}</div>
                          {b.message && <div style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic", marginTop: 4 }}>"{b.message}"</div>}
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
              {myBookings.length > 0 && (
                <>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#374151", margin: "24px 0 12px" }}>All Job History</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {myBookings.map((b, i) => (
                      <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", border: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>{b.farmerName}</div>
                          <div style={{ fontSize: 12, color: "#6b7280" }}>📅 {b.date}</div>
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

          {/* SKILLS TAB */}
          {activeTab === "skills" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>🏅 Skills & Profile</h2>
                <button onClick={() => setShowAddForm(!showAddForm)} style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, cursor: "pointer" }}>+ Add Profile</button>
              </div>
              {showAddForm && (
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px", marginBottom: 20, border: "1px solid #e9d5ff" }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Add Work Profile</h3>
                  <form onSubmit={handleAddListing} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[["Title (e.g. Experienced Harvester)", "title"], ["Skill (e.g. Harvesting)", "skill"], ["Location", "location"], ["Daily rate (e.g. ₹400/day)", "price"], ["Contact phone", "phone"]].map(([ph, key]) => (
                      <input key={key} required placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                        style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 14px", fontSize: 14 }} />
                    ))}
                    <div style={{ display: "flex", gap: 10 }}>
                      <button type="submit" style={{ flex: 1, background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "11px", fontWeight: 700, cursor: "pointer" }}>List Profile</button>
                      <button type="button" onClick={() => setShowAddForm(false)} style={{ flex: 1, background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 10, padding: "11px", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}
              <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", border: "1px solid #f3f4f6" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#14532d,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 32 }}>👷</div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>{user?.name}</div>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>Labour • {user?.village || "Maharashtra"}</div>
                    <div style={{ fontSize: 12, color: "#16a34a", fontWeight: 600, marginTop: 4 }}>⭐ 4.8 • 28 Jobs • ₹15,750 Earned</div>
                  </div>
                </div>
                <div style={{ fontWeight: 600, marginBottom: 10, color: "#111827" }}>Skills</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {skills.map((s, i) => (
                    <span key={i} style={{ padding: "6px 16px", borderRadius: 20, background: "#dcfce7", color: "#15803d", fontSize: 13, fontWeight: 600 }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* EARNINGS */}
          {activeTab === "earnings" && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 20 }}>💰 Earnings Report</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 20 }}>
                {[
                  { label: "This Month", value: "₹2,750", trend: "+12%" },
                  { label: "Last Month", value: "₹2,450", trend: "+8%" },
                  { label: "Total Earned", value: "₹15,750", trend: "YTD" },
                ].map((e, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", border: "1px solid #f3f4f6" }}>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{e.label}</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: "8px 0 4px" }}>{e.value}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#16a34a" }}>{e.trend}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", border: "1px solid #f3f4f6" }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 16 }}>Payment History</div>
                {[
                  { date: "25 May", job: "Harvesting - Ramesh Patil", amount: "₹800", status: "Completed" },
                  { date: "24 May", job: "Soil Prep - Vikas Shinde", amount: "₹600", status: "Completed" },
                  { date: "23 May", job: "Fencing - Suresh Kumar", amount: "₹500", status: "Pending" },
                ].map((p, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "#f0fdf4", borderRadius: 10, marginBottom: 8, border: "1px solid #bbf7d0" }}>
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

          {/* NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 20 }}>🔔 Notifications</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {myNotifs.length === 0 ? (
                  <div style={{ background: "#fff", borderRadius: 14, padding: 48, textAlign: "center", color: "#9ca3af" }}>No notifications yet.</div>
                ) : myNotifs.map((n, i) => (
                  <div key={i} style={{ background: n.read ? "#fff" : "#faf5ff", borderRadius: 12, padding: "16px 20px", border: n.read ? "1px solid #f3f4f6" : "1px solid #e9d5ff", display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#ede9fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🔔</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{n.title}</div>
                      <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{n.message}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>{new Date(n.time).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other tabs */}
          {!["home", "bookings", "skills", "earnings", "notifications"].includes(activeTab) && (
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