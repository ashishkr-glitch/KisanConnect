import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminDashboard from "./dashboard/AdminDashboard";
import BuyerDashboard from "./dashboard/BuyerDashboard";
import FarmerDashboard from "./dashboard/FarmerDashboard";
import FarmerList from "./pages/FarmerList";
import BuyerList from "./pages/BuyerList";
import MyOrders from "./pages/MyOrders";
import FarmerOrders from "./pages/FarmerOrders";
import CropList from "./components/CropList";
import CropAnalytics from "./dashboard/CropAnalytics";
import AdminCropAnalysis from "./pages/AdminCropAnalysis";
import Margdarshak from "./pages/Margdarshak";
import CompleteProfile from "./pages/CompleteProfile";
import Documentation from "./pages/Documentation";
import UIShowcase from "./pages/UIShowcase";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Layout from "./layout/Layout";
import NotFound from "./auth/NotFound";
import Unauthorized from "./auth/Unauthorized";
import "./styles/dashboardTheme.css"; // 🎨 COMPREHENSIVE THEME - सभी elements के लिए
import "./styles/uiKit.css"; // 🎨 UI DESIGN SYSTEM - reusable components

import useRole from "./hooks/useRole";
import useAuth from "./hooks/useAuth";
import { useState } from "react";
import AddCropForm from "./components/AddCropForm";
import CropListByFarmer from "./components/CropListByFarmer";

function App() {
  const { role, loading } = useRole();
  const { uid: authUid } = useAuth();

  // Normalize role strings to canonical form
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

  // Force re-render when auth changes (login/logout) - triggers state update to refresh localRole
  const [authChangeVersion, setAuthChangeVersion] = useState(0);
  useEffect(() => {
    const onAuthChange = () => {
      setAuthChangeVersion(v => v + 1);
    };
    window.addEventListener('kc-auth-change', onAuthChange);
    return () => window.removeEventListener('kc-auth-change', onAuthChange);
  }, []);

  // Read localRole fresh on every render (or when authChangeVersion changes) 
  // This ensures we always get the latest role from localStorage
  const localRole = normalizeRole(localStorage.getItem("role"));
  const effectiveRole = localRole || role || "";

  // Debug logging - only when role changes
  useEffect(() => {
    try {
      // eslint-disable-next-line no-console
      console.log("[DEBUG] App re-render - effectiveRole:", effectiveRole, "authUid:", authUid, "localRole:", localRole, "hookRole:", role, "authChangeVersion:", authChangeVersion);
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveRole, authUid, authChangeVersion, role, localRole]);

  // ✅ Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.remove("light", "dark");
    document.body.classList.add(savedTheme);
  }, []);

  // ✅ Apply dashboard role class to <body> so all pages inherit the dashboard theme
  // Per-dashboard body classes removed — using a single universal theme now.

  if (loading && !localRole && !authUid) return <p>Loading role...</p>; // ✅ Fallback

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/documentation" element={<Documentation />} />
      <Route path="/ui-showcase" element={<UIShowcase />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />

      {/* Protected dashboard parent route with Layout Outlet */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* index shows the role-based dashboard */}
        <Route
          index
            element={
              // If user not authenticated, redirect to login
              (!authUid && !localStorage.getItem("uid")) ? (
                <Navigate to="/login" replace />
              ) : effectiveRole === "admin" ? (
                <AdminDashboard />
              ) : effectiveRole === "farmer" ? (
                <FarmerDashboard />
              ) : effectiveRole === "buyer" ? (
                <BuyerDashboard />
              ) : (
                <Navigate to="/unauthorized" replace />
              )
            }
        />

        {/* Farmer-specific nested routes so Sidebar links don't 404 */}
        <Route
          path="add-crop"
          element={effectiveRole === "farmer" ? <AddCropForm /> : <Navigate to="/unauthorized" />}
        />
        <Route
          path="my-crops"
          element={effectiveRole === "farmer" ? <CropListByFarmer /> : <Navigate to="/unauthorized" />}
        />
        <Route path="orders" element={effectiveRole === "farmer" ? <FarmerOrders /> : <Navigate to="/unauthorized" />} />
        <Route path="my-orders" element={effectiveRole === "buyer" ? <MyOrders /> : <Navigate to="/unauthorized" />} />

        {/* Admin nested routes matching Sidebar links */}
        <Route path="farmers" element={effectiveRole === "admin" ? <FarmerList /> : <Navigate to="/unauthorized" />} />
        <Route path="buyers" element={effectiveRole === "admin" ? <BuyerList /> : <Navigate to="/unauthorized" />} />
        <Route path="crops" element={effectiveRole === "admin" ? <CropList /> : <Navigate to="/unauthorized" />} />
        <Route path="analytics" element={effectiveRole === "admin" ? <CropAnalytics /> : <Navigate to="/unauthorized" />} />
        <Route path="analytics/advanced" element={effectiveRole === "admin" ? <AdminCropAnalysis /> : <Navigate to="/unauthorized" />} />
        {/* Margdarshak AI chat - available to any logged-in user */}
        <Route path="margdarshak" element={<Margdarshak />} />
      </Route>

      {/* fallback 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;