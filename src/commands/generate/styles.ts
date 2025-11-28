// CSS styles for the generated dashboard

export function getStyles(): string {
  return `
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
    /* TODO checkbox styles */
    .todo-checkbox {
      width: 18px;
      height: 18px;
      margin: 0;
      cursor: pointer;
      accent-color: var(--accent);
      flex-shrink: 0;
    }
    .todo-item.completed .quick-note-text {
      text-decoration: line-through;
      color: var(--text-subtle);
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
    .add-note-actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }
    .add-note-actions .add-note-btn {
      margin-top: 0;
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

    /* Drag & Drop styles */
    .card {
      position: relative;
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }
    .card-header h2 {
      margin: 0;
      flex: 1;
    }
    .drag-handle {
      cursor: grab;
      padding: 4px;
      color: var(--text-subtle);
      opacity: 0;
      transition: opacity 0.15s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card:hover .drag-handle {
      opacity: 1;
    }
    .drag-handle:active {
      cursor: grabbing;
    }
    .drag-handle svg {
      width: 16px;
      height: 16px;
    }
    .card.dragging {
      opacity: 0.5;
      transform: scale(0.98);
    }
    .card.drag-over {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px var(--accent);
    }
  `;
}
