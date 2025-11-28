# DashFS Examples

This folder contains example projects to help you get started with DashFS.

## Examples

### 1. Freelance Project (`freelance-project/`)
A typical freelance/client project with:
- Contract and documentation PDFs
- Git repository for code
- Meeting notes and TODO list
- External links (Figma, staging)
- Quick notes for key info

**Try it:**
```bash
cd freelance-project
dashfs generate
open dashboard.html
```

### 2. Personal App (`personal-app/`)
A personal side project with:
- Single repository
- Ideas and architecture notes
- Links to GitHub and deployment

**Try it:**
```bash
cd personal-app
dashfs generate
open dashboard.html
```

### 3. Research Project (`research-project/`)
An academic research project with:
- Literature and proposal PDFs
- Reading notes
- Research links (Scholar, arXiv)
- Obsidian integration

**Try it:**
```bash
cd research-project
dashfs generate
open dashboard.html
```

## Creating Your Own

1. Create a new folder for your project
2. Run `dashfs init` to create a config
3. Run `dashfs scan` to auto-detect files
4. Edit `project.config.json` as needed
5. Run `dashfs generate` to create your dashboard
