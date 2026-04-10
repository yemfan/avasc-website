/**
 * Loads `.env.local` into the child process env (overrides inherited DATABASE_URL
 * from the shell so Prisma/Supabase CLI match Next.js local config).
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const envPath = path.join(root, ".env.local");

const raw = fs.readFileSync(envPath, "utf8");
const parsed = dotenv.parse(raw);

const env = { ...process.env };
delete env.DATABASE_URL;
for (const [k, v] of Object.entries(parsed)) {
  if (v !== undefined && v !== "") env[k] = v;
}

const mode = process.argv[2];

if (mode === "migrate:supabase") {
  const dbUrl = env.DATABASE_URL;
  if (!dbUrl) {
    console.error("Set DATABASE_URL in .env.local");
    process.exit(1);
  }
  const r = spawnSync(
    "npx",
    ["supabase", "db", "push", "--db-url", dbUrl, "--yes"],
    { stdio: "inherit", env, cwd: root, shell: true },
  );
  process.exit(r.status ?? 1);
}

/** Mark Supabase migration version(s) as applied without running SQL (fixes partial DB + db push conflicts). */
if (mode === "migrate:supabase:repair-applied") {
  const versions = process.argv.slice(3);
  const dbUrl = env.DATABASE_URL;
  if (!dbUrl) {
    console.error("Set DATABASE_URL in .env.local");
    process.exit(1);
  }
  if (versions.length === 0) {
    console.error(
      "Usage: node scripts/run-with-env-local.mjs migrate:supabase:repair-applied <version> [version...]\n" +
        "Example: ... repair-applied 20260325120000",
    );
    process.exit(1);
  }
  const r = spawnSync(
    "npx",
    [
      "supabase",
      "migration",
      "repair",
      ...versions,
      "--status",
      "applied",
      "--db-url",
      dbUrl,
      "--yes",
    ],
    { stdio: "inherit", env, cwd: root, shell: true },
  );
  process.exit(r.status ?? 1);
}

if (mode === "migrate:prisma") {
  const args = process.argv.slice(3);
  const prismaArgs = args.length > 0 ? args : ["migrate", "deploy"];
  const r = spawnSync("npx", ["prisma", ...prismaArgs], {
    stdio: "inherit",
    env,
    cwd: root,
    shell: true,
  });
  process.exit(r.status ?? 1);
}

console.error(
  "Usage: node scripts/run-with-env-local.mjs <migrate:supabase|migrate:supabase:repair-applied|migrate:prisma> [args...]",
);
process.exit(1);
