// Main generate command - re-exports from the generate folder

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";
import { ProjectConfig, CONFIG_FILE, OUTPUT_FILE } from "../../types.js";
import { getTheme } from "./themes/index.js";
import { getScripts } from "./scripts.js";
import { generateSectionsHtml, esc } from "./sections.js";

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

function generateHtml(cfg: ProjectConfig, projectRoot: string): string {
  const sectionsHtml = generateSectionsHtml(cfg, projectRoot);
  const theme = getTheme(cfg.theme);
  const scripts = getScripts();
  const bodyClass = theme.bodyClass ? ` class="${theme.bodyClass}"` : "";

  return `<!doctype html>
<html lang="cs">
<head>
  <meta charset="utf-8" />
  <title>${esc(cfg.title)}</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%232563eb'/><path d='M25 30h50M25 50h35M25 70h45' stroke='white' stroke-width='8' stroke-linecap='round'/></svg>">
  <style>${theme.css}</style>
</head>
<body${bodyClass}>
  <h1 class="editable" contenteditable="true" data-field="title">${esc(cfg.title)}</h1>
  <p class="description editable" contenteditable="true" data-field="description" data-placeholder="Add description...">${cfg.description ? esc(cfg.description) : ""}</p>

  <div class="grid" id="sectionsGrid">
    ${sectionsHtml}
  </div>

  <!-- MD Viewer Modal -->
  <div class="md-modal" id="mdModal">
    <div class="md-modal-content">
      <div class="md-modal-header">
        <h3 id="mdModalTitle">Dokument</h3>
        <button class="md-modal-close" id="mdModalClose">&times;</button>
      </div>
      <div class="md-modal-body">
        <div class="md-content" id="mdContent"></div>
      </div>
    </div>
  </div>

  <script>${scripts}</script>
  <div class="save-indicator" id="saveIndicator">Saved</div>
</body>
</html>`;
}
