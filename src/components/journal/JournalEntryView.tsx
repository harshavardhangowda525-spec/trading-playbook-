import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Copy, PenLine, Trash2 } from 'lucide-react';
import { RingMeter, cx } from '../ui';
import { useCollection } from '../../lib/hooks';
import { formatLong } from '../../lib/dates';
import { C, type Strategy } from '../../lib/domain';
import {
  CHECKS,
  JOURNAL_COLLECTION,
  RESULTS,
  improvementFor,
  mistakeLabel,
  plannedRR,
  ruleScore,
  simulatedR,
  type JournalTradeEntry,
} from '../../lib/journal';

const ease = [0.22, 1, 0.36, 1] as const;
const block = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: 0.05 * i, ease },
});

const fmt = (n: number | null, d = 2) => (n == null ? '—' : n.toLocaleString(undefined, { maximumFractionDigits: d }));

const ANALYSIS: { key: keyof JournalTradeEntry; q: string }[] = [
  { key: 'why', q: 'Why did I consider this setup?' },
  { key: 'confirmed', q: 'What confirmed the setup?' },
  { key: 'structure', q: 'What was the market structure?' },
  { key: 'context', q: 'What indicators/context did I study?' },
  { key: 'expected', q: 'What was my expected outcome?' },
  { key: 'invalidation', q: 'What would invalidate the setup?' },
];

