import React, { useEffect, useState } from "react";
import api from "../api";
import "./CropList.css";
import useRole from "../hooks/useRole";

function CropList() {
  const [crops, setCrops] = useState([]);
  const { role } = useRole();

  const fetchCrops = async () => {
    try {
      const res = await api.get(`/crops`);
      setCrops(res.data);
    } catch (err) {
      console.error("Error fetching crops:", err);
    }
  };

  const handleDeleteCrop = async (cropId) => {
    try {
      await api.delete(`/crops/${cropId}`);
      alert("Crop deleted successfully!");
      fetchCrops();
    } catch (err) {
      alert("Error deleting crop: " + err.message);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  return (
    <div className="crop-list">
      <h2>Crop Market</h2>
      <table>
        <thead>
          <tr>
            <th>Crop Type</th>
            <th>Quantity</th>
            <th>Harvest Date</th>
            <th>Farmer UID</th>
            {role === "admin" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {crops.map((crop) => (
            <tr key={crop.id}>
              <td>{crop.cropType}</td>
              <td>{crop.quantity}</td>
              <td>{crop.harvestDate}</td>
                  <td>{(crop.farmerId || "").toString().toUpperCase()}</td>
              {role === "admin" && (
                <td>
                  <button onClick={() => handleDeleteCrop(crop.id)} className="btn-danger">Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CropList;