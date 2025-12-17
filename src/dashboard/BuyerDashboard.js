import React, { useState } from "react";
import useUserProfile from "../hooks/useUserProfile";
import CropMarket from "../components/CropMarket";
import FarmerList from "../pages/FarmerList";
import "./BuyerDashboard.css";

function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState("crops");
  const { profile } = useUserProfile();
  const buyerFullName = profile?.fullName || localStorage.getItem("full_name") || "Buyer";

  return (
    <div className="buyer-dashboard">
      <h2 className="dashboard-greeting">
        <span className="greeting-welcome">Welcome,</span>
        <br />
        <span className="greeting-name">{buyerFullName}</span>
      </h2>
      
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