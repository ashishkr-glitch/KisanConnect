import { useEffect, useState } from "react";
import api from "../api";

// ✅ Custom hook to fetch all buyers (admin only)
function useBuyers() {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBuyers = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.get(`/buyers`);
      setBuyers(res.data);
    } catch (err) {
      setError("Error fetching buyers: " + err.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  return { buyers, loading, error, fetchBuyers };
}

export default useBuyers;