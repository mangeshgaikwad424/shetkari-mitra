import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const roleColors = {
  farmer: { bg: "from-green-500 to-emerald-600", badge: "bg-green-100 text-green-800", icon: "🌾" },
  tractor: { bg: "from-yellow-500 to-orange-500", badge: "bg-yellow-100 text-yellow-800", icon: "🚜" },
  labour: { bg: "from-orange-500 to-red-500", badge: "bg-orange-100 text-orange-800", icon: "👷" },
  government: { bg: "from-blue-500 to-indigo-600", badge: "bg-blue-100 text-blue-800", icon: "🏛️" },
};

const activityIcons = {
  login: "🔐",
  logout: "🚪",
  booking: "📅",
  view: "👁️",
  update: "✏️",
  default: "📌",
};

function formatTime(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function ProfileDropdown() {
  const { user, logout, activityHistory, clearHistory } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("profile"); // profile | history
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  if (!user) return null;

  const role = roleColors[user.role] || roleColors.farmer;
  const initials = user.name
    ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 group"
        aria-label="Profile menu"
      >
        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${role.bg} flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white group-hover:ring-green-300 transition-all`}>
          {initials}
        </div>
        <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fadeIn">
          
          {/* Profile Header */}
          <div className={`bg-gradient-to-r ${role.bg} p-4 text-white`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                {initials}
              </div>
              <div>
                <p className="font-bold text-base leading-tight">{user.name}</p>
                <p className="text-white/80 text-xs">{user.email}</p>
                {user.phone && <p className="text-white/70 text-xs">📱 {user.phone}</p>}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                {role.icon} {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
              </span>
              {user.village && (
                <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full">
                  📍 {user.village}
                </span>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setTab("profile")}
              className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${tab === "profile" ? "text-green-700 border-b-2 border-green-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              👤 Profile
            </button>
            <button
              onClick={() => setTab("history")}
              className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${tab === "history" ? "text-green-700 border-b-2 border-green-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              📋 Activity History
            </button>
          </div>

          {/* Profile Tab */}
          {tab === "profile" && (
            <div className="p-4 space-y-2">
              <InfoRow icon="✉️" label="Email" value={user.email} />
              <InfoRow icon="📱" label="Phone" value={user.phone || "Not provided"} />
              <InfoRow icon="🏘️" label="Village" value={user.village || "Not provided"} />
              <InfoRow icon="🎭" label="Role" value={user.roleLabel || user.role} />
              
              <div className="pt-3 space-y-1.5">
                <button
                  onClick={() => { setOpen(false); navigate("/dashboard"); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors font-medium"
                >
                  <span>🏠</span> Go to Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                  <span>🚪</span> Logout
                </button>
              </div>
            </div>
          )}

          {/* History Tab */}
          {tab === "history" && (
            <div>
              <div className="max-h-64 overflow-y-auto">
                {activityHistory.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 text-sm">
                    <p className="text-3xl mb-2">📭</p>
                    No activity yet
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {activityHistory.map((entry) => (
                      <div key={entry.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50">
                        <span className="text-lg mt-0.5">{activityIcons[entry.type] || activityIcons.default}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-700 leading-snug">{entry.description}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{formatTime(entry.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {activityHistory.length > 0 && (
                <div className="border-t border-gray-100 px-4 py-2.5">
                  <button
                    onClick={clearHistory}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    🗑️ Clear history
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.15s ease-out; }
      `}</style>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50">
      <span className="text-base">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 leading-none mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-700 truncate">{value}</p>
      </div>
    </div>
  );
}
