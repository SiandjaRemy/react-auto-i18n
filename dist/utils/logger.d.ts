export declare function setDebugMode(val: boolean): void;
export declare function isDebugMode(): boolean;
/**
 * Central logging utility for all terminal output.
 *
 * Why a custom logger instead of console.log directly?
 *   - Consistent formatting and color across all commands
 *   - Easy to silence or redirect in tests
 *   - Single place to change output style globally
 *
 * Color conventions:
 *   cyan bold  → section headers (major steps)
 *   green      → success (something was created or completed)
 *   yellow     → warnings (something is off but not fatal)
 *   red        → errors (something failed)
 *   gray       → secondary info (file paths, counts, details)
 *   white      → primary info (main messages)
 *   magenta    → debug (internal state, only shown with --debug)
 */
export declare const logger: {
    info: (msg: string) => void;
    success: (msg: string) => void;
    warn: (msg: string) => void;
    error: (msg: string) => void;
    /**
     * Muted text for secondary information.
     * Use for file paths, counts, and details that are helpful
     * but shouldn't dominate the output.
     */
    dim: (msg: string) => void;
    /**
     * Bold cyan header that visually separates major steps.
     * Use at the start of each logical phase within a command.
     */
    section: (msg: string) => void;
    /**
     * Only prints when --debug flag is active.
     * Use for internal state that helps diagnose problems:
     * AST node types, file paths being considered, config values, etc.
     */
    debug: (msg: string) => void;
    /**
     * Prints a blank line.
     * Use to add breathing room between sections in the output.
     */
    newline: () => void;
};
//# sourceMappingURL=logger.d.ts.map