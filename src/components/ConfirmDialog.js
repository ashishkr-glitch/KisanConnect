import React from "react";
import "./ConfirmDialog.css";

// ✅ Reusable Confirm Dialog
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <p>{message || "Are you sure you want to proceed?"}</p>
        <div className="confirm-actions">
          <button className="yes" onClick={onConfirm}>Yes</button>
          <button className="no" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;