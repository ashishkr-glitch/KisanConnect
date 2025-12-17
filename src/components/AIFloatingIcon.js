import React from "react";
import { useNavigate } from "react-router-dom";
import "./AIFloatingIcon.css";

function AIFloatingIcon() {
  const nav = useNavigate();
  return (
    <div className="ai-floating" role="button" aria-label="Open Margdarshak chat" onClick={() => nav('/dashboard/margdarshak')}>
      <img src="/Logo420.png" alt="Kissan Connect" className="ai-logo" />
    </div>
  );
}

export default AIFloatingIcon;
