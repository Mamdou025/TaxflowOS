import { runtimeProblems } from './check-toolchain.mjs';

const problems = runtimeProblems(process.versions.node, process.env.npm_config_user_agent);
if (problems.length) {
  console.error(problems.join('\n'));
  console.error('See docs/DEVELOPMENT.md for the pinned native or Docker setup.');
  process.exitCode = 1;
}
