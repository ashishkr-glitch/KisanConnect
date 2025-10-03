// src/auth/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

function ProtectedRoute({ children }) {
  const user = auth.currentUser;

  // ✅ If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/" />;
  }

  // ✅ If logged in, show dashboard
  return children;
}

export default ProtectedRoute;