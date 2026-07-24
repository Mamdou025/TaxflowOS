'use client';

// ─────────────────────────────────────────────────────────────────────────────
// SinaPresence — shows that Sina is answering (the "face" of the chat). Headless;
// mounted once in app-shell.
//
// There is ONE unified agent now (Sina), so while a reply is streaming this simply
// sets the live coworker indicator to Sina. Purely COSMETIC: it only writes the
// presence atom the CoworkerActivity chip reads — never touches the message thread or
// the model. It yields entirely to a live workflow run, which owns the indicator.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCopilotChat } from '@copilotkit/react-core';
import { activeCoworkerAtom, activeRunAtom, setActiveCoworkerAtom } from '@/shared/stores/workspace-store';
import { SINA } from '@/lib/coworkers';

export function SpecialistPresence() {
  const { isLoading } = useCopilotChat();
  const run = useAtomValue(activeRunAtom);
  const active = useAtomValue(activeCoworkerAtom);
  const setCoworker = useSetAtom(setActiveCoworkerAtom);

  useEffect(() => {
    // A live run owns the presence indicator — never fight it.
    if (run && run.phase !== 'done') return;

    // Only ever touch the Sina hat WE set — never clear the engine/other actors.
    const mine = active?.coworker.id === SINA.id;

    if (isLoading) {
      if (!mine) {
        setCoworker({ coworker: SINA, status: 'Reviewing your question…' });
      }
    } else if (mine) {
      setCoworker(null); // reply finished → clear our hat
    }
  }, [isLoading, run, active, setCoworker]);

  return null;
}
