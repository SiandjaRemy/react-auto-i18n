import path from "path";
import chalk from "chalk";
import ora from "ora";
import { logger } from "../utils/logger";
import { requireConfig, validateLocalesDir } from "../utils/config";
import { scanProject, type ExtractedString } from "../core/scanner";
import { generateLocaleFile } from "../core/scaffolder";
import {
  confirm,
  detectPackageManager,
  isExpoProject,
  isPackageInstalled,
  buildInstallCommand,
} from "../utils/prompt";

interface ScanOptions {
  path: string;
  dryRun?: boolean;
}

/**
 * `rai scan`
 *
 * Scans the entire React Native project for translatable strings
 * and generates a locale JSON file for the default language.
 *
 * Steps:
 *   1. Load and validate config
 *   2. Validate localesDir (parent must exist)
 *   3. Scan all source files using AST
 *   4. Show a preview table of what was found
 *   5. Ask for confirmation before writing
 *   6. Write the locale JSON file
 *   7. Print next steps (how to configure react-i18next)
 */
export async function scan(options: ScanOptions): Promise<void> {
  const appRoot = path.resolve(options.path);
  const isDryRun = options.dryRun ?? false;

  // ── Step 1: Load config ───────────────────────────────────────────────────
  const config = await requireConfig(appRoot);
  const localesDir = path.join(appRoot, config.localesDir);

  // ── Step 2: Validate localesDir ───────────────────────────────────────────
  /**
   * We validate before scanning so we don't do expensive AST work
   * only to fail at the file-write step with a confusing error.
   */
  const dirError = validateLocalesDir(config.localesDir, appRoot);
  if (dirError) {
    logger.error(`Invalid "localesDir" in your config:\n  ${dirError}`);
    process.exit(1);
  }

  /**
   * Build the output path string for display purposes.
   * Shown in the header so the user knows exactly where files will go.
   */
  const outputPreview = config.localeFileName
    ? `${config.localesDir}/${config.defaultLanguage}/${config.localeFileName}.json`
    : `${config.localesDir}/${config.defaultLanguage}.json`;

  logger.section("rai — Scan");
  if (isDryRun) logger.warn("  Dry run — no files will be written.\n");

  logger.info(`  App root    : ${appRoot}`);
  logger.info(`  Language    : ${config.defaultLanguage}`);
  logger.info(`  Output      : ${outputPreview}`);
  logger.info(
    `  Alerts      : ${config.detectAlerts ? "detected" : "ignored"}`,
  );
  logger.info(
    `  Throws      : ${config.detectThrows ? "detected" : "ignored"}`,
  );

  if (config.customDetectCalls.length > 0) {
    logger.info(`  Custom calls: ${config.customDetectCalls.join(", ")}`);
  }

  // ── Step 3: Scan ──────────────────────────────────────────────────────────
  logger.section("Scanning source files...");
  const spinner = ora("Scanning...").start();

  let strings: ExtractedString[];
  try {
    strings = await scanProject(appRoot, config);
    spinner.succeed(`Scan complete.`);
  } catch (err) {
    spinner.fail("Scan failed.");
    logger.error(String(err));
    process.exit(1);
  }

  if (strings.length === 0) {
    logger.warn("\n  No translatable strings found.");
    logger.info(
      "  Things to check:\n" +
        "    • Is the --path pointing to your app root?\n" +
        "    • Does your app have <Text> components with content?\n" +
        "    • Are the relevant files excluded by your config or .gitignore?",
    );
    process.exit(0);
  }

  // ── Step 4: Preview table ─────────────────────────────────────────────────
  logger.section("Strings found");
  printPreviewTable(strings);

  if (isDryRun) {
    logger.newline();
    logger.warn("Dry run complete — no files written.");
    logger.info("  Remove --dry-run to generate the locale file.");
    process.exit(0);
  }

  // ── Step 5: Confirm ───────────────────────────────────────────────────────
  logger.newline();
  const shouldProceed = await confirm(
    `Write ${strings.length} keys to ${outputPreview}?`,
  );

  if (!shouldProceed) {
    logger.info("Aborted. No files were written.");
    process.exit(0);
  }

  // ── Step 6: Write locale file ─────────────────────────────────────────────
  logger.section("Generating locale file...");

  const { filePath, keyCount } = await generateLocaleFile(
    strings,
    config.defaultLanguage,
    localesDir,
    config.localeFileName,
  );

  logger.success(
    `Generated ${path.relative(appRoot, filePath)} with ${keyCount} keys`,
  );

  // ── Step 7: Next steps ────────────────────────────────────────────────────
  printNextSteps(
    appRoot,
    config.localesDir,
    config.defaultLanguage,
    config.localeFileName,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Preview table
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Prints a summary table grouped by namespace (source file).
 *
 * Example output:
 *
 *   auth.signin  (3 strings)
 *     auth.signin.welcome_back              "Welcome back"
 *     auth.signin.sign_in                   "Sign in"
 *     auth.signin.forgot_password           "Forgot password?"
 *
 *   home  (2 strings)
 *     home.total_transactions               "Total Transactions"
 *     home.loading                          "Loading..."
 *
 *   5 total strings across 2 namespaces
 */
function printPreviewTable(strings: ExtractedString[]): void {
  const byNamespace = strings.reduce<Record<string, ExtractedString[]>>(
    (acc, s) => {
      if (!acc[s.namespace]) acc[s.namespace] = [];
      acc[s.namespace].push(s);
      return acc;
    },
    {},
  );

  const namespaces = Object.entries(byNamespace).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  for (const [namespace, items] of namespaces) {
    logger.newline();
    logger.info(
      `  ${chalk.bold(namespace)} ` +
        chalk.gray(`(${items.length} string${items.length === 1 ? "" : "s"})`),
    );

    for (const item of items) {
      const keyPart = chalk.cyan(item.fullKey.padEnd(50));
      const preview = item.translationValue.substring(0, 40);
      const ellipsis = item.translationValue.length > 40 ? "…" : "";
      const valuePart = chalk.gray(`"${preview}${ellipsis}"`);
      const paramsPart =
        item.params.length > 0
          ? chalk.yellow(` [params: ${item.params.join(", ")}]`)
          : "";

      logger.info(`    ${keyPart} ${valuePart}${paramsPart}`);
    }
  }

  logger.newline();
  logger.info(
    `  ${chalk.bold(String(strings.length))} total string(s) across ` +
      `${chalk.bold(String(namespaces.length))} namespace(s)`,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Next steps guide
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Prints setup instructions for react-i18next after locale generation.
 *
 * The import path shown adapts based on localeFileName and localesDir
 * so the user can copy-paste without modification.
 *
 * We also detect missing dependencies and show the correct install
 * command for npm, yarn, or pnpm.
 *
 * Import path logic:
 *   localesDir: 'locales', localeFileName: null
 *     → '../locales/en.json'  (assuming i18n.ts is in src/)
 *
 *   localesDir: 'src/locales', localeFileName: null
 *     → './locales/en.json'   (same directory level as src/i18n.ts)
 *
 *   localesDir: 'locales', localeFileName: 'translation'
 *     → '../locales/en/translation.json'
 *
 *   localesDir: 'src/locales', localeFileName: 'translation'
 *     → './locales/en/translation.json'
 */
function printNextSteps(
  appRoot: string,
  localesDir: string,
  defaultLang: string,
  localeFileName: string | null,
): void {
  logger.section("Next steps");

  /**
   * Compute the correct relative import path for the locale file
   * as it would appear in src/i18n.ts.
   *
   * The convention is that i18n.ts lives in src/. So:
   *   - If localesDir is 'locales' (at root), the import goes up one level: '../locales/...'
   *   - If localesDir is 'src/locales', it's at the same level as src/i18n.ts: './locales/...'
   *   - If localesDir is 'src/i18n/locales', same level: './i18n/locales/...'
   *
   * We detect whether localesDir starts with 'src/' to decide.
   */
  const isInsideSrc = localesDir.startsWith("src/");
  const localesDirFromSrc = isInsideSrc
    ? `./${localesDir.replace(/^src\//, "")}` // './locales'
    : `../${localesDir}`; // '../locales'

  const localeImportPath = localeFileName
    ? `${localesDirFromSrc}/${defaultLang}/${localeFileName}.json`
    : `${localesDirFromSrc}/${defaultLang}.json`;

  const localeOutputPath = localeFileName
    ? `${localesDir}/${defaultLang}/${localeFileName}.json`
    : `${localesDir}/${defaultLang}.json`;

  // Check which dependencies are missing
  const missing = ["i18next", "react-i18next"].filter(
    (pkg) => !isPackageInstalled(pkg, appRoot),
  );

  const pm = detectPackageManager(appRoot);
  const isExpo = isExpoProject(appRoot);
  let stepNum = 1;

  if (missing.length > 0) {
    const installCmd = buildInstallCommand(missing, pm, isExpo);
    logger.info(`
  ${stepNum++}. Install required dependencies:
       ${chalk.cyan(installCmd)}`);
  }

  logger.info(`
  ${stepNum++}. Create src/i18n.ts in your project:

${chalk.cyan(`     import i18n from 'i18next'
     import { initReactI18next } from 'react-i18next'
     import ${defaultLang} from '${localeImportPath}'

     i18n.use(initReactI18next).init({
       resources: {
         ${defaultLang}: { translation: ${defaultLang} },
       },
       lng: '${defaultLang}',
       fallbackLng: '${defaultLang}',
       interpolation: {
         escapeValue: false,
       },
     })

     export default i18n`)}

  ${stepNum++}. Import it in your app entry point (App.tsx or app/_layout.tsx):
       ${chalk.cyan(`import './src/i18n'`)}

  ${stepNum++}. Review ${localeOutputPath}, then commit:
       ${chalk.cyan(`git add .\ngit commit -m "chore: add i18n locale file"`)}

  ${stepNum++}. Then run:
       ${chalk.cyan(`rai replace`)}

       This will rewrite your source files to use t() calls automatically.
  `);
}
