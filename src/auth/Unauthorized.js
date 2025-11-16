import React from "react";
import "./Unauthorized.css";
import { useNavigate } from "react-router-dom";

// ✅ Unauthorized Access Page
function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-page">
      <h2>🚫 Access Denied</h2>
      <p>You do not have permission to view this page.</p>
      <button onClick={() => navigate("/login")}>Back to Login</button>
    </div>
  );
}

export default Unauthorized;