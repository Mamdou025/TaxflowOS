/** Deterministic workpapers. Applicability, rates and tax adjustments are supplied
 * by the preparer; these contracts never infer a filing obligation or file a return. */
export type WorkpaperRow = Record<string, unknown>;
export type WorkpaperResult = {
  rows: WorkpaperRow[];
  figures: Record<string, number>;
  findings: string[];
};
export type WorkpaperSpec = {
  id: string;
  name: string;
  purpose: string;
  fields: string[];
  sample: WorkpaperRow[];
  execute: (rows: WorkpaperRow[]) => WorkpaperResult;
};
const text = (r: WorkpaperRow, key: string) => {
  if (typeof r[key] !== 'string' || !(r[key] as string).trim())
    throw new Error(`${key}: a non-empty text value is required.`);
  return (r[key] as string).trim();
};
const number = (r: WorkpaperRow, key: string, min = -Infinity, max = Infinity) => {
  const raw = r[key];
  const n =
    typeof raw === 'number' ? raw : typeof raw === 'string' && raw.trim() ? Number(raw) : NaN;
  if (!Number.isFinite(n) || n < min || n > max)
    throw new Error(`${key}: supply a number between ${min} and ${max}.`);
  return n;
};
const bool = (r: WorkpaperRow, key: string) => {
  if (r[key] === true || r[key] === 'true') return true;
  if (r[key] === false || r[key] === 'false') return false;
  throw new Error(`${key}: explicitly supply true or false.`);
};
const date = (r: WorkpaperRow, key: string) => {
  const s = text(r, key);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(s) ||
    !Number.isFinite(Date.parse(s)) ||
    new Date(s).toISOString().slice(0, 10) !== s
  )
    throw new Error(`${key}: use a valid YYYY-MM-DD date.`);
  return s;
};
const checked = (rows: WorkpaperRow[], fn: (r: WorkpaperRow) => WorkpaperRow): WorkpaperRow[] =>
  rows.map((r, i) => {
    try {
      return { rowId: String(r.rowId ?? `row-${i + 1}`), ...fn(r) };
    } catch (error) {
      throw new Error(`Record ${i + 1}: ${(error as Error).message}`);
    }
  });
const unique = (rows: WorkpaperRow[], keys: string[]) => {
  const seen = new Set<string>();
  for (const r of rows) {
    const k = JSON.stringify(keys.map((key) => r[key]));
    if (seen.has(k)) throw new Error(`Duplicate ${keys.join('/')} record: ${k}.`);
    seen.add(k);
  }
};
const sum = (rows: WorkpaperRow[], key: string) => rows.reduce((n, r) => n + Number(r[key]), 0);
const result = (
  rows: WorkpaperRow[],
  figures: Record<string, number>,
  findings: string[] = [],
): WorkpaperResult => ({
  rows: rows.map((row, i) => ({ ...row, rowId: `workpaper-${i + 1}` })),
  figures: {
    RECORDS: rows.length,
    ...figures,
    REVIEW_FINDINGS: findings.length,
  },
  findings,
});
const scoped = (r: WorkpaperRow) => {
  const year = number(r, 'year', 1900, 2200);
  if (!Number.isInteger(year)) throw new Error('year must be an integer.');
  return { entity: text(r, 'entity'), year, evidence: text(r, 'evidence') };
};

