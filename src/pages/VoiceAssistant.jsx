import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const LANG_CODES = { mr: "mr-IN", hi: "hi-IN", en: "en-IN", te: "te-IN", kn: "kn-IN" };
const LANG_LABELS = { mr: "मराठी", hi: "हिंदी", en: "English", te: "తెలుగు", kn: "ಕನ್ನಡ" };

const AI_RESPONSES = {
  mr: {
    कापूस: "कापसासाठी डीएपी आणि पोटाश खताचा वापर करा. प्रति एकर 2 बॅग डीएपी द्या. पाणी देण्याचे अंतर 7-10 दिवस ठेवा. बोंड अळी नियंत्रणासाठी क्विनालफॉस फवारणी करा.",
    सोयाबीन: "सोयाबीन पेरणीपूर्वी रायझोबियम बीज प्रक्रिया करा. 20-20-0 खत प्रति एकर द्या. पिवळेपणा दिसल्यास फेरस सल्फेट फवारणी करा.",
    अन्न: "पिकाचे नाव सांगा — मी योग्य सल्ला देतो. जसे कापूस, सोयाबीन, ऊस, गहू, हरभरा.",
    "7/12": "७/१२ उतारा पाहण्यासाठी जमीन रेकॉर्ड विभागात जा. तुमचा सर्वे नंबर आणि गाव नाव टाका.",
    खत: "खत निवडण्यासाठी माती परीक्षण करा. NPK प्रमाण तपासा. जमिनीचा pH 6-7 असावा.",
    पाऊस: "हवामान विभागाचा अंदाज तपासा. जून-जुलैमध्ये खरीप पेरणी करा. जर पाऊस कमी असेल तर ठिबक सिंचन वापरा.",
    default: "मी शेतकरी मित्र AI आहे. तुम्ही मला पिके, खते, हवामान, बाजारभाव, सरकारी योजना — कशाबद्दलही विचारू शकता!",
  },
  hi: {
    कपास: "कपास के लिए DAP और पोटाश खाद का उपयोग करें। प्रति एकड़ 2 बैग DAP दें। सिंचाई 7-10 दिन पर करें। बॉलवर्म के लिए Quinalphos का छिड़काव करें।",
    सोयाबीन: "सोयाबीन बुवाई से पहले Rhizobium बीज उपचार करें। 20-20-0 खाद प्रति एकड़ दें। पीलापन दिखे तो Ferrous Sulphate छिड़कें।",
    गेहूं: "गेहूं के लिए बुवाई से पहले यूरिया और पोटाश मिलाएं। सिंचाई 4-5 बार करें। कटाई से 15 दिन पहले पानी बंद करें।",
    default: "मैं शेतकारी मित्र AI हूं। फसल, खाद, मौसम, मंडी भाव, सरकारी योजना — कुछ भी पूछें!",
  },
  en: {
    cotton: "For cotton: Apply DAP + Potash, 2 bags per acre. Irrigate every 7-10 days. Spray Quinalphos for bollworm control. Watch for aphids in flowering stage.",
    soybean: "Soybean: Pre-sow Rhizobium seed treatment. Use 20-20-0 NPK. If yellowing appears, spray Ferrous Sulphate 0.5%. Harvest at 85% pod maturity.",
    wheat: "Wheat: Pre-sow NPK 12-32-16. Irrigate 4-5 times. Top-dress urea at tillering. Stop water 15 days before harvest.",
    disease: "For crop disease, please use our AI Crop Doctor feature → upload a photo for instant diagnosis and treatment advice.",
    default: "I'm Shetkari Mitra AI. Ask me anything about crops, fertilizers, weather, mandi prices, or government schemes!",
  },
  te: { default: "నేను షేత్కారి మిత్ర AI. పంటలు, ఎరువులు, వాతావరణం, మండి ధరలు — ఏదైనా అడగండి!" },
  kn: { default: "ನಾನು ಶೇತ್ಕಾರಿ ಮಿತ್ರ AI. ಬೆಳೆಗಳು, ಗೊಬ್ಬರ, ಹವಾಮಾನ, ಮಾರುಕಟ್ಟೆ ದರ — ಏನೂ ಕೇಳಿ!" },
};

function getAIReply(text, lang) {
  const responses = AI_RESPONSES[lang] || AI_RESPONSES.en;
  const lower = text.toLowerCase();
  for (const [key, val] of Object.entries(responses)) {
    if (key !== "default" && lower.includes(key)) return val;
  }
  return responses.default;
}

