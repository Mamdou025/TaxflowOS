// ─────────────────────────────────────────────────────────────────────────────
// Deterministic command parser (EN + FR).
//
// Turns a raw user turn into primitive linguistic SIGNALS — negation, question,
// hypothetical, explicit action verb, pronoun-run, read/open, field-edit — that
// classify.ts combines into an AssistantRoute. The guiding rule (principle #2):
// detecting an ACTION is about verbs and sentence shape, never about a workflow
// name. Target resolution lives in workflow-targets.ts.
//
// Precedence enforced by the classifier: negation > information-question >
// hypothetical > explicit-action > read/open > mention-only.
// ─────────────────────────────────────────────────────────────────────────────

export type ActionGroup =
  | 'start'
  | 'continue'
  | 'pause'
  | 'cancel'
  | 'calculate'
  | 'approve'
  | 'reject'
  | 'finalize'
  | 'open'
  | 'edit';

export type ExplicitAction = { verb: string; group: ActionGroup };

// Reported-speech frames — content after these is quoted DATA, not a user command.
const REPORTING_FRAME =
  /\b(?:the\s+)?(?:document|documents|memo|email|e-mail|attachment|note|file|pdf|message|letter|report|it|they|client|user)\s+(?:say|says|said|reads?|read|states?|stated|mention[s]?|mentioned|noted?|notes|writes?|wrote|asks?|asked|instructs?|instructed)\b/i;

/**
 * Remove quoted spans and reported-speech tails so an imperative that only appears
 * INSIDE a quote (e.g. a prompt-injection copied from a document) is not read as a
 * command. Used for ACTION detection only; target/question/negation see the full text.
 */
export function stripQuotedAndReported(text: string): string {
  let s = text;
  s = s.replace(/"""[\s\S]*?"""/g, ' ');
  s = s.replace(/"[^"]*"/g, ' ');
  s = s.replace(/[“][^”]*[”]/g, ' '); // “ … ”
  s = s.replace(/«[^»]*»/g, ' ');
  const m = s.match(REPORTING_FRAME);
  if (m && m.index !== undefined) s = s.slice(0, m.index);
  return s.trim();
}

/**
 * Neutralize "run"/"runs" used as a NOUN ("the FAPI run", "this run", "the current
 * run") so it is not mistaken for the imperative verb. Only touches `run` preceded by
 * a determiner / possessive / workflow name — an imperative "run …" is left intact.
 */
export function neutralizeNounRun(text: string): string {
  return text.replace(
    /\b(the|this|that|a|an|my|our|its|current|last|previous|latest|fapi|roulement|rollover|expense|campaign)\s+runs?\b/gi,
    '$1 _run_'
  );
}

/** `/run fapi` → { command: 'run', args: 'fapi' }. Null when not a slash command. */
export function parseSlashCommand(text: string): { command: string; args: string } | null {
  const m = text.trim().match(/^\/([a-zA-Z][\w-]*)\s*([\s\S]*)$/);
  if (!m) return null;
  return { command: m[1].toLowerCase(), args: m[2].trim() };
}

// ── Phrase banks ───────────────────────────────────────────────────────────────
// Each verb group lists whole-word triggers. Order within a group is irrelevant;
// the classifier resolves cross-group precedence.

const VERB_GROUPS: Record<ActionGroup, string[]> = {
  start: [
    'start', 'run', 'launch', 'execute', 'begin', 'kick off', 'kickoff', 'fire up', 'spin up', 'initiate',
    'démarre', 'démarrer', 'démarrez', 'lance', 'lancer', 'lancez', 'exécute', 'exécuter', 'exécutez',
    'commence', 'commencer', 'lancons', 'lançons',
  ],
  continue: [
    'continue', 'resume', 'proceed', 'keep going', 'carry on', 'pick up', 'go on',
    'continuer', 'continue', 'reprends', 'reprendre', 'reprenez', 'poursuis', 'poursuivre',
  ],
  pause: ['pause', 'hold', 'suspend', 'freeze', 'suspends', 'suspendre', 'mets en pause', 'mettre en pause'],
  cancel: [
    'cancel', 'abort', 'kill', 'discard', 'scrap', 'throw away', 'delete the run',
    'annule', 'annuler', 'abandonne', 'abandonner', 'supprime le', 'arrête le', 'arrêter le',
  ],
  calculate: [
    'calculate', 'compute', 'recalculate', 'recompute', 'tally', 'tabulate', 'work out',
    'calcule', 'calculer', 'calculez', 'recalcule', 'recalculer', 'chiffre', 'chiffrer',
  ],
  approve: [
    'approve', 'accept', 'sign off', 'sign-off', 'confirm', 'authorize', 'authorise',
    'approuve', 'approuver', 'accepte', 'accepter', 'valide', 'valider', 'confirme', 'confirmer', 'autorise',
  ],
  reject: [
    'reject', 'decline', 'deny', 'refuse', 'turn down',
    'rejette', 'rejeter', 'refuse', 'refuser', 'décline', 'décliner',
  ],
  finalize: [
    'finalize', 'finalise', 'lock', 'apply', 'publish', 'submit', 'commit', 'seal', 'freeze the worksheet',
    'finalise', 'finaliser', 'verrouille', 'verrouiller', 'applique', 'appliquer', 'publie', 'publier', 'soumets', 'soumettre',
  ],
  open: [
    'open', 'show', 'display', 'view', 'pull up', 'bring up', 'reopen', 're-open', 'take me to', 'go to',
    'ouvre', 'ouvrir', 'montre', 'montrer', 'affiche', 'afficher', 'voir', 'accède', 'accéder',
  ],
  edit: [
    'change', 'set', 'update', 'edit', 'adjust', 'modify', 'override', 'use',
    'change', 'modifie', 'modifier', 'mets', 'mettre', 'ajuste', 'ajuster', 'remplace', 'remplacer', 'utilise',
  ],
};

