import React from "react";
import ThemeToggle from "./ThemeToggle";
import { FaBars } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import useUserProfile from "../hooks/useUserProfile";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Header({ onToggleSidebar, toggleButtonRef, isSidebarOpen = false }) {
  const { email, displayName, isLoggedIn } = useAuth();
  const { profile, loading } = useUserProfile();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Error during signOut:", e);
    }
    try {
      localStorage.removeItem("sidebarOpen");
    } catch (e) {}
    navigate("/");
  };

  return (
    <header className="header" style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "8px 12px",
      borderBottom: "1px solid var(--border-color)",
      minHeight: "48px",
      flexShrink: 0,
      gap: "12px"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button ref={toggleButtonRef} onClick={onToggleSidebar} aria-label="Toggle menu" aria-controls="kc_sidebar" aria-expanded={isSidebarOpen} style={{
          border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 18, color: 'var(--text-color)', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <FaBars />
        </button>

        <img src="/logo192.png" alt="Logo" style={{ height: "24px", width: "24px" }} />
        <h2 style={{margin: 0, fontSize: "16px", fontWeight: 600}}>KisanConnect</h2>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <ThemeToggle />

        {isLoggedIn && !loading && profile && (
          <div style={{ textAlign: "right", fontSize: "12px" }}>
            <p style={{ margin: 0, fontWeight: "bold", fontSize: "12px" }}>{profile.name || displayName}</p>
            <p style={{ margin: 0, fontSize: "11px", color: "var(--secondary-text-color)" }}>{email}</p>
          </div>
        )}

        <button className="danger" onClick={handleLogout} style={{ padding: "6px 12px", fontSize: "12px" }}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;