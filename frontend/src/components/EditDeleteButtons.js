import React from "react";
import api from "../api";

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
        await api.delete(`/farmers/${id}`);
      } else if (entity === "buyer") {
        await api.delete(`/buyers/${id}`);
      } else {
        // fallback to farmer endpoint
        await api.delete(`/farmers/${id}`);
      }

      // always attempt to delete user record as well
      await api.delete(`/users/${id}`);
      alert(`${entity.charAt(0).toUpperCase() + entity.slice(1)} deleted successfully!`);
      if (onDeleteSuccess) onDeleteSuccess(); // ✅ Refresh list via parent
    } catch (error) {
      alert(`Error deleting ${entity}: ` + (error.response?.data || error.message));
    }
  };

  return (
    <div className="edit-delete-controls" style={{ marginTop: "16px" }}>
      {entity !== "buyer" && <h3>Admin Controls</h3>}
      {entity !== "buyer" && (
        <button onClick={onEdit} className="secondary">Edit</button>
      )}
      <button onClick={handleDelete} className="danger">Delete</button>
    </div>
  );
}

// styling is handled by global CSS classes (button.secondary, button.danger)

export default EditDeleteButtons;