import Navbar from "../components/Navbar";
import { useState, useContext } from "react";
import { LanguageContext } from "../context/LanguageContext";

const schemes = [
  {
    id: 1, name: "PM-KISAN", category: "Income Support",
    amount: "₹6,000/year", eligibility: "All small & marginal farmers with land ownership",
    deadline: "Ongoing", link: "https://pmkisan.gov.in/",
    description: "Direct income support of ₹6000/year in 3 instalments to eligible farmer families.",
  },
  {
    id: 2, name: "Pradhan Mantri Fasal Bima Yojana", category: "Crop Insurance",
    amount: "Up to full crop value", eligibility: "All farmers growing notified crops",
    deadline: "Before sowing season", link: "https://pmfby.gov.in/",
    description: "Comprehensive crop insurance coverage for crop loss due to natural calamities, pests & diseases.",
  },
  {
    id: 3, name: "Kisan Credit Card (KCC)", category: "Credit",
    amount: "Up to ₹3 lakh @ 4%", eligibility: "Farmers, sharecroppers, oral lessees",
    deadline: "Ongoing", link: "https://www.nabard.org/content1.aspx?id=572",
    description: "Short-term credit for agricultural needs at subsidised interest rate of 4% p.a.",
  },
  {
    id: 4, name: "Soil Health Card Scheme", category: "Soil Testing",
    amount: "Free soil testing", eligibility: "All farmers",
    deadline: "Ongoing", link: "https://soilhealth.dac.gov.in/",
    description: "Free soil testing and nutrient recommendations to improve soil health and crop yield.",
  },
  {
    id: 5, name: "PM Krishi Sinchai Yojana", category: "Irrigation",
    amount: "Subsidy up to 55%", eligibility: "Farmers with own land for micro-irrigation",
    deadline: "Apply by June 30", link: "https://pmksy.gov.in/",
    description: "Subsidy on drip and sprinkler irrigation systems to promote water-efficient farming.",
  },
  {
    id: 6, name: "eNAM - National Agriculture Market", category: "Market Access",
    amount: "Online price discovery", eligibility: "Registered farmers with APMC license",
    deadline: "Ongoing", link: "https://enam.gov.in/web/",
    description: "Pan-India electronic trading portal enabling farmers to get better prices for produce.",
  },
  {
    id: 7, name: "Maharashtra Shetkari Sanman Yojana", category: "Income Support",
    amount: "₹12,000/year (State)", eligibility: "Maharashtra farmers with 7/12 extract",
    deadline: "Ongoing", link: "https://mahadbt.maharashtra.gov.in/",
    description: "State government income support for Maharashtra farmers via MahaDbt portal.",
  },
  {
    id: 8, name: "Paramparagat Krishi Vikas Yojana", category: "Organic Farming",
    amount: "₹50,000/hectare over 3 years", eligibility: "Farmer groups of 50+ forming clusters",
    deadline: "Ongoing", link: "https://pgsindia-ncof.gov.in/pkvy/Index.aspx",
    description: "Financial support for adopting organic farming practices and certification.",
  },
];

const cats = ["All", "Income Support", "Crop Insurance", "Credit", "Irrigation", "Market Access", "Soil Testing", "Organic Farming"];
const catsMr = ["सर्व", "उत्पन्न सहाय्य", "पिक विमा", "कर्ज", "सिंचन", "बाजार प्रवेश", "मृदा परीक्षण", "सेंद्रिय शेती"];
const catColors = {
  "Income Support": "bg-green-100 text-green-700",
  "Crop Insurance": "bg-blue-100 text-blue-700",
  "Credit": "bg-purple-100 text-purple-700",
  "Irrigation": "bg-cyan-100 text-cyan-700",
  "Market Access": "bg-orange-100 text-orange-700",
  "Soil Testing": "bg-amber-100 text-amber-700",
  "Organic Farming": "bg-lime-100 text-lime-700",
};

