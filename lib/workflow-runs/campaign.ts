'use client';

import { createCampaignBudgetWorkflow } from '@/lib/local-fiscal-workflow';
import {
  CAMPAIGN_ELECTION_CALC_RULES,
  CAMPAIGN_SUMMARY_CALC_RULES,
} from '@/lib/workflow/sample-workflows/campaign-budget-template';
import type { TemplateConfig, SourceRow, CategoryOption, DerivedRow } from './engine';

// Sample channel spend requests — one row per proposed campaign line. The
// classifier matches on label + description.
const ROWS: SourceRow[] = [
  { rowId: 'ch-1', account: 'PS', label: 'Google Ads — Q3 search', description: 'Paid search PPC campaign — brand + non-brand', amount: 120000, currency: 'USD' },
  { rowId: 'ch-2', account: 'SO', label: 'LinkedIn sponsored posts', description: 'Paid social media — B2B lead generation', amount: 60000, currency: 'USD' },
  { rowId: 'ch-3', account: 'CT', label: 'SEO content program', description: 'Content marketing blog and editorial SEO', amount: 45000, currency: 'USD' },
  { rowId: 'ch-4', account: 'EV', label: 'SaaStr conference booth', description: 'Event sponsorship — trade show booth', amount: 80000, currency: 'USD' },
  { rowId: 'ch-5', account: 'IN', label: 'Creator partnership program', description: 'Influencer and creator UGC campaign', amount: 35000, currency: 'USD' },
  { rowId: 'ch-6', account: 'SO', label: 'Instagram + TikTok ads', description: 'Paid social media performance ads', amount: 40000, currency: 'USD' },
  { rowId: 'ch-7', account: 'OT', label: 'Marketing tooling & contingency', description: 'Other tools and contingency reserve', amount: 20000, currency: 'USD' },
];

const CATEGORIES: CategoryOption[] = [
  { id: 'paidSearch', label: 'Paid search' },
  { id: 'socialMedia', label: 'Paid social' },
  { id: 'contentSeo', label: 'Content & SEO' },
  { id: 'events', label: 'Events & sponsorship' },
  { id: 'influencer', label: 'Influencer & creator' },
  { id: 'other', label: 'Other / contingency' },
  { id: '__skip__', label: 'Leave unclassified' },
];

const money = (n: number) => Number(n.toFixed(2));

