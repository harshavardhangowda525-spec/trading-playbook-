import { useMemo, useState, type JSX } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CandlestickChart, Download, ExternalLink, Play, Trash2, X } from 'lucide-react';
import { EmptyState, Modal, RingMeter } from '../ui';
import { useCollection } from '../../lib/hooks';
import { download, mistakeLabel, MISTAKES, type MistakeKey } from '../../lib/journal';
import { DATASETS, INTERVALS, type Dataset, type Interval } from '../../lib/market';
import { CHALLENGES_COL, SESSIONS_COL, plannedRRFor, type ChallengeDoc, type PracticeSession } from '../../lib/practice';
import { formatLong } from '../../lib/dates';
import '../../styles/practice-insights.css';

// ─── Helpers ───────────────────────────────────────────────────────────────

type ResultKind = 'target' | 'stop' | 'manual' | 'notfilled' | 'open' | 'notrade';
const RESULT_OPTS: { key: ResultKind; label: string }[] = [
  { key: 'target', label: 'Target' },
  { key: 'stop', label: 'Stop' },
  { key: 'manual', label: 'Manual exit' },
  { key: 'notfilled', label: 'Not filled' },
  { key: 'open', label: 'Still open' },
  { key: 'notrade', label: 'No trade' },
];
type DecisionFilter = '' | 'long' | 'short' | 'notrade';
type Band = '' | 'high' | 'mid' | 'low';

function resultKind(s: PracticeSession): ResultKind {
  if (s.decision === 'notrade') return 'notrade';
  switch (s.outcome?.exitReason) {
    case 'target':
      return 'target';
    case 'stop':
      return 'stop';
    case 'manual':
      return 'manual';
    case 'not-filled':
      return 'notfilled';
    default:
      return 'open';
  }
}
const resultLabelOf = (k: ResultKind) => RESULT_OPTS.find((r) => r.key === k)!.label;
const decisionLabel = (s: PracticeSession) =>
  s.decision === 'long' ? 'Long' : s.decision === 'short' ? 'Short' : s.decision === 'notrade' ? 'No trade' : 'Undecided';
const intervalLabel = (i: Interval) => INTERVALS.find((x) => x.key === i)?.label ?? i;
const fmtR = (r: number) => `${r > 0 ? '+' : r < 0 ? '−' : ''}${Math.abs(r).toFixed(2)}R`;
const sortSessions = (xs: PracticeSession[]) =>
  [...xs].sort((a, b) => (a.date === b.date ? b.createdAt - a.createdAt : a.date < b.date ? 1 : -1));

function sessionsCSV(sessions: PracticeSession[]): string {
  const esc = (v: unknown) => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = [
    'id',
    'date',
    'status',
    'source',
    'market',
    'timeframe',
    'strategy',
    'decision',
    'entry',
    'stop',
    'target',
    'plannedRR',
    'result',
    'simulatedR',
    'processScore',
    'confidence',
    'noTradeReason',
    'mistakes',
    'reason',
  ];
  const rows = sortSessions(sessions).map((s) => [
    s.id,
    s.date,
    s.status,
    s.ref?.source ?? '',
    s.market,
    s.interval,
    s.strategyName,
    s.decision ?? '',
    s.entry,
    s.stop,
    s.target,
    plannedRRFor(s)?.toFixed(2),
    s.status === 'complete' ? resultLabelOf(resultKind(s)) : 'In progress',
    s.outcome?.resultR != null ? s.outcome.resultR.toFixed(2) : '',
    s.score?.total,
    s.confidence,
    s.noTradeReason,
    s.mistakes.map(mistakeLabel).join('; '),
    s.reason,
  ]);
  return [header.join(','), ...rows.map((r) => r.map(esc).join(','))].join('\n');
}

const ease = [0.22, 1, 0.36, 1] as const;

// ─── Component ─────────────────────────────────────────────────────────────

