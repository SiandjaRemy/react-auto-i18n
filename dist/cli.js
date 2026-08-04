#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/tsup/assets/cjs_shims.js
var init_cjs_shims = __esm({
  "node_modules/tsup/assets/cjs_shims.js"() {
    "use strict";
  }
});

// src/utils/logger.ts
var logger_exports = {};
__export(logger_exports, {
  isDebugMode: () => isDebugMode,
  logger: () => logger,
  setDebugMode: () => setDebugMode
});
function setDebugMode(val) {
  debugMode = val;
}
function isDebugMode() {
  return debugMode;
}
var import_chalk, debugMode, logger;
var init_logger = __esm({
  "src/utils/logger.ts"() {
    "use strict";
    init_cjs_shims();
    import_chalk = __toESM(require("chalk"));
    debugMode = false;
    logger = {
      info: (msg) => {
        console.log(import_chalk.default.white(msg));
      },
      success: (msg) => {
        console.log(import_chalk.default.green(`\u2714 ${msg}`));
      },
      warn: (msg) => {
        console.log(import_chalk.default.yellow(`\u26A0 ${msg}`));
      },
      error: (msg) => {
        console.log(import_chalk.default.red(`\u2716 ${msg}`));
      },
      /**
       * Muted text for secondary information.
       * Use for file paths, counts, and details that are helpful
       * but shouldn't dominate the output.
       */
      dim: (msg) => {
        console.log(import_chalk.default.gray(msg));
      },
      /**
       * Bold cyan header that visually separates major steps.
       * Use at the start of each logical phase within a command.
       */
      section: (msg) => {
        console.log(import_chalk.default.bold.cyan(`
\u25B6 ${msg}`));
      },
      /**
       * Only prints when --debug flag is active.
       * Use for internal state that helps diagnose problems:
       * AST node types, file paths being considered, config values, etc.
       */
      debug: (msg) => {
        if (debugMode) {
          console.log(import_chalk.default.magenta(`[debug] ${msg}`));
        }
      },
      /**
       * Prints a blank line.
       * Use to add breathing room between sections in the output.
       */
      newline: () => {
        console.log("");
      }
    };
  }
});

// src/types/config.ts
var SUPPORTED_LANGUAGE_CODES, SUPPORTED_LOCALES;
var init_config = __esm({
  "src/types/config.ts"() {
    "use strict";
    init_cjs_shims();
    SUPPORTED_LANGUAGE_CODES = [
      "af",
      "sq",
      "am",
      "ar",
      "hy",
      "az",
      "eu",
      "be",
      "bn",
      "bs",
      "bg",
      "ca",
      "zh",
      "hr",
      "cs",
      "da",
      "nl",
      "en",
      "et",
      "fi",
      "fr",
      "gl",
      "ka",
      "de",
      "el",
      "gu",
      "ht",
      "ha",
      "he",
      "hi",
      "hu",
      "is",
      "ig",
      "id",
      "ga",
      "it",
      "ja",
      "kn",
      "kk",
      "km",
      "ko",
      "ku",
      "ky",
      "lo",
      "lv",
      "lt",
      "lb",
      "mk",
      "mg",
      "ms",
      "ml",
      "mt",
      "mi",
      "mr",
      "mn",
      "my",
      "ne",
      "nb",
      "ps",
      "fa",
      "pl",
      "pt",
      "pa",
      "ro",
      "ru",
      "sm",
      "sr",
      "sn",
      "sd",
      "si",
      "sk",
      "sl",
      "so",
      "es",
      "su",
      "sw",
      "sv",
      "tl",
      "tg",
      "ta",
      "tt",
      "te",
      "th",
      "tr",
      "tk",
      "uk",
      "ur",
      "ug",
      "uz",
      "vi",
      "cy",
      "xh",
      "yi",
      "yo",
      "zu"
    ];
    SUPPORTED_LOCALES = [
      // Base languages
      ...SUPPORTED_LANGUAGE_CODES,
      // French variants
      "fr-CA",
      "fr-BE",
      "fr-CH",
      "fr-LU",
      "fr-MC",
      // English variants
      "en-US",
      "en-GB",
      "en-AU",
      "en-CA",
      "en-IN",
      "en-NZ",
      // Spanish variants
      "es-AR",
      "es-BO",
      "es-CL",
      "es-CO",
      "es-CR",
      "es-CU",
      "es-DO",
      "es-EC",
      "es-ES",
      "es-GT",
      "es-HN",
      "es-MX",
      "es-NI",
      "es-PA",
      "es-PE",
      "es-PR",
      "es-PY",
      "es-SV",
      "es-US",
      "es-UY",
      "es-VE",
      // Portuguese variants
      "pt-BR",
      "pt-PT",
      // Chinese variants
      "zh-CN",
      "zh-TW",
      "zh-HK",
      "zh-MO",
      // German variants
      "de-AT",
      "de-CH",
      "de-DE",
      "de-LI",
      "de-LU",
      // Italian variants
      "it-CH",
      "it-IT",
      "it-SM",
      // Dutch variants
      "nl-BE",
      "nl-NL",
      // Arabic variants
      "ar-AE",
      "ar-BH",
      "ar-DZ",
      "ar-EG",
      "ar-IQ",
      "ar-JO",
      "ar-KW",
      "ar-LB",
      "ar-LY",
      "ar-MA",
      "ar-OM",
      "ar-QA",
      "ar-SA",
      "ar-SD",
      "ar-SY",
      "ar-TN",
      "ar-YE"
    ];
  }
});

