import { useState } from "react";

// A custom hook to edit the count variable
export function useCounter(initalValue = 0) {
  const [count, setCount] = useState(initalValue);

  function increment() {
    setCount((prev) => prev + 1);
  }
  function decrement() {
    setCount((prev) => prev - 1);
  }
  function reset() {
    setCount(initalValue);
  }

  return { count, increment, decrement, reset };
}
