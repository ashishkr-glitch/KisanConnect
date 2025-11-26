import React, { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import UserProfileModal from "./UserProfileModal";
import ThemeToggle from "./ThemeToggle";
import { FaBars, FaBook } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import NotificationBell from "./NotificationBell";

import { useNavigate, Link } from "react-router-dom";

function Header({ onToggleSidebar, toggleButtonRef, isSidebarOpen = false }) {

  const { isLoggedIn } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch user details from backend using uid
  const [userProfile, setUserProfile] = useState(null);
  const uid = localStorage.getItem("uid") || "";
  const email = localStorage.getItem("email") || "";

  useEffect(() => {
    async function fetchProfile() {
      try {
        if (uid) {
          const resp = await fetch(`/api/users/${uid}`);
            if (resp.ok) {
            const data = await resp.json();
            setUserProfile(data);
            return;
          }
        }

        // Fallback: try to find user by email using a dedicated endpoint
        if (email) {
          const resp = await fetch(`/api/users/by-email?email=${encodeURIComponent(email)}`);
            if (resp.ok) {
            const data = await resp.json();
            setUserProfile(data);
            return;
          }
        }

        setUserProfile(null);
      } catch (e) {
        console.error("Error fetching user profile:", e);
        setUserProfile(null);
        }
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
    
    // Navigate directly to /login which is now explicitly defined as a route
    // window.location.href will do a full page reload ensuring clean state
    window.location.href = "/login";
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
          <Link 
            to="/documentation" 
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
              color: "var(--primary-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
              borderRadius: "8px",
              transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.15) rotate(10deg)";
              e.currentTarget.style.color = "var(--primary-dark, #004555)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.color = "var(--primary-color)";
            }}
            title="Documentation"
          >
            <FaBook style={{ transition: "transform 0.3s ease" }} />
          </Link>
          <NotificationBell />
          <button
            style={{
              background: "transparent",
              border: "none",
              borderRadius: "8px",
              cursor: isLoggedIn ? "pointer" : "not-allowed",
              fontSize: 18,
              color: "var(--primary-color)",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: isLoggedIn ? 1 : 0.5,
              transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
            title={isLoggedIn ? "View Profile" : "Login to view profile"}
            onClick={() => {
              if (isLoggedIn) setProfileOpen(true);
              else alert("Login to view profile");
            }}
            onMouseEnter={(e) => {
              if (isLoggedIn) {
                e.currentTarget.style.transform = "scale(1.15) rotate(15deg)";
                e.currentTarget.style.color = "var(--accent-color)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.color = "var(--primary-color)";
            }}
          >
            <FaUserCircle />
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
    </>
  );
}

export default Header;
