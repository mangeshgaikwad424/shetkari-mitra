# 📄 Code Reference - Email System Implementation

## 📍 File: server/utils/emailService.js

### Key Code Sections

#### 1. Initialization Function
```javascript
export const initializeEmailService = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    emailMode = "console";
    console.log("⚠️  Email mode: CONSOLE (set EMAIL_USER and EMAIL_PASS in .env)");
    return;
  }

  try {
    const emailPass = process.env.EMAIL_PASS.trim().replace(/\s+/g, "");
    const emailUser = process.env.EMAIL_USER.trim();

    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    emailMode = "gmail";
    console.log(`✅ Email mode: GMAIL SMTP (${emailUser})`);

    // Verify connection
    transporter.verify((error, success) => {
      if (error) {
        console.error("❌ Gmail SMTP verification failed:", error.message);
      } else {
        console.log("✅ Gmail SMTP ready to send emails");
      }
    });
  } catch (err) {
    console.error("❌ Email service initialization failed:", err.message);
    emailMode = "console";
  }
};
```

#### 2. Generic Email Sender
```javascript
export const sendEmail = async (options) => {
  const { to, subject, html, text } = options;

  if (!to || !subject) {
    throw new Error("Email recipient (to) and subject are required");
  }

  // CONSOLE MODE (Fallback)
  if (emailMode === "console") {
    console.log("\n📧 ═══════════════════════════════════════════════════════════");
    console.log("   EMAIL (No credentials - Console Only - Development Mode)");
    console.log("═══════════════════════════════════════════════════════════");
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log("   ─────────────────────────────────────────────────────────");
    console.log("   Body (HTML):");
    console.log("   " + (html || text || "(empty)").substring(0, 200));
    console.log("═══════════════════════════════════════════════════════════\n");
    return { messageId: "fallback-" + Date.now(), mode: "console" };
  }

  // GMAIL MODE (Real Email)
  if (!transporter) {
    throw new Error("Email transporter not initialized");
  }

  try {
    const mailOptions = {
      from: `"Shetkari Mitra" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: html || text,
      text: text || html,
    };

    console.log(`📧 Sending email to ${to}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${to} (MessageID: ${info.messageId})`);

    return { messageId: info.messageId, mode: "gmail", success: true };
  } catch (error) {
    console.error(`❌ Email failed to ${to}:`, error.message);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
```

#### 3. Specialized Email Functions
```javascript
export const sendWelcomeEmail = async (user) => {
  const html = emailTemplates.welcome(user);
  return sendEmail({
    to: user.email,
    subject: "🌱 Welcome to Shetkari Mitra!",
    html,
  });
};

export const sendPasswordResetOTP = async (user, otp) => {
  const html = emailTemplates.passwordResetOTP(user, otp);
  return sendEmail({
    to: user.email,
    subject: "🌱 Shetkari Mitra - Password Reset OTP",
    html,
  });
};

export const sendPasswordResetConfirmation = async (user) => {
  const html = emailTemplates.passwordResetConfirmation(user);
  return sendEmail({
    to: user.email,
    subject: "✅ Shetkari Mitra - Password Changed Successfully",
    html,
  });
};
```

---

## 📍 File: server/utils/emailTemplates.js

### Template Function Example

```javascript
export const emailTemplates = {
  passwordResetOTP: (user, otp) => `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f0fdf4; border-radius: 16px;">
      <h2 style="color: #166534; margin-bottom: 8px;">🌱 Shetkari Mitra</h2>
      <p style="color: #374151;">Hello <strong>${user.name}</strong>,</p>
      <p style="color: #374151;">We received a request to reset your password. Use the OTP below to proceed:</p>
      
      <div style="background: white; padding: 24px; border-radius: 12px; text-align: center; margin: 28px 0; border: 2px solid #dcfce7;">
        <p style="color: #6b7280; font-size: 12px; margin: 0 0 12px 0;">Your One-Time Password:</p>
        <p style="font-size: 36px; font-weight: bold; color: #16a34a; letter-spacing: 6px; margin: 0;">${otp}</p>
        <p style="color: #9ca3af; font-size: 11px; margin: 12px 0 0 0;">Valid for 10 minutes</p>
      </div>

      <div style="background: #fef3c7; padding: 12px; border-left: 4px solid #f59e0b; border-radius: 4px; margin: 16px 0;">
        <p style="color: #92400e; font-size: 13px; margin: 0;">⚠️ Do not share this OTP with anyone. Shetkari Mitra team will never ask for your OTP.</p>
      </div>

      <p style="color: #6b7280; font-size: 13px; margin-top: 20px;">If you did not request a password reset, please ignore this email and your account will remain secure.</p>
      
      <hr style="border: none; border-top: 1px solid #d1fae5; margin: 20px 0;" />
      <p style="color: #9ca3af; font-size: 12px;">Shetkari Mitra · Connecting Farmers Across Maharashtra</p>
    </div>
  `,
};
```

---

## 📍 File: server/controllers/authController.js

### Updated Register Function
```javascript
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, village } = req.body;

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role, phone, village });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "SECRET", { expiresIn: "7d" });

    // Send welcome email using emailService
    try {
      console.log(`📧 Sending welcome email to ${email}...`);
      await emailService.sendWelcomeEmail({
        name,
        email,
        role,
        phone,
        village,
      });
    } catch (emailErr) {
      console.error("❌ Welcome email failed:", emailErr.message);
      // Don't fail registration if email fails
    }

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
```

### Updated Forgot Password Function
```javascript
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Only send to registered emails
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "Email not registered. Please check the email or register first." });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    emailOtpStore.set(email, { otp, expires: Date.now() + 10 * 60 * 1000 }); // 10 min

    // Send email with OTP using emailService
    try {
      console.log(`📧 Attempting to send OTP email to ${email}...`);
      await emailService.sendPasswordResetOTP(user, otp);
      console.log(`✅ OTP email sent successfully to ${email}`);
    } catch (emailErr) {
      console.error("❌ OTP email failed:", emailErr.message);
      console.error("   Stack:", emailErr.stack);
      return res.status(500).json({ msg: "Failed to send OTP email. Check server logs for details.", error: emailErr.message });
    }

    res.json({ msg: "OTP sent to your registered email. Valid for 10 minutes." });
  } catch (err) {
    console.error("forgotPassword error:", err);
    res.status(500).json({ msg: "Failed to send OTP. Please try again.", error: err.message });
  }
};
```

### Updated Reset Password Function
```javascript
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

    // Send password reset confirmation email
    try {
      await emailService.sendPasswordResetConfirmation(user);
      console.log(`✅ Password reset confirmation sent to ${user.email}`);
    } catch (emailErr) {
      console.error("❌ Password confirmation email failed:", emailErr.message);
      // Don't fail the request if email fails
    }

    res.json({ msg: "Password reset successful. You can now login." });
  } catch (err) {
    res.status(500).json({ msg: "Password reset failed", error: err.message });
  }
};
```

---

## 📍 File: server/server.js

### Email Service Initialization
```javascript
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import emailService from "./utils/emailService.js";  // ← NEW

