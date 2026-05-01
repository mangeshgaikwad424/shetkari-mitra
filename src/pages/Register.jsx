import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LanguageContext } from "../context/LanguageContext";
import api from "../services/api";

const USER_TYPES = [
  { id: "farmer", label: "Farmer", labelMr: "शेतकरी", icon: "🌾" },
  { id: "tractor", label: "Tractor Owner", labelMr: "ट्रॅक्टर मालक", icon: "🚜" },
  { id: "labour", label: "Labour", labelMr: "मजूर", icon: "👷" },
  { id: "government", label: "Govt Official", labelMr: "सरकारी अधिकारी", icon: "🏛️" },
];

// ✅ Password validation
function validatePassword(pwd) {
  if (pwd.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(pwd)) return "Must include at least one uppercase letter";
  if (!/[a-z]/.test(pwd)) return "Must include at least one lowercase letter";
  if (!/[0-9]/.test(pwd)) return "Must include at least one number";
  if (!/[#@]/.test(pwd)) return "Must include # or @";
  return null;
}

export default function Register() {
  const [selectedRole, setSelectedRole] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [village, setVillage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { lang } = useContext(LanguageContext);
  const isMr = lang === "mr";

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!selectedRole) {
      setError(isMr ? "कृपया भूमिका निवडा" : "Please select a role");
      return;
    }

    if (!name || !email || !password || !phone) {
      setError(isMr ? "सर्व माहिती भरा" : "Please fill all required fields");
      return;
    }

    // ✅ Password validation
    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/register", {
        name,
        email,
        password,
        phone,
        village,
        role: selectedRole,
      });

      login(res.data.user, res.data.token);
      navigate("/dashboard");

    } catch (err) {
      setError(
        err.response?.data?.msg ||
        (isMr ? "नोंदणी अयशस्वी" : "Registration failed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-lg">

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-green-700 mb-2">
          🌱 Shetkari Mitra
        </h1>
        <p className="text-center text-gray-500 mb-6">
          {isMr ? "नवीन खाते तयार करा" : "Create your account"}
        </p>

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {USER_TYPES.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`p-3 rounded-xl border font-medium transition ${
                selectedRole === role.id
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-gray-50 text-gray-600 hover:border-green-400"
              }`}
            >
              {role.icon} {isMr ? role.labelMr : role.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">

          <input
            type="text"
            placeholder={isMr ? "पूर्ण नाव" : "Full Name"}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Mobile Number"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
          />

          <input
            type="text"
            placeholder={isMr ? "गाव / शहर" : "Village / City"}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
            value={village}
            onChange={(e) => setVillage(e.target.value)}
          />

          {/* Password */}
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

          {/* Password Rules */}
          <div className="text-xs text-gray-500 bg-gray-50 border rounded-lg p-3">
            <p className="font-semibold mb-1">🔐 Password must contain:</p>
            <ul className="space-y-1">
              <li>• Minimum 8 characters</li>
              <li>• One uppercase letter (A–Z)</li>
              <li>• One lowercase letter (a–z)</li>
              <li>• One number (0–9)</li>
              <li>• One special character (# or @)</li>
            </ul>
          </div>

          {/* Live Strength */}
          {password && (
            <p className="text-xs text-gray-500">
              Strength: {
                password.length >= 8 &&
                /[A-Z]/.test(password) &&
                /[a-z]/.test(password) &&
                /[0-9]/.test(password) &&
                /[#@]/.test(password)
                  ? "Strong ✅"
                  : "Weak ❌"
              }
            </p>
          )}

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
            {loading
              ? (isMr ? "नोंदणी होत आहे..." : "Creating account...")
              : (isMr ? "नोंदणी करा" : "Register")}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-5">
          {isMr ? "आधीच खाते आहे?" : "Already have an account?"}{" "}
          <Link to="/login" className="text-green-600 hover:underline font-medium">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}