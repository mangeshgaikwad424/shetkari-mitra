// import User from "../models/User.js";
// import ActivityLog from "../models/ActivityLog.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import crypto from "crypto";
// import axios from "axios";
// import emailService from "../utils/emailService.js";

// // ─── OTP STORE (in-memory for demo; use Redis in production) ─────────────────
// const otpStore = new Map(); // phone -> { otp, expires }
// const emailOtpStore = new Map(); // email -> { otp, expires }

// // ─── REGISTER ─────────────────────────────────────────────────────────────────
// export const register = async (req, res) => {
//   try {
//     const { name, email, password, role, phone, village } = req.body;

//     // Check if email already exists
//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ msg: "Email already registered" });

//     // Check if phone already exists (if provided)
//     if (phone) {
//       const existingPhone = await User.findOne({ phone });
//       if (existingPhone) return res.status(400).json({ msg: "Phone number already registered" });
//     }

//     const hashed = await bcrypt.hash(password, 10);
//     const user = await User.create({ name, email, password: hashed, role, phone, village });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "SECRET", { expiresIn: "7d" });

//       console.log(`📧 Sending welcome email to ${email}...`);
//       await emailService.sendWelcomeEmail({
//         name,
//         email,
//         role,
//         phone,
//         village,
//       });
//       console.log(`✅ Welcome email sent to ${email}`);
//     } catch (emailErr) {
//       console.error("❌ Welcome email failed:", emailErr.message);
//       // Don't fail registration if email fails
//     }

//     // Log registration activity
//     await ActivityLog.create({
//       userId: user._id.toString(),
//       userEmail: email,
//       userName: name,
//       userRole: role,
//       action: "register",
//       description: `New ${role} account registered: ${name} (${email})`,
//       metadata: { village, phone },
//     });

//     res.json({ token, user });
//   } catch (err) {
//     res.status(500).json({ msg: "Registration failed", error: err.message });
//   }
// };

// // ─── GET ME ───────────────────────────────────────────────────────────────────
// export const getMe = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) return res.status(404).json({ msg: "User not found" });
//     res.json({ user });
//   } catch (err) {
//     res.status(500).json({ msg: "Server error", error: err.message });
//   }
// };

// // ─── LOGIN ────────────────────────────────────────────────────────────────────
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ msg: "Email not registered" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "SECRET", { expiresIn: "7d" });

//     // Log login activity
//     await ActivityLog.create({
//       userId: user._id.toString(),
//       userEmail: user.email,
//       userName: user.name,
//       userRole: user.role,
//       action: "login",
//       description: `${user.name} (${user.role}) logged in`,
//       metadata: {},
//     });

//     res.json({ token, user });
//   } catch (err) {
//     res.status(500).json({ msg: "Login failed", error: err.message });
//   }
// };

// // ─── FORGOT PASSWORD (Email — Send OTP) ──────────────────────────────────────
// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     // Only send to registered emails
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ msg: "Email not registered. Please check the email or register first." });

//     // Generate OTP
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     emailOtpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 }); // 10 min

//     // Send email with OTP
//     try {
//       console.log(`📧 Attempting to send OTP email to ${email}...`);
//       await emailService.sendPasswordResetOTP(user, otp);
//       console.log(`✅ OTP email sent successfully to ${email}`);
//     } catch (emailErr) {
//       console.error("❌ OTP email failed:", emailErr.message);
//       console.error("   Stack:", emailErr.stack);
//       return res.status(500).json({ msg: "Failed to send OTP email. Check server logs for details.", error: emailErr.message });
//     }

//     res.json({ msg: "OTP sent to your registered email. Valid for 10 minutes." });
//   } catch (err) {
//     console.error("forgotPassword error:", err);
//     res.status(500).json({ msg: "Failed to send OTP. Please try again.", error: err.message });
//   }
// };

// // ─── FORGOT PASSWORD (Email — Verify OTP) ─────────────────────────────────────
// export const verifyEmailOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     const stored = emailOtpStore.get(email);
//     if (!stored) return res.status(400).json({ msg: "OTP expired or not found. Please request again." });
//     if (Date.now() > stored.expires) {
//       emailOtpStore.delete(email);
//       return res.status(400).json({ msg: "OTP expired. Please request a new one." });
//     }
//     if (stored.otp !== otp) return res.status(400).json({ msg: "Incorrect OTP." });

