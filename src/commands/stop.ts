// Stop DashFS server or unregister a project

import { request as httpRequest } from "http";
import { getServerStatus, removePid, PORT } from "../daemon.js";
import { getRegistry, getProjectByName } from "../registry.js";

// Unregister a project via API
function unregisterProjectApi(projectName: string): Promise<boolean> {
  return new Promise((resolve) => {
    const req = httpRequest(
      {
        host: "localhost",
        port: PORT,
        path: `/__api/unregister/${projectName}`,
        method: "POST",
        timeout: 2000,
      },
      (res) => resolve(res.statusCode === 200)
    );
    req.on("error", () => resolve(false));
    req.end();
  });
}

export async function stop(projectNameOrForce?: string | boolean, force: boolean = false) {
  // Handle different argument patterns
  let projectName: string | undefined;

  if (typeof projectNameOrForce === "string") {
    if (projectNameOrForce === "--force" || projectNameOrForce === "-f") {
      force = true;
    } else {
      projectName = projectNameOrForce;
    }
  } else if (projectNameOrForce === true) {
    force = true;
  }

  const status = await getServerStatus();

  if (!status.running) {
    if (status.pidFileExists) {
      removePid();
      console.log("🧹 Cleaned up stale PID file.");
    } else {
      console.log("📭 No DashFS server running.");
    }
    return;
  }

  // If project name specified, unregister just that project
  if (projectName) {
    const project = getProjectByName(projectName);
    if (!project) {
      // Try to find by partial match
      const projects = getRegistry();
      const matches = projects.filter(p =>
        p.name.includes(projectName!) ||
        p.title.toLowerCase().includes(projectName!.toLowerCase())
      );

      if (matches.length === 0) {
        console.log(`❌ Project "${projectName}" not found.`);
        console.log(`\nRegistered projects:`);
        for (const p of projects) {
          console.log(`   • ${p.name} (${p.title})`);
        }
        return;
      } else if (matches.length > 1) {
        console.log(`❌ Multiple projects match "${projectName}":`);
        for (const p of matches) {
          console.log(`   • ${p.name} (${p.title})`);
        }
        console.log(`\nPlease be more specific.`);
        return;
      }
      projectName = matches[0].name;
    }

    const success = await unregisterProjectApi(projectName);
    if (success) {
      console.log(`📤 Project "${projectName}" unregistered.`);

      // Check if server auto-shutdown (last project)
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newStatus = await getServerStatus();
      if (!newStatus.running) {
        console.log(`\n📭 Server stopped (no projects remaining).`);
      }
    } else {
      console.log(`❌ Failed to unregister project "${projectName}".`);
    }
    return;
  }

  // Stop entire server
  const pid = status.pid!;

  try {
    if (force) {
      process.kill(pid, "SIGKILL");
      console.log(`💀 Server killed (PID: ${pid})`);
    } else {
      process.kill(pid, "SIGTERM");
      console.log(`👋 Server stopped (PID: ${pid})`);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const newStatus = await getServerStatus();
    if (newStatus.running) {
      console.log(`\n⚠️  Server still running. Try 'dashfs stop --force' to force kill.`);
    } else {
      removePid();
      console.log(`\n✅ Server at http://localhost:${PORT}/ is now stopped.`);
    }
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ESRCH") {
      removePid();
      console.log("🧹 Server was not running. Cleaned up PID file.");
    } else {
      console.error(`❌ Failed to stop server: ${(err as Error).message}`);
    }
  }
}