const schemesMr = [
  { id: 1, name: "PM-किसान", category: "Income Support", amount: "₹6,000/वर्ष", eligibility: "सर्व लहान शेतकरी जमीन मालक", deadline: "चालू", link: "https://pmkisan.gov.in/", description: "पात्र शेतकरी कुटुंबांना 3 हप्त्यांमध्ये ₹6000/वर्ष थेट उत्पन्न सहाय्य." },
  { id: 2, name: "प्रधानमंत्री फसल विमा योजना", category: "Crop Insurance", amount: "पूर्ण पिक मूल्यापर्यंत", eligibility: "अधिसूचित पिके घेणारे सर्व शेतकरी", deadline: "पेरणीपूर्वी", link: "https://pmfby.gov.in/", description: "नैसर्गिक आपत्ती, कीड व रोगांमुळे होणाऱ्या पिक नुकसानीसाठी सर्वंकष विमा." },
  { id: 3, name: "किसान क्रेडिट कार्ड (KCC)", category: "Credit", amount: "₹3 लाखापर्यंत 4%", eligibility: "शेतकरी, भागीदार शेतकरी", deadline: "चालू", link: "https://www.nabard.org/", description: "4% वार्षिक दराने कृषी गरजांसाठी अल्पकालीन कर्ज." },
  { id: 4, name: "मृदा आरोग्य पत्रिका योजना", category: "Soil Testing", amount: "मोफत मृदा परीक्षण", eligibility: "सर्व शेतकरी", deadline: "चालू", link: "https://soilhealth.dac.gov.in/", description: "मृदा आरोग्य सुधारण्यासाठी मोफत मृदा परीक्षण व पोषण शिफारसी." },
  { id: 5, name: "PM कृषी सिंचन योजना", category: "Irrigation", amount: "55% पर्यंत अनुदान", eligibility: "सूक्ष्म सिंचनासाठी शेतकरी", deadline: "30 जूनपर्यंत", link: "https://pmksy.gov.in/", description: "ठिबक व तुषार सिंचनावर अनुदान." },
  { id: 6, name: "eNAM - राष्ट्रीय कृषी बाजार", category: "Market Access", amount: "ऑनलाइन भाव शोध", eligibility: "APMC नोंदणीकृत शेतकरी", deadline: "चालू", link: "https://enam.gov.in/web/", description: "शेतकर्यांना चांगले भाव मिळवण्यासाठी राष्ट्रीय इलेक्ट्रॉनिक व्यापार व्यासपीठ." },
  { id: 7, name: "महाराष्ट्र शेतकरी सनमान योजना", category: "Income Support", amount: "₹12,000/वर्ष", eligibility: "7/12 उतार्यासह शेतकरी", deadline: "चालू", link: "https://mahadbt.maharashtra.gov.in/", description: "MahaDbt व्यासपीठाद्वारे राज्य शासनाचे उत्पन्न सहाय्य." },
  { id: 8, name: "परंपरागत कृषी विकास योजना", category: "Organic Farming", amount: "3 वर्षांत ₹50,000/हेक्टर", eligibility: "50+ शेतकर्यांचा गट", deadline: "चालू", link: "https://pgsindia-ncof.gov.in/pkvy/Index.aspx", description: "सेंद्रिय शेती अवलंबन व प्रमाणीकरणासाठी आर्थिक सहाय्य." },
];

export default function Schemes() {
  const { lang } = useContext(LanguageContext);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const activeSchemes = lang === "mr" ? schemesMr : schemes;
  const filtered = activeSchemes.filter(s =>
    (filter === "All" || s.category === filter) &&
    (s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">📋 {lang === "mr" ? "शासकीय योजना" : "Government Schemes"}</h1>
        <p className="text-gray-500 mb-6">{lang === "mr" ? "केंद्र व राज्य शासनाच्या कृषी योजना शोधा आणि अर्ज करा" : "Discover and apply for central & state government agricultural schemes"}</p>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder={lang === "mr" ? "योजना शोधा..." : "Search schemes..."}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 w-64"
          />
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {cats.map((c, i) => (
            <button key={c} onClick={() => setFilter(c)}
              className={"px-4 py-2 rounded-full text-sm font-medium transition-colors " + (filter === c ? "bg-green-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-green-400")}>
              {lang === "mr" ? catsMr[i] : c}
            </button>
          ))}
        </div>

        <div className="grid gap-4">
          {filtered.map(s => (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={"text-xs px-2 py-1 rounded-full font-medium " + (catColors[s.category] || "bg-gray-100 text-gray-700")}>{s.category}</span>
                </div>
                <h3 className="font-bold text-gray-800 text-lg">{s.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{s.description}</p>
                <p className="text-xs text-gray-400 mt-1">{lang === "mr" ? "पात्रता:" : "Eligibility:"} {s.eligibility}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span>💰 {s.amount}</span>
                  <span>📅 {s.deadline}</span>
                </div>
              </div>
              <a
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition-colors whitespace-nowrap shrink-0 text-center"
              >
                {lang === "mr" ? "अर्ज करा ↗" : "Apply Now ↗"}
              </a>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-gray-400 py-12">{lang === "mr" ? "कोणतीही योजना आढळली नाही." : "No schemes found. Try a different filter."}</div>
          )}
        </div>
      </div>
    </div>
  );
}
