import path from "path";
import fs from "fs";
import { logger } from "../utils/logger";
import { getConfigPath, CONFIG_FILENAME } from "../utils/config";

interface InitOptions {
  path: string;
}

/**
 * `rai init`
 *
 * Generates rai.config.ts in the user's project root with
 * sensible defaults and inline documentation for every option.
 *
 * Design decisions:
 *
 * 1. We generate a file with defaults rather than an interactive prompt.
 *    This avoids having to validate user input for every field interactively,
 *    since the TypeScript type on the config catches invalid values in the editor.
 *
 * 2. The config uses `satisfies Partial<RaiConfig>` instead of importing
 *    `defineConfig`. This means the import is type-only — jiti strips it at
 *    runtime so react-auto-i18n does NOT need to be in the user's node_modules.
 *
 * 3. Every config field has a JSDoc comment explaining what it does and
 *    what values are accepted. The user should be able to configure everything
 *    without opening external docs.
 */
export async function init(options: InitOptions): Promise<void> {
  const appRoot = path.resolve(options.path);
  const configPath = getConfigPath(appRoot);

  // ── Guard: don't overwrite existing config ─────────────────────────────────
  if (fs.existsSync(configPath)) {
    logger.warn(`${CONFIG_FILENAME} already exists at ${configPath}`);
    logger.info(
      `  If you want to start over, delete the file and re-run "rai init".`,
    );
    process.exit(0);
  }

  logger.section("rai — Init");

  // ── Write the config file ──────────────────────────────────────────────────
  /**
   * Why write the config as a raw template string?
   *
   * If we serialized a JS object with JSON.stringify, we would lose:
   *   - The `import type` statement
   *   - The `satisfies` annotation
   *   - All the JSDoc comments
   *   - Proper formatting
   *
   * A template string gives us full control over the exact output,
   * which is important since this is a file the user will read and edit.
   */
  const configContent = `import type { RaiConfig } from 'react-auto-i18n'

/**
 * rai configuration
 *
 * Edit this file to match your project, then run:
 *   rai scan
 *
 * Full type safety is available — your editor will highlight invalid values.
 * The import above is type-only and is erased at runtime, so react-auto-i18n
 * does not need to be installed as a project dependency.
 */
export default {
  // ── Language ───────────────────────────────────────────────────────────────

  /**
   * The language your app is currently written in.
   * All extracted strings will be stored under this language.
   *
   * Must be a valid ISO 639-1 code.
   * Examples: 'en', 'fr', 'es', 'de', 'ar', 'zh', 'pt', 'ja'
   */
  defaultLanguage: 'en',

  // ── Output ─────────────────────────────────────────────────────────────────

  /**
   * Directory where locale files will be generated.
   * Relative to your project root.
   *
   * The scan command will create:
   *   <localesDir>/<defaultLanguage>.json
   *
   * Examples:
   *   'locales'      → locales/en.json         (at project root)
   *   'src/locales'  → src/locales/en.json     (inside src/)
   *
   * If the directory does not exist, it will be created automatically.
   * However, its parent directory must already exist.
   * ('src/locales' requires 'src/' to exist — it usually does in RN projects)
   */
  localesDir: 'locales',

  /**
   * Custom name for the locale file, without the .json extension.
   *
   * null (default):
   *   Files are named after the language code.
   *   locales/en.json
   *   locales/fr.json
   *
   * Custom name e.g. 'translation':
   *   A subdirectory is created per language and the file goes inside.
   *   locales/en/translation.json
   *   locales/fr/translation.json
   *
   * The second format is common in i18next projects that use namespaces
   * or that follow the convention of one directory per language.
   *
   * @default null
   * @example null         → locales/en.json
   * @example 'translation' → locales/en/translation.json
   */
  localeFileName: null,

  // ── Key generation ─────────────────────────────────────────────────────────

  /**
   * Maximum length of a generated translation key.
   *
   * Keys are built from the file path and the string content:
   *   auth.forgotpassword.enter_your_email_address
   *
   * If a key exceeds this limit, the string portion is trimmed.
   * Minimum: 10  Maximum: 200
   *
   * @default 60
   */
  maxKeyLength: 60,

  // ── Detection ──────────────────────────────────────────────────────────────

  /**
   * Extract strings passed to Alert.alert().
   *
   * Alert.alert('Confirm', 'Are you sure you want to delete this?')
   *              ↑ title   ↑ message — both are extracted when true
   *
   * @default true
   */
  detectAlerts: true,

  /**
   * Extract strings inside throw statements.
   *
   * throw new Error('Failed to save. Please try again.')
   *                  ↑ extracted when true
   *
   * Useful for catching error messages written in try/catch blocks
   * that bubble up and get shown to the user.
   *
   * @default true
   */
  detectThrows: true,

  /**
   * Additional function call patterns to extract string arguments from.
   *
   * Use this for toast libraries, custom error handlers, or any function
   * that receives user-visible strings as arguments.
   *
   * Format: 'functionName' for global functions
   *         'object.method' for method calls
   *
   * @default []
   * @example ['toast.show', 'setError', 'showMessage', 'Snackbar.show']
   */
  customDetectCalls: [],

  // ── Scanner ────────────────────────────────────────────────────────────────

  /**
   * Glob patterns to exclude from scanning.
   *
   * These are always excluded automatically and do not need to be listed:
   *   node_modules, dist, build, android, ios, .expo
   *
   * Use this for mock files, fixtures, generated code, or dev utilities
   * that contain strings you do not want translated.
   *
   * Patterns are relative to your project root.
   *
   * @default []
   * @example ['src/mocks/**', 'src/fixtures/**', 'src/dev/**']
   */
  exclude: [],

} satisfies Partial<RaiConfig>
`;

  fs.writeFileSync(configPath, configContent, "utf-8");
  logger.success(`Created ${CONFIG_FILENAME}`);

  // ── Next steps ─────────────────────────────────────────────────────────────
  logger.section("Next steps");
  logger.info(`
  1. Open ${CONFIG_FILENAME} and review the settings.

     Key things to check:
       • "defaultLanguage" — make sure this matches your app's current language
       • "localesDir"      — where locale files will be written
       • "localeFileName"      — custom name for the translation files
       • "detectAlerts"    — set to false if you don't use Alert.alert()
       • "detectThrows"    — set to false if your errors aren't user-facing
       • "customDetectCalls" — add any toast or error handler functions you use
       • "exclude"         — add any folders you want the scanner to skip

  2. When ready, run:
       rai scan

     This will scan your entire app, extract all translatable strings,
     and generate your locale file at <localesDir>/<defaultLanguage>.json
  `);
}
