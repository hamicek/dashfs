// Clear all registered projects from registry

import { saveRegistry, getRegistry } from "../registry.js";
import { getServerStatus } from "../daemon.js";

export async function clear() {
  const status = await getServerStatus();
  const projects = getRegistry();

  if (projects.length === 0) {
    console.log("📭 No projects registered.");
    return;
  }

  // Clear registry
  saveRegistry([]);

  console.log(`🧹 Cleared ${projects.length} project${projects.length !== 1 ? "s" : ""} from registry.`);

  if (status.running) {
    console.log(`\n⚠️  Server is still running. Use 'dashfs stop' to stop it.`);
  }
}
