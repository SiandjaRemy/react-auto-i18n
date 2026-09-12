import path from "path";
import fs from "fs";
import chalk from "chalk";
import { logger } from "../utils/logger";
import {
  getConfigPath,
  CONFIG_FILENAME,
  DEFAULT_CONFIG,
} from "../utils/config";
import { loadConfig } from "../utils/config";
import { generateInitialI18nFile } from "../utils/i18n-file";

interface InitOptions {
  path: string;
}

/**
 * `rai init`
 *
 * Bootstraps a project for i18n in three steps:
 *   1. Installs missing peer dependencies (i18next, react-i18next)
 *   2. Generates rai.config.ts with typed defaults
 *   3. Generates the initial i18n.ts file at config.i18nFilePath
 *
 * The i18n.ts file is generated with no locale imports since no
 * locales exist yet. Run `rai scan` to populate it.
 *
 * If rai.config.ts already exists, its settings are respected when
 * generating i18n.ts (so i18nFilePath and localesDir are honoured).
 */
export async function init(options: InitOptions): Promise<void> {
  const appRoot = path.resolve(options.path);
  const configPath = getConfigPath(appRoot);

  logger.section("rai — Init");

  // ── Step 1: Generate rai.config.ts ────────────────────────────────────────
  logger.section("Generating config file...");

  if (fs.existsSync(configPath)) {
    logger.warn(
      `${CONFIG_FILENAME} already exists — skipping.\n` +
        `  Delete it and re-run "rai init" to regenerate.`,
    );
  } else {
    const configContent = `import { defineConfig } from 'react-auto-i18n'

export default defineConfig({
  defaultLanguage: 'en',
  localesDir: 'locales',
  localeFileName: null,
  maxKeyLength: 60,
  detectAlerts: true,
  detectThrows: true,
  customDetectCalls: [],
  exclude: [],
  targetLanguages: [],
  i18nFilePath: 'src/i18n.ts',
  addUseClientDirective: false,
})
`;
    fs.writeFileSync(configPath, configContent, "utf-8");
    logger.success(`Created ${CONFIG_FILENAME}`);
  }

  // ── Step 2: Generate i18n.ts ──────────────────────────────────────────────
  /**
   * Load the config (existing or just-created) so we respect the user's
   * i18nFilePath and localesDir settings when generating i18n.ts.
   *
   * If loading fails for any reason, fall back to DEFAULT_CONFIG values
   * so init never fails completely.
   */
  logger.section("Generating i18n config file...");

  const config = (await loadConfig(appRoot)) ?? DEFAULT_CONFIG;
  generateInitialI18nFile(appRoot, config);

  // ── Next steps ─────────────────────────────────────────────────────────────
  logger.section("Setup complete");
  logger.info(`
  Two files were created:

    ${chalk.cyan(CONFIG_FILENAME)}
      Hover any field for documentation.
      Press Ctrl+Space to see all available options.

    ${chalk.cyan(config.i18nFilePath ?? "src/i18n.ts")}
      Import this in your app entry point before any component renders:
      ${chalk.gray(`// App.tsx or app/_layout.tsx — must be first import`)}
      ${chalk.cyan(`import '${resolveEntryImportPath(appRoot, config.i18nFilePath ?? "src/i18n.ts")}'`)}

  Next steps:
    1. Review ${CONFIG_FILENAME} and adjust settings if needed
    2. Commit the generated files
    3. Run:
         ${chalk.cyan("rai scan")}
  `);
}

/**
 * Computes how the user should import i18n.ts from their entry point.
 *
 * We check for common entry point locations and compute the relative
 * path from that entry point to i18n.ts.
 *
 * Falls back to a generic suggestion if no entry point is detected.
 */
function resolveEntryImportPath(appRoot: string, i18nFilePath: string): string {
  const candidates = [
    "app/_layout.tsx",
    "app/_layout.ts",
    "src/app/_layout.tsx",
    "src/app/_layout.ts",
    "App.tsx",
    "App.ts",
    "src/App.tsx",
    "src/App.ts",
  ];

  const i18nAbs = path.join(appRoot, i18nFilePath);

  for (const candidate of candidates) {
    const candidateAbs = path.join(appRoot, candidate);
    if (fs.existsSync(candidateAbs)) {
      const entryDir = path.dirname(candidateAbs);
      return path
        .relative(entryDir, i18nAbs)
        .replace(/\\/g, "/")
        .replace(/\.ts$/, "")
        .replace(/^([^.])/, "./$1");
    }
  }

  // No entry point detected — give a generic relative path from project root
  return `./${i18nFilePath.replace(/\.ts$/, "")}`;
}
