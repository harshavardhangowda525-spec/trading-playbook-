import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { corePulse } from '../lib/events';
import type { Category } from '../data/schedule';

interface Orbit {
  cat: Category;
  label: string;
  rx: number;
  ry: number;
  rot: number;
  labelTop: boolean;
  offset: number; // label position along the half-ellipse, %
  dur: number; // satellite orbit seconds
}

const ORBITS: Orbit[] = [
  { cat: 'trading', label: 'TRADING', rx: 250, ry: 78, rot: -14, labelTop: true, offset: 14, dur: 38 },
  { cat: 'study', label: 'STUDY', rx: 214, ry: 104, rot: 12, labelTop: false, offset: 30, dur: 46 },
  { cat: 'business', label: 'BUSINESS', rx: 268, ry: 66, rot: -8, labelTop: true, offset: 74, dur: 52 },
  { cat: 'fitness', label: 'FITNESS', rx: 282, ry: 92, rot: 7, labelTop: false, offset: 76, dur: 60 },
  { cat: 'discipline', label: 'DISCIPLINE', rx: 236, ry: 122, rot: -24, labelTop: false, offset: 10, dur: 70 },
];

const CX = 320;
const CY = 200;

const fullEllipse = (rx: number, ry: number) =>
  `M ${CX - rx} ${CY} a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 ${-rx * 2} 0`;

/** Half-ellipse drawn left→right so text reads upright on either half. */
const halfEllipse = (rx: number, ry: number, top: boolean) =>
  `M ${CX - rx} ${CY} A ${rx} ${ry} 0 0 ${top ? 1 : 0} ${CX + rx} ${CY}`;

/**
 * The holographic AI core: "1% BETTER EVERY DAY" surrounded by orbital rings,
 * one per life category, each lit in proportion to today's completion.
 */
