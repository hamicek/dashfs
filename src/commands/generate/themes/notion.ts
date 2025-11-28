// Notion theme - minimal, spacious design inspired by Notion

import { ThemeStyles } from "./index.js";
import { getCommonStyles } from "./common.js";

export function getNotionTheme(): ThemeStyles {
  return {
    css: getCommonStyles() + `
    :root {
      --bg: #ffffff;
      --text: #37352f;
      --text-muted: #6b6b6b;
      --text-subtle: #9b9a97;
      --card-bg: #ffffff;
      --card-border: #e9e9e7;
      --card-shadow: none;
      --link-bg: #f7f6f3;
      --link-hover: #efeeed;
      --link-border-hover: #e9e9e7;
      --code-bg: #f7f6f3;
      --pre-bg: #f7f6f3;
      --pre-text: #37352f;
      --table-header: #f7f6f3;
      --accent: #2eaadc;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #191919;
        --text: #e6e6e6;
        --text-muted: #9b9b9b;
        --text-subtle: #6b6b6b;
        --card-bg: #202020;
        --card-border: #333333;
        --link-bg: #2f2f2f;
        --link-hover: #3a3a3a;
        --link-border-hover: #4a4a4a;
        --code-bg: #2f2f2f;
        --pre-bg: #2f2f2f;
        --pre-text: #e6e6e6;
        --table-header: #2f2f2f;
        --accent: #529cca;
      }
    }
    body {
      font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif;
      margin: 0;
      padding: 48px 96px;
      background: var(--bg);
      color: var(--text);
      line-height: 1.5;
      max-width: 1200px;
      margin: 0 auto;
    }
    @media (max-width: 768px) {
      body {
        padding: 24px;
      }
    }
    h1 {
      margin-top: 0;
      margin-bottom: 4px;
      font-size: 2.5rem;
      font-weight: 700;
      letter-spacing: -0.03em;
    }
    p.description {
      margin-top: 0;
      margin-bottom: 48px;
      color: var(--text-muted);
      font-size: 1.1rem;
    }
    .grid {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }
    .card {
      background: transparent;
      border-radius: 0;
      padding: 0;
      border: none;
      box-shadow: none;
    }
    .card h2 {
      margin-top: 0;
      margin-bottom: 16px;
      font-size: 1.1rem;
      font-weight: 600;
      text-transform: none;
      letter-spacing: -0.01em;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .card h2::before {
      content: "📁";
      font-size: 1rem;
    }
    .card[data-section="repos"] h2::before { content: "💻"; }
    .card[data-section="notes"] h2::before { content: "📝"; }
    .card[data-section="images"] h2::before { content: "🎨"; }
    .card[data-section="links"] h2::before { content: "🔗"; }
    .card[data-section="noteApps"] h2::before { content: "🗒️"; }
    .card[data-section="quickNotes"] h2::before { content: "✏️"; }
    .links {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .links a {
      display: flex;
      align-items: center;
      text-decoration: none;
      font-size: 1rem;
      padding: 6px 8px;
      border-radius: 4px;
      border: none;
      background: transparent;
      color: var(--text);
      transition: all 0.1s ease;
      cursor: pointer;
    }
    .links a::before {
      content: "◦";
      margin-right: 8px;
      color: var(--text-subtle);
    }
    .links a:hover {
      background: var(--link-hover);
    }
    ul {
      padding-left: 24px;
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
      background: rgba(0, 0, 0, 0.6);
    }
    .md-modal-content {
      background: var(--bg);
      border-radius: 4px;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 15px 40px;
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
      font-weight: 600;
      letter-spacing: -0.02em;
    }
    .md-content h1, .md-content h2 {
      border-bottom: none;
    }
    .md-content code {
      background: var(--code-bg);
      font-family: "SFMono-Regular", Menlo, Consolas, "PT Mono", "Liberation Mono", Courier, monospace;
      color: #eb5757;
      font-size: 85%;
    }
    .md-content pre {
      background: var(--pre-bg);
      color: var(--pre-text);
      border-radius: 4px;
    }
    .md-content pre code {
      color: inherit;
    }
    .md-content blockquote {
      border-left: 3px solid var(--card-border);
      color: var(--text-muted);
    }
    .md-content a {
      color: var(--text);
      text-decoration: underline;
      text-decoration-color: var(--text-subtle);
    }
    .md-content a:hover {
      text-decoration-color: var(--accent);
    }
    .md-content hr {
      border-top: 1px solid var(--card-border);
    }
    .md-content th, .md-content td {
      border: 1px solid var(--card-border);
    }
    .md-content th {
      background: var(--table-header);
      font-weight: 500;
    }

    /* Inline editing */
    .editable:hover {
      background: var(--link-hover);
    }
    .editable:focus {
      outline: none;
      background: var(--link-hover);
    }
    .editable[data-placeholder]:empty::before {
      color: var(--text-subtle);
    }

    /* Quick notes */
    .quick-note-item {
      border-bottom: none;
      padding: 4px 0;
    }
    .quick-note-delete {
      color: var(--text-subtle);
    }
    .quick-note-delete:hover {
      background: #eb5757;
      color: white;
    }
    .todo-checkbox {
      accent-color: var(--accent);
      border-radius: 2px;
    }
    .todo-item.completed .quick-note-text {
      text-decoration: line-through;
      color: var(--text-subtle);
    }
    .add-note-btn {
      margin-top: 8px;
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 4px 8px;
    }
    .add-note-btn:hover {
      background: var(--link-hover);
      color: var(--text);
    }

    /* Save indicator */
    .save-indicator {
      background: var(--text);
      color: var(--bg);
      border-radius: 4px;
    }

    /* Drag & Drop */
    .drag-handle {
      color: var(--text-subtle);
    }
    .card.drag-over {
      background: var(--link-hover);
      border-radius: 4px;
    }
    .card-header {
      margin-bottom: 8px;
    }
  `,
    bodyClass: "theme-notion",
  };
}
