import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const CATEGORIES = ["All","Crops","Weather","Market Price","Govt Schemes","Soil & Fertilizer","Pest Control","Equipment","General"];
const LANGUAGES = [{ code: "all", label: "All" },{ code: "mr", label: "मराठी" },{ code: "hi", label: "हिंदी" },{ code: "en", label: "English" },{ code: "te", label: "తెలుగు" },{ code: "kn", label: "ಕನ್ನಡ" }];

const INITIAL_POSTS = [
  { id:1, author:"Ramesh Patil", village:"Washim", role:"🌾 Farmer", time:"2 hours ago", lang:"mr", category:"Crops", title:"सोयाबीनवर पिवळेपणा येत आहे — काय करावे?", body:"माझ्या सोयाबीन पिकावर पाने पिवळी होत आहेत. ३ एकर आहे. कोणती फवारणी करावी?", likes:12, answers:[{author:"Vikas Shinde",role:"👨‍🌾 Farmer",text:"फेरस सल्फेट 0.5% फवारणी करा. प्रति 10 लिटर मध्ये 50 ग्राम फेरस सल्फेट टाका. 3 दिवसात फरक दिसेल.", time:"1 hour ago"}], tags:["सोयाबीन","पिवळेपणा","खत"], verified:true },
  { id:2, author:"Vijay Reddy", village:"Guntur, AP", role:"🌾 Farmer", time:"5 hours ago", lang:"te", category:"Market Price", title:"Cotton price dropping — hold or sell?", body:"Cotton rates have fallen to ₹6,500/quintal. Should I sell now or wait? Heard prices may rise next month.", likes:8, answers:[{author:"Govt Officer",role:"🏛️ Govt Officer",text:"According to Cotton Corp of India, MSP for cotton is ₹6,620/Q. Do NOT sell below MSP. Contact your taluka agriculture office.",time:"3 hours ago"}], tags:["cotton","mandi","MSP"], verified:false },
  { id:3, author:"Priya Sharma", village:"Indore, MP", role:"🌾 Farmer", time:"Yesterday", lang:"hi", category:"Govt Schemes", title:"PM-KISAN तीसरी किस्त नहीं आई — क्या करें?", body:"मुझे PM-KISAN की तीसरी किस्त नहीं मिली। बैंक खाता सही है। क्या कोई बता सकता है?", likes:24, answers:[{author:"KVK Officer",role:"🏛️ Govt",text:"pmkisan.gov.in पर जाकर Beneficiary Status चेक करें। अगर 'Pending for Approval' दिखे तो तहसील कार्यालय में जाएं।",time:"12 hours ago"},{author:"Mahesh Patil",role:"👨‍🌾 Farmer",text:"मेरे साथ भी ऐसा हुआ था। eKYC करना पड़ा। Aadhar से",time:"10 hours ago"}], tags:["PM-KISAN","किस्त","सरकार"], verified:true },
  { id:4, author:"Mahesh Gowda", village:"Davangere, KA", role:"🚜 Tractor Owner", time:"2 days ago", lang:"kn", category:"Equipment", title:"ಟ್ರ್ಯಾಕ್ಟರ್ ಬಾಡಿಗೆ ದರ — ಅಕ್ಕಿ ಕೊಯ್ಲಿಗೆ ಎಷ್ಟು?", body:"ಅಕ್ಕಿ ಕೊಯ್ಲಿಗೆ ಟ್ರ್ಯಾಕ್ಟರ್ ಬಾಡಿಗೆ ದರ ಎಷ್ಟು ಇರಬೇಕು? ನನ್ನ ಬಳಿ Mahindra 575 ಇದೆ.", likes:5, answers:[], tags:["ಟ್ರ್ಯಾಕ್ಟರ್","ಬಾಡಿಗೆ"], verified:false },
  { id:5, author:"Sunil Kadam", village:"Aurangabad, MH", role:"👷 Labour", time:"3 days ago", lang:"mr", category:"General", title:"द्राक्ष कापणीसाठी मजुरांची मागणी आहे का?", body:"जून महिन्यात द्राक्ष कापणीसाठी 20 मजूर लागतात. कोणाला काम हवे आहे का? ₹500/दिवस + जेवण.", likes:18, answers:[{author:"Ganesh Jadhav",role:"👷 Labour",text:"मला आणि माझ्या गटाला काम चालेल. 8 जण आहोत. संपर्क: 9876543210",time:"2 days ago"}], tags:["मजूर","द्राक्ष","काम"], verified:false },
];

