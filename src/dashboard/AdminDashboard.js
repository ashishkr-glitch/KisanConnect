// src/dashboard/AdminDashboard.js
import React from "react";
import Sidebar from "./Sidebar";
import FarmerList from "../components/FarmerList";
import EditDeleteButtons from "../components/EditDeleteButtons"; // ✅ You’ll create this later

function AdminDashboard() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "40px" }}>
        <h2>Admin Dashboard</h2>
        <FarmerList />
        <EditDeleteButtons />
      </div>
    </div>
  );
}

export default AdminDashboard;