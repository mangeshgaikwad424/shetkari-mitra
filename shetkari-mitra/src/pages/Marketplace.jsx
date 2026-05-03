import Navbar from "../components/Navbar";
import { useState, useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";

// ── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "all",       labelEn: "All",        labelMr: "सर्व",        icon: "⊞" },
  { id: "grain",     labelEn: "Grains",     labelMr: "धान्य",       icon: "🌾" },
  { id: "pulse",     labelEn: "Pulses",     labelMr: "डाळी",        icon: "🫘" },
  { id: "oilseed",   labelEn: "Oilseeds",   labelMr: "तेलबिया",     icon: "🌻" },
  { id: "vegetable", labelEn: "Vegetables", labelMr: "भाजीपाला",    icon: "🥦" },
  { id: "fruit",     labelEn: "Fruits",     labelMr: "फळे",         icon: "🍎" },
  { id: "spice",     labelEn: "Spices",     labelMr: "मसाले",       icon: "🌶️" },
  { id: "organic",   labelEn: "Organic",    labelMr: "सेंद्रिय",    icon: "🌿" },
  { id: "dairy",     labelEn: "Dairy",      labelMr: "दुग्धजन्य",   icon: "🥛" },
  { id: "other",     labelEn: "Others",     labelMr: "इतर",         icon: "•••" },
];

const PRODUCTS = [
  {
    id: 1, nameEn: "Wheat",      nameMr: "गहू",
    qualityEn: "Premium Quality", qualityMr: "उत्कृष्ट दर्जा",
    price: 2150, unit: "quintal", category: "grain", badge: "verified",
    farmerEn: "Suresh Patil",  farmerMr: "सुरेश पाटील",
    locationEn: "Ahmednagar, MH", locationMr: "अहमदनगर, MH",
    rating: 4.8, trending: "+2.5%",
    img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80",
  },
  {
    id: 2, nameEn: "Tur Dal",   nameMr: "तूर डाळ",
    qualityEn: "Best Quality",  qualityMr: "सर्वोत्तम दर्जा",
    price: 6200, unit: "quintal", category: "pulse", badge: "verified",
    farmerEn: "Ramesh Jadhav", farmerMr: "रमेश जाधव",
    locationEn: "Latur, MH",  locationMr: "लातूर, MH",
    rating: 4.7, trending: "+3.2%",
    img: "https://images.unsplash.com/photo-1585996926049-c706b0b8f5ee?w=400&q=80",
  },
  {
    id: 3, nameEn: "Soybean",   nameMr: "सोयाबीन",
    qualityEn: "High Protein",  qualityMr: "उच्च प्रथिने",
    price: 4350, unit: "quintal", category: "oilseed", badge: "verified",
    farmerEn: "Mahesh Kale",   farmerMr: "महेश काळे",
    locationEn: "Akola, MH",  locationMr: "अकोला, MH",
    rating: 4.6, trending: "+2.1%",
    img: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&q=80",
  },
  {
    id: 4, nameEn: "Onion",     nameMr: "कांदा",
    qualityEn: "Fresh & Clean",  qualityMr: "ताजा व स्वच्छ",
    price: 1350, unit: "quintal", category: "vegetable", badge: "verified",
    farmerEn: "Vikas Pawar",   farmerMr: "विकास पवार",
    locationEn: "Nashik, MH", locationMr: "नाशिक, MH",
    rating: 4.5, trending: "-1.2%",
    img: "https://images.unsplash.com/photo-1508747703725-719777637510?w=400&q=80",
  },
  {
    id: 5, nameEn: "Besan",     nameMr: "बेसन",
    qualityEn: "Grade A",       qualityMr: "ग्रेड A",
    price: 3800, unit: "quintal", category: "pulse", badge: "organic",
    farmerEn: "Priya More",    farmerMr: "प्रिया मोरे",
    locationEn: "Pune, MH",   locationMr: "पुणे, MH",
    rating: 4.4, trending: "+1.5%",
    img: "https://images.unsplash.com/photo-1559181567-c3190ca9d738?w=400&q=80",
  },
  {
    id: 6, nameEn: "Groundnut", nameMr: "शेंगदाणे",
    qualityEn: "Bold Seeds",    qualityMr: "मोठे दाणे",
    price: 5200, unit: "quintal", category: "oilseed", badge: "verified",
    farmerEn: "Ganesh Shinde", farmerMr: "गणेश शिंदे",
    locationEn: "Solapur, MH", locationMr: "सोलापूर, MH",
    rating: 4.3, trending: "+0.8%",
    img: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&q=80",
  },
  {
    id: 7, nameEn: "Tomato",    nameMr: "टोमॅटो",
    qualityEn: "Farm Fresh",    qualityMr: "शेतातून ताजे",
    price: 800, unit: "quintal", category: "vegetable", badge: "fresh",
    farmerEn: "Lata Deshmukh", farmerMr: "लता देशमुख",
    locationEn: "Kolhapur, MH", locationMr: "कोल्हापूर, MH",
    rating: 4.2, trending: "+4.1%",
    img: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80",
  },
  {
    id: 8, nameEn: "Green Chilli", nameMr: "हिरवी मिरची",
    qualityEn: "Spicy & Fresh",  qualityMr: "तिखट व ताजी",
    price: 1600, unit: "quintal", category: "spice", badge: "fresh",
    farmerEn: "Arun Bhatt",    farmerMr: "अरुण भट",
    locationEn: "Nagpur, MH",  locationMr: "नागपूर, MH",
    rating: 4.1, trending: "+2.8%",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  },
];

