// Dashboard theme - dark analytics dashboard with accent colors

import { ThemeStyles } from "./index.js";
import { getCommonStyles } from "./common.js";

export function getDashboardTheme(): ThemeStyles {
  return {
    css: getCommonStyles() + `
    :root {
      --bg: #0f0f14;
      --text: #e4e4e7;
      --text-muted: #a1a1aa;
      --text-subtle: #71717a;
      --card-bg: #18181b;
      --card-border: #27272a;
      --card-shadow: rgba(0, 0, 0, 0.4);
      --link-bg: #27272a;
      --link-hover: #3f3f46;
      --link-border-hover: #52525b;
      --code-bg: #27272a;
      --pre-bg: #09090b;
      --pre-text: #e4e4e7;
      --table-header: #27272a;
      --accent: #8b5cf6;
      --accent-secondary: #22c55e;
      --accent-tertiary: #f59e0b;
    }
    body {
      font-family: Inter, system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 24px;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
    }
    h1 {
      margin-top: 0;
      margin-bottom: 4px;
      font-size: 1.5rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    h1::before {
      content: "";
      width: 4px;
      height: 28px;
      background: linear-gradient(180deg, var(--accent) 0%, var(--accent-secondary) 100%);
      border-radius: 2px;
    }
    p.description {
      margin-top: 0;
      margin-bottom: 24px;
      color: var(--text-muted);
      font-size: 0.875rem;
      padding-left: 16px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }
    .card {
      background: var(--card-bg);
      border-radius: 8px;
      padding: 16px;
      box-shadow: 0 4px 12px var(--card-shadow);
      border: 1px solid var(--card-border);
    }
    .card h2 {
      margin-top: 0;
      margin-bottom: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .card h2::before {
      content: "";
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--accent);
    }
    .card[data-section="repos"] h2::before { background: var(--accent-secondary); }
    .card[data-section="notes"] h2::before { background: var(--accent-tertiary); }
    .card[data-section="images"] h2::before { background: #ec4899; }
    .card[data-section="links"] h2::before { background: #06b6d4; }
    .card[data-section="noteApps"] h2::before { background: #f97316; }
    .card[data-section="quickNotes"] h2::before { background: #84cc16; }
    .links {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .links a {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
      font-size: 0.8125rem;
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid var(--card-border);
      background: var(--link-bg);
      color: var(--text);
      transition: all 0.15s ease;
      cursor: pointer;
    }
    .links a:hover {
      background: var(--link-hover);
      border-color: var(--link-border-hover);
      transform: translateY(-1px);
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

    /* Modal styling */
    .md-modal {
      background: rgba(0, 0, 0, 0.8);
    }
    .md-modal-content {
      background: var(--card-bg);
      border-radius: 12px;
      border: 1px solid var(--card-border);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    }
    .md-modal-header {
      border-bottom: 1px solid var(--card-border);
    }
    .md-modal-close {
      color: var(--text-muted);
    }
    .md-modal-close:hover {
      background: var(--link-bg);
      color: var(--text);
    }

    /* Markdown styling */
    .md-content h1, .md-content h2, .md-content h3 {
      color: var(--text);
    }
    .md-content h1, .md-content h2 {
      border-bottom: 1px solid var(--card-border);
    }
    .md-content code {
      background: var(--code-bg);
      font-family: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
      color: var(--accent);
    }
    .md-content pre {
      background: var(--pre-bg);
      color: var(--pre-text);
      border: 1px solid var(--card-border);
    }
    .md-content blockquote {
      border-left: 3px solid var(--accent);
      color: var(--text-muted);
    }
    .md-content a {
      color: var(--accent);
    }
    .md-content hr {
      border-top: 1px solid var(--card-border);
    }
    .md-content th, .md-content td {
      border: 1px solid var(--card-border);
    }
    .md-content th {
      background: var(--table-header);
    }

    /* Syntax highlighting */
    .md-content .hljs-keyword { color: #c678dd; }
    .md-content .hljs-string { color: #98c379; }
    .md-content .hljs-number { color: #d19a66; }
    .md-content .hljs-comment { color: #5c6370; font-style: italic; }
    .md-content .hljs-function { color: #61afef; }
    .md-content .hljs-class { color: #e5c07b; }

    /* Inline editing */
    .editable:hover {
      background: var(--link-bg);
    }
    .editable:focus {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
      background: var(--link-bg);
    }
    .editable[data-placeholder]:empty::before {
      color: var(--text-subtle);
    }

    /* Quick notes */
    .quick-note-item {
      border-bottom: 1px solid var(--card-border);
    }
    .quick-note-item:last-child {
      border-bottom: none;
    }
    .quick-note-delete {
      color: var(--text-subtle);
    }
    .quick-note-delete:hover {
      background: #ef4444;
      color: white;
    }
    .todo-checkbox {
      accent-color: var(--accent);
    }
    .todo-item.completed .quick-note-text {
      text-decoration: line-through;
      color: var(--text-subtle);
    }
    .add-note-btn {
      margin-top: 12px;
      background: var(--link-bg);
      border: 1px dashed var(--card-border);
      color: var(--text-muted);
    }
    .add-note-btn:hover {
      background: var(--link-hover);
      border-color: var(--accent);
      color: var(--text);
    }

    /* Save indicator */
    .save-indicator {
      background: linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%);
      color: white;
      font-weight: 500;
    }

    /* Drag & Drop */
    .drag-handle {
      color: var(--text-subtle);
    }
    .card.drag-over {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px var(--accent), 0 4px 12px var(--card-shadow);
    }
  `,
    bodyClass: "theme-dashboard",
  };
}
