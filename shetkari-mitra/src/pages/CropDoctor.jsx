import Navbar from "../components/Navbar";
import { useState } from "react";

const diseases = [
  { crop: "Soybean", disease: "Yellow Mosaic Virus", symptoms: "Yellow patches on leaves, stunted growth", treatment: "Remove infected plants, spray Imidacloprid 17.8 SL @ 0.5ml/L water", prevention: "Use resistant varieties, control whitefly population" },
  { crop: "Cotton", disease: "Bollworm", symptoms: "Holes in bolls, frass (droppings) visible", treatment: "Spray Profenofos 50 EC @ 2ml/L or Spinosad 45 SC @ 0.3ml/L", prevention: "Pheromone traps, early sowing before June 15" },
  { crop: "Wheat", disease: "Rust (Yellow/Brown)", symptoms: "Orange/yellow pustules on leaves and stems", treatment: "Spray Propiconazole 25 EC @ 0.1% at first sign", prevention: "Certified rust-resistant seed varieties, timely sowing" },
  { crop: "Tur Dal", disease: "Sterility Mosaic", symptoms: "Mosaic pattern, pale green leaves, no pods", treatment: "Uproot and destroy infected plants immediately", prevention: "Control mite vectors, use tolerant varieties like ICPL-87119" },
];

export default function CropDoctor() {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");

  const filtered = diseases.filter(d => d.crop.toLowerCase().includes(query.toLowerCase()) || d.disease.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">🌿 Crop Doctor</h1>
        <p className="text-gray-500 mb-6">Diagnose crop diseases and get treatment advice</p>

        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search crop or disease..." className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 mb-6 w-72" />

        <div className="grid gap-4">
          {filtered.map((d, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button className="w-full text-left p-5 flex justify-between items-center" onClick={() => setSelected(selected === i ? null : i)}>
                <div>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full mr-2">{d.crop}</span>
                  <span className="font-bold text-gray-800">{d.disease}</span>
                </div>
                <span className="text-gray-400">{selected === i ? "▲" : "▼"}</span>
              </button>

              {selected === i && (
                <div className="px-5 pb-5 border-t border-gray-50 space-y-4">
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                    <div className="font-semibold text-amber-700 mb-1">🔍 Symptoms</div>
                    <p className="text-sm text-gray-700">{d.symptoms}</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <div className="font-semibold text-blue-700 mb-1">💊 Treatment</div>
                    <p className="text-sm text-gray-700">{d.treatment}</p>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                    <div className="font-semibold text-green-700 mb-1">🛡️ Prevention</div>
                    <p className="text-sm text-gray-700">{d.prevention}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
          <div className="text-3xl mb-2">📞</div>
          <h3 className="font-bold text-gray-800 mb-1">Need Expert Help?</h3>
          <p className="text-sm text-gray-500 mb-3">Call Krishi Helpline for free consultation</p>
          <a href="tel:1800-180-1551" className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition-colors inline-block">
            📞 1800-180-1551 (Free)
          </a>
        </div>
      </div>
    </div>
  );
}