export function OrbitalCore({ progress, onSelect }: { progress: Record<Category, number>; onSelect?: (c: Category) => void }) {
  const reduce = useReducedMotion();
  const [pulse, setPulse] = useState(0);
  useEffect(() => corePulse.on(() => setPulse((p) => p + 1)), []);

  return (
    <div className="core-wrap">
      <svg className="core-svg" viewBox="0 0 640 400" role="img" aria-label="Trading core with orbital progress rings">
        <defs>
          <radialGradient id="core-fill" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#bff7ff" stopOpacity="0.35" />
            <stop offset="35%" stopColor="#3ee6ff" stopOpacity="0.18" />
            <stop offset="75%" stopColor="#0a4a66" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#02121c" stopOpacity="0.9" />
          </radialGradient>
          <radialGradient id="core-halo" cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor="#3ee6ff" stopOpacity="0" />
            <stop offset="72%" stopColor="#3ee6ff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#3ee6ff" stopOpacity="0" />
          </radialGradient>
          <filter id="core-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="stream-l" x1="0" x2="1">
            <stop offset="0" stopColor="#3ee6ff" stopOpacity="0" />
            <stop offset="1" stopColor="#3ee6ff" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="stream-r" x1="1" x2="0">
            <stop offset="0" stopColor="#3ee6ff" stopOpacity="0" />
            <stop offset="1" stopColor="#3ee6ff" stopOpacity="0.7" />
          </linearGradient>
          {ORBITS.map((o) => (
            <path key={o.cat} id={`orbit-label-${o.cat}`} d={halfEllipse(o.rx, o.ry, o.labelTop)} />
          ))}
        </defs>

        {/* data streams */}
        <g className="core-streams">
          {[-18, 0, 18].map((dy, i) => (
            <g key={dy}>
              <line x1={30} y1={CY + dy} x2={190} y2={CY + dy * 0.4} stroke="url(#stream-l)" strokeWidth="1" className="stream" style={{ animationDelay: `${i * 0.7}s` }} />
              <line x1={610} y1={CY + dy} x2={450} y2={CY + dy * 0.4} stroke="url(#stream-r)" strokeWidth="1" className="stream" style={{ animationDelay: `${i * 0.9}s` }} />
            </g>
          ))}
          <path d={`M 206 ${CY - 10} l 14 10 l -14 10`} fill="none" stroke="#3ee6ff" strokeOpacity="0.6" strokeWidth="1.5" />
          <path d={`M 434 ${CY - 10} l -14 10 l 14 10`} fill="none" stroke="#3ee6ff" strokeOpacity="0.6" strokeWidth="1.5" />
        </g>

        {/* orbital rings */}
        {ORBITS.map((o, i) => {
          const pct = Math.min(1, Math.max(0, progress[o.cat] ?? 0));
          return (
            <g
              key={o.cat}
              transform={`rotate(${o.rot} ${CX} ${CY})`}
              className="orbit"
              onClick={() => onSelect?.(o.cat)}
              style={{ cursor: onSelect ? 'pointer' : undefined }}
            >
              <title>{`${o.label} · ${Math.round(pct * 100)}% today`}</title>
              {/* fat invisible hit area */}
              <path d={fullEllipse(o.rx, o.ry)} fill="none" stroke="transparent" strokeWidth="14" />
              <path d={fullEllipse(o.rx, o.ry)} fill="none" stroke="rgba(120,225,255,0.16)" strokeWidth="1" />
              <path
                d={fullEllipse(o.rx, o.ry)}
                fill="none"
                stroke="rgba(120,225,255,0.35)"
                strokeWidth="1"
                strokeDasharray="2 14"
                className="orbit-dash"
                style={{ animationDuration: `${o.dur}s` }}
              />
              <motion.path
                d={fullEllipse(o.rx, o.ry)}
                fill="none"
                stroke="#3ee6ff"
                strokeWidth="2.2"
                strokeLinecap="round"
                pathLength={100}
                filter="url(#core-glow)"
                initial={{ strokeDasharray: '0 100' }}
                animate={{ strokeDasharray: `${pct * 100} 100` }}
                transition={{ duration: reduce ? 0 : 1.6, delay: reduce ? 0 : 0.3 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                opacity={pct > 0 ? 0.95 : 0}
              />
              <text className="orbit-label" dy={o.labelTop ? -6 : 14}>
                <textPath href={`#orbit-label-${o.cat}`} startOffset={`${o.offset}%`}>
                  {o.label}
                </textPath>
              </text>
              {!reduce && (
                <circle r="2.6" fill="#bff7ff" filter="url(#core-glow)">
                  <animateMotion dur={`${o.dur / 2}s`} repeatCount="indefinite" path={fullEllipse(o.rx, o.ry)} />
                </circle>
              )}
            </g>
          );
        })}

        {/* core */}
        <circle cx={CX} cy={CY} r={128} fill="url(#core-halo)" className="core-halo" />
        <circle cx={CX} cy={CY} r={116} fill="none" stroke="rgba(120,225,255,0.2)" strokeWidth="1" strokeDasharray="1 5" className="spin-a" />
        <circle cx={CX} cy={CY} r={104} fill="none" stroke="rgba(62,230,255,0.55)" strokeWidth="1.5" strokeDasharray="60 30 10 30" className="spin-b" filter="url(#core-glow)" />
        <circle cx={CX} cy={CY} r={94} fill="none" stroke="rgba(120,225,255,0.25)" strokeWidth="6" strokeDasharray="1 3" className="spin-c" />
        <circle cx={CX} cy={CY} r={84} fill="url(#core-fill)" stroke="rgba(62,230,255,0.6)" strokeWidth="1.2" />
        <circle cx={CX} cy={CY} r={84} fill="none" stroke="rgba(190,247,255,0.5)" strokeWidth="0.6" strokeDasharray="120 400" className="spin-a" />
      </svg>

      <div className="core-center">
        <motion.div
          key={pulse}
          className="core-text"
          initial={pulse && !reduce ? { scale: 1.12, filter: 'brightness(1.8)' } : false}
          animate={{ scale: 1, filter: 'brightness(1)' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="core-one">1%</div>
          <div className="core-sub">BETTER</div>
          <div className="core-sub">EVERY DAY</div>
        </motion.div>
        <AnimatePresence>
          {pulse > 0 && !reduce && (
            <motion.span
              key={pulse}
              className="core-shock"
              initial={{ scale: 0.6, opacity: 0.9 }}
              animate={{ scale: 2.6, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
