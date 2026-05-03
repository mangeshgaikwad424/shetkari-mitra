import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function ForgotPassword() {
  const { lang } = useContext(LanguageContext);
  const isMr = lang === "mr";
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  // Steps: "input" → "otp"
  const [step, setStep] = useState("input");

  // Step 1 state
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // Step 2 state
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const [loading, setLoading] = useState(false);

  // ─── Step 1: Send OTP ───────────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setEmailError("");

    if (!email) {
      setEmailError(isMr ? "कृपया ईमेल टाका" : "Please enter your email");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/send-email-otp", { email });
      setStep("otp");
    } catch (err) {
      setEmailError(
        err.response?.data?.msg ||
          (isMr
            ? "OTP पाठवता आला नाही. पुन्हा प्रयत्न करा."
            : "Failed to send OTP. Please try again.")
      );
    }
    setLoading(false);
  };

  // ─── Step 2: Verify OTP → login ────────────────────────────────────────────
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError("");

    if (otp.length < 6) {
      setOtpError(isMr ? "6 अंकी OTP टाका" : "Enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/verify-email-otp", { email, otp });
      const { token, user } = res.data;

      // Save token + login via AuthContext (mirrors normal login)
      authLogin(user, token);

      // Redirect to dashboard immediately
      navigate("/dashboard");
    } catch (err) {
      setOtpError(
        err.response?.data?.msg ||
          (isMr ? "OTP चुकीचा आहे किंवा कालबाह्य झाला." : "Incorrect or expired OTP.")
      );
    }
    setLoading(false);
  };

  // ─── Resend OTP ─────────────────────────────────────────────────────────────
  const handleResend = async () => {
    setOtpError("");
    setOtp("");
    setLoading(true);
    try {
      await api.post("/auth/send-email-otp", { email });
    } catch (err) {
      setOtpError(
        err.response?.data?.msg ||
          (isMr ? "OTP पुन्हा पाठवता आला नाही." : "Could not resend OTP.")
      );
    }
    setLoading(false);
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Brand header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-3xl font-bold text-green-700 flex items-center justify-center gap-2 mb-2"
          >
            🌱 Shetkari Mitra
          </Link>
          <h2 className="text-2xl font-bold text-gray-800">
            {isMr ? "OTP ने लॉगिन करा" : "Login with OTP"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {step === "input"
              ? isMr
                ? "तुमचा नोंदणीकृत ईमेल टाका"
                : "Enter your registered email to receive an OTP"
              : isMr
              ? `${email} वर OTP पाठवला आहे`
              : `OTP sent to ${email}`}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">

          {/* ── Step indicator ── */}
          <div className="flex items-center justify-center gap-3 mb-7">
            {/* Step 1 dot */}
            <div className="flex items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === "input"
                    ? "bg-green-600 text-white shadow-md shadow-green-200"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {step === "otp" ? "✓" : "1"}
              </div>
              <span className={`text-xs font-medium ${step === "input" ? "text-green-700" : "text-gray-400"}`}>
                {isMr ? "ईमेल" : "Email"}
              </span>
            </div>
            <div className="flex-1 h-px bg-gray-200 max-w-[40px]" />
            {/* Step 2 dot */}
            <div className="flex items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === "otp"
                    ? "bg-green-600 text-white shadow-md shadow-green-200"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                2
              </div>
              <span className={`text-xs font-medium ${step === "otp" ? "text-green-700" : "text-gray-400"}`}>
                {isMr ? "OTP" : "OTP"}
              </span>
            </div>
          </div>

          {/* ══ STEP 1: Email input ══ */}
          {step === "input" && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-sm text-amber-700 flex gap-2">
                <span>🔐</span>
                <span>
                  {isMr
                    ? "फक्त नोंदणीकृत ईमेलवरच OTP पाठवला जाईल."
                    : "OTP will be sent only to your registered email address."}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {isMr ? "नोंदणीकृत ईमेल" : "Registered Email"}
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  placeholder={isMr ? "तुमचा ईमेल टाका" : "Enter your registered email"}
                  autoComplete="email"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-sm transition-colors ${
                    emailError ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                  }`}
                />
                {emailError && (
                  <p className="text-red-500 text-xs mt-1.5 flex gap-1 items-center">
                    <span>⚠️</span> {emailError}
                  </p>
                )}
              </div>

              <button
                id="send-otp-btn"
                type="submit"
                disabled={loading || !email}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {isMr ? "पाठवत आहे..." : "Sending..."}
                  </>
                ) : (
                  <>📧 {isMr ? "OTP पाठवा" : "Send OTP"}</>
                )}
              </button>
            </form>
          )}

          {/* ══ STEP 2: OTP verification ══ */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              {/* Info banner */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-3.5 text-sm text-green-800 flex gap-2">
                <span>✉️</span>
                <div>
                  <p className="font-semibold">
                    {isMr ? "OTP पाठवला आहे!" : "OTP Sent!"}
                  </p>
                  <p className="text-xs text-green-600 mt-0.5">
                    {isMr
                      ? `${email} वर 6 अंकी OTP पाठवला आहे. 10 मिनिटांत वापरा.`
                      : `A 6-digit OTP was sent to ${email}. Valid for 10 minutes.`}
                  </p>
                </div>
              </div>

              {/* OTP input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {isMr ? "6 अंकी OTP टाका" : "Enter 6-digit OTP"}
                </label>
                <input
                  id="otp-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                    setOtpError("");
                  }}
                  placeholder="• • • • • •"
                  autoFocus
                  className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-center tracking-[0.6em] font-mono text-2xl font-bold transition-colors ${
                    otpError ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                  }`}
                />
                {otpError && (
                  <p className="text-red-500 text-xs mt-1.5 flex gap-1 items-center justify-center">
                    <span>⚠️</span> {otpError}
                  </p>
                )}
              </div>

              {/* Verify button */}
              <button
                id="verify-otp-btn"
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    {isMr ? "पडताळत आहे..." : "Verifying..."}
                  </>
                ) : (
                  <>✅ {isMr ? "OTP पडताळा आणि लॉगिन करा" : "Verify & Login"}</>
                )}
              </button>

              {/* Resend + back controls */}
              <div className="flex items-center justify-between text-sm pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep("input");
                    setOtp("");
                    setOtpError("");
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ← {isMr ? "मागे जा" : "Go back"}
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-green-600 hover:text-green-800 font-medium transition-colors disabled:opacity-50"
                >
                  🔄 {isMr ? "OTP पुन्हा पाठवा" : "Resend OTP"}
                </button>
              </div>
            </form>
          )}

          {/* Back to login link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            <Link
              to="/login"
              className="text-green-600 hover:text-green-800 hover:underline font-medium transition-colors"
            >
              {isMr ? "← लॉगिनवर परत" : "← Back to Login"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}