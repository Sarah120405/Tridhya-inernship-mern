import { parseLogFile } from "../parseLog.js";

export function analyzeCommand(filePath) {
  if (!filePath) {
    console.error("Usage: node bin/cli.js analyze <file>");
    process.exit(1);
  }

  const startTime = Date.now();
  const { entries, malformed } = parseLogFile(filePath);
  const processingTime = Date.now() - startTime;

  const counts = { INFO: 0, WARN: 0, ERROR: 0, DEBUG: 0 };
  entries.forEach((entry) => {
    if (counts[entry.level] !== undefined) {
      counts[entry.level]++;
    }
  });

  console.log(`\nTotal Lines: ${entries.length}`);
  console.log(`Info: ${counts.INFO}`);
  console.log(`Warning: ${counts.WARN}`);
  console.log(`Error: ${counts.ERROR}`);
  console.log(`Debug: ${counts.DEBUG}`);
  console.log(`Processing Time: ${processingTime}ms`);

  if (malformed.length > 0) {
    console.log(`\n(${malformed.length} line(s) could not be parsed)`);
  }
}
