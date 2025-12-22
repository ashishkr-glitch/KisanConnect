import React, { useEffect, useState, useCallback } from "react";
import api from "../api";
import useAuth from "../hooks/useAuth";
import EditDeleteButtons from "../components/EditDeleteButtons";

function BuyerList() {
  const [buyers, setBuyers] = useState([]);
  const [role, setRole] = useState("");
  // call hook at top level to satisfy rules-of-hooks
  const { uid: authUid } = useAuth();
  const fetchBuyers = useCallback(async () => {
    try {
      const res = await api.get(`/buyers`);
      setBuyers(res.data);
    } catch (err) {
      console.error("Error fetching buyers:", err);
    }
  }, []);

  const fetchUserRole = useCallback(async () => {
    // Prefer role from localStorage
    const lsRole = localStorage.getItem("role");
    if (lsRole) {
      setRole(lsRole);
      return;
    }
    // fallback: try to find by uid via backend
    const uid = authUid || localStorage.getItem("uid");
    if (uid) {
      try {
        const resp = await api.get(`/users/${uid}`);
        if (resp?.data?.role) setRole(resp.data.role);
      } catch (e) {}
    }
  }, [authUid]);

  useEffect(() => {
    fetchUserRole();
    fetchBuyers();
    
    // Re-fetch on auth changes
    const handleAuthChange = () => {
      fetchUserRole();
      fetchBuyers();
    };
    window.addEventListener('kc-auth-change', handleAuthChange);
    return () => window.removeEventListener('kc-auth-change', handleAuthChange);
  }, []);

  return (
    <div className="buyer-list">
      <h2>Buyer List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Mobile</th>
            <th>District</th>
            <th>State</th>
            <th>UID</th>
            {role === "admin" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {buyers.map((buyer) => (
            <tr key={buyer.uid}>
              <td>{buyer.firstName && buyer.lastName ? `${buyer.firstName} ${buyer.lastName}` : buyer.firstName || buyer.lastName || buyer.name || "N/A"}</td>
              <td>{buyer.mobile}</td>
              <td>{buyer.district}</td>
              <td>{buyer.state}</td>
              <td>{(buyer.uid || "").toString().toUpperCase()}</td>
              {role === "admin" && (
                <td>
                  <EditDeleteButtons
                    id={buyer.uid}
                    entity="buyer"
                    onEdit={() => console.log("Edit buyer", buyer.uid)}
                    onDeleteSuccess={fetchBuyers}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BuyerList;