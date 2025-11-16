import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from './reportWebVitals';

// ✅ Initialize theme before rendering
const savedTheme = localStorage.getItem("theme") || "light";
document.body.classList.add(savedTheme);
document.documentElement.setAttribute("data-theme", savedTheme);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

reportWebVitals();
