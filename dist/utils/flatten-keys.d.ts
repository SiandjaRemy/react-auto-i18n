/**
 * Flattens a nested translation object into dot-notation keys.
 *   { auth: { login: "Log in" } }  →  { "auth.login": "Log in" }
 */
export declare function flattenKeys(obj: Record<string, any>, prefix?: string): Record<string, string>;
/**
 * Sets a value at a dot-notation path inside a nested object,
 * creating intermediate objects as needed.
 */
export declare function setNestedKey(obj: Record<string, any>, keyPath: string, value: string): void;
//# sourceMappingURL=flatten-keys.d.ts.map