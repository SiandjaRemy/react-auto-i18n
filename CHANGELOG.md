# Changelog

All notable changes to this project will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.1] — 2026-08-05

### Fixed
- Updated the package name in the README.md

---


## [0.1.0] — 2026-08-05

### Initial release

- `rai init` — generates a typed `i18nauto.config.ts` with annotated defaults
- `rai scan` — AST-based scanner that extracts translatable strings from `.ts`, `.tsx`, `.js`, `.jsx` files
  - Detects JSX text content, string expressions, template literals, ternaries, and logical expressions
  - Detects translatable JSX props (`title`, `placeholder`, `label`, etc.)
  - Detects `Alert.alert()` calls and `throw new Error()` statements
  - Configurable custom call patterns via `customDetectCalls`
  - Respects `.gitignore` and `config.exclude`
  - Generates flat locale JSON with dot-namespaced keys
  - Supports custom locale file names (`localeFileName` config)
- `rai replace` — rewrites source files with `t()` calls using recast (minimal git diffs)
  - Injects `useTranslation` import and `const { t } = useTranslation()` into components
  - Adds `t: TFunction` parameter to module-level helper functions
  - Updates helper call sites within the same file
  - Preserves whitespace around inline JSX elements
  - Creates `.i18nbak` backup files before modifying any source file
- `rai revert` — restores source files from `.i18nbak` backups
  - `--clean` flag deletes backups without restoring (use after verifying)
- `--dry-run` flag on `scan` and `replace` — preview without writing
- `--debug` flag on all commands — verbose AST and file-level output
