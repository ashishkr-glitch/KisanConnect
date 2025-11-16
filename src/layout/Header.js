import React from "react";
import useUserProfile from "../hooks/useUserProfile";
import "./Header.css";

// ✅ Header with user info + patriotic greeting
function Header() {
  const profile = useUserProfile();

  return (
    <header className="dashboard-header">
      <div className="left">
        <h2>Jai Jawan Jai Kisan 🇮🇳</h2>
        <p>Empowering Farmers, Buyers & Bharat</p>
      </div>

      <div className="right">
        {profile ? (
          <div className="user-info">
            <strong>{profile.name}</strong> ({profile.role})
            <br />
            {profile.district}, {profile.state}
          </div>
        ) : (
          <p>Loading user...</p>
        )}
      </div>
    </header>
  );
}

export default Header;