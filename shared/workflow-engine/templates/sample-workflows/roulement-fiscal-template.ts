// ── Keyword rules — classifies each property row by type ─────────────────────

export const ROULEMENT_CLASSIFICATION_RULES = [
  {
    categoryId: "immobilisationAmortissable",
    categoryLabel: "Immobilisation amortissable",
    confidence: 0.93,
    description: "Dépreciable / amortissable — classes CII 8, 10, 43, etc.",
    keywords: [
      "immobilisation",
      "amortissable",
      "dépreciable",
      "depreciable",
      "équipement",
      "equipment",
      "machinerie",
      "machinery",
      "classe 8",
      "classe 10",
      "classe 43",
      "véhicule",
      "vehicle",
    ],
    matchMode: "contains",
    priority: 10,
    ruleId: "rule-immo-amortissable",
  },
  {
    categoryId: "bienEnCapitalNonAmortissable",
    categoryLabel: "Bien en capital non amortissable",
    confidence: 0.91,
    description: "Terrain, fonds de terre, immeuble non amortissable.",
    keywords: [
      "terrain",
      "fonds de terre",
      "land",
      "immeuble",
      "building",
      "real property",
      "propriété réelle",
      "non amortissable",
    ],
    matchMode: "contains",
    priority: 10,
    ruleId: "rule-bien-capital-non-amortissable",
  },
  {
    categoryId: "actions",
    categoryLabel: "Actions / Titres",
    confidence: 0.94,
    description: "Actions ordinaires, privilégiées ou titres de participation.",
    keywords: [
      "actions",
      "shares",
      "titres",
      "participation",
      "ordinaires",
      "privilégiées",
      "preferred shares",
      "common shares",
    ],
    matchMode: "contains",
    priority: 10,
    ruleId: "rule-actions",
  },
  {
    categoryId: "biensInventaire",
    categoryLabel: "Biens en inventaire",
    confidence: 0.89,
    description: "Stock, marchandise, inventaire transféré.",
    keywords: [
      "inventaire",
      "inventory",
      "stock",
      "marchandise",
      "merchandise",
      "goods",
      "produits",
    ],
    matchMode: "contains",
    priority: 8,
    ruleId: "rule-biens-inventaire",
  },
  {
    categoryId: "immobilisationIncorporelle",
    categoryLabel: "Immobilisation incorporelle / Achalandage",
    confidence: 0.87,
    description: "Achalandage, marques, brevets, propriété intellectuelle.",
    keywords: [
      "achalandage",
      "goodwill",
      "marque",
      "trademark",
      "brevet",
      "patent",
      "propriété intellectuelle",
      "intellectual property",
      "licence",
      "license",
      "incorporel",
    ],
    matchMode: "contains",
    priority: 9,
    ruleId: "rule-immo-incorporelle",
  },
  {
    categoryId: "creancesEtBillets",
    categoryLabel: "Créances et billets",
    confidence: 0.88,
    description: "Comptes débiteurs, billets à recevoir, prêts inter-compagnies.",
    keywords: [
      "créance",
      "receivable",
      "billet",
      "note receivable",
      "prêt",
      "loan",
      "inter-compagnie",
      "intercompany",
      "débiteur",
    ],
    matchMode: "contains",
    priority: 8,
    ruleId: "rule-creances-billets",
  },
];

// ── Rollup rules — groups property categories into PBR buckets ────────────────

export const ROULEMENT_ROLLUP_RULES = [
  {
    description: "Somme du PBR de toutes les immobilisations amortissables.",
    includeCategoryIds: ["immobilisationAmortissable"],
    label: "PBR — Immobilisations amortissables",
    operation: "sum",
    rollupId: "pbr_immo_amortissable",
  },
  {
    description: "Somme du PBR des biens en capital non amortissables.",
    includeCategoryIds: ["bienEnCapitalNonAmortissable"],
    label: "PBR — Biens en capital non amortissables",
    operation: "sum",
    rollupId: "pbr_bien_capital",
  },
  {
    description: "Somme du PBR des actions et titres transférés.",
    includeCategoryIds: ["actions"],
    label: "PBR — Actions et titres",
    operation: "sum",
    rollupId: "pbr_actions",
  },
  {
    description: "Somme du PBR des biens en inventaire.",
    includeCategoryIds: ["biensInventaire"],
    label: "PBR — Inventaire",
    operation: "sum",
    rollupId: "pbr_inventaire",
  },
  {
    description: "Somme du PBR des immobilisations incorporelles.",
    includeCategoryIds: ["immobilisationIncorporelle"],
    label: "PBR — Incorporels / Achalandage",
    operation: "sum",
    rollupId: "pbr_incorporel",
  },
  {
    description: "Somme du PBR total de tous les biens — toutes catégories confondues.",
    includeCategoryIds: [
      "immobilisationAmortissable",
      "bienEnCapitalNonAmortissable",
      "actions",
      "biensInventaire",
      "immobilisationIncorporelle",
      "creancesEtBillets",
    ],
    label: "PBR Total — Tous les biens",
    operation: "sum",
    rollupId: "pbr_total",
  },
];