// ─────────────────────────────────────────
// ✅ LOAD ENV FIRST (VERY IMPORTANT)
// ─────────────────────────────────────────
dotenv.config();

// ─────────────────────────────────────────
// ✅ DEBUG ENV (FOR EMAIL ISSUE)
// ─────────────────────────────────────────
console.log("📧 EMAIL_USER:", process.env.EMAIL_USER ? "Loaded ✅" : "Missing ❌");
console.log("🔑 EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌");
console.log("🌐 FRONTEND_URL:", process.env.FRONTEND_URL);

// ─────────────────────────────────────────
// ✅ INITIALIZE EMAIL SERVICE
// ─────────────────────────────────────────
emailService.initializeEmailService();  // ← NEW

// ... rest of server.js
```

---

## 🔧 Import Statements

### In authController.js (Top of File)
```javascript
import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import axios from "axios";
import emailService from "../utils/emailService.js";  // ← NEW
```

### In server.js (Top of File)
```javascript
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import emailService from "./utils/emailService.js";  // ← NEW
```

---

## 📊 Data Flow Diagrams

### Forgot Password Data Flow
```
Frontend                Backend                Email
────────────────────────────────────────────────────────
   │
   │ POST /forgot-password
   │ { email: "user@example.com" }
   ├─────────────────────────────────>
   │                │
   │                ├─ Find user in DB
   │                ├─ Generate OTP (123456)
   │                ├─ Store OTP in memory (10min)
   │                │
   │                ├─ emailService.sendPasswordResetOTP()
   │                │   │
   │                │   ├─ Check EMAIL_USER & EMAIL_PASS
   │                │   │
   │                │   ├─ YES → Send via Gmail SMTP
   │                │   │         │
   │                │   │         └──────────────────────> Gmail Server
   │                │   │                                  │
   │                │   │                                  └─> User Inbox ✅
   │                │   │
   │                │   └─ NO → Log to console
   │                │
   │                ├─ Response: "OTP sent to email"
   │ <─────────────────
   │
   └─ Show OTP input box
