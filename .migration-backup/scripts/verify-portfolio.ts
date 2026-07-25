// Static integrity check for the Sinaxe portfolio workflow specs.
// Run: pnpm tsx scripts/verify-portfolio.ts
import { BLOCK_CATALOG } from "@/shared/workflow-engine/block-catalog-data";
import { PORTFOLIO_WORKFLOWS } from "@/shared/workflow-engine/templates/portfolio/portfolio-workflows";

const catalogIds = new Set(BLOCK_CATALOG.map((c) => c.id));
let errors = 0;
const err = (m: string) => {
  errors++;
  console.error("  ✗ " + m);
};

const workflowIds = new Set<string>();
for (const wf of PORTFOLIO_WORKFLOWS) {
  console.log(`\n${wf.id} — ${wf.name} (${wf.group}) · ${wf.blocks.length} blocks / ${wf.edges.length} edges`);
  if (workflowIds.has(wf.id)) err(`duplicate workflow id ${wf.id}`);
  workflowIds.add(wf.id);

  const blockIds = new Set<string>();
  for (const b of wf.blocks) {
    if (blockIds.has(b.id)) err(`duplicate block id "${b.id}"`);
    blockIds.add(b.id);
    if (!catalogIds.has(b.catalogId)) err(`block "${b.id}" → unknown catalogId "${b.catalogId}"`);
  }

  // Exactly one trigger, at least one source + one output, and connectivity.
  const fams = wf.blocks.map((b) => b.catalogId.split(":")[0]);
  if (fams.filter((f) => f === "trigger").length !== 1) err(`expected exactly 1 trigger`);
  if (!fams.includes("source")) err(`no source block`);
  if (!fams.includes("output")) err(`no output block`);

  for (const e of wf.edges) {
    if (!blockIds.has(e.from)) err(`edge references missing source "${e.from}"`);
    if (!blockIds.has(e.to)) err(`edge references missing target "${e.to}"`);
  }

  // Every non-trigger block should be touched by at least one edge.
  const touched = new Set<string>();
  wf.edges.forEach((e) => {
    touched.add(e.from);
    touched.add(e.to);
  });
  for (const b of wf.blocks) {
    if (b.catalogId.startsWith("trigger:")) continue;
    if (!touched.has(b.id)) err(`block "${b.id}" is not wired to any edge`);
  }
}

console.log(
  `\n${PORTFOLIO_WORKFLOWS.length} workflows checked — ${errors === 0 ? "ALL OK ✓" : errors + " ERROR(S)"}`
);
process.exit(errors === 0 ? 0 : 1);
