'use client';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRef, useState } from 'react';
import {
  chatMessagesAtom,
  chatPageContextAtom,
  chatTakeoverAtom,
  type ChatMessage,
} from '@/lib/chat-store';

const ORANGE = '#C2410C';

function OrangeDots({ size = 18, color = ORANGE }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" className="shrink-0">
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={9 + 6.5 * Math.cos(a)}
            cy={9 + 6.5 * Math.sin(a)}
            r={1.1}
            fill={color}
            opacity={0.9}
          />
        );
      })}
    </svg>
  );
}

function SendArrow({ active }: { active: boolean }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? 'white' : '#9CA3AF'}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

export function ChatDrawer() {
  const [messages, setMessages] = useAtom(chatMessagesAtom);
  const context = useAtomValue(chatPageContextAtom);
  const setTakeover = useSetAtom(chatTakeoverAtom);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const text = value.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setValue('');
    setTakeover(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I'm reviewing your ${context.label} context. This is a placeholder — wire up an AI API to get real responses.`,
          timestamp: Date.now(),
        },
      ]);
    }, 700);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasText = value.trim().length > 0;

  return (
    <div
      className="fixed z-30"
      style={{
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(480px, calc(100vw - 48px))',
      }}
    >
      <div
        className="flex items-center gap-2.5 rounded-full px-3.5 py-2.5"
        style={{
          background: '#eaeaef',
          boxShadow: '6px 6px 14px rgba(158,158,178,0.38), -6px -6px 14px rgba(255,255,255,0.84)',
        }}
      >
        <OrangeDots />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything…"
          className="flex-1 text-[12px] text-gray-700 outline-none bg-transparent placeholder:text-gray-400"
        />
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center justify-center w-7 h-7 rounded-full transition-all shrink-0"
          style={{
            background: hasText ? '#111827' : '#E5E7EB',
            opacity: hasText ? 1 : 0.4,
            cursor: hasText ? 'pointer' : 'default',
          }}
        >
          <SendArrow active={hasText} />
        </button>
      </div>
    </div>
  );
}
