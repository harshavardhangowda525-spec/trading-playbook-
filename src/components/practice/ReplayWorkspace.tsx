import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BookOpen, ChevronsRight, Lock, NotebookPen, Pause, Play, RotateCcw, SkipForward, StepForward } from 'lucide-react';
import { PracticeChart, type PracticeChartHandle } from './PracticeChart';
import { DataSourcePicker } from './DataSourcePicker';
import { CountUp, EmptyState, HoloCheck, NumberInput, RingMeter, SegControl, Slider, cx } from '../ui';
import { useCollection } from '../../lib/hooks';
import { newId, store } from '../../lib/store';
import { todayKey } from '../../lib/dates';
import { pulseCore } from '../../lib/events';
import { C, type Strategy } from '../../lib/domain';
import { MISTAKES, type MistakeKey } from '../../lib/journal';
import { DATASETS, SOURCE_LABEL, fmtPrice, fmtTime, loadRef, type Candle, type DataRef, type Dataset } from '../../lib/market';
import {
  NO_TRADE_REASONS,
  SESSIONS_COL,
  TEMPLATES,
  blankSession,
  describeAfter,
  plannedRRFor,
  rulesFromStrategy,
  scoreSession,
  simulate,
  suggestMistakes,
  validateDecision,
  type Decision,
  type DrawKind,
  type PracticeSession,
} from '../../lib/practice';

const ease = [0.22, 1, 0.36, 1] as const;
const SPEEDS = [1, 2, 5, 10];
const REVIEW_MISTAKES: MistakeKey[] = ['fomo', 'early', 'late', 'confirmation', 'structure', 'risk', 'overtrading', 'rules', 'exit', 'nosetup'];

/** Candles stay in memory per session so replays don't refetch on every render. */
const candleCache = new Map<string, Candle[]>();

const save = (s: PracticeSession) => store.put(SESSIONS_COL, s.id, { ...s, updatedAt: Date.now() });

function startIndexFor(len: number, mode: PracticeSession['mode']): number {
  if (mode === 'historical') return Math.max(Math.min(len - 120, Math.floor(len * 0.7)), Math.floor(len / 2));
  return Math.max(Math.min(60, len - 40), Math.floor(len * 0.3));
}

