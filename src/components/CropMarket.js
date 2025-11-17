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
      // get current user details from firebase
      const auth = getAuth();
      const user = auth.currentUser;
      let buyerUid = null;
      let buyerName = null;
      if (user) {
        buyerUid = user.uid;
        const docRef = doc(db, "users", buyerUid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          buyerName = data.fullName || (data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : data.name) || null;
        }
      }

      // get farmer name
      let farmerName = null;
      if (crop.farmerId) {
        try {
          const farmerDocRef = doc(db, "users", crop.farmerId);
          const farmerDocSnap = await getDoc(farmerDocRef);
          if (farmerDocSnap.exists()) {
            const farmerData = farmerDocSnap.data();
            farmerName = farmerData.fullName || (farmerData.firstName && farmerData.lastName ? `${farmerData.firstName} ${farmerData.lastName}` : farmerData.name) || null;
          }
        } catch (err) {
          console.error("Error fetching farmer name:", err);
        }
      }

      // create order first
      const orderPayload = {
        buyerUid,
        buyerName,
        farmerId: crop.farmerId,
        farmerName: farmerName,
        cropId: crop.id,
        cropType: crop.cropType,
        cropName: crop.cropName || crop.cropType,
        quantity: amount,
        status: "PENDING"
      };

      await axios.post("http://localhost:8081/orders", orderPayload);

      // server validates and decrements crop quantity atomically
      showToast("Purchase successful! Order created.", "success");
      fetchCrops();
    } catch (err) {
      console.error("Error purchasing crop:", err);
      const msg = err?.response?.data || err.message || "Error purchasing crop";
      showToast(msg, "error");
    }
  };

  useEffect(() => {
    fetchUserRole();
    fetchCrops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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