import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, CircleDashed, CircleDot, Circle } from 'lucide-react';
import { LESSONS_BY_DAY, PHASES, phaseFor } from '../data/curriculum';
import { journeyState, type DayState, type JourneyDay } from '../lib/domain';
import { cx } from './ui';
import '../styles/learn.css';

const STATE_LABEL: Record<DayState, string> = {
  complete: 'Complete',
  current: 'Today',
  missed: 'Missed — complete anytime',
  future: 'Upcoming',
};

/** Small status icon for a lesson row. */
export function StateIcon({ state, size = 16 }: { state: DayState; size?: number }) {
  const Icon = state === 'complete' ? CheckCircle2 : state === 'current' ? CircleDot : state === 'missed' ? CircleDashed : Circle;
  return <Icon size={size} className={cx('st-icon', state)} aria-label={STATE_LABEL[state]} />;
}

export { STATE_LABEL };

/** Holographic 84-day map: 12 phase rows × 7 day nodes. */
export function JourneyTimeline({
  current,
  days,
  compact,
  onSelect,
}: {
  current: number;
  days: Map<number, JourneyDay>;
  compact?: boolean;
  onSelect?: (day: number) => void;
}) {
  const reduce = useReducedMotion();
  const currentPhase = phaseFor(current).num;
  return (
    <div>
      <div className={cx('jt', compact && 'compact')} role="list" aria-label="84-day journey">
        {PHASES.map((p) => {
          const dayNums = Array.from({ length: p.days[1] - p.days[0] + 1 }, (_, i) => p.days[0] + i);
          const states = dayNums.map((d) => journeyState(d, current, days.get(d)));
          return (
            <div key={p.num} className={cx('jt-row', p.num === currentPhase && 'active')} role="listitem">
              <div className="jt-phase" title={`Phase ${p.code} — ${p.name}`}>
                <b>{p.code}</b>
                {!compact && <span className="name">{p.short}</span>}
              </div>
              <div className="jt-track">
                <span className="jt-seg" style={{ left: `${(0.5 / 7) * 100}%`, width: `${(6 / 7) * 100}%` }} />
                {states.slice(0, -1).map((s, i) =>
                  s === 'complete' && (states[i + 1] === 'complete' || states[i + 1] === 'current') ? (
                    <span key={i} className="jt-seg lit" style={{ left: `${((i + 0.5) / 7) * 100}%`, width: `${(1 / 7) * 100}%` }} />
                  ) : null,
                )}
                {dayNums.map((d, i) => {
                  const s = states[i];
                  const lesson = LESSONS_BY_DAY[d - 1];
                  return (
                    <motion.button
                      key={d}
                      type="button"
                      className={cx('jt-node', s)}
                      title={`Day ${d} · ${lesson?.title ?? ''} · ${STATE_LABEL[s]}`}
                      aria-label={`Day ${d}: ${lesson?.title ?? ''} (${STATE_LABEL[s]})`}
                      onClick={() => onSelect?.(d)}
                      initial={reduce ? false : { opacity: 0, scale: 0.4 }}
                      animate={{ opacity: s === 'future' ? 0.55 : 1, scale: 1 }}
                      transition={{ delay: reduce ? 0 : d * 0.006, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      whileTap={reduce ? undefined : { scale: 0.88 }}
                    >
                      {d}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {!compact && (
        <div className="jt-legend">
          <span>
            <i className="complete" /> Complete
          </span>
          <span>
            <i className="current" /> Today
          </span>
          <span>
            <i className="missed" /> Missed — never resets the journey
          </span>
          <span>
            <i className="future" /> Upcoming
          </span>
        </div>
      )}
    </div>
  );
}
