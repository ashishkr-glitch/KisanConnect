import { useEffect, useState } from "react";
import axios from "axios";

// ✅ Custom hook to fetch all buyers (admin only)
function useBuyers() {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBuyers = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get("http://localhost:8081/buyers");
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