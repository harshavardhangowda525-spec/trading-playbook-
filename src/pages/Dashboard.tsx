import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { GlassOrb } from '../components/GlassOrb';
import { JOURNAL_CTA } from '../components/journal/JournalCTA';
import { CountUp, cx } from '../components/ui';
import { BLOCKS, type Block } from '../data/schedule';
import { TOTAL_DAYS, lessonFor, phaseFor } from '../data/curriculum';
import { useDayLog } from '../lib/daylog';
import { useDayLogs, useJourney, useJourneyDay, useSkills } from '../lib/data';
import { useDoc, useNow, useToday } from '../lib/hooks';
import { addDays, hmToMin, minTo12, minToClock, nowMinutes } from '../lib/dates';
import { corePulse } from '../lib/events';
import {
  C,
  computeStreak,
  emptyJournal,
  blockDone,
  journeyState,
  type DayLog,
  type JournalEntry,
  type Skills,
} from '../lib/domain';
import '../styles/dashboard.css';

const OBJECTIVE = ['trading_edu', 'calls', 'trading_review', 'workout', 'daily_review'];
const TIMELINE = [
  { id: 'wake', label: 'Start Day' },
  { id: 'trading_edu', label: 'Trading Education' },
  { id: 'calls', label: 'Client Acquisition' },
  { id: 'darwin', label: 'Darwin' },
  { id: 'trading_review', label: 'Trading Review' },
  { id: 'workout', label: 'Workout' },
  { id: 'daily_review', label: 'Daily Review' },
];
const DEV: { key: keyof Skills; label: string }[] = [
  { key: 'knowledge', label: 'Knowledge' },
  { key: 'strategy', label: 'Strategy' },
  { key: 'risk', label: 'Risk' },
  { key: 'discipline', label: 'Discipline' },
];
const WORDS = ['LEARN', 'EXECUTE', 'REVIEW', 'IMPROVE'];
const QUICK = [
  { to: '/trading-journal?new=1', label: 'Journal entry' },
  { to: '/daily-journal', label: 'Daily reflection' },
  { to: '/backtesting?new=1', label: 'Backtest' },
  { to: '/vault?new=1', label: 'Note' },
  { to: '/strategy-lab?new=1', label: 'Strategy' },
];
const ease = [0.22, 1, 0.36, 1] as const;

const block = (id: string) => BLOCKS.find((b) => b.id === id)!;


/** First unfinished block whose window hasn't ended; else the earliest overdue one. */
function findNext(log: DayLog, now: number) {
  const open = BLOCKS.filter((b) => !blockDone(log, b));
  if (!open.length) return null;
  const b = open.find((x) => hmToMin(x.end ?? x.start) > now) ?? open[0];
  const start = hmToMin(b.start);
  const end = hmToMin(b.end ?? b.start);
  return { block: b, start, end, state: start <= now && now < end ? 'now' : start > now ? 'later' : 'overdue' };
}

const enter = (i: number) => ({
  initial: { opacity: 0, y: 16, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.9, delay: 0.08 * i, ease },
});

