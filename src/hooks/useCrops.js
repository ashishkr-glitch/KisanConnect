import { useEffect, useState } from "react";
import api from "../api";
import useAuth from "./useAuth";

// ✅ Custom hook to fetch crops based on role
function useCrops() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { uid: authUid } = useAuth();

  const fetchCrops = async () => {
    setLoading(true);
    setError("");

    try {
      const role = localStorage.getItem("role");

      // Prefer hook-provided uid, fallback to localStorage
      const uid = authUid || localStorage.getItem("uid");

      if (!uid && role === "farmer") {
        setError("Error: User ID not found. Please log in again.");
        setCrops([]);
        setLoading(false);
        return;
      }

      let res;

      if (role === "farmer") {
        console.log(`[useCrops] Fetching farmer crops for uid: ${uid}`);
        res = await api.get(`/crops/farmer/${uid}`);
      } else if (role === "buyer") {
        console.log("[useCrops] Fetching all crops for buyer");
        res = await api.get(`/crops`);
      } else if (role === "admin") {
        console.log("[useCrops] Fetching all crops for admin");
        res = await api.get(`/crops`);
      } else {
        setError("Error: Unknown role. Please log in again.");
        setCrops([]);
        setLoading(false);
        return;
      }

      setCrops(res.data || []);
      console.log(`[useCrops] Fetched ${res.data?.length || 0} crops`);
    } catch (err) {
      console.error("[useCrops] Error:", err);
      if (err.response) {
        console.error("[useCrops] Response error:", err.response.status, err.response.data);
      } else if (err.request) {
        console.error("[useCrops] No response received. Request:", err.request);
      }
      if (err.response?.status === 404) {
        setError("Error fetching crops: No crops found for this farmer");
      } else if (err.code === "ERR_NETWORK") {
        setError("Error fetching crops: Network error - backend may not be running");
      } else if (err.message === "Network Error") {
        setError("Error fetching crops: Cannot connect to backend (localhost:8081)");
      } else {
        setError("Error fetching crops: " + (err.response?.data?.message || err.message));
      }
      setCrops([]);
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