# DashFS

Zero-install project dashboard generator. Create a visual homepage for your filesystem projects.

## What is DashFS?

DashFS generates a static HTML dashboard from your project folder structure. No server, no runtime, no dependencies in the output – just a single HTML file you can open in any browser.

Perfect for:
- Freelancers managing multiple client projects
- Developers with complex project structures (repos, docs, designs, notes)
- Anyone who wants a visual "project homepage"

## Features

- **Zero-install output** – Generated dashboard is pure HTML, works offline
- **Auto-detection** – Scans your folder structure and suggests items
- **VS Code integration** – Repository links open directly in VS Code
- **Markdown viewer** – View .md files directly in the dashboard with syntax highlighting
- **App URL schemes** – Support for Bear, Obsidian, and other macOS apps
- **Dark mode** – Automatic theme based on system preference
- **Live reload** – Auto-refresh dashboard when config changes (`--watch` mode)
- **Multi-project server** – Single server handles multiple projects on one port
- **No vendor lock-in** – Your data stays in JSON, dashboard is just HTML

## Installation

```bash
npm install -g dashfs
```

Or use with npx:

```bash
npx dashfs
```

## Quick Start

```bash
# Navigate to your project folder
cd ~/Projects/my-project

# Scan folder and create config
dashfs scan

# Start server with live reload
dashfs serve -w
```

Or without server:

```bash
# Generate dashboard
dashfs generate

# Open dashboard.html in your browser
open dashboard.html
```

## Commands

### `dashfs init`

Creates a minimal `project.config.json` with your folder name as title.

### `dashfs scan`

Scans your folder structure and adds found items to config:
- Git repositories in `repos/`, `src/`, `projects/`
- Documents (.pdf, .docx, etc.) in `docs/`, `documents/`
- Notes (.md, .txt) in `notes/` or root
- Images in `design/`, `assets/`, `images/`

### `dashfs generate`

Generates `dashboard.html` from your config.

### `dashfs serve`

Starts a local server and opens dashboard in browser. By default runs in background (daemon mode).

```bash
dashfs serve           # Start server in background
dashfs serve -w        # Start with watch mode (auto-regenerate on config changes)
dashfs serve --watch   # Same as -w
dashfs serve -f        # Run in foreground (blocking, for debugging)
dashfs serve --foreground  # Same as -f
dashfs serve -w -f     # Watch mode in foreground
```

**Multi-project support:** Run `dashfs serve -w` in multiple project directories. All projects share a single server on port 3030 and can be switched via dropdown in the dashboard.

### `dashfs ls`

Lists running server and registered projects.

```bash
dashfs ls              # Show server status and all projects
dashfs list            # Same as ls
```

### `dashfs stop`

Stops the server or unregisters a specific project.

```bash
dashfs stop            # Stop entire server
dashfs stop <project>  # Unregister specific project (partial match supported)
dashfs stop --force    # Force kill server (SIGKILL)
dashfs stop -f         # Same as --force
```

### `dashfs watch`

Watches `project.config.json` and regenerates dashboard on changes (without server).

### `dashfs --help`

Shows help. Use `dashfs <command> --help` for command-specific help.

## Configuration

The `project.config.json` file supports these fields:

```json
{
  "title": "Project Name",
  "description": "Short project description",
  "repos": [
    { "label": "Backend", "path": "repos/backend" }
  ],
  "docs": [
    { "label": "Contract", "path": "docs/contract.pdf" }
  ],
  "notes": [
    { "label": "Meeting notes", "path": "notes/meeting.md" }
  ],
  "images": [
    { "label": "Logo", "path": "design/logo.png" }
  ],
  "links": [
    { "label": "Staging", "url": "https://staging.example.com" }
  ],
  "bearNoteUrl": "bear://x-callback-url/open-note?id=...",
  "obsidianUrl": "obsidian://open?vault=...",
  "quickNotes": [
    "Remember to update dependencies",
    "Client meeting on Friday"
  ]
}
```

## Recommended Project Structure

```
my-project/
├── repos/           # Git repositories
│   ├── backend/
│   └── frontend/
├── docs/            # Documents (PDFs, contracts)
├── notes/           # Markdown notes
├── design/          # Images, designs
├── project.config.json
└── dashboard.html   # Generated dashboard
```

## Server Architecture

DashFS uses a daemon server architecture for multi-project support:

- **Background mode** – Server runs as daemon, doesn't block terminal
- **Single port (3030)** – All projects share one server
- **URL routing** – Each project accessible at `http://localhost:3030/project-name/`
- **Project selector** – Switch between projects via dropdown
- **Close button** – Unregister projects from dashboard
- **Auto-shutdown** – Server stops when last project is closed
- **PID management** – Server PID stored in `~/.dashfs/server.pid`

```bash
# Typical workflow
cd ~/project-a && dashfs serve -w   # Starts server in background
cd ~/project-b && dashfs serve -w   # Registers project, exits immediately
cd ~/project-c && dashfs serve -w   # Registers project, exits immediately

dashfs ls                            # See all running projects
dashfs stop project-b                # Unregister one project
dashfs stop                          # Stop entire server
```

## Why DashFS?

A project is more than just code. It's:
- Multiple repositories
- Contracts and specifications
- Design files and images
- Meeting notes
- Staging/production URLs
- Quick reminders and TODOs

DashFS brings everything together on one visual page – a "digital pinboard" for your project.

## License

MIT
