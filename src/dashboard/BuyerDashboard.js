import React, { useState } from "react";
import useUserProfile from "../hooks/useUserProfile";
// Sidebar is provided by the global Layout; do not import here to avoid duplication
import CropMarket from "../components/CropMarket";
import FarmerList from "../pages/FarmerList";
import "./BuyerDashboard.css";

// ✅ Buyer Dashboard Component
function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState("crops");

  // Simulate buyer name (replace with actual logic if available)
    const { profile } = useUserProfile();
    const buyerFullName = profile?.fullName || localStorage.getItem("full_name") || "Buyer";
  return (
    <div className="buyer-dashboard">
      <h2 style={{marginBottom: 16, fontWeight: 700, fontSize: 20, color: '#388e3c'}}>Welcome, {buyerFullName}!</h2>
      <main className="buyer-main">
        {/* Tab Navigation */}
        <div className="buyer-tab-buttons">
          <button 
            onClick={() => setActiveTab("crops")} 
            className={activeTab === "crops" ? "active" : ""}
          >
            Available Crops
          </button>
          <button 
            onClick={() => setActiveTab("farmers")} 
            className={activeTab === "farmers" ? "active" : ""}
          >
            Farmers
          </button>
        </div>

        {/* Tab Content */}
        <div className="buyer-tab-content">
          {activeTab === "crops" && (
            <section>
              <h3>Available Crops</h3>
              <CropMarket />
            </section>
          )}

          {activeTab === "farmers" && (
            <section>
              <h3>All Farmers</h3>
              <FarmerList />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default BuyerDashboard;