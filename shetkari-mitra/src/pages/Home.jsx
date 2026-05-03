import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import farmingHero from "../assets/farming-hero.png";
import logo from "../assets/logo.png";

/* ─── Translations ─── */
const T = {
  en: {
    badge: "India's #1 Farmer Platform",
    title1: "Empowering Every",
    title2: "Indian Farmer",
    desc: "From booking tractors to accessing government schemes — everything a farmer needs, in one app. Available in 5 languages.",
    btn1: "Get Started Free",
    btn2: "Browse Marketplace",
    noMiddle: "No middlemen. Better prices.",
    free: "Free forever for farmers.",
    statsLabel: ["Farmers", "Villages", "₹ Traded", "Rating"],
    featuresTitle: "Everything You Need to Farm Smarter",
    featuresDesc: "Powered by AI, built for India's 140M farmers",
    howTitle: "How It Works",
    howDesc: "Get started in 3 simple steps",
    ctaTitle: "Join 50,000+ Farmers Already Growing Smarter",
    ctaBtn: "Register Free Today",
    testimonials: "Trusted by Farmers Across India",
  },
  mr: {
    badge: "भारतातील #1 शेतकरी प्लॅटफॉर्म",
    title1: "प्रत्येक",
    title2: "भारतीय शेतकऱ्याचे सशक्तीकरण",
    desc: "ट्रॅक्टर बुकिंगपासून सरकारी योजनांपर्यंत — शेतकऱ्याला लागणारे सर्व एकाच अ‍ॅपमध्ये.",
    btn1: "मोफत सुरू करा",
    btn2: "मार्केटप्लेस पाहा",
    noMiddle: "कोणता दलाल नाही. चांगले भाव.",
    free: "शेतकऱ्यांसाठी नेहमी मोफत.",
    statsLabel: ["शेतकरी", "गावे", "₹ व्यवहार", "रेटिंग"],
    featuresTitle: "स्मार्ट शेतीसाठी सर्वकाही",
    featuresDesc: "AI द्वारे संचालित, भारतातील शेतकऱ्यांसाठी बनवले",
    howTitle: "हे कसे काम करते",
    howDesc: "३ सोप्या चरणांत सुरू करा",
    ctaTitle: "५०,०००+ शेतकऱ्यांसह सामील व्हा",
    ctaBtn: "आज मोफत नोंदणी करा",
    testimonials: "भारतभरातील शेतकऱ्यांचा विश्वास",
  },
  hi: {
    badge: "भारत का #1 किसान प्लेटफॉर्म",
    title1: "हर भारतीय",
    title2: "किसान को सशक्त करें",
    desc: "ट्रैक्टर बुकिंग से सरकारी योजनाओं तक — किसान को जरूरत की हर चीज एक ऐप में।",
    btn1: "मुफ्त शुरू करें",
    btn2: "मार्केटप्लेस देखें",
    noMiddle: "कोई बिचौलिया नहीं। बेहतर दाम।",
    free: "किसानों के लिए हमेशा मुफ्त।",
    statsLabel: ["किसान", "गाँव", "₹ व्यापार", "रेटिंग"],
    featuresTitle: "स्मार्ट खेती के लिए सब कुछ",
    featuresDesc: "AI-संचालित, भारत के 14 करोड़ किसानों के लिए",
    howTitle: "यह कैसे काम करता है",
    howDesc: "3 आसान चरणों में शुरू करें",
    ctaTitle: "50,000+ किसानों से जुड़ें",
    ctaBtn: "आज मुफ्त पंजीकरण करें",
    testimonials: "पूरे भारत के किसानों का भरोसा",
  },
  te: {
    badge: "భారతదేశంలో #1 రైతు వేదిక",
    title1: "ప్రతి భారతీయ",
    title2: "రైతుకు శక్తి",
    desc: "ట్రాక్టర్ బుకింగ్ నుండి ప్రభుత్వ పథకాల వరకు — ఒక్క యాప్‌లో అన్నీ.",
    btn1: "ఉచితంగా ప్రారంభించండి",
    btn2: "మార్కెట్‌ప్లేస్ చూడండి",
    noMiddle: "దళారులు లేరు. మెరుగైన ధరలు.",
    free: "రైతులకు ఎప్పుడూ ఉచితం.",
    statsLabel: ["రైతులు", "గ్రామాలు", "₹ వ్యాపారం", "రేటింగ్"],
    featuresTitle: "తెలివైన వ్యవసాయానికి అన్నీ",
    featuresDesc: "AI ద్వారా, భారత రైతుల కోసం",
    howTitle: "ఇది ఎలా పని చేస్తుంది",
    howDesc: "3 సులభమైన దశలలో ప్రారంభించండి",
    ctaTitle: "50,000+ రైతులతో చేరండి",
    ctaBtn: "ఈరోజు ఉచితంగా నమోదు చేయండి",
    testimonials: "భారతదేశం అంతటా రైతుల విశ్వాసం",
  },
  kn: {
    badge: "ಭಾರತದ #1 ರೈತ ವೇದಿಕೆ",
    title1: "ಪ್ರತಿ ಭಾರತೀಯ",
    title2: "ರೈತನಿಗೆ ಶಕ್ತಿ",
    desc: "ಟ್ರ್ಯಾಕ್ಟರ್ ಬುಕಿಂಗ್‌ನಿಂದ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳವರೆಗೆ — ಒಂದೇ ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ.",
    btn1: "ಉಚಿತವಾಗಿ ಪ್ರಾರಂಭಿಸಿ",
    btn2: "ಮಾರುಕಟ್ಟೆ ನೋಡಿ",
    noMiddle: "ದಲ್ಲಾಳಿಗಳಿಲ್ಲ. ಉತ್ತಮ ಬೆಲೆಗಳು.",
    free: "ರೈತರಿಗೆ ಯಾವಾಗಲೂ ಉಚಿತ.",
    statsLabel: ["ರೈತರು", "ಗ್ರಾಮಗಳು", "₹ ವ್ಯಾಪಾರ", "ರೇಟಿಂಗ್"],
    featuresTitle: "ಸ್ಮಾರ್ಟ್ ಕೃಷಿಗೆ ಎಲ್ಲವೂ",
    featuresDesc: "AI-ಚಾಲಿತ, ಭಾರತದ ರೈತರಿಗಾಗಿ",
    howTitle: "ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ",
    howDesc: "3 ಸರಳ ಹಂತಗಳಲ್ಲಿ ಪ್ರಾರಂಭಿಸಿ",
    ctaTitle: "50,000+ ರೈತರೊಂದಿಗೆ ಸೇರಿ",
    ctaBtn: "ಇಂದು ಉಚಿತವಾಗಿ ನೋಂದಣಿ ಮಾಡಿ",
    testimonials: "ಭಾರತದಾದ್ಯಂತ ರೈತರ ವಿಶ್ವಾಸ",
  },
};

