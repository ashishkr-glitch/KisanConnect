import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import OrderTimeline from "../components/OrderTimeline";
import RatingComponent from "../components/RatingComponent";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const { showToast } = useToast();
  // call useAuth at top level to obey hooks rules
  const { uid: authUid } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const uid = authUid || localStorage.getItem("uid");
        if (uid) {
          const res = await api.get(`/orders/buyer/${uid}`);
          const ordersData = res.data || [];
          // Fetch farmer names for orders that don't have them (old orders) from backend
          const enrichedOrders = await Promise.all(
            ordersData.map(async (order) => {
              if (!order.farmerName && order.farmerId) {
                try {
                  const farmerResp = await api.get(`/users/${order.farmerId}`);
                  if (farmerResp?.data) {
                    const farmerData = farmerResp.data;
                    order.farmerName = farmerData.fullName || (farmerData.firstName && farmerData.lastName ? `${farmerData.firstName} ${farmerData.lastName}` : farmerData.name) || "N/A";
                  }
                } catch (err) {
                  console.error("Error fetching farmer name:", err);
                }
              }
              return order;
            })
          );
          setOrders(enrichedOrders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        setError(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/orders/${orderId}`);
      showToast("Order deleted successfully", "success");
      setOrders(orders.filter(o => (o.id || o.orderId) !== orderId));
    } catch (err) {
      console.error("Error deleting order:", err);
      showToast("Error deleting order", "error");
    }
  };

  const handleReviewSubmit = async (orderId, farmerId, farmerName, reviewData) => {
    try {
      const uid = authUid || localStorage.getItem("uid");
      const buyerName = localStorage.getItem("full_name") || "Buyer";
      
      await api.post(`/ratings`, {
        farmerId,
        buyerUid: uid,
        buyerName,
        rating: reviewData.rating,
        review: reviewData.review
      });
      
      showToast("Review submitted successfully!", "success");
      
      // Update order to mark as reviewed
      setOrders(orders.map(o => 
        (o.id || o.orderId) === orderId 
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
    <div className="my-orders">
      <div className="panel">
        <h3>My Orders</h3>

        {error && (
          <div className="note">Could not load orders from server. You can place orders from the Market.</div>
        )}

        {!error && orders && orders.length === 0 && (
          <div className="empty">
            <p>No orders yet.</p>
            <button onClick={() => navigate('/dashboard')}>Go to Market</button>
          </div>
        )}

        {!error && orders && orders.length > 0 && (
          <>
            {selectedOrder ? (
              <div className="order-detail-view">
                <button
                  className="back-button"
                  onClick={() => setSelectedOrder(null)}
                >
                  ← Back to List
                </button>
                <OrderTimeline order={selectedOrder} />
              </div>
            ) : (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Farmer</th>
                    <th>Crop</th>
                    <th>Qty</th>
                    <th>Status</th>
                    <th>Review</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id || o.orderId}>
                      <td>{o.id || o.orderId}</td>
                      <td>{o.farmerName || o.farmer || "N/A"}</td>
                      <td>{o.cropName || o.cropType || o.crop || o.product || "N/A"}</td>
                      <td>{o.quantity || o.qty}</td>
                      <td>{o.status || 'Pending'}</td>
                      <td className="review-cell">
                        {(o.status === "ACCEPTED" || o.status === "DELIVERED") && !o.reviewed ? (
                          <RatingComponent
                            rating={0}
                            reviewCount={0}
                            size="small"
                            showCount={false}
                            onRate={(data) => handleReviewSubmit(o.id || o.orderId, o.farmerId, o.farmerName, data)}
                          />
                        ) : o.status === "ACCEPTED" || o.status === "DELIVERED" ? (
                          <span className="badge-reviewed">✅ Reviewed</span>
                        ) : (
                          <span className="badge-none">-</span>
                        )}
                      </td>
                      <td className="orders-actions">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="btn btn-view"
                          title="View order details"
                        >
                          👁️ View
                        </button>
                        <button
                          onClick={() => handleDelete(o.id || o.orderId)}
                          className="btn btn-delete"
                          title="Delete order"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
