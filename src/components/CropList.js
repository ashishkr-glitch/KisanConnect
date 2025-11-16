import React, { useEffect, useState } from "react";
import axios from "axios";
import EditDeleteButtons from "./EditDeleteButtons";
import "./CropList.css";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function CropList() {
  const [crops, setCrops] = useState([]);
  const [role, setRole] = useState("");

  const fetchCrops = async () => {
    try {
      const res = await axios.get("http://localhost:8081/crops");
      setCrops(res.data);
    } catch (err) {
      console.error("Error fetching crops:", err);
    }
  };

  const fetchUserRole = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRole(docSnap.data().role);
      }
    }
  };

  const handleDeleteCrop = async (cropId) => {
    try {
      await axios.delete(`http://localhost:8081/crops/${cropId}`);
      alert("Crop deleted successfully!");
      fetchCrops();
    } catch (err) {
      alert("Error deleting crop: " + err.message);
    }
  };

  useEffect(() => {
    fetchUserRole();
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
            <th>Farmer ID</th>
            {role === "admin" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {crops.map((crop) => (
            <tr key={crop.id}>
              <td>{crop.cropType}</td>
              <td>{crop.quantity}</td>
              <td>{crop.harvestDate}</td>
              <td>{crop.farmerId}</td>
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