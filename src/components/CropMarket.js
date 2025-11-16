import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import useToast from "../hooks/useToast"; // ✅ Toast hook
import "./CropMarket.css";

function CropMarket() {
  const [crops, setCrops] = useState([]);
  const [purchaseAmount, setPurchaseAmount] = useState({});
  const [role, setRole] = useState("");
  const { showToast } = useToast();

  const fetchCrops = async () => {
    try {
      const res = await axios.get("http://localhost:8081/crops");
      setCrops(res.data);
    } catch (err) {
      console.error("Error fetching crops:", err);
      showToast("Failed to load crops", "error");
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

  const handlePurchase = async (crop) => {
    const amount = parseInt(purchaseAmount[crop.id]);
    if (!amount || amount <= 0 || amount > crop.quantity) {
      showToast("Invalid quantity", "error");
      return;
    }

    try {
      await axios.put(`http://localhost:8081/crops/${crop.id}`, {
        ...crop,
        quantity: crop.quantity - amount,
      });
      showToast("Purchase successful!", "success");
      fetchCrops();
    } catch (err) {
      console.error("Error purchasing crop:", err);
      showToast("Error purchasing crop", "error");
    }
  };

  useEffect(() => {
    fetchUserRole();
    fetchCrops();
  }, []);

  return (
    <div className="crop-market">
      <table>
        <thead>
          <tr>
            <th>Crop Type</th>
            <th>Quantity</th>
            <th>Harvest Date</th>
            <th>Farmer ID</th>
            {role === "buyer" && <th>Purchase</th>}
          </tr>
        </thead>
        <tbody>
          {crops.map((crop) => (
            <tr key={crop.id}>
              <td>{crop.cropType}</td>
              <td>{crop.quantity}</td>
              <td>{crop.harvestDate}</td>
              <td>{crop.farmerId}</td>
              {role === "buyer" && (
                <td>
                  <input
                    type="number"
                    placeholder="Qty"
                    value={purchaseAmount[crop.id] || ""}
                    onChange={(e) =>
                      setPurchaseAmount({
                        ...purchaseAmount,
                        [crop.id]: e.target.value,
                      })
                    }
                    style={{ width: "80px", marginRight: "8px" }}
                  />
                  <button
                    onClick={() => handlePurchase(crop)}
                    style={{
                      padding: "6px 10px",
                      backgroundColor: "#27ae60",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Buy
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CropMarket;