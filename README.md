# 🌾 Shetkari Mitra - Agricultural Support Platform

> Empowering Indian farmers with technology-driven solutions for better productivity and fair market access.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-green.svg)](https://www.mongodb.com/)

## 📋 Overview

**Shetkari Mitra** is a comprehensive web platform designed to support Indian farmers with:
- 🚜 **Tractor Booking** - Easy rental and sharing of farm equipment
- 💼 **Labour Marketplace** - Connect with agricultural workers
- 📊 **Mandi Prices** - Real-time market price information
- 🌱 **Crop Health Monitoring** - AI-powered disease detection
- 💰 **Government Schemes** - Browse and access subsidies and benefits
- 📱 **Messaging & Notifications** - Direct farmer-to-farmer communication
- 🌦️ **Weather Updates** - Region-specific forecasts
- 🗣️ **Voice Assistant** - Hands-free app interaction
- 📈 **Analytics Dashboard** - Track farm performance

---

## 🏗️ Architecture

```
Shetkari Mitra/
├── server/                 # Node.js Express Backend (Port 5000)
│   ├── controllers/        # Business logic
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth & role-based access
│   └── server.js          # Entry point
│
└── shetkari-mitra/        # React + Vite Frontend (Port 5173)
    ├── src/
    │   ├── pages/         # Route components
    │   ├── components/    # Reusable UI components
    │   ├── context/       # Global state (Auth, Chat, Dark Mode, etc.)
    │   ├── services/      # API calls & external services
    │   ├── redux/         # Redux store (auth)
    │   └── utils/         # Helper functions
    └── public/            # Static assets
```

---

## 💻 Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB 7.0+
- **Authentication:** JWT (JSON Web Tokens)
- **Payment:** Razorpay
- **SMS:** Fast2SMS
- **Email:** Gmail App Password
- **API Data:** data.gov.in (Mandi prices)

### Frontend
- **Build Tool:** Vite
- **Framework:** React 18+
- **Styling:** Tailwind CSS
- **State Management:** Redux + Context API
- **HTTP Client:** Axios
- **UI/UX:** Responsive & Dark Mode Support

---

## 🚀 Quick Start

### Prerequisites
- **Node.js:** v18+ ([Download](https://nodejs.org/))
- **MongoDB:** 7.0+ ([Local](https://www.mongodb.com/try/download/community) or [Cloud](https://www.mongodb.com/cloud/atlas))
- **Git:** For version control
- **npm or yarn:** Package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shetkari-mitra.git
   cd shetkari-mitra
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```
   
   Create `.env` file in `/server`:
   ```env
   # Database
   MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/shetkari-mitra

   # Server
   PORT=5000
   FRONTEND_URL=http://localhost:5173

   # Authentication
   JWT_SECRET=your_secret_key_here

   # Email (Gmail App Password)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_16_char_app_password

   # SMS (Fast2SMS)
   FAST2SMS_API_KEY=your_api_key

   # Mandi Prices (data.gov.in)
   DATA_GOV_API_KEY=your_api_key

   # Payment (Razorpay)
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_secret
   ```

3. **Setup Frontend**
   ```bash
   cd ../shetkari-mitra
   npm install
   ```
   
   Create `.env.local` file in `/shetkari-mitra`:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

### Running Locally

**Terminal 1 - Backend:**
```bash
cd server
npm start
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd shetkari-mitra
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Core Endpoints

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

#### Tractors
- `GET /tractors` - List all tractors
- `POST /tractors` - Add new tractor
- `GET /tractors/:id` - Get tractor details
- `PUT /tractors/:id` - Update tractor
- `DELETE /tractors/:id` - Delete tractor

#### Bookings
- `GET /bookings` - User's bookings
- `POST /bookings` - Create booking
- `PUT /bookings/:id` - Update booking status
- `DELETE /bookings/:id` - Cancel booking

#### Messages
- `GET /messages/:userId` - Fetch conversations
- `POST /messages` - Send message
- `GET /messages/:conversationId` - Get conversation history

#### Mandi Prices
- `GET /mandi/prices` - Get market prices
- `GET /mandi/prices/:product` - Get specific product prices

#### Schemes
- `GET /schemes` - List government schemes
- `GET /schemes/:id` - Scheme details

#### Analytics
- `GET /analytics/dashboard` - User dashboard stats
- `GET /analytics/activity` - Activity logs

---

## 🔐 User Roles

| Role | Features |
|------|----------|
| **Farmer** | Book tractors, hire labour, view schemes, check mandi prices |
| **Equipment Owner** | List & manage tractors, view bookings |
| **Labour** | Accept jobs, manage profile |
| **Admin** | Manage all users, schemes, and analytics |
| **Government** | View farmer statistics, publish schemes |

---

## 🛠️ Development

### Build for Production
```bash
cd shetkari-mitra
npm run build
```
Output: `/dist` folder

### Linting
```bash
npm run lint
```

### Running Tests (if available)
```bash
npm test
```

---

## 🌐 Deployment

### Deploy Frontend to Vercel
```bash
cd shetkari-mitra
npm install -g vercel
vercel
```

Set environment variables in Vercel dashboard:
```
VITE_API_URL=https://your-backend-url.com/api/v1
```

### Deploy Backend to Heroku/Railway
1. Ensure `PORT` env var is set
2. Add MongoDB Atlas connection
3. Add all required `.env` variables in your hosting platform

---

## 📁 Project Structure Details

```
server/
├── controllers/
│   ├── authController.js       # User registration, login, JWT
│   ├── tractorController.js    # Tractor CRUD operations
│   ├── bookingController.js    # Booking management
│   ├── mandiController.js      # Market price data
│   ├── schemeController.js     # Government schemes
│   ├── jobController.js        # Labour job postings
│   ├── messageController.js    # Messaging system
│   ├── notificationController.js # Notifications
│   └── analyticsController.js  # Dashboard analytics
│
├── models/
│   ├── User.js                 # User schema
│   ├── Tractor.js              # Equipment schema
│   ├── Booking.js              # Booking schema
│   ├── Job.js                  # Labour job schema
│   ├── Message.js              # Message schema
│   ├── Notification.js         # Notification schema
│   ├── Scheme.js               # Government scheme schema
│   ├── ActivityLog.js          # User activity tracking
│   └── OTP.js                  # OTP for verification
│
├── routes/
│   ├── auth.js                 # Auth routes
│   ├── tractorRoutes.js        # Tractor endpoints
│   ├── bookingRoutes.js        # Booking endpoints
│   └── [others]                # Other feature routes
│
├── middleware/
│   ├── auth.js                 # JWT verification
│   ├── roleMiddleware.js       # Role-based access control
│   └── authMiddleware.js       # Additional auth logic
│
└── server.js                   # Express app setup

shetkari-mitra/
├── src/
│   ├── pages/                  # Route components
│   │   ├── Dashboard.jsx       # User dashboard
│   │   ├── Login.jsx           # Login page
│   │   ├── Marketplace.jsx     # Tractor/Labour marketplace
│   │   ├── Messages.jsx        # Chat interface
│   │   ├── MandiPrices.jsx     # Market prices
│   │   ├── Schemes.jsx         # Government schemes
│   │   └── [others]            # Other pages
│   │
│   ├── components/
│   │   ├── Navbar.jsx          # Main navigation
│   │   ├── Card.jsx            # Reusable card component
│   │   ├── NotificationBell.jsx # Notification UI
│   │   ├── ProfileDropdown.jsx # User menu
│   │   └── ProtectedRoute.jsx  # Private route wrapper
│   │
│   ├── context/
│   │   ├── AuthContext.jsx     # Global auth state
│   │   ├── ChatContext.jsx     # Messaging state
│   │   ├── DarkModeContext.jsx # Theme state
│   │   ├── LanguageContext.jsx # i18n support
│   │   └── [others]            # Other context
│   │
│   ├── services/
│   │   ├── api.js              # Axios instance with interceptors
│   │   ├── weather.js          # Weather API integration
│   │   └── analytics.js        # Analytics service
│   │
│   ├── redux/
│   │   ├── store.js            # Redux store configuration
│   │   └── slices/
│   │       └── authSlice.js    # Auth state management
│   │
│   └── utils/
│       └── lang.js             # Language utilities
│
└── public/
    └── manifest.json           # PWA manifest
```

---

## 🔒 Security

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Environment variables for secrets
- ✅ CORS enabled for frontend origin
- ✅ Input validation & sanitization

---

## 📝 Environment Variables Checklist

- [ ] Backend `.env` with all required keys
- [ ] Frontend `.env.local` with API URL
- [ ] Database connection string (MongoDB Atlas)
- [ ] JWT secret (strong, random key)
- [ ] Email credentials (Gmail App Password)
- [ ] API keys (Fast2SMS, data.gov.in, Razorpay)
- [ ] Frontend URL in backend `.env`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📧 Support & Contact

- **Email:** support@shetkari-mitra.com
- **Issues:** [GitHub Issues](https://github.com/yourusername/shetkari-mitra/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/shetkari-mitra/discussions)

---

## 🙏 Acknowledgments

- Built with ❤️ for Indian farmers
- Inspired by agricultural challenges and digital solutions
- Thanks to the open-source community

---

**Last Updated:** May 2026
