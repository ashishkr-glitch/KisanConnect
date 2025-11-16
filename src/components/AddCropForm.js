import React, { useState } from "react";
import axios from "axios";
import "./AddCropForm.css";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// ✅ Crop Add Form for Farmers
function AddCropForm() {
  const [cropType, setCropType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    const user = auth.currentUser;
    const farmerId = user?.uid;

    if (!farmerId) {
      alert("Farmer UID not found. Please login again.");
      return;
    }

    const payload = {
      farmerId,
      cropType,
      quantity,
      harvestDate
    };

    try {
      await axios.post("http://localhost:8081/crops", payload);
      // Navigate to My Crops so user can immediately see the new crop
      // pass a small state flag so the list can show a success message
      navigate("/dashboard/my-crops", { replace: true, state: { added: true } });

      // ✅ Reset form
      setCropType("");
      setQuantity("");
      setHarvestDate("");
    } catch (error) {
      alert("Error adding crop: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-crop-form">
      <input
        type="text"
        placeholder="Crop Type"
        value={cropType}
        onChange={(e) => setCropType(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Quantity (kg)"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      />
      <input
        type="date"
        value={harvestDate}
        onChange={(e) => setHarvestDate(e.target.value)}
        required
      />
      <button type="submit">Add Crop</button>
    </form>
  );
}

export default AddCropForm;