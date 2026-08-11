import fs from "fs/promises";
import path from "path";
import { parseLogFile } from "../parseLog.js";
import { isValidLevel } from "../validate.js";

export async function filterCommand(level, filePath) {
  if (!level || !filePath) {
    console.error("Usage: node bin/cli.js filter <LEVEL> <file>");
    process.exit(1);
  }

  if (!isValidLevel(level)) {
    console.error(
      `Invalid level: "${level}". Must be one of INFO, WARN, ERROR, DEBUG.`,
    );
    process.exit(1);
  }
  const { entries } = await parseLogFile(filePath);
  const filtered = entries.filter(
    (entry) => entry.level === level.toUpperCase(),
  );

  if (filtered.length === 0) {
    console.log(`No ${level} entries found.`);
    return;
  }

  const outputLines = filtered.map(
    (entry) => `[${entry.level}] ${entry.message}`,
  );
  outputLines.forEach((line) => console.log(line));

  const reportsDir = "reports";
  await fs.mkdir(reportsDir, { recursive: true });

  const outputPath = path.join(reportsDir, `${level.toUpperCase()}.log`);
  await fs.writeFile(outputPath, outputLines.join("\n") + "\n");
  console.log(`\nSaved to ${outputPath}`);
}
