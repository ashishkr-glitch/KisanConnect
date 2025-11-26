import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import useTheme from "../hooks/useTheme";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      style={{
        background: "transparent",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: 18,
        color: "var(--primary-color)",
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.15) rotate(15deg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {theme === "light" ? <FaMoon /> : <FaSun />}
    </button>
  );
}

export default ThemeToggle;