const NEGATION_PATTERNS: RegExp[] = [
  /\bonly (want to )?(explain|understand|see|look|know|review|read)\b/i,
  /\bjust (want to )?(explain|understand|see|look|know|review|read)\b/i,
  /\bi (just|only) want to understand\b/i,
  /\bfor now\b.*\b(understand|explain|see|know)\b/i,
  /\b(understand|explain|see|know)\b.*\bfor now\b/i,
  /\bnot yet\b/i,
  /\bnot now\b/i,
  /\bdon'?t (run|start|launch|execute|begin|do)\b/i,
  /\bdo not (run|start|launch|execute|begin|do)\b/i,
  /\bno need to (run|start|launch|execute)\b/i,
  /\bwithout (running|starting|executing|launching)\b/i,
  /\b(instead of|rather than) (running|starting|executing)\b/i,
  /\bhold off\b/i,
  /\bnever mind\b/i,
  // FR
  /\bne (lance|démarre|exécute|fais)\b.*\bpas\b/i,
  /\bn'(exécute|execute)\b.*\bpas\b/i,
  /\bpas encore\b/i,
  /\bpas maintenant\b/i,
  /\bjuste (comprendre|expliquer|voir|savoir)\b/i,
  /\bseulement (comprendre|expliquer|voir)\b/i,
  /\bsans (lancer|démarrer|exécuter)\b/i,
  /\bpas besoin de (lancer|démarrer|exécuter)\b/i,
];

