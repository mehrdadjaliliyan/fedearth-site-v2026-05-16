'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion, useTransform } from 'framer-motion';

export default function Globe({ size = 520 }: { size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 80, damping: 14 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 80, damping: 14 });

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    mx.set((e.clientX - (rect.left + rect.width / 2)) / rect.width);
    my.set((e.clientY - (rect.top + rect.height / 2)) / rect.height);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const nodes = [
    { x: 0.18, y: 0.28 },
    { x: 0.42, y: 0.12 },
    { x: 0.72, y: 0.22 },
    { x: 0.88, y: 0.48 },
    { x: 0.78, y: 0.78 },
    { x: 0.5, y: 0.9 },
    { x: 0.22, y: 0.78 },
    { x: 0.1, y: 0.55 },
    { x: 0.35, y: 0.4 },
    { x: 0.65, y: 0.45 },
    { x: 0.55, y: 0.62 },
  ].map((n) => ({ x: n.x * size, y: n.y * size }));

  return (
    <motion.div
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={reduce ? false : { opacity: 0, scale: 0.85, filter: 'blur(20px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: size,
        maxWidth: '100%',
        rotateX: rx,
        rotateY: ry,
        transformStyle: 'preserve-3d',
        perspective: 1200,
      }}
      className="relative mx-auto aspect-square select-none"
      aria-hidden="true"
    >
      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/30 via-primary/10 to-accent/20 blur-3xl"
        animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Pulse rings */}
      <div className="absolute inset-8 rounded-full border border-primary/20 animate-pulse-ring" />
      <div className="absolute inset-14 rounded-full border border-primary/25 animate-pulse-ring [animation-delay:1.2s]" />

      <svg viewBox={`0 0 ${size} ${size}`} className="relative z-10 h-full w-full">
        <defs>
          <radialGradient id="sphere" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#2A2E57" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#0F1220" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#05070D" stopOpacity="1" />
          </radialGradient>
          <linearGradient id="meridian" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0" />
            <stop offset="50%" stopColor="#A5B4FC" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="node" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="60%" stopColor="#FB7185" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FB7185" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={cx} cy={cy} r={r} fill="url(#sphere)" stroke="rgba(99,102,241,0.25)" strokeWidth="1" />

        <g
          style={{
            transformOrigin: `${cx}px ${cy}px`,
            animation: 'spin_slow 80s linear infinite',
          }}
        >
          {[...Array(9)].map((_, i) => {
            const rx2 = r * Math.cos((i / 9) * Math.PI);
            return (
              <ellipse
                key={`m-${i}`}
                cx={cx}
                cy={cy}
                rx={Math.abs(rx2)}
                ry={r}
                fill="none"
                stroke="url(#meridian)"
                strokeWidth="0.6"
                opacity={0.6}
              />
            );
          })}
          {[...Array(7)].map((_, i) => {
            const offset = (i - 3) * (r / 4);
            const parallelR = Math.sqrt(Math.max(r * r - offset * offset, 0));
            return (
              <ellipse
                key={`p-${i}`}
                cx={cx}
                cy={cy + offset}
                rx={parallelR}
                ry={parallelR * 0.12}
                fill="none"
                stroke="rgba(99,102,241,0.22)"
                strokeWidth="0.6"
              />
            );
          })}
        </g>

        {/* Animated connection lines */}
        <g stroke="rgba(165,180,252,0.35)" strokeWidth="0.5" fill="none">
          {nodes.map((a, i) =>
            nodes.slice(i + 1).map((b, j) => {
              const dx = a.x - b.x;
              const dy = a.y - b.y;
              const dist = Math.hypot(dx, dy);
              if (dist > size * 0.35) return null;
              const len = Math.hypot(a.x - b.x, a.y - b.y);
              return (
                <line
                  key={`l-${i}-${j}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  strokeOpacity={0.3 + 0.2 * (1 - dist / (size * 0.35))}
                  strokeDasharray={len}
                  strokeDashoffset={len}
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from={len}
                    to="0"
                    dur="2.4s"
                    fill="freeze"
                    begin={`${(i + j) * 0.12}s`}
                  />
                </line>
              );
            }),
          )}
        </g>

        {nodes.map((n, i) => (
          <g key={`n-${i}`}>
            <circle cx={n.x} cy={n.y} r="6" fill="url(#node)">
              <animate
                attributeName="r"
                values="6;9;6"
                dur={`${3 + (i % 3) * 0.6}s`}
                repeatCount="indefinite"
              />
            </circle>
            <circle cx={n.x} cy={n.y} r="2" fill="#FDA4AF">
              <animate
                attributeName="opacity"
                values="0.5;1;0.5"
                dur={`${2.5 + (i % 4) * 0.5}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}

        <circle
          cx={cx - r * 0.35}
          cy={cy - r * 0.4}
          r={r * 0.25}
          fill="url(#sphere)"
          opacity="0.4"
        />
      </svg>

      <div className="pointer-events-none absolute inset-[-8%] animate-spin-slow">
        <svg viewBox="0 0 400 400" className="h-full w-full opacity-60">
          <defs>
            <path
              id="orbit"
              d="M200,200 m-185,0 a185,185 0 1,1 370,0 a185,185 0 1,1 -370,0"
            />
          </defs>
          <text fill="#A5B4FC" fontSize="11" letterSpacing="6" fontFamily="var(--font-mono)">
            <textPath href="#orbit">
              ● DIRECT DEMOCRACY ● ONE MEMBER ONE VOTE ● ZUG SWITZERLAND ● NON-PARTISAN ● TRANSPARENT ● ONCHAIN ●
            </textPath>
          </text>
        </svg>
      </div>
    </motion.div>
  );
}
