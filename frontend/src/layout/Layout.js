import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import Sidebar, { useSidebarFocus } from "../dashboard/Sidebar";
import { Outlet } from "react-router-dom";
import useTheme from "../hooks/useTheme";
import AIFloatingIcon from "../components/AIFloatingIcon";

function Layout() {
  const { toggleTheme } = useTheme();
  // persist sidebar state in localStorage
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      const v = localStorage.getItem("sidebarOpen");
      return v === null ? true : v === "true";
    } catch (e) {
      return true;
    }
  });

  const toggleButtonRef = useRef(null);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => setSidebarOpen((s) => !s);

  useEffect(() => {
    try {
      localStorage.setItem("sidebarOpen", sidebarOpen ? "true" : "false");
    } catch (e) {
      // ignore
    }
  }, [sidebarOpen]);

  // manage focus when sidebar opens/closes
  useSidebarFocus(sidebarRef, sidebarOpen, toggleButtonRef);

  return (
    <div className="App" style={{ display: "flex", height: "100vh", overflow: "hidden", width: "100%" }}>
      <Sidebar isOpen={sidebarOpen} onToggleTheme={toggleTheme} toggleButtonRef={toggleButtonRef} containerRef={sidebarRef} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", width: "100%" }}>
        <Header onToggleSidebar={toggleSidebar} toggleButtonRef={toggleButtonRef} isSidebarOpen={sidebarOpen} />
        <main style={{ padding: "12px", flex: 1, overflow: "auto", width: "100%", margin: 0, minHeight: 0 }}>
          <Outlet />
        </main>
        <AIFloatingIcon />
      </div>
    </div>
  );
}

export default Layout;