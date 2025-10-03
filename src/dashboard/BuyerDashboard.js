// src/dashboard/BuyerDashboard.js
import React from "react";
import Sidebar from "./Sidebar";
import CropMarket from "../components/CropMarket"; // ✅ You’ll create this later

function BuyerDashboard() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "40px" }}>
        <h2>Buyer Dashboard</h2>
        <CropMarket />
      </div>
    </div>
  );
}

export default BuyerDashboard;