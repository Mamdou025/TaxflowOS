// Export declarations only: never execute hooks, handlers, or workspace data.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import ts from 'typescript';

const root = path.resolve(import.meta.dirname, '..');
const require = createRequire(path.join(root, 'artifacts/ai-workflow-builder/package.json'));
const shared = createRequire(require.resolve('@copilotkit/react-core'))('@copilotkit/shared');
const sourceRoot = path.join(root, 'artifacts/ai-workflow-builder/src');
const tools = new Map();
let constants = new Map();

function description(node) {
  if (!node) return '';
  if (ts.isTemplateExpression(node))
    return (
      node.head.text +
      node.templateSpans.map((span) => '[see current Inscope context]' + span.literal.text).join('')
    );
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken)
    return description(node.left) + description(node.right);
  if (ts.isIdentifier(node)) return '[see current Inscope context]';
  return literal(node);
}

function literal(node) {
  if (!node) return undefined;
  if (ts.isIdentifier(node) && constants.has(node.text)) return literal(constants.get(node.text));
  if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node)) return literal(node.expression);
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node)) {
    return Object.fromEntries(
      node.properties.map((property) => {
        if (!ts.isPropertyAssignment(property)) throw new Error('Nonliteral schema property');
        return [
          property.name.text,
          property.name.text === 'description'
            ? description(property.initializer)
            : literal(property.initializer),
        ];
      }),
    );
  }
  throw new Error(`Nonliteral tool schema: ${node.getText().slice(0, 100)}`);
}

for (const entry of fs.readdirSync(sourceRoot, { recursive: true, withFileTypes: true })) {
  if (!entry.isFile() || !/\.tsx?$/.test(entry.name)) continue;
  const file = path.join(entry.parentPath, entry.name);
  const source = ts.createSourceFile(
    file,
    fs.readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
  );
  constants = new Map();
  function collect(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer)
      constants.set(node.name.text, node.initializer);
    ts.forEachChild(node, collect);
  }
  collect(source);
  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      ['useCopilotAction', 'useFrontendTool'].includes(node.expression.getText(source))
    ) {
      const config = node.arguments[0];
      if (!config || !ts.isObjectLiteralExpression(config))
        throw new Error(`Unsupported registration in ${file}`);
      const properties = new Map(
        config.properties
          .filter(ts.isPropertyAssignment)
          .map((p) => [p.name.getText(source), p.initializer]),
      );
      const name = literal(properties.get('name'));
      if (!name || name === '*') return;
      const tool = {
        type: 'function',
        name,
        description: description(properties.get('description')),
        parameters: shared.actionParametersToJsonSchema(
          literal(properties.get('parameters')) ?? [],
        ),
        strict: false,
      };
      if (tools.has(name) && JSON.stringify(tools.get(name)) !== JSON.stringify(tool))
        throw new Error(`Conflicting definitions for ${name}`);
      tools.set(name, tool);
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}
if (!tools.has('listAvailableWorkflows') || !tools.has('delegateComputerTask'))
  throw new Error('Incomplete catalog');
const output = path.join(root, 'docs/microsina-foundry/tools.json');
const content =
  JSON.stringify(
    [...tools.values()].sort((a, b) => a.name.localeCompare(b.name)),
    null,
    2,
  ) + '\n';
if (process.argv.includes('--check')) {
  if (fs.readFileSync(output, 'utf8') !== content)
    throw new Error('Foundry tool snapshot is stale; regenerate and register a new version');
} else fs.writeFileSync(output, content);
console.log(
  `${tools.size} tool schemas ${process.argv.includes('--check') ? 'verified' : 'exported'}; no handlers executed.`,
);