export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [filter, setFilter] = useState("All");
  const [langFilter, setLangFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", body: "", category: "Crops", lang: "mr", tags: "" });
  const [expandedPost, setExpandedPost] = useState(null);
  const [replyText, setReplyText] = useState("");

  const filtered = posts.filter(p =>
    (filter === "All" || p.category === filter) &&
    (langFilter === "all" || p.lang === langFilter)
  );

  const handlePost = (e) => {
    e.preventDefault();
    if (!user) { alert("Please login to post"); return; }
    const tags = newPost.tags.split(",").map(t => t.trim()).filter(Boolean);
    const post = { id: Date.now(), author: user.name, village: user.village || "Maharashtra", role: "🌾 Farmer", time: "Just now", lang: newPost.lang, category: newPost.category, title: newPost.title, body: newPost.body, likes: 0, answers: [], tags, verified: false };
    setPosts([post, ...posts]);
    setNewPost({ title: "", body: "", category: "Crops", lang: "mr", tags: "" });
    setShowForm(false);
  };

  const handleReply = (postId) => {
    if (!replyText.trim() || !user) return;
    setPosts(posts.map(p => p.id === postId ? {
      ...p, answers: [...p.answers, { author: user.name, role: `${user.role === "government" ? "🏛️ Govt" : "👨‍🌾 Farmer"}`, text: replyText, time: "Just now" }]
    } : p));
    setReplyText("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
          <h1 style={{ fontSize: 34, fontWeight: 900, color: "#111827", marginBottom: 8 }}>Shetkari Mitra Community Forum</h1>
          <p style={{ fontSize: 16, color: "#6b7280" }}>Ask questions in your language. Get answers from farmers, experts & government officers.</p>
        </div>

        {/* Filters + Post Button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1.5px solid", background: filter === cat ? "#16a34a" : "#fff", color: filter === cat ? "#fff" : "#374151", borderColor: filter === cat ? "#16a34a" : "#d1d5db" }}>
                {cat}
              </button>
            ))}
          </div>
          <button onClick={() => setShowForm(!showForm)}
            style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
            + Ask a Question
          </button>
        </div>

        {/* Language Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {LANGUAGES.map(l => (
            <button key={l.code} onClick={() => setLangFilter(l.code)}
              style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid", background: langFilter === l.code ? "#374151" : "#fff", color: langFilter === l.code ? "#fff" : "#6b7280", borderColor: langFilter === l.code ? "#374151" : "#d1d5db" }}>
              {l.label}
            </button>
          ))}
        </div>

        {/* New Post Form */}
        {showForm && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, border: "1px solid #bbf7d0", marginBottom: 24 }}>
            <h3 style={{ fontWeight: 800, fontSize: 16, color: "#111827", marginBottom: 16 }}>Ask the Community</h3>
            <form onSubmit={handlePost} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <select value={newPost.category} onChange={e => setNewPost({ ...newPost, category: e.target.value })}
                  style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 14px", fontSize: 14, background: "#fff" }}>
                  {CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}
                </select>
                <select value={newPost.lang} onChange={e => setNewPost({ ...newPost, lang: e.target.value })}
                  style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 14px", fontSize: 14, background: "#fff" }}>
                  {LANGUAGES.slice(1).map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
              </div>
              <input required value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} placeholder="Question title (be specific)"
                style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 14px", fontSize: 14 }} />
              <textarea required value={newPost.body} onChange={e => setNewPost({ ...newPost, body: e.target.value })} placeholder="Describe your problem in detail..." rows={3}
                style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 14px", fontSize: 14, resize: "vertical" }} />
              <input value={newPost.tags} onChange={e => setNewPost({ ...newPost, tags: e.target.value })} placeholder="Tags (comma separated): cotton, mandi, soil"
                style={{ border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 14px", fontSize: 14 }} />
              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" style={{ flex: 1, background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "11px", fontWeight: 700, cursor: "pointer" }}>Post Question</button>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 10, padding: "11px", fontWeight: 700, cursor: "pointer" }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Posts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map(post => (
            <div key={post.id} style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden" }}>
              {/* Post Header */}
              <div style={{ padding: "20px 24px" }}>
                <div style={{ display: "flex", justify: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#14532d,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16, flexShrink: 0 }}>{post.author.charAt(0)}</div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>{post.author}</span>
                        {post.verified && <span style={{ background: "#dcfce7", color: "#15803d", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>✓ Verified</span>}
                      </div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>{post.role} · {post.village} · {post.time}</div>
                    </div>
                    <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                      <span style={{ background: "#f0fdf4", color: "#15803d", fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20 }}>{post.category}</span>
                    </div>
                  </div>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 8 }}>{post.title}</h3>
                <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.6, marginBottom: 12 }}>{post.body}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                  {post.tags.map((tag, i) => <span key={i} style={{ background: "#f3f4f6", color: "#374151", fontSize: 11, padding: "3px 10px", borderRadius: 20 }}>#{tag}</span>)}
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <button onClick={() => setPosts(posts.map(p => p.id === post.id ? { ...p, likes: p.likes + 1 } : p))}
                    style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                    👍 {post.likes}
                  </button>
                  <button onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                    style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                    💬 {post.answers.length} {post.answers.length === 1 ? "Answer" : "Answers"} {expandedPost === post.id ? "▲" : "▼"}
                  </button>
                </div>
              </div>

              {/* Answers */}
              {expandedPost === post.id && (
                <div style={{ background: "#f8fafc", borderTop: "1px solid #f3f4f6", padding: "16px 24px" }}>
                  {post.answers.map((ans, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{ans.author.charAt(0)}</div>
                      <div style={{ background: "#fff", borderRadius: 12, padding: "12px 16px", flex: 1, border: "1px solid #e5e7eb" }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>{ans.author} <span style={{ fontWeight: 400, color: "#6b7280", fontSize: 12 }}>{ans.role} · {ans.time}</span></div>
                        <div style={{ fontSize: 13, color: "#374151", marginTop: 6, lineHeight: 1.6 }}>{ans.text}</div>
                      </div>
                    </div>
                  ))}
                  {/* Reply Input */}
                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <input value={replyText} onChange={e => setReplyText(e.target.value)} placeholder={user ? "Write your answer..." : "Login to answer..."}
                      disabled={!user}
                      style={{ flex: 1, border: "1px solid #d1d5db", borderRadius: 10, padding: "10px 14px", fontSize: 13 }} />
                    <button onClick={() => handleReply(post.id)} disabled={!user || !replyText.trim()}
                      style={{ background: user && replyText.trim() ? "#16a34a" : "#9ca3af", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
