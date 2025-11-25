import React, { useEffect, useState } from "react";
import api from "../api";
import useAuth from "../hooks/useAuth";
import EditDeleteButtons from "../components/EditDeleteButtons";

function BuyerList() {
  const [buyers, setBuyers] = useState([]);
  const [role, setRole] = useState("");
  // call hook at top level to satisfy rules-of-hooks
  const { uid: authUid } = useAuth();
  const fetchBuyers = async () => {
    try {
      const res = await api.get(`/buyers`);
      setBuyers(res.data);
    } catch (err) {
      console.error("Error fetching buyers:", err);
    }
  };

  const fetchUserRole = async () => {
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
  };

  useEffect(() => {
    fetchUserRole();
    fetchBuyers();
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
              <td>{(buyer.uid || "").toString().substring(0,5).toUpperCase()}</td>
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