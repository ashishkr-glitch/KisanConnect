import React from "react";
import "./Modal.css";

// ✅ Reusable Modal Component
function Modal({ children, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-btn" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
}

export default Modal;