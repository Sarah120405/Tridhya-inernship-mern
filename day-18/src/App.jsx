import { useState } from "react";

import Counter from "./components/Counter/Counter.jsx";
import logoImg from "./assets/logo.png";
import CounterConfigure from "./components/Counter/CounterConfugure.tsx";

function App() {
  const [chosenCount, setChosenCount] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);

  function handleSetCount(newCount) {
    setChosenCount(newCount);
    setResetTrigger((prev) => prev + 1);
  }
  return (
    <>
      <header id="main-header">
        <img src={logoImg} alt="logo" />
        <h1>Counter App</h1>
      </header>
      <main>
        <CounterConfigure onSetCount={handleSetCount} />
        <Counter key={resetTrigger} initialCount={chosenCount} />
      </main>
    </>
  );
}

export default App;
