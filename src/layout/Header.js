import React from "react";
import useUserProfile from "../hooks/useUserProfile";
import "./Header.css";

// ✅ Header with user info + patriotic greeting
function Header() {
  // Get user details from localStorage
  const profile = {
    name: localStorage.getItem("full_name") || "-",
    role: localStorage.getItem("role") || "-",
    district: localStorage.getItem("district") || "-",
    state: localStorage.getItem("state") || "-"
  };

  return (
    <header className="dashboard-header">
      <div className="left">
        <h2>Jai Jawan Jai Kisan 🇮🇳</h2>
        <p>Empowering Farmers, Buyers & Bharat</p>
      </div>

      <div className="right">
        <div className="user-info">
          <strong>{profile.name}</strong> ({profile.role})
          <br />
          {profile.district}, {profile.state}
        </div>
      </div>
    </header>
  );
}

export default Header;