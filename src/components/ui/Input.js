import React from "react";

/**
 * Input Component
 * A styled input field with consistent styling
 * 
 * Props:
 *   type: 'text' | 'email' | 'password' | 'number' | 'date' (default: 'text')
 *   placeholder: string
 *   value: string
 *   onChange: function
 *   label: string (optional, shows label above input)
 *   error: string (optional, shows error message)
 *   disabled: boolean
 *   required: boolean
 *   className: additional CSS classes
 */
function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  label,
  error,
  disabled = false,
  required = false,
  className = "",
  ...rest
}) {
  return (
    <div className={`input-wrapper ${error ? "input-error" : ""}`}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`input ${className}`}
        {...rest}
      />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
}

export default Input;
