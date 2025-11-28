import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import { ProjectConfig, CONFIG_FILE, OUTPUT_FILE } from "../types.js";

export async function generate() {
  const cwd = process.cwd();
  const configPath = resolve(cwd, CONFIG_FILE);

  if (!existsSync(configPath)) {
    console.error(`❌ ${CONFIG_FILE} not found.`);
    console.error(`   Run 'dashfs init' or 'dashfs scan' first.`);
    process.exit(1);
  }

  const raw = readFileSync(configPath, "utf-8");
  const cfg: ProjectConfig = JSON.parse(raw);

  const html = generateHtml(cfg, cwd);
  writeFileSync(resolve(cwd, OUTPUT_FILE), html, "utf-8");
  console.log(`✅ Generated: ${OUTPUT_FILE}`);
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function generateHtml(cfg: ProjectConfig, projectRoot: string): string {
  // Documents section
  const docsItems = (cfg.docs ?? [])
    .map((d) => `<a href="${esc(d.path)}">${esc(d.label)}</a>`)
    .join("");

  const contractItem = cfg.contract
    ? `<a href="${esc(cfg.contract)}">Smlouva (PDF)</a>`
    : "";

  const docsBlock = contractItem + docsItems || "<em>Žádné dokumenty</em>";

  // Repos section
  const reposBlock = (cfg.repos ?? [])
    .map((r) => {
      const absPath = resolve(projectRoot, r.path);
      const vscodeUrl = `vscode://file/${absPath}`;
      return `<a href="${esc(vscodeUrl)}">${esc(r.label)}</a>`;
    })
    .join("") || "<em>Žádné repozitáře</em>";

  // External links section
  const linksBlock = (cfg.links ?? [])
    .map(
      (l) => `<a href="${esc(l.url)}" target="_blank" rel="noreferrer">${esc(l.label)}</a>`
    )
    .join("") || "<em>Žádné odkazy</em>";

  // Notes apps section
  const notesApps: string[] = [];
  if (cfg.bearNoteUrl) {
    notesApps.push(`<a href="${esc(cfg.bearNoteUrl)}">Bear</a>`);
  }
  if (cfg.obsidianUrl) {
    notesApps.push(`<a href="${esc(cfg.obsidianUrl)}">Obsidian</a>`);
  }
  const notesAppsBlock = notesApps.join("") || "<em>Žádné propojené aplikace</em>";

  // Quick notes section
  const quickNotesBlock = (cfg.quickNotes ?? []).length > 0
    ? `<ul>${(cfg.quickNotes ?? []).map((n) => `<li>${esc(n)}</li>`).join("")}</ul>`
    : "<em>Žádné poznámky</em>";

  return `<!doctype html>
<html lang="cs">
<head>
  <meta charset="utf-8" />
  <title>${esc(cfg.title)}</title>
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      margin: 0;
      padding: 24px;
      background: #f5f5f7;
      color: #111827;
      line-height: 1.5;
    }
    h1 {
      margin-top: 0;
      margin-bottom: 8px;
      font-size: 1.75rem;
    }
    p.description {
      margin-top: 0;
      margin-bottom: 24px;
      color: #4b5563;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }
    .card {
      background: #ffffff;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      border: 1px solid #e5e7eb;
    }
    .card h2 {
      margin-top: 0;
      margin-bottom: 12px;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
    }
    .links {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .links a {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
      font-size: 0.875rem;
      padding: 6px 12px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      background: #f9fafb;
      color: #111827;
      transition: all 0.15s ease;
    }
    .links a:hover {
      background: #e5e7eb;
      border-color: #d1d5db;
    }
    ul {
      padding-left: 20px;
      margin: 0;
    }
    li {
      margin-bottom: 4px;
    }
    em {
      color: #9ca3af;
    }
  </style>
</head>
<body>
  <h1>${esc(cfg.title)}</h1>
  ${cfg.description ? `<p class="description">${esc(cfg.description)}</p>` : ""}

  <div class="grid">
    <section class="card">
      <h2>Dokumenty</h2>
      <div class="links">
        ${docsBlock}
      </div>
    </section>

    <section class="card">
      <h2>Repozitáře</h2>
      <div class="links">
        ${reposBlock}
      </div>
    </section>

    <section class="card">
      <h2>Externí odkazy</h2>
      <div class="links">
        ${linksBlock}
      </div>
    </section>

    <section class="card">
      <h2>Poznámkové aplikace</h2>
      <div class="links">
        ${notesAppsBlock}
      </div>
    </section>

    <section class="card">
      <h2>Rychlé poznámky</h2>
      ${quickNotesBlock}
    </section>
  </div>
</body>
</html>`;
}
