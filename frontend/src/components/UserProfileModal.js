import React from "react";
import "./Modal.css";

function safeGetName(profile) {
  if (!profile) return "-";
  try {
    if (profile.name) return profile.name;
    if (profile.fullName) return profile.fullName;
    if (profile.firstName) return (profile.firstName + (profile.lastName ? " " + profile.lastName : "")).trim();
    if (typeof profile === "string") return profile;
    if (profile.displayName) return profile.displayName;
    return "-";
  } catch (e) {
    console.error("[UserProfileModal] error reading name", e, profile);
    return "-";
  }
}

function UserProfileModal({ open, onClose, profile }) {
  if (!open) return null;

  try {
    const name = safeGetName(profile);
    const email = profile && profile.email ? profile.email : "-";
    const role = profile && profile.role ? profile.role : "-";
    const mobile = profile && profile.mobile ? profile.mobile : "-";
    const state = profile && profile.state ? profile.state : "-";
    const district = profile && profile.district ? profile.district : "-";
    const uid = profile && profile.uid ? profile.uid : "-";

    return (
      <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
        <div
          className="modal-box"
          onClick={(e) => e.stopPropagation()}
          style={{ minWidth: 400, maxWidth: 520, background: "var(--modal-bg)", color: "var(--text-color)", boxShadow: "0 8px 32px rgba(0,0,0,0.18)", padding: 32 }}
        >
          <h3 style={{ marginBottom: 24, textAlign: "center", letterSpacing: 1, fontSize: 22, lineHeight: 1.3 }}>User Profile</h3>
          <div style={{ fontSize: 16, lineHeight: 2.1, marginBottom: 18 }}>
            <div><b>Name:</b> {name}</div>
            <div><b>Email:</b> {email}</div>
            <div><b>Role:</b> {role}</div>
            <div><b>Mobile:</b> {mobile}</div>
            <div><b>State:</b> {state}</div>
            <div><b>District:</b> {district}</div>
            <div><b>UID:</b> {uid}</div>
          </div>
          <button onClick={onClose} style={{ marginTop: 18, padding: "8px 28px", fontSize: 16 }}>Close</button>
        </div>
      </div>
    );
  } catch (err) {
    console.error("[UserProfileModal] render error:", err, { open, profile });
    return (
      <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <div>Unable to load profile.</div>
          <button onClick={onClose} style={{ marginTop: 18 }}>Close</button>
        </div>
      </div>
    );
  }
}

export default UserProfileModal;
