import { createServer } from "http";
import { readFileSync, existsSync, statSync } from "fs";
import { resolve, extname } from "path";
import { exec } from "child_process";
import { CONFIG_FILE, OUTPUT_FILE } from "../types.js";

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

export async function serve(port: number = 3030) {
  const cwd = process.cwd();
  const dashboardPath = resolve(cwd, OUTPUT_FILE);

  if (!existsSync(dashboardPath)) {
    console.error(`❌ ${OUTPUT_FILE} not found.`);
    console.error(`   Run 'dashfs generate' first.`);
    process.exit(1);
  }

  const server = createServer((req, res) => {
    let url = req.url || "/";

    // Default to dashboard.html
    if (url === "/") {
      url = "/" + OUTPUT_FILE;
    }

    // Remove query string
    url = url.split("?")[0];

    // Resolve file path (prevent directory traversal)
    const filePath = resolve(cwd, "." + url);
    if (!filePath.startsWith(cwd)) {
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
      const content = readFileSync(filePath);
      res.writeHead(200, { "Content-Type": mimeType });
      res.end(content);
    } catch {
      res.writeHead(500);
      res.end("Internal server error");
    }
  });

  server.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`🚀 Dashboard server running at ${url}`);
    console.log(`   Press Ctrl+C to stop\n`);

    // Open in default browser
    const openCommand = process.platform === "darwin"
      ? "open"
      : process.platform === "win32"
        ? "start"
        : "xdg-open";

    exec(`${openCommand} ${url}`);
  });

  // Handle shutdown
  process.on("SIGINT", () => {
    console.log("\n👋 Server stopped");
    server.close();
    process.exit(0);
  });
}