export const CAMPAIGN_CONFIG: TemplateConfig = {
  id: 'campaign',
  name: 'Marketing Campaign Budget Allocation',
  agentId: 'nova',
  documentLabel: 'channel spend requests',
  // No resultPage → this workflow has NO dedicated worksheet (results live in the
  // run + summoned output card).
  steps: [
    { label: 'Collect spend requests', sub: 'One row per channel line' },
    { label: 'Classify by channel', sub: 'Keyword classifier → channels' },
    { label: 'Elect the approved budget', sub: 'Floor ↔ ceiling' },
    { label: 'Review & approve', sub: 'Sign off the allocation' },
  ],
  buildSnapshot: createCampaignBudgetWorkflow as unknown as TemplateConfig['buildSnapshot'],
  sampleRows: ROWS,
  sourceBlockId: 'campaign-source-requests',
  mapperBlockId: 'campaign-logic-classifier',
  rollupBlockId: 'campaign-logic-rollup',
  linesBlockId: 'campaign-logic-election',
  summaryBlockId: 'campaign-logic-summary',
  linesRules: CAMPAIGN_ELECTION_CALC_RULES,
  summaryRules: CAMPAIGN_SUMMARY_CALC_RULES,
  defaultRouteUnmatched: true,
  bucketKeys: ['paidsearch_total', 'social_total', 'content_total', 'events_total', 'influencer_total', 'other_total', 'requested_total'],
  lineKeys: ['ALLOC_PAIDSEARCH', 'ALLOC_SOCIAL', 'ALLOC_CONTENT', 'ALLOC_EVENTS', 'ALLOC_INFLUENCER', 'ALLOC_OTHER', 'APPROVED_BUDGET'],
  categoryOptions: CATEGORIES,
  headlineKey: 'PROJECTED_REVENUE',
  currency: 'USD',
  elect: {
    paramBlockId: 'campaign-source-params',
    paramKey: 'montant_elu',
    minKey: 'BORNE_MIN',
    maxKey: 'BORNE_MAX',
    label: 'approved campaign budget',
    ceilingWord: 'budget',
    floorLabel: 'Committed',
    ceilingLabel: 'Full cap',
    floorNote: ' · minimum spend',
    ceilingNote: ' · maximum reach',
    promptSuffix: ' This sets the approved budget and its projected return.',
  },
  params: { budget_cap: 300000, committed_spend: 150000, target_roas: 3.5 },
  editableInputs: [
    { key: 'budget_cap', label: 'Total budget cap', default: 300000, step: 10000, hint: 'The maximum the budget owner can approve' },
    { key: 'committed_spend', label: 'Already-committed spend', default: 150000, step: 10000, hint: 'The floor — cannot approve below this' },
    { key: 'target_roas', label: 'Target ROAS', default: 3.5, step: 0.1, hint: 'Projected revenue = approved budget × ROAS' },
  ],
  // The election math: bounds from committed floor + budget cap, then allocate the
  // approved amount across channels by requested share and project the return.
  computeExtra: ({ rollup, params, elected }): { lines: DerivedRow[]; summary: DerivedRow[]; boundsMin: number; boundsMax: number } => {
    const requested = rollup.requested_total ?? 0;
    const cap = params.budget_cap ?? 300000;
    const committed = params.committed_spend ?? 150000;
    const roas = params.target_roas ?? 3.5;

    const ceiling = Math.min(cap, requested);
    const floor = Math.min(committed, ceiling);
    const approved = elected ?? floor;
    const share = (bucket: number) => (requested > 0 ? (bucket / requested) * approved : 0);

    const paidSearch = share(rollup.paidsearch_total ?? 0);
    const social = share(rollup.social_total ?? 0);
    const content = share(rollup.content_total ?? 0);
    const events = share(rollup.events_total ?? 0);
    const influencer = share(rollup.influencer_total ?? 0);
    const other = share(rollup.other_total ?? 0);

    const projectedRevenue = approved * roas;
    const unfunded = Math.max(requested - approved, 0);
    const remaining = cap - approved;

    const lines: DerivedRow[] = [
      { key: 'ALLOC_PAIDSEARCH', label: 'Paid search allocation', value: money(paidSearch), formula: 'requested share × approved budget' },
      { key: 'ALLOC_SOCIAL', label: 'Paid social allocation', value: money(social), formula: 'requested share × approved budget' },
      { key: 'ALLOC_CONTENT', label: 'Content & SEO allocation', value: money(content), formula: 'requested share × approved budget' },
      { key: 'ALLOC_EVENTS', label: 'Events allocation', value: money(events), formula: 'requested share × approved budget' },
      { key: 'ALLOC_INFLUENCER', label: 'Influencer allocation', value: money(influencer), formula: 'requested share × approved budget' },
      { key: 'ALLOC_OTHER', label: 'Other allocation', value: money(other), formula: 'requested share × approved budget' },
      { key: 'APPROVED_BUDGET', label: 'Approved budget', value: money(approved), formula: 'elected between floor and ceiling' },
    ];
    const summary: DerivedRow[] = [
      { key: 'REQUESTED_TOTAL', label: 'Total requested', value: money(requested), formula: 'sum of every channel ask' },
      { key: 'APPROVED_BUDGET', label: 'Approved budget', value: money(approved), formula: 'elected amount' },
      { key: 'PROJECTED_REVENUE', label: 'Projected revenue', value: money(projectedRevenue), formula: `approved budget × ROAS ${roas}` },
      { key: 'UNFUNDED_REQUESTS', label: 'Unfunded requests', value: money(unfunded), formula: 'max(requested − approved, 0)' },
      { key: 'BUDGET_REMAINING', label: 'Budget remaining', value: money(remaining), formula: 'budget cap − approved budget' },
    ];
    return { lines, summary, boundsMin: floor, boundsMax: ceiling };
  },
};
