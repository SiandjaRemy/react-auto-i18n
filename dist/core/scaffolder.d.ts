import type { ExtractedString } from "./scanner";
export type LocaleFile = Record<string, string>;
/**
 * Resolves the full output path for a locale file based on config.
 *
 * Two behaviours:
 *
 * localeFileName is null (default):
 *   → localesDir/lang.json
 *   → locales/en.json
 *
 * localeFileName is set:
 *   → localesDir/lang/localeFileName.json
 *   → locales/en/translation.json
 *
 * This is the single source of truth for path resolution.
 * Both scaffolder and scan command use this so they always agree
 * on where the file lives.
 *
 * @param localesDir    - Absolute path to the locales directory
 * @param lang          - Language code e.g. "en"
 * @param localeFileName - Custom file name or null
 */
export declare function resolveLocaleFilePath(localesDir: string, lang: string, localeFileName: string | null): string;
/**
 * Generates the locale JSON file for the default language.
 *
 * @param strings        - All extracted strings from scanProject()
 * @param lang           - Language code e.g. "en"
 * @param localesDir     - Absolute path to the locales directory
 * @param localeFileName - Custom file name from config, or null for default
 */
export declare function generateLocaleFile(strings: ExtractedString[], lang: string, localesDir: string, localeFileName: string | null): Promise<{
    filePath: string;
    keyCount: number;
}>;
/**
 * Reads an existing locale JSON file and returns its contents.
 * Returns an empty object if the file does not exist.
 *
 * @param lang           - Language code
 * @param localesDir     - Absolute path to the locales directory
 * @param localeFileName - Custom file name or null
 */
export declare function readLocaleFile(lang: string, localesDir: string, localeFileName: string | null): LocaleFile;
//# sourceMappingURL=scaffolder.d.ts.map