// src/dashboard/Dashboard.js
import React from "react";
import Sidebar from "./Sidebar"; // ✅ Make sure this import is present
import FarmerSection from "./FarmerSection"; // Optional


function Dashboard() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar /> {/* ✅ This line renders the sidebar */}
      <div style={{ flex: 1 }}>
        <FarmerSection /> {/* Or any other content */}
      </div>
    </div>

  );
}

export default Dashboard;