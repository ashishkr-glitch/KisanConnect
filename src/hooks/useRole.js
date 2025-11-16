import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// ✅ Enhanced hook to get role + flags
function useRole() {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userRole = docSnap.data().role;
            setRole(userRole);
            localStorage.setItem("role", userRole);
          }
        } catch (err) {
          console.error("Error fetching role:", err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    role,
    isAdmin: role === "admin",
    isFarmer: role === "farmer",
    isBuyer: role === "buyer",
    loading,
  };
}

export default useRole;