//     // Issue a short-lived reset token
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ msg: "User not found" });

//     const resetToken = crypto.randomBytes(32).toString("hex");
//     user.resetToken = resetToken;
//     user.resetTokenExpire = Date.now() + 5 * 60 * 1000; // 5 min to set new password
//     await user.save();
//     emailOtpStore.delete(email);

//     res.json({ msg: "OTP verified", resetToken });
//   } catch (err) {
//     res.status(500).json({ msg: "OTP verification failed", error: err.message });
//   }
// };

// // ─── FORGOT PASSWORD (Phone — Send OTP) ───────────────────────────────────────
// export const sendPhoneOtp = async (req, res) => {
//   try {
//     const { phone } = req.body;
//     if (!phone) return res.status(400).json({ msg: "Phone number required" });

//     // Only for registered users
//     const user = await User.findOne({ phone });
//     if (!user) return res.status(404).json({ msg: "This phone number is not registered." });

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     otpStore.set(phone, { otp, expires: Date.now() + 10 * 60 * 1000 }); // 10 min

//     // Send real SMS via Fast2SMS (works in BOTH development and production)
//     if (!process.env.FAST2SMS_API_KEY) {
//       // Fallback: log to console if no API key configured
//       console.log("\n📱 ═══════════════════════════════════════════");
//       console.log("   SMS OTP (No API Key - Console Fallback)");
//       console.log(`   To: +91 ${phone}`);
//       console.log(`   ⭐ OTP: ${otp}`);
//       console.log("═══════════════════════════════════════════\n");
//       return res.json({ msg: "OTP generated (set FAST2SMS_API_KEY in .env to send real SMS)" });
//     }

//     try {
//       console.log(`📱 Sending SMS OTP to +91${phone} via Fast2SMS...`);
//       const smsResponse = await axios.post(
//         "https://www.fast2sms.com/dev/bulkV2",
//         {
//           message: `Your Shetkari Mitra OTP is ${otp}. Valid for 10 minutes. Do not share with anyone.`,
//           language: "english",
//           route: "q",
//           numbers: phone,
//         },
//         {
//           headers: {
//             authorization: process.env.FAST2SMS_API_KEY.trim(),
//           },
//         }
//       );
//       console.log(`✅ SMS OTP sent to +91${phone}`, smsResponse.data);
//       res.json({ msg: "OTP sent to your registered mobile number" });
//     } catch (smsErr) {
//       console.error("❌ Fast2SMS error:", smsErr.response?.data || smsErr.message);
//       return res.status(500).json({ msg: "Failed to send SMS OTP", error: smsErr.response?.data?.message || smsErr.message });
//     }
//   } catch (err) {
//     console.error("sendPhoneOtp error:", err);
//     res.status(500).json({ msg: "Failed to send OTP", error: err.message });
//   }
// };

// // ─── FORGOT PASSWORD (Phone — Verify OTP) ─────────────────────────────────────
// export const verifyPhoneOtp = async (req, res) => {
//   try {
//     const { phone, otp } = req.body;

//     const stored = otpStore.get(phone);
//     if (!stored) return res.status(400).json({ msg: "OTP expired or not found. Please request again." });
//     if (Date.now() > stored.expires) {
//       otpStore.delete(phone);
//       return res.status(400).json({ msg: "OTP expired. Please request a new one." });
//     }
//     if (stored.otp !== otp) return res.status(400).json({ msg: "Incorrect OTP." });

//     // Issue a short-lived reset token
//     const user = await User.findOne({ phone });
//     if (!user) return res.status(404).json({ msg: "User not found" });

//     const resetToken = crypto.randomBytes(32).toString("hex");
//     user.resetToken = resetToken;
//     user.resetTokenExpire = Date.now() + 5 * 60 * 1000; // 5 min to set new password
//     await user.save();
//     otpStore.delete(phone);

