// src/dashboard/FarmerDashboard.js
import React from "react";
import Sidebar from "./Sidebar";
import FarmerForm from "../components/FarmerForm";
import FarmerList from "../components/FarmerList";

function FarmerDashboard() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "40px" }}>
        <h2>Farmer Dashboard</h2>
        <FarmerForm />
        <FarmerList />
      </div>
    </div>
  );
}

export default FarmerDashboard;