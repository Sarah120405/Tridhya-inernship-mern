import { useState } from "react";

export default function CounterConfigure({
  onSetCount,
}: {
  onSetCount: (value: number) => void;
}) {
  const [enteredNumber, setEnteredNumber] = useState(0);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEnteredNumber(+event.target.value);
  }

  function handleSetClick() {
    onSetCount(enteredNumber);
    setEnteredNumber(0);
  }

  return (
    <section id="configure-counter">
      <h2>Set Counter</h2>
      <input type="number" onChange={handleChange} value={enteredNumber} />
      <button onClick={handleSetClick}>Set</button>
    </section>
  );
}
