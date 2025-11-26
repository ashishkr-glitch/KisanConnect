import React from "react";

/**
 * Badge Component
 * A small label for status indicators, tags, etc.
 * 
 * Props:
 *   variant: 'primary' | 'success' | 'warning' | 'danger' (default: 'primary')
 *   children: React node
 *   className: additional CSS classes
 */
function Badge({ variant = "primary", children, className = "" }) {
  const badgeClass = `badge badge-${variant}`;

  return <span className={`${badgeClass} ${className}`}>{children}</span>;
}

export default Badge;
