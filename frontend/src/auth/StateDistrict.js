// src/auth/StateDistrict.js
import React, { useState } from "react";

const stateDistrictMap = {
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur"],
};

function StateDistrict({ state, setState, district, setDistrict }) {
  return (
    <>
      <select value={state} onChange={(e) => {
        setState(e.target.value);
        setDistrict(""); // reset district
      }}>
        <option value="">Select State</option>
        {Object.keys(stateDistrictMap).map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select value={district} onChange={(e) => setDistrict(e.target.value)} disabled={!state}>
        <option value="">Select District</option>
        {state && stateDistrictMap[state].map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
    </>
  );
}

export default StateDistrict;