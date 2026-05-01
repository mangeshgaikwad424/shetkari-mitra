import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import axios from "axios";

// ─── EMAIL TRANSPORTER ────────────────────────────────────────────────────────
// Uses environment variables. For Gmail: enable "App Passwords" in your Google account.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,       // your Gmail address
    pass: process.env.EMAIL_PASS,       // your Gmail App Password (not regular password)
  },
});

// ─── OTP STORE (in-memory for demo; use Redis in production) ─────────────────
const otpStore = new Map(); // phone -> { otp, expires }

// ─── REGISTER ─────────────────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, village } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email already registered" });

    // Check if phone already exists (if provided)
    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) return res.status(400).json({ msg: "Phone number already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role, phone, village });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "SECRET", { expiresIn: "7d" });

    // Log registration activity
    await ActivityLog.create({
      userId: user._id.toString(),
      userEmail: email,
      userName: name,
      userRole: role,
      action: "register",
      description: `New ${role} account registered: ${name} (${email})`,
      metadata: { village, phone },
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ msg: "Registration failed", error: err.message });
  }
};

// ─── GET ME ───────────────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Email not registered" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "SECRET", { expiresIn: "7d" });

    // Log login activity
    await ActivityLog.create({
      userId: user._id.toString(),
      userEmail: user.email,
      userName: user.name,
      userRole: user.role,
      action: "login",
      description: `${user.name} (${user.role}) logged in`,
      metadata: {},
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
};

// ─── FORGOT PASSWORD (Email) ──────────────────────────────────────────────────
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Only send to registered emails
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "Email not registered. Please check the email or register first." });

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${token}`;

    // Send email
    await transporter.sendMail({
      from: `"Shetkari Mitra" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🌱 Shetkari Mitra - Password Reset Link",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f0fdf4; border-radius: 16px;">
          <h2 style="color: #166534; margin-bottom: 8px;">🌱 Shetkari Mitra</h2>
          <p style="color: #374151;">Hello <strong>${user.name}</strong>,</p>
          <p style="color: #374151;">We received a request to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${resetLink}" style="background: #16a34a; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Reset Password
            </a>
          </div>
          <p style="color: #6b7280; font-size: 13px;">This link expires in <strong>10 minutes</strong>. If you did not request a password reset, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #d1fae5; margin: 20px 0;" />
          <p style="color: #9ca3af; font-size: 12px;">Shetkari Mitra · Connecting Farmers Across Maharashtra</p>
        </div>
      `,
    });

    res.json({ msg: "Password reset link sent to your registered email." });
  } catch (err) {
    console.error("forgotPassword error:", err);
    res.status(500).json({ msg: "Failed to send email. Please try again.", error: err.message });
  }
};

// ─── FORGOT PASSWORD (Phone — Send OTP) ───────────────────────────────────────
export const sendPhoneOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ msg: "Phone number required" });

    // Only for registered users
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ msg: "This phone number is not registered." });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(phone, { otp, expires: Date.now() + 10 * 60 * 1000 }); // 10 min

    // Send real SMS via Fast2SMS
    await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        message: `Your Shetkari Mitra OTP is ${otp}. Valid for 10 minutes. Do not share with anyone.`,
        language: "english",
        route: "q",
        numbers: phone,
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
        },
      }
    );

    res.json({ msg: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to send OTP", error: err.message });
  }
};

// ─── FORGOT PASSWORD (Phone — Verify OTP) ─────────────────────────────────────
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

    // Issue a short-lived reset token
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 5 * 60 * 1000; // 5 min to set new password
    await user.save();
    otpStore.delete(phone);

    res.json({ msg: "OTP verified", resetToken });
  } catch (err) {
    res.status(500).json({ msg: "OTP verification failed", error: err.message });
  }
};

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
export const resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ msg: "Invalid or expired reset link." });

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.json({ msg: "Password reset successful. You can now login." });
  } catch (err) {
    res.status(500).json({ msg: "Password reset failed", error: err.message });
  }
};