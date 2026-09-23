import { useState, useEffect } from "react";

type Timer = ReturnType<typeof setTimeout>;

export interface UseDebounceReturn<T> {
  debouncedValue: T;
}

export default function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer: Timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
