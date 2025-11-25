import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import UserProfileModal from "./UserProfileModal";
import ThemeToggle from "./ThemeToggle";
import { FaBars } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import useUserProfile from "../hooks/useUserProfile";

import { useNavigate } from "react-router-dom";

function Header({ onToggleSidebar, toggleButtonRef, isSidebarOpen = false }) {

  const { isLoggedIn } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch user details from backend using uid
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const uid = localStorage.getItem("uid") || "";
  const email = localStorage.getItem("email") || "";

  useEffect(() => {
    async function fetchProfile() {
      setLoadingProfile(true);
      try {
        if (uid) {
          const resp = await fetch(`/api/users/${uid}`);
          if (resp.ok) {
            const data = await resp.json();
            setUserProfile(data);
            setLoadingProfile(false);
            return;
          }
        }

        // Fallback: try to find user by email using a dedicated endpoint
        if (email) {
          const resp = await fetch(`/api/users/by-email?email=${encodeURIComponent(email)}`);
          if (resp.ok) {
            const data = await resp.json();
            setUserProfile(data);
            setLoadingProfile(false);
            return;
          }
        }

        setUserProfile(null);
      } catch (e) {
        console.error("Error fetching user profile:", e);
        setUserProfile(null);
      }
      setLoadingProfile(false);
    }
    fetchProfile();
  }, [uid, email]);

  const handleLogout = async () => {
    try {
      // Clear local session keys used for offline auth
      localStorage.removeItem("uid");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("full_name");
      localStorage.removeItem("sidebarOpen");
    } catch (e) {}
    navigate("/");
  };

  return (
    <>
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

          <img src="/logo1.png" alt="Logo" style={{ height: "24px", width: "24px" }} />
          <h2 style={{margin: 0, fontSize: "16px", fontWeight: 600}}>KisanConnect</h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative" }}>
          <ThemeToggle />
          <button
            style={{
              background: "var(--secondary-color)",
              border: "1px solid var(--border-color)",
              borderRadius: "50%",
              cursor: isLoggedIn ? "pointer" : "not-allowed",
              fontSize: 32,
              color: "var(--primary-color)",
              marginRight: 4,
              width: 40,
              height: 40,
              minWidth: 40,
              minHeight: 40,
              padding: 7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: isLoggedIn ? 1 : 0.5,
              transition: "background 0.2s, color 0.2s",
            }}
            title={isLoggedIn ? "View Profile" : "Login to view profile"}
            onClick={() => {
              if (isLoggedIn) setProfileOpen(true);
              else alert("Login to view profile");
            }}
          >
            <FaUserCircle style={{ fontSize: 28, margin: 0 }} />
          </button>
          <UserProfileModal
            open={profileOpen}
            onClose={() => setProfileOpen(false)}
            profile={userProfile}
          />
          <button className="danger" onClick={handleLogout} style={{ padding: "6px 12px", fontSize: "12px" }}>
            Logout
          </button>
        </div>
      </header>
      {/* Welcome message below header, left-aligned, with name from backend */}
      <div style={{marginLeft: 8, marginTop: 4, fontWeight: 600, fontSize: 18, color: '#1976d2', textAlign: 'left'}}>
        Welcome, {userProfile?.fullName || userProfile?.name || userProfile?.displayName || userProfile?.firstName || "User"}!
      </div>
    </>
  );
}

export default Header;
