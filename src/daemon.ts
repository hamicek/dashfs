// Daemon management utilities for DashFS server

import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from "fs";
import { homedir, tmpdir } from "os";
import { join } from "path";
import { request as httpRequest } from "http";

// DashFS config directory
const DASHFS_DIR = join(homedir(), ".dashfs");
const PID_FILE = join(DASHFS_DIR, "server.pid");
const LOG_FILE = join(DASHFS_DIR, "server.log");

// Registry is still in tmpdir for backwards compatibility
export const REGISTRY_FILE = join(tmpdir(), "dashfs-projects.json");

export const PORT = 3030;

// Ensure ~/.dashfs directory exists
export function ensureDashfsDir(): void {
  if (!existsSync(DASHFS_DIR)) {
    mkdirSync(DASHFS_DIR, { recursive: true });
  }
}

// Save server PID
export function savePid(pid: number): void {
  ensureDashfsDir();
  writeFileSync(PID_FILE, pid.toString(), "utf-8");
}

// Get saved server PID
export function getPid(): number | null {
  if (!existsSync(PID_FILE)) {
    return null;
  }
  try {
    const pid = parseInt(readFileSync(PID_FILE, "utf-8").trim(), 10);
    return isNaN(pid) ? null : pid;
  } catch {
    return null;
  }
}

// Remove PID file
export function removePid(): void {
  if (existsSync(PID_FILE)) {
    unlinkSync(PID_FILE);
  }
}

// Check if a process with given PID is running
export function isProcessRunning(pid: number): boolean {
  try {
    // Signal 0 doesn't kill the process, just checks if it exists
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

// Check if server is running via HTTP
export function isServerRunning(): Promise<boolean> {
  return new Promise((resolve) => {
    const req = httpRequest(
      { host: "localhost", port: PORT, path: "/__api/projects", timeout: 1000 },
      () => resolve(true)
    );
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

// Get server status
export interface ServerStatus {
  running: boolean;
  pid: number | null;
  pidFileExists: boolean;
  httpResponding: boolean;
}

export async function getServerStatus(): Promise<ServerStatus> {
  const pid = getPid();
  const pidFileExists = pid !== null;
  const processRunning = pid !== null && isProcessRunning(pid);
  const httpResponding = await isServerRunning();

  return {
    running: processRunning && httpResponding,
    pid: processRunning ? pid : null,
    pidFileExists,
    httpResponding,
  };
}

// Clean up stale PID file
export async function cleanupStalePid(): Promise<void> {
  const status = await getServerStatus();
  if (status.pidFileExists && !status.running) {
    removePid();
  }
}

// Get log file path
export function getLogFile(): string {
  ensureDashfsDir();
  return LOG_FILE;
}

// Get DashFS directory path
export function getDashfsDir(): string {
  return DASHFS_DIR;
}
