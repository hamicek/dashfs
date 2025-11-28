import { watch as fsWatch, existsSync } from "fs";
import { resolve, basename } from "path";
import { CONFIG_FILE, OUTPUT_FILE } from "../types.js";
import { generate } from "./generate.js";

export async function watch() {
  const cwd = process.cwd();
  const configPath = resolve(cwd, CONFIG_FILE);

  if (!existsSync(configPath)) {
    console.error(`❌ ${CONFIG_FILE} not found.`);
    console.error(`   Run 'dashfs init' or 'dashfs scan' first.`);
    process.exit(1);
  }

  // Generate initial dashboard
  console.log(`👀 Watching for changes...`);
  console.log(`   Press Ctrl+C to stop\n`);

  await generate();

  // Watch config file
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  fsWatch(configPath, async (eventType) => {
    if (eventType === "change") {
      // Debounce to avoid multiple rapid regenerations
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(async () => {
        console.log(`\n🔄 Config changed, regenerating...`);
        try {
          await generate();
        } catch (err) {
          console.error(`❌ Error regenerating: ${(err as Error).message}`);
        }
      }, 100);
    }
  });

  // Keep process running
  process.on("SIGINT", () => {
    console.log("\n👋 Stopped watching");
    process.exit(0);
  });
}