export function Dashboard() {
  const navigate = useNavigate();
  const today = useToday();
  const now = useNow(15_000);
  const day = useJourneyDay(today);
  const lesson = lessonFor(day);
  const phase = phaseFor(day);
  const { log, stats, toggleTask } = useDayLog(today);
  const { map: logs } = useDayLogs();
  const journey = useJourney();
  const skills = useSkills();
  const fbToday = useMemo(() => emptyJournal(today), [today]);
  const yesterday = addDays(today, -1);
  const fbYesterday = useMemo(() => emptyJournal(yesterday), [yesterday]);
  const [journal] = useDoc<JournalEntry>(C.journal, today, fbToday);
  const [prevJournal] = useDoc<JournalEntry>(C.journal, yesterday, fbYesterday);

  const streak = useMemo(() => computeStreak('daily', logs, today), [logs, today]);
  const next = findNext(log, nowMinutes(now));
  const lessonDone = !!journey.byDay.get(day)?.completed;
  const focus = journal.improvement.trim()
    ? { text: journal.improvement.trim(), from: 'today' }
    : prevJournal.improvement.trim()
      ? { text: prevJournal.improvement.trim(), from: 'yesterday' }
      : null;

  const toggle = (b: Block) => (b.counters ? navigate(`/my-day?task=${b.id}`) : toggleTask(b.id));

  return (
    <div className="home">
      {/* ── Hero ── */}
      <motion.section className="home-hero" {...enter(0)}>
        <div className="eyebrow">Personal Performance OS</div>
        <h1 className="hero-title">
          Become 1% better
          <br />
          every single day.
        </h1>
        <p className="hero-sub">Learn. Execute. Review. Improve.</p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => navigate(`/journey/${day}`)}>
            {lessonDone ? "Review today's session" : "Start today's session"} <ArrowRight size={15} />
          </button>
          <span className="hero-lesson mono">
            DAY {String(day).padStart(2, '0')} · {lesson.title}
          </span>
        </div>
        <nav className="quick-capture mono" aria-label="Quick capture">
          {QUICK.map((q) => (
            <Link key={q.to} to={q.to}>
              + {q.label}
            </Link>
          ))}
        </nav>
        <RotatingWord />
      </motion.section>

      {/* ── Orb ── */}
      <motion.section className="home-orb" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.6, ease }}>
        <GlassOrb />
      </motion.section>

      <div className="home-side">
      {/* ── Next action ── */}
      <motion.section className="glass home-next" {...enter(2)}>
        <div className="mono-label">Next action</div>
        {next ? (
          <>
            <div className="next-title">{next.block.label}</div>
            <div className="next-time mono">
              {minTo12(next.start).replace(/^0/, '')} — {minTo12(next.end).replace(/^0/, '')}
              <span className={cx('next-state', next.state)}>{next.state === 'now' ? 'NOW' : next.state === 'later' ? 'UP NEXT' : 'PENDING'}</span>
            </div>
            <div className="row between" style={{ marginTop: 14 }}>
              {!next.block.counters ? (
                <button className="text-btn" onClick={() => toggleTask(next.block.id)}>
                  Mark done
                </button>
              ) : (
                <span />
              )}
              {next.block.tradingSession && next.state === 'now' ? (
                <button className="text-btn strong" onClick={() => navigate(JOURNAL_CTA[next.block.tradingSession!].to)}>
                  {JOURNAL_CTA[next.block.tradingSession].label} <ArrowRight size={13} />
                </button>
              ) : (
                <button
                  className="text-btn strong"
                  onClick={() => navigate(next.block.tradingSession ? '/trading-schedule' : `/my-day?task=${next.block.id}`)}
                >
                  ENTER <ArrowRight size={13} />
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="next-title">Day complete</div>
            <div className="next-time mono">System status: optimal</div>
          </>
        )}
      </motion.section>

      {/* ── Today's objective ── */}
      <motion.section className="glass home-objective" {...enter(3)}>
        <div className="mono-label">Today's objective</div>
        <div className="obj-day">
          DAY {String(day).padStart(2, '0')} <span>/ {TOTAL_DAYS}</span>
        </div>
        <div className="obj-pct mono">
          <CountUp value={Math.round(stats.pct * 100)} />% COMPLETE
        </div>
        <div className="obj-bar">
          <motion.i initial={{ width: 0 }} animate={{ width: `${stats.pct * 100}%` }} transition={{ duration: 1.4, ease }} />
        </div>
        <ul className="obj-list">
          {OBJECTIVE.map((id) => {
            const b = block(id);
            const done = blockDone(log, b);
            const current = next?.block.id === id;
            return (
              <li key={id} className={cx(done && 'done', current && 'current')}>
                <button onClick={() => toggle(b)} aria-pressed={done} title={done ? 'Mark not done' : 'Mark done'}>
                  <span className="obj-mark">
                    <AnimatePresence mode="wait" initial={false}>
                      {done ? (
                        <motion.span key="d" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45, ease }}>
                          <Check size={14} strokeWidth={1.8} />
                        </motion.span>
                      ) : current ? (
                        <motion.span key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <ArrowRight size={14} strokeWidth={1.6} />
                        </motion.span>
                      ) : (
                        <motion.i key="o" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
                      )}
                    </AnimatePresence>
                  </span>
                  {b.short}
                </button>
              </li>
            );
          })}
        </ul>
        <Link to="/my-day" className="obj-link mono">
          {stats.done} / {stats.total} TASKS · OPEN TIMETABLE →
        </Link>
      </motion.section>
      </div>

      {/* ── Daily timeline ── */}
      <motion.section className="home-timeline" {...enter(4)}>
        <div className="mono-label">Daily timeline</div>
        <DailyTimeline log={log} currentId={next?.block.id} onOpen={() => navigate('/my-day')} />
      </motion.section>

      {/* ── Aurora ring ── */}
      <motion.section className="home-ring" {...enter(5)}>
        <div className="mono-label center">Aurora progress ring</div>
        <AuroraRing value={stats.pct} onClick={() => navigate('/my-day')} />
      </motion.section>

      {/* ── Today's 1% ── */}
      <motion.section className="home-quote" {...enter(6)}>
        <div className="mono-label center">Today's 1%</div>
        <div className="quote-q">What will you improve today?</div>
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={focus?.text ?? 'empty'}
            className={cx('quote', !focus && 'is-empty')}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease }}
          >
            {focus ? `“${focus.text}”` : 'No improvement recorded yet.'}
          </motion.blockquote>
        </AnimatePresence>
        {focus?.from === 'yesterday' && <div className="quote-src mono">SET IN YESTERDAY'S REVIEW</div>}
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/daily-journal')}>
          Record today's improvement
        </button>
      </motion.section>

      {/* ── Streak ── */}
      <motion.button className="home-streak" onClick={() => navigate('/history')} {...enter(7)}>
        <div className="mono-label center">Streak</div>
        <div className="streak-num">
          <CountUp value={streak.current} duration={1600} />
        </div>
        <div className="streak-unit mono">DAY STREAK</div>
        <div className="streak-msg">{streakMessage(streak.current)}</div>
        {streak.longest > 0 && <div className="streak-best mono">BEST · {String(streak.longest).padStart(2, '0')}</div>}
      </motion.button>

      {/* ── Trading development ── */}
      <motion.section className="home-dev" {...enter(5)}>
        <div className="mono-label">Trading development</div>
        <button className="dev-rail" onClick={() => navigate('/analytics')} aria-label="Open analytics">
          {DEV.map((d, i) => (
            <ThinRing key={d.key} value={skills[d.key]} label={d.label} delay={0.4 + i * 0.15} />
          ))}
        </button>
      </motion.section>

      {/* ── 1% journey ── */}
      <motion.section className="home-journey" {...enter(8)}>
        <div className="row between">
          <div className="mono-label">The 1% journey · Phase {phase.code} — {phase.name}</div>
          <Link to="/journey" className="mono-label link">
            {journey.completed} / {TOTAL_DAYS} complete
          </Link>
        </div>
        <JourneyPath current={day} done={journey.byDay} onSelect={(d) => navigate(`/journey/${d}`)} onEnd={() => navigate('/playbook')} />
      </motion.section>
    </div>
  );
}

