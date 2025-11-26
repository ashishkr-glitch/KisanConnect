// src/auth/Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "./Login.css";
import ThemeToggle from "../components/ThemeToggle";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post(`/auth/login-offline`, { email, password });
      console.log("[DEBUG][login] response:", response?.data);

      if (!response?.data || !response.data.uid) {
        alert("Login failed: Invalid credentials or no response from server");
        setLoading(false);
        return;
      }

      const uid = response.data.uid;
      const role = (response.data.role || response.data.roleName || "").toString().toLowerCase();
      const fullName = response.data.fullName || response.data.full_name || "";
      try { localStorage.setItem("uid", uid); } catch (e) {}
      try { localStorage.setItem("role", role || ""); } catch (e) {}
      try { localStorage.setItem("full_name", fullName || ""); } catch (e) {}
      if (response.data.email) try { localStorage.setItem("email", response.data.email); } catch (e) {}
      try { window.dispatchEvent(new Event('kc-auth-change')); } catch (e) {}

      console.log("[DEBUG][login] stored uid, role:", localStorage.getItem("uid"), localStorage.getItem("role"));
      navigate("/dashboard");
    } catch (error) {
      console.error("[Login] Login error:", error);
      console.log("[Login] error.response status:", error?.response?.status);
      console.log("[Login] error.response data:", error?.response?.data);
      const msg = error?.response?.data?.message || error?.response?.data || error?.message || "Login failed";
      alert("Login failed: " + (typeof msg === "string" ? msg : JSON.stringify(msg)));
    }
    setLoading(false);
  };

  return (
    <div className="login-page-wrapper">
      {/* Left: Image in iframe */}
      <div className="login-image-container">
        <div className="login-image-inner">
          <div className="login-image-box">
            <img
              src="/images/farmer_photo_1.png"
              alt="Farmer working in field"
              loading="lazy"
              className="login-image-img"
            />
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="login-form-wrapper">
        <div className="login-header-actions">
          <ThemeToggle />
        </div>
        <div className="login-container">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input 
              type="email" 
              placeholder="Email" 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p>Not registered? <Link to="/signup">Signup here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;