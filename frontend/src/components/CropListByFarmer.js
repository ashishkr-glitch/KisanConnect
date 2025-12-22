import React, { useEffect, useState } from "react";
import api from "../api";
import "./CropListByFarmer.css";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// ✅ Farmer's Crop List Component
function CropListByFarmer() {
  const [crops, setCrops] = useState([]);
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  
  const { uid: authUid } = useAuth();

  const fetchCropsForFarmer = async (farmerId) => {
    if (!farmerId) return;
    try {
      const res = await api.get(`/crops/farmer/${farmerId}`);
      setCrops(res.data);
    } catch (err) {
      console.error("Error fetching crops:", err);
    }
  };


  useEffect(() => {
    const farmerId = authUid || localStorage.getItem("uid");
    if (farmerId) fetchCropsForFarmer(farmerId);
  }, [authUid]);

  // Handle location state separately to avoid dependency loop
  useEffect(() => {
    if (location?.state?.added) {
      setMessage("Crop added successfully");
      // clear the state so message doesn't persist on back/refresh
      navigate(location.pathname, { replace: true, state: {} });
      // hide after 2.5s
      setTimeout(() => setMessage(""), 2500);
    }
  }, [location.pathname, location.state?.added, navigate]);

  const handleDelete = async (cropId) => {
    const confirm = window.confirm("Are you sure you want to delete this crop?");
    if (!confirm) return;
    try {
      await api.delete(`/crops/${cropId}`);
      setMessage("Crop deleted successfully");
      setTimeout(() => setMessage(""), 2000);
      // Refresh crop list using auth/localStorage fallback
      const farmerId = authUid || localStorage.getItem("uid");
      if (farmerId) fetchCropsForFarmer(farmerId);
    } catch (err) {
      setMessage("Error deleting crop: " + err.message);
      setTimeout(() => setMessage(""), 2000);
    }
  };

  return (
    <div className="crop-list-by-farmer">
      {message && <div style={{color: 'green', marginBottom: '10px'}}>{message}</div>}
      <table>
        <thead>
          <tr>
            <th>Crop Type</th>
            <th>Quantity</th>
            <th>Harvest Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {crops.map((crop) => (
            <tr key={crop.id}>
              <td>{crop.cropType}</td>
              <td>{crop.quantity}</td>
              <td>{crop.harvestDate}</td>
              <td>
                <button className="btn-danger" onClick={() => handleDelete(crop.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CropListByFarmer;