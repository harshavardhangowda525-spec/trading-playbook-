import { useMemo, type JSX } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Grid3x3 } from 'lucide-react';
import { EmptyState, cx } from '../ui';
import { useCollection, useToday } from '../../lib/hooks';
import { SESSIONS_COL, nextImprovement, practiceMistakeCounts, type PracticeSession } from '../../lib/practice';
import { addDays, fromKey, startOfWeek } from '../../lib/dates';
import '../../styles/practice-insights.css';

const WEEKS = 8;
const ease = [0.22, 1, 0.36, 1] as const;
const shortDate = (key: string) => fromKey(key).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

export function MistakeHeatmap(): JSX.Element {
  const today = useToday();
  const sessions = useCollection<PracticeSession>(SESSIONS_COL).items;

  const data = useMemo(() => {
    const complete = sessions.filter((s) => s.status === 'complete');
    const thisWeek = startOfWeek(today);
    const weeks = Array.from({ length: WEEKS }, (_, i) => addDays(thisWeek, (i - (WEEKS - 1)) * 7));
    const first = weeks[0];
    const inWindow = complete.filter((s) => s.date >= first && s.date <= addDays(thisWeek, 6));
    const rows = practiceMistakeCounts(inWindow).map((m) => ({
      key: m.key,
      label: m.label,
      total: m.count,
      cells: weeks.map((w) => inWindow.filter((s) => startOfWeek(s.date) === w && s.mistakes.includes(m.key)).length),
    }));
    const max = Math.max(1, ...rows.flatMap((r) => r.cells));
    return { weeks, rows, max, sessionsInWindow: inWindow.length };
  }, [sessions, today]);

  const improvement = useMemo(() => nextImprovement(sessions), [sessions]);

  return (
    <div className="px-root">
      <motion.section
        className="glass px-improve"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <span className="px-label">
          <Sparkles size={12} style={{ verticalAlign: '-2px', marginRight: 8 }} />
          Your next 1% improvement
        </span>
        {improvement ? (
          <>
            <p className="px-improve-head">{improvement.headline}</p>
            <p className="px-improve-focus">{improvement.focus}</p>
            <span className="px-sub">From your practice sessions</span>
          </>
        ) : (
          <>
            <p className="px-improve-head">No recurring mistakes yet.</p>
            <span className="px-sub">Complete and review replay sessions — confirmed mistakes will shape your next focus.</span>
          </>
        )}
      </motion.section>

      <motion.section
        className="glass px-panel"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08, ease }}
      >
        <div className="px-panel-head">
          <span className="px-label">Mistake heatmap · last {WEEKS} weeks</span>
          <span className="px-sub">From your practice sessions · {data.sessionsInWindow} completed</span>
        </div>
        {data.rows.length === 0 ? (
          <EmptyState
            icon={<Grid3x3 size={22} strokeWidth={1.4} />}
            title="No mistakes recorded"
            text="Mistakes you confirm when reviewing a replay session appear here by week."
          />
        ) : (
          <div className="px-heat-wrap">
            <div className="px-heat" role="table" aria-label="Mistakes by week">
              <span className="px-heat-col" style={{ textAlign: 'left' }} role="columnheader">
                Mistake
              </span>
              {data.weeks.map((w) => (
                <span key={w} className="px-heat-col" role="columnheader">
                  {shortDate(w)}
                </span>
              ))}
              {data.rows.map((r, ri) => (
                <Row key={r.key} label={r.label} total={r.total} cells={r.cells} weeks={data.weeks} max={data.max} ri={ri} />
              ))}
            </div>
          </div>
        )}
      </motion.section>
    </div>
  );
}

function Row({ label, total, cells, weeks, max, ri }: { label: string; total: number; cells: number[]; weeks: string[]; max: number; ri: number }) {
  return (
    <>
      <span className="px-heat-row" role="rowheader" title={`${label} · ${total} total`}>
        {label}
      </span>
      {cells.map((c, i) => (
        <motion.span
          key={weeks[i]}
          role="cell"
          className={cx('px-cell', c > 0 && 'on')}
          style={{ ['--lvl' as string]: c / max }}
          title={`${label} · week of ${shortDate(weeks[i])}: ${c}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 + ri * 0.04 + i * 0.02, ease }}
        >
          {c > 0 ? c : ''}
        </motion.span>
      ))}
    </>
  );
}
