import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FarmerDashboard from "./FarmerDashboard";
import TractorDashboard from "./TractorDashboard";
import LabourDashboard from "./LabourDashboard";
import GovDashboard from "./GovDashboard";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  const role = user.role?.toLowerCase?.() || "";

  if (role === "farmer") return <FarmerDashboard />;
  if (role === "tractor") return <TractorDashboard />;
  if (role === "labour") return <LabourDashboard />;
  if (role === "government") return <GovDashboard />;

  // Fallback — show role selector if role is somehow missing
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", background: "#f0faf4" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 40, textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", maxWidth: 400, width: "100%" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>Role Not Found</h2>
        <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>
          Your account role could not be determined. Please log out and log in again selecting your role.
        </p>
        <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 20 }}>Detected role: "{user.role || "none"}"</p>
        <button onClick={() => navigate("/login")}
          style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
          Go to Login
        </button>
      </div>
    </div>
  );
}
