import React, { useState, useEffect } from 'react';
import './SnowControl.css';

function SnowControl() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem('letItSnow') === 'true';
      setEnabled(v);
    } catch (e) {}
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    try { localStorage.setItem('letItSnow', next ? 'true' : 'false'); } catch (e) {}

    // Call global handlers exposed by public/snowfall.js
    try {
      if (next && window.startSnowfall) window.startSnowfall();
      if (!next && window.stopSnowfall) window.stopSnowfall();
    } catch (e) { console.error(e); }
    try { window.dispatchEvent(new Event('kc-snow-change')); } catch (e) {}
  };

  const clearAndStop = () => {
    try { localStorage.removeItem('letItSnow'); } catch (e) {}
    setEnabled(false);
    try { if (window.stopSnowfall) window.stopSnowfall(); } catch (e) {}
    try { window.dispatchEvent(new Event('kc-snow-change')); } catch (e) {}
  };

  return (
    <div className="snow-control-page">
      <div className="snow-control-box">
        <h2>Let it snow — Global toggle</h2>
        <p>This page lets you enable a harmless snow animation that overlays the UI. The snow persists across pages until you turn it off from here.</p>
        <div className="controls">
          <label className="switch">
            <input type="checkbox" checked={enabled} onChange={toggle} />
            <span className="slider" />
          </label>
          <button className="clear-btn" onClick={clearAndStop}>Disable & Clear</button>
        </div>

        <h3>Notes</h3>
        <ul>
          <li>The snow overlay is injected as a canvas with pointer-events disabled.</li>
          <li>This feature does not modify other project files — it only uses a small script included in <code>public/index.html</code>.</li>
          <li>To remove the feature completely, see the instructions at the bottom of this page.</li>
        </ul>

        <h3>How to remove later</h3>
        <p>If you want to remove the snowfall feature entirely:
        <ol>
          <li>Delete <code>public/snowfall.js</code>.</li>
          <li>Remove the script tag referencing it from <code>public/index.html</code>.</li>
          <li>Optionally remove this page <code>src/pages/SnowControl.js</code> and its CSS.</li>
        </ol>
        </p>
      </div>
    </div>
  );
}

export default SnowControl;
