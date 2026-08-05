interface RevertOptions {
    path: string;
    clean?: boolean;
}
/**
 * `rai revert`
 *
 * Restores all source files to their state before `rai replace` was run.
 * Uses the .i18nbak backup files created during replacement.
 *
 * Flags:
 *   --clean   Delete backup files WITHOUT restoring source files.
 *             Use this after you've verified replace output is correct
 *             and you're ready to commit.
 *
 * Typical workflow:
 *   rai replace          → modifies files, creates .i18nbak backups
 *   npx expo start       → verify the app works
 *
 *   If something's wrong:
 *     rai revert         → restores original files, deletes backups
 *
 *   If everything's good:
 *     rai revert --clean → deletes backups only, keeps modified files
 *     git add . && git commit
 */
export declare function revert(options: RevertOptions): Promise<void>;
export {};
//# sourceMappingURL=revert.d.ts.map