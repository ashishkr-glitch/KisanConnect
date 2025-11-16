import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CropListByFarmer.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";

// ✅ Farmer's Crop List Component
function CropListByFarmer() {
  const [crops, setCrops] = useState([]);
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const fetchCropsForFarmer = async (farmerId) => {
    if (!farmerId) return;

    try {
      const res = await axios.get(`http://localhost:8081/crops/farmer/${farmerId}`);
      setCrops(res.data);
    } catch (err) {
      console.error("Error fetching crops:", err);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    // If currentUser already exists (auth ready), fetch immediately
    const user = auth.currentUser;
    if (user && user.uid) {
      fetchCropsForFarmer(user.uid);
    }

    // Also subscribe in case auth wasn't ready yet
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u && u.uid) fetchCropsForFarmer(u.uid);
    });

    // If navigated here with a success state, show message then clear it
    if (location?.state?.added) {
      setMessage("Crop added successfully");
      // clear the state so message doesn't persist on back/refresh
      navigate(location.pathname, { replace: true, state: {} });
      // hide after 2.5s
      setTimeout(() => setMessage(""), 2500);
    }

    return () => unsubscribe();
  }, []);

  const handleDelete = async (cropId) => {
    const confirm = window.confirm("Are you sure you want to delete this crop?");
    if (!confirm) return;
    try {
      await axios.delete(`http://localhost:8081/crops/${cropId}`);
      setMessage("Crop deleted successfully");
      setTimeout(() => setMessage(""), 2000);
      // Refresh crop list
      const auth = getAuth();
      const user = auth.currentUser;
      if (user && user.uid) fetchCropsForFarmer(user.uid);
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