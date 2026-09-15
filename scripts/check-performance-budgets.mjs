import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicDirectory = path.join(root, 'artifacts/ai-workflow-builder/dist/public');
const assetsDirectory = path.join(publicDirectory, 'assets');
const htmlPath = path.join(publicDirectory, 'index.html');
const budgetPath = path.join(root, 'docs/performance-budgets.json');

if (!fs.existsSync(htmlPath)) {
  throw new Error(
    'Production output is missing. Build the web application before checking budgets.',
  );
}

const budget = JSON.parse(fs.readFileSync(budgetPath, 'utf8'));
const html = fs.readFileSync(htmlPath, 'utf8');
const referencedAssets = [
  ...new Set(
    [...html.matchAll(/(?:src|href)="\/assets\/([^"?]+\.(?:js|css))"/g)].map((match) => match[1]),
  ),
];

if (!referencedAssets.length) throw new Error('The production HTML references no local assets.');

function measure(names) {
  return names.reduce(
    (total, name) => {
      const filePath = path.join(assetsDirectory, name);
      if (!fs.existsSync(filePath))
        throw new Error(`Production HTML references missing asset ${name}.`);
      const bytes = fs.readFileSync(filePath);
      return {
        rawBytes: total.rawBytes + bytes.length,
        gzipBytes: total.gzipBytes + gzipSync(bytes, { level: 9 }).length,
      };
    },
    { rawBytes: 0, gzipBytes: 0 },
  );
}

const initialJavascript = referencedAssets.filter((name) => name.endsWith('.js'));
const initialStyles = referencedAssets.filter((name) => name.endsWith('.css'));
const javascriptFiles = fs.readdirSync(assetsDirectory).filter((name) => name.endsWith('.js'));
const javascriptMeasurements = javascriptFiles.map((name) => ({ name, ...measure([name]) }));
const largestRaw = javascriptMeasurements.toSorted((a, b) => b.rawBytes - a.rawBytes)[0];
const largestGzip = javascriptMeasurements.toSorted((a, b) => b.gzipBytes - a.gzipBytes)[0];
const workflowCanvas = javascriptMeasurements.find((asset) =>
  asset.name.startsWith('workflow-canvas-'),
);
if (!largestRaw || !largestGzip || !workflowCanvas) {
  throw new Error('Expected JavaScript build outputs were not found.');
}

const initialJs = measure(initialJavascript);
const initialCss = measure(initialStyles);
const metrics = {
  initialAssetCount: referencedAssets.length,
  initialJavascriptRawBytes: initialJs.rawBytes,
  initialJavascriptGzipBytes: initialJs.gzipBytes,
  initialStylesRawBytes: initialCss.rawBytes,
  initialStylesGzipBytes: initialCss.gzipBytes,
  largestJavascriptRawBytes: largestRaw.rawBytes,
  largestJavascriptGzipBytes: largestGzip.gzipBytes,
  workflowCanvasRawBytes: workflowCanvas.rawBytes,
};

const failures = Object.entries(budget.enforcedLimits).flatMap(([name, limit]) => {
  const actual = metrics[name];
  return typeof actual !== 'number' || typeof limit !== 'number' || actual > limit
    ? [`${name}: ${actual ?? 'missing'} exceeds ${limit}`]
    : [];
});
const publicSourceMaps = fs.readdirSync(assetsDirectory).filter((name) => name.endsWith('.map'));
if (publicSourceMaps.length) {
  failures.push(`${publicSourceMaps.length} source map(s) remain in the public asset directory`);
}
if (html.includes('Update this description') || html.includes('built on Replit')) {
  failures.push('production metadata still contains scaffold placeholder copy');
}

console.table(
  Object.entries(metrics).map(([metric, actual]) => ({
    metric,
    actual,
    limit: budget.enforcedLimits[metric],
  })),
);
console.log(`Largest raw JavaScript: ${largestRaw.name}`);
console.log(`Largest gzip JavaScript: ${largestGzip.name}`);
if (failures.length) throw new Error(`Production performance gate failed:\n${failures.join('\n')}`);
console.log('Production asset and performance budgets passed.');
