// Nord theme - calm Nordic color palette (inspired by Nord color scheme)

import { ThemeStyles } from "./index.js";
import { getCommonStyles } from "./common.js";

export function getNordTheme(): ThemeStyles {
  return {
    css: getCommonStyles() + `
    :root {
      /* Nord Polar Night */
      --nord0: #2e3440;
      --nord1: #3b4252;
      --nord2: #434c5e;
      --nord3: #4c566a;
      /* Nord Snow Storm */
      --nord4: #d8dee9;
      --nord5: #e5e9f0;
      --nord6: #eceff4;
      /* Nord Frost */
      --nord7: #8fbcbb;
      --nord8: #88c0d0;
      --nord9: #81a1c1;
      --nord10: #5e81ac;
      /* Nord Aurora */
      --nord11: #bf616a;
      --nord12: #d08770;
      --nord13: #ebcb8b;
      --nord14: #a3be8c;
      --nord15: #b48ead;

      --bg: var(--nord0);
      --text: var(--nord6);
      --text-muted: var(--nord4);
      --text-subtle: var(--nord3);
      --card-bg: var(--nord1);
      --card-border: var(--nord2);
      --card-shadow: rgba(0, 0, 0, 0.3);
      --link-bg: var(--nord2);
      --link-hover: var(--nord3);
      --link-border-hover: var(--nord9);
      --code-bg: var(--nord2);
      --pre-bg: var(--nord0);
      --pre-text: var(--nord6);
      --table-header: var(--nord2);
      --accent: var(--nord8);
    }
    body {
      font-family: "Inter", system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 24px;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
    }
    h1 {
      margin-top: 0;
      margin-bottom: 8px;
      font-size: 1.875rem;
      font-weight: 500;
      color: var(--nord8);
    }
    p.description {
      margin-top: 0;
      margin-bottom: 28px;
      color: var(--text-muted);
      font-size: 1rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }
    .card {
      background: var(--card-bg);
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 8px var(--card-shadow);
      border: 1px solid var(--card-border);
    }
    .card h2 {
      margin-top: 0;
      margin-bottom: 16px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--nord9);
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
      padding: 8px 14px;
      border-radius: 6px;
      border: 1px solid var(--card-border);
      background: var(--link-bg);
      color: var(--text);
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .links a:hover {
      background: var(--link-hover);
      border-color: var(--link-border-hover);
      color: var(--nord8);
    }
    ul {
      padding-left: 20px;
      margin: 0;
    }
    li {
      margin-bottom: 6px;
    }
    em {
      color: var(--text-subtle);
    }

    /* Modal styling */
    .md-modal {
      background: rgba(46, 52, 64, 0.9);
    }
    .md-modal-content {
      background: var(--card-bg);
      border-radius: 12px;
      border: 1px solid var(--card-border);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    .md-modal-header {
      border-bottom: 1px solid var(--card-border);
    }
    .md-modal-close {
      color: var(--text-muted);
    }
    .md-modal-close:hover {
      background: var(--link-bg);
      color: var(--nord11);
    }

    /* Markdown styling */
    .md-content h1, .md-content h2, .md-content h3 {
      color: var(--nord8);
    }
    .md-content h1, .md-content h2 {
      border-bottom: 1px solid var(--card-border);
    }
    .md-content code {
      background: var(--code-bg);
      font-family: "JetBrains Mono", ui-monospace, monospace;
      color: var(--nord13);
    }
    .md-content pre {
      background: var(--pre-bg);
      color: var(--pre-text);
      border: 1px solid var(--card-border);
    }
    .md-content blockquote {
      border-left: 3px solid var(--nord9);
      color: var(--text-muted);
    }
    .md-content a {
      color: var(--nord8);
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

    /* Syntax highlighting - Nord colors */
    .md-content .hljs-keyword { color: var(--nord9); }
    .md-content .hljs-string { color: var(--nord14); }
    .md-content .hljs-number { color: var(--nord15); }
    .md-content .hljs-comment { color: var(--nord3); font-style: italic; }
    .md-content .hljs-function { color: var(--nord8); }
    .md-content .hljs-class { color: var(--nord13); }

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
      background: var(--nord11);
      color: white;
    }
    .todo-checkbox {
      accent-color: var(--nord14);
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
      background: var(--nord14);
      color: var(--nord0);
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
    bodyClass: "theme-nord",
  };
}
