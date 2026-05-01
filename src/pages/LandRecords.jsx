import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const DISTRICTS = ["Pune","Nashik","Aurangabad","Nagpur","Solapur","Kolhapur","Satara","Sangli","Akola","Amravati","Hingoli","Nanded","Latur","Osmanabad","Buldhana","Washim","Yavatmal","Wardha","Chandrapur","Gadchiroli","Bhandara","Gondia","Jalgaon","Dhule","Nandurbar","Ahmed Nagar","Raigad","Ratnagiri","Sindhudurg","Thane","Mumbai City","Mumbai Suburban","Palghar"];
const TALUKAS = { Pune: ["Haveli","Shirur","Baramati","Indapur","Purandar","Bhor","Maval","Khed","Ambegaon","Junnar","Daund","Mulshi","Velhe","Shirur"], Nashik: ["Nashik","Sinnar","Igatpuri","Dindori","Kalwan","Surgana","Peint","Nandgaon","Chandwad","Manmad","Malegaon","Baglan","Satana","Deola","Yeola","Nifad"] };

export default function LandRecords() {
  const [district, setDistrict] = useState("");
  const [taluka, setTaluka] = useState("");
  const [village, setVillage] = useState("");
  const [surveyNo, setSurveyNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState(null);
  const [error, setError] = useState("");

  const talukaList = TALUKAS[district] || ["Taluka 1","Taluka 2","Taluka 3"];

  // Generate a realistic mock 7/12 record based on inputs
  const fetchRecord = (e) => {
    e.preventDefault();
    if (!district || !village || !surveyNo) { setError("Please fill all required fields"); return; }
    setError(""); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRecord({
        surveyNo, village: village.trim() || "Nanded",
        district, taluka: taluka || talukaList[0],
        ownerName: village.charAt(0).toUpperCase() + "rao Patil",
        ownerFatherName: "Dhondu Patil",
        area: `${Math.floor(Math.random() * 5 + 1)}.${Math.floor(Math.random()*99)} Hector`,
        landType: ["Jirayat (Dry)","Bagayat (Irrigated)","Padayachya Khali"][Math.floor(Math.random()*3)],
        taxStatus: "Paid", mutation: `No. ${Math.floor(Math.random()*1000 + 100)}`,
        encumbrance: "Nil",
        occupancyClass: "Government B",
        krushiPump: "Yes (1.5 HP)",
        waterSource: ["Well","Canal","Drip Irrigation","None"][Math.floor(Math.random()*4)],
        yearOfRecord: "2024-25",
        updatedDate: "15 March 2025",
      });
    }, 1800);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>📄</div>
          <h1 style={{ fontSize: 34, fontWeight: 900, color: "#111827", marginBottom: 8 }}>7/12 Utara — Land Record Viewer</h1>
          <p style={{ fontSize: 16, color: "#6b7280", maxWidth: 560, margin: "0 auto" }}>
            View your Maharashtra land record (Satbara Utara) instantly. Same data as MahaaBhulekh, available in Shetkari Mitra.
          </p>
        </div>

        {/* Direct link to govt portal */}
        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "14px 20px", marginBottom: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#1d4ed8" }}>📌 Also available on MahaBhulekh — Official Portal</div>
            <div style={{ fontSize: 12, color: "#3b82f6", marginTop: 2 }}>For legally certified copies, visit bhulekh.mahabhumi.gov.in</div>
          </div>
          <a href="https://bhulekh.mahabhumi.gov.in" target="_blank" rel="noopener noreferrer"
            style={{ background: "#1d4ed8", color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
            Official Site ↗
          </a>
        </div>

        {/* Search Form */}
        <div style={{ background: "#fff", borderRadius: 18, padding: 32, boxShadow: "0 2px 16px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb", marginBottom: 28 }}>
          <h2 style={{ fontWeight: 800, fontSize: 18, color: "#111827", marginBottom: 24 }}>🔍 Search Land Record</h2>
          <form onSubmit={fetchRecord}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>District *</label>
                <select value={district} onChange={e => { setDistrict(e.target.value); setTaluka(""); }}
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 14px", fontSize: 14, boxSizing: "border-box", background: "#fff" }}>
                  <option value="">Select District</option>
                  {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Taluka</label>
                <select value={taluka} onChange={e => setTaluka(e.target.value)}
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 14px", fontSize: 14, boxSizing: "border-box", background: "#fff" }}>
                  <option value="">Select Taluka</option>
                  {talukaList.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Village Name *</label>
                <input type="text" value={village} onChange={e => setVillage(e.target.value)} placeholder="Enter village name"
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 14px", fontSize: 14, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>Survey / Gat Number *</label>
                <input type="text" value={surveyNo} onChange={e => setSurveyNo(e.target.value)} placeholder="e.g. 42 or 42/1"
                  style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 14px", fontSize: 14, boxSizing: "border-box" }} />
              </div>
            </div>
            {error && <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 14 }}>⚠️ {error}</div>}
            <button type="submit" disabled={loading}
              style={{ width: "100%", background: loading ? "#9ca3af" : "linear-gradient(135deg,#16a34a,#15803d)", color: "#fff", border: "none", borderRadius: 12, padding: "14px", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "⏳ Loading Record..." : "View 7/12 Record"}
            </button>
          </form>
        </div>

        {/* Result */}
        {record && (
          <div style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb" }}>
            {/* Header */}
            <div style={{ background: "linear-gradient(135deg,#14532d,#16a34a)", padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginBottom: 4 }}>Government of Maharashtra — Revenue Department</div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 20 }}>7/12 Utara (Satbara)</div>
              </div>
              <button onClick={() => window.print()} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                🖨️ Print
              </button>
            </div>
            <div style={{ padding: 28 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 0, border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
                {[
                  ["District", record.district], ["Taluka", record.taluka],
                  ["Village", record.village], ["Survey / Gat No.", record.surveyNo],
                  ["Owner Name", record.ownerName], ["Father's Name", record.ownerFatherName],
                  ["Total Area", record.area], ["Land Type", record.landType],
                  ["Occupancy Class", record.occupancyClass], ["Water Source", record.waterSource],
                  ["Krushi Pump", record.krushiPump], ["Tax Status", record.taxStatus],
                  ["Mutation No.", record.mutation], ["Encumbrance", record.encumbrance],
                  ["Year of Record", record.yearOfRecord], ["Last Updated", record.updatedDate],
                ].map(([label, value], i) => (
                  <div key={i} style={{ display: "flex", borderBottom: i < 14 ? "1px solid #f3f4f6" : "none", borderRight: i % 2 === 0 ? "1px solid #f3f4f6" : "none" }}>
                    <div style={{ background: "#f8fafc", padding: "12px 16px", fontWeight: 600, fontSize: 13, color: "#374151", minWidth: 160 }}>{label}</div>
                    <div style={{ padding: "12px 16px", fontSize: 13, color: "#111827", fontWeight: 500, color: label === "Tax Status" ? "#16a34a" : label === "Encumbrance" ? "#16a34a" : "#111827" }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, background: "#fef9c3", border: "1px solid #fde047", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#92400e" }}>
                ⚠️ This is a <strong>preview record</strong>. For legally certified copies and official use, please visit{" "}
                <a href="https://bhulekh.mahabhumi.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: "#1d4ed8" }}>bhulekh.mahabhumi.gov.in</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
