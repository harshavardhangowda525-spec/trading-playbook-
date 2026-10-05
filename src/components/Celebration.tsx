import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { celebrations, corePulse, type Celebration } from '../lib/events';

type Toast = { key: number; title: string; line?: string; major: boolean };

/**
 * Quiet completion feedback. Every ticked task shows a brief "COMPLETED";
 * finishing a session or the whole day shows a slightly longer message.
 */
export function CelebrationOverlay() {
  const [toast, setToast] = useState<Toast | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const offPulse = corePulse.on(() =>
      setToast((t) => (t?.major ? t : { key: Date.now(), title: 'COMPLETED', major: false })),
    );
    const offCel = celebrations.on((c: Celebration) =>
      setToast({
        key: Date.now(),
        title: c.kind === 'day' ? 'DAY COMPLETE' : c.kind === 'session' ? 'SESSION COMPLETE' : 'LESSON COMPLETE',
        line: c.kind === 'day' ? 'System status: optimal' : c.lines[c.lines.length - 1]?.replace('IMPROVEMENT', 'improvement'),
        major: true,
      }),
    );
    return () => {
      offPulse();
      offCel();
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), toast.major ? 3200 : 1700);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.key}
          className="completion-toast"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 14, x: '-50%', filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, x: '-50%', filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: 8, x: '-50%', filter: 'blur(4px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg className="ring" viewBox="0 0 36 36" aria-hidden>
            <defs>
              <linearGradient id="toast-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#c4b9e6" />
                <stop offset="1" stopColor="#ecdcb6" />
              </linearGradient>
            </defs>
            <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(236,228,214,0.12)" strokeWidth="1.5" />
            <motion.circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="url(#toast-g)"
              strokeWidth="1.5"
              strokeLinecap="round"
              transform="rotate(-90 18 18)"
              initial={{ pathLength: reduce ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.path
              d="M12 18.5l4 4 8-9"
              fill="none"
              stroke="#f1ece4"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: reduce ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            />
          </svg>
          <div>
            <div className="t-title">{toast.title}</div>
            {toast.line && <div className="t-line">{toast.line}</div>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
