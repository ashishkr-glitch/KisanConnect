import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// ✅ Enhanced hook to fetch full user profile
function useUserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile({
              uid: user.uid,
              email: user.email,
              ...docSnap.data(),
            });
          } else {
            setError("User profile not found");
          }
        } catch (err) {
          setError("Error fetching profile: " + err.message);
        }
      } else {
        setError("User not logged in");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { profile, loading, error };
}

export default useUserProfile;