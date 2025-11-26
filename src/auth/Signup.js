import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import ThemeToggle from "../components/ThemeToggle";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    state: "",
    district: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!passwordsMatch) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // Only use backend API for signup
      const resp = await api.post(`/users`, {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password, // Backend will hash this
        district: formData.district,
        mobile: formData.mobile,
        state: formData.state,
        role: role
      });
      if (resp.data && resp.data.uid) {
        // Clear any existing auth state first
        localStorage.removeItem("uid");
        localStorage.removeItem("role");
        localStorage.removeItem("full_name");
        localStorage.removeItem("email");
        localStorage.removeItem("sidebarOpen");
        
        alert("Signup successful! Please login.");
        // Use replace to ensure clean navigation without back button issues
        navigate("/", { replace: true });
      } else {
        alert("Signup failed: Backend did not return UID");
      }
    } catch (error) {
      alert("Signup failed: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-form-section">
        <div className="signup-container">
          <h2>Register</h2>

          {role ? (
            <form onSubmit={handleSignup}>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="role-select" required>
                <option value="">Select Role</option>
                <option value="farmer">Farmer</option>
                <option value="buyer">Buyer</option>
              </select>

              <input name="firstName" placeholder="First Name" onChange={handleChange} required />
              <input name="lastName" placeholder="Last Name" onChange={handleChange} required />
              <input name="mobile" placeholder="Mobile Number" onChange={handleChange} required />
              <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
              <input name="state" placeholder="State" onChange={handleChange} required />
              <input name="district" placeholder="District" onChange={handleChange} required />
              <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

              <div className="confirm-password-wrapper">
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  required
                />
                {formData.confirmPassword && (
                  <span className="match-icon">
                    {passwordsMatch ? "✅" : "❌"}
                  </span>
                )}
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
          ) : (
            <select value={role} onChange={(e) => setRole(e.target.value)} className="role-select" required>
              <option value="">Select Role</option>
              <option value="farmer">Farmer</option>
              <option value="buyer">Buyer</option>
            </select>
          )}

          <button className="back-button" onClick={() => navigate("/")}>← Back to Login</button>
          <p>Already registered? <Link to="/">Login here</Link></p>
        </div>
      </div>
      <div className="signup-image-section">
        <div className="signup-header-actions-image">
          <ThemeToggle />
        </div>
        <div className="signup-image-wrapper">
          <div className="signup-image-box">
            <img src="/images/farmer_photo_2.png" alt="Farmer working in field" loading="lazy" className="signup-image" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;