function streakMessage(n: number): string {
  if (n === 0) return 'Every streak begins with a single day.';
  if (n < 3) return 'Momentum is building.';
  if (n < 14) return 'Consistency is becoming a habit.';
  return 'Discipline is now part of who you are.';
}

function RotatingWord() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((x) => (x + 1) % WORDS.length), 3800);
    return () => clearInterval(t);
  }, [reduce]);
  return (
    <div className="rotating-word mono" aria-hidden>
      <span className="dim">SYSTEM MODE /</span>
      <AnimatePresence mode="wait">
        <motion.span key={WORDS[i]} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.7 }}>
          {WORDS[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function DailyTimeline({ log, currentId, onOpen }: { log: DayLog; currentId?: string; onOpen: () => void }) {
  const reduce = useReducedMotion();
  const [beam, setBeam] = useState(0);
  useEffect(() => corePulse.on(() => setBeam((b) => b + 1)), []);
  return (
    <div className="dtl" onClick={onOpen} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpen()}>
      <div className="dtl-line">
        {beam > 0 && !reduce && (
          <motion.i key={beam} className="dtl-beam" initial={{ top: '-10%', opacity: 0 }} animate={{ top: '105%', opacity: [0, 1, 1, 0] }} transition={{ duration: 1.4, ease: 'easeInOut' }} />
        )}
      </div>
      {TIMELINE.map((t) => {
        const b = block(t.id);
        const done = blockDone(log, b);
        const current = currentId === t.id;
        return (
          <div key={t.id} className={cx('dtl-item', done && 'done', current && 'current')}>
            <span className="dtl-time mono">{minToClock(hmToMin(b.start))}</span>
            <span className="dtl-dot" />
            <span className="dtl-label">{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function AuroraRing({ value, onClick }: { value: number; onClick: () => void }) {
  const reduce = useReducedMotion();
  const [pulse, setPulse] = useState(0);
  useEffect(() => corePulse.on(() => setPulse((p) => p + 1)), []);
  const r = 92;
  const c = 2 * Math.PI * r;
  const v = Math.min(1, Math.max(0, value));
  return (
    <motion.button
      className="aurora-ring"
      onClick={onClick}
      key={pulse}
      initial={pulse && !reduce ? { scale: 1.04 } : false}
      animate={{ scale: 1 }}
      transition={{ duration: 1.4, ease }}
      aria-label={`Today ${Math.round(v * 100)}% complete`}
    >
      <svg viewBox="0 0 220 220">
        <defs>
          <linearGradient id="aurora-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9d8fca" />
            <stop offset="45%" stopColor="#d9cfe8" />
            <stop offset="100%" stopColor="#ecd9b0" />
            {!reduce && <animateTransform attributeName="gradientTransform" type="rotate" from="0 .5 .5" to="360 .5 .5" dur="14s" repeatCount="indefinite" />}
          </linearGradient>
          <filter id="aurora-blur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <circle cx="110" cy="110" r={r} fill="none" stroke="rgba(236,228,214,0.07)" strokeWidth="6" />
        <circle cx="110" cy="110" r={r + 12} fill="none" stroke="rgba(236,228,214,0.05)" strokeWidth="1" />
        {/* soft aurora bloom underneath the stroke */}
        <motion.circle
          cx="110"
          cy="110"
          r={r}
          fill="none"
          stroke="url(#aurora-g)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          transform="rotate(-90 110 110)"
          filter="url(#aurora-blur)"
          opacity={0.55}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - v) }}
          transition={{ duration: reduce ? 0 : 2, ease }}
        />
        <motion.circle
          cx="110"
          cy="110"
          r={r}
          fill="none"
          stroke="url(#aurora-g)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={c}
          transform="rotate(-90 110 110)"
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - v) }}
          transition={{ duration: reduce ? 0 : 2, ease }}
        />
      </svg>
      <span className="aurora-center">
        <span className="mono-label">Today</span>
        <span className="aurora-value">
          <CountUp value={Math.round(v * 100)} duration={1600} />
          <small>%</small>
        </span>
      </span>
    </motion.button>
  );
}

function ThinRing({ value, label, delay }: { value: number; label: string; delay: number }) {
  const reduce = useReducedMotion();
  const r = 40;
  const c = 2 * Math.PI * r;
  const v = Math.min(1, Math.max(0, value));
  return (
    <span className="thin-ring">
      <svg viewBox="0 0 100 100">
        <defs>
          <linearGradient id="thin-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c4b9e6" />
            <stop offset="100%" stopColor="#ecd9b0" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(236,228,214,0.1)" strokeWidth="1" />
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="url(#thin-g)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray={c}
          transform="rotate(-90 50 50)"
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - v) }}
          transition={{ duration: reduce ? 0 : 1.8, delay: reduce ? 0 : delay, ease }}
        />
      </svg>
      <span className="thin-ring-inner">
        <span className="thin-label mono">{label}</span>
        <span className="thin-value">
          <CountUp value={Math.round(v * 100)} />%
        </span>
      </span>
    </span>
  );
}

