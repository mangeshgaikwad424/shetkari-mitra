import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../context/DarkModeContext";
import { useChat } from "../context/ChatContext";
import { translations } from "../utils/lang";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { lang, toggleLang } = useContext(LanguageContext);
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();
  const t = translations[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef(null);

  // Chat unread count
  let chatUnread = 0;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { getUnreadCount } = useChat();
    chatUnread = user ? getUnreadCount(user.email) : 0;
  } catch (_) {}

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Close tools dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target)) {
        setToolsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (path) => location.pathname === path;

  const activeCls = "text-green-700 font-semibold border-b-2 border-green-600 pb-0.5";
  const normalCls = "text-gray-600 hover:text-green-600 transition-colors font-medium";

  // Core links always shown
  const coreLinks = [
    { to: "/", label: lang === "mr" ? "🏠 मुख्यपृष्ठ" : "🏠 Home" },
    { to: "/marketplace", label: t.marketplace },
    { to: "/tractor", label: t.tractor },
    { to: "/labour", label: t.labour },
  ];

  // "Tools" dropdown items
  const toolsLinks = [
    { to: "/weather", label: t.weather, icon: "🌤️" },
    { to: "/schemes", label: t.schemes, icon: "📋" },
    { to: "/mandi", label: lang === "mr" ? "मंडी भाव" : "Mandi Prices", icon: "📊" },
    { to: "/crop", label: t.crop || (lang === "mr" ? "पीक डॉक्टर" : "Crop Doctor"), icon: "🌿" },
    { to: "/crop-disease", label: lang === "mr" ? "रोग शोध" : "Crop Disease", icon: "🔬" },
    { to: "/soil-health", label: lang === "mr" ? "माती आरोग्य" : "Soil Health", icon: "🌱" },
    { to: "/community", label: lang === "mr" ? "समुदाय" : "Community", icon: "👥" },
    { to: "/land-records", label: lang === "mr" ? "जमीन नोंदी" : "Land Records", icon: "📜" },
    { to: "/voice", label: lang === "mr" ? "आवाज सहाय्यक" : "Voice Assistant", icon: "🎙️" },
    { to: "/messages", label: lang === "mr" ? "संदेश" : "Messages", icon: "💬" },
  ];

  const publicLinks = [
    { to: "/", label: lang === "mr" ? "🏠 मुख्यपृष्ठ" : "🏠 Home" },
    { to: "/weather", label: t.weather },
    { to: "/schemes", label: t.schemes },
    { to: "/mandi", label: lang === "mr" ? "📊 मंडी भाव" : "📊 Mandi Prices" },
  ];

  // Mobile menu shows all links flat
  const mobileLinks = user
    ? [
        { to: "/", label: lang === "mr" ? "🏠 मुख्यपृष्ठ" : "🏠 Home" },
        { to: "/dashboard", label: lang === "mr" ? "📊 डॅशबोर्ड" : "📊 Dashboard" },
        { to: "/marketplace", label: t.marketplace },
        { to: "/tractor", label: t.tractor },
        { to: "/labour", label: t.labour },
        { to: "/weather", label: t.weather },
        { to: "/schemes", label: t.schemes },
        { to: "/mandi", label: lang === "mr" ? "📊 मंडी भाव" : "📊 Mandi Prices" },
        { to: "/crop", label: t.crop || (lang === "mr" ? "पीक डॉक्टर" : "Crop Doctor") },
        { to: "/community", label: lang === "mr" ? "👥 समुदाय" : "👥 Community" },
        { to: "/messages", label: lang === "mr" ? "💬 संदेश" : "💬 Messages" },
      ]
    : publicLinks;

  const isToolsActive = toolsLinks.some((l) => location.pathname === l.to);

  const roleColors = {
    farmer: "bg-green-100 text-green-800",
    tractor: "bg-yellow-100 text-yellow-800",
    labour: "bg-orange-100 text-orange-800",
    government: "bg-blue-100 text-blue-800",
  };

  const roleIcons = { farmer: "🌾", tractor: "🚜", labour: "👷", government: "🏛️" };

  return (
    <nav className="flex justify-between items-center px-6 md:px-10 py-4 bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <Link to="/" className="text-green-700 font-bold text-xl flex items-center gap-2 flex-shrink-0">
        <img src={logo} alt="Shetkari Mitra Logo" className="h-10 w-auto" />
        Shetkari Mitra
      </Link>

      {/* Desktop nav */}
      <div className="hidden lg:flex gap-5 text-sm items-center">
        {user ? (
          <>
            {coreLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={isActive(link.to) ? activeCls : normalCls}
              >
                {link.label}
              </Link>
            ))}

            {/* Tools dropdown */}
            <div ref={toolsRef} className="relative">
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className={`flex items-center gap-1 transition-colors font-medium ${
                  isToolsActive ? "text-green-700 font-semibold" : "text-gray-600 hover:text-green-600"
                }`}
              >
                {lang === "mr" ? "🛠️ साधने" : "🛠️ Tools"}
                <svg className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? "rotate-180" : ""}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {toolsOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  {toolsLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setToolsOpen(false)}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-green-50 ${
                        isActive(link.to)
                          ? "text-green-700 font-semibold bg-green-50"
                          : "text-gray-700"
                      }`}
                    >
                      <span>{link.icon}</span> {link.label}
                      {link.to === "/messages" && chatUnread > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                          {chatUnread}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Dashboard link */}
            <Link
              to="/dashboard"
              className={isActive("/dashboard") ? activeCls : normalCls}
            >
              {t.dashboard}
            </Link>
          </>
        ) : (
          publicLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={isActive(link.to) ? activeCls : normalCls}
            >
              {link.label}
            </Link>
          ))
        )}
      </div>

      <div className="flex gap-2 items-center">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="border border-gray-200 px-2 py-1 rounded-full text-sm text-gray-600 hover:border-green-400 transition-colors"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        <button
          onClick={toggleLang}
          className="border border-gray-200 px-3 py-1 rounded-full text-sm text-gray-600 hover:border-green-400 transition-colors"
        >
          🌐 {lang === "en" ? "मराठी" : "English"}
        </button>

        {user ? (
          <>
            {/* Messages icon with badge */}
            <Link
              to="/messages"
              className="relative hidden md:flex items-center"
              title="Messages"
            >
              <span className="text-xl">💬</span>
              {chatUnread > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {chatUnread > 9 ? "9+" : chatUnread}
                </span>
              )}
            </Link>

            <span
              className={
                "hidden md:flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold " +
                (roleColors[user.role] || "bg-gray-100 text-gray-700")
              }
            >
              {roleIcons[user.role]} {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-100 transition-colors"
            >
              {t.logout}
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`text-sm font-medium px-3 py-2 ${isActive("/login") ? "text-green-700 font-semibold" : "text-gray-600 hover:text-green-600"}`}
            >
              {t.login}
            </Link>
            <Link
              to="/register"
              className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition-colors"
            >
              {t.signup}
            </Link>
          </>
        )}

        <button
          className="lg:hidden ml-1 text-gray-600 text-lg"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 py-4 px-6 lg:hidden">
          <div className="flex flex-col gap-1">
            {mobileLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`py-2.5 px-3 rounded-lg border-b border-gray-50 ${
                  isActive(link.to)
                    ? "text-green-700 font-semibold bg-green-50"
                    : "text-gray-700 hover:text-green-600 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <button
                onClick={handleLogout}
                className="mt-2 text-left py-2.5 px-3 rounded-lg text-red-600 hover:bg-red-50 font-medium"
              >
                🚪 {t.logout}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
