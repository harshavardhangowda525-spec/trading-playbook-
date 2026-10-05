import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, CandlestickChart, Dumbbell, RotateCcw, Target, Trash2 } from 'lucide-react';
import { lessonFor } from '../data/curriculum';
import { C, PRACTICE_KINDS, type PracticeLog } from '../lib/domain';
import { useJourneyDay } from '../lib/data';
import { useCollection, useToday } from '../lib/hooks';
import { formatShort } from '../lib/dates';
import {
  Bar,
  CountUp,
  EmptyState,
  Field,
  ImageAttach,
  NumberInput,
  PageHeader,
  Panel,
  RingMeter,
  SegControl,
  Thumbs,
  cx,
  reveal,
} from '../components/ui';
import '../styles/learn.css';

const TRAINER_KIND = 'Candle Trainer (synthetic)';

export function ChartPractice() {
  const today = useToday();
  const current = useJourneyDay(today);
  const lesson = lessonFor(current);
  const { items, create, remove } = useCollection<PracticeLog>(C.practice);

  const totals = useMemo(() => {
    const byKind = new Map<string, number>();
    for (const p of items) byKind.set(p.kind, (byKind.get(p.kind) ?? 0) + (p.reps || 0));
    const reps = items.reduce((a, p) => a + (p.reps || 0), 0);
    return { sessions: items.length, reps, byKind: [...byKind.entries()].sort((a, b) => b[1] - a[1]) };
  }, [items]);
  const maxKind = Math.max(1, ...totals.byKind.map(([, n]) => n));
  const sorted = useMemo(() => [...items].sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1)), [items]);

  return (
    <div>
      <PageHeader
        eyebrow="REPETITION BUILDS PATTERN RECOGNITION"
        title="CHART PRACTICE"
        description="Log your chart-reading reps and sharpen candle recognition with the synthetic trainer."
      />

      <div className="grid-2 mb-16">
        <motion.div variants={reveal} initial="hidden" animate="show" custom={0}>
          <Panel hud title={<><Target size={14} style={{ verticalAlign: '-2px', marginRight: 8 }} />Today's practice target</>} style={{ height: '100%' }}>
            <div className="stat-label">
              Day {current} · {lesson.title}
            </div>
            <p style={{ fontSize: 16, margin: '8px 0 14px', color: '#fff' }}>{lesson.practice}</p>
            <Link to={`/journey/${current}`} className="btn btn-sm btn-ghost">
              Open lesson <ArrowRight size={14} />
            </Link>
          </Panel>
        </motion.div>
        <motion.div variants={reveal} initial="hidden" animate="show" custom={1}>
          <Panel title="Totals" style={{ height: '100%' }}>
            <div className="stat-grid">
              <div className="stat">
                <span className="stat-label">Sessions</span>
                <span className="stat-value">
                  <CountUp value={totals.sessions} />
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Total reps</span>
                <span className="stat-value">
                  <CountUp value={totals.reps} />
                </span>
              </div>
            </div>
            {totals.byKind.length > 0 && (
              <div className="kind-bars mt-16">
                {totals.byKind.map(([k, n]) => (
                  <div key={k}>
                    <div className="row between">
                      <span className="muted">{k}</span>
                      <span className="mono">{n}</span>
                    </div>
                    <Bar value={n / maxKind} />
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </motion.div>
      </div>

      <motion.div variants={reveal} initial="hidden" animate="show" custom={2} className="mb-16">
        <CandleTrainer
          onFinish={(total, correct, label) =>
            create({ date: today, kind: TRAINER_KIND, reps: total, correct, notes: `${label} · ${correct}/${total} correct`, images: [] })
          }
        />
      </motion.div>

      <div className="grid-2">
        <motion.div variants={reveal} initial="hidden" animate="show" custom={3}>
          <LogForm today={today} onSave={(p) => create(p)} />
        </motion.div>
        <motion.div variants={reveal} initial="hidden" animate="show" custom={4}>
          <Panel title="Practice sessions" sub={`${items.length}`} style={{ height: '100%' }}>
            {sorted.length ? (
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Kind</th>
                      <th>Reps</th>
                      <th>Notes</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((p) => (
                      <tr key={p.id}>
                        <td className="mono small" style={{ whiteSpace: 'nowrap' }}>
                          {formatShort(p.date)}
                        </td>
                        <td>{p.kind}</td>
                        <td className="mono">
                          {p.reps}
                          {p.correct != null && <span className="muted"> · {p.correct}✓</span>}
                        </td>
                        <td className="small muted" style={{ minWidth: 140 }}>
                          {p.notes}
                          <Thumbs images={p.images ?? []} />
                        </td>
                        <td>
                          <button type="button" className="icon-btn" aria-label="Delete session" onClick={() => remove(p.id)}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState icon={<Dumbbell size={22} />} title="No practice logged yet" text="Log a session or finish a trainer round — it appears here." />
            )}
          </Panel>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Practice log form ─────────────────────────────────────────────────────

function LogForm({ today, onSave }: { today: string; onSave: (p: Omit<PracticeLog, 'id'>) => void }) {
  const [date, setDate] = useState(today);
  const [kind, setKind] = useState(PRACTICE_KINDS[0]);
  const [reps, setReps] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const valid = !!date && reps != null && reps > 0;

  const save = () => {
    if (!valid) return;
    onSave({ date, kind, reps: Math.round(reps!), notes: notes.trim(), images });
    setReps(null);
    setNotes('');
    setImages([]);
  };

  return (
    <Panel title="Log a session" style={{ height: '100%' }}>
      <div className="grid-2">
        <Field label="Date">
          <input className="input" type="date" value={date} max={today} onChange={(e) => setDate(e.target.value)} />
        </Field>
        <Field label="Reps">
          <NumberInput value={reps} onChange={setReps} placeholder="e.g. 20" step="1" />
        </Field>
        <Field label="Kind" className="span-all">
          <select className="select" value={kind} onChange={(e) => setKind(e.target.value)}>
            {PRACTICE_KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Notes" className="span-all">
          <textarea className="textarea" rows={3} value={notes} placeholder="What did you practice? What was hard?" onChange={(e) => setNotes(e.target.value)} />
        </Field>
        <div className="span-all">
          <ImageAttach images={images} onChange={setImages} label="Add chart" />
        </div>
      </div>
      <button type="button" className="btn btn-primary mt-16" disabled={!valid} onClick={save}>
        Save session
      </button>
    </Panel>
  );
}

// ─── Candle trainer (synthetic data only) ─────────────────────────────────

interface Candle {
  o: number;
  h: number;
  l: number;
  c: number;
}
type QKind = 'direction' | 'type' | 'ohlc';
type Mode = QKind | 'mixed';
interface Question {
  kind: QKind;
  prompt: string;
  options: string[];
  answer: string;
  explain: string;
  candles: Candle[]; // last one is the question candle
}

const MODES: { value: Mode; label: string }[] = [
  { value: 'mixed', label: 'Mixed' },
  { value: 'direction', label: 'Bull / Bear' },
  { value: 'type', label: 'Candle type' },
  { value: 'ohlc', label: 'OHLC' },
];
const MODE_LABEL: Record<Mode, string> = { mixed: 'Mixed', direction: 'Bullish vs Bearish', type: 'Momentum / Rejection / Indecision', ohlc: 'OHLC identification' };

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(xs: readonly T[]): T => xs[Math.floor(Math.random() * xs.length)];
const r2 = (x: number) => Math.round(x * 100) / 100;
const f2 = (x: number) => x.toFixed(2);
const pct = (x: number) => `${Math.round(x * 100)}%`;

/** Build a candle from body / wick fractions of its range. */
function shape(body: number, upper: number, bullish: boolean): Candle {
  const low = rand(20, 400);
  const range = low * rand(0.012, 0.04);
  const lower = 1 - body - upper;
  const bLo = low + lower * range;
  const bHi = bLo + body * range;
  return { l: r2(low), h: r2(low + range), o: r2(bullish ? bLo : bHi), c: r2(bullish ? bHi : bLo) };
}

/** A short random walk ending at `open`, for visual context only. */
function contextFor(q: Candle, n = 5): Candle[] {
  const range = q.h - q.l;
  const out: Candle[] = [];
  let close = q.o;
  for (let i = 0; i < n; i++) {
    const open = close - rand(-0.7, 0.7) * range;
    const hi = Math.max(open, close) + rand(0.05, 0.3) * range;
    const lo = Math.min(open, close) - rand(0.05, 0.3) * range;
    out.unshift({ o: r2(open), c: r2(close), h: r2(hi), l: r2(lo) });
    close = open;
  }
  return out;
}

function makeQuestion(kind: QKind): Question {
  if (kind === 'direction') {
    const answer = pick(['Bullish', 'Bearish', 'Doji / indecision']);
    let c: Candle;
    if (answer === 'Doji / indecision') {
      const body = rand(0.01, 0.05);
      c = shape(body, rand(0.3, 0.65 - body), Math.random() < 0.5);
    } else {
      const body = rand(0.35, 0.85);
      c = shape(body, rand(0.03, 1 - body - 0.03), answer === 'Bullish');
    }
    const range = c.h - c.l;
    const bodyPct = pct(Math.abs(c.c - c.o) / range);
    const explain =
      answer === 'Bullish'
        ? `Close ${f2(c.c)} is above Open ${f2(c.o)} (hollow body, ${bodyPct} of the range) — buyers finished the period in control.`
        : answer === 'Bearish'
          ? `Close ${f2(c.c)} is below Open ${f2(c.o)} (filled body, ${bodyPct} of the range) — sellers finished the period in control.`
          : `Open ${f2(c.o)} and Close ${f2(c.c)} are almost equal (body only ${bodyPct} of the range) — neither side won: a doji / indecision candle.`;
    return { kind, prompt: 'Is the highlighted candle bullish, bearish or a doji?', options: ['Bullish', 'Bearish', 'Doji / indecision'], answer, explain, candles: [...contextFor(c), c] };
  }

  if (kind === 'type') {
    const answer = pick(['Momentum', 'Rejection', 'Indecision']);
    const bull = Math.random() < 0.5;
    let c: Candle;
    let explain: string;
    if (answer === 'Momentum') {
      const body = rand(0.72, 0.9);
      c = shape(body, rand(0.02, 1 - body - 0.02), bull);
      explain = `Large body (${pct(body)} of the range) with small wicks — price moved decisively in one direction: a momentum candle.`;
    } else if (answer === 'Rejection') {
      const body = rand(0.1, 0.22);
      const short = rand(0.02, 0.08);
      const long = 1 - body - short;
      const upperLong = Math.random() < 0.5;
      c = shape(body, upperLong ? long : short, bull);
      explain = `One long ${upperLong ? 'upper' : 'lower'} wick (${pct(long)} of the range) and a small body — price was pushed ${upperLong ? 'up' : 'down'} and rejected: a rejection candle.`;
    } else {
      const body = rand(0.02, 0.1);
      const upper = rand(0.32, 1 - body - 0.32);
      c = shape(body, upper, bull);
      explain = `Tiny body (${pct(body)}) with long wicks on both sides — both buyers and sellers were active but neither won: an indecision candle.`;
    }
    return { kind, prompt: 'What kind of candle is highlighted?', options: ['Momentum', 'Rejection', 'Indecision'], answer, explain, candles: [...contextFor(c), c] };
  }

  const bull = Math.random() < 0.5;
  const body = rand(0.3, 0.5);
  const c = shape(body, rand(0.17, 1 - body - 0.17), bull);
  const field = pick(['Open', 'High', 'Low', 'Close'] as const);
  const value = { Open: c.o, High: c.h, Low: c.l, Close: c.c }[field];
  const options = [c.h, Math.max(c.o, c.c), Math.min(c.o, c.c), c.l].map(f2);
  const explain = `${bull ? 'Hollow (bullish)' : 'Filled (bearish)'} candle: Open ${f2(c.o)} is the body ${bull ? 'bottom' : 'top'}, Close ${f2(c.c)} is the body ${bull ? 'top' : 'bottom'}, High ${f2(c.h)} is the upper wick tip, Low ${f2(c.l)} is the lower wick tip.`;
  return { kind: 'ohlc', prompt: `What is the ${field}?`, options, answer: f2(value), explain, candles: [c] };
}

function makeRound(mode: Mode, n: number): Question[] {
  const kinds: QKind[] = ['direction', 'type', 'ohlc'];
  return Array.from({ length: n }, () => makeQuestion(mode === 'mixed' ? pick(kinds) : mode));
}

function niceStep(span: number): number {
  const raw = span / 4;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / mag;
  return (n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10) * mag;
}

function CandleSvg({ candles }: { candles: Candle[] }) {
  const W = 360;
  const H = 230;
  const plotL = 10;
  const plotR = 290;
  const top = 14;
  const bottom = H - 14;
  const lo = Math.min(...candles.map((c) => c.l));
  const hi = Math.max(...candles.map((c) => c.h));
  const pad = (hi - lo) * 0.1 || 1;
  const min = lo - pad;
  const max = hi + pad;
  const y = (p: number) => bottom - ((p - min) / (max - min)) * (bottom - top);
  const step = niceStep(max - min);
  const ticks: number[] = [];
  for (let t = Math.ceil(min / step) * step; t <= max; t += step) ticks.push(t);
  const slots = Math.max(candles.length, 6);
  const slotW = (plotR - plotL) / slots;
  const decimals = step < 1 ? 2 : step < 10 ? 1 : 0;

  return (
    <svg className="trainer-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Synthetic training candle chart">
      <defs>
        <filter id="ct-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={plotL} x2={plotR} y1={y(t)} y2={y(t)} stroke="rgba(120,225,255,0.08)" strokeDasharray="3 4" />
          <text x={plotR + 8} y={y(t) + 4} fill="#7f9aa7" fontSize="11" fontFamily="var(--font-mono)">
            {t.toFixed(decimals)}
          </text>
        </g>
      ))}
      <line x1={plotR} x2={plotR} y1={top} y2={bottom} stroke="rgba(120,225,255,0.18)" />
      {candles.map((c, i) => {
        const last = i === candles.length - 1;
        const cx0 = plotL + slotW * (slots - candles.length + i + 0.5);
        const bw = last ? Math.min(30, slotW * 0.6) : Math.min(18, slotW * 0.45);
        const bull = c.c >= c.o;
        const color = bull ? '#3ee6ff' : '#4b8dff';
        const bTop = y(Math.max(c.o, c.c));
        const bH = Math.max(1.5, Math.abs(y(c.o) - y(c.c)));
        return (
          <motion.g
            key={i}
            opacity={last ? 1 : 0.38}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: last ? 1 : 0.38, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            filter={last ? 'url(#ct-glow)' : undefined}
          >
            {last && <rect x={cx0 - slotW / 2 + 2} y={top} width={slotW - 4} height={bottom - top} fill="rgba(62,230,255,0.05)" rx={4} />}
            <line x1={cx0} x2={cx0} y1={y(c.h)} y2={y(c.l)} stroke={color} strokeWidth={last ? 2 : 1.4} />
            <rect
              x={cx0 - bw / 2}
              y={bTop}
              width={bw}
              height={bH}
              fill={bull ? 'rgba(2,10,16,0.95)' : color}
              stroke={color}
              strokeWidth={last ? 2 : 1.4}
              rx={1.5}
            />
          </motion.g>
        );
      })}
    </svg>
  );
}

function CandleTrainer({ onFinish }: { onFinish: (total: number, correct: number, label: string) => void }) {
  const [mode, setMode] = useState<Mode>('mixed');
  const [length, setLength] = useState<'10' | '20'>('10');
  const [round, setRound] = useState<Question[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [finished, setFinished] = useState(false);

  const start = () => {
    const n = Number(length);
    setRound(makeRound(mode, n));
    setAnswers(Array(n).fill(null));
    setIdx(0);
    setFinished(false);
  };

  const q = round?.[idx];
  const chosen = answers[idx] ?? null;
  const correctCount = round ? answers.filter((a, i) => a != null && a === round[i].answer).length : 0;
  const answeredCount = answers.filter((a) => a != null).length;

  const choose = (opt: string) => {
    if (chosen != null) return;
    setAnswers((prev) => prev.map((a, i) => (i === idx ? opt : a)));
  };

  const next = () => {
    if (!round) return;
    if (idx + 1 < round.length) setIdx(idx + 1);
    else {
      setFinished(true);
      onFinish(round.length, correctCount, MODE_LABEL[mode]);
    }
  };

  return (
    <Panel hud title={<><CandlestickChart size={14} style={{ verticalAlign: '-2px', marginRight: 8 }} />Candle trainer</>} sub="synthetic">
      <div className="synthetic-label mb-16">
        <AlertTriangle size={14} /> SYNTHETIC TRAINING CANDLE <span>— randomly generated, not market data.</span>
      </div>

      {!round || finished ? (
        <div className="grid-2" style={{ alignItems: 'center' }}>
          <div className="col gap-16">
            <Field label="Question type">
              <SegControl options={MODES} value={mode} onChange={setMode} />
            </Field>
            <Field label="Round length">
              <SegControl
                options={[
                  { value: '10', label: '10 candles' },
                  { value: '20', label: '20 candles' },
                ]}
                value={length}
                onChange={setLength}
              />
            </Field>
            <p className="small muted" style={{ margin: 0 }}>
              Hollow cyan = close above open (bullish). Filled blue = close below open (bearish). The highlighted candle is the one to read.
            </p>
            <div>
              <button type="button" className="btn btn-primary" onClick={start}>
                {finished ? (
                  <>
                    <RotateCcw size={15} /> New round
                  </>
                ) : (
                  'Start round'
                )}
              </button>
            </div>
          </div>
          {finished && round ? (
            <div className="col" style={{ alignItems: 'center', gap: 10 }}>
              <RingMeter value={correctCount / round.length} size={150} stroke={7} label={`${correctCount} / ${round.length} correct`} />
              <span className="tiny dim">Saved to your practice log.</span>
            </div>
          ) : (
            <EmptyState icon={<CandlestickChart size={22} />} title="Ready when you are" text="Each round generates fresh synthetic candles with instant feedback." />
          )}
        </div>
      ) : (
        q && (
          <div className="grid-2" style={{ alignItems: 'start' }}>
            <div className="col gap-16">
              <CandleSvg candles={q.candles} />
              <div className="round-dots" aria-label={`Question ${idx + 1} of ${round.length}`}>
                {round.map((rq, i) => (
                  <i
                    key={i}
                    className={cx(answers[i] != null && (answers[i] === rq.answer ? 'right' : 'wrong'), i === idx && answers[i] == null && 'now')}
                  />
                ))}
              </div>
            </div>
            <div className="col gap-16">
              <div className="row between">
                <span className="stat-label">
                  Question {idx + 1} / {round.length}
                </span>
                <RingMeter value={answeredCount ? correctCount / answeredCount : 0} size={52} stroke={4} ticks={false} />
              </div>
              <h3 className="display upper" style={{ margin: 0, fontSize: 20, letterSpacing: '0.08em' }}>
                {q.prompt}
              </h3>
              <div className="answer-grid">
                {q.options.map((opt) => (
                  <motion.button
                    key={opt}
                    type="button"
                    className={cx(
                      'btn answer-btn',
                      q.kind === 'ohlc' && 'mono',
                      chosen != null && opt === q.answer && 'right',
                      chosen === opt && opt !== q.answer && 'wrong',
                    )}
                    disabled={chosen != null && opt !== chosen && opt !== q.answer}
                    onClick={() => choose(opt)}
                    whileTap={{ scale: 0.96 }}
                  >
                    {opt}
                  </motion.button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                {chosen != null && (
                  <motion.div key={idx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="col gap-16">
                    <div className={cx('feedback', chosen === q.answer ? 'right' : 'wrong')}>
                      <b style={{ color: chosen === q.answer ? 'var(--good)' : 'var(--bad)' }}>{chosen === q.answer ? 'Correct' : `Answer: ${q.answer}`}</b>
                      {q.explain}
                    </div>
                    <div>
                      <button type="button" className="btn btn-primary" onClick={next} autoFocus>
                        {idx + 1 < round.length ? 'Next candle' : 'Finish round'} <ArrowRight size={15} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )
      )}
    </Panel>
  );
}
