import { useEffect } from "react";

export function useAutoDismiss(message, onDismiss, delay = 3000) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onDismiss();
    }, delay);

    return () => clearTimeout(timer);
  }, [message, onDismiss, delay]);
}
