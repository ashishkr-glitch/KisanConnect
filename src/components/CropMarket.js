import React, { useEffect, useState } from "react";
import api from "../api";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast"; // ✅ Toast hook
import SearchFilter from "./SearchFilter";
import "./CropMarket.css";

function CropMarket() {
  const [crops, setCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [purchaseAmount, setPurchaseAmount] = useState({});
  const [role, setRole] = useState("");
  const { showToast } = useToast();
  const auth = useAuth();

  const fetchCrops = async () => {
    try {
      const res = await api.get(`/crops`);
      setCrops(res.data);
      setFilteredCrops(res.data);
    } catch (err) {
      console.error("Error fetching crops:", err);
      showToast("Failed to load crops", "error");
    }
  };

  const fetchUserRole = async () => {
    const lsRole = localStorage.getItem("role");
    if (lsRole) {
      setRole(lsRole);
      return;
    }
    const uid = auth?.uid || localStorage.getItem("uid");
    if (uid) {
      try {
        const resp = await api.get(`/users/${uid}`);
        if (resp?.data?.role) setRole(resp.data.role);
      } catch (e) {}
    }
  };

  const handleSearch = (term) => {
    if (!term) {
      setFilteredCrops(crops);
      return;
    }
    const filtered = crops.filter((crop) =>
      crop.cropType?.toLowerCase().includes(term.toLowerCase()) ||
      crop.cropName?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCrops(filtered);
  };

  const handleFilter = (filters) => {
    let filtered = crops;

    // Filter by crop type
    if (filters.cropType) {
      filtered = filtered.filter((c) =>
        c.cropType?.toLowerCase().includes(filters.cropType.toLowerCase())
      );
    }

    // Filter by quantity range
    if (filters.quantityMin || filters.quantityMax) {
      const min = filters.quantityMin ? parseInt(filters.quantityMin) : 0;
      const max = filters.quantityMax ? parseInt(filters.quantityMax) : Infinity;
      filtered = filtered.filter((c) => {
        const qty = parseInt(c.quantity) || 0;
        return qty >= min && qty <= max;
      });
    }

    setFilteredCrops(filtered);
  };

  const handlePurchase = async (crop) => {
    const amount = parseInt(purchaseAmount[crop.id]);
    if (!amount || amount <= 0 || amount > crop.quantity) {
      showToast("Invalid quantity", "error");
      return;
    }

    try {
      // determine buyer identity from local storage/backend
      let buyerUid = auth?.uid || localStorage.getItem("uid");
      let buyerName = null;
      if (buyerUid) {
        try {
          const resp = await api.get(`/api/users/${buyerUid}`);
          if (resp?.data) {
            const data = resp.data;
            buyerName = data.fullName || (data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : data.name) || null;
          }
        } catch (e) {
          console.error("Error fetching buyer profile:", e);
        }
      }

      // get farmer name from backend if available
      let farmerName = null;
      if (crop.farmerId) {
        try {
          const farmerResp = await api.get(`/api/users/${crop.farmerId}`);
          if (farmerResp?.data) {
            const farmerData = farmerResp.data;
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

        await api.post(`/orders`, orderPayload);

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
      <SearchFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        searchPlaceholder="Search crops by name or type..."
        filterOptions={[
          {
            key: "cropType",
            label: "Crop Type",
            type: "text",
            placeholder: "e.g., Wheat, Rice",
          },
          {
            key: "quantity",
            label: "Quantity Range (kg)",
            type: "range",
          },
        ]}
      />

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
          {filteredCrops.length === 0 ? (
            <tr>
              <td colSpan={role === "buyer" ? 5 : 4} style={{ textAlign: "center", color: "#666" }}>
                No crops found
              </td>
            </tr>
          ) : (
            filteredCrops.map((crop) => (
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default CropMarket;