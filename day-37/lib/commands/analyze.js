import { parseLogFile } from "../parseLog.js";
import fs from "fs/promises";
import path from "path";
import chalk from "chalk";

export async function analyzeCommand(filePath) {
  if (!filePath) {
    console.error(chalk.red("Usage: node bin/cli.js analyze <file>"));
    process.exit(1);
  }

  const startTime = Date.now();
  const { entries, malformed } = await parseLogFile(filePath);
  const processingTime = Date.now() - startTime;

  const counts = { INFO: 0, WARN: 0, ERROR: 0, DEBUG: 0 };
  entries.forEach((entry) => {
    if (counts[entry.level] !== undefined) {
      counts[entry.level]++;
    }
  });
  console.log(chalk.bold("\n📊 Log Analysis"));
  console.log(chalk.gray("─".repeat(32)));
  console.log(`Total Lines:      ${chalk.bold(entries.length)}`);
  console.log(`${chalk.blue("Info:")}             ${counts.INFO}`);
  console.log(`${chalk.yellow("Warning:")}          ${counts.WARN}`);
  console.log(`${chalk.red("Error:")}            ${counts.ERROR}`);
  console.log(`${chalk.gray("Debug:")}            ${counts.DEBUG}`);
  console.log(chalk.gray("─".repeat(32)));
  console.log(chalk.dim(`Processing Time:  ${processingTime}ms`));

  if (malformed.length > 0) {
    console.log(
      chalk.yellow(`\n⚠️  ${malformed.length} line(s) could not be parsed`),
    );
  }

  const report = {
    file: filePath,
    totalLines: entries.length,
    counts,
    processingTimeMs: processingTime,
    malformedLines: malformed.length,
    generatedAt: new Date().toISOString(),
  };

  const reportsDir = "reports";
  await fs.mkdir(reportsDir, { recursive: true });
  await fs.writeFile(
    path.join(reportsDir, "report.json"),
    JSON.stringify(report, null, 2),
  );

  console.log(chalk.dim(`\nReport saved to reports/report.json`));

  /*   console.log(`\nTotal Lines: ${entries.length}`);
  console.log(`Info: ${counts.INFO}`);
  console.log(`Warning: ${counts.WARN}`);
  console.log(`Error: ${counts.ERROR}`);
  console.log(`Debug: ${counts.DEBUG}`);
  console.log(`Processing Time: ${processingTime}ms`);

  if (malformed.length > 0) {
    console.log(`\n(${malformed.length} line(s) could not be parsed)`);
  }
 */
}
