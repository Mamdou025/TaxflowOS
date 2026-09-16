import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const manifest = JSON.parse(read('package.json'));
const nodeVersion = read('.node-version').trim();
const manager = /^pnpm@(\d+\.\d+\.\d+)$/.exec(manifest.packageManager ?? '');

export function runtimeProblems(actualNode, userAgent, allowCompatibleMajor = false) {
  const problems = [];
  const actualPnpm = /^pnpm\/([^ ]+)/.exec(userAgent ?? '')?.[1];
  const managerNode = /(?:^| )node\/v?([^ ]+)/.exec(userAgent ?? '')?.[1];
  const compatibleNode = actualNode.split('.')[0] === nodeVersion.split('.')[0];
  const compatiblePnpm =
    Boolean(actualPnpm) && actualPnpm.split('.')[0] === manager?.[1].split('.')[0];
  const compatibleManagerNode =
    !managerNode || managerNode.split('.')[0] === nodeVersion.split('.')[0];

  if (actualNode !== nodeVersion && !(allowCompatibleMajor && compatibleNode))
    problems.push(`Node ${nodeVersion} is required; this process uses ${actualNode}.`);
  if (
    !manager ||
    (actualPnpm !== manager[1] && !(allowCompatibleMajor && compatiblePnpm))
  )
    problems.push(
      `Use ${manifest.packageManager}; detected ${actualPnpm ? `pnpm ${actualPnpm}` : 'no pnpm invocation'}.`,
    );
  if (
    managerNode &&
    managerNode !== nodeVersion &&
    !(allowCompatibleMajor && compatibleManagerNode)
  )
    problems.push(
      `The pnpm launcher uses Node ${managerNode}; select a launcher using Node ${nodeVersion}.`,
    );
  return problems;
}

export function configurationProblems() {
  const problems = [];
  if (!/^\d+\.\d+\.\d+$/.test(nodeVersion))
    problems.push('.node-version must contain an exact version.');
  if (!manager) problems.push('packageManager must pin an exact pnpm version.');
  if (manifest.engines?.node !== nodeVersion || manifest.engines?.pnpm !== manager?.[1])
    problems.push('package.json engines must agree with .node-version and packageManager.');
  const dockerfile = read('docker/development.Dockerfile');
  if (!dockerfile.includes(`FROM node:${nodeVersion}-bookworm-slim`))
    problems.push('The Docker development image must use the Node version in .node-version.');
  if (!dockerfile.includes("require('/opt/taxflow-toolchain/package.json').packageManager"))
    problems.push('The Docker development image must read pnpm from packageManager.');
  const compose = read('docker-compose.yml');
  if (!compose.includes(`image: taxflowos-dev:node${nodeVersion}-pnpm${manager?.[1]}`))
    problems.push('The Compose image label must agree with the pinned toolchain.');
  if (!compose.includes('pnpm install --frozen-lockfile') || /pnpm@10(?:\s|["'])/.test(compose))
    problems.push('Compose must use a frozen install and the pinned development image.');
  const ci = read('.github/workflows/verify.yml');
  if (
    !ci.includes('node-version-file: .node-version') ||
    !ci.includes('pnpm install --frozen-lockfile')
  )
    problems.push('CI must read .node-version and install from the frozen lockfile.');
  return problems;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const problems = [
    ...configurationProblems(),
    ...(process.argv.includes('--config-only')
      ? []
      : runtimeProblems(process.versions.node, process.env.npm_config_user_agent)),
  ];
  if (problems.length) {
    console.error(problems.join('\n'));
    console.error(
      'See docs/DEVELOPMENT.md. Do not bypass checks to continue with a different toolchain.',
    );
    process.exitCode = 1;
  } else {
    console.log(
      `Toolchain ${process.argv.includes('--config-only') ? 'configuration' : 'runtime and configuration'} verified: Node ${nodeVersion}, ${manifest.packageManager}.`,
    );
    console.log(
      'This checks versions/configuration, not live database or model-provider availability.',
    );
  }
}
