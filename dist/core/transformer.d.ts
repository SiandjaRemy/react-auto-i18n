import type { ExtractedString } from "./scanner";
import type { LocaleFile } from "./scaffolder";
/**
 * The result of transforming a single file.
 */
export interface TransformResult {
    /** Absolute path to the file */
    filePath: string;
    /** Whether the file was actually modified */
    modified: boolean;
    /** How many string replacements were made */
    replacements: number;
    /** The transformed source code (only set when modified is true) */
    newCode?: string;
}
/**
 * Transforms a single source file by replacing all translatable strings
 * with t() calls and injecting the useTranslation hook.
 *
 * Steps:
 *   1. Read the file
 *   2. Parse into AST
 *   3. Find strings that have entries in the locale file
 *   4. Replace each one with the appropriate t() call
 *   5. Inject useTranslation import if needed
 *   6. Inject const { t } = useTranslation() inside component if needed
 *   7. Generate new source code from the modified AST
 *
 * The function never writes to disk — it returns the new code.
 * Writing is handled by the replace command so dry-run is possible.
 *
 * @param filePath   - Absolute path to the source file
 * @param appRoot    - Absolute path to the app root
 * @param strings    - All extracted strings (from the scan)
 * @param localeData - The locale JSON file contents (for verification)
 */
export declare function transformFile(filePath: string, appRoot: string, strings: ExtractedString[], localeData: LocaleFile): TransformResult;
/**
 * Transforms all files in the project that have translatable strings.
 *
 * This function only computes transformations — it does not write to disk.
 * The replace command decides whether to write based on dry-run mode
 * and user confirmation.
 *
 * @param appRoot    - Absolute path to the app root
 * @param strings    - All extracted strings from the scan
 * @param localeData - The locale JSON file contents
 */
export declare function transformProject(appRoot: string, strings: ExtractedString[], localeData: LocaleFile): Promise<TransformResult[]>;
//# sourceMappingURL=transformer.d.ts.map