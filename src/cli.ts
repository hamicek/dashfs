#!/usr/bin/env node

import { init } from "./commands/init.js";
import { scan } from "./commands/scan.js";
import { generate } from "./commands/generate.js";

const args = process.argv.slice(2);
const command = args[0];

function printHelp() {
  console.log(`
dashfs - Project dashboard generator

Commands:
  init      Create a minimal project.config.json
  scan      Scan folder structure and update config
  generate  Generate dashboard.html from config

Usage:
  dashfs init      # Create new config in current directory
  dashfs scan      # Scan and suggest additions to config
  dashfs generate  # Generate HTML dashboard
  dashfs           # Same as 'dashfs generate'

Options:
  --help, -h    Show this help
  --version     Show version
`);
}

async function main() {
  if (!command || command === "generate") {
    await generate();
  } else if (command === "init") {
    await init();
  } else if (command === "scan") {
    await scan();
  } else if (command === "--help" || command === "-h") {
    printHelp();
  } else if (command === "--version") {
    console.log("dashfs v0.1.0");
  } else {
    console.error(`Unknown command: ${command}`);
    printHelp();
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
