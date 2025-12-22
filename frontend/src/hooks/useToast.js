import { useState } from "react";

// ✅ Custom hook for global toast
function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success", duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };

  return { toast, showToast };
}

export default useToast;