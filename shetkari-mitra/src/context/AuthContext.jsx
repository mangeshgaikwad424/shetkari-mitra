import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("shetkari_user");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [activityHistory, setActivityHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("shetkari_history");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Verify token is still valid on mount — only update if backend responds OK
  // Do NOT clear user if backend is unreachable (offline/local mode)
  useEffect(() => {
    const token = localStorage.getItem("shetkari_token");
    if (token && user) {
      api.get("/auth/me").then(res => {
        if (res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem("shetkari_user", JSON.stringify(res.data.user));
        }
      }).catch((err) => {
        // Only log out if token is explicitly rejected (401), not for network errors
        if (err?.response?.status === 401) {
          setUser(null);
          localStorage.removeItem("shetkari_user");
          localStorage.removeItem("shetkari_token");
        }
        // For network errors (backend offline), keep the local user session intact
      });
    }
  }, []);

  useEffect(() => {
    if (user) localStorage.setItem("shetkari_user", JSON.stringify(user));
    else localStorage.removeItem("shetkari_user");
  }, [user]);

  useEffect(() => {
    localStorage.setItem("shetkari_history", JSON.stringify(activityHistory));
  }, [activityHistory]);

  const login = (userData, token) => {
    setUser(userData);
    if (token) localStorage.setItem("shetkari_token", token);
    addActivity("login", `Logged in as ${userData.name} (${userData.role})`);
  };

  const logout = () => {
    addActivity("logout", "Logged out");
    setUser(null);
    localStorage.removeItem("shetkari_user");
    localStorage.removeItem("shetkari_token");
  };

  const addActivity = (type, description) => {
    const entry = { id: Date.now(), type, description, timestamp: new Date().toISOString() };
    setActivityHistory(prev => [entry, ...prev].slice(0, 50));
  };

  const clearHistory = () => {
    setActivityHistory([]);
    localStorage.removeItem("shetkari_history");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, activityHistory, addActivity, clearHistory }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
