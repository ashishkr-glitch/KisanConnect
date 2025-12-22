// Hook that exposes locally-stored auth info (uid, email, displayName)
function useAuth() {
  const uid = localStorage.getItem("uid") || "";
  const email = localStorage.getItem("email") || "";
  const displayName = localStorage.getItem("full_name") || "";
  const isLoggedIn = !!uid;

  return {
    user: isLoggedIn ? { uid, email, displayName } : null,
    uid,
    email,
    displayName,
    isLoggedIn,
    checking: false,
  };
}

export default useAuth;