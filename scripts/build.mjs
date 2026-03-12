import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { promises as fs } from "node:fs";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");
const tscBin = require.resolve("typescript/bin/tsc");
const projectRoot = process.cwd();

function withBuildEnv(extra = {}) {
  return {
    ...process.env,
    CI: "1",
    NEXT_TELEMETRY_DISABLED: "1",
    NODE_OPTIONS: [process.env.NODE_OPTIONS, "--max-old-space-size=6144"]
      .filter(Boolean)
      .join(" "),
    ...extra
  };
}

async function getBuildCwd() {
  const linkPath = path.join(tmpdir(), "laloge-crm-v2-build");

  try {
    await fs.rm(linkPath, { force: true, recursive: true });
  } catch {}

  await fs.symlink(projectRoot, linkPath, "dir");
  console.log(`ℹ Utilisation d'un chemin de build sans espaces: ${linkPath}`);

  return linkPath;
}

async function cleanNextArtifacts(targetCwd) {
  await fs.rm(path.join(targetCwd, ".next"), { recursive: true, force: true });
}

async function ensureBuildScaffold(targetCwd) {
  await fs.mkdir(path.join(targetCwd, ".next", "server", "pages"), { recursive: true });
  await fs.mkdir(path.join(targetCwd, ".next", "export"), { recursive: true });
  await fs.mkdir(path.join(targetCwd, ".next", "cache", "webpack", "client-production"), {
    recursive: true
  });
  await fs.mkdir(path.join(targetCwd, ".next", "cache", "webpack", "server-production"), {
    recursive: true
  });

  await fs.writeFile(
    path.join(targetCwd, ".next", "server", "next-font-manifest.json"),
    JSON.stringify({
      pages: {},
      app: {},
      pagesUsingSizeAdjust: false,
      appUsingSizeAdjust: false
    })
  );
}

const TRACE_PLACEHOLDER = JSON.stringify({ version: 1, files: [] });

async function ensureTracePlaceholder(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, TRACE_PLACEHOLDER);
  }
}

function startTracePlaceholderWorkaround(targetCwd) {
  const distServer = path.join(targetCwd, ".next", "server");
  const placeholderPaths = [
    path.join(distServer, "app", "_not-found", "page.js.nft.json"),
    path.join(distServer, "app", "_global-error", "page.js.nft.json"),
    path.join(distServer, "middleware.js.nft.json"),
    path.join(distServer, "proxy.js.nft.json")
  ];

  const tick = async () => {
    await Promise.all(placeholderPaths.map((filePath) => ensureTracePlaceholder(filePath)));
  };

  void tick();
  const timer = setInterval(() => {
    void tick();
  }, 2000);

  return () => {
    clearInterval(timer);
  };
}

function run(label, args, options = {}) {
  const { heartbeat = false, env = process.env, cwd = projectRoot } = options;

  return new Promise((resolve, reject) => {
    console.log(`\n▶ ${label}`);

    const child = spawn(process.execPath, args, {
      stdio: "inherit",
      env,
      cwd
    });

    let timer;
    if (heartbeat) {
      timer = setInterval(() => {
        console.log(`[build] ${label} en cours… ${new Date().toLocaleTimeString("fr-FR")}`);
      }, 20_000);
    }

    child.on("error", (error) => {
      if (timer) clearInterval(timer);
      reject(error);
    });

    child.on("exit", (code, signal) => {
      if (timer) clearInterval(timer);

      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `${label} a échoué ${signal ? `avec le signal ${signal}` : `avec le code ${code}`}`
        )
      );
    });
  });
}

try {
  const buildCwd = await getBuildCwd();
  await cleanNextArtifacts(buildCwd);
  await ensureBuildScaffold(buildCwd);

  await run("Génération des types Next", [nextBin, "typegen"], {
    env: withBuildEnv(),
    cwd: buildCwd
  });
  await run("Vérification TypeScript", [tscBin, "--noEmit"], {
    env: withBuildEnv(),
    cwd: buildCwd
  });
  const stopTracePlaceholderWorkaround = startTracePlaceholderWorkaround(buildCwd);

  try {
    await run("Build Next.js", [nextBin, "build", "--webpack"], {
      env: withBuildEnv(),
      heartbeat: true,
      cwd: buildCwd
    });
  } finally {
    stopTracePlaceholderWorkaround();
  }
} catch (error) {
  console.error(`\n✖ ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
