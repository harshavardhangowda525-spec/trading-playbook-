import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, Check, Flame, Play, Plus, Sparkles } from 'lucide-react';
import { OrbitalCore } from '../components/OrbitalCore';
import { CountUp, Panel, RingMeter, SegBar, cx, reveal } from '../components/ui';
import { BLOCKS, CORE_CATEGORIES, type Block, type Category } from '../data/schedule';
import { TOTAL_DAYS, lessonFor, phaseFor } from '../data/curriculum';
import { useDayLog } from '../lib/daylog';
import { useDayLogs, useJourney, useJourneyDay, useSkills } from '../lib/data';
import { useDoc, useNow, useToday } from '../lib/hooks';
import { formatDuration, hmToMin, minTo12, minToClock, nowMinutes } from '../lib/dates';
import {
  C,
  DEFAULT_PLAYBOOK,
  computeStreak,
  emptyJournal,
  isTaskDone,
  journeyState,
  playbookCompletion,
  type DayLog,
  type JournalEntry,
  type Playbook,
  type Skills,
} from '../lib/domain';
import '../styles/dashboard.css';

/** Where each orbit / category indicator leads. */
const CATEGORY_LINKS: Record<Category, string> = {
  trading: '/trading-schedule',
  study: '/my-day?task=study_am',
  business: '/my-day?task=client_acq',
  fitness: '/my-day?task=workout',
  discipline: '/my-day?task=daily_review',
  routine: '/my-day',
};

const TIMETABLE_PREVIEW = ['wake', 'manifest', 'trading_edu', 'deep_work', 'client_acq', 'darwin', 'trading_practice', 'workout', 'daily_review'];

const DEV_METERS: { key: keyof Skills; label: string }[] = [
  { key: 'knowledge', label: 'Knowledge' },
  { key: 'chart', label: 'Chart Reading' },
  { key: 'risk', label: 'Risk Mgmt' },
  { key: 'strategy', label: 'Strategy' },
  { key: 'backtesting', label: 'Backtesting' },
  { key: 'simulation', label: 'Simulation' },
  { key: 'discipline', label: 'Discipline' },
  { key: 'psychology', label: 'Psychology' },
];

const MILESTONES = [1, 7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84];
const LABELLED = [1, 14, 28, 42, 56, 70, 84];

function blockDone(log: DayLog, b: Block): boolean {
  if (b.counters) return b.counters.every((c) => !!log.done[c.id]);
  return isTaskDone(log, b.id);
}

