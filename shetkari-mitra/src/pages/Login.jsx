import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LanguageContext } from "../context/LanguageContext";
import api from "../services/api";

export default function Login() {
  const { lang } = useContext(LanguageContext);

  const USER_TYPES = [
    { id: "farmer", label: lang === "mr" ? "शेतकरी" : "Farmer", icon: "🌾" },
    { id: "tractor", label: lang === "mr" ? "ट्रॅक्टर मालक" : "Tractor Owner", icon: "🚜" },
    { id: "labour", label: lang === "mr" ? "मजूर" : "Labour", icon: "👷" },
    { id: "government", label: lang === "mr" ? "सरकारी अधिकारी" : "Govt Official", icon: "🏛️" },
  ];

  const [selectedRole, setSelectedRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (typeof e?.preventDefault === "function") e.preventDefault();

    if (!selectedRole) {
      setError(lang === "mr" ? "कृपया भूमिका निवडा" : "Please select a role");
      return;
    }

    if (!email || !password) {
      setError(lang === "mr" ? "कृपया सर्व फील्ड भरा" : "Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/login", { email, password });

      if (res.data.user.role !== selectedRole) {
        setError(
          lang === "mr"
            ? "नोंदणीकृत भूमिकेशी जुळत नाही"
            : "Role does not match your account"
        );
        setLoading(false);
        return;
      }

      login(res.data.user, res.data.token);
      navigate("/dashboard");

    } catch (err) {
      setError(
        err.response?.data?.msg ||
        (lang === "mr" ? "लॉगिन अयशस्वी" : "Login failed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
      padding: "16px",
      boxSizing: "border-box",
    }}>
      <div style={{
        background: "#fff",
        boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
        borderRadius: 24,
        padding: "28px 20px",
        width: "100%",
        maxWidth: 420,
        boxSizing: "border-box",
      }}>

        {/* Logo / Title */}
        <h1 style={{ fontSize: "clamp(22px, 6vw, 30px)", fontWeight: 800, textAlign: "center", color: "#15803d", margin: 0 }}>
          🌱 Shetkari Mitra
        </h1>
        <p style={{ textAlign: "center", color: "#6b7280", marginTop: 6, marginBottom: 20, fontSize: 14 }}>
          {lang === "mr" ? "आपल्या खात्यात लॉगिन करा" : "Access your account"}
        </p>

        {/* Role Selection */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {USER_TYPES.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              style={{
                padding: "10px 8px",
                borderRadius: 12,
                border: selectedRole === role.id ? "2px solid #16a34a" : "2px solid #e5e7eb",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                background: selectedRole === role.id ? "#16a34a" : "#f9fafb",
                color: selectedRole === role.id ? "#fff" : "#4b5563",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <span style={{ fontSize: 18 }}>{role.icon}</span>
              <span>{role.label}</span>
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          <input
            type="email"
            placeholder="Email address"
            style={{
              width: "100%", padding: "12px 14px", border: "1.5px solid #e5e7eb",
              borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box",
              fontFamily: "inherit",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              style={{
                width: "100%", padding: "12px 44px 12px 14px", border: "1.5px solid #e5e7eb",
                borderRadius: 12, fontSize: 14, outline: "none", boxSizing: "border-box",
                fontFamily: "inherit",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                cursor: "pointer", fontSize: 18, lineHeight: 1,
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              color: "#dc2626", fontSize: 13, background: "#fef2f2",
              border: "1px solid #fecaca", padding: "10px 12px", borderRadius: 10,
            }}>
              {error}
            </div>
          )}

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%", background: loading ? "#9ca3af" : "#16a34a",
              color: "#fff", padding: "13px", borderRadius: 12,
              fontWeight: 700, fontSize: 15, border: "none", cursor: loading ? "not-allowed" : "pointer",
              marginTop: 4, fontFamily: "inherit",
            }}
          >
            {loading ? "Please wait..." : "Login"}
          </button>
        </div>

        {/* Links */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, fontSize: 13 }}>
          <Link to="/forgot" style={{ color: "#16a34a", textDecoration: "none", fontWeight: 600 }}>
            Forgot Password?
          </Link>
          <Link to="/register" style={{ color: "#16a34a", textDecoration: "none", fontWeight: 600 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}