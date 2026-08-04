import type { ExtractedString } from "./scanner";
import type { LocaleFile } from "./scaffolder";
/**
 * Why recast + ast-types instead of @babel/traverse?
 *
 * recast.parse() returns a recast-wrapped AST. Passing this to
 * @babel/traverse causes crashes because Babel's scope analysis
 * expects a raw Babel AST, not a recast-wrapped one.
 *
 * The correct pairing is:
 *   recast.parse()  →  ast-types visit()  →  recast.print()
 *
 * ast-types is recast's companion library (it's a dependency of recast,
 * already installed). It provides the visit() function which traverses
 * recast ASTs correctly.
 *
 * recast.print() then only reprints nodes that were actually modified,
 * producing minimal git diffs.
 */
export interface TransformResult {
    filePath: string;
    modified: boolean;
    replacements: number;
    newCode?: string;
}
export declare function transformFile(filePath: string, appRoot: string, strings: ExtractedString[], localeData: LocaleFile): TransformResult;
/**
 * Transforms all files with translatable strings.
 * Each file is processed independently — no shared state between files.
 */
export declare function transformProject(appRoot: string, strings: ExtractedString[], localeData: LocaleFile): Promise<TransformResult[]>;
//# sourceMappingURL=transformer.d.ts.map