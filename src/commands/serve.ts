import { createServer, request as httpRequest, IncomingMessage, ServerResponse } from "http";
import { readFileSync, writeFileSync, existsSync, statSync, watch as fsWatch } from "fs";
import { resolve, extname, basename } from "path";
import { exec } from "child_process";
import { CONFIG_FILE, OUTPUT_FILE, ProjectConfig, ThemeType } from "../types.js";
import { generate } from "./generate/index.js";
import { registerProject, unregisterProject, getRegistry, getProjectByName } from "../registry.js";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

const PORT = 3030;

// SSE clients for live reload, keyed by project name
const sseClients: Map<string, Array<{ res: ServerResponse }>> = new Map();

// File watchers for each project
const watchers: Map<string, ReturnType<typeof fsWatch>> = new Map();

// Reference to server for shutdown
let serverInstance: ReturnType<typeof createServer> | null = null;

function getProjectTitle(projectPath: string): string {
  const configPath = resolve(projectPath, CONFIG_FILE);
  if (existsSync(configPath)) {
    try {
      const raw = readFileSync(configPath, "utf-8");
      const cfg: ProjectConfig = JSON.parse(raw);
      return cfg.title || basename(projectPath);
    } catch {
      return basename(projectPath);
    }
  }
  return basename(projectPath);
}

function setupWatcher(projectName: string, projectPath: string): void {
  const configPath = resolve(projectPath, CONFIG_FILE);

  if (watchers.has(projectName)) {
    return; // Already watching
  }

  if (!existsSync(configPath)) {
    return;
  }

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  const watcher = fsWatch(configPath, async (eventType) => {
    if (eventType === "change") {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(async () => {
        console.log(`🔄 [${projectName}] Config changed, regenerating...`);
        try {
          // Generate in project directory
          const originalCwd = process.cwd();
          process.chdir(projectPath);
          await generate();
          process.chdir(originalCwd);

          console.log(`✅ [${projectName}] Dashboard updated.`);

          // Notify SSE clients for this project
          const clients = sseClients.get(projectName) || [];
          for (const client of clients) {
            client.res.write("data: reload\n\n");
          }
        } catch (err) {
          console.error(`❌ [${projectName}] Error: ${(err as Error).message}`);
        }
      }, 100);
    }
  });

  watchers.set(projectName, watcher);
}

function cleanupWatcher(projectName: string): void {
  const watcher = watchers.get(projectName);
  if (watcher) {
    watcher.close();
    watchers.delete(projectName);
  }
  sseClients.delete(projectName);
}

function shutdownIfEmpty(): void {
  const projects = getRegistry();
  if (projects.length === 0 && serverInstance) {
    console.log("\n📭 No projects registered, shutting down server...");
    for (const watcher of watchers.values()) {
      watcher.close();
    }
    serverInstance.close();
    process.exit(0);
  }
}

// Available themes list
const THEMES: ThemeType[] = ["default", "terminal", "notion", "glass", "paper", "dashboard", "nord", "brutalist", "sunset"];

function generateProjectSelector(currentProject: string, currentTheme: ThemeType = "default"): string {
  const projects = getRegistry();

  const projectOptions = projects
    .map((p) => `<option value="${p.name}" ${p.name === currentProject ? "selected" : ""}>${p.title}</option>`)
    .join("");

  const themeOptions = THEMES
    .map((t) => `<option value="${t}" ${t === currentTheme ? "selected" : ""}>${t}</option>`)
    .join("");

  return `
<div class="project-toolbar">
  ${projects.length > 1 ? `
  <select id="projectSelect" onchange="window.location.href='/' + this.value + '/'">
    ${projectOptions}
  </select>
  ` : ""}
  <select id="themeSelect" onchange="changeTheme(this.value)" title="Change theme">
    ${themeOptions}
  </select>
  <button id="closeProject" onclick="closeProject('${currentProject}')" title="Close this project">✕</button>
</div>
<style>
  .project-toolbar {
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 100;
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .project-toolbar select {
    font-family: inherit;
    font-size: 0.875rem;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid var(--card-border, #e5e7eb);
    background: var(--card-bg, #ffffff);
    color: var(--text, #111827);
    cursor: pointer;
    min-width: 100px;
  }
  .project-toolbar select:hover {
    border-color: var(--link-border-hover, #d1d5db);
  }
  .project-toolbar button {
    font-family: inherit;
    font-size: 1rem;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid var(--card-border, #e5e7eb);
    background: var(--card-bg, #ffffff);
    color: var(--text-muted, #6b7280);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
  }
  .project-toolbar button:hover {
    background: #ef4444;
    border-color: #ef4444;
    color: white;
  }
</style>
<script>
async function closeProject(projectName) {
  if (!confirm('Close this project dashboard?')) return;
  try {
    await fetch('/__api/unregister/' + projectName, { method: 'POST' });
    window.location.href = '/';
  } catch (e) {
    alert('Failed to close project');
  }
}

async function changeTheme(theme) {
  const projectName = window.location.pathname.split('/').filter(Boolean)[0];
  if (!projectName) return;
  try {
    // Get current config
    const res = await fetch('/__api/config/' + projectName);
    if (!res.ok) return;
    const config = await res.json();

    // Update theme
    config.theme = theme;

    // Save config
    await fetch('/__api/config/' + projectName, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });

    // Reload will happen automatically via live reload
  } catch (e) {
    console.error('Failed to change theme:', e);
  }
}
</script>
`;
}