/** Complete read view of one journal entry. */
export function JournalEntryView({ entry: e }: { entry: JournalTradeEntry }) {
  const navigate = useNavigate();
  const [, setParams] = useSearchParams();
  const { remove } = useCollection<JournalTradeEntry>(JOURNAL_COLLECTION);
  const { items: strategies } = useCollection<Strategy>(C.strategies);
  const strategy = strategies.find((s) => s.id === e.strategyId);
  const [zoom, setZoom] = useState(false);
  const imp = improvementFor(e);
  const rr = plannedRR(e);
  const simR = simulatedR(e);
  const reviewed = Object.keys(e.checks).length > 0;
  const answered = ANALYSIS.filter((a) => String(e[a.key] ?? '').trim());
  const result = RESULTS.find((r) => r.key === e.result);

  return (
    <div className="tj-entry">
      <motion.div className="row between wrap" {...block(0)}>
        <Link to="/trading-journal/history" className="text-btn">
          <ArrowLeft size={13} /> History
        </Link>
        <div className="row">
          <button className="btn btn-sm" onClick={() => setParams({ edit: e.id })}>
            <PenLine size={13} /> Edit
          </button>
          <button className="btn btn-sm" onClick={() => setParams({ duplicate: e.id })}>
            <Copy size={13} /> Duplicate
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => {
              if (window.confirm('Delete this journal entry? This cannot be undone.')) {
                remove(e.id);
                navigate('/trading-journal/history');
              }
            }}
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </motion.div>

      <motion.header className="tj-entry-head" {...block(1)}>
        <div className="mono-label">
          {formatLong(e.date).toUpperCase()} · {e.session.toUpperCase()}
          {e.timeframe && ` · ${e.timeframe}`}
          {e.condition && ` · ${e.condition.toUpperCase()}`}
        </div>
        <h2 className="tj-entry-title">
          {e.market || 'Unnamed market'} <span className="dim">—</span> {e.setup || 'No setup'}
        </h2>
        <div className="row wrap" style={{ gap: 8 }}>
          <span className={cx('badge', e.direction === 'long' ? '' : 'dim')}>{e.direction.toUpperCase()}</span>
          {result && <span className={cx('badge', e.result === 'success' ? 'good' : e.result === 'fail' ? 'bad' : e.result === 'breakeven' ? 'warn' : 'dim')}>{result.label}</span>}
          {strategy && (
            <Link to="/strategy-lab" className="badge">
              Strategy · {strategy.name || 'Untitled'}
            </Link>
          )}
          <span className="badge dim">Simulation</span>
        </div>
      </motion.header>

      <motion.section className="glass pad tj-improve" {...block(2)}>
        <div className="mono-label">Today's 1% improvement</div>
        <p className="tj-quote">“{imp.lesson}”</p>
        <div className="mono-label" style={{ marginTop: 12 }}>
          Tomorrow's focus
        </div>
        <p className="tj-focus">{imp.focus}</p>
      </motion.section>

      <motion.section className="tj-numbers" {...block(3)}>
        {[
          ['Entry', fmt(e.entry, 6)],
          ['Stop loss', fmt(e.stop, 6)],
          ['Target', fmt(e.target, 6)],
          ['Simulated exit', fmt(e.exit, 6)],
          ['Planned R:R', rr == null ? '—' : `1:${rr.toFixed(2)}`],
          ['Simulated result', simR == null ? '—' : `${simR >= 0 ? '+' : ''}${simR.toFixed(2)}R`],
          ['Position size', e.size == null ? '—' : `${fmt(e.size)} (edu)`],
        ].map(([k, v]) => (
          <div key={k} className="tj-num">
            <div className="mono-label">{k}</div>
            <div className="tj-num-value">{v}</div>
          </div>
        ))}
      </motion.section>

      <div className="tj-entry-grid">
        <motion.section className="glass pad" {...block(4)}>
          <div className="panel-title">Setup analysis</div>
          {answered.length ? (
            <dl className="tj-qa">
              {answered.map((a) => (
                <div key={a.key}>
                  <dt>{a.q}</dt>
                  <dd className="pre">{String(e[a.key])}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="muted small">No analysis written.</p>
          )}
        </motion.section>

        <div className="col" style={{ gap: 18 }}>
          <motion.section className="glass pad" {...block(5)}>
            <div className="panel-title">
              Execution review
              {reviewed && <RingMeter value={ruleScore(e)} size={46} stroke={2} />}
            </div>
            <ul className="tj-checks">
              {CHECKS.map((c) => (
                <li key={c.key} className={e.checks[c.key] ? 'on' : ''}>
                  <span className="tj-check-mark">{e.checks[c.key] && <Check size={12} strokeWidth={2} />}</span>
                  {c.label}
                </li>
              ))}
            </ul>
          </motion.section>

          <motion.section className="glass pad" {...block(6)}>
            <div className="panel-title">Mindset check</div>
            <div className="row wrap" style={{ gap: 8, marginBottom: 14 }}>
              {e.mindset ? <span className="chip on">{e.mindset}</span> : <span className="muted small">Not recorded</span>}
            </div>
            <div className="tj-levels">
              {(
                [
                  ['Confidence', e.confidence],
                  ['Discipline', e.discipline],
                  ['Focus', e.focus],
                ] as const
              ).map(([k, v]) => (
                <div key={k}>
                  <div className="row between">
                    <span className="mono-label">{k}</span>
                    <span className="mono small">{v}/10</span>
                  </div>
                  <div className="tj-bar">
                    <i style={{ width: `${v * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section className="glass pad" {...block(7)}>
            <div className="panel-title">Mistakes</div>
            {e.mistakes.length ? (
              <div className="row wrap" style={{ gap: 8 }}>
                {e.mistakes.map((m) => (
                  <span key={m} className="chip on">
                    {m === 'other' && e.otherMistake ? e.otherMistake : mistakeLabel(m)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="muted small">No mistakes selected.</p>
            )}
          </motion.section>
        </div>
      </div>

      {e.image && (
        <motion.section className="glass pad tj-chart" {...block(8)}>
          <div className="panel-title">Chart</div>
          <motion.img
            src={e.image}
            alt="Chart screenshot"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8 }}
            onClick={() => setZoom(true)}
          />
          {e.imageNotes && <p className="pre muted small" style={{ marginTop: 12 }}>{e.imageNotes}</p>}
        </motion.section>
      )}

      <motion.section className="glass pad" {...block(9)}>
        <div className="panel-title">Result review</div>
        <dl className="tj-qa">
          {(
            [
              ['What happened?', e.happened],
              ['What did I learn?', e.learned],
              ['What will I improve next time?', e.improve],
            ] as const
          ).map(([q, a]) => (
            <div key={q}>
              <dt>{q}</dt>
              <dd className={cx('pre', !a.trim() && 'dim')}>{a.trim() || '—'}</dd>
            </div>
          ))}
        </dl>
      </motion.section>

      {zoom &&
        e.image &&
        createPortal(
          <div className="lightbox" onClick={() => setZoom(false)}>
            <img src={e.image} alt="Chart screenshot enlarged" />
          </div>,
          document.body,
        )}
    </div>
  );
}
