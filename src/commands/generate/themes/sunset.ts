// Sunset theme - warm gradient with orange/pink tones

import { ThemeStyles } from "./index.js";
import { getCommonStyles } from "./common.js";

export function getSunsetTheme(): ThemeStyles {
  return {
    css: getCommonStyles() + `
    :root {
      --bg: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      --text: #ffecd2;
      --text-muted: #fcb69f;
      --text-subtle: #ff9a8b;
      --card-bg: rgba(255, 255, 255, 0.08);
      --card-border: rgba(255, 154, 139, 0.3);
      --card-shadow: rgba(0, 0, 0, 0.2);
      --link-bg: rgba(255, 255, 255, 0.05);
      --link-hover: rgba(255, 154, 139, 0.2);
      --link-border-hover: rgba(255, 154, 139, 0.5);
      --code-bg: rgba(0, 0, 0, 0.3);
      --pre-bg: rgba(0, 0, 0, 0.4);
      --pre-text: #ffecd2;
      --table-header: rgba(255, 154, 139, 0.1);
      --accent: #ff9a8b;
      --accent-secondary: #ffecd2;
    }
    body {
      font-family: "Nunito", system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 32px;
      background: var(--bg);
      background-attachment: fixed;
      color: var(--text);
      line-height: 1.6;
      min-height: 100vh;
    }
    h1 {
      margin-top: 0;
      margin-bottom: 8px;
      font-size: 2rem;
      font-weight: 700;
      background: linear-gradient(90deg, #ffecd2 0%, #fcb69f 50%, #ff9a8b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    p.description {
      margin-top: 0;
      margin-bottom: 32px;
      color: var(--text-muted);
      font-size: 1.05rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }
    .card {
      background: var(--card-bg);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 4px 20px var(--card-shadow);
      border: 1px solid var(--card-border);
    }
    .card h2 {
      margin-top: 0;
      margin-bottom: 14px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--accent);
    }
    .links {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    .links a {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
      font-size: 0.875rem;
      padding: 8px 14px;
      border-radius: 20px;
      border: 1px solid var(--card-border);
      background: var(--link-bg);
      color: var(--text);
      transition: all 0.25s ease;
      cursor: pointer;
    }
    .links a:hover {
      background: var(--link-hover);
      border-color: var(--link-border-hover);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 154, 139, 0.2);
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
      background: rgba(26, 26, 46, 0.9);
    }
    .md-modal-content {
      background: linear-gradient(180deg, rgba(22, 33, 62, 0.95) 0%, rgba(15, 52, 96, 0.95) 100%);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      border: 1px solid var(--card-border);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
    }
    .md-modal-header {
      border-bottom: 1px solid var(--card-border);
    }
    .md-modal-close {
      color: var(--text-muted);
    }
    .md-modal-close:hover {
      background: var(--link-hover);
      color: var(--accent);
    }

    /* Markdown styling */
    .md-content h1, .md-content h2, .md-content h3 {
      color: var(--accent-secondary);
    }
    .md-content h1, .md-content h2 {
      border-bottom: 1px solid var(--card-border);
    }
    .md-content code {
      background: var(--code-bg);
      font-family: "Fira Code", ui-monospace, monospace;
      color: var(--accent);
    }
    .md-content pre {
      background: var(--pre-bg);
      color: var(--pre-text);
      border-radius: 12px;
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
      background: #ff6b6b;
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
      border-radius: 20px;
    }
    .add-note-btn:hover {
      background: var(--link-hover);
      border-color: var(--accent);
      color: var(--text);
    }

    /* Save indicator */
    .save-indicator {
      background: linear-gradient(90deg, #ff9a8b 0%, #fcb69f 100%);
      color: #1a1a2e;
      font-weight: 600;
    }

    /* Drag & Drop */
    .drag-handle {
      color: var(--text-subtle);
    }
    .card.drag-over {
      border-color: var(--accent);
      box-shadow: 0 0 20px rgba(255, 154, 139, 0.3);
    }
  `,
    bodyClass: "theme-sunset",
  };
}
