import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';

const sourcePattern = /\.(?:[cm]?[jt]sx?)$/i;
const excluded =
  /(?:^|\/)(?:archive|node_modules|\.git|\.next|\.archify|dist|coverage|test-results|playwright-report|attached_assets)(?:\/|$)/;
const slash = (value) => value.replaceAll('\\', '/');
export const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');

export function isIndexable(file) {
  if (excluded.test(file) || /(?:^|\/)\.env(?:\.|$)/i.test(file)) return false;
  return (
    sourcePattern.test(file) ||
    (/\.(?:css|scss|sql|json|ya?ml|toml|html|txt|ps1|sh)$/i.test(file) &&
      !/(?:^|\/)(?:pnpm-lock\.yaml|package-lock\.json)$/.test(file)) ||
    /(?:^|\/)(?:Dockerfile(?:\.[^/]*)?|\.node-version|\.npmrc|\.gitignore)$/.test(file)
  );
}

function git(root, args) {
  return execFileSync('git', ['-C', root, ...args], {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    windowsHide: true,
  });
}

export function repositoryFiles(root) {
  return [
    ...new Set(
      git(root, ['ls-files', '-z', '--cached', '--others', '--exclude-standard']).split('\0'),
    ),
  ]
    .filter((file) => file && isIndexable(file) && fs.existsSync(path.join(root, file)))
    .sort();
}

export function repositoryState(root) {
  const changed = new Set(git(root, ['diff', '--name-only', '-z', 'HEAD']).split('\0'));
  for (const file of git(root, ['ls-files', '-z', '--others', '--exclude-standard']).split('\0'))
    changed.add(file);
  const dirtyPaths = [...changed]
    .filter((file) => file && !file.startsWith('.archify/') && file !== 'docs/archify-pilot.md')
    .sort();
  return {
    revision: git(root, ['rev-parse', 'HEAD']).trim(),
    dirty: dirtyPaths.length > 0,
    dirtyPaths,
  };
}

function readJson(file) {
  const result = ts.readConfigFile(file, ts.sys.readFile);
  if (result.error)
    throw new Error(
      `Cannot read ${file}: ${ts.flattenDiagnosticMessageText(result.error.messageText, ' ')}`,
    );
  return result.config;
}

function chooseExport(value, conditions) {
  if (typeof value === 'string') return value;
  if (Array.isArray(value))
    return value.map((entry) => chooseExport(entry, conditions)).find(Boolean);
  if (!value || typeof value !== 'object') return null;
  for (const [condition, entry] of Object.entries(value)) {
    if (condition === 'default' || conditions.has(condition)) {
      const selected = chooseExport(entry, conditions);
      if (selected) return selected;
    }
  }
  return null;
}

function workspaceTarget(pkg, subpath, conditions) {
  if (pkg.manifest.exports !== undefined) {
    const exports = pkg.manifest.exports;
    if (typeof exports === 'string' || Array.isArray(exports))
      return subpath === '.' ? chooseExport(exports, conditions) : null;
    if (!exports || typeof exports !== 'object') return null;
    if (!Object.keys(exports).some((key) => key.startsWith('.')))
      return subpath === '.' ? chooseExport(exports, conditions) : null;
    if (Object.hasOwn(exports, subpath)) return chooseExport(exports[subpath], conditions);
    const patterns = Object.keys(exports)
      .filter((key) => key.includes('*'))
      .sort((a, b) => b.length - a.length);
    for (const key of patterns) {
      const [prefix, suffix] = key.split('*');
      if (subpath.startsWith(prefix) && subpath.endsWith(suffix)) {
        const target = chooseExport(exports[key], conditions);
        if (target)
          return target.replaceAll(
            '*',
            subpath.slice(prefix.length, subpath.length - suffix.length || undefined),
          );
      }
    }
    return null;
  }
  return subpath === '.'
    ? pkg.manifest.types || pkg.manifest.module || pkg.manifest.main || './index'
    : subpath;
}

