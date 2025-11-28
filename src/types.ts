export type DocLink = {
  label: string;
  path: string;
};

export type RepoLink = {
  label: string;
  path: string;
};

export type NoteLink = {
  label: string;
  path: string;
};

export type ImageLink = {
  label: string;
  path: string;
};

export type ExtLink = {
  label: string;
  url: string;
};

// Available section types for ordering
export type SectionType = "docs" | "repos" | "notes" | "images" | "links" | "noteApps" | "quickNotes";

// Available themes
export type ThemeType = "default" | "terminal" | "notion" | "glass" | "paper" | "dashboard" | "nord" | "brutalist" | "sunset";

export type ProjectConfig = {
  title: string;
  description?: string;
  theme?: ThemeType;
  bearNoteUrl?: string;
  obsidianUrl?: string;
  contract?: string;
  docs?: DocLink[];
  repos?: RepoLink[];
  notes?: NoteLink[];
  images?: ImageLink[];
  links?: ExtLink[];
  quickNotes?: string[];
  sectionOrder?: SectionType[];
};

export const CONFIG_FILE = "project.config.json";
export const OUTPUT_FILE = "dashboard.html";
