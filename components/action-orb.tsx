'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { Home, Workflow, Sparkles, LayoutDashboard, X, ArrowUp } from 'lucide-react';
import { chatMessagesAtom, type ChatMessage } from '@/lib/chat-store';

const PURPLE = '#6B21A8';
const ORANGE  = '#C2410C';

const MINI_SIZE   = 52;
const MINI_RADIUS = MINI_SIZE / 2;
const BOTTOM_GAP  = 20;
const ARC_RADIUS  = 95;
const CHAT_W      = 440;

const ORB_ANCHOR_BOTTOM = BOTTOM_GAP + MINI_RADIUS; // 52 px

const START_ANGLE = -155 * (Math.PI / 180);
const END_ANGLE   = -25  * (Math.PI / 180);

type NavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  href?: string;
  action?: 'chat';
};

const NAV_ITEMS: NavItem[] = [
  { id: 'home',    label: 'Home',      href: '/',          icon: Home            },
  { id: 'builder', label: 'Builder',   href: '/builder',   icon: Workflow        },
  { id: 'chat',    label: 'AI Chat',   action: 'chat',     icon: Sparkles        },
  { id: 'dash',    label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];

// ─── Animated dots ring ───────────────────────────────────────────────────────
function OrbDots({ size }: { size: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * (57 / 170);
  const innerR = size * (43 / 170);

  return (
    <>
      <style>{`
        @keyframes gorb-cw  { to { transform: rotate(360deg);  } }
        @keyframes gorb-ccw { to { transform: rotate(-360deg); } }
        .gorb-cw  { animation: gorb-cw  9s linear infinite; transform-origin: ${cx}px ${cy}px; }
        .gorb-ccw { animation: gorb-ccw 6s linear infinite; transform-origin: ${cx}px ${cy}px; }
        @keyframes orb-bounce {
          0%, 80%, 100% { transform: scaleY(1); opacity: 0.4; }
          40%            { transform: scaleY(1.4); opacity: 1; }
        }
      `}</style>
      <svg
        width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <g className="gorb-cw">
          {Array.from({ length: 40 }, (_, i) => {
            const a = (i / 40) * Math.PI * 2;
            const dur = 22;
            const begin = -(i / 40) * dur;
            const kt = '0;0.02;0.07;0.93;0.98;1';
            const ks = '0 0 1 1;0.42 0 1 1;0 0 1 1;0 0 0.58 1;0 0 1 1';
            return (
              <circle key={i} cx={cx + outerR * Math.cos(a)} cy={cy + outerR * Math.sin(a)} r={0} fill={PURPLE}>
                <animate attributeName="r"       values="0;0;0.15;2.0;0;0" keyTimes={kt} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" calcMode="spline" keySplines={ks} />
                <animate attributeName="opacity" values="0;0;0.85;0.85;0;0" keyTimes={kt} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" calcMode="spline" keySplines={ks} />
              </circle>
            );
          })}
        </g>
        <g className="gorb-ccw">
          {Array.from({ length: 26 }, (_, i) => {
            const a = (i / 26) * Math.PI * 2;
            const dur = 15;
            const begin = -((26 - i) / 26) * dur;
            const kt = '0;0.02;0.07;0.93;0.98;1';
            const ks = '0 0 1 1;0.42 0 1 1;0 0 1 1;0 0 0.58 1;0 0 1 1';
            return (
              <circle key={i} cx={cx + innerR * Math.cos(a)} cy={cy + innerR * Math.sin(a)} r={0} fill={ORANGE}>
                <animate attributeName="r"       values="0;0;0.15;1.7;0;0" keyTimes={kt} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" calcMode="spline" keySplines={ks} />
                <animate attributeName="opacity" values="0;0;0.85;0.85;0;0" keyTimes={kt} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" calcMode="spline" keySplines={ks} />
              </circle>
            );
          })}
        </g>
      </svg>
    </>
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '2px 0' }}>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            width: 6, height: 6, borderRadius: '50%',
            background: '#9CA3AF',
            animation: `orb-bounce 1.2s ease-in-out ${i * 0.18}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function ActionOrb() {
  const pathname = usePathname();
  const router   = useRouter();

  const [messages,  setMessages]  = useAtom(chatMessagesAtom);
  const [mounted,   setMounted]   = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [chatOpen,  setChatOpen]  = useState(false);
  const [message,   setMessage]   = useState('');
  const [isTyping,  setIsTyping]  = useState(false);

  const inputRef   = useRef<HTMLInputElement>(null);
  const bottomRef  = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    setMenuOpen(false);
    setChatOpen(false);
    setMessage('');
    setIsTyping(false);
  }, [pathname]);

  // Focus input after the morph animation finishes
  useEffect(() => {
    if (!chatOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 380);
    return () => clearTimeout(t);
  }, [chatOpen]);

  // Auto-scroll to newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!mounted) return null;

  const handleSend = () => {
    const text = message.trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    setIsTyping(true);

    // Placeholder — swap this setTimeout for a real API call
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'm reviewing your InScope context. This is a placeholder — wire up an AI API to get real responses.`,
        timestamp: Date.now(),
      }]);
    }, 900);
  };

  const handleItemClick = (item: NavItem) => {
    setMenuOpen(false);
    if (item.action === 'chat') {
      setChatOpen(true);
    } else if (item.href) {
      router.push(item.href);
    }
  };

  const closeChat = () => { setChatOpen(false); setMessage(''); };

  const hasText = message.trim().length > 0;

  return (
    <>
      {/* ── Message panel — floats above the chat bar ─────────────────────── */}
      <AnimatePresence>
        {chatOpen && (messages.length > 0 || isTyping) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            style={{
              position: 'fixed',
              bottom: BOTTOM_GAP + MINI_SIZE + 10,
              left: '50%',
              x: '-50%',
              width: CHAT_W,
              maxHeight: 340,
              zIndex: 50,
              borderRadius: 20,
              background: '#eaeaef',
              boxShadow: '8px 8px 22px rgba(158,158,178,0.38), -8px -8px 22px rgba(255,255,255,0.84)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                scrollbarWidth: 'none',
              }}
            >
              <AnimatePresence initial={false}>
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                    style={{
                      alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '82%',
                      padding: '9px 13px',
                      borderRadius: msg.role === 'user'
                        ? '16px 16px 4px 16px'
                        : '16px 16px 16px 4px',
                      fontSize: 13,
                      lineHeight: 1.5,
                      background: msg.role === 'user'
                        ? PURPLE
                        : 'rgba(0,0,0,0.055)',
                      color: msg.role === 'user' ? '#fff' : '#374151',
                      boxShadow: msg.role === 'user'
                        ? '0 2px 8px rgba(107,33,168,0.25)'
                        : 'none',
                    }}
                  >
                    {msg.content}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      alignSelf: 'flex-start',
                      padding: '10px 14px',
                      borderRadius: '16px 16px 16px 4px',
                      background: 'rgba(0,0,0,0.055)',
                    }}
                  >
                    <TypingDots />
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={bottomRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Morphing orb / chat bar ───────────────────────────────────────── */}
      <motion.div
        animate={{ width: chatOpen ? CHAT_W : MINI_SIZE }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        style={{
          position: 'fixed',
          bottom: BOTTOM_GAP,
          left: '50%',
          x: '-50%',
          height: MINI_SIZE,
          borderRadius: MINI_RADIUS,
          background: '#eaeaef',
          overflow: 'hidden',
          zIndex: 50,
          boxShadow: menuOpen && !chatOpen
            ? 'inset 3px 3px 8px rgba(158,158,178,0.42), inset -3px -3px 8px rgba(255,255,255,0.86)'
            : '5px 5px 12px rgba(158,158,178,0.42), -5px -5px 12px rgba(255,255,255,0.86)',
          transition: 'box-shadow 200ms ease-out',
        }}
      >
        {/* Orb button — fades out as chat opens */}
        <motion.button
          animate={{ opacity: chatOpen ? 0 : 1, scale: chatOpen ? 0.6 : 1 }}
          transition={{ duration: 0.18 }}
          onClick={() => setMenuOpen(o => !o)}
          style={{
            position: 'absolute', left: 0, top: 0,
            width: MINI_SIZE, height: MINI_SIZE,
            border: 'none', background: 'transparent', padding: 0,
            cursor: chatOpen ? 'default' : 'pointer',
            pointerEvents: chatOpen ? 'none' : 'auto',
          }}
        >
          <OrbDots size={MINI_SIZE} />
        </motion.button>

        {/* Chat input row — fades in after morph */}
        <motion.div
          animate={{ opacity: chatOpen ? 1 : 0 }}
          transition={{ duration: 0.2, delay: chatOpen ? 0.3 : 0 }}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center',
            paddingInline: 16, gap: 8,
            pointerEvents: chatOpen ? 'auto' : 'none',
          }}
        >
          <Sparkles size={15} style={{ color: PURPLE, flexShrink: 0, opacity: 0.75 }} />

          <input
            ref={inputRef}
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleSend();
              if (e.key === 'Escape') closeChat();
            }}
            placeholder="Ask AI anything…"
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontSize: 14, color: 'var(--neu-text)', letterSpacing: '-0.01em',
            }}
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!hasText || isTyping}
            style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              background: hasText && !isTyping ? PURPLE : 'rgba(0,0,0,0.06)',
              border: 'none', cursor: hasText && !isTyping ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 200ms ease',
            }}
          >
            <ArrowUp size={13} style={{ color: hasText && !isTyping ? '#fff' : '#9CA3AF' }} />
          </button>

          {/* Close */}
          <button
            onClick={closeChat}
            style={{
              width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0.4,
            }}
          >
            <X size={12} style={{ color: '#374151' }} />
          </button>
        </motion.div>
      </motion.div>

      {/* ── Arc items anchor ──────────────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          bottom: ORB_ANCHOR_BOTTOM,
          left: '50%',
          width: 0, height: 0,
          overflow: 'visible',
          zIndex: 51,
        }}
      >
        <AnimatePresence>
          {menuOpen && !chatOpen && NAV_ITEMS.map((item, i) => {
            const angle = START_ANGLE + (i / (NAV_ITEMS.length - 1)) * (END_ANGLE - START_ANGLE);
            const ax    = Math.cos(angle) * ARC_RADIUS;
            const ay    = Math.sin(angle) * ARC_RADIUS;
            const Icon  = item.icon;

            return (
              <motion.button
                key={item.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.22, delay: i * 0.05, ease: [0.34, 1.56, 0.64, 1] }}
                onClick={() => handleItemClick(item)}
                style={{
                  position: 'absolute',
                  left: ax, top: ay,
                  marginLeft: -22, marginTop: -22,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: '#eaeaef',
                  boxShadow: '8px 8px 18px rgba(158,158,178,0.42), -8px -8px 18px rgba(255,255,255,0.86)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={17} style={{ color: '#374151', opacity: 0.75 }} />
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 600, color: '#374151',
                  whiteSpace: 'nowrap',
                  textShadow: '0 1px 3px rgba(255,255,255,0.9)',
                }}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Backdrop ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {(menuOpen || chatOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 49 }}
            onClick={() => { setMenuOpen(false); closeChat(); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
