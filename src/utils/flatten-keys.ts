/**
 * Flattens a nested translation object into dot-notation keys.
 *   { auth: { login: "Log in" } }  →  { "auth.login": "Log in" }
 */
export function flattenKeys(
  obj: Record<string, any>,
  prefix = "",
): Record<string, string> {
  const out: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === "object") {
      Object.assign(out, flattenKeys(value, fullKey));
    } else {
      out[fullKey] = value;
    }
  }

  return out;
}

/**
 * Sets a value at a dot-notation path inside a nested object,
 * creating intermediate objects as needed.
 */
export function setNestedKey(
  obj: Record<string, any>,
  keyPath: string,
  value: string,
): void {
  const parts = keyPath.split(".");
  let cursor = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (typeof cursor[part] !== "object" || cursor[part] === null) {
      cursor[part] = {};
    }
    cursor = cursor[part];
  }

  cursor[parts[parts.length - 1]] = value;
}
