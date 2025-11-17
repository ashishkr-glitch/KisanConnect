import React from "react";
import axios from "axios";

function EditDeleteButtons({ id, entity = "farmer", onEdit, onDeleteSuccess }) {
  const handleDelete = async () => {
    if (!id) {
      alert("No item selected for deletion.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete this ${entity}?`
    );
    if (!confirmDelete) return;

    try {
      if (entity === "farmer") {
        await axios.delete(`http://localhost:8081/farmers/${id}`);
      } else if (entity === "buyer") {
        await axios.delete(`http://localhost:8081/buyers/${id}`);
      } else {
        // fallback to farmer endpoint
        await axios.delete(`http://localhost:8081/farmers/${id}`);
      }

      // always attempt to delete user record as well
      await axios.delete(`http://localhost:8081/api/users/${id}`);
      alert(`${entity.charAt(0).toUpperCase() + entity.slice(1)} deleted successfully!`);
      if (onDeleteSuccess) onDeleteSuccess(); // ✅ Refresh list via parent
    } catch (error) {
      alert(`Error deleting ${entity}: ` + (error.response?.data || error.message));
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