export function ReplayWorkspace({ onImport }: { onImport: () => void }) {
  const [params, setParams] = useSearchParams();
  const sessionId = params.get('session');
  const { items: sessions } = useCollection<PracticeSession>(SESSIONS_COL);
  const { items: datasets } = useCollection<Dataset>(DATASETS);
  const session = sessions.find((s) => s.id === sessionId);
  const [candles, setCandles] = useState<Candle[] | null>(sessionId ? (candleCache.get(sessionId) ?? null) : null);
  const [error, setError] = useState<string | null>(null);

  // Reopen a stored session exactly: reload its candles from the saved reference.
  useEffect(() => {
    if (!session) return;
    const cached = candleCache.get(session.id);
    if (cached) {
      setCandles(cached);
      return;
    }
    let cancelled = false;
    setCandles(null);
    setError(null);
    loadRef(session.ref, datasets)
      .then((c) => {
        if (cancelled) return;
        candleCache.set(session.id, c);
        setCandles(c);
      })
      .catch((e: Error) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.id]);

  if (!sessionId) return <Setup onImport={onImport} onStart={(id) => setParams({ session: id })} />;
  if (!session) return <EmptyState title="Session not found" text="It may have been deleted." action={<Link className="btn btn-sm" to="/trading/replay">New replay</Link>} />;
  if (error)
    return (
      <div className="glass pad pl-unavailable">
        <div className="mono-label">Historical data unavailable</div>
        <p>{error}</p>
        <div className="row wrap">
          <button className="btn btn-sm" onClick={onImport}>
            Import historical data
          </button>
          <Link className="btn btn-sm btn-ghost" to="/trading/replay">
            New replay
          </Link>
        </div>
      </div>
    );
  if (!candles) return <div className="pl-loading mono">LOADING HISTORICAL CANDLES…</div>;
  return <Workspace key={session.id} session={session} candles={candles} review={params.get('step') === 'review'} />;
}

// ─── Setup ─────────────────────────────────────────────────────────────────

function useStrategyOptions() {
  const { items: strategies } = useCollection<Strategy>(C.strategies);
  return useMemo(
    () => [
      ...strategies.map((s) => ({ id: s.id, name: s.name || 'Untitled strategy', rules: rulesFromStrategy(s), mine: true })),
      ...TEMPLATES.map((t) => ({ ...t, mine: false })),
    ],
    [strategies],
  );
}

function Setup({ onStart, onImport }: { onStart: (id: string) => void; onImport: () => void }) {
  const [params] = useSearchParams();
  const [mode, setMode] = useState<PracticeSession['mode']>(params.get('mode') === 'historical' ? 'historical' : 'simulation');
  const options = useStrategyOptions();
  const [strategyId, setStrategyId] = useState('');

  const start = (ref: DataRef, candles: Candle[], market: string) => {
    const id = newId();
    const opt = options.find((o) => o.id === strategyId);
    const startIndex = startIndexFor(candles.length, mode);
    const s: PracticeSession = {
      ...blankSession(),
      id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      date: todayKey(),
      mode,
      ref,
      market,
      interval: ref.interval,
      startIndex,
      revealed: startIndex,
      strategyId: opt?.id ?? '',
      strategyName: opt?.name ?? 'Practice without strategy',
      strategyRules: opt?.rules ?? [],
    };
    candleCache.set(id, candles);
    save(s);
    onStart(id);
  };

  return (
    <div className="pl-setup">
      <motion.section className="glass pad" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
        <div className="mono-label">1 · Mode</div>
        <div style={{ marginTop: 12 }}>
          <SegControl
            value={mode}
            onChange={setMode}
            options={[
              { value: 'simulation', label: 'Simulation · candle by candle' },
              { value: 'historical', label: 'Historical practice · one decision' },
            ]}
          />
        </div>
        <p className="small muted" style={{ margin: '10px 0 0' }}>
          {mode === 'simulation'
            ? 'Replay the market one candle at a time, decide when you are ready, then manage the simulated trade as it unfolds.'
            : 'Study the chart up to a point, make one decision, then reveal what happened next.'}
        </p>
        <div className="mono-label" style={{ marginTop: 22 }}>
          2 · Select strategy
        </div>
        <div className="pl-strategies">
          <button className={cx('chip', !strategyId && 'on')} onClick={() => setStrategyId('')}>
            Practice without strategy
          </button>
          {options.map((o) => (
            <button key={o.id} className={cx('chip', strategyId === o.id && 'on')} onClick={() => setStrategyId(o.id)} title={o.mine ? 'From your Strategy Lab' : 'Practice template'}>
              {o.name}
              {o.mine && <span className="pl-mine">yours</span>}
            </button>
          ))}
        </div>
        {strategyId && (
          <ul className="pl-rule-preview">
            {options.find((o) => o.id === strategyId)?.rules.map((r) => <li key={r.key}>{r.label}</li>)}
          </ul>
        )}
        <p className="tiny dim" style={{ marginTop: 10 }}>
          Your own strategies come from the <Link to="/strategy-lab">Strategy Lab</Link>. Templates are generic practice rule-sets.
        </p>
      </motion.section>
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08, ease }}>
        <div className="mono-label" style={{ marginBottom: 10 }}>
          3 · Historical chart
        </div>
        <DataSourcePicker onLoad={start} />
        <button className="text-btn" style={{ marginTop: 12 }} onClick={onImport}>
          Import your own dataset <ArrowRight size={12} />
        </button>
      </motion.section>
    </div>
  );
}

// ─── Replay + decision + review ────────────────────────────────────────────

