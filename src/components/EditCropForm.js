import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./Loader";
import "./EditCropForm.css";
import Toast from "./Toast";

// ✅ Edit Crop Form inside Modal
function EditCropForm({ cropId, onClose, onUpdate }) {
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const fetchCrop = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8081/crops/${cropId}`);
      setCrop(res.data);
    } catch (err) {
      console.error("Error fetching crop:", err);
    }
    setLoading(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:8081/crops/${cropId}`, crop);
      setToast("Crop updated successfully!");
      if (onUpdate) onUpdate();
      setTimeout(() => {
        setToast("");
        onClose();
      }, 2000);
    } catch (err) {
      setToast("Error updating crop: " + err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (cropId) fetchCrop();
  }, [cropId]);

  if (loading || !crop) return <Loader />;

  return (
    <form onSubmit={handleUpdate} className="edit-crop-form">
      <input
        type="text"
        value={crop.cropType}
        onChange={(e) => setCrop({ ...crop, cropType: e.target.value })}
        placeholder="Crop Type"
        required
      />
      <input
        type="number"
        value={crop.quantity}
        onChange={(e) => setCrop({ ...crop, quantity: e.target.value })}
        placeholder="Quantity"
        required
      />
      <input
        type="date"
        value={crop.harvestDate}
        onChange={(e) => setCrop({ ...crop, harvestDate: e.target.value })}
        required
      />
      <button type="submit">Update Crop</button>

      {toast && <Toast message={toast} type="success" onClose={() => setToast("")} />}
    </form>
  );
}

export default EditCropForm;