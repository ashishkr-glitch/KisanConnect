import React, { useEffect, useState } from "react";
import api from "../api";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import RatingComponent from "../components/RatingComponent";
import "./FarmerOrders.css";
import ConfirmDialog from "../components/ConfirmDialog";


function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});
  const [confirm, setConfirm] = useState({ open: false, orderId: null, action: null });
  const [orderTab, setOrderTab] = useState("pending");
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

    } catch (err) {
      console.error("Error fetching farmer orders:", err);
      showToast("Failed to load orders", "error");
      setOrders([]);
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

  const handleReviewSubmit = async (orderId, buyerUid, buyerName, reviewData) => {
    try {
      const user = auth?.user;
      const uid = user ? user.uid : localStorage.getItem("uid");
      const farmerName = localStorage.getItem("full_name") || "Farmer";
      
      await api.post(`/ratings`, {
        farmerId: uid,
        buyerUid,
        buyerName,
        rating: reviewData.rating,
        review: reviewData.review
      });
      
      showToast("Review submitted successfully!", "success");
      
      // Update order to mark as reviewed
      setOrders(orders.map(o => 
        o.id === orderId 
          ? { ...o, reviewed: true }
          : o
      ));
    } catch (err) {
      console.error("Error submitting review:", err);
      showToast("Error submitting review", "error");
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="farmer-orders panel">
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginBottom: 16}}>
        {/* Theme button (reuse if needed) */}
        <div style={{marginRight: 8}}>
          {/* If you have a ThemeToggle component, import and use it here */}
        </div>
      </div>
      {/* Optionally, add a modal for profile details */}
      {/* profile modal removed per request */}
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
                <th>Review</th>
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
                  <td style={{ padding: "8px" }}>
                    {!o.reviewed ? (
                      <RatingComponent
                        rating={0}
                        reviewCount={0}
                        size="small"
                        showCount={false}
                        onRate={(data) => handleReviewSubmit(o.id, o.buyerUid, o.buyerName, data)}
                      />
                    ) : (
                      <span style={{ color: "green", fontSize: "12px", fontWeight: 600 }}>✅ Reviewed</span>
                    )}
                  </td>
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
