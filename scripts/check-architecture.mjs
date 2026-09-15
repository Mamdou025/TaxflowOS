import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { maintainedPaths } from './maintained-paths.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const web = 'artifacts/ai-workflow-builder/src/';
const packages = [
  'lib/source-core/',
  'lib/source-connectors/',
  'lib/agent-runtime/',
  'lib/workflow-contracts/',
  'lib/workflow-core/',
  'lib/workflow-executors/',
];
const errors = [];
const baseline = JSON.parse(
  fs.readFileSync(path.join(root, 'docs/architecture-baseline.json'), 'utf8'),
);
const retiredModules = [
  'artifacts/ai-workflow-builder/src/components/ui/button.tsx',
  'artifacts/ai-workflow-builder/src/shared/workflow-engine/local-fiscal-workflow.ts',
  'artifacts/ai-workflow-builder/src/shared/workflow-engine/local-tool-registry.ts',
];
const retiredSpecifiers = [
  '@/components/ui/button',
  '/shared/workflow-engine/local-fiscal-workflow',
  '/shared/workflow-engine/local-tool-registry',
];
function files(directory) {
  return fs.readdirSync(path.join(root, directory), { withFileTypes: true }).flatMap((entry) => {
    const name = `${directory}/${entry.name}`;
    return entry.isDirectory() ? files(name) : /\.(ts|tsx|mjs)$/.test(name) ? [name] : [];
  });
}
const all = [
  ...files(web.slice(0, -1)),
  ...files('artifacts/api-server/src'),
  ...packages.flatMap((p) => files(p + 'src')),
  ...files('tests/unit'),
];
const browserTests = files('e2e');
const known = new Set(all);
const graph = new Map();
for (const retired of retiredModules) {
  if (fs.existsSync(path.join(root, retired))) {
    errors.push(`${retired}: retired compatibility module must not be restored`);
  }
}
for (const file of [...all, ...browserTests]) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  for (const specifier of retiredSpecifiers) {
    if (source.includes(specifier)) {
      errors.push(`${file}: references retired compatibility module ${specifier}`);
    }
  }
}
for (const file of browserTests) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  function visitDynamicImports(node) {
    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword &&
      node.arguments.length === 1 &&
      ts.isStringLiteral(node.arguments[0]) &&
      node.arguments[0].text.startsWith('/src/')
    ) {
      const specifier = node.arguments[0].text;
      const target = `artifacts/ai-workflow-builder${specifier}`;
      if (!fs.existsSync(path.join(root, target))) {
        errors.push(`${file}: browser import does not resolve: ${specifier}`);
      }
    }
    ts.forEachChild(node, visitDynamicImports);
  }
  visitDynamicImports(sf);
}
function resolve(file, specifier) {
  const raw = specifier.startsWith('@workspace/workflow-executors/')
    ? 'lib/workflow-executors/src/' + specifier.slice('@workspace/workflow-executors/'.length)
    : specifier.startsWith('@/')
      ? web + specifier.slice(2)
      : specifier.startsWith('.')
        ? path.posix.normalize(path.posix.join(path.posix.dirname(file), specifier))
        : null;
  return (
    raw &&
    [raw, `${raw}.ts`, `${raw}.tsx`, `${raw}/index.ts`, `${raw}/index.tsx`].find((candidate) =>
      known.has(candidate),
    )
  );
}
function runtimeImport(node) {
  if (ts.isImportDeclaration(node)) {
    if (node.importClause?.isTypeOnly) return false;
    const clause = node.importClause;
    return (
      !clause ||
      Boolean(clause.name) ||
      !clause.namedBindings ||
      !ts.isNamedImports(clause.namedBindings) ||
      clause.namedBindings.elements.some((element) => !element.isTypeOnly)
    );
  }
  return (
    !node.isTypeOnly &&
    (!node.exportClause ||
      !ts.isNamedExports(node.exportClause) ||
      node.exportClause.elements.some((element) => !element.isTypeOnly))
  );
}
for (const file of all) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const maintained = maintainedPaths.some(
    (prefix) => file === prefix || file.startsWith(prefix + '/'),
  );
  const outgoing = [];
  graph.set(file, outgoing);
  let anyCount = 0;
  function visit(node) {
    if (node.kind === ts.SyntaxKind.AnyKeyword) anyCount++;
    ts.forEachChild(node, visit);
  }
  visit(sf);
  // Import rewrites and formatting must not consume an implementation budget.
  let implementation = source;
  for (const statement of [...sf.statements].reverse()) {
    if (ts.isImportDeclaration(statement) || ts.isExportDeclaration(statement)) {
      implementation =
        implementation.slice(0, statement.getStart(sf)) + implementation.slice(statement.end);
    }
  }
  const implementationLines = implementation.split(/\r?\n/).filter((line) => line.trim()).length;
  if (maintained && anyCount)
    errors.push(`${file}: explicit any is forbidden in maintained modules`);
  if (maintained && /@ts-(ignore|nocheck)\b/.test(source))
    errors.push(`${file}: typecheck suppression is forbidden`);
  if (
    !file.endsWith('generated-schemas.ts') &&
    implementationLines > Math.max(1000, baseline.maxImplementationLines[file] ?? 0)
  ) {
    errors.push(
      `${file}: exceeds its file-size budget; extract a responsibility instead of increasing the budget`,
    );
  }
  for (const node of sf.statements) {
    if ((!ts.isImportDeclaration(node) && !ts.isExportDeclaration(node)) || !node.moduleSpecifier)
      continue;
    const specifier = node.moduleSpecifier.text;
    if (file.startsWith('lib/workflow-core/')) {
      if (
        !specifier.startsWith('.') &&
        specifier !== 'zod' &&
        !specifier.startsWith('@workspace/workflow-contracts/')
      )
        errors.push(
          `${file}: workflow core may depend only on workflow contracts and validation; inject tools and adapters`,
        );
      if (file.includes('/core/') && specifier.includes('/application/'))
        errors.push(`${file}: graph core cannot depend on application commands`);
    }
    const runtime = runtimeImport(node);
    const target = resolve(file, specifier);
    if (target && runtime) outgoing.push(target);
    if (
      packages.some((prefix) => file.startsWith(prefix)) &&
      (specifier.startsWith('@/') || /artifacts\//.test(specifier))
    ) {
      errors.push(`${file}: shared packages cannot import application source`);
    }
    if (
      file.startsWith('artifacts/api-server/') &&
      (specifier.startsWith('@/') || specifier.includes('ai-workflow-builder'))
    ) {
      errors.push(`${file}: API imports must use shared package exports`);
    }
    if (
      file.includes('/services/') &&
      maintained &&
      runtime &&
      ['react', 'jotai', 'sonner'].some(
        (name) => specifier === name || specifier.startsWith(name + '/'),
      )
    ) {
      errors.push(`${file}: application services cannot import UI effects`);
    }
    if (target?.includes('/app/api/') || specifier.includes('/archive/'))
      errors.push(`${file}: active code cannot import archived routes`);
    if (
      specifier.startsWith('@/components/ui/') &&
      !(baseline.legacyUiImports[file] ?? []).includes(specifier)
    ) {
      errors.push(`${file}: new UI imports must use shared/ui`);
    }
  }
}

// Report cycles that are wholly inside the extracted implementation modules.
// Existing cycles elsewhere are documented debt, not silently grandfathered here.
const checked = new Set();
const active = new Set();
function checkCycles(file, stack = []) {
  if (active.has(file)) {
    errors.push(`Runtime import cycle: ${[...stack, file].join(' -> ')}`);
    return;
  }
  if (checked.has(file)) return;
  checked.add(file);
  active.add(file);
  for (const target of graph.get(file) ?? []) {
    if (maintainedPaths.some((prefix) => target.startsWith(prefix + '/')))
      checkCycles(target, [...stack, file]);
  }
  active.delete(file);
}
for (const file of all.filter((file) =>
  maintainedPaths.some((prefix) => file.startsWith(prefix + '/')),
))
  checkCycles(file);
if (errors.length) throw new Error(errors.join('\n'));
console.log(`Architecture checks passed across ${all.length} source files.`);
