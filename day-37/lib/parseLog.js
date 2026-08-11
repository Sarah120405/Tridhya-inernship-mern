// lib/parseLog.js
import fs from "fs";
import readline from "readline";

const logPattern = /^(\S+ \S+) \[(\w+)\] (.+)$/;

export function parseLine(line) {
  const match = line.match(logPattern);
  if (!match) return null;

  const [, timestamp, level, message] = match;
  return { timestamp, level, message };
}

export function parseLogFile(filePath) {
  return new Promise((resolve, reject) => {
    const entries = [];
    const malformed = [];

    const stream = fs.createReadStream(filePath, "utf-8");
    const rl = readline.createInterface({ input: stream });

    rl.on("line", (line) => {
      if (line.trim() === "") return;
      const parsed = parseLine(line);
      if (parsed) entries.push(parsed);
      else malformed.push(line);
    });

    rl.on("close", () => {
      resolve({ entries, malformed });
    });

    rl.on("error", (err) => {
      reject(err);
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
}
