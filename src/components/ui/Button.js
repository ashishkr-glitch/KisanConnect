import React from "react";

/**
 * Button Component
 * A reusable button with multiple variants and sizes
 * 
 * Props:
 *   variant: 'primary' | 'secondary' | 'danger' | 'outline' (default: 'primary')
 *   size: 'sm' | 'base' | 'lg' (default: 'base')
 *   fullWidth: boolean (default: false)
 *   disabled: boolean (default: false)
 *   onClick: function
 *   children: React node
 *   className: additional CSS classes
 *   ...rest: other HTML attributes
 */
function Button({
  variant = "primary",
  size = "base",
  fullWidth = false,
  disabled = false,
  onClick,
  children,
  className = "",
  ...rest
}) {
  const baseClass = "btn";
  const variantClass = `btn-${variant}`;
  const sizeClass = size !== "base" ? `btn-${size}` : "";
  const widthClass = fullWidth ? "btn-block" : "";

  const classes = [baseClass, variantClass, sizeClass, widthClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
