import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

// ✅ Redirect user to correct dashboard based on role
function useDashboardRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectUser = async () => {
      const role = localStorage.getItem("role");
      if (role) {
        // route to common dashboard path; UI will show role-specific views
        navigate("/dashboard");
        return;
      }

      const uid = localStorage.getItem("uid");
      const email = localStorage.getItem("email");
      if (uid) {
        try {
          const resp = await api.get(`/users/${uid}`);
          if (resp?.data?.role) {
            try { localStorage.setItem("role", resp.data.role.toString().toLowerCase()); } catch (e) {}
            navigate("/dashboard");
            return;
          }
        } catch (e) {}
      }

      if (email) {
        try {
          const resp = await api.get(`/users/by-email?email=${encodeURIComponent(email)}`);
          if (resp?.data?.role) {
            try { localStorage.setItem("role", resp.data.role.toString().toLowerCase()); } catch (e) {}
            navigate("/dashboard");
            return;
          }
        } catch (e) {}
      }

      // If we reach here, treat as not logged in
      navigate("/login");
    };

    redirectUser();
  }, [navigate]);
}

export default useDashboardRedirect;