function Workspace({ session: s, candles, review }: { session: PracticeSession; candles: Candle[]; review: boolean }) {
  const navigate = useNavigate();
  const [, setParams] = useSearchParams();
  const reduce = useReducedMotion();
  const chart = useRef<PracticeChartHandle>(null);
  const [visible, setVisible] = useState(Math.min(Math.max(s.revealed, s.startIndex), candles.length));
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [tool, setTool] = useState<DrawKind | 'cursor'>('cursor');
  const options = useStrategyOptions();

  // Decision draft (unlocked)
  const last = candles[visible - 1];
  const [draft, setDraft] = useState<{ d: Decision | null; entry: number | null; stop: number | null; target: number | null }>({ d: null, entry: null, stop: null, target: null });
  const [reason, setReason] = useState(s.reason);
  const [confidence, setConfidence] = useState(s.confidence);
  const [ntReason, setNtReason] = useState(s.noTradeReason);
  const [ntOther, setNtOther] = useState(s.noTradeOther);
  const [errors, setErrors] = useState<string[]>([]);

  const locked = s.decision != null && s.decisionIndex != null;
  const end = visible >= candles.length;

  // Persist replay progress (throttled).
  const lastSaved = useRef(s.revealed);
  useEffect(() => {
    if (Math.abs(visible - lastSaved.current) >= 5 || !playing) {
      if (visible !== lastSaved.current) {
        lastSaved.current = visible;
        save({ ...(store.get<PracticeSession>(SESSIONS_COL, s.id) ?? s), revealed: visible });
      }
    }
  }, [visible, playing, s]);

  // Playback
  const canPlay = s.mode === 'simulation' || locked;
  useEffect(() => {
    if (!playing) return;
    if (end) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setVisible((v) => Math.min(v + 1, candles.length)), 1000 / speed);
    return () => clearTimeout(t);
  }, [playing, visible, speed, end, candles.length]);

  const after = locked ? candles.slice(s.decisionIndex! + 1, visible) : [];
  const outcome = useMemo(() => (locked ? simulate(s, after) : null), [locked, s, after]);
  const closed = outcome && ['target', 'stop', 'manual', 'not-filled'].includes(outcome.exitReason);
  useEffect(() => {
    if (closed && playing) setPlaying(false);
  }, [closed, playing]);

  const canReview = locked && (s.decision === 'notrade' ? after.length >= 10 || end : !!closed || end);

  const lockDecision = () => {
    if (!draft.d || !last) return;
    const v = { entry: draft.d === 'notrade' ? null : (draft.entry ?? last.c), stop: draft.stop, target: draft.target, reason };
    const errs = validateDecision(draft.d, v, last.c);
    if (draft.d === 'notrade' && !ntReason) errs.push('Choose why you are staying out');
    setErrors(errs);
    if (errs.length) return;
    setPlaying(false);
    save({
      ...s,
      decision: draft.d,
      entry: v.entry,
      stop: draft.d === 'notrade' ? null : v.stop,
      target: draft.d === 'notrade' ? null : v.target,
      reason,
      confidence,
      noTradeReason: draft.d === 'notrade' ? ntReason : '',
      noTradeOther: ntOther,
      decisionIndex: visible - 1,
      revealed: visible,
      status: 'decided',
    });
    pulseCore();
  };

  const openReview = () => {
    setPlaying(false);
    const before = candles.slice(0, s.decisionIndex! + 1);
    const next: PracticeSession = {
      ...s,
      revealed: visible,
      outcome,
      after: describeAfter(before, after.slice(0, 40)),
      image: chart.current?.screenshot() ?? s.image,
    };
    if (!s.mistakes.length && s.status !== 'complete') next.mistakes = suggestMistakes(next);
    save(next);
    setParams({ session: s.id, step: 'review' });
  };

  const setStrategy = (id: string) => {
    const o = options.find((x) => x.id === id);
    save({ ...s, strategyId: o?.id ?? '', strategyName: o?.name ?? 'Practice without strategy', strategyRules: o?.rules ?? [], ruleChecks: {} });
  };

  const levels = locked
    ? { entry: s.entry, stop: s.stop, target: s.target }
    : draft.d && draft.d !== 'notrade'
      ? { entry: draft.entry ?? last?.c, stop: draft.stop, target: draft.target }
      : undefined;
  const markers = useMemo(() => {
    const m: { t: number; kind: 'decision' | 'fill' | 'exit'; text: string; position?: 'above' | 'below' }[] = [];
    if (locked) m.push({ t: candles[s.decisionIndex!].t, kind: 'decision', text: s.decision === 'notrade' ? 'NO TRADE' : s.decision!.toUpperCase(), position: 'above' });
    if (outcome?.fillTime) m.push({ t: outcome.fillTime, kind: 'fill', text: 'FILL', position: s.decision === 'long' ? 'below' : 'above' });
    if (outcome?.exitTime && outcome.exitReason !== 'not-filled') m.push({ t: outcome.exitTime, kind: 'exit', text: outcome.exitReason.toUpperCase(), position: 'above' });
    return m;
  }, [locked, candles, s.decisionIndex, s.decision, outcome]);

  if (review && locked) return <Review s={s} candles={candles} visible={visible} chartRef={chart} />;

  return (
    <div className="pl-work">
      <div className="pl-chart-col">
        <div className="pl-chart-meta">
          <span className="pl-chart-market">
            {s.market} · {s.interval.toUpperCase()}
          </span>
          <span className={cx('badge', s.ref.source === 'import' ? 'warn' : 'dim')}>{SOURCE_LABEL[s.ref.source]}</span>
          <span className="mono tiny muted">{last ? fmtTime(last.t, s.interval) : ''}</span>
        </div>
        <div className="glass pl-chart-wrap">
          <PracticeChart
            ref={chart}
            candles={candles}
            visible={visible}
            interval={s.interval}
            drawings={s.drawings}
            onDrawingsChange={(d) => save({ ...(store.get<PracticeSession>(SESSIONS_COL, s.id) ?? s), drawings: d })}
            tool={tool}
            onToolChange={setTool}
            onLevelPick={(kind, price) => !locked && setDraft((x) => ({ ...x, [kind]: price }))}
            levels={levels}
            markers={markers}
          />
        </div>
        <div className="pl-controls">
          <span className="mono tiny muted">
            CANDLE {visible} / {candles.length}
            {!locked && ' · FUTURE HIDDEN'}
          </span>
          {canPlay ? (
            <div className="row wrap" style={{ gap: 6 }}>
              <button className="btn btn-sm" onClick={() => setVisible((v) => Math.min(v + 1, candles.length))} disabled={end}>
                <StepForward size={13} /> Next candle
              </button>
              <button className="btn btn-sm btn-primary" onClick={() => setPlaying((p) => !p)} disabled={end || !!closed}>
                {playing ? <Pause size={13} /> : <Play size={13} />} {playing ? 'Pause' : 'Play'}
              </button>
              <div className="seg-control" role="group" aria-label="Replay speed">
                {SPEEDS.map((x) => (
                  <button key={x} className={speed === x ? 'on' : ''} onClick={() => setSpeed(x)}>
                    ×{x}
                  </button>
                ))}
              </div>
              {locked && !closed && !end && (
                <button className="btn btn-sm btn-ghost" onClick={() => { setSpeed(10); setPlaying(true); }}>
                  <SkipForward size={13} /> Fast-forward
                </button>
              )}
            </div>
          ) : (
            <span className="small muted">Historical practice: study the chart, then make your decision.</span>
          )}
        </div>
      </div>

      <aside className="pl-side">
        <AnimatePresence mode="wait">
          {!locked ? (
            <motion.section key="decide" className="glass pad pl-decide" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease }}>
              <div className="mono-label">Make your decision</div>
              <div className="pl-decision-btns">
                {(['long', 'short', 'notrade'] as Decision[]).map((d) => (
                  <motion.button
                    key={d}
                    whileTap={reduce ? undefined : { scale: 0.97 }}
                    className={cx('pl-decision', `d-${d}`, draft.d === d && 'on')}
                    onClick={() => {
                      setErrors([]);
                      setDraft((x) => ({ ...x, d, entry: x.entry ?? last?.c ?? null }));
                    }}
                  >
                    {d === 'notrade' ? 'No trade' : d}
                  </motion.button>
                ))}
              </div>
              {draft.d && draft.d !== 'notrade' && (
                <div className="pl-form">
                  <p className="tiny dim" style={{ margin: 0 }}>
                    Type levels or pick the Entry / Stop / Target tools on the chart.
                  </p>
                  <div className="pl-levels">
                    <label className="field">
                      <span className="label">Entry</span>
                      <NumberInput value={draft.entry} onChange={(v) => setDraft((x) => ({ ...x, entry: v }))} />
                    </label>
                    <label className="field">
                      <span className="label">Stop-loss</span>
                      <NumberInput value={draft.stop} onChange={(v) => setDraft((x) => ({ ...x, stop: v }))} />
                    </label>
                    <label className="field">
                      <span className="label">Target</span>
                      <NumberInput value={draft.target} onChange={(v) => setDraft((x) => ({ ...x, target: v }))} />
                    </label>
                  </div>
                  <div className="mono tiny muted">
                    PLANNED R:R {(() => {
                      const rr = plannedRRFor({ entry: draft.entry ?? last?.c ?? null, stop: draft.stop, target: draft.target });
                      return rr == null ? '—' : `1:${rr.toFixed(2)}`;
                    })()}
                  </div>
                </div>
              )}
              {draft.d === 'notrade' && (
                <div className="pl-form">
                  <span className="label">Why are you staying out?</span>
                  <div className="pl-reasons">
                    {NO_TRADE_REASONS.map((r) => (
                      <button key={r} className={cx('chip', ntReason === r && 'on')} onClick={() => setNtReason(r)}>
                        {r}
                      </button>
                    ))}
                  </div>
                  {ntReason === 'Other' && <input className="input" placeholder="Your reason" value={ntOther} onChange={(e) => setNtOther(e.target.value)} />}
                </div>
              )}
              {draft.d && (
                <div className="pl-form">
                  <label className="field">
                    <span className="label">{draft.d === 'notrade' ? 'What are you seeing?' : 'Reason for the trade'}</span>
                    <textarea className="textarea" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Structure, levels, confirmation…" />
                  </label>
                  <label className="field">
                    <span className="label">Setup / strategy</span>
                    <select className="select" value={s.strategyId} onChange={(e) => setStrategy(e.target.value)}>
                      <option value="">Practice without strategy</option>
                      {options.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Slider label="Confidence" value={confidence} onChange={setConfidence} />
                  {errors.length > 0 && (
                    <ul className="pl-errors">
                      {errors.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ul>
                  )}
                  <button className="btn btn-primary btn-block" onClick={lockDecision}>
                    <Lock size={14} /> Lock decision
                  </button>
                  <p className="tiny dim" style={{ margin: 0 }}>
                    Once locked, the decision can't change. Future candles stay hidden until you lock it.
                  </p>
                </div>
              )}
            </motion.section>
          ) : (
            <motion.section key="track" className="glass pad pl-track" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
              <div className="row between">
                <span className="mono-label">{s.decision === 'notrade' ? 'No trade · watching' : 'Simulated trade'}</span>
                <span className="badge warn">Simulated</span>
              </div>
              <div className="pl-track-decision">{s.decision === 'notrade' ? `No trade — ${s.noTradeReason}` : `${s.decision!.toUpperCase()} @ ${fmtPrice(s.entry)}`}</div>
              {s.decision !== 'notrade' && outcome && (
                <dl className="pl-track-grid">
                  <dt>Status</dt>
                  <dd>{statusText(outcome)}</dd>
                  <dt>Stop / target</dt>
                  <dd className="mono">
                    {fmtPrice(s.stop)} / {fmtPrice(s.target)}
                  </dd>
                  <dt>Fill</dt>
                  <dd className="mono">{fmtPrice(outcome.fillPrice)}</dd>
                  <dt>Simulated R</dt>
                  <dd className={cx('mono', (outcome.resultR ?? 0) > 0 ? 'good' : (outcome.resultR ?? 0) < 0 ? 'bad' : '')}>
                    {outcome.resultR == null ? '—' : `${outcome.resultR >= 0 ? '+' : ''}${outcome.resultR.toFixed(2)}R`}
                  </dd>
                  <dt>Max favourable</dt>
                  <dd className="mono">{outcome.mfeR.toFixed(2)}R</dd>
                  <dt>Max adverse</dt>
                  <dd className="mono">{outcome.maeR.toFixed(2)}R</dd>
                  <dt>Candles since</dt>
                  <dd className="mono">{after.length}</dd>
                </dl>
              )}
              {s.decision === 'notrade' && (
                <p className="small muted">
                  {after.length < 10 ? `Reveal at least 10 candles (${after.length}/10) to see what happened.` : describeAfter(candles.slice(0, s.decisionIndex! + 1), after).summary}
                </p>
              )}
              {s.decision !== 'notrade' && outcome?.filled && !closed && (
                <button
                  className="btn btn-sm btn-block"
                  onClick={() => save({ ...s, manualExit: { t: candles[visible - 1].t, price: candles[visible - 1].c } })}
                >
                  Exit simulation at {fmtPrice(candles[visible - 1].c)}
                </button>
              )}
              {s.mode === 'historical' && !canReview && (
                <button className="btn btn-sm btn-block" onClick={() => { setSpeed(5); setPlaying(true); }} disabled={playing}>
                  <ChevronsRight size={14} /> Reveal what happened
                </button>
              )}
              <button className="btn btn-primary btn-block" disabled={!canReview} onClick={openReview}>
                Review decision <ArrowRight size={14} />
              </button>
            </motion.section>
          )}
        </AnimatePresence>
        <div className="pl-strategy-tag mono tiny">
          STRATEGY · {s.strategyName.toUpperCase()} · <button className="text-btn" onClick={() => navigate('/trading')}>Exit lab</button>
        </div>
      </aside>
    </div>
  );
}