const FEATURES = {
  en: [
    { icon: "🛒", title: "Marketplace", desc: "Sell crops directly to buyers. No middlemen, better prices.", link: "/marketplace", color: "#f0fdf4", border: "#bbf7d0", tag: "Popular" },
    { icon: "🚜", title: "Tractor Booking", desc: "Book tractors & farming tools in your village instantly.", link: "/tractor", color: "#fef9c3", border: "#fde047", tag: "" },
    { icon: "👷", title: "Hire Labour", desc: "Connect with skilled farm workers for sowing & harvesting.", link: "/labour", color: "#fff7ed", border: "#fed7aa", tag: "" },
    { icon: "🌿", title: "AI Crop Doctor", desc: "Upload a photo — AI detects disease & gives treatment advice.", link: "/crop-disease", color: "#f0fdf4", border: "#86efac", tag: "AI" },
    { icon: "🌤️", title: "Weather Forecast", desc: "Hyper-local 7-day forecast with crop-specific advisories.", link: "/weather", color: "#eff6ff", border: "#bfdbfe", tag: "" },
    { icon: "📋", title: "Govt Schemes", desc: "Discover PM-KISAN, crop insurance & 20+ more schemes.", link: "/schemes", color: "#faf5ff", border: "#e9d5ff", tag: "" },
    { icon: "📊", title: "Live Mandi Prices", desc: "Real-time market prices from 200+ mandis across India.", link: "/mandi", color: "#f0fdf4", border: "#bbf7d0", tag: "Live" },
    { icon: "📄", title: "7/12 Land Records", desc: "View, download Maharashtra land records instantly.", link: "/land-records", color: "#fff7ed", border: "#fed7aa", tag: "New" },
    { icon: "🎤", title: "Voice Assistant", desc: "Ask questions in Marathi, Hindi, Telugu, Kannada by voice.", link: "/voice", color: "#fdf4ff", border: "#e9d5ff", tag: "AI" },
    { icon: "🌱", title: "Soil Health Tracker", desc: "Enter N-P-K values → AI recommends fertilizers per crop.", link: "/soil-health", color: "#f0fdf4", border: "#bbf7d0", tag: "AI" },
    { icon: "💬", title: "Farmers Forum", desc: "Ask & answer questions in your language. Community-powered.", link: "/community", color: "#fef9c3", border: "#fde047", tag: "Community" },
    { icon: "📱", title: "Works Offline (PWA)", desc: "Save mandi prices & schemes for offline access on 2G/3G.", link: "/register", color: "#eff6ff", border: "#bfdbfe", tag: "PWA" },
  ],
  mr: [
    { icon: "🛒", title: "मार्केटप्लेस", desc: "थेट खरेदीदारांना पिके विका. दलाल नाहीत, चांगले भाव.", link: "/marketplace", color: "#f0fdf4", border: "#bbf7d0", tag: "लोकप्रिय" },
    { icon: "🚜", title: "ट्रॅक्टर बुकिंग", desc: "आपल्या गावात ट्रॅक्टर आणि शेतीची साधने त्वरित बुक करा.", link: "/tractor", color: "#fef9c3", border: "#fde047", tag: "" },
    { icon: "👷", title: "मजूर मिळवा", desc: "पेरणी आणि कापणीसाठी कुशल शेतमजुरांशी संपर्क साधा.", link: "/labour", color: "#fff7ed", border: "#fed7aa", tag: "" },
    { icon: "🌿", title: "AI पीक डॉक्टर", desc: "फोटो अपलोड करा — AI रोगाचा शोध घेते व उपचाराचा सल्ला देते.", link: "/crop-disease", color: "#f0fdf4", border: "#86efac", tag: "AI" },
    { icon: "🌤️", title: "हवामान अंदाज", desc: "पिकासाठी सल्ल्यांसह ७-दिवसांचा स्थानिक हवामान अंदाज.", link: "/weather", color: "#eff6ff", border: "#bfdbfe", tag: "" },
    { icon: "📋", title: "शासकीय योजना", desc: "पीएम-किसान, पीक विमा आणि इतर २०+ योजना शोधा.", link: "/schemes", color: "#faf5ff", border: "#e9d5ff", tag: "" },
    { icon: "📊", title: "थेट बाजारभाव", desc: "भारतभरातील २००+ मंडईंमधून रिअल-टाइम बाजारभाव.", link: "/mandi", color: "#f0fdf4", border: "#bbf7d0", tag: "थेट" },
    { icon: "📄", title: "७/१२ उतारे", desc: "महाराष्ट्राचे जमिनीचे उतारे त्वरित पहा आणि डाउनलोड करा.", link: "/land-records", color: "#fff7ed", border: "#fed7aa", tag: "नवीन" },
    { icon: "🎤", title: "व्हॉइस असिस्टंट", desc: "मराठी, हिंदी, तेलुगु, कन्नडमध्ये आवाजाने प्रश्न विचारा.", link: "/voice", color: "#fdf4ff", border: "#e9d5ff", tag: "AI" },
    { icon: "🌱", title: "माती आरोग्य ट्रॅकर", desc: "N-P-K मूल्ये टाका → AI खतांची शिफारस करेल.", link: "/soil-health", color: "#f0fdf4", border: "#bbf7d0", tag: "AI" },
    { icon: "💬", title: "शेतकरी मंच", desc: "आपल्या भाषेत प्रश्न विचारा आणि उत्तरे मिळवा.", link: "/community", color: "#fef9c3", border: "#fde047", tag: "समुदाय" },
    { icon: "📱", title: "ऑफलाइन चालते (PWA)", desc: "2G/3G वर ऑफलाइन प्रवेशासाठी योजना जतन करा.", link: "/register", color: "#eff6ff", border: "#bfdbfe", tag: "PWA" },
  ]
};

