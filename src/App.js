import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminDashboard from "./dashboard/AdminDashboard";
import BuyerDashboard from "./dashboard/BuyerDashboard";
import FarmerDashboard from "./dashboard/FarmerDashboard";
import FarmerList from "./pages/FarmerList";
import BuyerList from "./pages/BuyerList";
import CropList from "./components/CropList";
import CropAnalytics from "./dashboard/CropAnalytics";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Layout from "./layout/Layout";
import NotFound from "./auth/NotFound";
import Unauthorized from "./auth/Unauthorized";
import "./styles/theme.css";

import useRole from "./hooks/useRole";
import AddCropForm from "./components/AddCropForm";
import CropListByFarmer from "./components/CropListByFarmer";

function App() {
  const { role, loading } = useRole();

  // ✅ Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.classList.remove("light", "dark");
    document.body.classList.add(savedTheme);
  }, []);

  if (loading) return <p>Loading role...</p>; // ✅ Fallback

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

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
            role === "admin" ? (
              <AdminDashboard />
            ) : role === "farmer" ? (
              <FarmerDashboard />
            ) : role === "buyer" ? (
              <BuyerDashboard />
            ) : (
              <Navigate to="/unauthorized" replace />
            )
          }
        />

        {/* Farmer-specific nested routes so Sidebar links don't 404 */}
        <Route
          path="add-crop"
          element={role === "farmer" ? <AddCropForm /> : <Navigate to="/unauthorized" />}
        />
        <Route
          path="my-crops"
          element={role === "farmer" ? <CropListByFarmer /> : <Navigate to="/unauthorized" />}
        />

        {/* Admin nested routes matching Sidebar links */}
        <Route path="farmers" element={role === "admin" ? <FarmerList /> : <Navigate to="/unauthorized" />} />
        <Route path="buyers" element={role === "admin" ? <BuyerList /> : <Navigate to="/unauthorized" />} />
        <Route path="crops" element={role === "admin" ? <CropList /> : <Navigate to="/unauthorized" />} />
        <Route path="analytics" element={role === "admin" ? <CropAnalytics /> : <Navigate to="/unauthorized" />} />
      </Route>

      {/* fallback 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;