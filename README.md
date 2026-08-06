# rn-auto-i18n

Automatic i18n scaffolding and code transformation for React Native apps.

`rn-auto-i18n` scans your app's source code, extracts every translatable string, generates locale files, and rewrites your source files to use `t()` calls — all without touching your code until you say so.

---

## How it works

```
rai init      Create the config file
     ↓
rai scan      Scan the app → generate locales/en.json (or your locale file)
     ↓
     You: set up react-i18next, commit
     ↓
rai replace   Rewrite source files with t() calls
     ↓
     You: verify the app works
     ↓
rai revert --clean   Delete backups → commit
```

---

## Installation

```bash
npm install -g rn-auto-i18n
```

Or use without installing:

```bash
npx rn-auto-i18n init
```

---

## Requirements

- Node.js 18 or later
- A React Native or Expo project

---

## Quick start

### 1. Create the config file

Run this from your project root:

```bash
rai init
```

This creates `i18nauto.config.ts` with annotated defaults. Open it and check at minimum:

- `defaultLanguage` — the language your app is currently written in
- `localesDir` — where locale files should be generated (`locales` or `src/locales`)
- `localeFileName` — leave `null` for `en.json`, or set `'translation'` for `en/translation.json`

### 2. Scan your app

```bash
rai scan
```

This scans every `.ts`, `.tsx`, `.js`, and `.jsx` file in your project, extracts all translatable strings, and writes a locale JSON file. A preview of everything found is shown before any files are written. You will be asked to confirm before writing.

After scanning, follow the printed instructions to set up `react-i18next` in your project, then commit before continuing.

### 3. Replace strings

Make sure you have committed your current state first — this step modifies source files.

```bash
rai replace
```

This rewrites your source files to use `t()` calls. For each modified file it:

- Replaces translatable strings with `t('namespace.key')`
- Injects `const { t } = useTranslation()` inside React components
- Adds `import { useTranslation } from 'react-i18next'` at the top of the file
- For helper functions defined at module level, adds `t: TFunction` as a parameter and updates call sites within the same file

A preview of affected files is shown before writing. You will be asked to confirm. Backup files (`.i18nbak`) are created before any source file is modified.

### 4. Verify and commit

Run your app and verify everything works. Then:

```bash
# If something looks wrong — restore original files
rai revert

# If everything looks good — clean up backups and commit
rai revert --clean
git add .
git commit -m "feat: replace strings with i18n t() calls"
```

---

## Commands

### `rai init`

Generates `i18nauto.config.ts` in your project root with defaults and inline documentation.

```bash
rai init
rai init --path ./my-app   # specify a different project root
```

Safe to run — exits with a warning if a config already exists.

---

### `rai scan`

Scans source files and generates the locale JSON file for your default language.

```bash
rai scan
rai scan --dry-run         # preview what would be found without writing
rai scan --path ./my-app
```

**What gets detected:**

| Source | Example |
|---|---|
| JSX text content | `<Text>Hello world</Text>` |
| JSX string expressions | `<Text>{"Hello"}</Text>` |
| Template literals | `` <Text>{`Hello ${name}`}</Text> `` |
| Ternary expressions | `<Text>{loading ? "Wait" : "Go"}</Text>` |
| Logical expressions | `<Text>{flag && "Visible"}</Text>` |
| Translatable JSX props | `<Button title="Submit" />` |
| Alert calls | `Alert.alert('Title', 'Are you sure?')` |
| Throw statements | `throw new Error('Failed to save')` |
| Custom call patterns | Configurable via `customDetectCalls` |

**What is ignored:**

- CSS utility class strings (`className="flex-row items-center"`)
- Non-translatable props (`name`, `type`, `color`, `testID`, etc.)
- Pure numbers, URLs, single characters
- Code identifiers and slugs (`cash_in`, `MY_CONSTANT`)
- Runtime API response data

---

### `rai replace`

Rewrites source files to use `t()` calls based on the generated locale file.

```bash
rai replace
rai replace --dry-run      # preview affected files without writing
rai replace --path ./my-app
```

