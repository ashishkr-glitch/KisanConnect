import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// ✅ Redirect user to correct dashboard based on role
function useDashboardRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    const redirectUser = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const role = docSnap.data().role;
          localStorage.setItem("role", role);

          if (role === "admin") navigate("/dashboard");
          else if (role === "farmer") navigate("/dashboard");
          else if (role === "buyer") navigate("/dashboard");
          else navigate("/unauthorized");
        }
      } else {
        navigate("/login");
      }
    };

    redirectUser();
  }, [navigate]);
}

export default useDashboardRedirect;