export default function CounterOutput({ value }) {
  const cssClass = value >= 0 ? "counter-output" : "counter-output negative";
  return <span className={cssClass}>{value}</span>;
}
