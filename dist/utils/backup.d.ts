/**
 * Creates a backup copy of a file before it is modified by replace.
 *
 * The backup sits alongside the original:
 *   src/app/index.tsx       ← will be modified
 *   src/app/index.tsx.i18nbak  ← untouched copy of original
 *
 * If a backup already exists, it is NOT overwritten. This preserves
 * the very first pre-replace state even if replace is run multiple times.
 *
 * @param filePath - Absolute path to the file to back up
 */
export declare function backupFile(filePath: string): void;
/**
 * Finds all backup files in the project.
 *
 * @param appRoot - Absolute path to the project root
 */
export declare function findBackupFiles(appRoot: string): Promise<string[]>;
/**
 * Restores all backed-up files to their pre-replace state.
 *
 * For each .i18nbak file found:
 *   1. Copy it back over the modified source file
 *   2. Delete the .i18nbak file
 *
 * After this runs, the project is back to its state before replace.
 *
 * @param appRoot - Absolute path to the project root
 * @returns Number of files successfully restored
 */
export declare function restoreAllBackups(appRoot: string): Promise<number>;
/**
 * Deletes all backup files without restoring them.
 * Use this after verifying the replace output is correct.
 *
 * @param appRoot - Absolute path to the project root
 * @returns Number of backup files deleted
 */
export declare function deleteAllBackups(appRoot: string): Promise<number>;
//# sourceMappingURL=backup.d.ts.map