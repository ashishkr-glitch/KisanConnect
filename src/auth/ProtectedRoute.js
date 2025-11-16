import React from "react";
import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import Loader from "../components/Loader";
import useRole from "../hooks/useRole"; // ✅ Import upgraded hook

// ✅ Protected Route with role + auth check
function ProtectedRoute({ children, allowedRoles }) {
  const auth = getAuth();
  const user = auth.currentUser;
  const { role, loading } = useRole(); // ✅ Use hook

  if (!user) return <Navigate to="/login" replace />;
  if (loading) return <Loader />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;