export function createResolver(root, files) {
  const known = new Set(files);
  const packages = files
    .filter((file) => path.posix.basename(file) === 'package.json')
    .map((file) => ({
      path: file,
      directory: path.dirname(path.join(root, file)),
      manifest: readJson(path.join(root, file)),
    }));
  const byName = new Map(
    packages.filter((pkg) => pkg.manifest.name).map((pkg) => [pkg.manifest.name, pkg]),
  );
  const optionCache = new Map();
  const resolutions = new Map();
  const resolutionCaches = new Map();
  const existenceCache = new Map();
  const readCache = new Map();
  const host = {
    ...ts.sys,
    fileExists(file) {
      if (!existenceCache.has(file)) existenceCache.set(file, ts.sys.fileExists(file));
      return existenceCache.get(file);
    },
    readFile(file) {
      if (!readCache.has(file)) readCache.set(file, ts.sys.readFile(file));
      return readCache.get(file);
    },
  };
  const defaultOptions = {
    allowJs: true,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    module: ts.ModuleKind.ESNext,
  };
  function optionsFor(importer) {
    let directory = path.dirname(path.join(root, importer));
    while (directory === root || directory.startsWith(root + path.sep)) {
      const config = path.join(directory, 'tsconfig.json');
      if (fs.existsSync(config)) {
        if (!optionCache.has(config)) {
          const parsed = ts.parseJsonConfigFileContent(
            readJson(config),
            ts.sys,
            directory,
            undefined,
            config,
          );
          const errors = parsed.errors.filter((error) => error.code !== 18003);
          if (errors.length)
            throw new Error(
              `${config}: ${errors.map((error) => ts.flattenDiagnosticMessageText(error.messageText, ' ')).join('; ')}`,
            );
          optionCache.set(config, { ...defaultOptions, ...parsed.options });
        }
        return optionCache.get(config);
      }
      if (directory === root) break;
      directory = path.dirname(directory);
    }
    return defaultOptions;
  }
  function asIndexed(file) {
    if (!file) return null;
    const relative = slash(path.relative(root, file));
    return known.has(relative) ? relative : null;
  }
  function resolve(importer, specifier) {
    const key = `${importer}\0${specifier}`;
    if (resolutions.has(key)) return resolutions.get(key);
    const options = optionsFor(importer);
    if (!resolutionCaches.has(options))
      resolutionCaches.set(
        options,
        ts.createModuleResolutionCache(root, (file) => file, options),
      );
    const cache = resolutionCaches.get(options);
    const resolved = ts.resolveModuleName(
      specifier,
      path.join(root, importer),
      options,
      host,
      cache,
    ).resolvedModule;
    let target = asIndexed(resolved?.resolvedFileName);
    const packageName = specifier.startsWith('@')
      ? specifier.split('/').slice(0, 2).join('/')
      : specifier.split('/')[0];
    const pkg = byName.get(packageName);
    if (!target && pkg) {
      const subpath = specifier === packageName ? '.' : '.' + specifier.slice(packageName.length);
      const exported = workspaceTarget(
        pkg,
        subpath,
        new Set(['types', 'import', 'node', ...(options.customConditions || [])]),
      );
      if (exported && exported.startsWith('./')) {
        const absolute = path.resolve(pkg.directory, exported);
        const workspaceResolved = ts.resolveModuleName(
          './' + slash(path.relative(path.dirname(path.join(root, importer)), absolute)),
          path.join(root, importer),
          options,
          host,
          cache,
        ).resolvedModule;
        target = asIndexed(workspaceResolved?.resolvedFileName) || asIndexed(absolute);
      }
    }
    // TypeScript deliberately excludes assets such as stylesheets from its resolver.
    if (!target && specifier.startsWith('.'))
      target = asIndexed(path.resolve(path.dirname(path.join(root, importer)), specifier));
    resolutions.set(key, target);
    return target;
  }
  function isLocalSpecifier(importer, specifier) {
    if (specifier.startsWith('.') || specifier.startsWith('/')) return true;
    const packageName = specifier.startsWith('@')
      ? specifier.split('/').slice(0, 2).join('/')
      : specifier.split('/')[0];
    if (byName.has(packageName)) return true;
    return Object.keys(optionsFor(importer).paths || {}).some((alias) => {
      if (!alias.includes('*')) return alias === specifier;
      const [prefix, suffix] = alias.split('*');
      return specifier.startsWith(prefix) && specifier.endsWith(suffix);
    });
  }
  return { resolve, isLocalSpecifier, packages };
}

