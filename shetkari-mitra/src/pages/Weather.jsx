import Navbar from "../components/Navbar";
import { useEffect, useState, useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

const API_KEY = "9e55435e4cd6c95ab57d8f38d43553d3";

const WEATHER_ICON_MAP = {
  Clear: "☀️",
  Clouds: "⛅",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Mist: "🌫️",
  Haze: "🌫️",
  Fog: "🌫️",
};

const WEATHER_DESC_MR = {
  Clear: "स्वच्छ ऊन",
  Clouds: "ढगाळ",
  Rain: "पाऊस",
  Drizzle: "रिमझिम पाऊस",
  Thunderstorm: "वादळी पाऊस",
  Snow: "बर्फ",
  Mist: "धुके",
  Haze: "धुके",
  Fog: "दाट धुके",
};

const DAYS_MR = ["रवि", "सोम", "मंगळ", "बुध", "गुरु", "शुक्र", "शनि"];
const DAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTHS_MR = ["जाने", "फेब्रु", "मार्च", "एप्रि", "मे", "जून", "जुलै", "ऑग", "सप्टें", "ऑक्टो", "नोव्हें", "डिसें"];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const CROP_TIPS_EN = [
  "There is a chance of light rain in the coming days. Make sure to cover your harvested crops and stay updated.",
  "High humidity levels detected. Watch out for fungal diseases in your crops.",
  "Wind speeds are moderate. Avoid spraying pesticides today.",
  "Clear skies ahead — a great time for harvesting or drying grains.",
  "Temperature is optimal for Kharif sowing. Prepare your fields.",
];

const CROP_TIPS_MR = [
  "येत्या काही दिवसांत हलक्या पावसाची शक्यता आहे. कापणी केलेल्या पिकांना झाकण ठेवा आणि अद्ययावत राहा.",
  "आर्द्रता जास्त आहे. पिकांमध्ये बुरशीजन्य रोगांकडे लक्ष द्या.",
  "वाऱ्याचा वेग मध्यम आहे. आज कीटकनाशके फवारणे टाळा.",
  "स्वच्छ आकाश आहे — कापणी किंवा धान्य वाळवण्यासाठी उत्तम वेळ.",
  "तापमान खरीप पेरणीसाठी योग्य आहे. शेत तयार करा.",
];

export default function Weather() {
  const { lang } = useContext(LanguageContext);
  const [city, setCity] = useState("Pune");
  const [input, setInput] = useState("Pune");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const t = (en, mr) => (lang === "mr" ? mr : en);

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}`
      );
      const result = await res.json();

      if (result.cod !== "200") {
        setError(t("City not found. Please try another city ❌", "शहर सापडले नाही. कृपया दुसरे शहर वापरा ❌"));
        setData(null);
        return;
      }
      setData(result);
    } catch {
      setError(t("Something went wrong. Please check your connection.", "काहीतरी चुकीचे झाले. कृपया आपले कनेक्शन तपासा."));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!input.trim()) return;
    setCity(input.trim());
  };

  const now = data ? data.list[0] : null;
  const today = new Date();
  const dayName = lang === "mr" ? DAYS_MR[today.getDay()] : DAYS_EN[today.getDay()];
  const dateStr = lang === "mr"
    ? `${today.getDate()} ${MONTHS_MR[today.getMonth()]} ${today.getFullYear()}`
    : `${today.getDate()} ${MONTHS_EN[today.getMonth()]} ${today.getFullYear()}`;

  const weatherIcon = now ? (WEATHER_ICON_MAP[now.weather[0].main] || "🌤️") : "🌤️";
  const weatherDesc = now
    ? (lang === "mr" ? (WEATHER_DESC_MR[now.weather[0].main] || now.weather[0].description) : now.weather[0].main)
    : "";

  // Pick one random tip
  const tipIndex = today.getDate() % CROP_TIPS_EN.length;
  const cropTip = lang === "mr" ? CROP_TIPS_MR[tipIndex] : CROP_TIPS_EN[tipIndex];

  // Forecast: one item per day (every 8 indices = ~24h)
  const forecastDays = data
    ? data.list.filter((_, i) => i % 8 === 0).slice(0, 7)
    : [];

  const uvIndex = 6; // static for demo
  const visibility = now ? ((now.visibility || 10000) / 1000).toFixed(0) : 10;
  const rainChance = now && now.pop ? Math.round(now.pop * 100) : 20;
  const windDir = "South West";

  const cardStyle = {
    background: "#fff",
    borderRadius: 16,
    padding: "20px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
    border: "1px solid #e5e7eb",
  };

  // Responsive helpers — detect mobile via window width
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>

        {/* ── PAGE HEADER ── */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
            🌤️ {t("Weather Information", "हवामान माहिती")}
          </h1>
          <p style={{ fontSize: 13, color: "#6b7280" }}>
            🌱 {t("Get real-time weather updates for better farming", "चांगल्या शेतीसाठी थेट हवामान अपडेट मिळवा")}
          </p>
        </div>

        {/* ── SEARCH BAR ── */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24, width: "100%" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 15 }}>📍</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={t("Enter city (e.g. Pune, Nashik)", "शहर टाका (उदा. पुणे, नाशिक)")}
              style={{
                width: "100%", padding: "12px 14px 12px 38px",
                border: "1px solid #d1d5db", borderRadius: 12, fontSize: 14,
                background: "#fff", outline: "none", boxSizing: "border-box",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            />
          </div>
          <button
            onClick={handleSearch}
            style={{
              background: "#16a34a", color: "#fff", border: "none",
              borderRadius: 12, padding: "12px 20px", fontWeight: 700,
              fontSize: 14, cursor: "pointer", whiteSpace: "nowrap",
              boxShadow: "0 2px 8px rgba(22,163,74,0.3)", flexShrink: 0,
            }}
          >
            {t("Search", "शोधा")}
          </button>
        </div>

        {/* ── ERROR ── */}
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 12, padding: "12px 16px", color: "#dc2626", marginBottom: 20, fontSize: 14 }}>
            ⚠️ {error}
          </div>
        )}

        {/* ── LOADING ── */}
        {loading && (
          <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
            <p>{t("Fetching weather data...", "हवामान डेटा मिळवत आहे...")}</p>
          </div>
        )}

        {/* ── MAIN CONTENT ── */}
        {data && !loading && (
          <>
            {/* ── BIG WEATHER CARD — full width on mobile ── */}
            <div style={{
              background: "linear-gradient(135deg, #1a5fa8 0%, #2563eb 50%, #1e40af 100%)",
              borderRadius: 18, padding: "22px 20px", color: "#fff",
              boxShadow: "0 8px 32px rgba(37,99,235,0.3)",
              position: "relative", overflow: "hidden",
              marginBottom: 16,
            }}>
              <div style={{
                position: "absolute", inset: 0, opacity: 0.1,
                backgroundImage: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=60')",
                backgroundSize: "cover", backgroundPosition: "center", borderRadius: 18,
              }} />
              <div style={{ position: "relative" }}>
                {/* City + date row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>
                      {data.city.name}, {data.city.country === "IN" ? t("Maharashtra", "महाराष्ट्र") : data.city.country}
                    </h2>
                    <p style={{ margin: "3px 0 0", opacity: 0.75, fontSize: 12 }}>{t("India", "भारत")}</p>
                  </div>
                  <div style={{ textAlign: "right", opacity: 0.85, fontSize: 12 }}>
                    <div>{dayName}, {dateStr}</div>
                    <div style={{ marginTop: 2 }}>
                      {today.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>

                {/* Temp + quick stats */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 56 }}>{weatherIcon}</span>
                    <div>
                      <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1 }}>
                        {Math.round(now.main.temp)}°C
                      </div>
                      <div style={{ fontSize: 14, opacity: 0.9, marginTop: 4 }}>{weatherDesc}</div>
                      <div style={{ display: "flex", gap: 14, fontSize: 12, opacity: 0.8, marginTop: 6 }}>
                        <span>{t("Min:", "किमान:")} {Math.round(now.main.temp_min)}°C</span>
                        <span>{t("Max:", "कमाल:")} {Math.round(now.main.temp_max)}°C</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick stats — hidden on very small screens, shown here on desktop */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 150 }} className="weather-quick-stats">
                    {[
                      { icon: "🌡️", label: t("Feels like", "असे वाटते"), value: `${Math.round(now.main.feels_like)}°C` },
                      { icon: "💧", label: t("Humidity", "आर्द्रता"), value: `${now.main.humidity}%` },
                      { icon: "💨", label: t("Wind", "वारा"), value: `${Math.round(now.wind.speed * 3.6)} km/h` },
                      { icon: "👁️", label: t("Visibility", "दृश्यमानता"), value: `${visibility} km` },
                    ].map((s, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                        <span style={{ opacity: 0.8 }}>{s.icon} {s.label}</span>
                        <span style={{ fontWeight: 700, marginLeft: 8 }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── STATS GRID — 2x3 on mobile, 3x2 on tablet, 6-col on desktop ── */}
            <div className="weather-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 16 }}>
              {[
                {
                  icon: "💧", label: t("Humidity", "आर्द्रता"), value: `${now.main.humidity}%`,
                  sub: now.main.humidity > 70 ? t("High", "जास्त") : now.main.humidity > 40 ? t("Moderate", "मध्यम") : t("Low", "कमी"),
                  color: "#2563eb", bg: "#eff6ff",
                },
                {
                  icon: "💨", label: t("Wind Speed", "वाऱ्याचा वेग"), value: `${Math.round(now.wind.speed * 3.6)} km/h`,
                  sub: t("South West", "दक्षिण-पश्चिम"),
                  color: "#0891b2", bg: "#ecfeff",
                },
                {
                  icon: "🌧️", label: t("Rain Chance", "पावसाची शक्यता"), value: `${rainChance}%`,
                  sub: rainChance > 60 ? t("High", "जास्त") : rainChance > 30 ? t("Moderate", "मध्यम") : t("Low", "कमी"),
                  color: "#7c3aed", bg: "#f5f3ff",
                },
                {
                  icon: "☀️", label: t("UV Index", "UV निर्देशांक"), value: `${uvIndex}`,
                  sub: uvIndex >= 8 ? t("Very High", "खूप जास्त") : uvIndex >= 6 ? t("High", "जास्त") : t("Moderate", "मध्यम"),
                  color: "#b45309", bg: "#fffbeb",
                },
                {
                  icon: "🌅", label: t("Sunrise", "सूर्योदय"), value: "5:56 AM",
                  sub: "", color: "#16a34a", bg: "#f0fdf4",
                },
                {
                  icon: "🌇", label: t("Sunset", "सूर्यास्त"), value: "7:05 PM",
                  sub: "", color: "#ea580c", bg: "#fff7ed",
                },
              ].map((s, i) => (
                <div key={i} style={{
                  ...cardStyle, padding: "14px 16px",
                  background: s.bg, border: "none",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 18 }}>{s.icon}</span>
                    <span style={{ fontSize: 11, color: "#6b7280", fontWeight: 500 }}>{s.label}</span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                  {s.sub && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{s.sub}</div>}
                </div>
              ))}
            </div>

            {/* ── 7-DAY FORECAST ── */}
            <div style={{ ...cardStyle, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: 0 }}>
                  📅 {t("7 Days Weather Forecast", "७ दिवसांचा हवामान अंदाज")}
                </h2>
                <button style={{ background: "none", border: "none", color: "#16a34a", fontWeight: 600, fontSize: 13, cursor: "pointer", padding: 0 }}>
                  {t("View Full Forecast →", "संपूर्ण अंदाज पहा →")}
                </button>
              </div>

              {/* Scrollable row on mobile */}
              <div style={{ overflowX: "auto", paddingBottom: 4 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(80px, 1fr))", gap: 8, minWidth: 480 }}>
                  {forecastDays.map((item, i) => {
                    const d = new Date(item.dt_txt);
                    const dayLabel = i === 0
                      ? t("Today", "आज")
                      : (lang === "mr" ? DAYS_MR[d.getDay()] : DAYS_EN[d.getDay()]);
                    const dateLabel = `${d.getDate()} ${lang === "mr" ? MONTHS_MR[d.getMonth()] : MONTHS_EN[d.getMonth()]}`;
                    const icon = WEATHER_ICON_MAP[item.weather[0].main] || "🌤️";
                    const rainPct = item.pop ? Math.round(item.pop * 100) : 0;

                    return (
                      <div key={i} style={{
                        textAlign: "center", padding: "12px 6px",
                        background: i === 0 ? "#f0fdf4" : "#f9fafb",
                        borderRadius: 12,
                        border: i === 0 ? "1px solid #bbf7d0" : "1px solid #f3f4f6",
                      }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: i === 0 ? "#15803d" : "#374151" }}>{dayLabel}</div>
                        <div style={{ fontSize: 10, color: "#9ca3af", marginBottom: 6 }}>{dateLabel}</div>
                        <div style={{ fontSize: 26, marginBottom: 6 }}>{icon}</div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>{Math.round(item.main.temp_max)}°C</div>
                        <div style={{ fontSize: 10, color: "#9ca3af" }}>{Math.round(item.main.temp_min)}°C</div>
                        <div style={{ fontSize: 10, color: "#2563eb", marginTop: 4 }}>💧 {rainPct}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── CROP TIP BANNER ── */}
            <div style={{
              ...cardStyle,
              background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
              border: "1px solid #bbf7d0",
              display: "flex", flexDirection: "column", gap: 14,
            }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: "#16a34a",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, flexShrink: 0,
                }}>🌱</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#14532d", marginBottom: 4 }}>
                    {t("Weather Tips for Farmers", "शेतकऱ्यांसाठी हवामान टिपा")}
                  </div>
                  <p style={{ fontSize: 13, color: "#166534", margin: 0, lineHeight: 1.6 }}>{cropTip}</p>
                </div>
              </div>
              <button style={{
                background: "#16a34a", color: "#fff", border: "none",
                borderRadius: 10, padding: "10px 20px", fontWeight: 700, fontSize: 13,
                cursor: "pointer", width: "100%",
                boxShadow: "0 2px 8px rgba(22,163,74,0.3)",
              }}>
                {t("View All Tips →", "सर्व टिपा पहा →")}
              </button>
            </div>
          </>
        )}

        {/* ── EMPTY STATE ── */}
        {!data && !loading && !error && (
          <div style={{ textAlign: "center", padding: 60, color: "#6b7280" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🌤️</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
              {t("Search for a city to see weather", "हवामान पाहण्यासाठी शहर शोधा")}
            </h2>
            <p style={{ fontSize: 14 }}>
              {t("Enter a city name above and press Search", "वरती शहराचे नाव टाका आणि शोधा दाबा")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}