function serveProject(
  req: IncomingMessage,
  res: ServerResponse,
  projectName: string,
  projectPath: string,
  urlPath: string,
  watchMode: boolean
): void {
  // SSE endpoint for live reload
  if (watchMode && urlPath === "/__live-reload") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });
    res.write("data: connected\n\n");

    if (!sseClients.has(projectName)) {
      sseClients.set(projectName, []);
    }
    sseClients.get(projectName)!.push({ res });

    req.on("close", () => {
      const clients = sseClients.get(projectName) || [];
      sseClients.set(projectName, clients.filter((c) => c.res !== res));
    });
    return;
  }

  // Default to dashboard.html
  if (urlPath === "/" || urlPath === "") {
    urlPath = "/" + OUTPUT_FILE;
  }

  // Resolve file path (prevent directory traversal)
  const filePath = resolve(projectPath, "." + urlPath);
  if (!filePath.startsWith(projectPath)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  // Check if file exists
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  // Get MIME type
  const ext = extname(filePath).toLowerCase();
  const mimeType = MIME_TYPES[ext] || "application/octet-stream";

  try {
    let content: Buffer | string = readFileSync(filePath);

    // Inject live reload script and project selector into HTML
    if (ext === ".html") {
      let htmlContent = content.toString();

      // Get current theme from config
      let currentTheme: ThemeType = "default";
      const configPath = resolve(projectPath, CONFIG_FILE);
      if (existsSync(configPath)) {
        try {
          const cfg: ProjectConfig = JSON.parse(readFileSync(configPath, "utf-8"));
          currentTheme = cfg.theme || "default";
        } catch { /* ignore */ }
      }

      // Add project toolbar (selector + close button + theme selector)
      const toolbar = generateProjectSelector(projectName, currentTheme);
      // Handle both <body> and <body class="...">
      htmlContent = htmlContent.replace(/<body([^>]*)>/, "<body$1>" + toolbar);

      // Add live reload script in watch mode
      if (watchMode) {
        const liveReloadScript = `
<script>
(function() {
  const es = new EventSource('/${projectName}/__live-reload');
  es.onmessage = function(e) {
    if (e.data === 'reload') {
      window.location.reload();
    }
  };
  es.onerror = function() {
    setTimeout(() => window.location.reload(), 1000);
  };
})();
</script>
`;
        htmlContent = htmlContent.replace("</body>", liveReloadScript + "</body>");
      }

      content = htmlContent;
    }

    res.writeHead(200, { "Content-Type": mimeType });
    res.end(content);
  } catch {
    res.writeHead(500);
    res.end("Internal server error");
  }
}

