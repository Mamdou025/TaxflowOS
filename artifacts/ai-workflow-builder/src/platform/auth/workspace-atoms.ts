import { atomWithStorage as storedAtom, createJSONStorage } from 'jotai/utils';
import { workspaceStorage } from './workspace-context';

export function atomWithStorage<T>(key: string, initialValue: T) {
  return storedAtom(
    key,
    initialValue,
    createJSONStorage<T>(() => workspaceStorage),
  );
}