const STATS = [
  { value: 50000, display: "50,000+", label: 0, icon: "👨‍🌾" },
  { value: 1200, display: "1,200+", label: 1, icon: "🏘️" },
  { value: 18, display: "₹18Cr+", label: 2, icon: "💰" },
  { value: 4.8, display: "4.8⭐", label: 3, icon: "⭐" },
];

const LANGS = [
  { code: "en", label: "English" },
  { code: "mr", label: "मराठी" },
  { code: "hi", label: "हिंदी" },
  { code: "te", label: "తెలుగు" },
  { code: "kn", label: "ಕನ್ನಡ" },
];

const TESTIMONIALS = [
  { name: "Ramesh Patil", village: "Washim, MH", role: "🌾 Farmer", text: "Sold my soybean at ₹200 more per quintal vs local market. No middlemen!", rating: 5, lang: "mr" },
  { name: "Sunita Kale", village: "Yavatmal, MH", role: "👷 Labour", text: "Found 3 months consistent work during harvest. Payment was instant.", rating: 5, lang: "mr" },
  { name: "Arun Bhosale", village: "Buldhana, MH", role: "🚜 Tractor Owner", text: "Tractor was idle 6 months. Now it's booked 4 days a week!", rating: 5, lang: "mr" },
  { name: "Vijay Reddy", village: "Guntur, AP", role: "🌾 Farmer", text: "Mandi prices in real-time saved me from selling at wrong time. Great app!", rating: 5, lang: "te" },
  { name: "Priya Sharma", village: "Indore, MP", role: "🌾 Farmer", text: "AI ने मेरी फसल की बीमारी 2 मिनट में पहचानी। बहुत उपयोगी है।", rating: 5, lang: "hi" },
  { name: "Mahesh Gowda", village: "Davangere, KA", role: "🚜 Tractor Owner", text: "ಅಪ್ಲಿಕೇಶನ್ ಮೂಲಕ ಪ್ರತಿ ತಿಂಗಳು ₹15000 ಹೆಚ್ಚುವರಿ ಆದಾಯ!", rating: 5, lang: "kn" },
];

