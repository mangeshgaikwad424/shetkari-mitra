import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { LanguageContext } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { translations } from "../utils/lang";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { lang, toggleLang } = useContext(LanguageContext);
  const { user, logout } = useAuth();
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
    setMenuOpen(false);
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

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
    setToolsOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const activeCls =
    "text-green-700 font-semibold border-b-2 border-green-600 pb-0.5";
  const normalCls =
    "text-gray-600 hover:text-green-600 transition-all duration-200 font-medium relative after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:bg-green-500 after:transition-all after:duration-250 hover:after:w-full";

  // Core links always shown when logged in
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
    {
      to: "/mandi",
      label: lang === "mr" ? "मंडी भाव" : "Mandi Prices",
      icon: "📊",
    },
    {
      to: "/crop",
      label: t.crop || (lang === "mr" ? "पीक डॉक्टर" : "Crop Doctor"),
      icon: "🌿",
    },
    {
      to: "/crop-disease",
      label: lang === "mr" ? "रोग शोध" : "Crop Disease",
      icon: "🔬",
    },
    {
      to: "/soil-health",
      label: lang === "mr" ? "माती आरोग्य" : "Soil Health",
      icon: "🌱",
    },
    {
      to: "/community",
      label: lang === "mr" ? "समुदाय" : "Community",
      icon: "👥",
    },
    {
      to: "/land-records",
      label: lang === "mr" ? "जमीन नोंदी" : "Land Records",
      icon: "📜",
    },
    {
      to: "/voice",
      label: lang === "mr" ? "आवाज सहाय्यक" : "Voice Assistant",
      icon: "🎙️",
    },
    {
      to: "/messages",
      label: lang === "mr" ? "संदेश" : "Messages",
      icon: "💬",
    },
  ];

  const publicLinks = [
    { to: "/", label: lang === "mr" ? "🏠 मुख्यपृष्ठ" : "🏠 Home" },
    { to: "/weather", label: t.weather },
    { to: "/schemes", label: t.schemes },
    {
      to: "/mandi",
      label: lang === "mr" ? "📊 मंडी भाव" : "📊 Mandi Prices",
    },
  ];

  // Mobile menu — grouped sections
  const mobileCoreLinks = user
    ? [
        { to: "/", label: lang === "mr" ? "🏠 मुख्यपृष्ठ" : "🏠 Home" },
        {
          to: "/dashboard",
          label: lang === "mr" ? "📊 डॅशबोर्ड" : "📊 Dashboard",
        },
        { to: "/marketplace", label: t.marketplace },
        { to: "/tractor", label: t.tractor },
        { to: "/labour", label: t.labour },
      ]
    : publicLinks;

  const mobileToolLinks = user
    ? [
        { to: "/weather", label: t.weather, icon: "🌤️" },
        { to: "/schemes", label: t.schemes, icon: "📋" },
        {
          to: "/mandi",
          label: lang === "mr" ? "📊 मंडी भाव" : "📊 Mandi Prices",
          icon: "📊",
        },
        {
          to: "/crop",
          label:
            t.crop || (lang === "mr" ? "पीक डॉक्टर" : "Crop Doctor"),
          icon: "🌿",
        },
        {
          to: "/community",
          label: lang === "mr" ? "👥 समुदाय" : "👥 Community",
          icon: "👥",
        },
        {
          to: "/messages",
          label: lang === "mr" ? "💬 संदेश" : "💬 Messages",
          icon: "💬",
        },
        {
          to: "/soil-health",
          label: lang === "mr" ? "🌱 माती आरोग्य" : "🌱 Soil Health",
          icon: "🌱",
        },
        {
          to: "/land-records",
          label: lang === "mr" ? "📜 जमीन नोंदी" : "📜 Land Records",
          icon: "📜",
        },
        {
          to: "/voice",
          label: lang === "mr" ? "🎙️ आवाज सहाय्यक" : "🎙️ Voice Assistant",
          icon: "🎙️",
        },
        {
          to: "/crop-disease",
          label: lang === "mr" ? "🔬 रोग शोध" : "🔬 Crop Disease",
          icon: "🔬",
        },
      ]
    : [];

  const isToolsActive = toolsLinks.some((l) => location.pathname === l.to);

  const roleColors = {
    farmer: "bg-green-100 text-green-800",
    tractor: "bg-yellow-100 text-yellow-800",
    labour: "bg-orange-100 text-orange-800",
    government: "bg-blue-100 text-blue-800",
  };

  const roleIcons = {
    farmer: "🌾",
    tractor: "🚜",
    labour: "👷",
    government: "🏛️",
  };

  return (
    <>
      <nav className="flex justify-between items-center px-4 md:px-10 py-3 bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        {/* Logo */}
        <Link
          to="/"
          className="text-green-700 font-bold text-lg flex items-center gap-2 flex-shrink-0 hover:opacity-90 transition-opacity duration-200"
        >
          <img
            src={logo}
            alt="Shetkari Mitra Logo"
            className="h-9 w-auto transition-transform duration-200 hover:scale-105"
          />
          <span className="hidden sm:inline">Shetkari Mitra</span>
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
                  className={`flex items-center gap-1 transition-all duration-200 font-medium px-2 py-1 rounded-lg ${
                    isToolsActive
                      ? "text-green-700 font-semibold bg-green-50"
                      : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  {lang === "mr" ? "🛠️ साधने" : "🛠️ Tools"}
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      toolsOpen ? "rotate-180" : ""
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {toolsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
                    {toolsLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setToolsOpen(false)}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-all duration-150 hover:bg-green-50 hover:pl-5 ${
                          isActive(link.to)
                            ? "text-green-700 font-semibold bg-green-50"
                            : "text-gray-700 hover:text-green-700"
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

        {/* Right controls */}
        <div className="flex gap-2 items-center">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="border border-gray-200 px-3 py-1.5 rounded-full text-sm text-gray-600 hover:border-green-400 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
          >
            🌐 {lang === "en" ? "मराठी" : "English"}
          </button>

          {user ? (
            <>
              {/* Messages icon with badge */}
              <Link
                to="/messages"
                className="relative hidden md:flex items-center p-1.5 rounded-full hover:bg-green-50 transition-all duration-200"
                title="Messages"
              >
                <span className="text-xl">💬</span>
                {chatUnread > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {chatUnread > 9 ? "9+" : chatUnread}
                  </span>
                )}
              </Link>

              {/* Role badge */}
              <span
                className={
                  "hidden md:flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold cursor-default " +
                  (roleColors[user.role] || "bg-gray-100 text-gray-700")
                }
              >
                {roleIcons[user.role]} {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-100 hover:border-red-300 hover:scale-105 transition-all duration-200"
              >
                {t.logout}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive("/login")
                    ? "text-green-700 font-semibold bg-green-50"
                    : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                }`}
              >
                {t.login}
              </Link>
              <Link
                to="/register"
                className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-700 hover:scale-105 hover:shadow-lg hover:shadow-green-200 transition-all duration-200"
              >
                {t.signup}
              </Link>
            </>
          )}

          {/* Hamburger button */}
          <button
            className="lg:hidden ml-1 w-9 h-9 flex flex-col justify-center items-center gap-1.5 rounded-lg hover:bg-green-50 transition-all duration-200 group"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-5 bg-gray-600 transition-all duration-300 group-hover:bg-green-600 ${
                menuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-gray-600 transition-all duration-300 group-hover:bg-green-600 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-gray-600 transition-all duration-300 group-hover:bg-green-600 ${
                menuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile menu drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-white shadow-2xl z-50 lg:hidden flex flex-col transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-green-50">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-8 w-auto" />
            <span className="font-bold text-green-700 text-base">
              Shetkari Mitra
            </span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200 shadow-sm text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto py-3 px-4">
          {/* User info on mobile */}
          {user && (
            <div
              className={
                "flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3 text-sm font-semibold " +
                (roleColors[user.role] || "bg-gray-100 text-gray-700")
              }
            >
              <span className="text-lg">{roleIcons[user.role]}</span>
              <div>
                <div className="font-bold">{user.name}</div>
                <div className="text-xs opacity-70 capitalize">{user.role}</div>
              </div>
            </div>
          )}

          {/* Main links */}
          <div className="mb-2">
            {user && (
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">
                Main
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {mobileCoreLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive(link.to)
                      ? "text-green-700 font-semibold bg-green-100"
                      : "text-gray-700 hover:text-green-700 hover:bg-green-50"
                  }`}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Tools links */}
          {user && mobileToolLinks.length > 0 && (
            <div className="mb-2 mt-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">
                🛠️ {lang === "mr" ? "साधने" : "Tools"}
              </p>
              <div className="flex flex-col gap-0.5">
                {mobileToolLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive(link.to)
                        ? "text-green-700 font-semibold bg-green-100"
                        : "text-gray-700 hover:text-green-700 hover:bg-green-50"
                    }`}
                  >
                    <span>{link.icon}</span>
                    {link.label}
                    {link.to === "/messages" && chatUnread > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                        {chatUnread}
                      </span>
                    )}
                    {isActive(link.to) && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer footer */}
        <div className="border-t border-gray-100 px-4 py-4 flex flex-col gap-2 bg-gray-50">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="w-full text-center border border-gray-200 px-3 py-2 rounded-xl text-sm text-gray-600 hover:border-green-400 hover:text-green-600 hover:bg-green-50 transition-all duration-200 font-medium"
          >
            🌐 {lang === "en" ? "मराठीत बदला" : "Switch to English"}
          </button>

          {user ? (
            <button
              onClick={handleLogout}
              className="w-full text-center bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-100 hover:border-red-300 transition-all duration-200"
            >
              🚪 {t.logout}
            </button>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:border-green-400 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
              >
                {t.login}
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="flex-1 text-center bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-all duration-200"
              >
                {t.signup}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}