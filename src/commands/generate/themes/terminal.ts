// Terminal theme - retro hacker style with green text on black

import { ThemeStyles } from "./index.js";
import { getCommonStyles } from "./common.js";

export function getTerminalTheme(): ThemeStyles {
  return {
    css: getCommonStyles() + `
    :root {
      --bg: #0a0a0a;
      --text: #33ff33;
      --text-muted: #22aa22;
      --text-subtle: #1a8a1a;
      --card-bg: #111111;
      --card-border: #1a1a1a;
      --card-shadow: rgba(0,255,0,0.1);
      --link-bg: #0a0a0a;
      --link-hover: #1a1a1a;
      --link-border-hover: #33ff33;
      --code-bg: #1a1a1a;
      --pre-bg: #000000;
      --pre-text: #33ff33;
      --table-header: #1a1a1a;
      --accent: #33ff33;
    }
    body {
      font-family: ui-monospace, "SF Mono", "Cascadia Code", "Fira Code", Menlo, Monaco, "Courier New", monospace;
      margin: 0;
      padding: 24px;
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
    }
    body::before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.15),
        rgba(0, 0, 0, 0.15) 1px,
        transparent 1px,
        transparent 2px
      );
      pointer-events: none;
      z-index: 9999;
    }
    h1 {
      margin-top: 0;
      margin-bottom: 8px;
      font-size: 1.5rem;
      font-weight: normal;
      text-shadow: 0 0 10px var(--accent);
    }
    h1::before {
      content: "> ";
      color: var(--text-muted);
    }
    p.description {
      margin-top: 0;
      margin-bottom: 24px;
      color: var(--text-muted);
    }
    p.description::before {
      content: "# ";
      color: var(--text-subtle);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }
    .card {
      background: var(--card-bg);
      border-radius: 0;
      padding: 16px;
      border: 1px solid var(--card-border);
      box-shadow: 0 0 10px rgba(0, 255, 0, 0.05);
    }
    .card h2 {
      margin-top: 0;
      margin-bottom: 12px;
      font-size: 0.875rem;
      font-weight: normal;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      border-bottom: 1px dashed var(--card-border);
      padding-bottom: 8px;
    }
    .card h2::before {
      content: "[ ";
    }
    .card h2::after {
      content: " ]";
    }
    .links {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .links a {
      display: block;
      text-decoration: none;
      font-size: 0.875rem;
      padding: 4px 8px;
      border-radius: 0;
      border: none;
      background: transparent;
      color: var(--text);
      transition: all 0.1s ease;
      cursor: pointer;
    }
    .links a::before {
      content: "→ ";
      color: var(--text-subtle);
    }
    .links a:hover {
      background: var(--link-hover);
      color: var(--accent);
      text-shadow: 0 0 5px var(--accent);
    }
    .links a:hover::before {
      content: "► ";
      color: var(--accent);
    }
    ul {
      padding-left: 20px;
      margin: 0;
    }
    li {
      margin-bottom: 4px;
    }
    li::marker {
      color: var(--text-subtle);
    }
    em {
      color: var(--text-subtle);
      font-style: normal;
    }

    /* Modal styling */
    .md-modal {
      background: rgba(0, 0, 0, 0.9);
    }
    .md-modal-content {
      background: var(--card-bg);
      border-radius: 0;
      border: 1px solid var(--text-subtle);
      box-shadow: 0 0 20px rgba(0, 255, 0, 0.2);
    }
    .md-modal-header {
      border-bottom: 1px dashed var(--card-border);
    }
    .md-modal-header h3::before {
      content: "FILE: ";
      color: var(--text-subtle);
    }
    .md-modal-close {
      color: var(--text-muted);
    }
    .md-modal-close:hover {
      color: var(--accent);
      background: transparent;
      text-shadow: 0 0 5px var(--accent);
    }

    /* Markdown styling */
    .md-content h1, .md-content h2, .md-content h3 {
      color: var(--accent);
      border-bottom: 1px dashed var(--card-border);
    }
    .md-content code {
      background: var(--code-bg);
      font-family: inherit;
      color: var(--accent);
    }
    .md-content pre {
      background: var(--pre-bg);
      color: var(--pre-text);
      border: 1px solid var(--card-border);
    }
    .md-content blockquote {
      border-left: 2px solid var(--accent);
      color: var(--text-muted);
    }
    .md-content a {
      color: var(--accent);
    }
    .md-content hr {
      border-top: 1px dashed var(--card-border);
    }
    .md-content th, .md-content td {
      border: 1px solid var(--card-border);
    }
    .md-content th {
      background: var(--table-header);
    }

    /* Syntax highlighting - terminal style */
    .md-content .hljs-keyword { color: #ff6666; }
    .md-content .hljs-string { color: #66ff66; }
    .md-content .hljs-number { color: #ffff66; }
    .md-content .hljs-comment { color: #666666; }
    .md-content .hljs-function { color: #66ffff; }
    .md-content .hljs-class { color: #ff66ff; }

    /* Inline editing */
    .editable:hover {
      background: var(--link-hover);
    }
    .editable:focus {
      outline: 1px solid var(--accent);
      outline-offset: 2px;
      background: var(--link-hover);
      box-shadow: 0 0 10px rgba(0, 255, 0, 0.2);
    }
    .editable[data-placeholder]:empty::before {
      color: var(--text-subtle);
    }

    /* Quick notes */
    .quick-note-item {
      border-bottom: 1px dashed var(--card-border);
    }
    .quick-note-item:last-child {
      border-bottom: none;
    }
    .quick-note-item::before {
      content: "- ";
      color: var(--text-subtle);
    }
    .quick-note-delete {
      color: var(--text-subtle);
    }
    .quick-note-delete:hover {
      background: #ff3333;
      color: #000;
    }
    .todo-checkbox {
      accent-color: var(--accent);
    }
    .todo-item::before {
      content: "";
    }
    .todo-item.completed .quick-note-text {
      text-decoration: line-through;
      color: var(--text-subtle);
    }
    .add-note-btn {
      margin-top: 12px;
      background: transparent;
      border: 1px dashed var(--card-border);
      color: var(--text-muted);
    }
    .add-note-btn:hover {
      background: var(--link-hover);
      border-color: var(--accent);
      color: var(--accent);
      text-shadow: 0 0 5px var(--accent);
    }

    /* Save indicator */
    .save-indicator {
      background: var(--accent);
      color: #000;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    /* Drag & Drop */
    .drag-handle {
      color: var(--text-subtle);
    }
    .card.drag-over {
      border-color: var(--accent);
      box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
    }
  `,
    bodyClass: "theme-terminal",
  };
}
