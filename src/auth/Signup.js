import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import axios from "axios";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
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
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const uid = userCredential.user.uid;

      if (!uid) {
        alert("Signup failed: UID not generated");
        setLoading(false);
        return;
      }

      const userData = { ...formData, uid, role };
      delete userData.confirmPassword;

      await setDoc(doc(db, "users", uid), userData);

      try {
        await axios.post("http://localhost:8081/api/users", userData);

        const payload = {
          uid,
          name: formData.fullName,
          district: formData.district,
          mobile: formData.mobile,
          state: formData.state
        };

        if (role === "farmer") {
          await axios.post("http://localhost:8081/farmers", payload);
        } else if (role === "buyer") {
          await axios.post("http://localhost:8081/buyers", payload);
        }

        alert("Signup successful! Please login.");
        navigate("/login");
      } catch (backendError) {
        console.error("Backend error:", backendError);
        alert("Signup failed: Backend error");
      }
    } catch (error) {
      alert("Signup failed: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="signup-container">
      <h2>Register</h2>

      <select value={role} onChange={(e) => setRole(e.target.value)} required>
        <option value="">Select Role</option>
        <option value="farmer">Farmer</option>
        <option value="buyer">Buyer</option>
      </select>

      {role && (
        <form onSubmit={handleSignup}>
          <input name="fullName" placeholder="Full Name" onChange={handleChange} required />
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
      )}

      <p>Already registered? <Link to="/">Login here</Link></p>
    </div>
  );
}

export default Signup;