// ── Calculation rules — Article 85 election per-property metrics ──────────────

export const ROULEMENT_ELECTION_CALC_RULES = [
  {
    calculationId: "BORNE_MIN",
    description: "Borne min = max(PBR total, contrepartie autre)",
    label: "Borne minimale",
    operands: ["pbr_total", "contrepartie_autre"],
    operation: "max",
    resultKey: "BORNE_MIN",
  },
  {
    calculationId: "BORNE_MAX",
    description: "Borne max = JVM totale des biens transférés",
    label: "Borne maximale (JVM)",
    operands: ["jvm_total"],
    operation: "pass_through",
    resultKey: "BORNE_MAX",
  },
  {
    calculationId: "MONTANT_ELU",
    description: "Montant élu (entré manuellement, entre BORNE_MIN et BORNE_MAX)",
    label: "Montant élu",
    operands: ["montant_elu"],
    operation: "pass_through",
    resultKey: "MONTANT_ELU",
  },
  {
    calculationId: "PRODUIT_ALIENATION",
    description: "Produit d'aliénation = montant élu (art. 85(1)a))",
    label: "Produit d'aliénation",
    operands: ["MONTANT_ELU"],
    operation: "pass_through",
    resultKey: "PRODUIT_ALIENATION",
  },
  {
    calculationId: "GAIN_CAPITAL_BRUT",
    description: "Gain en capital brut = max(montant_elu - pbr_total, 0)",
    label: "Gain en capital brut",
    operands: ["MONTANT_ELU", "pbr_total"],
    operation: "max_subtract_zero",
    resultKey: "GAIN_CAPITAL_BRUT",
  },
  {
    calculationId: "GAIN_IMPOSABLE",
    description: "Gain imposable = gain_brut × taux_inclusion",
    label: "Gain en capital imposable",
    operands: ["GAIN_CAPITAL_BRUT", "taux_inclusion"],
    operation: "multiply",
    resultKey: "GAIN_IMPOSABLE",
  },
  {
    calculationId: "COUT_ACTIONS_RECUES",
    description: "Coût des actions reçues = montant_elu − contrepartie_autre",
    label: "Coût des actions reçues",
    operands: ["MONTANT_ELU", "contrepartie_autre"],
    operation: "subtract",
    resultKey: "COUT_ACTIONS_RECUES",
  },
];

// ── Calculation rules — consolidated rollover summary ─────────────────────────

export const ROULEMENT_SUMMARY_CALC_RULES = [
  {
    calculationId: "GAIN_DIFFERE",
    description: "Gain différé = JVM totale − montant élu (plus-value non reconnue)",
    label: "Gain différé (non reconnu)",
    operands: ["jvm_total", "MONTANT_ELU"],
    operation: "subtract",
    resultKey: "GAIN_DIFFERE",
  },
  {
    calculationId: "IMPOT_ESTIME_DIFFERE",
    description: "Impôt estimé sur gain différé ≈ gain_differe × 0.265 (taux corp. estimé)",
    label: "Impôt estimé sur gain différé",
    operands: ["GAIN_DIFFERE", 0.265],
    operation: "multiply",
    resultKey: "IMPOT_ESTIME_DIFFERE",
  },
  {
    calculationId: "FX_RATE",
    description: "Taux de change (Banque du Canada, moyen annuel)",
    label: "Taux de change USD→CAD",
    operands: ["fxRate"],
    operation: "pass_through",
    resultKey: "FX_RATE",
  },
  {
    calculationId: "JVM_TOTAL_CAD",
    description: "JVM totale en CAD = jvm_total × taux de change",
    label: "JVM totale (CAD)",
    operands: ["jvm_total", "FX_RATE"],
    operation: "multiply",
    resultKey: "JVM_TOTAL_CAD",
  },
  {
    calculationId: "GAIN_REALISE_CAD",
    description: "Gain réalisé converti en CAD = gain_capital_brut × taux de change",
    label: "Gain réalisé (CAD)",
    operands: ["GAIN_CAPITAL_BRUT", "FX_RATE"],
    operation: "multiply",
    resultKey: "GAIN_REALISE_CAD",
  },
];

