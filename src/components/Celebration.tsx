import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { celebrations, type Celebration } from '../lib/events';

/** Short holographic overlay for MISSION COMPLETE / DAY COMPLETE events. */
export function CelebrationOverlay() {
  const [current, setCurrent] = useState<(Celebration & { key: number }) | null>(null);
  const reduce = useReducedMotion();

  useEffect(
    () =>
      celebrations.on((c) => {
        setCurrent({ ...c, key: Date.now() });
      }),
    [],
  );

  useEffect(() => {
    if (!current) return;
    const t = setTimeout(() => setCurrent(null), reduce ? 1800 : 2800);
    return () => clearTimeout(t);
  }, [current, reduce]);

  const sparks = Array.from({ length: 22 }, (_, i) => i);

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key={current.key}
          className="celebration"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setCurrent(null)}
        >
          <div className="celebration-inner">
            {!reduce && (
              <svg className="celebration-rings" viewBox="0 0 300 300" aria-hidden>
                <motion.circle cx="150" cy="150" r="120" fill="none" stroke="rgba(62,230,255,0.35)" strokeWidth="1"
                  initial={{ pathLength: 0, rotate: -90 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: 'easeOut' }} />
                <motion.circle cx="150" cy="150" r="98" fill="none" stroke="rgba(62,230,255,0.8)" strokeWidth="3" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                  style={{ filter: 'drop-shadow(0 0 8px rgba(62,230,255,0.9))' }} />
                <motion.circle cx="150" cy="150" r="140" fill="none" stroke="rgba(62,230,255,0.25)" strokeDasharray="2 8"
                  initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1.15, opacity: [0, 1, 0] }} transition={{ duration: 1.8 }} />
              </svg>
            )}
            {!reduce &&
              sparks.map((i) => {
                const angle = (i / sparks.length) * Math.PI * 2;
                return (
                  <motion.span
                    key={i}
                    className="celebration-spark"
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{ x: Math.cos(angle) * (130 + (i % 3) * 30), y: Math.sin(angle) * (130 + (i % 3) * 30), opacity: 0 }}
                    transition={{ duration: 1.4, delay: 0.2, ease: 'easeOut' }}
                  />
                );
              })}
            <motion.div
              className="celebration-title glitch-once"
              initial={{ opacity: 0, letterSpacing: '0.6em' }}
              animate={{ opacity: 1, letterSpacing: '0.22em' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {current.title}
            </motion.div>
            {current.lines.map((line, i) => (
              <motion.div
                key={line}
                className={i === current.lines.length - 1 ? 'celebration-big' : 'celebration-line'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.25 }}
              >
                {line}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
