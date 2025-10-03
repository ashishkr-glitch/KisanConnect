// import FarmerForm from "./components/FarmerForm";
// import FarmerList from "./components/FarmerList";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import Dashboard from "./dashboard/Dashboard";
import ProtectedRoute from "./auth/ProtectedRoute"; // ✅ Add this




function App() {
  return (
    // <div>
    //   <FarmerForm />
    //   <FarmerList />
    // </div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
