import React, { useEffect, useState } from "react";
import api from "../api";
import useRole from "../hooks/useRole";
import useToast from "../hooks/useToast";
import "./FarmerList.css";

function FarmerList() {
  const [farmers, setFarmers] = useState([]);
  const [loadingFarmers, setLoadingFarmers] = useState(true);
  
  const { role, loading: roleLoading } = useRole();
  const { showToast } = useToast();
  const API_URL = process.env.REACT_APP_API_URL;
  console.log("API_URL in FarmerList:", API_URL);

  const fetchFarmers = async () => {
    setLoadingFarmers(true);
    try {
      const res = await api.get(`/farmers`);
      setFarmers(res.data);
    } catch (err) {
      console.error("Error fetching farmers:", err);
      showToast("Error fetching farmers", "error");
    }
    setLoadingFarmers(false);
  };

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
  }, []);

  if (loadingFarmers) return <p>Loading farmers...</p>;

  return (
    <div className="farmer-list">
      {(role === "admin" || role === "farmer") && <h2>Farmer List</h2>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Mobile</th>
            <th>District</th>
            <th>State</th>
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