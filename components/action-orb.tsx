'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai';
import { Home, Workflow, Sparkles, LayoutDashboard } from 'lucide-react';
import { chatWorkspaceOpenAtom } from '@/lib/chat-store';

const PURPLE = '#6B21A8';
const ORANGE  = '#C2410C';

const MINI_SIZE   = 52;
const MINI_RADIUS = MINI_SIZE / 2;
const BOTTOM_GAP  = 20;
const ARC_RADIUS  = 95;

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

// ─── Main export ──────────────────────────────────────────────────────────────
// Launcher orb + radial nav. The "AI Chat" item opens the large takeover chat
// workspace panel (see components/workspace/chat-workspace-panel.tsx).
export function ActionOrb() {
  const pathname = usePathname();
  const router   = useRouter();
  const openChat = useSetAtom(chatWorkspaceOpenAtom);

  const [mounted,  setMounted]  = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  if (!mounted) return null;

  const handleItemClick = (item: NavItem) => {
    setMenuOpen(false);
    if (item.action === 'chat') {
      openChat(true);
    } else if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <>
      {/* ── Orb button ─────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          bottom: BOTTOM_GAP,
          left: '50%',
          transform: 'translateX(-50%)',
          width: MINI_SIZE,
          height: MINI_SIZE,
          borderRadius: MINI_RADIUS,
          background: '#eaeaef',
          overflow: 'hidden',
          zIndex: 50,
          boxShadow: menuOpen
            ? 'inset 3px 3px 8px rgba(158,158,178,0.42), inset -3px -3px 8px rgba(255,255,255,0.86)'
            : '5px 5px 12px rgba(158,158,178,0.42), -5px -5px 12px rgba(255,255,255,0.86)',
          transition: 'box-shadow 200ms ease-out',
        }}
      >
        <button
          onClick={() => setMenuOpen((o) => !o)}
          style={{ position: 'absolute', inset: 0, border: 'none', background: 'transparent', padding: 0, cursor: 'pointer' }}
        >
          <OrbDots size={MINI_SIZE} />
        </button>
      </div>

      {/* ── Arc items ──────────────────────────────────────────────────────── */}
      <div style={{ position: 'fixed', bottom: ORB_ANCHOR_BOTTOM, left: '50%', width: 0, height: 0, overflow: 'visible', zIndex: 51 }}>
        <AnimatePresence>
          {menuOpen && NAV_ITEMS.map((item, i) => {
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
                <span style={{ fontSize: 10, fontWeight: 600, color: '#374151', whiteSpace: 'nowrap', textShadow: '0 1px 3px rgba(255,255,255,0.9)' }}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Backdrop (closes the radial menu) ──────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 49 }}
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
