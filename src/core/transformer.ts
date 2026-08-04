import * as recast from "recast";
import { visit, builders as b } from "ast-types";
import path from "path";
import { readFileSafe } from "../utils/fs";
import { logger } from "../utils/logger";
import type { ExtractedString } from "./scanner";
import type { LocaleFile } from "./scaffolder";

/**
 * Why recast + ast-types instead of @babel/traverse?
 *
 * recast.parse() returns a recast-wrapped AST. Passing this to
 * @babel/traverse causes crashes because Babel's scope analysis
 * expects a raw Babel AST, not a recast-wrapped one.
 *
 * The correct pairing is:
 *   recast.parse()  →  ast-types visit()  →  recast.print()
 *
 * ast-types is recast's companion library (it's a dependency of recast,
 * already installed). It provides the visit() function which traverses
 * recast ASTs correctly.
 *
 * recast.print() then only reprints nodes that were actually modified,
 * producing minimal git diffs.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface TransformResult {
  filePath: string;
  modified: boolean;
  replacements: number;
  newCode?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// AST node builders
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds: t('some.key')
 */
function buildTCall(key: string): any {
  return b.callExpression(b.identifier("t"), [b.literal(key)]);
}

/**
 * Builds: t('some.key', { param1, param2 })
 *
 * Shorthand properties ({ firstName } instead of { firstName: firstName })
 * must be set via the `shorthand` property on the node AFTER creation —
 * b.property() does not accept a shorthand argument.
 */
function buildTCallWithParams(key: string, params: string[]): any {
  const props = params.map((param) => {
    const prop = b.property("init", b.identifier(param), b.identifier(param));
    // Shorthand must be set after construction, not passed as an argument
    prop.shorthand = true;
    return prop;
  });

  return b.callExpression(b.identifier("t"), [
    b.literal(key),
    b.objectExpression(props),
  ]);
}

/**
 * Builds: {t('some.key')} as a JSXExpressionContainer
 */
function buildJSXExpression(call: any): any {
  return b.jsxExpressionContainer(call);
}

/**
 * Builds: import { useTranslation } from 'react-i18next'
 */
function buildUseTranslationImport(): any {
  return b.importDeclaration(
    [
      b.importSpecifier(
        b.identifier("useTranslation"),
        b.identifier("useTranslation"),
      ),
    ],
    b.literal("react-i18next"),
  );
}

/**
 * Builds: const { t } = useTranslation()
 */
function buildUseTranslationCall(): any {
  return b.variableDeclaration("const", [
    b.variableDeclarator(
      b.objectPattern([
        b.objectProperty.from({
          key: b.identifier("t"),
          value: b.identifier("t"),
          shorthand: true,
        }),
      ]),
      b.callExpression(b.identifier("useTranslation"), []),
    ),
  ]);
}

// ─────────────────────────────────────────────────────────────────────────────
// Lookup helpers
// ─────────────────────────────────────────────────────────────────────────────

function findExtracted(
  value: string,
  filePath: string,
  fileStrings: ExtractedString[],
  sourceType?: ExtractedString["sourceType"],
): ExtractedString | undefined {
  return fileStrings.find(
    (s) =>
      s.filePath === filePath &&
      s.originalText === value.trim() &&
      (sourceType ? s.sourceType === sourceType : true),
  );
}

/**
 * Reconstructs the template literal display text with {{param}} placeholders
 * (must match processTemplateLiteral in scanner.ts exactly)
 * then looks it up in the extracted strings.
 */
