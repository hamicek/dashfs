#!/usr/bin/env node

import { init } from "./commands/init.js";
import { scan } from "./commands/scan.js";
import { generate } from "./commands/generate.js";
import { serve } from "./commands/serve.js";

const args = process.argv.slice(2);
const command = args[0];
const subArg = args[1];

function printHelp() {
  console.log(`
dashfs - Project dashboard generator

Commands:
  init      Create a minimal project.config.json
  scan      Scan folder structure and update config
  generate  Generate dashboard.html from config
  serve     Start local server and open dashboard in browser

Usage:
  dashfs init      # Create new config in current directory
  dashfs scan      # Scan and suggest additions to config
  dashfs generate  # Generate HTML dashboard
  dashfs serve     # Start server and open in browser
  dashfs           # Same as 'dashfs generate'

Options:
  --help, -h    Show this help
  --version     Show version

Run 'dashfs <command> --help' for more information on a command.
`);
}

function printInitHelp() {
  console.log(`
dashfs init - Create a new project config

Usage:
  dashfs init

Creates a minimal project.config.json in the current directory.
The project title is set to the folder name.

If config already exists, suggests using 'dashfs scan' instead.
`);
}

function printScanHelp() {
  console.log(`
dashfs scan - Scan folder and update config

Usage:
  dashfs scan

Scans the current directory for:
  - Git repositories in repos/, repositories/, src/, projects/
  - Documents (.pdf, .md, .txt, .docx) in docs/, documents/
  - Documents in root folder

Found items are added to project.config.json.
If config doesn't exist, creates a new one.
`);
}

function printGenerateHelp() {
  console.log(`
dashfs generate - Generate HTML dashboard

Usage:
  dashfs generate

Reads project.config.json and generates dashboard.html.
The dashboard is a static HTML file that can be opened in any browser.

Features:
  - Links to repos open in VS Code
  - Links to documents open directly
  - Support for Bear and Obsidian URLs
`);
}

function printServeHelp() {
  console.log(`
dashfs serve - Start local server

Usage:
  dashfs serve [port]

Starts a local HTTP server and opens dashboard in browser.
Default port is 3000.

Examples:
  dashfs serve        # Start on port 3000
  dashfs serve 8080   # Start on port 8080

This enables viewing Markdown files directly in the dashboard.
Press Ctrl+C to stop the server.
`);
}

async function main() {
  const wantsHelp = subArg === "--help" || subArg === "-h";

  if (command === "init") {
    if (wantsHelp) {
      printInitHelp();
    } else {
      await init();
    }
  } else if (command === "scan") {
    if (wantsHelp) {
      printScanHelp();
    } else {
      await scan();
    }
  } else if (command === "generate") {
    if (wantsHelp) {
      printGenerateHelp();
    } else {
      await generate();
    }
  } else if (command === "serve") {
    if (wantsHelp) {
      printServeHelp();
    } else {
      const port = subArg ? parseInt(subArg, 10) : 3000;
      await serve(port);
    }
  } else if (!command) {
    await generate();
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
