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
