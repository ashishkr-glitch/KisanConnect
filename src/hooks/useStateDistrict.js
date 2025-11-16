import { useState, useEffect } from "react";

// ✅ Custom hook to get districts by state
function useStateDistrict(stateName) {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!stateName) return;

    const fetchDistricts = async () => {
      setLoading(true);

      try {
        const res = await fetch(`https://api.countrystatecity.in/v1/countries/IN/states/${stateName}/cities`, {
          headers: {
            "X-CSCAPI-KEY": "YOUR_API_KEY_HERE" // ✅ Replace with your actual key
          }
        });
        const data = await res.json();
        const names = data.map((d) => d.name);
        setDistricts(names);
      } catch (err) {
        console.error("Error fetching districts:", err);
        setDistricts([]);
      }

      setLoading(false);
    };

    fetchDistricts();
  }, [stateName]);

  return { districts, loading };
}

export default useStateDistrict;