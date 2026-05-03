import { useState } from "react";
import Navbar from "../components/Navbar";

const CROP_PROFILES = {
  "Wheat":{ideal:{N:[80,120],P:[40,60],K:[30,50],pH:[6.0,7.5]},recs:["Apply Urea 50kg/acre before sowing","Top-dress 30kg Urea at tillering stage","Use DAP 25kg/acre + MOP 20kg/acre","Micronutrient: Zinc Sulphate 5kg/acre if Zn deficient"]},
  "Cotton":{ideal:{N:[120,160],P:[40,60],K:[60,80],pH:[6.0,7.5]},recs:["Apply 2 bags DAP + 1 bag MOP per acre","Top-dress 25kg Urea at boll formation","Use Boron spray (0.5%) at flower initiation","Organic: 2-3 ton FYM before last ploughing"]},
  "Soybean":{ideal:{N:[20,40],P:[60,80],K:[40,60],pH:[6.0,7.0]},recs:["Rhizobium seed treatment before sowing","Apply 20kg DAP + 20kg MOP/acre","No Urea needed (soybean fixes its own N)","Spray Ferrous Sulphate 0.5% if yellowing appears"]},
  "Rice":{ideal:{N:[100,140],P:[30,50],K:[30,50],pH:[5.5,7.0]},recs:["Basal dose: 25kg DAP + 20kg MOP/acre","Split Urea: 3 doses (25+25+25kg)","Zinc Sulphate 10kg/acre before transplanting","Green manure (Dhaincha) if possible before rice"]},
  "Sugarcane":{ideal:{N:[250,300],P:[60,80],K:[100,120],pH:[6.0,7.5]},recs:["Apply FYM 10 ton + 3 bags DAP/acre","Urea: 4 split doses at 30,60,90,120 days","Potash: 2 bags MOP at ratoon stage","Trash mulching to conserve moisture + add K"]},
  "Chana (Chickpea)":{ideal:{N:[20,30],P:[40,60],K:[20,40],pH:[6.0,8.0]},recs:["Rhizobium seed treatment essential","Basal: 2q SSP + 1q MOP per hectare","Avoid excess Nitrogen","Sulphur: 20kg/acre improves protein in grain"]},
  "Turmeric":{ideal:{N:[140,180],P:[50,70],K:[120,160],pH:[5.5,7.0]},recs:["Apply 10 ton FYM + neem cake 250kg/acre","DAP 50kg + MOP 70kg at planting","Top-dress: Urea 50kg at 60 days","Spray micronutrient mix at 90 days"]},
};

const COLORS = { N: "#3b82f6", P: "#f59e0b", K: "#8b5cf6", pH: "#16a34a" };

function Gauge({ label, value, min, max, unit = "", color = "#16a34a" }) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const status = value < min ? "Low" : value > max ? "High" : "Optimal";
  const statusColor = status === "Optimal" ? "#16a34a" : status === "Low" ? "#3b82f6" : "#ef4444";
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", border: "1px solid #e5e7eb" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, padding: "2px 10px", borderRadius: 20, background: `${statusColor}20`, color: statusColor }}>{status}</span>
      </div>
      <div style={{ height: 8, background: "#f3f4f6", borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 8, transition: "width 0.6s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9ca3af" }}>
        <span>{min}{unit}</span>
        <span style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>{value}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

