export function formatTimestamp(isoString) {
  const date = new Date(isoString);
  const formatted = date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "medium",
  });
  return `${formatted}.${date.getMilliseconds()}`;
}
