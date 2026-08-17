/**
 * Edits the i18n.ts file to import and register locale files that
 * aren't already wired in. Idempotent — safe to run repeatedly.
 *
 * Returns the list of language codes that were newly added.
 * Returns [] if the file doesn't exist or nothing needed adding.
 */
export declare function wireLocaleImports(i18nFilePath: string, localesDir: string, localeFileName: string | null, languages: string[]): string[];
//# sourceMappingURL=wire-i18n-imports.d.ts.map