

import React, { useEffect, useState } from "react";
import axios from "axios";
import useToast from "../hooks/useToast";
import "./FarmerDashboard.css";
import ConfirmDialog from "../components/ConfirmDialog";
import useCrops from "../hooks/useCrops";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";


function FarmerDashboard() {
  const { crops, loading, error, reload } = useCrops();
  const totalQuantity = crops.reduce((sum, crop) => sum + Number(crop.quantity || 0), 0);
  const [farmerName, setFarmerName] = useState("");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [processing, setProcessing] = useState({});
  const [confirm, setConfirm] = useState({ open: false, orderId: null, action: null });
  const [orderTab, setOrderTab] = useState("pending"); // "pending" or "active"
  const { showToast } = useToast();

  useEffect(() => {
    const fetchFarmerName = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const fullName = data.firstName && data.lastName
            ? `${data.firstName} ${data.lastName}`
            : data.firstName || data.lastName || data.fullName || data.name || "Farmer";
          setFarmerName(fullName);
        }
      }
    };
    fetchFarmerName();
  }, []);

  const getWelcomeName = () => {
    if (farmerName) {
      return farmerName.split(' ')[0];
    }
    return "Farmer";
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          setOrders([]);
          return;
        }
        const res = await axios.get(`http://localhost:8081/orders/farmer/${user.uid}`);
        setOrders(res.data || []);
      } catch (err) {
        console.error("Error loading farmer orders", err);
        showToast("Failed to load orders", "error");
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
    // run only once on mount; showToast is stable from hook, ignore lint warning
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doAction = async (orderId, action) => {
    setProcessing((p) => ({ ...p, [orderId]: true }));
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      // Get Firebase ID token (or fallback to uid string if not available)
      let token = null;
      try {
        if (user) token = await user.getIdToken(true);
      } catch (e) {
        token = user ? user.uid : null;
      }

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      if (action === "accept") {
        await axios.put(`http://localhost:8081/orders/${orderId}/accept`, { farmerId: user ? user.uid : null }, { headers });
        showToast("Order accepted", "success");
        // optimistic update: mark order accepted
        setOrders((arr) => arr.map(o => o.id === orderId ? { ...o, status: 'ACCEPTED' } : o));
        if (reload) reload();
      } else {
        await axios.put(`http://localhost:8081/orders/${orderId}/reject`, { farmerId: user ? user.uid : null }, { headers });
        showToast("Order rejected", "success");
        setOrders((arr) => arr.map(o => o.id === orderId ? { ...o, status: 'REJECTED' } : o));
      }
    } catch (err) {
      console.error("Error updating order", err);
      const msg = err?.response?.data || err.message || "Error updating order";
      showToast(msg, "error");
    } finally {
      setProcessing((p) => ({ ...p, [orderId]: false }));
      setConfirm({ open: false, orderId: null, action: null });
    }
  };

  const handleOrderAction = (orderId, action) => {
    setConfirm({ open: true, orderId, action });
  };

  const onConfirm = () => {
    if (confirm.orderId && confirm.action) doAction(confirm.orderId, confirm.action);
  };

  const onCancel = () => setConfirm({ open: false, orderId: null, action: null });

  return (
    <div className="farmer-dashboard" style={{padding: '12px 12px',display: 'block', margin: '0', width: '100%'}}>
      <h2 style={{marginBottom: 16, fontWeight: 700, fontSize: 20, color: '#388e3c', margin: '0  auto 5%'}}>Welcome, {getWelcomeName()}!</h2>

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

      {/* Received Orders - show latest pending orders and allow accept/reject */}
      <section style={{margin: '30px auto', width: '100%', maxWidth: 980}}>
        <h3 style={{marginBottom: 12, fontWeight: 600, color: '#1976d2', fontSize: 14}}>Orders</h3>
        
        {/* Tab Navigation */}
        <div style={{display: 'flex', gap: 8, marginBottom: 16, borderBottom: '2px solid #ddd'}}>
          <button 
            onClick={() => setOrderTab("pending")}
            style={{
              padding: '10px 16px',
              background: orderTab === "pending" ? '#1976d2' : 'transparent',
              color: orderTab === "pending" ? '#fff' : '#1976d2',
              border: 'none',
              borderBottom: orderTab === "pending" ? '3px solid #1976d2' : 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14
            }}
          >
            Pending Orders
          </button>
          <button 
            onClick={() => setOrderTab("active")}
            style={{
              padding: '10px 16px',
              background: orderTab === "active" ? '#388e3c' : 'transparent',
              color: orderTab === "active" ? '#fff' : '#388e3c',
              border: 'none',
              borderBottom: orderTab === "active" ? '3px solid #388e3c' : 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14
            }}
          >
            Active Orders
          </button>
        </div>

        {ordersLoading ? (
          <div>Loading orders...</div>
        ) : orderTab === "pending" ? (
          <>
            {orders.filter(o => o.status === 'PENDING' && o.quantity <= (crops.find(c => c.id === o.cropId)?.quantity || 0)).length === 0 ? (
              <div style={{color: '#666'}}>No pending orders with available stock.</div>
            ) : (
              <table style={{width: '100%', borderCollapse: 'collapse', background: 'var(--modal-bg)', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
                <thead>
                  <tr style={{background: 'var(--secondary-color)'}}>
                    <th style={{padding: '8px 10px', textAlign: 'left', fontSize: '12px'}}>Order ID</th>
                    <th style={{padding: '8px 10px', textAlign: 'left', fontSize: '12px'}}>Buyer</th>
                    <th style={{padding: '8px 10px', textAlign: 'left', fontSize: '12px'}}>Crop</th>
                    <th style={{padding: '8px 10px', textAlign: 'left', fontSize: '12px'}}>Requested</th>
                    <th style={{padding: '8px 10px', textAlign: 'left', fontSize: '12px'}}>Available</th>
                    <th style={{padding: '8px 10px', textAlign: 'left', fontSize: '12px'}}>Status</th>
                    <th style={{padding: '8px 10px', textAlign: 'left', fontSize: '12px'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.filter(o => o.status === 'PENDING' && o.quantity <= (crops.find(c => c.id === o.cropId)?.quantity || 0)).slice(0, 6).map((o) => {
                    const cropAvailable = crops.find(c => c.id === o.cropId)?.quantity || 0;
                    const isInsufficient = o.quantity > cropAvailable;
                    return (
                    <tr key={o.id} style={{background: isInsufficient ? '#fff3e0' : 'transparent'}}>
                      <td style={{padding: '8px 10px', borderBottom: '1px solid var(--border-color)'}}>{o.id}</td>
                      <td style={{padding: '8px 10px', borderBottom: '1px solid var(--border-color)'}}>{o.buyerName || o.buyerUid}</td>
                      <td style={{padding: '8px 10px', borderBottom: '1px solid var(--border-color)'}}>{o.cropType}</td>
                      <td style={{padding: '8px 10px', borderBottom: '1px solid var(--border-color)'}}>{o.quantity}</td>
                      <td style={{padding: '8px 10px', borderBottom: '1px solid var(--border-color)', color: isInsufficient ? '#d32f2f' : 'inherit'}}>{cropAvailable} {isInsufficient && '⚠️'}</td>
                      <td style={{padding: '8px 10px', borderBottom: '1px solid var(--border-color)'}}>{o.status}</td>
                      <td style={{padding: '8px 10px', borderBottom: '1px solid var(--border-color)'}}>
                        {o.status === 'PENDING' && (
                            <>
                              <button disabled={processing[o.id] || isInsufficient} onClick={() => handleOrderAction(o.id, 'accept')} title={isInsufficient ? `Insufficient stock: need ${o.quantity}, have ${cropAvailable}` : ''} style={{marginRight: 8, background: isInsufficient ? '#ccc' : '#43a047', color: '#fff', padding: '6px 8px', borderRadius: 6, border: 'none', cursor: isInsufficient ? 'not-allowed' : 'pointer'}}>{processing[o.id] ? 'Accepting...' : 'Accept'}</button>
                              <button disabled={processing[o.id]} onClick={() => handleOrderAction(o.id, 'reject')} style={{background: '#e53935', color: '#fff', padding: '6px 8px', borderRadius: 6, border: 'none'}}>{processing[o.id] ? 'Rejecting...' : 'Reject'}</button>
                            </>
                          )}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </>
        ) : (
          <>
            {orders.filter(o => o.status === 'ACCEPTED').length === 0 ? (
              <div style={{color: '#666'}}>No active orders.</div>
            ) : (
              <table style={{width: '100%', borderCollapse: 'collapse', background: 'var(--modal-bg)', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'}}>
                <thead>
                  <tr style={{background: 'var(--secondary-color)'}}>
                    <th style={{padding: '8px 10px', textAlign: 'left', fontSize: '12px'}}>Order ID</th>
                    <th style={{padding: '8px 10px', textAlign: 'left', fontSize: '12px'}}>Buyer</th>
                    <th style={{padding: '8px 10px', textAlign: 'left', fontSize: '12px'}}>Crop</th>
                    <th style={{padding: '8px 10px', textAlign: 'left', fontSize: '12px'}}>Quantity</th>
                    <th style={{padding: '8px 10px', textAlign: 'left', fontSize: '12px'}}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.filter(o => o.status === 'ACCEPTED').map((o) => (
                    <tr key={o.id}>
                      <td style={{padding: '8px 10px', borderBottom: '1px solid var(--border-color)'}}>{o.id}</td>
                      <td style={{padding: '8px 10px', borderBottom: '1px solid var(--border-color)'}}>{o.buyerName || o.buyerUid}</td>
                      <td style={{padding: '8px 10px', borderBottom: '1px solid var(--border-color)'}}>{o.cropType}</td>
                      <td style={{padding: '8px 10px', borderBottom: '1px solid var(--border-color)'}}>{o.quantity}</td>
                      <td style={{padding: '8px 10px', borderBottom: '1px solid var(--border-color)', color: '#388e3c', fontWeight: 600}}>{o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
        <div style={{marginTop: 8}}>
          <a href="/dashboard/orders" style={{color: '#1976d2', textDecoration: 'underline', fontSize: 12}}>View All Orders</a>
        </div>
        {confirm.open && (
          <ConfirmDialog
            message={`Are you sure you want to ${confirm.action} order ${confirm.orderId}?`}
            onConfirm={onConfirm}
            onCancel={onCancel}
          />
        )}
      </section>
    </div>
  );
}

export default FarmerDashboard;