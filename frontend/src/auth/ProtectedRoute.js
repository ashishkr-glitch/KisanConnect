import React from "react";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";
import useRole from "../hooks/useRole"; // ✅ Import upgraded hook
import useAuth from "../hooks/useAuth";

// ✅ Protected Route with role + auth check
function ProtectedRoute({ children, allowedRoles }) {
  const { uid: authUid } = useAuth();
  const localUid = localStorage.getItem("uid");
  const { role, loading } = useRole(); // ✅ Use hook

  // Allow if locally-stored uid exists (authUid or localStorage)
  if (!authUid && !localUid) return <Navigate to="/login" replace />;
  if (loading) return <Loader />;

  // Debug: log protected route role checks
  try {
    // eslint-disable-next-line no-console
    console.log('[DEBUG][ProtectedRoute] authUid:', authUid, 'localUid:', localUid, 'role:', role, 'allowedRoles:', allowedRoles);
  } catch (e) {}

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;