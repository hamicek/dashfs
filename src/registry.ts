import { readFileSync, writeFileSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const REGISTRY_FILE = join(tmpdir(), "dashfs-projects.json");

export interface RegisteredProject {
  name: string;
  path: string;
  title: string;
  watchMode: boolean;
  registeredAt: number;
}

export function getRegistry(): RegisteredProject[] {
  if (!existsSync(REGISTRY_FILE)) {
    return [];
  }
  try {
    const raw = readFileSync(REGISTRY_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveRegistry(projects: RegisteredProject[]): void {
  writeFileSync(REGISTRY_FILE, JSON.stringify(projects, null, 2), "utf-8");
}

export function registerProject(project: Omit<RegisteredProject, "registeredAt">): void {
  const projects = getRegistry();

  // Remove existing entry for this path
  const filtered = projects.filter((p) => p.path !== project.path);

  // Add new entry
  filtered.push({
    ...project,
    registeredAt: Date.now(),
  });

  saveRegistry(filtered);
}

export function unregisterProject(path: string): void {
  const projects = getRegistry();
  const filtered = projects.filter((p) => p.path !== path);
  saveRegistry(filtered);
}

export function getProjectByName(name: string): RegisteredProject | undefined {
  const projects = getRegistry();
  return projects.find((p) => p.name === name);
}