export const WORKPAPER_SPECS: WorkpaperSpec[] = [
  {
    id: 'scope-service',
    name: 'Scope Service',
    purpose:
      'Validate an explicit client, entity, jurisdiction and year scope from supplied records.',
    fields: ['client', 'entity', 'jurisdiction', 'year', 'included', 'evidence'],
    sample: [
      {
        client: 'Example client',
        entity: 'Example Co',
        jurisdiction: 'CA',
        year: 2025,
        included: true,
        evidence: 'engagement-2025',
      },
    ],
    execute: (input) => {
      const rows = checked(input, (r) => ({
        ...scoped(r),
        client: text(r, 'client'),
        jurisdiction: text(r, 'jurisdiction'),
        included: bool(r, 'included'),
      }));
      unique(rows, ['client', 'entity', 'year']);
      return result(rows, {
        ENTITIES_IN_SCOPE: rows.filter((r) => r.included).length,
      });
    },
  },
  {
    id: 'tax-position-summary',
    name: 'Tax Position Summary Workpaper',
    purpose: 'Assemble supplied tax positions, assumptions and evidence into a review register.',
    fields: ['entity', 'year', 'position', 'assumption', 'confirmed', 'evidence'],
    sample: [
      {
        entity: 'Example Co',
        year: 2025,
        position: 'Transfer pricing method',
        assumption: 'Prior method remains appropriate',
        confirmed: false,
        evidence: 'memo-12',
      },
    ],
    execute: (input) => {
      const rows = checked(input, (r) => ({
        ...scoped(r),
        position: text(r, 'position'),
        assumption: text(r, 'assumption'),
        confirmed: bool(r, 'confirmed'),
      }));
      return result(
        rows,
        { CONFIRMED: rows.filter((r) => r.confirmed).length },
        rows
          .filter((r) => !r.confirmed)
          .map((r) => `${r.entity}: confirm ${r.position} against ${r.evidence}.`),
      );
    },
  },
  {
    id: 'data-readiness',
    name: 'Data Readiness Service',
    purpose: 'Check a supplied required-document checklist and produce missing-item requests.',
    fields: ['entity', 'year', 'document', 'required', 'received', 'reviewed', 'evidence'],
    sample: [
      {
        entity: 'Example Co',
        year: 2025,
        document: 'Trial balance',
        required: true,
        received: true,
        reviewed: true,
        evidence: 'tb-2025',
      },
    ],
    execute: (input) => {
      const rows = checked(input, (r) => ({
        ...scoped(r),
        document: text(r, 'document'),
        required: bool(r, 'required'),
        received: bool(r, 'received'),
        reviewed: bool(r, 'reviewed'),
      }));
      unique(rows, ['entity', 'year', 'document']);
      const required = rows.filter((r) => r.required);
      const ready = required.filter((r) => r.received && r.reviewed);
      return result(
        rows,
        {
          REQUIRED: required.length,
          READY: ready.length,
          READINESS_PERCENT: required.length ? (ready.length / required.length) * 100 : 100,
        },
        required
          .filter((r) => !r.received || !r.reviewed)
          .map((r) => `${r.entity}: ${r.received ? 'review' : 'request'} ${r.document}.`),
      );
    },
  },
  {
    id: 'platform-sequence',
    name: 'Execution Readiness & Review Checklist',
    purpose:
      'Validate the supplied scope, evidence, calculation and sign-off checkpoints before handoff.',
    fields: [
      'entity',
      'year',
      'scopeConfirmed',
      'dataReady',
      'calculationVerified',
      'reviewApproved',
      'evidence',
    ],
    sample: [
      {
        entity: 'Example Co',
        year: 2025,
        scopeConfirmed: true,
        dataReady: true,
        calculationVerified: true,
        reviewApproved: false,
        evidence: 'run-2025-1',
      },
    ],
    execute: (input) => {
      const gates = ['scopeConfirmed', 'dataReady', 'calculationVerified', 'reviewApproved'];
      const rows = checked(input, (r) => ({
        ...scoped(r),
        ...Object.fromEntries(gates.map((key) => [key, bool(r, key)])),
      }));
      unique(rows, ['entity', 'year']);
      const findings = rows.flatMap((r) =>
        gates.filter((key) => !r[key]).map((key) => `${r.entity}: ${key} is outstanding.`),
      );
      return result(
        rows,
        {
          READY_FOR_HANDOFF: rows.filter((r) => gates.every((key) => r[key])).length,
        },
        findings,
      );
    },
  },
  {
    id: 'ownership-graph',
    name: 'Ownership Graph Workpaper',
    purpose:
      'Validate direct ownership and calculate indirect economic interests in an acyclic supplied graph. Legal control is not inferred.',
    fields: ['owner', 'entity', 'ownershipPercent', 'evidence'],
    sample: [
      {
        owner: 'Parent',
        entity: 'Holdco',
        ownershipPercent: 80,
        evidence: 'register-1',
      },
      {
        owner: 'Holdco',
        entity: 'Opco',
        ownershipPercent: 50,
        evidence: 'register-2',
      },
    ],
    execute: (input) => {
      if (input.length > 200)
        throw new Error('Ownership graphs are limited to 200 direct links per workpaper.');
      const direct = checked(input, (r) => ({
        owner: text(r, 'owner'),
        entity: text(r, 'entity'),
        ownershipPercent: number(r, 'ownershipPercent', 0, 100),
        evidence: text(r, 'evidence'),
      }));
      unique(direct, ['owner', 'entity']);
      for (const entity of new Set(direct.map((r) => r.entity)))
        if (
          sum(
            direct.filter((r) => r.entity === entity),
            'ownershipPercent',
          ) >
          100 + 1e-9
        )
          throw new Error(`${entity}: direct ownership exceeds 100%.`);
      const rows: WorkpaperRow[] = [];
      let traversals = 0;
      for (const owner of new Set(direct.map((r) => String(r.owner)))) {
        const totals = new Map<string, number>();
        const visit = (node: string, share: number, path: string[]) => {
          if (++traversals > 10000)
            throw new Error(
              'Ownership graph has too many paths; split the graph into smaller scopes.',
            );
          if (path.includes(node))
            throw new Error(
              `Circular ownership requires specialist handling: ${[...path, node].join(' → ')}.`,
            );
          for (const edge of direct.filter((r) => r.owner === node)) {
            const next = String(edge.entity),
              weight = (share * Number(edge.ownershipPercent)) / 100;
            totals.set(next, (totals.get(next) ?? 0) + weight);
            visit(next, weight, [...path, node]);
          }
        };
        visit(owner, 100, []);
        for (const [entity, ownershipPercent] of totals)
          rows.push({
            owner,
            entity,
            ownershipPercent,
            evidence: direct.map((r) => `${r.owner} → ${r.entity}: ${r.evidence}`).join('; '),
          });
      }
      return result(rows, {
        DIRECT_LINKS: direct.length,
        ECONOMIC_INTERESTS: rows.length,
      });
    },
  },
  {
    id: 'attribute-ledgers',
    name: 'Tax Attribute Continuity Workpaper',
    purpose: 'Reconcile supplied opening balances, additions, usage and adjustments by attribute.',
    fields: [
      'entity',
      'year',
      'attribute',
      'opening',
      'additions',
      'used',
      'adjustments',
      'reportedClosing',
      'evidence',
    ],
    sample: [
      {
        entity: 'Example Co',
        year: 2025,
        attribute: 'Non-capital loss',
        opening: 1000,
        additions: 200,
        used: 300,
        adjustments: 0,
        reportedClosing: 900,
        evidence: 'loss-schedule',
      },
    ],
    execute: (input) => {
      const rows = checked(input, (r) => {
        const opening = number(r, 'opening', 0),
          additions = number(r, 'additions', 0),
          used = number(r, 'used', 0),
          adjustments = number(r, 'adjustments'),
          reportedClosing = number(r, 'reportedClosing');
        const closing = opening + additions - used + adjustments;
        return {
          ...scoped(r),
          attribute: text(r, 'attribute'),
          opening,
          additions,
          used,
          adjustments,
          closing,
          reportedClosing,
          difference: closing - reportedClosing,
        };
      });
      unique(rows, ['entity', 'year', 'attribute']);
      return result(
        rows,
        {
          RECONCILED_ATTRIBUTES: rows.filter((row) => Math.abs(Number(row.difference)) <= 0.005)
            .length,
        },
        rows
          .filter((r) => Math.abs(Number(r.difference)) > 0.005 || Number(r.closing) < 0)
          .map(
            (r) =>
              `${r.entity}/${r.attribute}: reconcile closing balance ${r.closing} with reported ${r.reportedClosing}.`,
          ),
      );
    },
  },
  {
    id: 'portfolio-ops',
    name: 'Portfolio Calendar & Requests Workpaper',
    purpose:
      'Identify overdue work and outstanding requests using explicitly supplied due dates and an as-of date.',
    fields: ['entity', 'year', 'task', 'dueDate', 'asOfDate', 'completed', 'owner', 'evidence'],
    sample: [
      {
        entity: 'Example Co',
        year: 2025,
        task: 'Review workpaper',
        dueDate: '2026-06-30',
        asOfDate: '2026-07-01',
        completed: false,
        owner: 'Manager',
        evidence: 'engagement-plan',
      },
    ],
    execute: (input) => {
      const rows = checked(input, (r) => {
        const dueDate = date(r, 'dueDate'),
          asOfDate = date(r, 'asOfDate'),
          completed = bool(r, 'completed');
        return {
          ...scoped(r),
          task: text(r, 'task'),
          owner: text(r, 'owner'),
          dueDate,
          asOfDate,
          completed,
          daysOverdue: completed
            ? 0
            : Math.max(0, (Date.parse(asOfDate) - Date.parse(dueDate)) / 86400000),
        };
      });
      return result(
        rows,
        {
          OPEN_TASKS: rows.filter((r) => !r.completed).length,
          OVERDUE_TASKS: rows.filter((r) => Number(r.daysOverdue) > 0).length,
        },
        rows
          .filter((r) => Number(r.daysOverdue) > 0)
          .map((r) => `${r.owner}: ${r.entity}/${r.task} is ${r.daysOverdue} days overdue.`),
      );
    },
  },
  {
    id: 't1134',
    name: 'T1134 Affiliate Reporting Workpaper',
    purpose:
      'Prepare an affiliate register and financial-information checklist from reviewed applicability decisions. Does not prepare a complete T1134 return.',
    fields: [
      'entity',
      'year',
      'affiliate',
      'country',
      'currency',
      'reportRequired',
      'financialsReceived',
      'supplementPrepared',
      'evidence',
    ],
    sample: [
      {
        entity: 'Example Co',
        year: 2025,
        affiliate: 'Example US',
        country: 'US',
        currency: 'USD',
        reportRequired: true,
        financialsReceived: true,
        supplementPrepared: false,
        evidence: 'affiliate-register',
      },
    ],
    execute: (input) => {
      const rows = checked(input, (r) => ({
        ...scoped(r),
        affiliate: text(r, 'affiliate'),
        country: text(r, 'country'),
        currency: text(r, 'currency'),
        reportRequired: bool(r, 'reportRequired'),
        financialsReceived: bool(r, 'financialsReceived'),
        supplementPrepared: bool(r, 'supplementPrepared'),
      }));
      unique(rows, ['entity', 'year', 'affiliate']);
      const required = rows.filter((r) => r.reportRequired);
      return result(
        rows,
        { AFFILIATES: rows.length, REQUIRED_SUPPLEMENTS: required.length },
        required.flatMap((r) =>
          [
            !r.financialsReceived ? `${r.affiliate}: obtain financial information.` : '',
            !r.supplementPrepared ? `${r.affiliate}: prepare and review the supplement.` : '',
          ].filter(Boolean),
        ),
      );
    },
  },
  {
    id: 'surplus',
    name: 'Foreign Affiliate Surplus Continuity Workpaper',
    purpose:
      'Reconcile supplied surplus-pool movements. Pool classification and dividend ordering must already be reviewed.',
    fields: [
      'entity',
      'year',
      'affiliate',
      'pool',
      'currency',
      'opening',
      'earnings',
      'tax',
      'distributions',
      'adjustments',
      'reportedClosing',
      'evidence',
    ],
    sample: [
      {
        entity: 'Example Co',
        year: 2025,
        affiliate: 'Example US',
        pool: 'exempt',
        currency: 'USD',
        opening: 1000,
        earnings: 400,
        tax: 100,
        distributions: 200,
        adjustments: 0,
        reportedClosing: 1100,
        evidence: 'surplus-ledger',
      },
    ],
    execute: (input) => {
      const rows = checked(input, (r) => {
        const opening = number(r, 'opening'),
          earnings = number(r, 'earnings'),
          tax = number(r, 'tax', 0),
          distributions = number(r, 'distributions', 0),
          adjustments = number(r, 'adjustments'),
          reportedClosing = number(r, 'reportedClosing');
        const closing = opening + earnings - tax - distributions + adjustments;
        return {
          ...scoped(r),
          affiliate: text(r, 'affiliate'),
          pool: text(r, 'pool'),
          currency: text(r, 'currency'),
          opening,
          earnings,
          tax,
          distributions,
          adjustments,
          closing,
          reportedClosing,
          difference: closing - reportedClosing,
        };
      });
      unique(rows, ['entity', 'year', 'affiliate', 'pool', 'currency']);
      return result(
        rows,
        {
          POOLS_RECONCILED: rows.filter((r) => Math.abs(Number(r.difference)) <= 0.005).length,
        },
        rows
          .filter((r) => Math.abs(Number(r.difference)) > 0.005)
          .map(
            (r) => `${r.affiliate}/${r.pool}: closing difference ${r.difference} ${r.currency}.`,
          ),
      );
    },
  },
  {
    id: 't106',
    name: 'T106 Transaction Workpaper',
    purpose:
      'Summarize explicitly identified reportable transactions by entity, counterparty, category and currency without netting receipts against payments.',
    fields: [
      'entity',
      'year',
      'counterparty',
      'country',
      'category',
      'direction',
      'currency',
      'amount',
      'reportable',
      'evidence',
    ],
    sample: [
      {
        entity: 'Example Co',
        year: 2025,
        counterparty: 'Related US',
        country: 'US',
        category: 'Services',
        direction: 'payment',
        currency: 'USD',
        amount: 500,
        reportable: true,
        evidence: 'invoice-1',
      },
    ],
    execute: (input) => {
      const source = checked(input, (r) => {
        const direction = text(r, 'direction');
        if (!['payment', 'receipt'].includes(direction))
          throw new Error('direction must be payment or receipt.');
        return {
          ...scoped(r),
          counterparty: text(r, 'counterparty'),
          country: text(r, 'country'),
          category: text(r, 'category'),
          direction,
          currency: text(r, 'currency'),
          amount: number(r, 'amount', 0),
          reportable: bool(r, 'reportable'),
        };
      });
      const groups = new Map<string, WorkpaperRow>();
      for (const r of source.filter((r) => r.reportable)) {
        const key = JSON.stringify([
          r.entity,
          r.year,
          r.counterparty,
          r.country,
          r.category,
          r.direction,
          r.currency,
        ]);
        const prior = groups.get(key);
        if (prior) {
          prior.amount = Number(prior.amount) + Number(r.amount);
          prior.evidence = `${prior.evidence}; ${r.evidence}`;
        } else groups.set(key, { ...r });
      }
      return result([...groups.values()], {
        TRANSACTIONS: source.length,
        REPORTABLE_TRANSACTIONS: source.filter((r) => r.reportable).length,
        EXCLUDED_TRANSACTIONS: source.filter((r) => !r.reportable).length,
      });
    },
  },
  {
    id: 'eifel',
    name: 'EIFEL Fixed-Ratio Scenario Workpaper',
    purpose:
      'Calculate a fixed-ratio scenario from reviewed ATI, interest, income and capacity inputs. Exemptions, group-ratio elections and statutory adjustments are outside this scenario.',
    fields: [
      'entity',
      'year',
      'adjustedTaxableIncome',
      'interestExpense',
      'interestRevenue',
      'ratio',
      'additionalCapacity',
      'evidence',
    ],
    sample: [
      {
        entity: 'Example Co',
        year: 2025,
        adjustedTaxableIncome: 1000,
        interestExpense: 500,
        interestRevenue: 50,
        ratio: 0.3,
        additionalCapacity: 20,
        evidence: 'reviewed-eifel-inputs',
      },
    ],
    execute: (input) => {
      const rows = checked(input, (r) => {
        const ati = number(r, 'adjustedTaxableIncome'),
          expense = number(r, 'interestExpense', 0),
          revenue = number(r, 'interestRevenue', 0),
          ratio = number(r, 'ratio', 0, 1),
          capacity = number(r, 'additionalCapacity', 0);
        const limit = Math.max(0, ati) * ratio + revenue + capacity;
        const denied = Math.max(0, expense - limit);
        return {
          ...scoped(r),
          adjustedTaxableIncome: ati,
          interestExpense: expense,
          interestRevenue: revenue,
          ratio,
          additionalCapacity: capacity,
          deductionCapacity: limit,
          deniedInterest: denied,
          deductibleInterest: expense - denied,
        };
      });
      unique(rows, ['entity', 'year']);
      return result(rows, { SCENARIOS: rows.length }, [
        'Review the supplied ATI, ratio, capacity, applicability and elections before using this scenario in a return.',
      ]);
    },
  },
  {
    id: 't2-suite',
    name: 'T2 Taxable Income Bridge Workpaper',
    purpose:
      'Bridge reviewed accounting income to taxable income using explicit additions, deductions and loss usage. Does not prepare a complete T2 return.',
    fields: [
      'entity',
      'year',
      'accountingIncome',
      'additions',
      'deductions',
      'lossesUsed',
      'reportedTaxableIncome',
      'evidence',
    ],
    sample: [
      {
        entity: 'Example Co',
        year: 2025,
        accountingIncome: 1000,
        additions: 200,
        deductions: 100,
        lossesUsed: 300,
        reportedTaxableIncome: 800,
        evidence: 'schedule-1-inputs',
      },
    ],
    execute: (input) => {
      const rows = checked(input, (r) => {
        const accountingIncome = number(r, 'accountingIncome'),
          additions = number(r, 'additions', 0),
          deductions = number(r, 'deductions', 0),
          lossesUsed = number(r, 'lossesUsed', 0),
          reportedTaxableIncome = number(r, 'reportedTaxableIncome', 0);
        const incomeBeforeLosses = accountingIncome + additions - deductions;
        if (lossesUsed > Math.max(0, incomeBeforeLosses))
          throw new Error('lossesUsed exceeds positive income before losses.');
        const taxableIncome = Math.max(0, incomeBeforeLosses - lossesUsed);
        return {
          ...scoped(r),
          accountingIncome,
          additions,
          deductions,
          lossesUsed,
          incomeBeforeLosses,
          taxableIncome,
          reportedTaxableIncome,
          difference: taxableIncome - reportedTaxableIncome,
        };
      });
      unique(rows, ['entity', 'year']);
      return result(
        rows,
        {
          RECONCILED_ENTITIES: rows.filter((r) => Math.abs(Number(r.difference)) <= 0.005).length,
        },
        rows
          .filter((r) => Math.abs(Number(r.difference)) > 0.005)
          .map((r) => `${r.entity}: taxable-income difference ${r.difference}.`),
      );
    },
  },
  {
    id: 'tax-provision',
    name: 'Corporate Tax Provision Workpaper',
    purpose:
      'Calculate current and deferred tax from reviewed taxable income, rates and temporary differences.',
    fields: [
      'entity',
      'year',
      'taxableIncome',
      'currentRate',
      'credits',
      'openingDeferredTax',
      'closingTemporaryDifference',
      'deferredRate',
      'evidence',
    ],
    sample: [
      {
        entity: 'Example Co',
        year: 2025,
        taxableIncome: 1000,
        currentRate: 0.265,
        credits: 20,
        openingDeferredTax: 10,
        closingTemporaryDifference: 100,
        deferredRate: 0.265,
        evidence: 'provision-inputs',
      },
    ],
    execute: (input) => {
      const rows = checked(input, (r) => {
        const taxableIncome = number(r, 'taxableIncome', 0),
          currentRate = number(r, 'currentRate', 0, 1),
          credits = number(r, 'credits', 0),
          openingDeferredTax = number(r, 'openingDeferredTax'),
          closingTemporaryDifference = number(r, 'closingTemporaryDifference'),
          deferredRate = number(r, 'deferredRate', 0, 1);
        const currentTax = Math.max(0, taxableIncome * currentRate - credits),
          closingDeferredTax = closingTemporaryDifference * deferredRate,
          deferredExpense = closingDeferredTax - openingDeferredTax;
        return {
          ...scoped(r),
          taxableIncome,
          currentRate,
          credits,
          currentTax,
          openingDeferredTax,
          closingTemporaryDifference,
          deferredRate,
          closingDeferredTax,
          deferredExpense,
          totalTaxExpense: currentTax + deferredExpense,
        };
      });
      unique(rows, ['entity', 'year']);
      return result(rows, { ENTITIES: rows.length }, [
        'Review enacted rates, credit eligibility, recognition of deferred tax assets and allocation between profit, OCI and equity.',
      ]);
    },
  },
  {
    id: 'part-xiii',
    name: 'Part XIII Withholding Workpaper',
    purpose:
      'Apply an explicitly reviewed withholding rate to each payment and reconcile recorded remittances. Treaty entitlement is supplied, never inferred.',
    fields: [
      'entity',
      'year',
      'payee',
      'paymentType',
      'currency',
      'grossPayment',
      'reviewedRate',
      'remitted',
      'rateEvidence',
      'evidence',
    ],
    sample: [
      {
        entity: 'Example Co',
        year: 2025,
        payee: 'Nonresident A',
        paymentType: 'Dividend',
        currency: 'CAD',
        grossPayment: 1000,
        reviewedRate: 0.15,
        remitted: 100,
        rateEvidence: 'treaty-review-1',
        evidence: 'payment-1',
      },
    ],
    execute: (input) => {
      const rows = checked(input, (r) => {
        const grossPayment = number(r, 'grossPayment', 0),
          reviewedRate = number(r, 'reviewedRate', 0, 1),
          remitted = number(r, 'remitted', 0),
          withholding = grossPayment * reviewedRate;
        return {
          ...scoped(r),
          payee: text(r, 'payee'),
          paymentType: text(r, 'paymentType'),
          currency: text(r, 'currency'),
          grossPayment,
          reviewedRate,
          rateEvidence: text(r, 'rateEvidence'),
          withholding,
          remitted,
          balance: withholding - remitted,
        };
      });
      return result(
        rows,
        { PAYMENTS: rows.length },
        rows
          .filter((r) => Math.abs(Number(r.balance)) > 0.005)
          .map((r) => `${r.payee}: reconcile withholding balance ${r.balance} ${r.currency}.`),
      );
    },
  },
];

export function executeWorkpaper(id: string, rows: WorkpaperRow[]): WorkpaperResult {
  const spec = WORKPAPER_SPECS.find((spec) => spec.id === id);
  if (!spec) throw new Error(`Unsupported workpaper: ${id}.`);
  if (!Array.isArray(rows) || !rows.length)
    throw new Error(
      'Supply at least one workpaper record. Sample data is never substituted for empty input.',
    );
  if (rows.length > 10000) throw new Error('Workpaper input exceeds 10,000 records.');
  const output = spec.execute(rows);
  if (
    Object.values(output.figures).some((value) => !Number.isFinite(value)) ||
    output.rows.some((row) =>
      Object.values(row).some((value) => typeof value === 'number' && !Number.isFinite(value)),
    )
  )
    throw new Error('Calculation produced a non-finite result.');
  return output;
}
