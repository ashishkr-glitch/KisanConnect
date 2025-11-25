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
import Margdarshak from "./pages/Margdarshak";
import CompleteProfile from "./pages/CompleteProfile";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Layout from "./layout/Layout";
import NotFound from "./auth/NotFound";
import Unauthorized from "./auth/Unauthorized";
import "./styles/theme.css";

import useRole from "./hooks/useRole";
import useAuth from "./hooks/useAuth";
import api from "./api";
import { useState } from "react";
import AddCropForm from "./components/AddCropForm";
import CropListByFarmer from "./components/CropListByFarmer";

function App() {
  const { role, loading } = useRole();

  // Dev-only: log role and uid to help debugging why wrong dashboard shows
  useEffect(() => {
    try {
      // eslint-disable-next-line no-console
      console.log("[DEBUG] role from useRole:", role, "localStorage.role:", localStorage.getItem("role"), "uid:", localStorage.getItem("uid"));
    } catch (e) {}
  }, [role]);

  // Compute effective role: prefer localStorage, then useRole(), then default to 'farmer'
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

  // track localRole in state so updates to localStorage re-render the component
  const [localRoleState, setLocalRoleState] = useState(() => normalizeRole(typeof window !== "undefined" ? localStorage.getItem("role") : null));
  const localRoleRaw = typeof window !== "undefined" ? localStorage.getItem("role") : null;
  const localRole = normalizeRole(localRoleRaw) || localRoleState;
  // Do not default to 'farmer' silently; prefer explicit roles. Use null/empty when unknown.
  const effectiveRole = localRole || role || "";
  const { uid: authUid } = useAuth();

  // If we don't have a role (neither localStorage nor hook), try to fetch from backend using uid/email
  useEffect(() => {
    let cancelled = false;
    const tryFetch = async () => {
      try {
        const currentLocal = normalizeRole(localStorage.getItem("role"));
        if (currentLocal) {
          if (!cancelled) setLocalRoleState(currentLocal);
          return;
        }

        const uid = localStorage.getItem("uid");
        const email = localStorage.getItem("email");
        let resp = null;
        if (uid) {
          resp = await api.get(`/users/${uid}`);
        } else if (email) {
          resp = await api.get(`/users/by-email?email=${encodeURIComponent(email)}`);
        }

        if (resp && resp.data && resp.data.role) {
          const nr = normalizeRole(resp.data.role);
          if (nr) {
            try { localStorage.setItem("role", nr); } catch (e) {}
            if (!cancelled) setLocalRoleState(nr);
          }
        }
      } catch (e) {
        // ignore
      }
    };

    // run only when there's no resolved role yet
    if (!localRole && !role) tryFetch();
    return () => { cancelled = true; };
  }, [localRole, role]);

  // Listen for auth changes (login/logout) so we update localRoleState immediately
  useEffect(() => {
    const onAuthChange = () => {
      try {
        const nr = normalizeRole(localStorage.getItem('role'));
        if (nr) setLocalRoleState(nr);
        else setLocalRoleState("");
      } catch (e) {}
    };
    window.addEventListener('kc-auth-change', onAuthChange);
    return () => window.removeEventListener('kc-auth-change', onAuthChange);
  }, []);

  // ✅ Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.remove("light", "dark");
    document.body.classList.add(savedTheme);
  }, []);

  if (loading) return <p>Loading role...</p>; // ✅ Fallback
  // Debug: log effective role decision and auth uid
  try {
    // eslint-disable-next-line no-console
    console.log("[DEBUG] effectiveRole:", effectiveRole, "authUid:", authUid, "localRole:", localRole);
  } catch (e) {}

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
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
        {/* Margdarshak AI chat - available to any logged-in user */}
        <Route path="margdarshak" element={<Margdarshak />} />
      </Route>

      {/* fallback 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;