function AnimatedCounter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const startTime = Date.now();
        const isFloat = target % 1 !== 0;
        const timer = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(isFloat ? (eased * target).toFixed(1) : Math.round(eased * target));
          if (progress >= 1) clearInterval(timer);
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function Home() {
  const { lang, setLang } = useContext(LanguageContext);
  const { user } = useAuth();
  const t = T[lang] || T.en;
  const navigate = useNavigate();
  const [activeLang, setActiveLang] = useState(lang || "en");

  const handleLang = (code) => {
    setActiveLang(code);
    if (setLang) setLang(code);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff", minHeight: "100vh" }}>
      <Navbar />

      {/* ─── LOGGED-IN USER BANNER ─── */}
      {user && (
        <div style={{ background: "linear-gradient(135deg,#14532d,#16a34a)", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>
            {lang === "mr" ? "👋 पुन्हा स्वागत आहे, " : "👋 Welcome back, "}<strong>{user.name}</strong>! {lang === "mr" ? "तुमची भूमिका: " : "You're logged in as "}<span style={{ background: "rgba(255,255,255,0.2)", padding: "2px 10px", borderRadius: 20, fontSize: 12 }}>{user.role}</span>
          </div>
          <button onClick={() => navigate("/dashboard")}
            style={{ background: "#fff", color: "#16a34a", border: "none", borderRadius: 20, padding: "8px 20px", fontWeight: 800, fontSize: 13, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
            {lang === "mr" ? "माझ्या डॅशबोर्डवर जा →" : "Go to My Dashboard →"}
          </button>
        </div>
      )}

      {/* ─── HERO ─── */}
      <section style={{ background: "linear-gradient(135deg,#f0fdf4 0%,#dcfce7 50%,#bbf7d0 100%)", padding: "80px 0 60px", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          {/* Left */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#dcfce7", color: "#15803d", padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
              🌿 {t.badge}
            </div>
            <h1 style={{ fontSize: 52, fontWeight: 900, color: "#111827", lineHeight: 1.15, marginBottom: 20 }}>
              {t.title1}<br />
              <span style={{ color: "#16a34a" }}>{t.title2}</span>
            </h1>
            <p style={{ fontSize: 18, color: "#4b5563", lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>{t.desc}</p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 24 }}>
              <button onClick={() => navigate("/register")}
                style={{ background: "linear-gradient(135deg,#16a34a,#15803d)", color: "#fff", padding: "14px 32px", borderRadius: 50, fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(22,163,74,0.4)", transition: "transform 0.15s" }}
                onMouseOver={e => e.target.style.transform = "scale(1.04)"}
                onMouseOut={e => e.target.style.transform = "scale(1)"}>
                {t.btn1} →
              </button>
              <button onClick={() => navigate("/marketplace")}
                style={{ background: "#fff", color: "#374151", padding: "14px 28px", borderRadius: 50, fontWeight: 600, fontSize: 15, border: "2px solid #e5e7eb", cursor: "pointer", transition: "all 0.15s" }}
                onMouseOver={e => { e.target.style.borderColor = "#16a34a"; e.target.style.color = "#16a34a"; }}
                onMouseOut={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.color = "#374151"; }}>
                {t.btn2}
              </button>
            </div>
            <div style={{ display: "flex", gap: 20, fontSize: 14, color: "#6b7280" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ color: "#16a34a", fontWeight: 700 }}>✔</span> {t.noMiddle}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ color: "#16a34a", fontWeight: 700 }}>✔</span> {t.free}</span>
            </div>
          </div>

          {/* Right — Farmer Hero Image */}
          <div style={{ position: "relative" }}>
            <img
              src={farmingHero}
              alt="Indian Farmer"
              style={{ width: "100%", borderRadius: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.18)", objectFit: "cover", maxHeight: 460 }}
            />
            {/* Floating badge — top right */}
            <div style={{ position: "absolute", top: 16, right: -16, background: "#fff", borderRadius: 16, padding: "10px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>50K+</div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>{lang === "mr" ? "सक्रीय शेतकरी" : "Active Farmers"}</div>
            </div>
            {/* Floating badge — bottom left */}
            <div style={{ position: "absolute", bottom: 16, left: -16, background: "#fff", borderRadius: 16, padding: "10px 16px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", border: "1px solid #e5e7eb", display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 22 }}>⭐</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>4.8/5</div>
                <div style={{ fontSize: 11, color: "#6b7280" }}>{lang === "mr" ? "१,२०० प्रतिक्रिया" : "1,200 Reviews"}</div>
              </div>
            </div>
            {/* Floating badge — bottom right */}
            <div style={{ position: "absolute", bottom: 16, right: -8, background: "linear-gradient(135deg,#16a34a,#15803d)", borderRadius: 14, padding: "10px 14px", boxShadow: "0 8px 24px rgba(22,163,74,0.35)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>🤖 {lang === "mr" ? "AI पीक डॉक्टर" : "AI Crop Doctor"}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>{lang === "mr" ? "आता तुमचे पीक स्कॅन करा →" : "Scan your crop now →"}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section style={{ background: "linear-gradient(135deg,#14532d,#16a34a)", padding: "36px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24, textAlign: "center" }}>
          {STATS.map((s, i) => (
            <div key={i}>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#fff" }}>
                {i === 2 ? "₹" : ""}<AnimatedCounter target={s.value} />{i === 0 || i === 1 ? "+" : i === 2 ? "Cr+" : "⭐"}
              </div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 6, fontWeight: 500 }}>{t.statsLabel[i]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES GRID ─── */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ background: "#dcfce7", color: "#15803d", padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 700 }}>{lang === "mr" ? "वैशिष्ट्ये" : "FEATURES"}</span>
            <h2 style={{ fontSize: 42, fontWeight: 900, color: "#111827", marginTop: 16, marginBottom: 12 }}>{t.featuresTitle}</h2>
            <p style={{ fontSize: 17, color: "#6b7280", maxWidth: 540, margin: "0 auto" }}>{t.featuresDesc}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
            {(FEATURES[lang] || FEATURES.en).map((f, i) => (
              <button key={i} onClick={() => navigate(f.link)}
                style={{
                  background: f.color, border: `1.5px solid ${f.border}`, borderRadius: 16, padding: "22px 18px",
                  cursor: "pointer", textAlign: "left", position: "relative", transition: "all 0.2s",
                }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.10)"; }}
                onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                {f.tag && (
                  <span style={{ position: "absolute", top: 12, right: 12, background: f.tag === "AI" ? "#dcfce7" : f.tag === "Live" ? "#fee2e2" : f.tag === "New" ? "#dbeafe" : f.tag === "PWA" ? "#e0e7ff" : "#fef9c3", color: f.tag === "AI" ? "#15803d" : f.tag === "Live" ? "#b91c1c" : f.tag === "New" ? "#1d4ed8" : f.tag === "PWA" ? "#4338ca" : "#92400e", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>
                    {f.tag}
                  </span>
                )}
                <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{f.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ background: "#f8fafc", padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", marginBottom: 52 }}>
          <h2 style={{ fontSize: 40, fontWeight: 900, color: "#111827", marginBottom: 12 }}>{t.howTitle}</h2>
          <p style={{ fontSize: 16, color: "#6b7280" }}>{t.howDesc}</p>
        </div>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32, textAlign: "center" }}>
          {(lang === "mr" ? [
            { step: "१", icon: "📱", title: "मोफत नोंदणी करा", desc: "६० सेकंदात साइन अप करा — तुमची भूमिका निवडा (शेतकरी, ट्रॅक्टर मालक, मजूर किंवा सरकार)." },
            { step: "२", icon: "⚙️", title: "प्रोफाईल सेट करा", desc: "तुमची पिके, स्थान, उपकरणे किंवा सेवा जोडा. २४ तासात पडताळणी." },
            { step: "३", icon: "🤝", title: "जोडा आणि मिळवा", desc: "सेवा बुक करा, पिके विका, AI सल्ला घ्या आणि थेट २०+ योजनांमध्ये प्रवेश मिळवा." },
          ] : [
            { step: "1", icon: "📱", title: "Register for Free", desc: "Sign up in 60 seconds — choose your role (Farmer, Tractor Owner, Labour, or Govt)." },
            { step: "2", icon: "⚙️", title: "Set Up Your Profile", desc: "Add your crops, location, equipment or services. Verified badge in 24 hours." },
            { step: "3", icon: "🤝", title: "Connect & Earn", desc: "Book services, sell crops, get AI advice and access 20+ govt schemes directly." },
          ]).map((item) => (
            <div key={item.step} style={{ background: "#fff", borderRadius: 20, padding: "36px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>{item.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#16a34a", letterSpacing: 2, marginBottom: 8 }}>{lang === "mr" ? "पायरी " : "STEP "}{item.step}</div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginBottom: 10 }}>{item.title}</h3>
              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section style={{ padding: "80px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 40, fontWeight: 900, color: "#111827" }}>{t.testimonials}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {TESTIMONIALS.map((tm, i) => (
              <div key={i} style={{ background: "#f8fafc", borderRadius: 18, padding: "24px 22px", border: "1px solid #e5e7eb", position: "relative" }}>
                <div style={{ fontSize: 32, color: "#d1d5db", position: "absolute", top: 16, right: 20, fontFamily: "Georgia, serif" }}>"</div>
                <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                  {[...Array(tm.rating)].map((_, j) => <span key={j} style={{ fontSize: 14, color: "#f59e0b" }}>★</span>)}
                </div>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, marginBottom: 18, fontStyle: "italic" }}>"{tm.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#14532d,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16 }}>{tm.name.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{tm.name}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{tm.role} · {tm.village}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEW FEATURES HIGHLIGHT ─── */}
      <section style={{ background: "linear-gradient(135deg,#f0fdf4,#dcfce7)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 40, fontWeight: 900, color: "#111827", marginBottom: 12 }}>🚀 {lang === "mr" ? "या महिन्यातील नवीन वैशिष्ट्ये" : "New Features This Month"}</h2>
            <p style={{ fontSize: 16, color: "#6b7280" }}>{lang === "mr" ? "शेतकऱ्यांनी, शेतकऱ्यांसाठी बनवलेले" : "Built by farmers, for farmers"}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 24 }}>
            {(lang === "mr" ? [
              { icon: "📄", title: "७/१२ उतारा दर्शक", desc: "कोणत्याही सरकारी कार्यालयास न भेट देता तुमचे सातबारा उतारे थेट सरकारी पोर्टलवरून पहा आणि डाउनलोड करा.", link: "/land-records", badge: "नवीन", badgeColor: "#1d4ed8", badgeBg: "#dbeafe" },
              { icon: "🎤", title: "व्हॉइस असिस्टंट", desc: "मराठी, हिंदी, तेलुगु किंवा कन्नडमध्ये शेतीचे प्रश्न आवाजाने विचारा. AI तुमच्या भाषेत सल्ला देतो.", link: "/voice", badge: "AI", badgeColor: "#15803d", badgeBg: "#dcfce7" },
              { icon: "🌱", title: "माती आरोग्य आणि AI", desc: "माती आरोग्य कार्डावरून N-P-K आणि pH टाकल्यावर → AI पिकासाठी खताचा प्रकार व प्रमाण सुचवतो.", link: "/soil-health", badge: "AI", badgeColor: "#15803d", badgeBg: "#dcfce7" },
              { icon: "💬", title: "शेतकरी मंच", desc: "मराठीत प्रश्न विचारा. अनुभवी शेतकऱ्यांकडून उत्तरे मिळवा. अधिकारी देखील माहिती पोस्ट करू शकतात.", link: "/community", badge: "समुदाय", badgeColor: "#92400e", badgeBg: "#fef9c3" },
            ] : [
              { icon: "📄", title: "7/12 Utara Viewer", desc: "Instantly view and download your Maharashtra land records (satbara utara) directly from the government portal — no office visits.", link: "/land-records", badge: "New", badgeColor: "#1d4ed8", badgeBg: "#dbeafe" },
              { icon: "🎤", title: "Voice Assistant (Marathi/Hindi)", desc: "Ask farming questions by voice in Marathi, Hindi, Telugu, or Kannada. AI answers in your language with crop-specific advice.", link: "/voice", badge: "AI", badgeColor: "#15803d", badgeBg: "#dcfce7" },
              { icon: "🌱", title: "Soil Health Tracker & AI", desc: "Enter your N-P-K and pH values from your Soil Health Card → AI instantly recommends fertilizer type and dosage per crop.", link: "/soil-health", badge: "AI", badgeColor: "#15803d", badgeBg: "#dcfce7" },
              { icon: "💬", title: "Farmers Community Forum", desc: "Ask questions in Marathi. Get answers from experienced farmers. Government officers can also post updates and advisories.", link: "/community", badge: "Community", badgeColor: "#92400e", badgeBg: "#fef9c3" },
            ]).map((f, i) => (
              <button key={i} onClick={() => navigate(f.link)}
                style={{ background: "#fff", borderRadius: 20, padding: "28px 24px", border: "1px solid #e5e7eb", cursor: "pointer", textAlign: "left", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", transition: "all 0.2s", display: "flex", gap: 20, alignItems: "flex-start" }}
                onMouseOver={e => e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)"}
                onMouseOut={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"}>
                <div style={{ fontSize: 40, flexShrink: 0 }}>{f.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontWeight: 800, fontSize: 16, color: "#111827" }}>{f.title}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: f.badgeBg, color: f.badgeColor }}>{f.badge}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{f.desc}</p>
                  <div style={{ fontSize: 13, color: "#16a34a", fontWeight: 600, marginTop: 10 }}>{lang === "mr" ? "पाहा →" : "Explore →"}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section style={{ background: "linear-gradient(135deg,#14532d,#16a34a)", padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 42, fontWeight: 900, color: "#fff", marginBottom: 20 }}>{t.ctaTitle}</h2>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.75)", marginBottom: 36, maxWidth: 560, margin: "0 auto 36px" }}>
          {lang === "mr" ? "तंत्रज्ञानाचा वापर करून अधिक उत्पादन घेणाऱ्या आणि अधिक कमाई करणाऱ्या लाखो भारतीय शेतकऱ्यांमध्ये सामील व्हा." : "Join millions of Indian farmers using technology to grow more, earn more, and waste less."}
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => navigate("/register")}
            style={{ background: "#fff", color: "#16a34a", padding: "16px 40px", borderRadius: 50, fontWeight: 800, fontSize: 17, border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
            {t.ctaBtn} 🌱
          </button>
          <button onClick={() => navigate("/mandi")}
            style={{ background: "rgba(255,255,255,0.15)", color: "#fff", padding: "16px 32px", borderRadius: 50, fontWeight: 600, fontSize: 16, border: "2px solid rgba(255,255,255,0.3)", cursor: "pointer" }}>
            📊 {lang === "mr" ? "थेट बाजारभाव पाहा" : "View Live Mandi Prices"}
          </button>
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
          {(lang === "mr" ? [
            { icon: "📱", text: "PWA — ऑफलाइन चालते" },
            { icon: "🔒", text: "१००% सुरक्षित" },
            { icon: "🌐", text: "५ भाषा" },
          ] : [
            { icon: "📱", text: "PWA — Works Offline" },
            { icon: "🔒", text: "100% Secure" },
            { icon: "🌐", text: "5 Languages" },
          ]).map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500 }}>
              <span>{item.icon}</span>{item.text}
            </div>
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: "#0f172a", color: "#94a3b8", padding: "48px 20px 28px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* Brand row — always full width on top */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <img src={logo} alt="Logo" style={{ height: 28, width: "auto" }} />
              {lang === "mr" ? "शेतकरी मित्र" : "Shetkari Mitra"}
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 340 }}>
              {lang === "mr"
                ? "शेतकरी, ट्रॅक्टर मालक, मजूर आणि सरकार यांना जोडणारे भारतातील सर्वात विश्वासार्ह व्यासपीठ. १५ राज्यांमध्ये ५ भाषांमध्ये उपलब्ध."
                : "India's most trusted platform connecting farmers, tractor owners, labourers and government. Available in 5 languages across 15 states."}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
              {LANGS.map(l => (
                <button key={l.code} onClick={() => handleLang(l.code)}
                  style={{ fontSize: 11, padding: "4px 10px", borderRadius: 12, cursor: "pointer", border: "1px solid #334155", background: activeLang === l.code ? "#16a34a" : "transparent", color: activeLang === l.code ? "#fff" : "#94a3b8", transition: "all 0.2s" }}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Links grid — 2 cols on mobile, 3 cols on tablet+ */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "28px 20px", marginBottom: 36 }}
            className="footer-links-grid">
            <div>
              <div style={{ fontWeight: 700, color: "#fff", marginBottom: 12, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {lang === "mr" ? "सेवा" : "Services"}
              </div>
              {(lang === "mr"
                ? [["मार्केटप्लेस","/marketplace"],["ट्रॅक्टर बुकिंग","/tractor"],["मजूर मिळवा","/labour"],["पीक डॉक्टर","/crop-disease"],["बाजारभाव","/mandi"]]
                : [["Marketplace","/marketplace"],["Tractor Booking","/tractor"],["Hire Labour","/labour"],["Crop Doctor","/crop-disease"],["Mandi Prices","/mandi"]]
              ).map(([label, link]) => (
                <div key={label} style={{ marginBottom: 8 }}>
                  <a href={link} style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none" }}
                    onMouseOver={e => e.target.style.color = "#4ade80"}
                    onMouseOut={e => e.target.style.color = "#94a3b8"}>{label}</a>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontWeight: 700, color: "#fff", marginBottom: 12, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {lang === "mr" ? "नवीन वैशिष्ट्ये" : "New Features"}
              </div>
              {(lang === "mr"
                ? [["७/१२ उतारे","/land-records"],["व्हॉइस असिस्टंट","/voice"],["माती आरोग्य AI","/soil-health"],["शेतकरी मंच","/community"],["शासकीय योजना","/schemes"]]
                : [["7/12 Land Records","/land-records"],["Voice Assistant","/voice"],["Soil Health AI","/soil-health"],["Farmers Forum","/community"],["Govt Schemes","/schemes"]]
              ).map(([label, link]) => (
                <div key={label} style={{ marginBottom: 8 }}>
                  <a href={link} style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none" }}
                    onMouseOver={e => e.target.style.color = "#4ade80"}
                    onMouseOut={e => e.target.style.color = "#94a3b8"}>{label}</a>
                </div>
              ))}
            </div>

            <div>
              <div style={{ fontWeight: 700, color: "#fff", marginBottom: 12, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {lang === "mr" ? "खाते" : "Account"}
              </div>
              {(lang === "mr"
                ? [["लॉगिन","/login"],["नोंदणी","/register"],["डॅशबोर्ड","/dashboard"],["हवामान","/weather"],["संपर्क","mailto:support@shetkarimitra.in"]]
                : [["Login","/login"],["Register","/register"],["Dashboard","/dashboard"],["Weather","/weather"],["Support","mailto:support@shetkarimitra.in"]]
              ).map(([label, link]) => (
                <div key={label} style={{ marginBottom: 8 }}>
                  <a href={link} style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none" }}
                    onMouseOver={e => e.target.style.color = "#4ade80"}
                    onMouseOut={e => e.target.style.color = "#94a3b8"}>{label}</a>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: "1px solid #1e293b", paddingTop: 20, display: "flex", flexDirection: "column", gap: 10, alignItems: "center", textAlign: "center" }}>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              © 2026 {lang === "mr"
                ? "शेतकरी मित्र · भारतीय शेतकऱ्यांसाठी ❤️ ने बनविलेले · महाराष्ट्र, भारत"
                : "Shetkari Mitra · Built with ❤️ for Indian Farmers · Maharashtra, India"}
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#64748b", flexWrap: "wrap", justifyContent: "center" }}>
              <span>🌐 {lang === "mr" ? "५ भाषा" : "5 Languages"}</span>
              <span>📱 {lang === "mr" ? "PWA सज्ज" : "PWA Ready"}</span>
              <span>🔒 {lang === "mr" ? "सुरक्षित" : "Secure"}</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}