function findExtractedTemplate(
  node: any,
  filePath: string,
  fileStrings: ExtractedString[],
): ExtractedString | undefined {
  let text = "";
  let argIndex = 0;

  node.quasis.forEach((quasi: any, i: number) => {
    text += quasi.value.cooked ?? quasi.value.raw;

    if (i < node.expressions.length) {
      const expr = node.expressions[i];
      let paramName: string;

      if (expr.type === "Identifier") {
        paramName = expr.name;
      } else if (
        expr.type === "MemberExpression" &&
        expr.property.type === "Identifier"
      ) {
        paramName = expr.property.name;
      } else {
        paramName = `arg${argIndex++}`;
      }

      text += `{{${paramName}}}`;
    }
  });

  return fileStrings.find(
    (s) => s.filePath === filePath && s.originalText === text.trim(),
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Import helpers
// ─────────────────────────────────────────────────────────────────────────────

function hasUseTranslationImport(programBody: any[]): boolean {
  return programBody.some(
    (node) =>
      node.type === "ImportDeclaration" &&
      node.source.value === "react-i18next" &&
      node.specifiers?.some(
        (spec: any) =>
          spec.type === "ImportSpecifier" &&
          spec.imported?.name === "useTranslation",
      ),
  );
}

function addUseTranslationImport(programBody: any[]): void {
  if (hasUseTranslationImport(programBody)) return;

  let lastImportIndex = -1;
  for (let i = 0; i < programBody.length; i++) {
    if (programBody[i].type === "ImportDeclaration") {
      lastImportIndex = i;
    }
  }

  const importNode = buildUseTranslationImport();

  if (lastImportIndex >= 0) {
    programBody.splice(lastImportIndex + 1, 0, importNode);
  } else {
    programBody.unshift(importNode);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook injection
// ─────────────────────────────────────────────────────────────────────────────

function hasTDeclaration(statements: any[]): boolean {
  return statements.some((stmt) => {
    if (stmt.type !== "VariableDeclaration") return false;

    return stmt.declarations.some((decl: any) => {
      if (decl.id?.type !== "ObjectPattern") return false;
      if (decl.init?.type !== "CallExpression") return false;
      if (decl.init?.callee?.name !== "useTranslation") return false;

      return decl.id.properties?.some(
        (prop: any) => prop.key?.name === "t" || prop.value?.name === "t",
      );
    });
  });
}

function injectTDeclaration(blockBody: any[]): void {
  if (hasTDeclaration(blockBody)) return;
  blockBody.unshift(buildUseTranslationCall());
}

/**
 * Checks if a function node looks like a React component.
 *
 * Criteria:
 *   - Has a block body (not an expression like () => <JSX />)
 *   - Name starts with uppercase, OR it is a default export
 */
function isComponentFunction(node: any, parent: any): boolean {
  // Must have block body to inject hook into
  if (node.body?.type !== "BlockStatement") return false;

  // Named function: function MyScreen() {}
  if (node.type === "FunctionDeclaration" && node.id?.name) {
    return /^[A-Z]/.test(node.id.name);
  }

  // Arrow/function expression assigned to uppercase variable:
  // const MyScreen = () => {}
  if (
    parent?.type === "VariableDeclarator" &&
    parent.id?.type === "Identifier" &&
    /^[A-Z]/.test(parent.id.name)
  ) {
    return true;
  }

  // export default function() {} or export default () => {}
  if (parent?.type === "ExportDefaultDeclaration") {
    return true;
  }

  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Expression replacement
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Replaces a string expression node with a t() call.
 * Returns [newNode, replacementCount].
 *
 * Handles recursively:
 *   StringLiteral         → t('key')
 *   TemplateLiteral       → t('key', { params })
 *   ConditionalExpression → recurse into branches
 *   LogicalExpression     → recurse into operands
 */
function replaceStringNode(
  node: any,
  filePath: string,
  fileStrings: ExtractedString[],
  sourceType: ExtractedString["sourceType"],
): [any, number] {
  if (!node) return [node, 0];

  // ── String literal ─────────────────────────────────────────────────────────
  if (node.type === "StringLiteral" || node.type === "Literal") {
    const value = node.value;
    if (typeof value !== "string") return [node, 0];

    const extracted = findExtracted(value, filePath, fileStrings, sourceType);
    if (!extracted) return [node, 0];

    const call =
      extracted.params.length > 0
        ? buildTCallWithParams(extracted.fullKey, extracted.params)
        : buildTCall(extracted.fullKey);

    return [call, 1];
  }

  // ── Template literal ───────────────────────────────────────────────────────
  if (node.type === "TemplateLiteral") {
    const extracted = findExtractedTemplate(node, filePath, fileStrings);
    if (!extracted) return [node, 0];

    const call =
      extracted.params.length > 0
        ? buildTCallWithParams(extracted.fullKey, extracted.params)
        : buildTCall(extracted.fullKey);

    return [call, 1];
  }

  // ── Ternary ────────────────────────────────────────────────────────────────
  if (node.type === "ConditionalExpression") {
    let count = 0;

    const [newConsequent, c1] = replaceStringNode(
      node.consequent,
      filePath,
      fileStrings,
      sourceType,
    );
    if (c1 > 0) {
      node.consequent = newConsequent;
      count += c1;
    }

    const [newAlternate, c2] = replaceStringNode(
      node.alternate,
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

  // ── Logical expression ─────────────────────────────────────────────────────
  if (node.type === "LogicalExpression") {
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

export function transformFile(
  filePath: string,
  appRoot: string,
  strings: ExtractedString[],
  localeData: LocaleFile,
): TransformResult {
  const code = readFileSafe(filePath);
  if (!code) return { filePath, modified: false, replacements: 0 };

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
   * Collect component block bodies to inject the hook into.
   * We do this after traversal to avoid modifying the AST
   * while it is being traversed.
   */
  const componentBlocks: any[] = [];

  // ── Visit with ast-types (recast's companion traversal API) ───────────────
  /**
   * ast-types visit() is the correct traversal API for recast ASTs.
   *
   * Rules for visit():
   *   - Each visitor method is named `visit<NodeType>`
   *   - Call `this.traverse(nodePath)` to continue traversal into children
   *   - Call `return false` to stop traversal of this subtree
   *   - To replace a node, mutate the parent's property directly
   *     (nodePath.replace() also works but direct mutation is simpler here)
   */
  visit(ast, {
    // ── JSX text: <Text>Hello</Text> ─────────────────────────────────────────
    visitJSXText(nodePath) {
      const trimmed = (nodePath.node.value as string).trim();
      if (!trimmed) return this.traverse(nodePath);

      const extracted = findExtracted(
        trimmed,
        filePath,
        fileStrings,
        "jsx-text",
      );

      if (extracted) {
        const call = buildTCall(extracted.fullKey);
        nodePath.replace(buildJSXExpression(call));
        totalReplacements++;
        /**
         * After replacing, do NOT traverse the new node —
         * it's a t() call, not a string, so nothing to visit inside it.
         */
        return false;
      }

      this.traverse(nodePath);
    },

    // ── JSX expression: <Text>{"Hello"}</Text> ───────────────────────────────
    visitJSXExpressionContainer(nodePath) {
      const parent = nodePath.parent?.node;

      /**
       * Only process containers that are JSX children.
       * Skip containers inside prop values like className={`flex`}.
       */
      const isChild =
        parent?.type === "JSXElement" || parent?.type === "JSXFragment";

      if (!isChild) return this.traverse(nodePath);

      const expr = nodePath.node.expression;
      if (!expr || expr.type === "JSXEmptyExpression") {
        return this.traverse(nodePath);
      }

      const [newExpr, count] = replaceStringNode(
        expr,
        filePath,
        fileStrings,
        "jsx-expression",
      );

      if (count > 0) {
        nodePath.node.expression = newExpr;
        totalReplacements += count;
      }

      this.traverse(nodePath);
    },

    // ── JSX attribute: <Comp title="Hello" /> ────────────────────────────────
    visitJSXAttribute(nodePath) {
      const { name, value } = nodePath.node;

      if (value?.type === "StringLiteral" || value?.type === "Literal") {
        const strValue = value.value;
        if (typeof strValue === "string") {
          const extracted = findExtracted(
            strValue,
            filePath,
            fileStrings,
            "jsx-attribute",
          );

          if (extracted) {
            nodePath.node.value = buildJSXExpression(
              buildTCall(extracted.fullKey),
            );
            totalReplacements++;
          }
        }
      }

      this.traverse(nodePath);
    },

    // ── Call expressions: Alert.alert(), toast.show() ────────────────────────
    visitCallExpression(nodePath) {
      const { callee, arguments: args } = nodePath.node;

      let calleeName: string | null = null;

      /**
       * We must check the node's type string before accessing .name
       * because ast-types types callee as ExpressionKind — a broad union
       * that doesn't guarantee a .name property.
       *
       * Checking node.type === 'Identifier' first narrows it safely.
       */
      if (callee.type === "Identifier") {
        calleeName = (callee as any).name;
      } else if (
        callee.type === "MemberExpression" &&
        callee.object?.type === "Identifier" &&
        callee.property?.type === "Identifier"
      ) {
        calleeName = `${(callee.object as any).name}.${(callee.property as any).name}`;
      }

      if (calleeName) {
        const isAlert = calleeName === "Alert.alert";
        const isCustom = fileStrings.some((s) => s.sourceType === "call");

        if (isAlert || isCustom) {
          const sourceType: ExtractedString["sourceType"] = isAlert
            ? "alert"
            : "call";

          args.forEach((arg: any, index: number) => {
            const isStr =
              arg.type === "StringLiteral" || arg.type === "Literal";
            if (!isStr || typeof arg.value !== "string") return;

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
        }
      }

      this.traverse(nodePath);
    },

    // ── Throw: throw new Error('msg') ────────────────────────────────────────
    visitThrowStatement(nodePath) {
      const { argument } = nodePath.node;

      if (
        argument?.type === "NewExpression" &&
        argument.callee?.type === "Identifier" && // ← narrow first
        (argument.callee as any).name === "Error" // ← then access .name
      ) {
        argument.arguments.forEach((arg: any, index: number) => {
          const isStr = arg.type === "StringLiteral" || arg.type === "Literal";
          if (!isStr || typeof arg.value !== "string") return;

          const extracted = findExtracted(
            arg.value,
            filePath,
            fileStrings,
            "throw",
          );
          if (!extracted) return;

          argument.arguments[index] = buildTCall(extracted.fullKey);
          totalReplacements++;
        });
      }

      this.traverse(nodePath);
    },

    // ── Collect React component blocks for hook injection ────────────────────
    /**
     * We collect block bodies here and inject the hook AFTER traversal.
     * This avoids visiting the injected node during the same traversal.
     *
     * Each function type is handled in its own visitor — combining them
     * into one does not work reliably with ast-types visit().
     */
    visitFunctionDeclaration(nodePath) {
      const node = nodePath.node;
      const parent = nodePath.parent?.node;

      if (isComponentFunction(node, parent)) {
        componentBlocks.push(node.body);
      }

      this.traverse(nodePath);
    },

    visitFunctionExpression(nodePath) {
      const node = nodePath.node;
      const parent = nodePath.parent?.node;

      if (isComponentFunction(node, parent)) {
        componentBlocks.push(node.body);
      }

      this.traverse(nodePath);
    },

    visitArrowFunctionExpression(nodePath) {
      const node = nodePath.node;
      const parent = nodePath.parent?.node;

      if (isComponentFunction(node, parent)) {
        componentBlocks.push(node.body);
      }

      this.traverse(nodePath);
    },
  });

  if (totalReplacements === 0) {
    return { filePath, modified: false, replacements: 0 };
  }

  // ── Inject const { t } = useTranslation() ────────────────────────────────
  for (const block of componentBlocks) {
    if (block?.type === "BlockStatement") {
      injectTDeclaration(block.body);
    }
  }

  // ── Inject import ─────────────────────────────────────────────────────────
  if (componentBlocks.length > 0) {
    addUseTranslationImport(ast.program.body);
  }

  // ── Print — only changed nodes are reprinted ──────────────────────────────
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
 * Transforms all files with translatable strings.
 * Each file is processed independently — no shared state between files.
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
