import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// ✅ Enhanced hook to get Firebase Auth user
function useAuth() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || "",
        });
      } else {
        setUser(null);
      }
      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    uid: user?.uid || "",
    email: user?.email || "",
    displayName: user?.displayName || "",
    isLoggedIn: !!user,
    checking,
  };
}

export default useAuth;