import React from "react";
import axios from "axios";

function EditDeleteButtons({ farmerId, onEdit, onDeleteSuccess }) {
  const handleDelete = async () => {
    if (!farmerId) {
      alert("No farmer selected for deletion.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this farmer?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8081/farmers/${farmerId}`);
      await axios.delete(`http://localhost:8081/api/users/${farmerId}`);
      alert("Farmer deleted successfully!");
      if (onDeleteSuccess) onDeleteSuccess(); // ✅ Refresh list via parent
    } catch (error) {
      alert("Error deleting farmer: " + error.message);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Admin Controls</h3>
      <button onClick={onEdit} style={buttonStyle}>Edit</button>
      <button onClick={handleDelete} style={{ ...buttonStyle, backgroundColor: "#e74c3c" }}>Delete</button>
    </div>
  );
}

const buttonStyle = {
  padding: "10px 16px",
  marginRight: "10px",
  backgroundColor: "#3498db",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

export default EditDeleteButtons;