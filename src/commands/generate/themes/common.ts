// Common CSS that all themes share (structure, not visual styling)

export function getCommonStyles(): string {
  return `
    * {
      box-sizing: border-box;
    }

    /* MD Viewer Modal - structure */
    .md-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
      justify-content: center;
      align-items: flex-start;
      padding: 40px 24px;
      overflow-y: auto;
    }
    .md-modal.active {
      display: flex;
    }
    .md-modal-content {
      max-width: 720px;
      width: 100%;
      margin: auto;
      display: flex;
      flex-direction: column;
    }
    .md-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .md-modal-header h3 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .md-modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 4px 10px;
      border-radius: 6px;
      margin-left: 12px;
      flex-shrink: 0;
    }
    .md-modal-body {
      padding: 24px 32px 32px;
    }

    /* Markdown content - structure */
    .md-content {
      line-height: 1.4;
      font-size: 1rem;
      max-width: 65ch;
    }
    .md-content > *:first-child {
      margin-top: 0;
    }
    .md-content > *:last-child {
      margin-bottom: 0;
    }
    .md-content h1, .md-content h2, .md-content h3, .md-content h4 {
      margin-top: 1.25em;
      margin-bottom: 0.4em;
      font-weight: 600;
      line-height: 1.2;
    }
    .md-content h1 { font-size: 1.75rem; padding-bottom: 0.3em; margin-top: 0; }
    .md-content h2 { font-size: 1.375rem; padding-bottom: 0.2em; margin-top: 1.5em; }
    .md-content h3 { font-size: 1.125rem; }
    .md-content h4 { font-size: 1rem; }
    .md-content p { margin: 0.6em 0; }
    .md-content ul, .md-content ol { margin: 0.5em 0; padding-left: 1.25em; }
    .md-content li { margin: 0.15em 0; line-height: 1.35; }
    .md-content li ul, .md-content li ol { margin: 0.1em 0 0.6em 0; }
    .md-content code {
      padding: 0.2em 0.5em;
      border-radius: 4px;
      font-size: 0.875em;
    }
    .md-content pre {
      padding: 16px 20px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1.5em 0;
      font-size: 0.875rem;
      line-height: 1.6;
    }
    .md-content pre code {
      background: none;
      padding: 0;
      color: inherit;
      font-size: inherit;
    }
    .md-content blockquote {
      margin: 1.5em 0;
      padding: 0.5em 0 0.5em 1.25em;
      font-style: italic;
    }
    .md-content a {
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    .md-content a:hover {
      text-decoration-thickness: 2px;
    }
    .md-content hr {
      border: none;
      margin: 2.5em 0;
      height: 1px;
    }
    .md-content img {
      max-width: 100%;
      border-radius: 8px;
      margin: 1.5em 0;
      display: block;
    }
    .md-content table {
      border-collapse: collapse;
      width: 100%;
      margin: 1.5em 0;
      font-size: 0.9375rem;
    }
    .md-content th, .md-content td {
      padding: 10px 14px;
      text-align: left;
    }
    .md-content th {
      font-weight: 600;
    }

    /* File type icons */
    .file-icon {
      width: 16px;
      height: 16px;
      margin-right: 8px;
      flex-shrink: 0;
      vertical-align: middle;
      opacity: 0.7;
    }
    .links a {
      display: inline-flex;
      align-items: center;
    }
    .links a:hover .file-icon {
      opacity: 1;
    }

    /* Inline editing - structure */
    .editable {
      cursor: text;
      border-radius: 4px;
      transition: background 0.15s ease;
    }
    .editable[data-placeholder]:empty::before {
      content: attr(data-placeholder);
      font-style: italic;
    }

    /* Quick notes - structure */
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
    }
    .quick-note-text {
      flex: 1;
      min-width: 0;
    }
    .quick-note-delete {
      background: none;
      border: none;
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
    .todo-checkbox {
      width: 18px;
      height: 18px;
      margin: 0;
      cursor: pointer;
      flex-shrink: 0;
    }
    .add-note-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.15s ease;
    }
    .add-note-actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }
    .add-note-actions .add-note-btn {
      margin-top: 0;
    }

    /* Save indicator */
    .save-indicator {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 10px 16px;
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

    /* Drag & Drop - structure */
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
  `;
}
