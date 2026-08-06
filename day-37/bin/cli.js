#!/usr/bin/env node
import { analyzeCommand } from "../lib/commands/analyze.js";
import { filterCommand } from "../lib/commands/filter.js";
import { summaryCommand } from "../lib/commands/summary.js";

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case "analyze":
    analyzeCommand(args[1]);
    break;
  case "filter":
    filterCommand(args[1], args[2]);
    break;
  case "watch":
    console.log("`watch` requires streams — coming in a follow-up session.");
    break;
  case "summary":
    summaryCommand(args[1]);
    break;
  default:
    console.error(
      "Usage: node bin/cli.js <analyze|filter|watch> <file> [options]",
    );
    process.exit(1);
}
