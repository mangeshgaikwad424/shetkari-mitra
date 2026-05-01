import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import { LanguageContext } from "../context/LanguageContext";
import { fetchAdminAnalytics } from "../services/analytics";

// Bar chart for applications overview
function BarChart({ data, colors }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 24, height: 160, padding: "0 8px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>{d.value}</div>
          <div style={{ width: "60%", background: colors[i] || "#3b82f6", borderRadius: "4px 4px 0 0", height: `${(d.value / max) * 120}px`, transition: "height 0.3s" }} />
          <div style={{ fontSize: 11, color: "#9ca3af" }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

// Donut chart for scheme benefits
function DonutChart({ segments }) {
  const total = segments.reduce((a, b) => a + b.value, 0);
  let offset = 0;
  const R = 60, C = 2 * Math.PI * R;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{ position: "relative", width: 140, height: 140, flexShrink: 0 }}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          {segments.map((s, i) => {
            const pct = s.value / total;
            const dash = pct * C;
            const el = (
              <circle key={i} cx="70" cy="70" r={R} fill="none" stroke={s.color} strokeWidth="18"
                strokeDasharray={`${dash} ${C}`} strokeDashoffset={-offset} transform="rotate(-90 70 70)" />
            );
            offset += dash;
            return el;
          })}
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>₹18.75</div>
          <div style={{ fontSize: 10, color: "#6b7280" }}>Crore</div>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: 12, color: "#6b7280" }}>{s.label}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{s.display}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GovDashboard() {
  const { user, logout } = useAuth();
  const { bookings } = useBooking();
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState("home");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // ── Live analytics from MongoDB ──────────────────────────────────────────────
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState("");

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setAnalyticsLoading(true);
    setAnalyticsError("");
    try {
      const data = await fetchAdminAnalytics();
      setAnalytics(data);
    } catch {
      setAnalyticsError("Could not load live analytics. Make sure backend is running.");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const liveStats = analytics?.stats || {};
  const allBookings = [...(bookings || []), ...(analytics?.recentBookings || [])];
  const uniqueBookings = Array.from(new Map(allBookings.map(b => [b._id, b])).values());
  const pendingCount = liveStats.pendingBookings ?? uniqueBookings.filter(b => b.status === "pending").length;
  const approvedCount = liveStats.acceptedBookings ?? uniqueBookings.filter(b => b.status === "accepted").length;

  const NAV = lang === "mr" ? [

    { id: "home", label: "डॅशबोर्ड", icon: "🏠" },
    { id: "schemes", label: "योजना", icon: "📋" },
    { id: "applications", label: "अर्ज", icon: "📝" },
    { id: "beneficiaries", label: "लाभार्थी", icon: "👥" },
    { id: "payments", label: "देयके", icon: "💰" },
    { id: "reports", label: "अहवाल व विश्लेषण", icon: "📊" },
    { id: "announcements", label: "घोषणा", icon: "📢" },
    { id: "alerts", label: "सतर्कता", icon: "⚠️" },
    { id: "users", label: "वापरकर्ते", icon: "👤" },
    { id: "settings", label: "सेटिंग्ज", icon: "⚙️" },
  ] : [
    { id: "home", label: "Dashboard", icon: "🏠" },
    { id: "schemes", label: "Schemes", icon: "📋" },
    { id: "applications", label: "Applications", icon: "📝" },
    { id: "beneficiaries", label: "Beneficiaries", icon: "👥" },
    { id: "payments", label: "Payments", icon: "💰" },
    { id: "reports", label: "Reports & Analytics", icon: "📊" },
    { id: "announcements", label: "Announcements", icon: "📢" },
    { id: "alerts", label: "Alerts", icon: "⚠️" },
    { id: "users", label: "Users", icon: "👤" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];


  const schemes = [
    { name: "PM-KISAN", applications: 2450, color: "#16a34a", icon: "🌾" },
    { name: "PMFBY", applications: 1820, color: "#f59e0b", icon: "🏦" },
    { name: "Soil Health Card", applications: 1250, color: "#3b82f6", icon: "🌱" },
    { name: "Kisan Credit Card", applications: 680, color: "#8b5cf6", icon: "💳" },
  ];

  const recentApplications = [
    { name: "Ramesh Patil", scheme: "PM-KISAN", date: "25 May 2024", status: "Pending", color: "#d97706", bg: "#fef9c3" },
    { name: "Suresh Jadhav", scheme: "PMFBY", date: "24 May 2024", status: "Approved", color: "#16a34a", bg: "#dcfce7" },
    { name: "Vikas Shinde", scheme: "Soil Health Card", date: "24 May 2024", status: "Pending", color: "#d97706", bg: "#fef9c3" },
    { name: "Ganesh More", scheme: "KCC Scheme", date: "23 May 2024", status: "Approved", color: "#16a34a", bg: "#dcfce7" },
  ];

  const barData = lang === "mr" ? [
    { label: "एकूण", value: 8000 },
    { label: "प्रलंबित", value: 2330 },
    { label: "मंजूर", value: 4512 },
    { label: "नाकारलेले", value: 180 },
  ] : [
    { label: "Total", value: 8000 },
    { label: "Pending", value: 2330 },
    { label: "Approved", value: 4512 },
    { label: "Rejected", value: 180 },
  ];

  const donutSegments = [
    { label: "PM-KISAN", display: "₹9.25 Cr", value: 9.25, color: "#16a34a" },
    { label: "PMFBY", display: "₹5.10 Cr", value: 5.10, color: "#f59e0b" },
    { label: "Others", display: "₹4.40 Cr", value: 4.40, color: "#e5e7eb" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif", background: "#f8fafc" }}>

      {/* SIDEBAR */}
      <aside style={{ width: 220, background: "linear-gradient(180deg,#14532d 0%,#052e16 100%)", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>🏛️</span>
            <div>
              <div style={{ fontWeight: 800, color: "#fff", fontSize: 14, lineHeight: 1.2 }}>{lang === "mr" ? "शेतकरी मित्र" : "Shetkari Mitra"}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{lang === "mr" ? "शासकीय विभाग" : "Government Panel"}</div>
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
                color: activeTab === n.id ? "#4ade80" : "rgba(255,255,255,0.6)",
                border: activeTab === n.id ? "1px solid rgba(74,222,128,0.2)" : "1px solid transparent",
                cursor: "pointer", fontSize: 13, fontWeight: 600, textAlign: "left", transition: "all 0.2s",
              }}>
              <span style={{ fontSize: 17 }}>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={() => { logout(); navigate("/login"); }}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, background: "transparent", color: "rgba(255,255,255,0.5)", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            🚪 {lang === "mr" ? "लॉगआउट" : "Logout"}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ marginLeft: 220, flex: 1 }}>
        {/* Top Bar */}
        <header style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 40 }}>
          <div>
            <div style={{ fontSize: 13, color: "#9ca3af" }}>{lang === "mr" ? "स्वागत आहे," : "Welcome,"}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{lang === "mr" ? "शासकीय अधिकारी" : "Government Officer"} 👋</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>📍 {lang === "mr" ? "महाराष्ट्र, भारत" : "Maharashtra, India"}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>
            <button style={{ position: "relative", background: "none", border: "none", fontSize: 20, cursor: "pointer", padding: 6 }}>
              🔔
              <span style={{ position: "absolute", top: 0, right: 0, background: "#ef4444", color: "#fff", borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800 }}>6</span>
            </button>
            <button onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#14532d,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15 }}>
                {user?.name?.charAt(0)?.toUpperCase() || "G"}
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

              {/* Stats — live from MongoDB */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
                {[
                  { label: "Registered Users", value: liveStats.totalUsers ?? "—", sub: `🌾${liveStats.farmerCount ?? 0} farmers`, icon: "👥", iconBg: "#dbeafe" },
                  { label: "Total Bookings", value: liveStats.totalBookings ?? "—", sub: `✅ ${approvedCount} accepted`, subColor: "#16a34a", icon: "📅", iconBg: "#dcfce7" },
                  { label: "Pending Bookings", value: pendingCount || "—", sub: "Awaiting response", icon: "⏳", iconBg: "#fef9c3" },
                  { label: "Listings on Platform", value: liveStats.totalListings ?? "—", sub: `🚜${liveStats.tractorListings ?? 0} tractors · 👷${liveStats.labourListings ?? 0} labour`, icon: "📋", iconBg: "#f0fdf4" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{s.label}</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: "8px 0 4px" }}>{analyticsLoading ? "…" : s.value}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: s.subColor || "#6b7280" }}>{s.sub}</div>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
                  </div>
                ))}
              </div>

              {/* Bar Chart + Top Schemes */}
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{lang === "mr" ? "अर्जांचा आढावा" : "Applications Overview"}</div>
                    <select style={{ fontSize: 12, border: "1px solid #d1d5db", borderRadius: 8, padding: "5px 10px", background: "#fff" }}>
                      <option>This Month ▾</option>
                    </select>
                  </div>
                  <BarChart data={barData} colors={["#3b82f6", "#f59e0b", "#16a34a", "#ef4444"]} />
                </div>

                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>Top Schemes</div>
                    <button style={{ fontSize: 12, color: "#16a34a", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View All</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {schemes.map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#f8fafc", borderRadius: 10, border: "1px solid #f3f4f6" }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: `${s.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{s.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{s.name}</div>
                          <div style={{ fontSize: 11, color: "#9ca3af" }}>{s.applications.toLocaleString()} Applications</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Applications + Scheme Benefits */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>Recent Applications</div>
                    <button style={{ fontSize: 12, color: "#16a34a", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View All</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {recentApplications.map((a, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#f9fafb", borderRadius: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "#1d4ed8" }}>
                          {a.name.charAt(0)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{a.name}</div>
                          <div style={{ fontSize: 11, color: "#6b7280" }}>{a.scheme}</div>
                          <div style={{ fontSize: 10, color: "#9ca3af" }}>{a.date}</div>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: a.bg, color: a.color, whiteSpace: "nowrap" }}>{a.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 16 }}>{lang === "mr" ? "योजना लाभाचा सारांश" : "Scheme Benefits Summary"}</div>
                  <DonutChart segments={donutSegments} />
                </div>
              </div>

              {/* Summary Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
                {(lang === "mr" ? [
                  { label: "प्रलंबित अर्ज", value: pendingCount || "2,330", link: "तपशील पहा" },
                  { label: "मंजूर अर्ज", value: approvedCount || "4,512", link: "तपशील पहा" },
                  { label: "नाकारलेले अर्ज", value: "180", link: "तपशील पहा" },
                  { label: "आजचे वाटप", value: "₹25.40 लाख", link: "तपशील पहा" },
                ] : [
                  { label: "Pending Applications", value: pendingCount || "2,330", link: "View Details" },
                  { label: "Approved Applications", value: approvedCount || "4,512", link: "View Details" },
                  { label: "Rejected Applications", value: "180", link: "View Details" },
                  { label: "Today's Disbursal", value: "₹25.40 L", link: "View Details" },
                ]).map((s, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "20px", border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                    <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 500, marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 8 }}>{s.value}</div>
                    <button style={{ fontSize: 12, color: "#16a34a", background: "none", border: "none", cursor: "pointer", fontWeight: 600, padding: 0 }}>{s.link} →</button>
                  </div>
                ))}
              </div>


              {/* Announcements + Alerts */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>Announcements</div>
                    <button style={{ fontSize: 12, color: "#16a34a", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>View All</button>
                  </div>
                  {(lang === "mr" ? [
                    { msg: "PM-किसान 16 वा हप्ता लवकरच जारी होईल", time: "२ तासांपूर्वी", icon: "📢" },
                    { msg: "PMFBY अर्जाची अंतिम तारीख वाढवली", time: "१ दिवसापूर्वी", icon: "📋" },
                    { msg: "सेंद्रिय शेतीसाठी नवीन योजना सुरू केली", time: "२ दिवसांपूर्वी", icon: "🌱" },
                  ] : [
                    { msg: "PM-KISAN 16th installment will be released soon", time: "2 hours ago", icon: "📢" },
                    { msg: "Last date for PMFBY application extended", time: "1 day ago", icon: "📋" },
                    { msg: "New scheme launched for organic farming", time: "2 days ago", icon: "🌱" },
                  ]).map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, padding: "10px 12px", background: "#eff6ff", borderRadius: 10, marginBottom: 8, border: "1px solid #bfdbfe" }}>
                      <span style={{ fontSize: 18 }}>{a.icon}</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{a.msg}</div>
                        <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>{a.time}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 14 }}>{lang === "mr" ? "सतर्कता" : "Alerts"}</div>
                  {(lang === "mr" ? [
                    { msg: "पुणे जिल्ह्यात बरीच अर्ज प्रलंबित आहेत", icon: "⚠️" },
                    { msg: "35 लाभार्थ्यांचे पेमेंट अयशस्वी", icon: "❌" },
                    { msg: "कागदपत्र पडताळणी प्रलंबित", icon: "📄" },
                  ] : [
                    { msg: "High pending applications in Pune district", icon: "⚠️" },
                    { msg: "Payment failed for 35 beneficiaries", icon: "❌" },
                    { msg: "Document verification pending", icon: "📄" },
                  ]).map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, padding: "10px 12px", background: "#fef2f2", borderRadius: 10, marginBottom: 8, border: "1px solid #fecaca" }}>
                      <span style={{ fontSize: 18 }}>{a.icon}</span>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#991b1b" }}>{a.msg}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Platform Bookings */}
              {allBookings.length > 0 && (
                <div style={{ background: "#fff", borderRadius: 14, padding: "22px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 14 }}>Live Platform Bookings</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {allBookings.slice(0, 8).map((b, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f8fafc", borderRadius: 10 }}>
                        <div>
                          <span style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{b.farmerName}</span>
                          <span style={{ fontSize: 12, color: "#9ca3af" }}> → {b.ownerName} · {b.listingTitle} · {b.date}</span>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                          background: b.status === "pending" ? "#fef9c3" : b.status === "accepted" ? "#dcfce7" : "#fee2e2",
                          color: b.status === "pending" ? "#92400e" : b.status === "accepted" ? "#15803d" : "#b91c1c"
                        }}>{b.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SCHEMES TAB */}
          {activeTab === "schemes" && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 20 }}>📋 Government Schemes</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
                {[
                  { name: "PM-KISAN", applications: 2450, approved: 2200, disbursed: "₹9.25 Cr", status: "Active", color: "#16a34a" },
                  { name: "PMFBY", applications: 1820, approved: 1600, disbursed: "₹5.10 Cr", status: "Active", color: "#f59e0b" },
                  { name: "Soil Health Card", applications: 1250, approved: 1100, disbursed: "₹2.80 Cr", status: "Active", color: "#16a34a" },
                  { name: "Kisan Credit Card", applications: 680, approved: 580, disbursed: "₹1.60 Cr", status: "Active", color: "#8b5cf6" },
                  { name: "Crop Insurance", applications: 256, approved: 201, disbursed: "₹0.80 Cr", status: "Pending", color: "#f59e0b" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "20px 22px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f3f4f6" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>{s.name}</div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                        background: s.status === "Active" ? "#dcfce7" : "#fef9c3",
                        color: s.status === "Active" ? "#15803d" : "#92400e"
                      }}>{s.status}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                      <div>
                        <div style={{ fontSize: 11, color: "#6b7280" }}>Applications</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{s.applications.toLocaleString()}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "#6b7280" }}>Approved</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: "#16a34a" }}>{s.approved.toLocaleString()}</div>
                      </div>
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, color: "#6b7280" }}>Disbursed Amount</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#3b82f6" }}>{s.disbursed}</div>
                    </div>
                    <button style={{ width: "100%", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 10, padding: "10px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>View Details</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* APPLICATIONS TAB */}
          {activeTab === "applications" && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 20 }}>📝 All Applications</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {recentApplications.concat(recentApplications).map((a, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", border: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: "#1d4ed8" }}>{a.name.charAt(0)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{a.name}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>{a.scheme} · {a.date}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: a.bg, color: a.color }}>{a.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── REPORTS & ANALYTICS ── */}
          {activeTab === "reports" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>📊 Reports & Analytics</h2>
                <button onClick={loadAnalytics} disabled={analyticsLoading}
                  style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "9px 18px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                  {analyticsLoading ? "⏳ Loading…" : "🔄 Refresh"}
                </button>
              </div>
              {analyticsError && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: 16, color: "#b91c1c", fontSize: 13 }}>⚠️ {analyticsError}</div>
              )}
              {/* User breakdown */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
                {[
                  { label: "Total Users", value: liveStats.totalUsers, color: "#3b82f6" },
                  { label: "Farmers", value: liveStats.farmerCount, color: "#16a34a" },
                  { label: "Tractor Owners", value: liveStats.tractorCount, color: "#f59e0b" },
                  { label: "Labour", value: liveStats.labourCount, color: "#ea580c" },
                  { label: "Govt Officials", value: liveStats.govCount, color: "#8b5cf6" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #f3f4f6", textAlign: "center" }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{analyticsLoading ? "…" : (s.value ?? "—")}</div>
                    <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              {/* Booking breakdown */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                {[
                  { label: "Total Bookings", value: liveStats.totalBookings, color: "#111827" },
                  { label: "Pending", value: liveStats.pendingBookings, color: "#d97706" },
                  { label: "Accepted", value: liveStats.acceptedBookings, color: "#16a34a" },
                  { label: "Rejected", value: liveStats.rejectedBookings, color: "#ef4444" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #f3f4f6", textAlign: "center" }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{analyticsLoading ? "…" : (s.value ?? "—")}</div>
                    <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              {/* Top farmers / tractor owners / labour */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {[
                  { title: "🌾 Top Farmers (by Bookings)", data: analytics?.topFarmers || [], key: "farmerName", valueKey: "bookings", color: "#16a34a" },
                  { title: "🚜 Top Tractor Owners", data: analytics?.topTractorOwners || [], key: "ownerName", valueKey: "bookings", color: "#f59e0b" },
                  { title: "👷 Top Labour (Most Booked)", data: analytics?.topLabour || [], key: "ownerName", valueKey: "bookings", color: "#ea580c" },
                ].map((section, si) => (
                  <div key={si} style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid #f3f4f6" }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#111827", marginBottom: 10 }}>{section.title}</div>
                    {section.data.length === 0 ? <p style={{ color: "#9ca3af", fontSize: 12 }}>No data yet.</p>
                      : section.data.map((item, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f3f4f6" }}>
                          <span style={{ fontSize: 12, color: "#374151" }}>{i + 1}. {item[section.key] || "Unknown"}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: section.color }}>{item[section.valueKey]}</span>
                        </div>
                      ))
                    }
                  </div>
                ))}
              </div>
              {/* Recent Users + Activity Log */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid #f3f4f6" }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#111827", marginBottom: 10 }}>🆕 Recent Registrations</div>
                  {(analytics?.recentUsers || []).slice(0, 8).map((u, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", padding: "7px 0", borderBottom: "1px solid #f9fafb" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: "#16a34a", flexShrink: 0 }}>{u.name?.charAt(0) || "?"}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{u.name} <span style={{ color: "#9ca3af", fontWeight: 400 }}>({u.role})</span></div>
                        <div style={{ fontSize: 11, color: "#6b7280" }}>{u.email}</div>
                      </div>
                      <div style={{ fontSize: 10, color: "#9ca3af" }}>{new Date(u.createdAt).toLocaleDateString("en-IN")}</div>
                    </div>
                  ))}
                  {(analytics?.recentUsers || []).length === 0 && <p style={{ color: "#9ca3af", fontSize: 12 }}>No users yet.</p>}
                </div>
                <div style={{ background: "#fff", borderRadius: 14, padding: "18px 20px", border: "1px solid #f3f4f6" }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#111827", marginBottom: 10 }}>📋 Recent Activity Log</div>
                  <div style={{ maxHeight: 300, overflowY: "auto" }}>
                    {(analytics?.recentActivity || []).slice(0, 20).map((log, i) => (
                      <div key={i} style={{ padding: "7px 0", borderBottom: "1px solid #f9fafb" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#111827" }}>{log.description || log.action}</span>
                          <span style={{ fontSize: 10, color: "#9ca3af", whiteSpace: "nowrap", marginLeft: 8 }}>{new Date(log.createdAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</span>
                        </div>
                        <div style={{ fontSize: 11, color: "#6b7280" }}>{log.userName} · {log.userRole}</div>
                      </div>
                    ))}
                    {(analytics?.recentActivity || []).length === 0 && <p style={{ color: "#9ca3af", fontSize: 12 }}>No activity logged yet.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── USERS TAB ── */}
          {activeTab === "users" && (
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 20 }}>👤 All Registered Users</h2>
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f3f4f6", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead style={{ background: "#f0fdf4" }}>
                    <tr>{["Name","Email","Role","Phone","Village","Joined"].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#15803d", fontWeight: 700 }}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {(analytics?.recentUsers || []).map((u, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f9fafb" }}>
                        <td style={{ padding: "11px 16px", fontWeight: 600 }}>{u.name}</td>
                        <td style={{ padding: "11px 16px", color: "#6b7280" }}>{u.email}</td>
                        <td style={{ padding: "11px 16px" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20,
                            background: u.role === "farmer" ? "#dcfce7" : u.role === "tractor" ? "#fef9c3" : u.role === "labour" ? "#ffedd5" : "#dbeafe",
                            color: u.role === "farmer" ? "#15803d" : u.role === "tractor" ? "#92400e" : u.role === "labour" ? "#9a3412" : "#1d4ed8",
                          }}>{u.role}</span>
                        </td>
                        <td style={{ padding: "11px 16px", color: "#6b7280" }}>{u.phone || "—"}</td>
                        <td style={{ padding: "11px 16px", color: "#6b7280" }}>{u.village || "—"}</td>
                        <td style={{ padding: "11px 16px", color: "#9ca3af", fontSize: 11 }}>{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(analytics?.recentUsers || []).length === 0 && <div style={{ padding: 32, textAlign: "center", color: "#9ca3af" }}>No users registered yet.</div>}
              </div>
            </div>
          )}

          {/* Other tabs fallback */}
          {!["home","schemes","applications","reports","users"].includes(activeTab) && (
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