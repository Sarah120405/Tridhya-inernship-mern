// lib/commands/watch.js
import fs from "fs";
import { EventEmitter } from "events";
import { parseLine } from "../parseLog.js";
import chalk from "chalk";

export function watchCommand(filePath) {
  if (!filePath) {
    console.error("Usage: node bin/cli.js watch <file>");
    process.exit(1);
  }

  const logEvents = new EventEmitter();
  let linesProcessed = 0;

  logEvents.on("line-processed", (count) => {
    console.log(chalk.dim(`Lines processed: ${count}`));
  });

  logEvents.on("ERROR", (entry) => {
    console.log(chalk.red(`🔴 New ERROR detected`));
    console.log(chalk.red(entry.message));
  });

  logEvents.on("WARN", (entry) => {
    console.log(chalk.yellow(`🟡 New WARN detected`));
    console.log(chalk.yellow(entry.message));
  });

  logEvents.on("INFO", (entry) => {
    console.log(chalk.blue(`🔵 New INFO detected`));
    console.log(entry.message);
  });

  logEvents.on("DEBUG", (entry) => {
    console.log(chalk.gray(`⚪ New DEBUG detected`));
    console.log(chalk.gray(entry.message));
  });

  logEvents.on("malformed", (line) => {
    console.log(chalk.yellow(`⚠️  Unparseable line: ${line}`));
  });

  let lastSize = fs.statSync(filePath).size;
  let isProcessing = false; // NEW

  console.log(`Watching ${filePath}...\n`);

  fs.watch(filePath, (eventType) => {
    if (eventType !== "change") return;
    if (isProcessing) return; // NEW — ignore rapid-fire events while a read is already in progress

    const stats = fs.statSync(filePath);
    const newSize = stats.size;

    if (newSize <= lastSize) {
      lastSize = newSize;
      return;
    }

    isProcessing = true;

    const stream = fs.createReadStream(filePath, {
      start: lastSize,
      end: newSize,
      encoding: "utf-8",
    });

    let newContent = "";
    stream.on("data", (chunk) => {
      newContent += chunk;
    });

    stream.on("end", () => {
      const newLines = newContent
        .split(/\r?\n/)
        .filter((line) => line.trim() !== "");

      newLines.forEach((line) => {
        const parsed = parseLine(line);
        if (parsed) {
          linesProcessed++;
          logEvents.emit("line-processed", linesProcessed);
          logEvents.emit(parsed.level, parsed);
        } else {
          logEvents.emit("malformed", line);
        }
      });

      lastSize = newSize;
      isProcessing = false;
    });
  });
}
