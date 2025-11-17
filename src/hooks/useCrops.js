import { useEffect, useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";

// ✅ Custom hook to fetch crops based on role
function useCrops() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCrops = async () => {
    setLoading(true);
    setError("");

    const auth = getAuth();
    const user = auth.currentUser;
    const role = localStorage.getItem("role");

    try {
      let res;

      if (role === "farmer") {
        res = await axios.get(`http://localhost:8081/crops/farmer/${user.uid}`);
      } else if (role === "buyer") {
        res = await axios.get("http://localhost:8081/crops");
      } else if (role === "admin") {
        res = await axios.get("http://localhost:8081/crops");
      }

      setCrops(res.data || []);
    } catch (err) {
      setError("Error fetching crops: " + err.message);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCrops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { crops, loading, error, reload: fetchCrops };
}

export default useCrops;