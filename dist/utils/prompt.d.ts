/**
 * Asks the user a yes/no question in the terminal.
 *
 * Returns true if the user answers yes, false if no.
 * Exits cleanly if the user presses Ctrl+C.
 *
 * Why @inquirer/prompts instead of readline?
 *   - Handles Ctrl+C gracefully without crashing
 *   - Renders a proper interactive prompt with y/N default indicator
 *   - Is the modern successor to the widely used `inquirer` package
 *
 * @param message     - The question to display
 * @param defaultVal  - Whether the default answer is yes (true) or no (false)
 */
export declare function confirm(message: string, defaultVal?: boolean): Promise<boolean>;
/**
 * Detects which package manager the project uses by checking for lockfiles.
 *
 * Why lockfiles and not package.json?
 * Lockfiles are always created when a package manager runs and are
 * the most reliable signal. package.json has no field for this.
 *
 * Priority: pnpm > yarn > npm
 * pnpm and yarn are checked first because npm is the fallback —
 * a project using pnpm will also have a node_modules folder but
 * only pnpm creates pnpm-lock.yaml.
 *
 * @param appRoot - Absolute path to the project root
 */
export declare function detectPackageManager(appRoot: string): "npm" | "yarn" | "pnpm";
/**
 * Returns true if the project is an Expo project.
 *
 * We check for 'expo' in both dependencies and devDependencies because
 * some setups install expo as a dev dependency.
 *
 * Why does this matter?
 * Expo projects should use `npx expo install` instead of the raw package
 * manager when installing React Native compatible packages, because
 * expo install pins to versions compatible with the current Expo SDK.
 *
 * @param appRoot - Absolute path to the project root
 */
export declare function isExpoProject(appRoot: string): boolean;
/**
 * Checks whether a package is already listed in the project's
 * dependencies or devDependencies.
 *
 * Used to avoid suggesting installs for packages already present.
 *
 * @param packageName - npm package name to check e.g. 'react-i18next'
 * @param appRoot     - Absolute path to the project root
 */
export declare function isPackageInstalled(packageName: string, appRoot: string): boolean;
/**
 * Builds the correct install command for the given packages,
 * package manager, and whether the project uses Expo.
 *
 * @param packages       - List of package names to install
 * @param packageManager - 'npm' | 'yarn' | 'pnpm'
 * @param expo           - Whether to use npx expo install
 */
export declare function buildInstallCommand(packages: string[], packageManager: "npm" | "yarn" | "pnpm", expo: boolean): string;
//# sourceMappingURL=prompt.d.ts.map