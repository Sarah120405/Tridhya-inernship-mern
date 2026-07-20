import { useState } from "react";

// Toggle between two values
export default function useToggle(initialValue = false) {
  const [toggle, setToggle] = useState(initialValue);

  function toggleClick() {
    setToggle((prev) => !prev);
  }

  return { toggle, toggleClick };
}
