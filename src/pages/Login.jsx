
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
    e.preventDefault();

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md">

        {/* Logo / Title */}
        <h1 className="text-3xl font-bold text-center text-green-700">
          🌱 Shetkari Mitra
        </h1>
        <p className="text-center text-gray-500 mt-2 mb-6">
          {lang === "mr" ? "आपल्या खात्यात लॉगिन करा" : "Access your account"}
        </p>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {USER_TYPES.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`p-3 rounded-xl border font-medium transition ${selectedRole === role.id
                  ? "bg-green-600 text-white border-green-600 shadow-md"
                  : "bg-gray-50 text-gray-600 hover:border-green-400"
                }`}
            >
              {role.icon} {role.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email address"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 cursor-pointer text-gray-500"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 p-2 rounded-lg">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>

        {/* Links */}
        <div className="flex justify-between mt-5 text-sm">
          <Link to="/forgot" className="text-green-600 hover:underline">
            Forgot Password?
          </Link>
          <Link to="/register" className="text-green-600 hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}