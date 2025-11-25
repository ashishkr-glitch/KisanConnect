import React, { useEffect, useState } from "react";
import api from "../api";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import "./FarmerOrders.css";
import ConfirmDialog from "../components/ConfirmDialog";


function FarmerOrders() {
    const [profileOpen, setProfileOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const [confirm, setConfirm] = useState({ open: false, orderId: null, action: null });
  const [orderTab, setOrderTab] = useState("pending");
  const [farmerProfile, setFarmerProfile] = useState(null);
  const { showToast } = useToast();
  const auth = useAuth();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const user = auth?.user;
      // const uid = user ? user.uid : localStorage.getItem("uid");
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }
      // token/header vars were unused — removed

      // Fetch orders
      const res = await api.get(`/orders/farmer/${user.uid}`);
      setOrders(res.data || []);

      // Fetch farmer profile
      const profileRes = await api.get(`/users/${user.uid}`);
      setFarmerProfile(profileRes.data);
    } catch (err) {
      console.error("Error fetching farmer orders or profile:", err);
      showToast("Failed to load orders or profile", "error");
      setOrders([]);
      setFarmerProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doAction = async (orderId, action) => {
    setProcessing((p) => ({ ...p, [orderId]: true }));
    try {
      const user = auth?.user;
      // const uid = user ? user.uid : localStorage.getItem("uid");

      if (action === "accept") {
        await api.put(`/orders/${orderId}/accept`, { farmerId: user ? user.uid : null });
        showToast("Order accepted", "success");
        setOrders((arr) => arr.map(o => o.id === orderId ? { ...o, status: 'ACCEPTED' } : o));
      } else {
        await api.put(`/orders/${orderId}/reject`, { farmerId: user ? user.uid : null });
        showToast("Order rejected", "success");
        setOrders((arr) => arr.map(o => o.id === orderId ? { ...o, status: 'REJECTED' } : o));
      }
    } catch (err) {
      console.error("Error updating order:", err);
      const msg = err?.response?.data || err.message || "Error updating order";
      showToast(msg, "error");
    } finally {
      setProcessing((p) => ({ ...p, [orderId]: false }));
      setConfirm({ open: false, orderId: null, action: null });
    }
  };

  const handleAction = (orderId, action) => {
    setConfirm({ open: true, orderId, action });
  };

  const onConfirm = () => {
    if (confirm.orderId && confirm.action) doAction(confirm.orderId, confirm.action);
  };

  const onCancel = () => setConfirm({ open: false, orderId: null, action: null });

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="farmer-orders panel">
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginBottom: 16}}>
        {/* Theme button (reuse if needed) */}
        <div style={{marginRight: 8}}>
          {/* If you have a ThemeToggle component, import and use it here */}
        </div>
        {/* Farmer profile icon */}
        {farmerProfile && (
          <button
            style={{
              background: "var(--secondary-color)",
              border: "1px solid var(--border-color)",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: 32,
              color: "var(--primary-color)",
              width: 40,
              height: 40,
              minWidth: 40,
              minHeight: 40,
              padding: 7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s, color 0.2s",
            }}
            title="View Profile"
            onClick={() => setProfileOpen(true)}
          >
            <span role="img" aria-label="Farmer">👨‍🌾</span>
          </button>
        )}
      </div>
      {/* Optionally, add a modal for profile details */}
      {profileOpen && farmerProfile && (
        <div style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999}} onClick={() => setProfileOpen(false)}>
          <div style={{background: '#fff', padding: 32, borderRadius: 16, minWidth: 320, boxShadow: '0 2px 16px rgba(0,0,0,0.15)'}} onClick={e => e.stopPropagation()}>
            <div style={{fontSize: 48, textAlign: 'center', marginBottom: 16}}>👨‍🌾</div>
            <div style={{fontWeight: 600, fontSize: 22, marginBottom: 8}}>{farmerProfile.name || farmerProfile.firstName + ' ' + farmerProfile.lastName}</div>
            <div style={{fontSize: 16, marginBottom: 4}}>Mobile: {farmerProfile.mobile || 'N/A'}</div>
            <div style={{fontSize: 16, marginBottom: 4}}>District: {farmerProfile.district || 'N/A'}</div>
            <div style={{fontSize: 16, marginBottom: 4}}>State: {farmerProfile.state || 'N/A'}</div>
            <div style={{fontSize: 16, marginBottom: 4}}>UID: {(farmerProfile.uid || '').toString().substring(0,8).toUpperCase()}</div>
            <button style={{marginTop: 16, padding: '8px 24px', fontSize: 15, borderRadius: 8, background: '#1976d2', color: '#fff', border: 'none', cursor: 'pointer'}} onClick={() => setProfileOpen(false)}>Close</button>
          </div>
        </div>
      )}
      <h3>Orders</h3>
      
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
      
      {orderTab === "pending" ? (
        orders.filter(o => o.status === "PENDING").length === 0 ? (
          <div className="empty">No pending orders.</div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Buyer</th>
                <th>Crop</th>
                <th>Qty</th>
                <th>Created</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.filter(o => o.status === "PENDING").map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.buyerName || o.buyerUid}</td>
                  <td>{o.cropType}</td>
                  <td>{o.quantity}</td>
                  <td>{o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}</td>
                  <td>{o.status}</td>
                  <td>
                    {o.status === "PENDING" && (
                      <>
                        <button className="accept" disabled={processing[o.id]} onClick={() => handleAction(o.id, "accept")}>{processing[o.id] ? 'Accepting...' : 'Accept'}</button>
                        <button className="reject" disabled={processing[o.id]} onClick={() => handleAction(o.id, "reject")}>{processing[o.id] ? 'Rejecting...' : 'Reject'}</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      ) : (
        orders.filter(o => o.status === "ACCEPTED").length === 0 ? (
          <div className="empty">No active orders.</div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Buyer</th>
                <th>Crop</th>
                <th>Qty</th>
                <th>Created</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.filter(o => o.status === "ACCEPTED").map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.buyerName || o.buyerUid}</td>
                  <td>{o.cropType}</td>
                  <td>{o.quantity}</td>
                  <td>{o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}</td>
                  <td style={{color: '#388e3c', fontWeight: 600}}>{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
      {confirm.open && (
        <ConfirmDialog
          message={`Are you sure you want to ${confirm.action} order ${confirm.orderId}?`}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      )}
    </div>
  );
}

export default FarmerOrders;