// ── Block specs ───────────────────────────────────────────────────────────────

export const ROULEMENT_FISCAL_BLOCK_SPECS = [
  // ── Sources ──────────────────────────────────────────────────────────────
  {
    catalogId: "source:excel-workbook",
    config: {
      columns: ["rowId", "nom_bien", "categorie", "pbr", "jvm", "devise"],
      columnMapping: {
        account: "categorie",
        amount: "pbr",
        currency: "devise",
        description: "nom_bien",
        label: "categorie",
      },
      outputs: "selected_rows",
      requireUpload: true,
      rows: [],
      selectedRange: "",
      selectedRowsCount: 0,
      selectedSheet: "",
      sheets: [],
      sourceKind: "excel_workbook",
      sourceLocator: "local-excel://awaiting-upload",
      sourceStatus: "draft",
      sourceVersion: 1,
      toolId: "source.manual_table",
      workbookName: "Téléverser le tableau des biens à transférer",
    },
    description:
      "Téléverser le tableau des biens à transférer : nom, catégorie, PBR et JVM par bien.",
    id: "roulement-source-biens",
    label: "Biens transférés",
    position: { x: -220, y: 80 },
  },
  {
    catalogId: "source:manual-entry",
    config: {
      contrepartie_autre: 0,
      documentCurrency: "USD",
      jvm_total: 500000,
      montant_elu: 350000,
      outputs: "roulement_params, input_metadata",
      reportingCurrency: "CAD",
      sourceKind: "fapi_inputs",
      sourceLocator: "manual-source://roulement-params",
      sourceStatus: "draft",
      sourceVersion: 1,
      taux_inclusion: 0.5,
      toolId: "source.fapi_inputs",
    },
    description:
      "Paramètres du roulement : JVM totale, montant élu, contrepartie autre (billets/argent), taux d'inclusion.",
    id: "roulement-source-params",
    label: "Paramètres 85",
    position: { x: -220, y: 360 },
  },
  {
    catalogId: "source:currency-rate",
    config: {
      documentCurrency: "USD",
      fapiYear: 2025,
      overrideRate: 1.35,
      overrideReason: "Taux de change provisoire fourni par le gestionnaire.",
      outputs: "exchange_rate, rate_metadata",
      rateProvider: "bank_of_canada",
      rateType: "annual_average",
      reportingCurrency: "CAD",
      sourceKind: "currency_rate",
      sourceLocator: "bank-of-canada://annual-average/USD-CAD/2025",
      sourceStatus: "draft",
      sourceVersion: 1,
      toolId: "source.currency_rate",
    },
    description:
      "Taux de change moyen annuel USD→CAD (Banque du Canada) pour la conversion en monnaie de rapport.",
    id: "roulement-source-fx",
    label: "Taux de change",
    position: { x: -220, y: 640 },
  },

  // ── Logic ─────────────────────────────────────────────────────────────────
  {
    catalogId: "logic:classification-mapping",
    config: {
      conflictStrategy: "highest_confidence",
      inputs: "data_rows, keyword_rules",
      keywordRules: ROULEMENT_CLASSIFICATION_RULES,
      lowConfidenceThreshold: 0.75,
      matchFields: ["nom_bien", "categorie", "description"],
      matchMode: "contains",
      outputs: "mapped_rows, unmatched_rows, low_confidence_rows, mapping_summary",
      toolId: "logic.keyword_mapper",
      unmatchedStrategy: "send_to_review",
    },
    description:
      "Classifie chaque bien par type (immobilisation amortissable, bien en capital, actions, inventaire, incorporel) en vue du calcul de l'élection.",
    id: "roulement-logic-classification",
    label: "Classification des biens",
    position: { x: 340, y: 80 },
  },
  {
    catalogId: "logic:category-rollup-aggregator",
    config: {
      inputs: "mapped_rows, rollup_rules",
      operation: "sum",
      outputs: "category_totals, rollup_totals, named_values, rollup_summary",
      rollupRules: ROULEMENT_ROLLUP_RULES,
      toolId: "logic.category_rollup_aggregator",
    },
    description:
      "Agrège le PBR par catégorie de bien et produit le PBR total pour alimenter les calculs de l'élection.",
    id: "roulement-logic-rollup",
    label: "Agrégation PBR",
    position: { x: 800, y: 80 },
  },
  {
    catalogId: "logic:calculation-engine",
    config: {
      formulas: ROULEMENT_ELECTION_CALC_RULES,
      inputs: "named_values, protected_inputs",
      mode: "auto",
      outputs: "calculated_results, formula_trace, calculation_summary, named_values",
      toolId: "logic.calculation_engine",
    },
    description:
      "Calcule les bornes min/max de l'élection art. 85, le produit d'aliénation, le gain en capital brut et imposable, et le coût des actions reçues.",
    id: "roulement-logic-election",
    label: "Calcul élection art. 85",
    position: { x: 1260, y: 80 },
  },
  {
    catalogId: "logic:calculation-engine",
    config: {
      formulas: ROULEMENT_SUMMARY_CALC_RULES,
      inputs: "named_values",
      mode: "auto",
      outputs: "calculated_results, formula_trace, calculation_summary, named_values",
      toolId: "logic.calculation_engine",
    },
    description:
      "Consolide le gain différé total, l'impôt estimé reporté, et convertit les montants en CAD via le taux de change.",
    id: "roulement-logic-sommaire",
    label: "Sommaire du roulement",
    position: { x: 1720, y: 80 },
  },

  // ── Field blocks ──────────────────────────────────────────────────────────
  {
    catalogId: "field:field-block",
    config: { toolId: "field.field_block" },
    description: "Affiche le PBR par catégorie de bien suite à l'agrégation.",
    id: "roulement-field-pbr",
    label: "PBR par catégorie",
    position: { x: 800, y: 480 },
  },
  {
    catalogId: "field:field-block",
    config: { toolId: "field.field_block" },
    description:
      "Affiche les résultats de l'élection : bornes, montant élu, gain brut, gain imposable, coût des actions.",
    id: "roulement-field-election",
    label: "Résultats élection 85",
    position: { x: 1260, y: 480 },
  },
  {
    catalogId: "field:field-block",
    config: { toolId: "field.field_block" },
    description:
      "Affiche le sommaire consolidé : gain différé, impôt estimé reporté, JVM et gain en CAD.",
    id: "roulement-field-sommaire",
    label: "Sommaire consolidé",
    position: { x: 1720, y: 480 },
  },

  // ── Outputs ───────────────────────────────────────────────────────────────
  {
    catalogId: "output:evidence-pack",
    config: {
      inputs: "mapped_rows, review_findings, source_trace",
      outputs: "preview",
      toolId: "output.evidence_pack_preview",
    },
    description:
      "Données T2057 lisibles : biens classifiés, PBR agrégé, montant élu, gain calculé — prêt pour révision et dépôt.",
    id: "roulement-output-t2057",
    label: "Données T2057",
    position: { x: 2180, y: 80 },
  },
  {
    catalogId: "output:canonical-json",
    config: {
      inputs: "mapped_rows, review_findings, source_trace",
      outputs: "canonical_json",
      toolId: "output.canonical_json",
    },
    description:
      "Remise structurée JSON : biens classifiés, PBR par catégorie, résultats de l'élection, sommaire et taux de change.",
    id: "roulement-output-json",
    label: "Remise JSON",
    position: { x: 2180, y: 380 },
  },
];

