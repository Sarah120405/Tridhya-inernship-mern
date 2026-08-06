import fs from "fs";

export function parseLogFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split(/\r?\n/).filter((line) => line.trim() !== "");
  const entries = [];
  const malformed = [];

  const logPattern = /^(\S+ \S+) \[(\w+)\] (.+)$/;

  for (const line of lines) {
    const match = line.match(logPattern);
    if (match) {
      const [, timestamp, level, message] = match;
      entries.push({ timestamp, level, message });
    } else {
      malformed.push(line);
    }
  }

  return { entries, malformed };
}