function bindingNames(name) {
  if (ts.isIdentifier(name)) return [name.text];
  return name.elements.flatMap((element) =>
    ts.isOmittedExpression(element) ? [] : bindingNames(element.name),
  );
}

export function inspectSource(file, source) {
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const imports = [];
  const exports = new Set();
  const effects = [];
  const evidence = [];
  const lineAt = (node) => ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1;
  function addImport(specifier, node, typeOnly = false, dynamic = false, form = 'import') {
    if (specifier && ts.isStringLiteralLike(specifier))
      imports.push({ specifier: specifier.text, typeOnly, dynamic, line: lineAt(node), form });
  }
  function visit(node) {
    if (ts.isImportDeclaration(node)) {
      const clause = node.importClause;
      const allNamedTypes =
        clause?.namedBindings &&
        ts.isNamedImports(clause.namedBindings) &&
        clause.namedBindings.elements.length > 0 &&
        clause.namedBindings.elements.every((element) => element.isTypeOnly);
      addImport(
        node.moduleSpecifier,
        node,
        Boolean(clause?.isTypeOnly || (!clause?.name && allNamedTypes)),
      );
    } else if (ts.isExportDeclaration(node)) {
      const allNamedTypes =
        node.exportClause &&
        ts.isNamedExports(node.exportClause) &&
        node.exportClause.elements.length > 0 &&
        node.exportClause.elements.every((element) => element.isTypeOnly);
      addImport(
        node.moduleSpecifier,
        node,
        Boolean(node.isTypeOnly || allNamedTypes),
        false,
        're-export',
      );
      if (node.parent === ast && node.exportClause && ts.isNamedExports(node.exportClause))
        node.exportClause.elements.forEach((element) => exports.add(element.name.text));
      else if (node.parent === ast && node.exportClause && ts.isNamespaceExport(node.exportClause))
        exports.add(node.exportClause.name.text);
      else if (node.parent === ast && node.moduleSpecifier) exports.add('* (re-export)');
    } else if (
      ts.isImportEqualsDeclaration(node) &&
      ts.isExternalModuleReference(node.moduleReference)
    ) {
      addImport(node.moduleReference.expression, node, node.isTypeOnly, false, 'require');
    } else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) {
      addImport(node.argument.literal, node, true, false, 'type');
    } else if (ts.isCallExpression(node)) {
      if (node.expression.kind === ts.SyntaxKind.ImportKeyword)
        addImport(node.arguments[0], node, false, true, 'import');
      if (ts.isIdentifier(node.expression) && node.expression.text === 'require')
        addImport(node.arguments[0], node, false, false, 'require');
      if (ts.isIdentifier(node.expression) && node.expression.text === 'fetch')
        effects.push({
          kind: 'syntax',
          line: lineAt(node),
          text: 'Contains a fetch call. Its runtime execution and destination are not established by the import index.',
        });
      if (
        ts.isPropertyAccessExpression(node.expression) &&
        ts.isIdentifier(node.expression.expression) &&
        ['localStorage', 'sessionStorage'].includes(node.expression.expression.text)
      )
        effects.push({
          kind: 'syntax',
          line: lineAt(node),
          text: `Contains ${node.expression.expression.text}.${node.expression.name.text}(). This is a syntax observation, not a persistence guarantee.`,
        });
    }
    if (node.parent === ast && ts.isExportAssignment(node))
      exports.add(node.isExportEquals ? 'export =' : 'default');
    if (
      node.parent === ast &&
      node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      if (node.modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.DefaultKeyword))
        exports.add('default');
      else if (ts.isVariableStatement(node))
        node.declarationList.declarations.forEach((declaration) =>
          bindingNames(declaration.name).forEach((name) => exports.add(name)),
        );
      else if (node.name && ts.isIdentifier(node.name)) exports.add(node.name.text);
      evidence.push({
        path: file,
        line: lineAt(node),
        endLine: ast.getLineAndCharacterOfPosition(node.end).line + 1,
      });
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  return { imports, exports: [...exports].sort(), effects, evidence };
}

