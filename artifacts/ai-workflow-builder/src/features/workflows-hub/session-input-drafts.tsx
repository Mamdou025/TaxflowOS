import { createContext, useContext, useState, type ReactNode, type SetStateAction } from 'react';

type InputDraft = {
  config: Record<string, unknown>;
  patch: Record<string, unknown>;
  sourceIdentity: string;
} | null;
type FormState = { draft: InputDraft; busy: boolean; error: string };
const empty: FormState = { draft: null, busy: false, error: '' };
type DraftContext = {
  states: Record<string, FormState>;
  update: (
    key: string,
    field: keyof FormState,
    value: SetStateAction<FormState[keyof FormState]>,
  ) => void;
};
const Context = createContext<DraftContext | null>(null);

/** Transient UI edits shared by Trigger and worksheet; applied inputs still belong to the session. */
export function SessionInputDraftProvider({ children }: { children: ReactNode }) {
  const [states, setStates] = useState<Record<string, FormState>>({});
  return (
    <Context.Provider
      value={{
        states,
        update: (key, field, value) =>
          setStates((previous) => {
            const state = previous[key] ?? empty;
            return {
              ...previous,
              [key]: {
                ...state,
                [field]: typeof value === 'function' ? value(state[field]) : value,
              },
            };
          }),
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useSessionInputDraft(key: string, shared: boolean) {
  const context = useContext(Context);
  const [local, setLocal] = useState<FormState>(empty);
  const active = shared ? context : null;
  const state = active?.states[key] ?? (active ? empty : local);
  function set<K extends keyof FormState>(field: K, value: SetStateAction<FormState[K]>) {
    if (active) active.update(key, field, value as SetStateAction<FormState[keyof FormState]>);
    else
      setLocal((previous) => ({
        ...previous,
        [field]:
          typeof value === 'function'
            ? (value as (old: FormState[K]) => FormState[K])(previous[field])
            : value,
      }));
  }
  return {
    ...state,
    setDraft: (value: SetStateAction<InputDraft>) => set('draft', value),
    setBusy: (value: boolean) => set('busy', value),
    setError: (value: string) => set('error', value),
  };
}
