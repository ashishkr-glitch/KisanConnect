import { useEffect, useState } from "react";

// ✅ Custom hook to manage theme
function useTheme() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    // Remove both themes first, then add the saved one
    document.body.classList.remove("light", "dark");
    document.body.classList.add(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    // Remove both old themes
    document.body.classList.remove("light", "dark");
    // Add new theme
    document.body.classList.add(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  return { theme, toggleTheme };
}

export default useTheme;