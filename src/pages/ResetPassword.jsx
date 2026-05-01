import { useState, useContext, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import api from "../services/api";

/**
 * ResetPassword — handles the link from the "Forgot Password" email.
 * URL: /reset-password/:token
 * Calls POST /api/auth/reset-password/:token with the new password.
 */
export default function ResetPassword() {
  const { token } = useParams();
  const { lang } = useContext(LanguageContext);
  const isMr = lang === "mr";
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // If no token in URL, show error immediately
  useEffect(() => {
    if (!token) setError(isMr ? "अवैध रीसेट लिंक." : "Invalid reset link.");
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError(isMr ? "पासवर्ड किमान ६ अक्षरांचा असावा" : "Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError(isMr ? "पासवर्ड जुळत नाही" : "Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setDone(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || (isMr ? "रीसेट अयशस्वी. लिंक कदाचित कालबाह्य झाली आहे." : "Reset failed. The link may have expired."));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-green-700 flex items-center justify-center gap-2 mb-2">
            🌱 Shetkari Mitra
          </Link>
          <h2 className="text-2xl font-bold text-gray-800">{isMr ? "नवीन पासवर्ड सेट करा" : "Set New Password"}</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {done ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{isMr ? "पासवर्ड बदलला!" : "Password Updated!"}</h3>
              <p className="text-gray-500 text-sm">{isMr ? "तुम्हाला आता लॉगिन पानावर पुनर्निर्देशित केले जाईल..." : "Redirecting you to login..."}</p>
              <Link to="/login" className="mt-4 inline-block text-green-600 font-semibold hover:underline">
                {isMr ? "आत्ता लॉगिन करा" : "Login now"}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isMr ? "नवीन पासवर्ड *" : "New Password *"}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder={isMr ? "किमान ६ अक्षरे" : "Minimum 6 characters"}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isMr ? "पासवर्ड पुन्हा टाका *" : "Confirm Password *"}
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                  placeholder={isMr ? "पुन्हा टाका" : "Repeat password"}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">⚠️ {error}</div>
              )}

              <button
                type="submit"
                disabled={loading || !password || !confirm}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-60"
              >
                {loading ? (isMr ? "अपडेट होत आहे..." : "Updating...") : (isMr ? "पासवर्ड बदला" : "Update Password")}
              </button>

              <p className="text-center text-sm text-gray-500">
                <Link to="/login" className="text-green-600 hover:underline font-medium">
                  {isMr ? "← लॉगिनवर परत" : "← Back to Login"}
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
