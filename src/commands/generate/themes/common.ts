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
      align-items: center;
      padding: 24px;
    }
    .md-modal.active {
      display: flex;
    }
    .md-modal-content {
      max-width: 800px;
      width: 100%;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .md-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
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
      padding: 4px 8px;
      border-radius: 6px;
    }
    .md-modal-body {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
    }

    /* Markdown content - structure */
    .md-content {
      line-height: 1.7;
    }
    .md-content h1, .md-content h2, .md-content h3, .md-content h4 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: 600;
      line-height: 1.3;
    }
    .md-content h1 { font-size: 1.75rem; padding-bottom: 0.3em; }
    .md-content h2 { font-size: 1.5rem; padding-bottom: 0.3em; }
    .md-content h3 { font-size: 1.25rem; }
    .md-content h4 { font-size: 1rem; }
    .md-content p { margin: 1em 0; }
    .md-content ul, .md-content ol { margin: 1em 0; padding-left: 2em; }
    .md-content li { margin: 0.25em 0; }
    .md-content code {
      padding: 0.2em 0.4em;
      border-radius: 4px;
      font-size: 0.9em;
    }
    .md-content pre {
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
      margin: 1em 0;
      padding-left: 1em;
    }
    .md-content a {
      text-decoration: none;
    }
    .md-content a:hover {
      text-decoration: underline;
    }
    .md-content hr {
      border: none;
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
      padding: 8px 12px;
      text-align: left;
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
