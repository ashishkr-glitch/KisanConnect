import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./Loader";
import "./EditFarmerForm.css";
import Toast from "./Toast";

// ✅ Edit Farmer Form inside Modal
function EditFarmerForm({ farmerId, onClose, onUpdate }) {
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const fetchFarmer = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8081/farmers/${farmerId}`);
      setFarmer(res.data);
    } catch (err) {
      console.error("Error fetching farmer:", err);
    }
    setLoading(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:8081/farmers/${farmerId}`, farmer);
      setToast("Farmer updated successfully!");
      if (onUpdate) onUpdate();
      setTimeout(() => {
        setToast("");
        onClose();
      }, 2000);
    } catch (err) {
      setToast("Error updating farmer: " + err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (farmerId) fetchFarmer();
  }, [farmerId]);

  if (loading || !farmer) return <Loader />;

  return (
    <form onSubmit={handleUpdate} className="edit-farmer-form">
      <input
        type="text"
        value={farmer.name}
        onChange={(e) => setFarmer({ ...farmer, name: e.target.value })}
        placeholder="Name"
        required
      />
      <input
        type="text"
        value={farmer.mobile}
        onChange={(e) => setFarmer({ ...farmer, mobile: e.target.value })}
        placeholder="Mobile"
        required
      />
      <input
        type="text"
        value={farmer.district}
        onChange={(e) => setFarmer({ ...farmer, district: e.target.value })}
        placeholder="District"
        required
      />
      <input
        type="text"
        value={farmer.state}
        onChange={(e) => setFarmer({ ...farmer, state: e.target.value })}
        placeholder="State"
        required
      />
      <button type="submit">Update Farmer</button>

      {toast && <Toast message={toast} type="success" onClose={() => setToast("")} />}
    </form>
  );
}

export default EditFarmerForm;