function fileKind(file) {
  if (/(?:^|\/)(?:tests?|e2e|__tests__)(?:\/|$)|\.(?:test|spec)\.[cm]?[jt]sx?$/.test(file))
    return 'test';
  if (/\.d\.[cm]?ts$/.test(file)) return 'types';
  if (/\.sql$/.test(file)) return 'database';
  if (/\.(?:css|scss)$/.test(file)) return 'style';
  if (/\.(?:html|txt)$/.test(file)) return 'resource';
  if (
    /\.(?:json|ya?ml|toml)$|(?:^|\/)(?:Dockerfile|\.node-version|\.npmrc|\.gitignore)|(?:config|\.config)\.[cm]?[jt]s$/.test(
      file,
    )
  )
    return 'configuration';
  return /\.tsx$|\.jsx$/.test(file) ? 'component' : 'source';
}

function structuralSummary(file) {
  const name = path.posix.basename(file.path);
  const kind = {
    test: 'Test file',
    types: 'Type declarations',
    database: 'Database definition or migration',
    style: 'Stylesheet',
    resource: 'Text or HTML resource',
    configuration: 'Configuration file',
    component: 'JSX source file',
    source: 'Source module',
  }[file.kind];
  const names = file.exports.slice(0, 7);
  return `${kind}: ${name}.${names.length ? ` Exports ${names.join(', ')}${file.exports.length > names.length ? ` and ${file.exports.length - names.length} more` : ''}.` : ''} ${file.imports.length ? `Contains ${file.imports.length} static or literal import references.` : 'No literal module imports were extracted.'} Behavior has not been individually reviewed.`;
}

