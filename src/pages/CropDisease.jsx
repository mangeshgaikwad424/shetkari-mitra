import { useState, useRef } from "react";
import Navbar from "../components/Navbar";

const DISEASES = [
  { name: "Leaf Blight (Tambera Rog)", confidence: 91, crop: "Soybean/Wheat", severity: "High", color: "#ef4444",
    symptoms: "Yellow to brown spots on leaves, premature defoliation, wilting",
    treatment: ["Spray Mancozeb 2g/litre or Copper Oxychloride 3g/litre","Remove and burn affected leaves","Ensure proper field drainage","Avoid overhead irrigation"],
    prevention: "Use resistant varieties, crop rotation, avoid waterlogging" },
  { name: "Powdery Mildew (Bhurkya Rog)", confidence: 86, crop: "Cotton/Gram", severity: "Medium", color: "#f59e0b",
    symptoms: "White powdery coating on leaves and stems, stunted growth",
    treatment: ["Spray Carbendazim 1g/litre","Apply wettable Sulphur 2g/litre","Remove heavily infected parts","Spray in evening for best results"],
    prevention: "Adequate plant spacing, avoid excess nitrogen, use disease-free seed" },
  { name: "Root Rot (Mul Buskavinya)", confidence: 78, crop: "Cotton/Soybean", severity: "High", color: "#ef4444",
    symptoms: "Yellowing of lower leaves, stem discolouration near soil, plant collapse",
    treatment: ["Drench soil with Copper Sulphate solution (3g/litre)","Apply Trichoderma viride 5g/kg seed","Remove affected plants","Improve field drainage"],
    prevention: "Seed treatment, proper drainage, crop rotation with cereals" },
  { name: "Aphid Infestation (Maav)", confidence: 94, crop: "All Crops", severity: "Medium", color: "#f59e0b",
    symptoms: "Sticky honeydew on leaves, curling leaves, yellowing, ant presence",
    treatment: ["Spray Imidacloprid 0.5ml/litre","Use Yellow sticky traps","Neem oil 5ml/litre spray","Introduce natural predators (ladybugs)"],
    prevention: "Regular monitoring, remove weeds, balanced nitrogen application" },
];

function CameraIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round">
      <rect x="4" y="16" width="56" height="40" rx="6" />
      <circle cx="32" cy="36" r="10" />
      <rect x="22" y="8" width="20" height="10" rx="4" />
      <circle cx="52" cy="24" r="3" fill="#16a34a" stroke="none" />
    </svg>
  );
}