/** 84 days as a single flowing path of light. */
function JourneyPath({
  current,
  done,
  onSelect,
  onEnd,
}: {
  current: number;
  done: Map<number, { completed: boolean }>;
  onSelect: (d: number) => void;
  onEnd: () => void;
}) {
  const W = 1200;
  const H = 150;
  const padL = 30;
  const padR = 230;
  const pt = (i: number) => {
    const t = i / (TOTAL_DAYS - 1);
    const x = padL + t * (W - padL - padR);
    const y = 78 + Math.sin(t * Math.PI * 2.2 + 0.4) * 16 + Math.sin(t * Math.PI * 5.3) * 5;
    return { x, y };
  };
  const pts = Array.from({ length: TOTAL_DAYS }, (_, i) => pt(i));
  const d = pts.map((p, i) => `${i ? 'L' : 'M'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const lastLit = Math.max(current, ...[...done.entries()].filter(([, v]) => v.completed).map(([k]) => k));
  const litLen = (lastLit - 1) / (TOTAL_DAYS - 1);
  const labels = new Set([1, 7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84, current]);
  const end = pts[TOTAL_DAYS - 1];

  return (
    <div className="jpath">
      <svg viewBox={`0 0 ${W} ${H}`} role="list" aria-label="84-day journey">
        <defs>
          <linearGradient id="jp-lit" x1="0" x2="1">
            <stop offset="0" stopColor="#9d8fca" stopOpacity="0.5" />
            <stop offset="1" stopColor="#ecd9b0" />
          </linearGradient>
          <filter id="jp-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={d} fill="none" stroke="rgba(236,228,214,0.12)" strokeWidth="1" />
        <motion.path
          d={d}
          fill="none"
          stroke="url(#jp-lit)"
          strokeWidth="1.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: litLen }}
          transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
        />
        {pts.map((p, i) => {
          const day = i + 1;
          const state = journeyState(day, current, done.get(day) as never);
          const isLabel = labels.has(day);
          return (
            <g key={day} role="listitem" className={cx('jnode', state)} onClick={() => onSelect(day)} style={{ cursor: 'pointer' }}>
              <title>{`Day ${day} · ${lessonFor(day).title}`}</title>
              <circle cx={p.x} cy={p.y} r={10} fill="transparent" />
              {state === 'current' && <circle cx={p.x} cy={p.y} r={9} className="jnode-halo" />}
              <circle cx={p.x} cy={p.y} r={state === 'current' ? 5.5 : isLabel ? 3.2 : 1.8} className="jnode-dot" filter={state === 'complete' || state === 'current' ? 'url(#jp-glow)' : undefined} />
              {isLabel && (
                <text x={p.x} y={p.y + (i % 2 ? 30 : -18)} className="jnode-label">
                  DAY {String(day).padStart(2, '0')}
                </text>
              )}
            </g>
          );
        })}
        <g className="jpath-end" onClick={onEnd} style={{ cursor: 'pointer' }}>
          <line x1={end.x + 10} y1={end.y} x2={end.x + 44} y2={end.y} stroke="rgba(236,228,214,0.3)" />
          <circle cx={end.x + 60} cy={end.y} r={15} fill="rgba(255,255,255,0.04)" stroke="rgba(236,228,214,0.35)" />
          <path d={`M ${end.x + 54} ${end.y} h 12 m -4 -4 l 4 4 l -4 4`} fill="none" stroke="#f1ece4" strokeWidth="1.3" />
          <text x={end.x + 86} y={end.y - 4} className="jpath-end-a">
            84 DAYS
          </text>
          <text x={end.x + 86} y={end.y + 12} className="jpath-end-b">
            PERSONAL PLAYBOOK
          </text>
        </g>
      </svg>
    </div>
  );
}
