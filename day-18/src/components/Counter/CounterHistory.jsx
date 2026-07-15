import { useState } from "react";

export default function CounterHistory({ history }) {
  return (
    <ol>
      {history.map((count) => (
        <li key={count.id} className={undefined}>
          {count.value}
        </li>
      ))}
    </ol>
  );
}