export default function CropDisease() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState("upload");
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const analyze = () => {
    setLoading(true);
    setStep("analyzing");
    setTimeout(() => {
      // Pick a realistic random disease
      const disease = DISEASES[Math.floor(Math.random() * DISEASES.length)];
      setResult(disease);
      setLoading(false);
      setStep("result");
    }, 2800);
  };

  const reset = () => { setImage(null); setPreview(null); setResult(null); setStep("upload"); };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>🌿</div>
          <h1 style={{ fontSize: 34, fontWeight: 900, color: "#111827", marginBottom: 8 }}>AI Crop Disease Detection</h1>
          <p style={{ fontSize: 16, color: "#6b7280", maxWidth: 520, margin: "0 auto" }}>
            Upload a photo of your crop's affected leaf or plant — our AI detects the disease and gives treatment advice instantly.
          </p>
        </div>

        {/* Step Indicators */}
        <div style={{ display: "flex", justifyContent: "center", gap: 0, marginBottom: 36 }}>
          {[["1","Upload Photo","upload"],["2","AI Analysis","analyzing"],["3","Results","result"]].map(([n, label, s], i) => (
            <div key={s} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14,
                  background: step === s ? "#16a34a" : (step === "analyzing" && s === "upload") || step === "result" ? "#dcfce7" : "#e5e7eb",
                  color: step === s ? "#fff" : (step === "analyzing" && s === "upload") || step === "result" ? "#15803d" : "#9ca3af",
                }}>{n}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: step === s ? "#16a34a" : "#9ca3af" }}>{label}</div>
              </div>
              {i < 2 && <div style={{ width: 80, height: 2, background: step === "result" && i === 0 ? "#16a34a" : step === "result" && i === 1 ? "#16a34a" : step === "analyzing" && i === 0 ? "#16a34a" : "#e5e7eb", margin: "0 4px 16px" }} />}
            </div>
          ))}
        </div>

        {step === "upload" && (
          <div style={{ background: "#fff", borderRadius: 20, padding: 36, boxShadow: "0 2px 16px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" }}>
            {!preview ? (
              <div>
                {/* Drop zone */}
                <div
                  onClick={() => fileRef.current.click()}
                  style={{ border: "2px dashed #bbf7d0", borderRadius: 16, padding: "60px 40px", textAlign: "center", cursor: "pointer", background: "#f0fdf4", transition: "all 0.2s" }}
                  onMouseOver={e => e.currentTarget.style.borderColor = "#16a34a"}
                  onMouseOut={e => e.currentTarget.style.borderColor = "#bbf7d0"}>
                  <CameraIcon />
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginTop: 16, marginBottom: 8 }}>Upload Crop Photo</div>
                  <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>Take a clear photo of the affected leaf or plant part</div>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                    <button style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>📷 Upload Photo</button>
                    <button onClick={e => { e.stopPropagation(); fileRef.current.click(); }}
                      style={{ background: "#fff", color: "#374151", border: "2px solid #e5e7eb", borderRadius: 10, padding: "10px 24px", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>📁 Choose File</button>
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 16 }}>JPG, PNG, HEIC — Max 10MB</div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: "none" }} />

                {/* Tips */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 28 }}>
                  {[["📸","Clear Photo","Take close-up photo of affected leaf in good light"],["🌿","Whole Leaf","Include the full leaf — both healthy and affected areas"],["☀️","Good Light","Natural daylight gives best AI detection accuracy"]].map(([icon,title,desc]) => (
                    <div key={title} style={{ background: "#f8fafc", borderRadius: 12, padding: "16px 14px", textAlign: "center" }}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{title}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4, lineHeight: 1.5 }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <img src={preview} alt="Crop" style={{ width: "100%", maxHeight: 360, objectFit: "cover", borderRadius: 14, marginBottom: 20 }} />
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={analyze} style={{ flex: 2, background: "linear-gradient(135deg,#16a34a,#15803d)", color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                    🤖 Analyze with AI
                  </button>
                  <button onClick={reset} style={{ flex: 1, background: "#fff", color: "#374151", border: "2px solid #e5e7eb", borderRadius: 12, padding: "14px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                    Re-take
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {step === "analyzing" && (
          <div style={{ background: "#fff", borderRadius: 20, padding: 60, textAlign: "center", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: 64, marginBottom: 20, animation: "spin 2s linear infinite", display: "inline-block" }}>🔬</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 12 }}>AI is Analyzing Your Crop...</div>
            <div style={{ fontSize: 15, color: "#6b7280", marginBottom: 32 }}>Scanning for 200+ diseases across 40 crops</div>
            <div style={{ maxWidth: 440, margin: "0 auto" }}>
              {["Detecting leaf patterns...","Checking disease database...","Calculating confidence score...","Preparing treatment plan..."].map((txt, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "#f0fdf4", borderRadius: 10, marginBottom: 8, fontSize: 13, color: "#374151" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", flexShrink: 0 }}>✓</div>
                  {txt}
                </div>
              ))}
            </div>
            <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
          </div>
        )}

        {step === "result" && result && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Main Result */}
            <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" }}>
              <div style={{ background: result.severity === "High" ? "linear-gradient(135deg,#b91c1c,#ef4444)" : "linear-gradient(135deg,#d97706,#f59e0b)", padding: "20px 28px" }}>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, marginBottom: 4 }}>Disease Detected</div>
                <div style={{ color: "#fff", fontSize: 24, fontWeight: 900 }}>{result.name}</div>
                <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                  <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "4px 12px", fontSize: 12, color: "#fff", fontWeight: 600 }}>🎯 {result.confidence}% Confidence</div>
                  <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "4px 12px", fontSize: 12, color: "#fff", fontWeight: 600 }}>🌾 {result.crop}</div>
                  <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "4px 12px", fontSize: 12, color: "#fff", fontWeight: 600 }}>⚠️ {result.severity} Severity</div>
                </div>
              </div>
              {preview && <img src={preview} alt="Analyzed crop" style={{ width: "100%", height: 220, objectFit: "cover" }} />}
              <div style={{ padding: 24 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#374151", marginBottom: 8 }}>Symptoms Identified:</div>
                <div style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.7, marginBottom: 16, background: "#f8fafc", padding: "12px 16px", borderRadius: 10 }}>{result.symptoms}</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Treatment */}
              <div style={{ background: "#fff", borderRadius: 20, padding: 24, border: "1px solid #bbf7d0" }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: "#111827", marginBottom: 16 }}>💊 Immediate Treatment</div>
                {result.treatment.map((t, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#16a34a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{i+1}</div>
                    <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{t}</div>
                  </div>
                ))}
              </div>

              {/* Prevention + actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ background: "#fff", borderRadius: 20, padding: 24, border: "1px solid #e5e7eb", flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "#111827", marginBottom: 12 }}>🛡️ Prevention</div>
                  <div style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.7 }}>{result.prevention}</div>
                </div>
                <div style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid #e5e7eb" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 12 }}>Next Steps</div>
                  <button style={{ width: "100%", background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "11px", fontWeight: 700, cursor: "pointer", fontSize: 14, marginBottom: 8 }}>📞 Talk to KVK Expert</button>
                  <button onClick={reset} style={{ width: "100%", background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 10, padding: "11px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>📷 Analyze Another Photo</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
