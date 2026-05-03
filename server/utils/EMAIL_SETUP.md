# 📧 Email System Setup Guide - Shetkari Mitra

## ✅ What Was Fixed

The "Forgot Password" feature has been updated to send **real emails via Gmail SMTP** instead of just logging to the console.

### Before ❌
- Emails were logged to console: `"EMAIL (No credentials - Console Only)"`
- No actual emails were sent to users
- Password reset OTP emails weren't received

### After ✅
- **Real emails** are sent to users' Gmail inbox
- Password reset OTP emails work properly
- Welcome emails on registration
- Password reset confirmation emails
- Console logging **only** if credentials are missing (fallback mode)

---

## 📋 Architecture Overview

### New Email Files Created

#### 1. **utils/emailService.js** - Main Email Handler
- Initializes Nodemailer transporter at server startup
- Provides centralized email sending functions
- Handles Gmail SMTP authentication
- Includes fallback console logging if credentials are missing

Key functions:
```javascript
initializeEmailService()          // Called at server startup
sendEmail(options)                // Generic email sender
sendWelcomeEmail(user)            // New user registration
sendPasswordResetOTP(user, otp)   // Forgot password OTP
sendPasswordResetConfirmation(user) // After password reset
sendBookingConfirmation(user, booking) // Booking confirmation
sendJobNotification(user, job)    // Job alerts
```

#### 2. **utils/emailTemplates.js** - Email HTML Templates
- Beautiful, branded email templates
- Responsive design
- Professional styling
- Separate template functions for each email type

#### 3. **Updated authController.js**
- Removed inline email configuration
- Now imports `emailService` from utilities
- Uses `sendPasswordResetOTP()` for forgot password
- Uses `sendWelcomeEmail()` for registration
- Uses `sendPasswordResetConfirmation()` after password reset

#### 4. **Updated server.js**
- Imports `emailService`
- Calls `emailService.initializeEmailService()` at startup
- Logs email mode status to console

---

## 🔧 Configuration

### Step 1: Get Gmail App Password

1. Go to **Google Account Settings**: https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not already enabled)
3. Go to **App Passwords**: https://myaccount.google.com/apppasswords
4. Select **Mail** and **Windows Computer**
5. Click **Generate**
6. Copy the **16-character password** (without spaces)

### Step 2: Update .env File

```env
# ─── EMAIL (Nodemailer Gmail + App Password) ──────────────────
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password
```

**Important:**
- Use the **App Password** (not your regular Gmail password)
- Remove any spaces from the password
- Keep this secure - don't commit to GitHub

### Step 3: Verify .env is Loaded

The server logs email status on startup:

```
📧 EMAIL_USER: Loaded ✅
🔑 EMAIL_PASS: Loaded ✅
📧 Email mode: GMAIL SMTP (your_email@gmail.com)
✅ Gmail SMTP ready to send emails
```

---

## 🚀 How It Works

### Email Sending Flow

```
User enters email in "Forgot Password"
          ↓
authController.forgotPassword()
          ↓
emailService.sendPasswordResetOTP(user, otp)
          ↓
Check if EMAIL_USER & EMAIL_PASS exist
          ↓
      YES → Send via Gmail SMTP (Real Email)
      NO  → Log to console (Fallback/Dev Mode)
          ↓
Email arrives in user's inbox ✅
```

### Example: Forgot Password Flow

```javascript
// 1. User submits email
POST /api/v1/auth/forgot-password
{ "email": "farmer@example.com" }

// 2. Server generates OTP
const otp = "123456";

// 3. Server sends email via Gmail
await emailService.sendPasswordResetOTP(user, otp);

// 4. Email is sent to user's inbox ✅
```

---

## 📧 Email Types Supported

### 1. Welcome Email (On Registration)
- Sent when user creates account
- Contains account details
- Quick start guide
- Dashboard link

### 2. Password Reset OTP
- Sent when user clicks "Forgot Password"
- Contains 6-digit OTP
- Valid for 10 minutes
- Security warning

### 3. Password Reset Confirmation
- Sent after password is successfully reset
- Confirms account security change
- Security tips provided

### 4. Booking Confirmation
- Ready for future implementation
- Template prepared for tractor bookings

### 5. Job Notifications
- Ready for future implementation
- Template prepared for labour job alerts

---

## 🧪 Testing the Setup

### Test 1: Verify Server Initialization

Run the server and check the logs:

```bash
cd server
npm start
```

Expected output:
```
📧 EMAIL_USER: Loaded ✅
🔑 EMAIL_PASS: Loaded ✅
📧 Email mode: GMAIL SMTP (your_email@gmail.com)
✅ Gmail SMTP ready to send emails
```

