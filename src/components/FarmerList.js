// src/components/FarmerList.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FarmerList.css";

function FarmerList() {
  const [farmers, setFarmers] = useState([]);

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const response = await axios.get("/farmers");
      setFarmers(response.data);
    } catch (error) {
      console.error("Error fetching farmers:", error);
    }
  };

  return (
    <div className="farmer-list-container">
      <h2>Registered Farmers</h2>
      <table className="farmer-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Location</th>
            <th>Crop Type</th>
            <th>Harvest Date</th>
          </tr>
        </thead>
        <tbody>
          {farmers.map((farmer) => (
            <tr key={farmer.id}>
              <td>{farmer.id}</td>
              <td>{farmer.name}</td>
              <td>{farmer.location}</td>
              <td>{farmer.cropType}</td>
              <td>{farmer.harvestDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FarmerList;