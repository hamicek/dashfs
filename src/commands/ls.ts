// List running DashFS projects

import { getRegistry } from "../registry.js";
import { getServerStatus, PORT } from "../daemon.js";

export async function ls() {
  const status = await getServerStatus();

  if (!status.running) {
    console.log("📭 No DashFS server running.\n");
    console.log("   Run 'dashfs serve' in a project directory to start.");
    return;
  }

  const projects = getRegistry();

  console.log(`\n🚀 DashFS server running at http://localhost:${PORT}/`);
  console.log(`   PID: ${status.pid}\n`);

  if (projects.length === 0) {
    console.log("📭 No projects registered.\n");
    return;
  }

  console.log(`📁 ${projects.length} project${projects.length !== 1 ? "s" : ""} registered:\n`);

  for (const project of projects) {
    const watchIndicator = project.watchMode ? " 👀" : "";
    console.log(`   • ${project.title}${watchIndicator}`);
    console.log(`     URL: http://localhost:${PORT}/${project.name}/`);
    console.log(`     Path: ${project.path}`);
    console.log("");
  }

  console.log(`Use 'dashfs stop' to stop the server.`);
}
