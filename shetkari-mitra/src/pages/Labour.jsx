import { useState, useContext, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { LanguageContext } from "../context/LanguageContext";
import api from "../services/api";

// ─── Static demo workers (shown alongside live DB data) ───────────────────────
const DEMO_WORKERS = [
  { id:"d1", nameEn:"Ganesh Shinde",   nameMr:"गणेश शिंदे",   skillEn:"Farm Labour",         skillMr:"शेत मजूर",       locationEn:"Pune, Maharashtra",      locationMr:"पुणे, महाराष्ट्र",      expEn:"5 years", expMr:"५ वर्षे", rate:500, rating:4.8, reviews:32, cat:"farm" },
  { id:"d2", nameEn:"Ramesh Jadhav",   nameMr:"रमेश जाधव",    skillEn:"Tractor Driver",      skillMr:"ट्रॅक्टर चालक", locationEn:"Haveli, Pune",           locationMr:"हवेली, पुणे",           expEn:"7 years", expMr:"७ वर्षे", rate:800, rating:4.7, reviews:28, cat:"tractor" },
  { id:"d3", nameEn:"Mahesh Kale",     nameMr:"महेश काळे",    skillEn:"Agricultural Worker", skillMr:"कृषी कामगार",    locationEn:"Baramati, Maharashtra",  locationMr:"बारामती, महाराष्ट्र",  expEn:"6 years", expMr:"६ वर्षे", rate:550, rating:4.6, reviews:18, cat:"farm" },
  { id:"d4", nameEn:"Vikas Pawar",     nameMr:"विकास पवार",   skillEn:"Pesticide Expert",    skillMr:"फवारणी तज्ञ",   locationEn:"Daund, Maharashtra",     locationMr:"दौंड, महाराष्ट्र",     expEn:"4 years", expMr:"४ वर्षे", rate:600, rating:4.5, reviews:15, cat:"spray" },
  { id:"d5", nameEn:"Suresh Patil",    nameMr:"सुरेश पाटील",  skillEn:"Harvesting Expert",   skillMr:"कापणी तज्ञ",    locationEn:"Indapur, Maharashtra",   locationMr:"इंदापूर, महाराष्ट्र",  expEn:"8 years", expMr:"८ वर्षे", rate:650, rating:4.9, reviews:40, cat:"harvest" },
  { id:"d6", nameEn:"Arjun Mane",      nameMr:"अर्जुन माने",  skillEn:"Irrigation Specialist",skillMr:"सिंचन तज्ञ",   locationEn:"Kolhapur, Maharashtra",  locationMr:"कोल्हापूर, महाराष्ट्र", expEn:"5 years", expMr:"५ वर्षे", rate:580, rating:4.7, reviews:22, cat:"irrigation" },
];

const COLORS = ["#dcfce7","#dbeafe","#fef9c3","#fce7f3","#ede9fe","#ffedd5"];
const EMOJIS = ["👨‍🌾","👷","👨‍🔧","🧑‍🌾","👩‍🌾","🧑‍🔧"];

const CATS = [
  { id:"all",        labelEn:"All",              labelMr:"सर्व",             icon:"⊞" },
  { id:"farm",       labelEn:"Farm Labour",       labelMr:"शेत मजूर",         icon:"👨‍🌾" },
  { id:"tractor",    labelEn:"Tractor Driver",    labelMr:"ट्रॅक्टर चालक",   icon:"🚜" },
  { id:"harvest",    labelEn:"Harvesting",        labelMr:"कापणी",            icon:"🌾" },
  { id:"irrigation", labelEn:"Irrigation",        labelMr:"सिंचन",            icon:"💧" },
  { id:"spray",      labelEn:"Pesticide",         labelMr:"फवारणी",           icon:"💨" },
];

const WHY = [
  { icon:"✅", titleEn:"Verified Workers",   titleMr:"सत्यापित मजूर",       subEn:"All workers are verified",       subMr:"सर्व मजूर सत्यापित" },
  { icon:"💪", titleEn:"Skilled & Trusted",  titleMr:"कुशल व विश्वासू",    subEn:"Get experienced workers",        subMr:"अनुभवी मजूर मिळवा" },
  { icon:"🔒", titleEn:"Safe & Easy",        titleMr:"सुरक्षित व सोपे",    subEn:"Secure payment & easy hiring",   subMr:"सुरक्षित पेमेंट" },
  { icon:"🕐", titleEn:"24/7 Support",       titleMr:"२४/७ मदत",           subEn:"We are always ready to help",    subMr:"आम्ही नेहमी तयार" },
];

// ─── Pill badge ────────────────────────────────────────────────────────────────
const Badge = ({ color, bg, children }) => (
  <span style={{ background: bg, color, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
    {children}
  </span>
);

export default function Labour() {
  const { lang } = useContext(LanguageContext);
  const { user } = useAuth();
  const mr = lang === "mr";
  const lbl = (en, mrStr) => (mr ? mrStr : en);

  // ── Filters ──────────────────────────────────────────────────────────────────
  const [activeCat, setActiveCat]     = useState("all");
  const [searchLoc, setSearchLoc]     = useState("");
  const [skillFilter, setSkillFilter] = useState("all");

  // ── DB Labour availabilities (I want to work posts) ──────────────────────────
  const [labourAvailabilities, setLabourAvailabilities] = useState([]);
  const [loadingAvail, setLoadingAvail]                 = useState(false);

  // ── Hire modal (for demo cards) ───────────────────────────────────────────────
  const [modal, setModal]       = useState(null); // demo worker object
  const [hireDate, setHireDate] = useState("");
  const [hireMsg, setHireMsg]   = useState("");
  const [hireDays, setHireDays] = useState(1);
  const [hireLoading, setHireLoading] = useState(false);
  const [hireSuccess, setHireSuccess] = useState(false);

  // ── Book DB Labour modal ──────────────────────────────────────────────────────
  const [bookModal, setBookModal]         = useState(null); // LabourAvailability object
  const [bookDate, setBookDate]           = useState("");
  const [bookDays, setBookDays]           = useState(1);
  const [bookDesc, setBookDesc]           = useState("");
  const [bookLoading, setBookLoading]     = useState(false);
  const [bookSuccess, setBookSuccess]     = useState(false);
  const [bookError, setBookError]         = useState("");

  // ── Interest state per card ────────────────────────────────────────────────────
  const [interested, setInterested] = useState({}); // { availId: true/false }
  const [interestLoading, setInterestLoading] = useState({});

  // ── "I want to work" form (for labour role) ───────────────────────────────────
  const [showLabourForm, setShowLabourForm] = useState(false);
  const [labourForm, setLabourForm] = useState({
    skill: "Farm Labour", experience: 0, bio: "", location: "", dailyRate: "",
  });
  const [labourLoading, setLabourLoading] = useState(false);
  const [labourSuccess, setLabourSuccess] = useState(false);
  const [labourError, setLabourError]     = useState("");

  // ── Fetch on mount ────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const fetchAvailabilities = async () => {
    try {
      setLoadingAvail(true);
      const res = await api.get("/api/v1/labour/available");
      setLabourAvailabilities(res.data.data || []);
    } catch (err) {
      console.error("Fetch availabilities error:", err);
    } finally {
      setLoadingAvail(false);
    }
  };

  // ── Filter demo workers ───────────────────────────────────────────────────────
  const visibleWorkers = DEMO_WORKERS.filter(w => {
    const catMatch   = activeCat === "all" || w.cat === activeCat;
    const locMatch   = !searchLoc.trim() || w.locationEn.toLowerCase().includes(searchLoc.toLowerCase()) || w.locationMr.includes(searchLoc);
    const skillMatch = skillFilter === "all" || w.cat === skillFilter;
    return catMatch && locMatch && skillMatch;
  });

  // ── Hire demo worker (frontend-only confirm + toast) ─────────────────────────
  const confirmDemoHire = async () => {
    if (!hireDate) return;
    setHireLoading(true);
    // Simulate API delay; in production, connect to /api/v1/labour-bookings with a listing ID
    await new Promise(r => setTimeout(r, 900));
    setHireLoading(false);
    setHireSuccess(true);
    setTimeout(() => setModal(null), 2200);
  };

  // ── Book a real DB labour ────────────────────────────────────────────────────
  const confirmBooking = async () => {
    if (!bookDate || !bookModal) return;
    setBookLoading(true);
    setBookError("");
    try {
      await api.post("/api/v1/labour-bookings", {
        labourAvailabilityId: bookModal._id,
        startDate: bookDate,
        days: bookDays,
        workDescription: bookDesc,
        totalAmount: bookModal.dailyRate * bookDays,
      });
      setBookSuccess(true);
      setTimeout(() => {
        setBookModal(null);
        setBookSuccess(false);
        setBookDate(""); setBookDays(1); setBookDesc("");
      }, 2500);
    } catch (err) {
      setBookError(err.response?.data?.msg || "Booking failed. Please try again.");
    } finally {
      setBookLoading(false);
    }
  };

  // ── Express interest (notifies labour) ───────────────────────────────────────
  const handleInterested = async (availId) => {
    setInterestLoading(prev => ({ ...prev, [availId]: true }));
    try {
      await api.post(`/api/v1/labour/${availId}/interested`);
      setInterested(prev => ({ ...prev, [availId]: true }));
    } catch (err) {
      alert(err.response?.data?.msg || "Error expressing interest");
    } finally {
      setInterestLoading(prev => ({ ...prev, [availId]: false }));
    }
  };

  // ── Post "I want to work" ─────────────────────────────────────────────────────
  const handleLabourPost = async (e) => {
    e.preventDefault();
    if (!labourForm.skill || !labourForm.location || !labourForm.dailyRate) {
      setLabourError(lbl("Please fill all required fields", "सर्व आवश्यक फील्ड भरा"));
      return;
    }
    setLabourLoading(true);
    setLabourError("");
    try {
      await api.post("/api/v1/labour/post", labourForm);
      setLabourSuccess(true);
      setLabourForm({ skill: "Farm Labour", experience: 0, bio: "", location: "", dailyRate: "" });
      setTimeout(() => {
        setShowLabourForm(false);
        setLabourSuccess(false);
        fetchAvailabilities();
      }, 2000);
    } catch (err) {
      setLabourError(err.response?.data?.msg || "Error posting availability");
    } finally {
      setLabourLoading(false);
    }
  };

  // ─── Shared input style ──────────────────────────────────────────────────────
  const inputStyle = {
    width: "100%", border: "1px solid #d1d5db", borderRadius: 8,
    padding: "10px 12px", fontSize: 14, outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb", fontFamily: "'Inter',sans-serif" }}>
      <Navbar />

      {/* ─── HERO ──────────────────────────────────────────────────────────────── */}
      <div style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7,#bbf7d0)", borderBottom: "1px solid #d1fae5", padding: "36px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 900, color: "#111827", marginBottom: 8 }}>
              {lbl("Hire Labour Workers", "मजूर भाड्याने घ्या")}
            </h1>
            <p style={{ fontSize: 15, color: "#4b5563", marginBottom: 20 }}>
              {lbl("Find skilled & trusted workers for your farm", "तुमच्या शेतकामासाठी कुशल व विश्वासू मजूर शोधा")}
            </p>
            {user?.role === "labour" ? (
              <button onClick={() => setShowLabourForm(true)}
                style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "12px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                💼 {lbl("I Want to Work — Post My Profile", "मला काम हवे — माझा प्रोफाइल पोस्ट करा")}
              </button>
            ) : (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <div style={{ background: "#fff", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 16px", fontSize: 13, color: "#15803d", fontWeight: 600 }}>
                  👇 {lbl("Scroll to find workers • Click Hire Now or Book to confirm", "कामगार शोधा • बुक करण्यासाठी क्लिक करा")}
                </div>
              </div>
            )}
          </div>
          <div style={{ width: 180, height: 120, background: "rgba(22,163,74,0.1)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64 }}>👨‍🌾</div>
        </div>
      </div>

      {/* ─── LABOUR AVAILABILITY SECTION (DB posts) ────────────────────────────── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
              💼 {lbl("Labourers Looking for Work", "काम शोधणारे मजूर")}
              <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 400, marginLeft: 8 }}>
                ({loadingAvail ? "…" : labourAvailabilities.length})
              </span>
            </h2>
            {user?.role === "labour" && (
              <button onClick={() => setShowLabourForm(true)}
                style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                + {lbl("Add My Profile", "प्रोफाइल जोडा")}
              </button>
            )}
          </div>

          {loadingAvail ? (
            <div style={{ textAlign: "center", color: "#9ca3af", padding: 32 }}>⏳ {lbl("Loading...", "लोड होत आहे...")}</div>
          ) : labourAvailabilities.length === 0 ? (
            <div style={{ background: "#f9fafb", borderRadius: 12, padding: 24, textAlign: "center", color: "#9ca3af" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
              <p>{lbl("No labourers have posted their availability yet.", "कोणत्याही मजुराने अद्याप उपलब्धता पोस्ट केलेली नाही.")}</p>
              {user?.role === "labour" && (
                <button onClick={() => setShowLabourForm(true)}
                  style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 12 }}>
                  {lbl("Be the first to post!", "प्रथम पोस्ट करा!")}
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 16 }}>
              {labourAvailabilities.map((labour, i) => (
                <div key={labour._id} style={{ background: "#fff", border: "2px solid #e5e7eb", borderRadius: 14, padding: 16, transition: "border-color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#16a34a"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e7eb"}>

                  {/* Header */}
                  <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 10 }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: COLORS[i % COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginRight: 12, flexShrink: 0 }}>
                      {EMOJIS[i % EMOJIS.length]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>{labour.labourName}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 2 }}>{labour.skill}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>⏱ {labour.experience}+ {lbl("years", "वर्षे")}</div>
                    </div>
                    <Badge bg="#dcfce7" color="#15803d">{lbl("Available", "उपलब्ध")}</Badge>
                  </div>

                  {/* Details */}
                  <div style={{ background: "#f9fafb", borderRadius: 8, padding: 10, marginBottom: 12 }}>
                    <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>📍 {labour.location}</div>
                    {labour.bio && <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.5 }}>{labour.bio}</div>}
                  </div>

                  {/* Footer */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid #e5e7eb" }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#16a34a" }}>₹{labour.dailyRate}<span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 400 }}>/{lbl("day", "दिवस")}</span></div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {/* Interested button — notifies labour */}
                      {user?.role !== "labour" && (
                        <button
                          onClick={() => handleInterested(labour._id)}
                          disabled={interestLoading[labour._id] || interested[labour._id]}
                          style={{
                            background: interested[labour._id] ? "#dcfce7" : "#f3f4f6",
                            color: interested[labour._id] ? "#15803d" : "#374151",
                            border: "none", borderRadius: 6, padding: "7px 12px", fontSize: 12, fontWeight: 700, cursor: interested[labour._id] ? "default" : "pointer"
                          }}>
                          {interestLoading[labour._id] ? "…" : interested[labour._id] ? "✅ " + lbl("Interested", "आग्रह") : "👀 " + lbl("Interested", "आग्रह")}
                        </button>
                      )}
                      {/* Book button — creates a real booking */}
                      {user && user.role !== "labour" && (
                        <button
                          onClick={() => { setBookModal(labour); setBookDate(""); setBookDays(1); setBookDesc(""); setBookSuccess(false); setBookError(""); }}
                          style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 6, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                          📅 {lbl("Book", "बुक")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── SEARCH BAR ────────────────────────────────────────────────────────── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "14px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 180, maxWidth: 300 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>🔍</span>
            <input value={searchLoc} onChange={e => setSearchLoc(e.target.value)}
              placeholder={lbl("Search by location...", "ठिकाण शोधा...")}
              style={{ ...inputStyle, paddingLeft: 36 }} />
          </div>
          <select value={skillFilter} onChange={e => setSkillFilter(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #d1d5db", fontSize: 14, background: "#fff", outline: "none" }}>
            <option value="all">{lbl("All Skills", "सर्व कौशल्ये")}</option>
            <option value="farm">{lbl("Farm Labour", "शेत मजूर")}</option>
            <option value="tractor">{lbl("Tractor Driver", "ट्रॅक्टर चालक")}</option>
            <option value="harvest">{lbl("Harvesting", "कापणी")}</option>
            <option value="irrigation">{lbl("Irrigation", "सिंचन")}</option>
            <option value="spray">{lbl("Pesticide", "फवारणी")}</option>
          </select>
          <button onClick={() => setActiveCat("all")}
            style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            {lbl("Search", "शोधा")}
          </button>
        </div>
      </div>

      {/* ─── CATEGORY PILLS ────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px 0" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {CATS.map(c => (
            <button key={c.id} onClick={() => setActiveCat(c.id)} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              padding: "9px 14px", borderRadius: 12, cursor: "pointer", fontSize: 12,
              border: activeCat === c.id ? "2px solid #16a34a" : "1px solid #e5e7eb",
              background: activeCat === c.id ? "#f0fdf4" : "#fff",
              fontWeight: activeCat === c.id ? 700 : 500,
              color: activeCat === c.id ? "#16a34a" : "#6b7280",
            }}>
              <span style={{ fontSize: 20 }}>{c.icon}</span>
              <span>{mr ? c.labelMr : c.labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── MAIN GRID ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "20px 24px 40px", display: "grid", gridTemplateColumns: "1fr 280px", gap: 24 }}>
        {/* WORKERS LIST */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
              {lbl("Available Workers", "उपलब्ध मजूर")} <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 400 }}>({visibleWorkers.length})</span>
            </h2>
          </div>

          {visibleWorkers.length === 0 && (
            <div style={{ background: "#fff", borderRadius: 14, padding: 40, textAlign: "center", border: "1px solid #f3f4f6" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <p style={{ color: "#9ca3af" }}>{lbl("No workers found. Try different filters.", "कोणताही मजूर आढळला नाही.")}</p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {visibleWorkers.map((w, i) => (
              <div key={w.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "16px 18px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: COLORS[i % COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>
                  {EMOJIS[i % EMOJIS.length]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#111827", marginBottom: 2 }}>{mr ? w.nameMr : w.nameEn}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 3 }}>{mr ? w.skillMr : w.skillEn}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 3 }}>📍 {mr ? w.locationMr : w.locationEn}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>⏱ {lbl("Experience", "अनुभव")}: {mr ? w.expMr : w.expEn}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {[...Array(5)].map((_, si) => <span key={si} style={{ color: si < Math.round(w.rating) ? "#f59e0b" : "#d1d5db", fontSize: 13 }}>★</span>)}
                    <span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>{w.rating}</span>
                    <span style={{ fontSize: 11, color: "#9ca3af" }}>({w.reviews} {lbl("reviews", "समीक्षा")})</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>₹{w.rate}<span style={{ fontSize: 12, color: "#6b7280", fontWeight: 400 }}>/{lbl("day", "दिवस")}</span></div>
                  <button onClick={() => { setModal(w); setHireDate(""); setHireMsg(""); setHireDays(1); setHireSuccess(false); }}
                    style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, padding: "9px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    {lbl("Hire Now", "आता भाड्याने घ्या")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR */}
        <div>
          {/* Post a job card */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 18, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: "#111827", marginBottom: 6 }}>{lbl("Post a Job", "काम पोस्ट करा")}</h3>
            <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 14 }}>{lbl("Find the right worker for your farm easily.", "योग्य मजूर सहज शोधा.")}</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <button style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                + {lbl("Post a Job", "काम पोस्ट करा")}
              </button>
              <span style={{ fontSize: 44 }}>👨‍🌾</span>
            </div>
          </div>

          {/* Why hire with us */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 18, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: "#111827", marginBottom: 14 }}>{lbl("Why Hire With Us?", "आमच्याकडून का भाड्याने घ्यावे?")}</h3>
            {WHY.map((w, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>{w.icon}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{mr ? w.titleMr : w.titleEn}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{mr ? w.subMr : w.subEn}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Market trends */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: 18, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>{lbl("Market Trends", "बाजार ट्रेंड")}</h3>
              <span style={{ fontSize: 10, color: "#6b7280", background: "#f3f4f6", padding: "3px 7px", borderRadius: 20 }}>{lbl("Today", "आज")}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fef9c3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📈</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{lbl("High Demand", "जास्त मागणी")}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{lbl("Tractor Drivers, Harvesting", "ट्रॅक्टर चालक, कापणी")}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💰</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{lbl("Average Rate", "सरासरी दर")}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>₹500 – ₹800/{lbl("day", "दिवस")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════════════════════════════════════ */}

      {/* ─── HIRE DEMO WORKER MODAL ──────────────────────────────────────────── */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 30, width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 4 }}>👷 {lbl("Hire Worker", "मजूर भाड्याने घ्या")}</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>{mr ? modal.nameMr : modal.nameEn} · {mr ? modal.skillMr : modal.skillEn} · ₹{modal.rate}/{lbl("day", "दिवस")}</div>
            {hireSuccess ? (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 18, textAlign: "center", color: "#16a34a", fontWeight: 700 }}>
                ✅ {lbl("Hire request sent successfully!", "भाड्याने घेण्याची विनंती यशस्वीरित्या पाठवली!")}
              </div>
            ) : (
              <>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{lbl("Start Date", "सुरुवातीची तारीख")}</label>
                <input type="date" value={hireDate} onChange={e => setHireDate(e.target.value)} min={new Date().toISOString().split("T")[0]} style={{ ...inputStyle, marginBottom: 14 }} />
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{lbl("Number of Days", "दिवसांची संख्या")}</label>
                <input type="number" value={hireDays} onChange={e => setHireDays(Number(e.target.value) || 1)} min={1} style={{ ...inputStyle, marginBottom: 14 }} />
                {hireDate && (
                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#15803d", fontWeight: 600 }}>
                    {lbl("Total", "एकूण")}: ₹{modal.rate * hireDays} — {hireDays} {lbl("days", "दिवसांसाठी")}
                  </div>
                )}
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{lbl("Message (optional)", "संदेश (पर्यायी)")}</label>
                <textarea value={hireMsg} onChange={e => setHireMsg(e.target.value)} placeholder={lbl("Describe the work...", "कामाचे वर्णन करा...")} style={{ ...inputStyle, resize: "none", height: 70, marginBottom: 18 }} />
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setModal(null)} style={{ flex: 1, border: "1px solid #d1d5db", background: "#fff", color: "#374151", borderRadius: 8, padding: 11, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>{lbl("Cancel", "रद्द करा")}</button>
                  <button onClick={confirmDemoHire} disabled={!hireDate || hireLoading}
                    style={{ flex: 1, border: "none", background: hireDate && !hireLoading ? "#16a34a" : "#d1d5db", color: "#fff", borderRadius: 8, padding: 11, fontWeight: 700, cursor: hireDate && !hireLoading ? "pointer" : "not-allowed", fontSize: 14 }}>
                    {hireLoading ? "⏳ " + lbl("Sending...", "पाठवत आहे...") : lbl("Confirm Hire", "पुष्टी करा")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ─── BOOK DB LABOUR MODAL ─────────────────────────────────────────────── */}
      {bookModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={e => e.target === e.currentTarget && setBookModal(null)}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 30, width: "100%", maxWidth: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 4 }}>📅 {lbl("Book Labour", "मजूर बुक करा")}</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
              {bookModal.labourName} · {bookModal.skill} · ₹{bookModal.dailyRate}/{lbl("day", "दिवस")}
            </div>

            {bookSuccess ? (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 20, textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#16a34a", marginBottom: 4 }}>
                  {lbl("Booking Request Sent!", "बुकिंग विनंती पाठवली!")}
                </div>
                <div style={{ fontSize: 13, color: "#4b5563" }}>
                  {lbl(`${bookModal.labourName} has been notified. They will accept or reject your request.`,
                    `${bookModal.labourName} यांना सूचना पाठवण्यात आली आहे. ते तुमची विनंती स्वीकारतील किंवा नाकारतील.`)}
                </div>
              </div>
            ) : (
              <>
                {bookError && (
                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, color: "#dc2626" }}>
                    ⚠️ {bookError}
                  </div>
                )}
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{lbl("Start Date *", "सुरुवातीची तारीख *")}</label>
                <input type="date" value={bookDate} onChange={e => setBookDate(e.target.value)} min={new Date().toISOString().split("T")[0]} style={{ ...inputStyle, marginBottom: 14 }} />

                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{lbl("Number of Days *", "दिवसांची संख्या *")}</label>
                <input type="number" value={bookDays} onChange={e => setBookDays(Number(e.target.value) || 1)} min={1} style={{ ...inputStyle, marginBottom: 14 }} />

                {bookDate && (
                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#15803d", fontWeight: 600 }}>
                    💰 {lbl("Total", "एकूण")}: ₹{bookModal.dailyRate * bookDays} ({bookDays} {lbl("days", "दिवस")} × ₹{bookModal.dailyRate})
                  </div>
                )}

                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>{lbl("Work Description (optional)", "कामाचे वर्णन (पर्यायी)")}</label>
                <textarea value={bookDesc} onChange={e => setBookDesc(e.target.value)} placeholder={lbl("e.g. Harvesting wheat crop...", "उदा. गहू पिकाची कापणी...")}
                  style={{ ...inputStyle, resize: "none", height: 70, marginBottom: 18 }} />

                <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: 10, marginBottom: 18, fontSize: 12, color: "#92400e" }}>
                  📨 {lbl(`${bookModal.labourName} will receive a notification and can accept or reject your booking.`,
                    `${bookModal.labourName} यांना सूचना मिळेल आणि ते तुमची बुकिंग स्वीकारू किंवा नाकारू शकतात.`)}
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setBookModal(null)} style={{ flex: 1, border: "1px solid #d1d5db", background: "#fff", color: "#374151", borderRadius: 8, padding: 11, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
                    {lbl("Cancel", "रद्द करा")}
                  </button>
                  <button onClick={confirmBooking} disabled={!bookDate || bookLoading}
                    style={{ flex: 1, border: "none", background: bookDate && !bookLoading ? "#16a34a" : "#d1d5db", color: "#fff", borderRadius: 8, padding: 11, fontWeight: 700, cursor: bookDate && !bookLoading ? "pointer" : "not-allowed", fontSize: 14 }}>
                    {bookLoading ? "⏳ " + lbl("Sending...", "पाठवत आहे...") : "📅 " + lbl("Send Booking Request", "बुकिंग विनंती पाठवा")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ─── I WANT TO WORK MODAL ─────────────────────────────────────────────── */}
      {showLabourForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={e => e.target === e.currentTarget && setShowLabourForm(false)}>
          <div style={{ background: "#fff", borderRadius: 18, padding: 30, width: "100%", maxWidth: 450, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 4 }}>💼 {lbl("I Want to Work", "मला काम हवे")}</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>{lbl("Post your availability — farmers will find you and send booking requests.", "तुमची उपलब्धता पोस्ट करा — शेतकरी तुम्हाला शोधतील आणि बुकिंग विनंती पाठवतील.")}</div>

            {labourSuccess ? (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: 18, textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#16a34a" }}>
                  {lbl("Profile Posted Successfully!", "प्रोफाइल यशस्वीरित्या पोस्ट केला!")}
                </div>
                <div style={{ fontSize: 13, color: "#4b5563", marginTop: 6 }}>
                  {lbl("Farmers can now see your profile and send you booking requests.", "शेतकरी आता तुमचा प्रोफाइल पाहू शकतात आणि बुकिंग विनंती पाठवू शकतात.")}
                </div>
              </div>
            ) : (
              <form onSubmit={handleLabourPost} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {labourError && (
                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: 12, fontSize: 13, color: "#dc2626" }}>
                    ⚠️ {labourError}
                  </div>
                )}

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                    {lbl("Skill Type", "कौशल्य प्रकार")} <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <select value={labourForm.skill} onChange={e => setLabourForm({ ...labourForm, skill: e.target.value })} style={inputStyle}>
                    <option>Farm Labour</option>
                    <option>Tractor Driver</option>
                    <option>Harvesting Expert</option>
                    <option>Pesticide Expert</option>
                    <option>Irrigation Specialist</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                    {lbl("Location", "ठिकाण")} <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input type="text" value={labourForm.location} onChange={e => setLabourForm({ ...labourForm, location: e.target.value })}
                    placeholder={lbl("e.g., Pune, Maharashtra", "उदा., पुणे, महाराष्ट्र")} style={inputStyle} />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                    {lbl("Daily Rate (₹)", "दैनिक दर (₹)")} <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input type="number" value={labourForm.dailyRate} onChange={e => setLabourForm({ ...labourForm, dailyRate: e.target.value })}
                    placeholder={lbl("e.g., 500", "उदा., 500")} min="0" style={inputStyle} />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                    {lbl("Experience (Years)", "अनुभव (वर्षे)")}
                  </label>
                  <input type="number" value={labourForm.experience} onChange={e => setLabourForm({ ...labourForm, experience: Number(e.target.value) })}
                    min="0" style={inputStyle} />
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                    {lbl("Bio / Description", "बायो / विवरण")}
                  </label>
                  <textarea value={labourForm.bio} onChange={e => setLabourForm({ ...labourForm, bio: e.target.value })}
                    placeholder={lbl("Tell farmers about your skills and experience...", "शेतकऱ्यांना तुमच्या कौशल्याबद्दल सांगा...")}
                    style={{ ...inputStyle, resize: "none", height: 80 }} />
                </div>

                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: 12, fontSize: 12, color: "#15803d" }}>
                  💡 {lbl("Once posted, farmers can see your profile and send you booking requests directly. You can accept or reject each request from your dashboard.",
                    "एकदा पोस्ट केल्यावर, शेतकरी तुमचा प्रोफाइल पाहू शकतात आणि बुकिंग विनंती पाठवू शकतात. तुम्ही प्रत्येक विनंती तुमच्या डॅशबोर्डवरून स्वीकारू किंवा नाकारू शकता.")}
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button type="button" onClick={() => setShowLabourForm(false)} style={{ flex: 1, border: "1px solid #d1d5db", background: "#fff", color: "#374151", borderRadius: 8, padding: 11, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
                    {lbl("Cancel", "रद्द करा")}
                  </button>
                  <button type="submit" disabled={labourLoading} style={{ flex: 1, border: "none", background: labourLoading ? "#d1d5db" : "#16a34a", color: "#fff", borderRadius: 8, padding: 11, fontWeight: 700, cursor: labourLoading ? "not-allowed" : "pointer", fontSize: 14 }}>
                    {labourLoading ? "⏳ " + lbl("Posting...", "पोस्ट होत आहे...") : "✅ " + lbl("Post My Availability", "उपलब्धता पोस्ट करा")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}