export default function VoiceAssistant() {
  const [lang, setLang] = useState("mr");
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "नमस्कार! मी शेतकरी मित्र AI आहे. तुम्ही मला मराठीत बोला — पिके, खते, हवामान, बाजारभाव कशाबद्दलही विचारा! 🌾" }
  ]);
  const [typing, setTyping] = useState(false);
  const [textInput, setTextInput] = useState("");
  const recRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const speak = (text, langCode) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = LANG_CODES[langCode] || "mr-IN";
    utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
  };

  const handleVoice = () => {
    if (!SpeechRecognition) { alert("Voice recognition not supported in this browser. Please use Chrome."); return; }
    if (listening) { recRef.current?.stop(); setListening(false); return; }

    const rec = new SpeechRecognition();
    recRef.current = rec;
    rec.lang = LANG_CODES[lang];
    rec.interimResults = true;
    rec.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join("");
      setTranscript(t);
      if (e.results[e.results.length - 1].isFinal) {
        setListening(false);
        processInput(t);
      }
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
    setListening(true);
    setTranscript("");
  };

  const processInput = (input) => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: input }]);
    setTranscript("");
    setTyping(true);
    setTimeout(() => {
      const reply = getAIReply(input, lang);
      setMessages(prev => [...prev, { role: "ai", text: reply }]);
      setTyping(false);
      speak(reply, lang);
    }, 900);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>🎤</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: "#111827", marginBottom: 8 }}>Voice Assistant</h1>
          <p style={{ fontSize: 15, color: "#6b7280" }}>Ask farming questions in your language — speak or type</p>
        </div>

        {/* Language Selector */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb", marginBottom: 20, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Language:</span>
          {Object.entries(LANG_LABELS).map(([code, label]) => (
            <button key={code} onClick={() => setLang(code)}
              style={{ padding: "6px 16px", borderRadius: 20, border: "1.5px solid", fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.15s", background: lang === code ? "#16a34a" : "#fff", color: lang === code ? "#fff" : "#374151", borderColor: lang === code ? "#16a34a" : "#d1d5db" }}>
              {label}
            </button>
          ))}
        </div>

        {/* Chat Container */}
        <div style={{ background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px rgba(0,0,0,0.08)", border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg,#14532d,#16a34a)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>AI Farming Assistant</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>● Active — {LANG_LABELS[lang]}</div>
            </div>
          </div>
          {/* Messages */}
          <div style={{ height: 360, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                {msg.role === "ai" && (
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#14532d,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginRight: 8, flexShrink: 0, alignSelf: "flex-end" }}>🤖</div>
                )}
                <div style={{
                  maxWidth: "75%", padding: "12px 16px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: msg.role === "user" ? "linear-gradient(135deg,#16a34a,#15803d)" : "#f0fdf4",
                  color: msg.role === "user" ? "#fff" : "#111827", fontSize: 14, lineHeight: 1.6,
                  border: msg.role === "ai" ? "1px solid #bbf7d0" : "none",
                }}>
                  {msg.text}
                  {msg.role === "ai" && (
                    <button onClick={() => speak(msg.text, lang)} style={{ display: "block", marginTop: 6, background: "none", border: "none", color: "#16a34a", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>🔊 Listen</button>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#14532d,#16a34a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🤖</div>
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 18, padding: "10px 16px" }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[0,1,2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#16a34a", animation: `bounce 1s ${i*0.2}s infinite` }} />)}
                  </div>
                </div>
              </div>
            )}
            {transcript && (
              <div style={{ textAlign: "center", fontSize: 13, color: "#6b7280", fontStyle: "italic" }}>Hearing: "{transcript}"</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "16px 20px", borderTop: "1px solid #f3f4f6", display: "flex", gap: 10 }}>
            <input value={textInput} onChange={e => setTextInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && textInput.trim()) { processInput(textInput); setTextInput(""); } }}
              placeholder={lang === "mr" ? "मराठीत टाइप करा..." : lang === "hi" ? "हिंदी में टाइप करें..." : "Type your question..."}
              style={{ flex: 1, border: "1px solid #d1d5db", borderRadius: 24, padding: "10px 18px", fontSize: 14, outline: "none" }} />
            <button onClick={() => { if (textInput.trim()) { processInput(textInput); setTextInput(""); } }}
              style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 24, padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
              Send
            </button>
            <button onClick={handleVoice}
              style={{ width: 46, height: 46, borderRadius: "50%", background: listening ? "#ef4444" : "linear-gradient(135deg,#14532d,#16a34a)", color: "#fff", border: "none", cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, animation: listening ? "pulse 1s infinite" : "none" }}>
              {listening ? "⏹" : "🎤"}
            </button>
          </div>
        </div>

        {/* Sample Questions */}
        <div style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", marginTop: 20, border: "1px solid #e5e7eb" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 12 }}>💡 Try asking:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(lang === "mr" ? ["कापसाला खत कसे द्यावे?","सोयाबीनचा रोग कसा ओळखावा?","पाऊस उशीर झाल्यास काय करावे?","आजचा मंडी भाव काय आहे?","PM-KISAN साठी अर्ज कसा करावा?"]
              : lang === "hi" ? ["कपास में कौन सा खाद डालें?","सोयाबीन की बीमारी कैसे पहचानें?","बारिश देर से हो तो क्या करें?","आज का मंडी भाव क्या है?","PM-KISAN के लिए आवेदन कैसे करें?"]
              : ["How to fertilize cotton?","How to identify soybean disease?","What if rains are delayed?","What's today's mandi price?","How to apply for PM-KISAN?"]).map((q, i) => (
              <button key={i} onClick={() => processInput(q)}
                style={{ background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                {q}
              </button>
            ))}
          </div>
        </div>

        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.7} } @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
      </div>
    </div>
  );
}
