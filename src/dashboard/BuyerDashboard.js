import React from "react";
import Sidebar from "./Sidebar";
import CropMarket from "../components/CropMarket";

// ✅ Buyer Dashboard Component
function BuyerDashboard() {
  return (
    <div className="buyer-dashboard">
      <Sidebar />
      <main className="buyer-main">
        <h2>Buyer Dashboard</h2>

        {/* ✅ Crop Market View */}
        <section>
          <h3>Available Crops</h3>
          <CropMarket />
        </section>
      </main>
    </div>
  );
}

export default BuyerDashboard;