const HYPOTHETICAL_PATTERNS: RegExp[] = [
  /\bwhat if\b/i,
  /\bif the\b.*\bwere\b/i,
  /\bif we (were|had|used)\b/i,
  /\bhow would\b/i,
  /\bwould (it|the|that|this|net|gross)\b/i,
  /\bcould we\b/i,
  /\bmight (have|be|need)\b/i,
  /\bmay have\b/i,
  /\bmaybe\b/i,
  /\bperhaps\b/i,
  /\bsuppose\b/i,
  /\bhypothetical/i,
  /\broughly\b/i,
  /\bapproximate/i,
  /\bballpark\b/i,
  /\bi(?:'m| am) (thinking|considering)\b/i,
  /\bi think\b/i,
  /\bwe (may|might)\b/i,
  // FR
  /\bet si\b/i,
  /\bsi (le|la|les|on|nous)\b.*\b(était|avait|étaient)\b/i,
  /\bpourrait\b/i,
  /\bpeut-être\b/i,
  /\bà peu près\b/i,
  /\benviron\b/i,
  /\bje (pense|considère)\b/i,
  /\bon pourrait\b/i,
  /\bil se peut\b/i,
];

// Information-seeking (explanation) verbs → the turn is a QUESTION, never execute.
const EXPLANATION_PATTERNS: RegExp[] = [
  /\bexplain\b/i,
  /\bdescribe\b/i,
  /\bwalk me through\b/i,
  /\btell me about\b/i,
  /\bwhat (is|are|does|do|'s|s)\b/i,
  /\bwhat inputs?\b/i,
  /\bhow (does|do|is|are|can i|would i|to)\b/i,
  /\bwhy (is|are|does|do|did)\b/i,
  /\bwhich\b/i,
  /\bwhen (does|do|is)\b/i,
  /\bclarify\b/i,
  /\bremind me\b/i,
  /\bwhat'?s wrong\b/i,
  // FR
  /\bexplique/i,
  /\bdécris/i,
  /\bc'est quoi\b/i,
  /\bqu'est-ce (que|qu')\b/i,
  /\bqu'est ce que\b/i,
  /\bcomment (fonctionne|marche|ça|faire|est-ce)\b/i,
  /\bpourquoi\b/i,
  /\bquel(le|s|les)?\b/i,
];

// Note: bare "do"/"does" are intentionally excluded — "Do it." is a command, not a
// question. Genuine "do you / does the …?" questions still resolve via the trailing
// "?" rule and the EXPLANATION patterns ("what does", "how do").
const INTERROGATIVE_START = /^(what|what's|whats|how|why|which|who|when|where|is|are|can i|should i|qu'est|quoi|comment|pourquoi|quel|quelle|quels|quelles|qui|quand|où|est-ce)\b/i;

// "can you / could you / please …" — polite. It's a QUESTION only if paired with an
// explanation verb; paired with an action verb it's a polite command.
const POLITE_PREFIX = /^(can|could|would|will) you\b|^please\b|^could you please\b|^peux-tu\b|^pouvez-vous\b|^pourriez-vous\b|^peux tu\b/i;

const PRONOUN_RUN_PATTERNS: RegExp[] = [
  /^\s*(yes[,!.]?\s*)?(run|do|start|launch|execute|proceed|continue|go)\s+it\b/i,
  /^\s*(yes[,!.]?\s*)?go ahead\b/i,
  /^\s*let'?s (do|run|start|go) (it|ahead)\b/i,
  /^\s*(yes[,!.]?\s*)?proceed\b/i,
  // FR: require the hyphenated object-pronoun form ("lance-le", "démarre-le") so a
  // bare article ("démarre le calcul …") is NOT mistaken for a pronoun-run.
  /^\s*(oui[,!.]?\s*)?(lance|fais|démarre|exécute|continue)-(le|la|ça)\b/i,
  /^\s*vas-y\b/i,
];

function anyMatch(text: string, patterns: RegExp[]): boolean {
  return patterns.some((re) => re.test(text));
}

/** Whole-word (accent-aware) membership test for a verb phrase. */
function containsPhrase(text: string, phrase: string): boolean {
  const p = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(?:^|[^a-zà-ÿ0-9])${p}(?:$|[^a-zà-ÿ0-9])`, 'i');
  return re.test(text);
}

export function detectNegation(text: string): boolean {
  return anyMatch(text, NEGATION_PATTERNS);
}

export function isHypothetical(text: string): boolean {
  return anyMatch(text, HYPOTHETICAL_PATTERNS);
}

/** True when the turn is information-seeking (explanation / interrogative). */
export function isInformationQuestion(text: string): boolean {
  const t = text.trim();
  const explanation = anyMatch(t, EXPLANATION_PATTERNS);
  if (explanation) return true;
  if (POLITE_PREFIX.test(t)) {
    // Polite request: a question only if it's asking to explain/describe, not to act.
    return anyMatch(t, EXPLANATION_PATTERNS);
  }
  if (INTERROGATIVE_START.test(t)) return true;
  // A trailing '?' makes it a question UNLESS it opens with a bare execution verb.
  if (/\?\s*$/.test(t) && !startsWithExecutionVerb(t)) return true;
  return false;
}

function startsWithExecutionVerb(text: string): boolean {
  const t = text.trim().toLowerCase();
  const execGroups: ActionGroup[] = ['start', 'continue', 'pause', 'cancel', 'calculate', 'approve', 'reject', 'finalize'];
  return execGroups.some((g) => VERB_GROUPS[g].some((v) => t.startsWith(v + ' ') || t === v));
}

export function detectPronounRun(text: string): boolean {
  return anyMatch(text, PRONOUN_RUN_PATTERNS);
}

/**
 * Find the strongest explicit action verb in the text. Returns the first group,
 * in execution-priority order, whose verb appears. Read/open and edit are lower
 * priority than the mutating verbs so "open and run" resolves to run.
 */
export function detectExplicitAction(text: string): ExplicitAction | null {
  const t = ` ${text.toLowerCase()} `;
  const order: ActionGroup[] = [
    'cancel', 'pause', 'continue', 'finalize', 'approve', 'reject', 'calculate', 'start', 'edit', 'open',
  ];
  for (const group of order) {
    for (const verb of VERB_GROUPS[group]) {
      if (containsPhrase(t, verb)) return { verb, group };
    }
  }
  return null;
}

/** True when the turn is a polite request wrapper (used to soften explicitness). */
export function isPoliteRequest(text: string): boolean {
  return POLITE_PREFIX.test(text.trim());
}
