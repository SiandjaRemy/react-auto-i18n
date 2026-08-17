import path from "path";

/**
 * Resolves the file path for a given language, following the same
 * localesDir/localeFileName convention used by the scan command.
 *
 * localeFileName set    → <localesDir>/<lang>/<localeFileName>.json
 * localeFileName null   → <localesDir>/<lang>.json
 */
export function resolveLocaleFilePath(
  config: { localesDir: string; localeFileName: string | null },
  langCode: string,
): string {
  return config.localeFileName
    ? path.join(config.localesDir, langCode, `${config.localeFileName}.json`)
    : path.join(config.localesDir, `${langCode}.json`);
}
