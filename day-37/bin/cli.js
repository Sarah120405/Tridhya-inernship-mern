#!/usr/bin/env node
import { analyzeCommand } from "../lib/commands/analyze.js";
import { filterCommand } from "../lib/commands/filter.js";
import { summaryCommand } from "../lib/commands/summary.js";
import { watchCommand } from "../lib/commands/watch.js";

const args = process.argv.slice(2);
const HELP_TEXT = `
Log Analyzer CLI

Usage:
  node bin/cli.js <command> <file> [options]

Commands:
  analyze <file>              Show total lines and per-level counts
  summary <file>               Show error/warning summary and longest/shortest logs
  filter <LEVEL> <file>         Show and save entries matching a specific level
  watch <file>                  Watch a file for new entries in real time

Options:
  --help                        Show this help message

Examples:
  node bin/cli.js analyze sample-logs/server.log
  node bin/cli.js filter ERROR sample-logs/server.log
`;

if (args.includes("--help") || args.length === 0) {
  console.log(HELP_TEXT);
  process.exit(0);
}

const command = args[0];

const commands = {
  analyze: () => analyzeCommand(args[1]),
  summary: () => summaryCommand(args[1]),
  filter: () => filterCommand(args[1], args[2]),
  watch: () => watchCommand(args[1]),
};

async function main() {
  const handler = commands[command];

  if (!handler) {
    console.error(`Unknown command: "${command || "(none)"}"`);
    console.error(
      "Usage: node bin/cli.js <analyze|summary|filter|watch> <file> [options]",
    );
    process.exit(1);
  }

  try {
    await handler();
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error(`Error: File not found — ${err.path}`);
    } else if (err.code === "EACCES") {
      console.error(`Error: Permission denied reading ${err.path}`);
    } else {
      console.error(`Unexpected error: ${err}`);
    }
    process.exit(1);
  }
}

main();