/** First unfinished block whose window hasn't ended; else the earliest overdue one. */
function findNextTask(log: DayLog, now: number) {
  const open = BLOCKS.filter((b) => !blockDone(log, b));
  if (!open.length) return null;
  const upcoming = open.find((b) => hmToMin(b.end ?? b.start) > now);
  if (upcoming) {
    const start = hmToMin(upcoming.start);
    const end = hmToMin(upcoming.end ?? upcoming.start);
    return { block: upcoming, state: start <= now ? ('active' as const) : ('upcoming' as const), start, end };
  }
  const b = open[0];
  return { block: b, state: 'overdue' as const, start: hmToMin(b.start), end: hmToMin(b.end ?? b.start) };
}

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
  const [playbook] = useDoc<Playbook>(C.playbook, 'main', DEFAULT_PLAYBOOK);
  const journalFallback = useMemo(() => emptyJournal(today), [today]);
  const [journal] = useDoc<JournalEntry>(C.journal, today, journalFallback);

  const streak = useMemo(() => computeStreak('daily', logs, today), [logs, today]);
  const overall = journey.completed / TOTAL_DAYS;
  const playbookPct = playbookCompletion(playbook);
  const nowMin = nowMinutes(now);
  const next = findNextTask(log, nowMin);
  const progress = useMemo(
    () => Object.fromEntries(CORE_CATEGORIES.map((c) => [c, stats.byCategory[c].pct])) as Record<Category, number>,
    [stats],
  );
  const lessonDone = !!journey.byDay.get(day)?.completed;

  const startNext = () => {
    if (!next) return navigate('/my-day');
    if (next.block.tradingSession) navigate('/trading-schedule');
    else navigate(`/my-day?task=${next.block.id}`);
  };

  const pctLabel = (c: Category) => {
    const r = stats.byCategory[c];
    return r.pct >= 1 ? 'Complete' : `${Math.round(r.pct * 100)}%`;
  };

  return (
    <div className="dash">
      {/* ── LEFT ───────────────────────────────────────────── */}
      <div className="dash-left">
        <motion.div variants={reveal} initial="hidden" animate="show" custom={0}>
          <Panel className="streak-panel" hud onClick={() => navigate('/history')}>
            <div className="panel-title">
              <span>Streak</span>
              <Flame size={16} className="cyan" />
            </div>
            <div className="streak-body">
              <span className="streak-flame" aria-hidden>
                🔥
              </span>
              <div>
                <div className="stat-label">Current streak</div>
                <div className="streak-num">
                  <CountUp value={streak.current} /> <span>{streak.current === 1 ? 'DAY' : 'DAYS'}</span>
                </div>
              </div>
            </div>
            <div className="streak-foot">
              LONGEST STREAK: <b className="num">{streak.longest}</b> {streak.longest === 1 ? 'DAY' : 'DAYS'}
            </div>
          </Panel>
        </motion.div>

        <motion.div variants={reveal} initial="hidden" animate="show" custom={1}>
          <Panel title="Trading Development" onClick={() => navigate('/analytics')}>
            <div className="dev-grid">
              {DEV_METERS.map((m, i) => (
                <RingMeter key={m.key} value={skills[m.key]} size={62} stroke={3.5} label={m.label} delay={0.2 + i * 0.06} />
              ))}
            </div>
          </Panel>
        </motion.div>
      </div>

      {/* ── CENTER ─────────────────────────────────────────── */}
      <div className="dash-center">
        <Link to="/journey" className="day-header">
          <div className="day-title">
            DAY <CountUp value={day} /> / {TOTAL_DAYS}
          </div>
          <div className="day-sub">1% JOURNEY · PHASE {phase.code} — {phase.short}</div>
        </Link>
        <div className="day-meta">
          <span>
            OVERALL <b className="num">{Math.round(overall * 100)}%</b>
          </span>
          <span>
            PLAYBOOK <b className="num">{Math.round(playbookPct * 100)}%</b>
          </span>
          <span>
            LESSONS <b className="num">{journey.completed}</b>/{TOTAL_DAYS}
          </span>
        </div>

        <OrbitalCore progress={progress} onSelect={(c) => navigate(CATEGORY_LINKS[c])} />

        <div className="mission-row">
          <div className="cat-rings left">
            {(['trading', 'study'] as Category[]).map((c, i) => (
              <CategoryRing key={c} cat={c} value={stats.byCategory[c].pct} delay={0.4 + i * 0.1} onClick={() => navigate(CATEGORY_LINKS[c])} />
            ))}
          </div>

          <motion.section
            className="glass glow hud mission"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mission-scan" aria-hidden />
            <h2 className="mission-title">TODAY'S MISSION</h2>
            <p className="mission-objective">Complete today's trading education + execute the planned daily routine.</p>
            <div className="mission-lesson">
              <div className="stat-label" style={{ marginBottom: 4 }}>
                <Sparkles size={11} style={{ verticalAlign: -1 }} /> Today's 1% improvement · Day {day}
              </div>
              <div>
                <span className="k">LEARN</span> {lesson.learn}
              </div>
              <div>
                <span className="k">PRACTICE</span> {lesson.practice}
              </div>
              <div>
                <span className="k">JOURNAL</span> {lesson.journal}
              </div>
            </div>
            <div className="row between" style={{ marginTop: 12 }}>
              <span className="stat-label">Daily completion</span>
              <span className="num cyan" style={{ fontWeight: 700 }}>
                <CountUp value={Math.round(stats.pct * 100)} suffix="%" />
              </span>
            </div>
            <SegBar value={stats.pct} segments={22} />
            <div className="tiny muted mono" style={{ marginTop: 6 }}>
              {stats.done} / {stats.total} TASKS COMPLETE
            </div>
            <div className="mission-actions">
              <button className="btn btn-primary" onClick={() => navigate(`/journey/${day}`)}>
                {lessonDone ? <Check size={15} /> : <Play size={15} />}
                {lessonDone ? "Review Today's Session" : "Start Today's Session"}
              </button>
              <button className="btn" onClick={() => navigate('/my-day')}>
                Resume Mission <ArrowRight size={15} />
              </button>
            </div>
          </motion.section>

          <div className="cat-rings right">
            {(['business', 'fitness', 'discipline'] as Category[]).map((c, i) => (
              <CategoryRing key={c} cat={c} value={stats.byCategory[c].pct} delay={0.6 + i * 0.1} onClick={() => navigate(CATEGORY_LINKS[c])} />
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT ──────────────────────────────────────────── */}
      <div className="dash-right">
        <motion.div variants={reveal} initial="hidden" animate="show" custom={1}>
          <Panel className="next-task" hud>
            <div className="panel-title">
              <span>Next Task</span>
              <span className={cx('next-state', next?.state)}>{next ? next.state.toUpperCase() : 'ALL CLEAR'}</span>
            </div>
            {next ? (
              <>
                <div className="next-time">{minTo12(next.start)}</div>
                <div className="next-label">{next.block.label}</div>
                <p className="next-hint">{next.block.hint ?? nextHint(next.block)}</p>
                <div className="next-controls">
                  <NextCountdown start={next.start} end={next.end} nowMin={nowMin} state={next.state} />
                  <div className="col gap-4 grow">
                    <button className="btn btn-primary btn-sm" onClick={startNext}>
                      <Play size={13} /> Start
                    </button>
                    {!next.block.counters && (
                      <button className="btn btn-sm" onClick={() => toggleTask(next.block.id)}>
                        <Check size={13} /> Complete Task
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="col" style={{ alignItems: 'flex-start' }}>
                <div className="next-label">DAY COMPLETE</div>
                <p className="next-hint">Every task is done. System status: optimal.</p>
              </div>
            )}
          </Panel>
        </motion.div>

        <motion.div variants={reveal} initial="hidden" animate="show" custom={2}>
          <Panel title="Today's Timetable" onClick={() => navigate('/my-day')} className="tt-panel">
            <ul className="tt-list">
              {TIMETABLE_PREVIEW.map((id) => {
                const b = BLOCKS.find((x) => x.id === id)!;
                const done = blockDone(log, b);
                const current = next?.block.id === id;
                return (
                  <li key={id} className={cx('tt-item', done && 'done', current && 'current')}>
                    <span className="tt-time">{minToClock(hmToMin(b.start))}</span>
                    <span className="tt-label">{b.short}</span>
                    <span className="tt-mark">
                      {done ? (
                        <motion.svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                          <motion.path d="M5 12.5l4.5 4.5L19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
                        </motion.svg>
                      ) : current ? (
                        <ArrowRight size={15} />
                      ) : null}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Panel>
        </motion.div>
      </div>

      {/* ── BOTTOM ─────────────────────────────────────────── */}
      <div className="dash-bottom">
        <Panel className="journey-panel" pad>
          <div className="panel-title">
            <Link to="/journey" style={{ color: 'inherit' }}>
              1% Journey <span className="sub">({TOTAL_DAYS} days)</span>
            </Link>
            <span className="sub">
              {journey.completed} COMPLETE · DAY {day}
            </span>
          </div>
          <JourneyStrip current={day} completed={journey.byDay} onSelect={(d) => navigate(`/journey/${d}`)} />
          <div className="quick-actions">
            <button className="cmd-btn" onClick={() => navigate('/trading-journal?new=1')}>
              <Plus size={14} /> New Trade
            </button>
            <button className="cmd-btn" onClick={() => navigate('/daily-journal')}>
              <Plus size={14} /> Journal
            </button>
            <button className="cmd-btn" onClick={() => navigate('/backtesting?new=1')}>
              <Plus size={14} /> Backtest
            </button>
            <button className="cmd-btn" onClick={() => navigate('/vault?new=1')}>
              <Plus size={14} /> Knowledge Note
            </button>
            <button className="cmd-btn" onClick={() => navigate('/strategy-lab?new=1')}>
              <Plus size={14} /> Strategy
            </button>
            <button className="cmd-btn accent" onClick={() => navigate('/playbook')}>
              View Playbook
            </button>
          </div>
        </Panel>

        <Panel className="syscheck" hud>
          <div className="panel-title">
            <span>End-of-Day System Check</span>
            <span className="ai-badge">
              <Bot size={12} /> AI
            </span>
          </div>
          <div className="syscheck-grid">
            <span>Tasks</span>
            <b className="num">
              {stats.done}/{stats.total}
            </b>
            <span>Trading</span>
            <b className={stats.byCategory.trading.pct >= 1 ? 'good' : ''}>{pctLabel('trading')}</b>
            <span>Study</span>
            <b className={stats.byCategory.study.pct >= 1 ? 'good' : ''}>{pctLabel('study')}</b>
            <span>Business</span>
            <b className={stats.byCategory.business.pct >= 1 ? 'good' : ''}>{pctLabel('business')}</b>
            <span>Workout</span>
            <b className={stats.byCategory.fitness.pct >= 1 ? 'good' : ''}>{stats.byCategory.fitness.pct >= 1 ? 'Complete' : 'Pending'}</b>
          </div>
          <div className="divider" style={{ margin: '12px 0' }} />
          <div className="stat-label">Today's 1% improvement</div>
          {journal.improvement.trim() ? (
            <p className="syscheck-answer">{journal.improvement}</p>
          ) : (
            <div className="row between wrap" style={{ marginTop: 6 }}>
              <span className="small dim">No improvement recorded yet.</span>
              <button className="btn btn-sm" onClick={() => navigate('/daily-journal')}>
                <Plus size={13} /> Add Improvement
              </button>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function nextHint(b: Block): string {
  if (b.counters) return 'Calls, DMs, follow-ups and proposals — log your counts as you work.';
  if (b.backup) return 'Client delivery — or pick a backup deep-work task.';
  return `${minTo12(hmToMin(b.start))} – ${minTo12(hmToMin(b.end ?? b.start))}`;
}

function CategoryRing({ cat, value, delay, onClick }: { cat: Category; value: number; delay: number; onClick: () => void }) {
  return (
    <button className="cat-ring" onClick={onClick} aria-label={`${cat} ${Math.round(value * 100)}%`}>
      <span className="stat-label">{cat}</span>
      <RingMeter value={value} size={68} stroke={3.5} delay={delay} />
    </button>
  );
}

function NextCountdown({ start, end, nowMin, state }: { start: number; end: number; nowMin: number; state: 'active' | 'upcoming' | 'overdue' }) {
  const dur = Math.max(1, end - start);
  const value = state === 'active' ? (nowMin - start) / dur : state === 'overdue' ? 1 : 0;
  const text =
    state === 'active'
      ? `${Math.max(0, Math.ceil(end - nowMin))}m left`
      : state === 'upcoming'
        ? `in ${formatDuration((start - nowMin) * 60).replace(/:\d\d$/, '')}`
        : 'overdue';
  return (
    <RingMeter value={value} size={64} stroke={3} ticks={false} color={state === 'overdue' ? 'var(--warn)' : 'var(--cyan)'}>
      <span className="mono" style={{ fontSize: 9.5, lineHeight: 1.1, color: 'var(--text-2)', maxWidth: 48, textAlign: 'center' }}>
        {text}
      </span>
    </RingMeter>
  );
}

function JourneyStrip({
  current,
  completed,
  onSelect,
}: {
  current: number;
  completed: Map<number, { completed: boolean }>;
  onSelect: (day: number) => void;
}) {
  const days = Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1);
  const lit = Math.max(0, ...days.filter((d) => completed.get(d)?.completed));
  return (
    <div className="jstrip" role="list">
      <div className="jstrip-track">
        <div className="jstrip-fill" style={{ width: `${((Math.max(lit, current) - 1) / (TOTAL_DAYS - 1)) * 100}%` }} />
      </div>
      <div className="jstrip-ticks">
        {days.map((d) => {
          const state = journeyState(d, current, completed.get(d) as never);
          const milestone = MILESTONES.includes(d) || d === current;
          return (
            <button
              key={d}
              role="listitem"
              className={cx('jtick', state, milestone && 'milestone', (d === 1 || d === 42 || d === TOTAL_DAYS) && 'major')}
              style={{ left: `${((d - 1) / (TOTAL_DAYS - 1)) * 100}%` }}
              onClick={() => onSelect(d)}
              title={`Day ${d} · ${lessonFor(d).title} · ${state}`}
            >
              <i />
              {(LABELLED.includes(d) || d === current) && <span>DAY {String(d).padStart(2, '0')}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
