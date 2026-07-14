'use client';

import { createRoullementFiscalWorkflow } from '@/lib/local-fiscal-workflow';
import { ROULEMENT_ELECTION_CALC_RULES, ROULEMENT_SUMMARY_CALC_RULES } from '@/lib/workflow/sample-workflows/roulement-fiscal-template';
import type { TemplateConfig, SourceRow, CategoryOption, DerivedRow } from './engine';

// Sample "biens transférés" — the property being rolled into the corporation.
// The Roulement classification mapper matches on `description`, so each row's
// description carries both the classification keyword AND the label prefix (so a
// user categorization override — which keys off the label — also matches on
// re-run). The last row is ambiguous, so the run must ask how to classify it.
const ROWS: SourceRow[] = [
  { rowId: 'b-1', label: 'Actions ordinaires de Filiale', description: 'Actions ordinaires de Filiale — titres de participation', amount: 40000, currency: 'USD' },
  { rowId: 'b-2', label: 'Équipement de production classe 8', description: 'Équipement de production classe 8 — machinerie amortissable', amount: 60000, currency: 'USD' },
  { rowId: 'b-3', label: 'Terrain commercial', description: 'Terrain commercial — fonds de terre non amortissable', amount: 80000, currency: 'USD' },
  { rowId: 'b-4', label: 'Inventaire de marchandises', description: 'Inventaire de marchandises — stock de produits finis', amount: 30000, currency: 'USD' },
  { rowId: 'b-5', label: 'Achalandage de l’entreprise', description: 'Achalandage de l’entreprise — goodwill incorporel', amount: 20000, currency: 'USD' },
  { rowId: 'b-6', label: 'Contrat de service exclusif', description: 'Contrat de service exclusif — droit contractuel non classé', amount: 15000, currency: 'USD' },
];

const CATEGORIES: CategoryOption[] = [
  { id: 'actions', label: 'Actions / Titres' },
  { id: 'immobilisationAmortissable', label: 'Immobilisation amortissable' },
  { id: 'bienEnCapitalNonAmortissable', label: 'Bien en capital non amortissable' },
  { id: 'biensInventaire', label: 'Biens en inventaire' },
  { id: 'immobilisationIncorporelle', label: 'Incorporel / Achalandage' },
  { id: '__skip__', label: 'Laisser non classé' },
];

export const ROULEMENT_CONFIG: TemplateConfig = {
  id: 'roulement',
  name: 'Roulement fiscal (art. 85)',
  agentId: 'theo',
  documentLabel: 'tableau des biens transférés (PBR / JVM)',
  steps: [
    { label: 'Biens transférés', sub: 'Tableau des biens · PBR / JVM' },
    { label: 'Classer les biens', sub: 'Classification par catégorie' },
    { label: 'Élection art. 85', sub: 'Bornes + montant élu' },
    { label: 'Réviser & approuver', sub: 'Signature des chiffres' },
  ],
  buildSnapshot: createRoullementFiscalWorkflow as unknown as TemplateConfig['buildSnapshot'],
  sampleRows: ROWS,
  sourceBlockId: 'roulement-source-biens',
  mapperBlockId: 'roulement-logic-classification',
  rollupBlockId: 'roulement-logic-rollup',
  linesBlockId: 'roulement-logic-election',
  summaryBlockId: 'roulement-logic-sommaire',
  linesRules: ROULEMENT_ELECTION_CALC_RULES,
  summaryRules: ROULEMENT_SUMMARY_CALC_RULES,
  bucketKeys: ['pbr_immo_amortissable', 'pbr_bien_capital', 'pbr_actions', 'pbr_inventaire', 'pbr_incorporel', 'pbr_total'],
  lineKeys: ['BORNE_MIN', 'BORNE_MAX', 'MONTANT_ELU', 'PRODUIT_ALIENATION', 'GAIN_CAPITAL_BRUT', 'GAIN_IMPOSABLE', 'COUT_ACTIONS_RECUES'],
  categoryOptions: CATEGORIES,
  headlineKey: 'GAIN_DIFFERE',
  currency: 'USD',
  elect: { paramBlockId: 'roulement-source-params', paramKey: 'montant_elu', minKey: 'BORNE_MIN', maxKey: 'BORNE_MAX', label: 'montant élu (art. 85)' },
  // The template's params source (fapi_inputs tool) doesn't emit jvm_total /
  // contrepartie / taux_inclusion, so the deterministic art. 85 election math is
  // computed here from the engine's real PBR total + these fixed params.
  params: { jvm_total: 500000, contrepartie_autre: 0, taux_inclusion: 0.5, fx_rate: 1.35, impot_rate: 0.265 },
  editableInputs: [
    { key: 'jvm_total', label: 'JVM totale des biens', default: 500000, step: 10000, hint: 'Juste valeur marchande des biens transférés' },
    { key: 'contrepartie_autre', label: 'Contrepartie autre que des actions', default: 0, step: 5000 },
    { key: 'taux_inclusion', label: 'Taux d’inclusion', default: 0.5, step: 0.05 },
  ],
  computeExtra: ({ rollup, params, elected }): { lines: DerivedRow[]; summary: DerivedRow[]; boundsMin: number; boundsMax: number } => {
    const pbrTotal = rollup.pbr_total ?? 0;
    const borneMin = Math.max(pbrTotal, params.contrepartie_autre);
    const borneMax = params.jvm_total;
    const montantElu = elected ?? borneMin;
    const gainBrut = Math.max(montantElu - pbrTotal, 0);
    const gainImposable = gainBrut * params.taux_inclusion;
    const coutActions = montantElu - params.contrepartie_autre;
    const gainDiffere = params.jvm_total - montantElu;
    const impotDiffere = gainDiffere * params.impot_rate;
    const lines: DerivedRow[] = [
      { key: 'BORNE_MIN', label: 'Borne minimale', value: borneMin, formula: 'max(PBR total, contrepartie)' },
      { key: 'BORNE_MAX', label: 'Borne maximale (JVM)', value: borneMax, formula: 'JVM totale des biens' },
      { key: 'MONTANT_ELU', label: 'Montant élu', value: montantElu, formula: 'choisi entre les bornes (art. 85(1)a))' },
      { key: 'GAIN_CAPITAL_BRUT', label: 'Gain en capital brut', value: gainBrut, formula: 'max(montant élu − PBR total, 0)' },
      { key: 'GAIN_IMPOSABLE', label: 'Gain imposable', value: gainImposable, formula: 'gain brut × taux d’inclusion (50 %)' },
      { key: 'COUT_ACTIONS_RECUES', label: 'Coût des actions reçues', value: coutActions, formula: 'montant élu − contrepartie autre' },
    ];
    const summary: DerivedRow[] = [
      { key: 'PBR_TOTAL', label: 'PBR total des biens', value: pbrTotal, formula: 'somme des PBR classés' },
      { key: 'GAIN_DIFFERE', label: 'Gain différé (non reconnu)', value: gainDiffere, formula: 'JVM totale − montant élu' },
      { key: 'IMPOT_ESTIME_DIFFERE', label: 'Impôt reporté estimé', value: impotDiffere, formula: 'gain différé × 26,5 %' },
      { key: 'JVM_TOTAL', label: 'JVM totale des biens', value: params.jvm_total, formula: 'juste valeur marchande (donnée)' },
    ];
    return { lines, summary, boundsMin: borneMin, boundsMax: borneMax };
  },
};
