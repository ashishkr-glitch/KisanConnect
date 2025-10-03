// src/components/FarmerForm.js
import React, { useState } from "react";
import axios from "axios";
import "./FarmerForm.css";

function FarmerForm() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    cropType: "",
    harvestDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/farmers", formData);
      alert("Farmer added successfully!");
      setFormData({
        name: "",
        location: "",
        cropType: "",
        harvestDate: "",
      });
    } catch (error) {
      alert("Error adding farmer. Please try again.");
    }
  };

  return (
    <div className="farmer-form-container">
      <h2>Add Farmer Details</h2>
      <form onSubmit={handleSubmit} className="farmer-form">
        <input
          name="name"
          placeholder="👤 Farmer Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          placeholder="📍 Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <input
          name="cropType"
          placeholder="🌱 Crop Type"
          value={formData.cropType}
          onChange={handleChange}
          required
        />
        <input
          name="harvestDate"
          type="date"
          value={formData.harvestDate}
          onChange={handleChange}
          required
        />
        <button type="submit"> Submit Farmer</button>
      </form>
    </div>
  );
}

export default FarmerForm;