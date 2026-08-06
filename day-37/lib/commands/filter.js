import fs from "fs";
import path from "path";
import { parseLogFile } from "../parseLog.js";

export function filterCommand(level, filePath) {
  if (!level || !filePath) {
    console.error("Usage: node bin/cli.js filter <LEVEL> <file>");
    process.exit(1);
  }

  const { entries } = parseLogFile(filePath);
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
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir);
  }

  const outputPath = path.join(reportsDir, "errors.log");
  fs.writeFileSync(outputPath, outputLines.join("\n") + "\n");
  console.log(`\nSaved to ${outputPath}`);
}
