export type RulebookKeywordRule = {
  id: string;
  name: string;
  savedAt: string;
  categoryId: string;
  categoryLabel: string;
  confidence: number;
  priority: number;
  scope: string;
  description: string;
  exactKeywords: string[];
  containsKeywords: string[];
  excludeKeywords: string[];
  ruleVersion: string;
};

const STORAGE_KEY = "workflow-keyword-rulebook-v1";

function parseStorage(): RulebookKeywordRule[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RulebookKeywordRule[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(entries: RulebookKeywordRule[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string")
    return value
      .split(/[,;\n|]/)
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}

export function getRulebookEntries(): RulebookKeywordRule[] {
  return parseStorage();
}

export function saveToRulebook(
  rule: Record<string, unknown>
): RulebookKeywordRule {
  const entries = parseStorage();
  const entry: RulebookKeywordRule = {
    id: `rb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: String(rule.categoryLabel || rule.categoryId || "Unnamed Rule"),
    savedAt: new Date().toISOString(),
    categoryId: String(rule.categoryId || ""),
    categoryLabel: String(rule.categoryLabel || ""),
    confidence: Number(rule.confidence ?? 0.9),
    priority: Number(rule.priority ?? 1),
    scope: String(rule.scope || "company"),
    description: String(rule.description || ""),
    exactKeywords: toStringArray(rule.exactKeywords),
    containsKeywords: toStringArray(rule.containsKeywords),
    excludeKeywords: toStringArray(rule.excludeKeywords),
    ruleVersion: String(rule.ruleVersion || "v1"),
  };
  writeStorage([...entries, entry]);
  return entry;
}

export function removeFromRulebook(id: string): void {
  writeStorage(parseStorage().filter((e) => e.id !== id));
}