function validateContent(content, known, root) {
  const errors = [];
  const ids = new Set();
  for (const module of content.modules || []) {
    if (!module.id || ids.has(module.id))
      errors.push(`Duplicate or missing module id: ${module.id}`);
    ids.add(module.id);
  }
  function validateFile(file, context, allowDocument = false) {
    if (typeof file !== 'string') {
      errors.push(`Missing file reference in ${context}`);
      return;
    }
    const absolute = path.resolve(root, file);
    const inside = absolute.startsWith(root + path.sep);
    const document = allowDocument && /\.mdx?$/.test(file);
    if (
      !inside ||
      excluded.test(slash(file)) ||
      /(?:^|\/)\.env(?:\.|$)/i.test(file) ||
      !fs.existsSync(absolute) ||
      (!known.has(file) && !document)
    ) {
      errors.push(`Missing or out-of-scope file reference in ${context}: ${file}`);
    }
  }
  function validateReferences(item, context) {
    for (const moduleId of item.moduleIds || [])
      if (!ids.has(moduleId)) errors.push(`Unknown module in ${context}: ${moduleId}`);
    for (const file of item.filePaths || []) validateFile(file, context, true);
  }
  const viewIds = new Set();
  for (const view of content.views || []) {
    if (!view.id || viewIds.has(view.id)) errors.push(`Duplicate or missing view id: ${view.id}`);
    viewIds.add(view.id);
    const nodeIds = new Set();
    for (const node of view.nodes || []) {
      if (!node.id || nodeIds.has(node.id))
        errors.push(`Duplicate or missing node id in ${view.id}: ${node.id}`);
      nodeIds.add(node.id);
      validateReferences(node, `${view.id}/${node.id}`);
    }
    for (const edge of view.edges || []) {
      if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to))
        errors.push(`Unknown edge endpoint in ${view.id}: ${edge.from} -> ${edge.to}`);
    }
  }
  const journeyIds = new Set();
  for (const journey of content.journeys || []) {
    if (!journey.id || journeyIds.has(journey.id))
      errors.push(`Duplicate or missing journey id: ${journey.id}`);
    journeyIds.add(journey.id);
    validateReferences(journey, journey.id);
    for (const [index, step] of (journey.steps || []).entries())
      validateReferences(step, `${journey.id}/step ${index + 1}`);
  }
  const notePaths = new Set();
  for (const note of content.notes || []) {
    if (!known.has(note.path)) errors.push(`Reviewed file is not indexed: ${note.path}`);
    if (notePaths.has(note.path)) errors.push(`Duplicate reviewed file: ${note.path}`);
    notePaths.add(note.path);
    for (const source of note.sources || []) {
      validateFile(source.path, `${note.path} evidence`, true);
      const absolute = path.resolve(root, source.path);
      if (!absolute.startsWith(root + path.sep) || !fs.existsSync(absolute))
        errors.push(`Missing or out-of-scope evidence: ${source.path}`);
      else {
        const lines = fs.readFileSync(absolute, 'utf8').split(/\r?\n/).length;
        if (
          !Number.isInteger(source.line) ||
          source.line < 1 ||
          source.line > lines ||
          (source.endLine && (source.endLine < source.line || source.endLine > lines))
        )
          errors.push(`Invalid evidence range: ${source.path}:${source.line}-${source.endLine}`);
      }
    }
    for (const test of note.tests || [])
      if (!known.has(typeof test === 'string' ? test : test.path))
        errors.push(
          `Missing test reference for ${note.path}: ${typeof test === 'string' ? test : test.path}`,
        );
  }
  if (errors.length) throw new Error(errors.join('\n'));
}

