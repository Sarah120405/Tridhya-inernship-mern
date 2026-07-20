import { useEffect, useState } from "react";

/*  Locally store data in key value format.
 The useEffect fires once on mount and again on every subsequent change */
function getData(key, initialValue) {
  try {
    const stored = localStorage.getItem(key);
    return stored !== null ? JSON.parse(stored) : initialValue;
  } catch {
    return initialValue;
  }
}
export default function useLocalStorage(key, initialValue) {
  const [data, setData] = useState(() => getData(key, initialValue));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data));
  }, [key, data]);

  return [data, setData];
}
