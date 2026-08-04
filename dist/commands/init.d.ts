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
export declare function init(options: InitOptions): Promise<void>;
export {};
//# sourceMappingURL=init.d.ts.map