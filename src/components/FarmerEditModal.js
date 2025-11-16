import React, { useState, useEffect } from "react";
import axios from "axios";
import useToast from "../hooks/useToast";
import "./FarmerEditModal.css";

function FarmerEditModal({ isOpen, onClose, farmerData, onUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    cropType: "",
    harvestDate: "",
  });

  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (farmerData) {
      setFormData({
        name: farmerData.name || "",
        location: farmerData.location || "",
        cropType: farmerData.cropType || "",
        harvestDate: farmerData.harvestDate || "",
      });
    }
  }, [farmerData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:8081/farmers/${farmerData.id}`, formData);
      showToast("Farmer updated successfully!", "success");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating farmer:", error);
      showToast("Error updating farmer. Please try again.", "error");
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Farmer</h3>
        <form onSubmit={handleSubmit}>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Farmer Name" required />
          <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
          <input name="cropType" value={formData.cropType} onChange={handleChange} placeholder="Crop Type" required />
          <input name="harvestDate" type="date" value={formData.harvestDate} onChange={handleChange} required />
          <div className="modal-buttons">
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FarmerEditModal;