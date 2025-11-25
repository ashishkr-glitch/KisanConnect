import { useEffect, useState } from "react";
import api from "../api";

// Hook: fetch user profile from backend using localStorage (uid/email)
function useUserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const uid = localStorage.getItem("uid");
        const email = localStorage.getItem("email");

        if (uid) {
          const resp = await api.get(`/users/${uid}`);
          if (!cancelled) {
            setProfile(resp.data || null);
            setLoading(false);
            return;
          }
        }

        if (email) {
          const resp = await api.get(`/users/by-email?email=${encodeURIComponent(email)}`);
          if (!cancelled) {
            setProfile(resp.data || null);
            setLoading(false);
            return;
          }
        }

        if (!cancelled) {
          setProfile(null);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Error fetching profile");
          setProfile(null);
          setLoading(false);
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  return { profile, loading, error };
}

export default useUserProfile;