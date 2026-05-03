import nodemailer from "nodemailer";
import { emailTemplates } from "./emailTemplates.js";

// ─────────────────────────────────────────────────────────────────────────────
// ✅ EMAIL SERVICE - NODEMAILER WITH FALLBACK
// ─────────────────────────────────────────────────────────────────────────────
// When EMAIL_USER and EMAIL_PASS are set → sends REAL emails via Gmail SMTP
// When credentials are missing → logs to console (fallback only)

let transporter = null;
let emailMode = "none";

/**
 * Initialize the email transporter
 * Called once at server startup
 */
export const initializeEmailService = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    emailMode = "console";
    console.log(
      "⚠️  Email mode: CONSOLE (set EMAIL_USER and EMAIL_PASS in .env to send real emails)"
    );
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

    // Optional: Verify connection
    transporter.verify((error, success) => {
      if (error) {
        console.error("❌ Gmail SMTP verification failed:", error.message);
        console.log(
          "⚠️  Check your EMAIL_USER and EMAIL_PASS in .env file"
        );
      } else {
        console.log("✅ Gmail SMTP ready to send emails");
      }
    });
  } catch (err) {
    console.error("❌ Email service initialization failed:", err.message);
    emailMode = "console";
  }
};

/**
 * Send an email
 * @param {Object} options - { to, subject, html, text }
 * @returns {Promise}
 */
export const sendEmail = async (options) => {
  const { to, subject, html, text } = options;

  // ─── Validate inputs ───────────────────────────────────────────────────
  if (!to || !subject) {
    throw new Error("Email recipient (to) and subject are required");
  }

  // ─── CONSOLE MODE (Fallback) ──────────────────────────────────────────
  if (emailMode === "console") {
    console.log("\n📧 ═══════════════════════════════════════════════════════════");
    console.log("   EMAIL (No credentials - Console Only - Development Mode)");
    console.log("═══════════════════════════════════════════════════════════");
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log("   ─────────────────────────────────────────────────────────");
    console.log("   Body (HTML):");
    console.log("   " + (html || text || "(empty)").substring(0, 200));
    console.log("   ─────────────────────────────────────────────────────────");
    console.log(`   Timestamp: ${new Date().toISOString()}`);
    console.log("═══════════════════════════════════════════════════════════\n");

    return { messageId: "fallback-" + Date.now(), mode: "console" };
  }

  // ─── GMAIL MODE (Real Email) ──────────────────────────────────────────
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
    console.error("   Stack:", error.stack);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send welcome email to new user
 */
export const sendWelcomeEmail = async (user) => {
  const html = emailTemplates.welcome(user);
  return sendEmail({
    to: user.email,
    subject: "🌱 Welcome to Shetkari Mitra!",
    html,
  });
};

/**
 * Send password reset OTP email
 */
export const sendPasswordResetOTP = async (user, otp) => {
  const html = emailTemplates.passwordResetOTP(user, otp);
  return sendEmail({
    to: user.email,
    subject: "🌱 Shetkari Mitra - Password Reset OTP",
    html,
  });
};

/**
 * Send password reset confirmation email
 */
export const sendPasswordResetConfirmation = async (user) => {
  const html = emailTemplates.passwordResetConfirmation(user);
  return sendEmail({
    to: user.email,
    subject: "✅ Shetkari Mitra - Password Changed Successfully",
    html,
  });
};

/**
 * Send booking confirmation email
 */
export const sendBookingConfirmation = async (user, booking) => {
  const html = emailTemplates.bookingConfirmation(user, booking);
  return sendEmail({
    to: user.email,
    subject: "✅ Booking Confirmed - Shetkari Mitra",
    html,
  });
};

/**
 * Send job posting notification
 */
export const sendJobNotification = async (user, job) => {
  const html = emailTemplates.jobNotification(user, job);
  return sendEmail({
    to: user.email,
    subject: "💼 New Job Opportunity - Shetkari Mitra",
    html,
  });
};

export default {
  initializeEmailService,
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetOTP,
  sendPasswordResetConfirmation,
  sendBookingConfirmation,
  sendJobNotification,
};
