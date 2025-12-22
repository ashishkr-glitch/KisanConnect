import React from "react";

/**
 * Card Component
 * A reusable card with header, body, and footer sections
 * 
 * Props:
 *   children: React node (card-body content)
 *   header: React node (card-header content)
 *   footer: React node (card-footer content)
 *   className: additional CSS classes
 *   hoverable: boolean (default: true)
 */
function Card({
  children,
  header,
  footer,
  className = "",
  hoverable = true,
}) {
  const cardClass = hoverable ? "card" : "card";

  return (
    <div className={`${cardClass} ${className}`}>
      {header && (
        <div className="card-header">
          {header}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
