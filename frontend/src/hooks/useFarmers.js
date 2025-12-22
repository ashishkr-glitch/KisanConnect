import { useEffect, useState } from "react";
import api from "../api";

// ✅ Custom hook to fetch all farmers (admin only)
function useFarmers() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchFarmers = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get(`/farmers`);
      setFarmers(res.data);
    } catch (err) {
      setError("Error fetching farmers: " + err.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  return { farmers, loading, error, fetchFarmers };
}

export default useFarmers;