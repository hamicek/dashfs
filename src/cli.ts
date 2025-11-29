#!/usr/bin/env node

import { init } from "./commands/init.js";
import { scan } from "./commands/scan.js";
import { generate } from "./commands/generate/index.js";
import { serve } from "./commands/serve.js";
import { watch } from "./commands/watch.js";
import { ls } from "./commands/ls.js";
import { stop } from "./commands/stop.js";

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
  watch     Watch config and auto-regenerate on changes
  ls        List running projects
  stop      Stop the server

Usage:
  dashfs init          # Create new config in current directory
  dashfs scan          # Scan and suggest additions to config
  dashfs generate      # Generate HTML dashboard
  dashfs serve         # Start server in background
  dashfs serve -w      # Start with watch mode (auto-regenerate)
  dashfs serve -f      # Start in foreground (blocking)
  dashfs ls            # List running projects
  dashfs stop          # Stop the server
  dashfs watch         # Watch and auto-regenerate (no server)
  dashfs               # Same as 'dashfs generate'

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
  dashfs serve [options]

Starts a local HTTP server and opens dashboard in browser.
By default, runs in background (daemon mode).

Options:
  --watch, -w       Watch config and auto-regenerate on changes
  --foreground, -f  Run in foreground (blocking, for debugging)

Examples:
  dashfs serve           # Start server in background
  dashfs serve -w        # Background with watch mode
  dashfs serve -f        # Foreground mode (Ctrl+C to stop)
  dashfs serve -w -f     # Foreground with watch mode

Use 'dashfs ls' to see running projects.
Use 'dashfs stop' to stop the server.
`);
}

function printWatchHelp() {
  console.log(`
dashfs watch - Watch and auto-regenerate

Usage:
  dashfs watch

Watches project.config.json for changes and automatically
regenerates dashboard.html when the config is modified.

This is useful when editing the config file manually.
Press Ctrl+C to stop watching.
`);
}

function printLsHelp() {
  console.log(`
dashfs ls - List running projects

Usage:
  dashfs ls
  dashfs list

Shows the status of the DashFS server and all registered projects.
Displays URLs for quick access to each project dashboard.
`);
}

function printStopHelp() {
  console.log(`
dashfs stop - Stop server or unregister a project

Usage:
  dashfs stop [project] [options]

Without arguments, stops the entire server.
With a project name, unregisters just that project.

Options:
  --force, -f   Force kill the server (SIGKILL instead of SIGTERM)

Examples:
  dashfs stop                  # Stop entire server
  dashfs stop freelance        # Unregister project "freelance"
  dashfs stop personal-app     # Unregister by name
  dashfs stop --force          # Force kill server
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
      // Parse serve arguments: --watch and --foreground flags
      const serveArgs = args.slice(1);
      let watchMode = false;
      let foreground = false;

      for (const arg of serveArgs) {
        if (arg === "--watch" || arg === "-w") {
          watchMode = true;
        } else if (arg === "--foreground" || arg === "-f") {
          foreground = true;
        }
      }

      await serve(watchMode, foreground);
    }
  } else if (command === "watch") {
    if (wantsHelp) {
      printWatchHelp();
    } else {
      await watch();
    }
  } else if (command === "ls" || command === "list") {
    if (wantsHelp) {
      printLsHelp();
    } else {
      await ls();
    }
  } else if (command === "stop") {
    if (wantsHelp) {
      printStopHelp();
    } else {
      const stopArgs = args.slice(1);
      const force = stopArgs.includes("--force") || stopArgs.includes("-f");
      // First non-flag argument is project name
      const projectName = stopArgs.find(a => !a.startsWith("-"));
      await stop(projectName, force);
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
