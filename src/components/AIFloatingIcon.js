import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRobot } from "react-icons/fa";
import "./AIFloatingIcon.css";

function AIFloatingIcon() {
  const nav = useNavigate();
  return (
    <div className="ai-floating" role="button" aria-label="Open Margdarshak chat" onClick={() => nav('/dashboard/margdarshak')}>
      <FaRobot className="ai-robot" />
    </div>
  );
}

export default AIFloatingIcon;
