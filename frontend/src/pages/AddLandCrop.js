import React, { useState } from "react";
import api from "../api";
import useRole from "../hooks/useRole";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import "./AddLandCrop.css";

function AddLandCrop() {
  const [formData, setFormData] = useState({
    landSize: "",
    location: "",
    cropType: "",
    harvestDate: ""
  });

  const { role, loading: roleLoading } = useRole();
  const { uid } = useAuth();
  const { showToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { ...formData, farmerId: uid };
      await api.post(`/land-crop`, payload);
      showToast("Land and crop details submitted successfully!", "success");
      setFormData({ landSize: "", location: "", cropType: "", harvestDate: "" });
    } catch (error) {
      console.error("Submission failed:", error);
      showToast("Submission failed. Please try again.", "error");
    }
  };

  if (roleLoading) return <p>Checking access...</p>;
  if (role !== "farmer") return <p>Unauthorized access</p>;

  return (
    <div className="land-crop-container">
      <h2>Add Land & Crop Details</h2>
      <form onSubmit={handleSubmit}>
        <input name="landSize" placeholder="Land Size (in acres)" value={formData.landSize} onChange={handleChange} required />
        <input name="location" placeholder="Land Location" value={formData.location} onChange={handleChange} required />
        <input name="cropType" placeholder="Crop Type" value={formData.cropType} onChange={handleChange} required />
        <input name="harvestDate" type="date" value={formData.harvestDate} onChange={handleChange} required />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddLandCrop;