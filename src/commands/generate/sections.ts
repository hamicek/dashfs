// Section generators for the dashboard

import { resolve, extname } from "path";
import { ProjectConfig, SectionType } from "../../types.js";

// Default section order
export const DEFAULT_SECTION_ORDER: SectionType[] = [
  "docs", "repos", "notes", "images", "links", "noteApps", "quickNotes"
];

// Drag handle SVG icon
export const DRAG_HANDLE_ICON = `<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="5" cy="3" r="1.5"/><circle cx="11" cy="3" r="1.5"/><circle cx="5" cy="8" r="1.5"/><circle cx="11" cy="8" r="1.5"/><circle cx="5" cy="13" r="1.5"/><circle cx="11" cy="13" r="1.5"/></svg>`;

// Escape HTML special characters
export function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Section definition type
export type SectionDefinition = {
  title: string;
  content: string;
  hasContent: boolean;
};

// Generate documents section content
export function generateDocsSection(cfg: ProjectConfig): string {
  const docsItems = (cfg.docs ?? [])
    .map((d) => `<a href="${esc(d.path)}">${esc(d.label)}</a>`)
    .join("");

  const contractItem = cfg.contract
    ? `<a href="${esc(cfg.contract)}">Contract (PDF)</a>`
    : "";

  return contractItem + docsItems;
}

// Generate repositories section content
export function generateReposSection(cfg: ProjectConfig, projectRoot: string): string {
  return (cfg.repos ?? [])
    .map((r) => {
      const absPath = resolve(projectRoot, r.path);
      const vscodeUrl = `vscode://file/${absPath}`;
      return `<a href="${esc(vscodeUrl)}">${esc(r.label)}</a>`;
    })
    .join("");
}

// Generate notes section content
export function generateNotesSection(cfg: ProjectConfig): string {
  return (cfg.notes ?? [])
    .map((n) => {
      const ext = extname(n.path).toLowerCase();
      if (ext === ".md") {
        return `<a href="#" class="md-link" data-path="${esc(n.path)}">${esc(n.label)}</a>`;
      }
      return `<a href="${esc(n.path)}">${esc(n.label)}</a>`;
    })
    .join("");
}

// Generate images section content
export function generateImagesSection(cfg: ProjectConfig): string {
  return (cfg.images ?? [])
    .map((i) => `<a href="${esc(i.path)}" target="_blank">${esc(i.label)}</a>`)
    .join("");
}

// Generate external links section content
export function generateLinksSection(cfg: ProjectConfig): string {
  return (cfg.links ?? [])
    .map(
      (l) => `<a href="${esc(l.url)}" target="_blank" rel="noreferrer">${esc(l.label)}</a>`
    )
    .join("");
}

// Generate notes apps section content
export function generateNoteAppsSection(cfg: ProjectConfig): string {
  const notesApps: string[] = [];
  if (cfg.bearNoteUrl) {
    notesApps.push(`<a href="${esc(cfg.bearNoteUrl)}">Bear</a>`);
  }
  if (cfg.obsidianUrl) {
    notesApps.push(`<a href="${esc(cfg.obsidianUrl)}">Obsidian</a>`);
  }
  return notesApps.join("");
}

// Generate quick notes section content
export function generateQuickNotesSection(cfg: ProjectConfig): string {
  const quickNotesItems = (cfg.quickNotes ?? [])
    .map((n, i) => {
      // Check if note is a TODO item (starts with [ ] or [x])
      const todoMatch = n.match(/^\[([ x])\]\s*(.*)/);
      if (todoMatch) {
        const isChecked = todoMatch[1] === "x";
        const text = todoMatch[2];
        return `<div class="quick-note-item todo-item${isChecked ? " completed" : ""}">
      <input type="checkbox" class="todo-checkbox" data-note-index="${i}" ${isChecked ? "checked" : ""}>
      <span class="quick-note-text editable" contenteditable="true" data-note-index="${i}">${esc(text)}</span>
      <button class="quick-note-delete" data-note-index="${i}" title="Delete note">&times;</button>
    </div>`;
      }
      return `<div class="quick-note-item">
      <span class="quick-note-text editable" contenteditable="true" data-note-index="${i}">${esc(n)}</span>
      <button class="quick-note-delete" data-note-index="${i}" title="Delete note">&times;</button>
    </div>`;
    })
    .join("");

  return `<div class="quick-notes-list" id="quickNotesList">${quickNotesItems}</div>
    <div class="add-note-actions">
      <button class="add-note-btn" id="addNoteBtn">+ Add note</button>
      <button class="add-note-btn" id="addTodoBtn">+ Add TODO</button>
    </div>`;
}

// Generate all sections
export function generateSections(cfg: ProjectConfig, projectRoot: string): Record<SectionType, SectionDefinition> {
  const hasDocs = (cfg.docs ?? []).length > 0 || cfg.contract;
  const hasRepos = (cfg.repos ?? []).length > 0;
  const hasNotes = (cfg.notes ?? []).length > 0;
  const hasImages = (cfg.images ?? []).length > 0;
  const hasLinks = (cfg.links ?? []).length > 0;
  const hasNotesApps = cfg.bearNoteUrl || cfg.obsidianUrl;

  return {
    docs: {
      title: "Documents",
      content: generateDocsSection(cfg),
      hasContent: Boolean(hasDocs)
    },
    repos: {
      title: "Repositories",
      content: generateReposSection(cfg, projectRoot),
      hasContent: Boolean(hasRepos)
    },
    notes: {
      title: "Notes",
      content: generateNotesSection(cfg),
      hasContent: Boolean(hasNotes)
    },
    images: {
      title: "Design / Images",
      content: generateImagesSection(cfg),
      hasContent: Boolean(hasImages)
    },
    links: {
      title: "External Links",
      content: generateLinksSection(cfg),
      hasContent: Boolean(hasLinks)
    },
    noteApps: {
      title: "Note Apps",
      content: generateNoteAppsSection(cfg),
      hasContent: Boolean(hasNotesApps)
    },
    quickNotes: {
      title: "Quick Notes",
      content: generateQuickNotesSection(cfg),
      hasContent: true
    },
  };
}

// Generate sections HTML
export function generateSectionsHtml(cfg: ProjectConfig, projectRoot: string): string {
  const sections = generateSections(cfg, projectRoot);
  const sectionOrder = cfg.sectionOrder ?? DEFAULT_SECTION_ORDER;

  return sectionOrder
    .filter((key) => sections[key]?.hasContent)
    .map((key) => {
      const section = sections[key];
      const isQuickNotes = key === "quickNotes";
      return `<section class="card" data-section="${key}"${isQuickNotes ? ' id="quickNotesSection"' : ''} draggable="true">
      <div class="card-header">
        <span class="drag-handle" title="Drag to reorder">${DRAG_HANDLE_ICON}</span>
        <h2>${section.title}</h2>
      </div>
      ${isQuickNotes ? section.content : `<div class="links">${section.content}</div>`}
    </section>`;
    })
    .join("\n\n    ");
}
