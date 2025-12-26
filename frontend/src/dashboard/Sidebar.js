import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useRole from "../hooks/useRole";
import "./Sidebar.css";
import { FaTachometerAlt, FaUsers, FaLeaf, FaChartPie, FaShoppingCart, FaList, FaPlus, FaHome, FaSnowflake } from "react-icons/fa";
import { FaRobot } from "react-icons/fa";

function Sidebar({ onToggleTheme, isOpen = true, toggleButtonRef = null, containerRef: outerRef = null, showBrand = true }) {
  const { role: hookRole } = useRole();
  const location = useLocation();
  const navigate = useNavigate();
  const internalRef = useRef(null);
  const containerRef = outerRef || internalRef;

  // Normalize role from localStorage (takes priority)
  const normalizeRole = (raw) => {
    try {
      if (!raw) return "";
      let r = raw.toString().trim().toLowerCase();
      if (r.startsWith("role_")) r = r.substring(5);
      if (r.startsWith("role-")) r = r.substring(5);
      if (r === "administrator" || r === "adminstrator") r = "admin";
      if (r === "seller") r = "farmer";
      if (r === "consumer" || r === "customer") r = "buyer";
      if (["admin", "farmer", "buyer"].includes(r)) return r;
      return "";
    } catch (e) {
      return "";
    }
  };

  const localRole = normalizeRole(localStorage.getItem("role"));
  const role = localRole || hookRole || ""; // Prefer localStorage, then hook, then empty

  const handleLogout = async () => {
    try {
      localStorage.removeItem("uid");
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("full_name");
      localStorage.removeItem("sidebarOpen");
    } catch (e) {}
    try { window.dispatchEvent(new Event('kc-auth-change')); } catch (e) {}
    
    // Navigate directly to /login which is now explicitly defined as a route
    // window.location.href will do a full page reload ensuring clean state
    window.location.href = "/login";
  };

  const isActive = (path) => location.pathname === path;

    return (
      <div id="kc_sidebar" className={`sidebar ${isOpen ? "" : "hidden"}`} ref={containerRef} role="navigation" aria-label="Main navigation" aria-hidden={!isOpen}>
      {showBrand && (
        <div className="brand-wrap">
          <img src="/Logo420.png" alt="Kissan Connect logo" className="app-logo" style={{scale:"1.8",}}/>
          <h2 className="brand">
            <span className="brand-anim" aria-label="Kissan Connect">
              {Array.from('Kissan Connect').map((ch, i) => (
                <span key={i} className="char" style={{ ['--i']: i }}>{ch === ' ' ? '\u00A0' : ch}</span>
              ))}
            </span>
          </h2>
        </div>
      )}
      <nav>
        {role === "admin" && (
          <>
            <Link className={isActive("/dashboard") ? "active" : ""} to="/dashboard"><FaTachometerAlt /> <span className="label">Dashboard</span></Link>
            <Link className={isActive("/dashboard/farmers") ? "active" : ""} to="/dashboard/farmers"><FaUsers /> <span className="label">Farmers</span></Link>
            <Link className={isActive("/dashboard/buyers") ? "active" : ""} to="/dashboard/buyers"><FaShoppingCart /> <span className="label">Buyers</span></Link>
            <Link className={isActive("/dashboard/crops") ? "active" : ""} to="/dashboard/crops"><FaLeaf /> <span className="label">All Crops</span></Link>
            <Link className={isActive("/dashboard/analytics") ? "active" : ""} to="/dashboard/analytics"><FaChartPie /> <span className="label">Analytics</span></Link>
            <Link className={isActive("/dashboard/analytics/advanced") ? "active" : ""} to="/dashboard/analytics/advanced"><FaChartPie /> <span className="label">Advanced Analysis</span></Link>
          </>
        )}

        {role === "farmer" && (
          <>
            <Link className={isActive("/dashboard") ? "active" : ""} to="/dashboard"><FaHome /> <span className="label">My Dashboard</span></Link>
            <Link className={isActive("/dashboard/my-crops") ? "active" : ""} to="/dashboard/my-crops"><FaList /> <span className="label">My Crops</span></Link>
            <Link className={isActive("/dashboard/add-crop") ? "active" : ""} to="/dashboard/add-crop"><FaPlus /> <span className="label">Add Crop</span></Link>
            <Link className={isActive("/dashboard/orders") ? "active" : ""} to="/dashboard/orders"><FaShoppingCart /> <span className="label">Orders</span></Link>
          </>
        )}

        {role === "buyer" && (
          <>
            <Link className={isActive("/dashboard") ? "active" : ""} to="/dashboard"><FaLeaf /> <span className="label">Market</span></Link>
            <Link className={isActive("/dashboard/my-orders") ? "active" : ""} to="/dashboard/my-orders"><FaList /> <span className="label">My Orders</span></Link>
          </>
        )}
        {/* If role is not set (e.g. loading/offline), show a sensible default set of links */}
        {!role && (
          <>
            <Link className={isActive("/dashboard") ? "active" : ""} to="/dashboard"><FaTachometerAlt /> <span className="label">Dashboard</span></Link>
            <Link className={isActive("/dashboard/crops") ? "active" : ""} to="/dashboard/crops"><FaLeaf /> <span className="label">Crops</span></Link>
            <Link className={isActive("/dashboard/my-crops") ? "active" : ""} to="/dashboard/my-crops"><FaList /> <span className="label">My Crops</span></Link>
          </>
        )}

        {/* Margdarshak AI link - available to all roles */}
        <Link className={isActive("/dashboard/margdarshak") ? "active" : ""} to="/dashboard/margdarshak"><FaRobot /> <span className="label">Margdarshak AI</span></Link>
      </nav>

      <div className="sidebar-footer">
        <SnowToggleButton />
        <button className="footer-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

function SnowToggleButton() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    try {
      setEnabled(localStorage.getItem('letItSnow') === 'true');
    } catch (e) {}

    const onSnow = () => {
      try { setEnabled(localStorage.getItem('letItSnow') === 'true'); } catch (e) {}
    };
    window.addEventListener('kc-snow-change', onSnow);
    window.addEventListener('storage', onSnow);
    return () => {
      window.removeEventListener('kc-snow-change', onSnow);
      window.removeEventListener('storage', onSnow);
    };
  }, []);

  const toggle = () => {
    try {
      const next = !enabled;
      try { localStorage.setItem('letItSnow', next ? 'true' : 'false'); } catch (e) {}
      if (next && window.startSnowfall) window.startSnowfall();
      if (!next && window.stopSnowfall) window.stopSnowfall();
      setEnabled(next);
      try { window.dispatchEvent(new Event('kc-snow-change')); } catch (e) {}
    } catch (e) { console.error(e); }
  };

  return (
    <button className={`footer-btn snow-toggle ${enabled ? 'enabled' : ''}`} onClick={toggle} title="Let it snow">
      <FaSnowflake /> <span className="label">Let it snow</span>
    </button>
  );
}

// focus management: when sidebar opens, focus first link; when closes, return focus to toggle button
function useSidebarFocus(containerRef, isOpen, toggleButtonRef) {
  useEffect(() => {
    if (isOpen) {
      try {
        const el = containerRef.current?.querySelector('a');
        if (el) el.focus();
      } catch (e) {}
    } else {
      try {
        if (toggleButtonRef && toggleButtonRef.current) toggleButtonRef.current.focus();
      } catch (e) {}
    }
  }, [isOpen, containerRef, toggleButtonRef]);
}

export { useSidebarFocus };

export default Sidebar;