import React from "react";
import "./OrderTimeline.css";

function OrderTimeline({ order = {} }) {
  const statusSteps = [
    { status: "PENDING", label: "Order Placed", icon: "📦" },
    { status: "ACCEPTED", label: "Accepted", icon: "✅" },
    { status: "READY", label: "Ready to Ship", icon: "📋" },
    { status: "SHIPPED", label: "In Transit", icon: "🚚" },
  ];

  const statusMap = {
    PENDING: 0,
    ACCEPTED: 1,
    READY: 2,
    SHIPPED: 3,
    REJECTED: -1,
    DELIVERED: 4,
  };

  const currentStepIndex = statusMap[order.status] !== undefined ? statusMap[order.status] : 0;
  const isRejected = order.status === "REJECTED";

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`order-timeline ${isRejected ? "rejected" : ""}`}>
      {isRejected ? (
        <div className="timeline-rejected">
          <div className="rejected-icon">❌</div>
          <h3>Order Rejected</h3>
          <p>This order was rejected by the farmer.</p>
          {order.rejectionReason && (
            <p className="rejection-reason">
              <strong>Reason:</strong> {order.rejectionReason}
            </p>
          )}
        </div>
      ) : (
        <div className="timeline-container">
          {/* Timeline Steps */}
          <div className="timeline-steps">
            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isActive = index === currentStepIndex;

              return (
                <div key={step.status} className={`timeline-step ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""}`}>
                  <div className="step-icon">{step.icon}</div>
                  <div className="step-label">{step.label}</div>
                  {index < statusSteps.length - 1 && (
                    <div className={`step-connector ${isCompleted && index < currentStepIndex ? "completed" : ""}`}></div>
                  )}
                </div>
              );
            })}

            {/* Delivered Step */}
            {order.status === "DELIVERED" && (
              <div className="timeline-step completed active delivered">
                <div className="step-icon">🎉</div>
                <div className="step-label">Delivered</div>
              </div>
            )}
          </div>

          {/* Timeline Details */}
          <div className="timeline-details">
            <div className="detail-row">
              <span className="detail-label">Order ID:</span>
              <span className="detail-value">{order.id}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className={`detail-value status-${order.status?.toLowerCase() || "pending"}`}>
                {order.status || "PENDING"}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Order Date:</span>
              <span className="detail-value">{formatDate(order.createdAt)}</span>
            </div>

            {order.acceptedAt && (
              <div className="detail-row">
                <span className="detail-label">Accepted On:</span>
                <span className="detail-value">{formatDate(order.acceptedAt)}</span>
              </div>
            )}

            <div className="detail-row">
              <span className="detail-label">Quantity:</span>
              <span className="detail-value">{order.quantity} kg</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Crop:</span>
              <span className="detail-value">{order.cropType}</span>
            </div>

            {order.deliveryDate && (
              <div className="detail-row">
                <span className="detail-label">Expected Delivery:</span>
                <span className="detail-value">{formatDate(order.deliveryDate)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderTimeline;
