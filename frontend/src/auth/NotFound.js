import React from "react";
import "./NotFound.css";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <button onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
}

export default NotFound;