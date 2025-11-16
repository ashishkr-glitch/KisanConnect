import React, { useState } from "react";
// import FarmerList from "../admin/FarmerList";
// import BuyerList from "../admin/BuyerList";
import CropAnalytics from "../dashboard/CropAnalytics";
import "./AdminDashboard.css";
import FarmerList from "../pages/FarmerList";
import BuyerList from "../pages/BuyerList";

// ✅ Admin Dashboard with Tabs
function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("farmers");

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

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