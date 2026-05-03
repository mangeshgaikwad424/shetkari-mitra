// ─────────────────────────────────────────────────────────────────────────────
// ✅ EMAIL TEMPLATES
// ─────────────────────────────────────────────────────────────────────────────

export const emailTemplates = {
  /**
   * Welcome email for new user registration.
   * Personalized by role, bilingual (English + Marathi).
   */
  welcome: (user) => {
    const roleMeta = {
      farmer: {
        emoji: "🧑‍🌾",
        labelEn: "Farmer",
        labelMr: "शेतकरी",
        greetEn: "Welcome, Farmer!",
        greetMr: "शेतकऱ्या, स्वागत आहे!",
        badgeColor: "#15803d",
        badgeBg: "#dcfce7",
      },
      government: {
        emoji: "🏛️",
        labelEn: "Government Employee",
        labelMr: "शासकीय कर्मचारी",
        greetEn: "Welcome, Government Employee!",
        greetMr: "शासकीय कर्मचारी, स्वागत आहे!",
        badgeColor: "#1d4ed8",
        badgeBg: "#dbeafe",
      },
      labour: {
        emoji: "👷",
        labelEn: "Labour Member",
        labelMr: "मजूर सदस्य",
        greetEn: "Welcome, Labour Member!",
        greetMr: "मजूर सदस्य, स्वागत आहे!",
        badgeColor: "#b45309",
        badgeBg: "#fef3c7",
      },
      tractor: {
        emoji: "🚜",
        labelEn: "Tractor Owner",
        labelMr: "ट्रॅक्टर मालक",
        greetEn: "Welcome, Tractor Owner!",
        greetMr: "ट्रॅक्टर मालक, स्वागत आहे!",
        badgeColor: "#7c3aed",
        badgeBg: "#ede9fe",
      },
    };

    const meta = roleMeta[user.role] || roleMeta["farmer"];
    const dashboardUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard`;
    const year = new Date().getFullYear();

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>Welcome to Shetkari Mitra</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
<tr><td align="center">
<table width="100%" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

  <!-- HEADER -->
  <tr>
    <td style="background:linear-gradient(135deg,#16a34a 0%,#15803d 60%,#166534 100%);padding:40px 32px;text-align:center;">
      <div style="font-size:52px;margin-bottom:12px;">🌱</div>
      <h1 style="color:#ffffff;margin:0;font-size:30px;font-weight:800;letter-spacing:-0.5px;">Shetkari Mitra</h1>
      <p style="color:#bbf7d0;margin:8px 0 0;font-size:14px;font-weight:500;">शेतकरी मित्र &nbsp;·&nbsp; Your Digital Farming Partner</p>
    </td>
  </tr>

  <!-- ROLE BADGE + GREETING -->
  <tr>
    <td style="padding:36px 32px 0;">
      <div style="background:${meta.badgeBg};border:1.5px solid ${meta.badgeColor}44;border-radius:100px;display:inline-block;padding:7px 18px;font-size:13px;font-weight:700;color:${meta.badgeColor};margin-bottom:20px;">
        ${meta.emoji} ${meta.labelEn} &nbsp;&bull;&nbsp; ${meta.labelMr}
      </div>
      <h2 style="color:#111827;font-size:22px;font-weight:800;margin:0 0 4px;">${meta.greetEn}</h2>
      <p style="color:#6b7280;font-size:13px;font-style:italic;margin:0 0 20px;">${meta.greetMr}</p>
      <p style="color:#374151;font-size:15px;margin:0 0 10px;">Hello <strong>${user.name}</strong>,</p>
      <p style="color:#374151;font-size:14px;line-height:1.75;margin:0;">
        Thank you for joining <strong>Shetkari Mitra</strong>! We are happy to have you as part of our agricultural community.
        Explore schemes, weather updates, crop diseases, marketplace and much more &mdash; tailored just for you.
      </p>
    </td>
  </tr>

  <!-- MARATHI MESSAGE -->
  <tr>
    <td style="padding:18px 32px 0;">
      <div style="background:#f0fdf4;border-left:4px solid #16a34a;border-radius:0 10px 10px 0;padding:14px 18px;">
        <p style="color:#166534;font-size:14px;line-height:1.85;margin:0;">
          🌿 शेतकरी मित्रमध्ये आपले स्वागत आहे! आमच्या कृषी समुदायाचा भाग बनल्याबद्दल आपले आभार.
          योजना, हवामान अपडेट, पीक रोग, बाजारपेठ आणि बरेच काही एक्सप्लोर करा.
        </p>
      </div>
    </td>
  </tr>

  <!-- ACCOUNT DETAILS -->
  <tr>
    <td style="padding:24px 32px 0;">
      <p style="color:#374151;font-size:12px;font-weight:700;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.8px;">Your Account Details</p>
      <table width="100%" style="background:#f9fafb;border-radius:12px;border:1px solid #e5e7eb;" cellpadding="0" cellspacing="0">
        <tr><td style="padding:11px 16px;border-bottom:1px solid #e5e7eb;">
          <span style="color:#6b7280;font-size:13px;">👤 Name</span>
          <span style="float:right;color:#111827;font-size:13px;font-weight:600;">${user.name}</span>
        </td></tr>
        <tr><td style="padding:11px 16px;border-bottom:1px solid #e5e7eb;">
          <span style="color:#6b7280;font-size:13px;">📧 Email</span>
          <span style="float:right;color:#111827;font-size:13px;font-weight:600;">${user.email}</span>
        </td></tr>
        <tr><td style="padding:11px 16px;border-bottom:1px solid #e5e7eb;">
          <span style="color:#6b7280;font-size:13px;">${meta.emoji} Role</span>
          <span style="float:right;color:${meta.badgeColor};font-size:13px;font-weight:700;">${meta.labelEn}</span>
        </td></tr>
        <tr><td style="padding:11px 16px;">
          <span style="color:#6b7280;font-size:13px;">🏘️ Village</span>
          <span style="float:right;color:#111827;font-size:13px;font-weight:600;">${user.village || "Not provided"}</span>
        </td></tr>
      </table>
    </td>
  </tr>

  <!-- FEATURE GRID -->
  <tr>
    <td style="padding:24px 32px 0;">
      <p style="color:#374151;font-size:12px;font-weight:700;margin:0 0 14px;text-transform:uppercase;letter-spacing:0.8px;">Explore Features</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td width="50%" style="padding:0 6px 10px 0;vertical-align:top;">
            <div style="background:#f0fdf4;border-radius:10px;padding:14px;">
              <div style="font-size:24px;margin-bottom:6px;">🌦️</div>
              <p style="color:#15803d;font-size:13px;font-weight:700;margin:0 0 3px;">Weather Updates</p>
              <p style="color:#9ca3af;font-size:12px;margin:0;">हवामान अपडेट</p>
            </div>
          </td>
          <td width="50%" style="padding:0 0 10px 6px;vertical-align:top;">
            <div style="background:#fefce8;border-radius:10px;padding:14px;">
              <div style="font-size:24px;margin-bottom:6px;">📊</div>
              <p style="color:#a16207;font-size:13px;font-weight:700;margin:0 0 3px;">Mandi Prices</p>
              <p style="color:#9ca3af;font-size:12px;margin:0;">बाजारभाव</p>
            </div>
          </td>
        </tr>
        <tr>
          <td width="50%" style="padding:0 6px 0 0;vertical-align:top;">
            <div style="background:#fdf4ff;border-radius:10px;padding:14px;">
              <div style="font-size:24px;margin-bottom:6px;">🦠</div>
              <p style="color:#7e22ce;font-size:13px;font-weight:700;margin:0 0 3px;">Crop Disease</p>
              <p style="color:#9ca3af;font-size:12px;margin:0;">पीक रोग</p>
            </div>
          </td>
          <td width="50%" style="padding:0 0 0 6px;vertical-align:top;">
            <div style="background:#eff6ff;border-radius:10px;padding:14px;">
              <div style="font-size:24px;margin-bottom:6px;">📋</div>
              <p style="color:#1d4ed8;font-size:13px;font-weight:700;margin:0 0 3px;">Govt Schemes</p>
              <p style="color:#9ca3af;font-size:12px;margin:0;">शासकीय योजना</p>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- CTA BUTTON -->
  <tr>
    <td style="padding:28px 32px 0;text-align:center;">
      <a href="${dashboardUrl}"
         style="display:inline-block;background:linear-gradient(135deg,#16a34a,#15803d);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:15px 38px;border-radius:12px;letter-spacing:0.3px;">
        🚀 Go to Dashboard &nbsp;&bull;&nbsp; डॅशबोर्ड उघडा
      </a>
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="padding:32px 32px 36px;">
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 22px;"/>
      <p style="color:#374151;font-size:13px;font-weight:700;margin:0 0 4px;">Team Shetkari Mitra 🌱</p>
      <p style="color:#9ca3af;font-size:12px;margin:0;">Connecting Farmers Across Maharashtra</p>
      <p style="color:#d1d5db;font-size:11px;margin:14px 0 0;">&#169; ${year} Shetkari Mitra. All rights reserved.</p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
  },

  /**
   * Password reset OTP email
   */
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
      <p style="color: #9ca3af; font-size: 12px;">Team Shetkari Mitra 🌱 &nbsp;·&nbsp; Connecting Farmers Across Maharashtra</p>
    </div>
  `,

  /**
   * Password reset confirmation email
   */
  passwordResetConfirmation: (user) => `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f0fdf4; border-radius: 16px;">
      <h2 style="color: #166534; margin-bottom: 8px;">🌱 Shetkari Mitra</h2>
      <p style="color: #374151;">Hello <strong>${user.name}</strong>,</p>
      
      <div style="background: #dcfce7; padding: 16px; border-left: 4px solid #16a34a; border-radius: 8px; margin: 24px 0;">
        <p style="color: #166534; margin: 0; font-size: 14px;"><strong>✅ Password Changed Successfully</strong></p>
      </div>

      <p style="color: #374151; font-size: 14px;">Your Shetkari Mitra account password was successfully updated on <strong>${new Date().toLocaleString()}</strong>.</p>

      <div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 24px 0;">
        <p style="color: #374151; font-weight: bold; font-size: 14px; margin: 0 0 12px 0;">🔐 Security Tips:</p>
        <ul style="color: #6b7280; font-size: 13px; margin: 0; padding-left: 20px;">
          <li>Never share your password with anyone</li>
          <li>Use a strong, unique password</li>
          <li>Update your password regularly</li>
          <li>Log out from public devices</li>
        </ul>
      </div>

      <p style="color: #6b7280; font-size: 13px; margin-top: 20px;">If you did not make this change, please <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/support" style="color: #16a34a; text-decoration: none; font-weight: bold;">contact support immediately</a>.</p>
      
      <hr style="border: none; border-top: 1px solid #d1fae5; margin: 20px 0;" />
      <p style="color: #9ca3af; font-size: 12px;">Team Shetkari Mitra 🌱 &nbsp;·&nbsp; Connecting Farmers Across Maharashtra</p>
    </div>
  `,

  /**
   * Booking confirmation email
   */
  bookingConfirmation: (user, booking) => `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f0fdf4; border-radius: 16px;">
      <h2 style="color: #166534; margin-bottom: 8px;">🌱 Shetkari Mitra - Booking Confirmed</h2>
      <p style="color: #374151;">Hello <strong>${user.name}</strong>,</p>
      
      <div style="background: white; padding: 16px; border-radius: 12px; border-left: 4px solid #16a34a; margin: 24px 0;">
        <p style="color: #374151; margin: 0 0 12px 0;"><strong>📋 Booking Details:</strong></p>
        <ul style="color: #6b7280; font-size: 13px; list-style: none; padding: 0; margin: 0;">
          <li>🔖 Booking ID: <strong>${booking.id || 'N/A'}</strong></li>
          <li>📅 Date: <strong>${booking.date || 'N/A'}</strong></li>
          <li>⏱️ Duration: <strong>${booking.duration || 'N/A'}</strong></li>
          <li>💰 Total Amount: <strong>&#8377;${booking.amount || '0'}</strong></li>
        </ul>
      </div>

      <div style="background: #dcfce7; padding: 12px; border-radius: 8px; margin: 16px 0;">
        <p style="color: #166534; margin: 0; font-size: 13px;">✅ Your booking is confirmed and you will receive further updates shortly.</p>
      </div>

      <hr style="border: none; border-top: 1px solid #d1fae5; margin: 20px 0;" />
      <p style="color: #9ca3af; font-size: 12px;">Team Shetkari Mitra 🌱 &nbsp;·&nbsp; Connecting Farmers Across Maharashtra</p>
    </div>
  `,

  /**
   * Job notification email
   */
  jobNotification: (user, job) => `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f0fdf4; border-radius: 16px;">
      <h2 style="color: #166534; margin-bottom: 8px;">🌱 Shetkari Mitra - Job Opportunity</h2>
      <p style="color: #374151;">Hello <strong>${user.name}</strong>,</p>
      
      <div style="background: white; padding: 16px; border-radius: 12px; border-left: 4px solid #16a34a; margin: 24px 0;">
        <p style="color: #374151; margin: 0 0 12px 0;"><strong>💼 Job Details:</strong></p>
        <ul style="color: #6b7280; font-size: 13px; list-style: none; padding: 0; margin: 0;">
          <li>📝 Title: <strong>${job.title || 'N/A'}</strong></li>
          <li>📍 Location: <strong>${job.location || 'N/A'}</strong></li>
          <li>💵 Payment: <strong>&#8377;${job.payment || '0'}</strong></li>
          <li>👥 Required: <strong>${job.required || '1'} workers</strong></li>
        </ul>
      </div>

      <div style="text-align: center; margin: 24px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/jobs"
           style="background: #16a34a; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px;">
          View Full Details
        </a>
      </div>

      <hr style="border: none; border-top: 1px solid #d1fae5; margin: 20px 0;" />
      <p style="color: #9ca3af; font-size: 12px;">Team Shetkari Mitra 🌱 &nbsp;·&nbsp; Connecting Farmers Across Maharashtra</p>
    </div>
  `,
};
