import { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { LanguageContext } from "../context/LanguageContext";

const CROPS = {
  en: ["All", "Soybean", "Cotton", "Tur Dal", "Wheat", "Onion", "Tomato", "Jowar", "Bajra", "Maize", "Sugarcane"],
  mr: ["सर्व", "सोयाबीन", "कापूस", "तूर डाळ", "गहू", "कांदा", "टोमॅटो", "ज्वारी", "बाजरी", "मका", "ऊस"]
};

const SAMPLE_PRICES = [
  { commodity: "Soybean", market: "Akola", state: "Maharashtra", price: "4820", unit: "Quintal" },
  { commodity: "Cotton", market: "Yavatmal", state: "Maharashtra", price: "6500", unit: "Quintal" },
  { commodity: "Tur Dal", market: "Latur", state: "Maharashtra", price: "7200", unit: "Quintal" },
  { commodity: "Wheat", market: "Pune", state: "Maharashtra", price: "2350", unit: "Quintal" },
  { commodity: "Onion", market: "Nashik", state: "Maharashtra", price: "1800", unit: "Quintal" },
  { commodity: "Tomato", market: "Kolhapur", state: "Maharashtra", price: "2200", unit: "Quintal" },
  { commodity: "Jowar", market: "Solapur", state: "Maharashtra", price: "2600", unit: "Quintal" },
  { commodity: "Bajra", market: "Aurangabad", state: "Maharashtra", price: "2400", unit: "Quintal" },
  { commodity: "Maize", market: "Amravati", state: "Maharashtra", price: "1950", unit: "Quintal" },
  { commodity: "Sugarcane", market: "Sangli", state: "Maharashtra", price: "3200", unit: "Quintal" },
];

export default function MandiPrices() {
  const [prices, setPrices] = useState(SAMPLE_PRICES);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString("en-IN"));
  const { lang } = useContext(LanguageContext);

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== "All") params.commodity = filter;
      const res = await api.get("/mandi", { params });
      setPrices(res.data.prices || SAMPLE_PRICES);
      setIsLive(res.data.live || false);
      setLastUpdated(new Date().toLocaleTimeString("en-IN"));
    } catch {
      setPrices(SAMPLE_PRICES);
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [filter]);

  const displayed = prices.filter(p =>
    (filter === "All" || p.commodity === filter) &&
    (p.commodity.toLowerCase().includes(search.toLowerCase()) ||
     p.market.toLowerCase().includes(search.toLowerCase()))
  );

  const priceColor = (price) => {
    const p = parseInt(price);
    if (p > 5000) return "text-green-600 font-bold";
    if (p > 2500) return "text-blue-600 font-bold";
    return "text-gray-800 font-bold";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">📊 {lang === "mr" ? "बाजारभाव" : "Mandi Prices"}</h1>
            <p className="text-gray-500">{lang === "mr" ? "महाराष्ट्रातील बाजार समित्यांमधील थेट पिकांचे दर" : "Live crop market prices from Maharashtra mandis"}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className={`w-2 h-2 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-yellow-500"}`}></span>
              {isLive ? (lang === "mr" ? "थेट" : "Live") : (lang === "mr" ? "नमुना" : "Sample")} · {lang === "mr" ? "अपडेट:" : "Updated"} {lastUpdated}
            </div>
            <button
              onClick={fetchPrices}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading ? (lang === "mr" ? "⏳ लोड होत आहे..." : "⏳ Loading...") : (lang === "mr" ? "🔄 रिफ्रेश" : "🔄 Refresh")}
            </button>
          </div>
        </div>

        {/* {!isLive && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 text-sm text-yellow-700">
            ⚠️ Showing sample prices. Configure <code>DATA_GOV_API_KEY</code> in server <code>.env</code> for live data from data.gov.in.
          </div>
        )} */}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder={lang === "mr" ? "पीक किंवा बाजार शोधा..." : "Search crop or market..."}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 w-64"
          />
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {CROPS.en.map((c, i) => (
            <button key={c} onClick={() => setFilter(c)}
              className={"px-4 py-2 rounded-full text-sm font-medium transition-colors " + (filter === c ? "bg-green-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-green-400")}>
              {lang === "mr" ? CROPS.mr[i] : c}
            </button>
          ))}
        </div>

        {/* Price Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-green-50 border-b border-green-100">
              <tr>
                <th className="text-left px-6 py-3 text-green-800 font-semibold">{lang === "mr" ? "पीक" : "Crop"}</th>
                <th className="text-left px-6 py-3 text-green-800 font-semibold">{lang === "mr" ? "बाजार" : "Market"}</th>
                <th className="text-left px-6 py-3 text-green-800 font-semibold">{lang === "mr" ? "राज्य" : "State"}</th>
                <th className="text-right px-6 py-3 text-green-800 font-semibold">{lang === "mr" ? "किंमत (₹/क्विंटल)" : "Price (₹/Quintal)"}</th>
                {displayed[0]?.minPrice && <th className="text-right px-6 py-3 text-green-800 font-semibold">Min</th>}
                {displayed[0]?.maxPrice && <th className="text-right px-6 py-3 text-green-800 font-semibold">Max</th>}
              </tr>
            </thead>
            <tbody>
              {displayed.map((p, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full mr-2">🌾</span>
                    <span className="font-medium text-gray-800">{lang === "mr" ? CROPS.mr[CROPS.en.indexOf(p.commodity)] || p.commodity : p.commodity}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{p.market}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{lang === "mr" && p.state === "Maharashtra" ? "महाराष्ट्र" : p.state}</td>
                  <td className={`px-6 py-4 text-right text-lg ${priceColor(p.price)}`}>
                    ₹{parseInt(p.price).toLocaleString("en-IN")}
                  </td>
                  {p.minPrice && <td className="px-6 py-4 text-right text-gray-500 text-xs">₹{parseInt(p.minPrice).toLocaleString("en-IN")}</td>}
                  {p.maxPrice && <td className="px-6 py-4 text-right text-gray-500 text-xs">₹{parseInt(p.maxPrice).toLocaleString("en-IN")}</td>}
                </tr>
              ))}
              {displayed.length === 0 && (
                <tr><td colSpan={5} className="text-center text-gray-400 py-12">{lang === "mr" ? "कोणतेही दर आढळले नाहीत." : "No prices found."}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          {lang === "mr" ? "स्रोत: data.gov.in / ऍगमार्कनेट · दर केवळ सूचक आहेत · विक्रीपूर्वी स्थानिक बाजार समितीत पडताळणी करा" : "Source: data.gov.in / Agmarknet · Prices indicative only · Verify at your local mandi before selling"}
        </div>
      </div>
    </div>
  );
}