export default function SoilHealth() {
  const [form, setForm] = useState({ N: "", P: "", K: "", pH: "", organic: "", crop: "Cotton", moisture: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const profile = CROP_PROFILES[form.crop];
      const N = +form.N, P = +form.P, K = +form.K, pH = +form.pH;
      const issues = [];
      if (N < profile.ideal.N[0]) issues.push({ label: "Nitrogen Low", fix: "Apply Urea 30-40kg/acre", color: "#3b82f6", icon: "⬆️" });
      else if (N > profile.ideal.N[1]) issues.push({ label: "Nitrogen High", fix: "Reduce Urea, add microbes to balance", color: "#ef4444", icon: "⬇️" });
      if (P < profile.ideal.P[0]) issues.push({ label: "Phosphorus Low", fix: "Apply DAP or SSP 25kg/acre", color: "#f59e0b", icon: "⬆️" });
      if (K < profile.ideal.K[0]) issues.push({ label: "Potassium Low", fix: "Apply MOP 20kg/acre", color: "#8b5cf6", icon: "⬆️" });
      if (pH < profile.ideal.pH[0]) issues.push({ label: "Soil Too Acidic", fix: "Apply Agricultural Lime 200kg/acre", color: "#ef4444", icon: "🧪" });
      if (pH > profile.ideal.pH[1]) issues.push({ label: "Soil Too Alkaline", fix: "Apply Gypsum 300kg/acre + organic matter", color: "#f59e0b", icon: "🧪" });
      const score = Math.round(65 + (issues.length === 0 ? 30 : issues.length === 1 ? 15 : issues.length === 2 ? 5 : -5));
      setResult({ issues, recs: profile.recs, score: Math.min(score, 100), profile });
      setLoading(false);
    }, 1400);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>🌱</div>
          <h1 style={{ fontSize: 34, fontWeight: 900, color: "#111827", marginBottom: 8 }}>Soil Health Tracker & AI Fertilizer Advisor</h1>
          <p style={{ fontSize: 16, color: "#6b7280", maxWidth: 560, margin: "0 auto" }}>Enter your soil test results (from Soil Health Card) → AI instantly recommends fertilizers for your crop</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Form */}
          <div style={{ background: "#fff", borderRadius: 18, padding: 28, boxShadow: "0 2px 16px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" }}>
            <h2 style={{ fontWeight: 800, fontSize: 17, color: "#111827", marginBottom: 20 }}>📋 Enter Soil Test Values</h2>
            <form onSubmit={analyze} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Select Crop</label>
                <select value={form.crop} onChange={e => setForm({ ...form, crop: e.target.value })}
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 14px", fontSize: 14, background: "#fff", boxSizing: "border-box" }}>
                  {Object.keys(CROP_PROFILES).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              {[
                { key: "N", label: "Nitrogen (N)", unit: "kg/ha", placeholder: "e.g. 85", color: "#3b82f6" },
                { key: "P", label: "Phosphorus (P)", unit: "kg/ha", placeholder: "e.g. 45", color: "#f59e0b" },
                { key: "K", label: "Potassium (K)", unit: "kg/ha", placeholder: "e.g. 55", color: "#8b5cf6" },
                { key: "pH", label: "Soil pH", unit: "", placeholder: "e.g. 7.2", color: "#16a34a" },
                { key: "organic", label: "Organic Carbon (%)", unit: "%", placeholder: "e.g. 0.45", color: "#f59e0b" },
                { key: "moisture", label: "Field Moisture (%)", unit: "%", placeholder: "e.g. 65", color: "#3b82f6" },
              ].map(({ key, label, placeholder, color }) => (
                <div key={key}>
                  <label style={{ fontSize: 13, fontWeight: 600, color, display: "block", marginBottom: 6 }}>{label}</label>
                  <input type="number" step="0.1" placeholder={placeholder} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                    style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 14px", fontSize: 14, boxSizing: "border-box", outline: "none" }} />
                </div>
              ))}
              <button type="submit" disabled={loading || !form.N || !form.P || !form.K || !form.pH}
                style={{ background: (!form.N || !form.P || !form.K || !form.pH) ? "#9ca3af" : "linear-gradient(135deg,#16a34a,#15803d)", color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 4 }}>
                {loading ? "⏳ Analyzing Soil..." : "🤖 Analyze & Get Recommendations"}
              </button>
            </form>
          </div>

          {/* Results */}
          <div>
            {!result ? (
              <div style={{ background: "#fff", borderRadius: 18, padding: 36, textAlign: "center", border: "1px solid #e5e7eb", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🧪</div>
                <h3 style={{ fontWeight: 700, fontSize: 18, color: "#111827" }}>Enter Your N-P-K Values</h3>
                <p style={{ color: "#6b7280", fontSize: 14, maxWidth: 280, marginTop: 10 }}>Get personalized fertilizer recommendations based on your soil test results and selected crop.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Score */}
                <div style={{ background: "#fff", borderRadius: 18, padding: 24, border: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ position: "relative", width: 90, height: 90, flexShrink: 0 }}>
                    <svg width="90" height="90" viewBox="0 0 90 90">
                      <circle cx="45" cy="45" r="36" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                      <circle cx="45" cy="45" r="36" fill="none"
                        stroke={result.score > 80 ? "#16a34a" : result.score > 60 ? "#f59e0b" : "#ef4444"}
                        strokeWidth="10" strokeDasharray={`${(result.score/100)*226} 226`}
                        strokeLinecap="round" transform="rotate(-90 45 45)" />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ fontSize: 16, fontWeight: 900, color: "#111827" }}>{result.score}%</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>Soil Health Score</div>
                    <div style={{ fontSize: 13, color: result.score > 80 ? "#16a34a" : "#f59e0b", fontWeight: 600, marginTop: 4 }}>
                      {result.score > 80 ? "✅ Excellent" : result.score > 60 ? "⚠️ Good, needs attention" : "❗ Poor — immediate action needed"}
                    </div>
                    <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>For {form.crop}</div>
                  </div>
                </div>

                {/* Nutrient Gauges */}
                <div style={{ background: "#fff", borderRadius: 18, padding: 20, border: "1px solid #e5e7eb" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 14 }}>Nutrient Levels</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <Gauge label="Nitrogen (N)" value={+form.N} min={result.profile.ideal.N[0]} max={result.profile.ideal.N[1]} unit=" kg/ha" color="#3b82f6" />
                    <Gauge label="Phosphorus (P)" value={+form.P} min={result.profile.ideal.P[0]} max={result.profile.ideal.P[1]} unit=" kg/ha" color="#f59e0b" />
                    <Gauge label="Potassium (K)" value={+form.K} min={result.profile.ideal.K[0]} max={result.profile.ideal.K[1]} unit=" kg/ha" color="#8b5cf6" />
                    <Gauge label="Soil pH" value={+form.pH} min={result.profile.ideal.pH[0]} max={result.profile.ideal.pH[1]} color="#16a34a" />
                  </div>
                </div>

                {/* Issues */}
                {result.issues.length > 0 && (
                  <div style={{ background: "#fff", borderRadius: 18, padding: 20, border: "1px solid #fecaca" }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#b91c1c", marginBottom: 12 }}>⚠️ Issues Detected</div>
                    {result.issues.map((issue, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 12px", background: "#fef2f2", borderRadius: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 18 }}>{issue.icon}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: issue.color }}>{issue.label}</div>
                          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Fix: {issue.fix}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* AI Recommendations */}
                <div style={{ background: "#f0fdf4", borderRadius: 18, padding: 20, border: "1px solid #bbf7d0" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#15803d", marginBottom: 12 }}>🌱 AI Fertilizer Recommendations for {form.crop}</div>
                  {result.recs.map((rec, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                      <span style={{ color: "#16a34a", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{i + 1}.</span>
                      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{rec}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
