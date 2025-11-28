export type DocLink = {
  label: string;
  path: string;
};

export type RepoLink = {
  label: string;
  path: string;
};

export type ExtLink = {
  label: string;
  url: string;
};

export type ProjectConfig = {
  title: string;
  description?: string;
  bearNoteUrl?: string;
  obsidianUrl?: string;
  contract?: string;
  docs?: DocLink[];
  repos?: RepoLink[];
  links?: ExtLink[];
  quickNotes?: string[];
};

export const CONFIG_FILE = "project.config.json";
export const OUTPUT_FILE = "dashboard.html";
