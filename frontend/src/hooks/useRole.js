import { useEffect, useState } from "react";
import api from "../api";

// ✅ Enhanced hook to get role + flags
function useRole() {
  // normalize role strings: strip common prefixes/synonyms and map to {admin, farmer, buyer}
  const normalizeRole = (raw) => {
    try {
      if (!raw) return "";
      let r = raw.toString().trim().toLowerCase();
      // remove common prefix
      if (r.startsWith("role_")) r = r.substring(5);
      if (r.startsWith("role-")) r = r.substring(5);
      // map synonyms
      if (r === "administrator" || r === "adminstrator") r = "admin";
      if (r === "seller") r = "farmer";
      if (r === "consumer" || r === "customer") r = "buyer";
      if (["admin", "farmer", "buyer"].includes(r)) return r;
      return "";
    } catch (e) {
      return "";
    }
  };

  const initialRole = normalizeRole(localStorage.getItem("role") || "");
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(!initialRole); // Only loading if no initial role

  // Move side-effects into useEffect so we don't call setState during render
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const lsRole = localStorage.getItem("role");
        if (lsRole) {
          const nr = normalizeRole(lsRole);
          if (nr) {
            if (!cancelled) {
              setRole(nr);
              setLoading(false);
            }
            return;
          }
        }

        // Prefer uid-based lookup (faster and unambiguous), fall back to email
        const uid = localStorage.getItem("uid");
        if (uid) {
          try {
            const resp = await api.get(`/users/${encodeURIComponent(uid)}`);
            if (!cancelled && resp && resp.data && resp.data.role) {
              const r = normalizeRole(resp.data.role);
              if (r) {
                setRole(r);
                try { localStorage.setItem("role", r); } catch (e) {}
              }
            }
          } catch (e) {
            // ignore network errors
          } finally {
            if (!cancelled) setLoading(false);
          }
          return;
        }

        const email = localStorage.getItem("email");
        if (email) {
          try {
            const resp = await api.get(`/users/by-email?email=${encodeURIComponent(email)}`);
            if (!cancelled && resp && resp.data && resp.data.role) {
              const r = normalizeRole(resp.data.role);
              if (r) {
                setRole(r);
                try { localStorage.setItem("role", r); } catch (e) {}
              }
            }
          } catch (e) {
            // ignore network errors
          } finally {
            if (!cancelled) setLoading(false);
          }
          return;
        }

        if (!cancelled) setLoading(false);
      } catch (e) {
        if (!cancelled) setLoading(false);
      }
    };

    init();
    return () => { cancelled = true; };
  }, []);

  return {
    role,
    isAdmin: role === "admin",
    isFarmer: role === "farmer",
    isBuyer: role === "buyer",
    loading,
  };
}

export default useRole;