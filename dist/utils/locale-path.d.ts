/**
 * Resolves the file path for a given language, following the same
 * localesDir/localeFileName convention used by the scan command.
 *
 * localeFileName set    → <localesDir>/<lang>/<localeFileName>.json
 * localeFileName null   → <localesDir>/<lang>.json
 */
export declare function resolveLocaleFilePath(config: {
    localesDir: string;
    localeFileName: string | null;
}, langCode: string): string;
//# sourceMappingURL=locale-path.d.ts.map