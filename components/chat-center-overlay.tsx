'use client';

import { useAtom, useAtomValue } from 'jotai';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { chatMessagesAtom, chatPageContextAtom, chatTakeoverAtom } from '@/lib/chat-store';
import { NAV_HEIGHT } from '@/components/global-top-nav';

const ORANGE = '#C2410C';

function OrangeDots({ size = 16, color = ORANGE }: { size?: number; color?: string }) {
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

export function ChatCenterOverlay() {
  const [takeover, setTakeover] = useAtom(chatTakeoverAtom);
  const messages = useAtomValue(chatMessagesAtom);
  const context = useAtomValue(chatPageContextAtom);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <style>{`
        @keyframes msgFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className="fixed left-0 right-0 z-20 flex flex-col items-center justify-center px-6"
        style={{
          top: NAV_HEIGHT,
          bottom: 80,
          pointerEvents: takeover ? 'auto' : 'none',
          background: takeover ? 'rgba(0,0,0,0.38)' : 'transparent',
          backdropFilter: takeover ? 'blur(6px)' : 'none',
          transition: 'background 480ms ease-out, backdrop-filter 480ms ease-out',
        }}
      >
        <div
          className="w-full max-w-2xl flex flex-col rounded-2xl overflow-hidden"
          style={{
            maxHeight: '100%',
            background: '#eaeaef',
            boxShadow: takeover
              ? '0 4px 24px rgba(0,0,0,0.30), 0 24px 60px rgba(0,0,0,0.18)'
              : 'none',
            opacity: takeover ? 1 : 0,
            transform: takeover ? 'scale(1) translateY(0)' : 'scale(0.97) translateY(10px)',
            transition: takeover
              ? 'opacity 380ms cubic-bezier(0.23,1,0.32,1) 80ms, transform 380ms cubic-bezier(0.23,1,0.32,1) 80ms, box-shadow 380ms ease-out 80ms'
              : 'opacity 260ms ease-in, transform 260ms ease-in, box-shadow 260ms ease-in',
          }}
        >
          {/* Header */}
          <div
            className="shrink-0 flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: '1px solid rgba(158,158,178,0.18)' }}
          >
            <div className="flex items-center gap-2.5">
              <OrangeDots />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>
                  AI Assistant
                </div>
                <div style={{ fontSize: 10, color: '#9CA3AF', lineHeight: 1.2 }}>
                  {context.label}
                </div>
              </div>
            </div>
            <button
              onClick={() => setTakeover(false)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
            >
              <X size={14} className="text-gray-400" />
            </button>
          </div>

          {/* Thread */}
          <div
            ref={threadRef}
            className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3"
            style={{ minHeight: 80 }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                style={{ animation: 'msgFadeIn 280ms cubic-bezier(0.23,1,0.32,1) both' }}
              >
                <div
                  style={{
                    maxWidth: '84%',
                    padding: '9px 14px',
                    borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    fontSize: 13,
                    lineHeight: 1.6,
                    background: msg.role === 'user' ? '#111827' : 'white',
                    color: msg.role === 'user' ? 'white' : '#374151',
                    boxShadow: msg.role === 'assistant' ? '0 2px 8px rgba(0,0,0,0.07)' : 'none',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
