'use client';

// Throwaway smoke-test page — verifies CopilotKit runtime + UI load on this
// Next/React stack before we integrate it into the real workspace. Delete after.
import { CopilotKit, useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { CopilotChat } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import { useState } from 'react';

function Inner() {
  const [note, setNote] = useState('nothing yet');
  useCopilotReadable({ description: 'A scratch note the user can set', value: note });
  useCopilotAction({
    name: 'setNote',
    description: 'Set the scratch note to a value',
    followUp: false,
    parameters: [{ name: 'text', type: 'string', description: 'the new note', required: true }],
    handler: async ({ text }: { text: string }) => {
      setNote(text);
      return `Set the note to "${text}".`;
    },
  });
  return (
    <div style={{ display: 'flex', gap: 24, padding: 24, height: '100dvh', boxSizing: 'border-box' }}>
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600 }}>CopilotKit smoke test</h2>
        <p style={{ fontSize: 13, color: '#555' }}>Note: <b>{note}</b></p>
        <p style={{ fontSize: 12, color: '#888' }}>Try: “set the note to hello”.</p>
      </div>
      <div style={{ width: 420, border: '1px solid #e5e5e5', borderRadius: 12, overflow: 'hidden' }}>
        <CopilotChat labels={{ title: 'Assistant', initial: 'Hi — ask me to set the note.' }} />
      </div>
    </div>
  );
}

export default function CopilotTestPage() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <Inner />
    </CopilotKit>
  );
}
