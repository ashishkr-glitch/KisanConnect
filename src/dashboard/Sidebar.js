// src/dashboard/Sidebar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logout successful!");
      navigate("/"); // ✅ Redirect to login
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  return (
    <div style={{
      width: "220px",
      background: "#2c3e50",
      color: "white",
      height: "100vh",
      padding: "20px"
    }}>
      <h3>KisanConnect</h3>
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li><Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>Farmers</Link></li>
        </ul>
      </nav>
      <button onClick={handleLogout} style={{
        marginTop: "20px",
        padding: "10px",
        background: "#e74c3c",
        color: "white",
        border: "none",
        cursor: "pointer"
      }}>
        Logout
      </button>
    </div>
  );
}

export default Sidebar;