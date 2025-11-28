// Brutalist theme - raw, minimal, no-nonsense design

import { ThemeStyles } from "./index.js";
import { getCommonStyles } from "./common.js";

export function getBrutalistTheme(): ThemeStyles {
  return {
    css: getCommonStyles() + `
    :root {
      --bg: #ffffff;
      --text: #000000;
      --text-muted: #333333;
      --text-subtle: #666666;
      --card-bg: #ffffff;
      --card-border: #000000;
      --card-shadow: none;
      --link-bg: #ffffff;
      --link-hover: #000000;
      --link-border-hover: #000000;
      --code-bg: #f0f0f0;
      --pre-bg: #000000;
      --pre-text: #ffffff;
      --table-header: #f0f0f0;
      --accent: #0000ff;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #000000;
        --text: #ffffff;
        --text-muted: #cccccc;
        --text-subtle: #999999;
        --card-bg: #000000;
        --card-border: #ffffff;
        --link-bg: #000000;
        --link-hover: #ffffff;
        --code-bg: #1a1a1a;
        --pre-bg: #1a1a1a;
        --pre-text: #ffffff;
        --table-header: #1a1a1a;
        --accent: #00ff00;
      }
    }
    body {
      font-family: "Courier New", Courier, monospace;
      margin: 0;
      padding: 32px;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
    }
    h1 {
      margin-top: 0;
      margin-bottom: 4px;
      font-size: 2rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      border-bottom: 4px solid var(--text);
      padding-bottom: 8px;
      display: inline-block;
    }
    p.description {
      margin-top: 16px;
      margin-bottom: 32px;
      color: var(--text-muted);
      font-size: 1rem;
      max-width: 60ch;
    }
    .grid {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .card {
      background: var(--card-bg);
      border-radius: 0;
      padding: 24px;
      border: 2px solid var(--card-border);
    }
    .card h2 {
      margin-top: 0;
      margin-bottom: 16px;
      font-size: 1rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: var(--text);
      border-bottom: 2px solid var(--card-border);
      padding-bottom: 8px;
    }
    .links {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .links a {
      display: block;
      text-decoration: none;
      font-size: 1rem;
      padding: 8px 0;
      border-radius: 0;
      border: none;
      border-bottom: 1px solid var(--card-border);
      background: transparent;
      color: var(--text);
      transition: all 0.1s ease;
      cursor: pointer;
    }
    .links a:last-child {
      border-bottom: none;
    }
    .links a:hover {
      background: var(--link-hover);
      color: var(--bg);
      padding-left: 8px;
    }
    ul {
      padding-left: 20px;
      margin: 0;
    }
    li {
      margin-bottom: 8px;
    }
    em {
      color: var(--text-subtle);
      font-style: normal;
      text-decoration: underline;
    }

    /* Modal styling */
    .md-modal {
      background: rgba(0, 0, 0, 0.8);
    }
    .md-modal-content {
      background: var(--bg);
      border-radius: 0;
      border: 4px solid var(--text);
    }
    .md-modal-header {
      border-bottom: 2px solid var(--card-border);
    }
    .md-modal-header h3 {
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .md-modal-close {
      color: var(--text);
      font-weight: bold;
    }
    .md-modal-close:hover {
      background: var(--text);
      color: var(--bg);
    }

    /* Markdown styling */
    .md-content h1, .md-content h2, .md-content h3 {
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .md-content h1, .md-content h2 {
      border-bottom: 2px solid var(--card-border);
    }
    .md-content code {
      background: var(--code-bg);
      font-family: inherit;
    }
    .md-content pre {
      background: var(--pre-bg);
      color: var(--pre-text);
      border-radius: 0;
      border: 2px solid var(--card-border);
    }
    .md-content blockquote {
      border-left: 4px solid var(--text);
      color: var(--text-muted);
      font-style: normal;
    }
    .md-content a {
      color: var(--accent);
      text-decoration: underline;
    }
    .md-content hr {
      border-top: 2px solid var(--card-border);
    }
    .md-content th, .md-content td {
      border: 2px solid var(--card-border);
    }
    .md-content th {
      background: var(--table-header);
      text-transform: uppercase;
      font-size: 0.875rem;
      letter-spacing: 0.1em;
    }

    /* Inline editing */
    .editable:hover {
      background: var(--code-bg);
    }
    .editable:focus {
      outline: 2px solid var(--text);
      outline-offset: 2px;
      background: var(--code-bg);
    }
    .editable[data-placeholder]:empty::before {
      color: var(--text-subtle);
      text-transform: uppercase;
      font-size: 0.875rem;
    }

    /* Quick notes */
    .quick-note-item {
      border-bottom: 1px solid var(--card-border);
      padding: 12px 0;
    }
    .quick-note-item:last-child {
      border-bottom: none;
    }
    .quick-note-delete {
      color: var(--text-subtle);
      font-weight: bold;
    }
    .quick-note-delete:hover {
      background: var(--text);
      color: var(--bg);
    }
    .todo-checkbox {
      accent-color: var(--text);
      width: 20px;
      height: 20px;
    }
    .todo-item.completed .quick-note-text {
      text-decoration: line-through;
      color: var(--text-subtle);
    }
    .add-note-btn {
      margin-top: 16px;
      background: transparent;
      border: 2px solid var(--card-border);
      color: var(--text);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: 0.75rem;
      font-weight: bold;
    }
    .add-note-btn:hover {
      background: var(--text);
      color: var(--bg);
    }

    /* Save indicator */
    .save-indicator {
      background: var(--text);
      color: var(--bg);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-weight: bold;
      border-radius: 0;
    }

    /* Drag & Drop */
    .drag-handle {
      color: var(--text-subtle);
    }
    .card.drag-over {
      border-width: 4px;
      border-style: dashed;
    }
    .card-header h2 {
      font-size: 0.875rem;
    }
  `,
    bodyClass: "theme-brutalist",
  };
}