// src/utils/config.ts
function getConfigPath(appRoot) {
  return import_path.default.join(appRoot, CONFIG_FILENAME);
}
async function loadConfig(appRoot) {
  const configPath = getConfigPath(appRoot);
  if (!import_fs.default.existsSync(configPath)) {
    return null;
  }
  try {
    const { createJiti } = await import("jiti");
    const jiti = createJiti(configPath);
    const mod = await jiti.import(configPath);
    const userConfig = mod.default ?? mod;
    return { ...DEFAULT_CONFIG, ...userConfig };
  } catch (err) {
    logger.error(`Failed to load ${CONFIG_FILENAME}:`);
    logger.error(String(err));
    logger.debug(err instanceof Error ? err.stack ?? "" : "");
    return null;
  }
}
function validateConfig(config) {
  const errors = [];
  if (!SUPPORTED_LOCALES.includes(config.defaultLanguage)) {
    errors.push(
      `"defaultLanguage" value "${config.defaultLanguage}" is not a valid ISO 639-1 language code.
  Valid examples: 'en', 'fr', 'es', 'ar', 'zh', 'de'`
    );
  }
  if (typeof config.maxKeyLength !== "number" || config.maxKeyLength < 10 || config.maxKeyLength > 200) {
    errors.push(
      `"maxKeyLength" must be a number between 10 and 200, got "${config.maxKeyLength}".`
    );
  }
  if (!config.localesDir || typeof config.localesDir !== "string") {
    errors.push(`"localesDir" must be a non-empty string.`);
  }
  if (!Array.isArray(config.customDetectCalls)) {
    errors.push(`"customDetectCalls" must be an array of strings.`);
  }
  if (!Array.isArray(config.exclude)) {
    errors.push(`"exclude" must be an array of glob pattern strings.`);
  }
  return errors;
}
async function requireConfig(appRoot) {
  const config = await loadConfig(appRoot);
  if (!config) {
    logger.error(
      `No ${CONFIG_FILENAME} found in ${appRoot}
  Run "rai init" first to create your config file.`
    );
    process.exit(1);
  }
  const errors = validateConfig(config);
  if (errors.length > 0) {
    logger.error(`Your ${CONFIG_FILENAME} has the following issues:
`);
    errors.forEach((e) => logger.error(`  \u2022 ${e}`));
    logger.newline();
    logger.info(`  Fix these and re-run the command.`);
    process.exit(1);
  }
  return config;
}
function validateLocalesDir(localesDir, appRoot) {
  if (import_path.default.isAbsolute(localesDir)) {
    return `"localesDir" must be a relative path, got "${localesDir}".
  Use a path relative to your project root, e.g. 'locales' or 'src/locales'.`;
  }
  if (localesDir.endsWith("/") || localesDir.endsWith("\\")) {
    return `"localesDir" must not have a trailing slash, got "${localesDir}".
  Remove the trailing slash: '${localesDir.replace(/[/\\]+$/, "")}'`;
  }
  const resolvedDir = import_path.default.join(appRoot, localesDir);
  const parentDir = import_path.default.dirname(resolvedDir);
  if (!import_fs.default.existsSync(parentDir)) {
    const relativeParent = import_path.default.relative(appRoot, parentDir);
    return `The parent directory "${relativeParent}" does not exist.
  Either:
    \u2022 Create it first: mkdir ${relativeParent}
    \u2022 Or change "localesDir" to an existing location, e.g. 'locales'`;
  }
  return null;
}
var import_path, import_fs, CONFIG_FILENAME, DEFAULT_CONFIG;
var init_config2 = __esm({
  "src/utils/config.ts"() {
    "use strict";
    init_cjs_shims();
    import_path = __toESM(require("path"));
    import_fs = __toESM(require("fs"));
    init_logger();
    init_config();
    CONFIG_FILENAME = "rai.config.ts";
    DEFAULT_CONFIG = {
      defaultLanguage: "en",
      localesDir: "locales",
      localeFileName: null,
      maxKeyLength: 60,
      detectAlerts: true,
      detectThrows: true,
      customDetectCalls: [],
      exclude: []
    };
  }
});

