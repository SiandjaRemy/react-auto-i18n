import path from "path";
import chalk from "chalk";
import ora from "ora";
import { logger } from "../utils/logger";
import { requireConfig, validateLocalesDir } from "../utils/config";
import { scanProject } from "../core/scanner";
import { readLocaleFile, resolveLocaleFilePath } from "../core/scaffolder";
import { transformProject } from "../core/transformer";
import { writeFile, exists } from "../utils/fs";
import { confirm } from "../utils/prompt";

interface ReplaceOptions {
  path: string;
  dryRun?: boolean;
}

/**
 * `rai replace`
 *
 * Reads the existing locale file, re-scans the project to get string
 * locations, then rewrites every source file replacing raw strings
 * with t() calls and injecting useTranslation.
 *
 * Steps:
 *   1. Load config
 *   2. Check locale file exists (scan must have been run first)
 *   3. Re-scan project to get ExtractedString locations
 *   4. Transform all files (compute changes without writing)
 *   5. Show a preview of what will change
 *   6. Confirm before writing
 *   7. Write all modified files
 *   8. Print next steps
 *
 * Why re-scan instead of saving scan results to disk?
 *   Saving scan results would require a cache file that could go stale.
 *   Re-scanning is fast (pure AST parsing, no I/O except file reads)
 *   and guarantees the locations are current.
 */
export async function replace(options: ReplaceOptions): Promise<void> {
  const appRoot = path.resolve(options.path);
  const isDryRun = options.dryRun ?? false;

  // ── Step 1: Load config ───────────────────────────────────────────────────
  const config = await requireConfig(appRoot);
  const localesDir = path.join(appRoot, config.localesDir);

  // ── Validate localesDir ───────────────────────────────────────────────────
  const dirError = validateLocalesDir(config.localesDir, appRoot);
  if (dirError) {
    logger.error(`Invalid "localesDir" in your config:\n  ${dirError}`);
    process.exit(1);
  }

  logger.section("rai — Replace");
  if (isDryRun) logger.warn("  Dry run — no files will be written.\n");

  // ── Step 2: Check locale file exists ─────────────────────────────────────
  const localeFilePath = resolveLocaleFilePath(
    localesDir,
    config.defaultLanguage,
    config.localeFileName,
  );

  if (!exists(localeFilePath)) {
    logger.error(
      `Locale file not found: ${path.relative(appRoot, localeFilePath)}\n` +
        `  Run "rai scan" first to generate the locale file.`,
    );
    process.exit(1);
  }

  const localeData = readLocaleFile(
    config.defaultLanguage,
    localesDir,
    config.localeFileName,
  );

  const keyCount = Object.keys(localeData).length;
  logger.info(`  Locale file : ${path.relative(appRoot, localeFilePath)}`);
  logger.info(`  Keys loaded : ${keyCount}`);

  if (keyCount === 0) {
    logger.error(`The locale file is empty. Run "rai scan" to populate it.`);
    process.exit(1);
  }

  // ── Step 3: Re-scan to get string locations ───────────────────────────────
  logger.section("Scanning for string locations...");
  const spinner = ora("Scanning...").start();

  let strings;
  try {
    strings = await scanProject(appRoot, config);
    spinner.succeed(`Found ${strings.length} string(s) across the project.`);
  } catch (err) {
    spinner.fail("Scan failed.");
    logger.error(String(err));
    process.exit(1);
  }

  if (strings.length === 0) {
    logger.warn("No strings found. Nothing to replace.");
    process.exit(0);
  }

  // ── Step 4: Compute transformations ──────────────────────────────────────
  logger.section("Computing replacements...");

  const results = await transformProject(appRoot, strings, localeData);

  const modifiedResults = results.filter((r) => r.modified);
  const totalReplacements = modifiedResults.reduce(
    (sum, r) => sum + r.replacements,
    0,
  );

  if (modifiedResults.length === 0) {
    logger.warn(
      "No replacements needed. Your source files may already use t() calls.",
    );
    process.exit(0);
  }

  // ── Step 5: Preview ───────────────────────────────────────────────────────
  logger.section("Preview — files to be modified");
  logger.newline();

  modifiedResults.forEach((result) => {
    logger.info(
      `  ${chalk.cyan(path.relative(appRoot, result.filePath))}` +
        chalk.gray(` — ${result.replacements} replacement(s)`),
    );
  });

  logger.newline();
  logger.info(
    `  ${chalk.bold(String(modifiedResults.length))} file(s) will be modified ` +
      `with ${chalk.bold(String(totalReplacements))} total replacement(s)`,
  );

  if (isDryRun) {
    logger.newline();
    logger.warn("Dry run complete — no files written.");
    logger.info("  Remove --dry-run to apply changes.");
    process.exit(0);
  }

  // ── Step 6: Confirm ───────────────────────────────────────────────────────
  logger.newline();
  logger.warn(
    "This will modify your source files directly.\n" +
      "  Make sure your changes are committed before proceeding.",
  );
  logger.newline();

  const shouldProceed = await confirm(
    `Modify ${modifiedResults.length} file(s) with t() replacements?`,
    false, // default to NO for a destructive operation
  );

  if (!shouldProceed) {
    logger.info("Aborted. No files were modified.");
    process.exit(0);
  }

  // ── Step 7: Write files ───────────────────────────────────────────────────
  logger.section("Applying replacements...");

  let written = 0;
  for (const result of modifiedResults) {
    if (!result.newCode) continue;

    try {
      writeFile(result.filePath, result.newCode);
      written++;
      logger.success(
        `${path.relative(appRoot, result.filePath)} — ${result.replacements} replacement(s)`,
      );
    } catch (err) {
      logger.error(
        `Failed to write ${path.relative(appRoot, result.filePath)}: ${String(err)}`,
      );
    }
  }

  logger.newline();
  logger.success(`Done — ${written} file(s) updated.`);

  // ── Step 8: Next steps ────────────────────────────────────────────────────
  // ── Step 8: Next steps ────────────────────────────────────────────────────
  logger.section("Next steps");
  logger.info(`
  1. Run your app and verify everything works:
       npx expo start

  2. If something looks wrong, revert using git:
       ${chalk.cyan("git checkout .")}
       This discards all uncommitted changes and restores your files.
       This is why we asked you to commit before running replace.

  3. If everything looks good, commit:
       ${chalk.cyan("git add .")}
       ${chalk.cyan('git commit -m "feat: replace strings with i18n t() calls"')}

  4. To add more languages in the future:
       • Copy ${path.relative(appRoot, localeFilePath)} and translate the values
       • Add the new language to your i18n.ts resources object
  `);
}
