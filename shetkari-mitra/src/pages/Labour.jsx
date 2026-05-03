import { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { LanguageContext } from "../context/LanguageContext";

const WORKERS_DATA = [
  { id:1, nameEn:"Ganesh Shinde", nameMr:"गणेश शिंदे", skillEn:"Farm Labour", skillMr:"शेत मजूर", locationEn:"Pune, Maharashtra", locationMr:"पुणे, महाराष्ट्र", expEn:"5 years", expMr:"५ वर्षे", rate:500, rating:4.8, reviews:32, available:true, cat:"farm" },
  { id:2, nameEn:"Ramesh Jadhav", nameMr:"रमेश जाधव", skillEn:"Tractor Driver", skillMr:"ट्रॅक्टर चालक", locationEn:"Haveli, Pune", locationMr:"हवेली, पुणे", expEn:"7 years", expMr:"७ वर्षे", rate:800, rating:4.7, reviews:28, available:true, cat:"tractor" },
  { id:3, nameEn:"Mahesh Kale", nameMr:"महेश काळे", skillEn:"Agricultural Worker", skillMr:"कृषी कामगार", locationEn:"Baramati, Maharashtra", locationMr:"बारामती, महाराष्ट्र", expEn:"6 years", expMr:"६ वर्षे", rate:550, rating:4.6, reviews:18, available:true, cat:"farm" },
  { id:4, nameEn:"Vikas Pawar", nameMr:"विकास पवार", skillEn:"Pesticide Expert", skillMr:"फवारणी तज्ञ", locationEn:"Daund, Maharashtra", locationMr:"दौंड, महाराष्ट्र", expEn:"4 years", expMr:"४ वर्षे", rate:600, rating:4.5, reviews:15, available:true, cat:"spray" },
  { id:5, nameEn:"Suresh Patil", nameMr:"सुरेश पाटील", skillEn:"Harvesting Expert", skillMr:"कापणी तज्ञ", locationEn:"Indapur, Maharashtra", locationMr:"इंदापूर, महाराष्ट्र", expEn:"8 years", expMr:"८ वर्षे", rate:650, rating:4.9, reviews:40, available:true, cat:"harvest" },
  { id:6, nameEn:"Arjun Mane", nameMr:"अर्जुन माने", skillEn:"Irrigation Specialist", skillMr:"सिंचन तज्ञ", locationEn:"Kolhapur, Maharashtra", locationMr:"कोल्हापूर, महाराष्ट्र", expEn:"5 years", expMr:"५ वर्षे", rate:580, rating:4.7, reviews:22, available:true, cat:"irrigation" },
];

const COLORS = ["#dcfce7","#dbeafe","#fef9c3","#fce7f3","#ede9fe","#ffedd5"];
const EMOJIS = ["👨‍🌾","👷","👨‍🔧","🧑‍🌾","👩‍🌾","🧑‍🔧"];

export default function Labour() {
  const { lang } = useContext(LanguageContext);
  const { user } = useAuth();
  const mr = lang === "mr";

  const CATS = [
    { id:"all",     labelEn:"All",           labelMr:"सर्व",          icon:"⊞" },
    { id:"farm",    labelEn:"Farm Labour",    labelMr:"शेत मजूर",      icon:"👨‍🌾" },
    { id:"tractor", labelEn:"Tractor Driver", labelMr:"ट्रॅक्टर चालक",icon:"🚜" },
    { id:"harvest", labelEn:"Harvesting",     labelMr:"कापणी",         icon:"🌾" },
    { id:"irrigation",labelEn:"Irrigation",  labelMr:"सिंचन",         icon:"💧" },
    { id:"spray",   labelEn:"Pesticide",      labelMr:"फवारणी",        icon:"💨" },
  ];

  const WHY = [
    { icon:"✅", titleEn:"Verified Workers", titleMr:"सत्यापित मजूर", subEn:"All workers are verified", subMr:"सर्व मजूर सत्यापित आहेत" },
    { icon:"💪", titleEn:"Skilled & Trusted", titleMr:"कुशल व विश्वासू", subEn:"Get experienced workers", subMr:"अनुभवी मजूर मिळवा" },
    { icon:"🔒", titleEn:"Safe & Easy", titleMr:"सुरक्षित व सोपे", subEn:"Secure payment & easy hiring", subMr:"सुरक्षित पेमेंट व सहज भाड्याने घेणे" },
    { icon:"🕐", titleEn:"24/7 Support", titleMr:"२४/७ मदत", subEn:"We are always ready to help", subMr:"आम्ही नेहमी मदतीस तयार" },
  ];

  const [activeCat, setActiveCat] = useState("all");
  const [searchLoc, setSearchLoc] = useState("");
  const [skillFilter, setSkillFilter] = useState("all");
  const [modal, setModal] = useState(null);
  const [hireDate, setHireDate] = useState("");
  const [hireMsg, setHireMsg] = useState("");
  const [hireDays, setHireDays] = useState(1);
  const [success, setSuccess] = useState(false);

  const visible = WORKERS_DATA.filter(w => {
    const catMatch = activeCat === "all" || w.cat === activeCat;
    const locMatch = !searchLoc.trim() || w.locationEn.toLowerCase().includes(searchLoc.toLowerCase()) || w.locationMr.includes(searchLoc);
    const skillMatch = skillFilter === "all" || w.cat === skillFilter;
    return catMatch && locMatch && skillMatch;
  });

  const confirmHire = () => {
    setSuccess(true);
    setTimeout(() => setModal(null), 2200);
  };

  const lbl = (en, mr_) => mr ? mr_ : en;

  return (
    <div style={{ minHeight:"100vh", background:"#f9fafb", fontFamily:"'Inter',sans-serif" }}>
      <Navbar />

      {/* HERO */}
      <div style={{ background:"linear-gradient(135deg,#f0fdf4,#dcfce7,#bbf7d0)", borderBottom:"1px solid #d1fae5", padding:"36px 24px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
          <div>
            <h1 style={{ fontSize:32, fontWeight:900, color:"#111827", marginBottom:8 }}>
              {lbl("Hire Labour Workers", "मजूर भाड्याने घ्या")}
            </h1>
            <p style={{ fontSize:15, color:"#4b5563", marginBottom:20 }}>
              {lbl("Find skilled & trusted workers for your farm", "तुमच्या शेतकामासाठी कुशल व विश्वासू मजूर शोधा")}
            </p>
            <button style={{ background:"#16a34a", color:"#fff", border:"none", borderRadius:10, padding:"12px 22px", fontSize:14, fontWeight:700, cursor:"pointer" }}>
              {lbl("+ Post a Job", "+ काम पोस्ट करा")}
            </button>
          </div>
          <div style={{ width:180, height:120, background:"rgba(22,163,74,0.1)", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:64 }}>👨‍🌾</div>
        </div>
      </div>

      {/* SEARCH */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e5e7eb", padding:"14px 24px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
          <div style={{ position:"relative", flex:1, minWidth:180, maxWidth:300 }}>
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}>🔍</span>
            <input
              value={searchLoc}
              onChange={e => setSearchLoc(e.target.value)}
              placeholder={lbl("Search by location...", "ठिकाण शोधा...")}
              style={{ width:"100%", padding:"10px 14px 10px 36px", borderRadius:10, border:"1px solid #d1d5db", fontSize:14, outline:"none", boxSizing:"border-box" }}
            />
          </div>
          <select
            value={skillFilter}
            onChange={e => setSkillFilter(e.target.value)}
            style={{ padding:"10px 14px", borderRadius:10, border:"1px solid #d1d5db", fontSize:14, background:"#fff", outline:"none" }}
          >
            <option value="all">{lbl("All Skills", "सर्व कौशल्ये")}</option>
            <option value="farm">{lbl("Farm Labour", "शेत मजूर")}</option>
            <option value="tractor">{lbl("Tractor Driver", "ट्रॅक्टर चालक")}</option>
            <option value="harvest">{lbl("Harvesting", "कापणी")}</option>
            <option value="irrigation">{lbl("Irrigation", "सिंचन")}</option>
            <option value="spray">{lbl("Pesticide", "फवारणी")}</option>
          </select>
          <button
            onClick={() => { setActiveCat("all"); }}
            style={{ background:"#16a34a", color:"#fff", border:"none", borderRadius:10, padding:"10px 20px", fontSize:14, fontWeight:700, cursor:"pointer" }}
          >
            {lbl("Search", "शोधा")}
          </button>
        </div>
      </div>

      {/* CATEGORY PILLS */}
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"16px 24px 0" }}>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {CATS.map(c => (
            <button key={c.id} onClick={() => setActiveCat(c.id)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"9px 14px", borderRadius:12, border:activeCat===c.id?"2px solid #16a34a":"1px solid #e5e7eb", background:activeCat===c.id?"#f0fdf4":"#fff", cursor:"pointer", fontSize:12, fontWeight:activeCat===c.id?700:500, color:activeCat===c.id?"#16a34a":"#6b7280" }}>
              <span style={{ fontSize:20 }}>{c.icon}</span>
              <span>{mr ? c.labelMr : c.labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN GRID */}
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"20px 24px 40px", display:"grid", gridTemplateColumns:"1fr 280px", gap:24 }}>
        {/* WORKERS LIST */}
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <h2 style={{ fontSize:18, fontWeight:800, color:"#111827" }}>
              {lbl("Available Workers", "उपलब्ध मजूर")} <span style={{ fontSize:13, color:"#6b7280", fontWeight:400 }}>({visible.length})</span>
            </h2>
          </div>

          {visible.length === 0 && (
            <div style={{ background:"#fff", borderRadius:14, padding:40, textAlign:"center", border:"1px solid #f3f4f6" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
              <p style={{ color:"#9ca3af" }}>{lbl("No workers found. Try different filters.", "कोणताही मजूर आढळला नाही. वेगळे फिल्टर वापरा.")}</p>
            </div>
          )}

          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {visible.map((w,i) => (
              <div key={w.id} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:14, padding:"16px 18px", display:"flex", alignItems:"center", gap:16, boxShadow:"0 2px 6px rgba(0,0,0,0.05)" }}>
                <div style={{ width:56, height:56, borderRadius:"50%", background:COLORS[i%COLORS.length], display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>
                  {EMOJIS[i%EMOJIS.length]}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:15, fontWeight:800, color:"#111827", marginBottom:2 }}>{mr ? w.nameMr : w.nameEn}</div>
                  <div style={{ fontSize:12, color:"#6b7280", marginBottom:3 }}>{mr ? w.skillMr : w.skillEn}</div>
                  <div style={{ fontSize:12, color:"#6b7280", marginBottom:3 }}>📍 {mr ? w.locationMr : w.locationEn}</div>
                  <div style={{ fontSize:12, color:"#6b7280", marginBottom:4 }}>⏱ {lbl("Experience","अनुभव")}: {mr ? w.expMr : w.expEn}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                    {[...Array(5)].map((_,si) => <span key={si} style={{ color:si<Math.round(w.rating)?"#f59e0b":"#d1d5db", fontSize:13 }}>★</span>)}
                    <span style={{ fontSize:12, color:"#374151", fontWeight:600 }}>{w.rating}</span>
                    <span style={{ fontSize:11, color:"#9ca3af" }}>({w.reviews} {lbl("reviews","समीक्षा")})</span>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:10, flexShrink:0 }}>
                  <div style={{ fontSize:16, fontWeight:800, color:"#111827" }}>₹{w.rate}<span style={{ fontSize:12, color:"#6b7280", fontWeight:400 }}>/{lbl("day","दिवस")}</span></div>
                  <button onClick={() => { setModal(w); setHireDate(""); setHireMsg(""); setHireDays(1); setSuccess(false); }} style={{ background:"#16a34a", color:"#fff", border:"none", borderRadius:8, padding:"9px 22px", fontSize:13, fontWeight:700, cursor:"pointer" }}>
                    {lbl("Hire Now", "आता भाड्याने घ्या")}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:14, padding:"16px 20px", marginTop:20, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:"#15803d", marginBottom:2 }}>{lbl("Need permanent workers?","कायमस्वरूपी मजूर हवे आहेत?")}</div>
              <div style={{ fontSize:12, color:"#6b7280" }}>{lbl("Post a job and find the best match for long-term needs.","काम पोस्ट करा आणि दीर्घकालीन गरजांसाठी सर्वोत्तम जुळणी शोधा.")}</div>
            </div>
            <button style={{ background:"#16a34a", color:"#fff", border:"none", borderRadius:8, padding:"10px 20px", fontSize:13, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>{lbl("Post a Job","काम पोस्ट करा")}</button>
          </div>
        </div>

        {/* SIDEBAR */}
        <div>
          <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:14, padding:18, marginBottom:16, boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize:14, fontWeight:800, color:"#111827", marginBottom:6 }}>{lbl("Post a Job","काम पोस्ट करा")}</h3>
            <p style={{ fontSize:12, color:"#6b7280", marginBottom:14 }}>{lbl("Find the right worker for your farm easily.","तुमच्या शेतकामासाठी योग्य मजूर सहज शोधा.")}</p>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <button style={{ background:"#16a34a", color:"#fff", border:"none", borderRadius:8, padding:"9px 16px", fontSize:13, fontWeight:700, cursor:"pointer" }}>+ {lbl("Post a Job","काम पोस्ट करा")}</button>
              <span style={{ fontSize:44 }}>👨‍🌾</span>
            </div>
          </div>

          <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:14, padding:18, marginBottom:16, boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize:14, fontWeight:800, color:"#111827", marginBottom:14 }}>{lbl("Why Hire With Us?","आमच्याकडून का भाड्याने घ्यावे?")}</h3>
            {WHY.map((w,i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:12 }}>
                <div style={{ width:34, height:34, borderRadius:9, background:"#f0fdf4", display:"flex", alignItems:"center", justifyContent:"center", fontSize:17, flexShrink:0 }}>{w.icon}</div>
                <div>
                  <div style={{ fontSize:12, fontWeight:700, color:"#111827" }}>{mr ? w.titleMr : w.titleEn}</div>
                  <div style={{ fontSize:11, color:"#6b7280" }}>{mr ? w.subMr : w.subEn}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:14, padding:18, boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <h3 style={{ fontSize:14, fontWeight:800, color:"#111827" }}>{lbl("Market Trends","मजूर बाजार ट्रेंड")}</h3>
              <span style={{ fontSize:10, color:"#6b7280", background:"#f3f4f6", padding:"3px 7px", borderRadius:20 }}>{lbl("Today","आज अपडेट")}</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:"#fef9c3", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>📈</div>
                <div><div style={{ fontSize:12, fontWeight:700, color:"#111827" }}>{lbl("High Demand","जास्त मागणी")}</div><div style={{ fontSize:11, color:"#6b7280" }}>{lbl("Tractor Drivers, Harvesting","ट्रॅक्टर चालक, कापणी")}</div></div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:"#f0fdf4", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>💰</div>
                <div><div style={{ fontSize:12, fontWeight:700, color:"#111827" }}>{lbl("Average Rate","सरासरी दर")}</div><div style={{ fontSize:11, color:"#6b7280" }}>₹500 – ₹800/{lbl("day","दिवस")}</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HIRE MODAL */}
      {modal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", backdropFilter:"blur(6px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div style={{ background:"#fff", borderRadius:18, padding:30, width:"100%", maxWidth:420, boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize:18, fontWeight:800, color:"#111827", marginBottom:4 }}>👷 {lbl("Hire Worker","मजूर भाड्याने घ्या")}</div>
            <div style={{ fontSize:13, color:"#6b7280", marginBottom:20 }}>{mr ? modal.nameMr : modal.nameEn} · {mr ? modal.skillMr : modal.skillEn} · ₹{modal.rate}/{lbl("day","दिवस")}</div>
            {success ? (
              <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:18, textAlign:"center", color:"#16a34a", fontWeight:700 }}>
                ✅ {lbl("Hire request sent successfully!","भाड्याने घेण्याची विनंती यशस्वीरित्या पाठवली!")}
              </div>
            ) : (
              <>
                <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:6 }}>{lbl("Start Date","सुरुवातीची तारीख")}</label>
                <input type="date" value={hireDate} onChange={e=>setHireDate(e.target.value)} min={new Date().toISOString().split("T")[0]} style={{ width:"100%", border:"1px solid #d1d5db", borderRadius:8, padding:"10px 12px", marginBottom:14, fontSize:14, boxSizing:"border-box", outline:"none" }} />
                <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:6 }}>{lbl("Number of Days","दिवसांची संख्या")}</label>
                <input type="number" value={hireDays} onChange={e=>setHireDays(Number(e.target.value)||1)} min={1} style={{ width:"100%", border:"1px solid #d1d5db", borderRadius:8, padding:"10px 12px", marginBottom:14, fontSize:14, boxSizing:"border-box", outline:"none" }} />
                {hireDate && (
                  <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:8, padding:"10px 14px", marginBottom:14, fontSize:13, color:"#15803d", fontWeight:600 }}>
                    {lbl("Total","एकूण")}: ₹{modal.rate * hireDays} — {hireDays} {lbl("days","दिवसांसाठी")}
                  </div>
                )}
                <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:6 }}>{lbl("Message (optional)","संदेश (पर्यायी)")}</label>
                <textarea value={hireMsg} onChange={e=>setHireMsg(e.target.value)} placeholder={lbl("Describe the work...","कामाचे वर्णन करा...")} style={{ width:"100%", border:"1px solid #d1d5db", borderRadius:8, padding:"10px 12px", marginBottom:18, fontSize:13, resize:"none", height:70, boxSizing:"border-box", outline:"none" }} />
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={()=>setModal(null)} style={{ flex:1, border:"1px solid #d1d5db", background:"#fff", color:"#374151", borderRadius:8, padding:11, fontWeight:600, cursor:"pointer", fontSize:14 }}>{lbl("Cancel","रद्द करा")}</button>
                  <button onClick={confirmHire} disabled={!hireDate} style={{ flex:1, border:"none", background:hireDate?"#16a34a":"#d1d5db", color:"#fff", borderRadius:8, padding:11, fontWeight:700, cursor:hireDate?"pointer":"not-allowed", fontSize:14 }}>{lbl("Confirm Hire","भाड्याने घेण्याची पुष्टी करा")}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
