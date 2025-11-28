// Paper theme - classic document style with serif fonts

import { ThemeStyles } from "./index.js";
import { getCommonStyles } from "./common.js";

export function getPaperTheme(): ThemeStyles {
  return {
    css: getCommonStyles() + `
    :root {
      --bg: #f8f5f0;
      --text: #2c2c2c;
      --text-muted: #5a5a5a;
      --text-subtle: #888888;
      --card-bg: #ffffff;
      --card-border: #e0d8cc;
      --card-shadow: rgba(0, 0, 0, 0.06);
      --link-bg: #faf8f5;
      --link-hover: #f0ebe3;
      --link-border-hover: #d0c8bc;
      --code-bg: #f5f2ed;
      --pre-bg: #2c2c2c;
      --pre-text: #f8f5f0;
      --table-header: #f5f2ed;
      --accent: #8b4513;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #1a1814;
        --text: #e8e4dc;
        --text-muted: #a8a49c;
        --text-subtle: #787470;
        --card-bg: #242018;
        --card-border: #3a3630;
        --card-shadow: rgba(0, 0, 0, 0.3);
        --link-bg: #2a2620;
        --link-hover: #3a3630;
        --link-border-hover: #4a4640;
        --code-bg: #2a2620;
        --pre-bg: #0a0808;
        --pre-text: #e8e4dc;
        --table-header: #2a2620;
        --accent: #d4a574;
      }
    }
    body {
      font-family: Georgia, "Times New Roman", Times, serif;
      margin: 0;
      padding: 48px;
      background: var(--bg);
      color: var(--text);
      line-height: 1.7;
      max-width: 900px;
      margin: 0 auto;
    }
    @media (max-width: 768px) {
      body {
        padding: 24px;
      }
    }
    h1 {
      margin-top: 0;
      margin-bottom: 8px;
      font-size: 2.25rem;
      font-weight: normal;
      font-style: italic;
      border-bottom: 2px solid var(--accent);
      padding-bottom: 16px;
    }
    p.description {
      margin-top: 16px;
      margin-bottom: 48px;
      color: var(--text-muted);
      font-size: 1.1rem;
      font-style: italic;
    }
    .grid {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }
    .card {
      background: var(--card-bg);
      border-radius: 0;
      padding: 24px;
      box-shadow: 0 2px 8px var(--card-shadow);
      border: 1px solid var(--card-border);
    }
    .card h2 {
      margin-top: 0;
      margin-bottom: 16px;
      font-size: 1rem;
      font-weight: normal;
      font-variant: small-caps;
      letter-spacing: 0.1em;
      color: var(--accent);
      border-bottom: 1px solid var(--card-border);
      padding-bottom: 8px;
    }
    .links {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .links a {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
      font-size: 1rem;
      padding: 8px 12px;
      border-radius: 0;
      border: none;
      border-left: 3px solid transparent;
      background: transparent;
      color: var(--text);
      transition: all 0.15s ease;
      cursor: pointer;
    }
    .links a:hover {
      background: var(--link-hover);
      border-left-color: var(--accent);
      color: var(--accent);
    }
    ul {
      padding-left: 24px;
      margin: 0;
    }
    li {
      margin-bottom: 8px;
    }
    em {
      color: var(--text-muted);
    }

    /* Modal styling */
    .md-modal {
      background: rgba(0, 0, 0, 0.5);
    }
    .md-modal-content {
      background: var(--card-bg);
      border-radius: 0;
      border: 1px solid var(--card-border);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }
    .md-modal-header {
      border-bottom: 1px solid var(--card-border);
    }
    .md-modal-header h3 {
      font-style: italic;
    }
    .md-modal-close {
      color: var(--text-muted);
    }
    .md-modal-close:hover {
      background: var(--link-hover);
      color: var(--text);
    }

    /* Markdown styling */
    .md-content h1, .md-content h2, .md-content h3 {
      font-weight: normal;
      color: var(--accent);
    }
    .md-content h1 {
      font-style: italic;
      border-bottom: 2px solid var(--card-border);
    }
    .md-content h2 {
      border-bottom: 1px solid var(--card-border);
    }
    .md-content code {
      background: var(--code-bg);
      font-family: "Courier New", Courier, monospace;
      font-size: 0.9em;
    }
    .md-content pre {
      background: var(--pre-bg);
      color: var(--pre-text);
      border-radius: 0;
      font-family: "Courier New", Courier, monospace;
    }
    .md-content blockquote {
      border-left: 3px solid var(--accent);
      color: var(--text-muted);
      font-style: italic;
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
      font-variant: small-caps;
    }

    /* Inline editing */
    .editable:hover {
      background: var(--link-hover);
    }
    .editable:focus {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
      background: var(--link-hover);
    }
    .editable[data-placeholder]:empty::before {
      color: var(--text-subtle);
    }

    /* Quick notes */
    .quick-note-item {
      border-bottom: 1px dashed var(--card-border);
      padding: 12px 0;
    }
    .quick-note-item:last-child {
      border-bottom: none;
    }
    .quick-note-delete {
      color: var(--text-subtle);
    }
    .quick-note-delete:hover {
      background: #c44;
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
      margin-top: 16px;
      background: transparent;
      border: 1px solid var(--card-border);
      color: var(--text-muted);
      font-style: italic;
    }
    .add-note-btn:hover {
      background: var(--link-hover);
      border-color: var(--accent);
      color: var(--accent);
    }

    /* Save indicator */
    .save-indicator {
      background: var(--accent);
      color: white;
      font-style: italic;
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
    bodyClass: "theme-paper",
  };
}