// src/commands/init.ts
var init_exports = {};
__export(init_exports, {
  init: () => init
});
async function init(options) {
  const appRoot = import_path2.default.resolve(options.path);
  const configPath = getConfigPath(appRoot);
  if (import_fs2.default.existsSync(configPath)) {
    logger.warn(`${CONFIG_FILENAME} already exists at ${configPath}`);
    logger.info(
      `  If you want to start over, delete the file and re-run "rai init".`
    );
    process.exit(0);
  }
  logger.section("rai \u2014 Init");
  const configContent = `import type { RaiConfig } from 'react-auto-i18n'

/**
 * rai configuration
 *
 * Edit this file to match your project, then run:
 *   rai scan
 *
 * Full type safety is available \u2014 your editor will highlight invalid values.
 * The import above is type-only and is erased at runtime, so react-auto-i18n
 * does not need to be installed as a project dependency.
 */
export default {
  // \u2500\u2500 Language \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

  /**
   * The language your app is currently written in.
   * All extracted strings will be stored under this language.
   *
   * Must be a valid ISO 639-1 code.
   * Examples: 'en', 'fr', 'es', 'de', 'ar', 'zh', 'pt', 'ja'
   */
  defaultLanguage: 'en',

  // \u2500\u2500 Output \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

  /**
   * Directory where locale files will be generated.
   * Relative to your project root.
   *
   * The scan command will create:
   *   <localesDir>/<defaultLanguage>.json
   *
   * Examples:
   *   'locales'      \u2192 locales/en.json         (at project root)
   *   'src/locales'  \u2192 src/locales/en.json     (inside src/)
   *
   * If the directory does not exist, it will be created automatically.
   * However, its parent directory must already exist.
   * ('src/locales' requires 'src/' to exist \u2014 it usually does in RN projects)
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
   * @example null         \u2192 locales/en.json
   * @example 'translation' \u2192 locales/en/translation.json
   */
  localeFileName: null,

  // \u2500\u2500 Key generation \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

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

  // \u2500\u2500 Detection \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

  /**
   * Extract strings passed to Alert.alert().
   *
   * Alert.alert('Confirm', 'Are you sure you want to delete this?')
   *              \u2191 title   \u2191 message \u2014 both are extracted when true
   *
   * @default true
   */
  detectAlerts: true,

  /**
   * Extract strings inside throw statements.
   *
   * throw new Error('Failed to save. Please try again.')
   *                  \u2191 extracted when true
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

  // \u2500\u2500 Scanner \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

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
  import_fs2.default.writeFileSync(configPath, configContent, "utf-8");
  logger.success(`Created ${CONFIG_FILENAME}`);
  logger.section("Next steps");
  logger.info(`
  1. Open ${CONFIG_FILENAME} and review the settings.

     Key things to check:
       \u2022 "defaultLanguage" \u2014 make sure this matches your app's current language
       \u2022 "localesDir"      \u2014 where locale files will be written
       \u2022 "localeFileName"      \u2014 custom name for the translation files
       \u2022 "detectAlerts"    \u2014 set to false if you don't use Alert.alert()
       \u2022 "detectThrows"    \u2014 set to false if your errors aren't user-facing
       \u2022 "customDetectCalls" \u2014 add any toast or error handler functions you use
       \u2022 "exclude"         \u2014 add any folders you want the scanner to skip

  2. When ready, run:
       rai scan

     This will scan your entire app, extract all translatable strings,
     and generate your locale file at <localesDir>/<defaultLanguage>.json
  `);
}
var import_path2, import_fs2;
var init_init = __esm({
  "src/commands/init.ts"() {
    "use strict";
    init_cjs_shims();
    import_path2 = __toESM(require("path"));
    import_fs2 = __toESM(require("fs"));
    init_logger();
    init_config2();
  }
});

// src/utils/fs.ts
function readFileSafe(filePath) {
  try {
    return import_fs3.default.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}
function writeFile(filePath, content) {
  const dir = import_path3.default.dirname(filePath);
  import_fs3.default.mkdirSync(dir, { recursive: true });
  import_fs3.default.writeFileSync(filePath, content, "utf-8");
}
function exists(filePath) {
  return import_fs3.default.existsSync(filePath);
}
function ensureDir(dirPath) {
  import_fs3.default.mkdirSync(dirPath, { recursive: true });
}
function writeJson(filePath, data) {
  writeFile(filePath, JSON.stringify(data, null, 2));
}
var import_fs3, import_path3;
var init_fs = __esm({
  "src/utils/fs.ts"() {
    "use strict";
    init_cjs_shims();
    import_fs3 = __toESM(require("fs"));
    import_path3 = __toESM(require("path"));
  }
});

// src/core/scanner.ts
function buildNamespace(relativePathWithoutExt) {
  return relativePathWithoutExt.replace(/\\/g, "/").replace(/^src\//, "").replace(/^app\//, "").replace(/^screens\//, "").split("/").map(
    (segment) => segment.replace(/^\((.+)\)$/, "$1").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")
  ).filter(Boolean).join(".");
}
function toKeySegment(text) {
  return text.toLowerCase().replace(/\{\{.*?\}\}/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
function buildFullKey(namespace, text, maxKeyLength) {
  const rawSegment = toKeySegment(text);
  const available = maxKeyLength - namespace.length - 1;
  let trimmedSegment;
  if (rawSegment.length <= available) {
    trimmedSegment = rawSegment;
  } else {
    const substring = rawSegment.substring(0, available);
    const lastUnderscore = substring.lastIndexOf("_");
    if (lastUnderscore > 5) {
      trimmedSegment = substring.substring(0, lastUnderscore);
    } else {
      trimmedSegment = substring;
    }
  }
  const fullKey = `${namespace}.${trimmedSegment}`;
  return { key: trimmedSegment, fullKey };
}
function isExtractable(value) {
  const trimmed = value.trim();
  if (trimmed.length < 2) return false;
  if (/^\d+(\.\d+)?$/.test(trimmed)) return false;
  if (/^https?:\/\//.test(trimmed)) return false;
  if (/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(trimmed) && !trimmed.includes(" ")) {
    if (trimmed.includes("_") || trimmed.includes("-")) return false;
    if (trimmed === trimmed.toUpperCase() && trimmed.length > 2) return false;
  }
  if (isCssClassString(trimmed)) return false;
  return true;
}
function isCssClassString(value) {
  const tokens = value.trim().split(/\s+/);
  if (tokens.length < 2) return false;
  const cssPattern = /^[a-z]{1,4}(-[a-z0-9.[\]/]+)+$|^(flex|hidden|block|grid|p|m|w|h|gap|text|font|bg|border|rounded|shadow|items|justify|overflow|absolute|relative|fixed|inset|z|opacity|ring|cursor|pointer|animate|transition|duration|ease|scale|rotate|translate|aspect|container|sr)(-.*)?$/;
  const cssLikeCount = tokens.filter((tk) => cssPattern.test(tk)).length;
  return cssLikeCount / tokens.length > 0.5;
}
function isInsideJSXContent(nodePath) {
  const parent = nodePath.parent;
  return t.isJSXElement(parent) || t.isJSXFragment(parent);
}
function processTemplateLiteral(node) {
  let text = "";
  const params = [];
  let argIndex = 0;
  node.quasis.forEach((quasi, i) => {
    text += quasi.value.cooked ?? quasi.value.raw;
    if (i < node.expressions.length) {
      const expr = node.expressions[i];
      let paramName;
      if (t.isIdentifier(expr)) {
        paramName = expr.name;
      } else if (t.isMemberExpression(expr) && t.isIdentifier(expr.property)) {
        paramName = expr.property.name;
      } else {
        paramName = `arg${argIndex++}`;
      }
      params.push(paramName);
      text += `{{${paramName}}}`;
    }
  });
  return { text, params };
}
function extractFromExpression(expr, results, namespace, filePath, maxKeyLen, sourceType) {
  if (!expr || t.isJSXEmptyExpression(expr)) return;
  if (t.isStringLiteral(expr)) {
    if (!isExtractable(expr.value)) return;
    const { key, fullKey } = buildFullKey(namespace, expr.value, maxKeyLen);
    results.push({
      filePath,
      namespace,
      key,
      fullKey,
      originalText: expr.value,
      translationValue: expr.value,
      params: [],
      sourceType
    });
    return;
  }
  if (t.isTemplateLiteral(expr)) {
    const { text, params } = processTemplateLiteral(expr);
    if (!isExtractable(text)) return;
    const { key, fullKey } = buildFullKey(namespace, text, maxKeyLen);
    results.push({
      filePath,
      namespace,
      key,
      fullKey,
      originalText: text,
      translationValue: text,
      params,
      sourceType
    });
    for (const subExpr of expr.expressions) {
      extractFromExpression(
        subExpr,
        results,
        namespace,
        filePath,
        maxKeyLen,
        sourceType
      );
    }
    return;
  }
  if (t.isConditionalExpression(expr)) {
    extractFromExpression(
      expr.consequent,
      results,
      namespace,
      filePath,
      maxKeyLen,
      sourceType
    );
    extractFromExpression(
      expr.alternate,
      results,
      namespace,
      filePath,
      maxKeyLen,
      sourceType
    );
    return;
  }
  if (t.isLogicalExpression(expr)) {
    extractFromExpression(
      expr.left,
      results,
      namespace,
      filePath,
      maxKeyLen,
      sourceType
    );
    extractFromExpression(
      expr.right,
      results,
      namespace,
      filePath,
      maxKeyLen,
      sourceType
    );
    return;
  }
}
function getCalleeName(node) {
  const { callee } = node;
  if (t.isIdentifier(callee)) {
    return callee.name;
  }
  if (t.isMemberExpression(callee) && t.isIdentifier(callee.object) && t.isIdentifier(callee.property)) {
    return `${callee.object.name}.${callee.property.name}`;
  }
  return null;
}
function extractStringArgs(args, results, namespace, filePath, maxKeyLen, sourceType) {
  for (const arg of args) {
    if (t.isStringLiteral(arg) && isExtractable(arg.value)) {
      const { key, fullKey } = buildFullKey(namespace, arg.value, maxKeyLen);
      results.push({
        filePath,
        namespace,
        key,
        fullKey,
        originalText: arg.value,
        translationValue: arg.value,
        params: [],
        sourceType
      });
    }
  }
}
function extractStringsFromFile(filePath, appRoot, config) {
  const code = readFileSafe(filePath);
  if (!code) return [];
  const relativeWithoutExt = import_path4.default.relative(appRoot, filePath).replace(/\\/g, "/").replace(/\.[^/.]+$/, "");
  const namespace = buildNamespace(relativeWithoutExt);
  logger.debug(
    `Parsing: ${import_path4.default.relative(appRoot, filePath)} \u2192 namespace: "${namespace}"`
  );
  let ast;
  try {
    ast = parser.parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript", "decorators-legacy"]
    });
  } catch (err) {
    logger.warn(
      `  Could not parse ${import_path4.default.relative(appRoot, filePath)} \u2014 skipping`
    );
    logger.debug(String(err));
    return [];
  }
  const results = [];
  const maxKeyLen = config.maxKeyLength;
  const customCallPatterns = new Set(config.customDetectCalls);
  (0, import_traverse.default)(ast, {
    // ── 1. Plain text between JSX tags ──────────────────────────────────────
    //
    //    <Text>Hello world</Text>
    //          ↑ this is a JSXText node
    //
    //    JSXText includes all whitespace and newlines between tags,
    //    so we trim and check extractability carefully.
    JSXText(nodePath) {
      const value = nodePath.node.value;
      const trimmed = value.trim();
      if (!isExtractable(trimmed)) return;
      const { key, fullKey } = buildFullKey(namespace, trimmed, maxKeyLen);
      results.push({
        filePath,
        namespace,
        key,
        fullKey,
        originalText: trimmed,
        translationValue: trimmed,
        params: [],
        sourceType: "jsx-text"
      });
    },
    // ── 2. Expressions inside JSX content ───────────────────────────────────
    //
    //    <Text>{"Hello"}</Text>
    //    <Text>{`Hello ${name}`}</Text>
    //    <Text>{isLoading ? "Loading" : "Done"}</Text>
    //
    //    The isInsideJSXContent guard is critical — it prevents
    //    className={`flex-row`} from matching here.
    JSXExpressionContainer(nodePath) {
      if (!isInsideJSXContent(nodePath)) return;
      extractFromExpression(
        nodePath.node.expression,
        results,
        namespace,
        filePath,
        maxKeyLen,
        "jsx-expression"
      );
    },
    // ── 3. String props on JSX elements ─────────────────────────────────────
    //
    //    <Button title="Submit" />
    //    <Input placeholder="Enter your email" />
    //    <ErrorState message="Something went wrong" />
    //
    //    We only extract props in TRANSLATABLE_PROP_NAMES and skip
    //    anything in NON_TRANSLATABLE_PROP_NAMES.
    JSXAttribute(nodePath) {
      const { name, value } = nodePath.node;
      const propName = t.isJSXIdentifier(name) ? name.name : null;
      if (!propName) return;
      if (NON_TRANSLATABLE_PROP_NAMES.has(propName)) return;
      if (!TRANSLATABLE_PROP_NAMES.has(propName)) return;
      if (!t.isStringLiteral(value)) return;
      if (!isExtractable(value.value)) return;
      const { key, fullKey } = buildFullKey(namespace, value.value, maxKeyLen);
      results.push({
        filePath,
        namespace,
        key,
        fullKey,
        originalText: value.value,
        translationValue: value.value,
        params: [],
        sourceType: "jsx-attribute",
        propName
      });
    },
    // ── 4. Alert.alert() calls ───────────────────────────────────────────────
    //
    //    Alert.alert('Delete Item', 'Are you sure you want to delete this?')
    //                 ↑ title        ↑ message — both extracted
    //
    //    Only active when config.detectAlerts is true.
    //    We specifically match Alert.alert (capital A) as that is the
    //    React Native API. alert() (lowercase) is the browser API
    //    which is rarely used in RN and often for debugging.
    CallExpression(nodePath) {
      const calleeName = getCalleeName(nodePath.node);
      if (!calleeName) return;
      if (config.detectAlerts && calleeName === "Alert.alert") {
        extractStringArgs(
          nodePath.node.arguments,
          results,
          namespace,
          filePath,
          maxKeyLen,
          "alert"
        );
        return;
      }
      if (customCallPatterns.has(calleeName)) {
        extractStringArgs(
          nodePath.node.arguments,
          results,
          namespace,
          filePath,
          maxKeyLen,
          "call"
        );
        return;
      }
    },
    // ── 5. Throw statements ──────────────────────────────────────────────────
    //
    //    throw new Error('Failed to save item. Please try again.')
    //                     ↑ extracted when config.detectThrows is true
    //
    //    We look specifically for `throw new Error(string)` pattern.
    //    Plain `throw 'string'` is also handled.
    ThrowStatement(nodePath) {
      if (!config.detectThrows) return;
      const { argument } = nodePath.node;
      if (t.isNewExpression(argument) && t.isIdentifier(argument.callee) && argument.callee.name === "Error") {
        extractStringArgs(
          argument.arguments,
          results,
          namespace,
          filePath,
          maxKeyLen,
          "throw"
        );
        return;
      }
      if (t.isStringLiteral(argument) && isExtractable(argument.value)) {
        const { key, fullKey } = buildFullKey(
          namespace,
          argument.value,
          maxKeyLen
        );
        results.push({
          filePath,
          namespace,
          key,
          fullKey,
          originalText: argument.value,
          translationValue: argument.value,
          params: [],
          sourceType: "throw"
        });
      }
    }
  });
  logger.debug(
    `  Found ${results.length} string(s) in ${import_path4.default.relative(appRoot, filePath)}`
  );
  return results;
}
async function scanProject(appRoot, config) {
  const files = await (0, import_glob.glob)("**/*.{ts,tsx,js,jsx}", {
    cwd: appRoot,
    absolute: true,
    ignore: [...HARD_EXCLUDED_DIRS, ...config.exclude]
  });
  const ig = (0, import_ignore.default)();
  const gitignorePath = import_path4.default.join(appRoot, ".gitignore");
  if (import_fs4.default.existsSync(gitignorePath)) {
    ig.add(import_fs4.default.readFileSync(gitignorePath, "utf-8"));
    logger.debug("Loaded .gitignore rules");
  }
  const filteredFiles = files.filter((file) => {
    const rel = import_path4.default.relative(appRoot, file).replace(/\\/g, "/");
    return !ig.ignores(rel);
  });
  logger.debug(
    `Files after .gitignore filter: ${filteredFiles.length} / ${files.length}`
  );
  logger.dim(`  Found ${filteredFiles.length} source files to scan.`);
  const allStrings = [];
  let filesWithStrings = 0;
  for (const file of filteredFiles) {
    const found = extractStringsFromFile(file, appRoot, config);
    if (found.length > 0) {
      filesWithStrings++;
      logger.dim(
        `  \u2713 ${import_path4.default.relative(appRoot, file)} \u2192 ${found.length} string(s)`
      );
      allStrings.push(...found);
    }
  }
  logger.dim(
    `
  Scanned: ${filteredFiles.length} files | With strings: ${filesWithStrings} | Empty: ${filteredFiles.length - filesWithStrings}`
  );
  return allStrings;
}
var parser, import_traverse, t, import_glob, import_ignore, import_fs4, import_path4, TRANSLATABLE_PROP_NAMES, NON_TRANSLATABLE_PROP_NAMES, HARD_EXCLUDED_DIRS;
var init_scanner = __esm({
  "src/core/scanner.ts"() {
    "use strict";
    init_cjs_shims();
    parser = __toESM(require("@babel/parser"));
    import_traverse = __toESM(require("@babel/traverse"));
    t = __toESM(require("@babel/types"));
    import_glob = require("glob");
    import_ignore = __toESM(require("ignore"));
    import_fs4 = __toESM(require("fs"));
    import_path4 = __toESM(require("path"));
    init_fs();
    init_logger();
    TRANSLATABLE_PROP_NAMES = /* @__PURE__ */ new Set([
      "title",
      "message",
      "placeholder",
      "label",
      "hint",
      "subtitle",
      "description",
      "caption",
      "errorMessage",
      "helperText",
      "emptyText",
      "confirmText",
      "cancelText",
      "buttonText",
      "header",
      "footer",
      "tooltip",
      "accessibilityLabel",
      "accessibilityHint"
    ]);
    NON_TRANSLATABLE_PROP_NAMES = /* @__PURE__ */ new Set([
      "className",
      "style",
      "testID",
      "name",
      "key",
      "id",
      "type",
      "variant",
      "size",
      "color",
      "icon",
      "source",
      "href",
      "to",
      "from",
      "currency",
      "format"
    ]);
    HARD_EXCLUDED_DIRS = [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.expo/**",
      "**/android/**",
      "**/ios/**",
      "**/.git/**"
    ];
  }
});

// src/core/scaffolder.ts
function resolveLocaleFilePath(localesDir, lang, localeFileName) {
  if (localeFileName) {
    return import_path5.default.join(localesDir, lang, `${localeFileName}.json`);
  }
  return import_path5.default.join(localesDir, `${lang}.json`);
}
async function generateLocaleFile(strings, lang, localesDir, localeFileName) {
  ensureDir(localesDir);
  const content = {};
  for (const s of strings) {
    content[s.fullKey] = s.translationValue;
  }
  const sortedContent = Object.fromEntries(
    Object.entries(content).sort(([a], [b]) => a.localeCompare(b))
  );
  const filePath = resolveLocaleFilePath(localesDir, lang, localeFileName);
  writeJson(filePath, sortedContent);
  return { filePath, keyCount: Object.keys(sortedContent).length };
}
function readLocaleFile(lang, localesDir, localeFileName) {
  const filePath = resolveLocaleFilePath(localesDir, lang, localeFileName);
  try {
    const fs6 = require("fs");
    if (!fs6.existsSync(filePath)) return {};
    return JSON.parse(fs6.readFileSync(filePath, "utf-8"));
  } catch {
    logger.warn(`Could not read locale file: ${filePath}`);
    return {};
  }
}
var import_path5;
var init_scaffolder = __esm({
  "src/core/scaffolder.ts"() {
    "use strict";
    init_cjs_shims();
    import_path5 = __toESM(require("path"));
    init_fs();
    init_logger();
  }
});

// src/utils/prompt.ts
async function confirm(message, defaultVal = true) {
  try {
    return await (0, import_prompts.confirm)({ message, default: defaultVal });
  } catch {
    logger.newline();
    logger.info("Aborted.");
    process.exit(0);
  }
}
function detectPackageManager(appRoot) {
  if (import_fs7.default.existsSync(import_path6.default.join(appRoot, "pnpm-lock.yaml"))) return "pnpm";
  if (import_fs7.default.existsSync(import_path6.default.join(appRoot, "yarn.lock"))) return "yarn";
  return "npm";
}
function isExpoProject(appRoot) {
  try {
    const pkgPath = import_path6.default.join(appRoot, "package.json");
    const pkg = JSON.parse(import_fs7.default.readFileSync(pkgPath, "utf-8"));
    return !!(pkg.dependencies?.expo || pkg.devDependencies?.expo);
  } catch {
    return false;
  }
}
function isPackageInstalled(packageName, appRoot) {
  try {
    const pkgPath = import_path6.default.join(appRoot, "package.json");
    const pkg = JSON.parse(import_fs7.default.readFileSync(pkgPath, "utf-8"));
    return !!(pkg.dependencies?.[packageName] || pkg.devDependencies?.[packageName]);
  } catch {
    return false;
  }
}
function buildInstallCommand(packages, packageManager, expo) {
  if (expo) {
    return `npx expo install ${packages.join(" ")}`;
  }
  const commands = {
    npm: `npm install ${packages.join(" ")}`,
    yarn: `yarn add ${packages.join(" ")}`,
    pnpm: `pnpm add ${packages.join(" ")}`
  };
  return commands[packageManager];
}
var import_prompts, import_fs7, import_path6;
var init_prompt = __esm({
  "src/utils/prompt.ts"() {
    "use strict";
    init_cjs_shims();
    import_prompts = require("@inquirer/prompts");
    init_logger();
    import_fs7 = __toESM(require("fs"));
    import_path6 = __toESM(require("path"));
  }
});

// src/commands/scan.ts
var scan_exports = {};
__export(scan_exports, {
  scan: () => scan
});
async function scan(options) {
  const appRoot = import_path7.default.resolve(options.path);
  const isDryRun = options.dryRun ?? false;
  const config = await requireConfig(appRoot);
  const localesDir = import_path7.default.join(appRoot, config.localesDir);
  const dirError = validateLocalesDir(config.localesDir, appRoot);
  if (dirError) {
    logger.error(`Invalid "localesDir" in your config:
  ${dirError}`);
    process.exit(1);
  }
  const outputPreview = config.localeFileName ? `${config.localesDir}/${config.defaultLanguage}/${config.localeFileName}.json` : `${config.localesDir}/${config.defaultLanguage}.json`;
  logger.section("rai \u2014 Scan");
  if (isDryRun) logger.warn("  Dry run \u2014 no files will be written.\n");
  logger.info(`  App root    : ${appRoot}`);
  logger.info(`  Language    : ${config.defaultLanguage}`);
  logger.info(`  Output      : ${outputPreview}`);
  logger.info(
    `  Alerts      : ${config.detectAlerts ? "detected" : "ignored"}`
  );
  logger.info(
    `  Throws      : ${config.detectThrows ? "detected" : "ignored"}`
  );
  if (config.customDetectCalls.length > 0) {
    logger.info(`  Custom calls: ${config.customDetectCalls.join(", ")}`);
  }
  logger.section("Scanning source files...");
  const spinner = (0, import_ora.default)("Scanning...").start();
  let strings;
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
      "  Things to check:\n    \u2022 Is the --path pointing to your app root?\n    \u2022 Does your app have <Text> components with content?\n    \u2022 Are the relevant files excluded by your config or .gitignore?"
    );
    process.exit(0);
  }
  logger.section("Strings found");
  printPreviewTable(strings);
  if (isDryRun) {
    logger.newline();
    logger.warn("Dry run complete \u2014 no files written.");
    logger.info("  Remove --dry-run to generate the locale file.");
    process.exit(0);
  }
  logger.newline();
  const shouldProceed = await confirm(
    `Write ${strings.length} keys to ${outputPreview}?`
  );
  if (!shouldProceed) {
    logger.info("Aborted. No files were written.");
    process.exit(0);
  }
  logger.section("Generating locale file...");
  const { filePath, keyCount } = await generateLocaleFile(
    strings,
    config.defaultLanguage,
    localesDir,
    config.localeFileName
  );
  logger.success(
    `Generated ${import_path7.default.relative(appRoot, filePath)} with ${keyCount} keys`
  );
  printNextSteps(
    appRoot,
    config.localesDir,
    config.defaultLanguage,
    config.localeFileName
  );
}
function printPreviewTable(strings) {
  const byNamespace = strings.reduce(
    (acc, s) => {
      if (!acc[s.namespace]) acc[s.namespace] = [];
      acc[s.namespace].push(s);
      return acc;
    },
    {}
  );
  const namespaces = Object.entries(byNamespace).sort(
    ([a], [b]) => a.localeCompare(b)
  );
  for (const [namespace, items] of namespaces) {
    logger.newline();
    logger.info(
      `  ${import_chalk2.default.bold(namespace)} ` + import_chalk2.default.gray(`(${items.length} string${items.length === 1 ? "" : "s"})`)
    );
    for (const item of items) {
      const keyPart = import_chalk2.default.cyan(item.fullKey.padEnd(50));
      const preview = item.translationValue.substring(0, 40);
      const ellipsis = item.translationValue.length > 40 ? "\u2026" : "";
      const valuePart = import_chalk2.default.gray(`"${preview}${ellipsis}"`);
      const paramsPart = item.params.length > 0 ? import_chalk2.default.yellow(` [params: ${item.params.join(", ")}]`) : "";
      logger.info(`    ${keyPart} ${valuePart}${paramsPart}`);
    }
  }
  logger.newline();
  logger.info(
    `  ${import_chalk2.default.bold(String(strings.length))} total string(s) across ${import_chalk2.default.bold(String(namespaces.length))} namespace(s)`
  );
}
function printNextSteps(appRoot, localesDir, defaultLang, localeFileName) {
  logger.section("Next steps");
  const isInsideSrc = localesDir.startsWith("src/");
  const localesDirFromSrc = isInsideSrc ? `./${localesDir.replace(/^src\//, "")}` : `../${localesDir}`;
  const localeImportPath = localeFileName ? `${localesDirFromSrc}/${defaultLang}/${localeFileName}.json` : `${localesDirFromSrc}/${defaultLang}.json`;
  const localeOutputPath = localeFileName ? `${localesDir}/${defaultLang}/${localeFileName}.json` : `${localesDir}/${defaultLang}.json`;
  const missing = ["i18next", "react-i18next"].filter(
    (pkg) => !isPackageInstalled(pkg, appRoot)
  );
  const pm = detectPackageManager(appRoot);
  const isExpo = isExpoProject(appRoot);
  let stepNum = 1;
  if (missing.length > 0) {
    const installCmd = buildInstallCommand(missing, pm, isExpo);
    logger.info(`
  ${stepNum++}. Install required dependencies:
       ${import_chalk2.default.cyan(installCmd)}`);
  }
  logger.info(`
  ${stepNum++}. Create src/i18n.ts in your project:

${import_chalk2.default.cyan(`     import i18n from 'i18next'
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
       ${import_chalk2.default.cyan(`import './src/i18n'`)}

  ${stepNum++}. Review ${localeOutputPath}, then commit:
       ${import_chalk2.default.cyan(`git add .
git commit -m "chore: add i18n locale file"`)}

  ${stepNum++}. Then run:
       ${import_chalk2.default.cyan(`rai replace`)}

       This will rewrite your source files to use t() calls automatically.
  `);
}
var import_path7, import_chalk2, import_ora;
var init_scan = __esm({
  "src/commands/scan.ts"() {
    "use strict";
    init_cjs_shims();
    import_path7 = __toESM(require("path"));
    import_chalk2 = __toESM(require("chalk"));
    import_ora = __toESM(require("ora"));
    init_logger();
    init_config2();
    init_scanner();
    init_scaffolder();
    init_prompt();
  }
});

// src/core/transformer.ts
function buildTCall(key) {
  return t2.callExpression(t2.identifier("t"), [t2.stringLiteral(key)]);
}
function buildTCallWithParams(key, params) {
  const paramsObject = t2.objectExpression(
    params.map((param) => {
      const identifier2 = t2.identifier(param);
      const prop = t2.objectProperty(identifier2, identifier2);
      prop.shorthand = true;
      return prop;
    })
  );
  return t2.callExpression(t2.identifier("t"), [
    t2.stringLiteral(key),
    paramsObject
  ]);
}
function buildJSXExpression(call) {
  return t2.jsxExpressionContainer(call);
}
function buildUseTranslationImport() {
  return t2.importDeclaration(
    [
      t2.importSpecifier(
        t2.identifier("useTranslation"),
        t2.identifier("useTranslation")
      )
    ],
    t2.stringLiteral("react-i18next")
  );
}
function buildUseTranslationCall() {
  return t2.variableDeclaration("const", [
    t2.variableDeclarator(
      /**
       * Destructured pattern: { t }
       * ObjectPattern with a single RestElement-free property
       */
      t2.objectPattern([
        t2.objectProperty(
          t2.identifier("t"),
          t2.identifier("t"),
          false,
          // not computed
          true
          // shorthand: { t } not { t: t }
        )
      ]),
      /**
       * The initializer: useTranslation()
       * A call expression with no arguments
       */
      t2.callExpression(t2.identifier("useTranslation"), [])
    )
  ]);
}
function findExtracted(value, filePath, strings, sourceType) {
  return strings.find(
    (s) => s.filePath === filePath && s.originalText === value.trim() && (sourceType ? s.sourceType === sourceType : true)
  );
}
function findExtractedTemplate(node, filePath, strings) {
  let text = "";
  let argIndex = 0;
  node.quasis.forEach((quasi, i) => {
    text += quasi.value.cooked ?? quasi.value.raw;
    if (i < node.expressions.length) {
      const expr = node.expressions[i];
      let paramName;
      if (t2.isIdentifier(expr)) {
        paramName = expr.name;
      } else if (t2.isMemberExpression(expr) && t2.isIdentifier(expr.property)) {
        paramName = expr.property.name;
      } else {
        paramName = `arg${argIndex++}`;
      }
      text += `{{${paramName}}}`;
    }
  });
  return strings.find(
    (s) => s.filePath === filePath && s.originalText === text.trim()
  );
}
function replaceExpression(nodePath, filePath, strings, sourceType) {
  const node = nodePath.node;
  let count = 0;
  if (t2.isStringLiteral(node)) {
    const extracted = findExtracted(node.value, filePath, strings, sourceType);
    if (!extracted) return 0;
    const call = extracted.params.length > 0 ? buildTCallWithParams(extracted.fullKey, extracted.params) : buildTCall(extracted.fullKey);
    nodePath.replaceWith(call);
    count++;
  } else if (t2.isTemplateLiteral(node)) {
    const extracted = findExtractedTemplate(node, filePath, strings);
    if (!extracted) return 0;
    const call = extracted.params.length > 0 ? buildTCallWithParams(extracted.fullKey, extracted.params) : buildTCall(extracted.fullKey);
    nodePath.replaceWith(call);
    count++;
  } else if (t2.isConditionalExpression(node)) {
    count += replaceExpression(
      nodePath.get("consequent"),
      filePath,
      strings,
      sourceType
    );
    count += replaceExpression(
      nodePath.get("alternate"),
      filePath,
      strings,
      sourceType
    );
  } else if (t2.isLogicalExpression(node)) {
    count += replaceExpression(
      nodePath.get("left"),
      filePath,
      strings,
      sourceType
    );
    count += replaceExpression(
      nodePath.get("right"),
      filePath,
      strings,
      sourceType
    );
  }
  return count;
}
function hasUseTranslationImport(ast) {
  let found = false;
  (0, import_traverse2.default)(ast, {
    ImportDeclaration(nodePath) {
      if (nodePath.node.source.value !== "react-i18next") return;
      const hasIt = nodePath.node.specifiers.some(
        (spec) => t2.isImportSpecifier(spec) && t2.isIdentifier(spec.imported) && spec.imported.name === "useTranslation"
      );
      if (hasIt) {
        found = true;
        nodePath.stop();
      }
    }
  });
  return found;
}
function addUseTranslationImport(ast) {
  const body = ast.program.body;
  let lastImportIndex = -1;
  for (let i = 0; i < body.length; i++) {
    if (t2.isImportDeclaration(body[i])) {
      lastImportIndex = i;
    }
  }
  const importNode = buildUseTranslationImport();
  if (lastImportIndex >= 0) {
    body.splice(lastImportIndex + 1, 0, importNode);
  } else {
    body.unshift(importNode);
  }
}
function hasTDeclaration(bodyPath) {
  let found = false;
  bodyPath.traverse({
    VariableDeclaration(vPath) {
      const decl = vPath.node.declarations[0];
      if (!decl) return;
      if (t2.isObjectPattern(decl.id) && decl.id.properties.some(
        (p) => t2.isObjectProperty(p) && t2.isIdentifier(p.key) && p.key.name === "t"
      ) && t2.isCallExpression(decl.init) && t2.isIdentifier(decl.init.callee) && decl.init.callee.name === "useTranslation") {
        found = true;
        vPath.stop();
      }
    }
  });
  return found;
}
function addTDeclaration(bodyPath) {
  if (hasTDeclaration(bodyPath)) return;
  const declaration = buildUseTranslationCall();
  bodyPath.unshiftContainer("body", declaration);
}
function transformFile(filePath, appRoot, strings, localeData) {
  const code = readFileSafe(filePath);
  if (!code) {
    return { filePath, modified: false, replacements: 0 };
  }
  const fileStrings = strings.filter(
    (s) => s.filePath === filePath && localeData[s.fullKey] !== void 0
  );
  if (fileStrings.length === 0) {
    logger.debug(
      `No matching strings for ${import_path8.default.relative(appRoot, filePath)} \u2014 skipping`
    );
    return { filePath, modified: false, replacements: 0 };
  }
  let ast;
  try {
    ast = parser2.parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript", "decorators-legacy"]
    });
  } catch (err) {
    logger.warn(
      `Could not parse ${import_path8.default.relative(appRoot, filePath)} \u2014 skipping`
    );
    logger.debug(String(err));
    return { filePath, modified: false, replacements: 0 };
  }
  let totalReplacements = 0;
  let needsHook = false;
  (0, import_traverse2.default)(ast, {
    // ── JSX text: <Text>Hello</Text> ─────────────────────────────────────────
    JSXText(nodePath) {
      const value = nodePath.node.value.trim();
      if (!value) return;
      const extracted = findExtracted(value, filePath, fileStrings, "jsx-text");
      if (!extracted) return;
      const call = buildTCall(extracted.fullKey);
      nodePath.replaceWith(buildJSXExpression(call));
      totalReplacements++;
      needsHook = true;
    },
    // ── JSX expression container: <Text>{"Hello"}</Text> ────────────────────
    JSXExpressionContainer(nodePath) {
      const parent = nodePath.parent;
      if (!t2.isJSXElement(parent) && !t2.isJSXFragment(parent)) return;
      const exprPath = nodePath.get("expression");
      const count = replaceExpression(
        exprPath,
        filePath,
        fileStrings,
        "jsx-expression"
      );
      if (count > 0) {
        totalReplacements += count;
        needsHook = true;
      }
    },
    // ── JSX attribute: <Comp title="Hello" /> ────────────────────────────────
    JSXAttribute(nodePath) {
      const { name, value } = nodePath.node;
      const propName = t2.isJSXIdentifier(name) ? name.name : null;
      if (!propName) return;
      if (!t2.isStringLiteral(value)) return;
      const extracted = findExtracted(
        value.value,
        filePath,
        fileStrings,
        "jsx-attribute"
      );
      if (!extracted) return;
      const call = buildTCall(extracted.fullKey);
      nodePath.node.value = buildJSXExpression(call);
      totalReplacements++;
      needsHook = true;
    },
    // ── Alert.alert() calls ──────────────────────────────────────────────────
    CallExpression(nodePath) {
      const { callee, arguments: args } = nodePath.node;
      const isAlert = t2.isMemberExpression(callee) && t2.isIdentifier(callee.object) && callee.object.name === "Alert" && t2.isIdentifier(callee.property) && callee.property.name === "alert";
      if (isAlert) {
        args.forEach((arg, index) => {
          if (!t2.isStringLiteral(arg)) return;
          const extracted = findExtracted(
            arg.value,
            filePath,
            fileStrings,
            "alert"
          );
          if (!extracted)
            return;
          nodePath.node.arguments[index] = buildTCall(
            extracted.fullKey
          );
          totalReplacements++;
          needsHook = true;
        });
        return;
      }
      let calleeName = null;
      if (t2.isIdentifier(callee)) {
        calleeName = callee.name;
      } else if (t2.isMemberExpression(callee) && t2.isIdentifier(callee.object) && t2.isIdentifier(callee.property)) {
        calleeName = `${callee.object.name}.${callee.property.name}`;
      }
      if (!calleeName) return;
      args.forEach((arg, index) => {
        if (!t2.isStringLiteral(arg)) return;
        const extracted = findExtracted(
          arg.value,
          filePath,
          fileStrings,
          "call"
        );
        if (!extracted) return;
        nodePath.node.arguments[index] = buildTCall(
          extracted.fullKey
        );
        totalReplacements++;
        needsHook = true;
      });
    },
    // ── Throw statements: throw new Error('msg') ─────────────────────────────
    ThrowStatement(nodePath) {
      const { argument } = nodePath.node;
      if (t2.isNewExpression(argument) && t2.isIdentifier(argument.callee) && argument.callee.name === "Error") {
        argument.arguments.forEach((arg, index) => {
          if (!t2.isStringLiteral(arg)) return;
          const extracted = findExtracted(
            arg.value,
            filePath,
            fileStrings,
            "throw"
          );
          if (!extracted) return;
          argument.arguments[index] = buildTCall(extracted.fullKey);
          totalReplacements++;
        });
      }
    },
    // ── Inject useTranslation hook into components ───────────────────────────
    /**
     * We visit function bodies and inject the hook at the top.
     *
     * We use a post-traversal approach: after all replacements are done,
     * we know which files need the hook (needsHook flag). But since
     * traverse only runs once, we inject during traversal whenever we
     * enter a component body.
     *
     * The hasTDeclaration check prevents duplicate injections when
     * a file has multiple components.
     */
    "FunctionDeclaration|FunctionExpression|ArrowFunctionExpression"(nodePath) {
      if (!needsHook) return;
      if (!totalReplacements) return;
      const body = nodePath.get("body");
      if (!t2.isBlockStatement(body.node)) return;
      const funcNode = nodePath.node;
      const funcName = t2.isFunctionDeclaration(funcNode) && funcNode.id ? funcNode.id.name : t2.isVariableDeclarator(nodePath.parent) && t2.isIdentifier(nodePath.parent.id) ? nodePath.parent.id.name : null;
      const isComponent = funcName && /^[A-Z]/.test(funcName) || t2.isExportDefaultDeclaration(nodePath.parentPath?.node);
      if (!isComponent) return;
      addTDeclaration(body);
    }
  });
  if (totalReplacements === 0) {
    return { filePath, modified: false, replacements: 0 };
  }
  if (needsHook && !hasUseTranslationImport(ast)) {
    addUseTranslationImport(ast);
  }
  const output = (0, import_generator.default)(
    ast,
    {
      retainLines: false,
      concise: false,
      jsescOption: { minimal: true }
    },
    code
  );
  return {
    filePath,
    modified: true,
    replacements: totalReplacements,
    newCode: output.code
  };
}
async function transformProject(appRoot, strings, localeData) {
  const uniqueFiles = [...new Set(strings.map((s) => s.filePath))];
  logger.dim(`  Processing ${uniqueFiles.length} file(s)...`);
  const results = [];
  for (const filePath of uniqueFiles) {
    const result = transformFile(filePath, appRoot, strings, localeData);
    results.push(result);
    if (result.modified) {
      logger.dim(
        `  \u2713 ${import_path8.default.relative(appRoot, filePath)} \u2014 ${result.replacements} replacement(s)`
      );
    } else {
      logger.debug(`  \u25CB ${import_path8.default.relative(appRoot, filePath)} \u2014 no changes`);
    }
  }
  return results;
}
var parser2, import_traverse2, import_generator, t2, import_path8;
var init_transformer = __esm({
  "src/core/transformer.ts"() {
    "use strict";
    init_cjs_shims();
    parser2 = __toESM(require("@babel/parser"));
    import_traverse2 = __toESM(require("@babel/traverse"));
    import_generator = __toESM(require("@babel/generator"));
    t2 = __toESM(require("@babel/types"));
    import_path8 = __toESM(require("path"));
    init_fs();
    init_logger();
  }
});

// src/commands/replace.ts
var replace_exports = {};
__export(replace_exports, {
  replace: () => replace
});
async function replace(options) {
  const appRoot = import_path9.default.resolve(options.path);
  const isDryRun = options.dryRun ?? false;
  const config = await requireConfig(appRoot);
  const localesDir = import_path9.default.join(appRoot, config.localesDir);
  const dirError = validateLocalesDir(config.localesDir, appRoot);
  if (dirError) {
    logger.error(`Invalid "localesDir" in your config:
  ${dirError}`);
    process.exit(1);
  }
  logger.section("rai \u2014 Replace");
  if (isDryRun) logger.warn("  Dry run \u2014 no files will be written.\n");
  const localeFilePath = resolveLocaleFilePath(
    localesDir,
    config.defaultLanguage,
    config.localeFileName
  );
  if (!exists(localeFilePath)) {
    logger.error(
      `Locale file not found: ${import_path9.default.relative(appRoot, localeFilePath)}
  Run "rai scan" first to generate the locale file.`
    );
    process.exit(1);
  }
  const localeData = readLocaleFile(
    config.defaultLanguage,
    localesDir,
    config.localeFileName
  );
  const keyCount = Object.keys(localeData).length;
  logger.info(`  Locale file : ${import_path9.default.relative(appRoot, localeFilePath)}`);
  logger.info(`  Keys loaded : ${keyCount}`);
  if (keyCount === 0) {
    logger.error(`The locale file is empty. Run "rai scan" to populate it.`);
    process.exit(1);
  }
  logger.section("Scanning for string locations...");
  const spinner = (0, import_ora2.default)("Scanning...").start();
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
  logger.section("Computing replacements...");
  const results = await transformProject(appRoot, strings, localeData);
  const modifiedResults = results.filter((r) => r.modified);
  const totalReplacements = modifiedResults.reduce(
    (sum, r) => sum + r.replacements,
    0
  );
  if (modifiedResults.length === 0) {
    logger.warn(
      "No replacements needed. Your source files may already use t() calls."
    );
    process.exit(0);
  }
  logger.section("Preview \u2014 files to be modified");
  logger.newline();
  modifiedResults.forEach((result) => {
    logger.info(
      `  ${import_chalk3.default.cyan(import_path9.default.relative(appRoot, result.filePath))}` + import_chalk3.default.gray(` \u2014 ${result.replacements} replacement(s)`)
    );
  });
  logger.newline();
  logger.info(
    `  ${import_chalk3.default.bold(String(modifiedResults.length))} file(s) will be modified with ${import_chalk3.default.bold(String(totalReplacements))} total replacement(s)`
  );
  if (isDryRun) {
    logger.newline();
    logger.warn("Dry run complete \u2014 no files written.");
    logger.info("  Remove --dry-run to apply changes.");
    process.exit(0);
  }
  logger.newline();
  logger.warn(
    "This will modify your source files directly.\n  Make sure your changes are committed before proceeding."
  );
  logger.newline();
  const shouldProceed = await confirm(
    `Modify ${modifiedResults.length} file(s) with t() replacements?`,
    false
    // default to NO for a destructive operation
  );
  if (!shouldProceed) {
    logger.info("Aborted. No files were modified.");
    process.exit(0);
  }
  logger.section("Applying replacements...");
  let written = 0;
  for (const result of modifiedResults) {
    if (!result.newCode) continue;
    try {
      writeFile(result.filePath, result.newCode);
      written++;
      logger.success(
        `${import_path9.default.relative(appRoot, result.filePath)} \u2014 ${result.replacements} replacement(s)`
      );
    } catch (err) {
      logger.error(
        `Failed to write ${import_path9.default.relative(appRoot, result.filePath)}: ${String(err)}`
      );
    }
  }
  logger.newline();
  logger.success(`Done \u2014 ${written} file(s) updated.`);
  logger.section("Next steps");
  logger.info(`
  1. Run your app and verify everything works:
       npx expo start
       (or your usual start command)

  2. Check for any components where the hook injection may need
     manual adjustment \u2014 particularly:
       \u2022 Components that are not named with an uppercase letter
       \u2022 HOCs or render prop patterns
       \u2022 Async functions that use t() from a throw statement

  3. If everything looks good, commit:
       ${import_chalk3.default.cyan("git add .")}
       ${import_chalk3.default.cyan('git commit -m "feat: replace strings with i18n t() calls"')}

  4. To add more languages in the future:
       \u2022 Copy ${import_path9.default.relative(appRoot, localeFilePath)} and translate the values
       \u2022 Add the new language to your i18n.ts resources object
  `);
}
var import_path9, import_chalk3, import_ora2;
var init_replace = __esm({
  "src/commands/replace.ts"() {
    "use strict";
    init_cjs_shims();
    import_path9 = __toESM(require("path"));
    import_chalk3 = __toESM(require("chalk"));
    import_ora2 = __toESM(require("ora"));
    init_logger();
    init_config2();
    init_scanner();
    init_scaffolder();
    init_transformer();
    init_fs();
    init_prompt();
  }
});

// src/cli.ts
init_cjs_shims();
var import_commander = require("commander");
import_commander.program.name("rai").description(
  "Automatic i18n scanner and code transformer for React Native apps"
).version("0.1.0").enablePositionalOptions().option("--debug", "Show verbose debug output").hook("preAction", () => {
  if (import_commander.program.opts().debug) {
    const { setDebugMode: setDebugMode2 } = (init_logger(), __toCommonJS(logger_exports));
    setDebugMode2(true);
  }
});
import_commander.program.command("init").description("Generate rai.config.ts with default settings").option("-p, --path <path>", "Root path of the project", ".").action(async (options) => {
  const { init: init2 } = await Promise.resolve().then(() => (init_init(), init_exports));
  await init2(options);
});
import_commander.program.command("scan").description("Scan the app and generate locale files").option("-p, --path <path>", "Root path of the project", ".").option("--dry-run", "Preview without writing files").action(async (options) => {
  const { scan: scan2 } = await Promise.resolve().then(() => (init_scan(), scan_exports));
  await scan2(options);
});
import_commander.program.command("replace").description("Replace raw strings in source files with t() calls").option("-p, --path <path>", "Root path of the project", ".").option("--dry-run", "Preview without writing files").action(async (options) => {
  const { replace: replace2 } = await Promise.resolve().then(() => (init_replace(), replace_exports));
  await replace2(options);
});
import_commander.program.parse(process.argv);
//# sourceMappingURL=cli.js.map