function generateIndexPage(): string {
  const projects = getRegistry();

  if (projects.length === 0) {
    return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>DashFS</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 40px; text-align: center; }
    h1 { color: #2563eb; }
  </style>
</head>
<body>
  <h1>DashFS</h1>
  <p>No projects registered yet.</p>
  <p>Run <code>dashfs serve -w</code> in a project directory to get started.</p>
</body>
</html>`;
  }

  const projectLinks = projects
    .map((p) => `<a href="/${p.name}/" class="project">${p.title}</a>`)
    .join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>DashFS - Projects</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%232563eb'/><path d='M25 30h50M25 50h35M25 70h45' stroke='white' stroke-width='8' stroke-linecap='round'/></svg>">
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 40px;
      background: #f5f5f7;
      margin: 0;
    }
    h1 { color: #111827; margin-bottom: 8px; }
    .subtitle { color: #6b7280; margin-bottom: 32px; }
    .projects {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
      max-width: 800px;
    }
    .project {
      display: block;
      padding: 20px;
      background: white;
      border-radius: 12px;
      text-decoration: none;
      color: #111827;
      font-weight: 500;
      border: 1px solid #e5e7eb;
      transition: all 0.15s ease;
    }
    .project:hover {
      border-color: #2563eb;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
    }
    @media (prefers-color-scheme: dark) {
      body { background: #111827; }
      h1 { color: #f9fafb; }
      .subtitle { color: #9ca3af; }
      .project { background: #1f2937; border-color: #374151; color: #f9fafb; }
      .project:hover { border-color: #3b82f6; }
    }
  </style>
</head>
<body>
  <h1>DashFS</h1>
  <p class="subtitle">${projects.length} project${projects.length !== 1 ? "s" : ""} registered</p>
  <div class="projects">
    ${projectLinks}
  </div>
</body>
</html>`;
}

async function startMasterServer(): Promise<void> {
  serverInstance = createServer((req, res) => {
    const url = req.url || "/";

    // Index page - list all projects
    if (url === "/" || url === "/index.html") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(generateIndexPage());
      return;
    }

    // API endpoint to get projects list
    if (url === "/__api/projects") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(getRegistry()));
      return;
    }

    // API endpoint to unregister a project
    if (url.startsWith("/__api/unregister/") && req.method === "POST") {
      const projectName = url.replace("/__api/unregister/", "");
      const project = getProjectByName(projectName);
      if (project) {
        console.log(`📤 Unregistering project: ${project.title}`);
        cleanupWatcher(projectName);
        unregisterProject(project.path);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
        // Check if we should shutdown
        setTimeout(shutdownIfEmpty, 100);
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Project not found" }));
      }
      return;
    }

    // API endpoint to get project config
    const configGetMatch = url.match(/^\/__api\/config\/([^/]+)$/);
    if (configGetMatch && req.method === "GET") {
      const projectName = configGetMatch[1];
      const project = getProjectByName(projectName);
      if (project) {
        const configPath = resolve(project.path, CONFIG_FILE);
        if (existsSync(configPath)) {
          try {
            const config = readFileSync(configPath, "utf-8");
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(config);
          } catch {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Failed to read config" }));
          }
        } else {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Config not found" }));
        }
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Project not found" }));
      }
      return;
    }

    // API endpoint to update project config
    if (configGetMatch && req.method === "POST") {
      const projectName = configGetMatch[1];
      const project = getProjectByName(projectName);
      if (project) {
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            // Validate JSON
            const newConfig = JSON.parse(body);
            const configPath = resolve(project.path, CONFIG_FILE);
            writeFileSync(configPath, JSON.stringify(newConfig, null, 2), "utf-8");
            console.log(`💾 [${projectName}] Config updated`);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true }));
          } catch (err) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Invalid JSON" }));
          }
        });
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Project not found" }));
      }
      return;
    }

    // Parse project name from URL: /project-name/...
    const match = url.match(/^\/([^/]+)(\/.*)?$/);
    if (!match) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const projectName = match[1];
    const urlPath = match[2] || "/";

    const project = getProjectByName(projectName);
    if (!project) {
      res.writeHead(404);
      res.end(`Project "${projectName}" not found`);
      return;
    }

    // Setup watcher if in watch mode
    if (project.watchMode) {
      setupWatcher(projectName, project.path);
    }

    serveProject(req, res, projectName, project.path, urlPath, project.watchMode);
  });

  serverInstance.listen(PORT, () => {
    console.log(`🚀 DashFS master server running at http://localhost:${PORT}`);
    console.log(`   Press Ctrl+C to stop\n`);
  });

  // Handle shutdown
  process.on("SIGINT", () => {
    console.log("\n👋 Server stopped");
    // Close all watchers
    for (const watcher of watchers.values()) {
      watcher.close();
    }
    serverInstance?.close();
    process.exit(0);
  });
}

function isServerRunning(): Promise<boolean> {
  return new Promise((resolve) => {
    const req = httpRequest(
      { host: "localhost", port: PORT, path: "/__api/projects", timeout: 1000 },
      () => resolve(true)
    );
    req.on("error", () => resolve(false));
    req.end();
  });
}

export async function serve(port: number = PORT, watchMode: boolean = false) {
  const cwd = process.cwd();
  const configPath = resolve(cwd, CONFIG_FILE);

  // Validate project
  if (!existsSync(configPath)) {
    console.error(`❌ ${CONFIG_FILE} not found.`);
    console.error(`   Run 'dashfs init' or 'dashfs scan' first.`);
    process.exit(1);
  }

  // Always regenerate dashboard to ensure it's up to date
  await generate();

  // Get project name from folder
  const projectName = basename(cwd).toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const projectTitle = getProjectTitle(cwd);

  // Register this project
  registerProject({
    name: projectName,
    path: cwd,
    title: projectTitle,
    watchMode,
  });

  console.log(`📁 Registered project: ${projectTitle}`);

  // Check if master server is already running
  const serverRunning = await isServerRunning();

  if (serverRunning) {
    // Server already running, just open browser to this project
    const url = `http://localhost:${PORT}/${projectName}/`;
    console.log(`🔗 Opening ${url}`);

    const openCommand = process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "start"
        : "xdg-open";
    exec(`${openCommand} ${url}`);

    if (watchMode) {
      console.log(`👀 Watch mode enabled (master server handles watching)`);
    }
    console.log(`✅ Project registered. Use the dashboard to close it.\n`);
    // Exit immediately - master server handles everything
    process.exit(0);
  } else {
    // Start master server
    const url = `http://localhost:${PORT}/${projectName}/`;

    await startMasterServer();

    // Open browser
    const openCommand = process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "start"
        : "xdg-open";
    exec(`${openCommand} ${url}`);

    if (watchMode) {
      console.log(`👀 Watching for config changes...`);
    }
  }
}
