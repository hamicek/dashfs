import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "fs";
import { resolve, basename, extname } from "path";
import { ProjectConfig, CONFIG_FILE, DocLink, RepoLink } from "../types.js";

// Folders that typically contain git repos
const REPO_FOLDERS = ["repos", "repositories", "src", "projects"];

// Folders that typically contain documents
const DOC_FOLDERS = ["docs", "documents", "documentation"];

// Folders that typically contain notes
const NOTE_FOLDERS = ["notes", "poznámky"];

// Document extensions to detect
const DOC_EXTENSIONS = [".pdf", ".md", ".txt", ".docx", ".doc"];

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

  for (const entry of entries) {
    const fullPath = resolve(cwd, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      // Check if it's a repo folder containing git repos
      if (REPO_FOLDERS.includes(entry.toLowerCase())) {
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
      if (DOC_FOLDERS.includes(entry.toLowerCase())) {
        const subEntries = readdirSync(fullPath);
        for (const subEntry of subEntries) {
          const ext = extname(subEntry).toLowerCase();
          if (DOC_EXTENSIONS.includes(ext)) {
            foundDocs.push({
              label: subEntry.replace(ext, ""),
              path: `${entry}/${subEntry}`
            });
          }
        }
      }

      // Check if folder itself is a git repo (direct in root)
      const gitPath = resolve(fullPath, ".git");
      if (existsSync(gitPath) && !REPO_FOLDERS.includes(entry.toLowerCase())) {
        foundRepos.push({
          label: entry,
          path: entry
        });
      }
    } else if (stat.isFile()) {
      // Check for documents in root
      const ext = extname(entry).toLowerCase();
      if (DOC_EXTENSIONS.includes(ext)) {
        // Skip config and common non-project files
        if (!entry.startsWith(".") && entry !== "README.md" && entry !== CONFIG_FILE) {
          foundDocs.push({
            label: entry.replace(ext, ""),
            path: entry
          });
        }
      }
    }
  }

  // Merge found items with existing config (avoid duplicates)
  const existingRepoPaths = new Set((config.repos ?? []).map(r => r.path));
  const existingDocPaths = new Set((config.docs ?? []).map(d => d.path));

  let newRepos = 0;
  let newDocs = 0;

  for (const repo of foundRepos) {
    if (!existingRepoPaths.has(repo.path)) {
      config.repos = config.repos ?? [];
      config.repos.push(repo);
      newRepos++;
      console.log(`  + repo: ${repo.path}`);
    }
  }

  for (const doc of foundDocs) {
    if (!existingDocPaths.has(doc.path)) {
      config.docs = config.docs ?? [];
      config.docs.push(doc);
      newDocs++;
      console.log(`  + doc:  ${doc.path}`);
    }
  }

  writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");

  console.log(``);
  if (newRepos === 0 && newDocs === 0) {
    console.log(`✅ No new items found. Config is up to date.`);
  } else {
    console.log(`✅ Updated ${CONFIG_FILE}`);
    console.log(`   Added ${newRepos} repo(s), ${newDocs} document(s)`);
  }
  console.log(``);
  console.log(`Run 'dashfs generate' to create dashboard.html`);
}