export function buildIndex({
  root,
  content = {},
  paths = repositoryFiles(root),
  state = repositoryState(root),
  generatedAt = new Date().toISOString(),
}) {
  root = path.resolve(root);
  const known = new Set(paths);
  validateContent(content, known, root);
  const resolver = createResolver(root, paths);
  const modules = [...(content.modules || [])];
  const fallback = {
    id: 'other',
    label: 'Other repository files',
    summary:
      'Files outside the curated module prefixes, including supporting apps and project configuration.',
    prefixes: [],
    owner: 'Repository tooling and supporting apps',
  };
  if (!modules.some((module) => module.id === fallback.id)) modules.push(fallback);
  const prefixes = modules
    .flatMap((module) => (module.prefixes || []).map((prefix) => ({ prefix, id: module.id })))
    .sort((a, b) => b.prefix.length - a.prefix.length);
  const notes = new Map((content.notes || []).map((note) => [note.path, note]));
  const contents = new Map();
  const files = paths.map((file) => {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    contents.set(file, hash(source));
    const parsed = sourcePattern.test(file)
      ? inspectSource(file, source)
      : { imports: [], exports: [], effects: [], evidence: [] };
    const record = {
      path: file,
      moduleId: prefixes.find(({ prefix }) => file.startsWith(prefix))?.id || 'other',
      kind: fileKind(file),
      ...parsed,
      imports: parsed.imports.map((item) => {
        const target = resolver.resolve(file, item.specifier);
        return {
          ...item,
          target,
          resolution: target
            ? 'internal'
            : resolver.isLocalSpecifier(file, item.specifier)
              ? 'unresolved'
              : 'external',
        };
      }),
      importedBy: [],
      tests: [],
      lineCount: source.split(/\r?\n/).length,
      hash: contents.get(file),
      summaryKind: 'structural',
      reviewStatus: 'structural',
      reviewedAt: null,
      reviewedRevision: null,
      reads: [],
      writes: [],
      rules: [],
    };
    record.summary = structuralSummary(record);
    const note = notes.get(file);
    if (note) {
      const reviewedRevision = note.reviewedRevision || content.reviewedRevision || null;
      let reviewedHash = note.reviewedHash;
      if (!reviewedHash && reviewedRevision) {
        try {
          reviewedHash = hash(git(root, ['show', `${reviewedRevision}:${file}`]));
        } catch {
          reviewedHash = null;
        }
      }
      const unchanged = reviewedHash === record.hash;
      Object.assign(record, {
        summary: note.summary,
        summaryKind: 'reviewed',
        reviewedAt: note.reviewedAt || content.reviewedAt || null,
        reviewedRevision,
        reviewStatus: unchanged ? 'current' : 'needs-review',
        reviewReason: unchanged
          ? 'The file still matches its recorded reviewed content. Changes in other files can still affect behavior. Hashes include line endings.'
          : 'The file changed since the cited review, or its reviewed content could not be verified.',
        reads: note.reads || [],
        writes: note.writes || [],
        rules: note.rules || [],
        evidence: note.sources || parsed.evidence,
        tests: (note.tests || []).map((test) =>
          typeof test === 'string'
            ? {
                path: test,
                relationship: 'Curated review reference; passing status is not inferred.',
              }
            : test,
        ),
      });
    }
    return record;
  });
  const byPath = new Map(files.map((file) => [file.path, file]));
  for (const file of files)
    for (const dependency of file.imports) {
      const target = byPath.get(dependency.target);
      if (!target) continue;
      if (!target.importedBy.includes(file.path)) target.importedBy.push(file.path);
      if (file.kind === 'test' && !target.tests.some((test) => test.path === file.path))
        target.tests.push({
          path: file.path,
          relationship:
            'Directly imported by this test file; coverage and passing status are not inferred.',
        });
    }
  for (const file of files) {
    file.importedBy.sort();
    file.tests.sort((a, b) => a.path.localeCompare(b.path));
  }
  const packages = resolver.packages.map((pkg) => ({
    name: pkg.manifest.name || path.posix.dirname(pkg.path),
    path: pkg.path,
    dependencies: ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']
      .flatMap((scope) =>
        Object.entries(pkg.manifest[scope] || {}).map(([name, version]) => ({
          name,
          version,
          scope,
        })),
      )
      .sort((a, b) => a.name.localeCompare(b.name)),
  }));
  return {
    meta: {
      ...state,
      generatedAt,
      scope:
        'Tracked and nonignored working-tree source, tests, styles, SQL, text/HTML resources and configuration; excludes archive, dependencies, generated build folders, attached assets and environment files. Inclusion does not establish production reachability.',
      resolution:
        'TypeScript tsconfig aliases and workspace package exports. Imports are syntactic relationships, not proof of execution. Dynamic expressions, runtime-selected aliases and network/database relationships require curated review.',
      counts: {
        files: files.length,
        modules: modules.length,
        packages: packages.length,
        imports: files.reduce((sum, file) => sum + file.imports.length, 0),
        resolvedImports: files.reduce(
          (sum, file) => sum + file.imports.filter((entry) => entry.target).length,
          0,
        ),
        unresolvedImports: files.reduce(
          (sum, file) =>
            sum + file.imports.filter((entry) => entry.resolution === 'unresolved').length,
          0,
        ),
        reviewedFiles: notes.size,
        staleReviews: files.filter((file) => file.reviewStatus === 'needs-review').length,
      },
      inputHash: hash(JSON.stringify({ state, content, contents: [...contents] })),
    },
    modules,
    files,
    packages,
    views: content.views || [],
    journeys: content.journeys || [],
    diagrams: content.diagrams || [],
  };
}
