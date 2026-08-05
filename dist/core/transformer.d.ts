import type { ExtractedString } from "./scanner";
import type { LocaleFile } from "./scaffolder";
export interface TransformResult {
    filePath: string;
    modified: boolean;
    replacements: number;
    newCode?: string;
}
export declare function transformFile(filePath: string, appRoot: string, strings: ExtractedString[], localeData: LocaleFile): TransformResult;
export declare function transformProject(appRoot: string, strings: ExtractedString[], localeData: LocaleFile): Promise<TransformResult[]>;
//# sourceMappingURL=transformer.d.ts.map