function statusText(o: NonNullable<PracticeSession['outcome']>): string {
  switch (o.exitReason) {
    case 'target':
      return 'Target reached';
    case 'stop':
      return o.ambiguous ? 'Stopped (stop & target in one candle — stop assumed)' : 'Stopped out';
    case 'manual':
      return 'Exited manually';
    case 'not-filled':
      return 'Not filled — order cancelled';
    case 'end':
      return 'Data ended';
    default:
      return o.filled ? 'Open' : 'Waiting for fill';
  }
}

// ─── Review / result screen ────────────────────────────────────────────────

function Review({ s, candles, visible, chartRef }: { s: PracticeSession; candles: Candle[]; visible: number; chartRef: React.RefObject<PracticeChartHandle | null> }) {
  const navigate = useNavigate();
  const [, setParams] = useSearchParams();
  const score = useMemo(() => scoreSession(s), [s]);
  const suggested = useMemo(() => suggestMistakes(s), [s]);
  const o = s.outcome;
  const rr = plannedRRFor(s);
  const trade = s.decision !== 'notrade';
  const complete = s.status === 'complete';
  const upd = (patch: Partial<PracticeSession>) => save({ ...s, ...patch });

  const finish = () => {
    save({ ...s, score, status: 'complete' });
    pulseCore();
  };

  const exitPrice = o?.exitPrice ?? null;
  const resultText = !trade
    ? 'No trade'
    : !o
      ? '—'
      : o.exitReason === 'not-filled'
        ? 'Not filled'
        : o.resultR == null
          ? 'Open'
          : `${o.resultR >= 0 ? '+' : ''}${o.resultR.toFixed(2)}R`;

  return (
    <div className="pl-review">
      <motion.header className="pl-review-head" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
        <div>
          <div className="mono-label">{complete ? 'Simulation complete' : 'Review your decision'}</div>
          <h2 className="pl-review-title">
            {s.market} · {s.interval.toUpperCase()} <span className="dim">—</span> {trade ? s.decision!.toUpperCase() : 'NO TRADE'}
          </h2>
          <span className="mono tiny muted">
            {fmtTime(candles[s.decisionIndex!].t, s.interval)} · {s.strategyName} · {SOURCE_LABEL[s.ref.source]}
          </span>
        </div>
        <div className="pl-score">
          <RingMeter value={score.total / 100} size={110} stroke={2.5} showValue={false} />
          <div className="pl-score-num">
            <CountUp value={score.total} duration={1400} />
            <small>/100</small>
          </div>
          <div className="mono-label center">Process score</div>
        </div>
      </motion.header>

      <div className="glass pl-review-chart">
        <PracticeChart
          ref={chartRef}
          candles={candles}
          visible={visible}
          interval={s.interval}
          drawings={s.drawings}
          tool="cursor"
          readOnly
          height={360}
          levels={trade ? { entry: s.entry, stop: s.stop, target: s.target } : undefined}
          markers={[
            { t: candles[s.decisionIndex!].t, kind: 'decision', text: trade ? s.decision!.toUpperCase() : 'NO TRADE', position: 'above' },
            ...(o?.fillTime ? [{ t: o.fillTime, kind: 'fill' as const, text: 'FILL', position: 'below' as const }] : []),
            ...(o?.exitTime && o.exitReason !== 'not-filled' ? [{ t: o.exitTime, kind: 'exit' as const, text: o.exitReason.toUpperCase(), position: 'above' as const }] : []),
          ]}
        />
      </div>

      <section className="pl-metrics">
        {[
          ['Decision', trade ? s.decision!.toUpperCase() : 'No trade'],
          ['Entry', trade ? fmtPrice(o?.fillPrice ?? s.entry) : '—'],
          ['Stop', fmtPrice(s.stop)],
          ['Target', fmtPrice(s.target)],
          ['Exit', fmtPrice(exitPrice)],
          ['Simulated result', resultText],
          ['Planned R:R', rr == null ? '—' : `1:${rr.toFixed(2)}`],
          ['Rule-following', s.strategyRules.length ? `${Math.round((s.strategyRules.filter((r) => s.ruleChecks[r.key]).length / s.strategyRules.length) * 100)}%` : '—'],
          ['Setup quality', score.setupQuality],
          ['Decision quality', score.decisionQuality],
        ].map(([k, v]) => (
          <div key={k} className="pl-metric">
            <div className="mono-label">{k}</div>
            <div className="pl-metric-value">{v}</div>
          </div>
        ))}
      </section>
      <p className="tiny dim mono" style={{ margin: '-8px 0 0' }}>
        SIMULATED RESULT · HISTORICAL REPLAY · NOT A REAL FINANCIAL RETURN
      </p>

      <section className="pl-versus">
        <div className="glass pad">
          <div className="mono-label">Your decision</div>
          <p className="pl-versus-main">
            {trade ? `${s.decision!.toUpperCase()} at ${fmtPrice(s.entry)}, stop ${fmtPrice(s.stop)}, target ${fmtPrice(s.target)}` : `No trade — ${s.noTradeReason}${s.noTradeOther ? `: ${s.noTradeOther}` : ''}`}
          </p>
          {s.reason && <p className="small muted pre">{s.reason}</p>}
          <span className="mono tiny muted">CONFIDENCE {s.confidence}/10</span>
        </div>
        <div className="pl-versus-arrow" aria-hidden>
          →
        </div>
        <div className="glass pad">
          <div className="mono-label">What actually happened</div>
          <p className="pl-versus-main">{trade && o ? `${statusText(o)}${o.resultR != null ? ` · ${resultText}` : ''}` : (s.after?.summary ?? '—')}</p>
          {trade && s.after && <p className="small muted">{s.after.summary}</p>}
          {trade && o && <span className="mono tiny muted">MFE {o.mfeR.toFixed(2)}R · MAE {o.maeR.toFixed(2)}R</span>}
        </div>
      </section>
      <p className="pl-verdict">{verdict(s, score.total)}</p>

      <div className="pl-review-grid">
        <section className="glass pad">
          <div className="panel-title">Compare against your strategy</div>
          {s.strategyRules.length ? (
            <div className="pl-checks">
              {s.strategyRules.map((r) => (
                <label key={r.key} className="pl-check">
                  <HoloCheck checked={!!s.ruleChecks[r.key]} onChange={(v) => upd({ ruleChecks: { ...s.ruleChecks, [r.key]: v } })} label={r.label} />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="small muted">Practised without a strategy — select one next time to measure adherence.</p>
          )}
          <div className="panel-title" style={{ marginTop: 22 }}>
            Process check
          </div>
          <div className="pl-checks">
            {(
              [
                ['confirmation', 'I waited for confirmation'],
                ['calm', 'I stayed calm — no impulsive decision'],
                ['plan', 'I followed my plan after deciding'],
              ] as const
            ).map(([k, label]) => (
              <label key={k} className="pl-check">
                <HoloCheck checked={s.selfCheck[k]} onChange={(v) => upd({ selfCheck: { ...s.selfCheck, [k]: v } })} label={label} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="glass pad">
          <div className="panel-title">Process score breakdown</div>
          <ul className="pl-parts">
            {score.parts.map((p, i) => (
              <li key={p.key}>
                <div className="row between">
                  <span>{p.label}</span>
                  <span className="mono small">{p.score}</span>
                </div>
                <div className="pl-bar">
                  <motion.i initial={{ width: 0 }} animate={{ width: `${p.score}%` }} transition={{ duration: 1, delay: 0.2 + i * 0.08, ease }} />
                </div>
                <span className="tiny dim">{p.note}</span>
              </li>
            ))}
          </ul>
          <p className="small muted" style={{ marginBottom: 0 }}>
            {score.explanation}
          </p>
        </section>
      </div>

      <section className="glass pad">
        <div className="panel-title">
          Mistakes <span className="sub">suggested items are pre-selected — confirm or remove</span>
        </div>
        <div className="pl-reasons">
          {REVIEW_MISTAKES.map((k) => {
            const m = MISTAKES.find((x) => x.key === k)!;
            const on = s.mistakes.includes(k);
            return (
              <button key={k} className={cx('chip', on && 'on')} onClick={() => upd({ mistakes: on ? s.mistakes.filter((x) => x !== k) : [...s.mistakes, k] })}>
                {m.label}
                {suggested.includes(k) && <span className="pl-mine">suggested</span>}
              </button>
            );
          })}
        </div>
      </section>

      <section className="pl-reflect">
        {(
          [
            ['well', 'What did you do well?'],
            ['improve', 'What could be improved?'],
            ['taught', 'What did the market teach you?'],
          ] as const
        ).map(([k, q]) => (
          <label key={k} className="glass pad field">
            <span className="mono-label">{q}</span>
            <textarea className="textarea" rows={4} value={s.reflection[k]} onChange={(e) => upd({ reflection: { ...s.reflection, [k]: e.target.value } })} />
          </label>
        ))}
      </section>

      <div className="pl-review-actions">
        {!complete ? (
          <button className="btn btn-primary btn-lg" onClick={finish}>
            Complete review
          </button>
        ) : (
          <motion.span className="badge good" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            Simulation complete · score saved
          </motion.span>
        )}
        <button
          className="btn btn-lg"
          onClick={() => {
            if (!complete) finish();
            navigate(`/trading-journal?new=1&practice=${s.id}`);
          }}
        >
          <NotebookPen size={15} /> {s.journalEntryId ? 'Save again to trading journal' : 'Save to trading journal'}
        </button>
        <button className="btn btn-ghost" onClick={() => setParams({ session: s.id })}>
          <RotateCcw size={14} /> Back to chart
        </button>
        <Link className="btn btn-ghost" to="/trading/replay">
          New replay
        </Link>
        <Link className="btn btn-ghost" to="/trading/history">
          <BookOpen size={14} /> Practice library
        </Link>
      </div>
    </div>
  );
}

function verdict(s: PracticeSession, score: number): string {
  const r = s.outcome?.resultR ?? null;
  const good = score >= 70;
  if (s.decision === 'notrade') {
    const moved = s.after && (s.after.upAtr >= 3 || s.after.downAtr >= 3);
    if (moved && good) return 'The market moved afterwards — but standing aside for a clear reason is still a sound decision. Ask only: was there a valid setup by your rules?';
    if (moved) return 'The market moved afterwards. Review whether a valid setup by your rules was present — if it was, write down what you missed.';
    return 'Standing aside protected your capital in a market that offered little. Avoiding a trade can be the correct decision.';
  }
  if (r == null) return 'Judge the decision by its process, not the result.';
  if (good && r < 0) return 'Good process, unfavourable outcome — that is variance, not a mistake. Repeat the process.';
  if (!good && r > 0) return 'Favourable outcome, weak process — don’t let a lucky result reinforce this behaviour.';
  if (good && r > 0) return 'Good process and a favourable outcome — note exactly what made this setup clear.';
  return 'Weak process and an unfavourable outcome — fix the process first; the results follow.';
}
