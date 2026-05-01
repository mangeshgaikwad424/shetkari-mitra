import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const api = axios.create({
  baseURL: BASE,
});

// Attach JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("shetkari_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handler — redirect on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("shetkari_token");
      localStorage.removeItem("shetkari_user");
      // Optionally: window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
