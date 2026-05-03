import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { BookingProvider } from "./context/BookingContext";
import { ChatProvider } from "./context/ChatContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Tractor from "./pages/Tractor";
import Labour from "./pages/Labour";
import CropDoctor from "./pages/CropDoctor";
import Weather from "./pages/Weather";
import Schemes from "./pages/Schemes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MandiPrices from "./pages/MandiPrices";

// Feature pages
import LandRecords from "./pages/LandRecords";
import VoiceAssistant from "./pages/VoiceAssistant";
import SoilHealth from "./pages/SoilHealth";
import Community from "./pages/Community";
import CropDisease from "./pages/CropDisease";
import Messages from "./pages/Messages";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <NotificationProvider>
          <ChatProvider>
            <BookingProvider>
              <BrowserRouter>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/weather" element={<Weather />} />
                  <Route path="/schemes" element={<Schemes />} />
                  <Route path="/mandi" element={<MandiPrices />} />

                  {/* Feature pages */}
                  <Route path="/land-records" element={<LandRecords />} />
                  <Route path="/voice" element={<VoiceAssistant />} />
                  <Route path="/soil-health" element={<SoilHealth />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/crop-disease" element={<CropDisease />} />

                  {/* Protected routes — must be logged in */}
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
                  <Route path="/tractor" element={<ProtectedRoute><Tractor /></ProtectedRoute>} />
                  <Route path="/labour" element={<ProtectedRoute><Labour /></ProtectedRoute>} />
                  <Route path="/crop" element={<ProtectedRoute><CropDoctor /></ProtectedRoute>} />
                  <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                </Routes>
              </BrowserRouter>
            </BookingProvider>
          </ChatProvider>
        </NotificationProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;