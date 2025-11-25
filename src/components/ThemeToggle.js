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
        background: "var(--secondary-color)",
                border: "1px solid var(--border-color)",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: 20,
                color: "var(--primary-color)",
                marginRight: 4,
                width: 40,
                height: 40,
                minWidth: 40,
                minHeight: 40,
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.2s, color 0.2s"
      }}
    >
      {theme === "light" ? <FaMoon /> : <FaSun />}
    </button>
  );
}

export default ThemeToggle;