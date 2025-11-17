import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import useToast from "../hooks/useToast";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          const uid = user.uid;
          const res = await axios.get(`http://localhost:8081/orders/buyer/${uid}`);
          const ordersData = res.data || [];
          
          // Fetch farmer names for orders that don't have them (old orders)
          const enrichedOrders = await Promise.all(
            ordersData.map(async (order) => {
              if (!order.farmerName && order.farmerId) {
                try {
                  const farmerDocRef = doc(db, "users", order.farmerId);
                  const farmerDocSnap = await getDoc(farmerDocRef);
                  if (farmerDocSnap.exists()) {
                    const farmerData = farmerDocSnap.data();
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
  }, []);

  const handleDelete = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8081/orders/${orderId}`);
      showToast("Order deleted successfully", "success");
      setOrders(orders.filter(o => (o.id || o.orderId) !== orderId));
    } catch (err) {
      console.error("Error deleting order:", err);
      showToast("Error deleting order", "error");
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
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Farmer</th>
                <th>Crop</th>
                <th>Qty</th>
                <th>Status</th>
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
                  <td>
                    <button
                      onClick={() => handleDelete(o.id || o.orderId)}
                      style={{
                        backgroundColor: "#e74c3c",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "18px"
                      }}
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
      </div>
    </div>
  );
}

export default MyOrders;
