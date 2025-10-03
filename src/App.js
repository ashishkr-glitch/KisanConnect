import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import ProtectedRoute from "./auth/ProtectedRoute";

// ✅ Role-based dashboards
import FarmerDashboard from "./dashboard/FarmerDashboard";
import BuyerDashboard from "./dashboard/BuyerDashboard";
import AdminDashboard from "./dashboard/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Default route → Login */}
        <Route path="/" element={<Login />} />

        {/* ✅ Signup route */}
        <Route path="/signup" element={<Signup />} />

        {/* ✅ Role-based protected dashboards */}
        <Route
          path="/dashboard/farmer"
          element={
            <ProtectedRoute>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/buyer"
          element={
            <ProtectedRoute>
              <BuyerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;