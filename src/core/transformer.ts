import * as recast from "recast";
import traverseModule from "@babel/traverse";
import * as t from "@babel/types";
import path from "path";
import { readFileSafe } from "../utils/fs";
import { logger } from "../utils/logger";
import type { ExtractedString } from "./scanner";
import type { LocaleFile } from "./scaffolder";

/**
 * Why recast instead of @babel/generator?
 *
 * @babel/generator reprints the ENTIRE file from the AST.
 * This means every line appears as changed in git — even lines
 * that were not touched — making diffs unreadable and reverting painful.
 *
 * recast is a print-preserving code generator. It tracks which AST
 * nodes were actually modified and only reprints those nodes.
 * Every unchanged node is printed character-for-character from the
 * original source.
 *
 * Result: git diff shows only the actual string replacements.
 * The user can revert with `git checkout .` or `git reset --hard HEAD`
 * as long as they committed before running `rai replace`.
 */

/**
 * Babel traverse has a quirky module shape in CJS environments.
 * The actual function is sometimes on .default, sometimes not.
 * This handles both cases.
 */
const traverse = (traverseModule as any).default ?? traverseModule;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface TransformResult {
  /** Absolute path to the file */
  filePath: string;
  /** Whether any replacements were made */
  modified: boolean;
  /** Total number of string replacements made */
  replacements: number;
  /** The new source code — only set when modified is true */
  newCode?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// AST node builders
// ─────────────────────────────────────────────────────────────────────────────

/** Builds: t('some.key') */
function buildTCall(key: string): t.CallExpression {
  return t.callExpression(t.identifier("t"), [t.stringLiteral(key)]);
}

/** Builds: t('some.key', { param1, param2 }) */
function buildTCallWithParams(key: string, params: string[]): t.CallExpression {
  const props = params.map((param) => {
    const id = t.identifier(param);
    const prop = t.objectProperty(id, id);
    prop.shorthand = true;
    return prop;
  });
  return t.callExpression(t.identifier("t"), [
    t.stringLiteral(key),
    t.objectExpression(props),
  ]);
}

/** Builds: {t('some.key')} as a JSXExpressionContainer */
function buildJSXExpression(call: t.CallExpression): t.JSXExpressionContainer {
  return t.jsxExpressionContainer(call);
}

/** Builds: import { useTranslation } from 'react-i18next' */
function buildUseTranslationImport(): t.ImportDeclaration {
  return t.importDeclaration(
    [
      t.importSpecifier(
        t.identifier("useTranslation"),
        t.identifier("useTranslation"),
      ),
    ],
    t.stringLiteral("react-i18next"),
  );
}

/** Builds: const { t } = useTranslation() */
function buildUseTranslationCall(): t.VariableDeclaration {
  const prop = t.objectProperty(t.identifier("t"), t.identifier("t"));
  prop.shorthand = true;

  return t.variableDeclaration("const", [
    t.variableDeclarator(
      t.objectPattern([prop]),
      t.callExpression(t.identifier("useTranslation"), []),
    ),
  ]);
}

// ─────────────────────────────────────────────────────────────────────────────
// Lookup helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Finds an extracted string by matching file path, original text, and
 * optionally source type.
 */
function findExtracted(
  value: string,
  filePath: string,
  strings: ExtractedString[],
  sourceType?: ExtractedString["sourceType"],
): ExtractedString | undefined {
  return strings.find(
    (s) =>
      s.filePath === filePath &&
      s.originalText === value.trim() &&
      (sourceType ? s.sourceType === sourceType : true),
  );
}

/**
 * Reconstructs the template literal display text (with {{param}} placeholders)
 * using the same algorithm as the scanner, then looks it up.
 *
 * Must match processTemplateLiteral() in scanner.ts exactly.
 */
function findExtractedTemplate(
  node: t.TemplateLiteral,
  filePath: string,
  strings: ExtractedString[],
): ExtractedString | undefined {
  let text = "";
  let argIndex = 0;

  node.quasis.forEach((quasi, i) => {
    text += quasi.value.cooked ?? quasi.value.raw;

    if (i < node.expressions.length) {
      const expr = node.expressions[i];
      let paramName: string;

      if (t.isIdentifier(expr)) {
        paramName = expr.name;
      } else if (t.isMemberExpression(expr) && t.isIdentifier(expr.property)) {
        paramName = (expr.property as t.Identifier).name;
      } else {
        paramName = `arg${argIndex++}`;
      }

      text += `{{${paramName}}}`;
    }
  });

  return strings.find(
    (s) => s.filePath === filePath && s.originalText === text.trim(),
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Import injection
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns true if useTranslation is already imported from react-i18next.
 */
function hasUseTranslationImport(body: t.Statement[]): boolean {
  return body.some(
    (node) =>
      t.isImportDeclaration(node) &&
      node.source.value === "react-i18next" &&
      node.specifiers.some(
        (spec) =>
          t.isImportSpecifier(spec) &&
          t.isIdentifier(spec.imported) &&
          spec.imported.name === "useTranslation",
      ),
  );
}

/**
 * Inserts the useTranslation import after the last existing import.
 * Only called once per file, after traversal completes.
 */
function addUseTranslationImport(body: t.Statement[]): void {
  if (hasUseTranslationImport(body)) return;

  let lastImportIndex = -1;
  for (let i = 0; i < body.length; i++) {
    if (t.isImportDeclaration(body[i])) lastImportIndex = i;
  }

  const importNode = buildUseTranslationImport();

  if (lastImportIndex >= 0) {
    body.splice(lastImportIndex + 1, 0, importNode);
  } else {
    body.unshift(importNode);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook injection
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns true if `const { t } = useTranslation()` already exists
 * in the given list of statements.
 */
function hasTDeclaration(statements: t.Statement[]): boolean {
  return statements.some((stmt) => {
    if (!t.isVariableDeclaration(stmt)) return false;

    return stmt.declarations.some((decl) => {
      if (!t.isObjectPattern(decl.id)) return false;
      if (!t.isCallExpression(decl.init)) return false;
      if (!t.isIdentifier(decl.init.callee)) return false;
      if ((decl.init.callee as t.Identifier).name !== "useTranslation") {
        return false;
      }

      return (decl.id as t.ObjectPattern).properties.some(
        (prop) =>
          t.isObjectProperty(prop) &&
          t.isIdentifier(prop.key) &&
          (prop.key as t.Identifier).name === "t",
      );
    });
  });
}

/**
 * Injects `const { t } = useTranslation()` as the first statement
 * in a block body if not already present.
 */
function injectTDeclaration(block: t.BlockStatement): void {
  if (hasTDeclaration(block.body)) return;
  block.body.unshift(buildUseTranslationCall());
}

/**
 * Determines whether a function node is a React component.
 *
 * Rules:
 *   - Named with an uppercase first letter, OR
 *   - Is the direct default export (unnamed is fine)
 *
 * We also require a block body ({ }) — expression bodies like
 * () => <JSX /> cannot contain hook declarations.
 */
function isComponentFunction(
  funcNode:
    | t.FunctionDeclaration
    | t.FunctionExpression
    | t.ArrowFunctionExpression,
  parent: t.Node | null | undefined,
): boolean {
  // Must have a block body to inject a hook into
  if (!t.isBlockStatement(funcNode.body)) return false;

  // Named function declaration
  if (t.isFunctionDeclaration(funcNode) && funcNode.id) {
    return /^[A-Z]/.test(funcNode.id.name);
  }

  // Arrow/function expression assigned to an uppercase variable:
  // const MyScreen = () => { ... }
  if (
    t.isVariableDeclarator(parent) &&
    t.isIdentifier(parent.id) &&
    /^[A-Z]/.test((parent.id as t.Identifier).name)
  ) {
    return true;
  }

  // export default function() { ... }
  // export default () => { ... }
  if (t.isExportDefaultDeclaration(parent)) {
    return true;
  }

  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Expression replacement
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Attempts to replace a string expression with a t() call.
 *
 * Returns [replacementNode, count].
 * When count is 0, the original node is returned unchanged.
 *
 * Handles recursively:
 *   StringLiteral          → t('key')
 *   TemplateLiteral        → t('key', { params })
 *   ConditionalExpression  → recurse into branches
 *   LogicalExpression      → recurse into operands
 */
function replaceStringNode(
  node: t.Expression,
  filePath: string,
  fileStrings: ExtractedString[],
  sourceType: ExtractedString["sourceType"],
): [t.Expression, number] {
  // ── Plain string ───────────────────────────────────────────────────────────
  if (t.isStringLiteral(node)) {
    const extracted = findExtracted(
      node.value,
      filePath,
      fileStrings,
      sourceType,
    );
    if (!extracted) return [node, 0];

    const call =
      extracted.params.length > 0
        ? buildTCallWithParams(extracted.fullKey, extracted.params)
        : buildTCall(extracted.fullKey);

    return [call, 1];
  }

  // ── Template literal ───────────────────────────────────────────────────────
  if (t.isTemplateLiteral(node)) {
    const extracted = findExtractedTemplate(node, filePath, fileStrings);
    if (!extracted) return [node, 0];

    const call =
      extracted.params.length > 0
        ? buildTCallWithParams(extracted.fullKey, extracted.params)
        : buildTCall(extracted.fullKey);

    return [call, 1];
  }

  // ── Ternary: replace each branch individually ──────────────────────────────
  if (t.isConditionalExpression(node)) {
    let count = 0;

    const [newConsequent, c1] = replaceStringNode(
      node.consequent as t.Expression,
      filePath,
      fileStrings,
      sourceType,
    );
    if (c1 > 0) {
      node.consequent = newConsequent;
      count += c1;
    }

    const [newAlternate, c2] = replaceStringNode(
      node.alternate as t.Expression,
      filePath,
      fileStrings,
      sourceType,
    );
    if (c2 > 0) {
      node.alternate = newAlternate;
      count += c2;
    }

    return [node, count];
  }

  // ── Logical: replace string operands ──────────────────────────────────────
  if (t.isLogicalExpression(node)) {
    let count = 0;

    const [newLeft, c1] = replaceStringNode(
      node.left,
      filePath,
      fileStrings,
      sourceType,
    );
    if (c1 > 0) {
      node.left = newLeft;
      count += c1;
    }

    const [newRight, c2] = replaceStringNode(
      node.right,
      filePath,
      fileStrings,
      sourceType,
    );
    if (c2 > 0) {
      node.right = newRight;
      count += c2;
    }

    return [node, count];
  }

  return [node, 0];
}

// ─────────────────────────────────────────────────────────────────────────────
// File transformer
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Transforms a single source file.
 *
 * Uses recast for parsing and printing so that only modified AST nodes
 * are reprinted. Unchanged code is preserved character-for-character,
 * producing minimal git diffs that are easy to review and revert.
 *
 * Does NOT write to disk — the replace command handles writing.
 */
export function transformFile(
  filePath: string,
  appRoot: string,
  strings: ExtractedString[],
  localeData: LocaleFile,
): TransformResult {
  const code = readFileSafe(filePath);
  if (!code) return { filePath, modified: false, replacements: 0 };

  /**
   * Only work with strings that:
   *   a) belong to this file
   *   b) have a corresponding key in the locale file
   *
   * The locale file check ensures we never replace a string with a
   * key that won't resolve at runtime.
   */
  const fileStrings = strings.filter(
    (s) => s.filePath === filePath && localeData[s.fullKey] !== undefined,
  );

  if (fileStrings.length === 0) {
    logger.debug(`  No matching strings: ${path.relative(appRoot, filePath)}`);
    return { filePath, modified: false, replacements: 0 };
  }

  // ── Parse with recast ─────────────────────────────────────────────────────
  let ast: any;
  try {
    ast = recast.parse(code, {
      parser: {
        /**
         * recast needs a parser object with a `parse` function.
         * We wire in @babel/parser configured for TSX + TypeScript.
         * The `tokens: true` option is required by recast to track
         * original positions for print-preservation.
         */
        parse(source: string) {
          const babelParser = require("@babel/parser");
          return babelParser.parse(source, {
            sourceType: "module",
            tokens: true,
            plugins: [
              "jsx",
              "typescript",
              "decorators-legacy",
              "classProperties",
              "optionalChaining",
              "nullishCoalescingOperator",
            ],
          });
        },
      },
    });
  } catch (err) {
    logger.warn(
      `  Could not parse ${path.relative(appRoot, filePath)} — skipping`,
    );
    logger.debug(String(err));
    return { filePath, modified: false, replacements: 0 };
  }

  let totalReplacements = 0;

  /**
   * Collect block statements of React components that need the hook.
   *
   * We collect during traversal and inject AFTER traversal ends.
   * Reason: modifying a block body while traversing it can cause
   * the injected node to be visited (and potentially broken) by
   * subsequent visitor calls.
   */
  const componentBlocks = new Set<t.BlockStatement>();

  // ── Traverse and replace ─────────────────────────────────────────────────
  traverse(ast.program, {
    // ── Plain JSX text: <Text>Hello</Text> ───────────────────────────────────
    JSXText(nodePath: any) {
      const trimmed = (nodePath.node.value as string).trim();
      if (!trimmed) return;

      const extracted = findExtracted(
        trimmed,
        filePath,
        fileStrings,
        "jsx-text",
      );
      if (!extracted) return;

      const call = buildTCall(extracted.fullKey);

      /**
       * JSXText cannot be directly replaced with a CallExpression —
       * JSX children that are expressions must be wrapped in { }.
       * nodePath.replaceWith handles updating the parent reference.
       */
      nodePath.replaceWith(buildJSXExpression(call));
      totalReplacements++;
    },

    // ── JSX expression container: <Text>{"Hello"}</Text> ────────────────────
    JSXExpressionContainer(nodePath: any) {
      /**
       * Skip containers inside prop values like className={`flex`}.
       * We only want containers that are direct JSX children.
       */
      const parent = nodePath.parent;
      if (!t.isJSXElement(parent) && !t.isJSXFragment(parent)) return;

      const expr = nodePath.node.expression;
      if (!expr || t.isJSXEmptyExpression(expr)) return;

      const [newExpr, count] = replaceStringNode(
        expr as t.Expression,
        filePath,
        fileStrings,
        "jsx-expression",
      );

      if (count > 0) {
        nodePath.node.expression = newExpr;
        totalReplacements += count;
      }
    },

    // ── JSX string prop: <Comp title="Hello" /> ──────────────────────────────
    JSXAttribute(nodePath: any) {
      const { name, value } = nodePath.node;
      if (!t.isJSXIdentifier(name)) return;
      if (!t.isStringLiteral(value)) return;

      const extracted = findExtracted(
        value.value,
        filePath,
        fileStrings,
        "jsx-attribute",
      );
      if (!extracted) return;

      /**
       * Convert from string prop to expression prop:
       *   title="Submit"  →  title={t('ns.submit')}
       */
      nodePath.node.value = buildJSXExpression(buildTCall(extracted.fullKey));
      totalReplacements++;
    },

    // ── Call expressions: Alert.alert(), toast.show() etc. ───────────────────
    CallExpression(nodePath: any) {
      const { callee, arguments: args } = nodePath.node;

      // Resolve callee to a string like "Alert.alert" or "toast.show"
      let calleeName: string | null = null;

      if (t.isIdentifier(callee)) {
        calleeName = (callee as t.Identifier).name;
      } else if (
        t.isMemberExpression(callee) &&
        t.isIdentifier(callee.object) &&
        t.isIdentifier(callee.property)
      ) {
        calleeName =
          `${(callee.object as t.Identifier).name}` +
          `.${(callee.property as t.Identifier).name}`;
      }

      if (!calleeName) return;

      const isAlert = calleeName === "Alert.alert";
      const isCustom = fileStrings.some((s) => s.sourceType === "call");

      if (!isAlert && !isCustom) return;

      const sourceType: ExtractedString["sourceType"] = isAlert
        ? "alert"
        : "call";

      args.forEach((arg: any, index: number) => {
        if (!t.isStringLiteral(arg)) return;

        const extracted = findExtracted(
          arg.value,
          filePath,
          fileStrings,
          sourceType,
        );
        if (!extracted) return;

        nodePath.node.arguments[index] = buildTCall(extracted.fullKey);
        totalReplacements++;
      });
    },

    // ── Throw: throw new Error('msg') ────────────────────────────────────────
    ThrowStatement(nodePath: any) {
      const { argument } = nodePath.node;

      if (
        !t.isNewExpression(argument) ||
        !t.isIdentifier(argument.callee) ||
        (argument.callee as t.Identifier).name !== "Error"
      ) {
        return;
      }

      argument.arguments.forEach((arg: any, index: number) => {
        if (!t.isStringLiteral(arg)) return;

        const extracted = findExtracted(
          arg.value,
          filePath,
          fileStrings,
          "throw",
        );
        if (!extracted) return;

        argument.arguments[index] = buildTCall(extracted.fullKey);
        totalReplacements++;

        /**
         * Note: we do NOT add this file to componentBlocks for throws.
         *
         * throw statements often appear in async functions, event handlers,
         * or utility functions — not React components. Injecting
         * useTranslation there would break the rules of hooks.
         *
         * If the file also has JSX replacements, componentBlocks will
         * be populated by those and the hook will be available.
         */
      });
    },

    // ── Collect React component bodies for hook injection ────────────────────
    /**
     * IMPORTANT: These must be THREE SEPARATE visitors.
     *
     * The combined string syntax 'FunctionDeclaration|ArrowFunctionExpression'
     * is NOT reliably supported by @babel/traverse in all versions.
     * Using it causes the visitor to silently fail — no error, just nothing
     * happens. This was the root cause of the hook not being injected.
     */
    FunctionDeclaration(nodePath: any) {
      const node = nodePath.node as t.FunctionDeclaration;
      if (!isComponentFunction(node, nodePath.parent)) return;
      componentBlocks.add(node.body as t.BlockStatement);
    },

    FunctionExpression(nodePath: any) {
      const node = nodePath.node as t.FunctionExpression;
      if (!isComponentFunction(node, nodePath.parent)) return;
      componentBlocks.add(node.body as t.BlockStatement);
    },

    ArrowFunctionExpression(nodePath: any) {
      const node = nodePath.node as t.ArrowFunctionExpression;
      if (!isComponentFunction(node, nodePath.parent)) return;
      /**
       * isComponentFunction already checks for BlockStatement body
       * so this cast is safe.
       */
      componentBlocks.add(node.body as t.BlockStatement);
    },
  });

  // Nothing was replaced — return early, no need to reprint
  if (totalReplacements === 0) {
    return { filePath, modified: false, replacements: 0 };
  }

  // ── Inject const { t } = useTranslation() ────────────────────────────────
  /**
   * Done AFTER traversal completes to avoid the injected node
   * being visited by the traversal.
   */
  for (const block of componentBlocks) {
    injectTDeclaration(block);
  }

  // ── Inject import ─────────────────────────────────────────────────────────
  /**
   * Also done after traversal for the same reason.
   * addUseTranslationImport only adds the import if not already present.
   */
  if (componentBlocks.size > 0) {
    addUseTranslationImport(ast.program.body);
  }

  // ── Print with recast ─────────────────────────────────────────────────────
  /**
   * recast.print() only reprints AST nodes that were modified.
   * All other nodes are printed from their original source positions.
   * This produces minimal diffs — only the changed lines appear in git.
   */
  const newCode = recast.print(ast).code;

  return {
    filePath,
    modified: true,
    replacements: totalReplacements,
    newCode,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Project transformer
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Transforms all files that have translatable strings.
 * Returns results without writing to disk.
 *
 * Each file is processed independently with its own AST parse/traverse/print
 * cycle. This ensures there is no shared state between files that could
 * cause one file's traversal to affect another.
 */
export async function transformProject(
  appRoot: string,
  strings: ExtractedString[],
  localeData: LocaleFile,
): Promise<TransformResult[]> {
  const uniqueFiles = [...new Set(strings.map((s) => s.filePath))];

  logger.dim(`  Processing ${uniqueFiles.length} file(s)...`);

  const results: TransformResult[] = [];

  for (const filePath of uniqueFiles) {
    const result = transformFile(filePath, appRoot, strings, localeData);
    results.push(result);

    if (result.modified) {
      logger.dim(
        `  ✓ ${path.relative(appRoot, filePath)}` +
          ` — ${result.replacements} replacement(s)`,
      );
    } else {
      logger.debug(`  ○ ${path.relative(appRoot, filePath)} — no changes`);
    }
  }

  return results;
}
