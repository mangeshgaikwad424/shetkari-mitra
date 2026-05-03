import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext";
import api from "../services/api";

export default function ForgotPassword() {
  const { lang } = useContext(LanguageContext);
  const isMr = lang === "mr";

  const [method, setMethod] = useState("email"); // "email" | "phone"
  const [step, setStep] = useState("input");     // "input" | "otp" | "newpass" | "done"

  // Email flow
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // Phone flow
  const [phone, setPhone] = useState("");
  const [resetToken, setResetToken] = useState(""); // returned after OTP verify
  const [enteredOtp, setEnteredOtp] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");

  // New password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passError, setPassError] = useState("");

  const [loading, setLoading] = useState(false);

  // ─── EMAIL FLOW ───────────────────────────────────────────────────────────────
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    if (!email) { setEmailError(isMr ? "ईमेल टाका" : "Please enter your email"); return; }

    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setStep("done");
    } catch (err) {
      setEmailError(err.response?.data?.msg || "Cannot connect to server. Make sure your backend is running.");
    }
    setLoading(false);
  };

  // ─── PHONE FLOW — Send OTP ────────────────────────────────────────────────────
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setPhoneError("");
    if (!phone || phone.length < 10) {
      setPhoneError(isMr ? "वैध मोबाईल नंबर टाका" : "Enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/send-otp", { phone });
      setStep("otp");
    } catch (err) {
      setPhoneError(err.response?.data?.msg || "Cannot connect to server. Make sure your backend is running.");
    }
    setLoading(false);
  };

  // ─── PHONE FLOW — Verify OTP ──────────────────────────────────────────────────
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setOtpError("");
    if (enteredOtp.length < 6) { setOtpError(isMr ? "6 अंकी OTP टाका" : "Enter the 6-digit OTP"); return; }

    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", { phone, otp: enteredOtp });
      setResetToken(res.data.resetToken);
      setStep("newpass");
    } catch (err) {
      setOtpError(err.response?.data?.msg || "Cannot connect to server. Make sure your backend is running.");
    }
    setLoading(false);
  };

  // ─── SET NEW PASSWORD ─────────────────────────────────────────────────────────
  const handleSetPassword = async (e) => {
    e.preventDefault();
    setPassError("");
    if (newPassword.length < 6) { setPassError(isMr ? "पासवर्ड किमान ६ अक्षरांचा असावा" : "Password must be at least 6 characters"); return; }
    if (newPassword !== confirmPassword) { setPassError(isMr ? "पासवर्ड जुळत नाही" : "Passwords do not match"); return; }

    setLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${resetToken}`, { password: newPassword });
      setStep("done");
    } catch (err) {
      setPassError(err.response?.data?.msg || "Cannot connect to server. Make sure your backend is running.");
    }
    setLoading(false);
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-green-700 flex items-center justify-center gap-2 mb-2">
            🌱 Shetkari Mitra
          </Link>
          <h2 className="text-2xl font-bold text-gray-800">{isMr ? "पासवर्ड रीसेट करा" : "Reset Password"}</h2>
          <p className="text-gray-500 text-sm mt-1">{isMr ? "खाली पर्याय निवडा" : "Choose how to reset your password"}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">

          {/* ── DONE ── */}
          {step === "done" && (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">{method === "email" ? "📬" : "✅"}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {method === "email"
                  ? (isMr ? "ईमेल पाठवला!" : "Email Sent!")
                  : (isMr ? "पासवर्ड बदलला!" : "Password Reset!")}
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                {method === "email"
                  ? (isMr ? `${email} वर रीसेट लिंक पाठवली आहे. तुमचा इनबॉक्स तपासा.` : `We've sent a reset link to ${email}. Check your inbox.`)
                  : (isMr ? "तुमचा पासवर्ड यशस्वीरित्या बदलला आहे." : "Your password has been successfully updated. You can now login.")}
              </p>
              <Link to="/login" className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors inline-block">
                {isMr ? "लॉगिनवर परत जा" : "Back to Login"}
              </Link>
            </div>
          )}

          {/* ── INPUT (Email or Phone) ── */}
          {step === "input" && (
            <>
              {/* Method toggle */}
              <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
                <button
                  onClick={() => { setMethod("email"); setEmailError(""); setPhoneError(""); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${method === "email" ? "bg-white shadow text-green-700" : "text-gray-500"}`}
                >
                  ✉️ {isMr ? "ईमेल" : "Email"}
                </button>
                <button
                  onClick={() => { setMethod("phone"); setEmailError(""); setPhoneError(""); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${method === "phone" ? "bg-white shadow text-green-700" : "text-gray-500"}`}
                >
                  📱 {isMr ? "फोन OTP" : "Phone OTP"}
                </button>
              </div>

              {/* Email Form */}
              {method === "email" && (
                <form onSubmit={handleEmailSubmit} className="space-y-5">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                    🔐 {isMr ? "फक्त नोंदणीकृत ईमेलवरच रीसेट लिंक पाठवली जाईल." : "Reset link will only be sent to your registered email."}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isMr ? "नोंदणीकृत ईमेल" : "Registered Email"}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                      placeholder={isMr ? "तुमचा ईमेल टाका" : "Enter your registered email"}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-sm ${emailError ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                    />
                    {emailError && <p className="text-red-500 text-xs mt-1.5">⚠️ {emailError}</p>}
                  </div>
                  <button type="submit" disabled={loading || !email}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-60">
                    {loading ? (isMr ? "पाठवत आहे..." : "Sending...") : (isMr ? "रीसेट लिंक पाठवा" : "Send Reset Link")}
                  </button>
                </form>
              )}

              {/* Phone Form */}
              {method === "phone" && (
                <form onSubmit={handlePhoneSubmit} className="space-y-5">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
                    📱 {isMr ? "फक्त नोंदणीकृत मोबाईल नंबरवर OTP पाठवला जाईल." : "OTP will be sent only to your registered phone number via SMS."}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {isMr ? "नोंदणीकृत मोबाईल नंबर" : "Registered Phone Number"}
                    </label>
                    <div className="flex gap-2">
                      <span className="flex items-center px-3 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setPhoneError(""); }}
                        placeholder="9876543210"
                        className={`flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-sm ${phoneError ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                      />
                    </div>
                    {phoneError && <p className="text-red-500 text-xs mt-1.5">⚠️ {phoneError}</p>}
                  </div>
                  <button type="submit" disabled={loading || phone.length < 10}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-60">
                    {loading ? (isMr ? "पाठवत आहे..." : "Sending OTP...") : (isMr ? "OTP पाठवा" : "Send OTP")}
                  </button>
                </form>
              )}
            </>
          )}

          {/* ── OTP VERIFY ── */}
          {step === "otp" && (
            <form onSubmit={handleOtpVerify} className="space-y-5">
              <div className="text-center">
                <div className="text-4xl mb-2">📲</div>
                <p className="text-gray-700 font-semibold">{isMr ? "OTP पडताळणी" : "OTP Verification"}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {isMr ? `+91 ${phone} वर SMS पाठवला आहे` : `OTP sent via SMS to +91 ${phone}`}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isMr ? "6 अंकी OTP टाका" : "Enter 6-digit OTP"}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={enteredOtp}
                  onChange={(e) => { setEnteredOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setOtpError(""); }}
                  placeholder="• • • • • •"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-center tracking-[0.5em] font-mono text-xl ${otpError ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                />
                {otpError && <p className="text-red-500 text-xs mt-1.5 text-center">⚠️ {otpError}</p>}
              </div>
              <button type="submit" disabled={loading || enteredOtp.length < 6}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-60">
                {loading ? (isMr ? "तपासत आहे..." : "Verifying...") : (isMr ? "OTP पडताळा" : "Verify OTP")}
              </button>
              <button type="button" onClick={() => { setStep("input"); setEnteredOtp(""); setOtpError(""); }}
                className="w-full text-sm text-gray-500 hover:text-gray-700">
                ← {isMr ? "मागे जा / OTP पुन्हा पाठवा" : "Go back / Resend OTP"}
              </button>
            </form>
          )}

          {/* ── NEW PASSWORD ── */}
          {step === "newpass" && (
            <form onSubmit={handleSetPassword} className="space-y-5">
              <div className="text-center">
                <div className="text-4xl mb-2">🔒</div>
                <p className="text-gray-700 font-semibold">{isMr ? "नवीन पासवर्ड सेट करा" : "Set New Password"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isMr ? "नवीन पासवर्ड" : "New Password"}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setPassError(""); }}
                  placeholder={isMr ? "किमान ६ अक्षरे" : "Minimum 6 characters"}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {isMr ? "पासवर्ड पुन्हा टाका" : "Confirm Password"}
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setPassError(""); }}
                  placeholder={isMr ? "पासवर्ड पुन्हा टाका" : "Repeat your new password"}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 text-sm ${passError ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                />
                {passError && <p className="text-red-500 text-xs mt-1.5">⚠️ {passError}</p>}
              </div>
              <button type="submit" disabled={loading || !newPassword || !confirmPassword}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-60">
                {loading ? (isMr ? "अपडेट होत आहे..." : "Updating...") : (isMr ? "पासवर्ड बदला" : "Update Password")}
              </button>
            </form>
          )}

          {step !== "done" && (
            <p className="text-center text-sm text-gray-500 mt-5">
              <Link to="/login" className="text-green-600 hover:underline font-medium">
                {isMr ? "← लॉगिनवर परत" : "← Back to Login"}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}