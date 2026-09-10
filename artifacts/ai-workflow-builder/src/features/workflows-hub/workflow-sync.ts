import { parseSharedJSON, stringifySharedJSON } from '@/shared/workflow-engine/shared-json';
import type { PersonalWorkflow } from './workflow-library';
type Library = Record<string, PersonalWorkflow>;
const KEY = 'taxflow:workflow-workspace';
const META = 'taxflow:workflow-sync';
let message = 'Checking server save…';
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setTimeout> | undefined;
let active: Promise<void> | undefined;
let read: (() => Library) | undefined;
let apply: ((value: Library) => void) | undefined;
let generation = 0;
let epoch = 0;
let loaded = false;
let conflict = false;
type Meta = { revision: number; dirty: boolean };
function meta(): Meta { try { return JSON.parse(localStorage.getItem(META) ?? 'null') ?? { revision: 0, dirty: true }; } catch { return { revision: 0, dirty: true }; } }
function saveMeta(value: Meta) { try { localStorage.setItem(META, JSON.stringify(value)); } catch { /* Server copy remains authoritative when local quota is full. */ } }
function status(value: string) { message = value; listeners.forEach(listener => listener()); }
export const subscribeWorkflowSync = (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; };
export const workflowSyncStatus = () => message;
export function workspaceRecoveryCode() {
  let key = localStorage.getItem(KEY);
  if (!key) { key = Array.from(crypto.getRandomValues(new Uint8Array(32)), byte => byte.toString(16).padStart(2, '0')).join(''); localStorage.setItem(KEY, key); }
  return key;
}
async function request(method: string, code: string, body?: unknown) {
  const response = await fetch('/api/workflow-library', { method, headers: { 'Content-Type': 'application/json', 'x-workflow-workspace': code }, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(20000) });
  const result = await response.json();
  if (!response.ok) { if (response.status === 409) conflict = true; throw new Error(result.error || 'Server save unavailable. Retry or export a backup.'); }
  return result;
}
export function validateWorkflowLibrary(value: unknown): Library {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('This is not a workflow backup.');
  for (const [id, entry] of Object.entries(value)) {
    const item = entry as PersonalWorkflow;
    if (!id.startsWith('custom:') || item?.id !== id || item.draft?.id !== id || !Array.isArray(item.draft?.blocks) || !Array.isArray(item.draft?.edges) || !Array.isArray(item.versions) || !Array.isArray(item.runs)) throw new Error('The backup contains an invalid workflow. Nothing was imported.');
  }
  return value as Library;
}
export function initializeWorkflowSync(get: () => Library, set: (value: Library) => void) {
  read = get; apply = set;
  void syncWorkflowLibrary();
}
export function queueWorkflowSave() {
  generation++;
  saveMeta({ ...meta(), dirty: true });
  if (conflict) return;
  status('Saving changes…');
  clearTimeout(timer);
  timer = setTimeout(() => void syncWorkflowLibrary(), 700);
}
export function syncWorkflowLibrary(): Promise<void> {
  if (active) return active;
  if (!read || !apply || conflict) return Promise.resolve();
  const currentEpoch = epoch;
  active = (async () => {
    try {
      const code = workspaceRecoveryCode();
      if (!loaded) {
        const remote = await request('GET', code);
        if (epoch !== currentEpoch) return;
        const localMeta = meta();
        if (remote.payload) {
          const value = validateWorkflowLibrary(parseSharedJSON(remote.payload));
          if (!Object.keys(read!()).length || !localMeta.dirty) { apply!(value); saveMeta({ revision: remote.revision, dirty: false }); }
          else if (localMeta.revision !== remote.revision) {
            conflict = true;
            throw new Error('The server has newer changes. Export your local backup, then open the server copy using your recovery code.');
          }
        } else saveMeta({ revision: 0, dirty: Object.keys(read!()).length > 0 });
        loaded = true;
      }
      const pending = meta();
      if (!pending.dirty) { status(pending.revision ? 'Saved to server' : 'Ready to save to server'); return; }
      status('Saving to server…');
      const version = generation;
      const saved = await request('PUT', code, { payload: stringifySharedJSON(read!()), revision: pending.revision });
      if (epoch !== currentEpoch) return;
      saveMeta({ revision: saved.revision, dirty: version !== generation });
      status(version === generation ? 'Saved to server' : 'Saving changes…');
      if (version !== generation) timer = setTimeout(() => void syncWorkflowLibrary(), 100);
    } catch (error) { status(error instanceof Error ? error.message : 'Server save failed. Retry or export a backup.'); }
  })().finally(() => { active = undefined; });
  return active;
}
export async function openWorkflowWorkspace(code: string) {
  if (!/^[a-f0-9]{64}$/.test(code.trim())) throw new Error('Enter the complete workspace recovery code.');
  const remote = await request('GET', code.trim());
  if (!remote.payload) throw new Error('No saved workspace was found for this recovery code. Your current workflows are unchanged.');
  const value = validateWorkflowLibrary(parseSharedJSON(remote.payload));
  epoch++; clearTimeout(timer);
  localStorage.setItem(KEY, code.trim());
  saveMeta({ revision: remote.revision, dirty: false });
  conflict = false; loaded = true;
  apply?.(value);
  status('Saved to server');
}
