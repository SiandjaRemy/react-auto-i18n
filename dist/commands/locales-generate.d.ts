export interface GenerateResult {
    locale: string;
    filePath: string;
    isNew: boolean;
    keysAdded: string[];
}
export interface GenerateOptions {
    path: string;
    only?: string[];
    force?: boolean;
    yes?: boolean;
    withImports?: boolean;
    dryRun?: boolean;
}
export declare function runLocalesGenerate(options: GenerateOptions): Promise<void>;
//# sourceMappingURL=locales-generate.d.ts.map