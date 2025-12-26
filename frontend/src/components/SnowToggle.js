import React, { useState, useEffect } from 'react';
import { FaSnowflake } from 'react-icons/fa';

function SnowToggle({ className = '' }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    try { setEnabled(localStorage.getItem('letItSnow') === 'true'); } catch (e) {}
    const onSnow = () => { try { setEnabled(localStorage.getItem('letItSnow') === 'true'); } catch (e) {} };
    window.addEventListener('kc-snow-change', onSnow);
    window.addEventListener('storage', onSnow);
    return () => {
      window.removeEventListener('kc-snow-change', onSnow);
      window.removeEventListener('storage', onSnow);
    };
  }, []);

  const toggle = () => {
    try {
      const next = !enabled;
      try { localStorage.setItem('letItSnow', next ? 'true' : 'false'); } catch (e) {}
      if (next && window.startSnowfall) window.startSnowfall();
      if (!next && window.stopSnowfall) window.stopSnowfall();
      setEnabled(next);
      try { window.dispatchEvent(new Event('kc-snow-change')); } catch (e) {}
    } catch (e) { console.error(e); }
  };

  return (
    <button
      onClick={toggle}
      title="Toggle snow"
      className={`snow-toggle-header ${enabled ? 'enabled' : ''} ${className}`}
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
    >
      <FaSnowflake />
    </button>
  );
}

export default SnowToggle;
