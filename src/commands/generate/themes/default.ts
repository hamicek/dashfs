// Default theme - clean, modern cards with light/dark mode

import { ThemeStyles } from "./index.js";
import { getCommonStyles } from "./common.js";

export function getDefaultTheme(): ThemeStyles {
  return {
    css: getCommonStyles() + `
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

    /* Modal styling */
    .md-modal {
      background: rgba(0, 0, 0, 0.5);
    }
    .md-modal-content {
      background: var(--card-bg);
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    .md-modal-header {
      border-bottom: 1px solid var(--card-border);
    }
    .md-modal-close {
      color: var(--text-subtle);
    }
    .md-modal-close:hover {
      background: var(--link-bg);
      color: var(--text);
    }

    /* Markdown styling */
    .md-content h1, .md-content h2 {
      border-bottom: 1px solid var(--card-border);
    }
    .md-content code {
      background: var(--code-bg);
      font-family: ui-monospace, "SF Mono", Menlo, Monaco, monospace;
    }
    .md-content pre {
      background: var(--pre-bg);
      color: var(--pre-text);
    }
    .md-content blockquote {
      border-left: 4px solid var(--card-border);
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
      border-color: var(--link-border-hover);
      color: var(--text);
    }

    /* Save indicator */
    .save-indicator {
      background: var(--accent);
      color: white;
    }

    /* Drag & Drop */
    .drag-handle {
      color: var(--text-subtle);
    }
    .card.drag-over {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px var(--accent);
    }
  `,
  };
}
