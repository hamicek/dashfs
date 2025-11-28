// Glass theme - glassmorphism with blur effects and gradients

import { ThemeStyles } from "./index.js";
import { getCommonStyles } from "./common.js";

export function getGlassTheme(): ThemeStyles {
  return {
    css: getCommonStyles() + `
    :root {
      --bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --text: #ffffff;
      --text-muted: rgba(255, 255, 255, 0.8);
      --text-subtle: rgba(255, 255, 255, 0.6);
      --card-bg: rgba(255, 255, 255, 0.15);
      --card-border: rgba(255, 255, 255, 0.2);
      --card-shadow: rgba(0, 0, 0, 0.1);
      --link-bg: rgba(255, 255, 255, 0.1);
      --link-hover: rgba(255, 255, 255, 0.25);
      --link-border-hover: rgba(255, 255, 255, 0.4);
      --code-bg: rgba(0, 0, 0, 0.2);
      --pre-bg: rgba(0, 0, 0, 0.3);
      --pre-text: #ffffff;
      --table-header: rgba(255, 255, 255, 0.1);
      --accent: #ffffff;
    }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      margin: 0;
      padding: 32px;
      background: var(--bg);
      background-attachment: fixed;
      color: var(--text);
      line-height: 1.5;
      min-height: 100vh;
    }
    h1 {
      margin-top: 0;
      margin-bottom: 8px;
      font-size: 2rem;
      font-weight: 600;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
    p.description {
      margin-top: 0;
      margin-bottom: 32px;
      color: var(--text-muted);
      font-size: 1.1rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    .card {
      background: var(--card-bg);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 8px 32px var(--card-shadow);
      border: 1px solid var(--card-border);
    }
    .card h2 {
      margin-top: 0;
      margin-bottom: 16px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--text-muted);
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
      padding: 8px 16px;
      border-radius: 12px;
      border: 1px solid var(--card-border);
      background: var(--link-bg);
      color: var(--text);
      transition: all 0.2s ease;
      cursor: pointer;
      backdrop-filter: blur(10px);
    }
    .links a:hover {
      background: var(--link-hover);
      border-color: var(--link-border-hover);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
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
      backdrop-filter: blur(5px);
    }
    .md-modal-content {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
    }
    .md-modal-header {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .md-modal-close {
      color: var(--text-muted);
    }
    .md-modal-close:hover {
      background: rgba(255, 255, 255, 0.1);
      color: var(--text);
    }

    /* Markdown styling */
    .md-content h1, .md-content h2, .md-content h3 {
      color: var(--text);
    }
    .md-content h1, .md-content h2 {
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
    .md-content code {
      background: var(--code-bg);
      font-family: ui-monospace, "SF Mono", Menlo, Monaco, monospace;
      color: #ffd700;
    }
    .md-content pre {
      background: var(--pre-bg);
      color: var(--pre-text);
      border-radius: 12px;
    }
    .md-content blockquote {
      border-left: 3px solid rgba(255, 255, 255, 0.4);
      color: var(--text-muted);
    }
    .md-content a {
      color: #ffd700;
    }
    .md-content hr {
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    }
    .md-content th, .md-content td {
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .md-content th {
      background: var(--table-header);
    }

    /* Inline editing */
    .editable:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    .editable:focus {
      outline: 2px solid rgba(255, 255, 255, 0.5);
      outline-offset: 2px;
      background: rgba(255, 255, 255, 0.1);
    }
    .editable[data-placeholder]:empty::before {
      color: var(--text-subtle);
    }

    /* Quick notes */
    .quick-note-item {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .quick-note-item:last-child {
      border-bottom: none;
    }
    .quick-note-delete {
      color: var(--text-subtle);
    }
    .quick-note-delete:hover {
      background: rgba(255, 100, 100, 0.8);
      color: white;
    }
    .todo-checkbox {
      accent-color: #ffd700;
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
      background: rgba(255, 255, 255, 0.9);
      color: #667eea;
      backdrop-filter: blur(10px);
    }

    /* Drag & Drop */
    .drag-handle {
      color: var(--text-subtle);
    }
    .card.drag-over {
      border-color: rgba(255, 255, 255, 0.6);
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
    }
  `,
    bodyClass: "theme-glass",
  };
}
