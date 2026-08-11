import fs from "fs/promises";

const VALID_COMMANDS = ["analyze", "summary", "filter", "watch"];
const VALID_LEVELS = ["INFO", "WARN", "ERROR", "DEBUG"];

export function isValidCommand(command) {
  return VALID_COMMANDS.includes(command);
}

export function isValidLevel(level) {
  return VALID_LEVELS.includes(level?.toUpperCase());
}

export async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