export function PracticeLibrary(): JSX.Element {
  const navigate = useNavigate();
  const sessionsCol = useCollection<PracticeSession>(SESSIONS_COL);
  const challengesCol = useCollection<ChallengeDoc>(CHALLENGES_COL);
  const datasetsCol = useCollection<Dataset>(DATASETS);
  const sessions = sessionsCol.items;

  const [market, setMarket] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [tf, setTf] = useState<Interval | ''>('');
  const [strategy, setStrategy] = useState('');
  const [decision, setDecision] = useState<DecisionFilter>('');
  const [result, setResult] = useState<ResultKind | ''>('');
  const [band, setBand] = useState<Band>('');
  const [mistake, setMistake] = useState<MistakeKey | ''>('');

  const [toDelete, setToDelete] = useState<PracticeSession | null>(null);
  const [clearOpen, setClearOpen] = useState(false);
  const [clearText, setClearText] = useState('');
  const [alsoDatasets, setAlsoDatasets] = useState(false);

  const options = useMemo(() => {
    const markets = [...new Set(sessions.map((s) => s.market).filter(Boolean))].sort();
    const strategies = [...new Set(sessions.map((s) => s.strategyName).filter(Boolean))].sort();
    const tfs = INTERVALS.filter((i) => sessions.some((s) => s.interval === i.key));
    return { markets, strategies, tfs };
  }, [sessions]);

  const filtered = useMemo(() => {
    return sortSessions(
      sessions.filter((s) => {
        if (market && s.market !== market) return false;
        if (from && s.date < from) return false;
        if (to && s.date > to) return false;
        if (tf && s.interval !== tf) return false;
        if (strategy && s.strategyName !== strategy) return false;
        if (decision && s.decision !== decision) return false;
        if (result && (s.status === 'complete' || s.decision === 'notrade' ? resultKind(s) : 'open') !== result) return false;
        if (band) {
          const sc = s.score?.total;
          if (sc == null) return false;
          if (band === 'high' && sc < 80) return false;
          if (band === 'mid' && (sc < 60 || sc >= 80)) return false;
          if (band === 'low' && sc >= 60) return false;
        }
        if (mistake && !s.mistakes.includes(mistake)) return false;
        return true;
      }),
    );
  }, [sessions, market, from, to, tf, strategy, decision, result, band, mistake]);

  const anyFilter = !!(market || from || to || tf || strategy || decision || result || band || mistake);
  const clearFilters = () => {
    setMarket('');
    setFrom('');
    setTo('');
    setTf('');
    setStrategy('');
    setDecision('');
    setResult('');
    setBand('');
    setMistake('');
  };

  const open = (s: PracticeSession) => navigate(`/trading/replay?session=${encodeURIComponent(s.id)}`);

  const exportAll = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    const lean = sessions.map(({ image: _image, ...rest }) => rest);
    download(`practice-history-${stamp}.json`, JSON.stringify(lean, null, 2), 'application/json');
    setTimeout(() => download(`practice-summary-${stamp}.csv`, sessionsCSV(sessions), 'text/csv'), 300);
  };

  const closeClear = () => {
    setClearOpen(false);
    setClearText('');
    setAlsoDatasets(false);
  };
  const doClear = () => {
    if (clearText.trim() !== 'CLEAR') return;
    sessions.forEach((s) => sessionsCol.remove(s.id));
    challengesCol.items.forEach((c) => challengesCol.remove(c.id));
    if (alsoDatasets) datasetsCol.items.forEach((d) => datasetsCol.remove(d.id));
    closeClear();
    clearFilters();
  };

  return (
    <div className="px-root">
      <div className="px-head">
        <div className="px-head-text">
          <span className="px-label">Practice library</span>
          <p>Every replay session you have run, with its decision, simulated result and process score. Educational simulation only.</p>
        </div>
        <div className="px-actions">
          <button className="btn btn-sm btn-ghost" onClick={exportAll} disabled={!sessions.length}>
            <Download size={14} /> Export practice history
          </button>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => setClearOpen(true)}
            disabled={!sessions.length && !challengesCol.items.length && !datasetsCol.items.length}
          >
            <Trash2 size={14} /> Clear practice data
          </button>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="glass px-panel">
          <EmptyState
            icon={<CandlestickChart size={22} strokeWidth={1.4} />}
            title="No practice sessions yet"
            text="Start a historical replay, make a simulated decision and review your process. Sessions appear here."
            action={
              <button className="btn btn-sm btn-primary" onClick={() => navigate('/trading/replay')}>
                <Play size={14} /> Start a replay
              </button>
            }
          />
        </div>
      ) : (
        <>
          <motion.div
            className="glass px-panel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <div className="px-filters">
              <label className="px-filter">
                <span className="px-label">Market</span>
                <select className="select" value={market} onChange={(e) => setMarket(e.target.value)}>
                  <option value="">All markets</option>
                  {options.markets.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>
              <label className="px-filter">
                <span className="px-label">From</span>
                <input className="input" type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} />
              </label>
              <label className="px-filter">
                <span className="px-label">To</span>
                <input className="input" type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} />
              </label>
              <label className="px-filter">
                <span className="px-label">Timeframe</span>
                <select className="select" value={tf} onChange={(e) => setTf(e.target.value as Interval | '')}>
                  <option value="">All timeframes</option>
                  {options.tfs.map((i) => (
                    <option key={i.key} value={i.key}>
                      {i.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="px-filter">
                <span className="px-label">Strategy</span>
                <select className="select" value={strategy} onChange={(e) => setStrategy(e.target.value)}>
                  <option value="">All strategies</option>
                  {options.strategies.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="px-filter">
                <span className="px-label">Decision</span>
                <select className="select" value={decision} onChange={(e) => setDecision(e.target.value as DecisionFilter)}>
                  <option value="">All decisions</option>
                  <option value="long">Long</option>
                  <option value="short">Short</option>
                  <option value="notrade">No trade</option>
                </select>
              </label>
              <label className="px-filter">
                <span className="px-label">Result</span>
                <select className="select" value={result} onChange={(e) => setResult(e.target.value as ResultKind | '')}>
                  <option value="">All results</option>
                  {RESULT_OPTS.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="px-filter">
                <span className="px-label">Process score</span>
                <select className="select" value={band} onChange={(e) => setBand(e.target.value as Band)}>
                  <option value="">Any score</option>
                  <option value="high">≥ 80</option>
                  <option value="mid">60 – 79</option>
                  <option value="low">&lt; 60</option>
                </select>
              </label>
              <label className="px-filter">
                <span className="px-label">Mistake</span>
                <select className="select" value={mistake} onChange={(e) => setMistake(e.target.value as MistakeKey | '')}>
                  <option value="">Any mistake</option>
                  {MISTAKES.map((m) => (
                    <option key={m.key} value={m.key}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="px-filter-foot">
              <span className="px-sub">
                Showing {filtered.length} of {sessions.length}
              </span>
              <button className="btn btn-sm btn-ghost" onClick={clearFilters} disabled={!anyFilter}>
                <X size={13} /> Clear filters
              </button>
            </div>
          </motion.div>

          {filtered.length === 0 ? (
            <div className="glass px-panel">
              <EmptyState title="No sessions match" text="Try widening the filters." />
            </div>
          ) : (
            <div className="px-list">
              {filtered.map((s, i) => (
                <SessionRow key={s.id} s={s} i={i} onOpen={() => open(s)} onDelete={() => setToDelete(s)} />
              ))}
            </div>
          )}
        </>
      )}

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete practice session"
        footer={
          <>
            <button className="btn btn-sm btn-ghost" onClick={() => setToDelete(null)}>
              Cancel
            </button>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => {
                if (toDelete) sessionsCol.remove(toDelete.id);
                setToDelete(null);
              }}
            >
              <Trash2 size={14} /> Delete
            </button>
          </>
        }
      >
        <div className="px-modal-body">
          <p>
            Delete the {toDelete?.market} · {toDelete ? intervalLabel(toDelete.interval) : ''} session from{' '}
            {toDelete ? formatLong(toDelete.date) : ''}? Its drawings, decision and review are removed. This cannot be undone.
          </p>
        </div>
      </Modal>

      <Modal
        open={clearOpen}
        onClose={closeClear}
        title="Clear practice data"
        footer={
          <>
            <button className="btn btn-sm btn-ghost" onClick={closeClear}>
              Cancel
            </button>
            <button className="btn btn-sm btn-danger" onClick={doClear} disabled={clearText.trim() !== 'CLEAR'}>
              <Trash2 size={14} /> Clear everything
            </button>
          </>
        }
      >
        <div className="px-modal-body">
          <p>
            This removes all {sessions.length} practice session{sessions.length === 1 ? '' : 's'} and {challengesCol.items.length} daily
            challenge record{challengesCol.items.length === 1 ? '' : 's'}. Consider exporting your practice history first. This cannot be undone.
          </p>
          <label className="px-check">
            <input type="checkbox" checked={alsoDatasets} onChange={(e) => setAlsoDatasets(e.target.checked)} />
            Also remove {datasetsCol.items.length} imported dataset{datasetsCol.items.length === 1 ? '' : 's'}
          </label>
          <label className="px-filter">
            <span className="px-label">Type CLEAR to confirm</span>
            <input
              className="input"
              value={clearText}
              onChange={(e) => setClearText(e.target.value)}
              placeholder="CLEAR"
              autoComplete="off"
              onKeyDown={(e) => e.key === 'Enter' && doClear()}
            />
          </label>
        </div>
      </Modal>
    </div>
  );
}

// ─── Row ───────────────────────────────────────────────────────────────────

function SessionRow({ s, i, onOpen, onDelete }: { s: PracticeSession; i: number; onOpen: () => void; onDelete: () => void }) {
  const complete = s.status === 'complete';
  const kind = resultKind(s);
  const r = s.outcome?.resultR;
  const top = s.mistakes[0];
  return (
    <motion.div
      className="glass px-row"
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && e.target === e.currentTarget && onOpen()}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(i, 12) * 0.035, ease }}
    >
      <div className="px-thumb">{s.image ? <img src={s.image} alt="" loading="lazy" /> : <CandlestickChart size={18} strokeWidth={1.3} />}</div>

      <div className="px-row-main">
        <span className="px-row-title">
          {s.market} · {intervalLabel(s.interval)}
        </span>
        <span className="px-row-meta">
          <span>{formatLong(s.date)}</span>
          <i className="dot" />
          <span>{s.strategyName || 'No strategy'}</span>
          <i className="dot" />
          <span>{decisionLabel(s)}</span>
        </span>
      </div>

      <div className="px-row-result">
        {!complete ? (
          <>
            <span className="badge dim">In progress</span>
            <span className="px-sim">Simulation</span>
          </>
        ) : kind === 'notrade' ? (
          <>
            <span className="px-r dim">No trade</span>
            <span className="px-row-mistake">{top ? mistakeLabel(top) : s.noTradeReason || '—'}</span>
          </>
        ) : (
          <>
            <span className="px-r">{r != null ? fmtR(r) : resultLabelOf(kind)}</span>
            <span className="px-sim">
              Simulated · {resultLabelOf(kind)}
            </span>
            {top && <span className="px-row-mistake">{mistakeLabel(top)}</span>}
          </>
        )}
      </div>

      <div className="px-score" title="Process score">
        {s.score ? (
          <RingMeter value={s.score.total / 100} size={40} stroke={2}>
            <span className="px-ring-num">{s.score.total}</span>
          </RingMeter>
        ) : (
          <span className="px-score-empty">—</span>
        )}
      </div>

      <div className="px-row-actions" onClick={(e) => e.stopPropagation()}>
        <button className="btn btn-sm btn-ghost" onClick={onOpen}>
          {complete ? <ExternalLink size={13} /> : <Play size={13} />} {complete ? 'Open' : 'Resume'}
        </button>
        <button className="icon-btn" onClick={onDelete} aria-label="Delete session" title="Delete">
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
}
