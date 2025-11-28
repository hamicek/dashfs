import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, extname } from "path";
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

  // Notes section (local markdown/text files)
  const notesBlock = (cfg.notes ?? [])
    .map((n) => {
      const ext = extname(n.path).toLowerCase();
      if (ext === ".md") {
        return `<a href="#" class="md-link" data-path="${esc(n.path)}">${esc(n.label)}</a>`;
      }
      return `<a href="${esc(n.path)}">${esc(n.label)}</a>`;
    })
    .join("") || "<em>Žádné poznámky</em>";

  // Images section
  const imagesBlock = (cfg.images ?? [])
    .map((i) => `<a href="${esc(i.path)}" target="_blank">${esc(i.label)}</a>`)
    .join("") || "<em>Žádné obrázky</em>";

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
      cursor: pointer;
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

    /* MD Viewer Modal */
    .md-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1000;
      justify-content: center;
      align-items: center;
      padding: 24px;
    }
    .md-modal.active {
      display: flex;
    }
    .md-modal-content {
      background: #ffffff;
      border-radius: 16px;
      max-width: 800px;
      width: 100%;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    .md-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #e5e7eb;
    }
    .md-modal-header h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
    }
    .md-modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #6b7280;
      padding: 4px 8px;
      border-radius: 6px;
    }
    .md-modal-close:hover {
      background: #f3f4f6;
      color: #111827;
    }
    .md-modal-body {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }

    /* Markdown Styles */
    .md-content {
      line-height: 1.7;
    }
    .md-content h1, .md-content h2, .md-content h3, .md-content h4 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: 600;
      line-height: 1.3;
    }
    .md-content h1 { font-size: 1.75rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.3em; }
    .md-content h2 { font-size: 1.5rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.3em; }
    .md-content h3 { font-size: 1.25rem; }
    .md-content h4 { font-size: 1rem; }
    .md-content p { margin: 1em 0; }
    .md-content ul, .md-content ol { margin: 1em 0; padding-left: 2em; }
    .md-content li { margin: 0.25em 0; }
    .md-content code {
      background: #f3f4f6;
      padding: 0.2em 0.4em;
      border-radius: 4px;
      font-size: 0.9em;
      font-family: ui-monospace, "SF Mono", Menlo, Monaco, monospace;
    }
    .md-content pre {
      background: #1f2937;
      color: #f9fafb;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1em 0;
    }
    .md-content pre code {
      background: none;
      padding: 0;
      color: inherit;
    }
    .md-content blockquote {
      border-left: 4px solid #e5e7eb;
      margin: 1em 0;
      padding-left: 1em;
      color: #6b7280;
    }
    .md-content a {
      color: #2563eb;
      text-decoration: none;
    }
    .md-content a:hover {
      text-decoration: underline;
    }
    .md-content hr {
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 2em 0;
    }
    .md-content img {
      max-width: 100%;
      border-radius: 8px;
    }
    .md-content table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    .md-content th, .md-content td {
      border: 1px solid #e5e7eb;
      padding: 8px 12px;
      text-align: left;
    }
    .md-content th {
      background: #f9fafb;
      font-weight: 600;
    }

    /* Syntax highlighting */
    .md-content .hljs-keyword { color: #c678dd; }
    .md-content .hljs-string { color: #98c379; }
    .md-content .hljs-number { color: #d19a66; }
    .md-content .hljs-comment { color: #5c6370; font-style: italic; }
    .md-content .hljs-function { color: #61afef; }
    .md-content .hljs-class { color: #e5c07b; }
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
      <h2>Poznámky</h2>
      <div class="links">
        ${notesBlock}
      </div>
    </section>

    <section class="card">
      <h2>Design / Obrázky</h2>
      <div class="links">
        ${imagesBlock}
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

  <script>
    // Simple Markdown parser
    function parseMarkdown(md) {
      let html = md
        // Escape HTML
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        // Code blocks
        .replace(/\`\`\`(\\w*)\\n([\\s\\S]*?)\`\`\`/g, '<pre><code class="language-$1">$2</code></pre>')
        // Inline code
        .replace(/\`([^\`]+)\`/g, '<code>$1</code>')
        // Headers
        .replace(/^#### (.*)$/gm, '<h4>$1</h4>')
        .replace(/^### (.*)$/gm, '<h3>$1</h3>')
        .replace(/^## (.*)$/gm, '<h2>$1</h2>')
        .replace(/^# (.*)$/gm, '<h1>$1</h1>')
        // Bold and italic
        .replace(/\\*\\*\\*(.+?)\\*\\*\\*/g, '<strong><em>$1</em></strong>')
        .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
        .replace(/\\*(.+?)\\*/g, '<em>$1</em>')
        // Links
        .replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '<a href="$2" target="_blank">$1</a>')
        // Images
        .replace(/!\\[([^\\]]*?)\\]\\(([^)]+)\\)/g, '<img src="$2" alt="$1">')
        // Blockquotes
        .replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>')
        // Horizontal rule
        .replace(/^---$/gm, '<hr>')
        .replace(/^\\*\\*\\*$/gm, '<hr>')
        // Unordered lists
        .replace(/^[\\*\\-] (.*)$/gm, '<li>$1</li>')
        // Ordered lists
        .replace(/^\\d+\\. (.*)$/gm, '<li>$1</li>')
        // Paragraphs
        .replace(/\\n\\n/g, '</p><p>')
        // Line breaks
        .replace(/\\n/g, '<br>');

      // Wrap in paragraph
      html = '<p>' + html + '</p>';

      // Fix list wrapping
      html = html.replace(/(<li>.*<\\/li>)/g, '<ul>$1</ul>');
      html = html.replace(/<\\/ul><ul>/g, '');

      // Fix empty paragraphs
      html = html.replace(/<p><\\/p>/g, '');
      html = html.replace(/<p>(<h[1-4]>)/g, '$1');
      html = html.replace(/(<\\/h[1-4]>)<\\/p>/g, '$1');
      html = html.replace(/<p>(<pre>)/g, '$1');
      html = html.replace(/(<\\/pre>)<\\/p>/g, '$1');
      html = html.replace(/<p>(<ul>)/g, '$1');
      html = html.replace(/(<\\/ul>)<\\/p>/g, '$1');
      html = html.replace(/<p>(<hr>)<\\/p>/g, '$1');
      html = html.replace(/<p>(<blockquote>)/g, '$1');
      html = html.replace(/(<\\/blockquote>)<\\/p>/g, '$1');

      return html;
    }

    // Modal functionality
    const modal = document.getElementById('mdModal');
    const modalTitle = document.getElementById('mdModalTitle');
    const modalContent = document.getElementById('mdContent');
    const modalClose = document.getElementById('mdModalClose');

    // Close modal
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        modal.classList.remove('active');
      }
    });

    // MD links
    document.querySelectorAll('.md-link').forEach(link => {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        const path = link.dataset.path;
        const label = link.textContent;

        try {
          const response = await fetch(path);
          if (!response.ok) throw new Error('Failed to load file');
          const text = await response.text();

          modalTitle.textContent = label;
          modalContent.innerHTML = parseMarkdown(text);
          modal.classList.add('active');
        } catch (err) {
          alert('Nepodařilo se načíst soubor: ' + path);
        }
      });
    });
  </script>
</body>
</html>`;
}