const MARKET_OVERVIEW = [
  { nameEn: "Wheat",     nameMr: "गहू",       price: "₹ 2,150", change: "+2.5%", up: true  },
  { nameEn: "Rice (Raw)",nameMr: "तांदूळ",    price: "₹ 2,980", change: "+1.8%", up: true  },
  { nameEn: "Tur Dal",   nameMr: "तूर डाळ",  price: "₹ 6,200", change: "+3.2%", up: true  },
  { nameEn: "Soyabean",  nameMr: "सोयाबीन",   price: "₹ 4,350", change: "+2.1%", up: true  },
  { nameEn: "Onion",     nameMr: "कांदा",     price: "₹ 1,350", change: "-1.2%", up: false },
];

const WHY_FEATURES = [
  { icon: "💰", titleEn: "Best Price",        titleMr: "सर्वोत्तम भाव",        descEn: "Get the best prices in the market",       descMr: "बाजारातील सर्वोत्तम भाव मिळवा" },
  { icon: "👨‍🌾", titleEn: "Direct from Farmers", titleMr: "थेट शेतकऱ्यांकडून",  descEn: "Connect directly with farmers",           descMr: "थेट शेतकऱ्यांशी संपर्क करा" },
  { icon: "🔒", titleEn: "Secure Payment",    titleMr: "सुरक्षित पेमेंट",     descEn: "100% secure transactions",               descMr: "100% सुरक्षित व्यवहार" },
  { icon: "✅", titleEn: "Quality Assured",   titleMr: "गुणवत्ता हमी",         descEn: "Verified and quality checked",            descMr: "तपासलेले व दर्जेदार उत्पादन" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const BADGE_STYLE = {
  verified: { bg: "#16a34a", label: "Verified",  labelMr: "सत्यापित" },
  organic:  { bg: "#7c3aed", label: "Organic",   labelMr: "सेंद्रिय" },
  fresh:    { bg: "#0891b2", label: "Fresh",     labelMr: "ताजे"     },
};

// ── Component ────────────────────────────────────────────────────────────────

export default function Marketplace() {
  const { lang } = useContext(LanguageContext);
  const { user } = useAuth();
  const [filter, setFilter]   = useState("all");
  const [search, setSearch]   = useState("");
  const [cart, setCart]       = useState(0);

  const t = (en, mr) => lang === "mr" ? mr : en;

  const filtered = PRODUCTS.filter(p =>
    (filter === "all" || p.category === filter) &&
    (p.nameEn.toLowerCase().includes(search.toLowerCase()) ||
     p.nameMr.includes(search) ||
     p.locationEn.toLowerCase().includes(search.toLowerCase()))
  );

  const today = new Date();
  const todayStr = today.toLocaleDateString(lang === "mr" ? "mr-IN" : "en-IN", {
    day: "numeric", month: "long", year: "numeric"
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* ── Main layout ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 20px", display: "grid", gridTemplateColumns: "1fr 280px", gap: 24 }}>

        {/* ══════════════ LEFT / MAIN ══════════════ */}
        <div>

          {/* ── Hero Banner ── */}
          <div style={{
            borderRadius: 18, overflow: "hidden", marginBottom: 24,
            background: "linear-gradient(120deg,#e8f5e9 0%,#f0fdf4 60%)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "28px 36px", position: "relative", minHeight: 130,
            boxShadow: "0 2px 12px rgba(22,163,74,0.08)",
          }}>
            <div style={{ position: "relative", zIndex: 2 }}>
              <h1 style={{ fontSize: 30, fontWeight: 900, color: "#14532d", margin: 0, letterSpacing: -0.5 }}>
                {t("Marketplace", "मार्केटप्लेस")}
              </h1>
              <p style={{ color: "#4b7a4b", fontSize: 14, marginTop: 6, margin: "6px 0 0" }}>
                {t("Buy and sell agricultural products directly with farmers", "थेट शेतकऱ्यांसोबत कृषी उत्पादने खरेदी व विक्री करा")}
              </p>
            </div>
            {/* Farm illustration */}
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=520&q=72"
              alt="farm"
              style={{ width: 200, height: 110, objectFit: "cover", borderRadius: 12, opacity: 0.85, flexShrink: 0 }}
            />
          </div>

          {/* ── Search + Category Row ── */}
          <div style={{
            background: "#fff", borderRadius: 16, padding: "18px 22px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.06)", marginBottom: 24,
          }}>
            {/* Search bar */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <div style={{ flex: 1, position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#9ca3af" }}>🔍</span>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t("Search crops, products, categories...", "पिके, उत्पादने, श्रेणी शोधा...")}
                  style={{
                    width: "100%", padding: "10px 14px 10px 40px", border: "1.5px solid #e5e7eb",
                    borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box",
                    background: "#f9fafb",
                  }}
                />
              </div>
              <button style={{
                background: "#16a34a", color: "#fff", border: "none", borderRadius: 10,
                padding: "10px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer",
                boxShadow: "0 2px 8px rgba(22,163,74,0.25)",
              }}>
                {t("Search", "शोधा")}
              </button>
            </div>

            {/* Category chips */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {CATEGORIES.map(cat => {
                const active = filter === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setFilter(cat.id)}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                      padding: "10px 14px", borderRadius: 12, cursor: "pointer", minWidth: 64,
                      background: active ? "#f0fdf4" : "#f9fafb",
                      border: active ? "2px solid #16a34a" : "2px solid transparent",
                      color: active ? "#15803d" : "#6b7280",
                      fontWeight: active ? 700 : 500, fontSize: 11, transition: "all 0.15s",
                    }}
                  >
                    <span style={{ fontSize: cat.icon === "⊞" || cat.icon === "•••" ? 16 : 22 }}>{cat.icon}</span>
                    <span>{lang === "mr" ? cat.labelMr : cat.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Top Products Heading ── */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontWeight: 800, fontSize: 17, color: "#111827", display: "flex", alignItems: "center", gap: 8 }}>
              🌱 {t("Top Products", "शीर्ष उत्पादने")}
            </div>
            <button style={{ background: "none", border: "none", color: "#16a34a", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              {t("View All Products →", "सर्व उत्पादने पहा →")}
            </button>
          </div>

          {/* ── Product Grid ── */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 20px", color: "#9ca3af" }}>
              <div style={{ fontSize: 56, marginBottom: 12 }}>🔍</div>
              <p style={{ fontSize: 16 }}>{t("No products found. Try a different search.", "कोणतेही उत्पादन आढळले नाही.")}</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {filtered.map(p => {
                const badge = BADGE_STYLE[p.badge];
                const isPositive = p.trending.startsWith("+");
                return (
                  <div
                    key={p.id}
                    style={{
                      background: "#fff", borderRadius: 14, overflow: "hidden",
                      boxShadow: "0 1px 6px rgba(0,0,0,0.07)", border: "1px solid #f3f4f6",
                      transition: "box-shadow 0.2s, transform 0.2s", cursor: "pointer",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(22,163,74,0.15)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    {/* Image */}
                    <div style={{ position: "relative", height: 130, overflow: "hidden" }}>
                      <img
                        src={p.img}
                        alt={p.nameEn}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      {/* Badge */}
                      <span style={{
                        position: "absolute", top: 10, left: 10,
                        background: badge.bg, color: "#fff",
                        fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 20,
                      }}>
                        {lang === "mr" ? badge.labelMr : badge.label}
                      </span>
                    </div>

                    {/* Content */}
                    <div style={{ padding: "12px 14px" }}>
                      <div style={{ fontWeight: 800, fontSize: 14, color: "#111827", marginBottom: 2 }}>
                        {t(p.nameEn, p.nameMr)}
                      </div>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 8 }}>
                        {t(p.qualityEn, p.qualityMr)}
                      </div>
                      <div style={{ fontWeight: 900, fontSize: 16, color: "#16a34a", marginBottom: 4 }}>
                        ₹ {p.price.toLocaleString("en-IN")}
                        <span style={{ fontSize: 11, fontWeight: 500, color: "#6b7280" }}> / {t("quintal", "क्विंटल")}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 10 }}>
                        📍 {t(p.locationEn, p.locationMr)}
                      </div>

                      {/* Farmer row */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{
                            width: 24, height: 24, borderRadius: "50%",
                            background: "linear-gradient(135deg,#16a34a,#4ade80)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontSize: 10, fontWeight: 800,
                          }}>
                            {p.farmerEn.charAt(0)}
                          </div>
                          <span style={{ fontSize: 11, color: "#374151", fontWeight: 600 }}>
                            {t(p.farmerEn, p.farmerMr)}
                          </span>
                        </div>
                        <span style={{ fontSize: 11, color: "#f59e0b", fontWeight: 700 }}>
                          ⭐ {p.rating}
                        </span>
                      </div>

                      <button
                        onClick={() => setCart(c => c + 1)}
                        style={{
                          width: "100%", background: "#fff", color: "#16a34a",
                          border: "1.5px solid #16a34a", borderRadius: 8,
                          padding: "8px 0", fontWeight: 700, fontSize: 12,
                          cursor: "pointer", transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#16a34a"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#16a34a"; }}
                      >
                        {t("View Details", "तपशील पहा")}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ══════════════ RIGHT SIDEBAR ══════════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Market Overview */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "20px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 18 }}>📊</span>
              <span style={{ fontWeight: 800, fontSize: 15, color: "#111827" }}>
                {t("Market Overview", "बाजार आढावा")}
              </span>
            </div>
            <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 16 }}>
              {t(`Updated: ${todayStr} · 10:30 AM`, `अपडेट: ${todayStr} · १०:३० AM`)}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {MARKET_OVERVIEW.map((item, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0",
                  borderBottom: i < MARKET_OVERVIEW.length - 1 ? "1px solid #f3f4f6" : "none",
                }}>
                  <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>
                    {t(item.nameEn, item.nameMr)}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{item.price}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 6,
                      background: item.up ? "#f0fdf4" : "#fef2f2",
                      color: item.up ? "#16a34a" : "#dc2626",
                    }}>
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button style={{
              width: "100%", marginTop: 14, background: "#f0fdf4", color: "#15803d",
              border: "1.5px solid #bbf7d0", borderRadius: 10, padding: "9px",
              fontWeight: 700, fontSize: 13, cursor: "pointer",
            }}>
              {t("View All Prices", "सर्व भाव पहा")}
            </button>
          </div>

          {/* Why Marketplace */}
          <div style={{ background: "#fff", borderRadius: 16, padding: "20px", boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#111827", marginBottom: 14 }}>
              {t("Why Marketplace?", "मार्केटप्लेस का?")}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {WHY_FEATURES.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 10, background: "#f0fdf4",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, flexShrink: 0,
                  }}>
                    {f.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>
                      {t(f.titleEn, f.titleMr)}
                    </div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                      {t(f.descEn, f.descMr)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New to Marketplace CTA */}
          <div style={{
            borderRadius: 16, padding: "20px",
            background: "linear-gradient(135deg,#14532d 0%,#16a34a 100%)",
            boxShadow: "0 4px 16px rgba(22,163,74,0.3)",
            position: "relative", overflow: "hidden",
          }}>
            {/* decorative circle */}
            <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
            <div style={{ position: "absolute", bottom: -10, right: 10, fontSize: 48, opacity: 0.2 }}>🌱</div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#fff", marginBottom: 6 }}>
                {t("New to Marketplace?", "मार्केटप्लेस नवीन आहे?")}
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 16, lineHeight: 1.5 }}>
                {t("Learn how to buy and sell products easily.", "उत्पादने सहज खरेदी व विक्री कशी करावी ते जाणून घ्या.")}
              </p>
              <button style={{
                background: "#fff", color: "#15803d", border: "none",
                borderRadius: 10, padding: "9px 18px", fontWeight: 800, fontSize: 13,
                cursor: "pointer", width: "100%",
              }}>
                {t("Learn More", "अधिक जाणून घ्या")}
              </button>
            </div>
          </div>

          {/* Sell your produce CTA */}
          <div style={{
            background: "#fff", borderRadius: 16, padding: "20px",
            boxShadow: "0 1px 6px rgba(0,0,0,0.07)", textAlign: "center",
          }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>👨‍🌾</div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#111827", marginBottom: 6 }}>
              {t("Sell your produce", "तुमचा माल विका")}
            </div>
            <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 14, lineHeight: 1.5 }}>
              {t("Reach thousands of buyers across the region.", "प्रदेशातील हजारो खरेदीदारांपर्यंत पोहोचा.")}
            </p>
            <button style={{
              width: "100%", background: "#16a34a", color: "#fff", border: "none",
              borderRadius: 10, padding: "10px", fontWeight: 800, fontSize: 13,
              cursor: "pointer", boxShadow: "0 2px 8px rgba(22,163,74,0.3)",
            }}>
              {t("Sell Now", "आत्ताच विका")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
