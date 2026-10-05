import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { corePulse } from '../lib/events';

/**
 * A suspended sphere of architectural glass. Light drifts slowly inside it;
 * completing a task makes it breathe once.
 */
export function GlassOrb({ value = '01%', caption = 'BECOME BETTER' }: { value?: string; caption?: string }) {
  const reduce = useReducedMotion();
  const [pulse, setPulse] = useState(0);
  useEffect(() => corePulse.on(() => setPulse((p) => p + 1)), []);

  return (
    <div className="orb-stage">
      {/* orbit lines with the system philosophy */}
      <svg className="orb-orbits" viewBox="0 0 500 500" aria-hidden>
        <defs>
          <path id="orb-text-a" d="M 250 250 m -222 0 a 222 222 0 1 1 444 0 a 222 222 0 1 1 -444 0" />
        </defs>
        <ellipse cx="250" cy="250" rx="238" ry="74" className="orb-orbit o1" />
        <ellipse cx="250" cy="250" rx="214" ry="210" className="orb-orbit o2" />
        <g className="orb-words">
          <text>
            <textPath href="#orb-text-a" startOffset="4%">
              LEARN — EXECUTE
            </textPath>
          </text>
          <text>
            <textPath href="#orb-text-a" startOffset="54%">
              REVIEW — IMPROVE
            </textPath>
          </text>
        </g>
      </svg>

      <motion.div
        key={pulse}
        className="orb"
        initial={pulse && !reduce ? { scale: 1.035 } : false}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="orb-light" />
        <div className="orb-caustic" />
        <div className="orb-rim" />
        <div className="orb-text">
          <div className="orb-value">{value}</div>
          <div className="orb-caption">{caption}</div>
        </div>
        {pulse > 0 && !reduce && (
          <motion.div
            className="orb-flash"
            initial={{ opacity: 0.55 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
          />
        )}
      </motion.div>
      <div className="orb-shadow" />
    </div>
  );
}