### Test 2: Test Forgot Password Email

1. Start the frontend: `npm run dev` (in shetkari-mitra folder)
2. Go to Login page → "Forgot Password"
3. Enter a registered email
4. Check inbox - you should receive OTP email within seconds
5. Use the OTP to reset password

### Test 3: Manual API Test

```bash
# Test forgot password endpoint
curl -X POST http://localhost:5000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"registered@example.com"}'
```

Expected response:
```json
{
  "msg": "OTP sent to your registered email. Valid for 10 minutes."
}
```

---

## 🔍 Troubleshooting

### Issue: "EMAIL (No credentials - Console Only)"

**Solution:** Check your `.env` file has both values:
```env
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password
```

Then restart the server.

### Issue: Gmail SMTP verification failed

**Solution:** Check the error in server logs:
1. Verify your Gmail account has 2-Step Verification enabled
2. Generate a new App Password
3. Remove any spaces from the password
4. Update `.env` and restart server

### Issue: "Failed to send email"

**Possible causes:**
1. Gmail credentials are wrong
2. 16-character limit - check app password length
3. Gmail security settings - Allow Less Secure Apps might be needed
4. Network connectivity issue

**Debug Steps:**
1. Check server logs for detailed error message
2. Verify `.env` values are correct
3. Test Gmail account can access: https://myaccount.google.com/apppasswords
4. Restart server after fixing

### Issue: Email arrives late or not at all

**Solution:**
1. Check spam/junk folder
2. Verify email template was received
3. Check server logs for `✅ Email sent successfully`
4. Wait a few minutes - Gmail may take time

---

## 🛡️ Security Considerations

### ✅ Best Practices Implemented

1. **Environment Variables**: Credentials stored in `.env`, not in code
2. **App Passwords**: Using Gmail App Password (not main password)
3. **No Hardcoding**: Email credentials never hardcoded in source files
4. **Fallback Mode**: Console logging if credentials missing (safe for dev)
5. **Error Logging**: Detailed logs without exposing sensitive data

### 🔐 Production Checklist

- [ ] Use strong, random JWT_SECRET in production
- [ ] Store `.env` securely (never commit to Git)
- [ ] Use Gmail App Password (not main account password)
- [ ] Enable 2-Step Verification on Gmail account
- [ ] Monitor email sending logs for failures
- [ ] Set up email service monitoring/alerts
- [ ] Consider using transactional email service (SendGrid, Mailgun) for production

---

## 📚 File Structure

```
server/
├── controllers/
│   └── authController.js          ← Updated: Uses emailService
├── utils/
│   ├── emailService.js            ← New: Main email handler
│   └── emailTemplates.js          ← New: Email templates
├── server.js                       ← Updated: Initialize emailService
└── .env                           ← Updated: EMAIL_USER & EMAIL_PASS
```

---

## 📖 Usage Examples

### Sending a Custom Email

```javascript
import emailService from "../utils/emailService.js";

// Send custom email
await emailService.sendEmail({
  to: "user@example.com",
  subject: "Custom Subject",
  html: "<h1>Custom HTML Content</h1>",
});

// Send welcome email
await emailService.sendWelcomeEmail(user);

// Send password reset OTP
await emailService.sendPasswordResetOTP(user, otp);

// Send password reset confirmation
await emailService.sendPasswordResetConfirmation(user);
```

---

## 🎯 Next Steps

### Already Implemented:
- ✅ Real Gmail SMTP integration
- ✅ Welcome email on registration
- ✅ Password reset OTP email
- ✅ Password reset confirmation email
- ✅ Proper error handling
- ✅ Fallback console logging

### Ready for Implementation:
- 📧 Email verification during registration
- 📧 Booking confirmation emails
- 📧 Job notification emails
- 📧 Newsletter/bulk emails
- 📧 Email unsubscribe management

### For Production:
- Consider using SendGrid, Mailgun, or AWS SES for better reliability
- Implement email queue system (Bull/Bee-Queue)
- Add email tracking and analytics
- Implement bounce/complaint handling

---

## 📞 Support

If emails are not working:

1. **Check server logs** - Look for email service initialization messages
2. **Verify .env** - Make sure EMAIL_USER and EMAIL_PASS are set
3. **Check Gmail settings** - Verify 2-Step Verification is enabled
4. **Test manually** - Use API test to trigger forgot password
5. **Review error messages** - Server logs contain detailed error info

---

**Last Updated:** May 2026
**Status:** Production Ready ✅
