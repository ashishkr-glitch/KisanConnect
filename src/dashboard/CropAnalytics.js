import React from "react";
import useCropStats from "../hooks/useCropStats";
import "./CropAnalytics.css";
import Loader from "../components/Loader";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// ✅ Crop Analytics Dashboard (Admin)
function CropAnalytics() {
  const { stats, loading, error } = useCropStats();

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;

  const pieData = {
    labels: stats.cropTypes,
    datasets: [
      {
        label: "Crop Types",
        data: stats.cropTypes.map(() => Math.floor(Math.random() * 100 + 20)), // Dummy distribution
        backgroundColor: ["#3498db", "#2ecc71", "#f39c12", "#e74c3c", "#9b59b6"],
      },
    ],
  };

  const barData = {
    labels: stats.topDistricts,
    datasets: [
      {
        label: "Top Districts",
        data: stats.topDistricts.map(() => Math.floor(Math.random() * 500 + 100)), // Dummy quantity
        backgroundColor: "#2ecc71",
      },
    ],
  };

  return (
    <div className="crop-analytics">
      <h2>Crop Analytics</h2>
      <p>Total Quantity: <strong>{stats.totalQuantity} kg</strong></p>

      <div className="charts">
        <div className="chart-box">
          <h4>Crop Type Distribution</h4>
          <Pie data={pieData} />
        </div>

        <div className="chart-box">
          <h4>Top Districts</h4>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
}

export default CropAnalytics;