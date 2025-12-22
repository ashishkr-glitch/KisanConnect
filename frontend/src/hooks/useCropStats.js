import { useEffect, useState } from "react";
import api from "../api";

// ✅ Custom hook to fetch crop statistics (admin only)
function useCropStats() {
  const [stats, setStats] = useState({
    totalQuantity: 0,
    cropTypes: [],
    topDistricts: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get(`/crops/stats`);
      setStats(res.data);
    } catch (err) {
      setError("Error fetching crop stats: " + err.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error };
}

export default useCropStats;