**Replacement examples:**

```tsx
// Before
<Text>Hello world</Text>
<Text>{`Welcome back ${firstName}`}</Text>
<Text>{isLoading ? "Loading..." : "Done"}</Text>
<Button title="Submit" />
Alert.alert('Delete', 'Are you sure?')
throw new Error('Failed to save')

// After
<Text>{t('home.hello_world')}</Text>
<Text>{t('home.welcome_back', { firstName })}</Text>
<Text>{isLoading ? t('home.loading') : t('home.done')}</Text>
<Button title={t('home.submit')} />
Alert.alert(t('home.delete'), t('home.are_you_sure'))
throw new Error(t('home.failed_to_save'))
```

**Hook injection:**

```tsx
// Before
export default function HomeScreen() {
  return <Text>Hello</Text>
}

// After
import { useTranslation } from 'react-i18next'

export default function HomeScreen() {
  const { t } = useTranslation()
  return <Text>{t('home.hello')}</Text>
}
```

**Helper functions at module level:**

If a helper function defined outside a component contains translatable strings, it receives `t` as a typed parameter and all call sites in the same file are updated:

```tsx
// Before
function getStatusLabel(status: string) {
  return status === 'active' ? 'Active' : 'Inactive'
}

// After
import { TFunction } from 'i18next'

function getStatusLabel(status: string, t: TFunction) {
  return status === 'active' ? t('status.active') : t('status.inactive')
}

// Call site updated automatically
<Text>{getStatusLabel(status, t)}</Text>
```

---

### `rai revert`

Restores source files to their state before `rai replace` was run, using the `.i18nbak` backup files created during replacement.

```bash
rai revert                 # restore files from backups
rai revert --clean         # delete backups without restoring (after verifying)
rai revert --path ./my-app
```

---

## Configuration

`rai init` generates a fully annotated config file. All fields are optional — missing fields fall back to their defaults.

```ts
// i18nauto.config.ts
import type { I18nautConfig } from 'rn-auto-i18n'

export default {
  // The language your app is currently written in
  // Must be a valid ISO 639-1 code
  defaultLanguage: 'en',

  // Where locale files are written, relative to project root
  localesDir: 'locales',

  // Custom locale file name
  // null  → locales/en.json
  // 'translation' → locales/en/translation.json
  localeFileName: null,

  // Maximum length of a generated translation key
  // Keys are trimmed at word boundaries to fit within this limit
  maxKeyLength: 60,

  // Detect strings in Alert.alert() calls
  detectAlerts: true,

  // Detect strings in throw new Error() statements
  detectThrows: true,

  // Additional function call patterns to extract strings from
  // Format: 'functionName' or 'object.method'
  customDetectCalls: [],
  // example: ['toast.show', 'setError', 'showMessage']

  // Glob patterns to exclude from scanning
  // node_modules, dist, build, android, ios, .expo are always excluded
  exclude: [],
  // example: ['src/mocks/**', 'src/fixtures/**']

  // Managed automatically by the CLI — do not edit
  _translatedLanguages: [],
  _lastSyncAt: null,

} satisfies Partial<I18nautConfig>
```

### Language codes

`defaultLanguage` must be a valid [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) two-letter code. Your editor will highlight invalid values directly in the config file.

### Locale structure

**Default (`localeFileName: null`):**
```
locales/
└── en.json
```

Keys follow a `namespace.string_key` format where the namespace is derived from the source file path:

```json
{
  "auth.signin.welcome_back": "Welcome back",
  "auth.signin.sign_in_to_continue": "Sign in to continue",
  "home.total_transactions": "Total Transactions"
}
```

Keys from the same file share the same namespace prefix, so sorting the file groups them together naturally.

**Custom file name (`localeFileName: 'translation'`):**
```
locales/
└── en/
    └── translation.json
```

Same key format, different file structure. Matches the convention used by many i18next projects.

---

## Setting up react-i18next

After running `rai scan`, the tool prints setup instructions tailored to your config. Here is the general pattern:

### Install dependencies

