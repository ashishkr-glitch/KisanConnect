import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CompleteProfile() {
  const navigate = useNavigate();
  const [role, setRole] = useState('farmer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Ensure uid exists in localStorage
    const uid = localStorage.getItem('uid');
    if (!uid) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const uid = localStorage.getItem('uid');
      if (!uid) throw new Error('Missing uid');
      const base = process.env.REACT_APP_API_URL || '';
      const url = `${base}/api/users/${uid}/role`;
      await axios.put(url, { role });
      localStorage.setItem('role', role);
      navigate('/dashboard');
    } catch (err) {
      console.error('CompleteProfile error', err);
      // Build a helpful error message for users/devs
      let msg = 'Failed to update role.';
      if (err.response) {
        // Server responded with status code outside 2xx
        const status = err.response.status;
        const data = err.response.data;
        msg = `Server responded ${status}: ${typeof data === 'string' ? data : JSON.stringify(data)}`;
      } else if (err.request) {
        // Request sent but no response received
        msg = 'No response from server (network error). Check backend is running and reachable.';
      } else {
        // Something happened setting up the request
        msg = err.message || msg;
      }
      setError(msg);
    }
    setLoading(false);
  };

  return (
    <div style={{maxWidth:640, margin:'24px auto', padding:20}}>
      <h2>Complete Your Profile</h2>
      <p>We couldn't determine your role. Please choose your role to continue.</p>
      <form onSubmit={handleSubmit}>
        <div style={{marginBottom:12}}>
          <label style={{marginRight:8}}>
            <input type="radio" name="role" value="farmer" checked={role==='farmer'} onChange={() => setRole('farmer')} /> Farmer
          </label>
          <label style={{marginLeft:12}}>
            <input type="radio" name="role" value="buyer" checked={role==='buyer'} onChange={() => setRole('buyer')} /> Buyer
          </label>
        </div>
        {error && <div style={{color:'red', marginBottom:12}}>{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Role'}</button>
      </form>
    </div>
  );
}

export default CompleteProfile;
