import React, { useState } from "react";
import useUserProfile from "../hooks/useUserProfile";
// import FarmerList from "../admin/FarmerList";
// import BuyerList from "../admin/BuyerList";
import CropAnalytics from "../dashboard/CropAnalytics";
import "./AdminDashboard.css";
import FarmerList from "../pages/FarmerList";
import BuyerList from "../pages/BuyerList";

// ✅ Admin Dashboard with Tabs
function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("farmers");

  // Simulate admin name (replace with actual logic if available)
    const { profile } = useUserProfile();
    const adminFullName = profile?.fullName || localStorage.getItem("full_name") || "Admin";
  return (
    <div className="admin-dashboard" style={{
      background: 'linear-gradient(135deg, var(--body-gradient-start) 0%, var(--body-gradient-end) 100%)',
      color: 'var(--text-color)',
      padding: '20px',
      borderRadius: '8px',
      minHeight: '100vh'
    }}>

      <h2 className="dashboard-greeting">
        <span className="greeting-welcome">Welcome,</span>
        <br />
        <span className="greeting-name">{adminFullName}</span>
      </h2>
      <div className="tab-buttons">
        <button onClick={() => setActiveTab("farmers")} className={activeTab === "farmers" ? "active" : ""}>Farmers</button>
        <button onClick={() => setActiveTab("buyers")} className={activeTab === "buyers" ? "active" : ""}>Buyers</button>
        <button onClick={() => setActiveTab("analytics")} className={activeTab === "analytics" ? "active" : ""}>Crop Analytics</button>
      </div>

      <div className="tab-content">
        {activeTab === "farmers" && <FarmerList />}
        {activeTab === "buyers" && <BuyerList />}
        {activeTab === "analytics" && <CropAnalytics />}
      </div>
    </div>
  );
}

export default AdminDashboard;