```bash
npx expo install i18next react-i18next
# or
npm install i18next react-i18next
```

### Create `src/i18n.ts`

```ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
// adjust the import path based on your localesDir and localeFileName

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
```

### Import in your entry point

For Expo Router (`app/_layout.tsx`):

```ts
import '../src/i18n'  // must be the first import
```

For standard React Native (`App.tsx`):

```ts
import './src/i18n'
```

---

## Adding languages

Once your app is working with the default language:

1. Copy your locale file and translate the values:

```bash
cp locales/en.json locales/fr.json
# translate the values in fr.json
```

2. Add the new language to `src/i18n.ts`:

```ts
import en from './locales/en.json'
import fr from './locales/fr.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: 'en',
  fallbackLng: 'en',
  // ...
})
```

3. Switch the active language at runtime:

```ts
import i18n from './src/i18n'
i18n.changeLanguage('fr')
```

Automatic translation via API (Google Translate, DeepL) is planned for v2.

---

## Global flags

These flags work with any command:

```bash
--debug     Show verbose output including file-by-file details and AST info
--path      Root path of the project (defaults to current directory)
```

---

## Known limitations

These are documented limitations of v1. They are candidates for future releases.

**Hook injection uses naming conventions.**
Components are identified by their function name starting with an uppercase letter, or by being a default export. Functions not matching these patterns (HOCs, render props, factory functions) may not receive the hook automatically and will need manual adjustment.

**Cross-file helper call sites are not updated.**
When a helper function in file A is called from file B, the call site in file B is not updated to pass `t`. Only call sites within the same file are patched. Cross-file call sites need to be updated manually.

**No string deduplication.**
The same string appearing in multiple files generates separate keys in each file's namespace. There is no "common" namespace for shared strings. This is intentional for v1 — it keeps locale files self-contained per screen and avoids the complexity of tracking shared usage.

**Computed strings are not detected.**
Strings built by concatenation or computed at runtime cannot be detected by static analysis:

```tsx
// These will NOT be detected
const msg = 'Hello ' + name         // concatenation
const key = condition ? keyA : keyB  // variable key
<Text>{messages[index]}</Text>       // array access
```

**`rai replace` is not idempotent.**
Running `rai replace` twice on an already-replaced file will produce incorrect output. Always revert before re-running.

---

## Troubleshooting

**`No i18next instance` warning at runtime**
Your `src/i18n.ts` file is not being imported before components render. Make sure `import './src/i18n'` (or the correct relative path) is the **first** import in your entry point file (`App.tsx` or `app/_layout.tsx`).

**`Property 't' doesn't exist` error**
The hook was not injected into a component. This happens when the component uses a naming pattern the tool does not recognize (lowercase name, HOC wrapper, etc.). Add `const { t } = useTranslation()` manually to the component.

**Strings not being detected**
Run `rai scan --debug` to see every file being considered and which strings are found. Check that the file is not excluded by your `.gitignore` or `config.exclude`. Check that the string is inside a `<Text>` tag or a recognized prop name.

**Import path error in `i18n.ts`**
The correct import path depends on where `i18n.ts` lives relative to your locale files. The `rai scan` output prints the exact path to use for your configuration.

**`rai replace` modified files look correct but the app still shows keys**
The i18next `resources` object in `src/i18n.ts` is not including the locale file, or the namespace is wrong. Make sure the locale file is imported and listed under the correct language code.

---

## Roadmap

- **v2 — Translation API integration:** run `rai translate fr,es,ar` to generate translated locale files automatically via Google Translate or DeepL
- **v2 — Sync command:** detect new or changed strings and update all locale files without re-running the full pipeline
- **v2 — Mirror locale structure:** one JSON file per screen/component mirroring the app's folder structure
- **v2 — Common namespace:** deduplicate strings used in 3 or more files into a shared `common.json`
- **v2 — Cross-file call site patching:** update helper call sites across files when the helper receives `t` as a parameter
- **v2 — Config option for hook injection strategy:** choose between parameter passing or context for helpers

---

## License

MIT
