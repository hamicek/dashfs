import { writeFileSync, existsSync } from "fs";
import { resolve, basename } from "path";
import { ProjectConfig, CONFIG_FILE } from "../types.js";

export async function init() {
  const cwd = process.cwd();
  const configPath = resolve(cwd, CONFIG_FILE);

  if (existsSync(configPath)) {
    console.log(`⚠️  ${CONFIG_FILE} already exists.`);
    console.log(`   Use 'dashfs scan' to update it based on folder structure.`);
    return;
  }

  const folderName = basename(cwd);

  const config: ProjectConfig = {
    title: folderName,
    description: "",
    docs: [],
    repos: [],
    links: [],
    quickNotes: []
  };

  writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");

  console.log(`✅ Created ${CONFIG_FILE}`);
  console.log(`   Project title: "${folderName}"`);
  console.log(``);
  console.log(`Next steps:`);
  console.log(`   1. Run 'dashfs scan' to detect files and folders`);
  console.log(`   2. Edit ${CONFIG_FILE} to customize`);
  console.log(`   3. Run 'dashfs generate' to create dashboard.html`);
}
