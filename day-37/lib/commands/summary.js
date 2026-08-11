import { parseLogFile } from "../parseLog.js";
import chalk from "chalk";

export async function summaryCommand(filePath) {
  if (!filePath) {
    console.error("Usage: node bin/cli.js summary <file>");
    process.exit(1);
  }

  const { entries } = await parseLogFile(filePath);

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

  console.log(chalk.bold("\n📋 Summary"));
  console.log(chalk.gray("─".repeat(32)));
  console.log(`${chalk.red("Errors:")}   ${errors.length}`);
  console.log(`${chalk.yellow("Warnings:")} ${warnings.length}`);
  console.log(chalk.gray("─".repeat(32)));
  console.log(
    `Most Frequent Error: ${mostFrequentError ? `${mostFrequentError[0]} ${chalk.dim(`(${mostFrequentError[1]}x)`)}` : "none"}`,
  );
  console.log(
    `Longest Log:  ${longest ? `${longest.message} ${chalk.dim(`(${longest.message.length} chars)`)}` : "none"}`,
  );
  console.log(
    `Shortest Log: ${shortest ? `${shortest.message} ${chalk.dim(`(${shortest.message.length} chars)`)}` : "none"}`,
  );
}
