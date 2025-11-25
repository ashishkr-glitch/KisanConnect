// src/auth/Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "./Login.css"; // ✅ Styling file

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Only use backend API for login
      let uid = null;
      let role = null;
      let fullName = null;
      const response = await api.post(`/auth/login-offline`, {
        email,
        password
      });
      // Dev debug: log full response to help trace missing fields
      try {
        // eslint-disable-next-line no-console
        console.log("[DEBUG][login] response:", response && response.data ? response.data : response);
      } catch (e) {}
      if (response.data && response.data.uid) {
        uid = response.data.uid;
        // extract role from common fields the backend may return
        const rawRole = response.data.role || response.data.roleName || response.data.role_type || response.data.role_name || response.data.roleType || "";
        const normalizeRole = (raw) => {
          try {
            if (!raw) return "";
            let r = raw.toString().trim().toLowerCase();
            if (r.startsWith("role_")) r = r.substring(5);
            if (r.startsWith("role-")) r = r.substring(5);
            if (r === "administrator" || r === "adminstrator") r = "admin";
            if (r === "seller") r = "farmer";
            if (r === "consumer" || r === "customer") r = "buyer";
            if (["admin", "farmer", "buyer"].includes(r)) return r;
            return "";
          } catch (e) {
            return "";
          }
        };
        role = normalizeRole(rawRole) || (response.data.role ? response.data.role.toString().toLowerCase() : null);
        // backend may return camelCase `fullName` or snake_case `full_name`
        fullName = response.data.fullName || response.data.full_name || response.data.full_name_text || "";
        // response data stored to localStorage above; no local userData variable required
        try { localStorage.setItem("uid", uid); } catch (e) {}
        try { localStorage.setItem("role", role ? role.toString().toLowerCase() : ""); } catch (e) {}
        try { localStorage.setItem("full_name", fullName || ""); } catch (e) {}
        if (response.data.email) localStorage.setItem("email", response.data.email);
        // Notify the app that auth/role changed so UI can update without reload
        try { window.dispatchEvent(new Event('kc-auth-change')); } catch (e) {}
        // If backend did not return a role in the login response, fetch full user by uid
        if (!role) {
          try {
            const userResp = await api.get(`/users/${encodeURIComponent(uid)}`);
            if (userResp && userResp.data && userResp.data.role) {
              const rr = userResp.data.role;
              const normalizeRole = (raw) => {
                try {
                  if (!raw) return "";
                  let r = raw.toString().trim().toLowerCase();
                  if (r.startsWith("role_")) r = r.substring(5);
                  if (r.startsWith("role-")) r = r.substring(5);
                  if (r === "administrator" || r === "adminstrator") r = "admin";
                  if (r === "seller") r = "farmer";
                  if (r === "consumer" || r === "customer") r = "buyer";
                  if (["admin", "farmer", "buyer"].includes(r)) return r;
                  return "";
                } catch (e) { return ""; }
              };
              role = normalizeRole(rr) || rr;
              try { localStorage.setItem("role", role ? role.toString().toLowerCase() : ""); } catch (e) {}
            }
          } catch (e) {
            // ignore - best effort
          }
        }
        try {
          // eslint-disable-next-line no-console
          console.log("[DEBUG][login] stored uid, role:", localStorage.getItem("uid"), localStorage.getItem("role"));
        } catch (e) {}
        alert("Logged in!");
        // Success: go to dashboard
        navigate("/dashboard");
      } else {
        alert("Login failed: Invalid credentials");
      }
    } catch (error) {
      // Better error messages for axios errors
      console.error("[Login] Login error:", error);
      const msg = error?.response?.data?.message || error?.response?.data || error?.message || "Login failed";
      alert("Login failed: " + (typeof msg === "string" ? msg : JSON.stringify(msg)));
    }
    setLoading(false);
  };

  return (
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
  );
}

export default Login;