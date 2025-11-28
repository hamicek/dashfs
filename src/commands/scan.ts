import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "fs";
import { resolve, basename, extname } from "path";
import { ProjectConfig, CONFIG_FILE, DocLink, RepoLink, NoteLink, ImageLink } from "../types.js";

// Folders that typically contain git repos
const REPO_FOLDERS = ["repos", "repositories", "src", "projects"];

// Folders that typically contain documents
const DOC_FOLDERS = ["docs", "documents", "documentation"];

// Folders that typically contain notes
const NOTE_FOLDERS = ["notes", "poznámky", "poznámky"];

// Folders that typically contain images/design
const IMAGE_FOLDERS = ["images", "design", "assets", "img", "media"];

// Document extensions to detect
const DOC_EXTENSIONS = [".pdf", ".docx", ".doc", ".xls", ".xlsx", ".ppt", ".pptx"];

// Note/text extensions
const NOTE_EXTENSIONS = [".md", ".txt", ".rtf"];

// Image extensions
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".fig", ".sketch"];

export async function scan() {
  const cwd = process.cwd();
  const configPath = resolve(cwd, CONFIG_FILE);

  let config: ProjectConfig;

  if (existsSync(configPath)) {
    const raw = readFileSync(configPath, "utf-8");
    config = JSON.parse(raw);
    console.log(`📂 Scanning folder and updating ${CONFIG_FILE}...\n`);
  } else {
    const folderName = basename(cwd);
    config = {
      title: folderName,
      description: "",
      docs: [],
      repos: [],
      links: [],
      quickNotes: []
    };
    console.log(`📂 Scanning folder and creating ${CONFIG_FILE}...\n`);
  }

  const entries = readdirSync(cwd);

  let foundRepos: RepoLink[] = [];
  let foundDocs: DocLink[] = [];
  let foundNotes: NoteLink[] = [];
  let foundImages: ImageLink[] = [];

  // Helper to scan folder for files with specific extensions
  function scanFolderForFiles(folderPath: string, folderName: string, extensions: string[]): { label: string; path: string }[] {
    const results: { label: string; path: string }[] = [];
    try {
      const subEntries = readdirSync(folderPath);
      for (const subEntry of subEntries) {
        const ext = extname(subEntry).toLowerCase();
        if (extensions.includes(ext)) {
          results.push({
            label: subEntry.replace(ext, ""),
            path: `${folderName}/${subEntry}`
          });
        }
      }
    } catch {
      // Ignore read errors
    }
    return results;
  }

  for (const entry of entries) {
    const fullPath = resolve(cwd, entry);
    const stat = statSync(fullPath);
    const entryLower = entry.toLowerCase();

    if (stat.isDirectory()) {
      // Check if it's a repo folder containing git repos
      if (REPO_FOLDERS.includes(entryLower)) {
        const subEntries = readdirSync(fullPath);
        for (const subEntry of subEntries) {
          const subPath = resolve(fullPath, subEntry);
          const subStat = statSync(subPath);
          if (subStat.isDirectory()) {
            // Check if it's a git repo
            const gitPath = resolve(subPath, ".git");
            if (existsSync(gitPath)) {
              foundRepos.push({
                label: subEntry,
                path: `${entry}/${subEntry}`
              });
            }
          }
        }
      }

      // Check if it's a docs folder
      if (DOC_FOLDERS.includes(entryLower)) {
        foundDocs.push(...scanFolderForFiles(fullPath, entry, DOC_EXTENSIONS));
        // Also scan for notes (md, txt) in docs folder
        foundNotes.push(...scanFolderForFiles(fullPath, entry, NOTE_EXTENSIONS));
      }

      // Check if it's a notes folder
      if (NOTE_FOLDERS.includes(entryLower)) {
        foundNotes.push(...scanFolderForFiles(fullPath, entry, NOTE_EXTENSIONS));
      }

      // Check if it's an images/design folder
      if (IMAGE_FOLDERS.includes(entryLower)) {
        foundImages.push(...scanFolderForFiles(fullPath, entry, IMAGE_EXTENSIONS));
      }

      // Check if folder itself is a git repo (direct in root)
      const gitPath = resolve(fullPath, ".git");
      if (existsSync(gitPath) && !REPO_FOLDERS.includes(entryLower)) {
        foundRepos.push({
          label: entry,
          path: entry
        });
      }
    } else if (stat.isFile()) {
      // Skip hidden files and config
      if (entry.startsWith(".") || entry === CONFIG_FILE) continue;

      const ext = extname(entry).toLowerCase();
      const label = entry.replace(ext, "");

      // Check for documents in root
      if (DOC_EXTENSIONS.includes(ext)) {
        foundDocs.push({ label, path: entry });
      }
      // Check for notes in root
      else if (NOTE_EXTENSIONS.includes(ext) && entry !== "README.md") {
        foundNotes.push({ label, path: entry });
      }
      // Check for images in root
      else if (IMAGE_EXTENSIONS.includes(ext)) {
        foundImages.push({ label, path: entry });
      }
    }
  }

  // Merge found items with existing config (avoid duplicates)
  const existingRepoPaths = new Set((config.repos ?? []).map(r => r.path));
  const existingDocPaths = new Set((config.docs ?? []).map(d => d.path));
  const existingNotePaths = new Set((config.notes ?? []).map(n => n.path));
  const existingImagePaths = new Set((config.images ?? []).map(i => i.path));

  let newRepos = 0;
  let newDocs = 0;
  let newNotes = 0;
  let newImages = 0;

  for (const repo of foundRepos) {
    if (!existingRepoPaths.has(repo.path)) {
      config.repos = config.repos ?? [];
      config.repos.push(repo);
      newRepos++;
      console.log(`  + repo:  ${repo.path}`);
    }
  }

  for (const doc of foundDocs) {
    if (!existingDocPaths.has(doc.path)) {
      config.docs = config.docs ?? [];
      config.docs.push(doc);
      newDocs++;
      console.log(`  + doc:   ${doc.path}`);
    }
  }

  for (const note of foundNotes) {
    if (!existingNotePaths.has(note.path)) {
      config.notes = config.notes ?? [];
      config.notes.push(note);
      newNotes++;
      console.log(`  + note:  ${note.path}`);
    }
  }

  for (const image of foundImages) {
    if (!existingImagePaths.has(image.path)) {
      config.images = config.images ?? [];
      config.images.push(image);
      newImages++;
      console.log(`  + image: ${image.path}`);
    }
  }

  writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");

  const totalNew = newRepos + newDocs + newNotes + newImages;
  console.log(``);
  if (totalNew === 0) {
    console.log(`✅ No new items found. Config is up to date.`);
  } else {
    console.log(`✅ Updated ${CONFIG_FILE}`);
    const parts = [];
    if (newRepos > 0) parts.push(`${newRepos} repo(s)`);
    if (newDocs > 0) parts.push(`${newDocs} doc(s)`);
    if (newNotes > 0) parts.push(`${newNotes} note(s)`);
    if (newImages > 0) parts.push(`${newImages} image(s)`);
    console.log(`   Added ${parts.join(", ")}`);
  }
  console.log(``);
  console.log(`Run 'dashfs generate' to create dashboard.html`);
}
