/**
 * Validates a list of language codes against the supported ISO 639-1 list.
 *
 * Returns valid and invalid codes separately so the caller can:
 *   - Warn about invalid codes without stopping entirely
 *   - Proceed with only the valid subset
 *   - Bail out if nothing valid remains
 */
export declare function validateLanguageCodes(codes: string[]): {
    valid: string[];
    invalid: string[];
};
//# sourceMappingURL=validation.d.ts.map