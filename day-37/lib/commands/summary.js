import { parseLogFile } from "../parseLog.js";

export function summaryCommand(filePath) {
  if (!filePath) {
    console.error("Usage: node bin/cli.js summary <file>");
    process.exit(1);
  }

  const { entries } = parseLogFile(filePath);

  const errors = entries.filter((e) => e.level === "ERROR");
  const warnings = entries.filter((e) => e.level === "WARN");

  // Most frequent error message (grouping by message text)
  const errorCounts = {};
  errors.forEach((e) => {
    errorCounts[e.message] = (errorCounts[e.message] || 0) + 1;
  });
  const mostFrequentError = Object.entries(errorCounts).sort(
    (a, b) => b[1] - a[1],
  )[0];

  // Longest/shortest log line by message length
  const sortedByLength = [...entries].sort(
    (a, b) => b.message.length - a.message.length,
  );
  const longest = sortedByLength[0];
  const shortest = sortedByLength[sortedByLength.length - 1];

  console.log("\nSummary");
  console.log(`Errors: ${errors.length}`);
  console.log(`Warnings: ${warnings.length}`);
  console.log(
    `Most Frequent Error: ${mostFrequentError ? `${mostFrequentError[0]} (${mostFrequentError[1]}x)` : "none"}`,
  );
  console.log(
    `Longest Log: ${longest ? `${longest.message} (${longest.message.length} chars)` : "none"}`,
  );
  console.log(
    `Shortest Log: ${shortest ? `${shortest.message} (${shortest.message.length} chars)` : "none"}`,
  );
}
