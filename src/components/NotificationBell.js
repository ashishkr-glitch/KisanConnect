import React, { useState, useEffect, useRef } from "react";
import api from "../api";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import { FaBell } from "react-icons/fa";
import "./NotificationBell.css";

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const auth = useAuth();
  const { showToast } = useToast();
  const dropdownRef = useRef(null);
  const bellRef = useRef(null);

  // Fetch notifications on mount and setup polling
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const uid = auth?.user?.uid || localStorage.getItem("uid");
        if (!uid) return;

        const res = await api.get(`/notifications/${uid}`);
        setNotifications(res.data || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();

    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    // Listen for auth changes to refetch notifications
    const handleAuthChange = () => {
      fetchNotifications();
    };
    window.addEventListener("kc-auth-change", handleAuthChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("kc-auth-change", handleAuthChange);
    };
  }, [auth?.user?.uid]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        bellRef.current &&
        !bellRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, readFlag: true } : n
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleClearAll = async () => {
    try {
      // Mark all as read
      await Promise.all(
        notifications
          .filter((n) => !n.readFlag)
          .map((n) => api.put(`/notifications/${n.id}/read`))
      );
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readFlag: true }))
      );
      showToast("All notifications cleared", "success");
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.readFlag).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "ORDER_RECEIVED":
        return "📦";
      case "ORDER_ACCEPTED":
        return "✅";
      case "ORDER_REJECTED":
        return "❌";
      case "PAYMENT_RECEIVED":
        return "💰";
      case "USER_REGISTERED":
        return "👤";
      default:
        return "🔔";
    }
  };

  return (
    <div className="notification-bell" ref={bellRef}>
      <button
        className="bell-button"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label={`${unreadCount} unread notifications`}
        title={`${unreadCount} unread notifications`}
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown" ref={dropdownRef}>
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button className="clear-btn" onClick={handleClearAll}>
                Clear All
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="empty-state">No notifications yet</div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`notification-item ${!notif.readFlag ? "unread" : ""}`}
                  onClick={() => handleMarkAsRead(notif.id)}
                >
                  <span className="notif-icon">
                    {getNotificationIcon(notif.type)}
                  </span>
                  <div className="notif-content">
                    <p className="notif-message">{notif.message}</p>
                    <small className="notif-time">
                      {new Date(notif.createdAt).toLocaleDateString()}{" "}
                      {new Date(notif.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>
                  </div>
                  {!notif.readFlag && <span className="unread-dot">●</span>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
