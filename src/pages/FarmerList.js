import React, { useEffect, useState, useCallback } from "react";
import api from "../api";
import useRole from "../hooks/useRole";
import useToast from "../hooks/useToast";
import RatingComponent from "../components/RatingComponent";
import "./FarmerList.css";

function FarmerList() {
  const [farmers, setFarmers] = useState([]);
  const [loadingFarmers, setLoadingFarmers] = useState(true);
  const [errorFarmers, setErrorFarmers] = useState(null);
  
  const { role } = useRole();
  const { showToast } = useToast();

  const fetchFarmers = useCallback(async () => {
    setLoadingFarmers(true);
    setErrorFarmers(null);
    try {
      console.log("📡 Fetching farmers from backend...");
      const res = await api.get(`/farmers`, { timeout: 10000 });
      setFarmers(res.data || []);
      console.log("✅ Farmers loaded:", res.data?.length || 0);
    } catch (err) {
      console.error("❌ Error fetching farmers:", err.message);
      setErrorFarmers(err.message || "Failed to load farmers");
      setFarmers([]);
      showToast("Could not load farmers", "error");
    } finally {
      setLoadingFarmers(false);
    }
  }, [showToast]);

  const handleDelete = async (uid) => {
    const confirm = window.confirm("Are you sure you want to delete this farmer?");
    if (!confirm) return;

    try {
      await api.delete(`/farmers/${uid}`);
      await api.delete(`/users/${uid}`);
      showToast("Farmer deleted successfully", "success");
      fetchFarmers();
    } catch (err) {
      console.error("Error deleting farmer:", err);
      showToast("Error deleting farmer", "error");
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []); // Empty dependency array: fetch only on mount, never again

  if (errorFarmers) {
    return (
      <div className="farmer-list">
        <p style={{ color: "red" }}>⚠️ {errorFarmers}</p>
        <button 
          onClick={() => fetchFarmers()} 
          style={{ padding: "0.5rem 1rem", backgroundColor: "#3498db", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (loadingFarmers) return <p>⏳ Loading farmers...</p>;

  return (
    <div className="farmer-list">
      {role === "admin" && <h2>Farmer List</h2>}
      {role === "buyer" && <h2>All Farmers</h2>}
      {role === "farmer" && <h2>Farmer List</h2>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Mobile</th>
            <th>District</th>
            <th>State</th>
            {role === "buyer" && <th>Rating</th>}
            <th>UID</th>
            {role === "admin" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {farmers.map((farmer) => (
            <tr key={farmer.uid}>
              <td>{farmer.firstName && farmer.lastName ? `${farmer.firstName} ${farmer.lastName}` : farmer.firstName || farmer.lastName || farmer.name || "N/A"}</td>
              <td>{farmer.mobile}</td>
              <td>{farmer.district}</td>
              <td>{farmer.state}</td>
              {role === "buyer" && (
                <td style={{ padding: "8px" }}>
                  <RatingComponent
                    rating={farmer.rating || 0}
                    reviewCount={farmer.reviewCount || 0}
                    size="small"
                    showCount={false}
                    onRate={(data) => {
                      console.log("Farmer rated:", data);
                      showToast("Rating submitted successfully!", "success");
                    }}
                  />
                </td>
              )}
              <td>{(farmer.uid || "").toString().substring(0,5).toUpperCase()}</td>
              {role === "admin" && (
                <td>
                  <button className="danger" onClick={() => handleDelete(farmer.uid)}>
                    Delete
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

export default FarmerList;