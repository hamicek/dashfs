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
  // Check what sections have content
  const hasDocs = (cfg.docs ?? []).length > 0 || cfg.contract;
  const hasRepos = (cfg.repos ?? []).length > 0;
  const hasNotes = (cfg.notes ?? []).length > 0;
  const hasImages = (cfg.images ?? []).length > 0;
  const hasLinks = (cfg.links ?? []).length > 0;
  const hasNotesApps = cfg.bearNoteUrl || cfg.obsidianUrl;

  // Documents section
  const docsItems = (cfg.docs ?? [])
    .map((d) => `<a href="${esc(d.path)}">${esc(d.label)}</a>`)
    .join("");

  const contractItem = cfg.contract
    ? `<a href="${esc(cfg.contract)}">Contract (PDF)</a>`
    : "";

  const docsBlock = contractItem + docsItems;

  // Repos section
  const reposBlock = (cfg.repos ?? [])
    .map((r) => {
      const absPath = resolve(projectRoot, r.path);
      const vscodeUrl = `vscode://file/${absPath}`;
      return `<a href="${esc(vscodeUrl)}">${esc(r.label)}</a>`;
    })
    .join("");

  // Notes section (local markdown/text files)
  const notesBlock = (cfg.notes ?? [])
    .map((n) => {
      const ext = extname(n.path).toLowerCase();
      if (ext === ".md") {
        return `<a href="#" class="md-link" data-path="${esc(n.path)}">${esc(n.label)}</a>`;
      }
      return `<a href="${esc(n.path)}">${esc(n.label)}</a>`;
    })
    .join("");

  // Images section
  const imagesBlock = (cfg.images ?? [])
    .map((i) => `<a href="${esc(i.path)}" target="_blank">${esc(i.label)}</a>`)
    .join("");

  // External links section
  const linksBlock = (cfg.links ?? [])
    .map(
      (l) => `<a href="${esc(l.url)}" target="_blank" rel="noreferrer">${esc(l.label)}</a>`
    )
    .join("");

  // Notes apps section
  const notesApps: string[] = [];
  if (cfg.bearNoteUrl) {
    notesApps.push(`<a href="${esc(cfg.bearNoteUrl)}">Bear</a>`);
  }
  if (cfg.obsidianUrl) {
    notesApps.push(`<a href="${esc(cfg.obsidianUrl)}">Obsidian</a>`);
  }
  const notesAppsBlock = notesApps.join("");

  // Quick notes section (editable)
  const quickNotesItems = (cfg.quickNotes ?? [])
    .map((n, i) => `<div class="quick-note-item">
      <span class="quick-note-text editable" contenteditable="true" data-note-index="${i}">${esc(n)}</span>
      <button class="quick-note-delete" data-note-index="${i}" title="Delete note">&times;</button>
    </div>`)
    .join("");
  const quickNotesBlock = `<div class="quick-notes-list" id="quickNotesList">${quickNotesItems}</div>
    <button class="add-note-btn" id="addNoteBtn">+ Add note</button>`;

  return `<!doctype html>
<html lang="cs">
<head>
  <meta charset="utf-8" />
  <title>${esc(cfg.title)}</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%232563eb'/><path d='M25 30h50M25 50h35M25 70h45' stroke='white' stroke-width='8' stroke-linecap='round'/></svg>">
  <style>
    :root {
      --bg: #f5f5f7;
      --text: #111827;
      --text-muted: #4b5563;
      --text-subtle: #6b7280;
      --card-bg: #ffffff;
      --card-border: #e5e7eb;
      --card-shadow: rgba(0,0,0,0.08);
      --link-bg: #f9fafb;
      --link-hover: #e5e7eb;
      --link-border-hover: #d1d5db;
      --code-bg: #f3f4f6;
      --pre-bg: #1f2937;
      --pre-text: #f9fafb;
      --table-header: #f9fafb;
      --accent: #2563eb;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #111827;
        --text: #f9fafb;
        --text-muted: #9ca3af;
        --text-subtle: #6b7280;
        --card-bg: #1f2937;
        --card-border: #374151;
        --card-shadow: rgba(0,0,0,0.3);
        --link-bg: #374151;
        --link-hover: #4b5563;
        --link-border-hover: #6b7280;
        --code-bg: #374151;
        --pre-bg: #0f172a;
        --pre-text: #f9fafb;
        --table-header: #374151;
        --accent: #3b82f6;
      }
    }
    * {
      box-sizing: border-box;
    }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      margin: 0;
      padding: 24px;
      background: var(--bg);
      color: var(--text);
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
      color: var(--text-muted);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }
    .card {
      background: var(--card-bg);
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 1px 3px var(--card-shadow);
      border: 1px solid var(--card-border);
    }
    .card h2 {
      margin-top: 0;
      margin-bottom: 12px;
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-subtle);
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
      border: 1px solid var(--card-border);
      background: var(--link-bg);
      color: var(--text);
      transition: all 0.15s ease;
      cursor: pointer;
    }
    .links a:hover {
      background: var(--link-hover);
      border-color: var(--link-border-hover);
    }
    ul {
      padding-left: 20px;
      margin: 0;
    }
    li {
      margin-bottom: 4px;
    }
    em {
      color: var(--text-subtle);
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
      background: var(--card-bg);
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
      border-bottom: 1px solid var(--card-border);
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
      color: var(--text-subtle);
      padding: 4px 8px;
      border-radius: 6px;
    }
    .md-modal-close:hover {
      background: var(--link-bg);
      color: var(--text);
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
    .md-content h1 { font-size: 1.75rem; border-bottom: 1px solid var(--card-border); padding-bottom: 0.3em; }
    .md-content h2 { font-size: 1.5rem; border-bottom: 1px solid var(--card-border); padding-bottom: 0.3em; }
    .md-content h3 { font-size: 1.25rem; }
    .md-content h4 { font-size: 1rem; }
    .md-content p { margin: 1em 0; }
    .md-content ul, .md-content ol { margin: 1em 0; padding-left: 2em; }
    .md-content li { margin: 0.25em 0; }
    .md-content code {
      background: var(--code-bg);
      padding: 0.2em 0.4em;
      border-radius: 4px;
      font-size: 0.9em;
      font-family: ui-monospace, "SF Mono", Menlo, Monaco, monospace;
    }
    .md-content pre {
      background: var(--pre-bg);
      color: var(--pre-text);
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
      border-left: 4px solid var(--card-border);
      margin: 1em 0;
      padding-left: 1em;
      color: var(--text-muted);
    }
    .md-content a {
      color: var(--accent);
      text-decoration: none;
    }
    .md-content a:hover {
      text-decoration: underline;
    }
    .md-content hr {
      border: none;
      border-top: 1px solid var(--card-border);
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
      border: 1px solid var(--card-border);
      padding: 8px 12px;
      text-align: left;
    }
    .md-content th {
      background: var(--table-header);
      font-weight: 600;
    }

    /* Syntax highlighting */
    .md-content .hljs-keyword { color: #c678dd; }
    .md-content .hljs-string { color: #98c379; }
    .md-content .hljs-number { color: #d19a66; }
    .md-content .hljs-comment { color: #5c6370; font-style: italic; }
    .md-content .hljs-function { color: #61afef; }
    .md-content .hljs-class { color: #e5c07b; }

    /* Inline editing styles */
    .editable {
      cursor: text;
      border-radius: 4px;
      transition: background 0.15s ease;
    }
    .editable:hover {
      background: var(--link-bg);
    }
    .editable:focus {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
      background: var(--link-bg);
    }
    .editable[data-placeholder]:empty::before {
      content: attr(data-placeholder);
      color: var(--text-subtle);
      font-style: italic;
    }
    .quick-notes-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .quick-note-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 8px 0;
      border-bottom: 1px solid var(--card-border);
    }
    .quick-note-item:last-child {
      border-bottom: none;
    }
    .quick-note-text {
      flex: 1;
      min-width: 0;
    }
    .quick-note-delete {
      background: none;
      border: none;
      color: var(--text-subtle);
      cursor: pointer;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 1rem;
      opacity: 0;
      transition: all 0.15s ease;
    }
    .quick-note-item:hover .quick-note-delete {
      opacity: 1;
    }
    .quick-note-delete:hover {
      background: #ef4444;
      color: white;
    }
    .add-note-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-top: 12px;
      padding: 6px 12px;
      background: var(--link-bg);
      border: 1px dashed var(--card-border);
      border-radius: 8px;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.15s ease;
    }
    .add-note-btn:hover {
      background: var(--link-hover);
      border-color: var(--link-border-hover);
      color: var(--text);
    }
    .save-indicator {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 10px 16px;
      background: var(--accent);
      color: white;
      border-radius: 8px;
      font-size: 0.875rem;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.2s ease;
      z-index: 1000;
    }
    .save-indicator.visible {
      opacity: 1;
      transform: translateY(0);
    }
  </style>
</head>
<body>
  <h1 class="editable" contenteditable="true" data-field="title">${esc(cfg.title)}</h1>
  <p class="description editable" contenteditable="true" data-field="description" data-placeholder="Add description...">${cfg.description ? esc(cfg.description) : ""}</p>

  <div class="grid">
    ${hasDocs ? `<section class="card">
      <h2>Documents</h2>
      <div class="links">
        ${docsBlock}
      </div>
    </section>` : ""}

    ${hasRepos ? `<section class="card">
      <h2>Repositories</h2>
      <div class="links">
        ${reposBlock}
      </div>
    </section>` : ""}

    ${hasNotes ? `<section class="card">
      <h2>Notes</h2>
      <div class="links">
        ${notesBlock}
      </div>
    </section>` : ""}

    ${hasImages ? `<section class="card">
      <h2>Design / Images</h2>
      <div class="links">
        ${imagesBlock}
      </div>
    </section>` : ""}

    ${hasLinks ? `<section class="card">
      <h2>External Links</h2>
      <div class="links">
        ${linksBlock}
      </div>
    </section>` : ""}

    ${hasNotesApps ? `<section class="card">
      <h2>Note Apps</h2>
      <div class="links">
        ${notesAppsBlock}
      </div>
    </section>` : ""}

    <section class="card" id="quickNotesSection">
      <h2>Quick Notes</h2>
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

    // ========== INLINE EDITING ==========
    // Get project name from URL
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const projectName = pathParts[0] || '';

    // Current config cache
    let currentConfig = null;

    // Load config on start
    async function loadConfig() {
      if (!projectName) return;
      try {
        const res = await fetch('/__api/config/' + projectName);
        if (res.ok) {
          currentConfig = await res.json();
        }
      } catch (e) {
        console.error('Failed to load config:', e);
      }
    }

    // Save config
    async function saveConfig() {
      if (!projectName || !currentConfig) return;
      try {
        const res = await fetch('/__api/config/' + projectName, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentConfig)
        });
        if (res.ok) {
          showSaveIndicator();
        }
      } catch (e) {
        console.error('Failed to save config:', e);
      }
    }

    // Show save indicator
    function showSaveIndicator() {
      const indicator = document.getElementById('saveIndicator');
      indicator.classList.add('visible');
      setTimeout(() => indicator.classList.remove('visible'), 1500);
    }

    // Debounce helper
    function debounce(fn, delay) {
      let timer;
      return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
      };
    }

    const debouncedSave = debounce(saveConfig, 500);

    // Handle title/description editing
    document.querySelectorAll('.editable[data-field]').forEach(el => {
      el.addEventListener('blur', () => {
        if (!currentConfig) return;
        const field = el.dataset.field;
        const value = el.textContent.trim();
        if (currentConfig[field] !== value) {
          currentConfig[field] = value || (field === 'title' ? 'Untitled' : '');
          debouncedSave();
        }
      });

      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          el.blur();
        }
      });
    });

    // Handle quick note editing
    function setupQuickNoteListeners() {
      document.querySelectorAll('.quick-note-text').forEach(el => {
        el.addEventListener('blur', () => {
          if (!currentConfig) return;
          const index = parseInt(el.dataset.noteIndex);
          const value = el.textContent.trim();
          if (!currentConfig.quickNotes) currentConfig.quickNotes = [];
          if (currentConfig.quickNotes[index] !== value) {
            currentConfig.quickNotes[index] = value;
            debouncedSave();
          }
        });

        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            el.blur();
          }
        });
      });

      document.querySelectorAll('.quick-note-delete').forEach(btn => {
        btn.addEventListener('click', () => {
          if (!currentConfig) return;
          const index = parseInt(btn.dataset.noteIndex);
          if (!currentConfig.quickNotes) return;
          currentConfig.quickNotes.splice(index, 1);
          saveConfig();
          // Re-render will happen via live reload
        });
      });
    }

    // Add new note
    const addNoteBtn = document.getElementById('addNoteBtn');
    if (addNoteBtn) {
      addNoteBtn.addEventListener('click', () => {
        if (!currentConfig) return;
        if (!currentConfig.quickNotes) currentConfig.quickNotes = [];
        currentConfig.quickNotes.push('New note...');
        saveConfig();
        // Re-render will happen via live reload
      });
    }

    // Initialize
    loadConfig().then(() => {
      setupQuickNoteListeners();
    });
  </script>
  <div class="save-indicator" id="saveIndicator">Saved</div>
</body>
</html>`;
}
