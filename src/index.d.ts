/**
 * Manual type declaration file for react-auto-i18n.
 *
 * This file exists because dts generation is disabled in tsup.config.ts
 * due to a compatibility issue with rollup-plugin-dts and the current
 * TypeScript version.
 *
 * This file is copied to dist/ by the build script (see package.json).
 * It tells TypeScript what types are available when someone writes:
 *   import type { RaiConfig } from 'react-auto-i18n'
 */

export type { RaiConfig, LanguageCode } from './types/config'
export { SUPPORTED_LANGUAGE_CODES, SUPPORTED_LOCALES } from "./types/config";