// ── Edge specs ────────────────────────────────────────────────────────────────

export const ROULEMENT_FISCAL_EDGE_SPECS = [
  // Sources → Logic
  {
    bindingLabel: "Tableau des biens à classifier",
    reason:
      "Le classificateur de mots-clés catégorise chaque bien par type (immobilisation, actions, inventaire…).",
    relationshipType: "provides_data_to",
    sourceBlockId: "roulement-source-biens",
    sourceOutputRole: "selected_rows",
    targetBlockId: "roulement-logic-classification",
    targetInputRole: "data_rows",
  },
  {
    bindingLabel: "Biens classifiés vers l'agrégation PBR",
    reason:
      "L'agrégateur regroupe les lignes classifiées pour produire le PBR total par catégorie.",
    relationshipType: "aggregates_into",
    sourceBlockId: "roulement-logic-classification",
    sourceOutputRole: "mapped_rows",
    targetBlockId: "roulement-logic-rollup",
    targetInputRole: "mapped_rows",
  },
  {
    bindingLabel: "PBR total pour le calcul de l'élection",
    reason:
      "Le moteur de calcul utilise le PBR total agrégé pour établir la borne minimale et le gain en capital.",
    relationshipType: "provides_data_to",
    sourceBlockId: "roulement-logic-rollup",
    sourceOutputRole: "named_values",
    targetBlockId: "roulement-logic-election",
    targetInputRole: "named_values",
  },
  {
    bindingLabel: "Paramètres de l'élection (JVM, montant élu, contrepartie)",
    reason:
      "Le calcul art. 85 requiert la JVM totale, le montant élu et la contrepartie autre de la saisie manuelle.",
    relationshipType: "provides_data_to",
    sourceBlockId: "roulement-source-params",
    sourceOutputRole: "roulement_params",
    targetBlockId: "roulement-logic-election",
    targetInputRole: "protected_inputs",
  },
  {
    bindingLabel: "Résultats de l'élection vers le sommaire",
    reason:
      "Le sommaire lit les résultats de l'élection (gain brut, coût des actions) pour calculer les montants consolidés.",
    relationshipType: "provides_data_to",
    sourceBlockId: "roulement-logic-election",
    sourceOutputRole: "calculated_results",
    targetBlockId: "roulement-logic-sommaire",
    targetInputRole: "named_values",
  },
  {
    bindingLabel: "Taux de change pour la conversion CAD",
    reason:
      "Le sommaire utilise le taux de la Banque du Canada pour convertir la JVM et le gain en dollars canadiens.",
    relationshipType: "provides_data_to",
    sourceBlockId: "roulement-source-fx",
    sourceOutputRole: "exchange_rate",
    targetBlockId: "roulement-logic-sommaire",
    targetInputRole: "named_values",
  },

  // Logic → Field blocks
  {
    bindingLabel: "PBR par catégorie de bien",
    reason:
      "Le champ PBR affiche la répartition du prix de base rajusté par type de bien.",
    relationshipType: "provides_data_to",
    sourceBlockId: "roulement-logic-rollup",
    sourceOutputRole: "rollup_totals",
    targetBlockId: "roulement-field-pbr",
    targetInputRole: "computed_values",
  },
  {
    bindingLabel: "Résultats du calcul de l'élection",
    reason:
      "Le champ Élection 85 affiche les bornes, le montant élu, le gain imposable et le coût des actions.",
    relationshipType: "provides_data_to",
    sourceBlockId: "roulement-logic-election",
    sourceOutputRole: "calculated_results",
    targetBlockId: "roulement-field-election",
    targetInputRole: "computed_values",
  },
  {
    bindingLabel: "Sommaire du roulement",
    reason:
      "Le champ Sommaire affiche le gain différé, l'impôt estimé reporté, JVM et gain en CAD.",
    relationshipType: "provides_data_to",
    sourceBlockId: "roulement-logic-sommaire",
    sourceOutputRole: "calculated_results",
    targetBlockId: "roulement-field-sommaire",
    targetInputRole: "computed_values",
  },

  // Logic → Outputs
  {
    bindingLabel: "Biens classifiés — preuve T2057",
    reason:
      "Les données T2057 incluent chaque bien classifié avec sa catégorie fiscale.",
    relationshipType: "included_in_output_preview",
    sourceBlockId: "roulement-logic-classification",
    sourceOutputRole: "mapped_rows",
    targetBlockId: "roulement-output-t2057",
    targetInputRole: "mapped_rows",
  },
  {
    bindingLabel: "Résumé de l'agrégation PBR",
    reason:
      "Les données T2057 incluent le PBR total par catégorie pour valider les montants élus.",
    relationshipType: "included_in_output_preview",
    sourceBlockId: "roulement-logic-rollup",
    sourceOutputRole: "rollup_summary",
    targetBlockId: "roulement-output-t2057",
    targetInputRole: "review_findings",
  },
  {
    bindingLabel: "Résultats de l'élection art. 85",
    reason:
      "Les données T2057 incluent les résultats calculés du roulement pour révision et dépôt.",
    relationshipType: "included_in_output_preview",
    sourceBlockId: "roulement-logic-sommaire",
    sourceOutputRole: "calculation_summary",
    targetBlockId: "roulement-output-t2057",
    targetInputRole: "review_findings",
  },
  {
    bindingLabel: "Biens classifiés — remise JSON",
    reason: "La remise JSON inclut les biens classifiés avec leur trace source.",
    relationshipType: "included_in_handoff",
    sourceBlockId: "roulement-logic-classification",
    sourceOutputRole: "mapped_rows",
    targetBlockId: "roulement-output-json",
    targetInputRole: "mapped_rows",
  },
  {
    bindingLabel: "Sommaire du roulement — remise JSON",
    reason:
      "La remise JSON inclut le sommaire consolidé : gain différé, impôt estimé, JVM CAD.",
    relationshipType: "included_in_handoff",
    sourceBlockId: "roulement-logic-sommaire",
    sourceOutputRole: "calculation_summary",
    targetBlockId: "roulement-output-json",
    targetInputRole: "review_findings",
  },
];
