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
        cursor: "pointer",
        fontSize: "20px",
        color: theme === "light" ? "#2c3e50" : "#e0e0e0",
      }}
    >
      {theme === "light" ? <FaMoon /> : <FaSun />}
    </button>
  );
}

export default ThemeToggle;