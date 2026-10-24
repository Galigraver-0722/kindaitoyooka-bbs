import { readFileSync } from "node:fs";

/** Load `.env` the way Next.js does, so scripts work without extra flags. */
export function loadLocalEnv(): void {
  if (process.env.DATABASE_URL) {
    return;
  }

  try {
    const file = readFileSync(new URL("../.env", import.meta.url), "utf8");
    for (const line of file.split("\n")) {
      const match = /^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (!match) {
        continue;
      }
      const value = match[2].replace(/^["']|["']$/g, "");
      process.env[match[1]] ??= value;
    }
  } catch {
    // No .env file: rely on the caller's environment.
  }
}
