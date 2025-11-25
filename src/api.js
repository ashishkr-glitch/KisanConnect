import axios from "axios";

// Shared axios instance with baseURL and interceptors
const api = axios.create({
  baseURL: "/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: add auth token if available
api.interceptors.request.use((config) => {
  const uid = localStorage.getItem("uid");
  if (uid) {
    config.headers.Authorization = `Bearer ${uid}`;
  }
  return config;
});

// Response interceptor: log errors (can add redirect to login on 401 if needed)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Optional: log errors or redirect to login on 401
    // if (err.response?.status === 401) window.location.href = "/login";
    return Promise.reject(err);
  }
);

export default api;
