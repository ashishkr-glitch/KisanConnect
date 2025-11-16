

import React, { useEffect, useState } from "react";
import "./FarmerDashboard.css";
import useCrops from "../hooks/useCrops";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";


function FarmerDashboard() {
  const { crops, loading, error } = useCrops();
  const totalQuantity = crops.reduce((sum, crop) => sum + Number(crop.quantity || 0), 0);
  const [farmerName, setFarmerName] = useState("");

  useEffect(() => {
    const fetchFarmerName = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setFarmerName(docSnap.data().name || "Farmer");
        }
      }
    };
    fetchFarmerName();
  }, []);

  return (
    <div className="farmer-dashboard" style={{padding: '12px 12px',display: 'block', margin: '0', width: '100%'}}>
      <h2 style={{marginBottom: 16, fontWeight: 700, fontSize: 20, color: '#388e3c', margin: '0  auto 5%'}}>Welcome, {farmerName || 'Farmer'}!</h2>

      {/* Quick Stats - Vertical Layout */}
      <div style={{display: 'flex', gap: 56, marginBottom: 20, width:'60%', maxWidth: '100%', justifySelf: 'center', margin: '0 0 7%'}}>
        <div style={{background: '#e8f5e9', padding: 12, borderRadius: 12, textAlign: 'center', boxShadow: '0 2px 8px #eee',flex: '1'}}>
          <h3 style={{margin: 0, fontSize: 12, color: '#388e3c'}}>Total Crops</h3>
          <div style={{fontSize: 24, fontWeight: 700, color: '#388e3c', marginTop: 6}}>{crops.length}</div>
        </div>
        <div style={{background: '#e3f2fd', padding: 12, borderRadius: 12, textAlign: 'center', boxShadow: '0 2px 8px #eee', flex: '1'}}>
          <h3 style={{margin: 0, fontSize: 12, color: '#1976d2'}}>Total Quantity (kg)</h3>
          <div style={{fontSize: 24, fontWeight: 700, color: '#1976d2', marginTop: 6}}>{totalQuantity}</div>
        </div>
      </div>

      {/* Recent Crops */}
      <section style={{margin: 'auto 5% auto'}}>
        <h3 style={{marginBottom: 12, fontWeight: 600, color: '#388e3c', fontSize: 14}}>Your Recent Crops</h3>
        {loading ? (
          <div>Loading crops...</div>
        ) : error ? (
          <div style={{color: 'red'}}>{error}</div>
        ) : crops.length === 0 ? (
          <div>No crops added yet.</div>
        ) : (
          <table style={{width: '100%', maxWidth: '900px', borderCollapse: 'collapse', marginBottom: 12, background: 'var(--modal-bg)', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)'}}>
            <thead>
              <tr style={{background: 'var(--secondary-color)'}}>
                <th style={{padding: '8px 10px', borderBottom: '1px solid var(--border-color)', textAlign: 'left', fontSize: '12px'}}>Crop Type</th>
                <th style={{padding: '8px 10px', borderBottom: '1px solid var(--border-color)', textAlign: 'left', fontSize: '12px'}}>Quantity</th>
                <th style={{padding: '8px 10px', borderBottom: '1px solid var(--border-color)', textAlign: 'left', fontSize: '12px'}}>Harvest Date</th>
              </tr>
            </thead>
            <tbody>
              {crops.slice(0, 5).map((crop) => (
                <tr key={crop.id}>
                  <td style={{padding: '8px 10px', borderBottom: '1px solid var(--border-color)', fontSize: '12px'}}>{crop.cropType}</td>
                  <td style={{padding: '8px 10px', borderBottom: '1px solid var(--border-color)', fontSize: '12px'}}>{crop.quantity}</td>
                  <td style={{padding: '8px 10px', borderBottom: '1px solid var(--border-color)', fontSize: '12px'}}>{crop.harvestDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* Link to full crop list */}
        <div style={{marginTop: 6}}>
          <a href="/dashboard/my-crops" style={{color: '#388e3c', textDecoration: 'underline', fontWeight: 500, fontSize: '12px'}}>View All Crops</a>
        </div>
      </section>
    </div>
  );
}

export default FarmerDashboard;