//     console.log(`✅ Phone OTP verified for ${phone}`);
//     res.json({ msg: "OTP verified", resetToken });
//   } catch (err) {
//     console.error("verifyPhoneOtp error:", err);
//     res.status(500).json({ msg: "OTP verification failed", error: err.message });
//   }
// };

// // ─── RESET PASSWORD ───────────────────────────────────────────────────────────
// export const resetPassword = async (req, res) => {
//   try {
//     const user = await User.findOne({
//       resetToken: req.params.token,
//       resetTokenExpire: { $gt: Date.now() },
//     });

//     if (!user) return res.status(400).json({ msg: "Invalid or expired reset link." });

//     user.password = await bcrypt.hash(req.body.password, 10);
//     user.resetToken = undefined;
//     user.resetTokenExpire = undefined;
//     await user.save();

//     // Send password reset confirmation email
//     try {
//       await emailService.sendPasswordResetConfirmation(user);
//       console.log(`✅ Password reset confirmation sent to ${user.email}`);
//     } catch (emailErr) {
//       console.error("❌ Password confirmation email failed:", emailErr.message);
//       // Don't fail the request if email fails
//     }

//     res.json({ msg: "Password reset successful. You can now login." });
//   } catch (err) {
//     res.status(500).json({ msg: "Password reset failed", error: err.message });
//   }
// };


import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import axios from "axios";
import emailService from "../utils/emailService.js";

// OTP Stores
const otpStore = new Map();
const emailOtpStore = new Map();

// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, village } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ msg: "Email already registered" });

    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone)
        return res
          .status(400)
          .json({ msg: "Phone number already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      phone,
      village,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "SECRET",
      { expiresIn: "7d" }
    );

    // Send welcome email
    console.log("Sending welcome email to:", email);

    try {
      await emailService.sendWelcomeEmail({
        name,
        email,
        role,
        phone,
        village,
      });
      console.log("Welcome email sent");
    } catch (err) {
      console.log("Email failed:", err.message);
    }

    await ActivityLog.create({
      userId: user._id.toString(),
      userEmail: email,
      userName: name,
      userRole: role,
      action: "register",
      description: "User registered",
    });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Registration failed" });
  }
};

// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Email not registered" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "SECRET",
      { expiresIn: "7d" }
    );

    await ActivityLog.create({
      userId: user._id.toString(),
      userEmail: user.email,
      userName: user.name,
      userRole: user.role,
      action: "login",
      description: "User logged in",
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ msg: "Login failed" });
  }
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ msg: "Email not registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    emailOtpStore.set(email, {
      otp,
      expires: Date.now() + 10 * 60 * 1000,
    });

    try {
      await emailService.sendPasswordResetOTP(user, otp);
      console.log("OTP email sent");
    } catch (err) {
      console.error("Email error:", err.message);
      return res.status(500).json({ msg: "Email sending failed" });
    }

    res.json({ msg: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= SEND EMAIL OTP (for direct login) =================
export const sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email is required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ msg: "Email not registered. Please register first." });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Persist OTP in MongoDB (survives server restarts)
    user.emailOtp = otp;
    user.emailOtpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save();

    // Send OTP email via existing Nodemailer setup
    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #f9fafb; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #16a34a, #15803d); padding: 32px 24px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 26px;">🌱 Shetkari Mitra</h1>
          <p style="color: #bbf7d0; margin: 8px 0 0; font-size: 14px;">शेतकरी मित्र — Login OTP</p>
        </div>
        <div style="padding: 32px 24px;">
          <p style="color: #374151; font-size: 15px; margin: 0 0 8px;">Hello <strong>${user.name}</strong>,</p>
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 24px;">Use the OTP below to log in. It is valid for <strong>10 minutes</strong>.</p>
          <div style="background: #f0fdf4; border: 2px dashed #16a34a; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <p style="color: #15803d; font-size: 36px; font-weight: 900; letter-spacing: 10px; margin: 0;">${otp}</p>
          </div>
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">Do not share this OTP with anyone. If you did not request this, please ignore this email.</p>
        </div>
        <div style="background: #f3f4f6; padding: 16px 24px; text-align: center;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Shetkari Mitra. All rights reserved.</p>
        </div>
      </div>
    `;

    try {
      await emailService.sendEmail({
        to: email,
        subject: "🌱 Shetkari Mitra - Your Login OTP",
        html,
      });
      console.log(`✅ Email OTP sent to ${email}`);
    } catch (emailErr) {
      console.error("❌ Email OTP send failed:", emailErr.message);
      return res.status(500).json({ msg: "Failed to send OTP email. Please try again." });
    }

    res.json({ msg: "OTP sent to your registered email. Valid for 10 minutes." });
  } catch (err) {
    console.error("sendEmailOtp error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ================= VERIFY EMAIL OTP (direct login) =================
export const verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ msg: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (!user.emailOtp || !user.emailOtpExpire)
      return res.status(400).json({ msg: "OTP not found. Please request a new one." });

    if (Date.now() > user.emailOtpExpire.getTime()) {
      user.emailOtp = undefined;
      user.emailOtpExpire = undefined;
      await user.save();
      return res.status(400).json({ msg: "OTP expired. Please request a new one." });
    }

    if (user.emailOtp !== otp)
      return res.status(400).json({ msg: "Incorrect OTP. Please try again." });

    // Clear OTP from DB
    user.emailOtp = undefined;
    user.emailOtpExpire = undefined;
    await user.save();

    // Issue JWT — same as normal login
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "SECRET",
      { expiresIn: "7d" }
    );

    // Log OTP login activity
    try {
      await ActivityLog.create({
        userId: user._id.toString(),
        userEmail: user.email,
        userName: user.name,
        userRole: user.role,
        action: "login",
        description: `${user.name} logged in via Email OTP`,
        metadata: {},
      });
    } catch (_) {}

    // Return same shape as normal login
    res.json({ token, user });
  } catch (err) {
    console.error("verifyEmailOtp error:", err);
    res.status(500).json({ msg: "OTP verification failed", error: err.message });
  }
};

// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ msg: "Invalid or expired token" });

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    try {
      await emailService.sendPasswordResetConfirmation(user);
    } catch (err) {
      console.log("Email failed:", err.message);
    }

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ msg: "Reset failed" });
  }
};

// ================= GET ME =================
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ================= SEND PHONE OTP =================
export const sendPhoneOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ msg: "Phone number required" });

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ msg: "This phone number is not registered." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(phone, { otp, expires: Date.now() + 10 * 60 * 1000 });

    if (!process.env.FAST2SMS_API_KEY) {
      console.log(`\n📱 OTP for +91${phone}: ${otp} (set FAST2SMS_API_KEY to send real SMS)\n`);
      return res.json({ msg: "OTP generated (console fallback — no SMS API key set)" });
    }

    try {
      const smsResponse = await axios.post(
        "https://www.fast2sms.com/dev/bulkV2",
        {
          message: `Your Shetkari Mitra OTP is ${otp}. Valid for 10 minutes. Do not share with anyone.`,
          language: "english",
          route: "q",
          numbers: phone,
        },
        { headers: { authorization: process.env.FAST2SMS_API_KEY.trim() } }
      );
      console.log(`✅ SMS OTP sent to +91${phone}`, smsResponse.data);
      res.json({ msg: "OTP sent to your registered mobile number" });
    } catch (smsErr) {
      console.error("❌ Fast2SMS error:", smsErr.response?.data || smsErr.message);
      return res.status(500).json({ msg: "Failed to send SMS OTP", error: smsErr.response?.data?.message || smsErr.message });
    }
  } catch (err) {
    res.status(500).json({ msg: "Failed to send OTP", error: err.message });
  }
};

// ================= VERIFY PHONE OTP =================
export const verifyPhoneOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const stored = otpStore.get(phone);
    if (!stored) return res.status(400).json({ msg: "OTP expired or not found. Please request again." });
    if (Date.now() > stored.expires) {
      otpStore.delete(phone);
      return res.status(400).json({ msg: "OTP expired. Please request a new one." });
    }
    if (stored.otp !== otp) return res.status(400).json({ msg: "Incorrect OTP." });

    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 5 * 60 * 1000;
    await user.save();
    otpStore.delete(phone);

    res.json({ msg: "OTP verified", resetToken });
  } catch (err) {
    res.status(500).json({ msg: "OTP verification failed", error: err.message });
  }
};