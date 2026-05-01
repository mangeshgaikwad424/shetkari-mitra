import { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import { LanguageContext } from "../context/LanguageContext";

const T = {
  en: {
    hero: "Tractor & Tools",
    heroSub: "Find tractors and agricultural tools\nfor rent or service near you",
    addBtn: "+ Add Your Tractor / Tool",
    searchPh: "Pune, Maharashtra",
    catAll: "All Categories", catTractor: "Tractor", catHarvester: "Harvester", catTool: "Tools",
    sortLow: "Price: Low to High", sortHigh: "Price: High to Low", sortRating: "Rating",
    searchBtn: "Search",
    popularTitle: "Popular Tractors", toolsTitle: "Agricultural Tools & Equipments",
    viewAll: "View All",
    detailBtn: "View Details", notAvail: "Not Available",
    whyTitle: "Why Rent with Us?",
    why: [
      { icon:"💰", title:"Affordable Prices", sub:"Save more on rent" },
      { icon:"✅", title:"Verified Owners", sub:"Trusted & verified sellers" },
      { icon:"📅", title:"Easy Booking", sub:"Quick & simple process" },
      { icon:"🕐", title:"24/7 Support", sub:"We are here to help" },
    ],
    listTitle: "List Your Tractor / Tool",
    listSub: "Earn extra income by renting your equipment.",
    listBtn: "List Now",
    nearTitle: "Near You", nearMap: "View on Map",
    modalTitle: "Book Equipment", modalDate: "Select Date",
    modalMsg: "Message (optional)", modalPh: "Any special requirements...",
    cancelBtn: "Cancel", confirmBtn: "Send Request",
    successMsg: "✅ Booking request sent successfully!",
    cats: [
      { label:"All", icon:"⊞" }, { label:"Tractors", icon:"🚜" }, { label:"Harvesters", icon:"🌾" },
      { label:"Ploughing", icon:"🔧" }, { label:"Seed Drill", icon:"🌱" }, { label:"Sprayers", icon:"💧" },
      { label:"Trailers", icon:"🚛" }, { label:"Tillers", icon:"⚙️" }, { label:"Others", icon:"···" },
    ],
    tractors: [
      { id:"t1", title:"John Deere 5050D", owner:"Suresh Patil", hp:"50 HP · 2WD", price:"₹1,200", unit:"/hour", location:"Pune, MH", rating:4.8, badge:"Featured", badgeColor:"#16a34a", available:true },
      { id:"t2", title:"Mahindra 575 DI", owner:"Ramesh Jadhav", hp:"45 HP · 2WD", price:"₹950", unit:"/hour", location:"Haveli, Pune", rating:4.7, badge:"Verified", badgeColor:"#2563eb", available:true },
      { id:"t3", title:"Swaraj 744 FE", owner:"Mahesh Kale", hp:"50 HP · 2WD", price:"₹1,100", unit:"/hour", location:"Baramati, MH", rating:4.6, badge:"Verified", badgeColor:"#2563eb", available:true },
      { id:"t4", title:"New Holland 3630", owner:"Vikas Pawar", hp:"55 HP · 2WD", price:"₹1,250", unit:"/hour", location:"Baramati, MH", rating:4.9, badge:"New", badgeColor:"#d97706", available:true },
    ],
    tools: [
      { id:"a1", title:"Rotavator", owner:"Suresh Patil", price:"₹800", unit:"/day", location:"Pune, MH", rating:4.6, available:true },
      { id:"a2", title:"Seed Drill", owner:"Ramesh Jadhav", price:"₹700", unit:"/day", location:"Baramati, MH", rating:4.5, available:true },
      { id:"a3", title:"Cultivator", owner:"Mahesh Kale", price:"₹600", unit:"/day", location:"Haveli, Pune", rating:4.7, available:true },
      { id:"a4", title:"Sprayer Pump", owner:"Vikas Pawar", price:"₹300", unit:"/day", location:"Daund, MH", rating:4.8, available:false },
    ],
    nearby: [
      { title:"John Deere 5050D", loc:"Pune, MH", dist:"0.8 km" },
      { title:"Mahindra 575 DI", loc:"Haveli, Pune", dist:"1.2 km" },
      { title:"Swaraj 744 FE", loc:"Baramati, MH", dist:"2.5 km" },
      { title:"New Holland 3630", loc:"Daund, MH", dist:"3.1 km" },
    ],
  },
  mr: {
    hero: "ट्रॅक्टर व साधने",
    heroSub: "तुमच्या जवळील ट्रॅक्टर व शेती साधने\nभाड्याने किंवा सेवेसाठी शोधा",
    addBtn: "+ तुमचा ट्रॅक्टर / साधन जोडा",
    searchPh: "पुणे, महाराष्ट्र",
    catAll: "सर्व श्रेणी", catTractor: "ट्रॅक्टर", catHarvester: "हार्वेस्टर", catTool: "साधने",
    sortLow: "किंमत: कमी ते जास्त", sortHigh: "किंमत: जास्त ते कमी", sortRating: "रेटिंग",
    searchBtn: "शोधा",
    popularTitle: "लोकप्रिय ट्रॅक्टर", toolsTitle: "शेती साधने व उपकरणे",
    viewAll: "सर्व पाहा",
    detailBtn: "तपशील पाहा", notAvail: "उपलब्ध नाही",
    whyTitle: "आमच्याकडून का भाड्याने घ्यावे?",
    why: [
      { icon:"💰", title:"परवडणारे भाव", sub:"भाड्यावर अधिक बचत करा" },
      { icon:"✅", title:"सत्यापित मालक", sub:"विश्वासू व सत्यापित विक्रेते" },
      { icon:"📅", title:"सोपे बुकिंग", sub:"जलद व साधी प्रक्रिया" },
      { icon:"🕐", title:"२४/७ मदत", sub:"आम्ही नेहमी मदतीस तयार" },
    ],
    listTitle: "तुमचा ट्रॅक्टर / साधन सूचीबद्ध करा",
    listSub: "तुमचे उपकरण भाड्याने देऊन अतिरिक्त उत्पन्न मिळवा.",
    listBtn: "आता सूचीबद्ध करा",
    nearTitle: "तुमच्या जवळ", nearMap: "नकाशावर पाहा",
    modalTitle: "उपकरण बुक करा", modalDate: "तारीख निवडा",
    modalMsg: "संदेश (पर्यायी)", modalPh: "कोणत्याही विशेष आवश्यकता...",
    cancelBtn: "रद्द करा", confirmBtn: "विनंती पाठवा",
    successMsg: "✅ बुकिंग विनंती यशस्वीरित्या पाठवली!",
    cats: [
      { label:"सर्व", icon:"⊞" }, { label:"ट्रॅक्टर", icon:"🚜" }, { label:"हार्वेस्टर", icon:"🌾" },
      { label:"नांगरणी", icon:"🔧" }, { label:"सीड ड्रिल", icon:"🌱" }, { label:"स्प्रेअर", icon:"💧" },
      { label:"ट्रेलर", icon:"🚛" }, { label:"टिलर", icon:"⚙️" }, { label:"इतर", icon:"···" },
    ],
    tractors: [
      { id:"t1", title:"John Deere 5050D", owner:"सुरेश पाटील", hp:"50 HP · 2WD", price:"₹1,200", unit:"/तास", location:"पुणे, MH", rating:4.8, badge:"वैशिष्ट्यीकृत", badgeColor:"#16a34a", available:true },
      { id:"t2", title:"Mahindra 575 DI", owner:"रमेश जाधव", hp:"45 HP · 2WD", price:"₹950", unit:"/तास", location:"हवेली, पुणे", rating:4.7, badge:"सत्यापित", badgeColor:"#2563eb", available:true },
      { id:"t3", title:"Swaraj 744 FE", owner:"महेश काळे", hp:"50 HP · 2WD", price:"₹1,100", unit:"/तास", location:"बारामती, MH", rating:4.6, badge:"सत्यापित", badgeColor:"#2563eb", available:true },
      { id:"t4", title:"New Holland 3630", owner:"विकास पवार", hp:"55 HP · 2WD", price:"₹1,250", unit:"/तास", location:"बारामती, MH", rating:4.9, badge:"नवीन", badgeColor:"#d97706", available:true },
    ],
    tools: [
      { id:"a1", title:"रोटाव्हेटर", owner:"सुरेश पाटील", price:"₹800", unit:"/दिवस", location:"पुणे, MH", rating:4.6, available:true },
      { id:"a2", title:"सीड ड्रिल", owner:"रमेश जाधव", price:"₹700", unit:"/दिवस", location:"बारामती, MH", rating:4.5, available:true },
      { id:"a3", title:"कल्टिव्हेटर", owner:"महेश काळे", price:"₹600", unit:"/दिवस", location:"हवेली, पुणे", rating:4.7, available:true },
      { id:"a4", title:"स्प्रेअर पंप", owner:"विकास पवार", price:"₹300", unit:"/दिवस", location:"दौंड, MH", rating:4.8, available:false },
    ],
    nearby: [
      { title:"John Deere 5050D", loc:"पुणे, MH", dist:"0.8 km" },
      { title:"Mahindra 575 DI", loc:"हवेली, पुणे", dist:"1.2 km" },
      { title:"Swaraj 744 FE", loc:"बारामती, MH", dist:"2.5 km" },
      { title:"New Holland 3630", loc:"दौंड, MH", dist:"3.1 km" },
    ],
  },
};

export default function Tractor() {
  const { lang } = useContext(LanguageContext);
  const t = T[lang] || T.en;
  const { user } = useAuth();
  const { createBooking } = useBooking();

  const [activeCat, setActiveCat] = useState(0);
  const [modal, setModal] = useState(null);
  const [bookDate, setBookDate] = useState("");
  const [bookMsg, setBookMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const confirmBook = async () => {
    if (user && modal) await createBooking(user, modal, bookDate, bookMsg);
    setSuccess(true);
    setTimeout(() => setModal(null), 2000);
  };

  const Card = ({ item, emoji }) => (
    <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:14, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
      <div style={{ position:"relative", height:110, background:"linear-gradient(135deg,#dcfce7,#bbf7d0)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:52 }}>
        {emoji}
        {item.badge && <span style={{ position:"absolute", top:8, left:8, background:item.badgeColor||"#16a34a", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:6 }}>{item.badge}</span>}
      </div>
      <div style={{ padding:12 }}>
        <div style={{ fontSize:13, fontWeight:800, color:"#111827", marginBottom:2 }}>{item.title}</div>
        {item.hp && <div style={{ fontSize:11, color:"#6b7280", marginBottom:6 }}>{item.hp}</div>}
        <div style={{ fontSize:16, fontWeight:800, color:"#111827", marginBottom:6 }}>{item.price}<span style={{ fontSize:11, color:"#6b7280", fontWeight:400 }}>{item.unit}</span></div>
        <div style={{ fontSize:11, color:"#6b7280", marginBottom:6 }}>📍 {item.location}</div>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
          <span style={{ fontSize:11, color:"#374151" }}>👤 {item.owner}</span>
          <span style={{ color:"#f59e0b", fontSize:11, fontWeight:700 }}>⭐ {item.rating}</span>
        </div>
        <button onClick={() => item.available && setModal(item)} style={{ width:"100%", padding:"8px", borderRadius:8, border:item.available?"1px solid #16a34a":"1px solid #d1d5db", background:"#fff", color:item.available?"#16a34a":"#9ca3af", fontSize:12, fontWeight:700, cursor:item.available?"pointer":"not-allowed" }}>
          {item.available ? t.detailBtn : t.notAvail}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#f9fafb", fontFamily:"'Inter',sans-serif" }}>
      <Navbar />

      {/* HERO */}
      <div style={{ background:"linear-gradient(135deg,#f0fdf4,#dcfce7,#bbf7d0)", borderBottom:"1px solid #d1fae5", padding:"36px 24px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <h1 style={{ fontSize:36, fontWeight:900, color:"#111827", marginBottom:8 }}>{t.hero}</h1>
            <p style={{ fontSize:15, color:"#4b5563", marginBottom:20, whiteSpace:"pre-line" }}>{t.heroSub}</p>
            <button style={{ background:"#16a34a", color:"#fff", border:"none", borderRadius:10, padding:"12px 22px", fontSize:14, fontWeight:700, cursor:"pointer" }}>{t.addBtn}</button>
          </div>
          <div style={{ width:200, height:130, background:"rgba(22,163,74,0.1)", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:80 }}>🚜</div>
        </div>
      </div>

      {/* SEARCH */}
      <div style={{ background:"#fff", borderBottom:"1px solid #e5e7eb", padding:"14px 24px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", gap:12, alignItems:"center" }}>
          <div style={{ position:"relative", flex:1, maxWidth:300 }}>
            <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)" }}>🔍</span>
            <input placeholder={t.searchPh} style={{ width:"100%", padding:"10px 14px 10px 36px", borderRadius:10, border:"1px solid #d1d5db", fontSize:14, outline:"none", boxSizing:"border-box" }} />
          </div>
          <select style={{ padding:"10px 14px", borderRadius:10, border:"1px solid #d1d5db", fontSize:14, background:"#fff", outline:"none" }}>
            <option>{t.catAll}</option><option>{t.catTractor}</option><option>{t.catHarvester}</option><option>{t.catTool}</option>
          </select>
          <select style={{ padding:"10px 14px", borderRadius:10, border:"1px solid #d1d5db", fontSize:14, background:"#fff", outline:"none" }}>
            <option>{t.sortLow}</option><option>{t.sortHigh}</option><option>{t.sortRating}</option>
          </select>
          <button style={{ background:"#16a34a", color:"#fff", border:"none", borderRadius:10, padding:"10px 24px", fontSize:14, fontWeight:700, cursor:"pointer" }}>{t.searchBtn}</button>
        </div>
      </div>

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"24px", display:"grid", gridTemplateColumns:"1fr 280px", gap:24 }}>
        <div>
          {/* CATEGORY PILLS */}
          <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
            {t.cats.map((c, i) => (
              <button key={i} onClick={() => setActiveCat(i)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"9px 14px", borderRadius:12, border:activeCat===i?"2px solid #16a34a":"1px solid #e5e7eb", background:activeCat===i?"#f0fdf4":"#fff", cursor:"pointer", fontSize:12, fontWeight:activeCat===i?700:500, color:activeCat===i?"#16a34a":"#6b7280" }}>
                <span style={{ fontSize:20 }}>{c.icon}</span><span>{c.label}</span>
              </button>
            ))}
          </div>

          {/* TRACTORS */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <h2 style={{ fontSize:18, fontWeight:800, color:"#111827" }}>{t.popularTitle}</h2>
            <a href="#" style={{ fontSize:13, color:"#16a34a", fontWeight:600, textDecoration:"none" }}>{t.viewAll}</a>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:28 }}>
            {t.tractors.map(item => <Card key={item.id} item={item} emoji="🚜" />)}
          </div>

          {/* TOOLS */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <h2 style={{ fontSize:18, fontWeight:800, color:"#111827" }}>{t.toolsTitle}</h2>
            <a href="#" style={{ fontSize:13, color:"#16a34a", fontWeight:600, textDecoration:"none" }}>{t.viewAll}</a>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
            {t.tools.map(item => <Card key={item.id} item={item} emoji="🔧" />)}
          </div>
        </div>

        {/* SIDEBAR */}
        <div>
          <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:14, padding:18, marginBottom:16, boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize:15, fontWeight:800, color:"#111827", marginBottom:14 }}>{t.whyTitle}</h3>
            {t.why.map((w,i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:12 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:"#f0fdf4", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{w.icon}</div>
                <div><div style={{ fontSize:13, fontWeight:700, color:"#111827" }}>{w.title}</div><div style={{ fontSize:11, color:"#6b7280" }}>{w.sub}</div></div>
              </div>
            ))}
          </div>

          <div style={{ background:"#15803d", borderRadius:14, padding:18, marginBottom:16, color:"#fff" }}>
            <h3 style={{ fontSize:14, fontWeight:800, marginBottom:6 }}>{t.listTitle}</h3>
            <p style={{ fontSize:12, opacity:0.8, marginBottom:14 }}>{t.listSub}</p>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <button style={{ background:"#fff", color:"#15803d", border:"none", borderRadius:8, padding:"9px 18px", fontSize:13, fontWeight:700, cursor:"pointer" }}>{t.listBtn}</button>
              <span style={{ fontSize:40 }}>🚜</span>
            </div>
          </div>

          <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:14, padding:18, boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <h3 style={{ fontSize:14, fontWeight:800, color:"#111827" }}>{t.nearTitle}</h3>
              <a href="#" style={{ fontSize:12, color:"#16a34a", fontWeight:600, textDecoration:"none" }}>{t.nearMap}</a>
            </div>
            <div style={{ background:"#f0fdf4", borderRadius:10, height:90, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, marginBottom:12 }}>🗺️</div>
            {t.nearby.map((n,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:i<t.nearby.length-1?"1px solid #f3f4f6":"none" }}>
                <div style={{ width:30, height:30, borderRadius:8, background:"#f0fdf4", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🚜</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#111827" }}>{n.title}</div>
                  <div style={{ fontSize:11, color:"#6b7280" }}>📍 {n.loc}</div>
                </div>
                <span style={{ fontSize:12, color:"#16a34a", fontWeight:700 }}>{n.dist}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", backdropFilter:"blur(6px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div style={{ background:"#fff", borderRadius:18, padding:30, width:"100%", maxWidth:420, boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ fontSize:18, fontWeight:800, color:"#111827", marginBottom:4 }}>🚜 {t.modalTitle}</div>
            <div style={{ fontSize:13, color:"#6b7280", marginBottom:20 }}>{modal.title} · {modal.owner}</div>
            {success ? (
              <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:18, textAlign:"center", color:"#16a34a", fontWeight:700 }}>{t.successMsg}</div>
            ) : (
              <>
                <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:6 }}>{t.modalDate}</label>
                <input type="date" value={bookDate} onChange={e=>setBookDate(e.target.value)} min={new Date().toISOString().split("T")[0]} style={{ width:"100%", border:"1px solid #d1d5db", borderRadius:8, padding:"10px 12px", marginBottom:14, fontSize:14, boxSizing:"border-box", outline:"none" }} />
                <label style={{ fontSize:13, fontWeight:600, color:"#374151", display:"block", marginBottom:6 }}>{t.modalMsg}</label>
                <textarea value={bookMsg} onChange={e=>setBookMsg(e.target.value)} placeholder={t.modalPh} style={{ width:"100%", border:"1px solid #d1d5db", borderRadius:8, padding:"10px 12px", marginBottom:18, fontSize:13, resize:"none", height:80, boxSizing:"border-box", outline:"none" }} />
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={()=>setModal(null)} style={{ flex:1, border:"1px solid #d1d5db", background:"#fff", color:"#374151", borderRadius:8, padding:11, fontWeight:600, cursor:"pointer", fontSize:14 }}>{t.cancelBtn}</button>
                  <button onClick={confirmBook} disabled={!bookDate} style={{ flex:1, border:"none", background:bookDate?"#16a34a":"#d1d5db", color:"#fff", borderRadius:8, padding:11, fontWeight:700, cursor:bookDate?"pointer":"not-allowed", fontSize:14 }}>{t.confirmBtn}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