```

### Email Template Rendering
```
emailService.sendPasswordResetOTP(user, otp)
        │
        ├─ Get template from emailTemplates.js
        │  emailTemplates.passwordResetOTP(user, otp)
        │         │
        │         ├─ Insert user.name
        │         ├─ Insert OTP value (123456)
        │         ├─ Add styling & formatting
        │         └─ Return HTML string
        │
        ├─ Call sendEmail({ to, subject, html })
        │         │
        │         ├─ Create mail options
        │         ├─ Call transporter.sendMail()
        │         └─ Return result
        │
        └─ Email sent to user@example.com ✅
```

---

## 🧪 Testing Code Examples

### Test 1: Manual Email Send
```javascript
// In a test file or terminal
import emailService from "./utils/emailService.js";

const testUser = {
  name: "John Farmer",
  email: "john@example.com"
};

const testOtp = "123456";

// This will send real email or log to console
await emailService.sendPasswordResetOTP(testUser, testOtp);
```

### Test 2: Check Email Mode
```javascript
// Check if email service is in GMAIL or CONSOLE mode
console.log("Email mode:", process.env.EMAIL_USER && process.env.EMAIL_PASS ? "GMAIL" : "CONSOLE");
```

### Test 3: Verify Transporter
```javascript
// Check if transporter is connected
if (transporter) {
  transporter.verify((error, success) => {
    if (error) {
      console.log("❌ SMTP Error:", error);
    } else {
      console.log("✅ SMTP Connected");
    }
  });
}
```

---

## 📋 Environment Variables

### Required (.env file)
```env
# MongoDB
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_key

# Email (Nodemailer - Gmail)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password

# Frontend URL
FRONTEND_URL=http://localhost:5173

# SMS (Fast2SMS)
FAST2SMS_API_KEY=your_api_key

# Other services
DATA_GOV_API_KEY=your_key
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret
```

---

## ✅ Verification Commands

### Check Node Syntax
```bash
cd server
node -c server.js
node -c controllers/authController.js
node -c utils/emailService.js
```

### Check Imports
```bash
# Verify emailService is importable
node -e "import('./utils/emailService.js').then(() => console.log('✅ emailService imports OK'))"
```

### Run Server
```bash
npm start
# Should see:
# 📧 Email mode: GMAIL SMTP (your_email@gmail.com)
# ✅ Gmail SMTP ready to send emails
```

---

## 🎯 Quick Implementation Checklist

- ✅ Created `server/utils/emailService.js`
- ✅ Created `server/utils/emailTemplates.js`
- ✅ Created `server/utils/EMAIL_SETUP.md`
- ✅ Updated `server/controllers/authController.js`
- ✅ Updated `server/server.js`
- ✅ Verified imports are correct
- ✅ Verified no syntax errors
- ✅ Verified .env has EMAIL credentials
- ✅ Tested initialization message
- ✅ Ready for production

---

**Status:** ✅ Implementation Complete  
**Date:** May 2026  
**Version:** 1.0.0

