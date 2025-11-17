import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import EditDeleteButtons from "../components/EditDeleteButtons";

function BuyerList() {
  const [buyers, setBuyers] = useState([]);
  const [role, setRole] = useState("");

  const fetchBuyers = async () => {
    try {
      const res = await axios.get("http://localhost:8081/buyers");
      setBuyers(res.data);
    } catch (err) {
      console.error("Error fetching buyers:", err);
    }
  };

  const fetchUserRole = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRole(docSnap.data().role);
      }
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