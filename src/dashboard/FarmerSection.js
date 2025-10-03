// src/dashboard/FarmerSection.js
import React from "react";
import FarmerForm from "../components/FarmerForm";
import FarmerList from "../components/FarmerList";

function FarmerSection() {
  return (
    <div>
      <h2>Farmer Management</h2>
      <FarmerForm />
      <FarmerList />
    </div>
  );
}

export default FarmerSection;