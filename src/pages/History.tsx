import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, CalendarCheck, ChevronLeft, ChevronRight, Flame, NotebookPen } from 'lucide-react';
import { scheduleFor } from '../data/schedule';
import {
  C,
  STREAK_META,
  computeStreak,
  counterTarget,
  blockDone,
  dayStats,
  isTaskDone,
  journalScore,
  sessionStats,
  type JournalEntry,
  type StreakKind,
} from '../lib/domain';
import { useDayLogs, useJourney, useProfile } from '../lib/data';
import { addDays, daysInMonth, formatHeaderDate, fromKey, startOfMonth, toKey } from '../lib/dates';
import { useCollection, useToday } from '../lib/hooks';
import { CountUp, PageHeader, Panel, RingMeter, cx, reveal } from '../components/ui';
import '../styles/schedule.css';

const DOW = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const STREAK_KINDS = Object.keys(STREAK_META) as StreakKind[];

export function HistoryPage() {
  const today = useToday();
  const [month, setMonth] = useState(() => startOfMonth(today));
  const [selected, setSelected] = useState(today);
  const { map } = useDayLogs();
  const journals = useCollection<JournalEntry>(C.journal).items;
  const { items: journey } = useJourney();

  const journalByDate = useMemo(() => new Map(journals.map((j) => [j.date || j.id, j])), [journals]);
  const lessonDates = useMemo(() => new Set(journey.filter((j) => j.completed && j.completedDate).map((j) => j.completedDate!)), [journey]);
  const streaks = useMemo(() => STREAK_KINDS.map((k) => ({ kind: k, ...computeStreak(k, map, today) })), [map, today]);
  const daily = streaks.find((s) => s.kind === 'daily')!;

  const m = fromKey(month);
  const lead = (m.getDay() + 6) % 7;
  const days = Array.from({ length: daysInMonth(month) }, (_, i) => addDays(month, i));
  const shiftMonth = (n: number) => setMonth(toKey(new Date(m.getFullYear(), m.getMonth() + n, 1)));
  const monthLabel = m.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }).toUpperCase();

  return (
    <div>
      <PageHeader eyebrow="MISSION ARCHIVE" title="HISTORY" description="Every day you have logged. Missing a day never erases what you built." />

      <motion.div variants={reveal} initial="hidden" animate="show" custom={0}>
        <Panel hud glow className="mb-16">
          <div className="hx-hero">
            <Flame size={30} className="cyan glow-text" />
            <span className="sc-big">
              <CountUp value={daily.current} /> DAY CONSISTENCY STREAK
            </span>
            <span className="muted small">Longest: {daily.longest} days</span>
          </div>
          <div className="hx-streaks">
            {streaks.map((s) => (
              <div key={s.kind}>
                <span className="stat-label">{STREAK_META[s.kind].label}</span>
                <span className="row" style={{ alignItems: 'baseline', gap: 6 }}>
                  <span className="stat-value">
                    <CountUp value={s.current} />
                  </span>
                  <span className="tiny muted">days</span>
                </span>
                <span className="tiny muted">Longest: <span className="mono">{s.longest}</span></span>
                <span className="tiny dim">{STREAK_META[s.kind].rule}</span>
              </div>
            ))}
          </div>
        </Panel>
      </motion.div>

      <div className="hx-layout">
        <motion.div variants={reveal} initial="hidden" animate="show" custom={1}>
          <Panel
            hud
            title={monthLabel}
            actions={
              <>
                <button className="icon-btn" onClick={() => shiftMonth(-1)} aria-label="Previous month">
                  <ChevronLeft size={16} />
                </button>
                <button
                  className="btn btn-sm"
                  onClick={() => {
                    setMonth(startOfMonth(today));
                    setSelected(today);
                  }}
                >
                  Today
                </button>
                <button className="icon-btn" onClick={() => shiftMonth(1)} aria-label="Next month">
                  <ChevronRight size={16} />
                </button>
              </>
            }
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={month}
                className="hx-cal"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
              >
                {DOW.map((d) => (
                  <span key={d} className="hx-dow">
                    {d}
                  </span>
                ))}
                {Array.from({ length: lead }, (_, i) => (
                  <span key={`b${i}`} />
                ))}
                {days.map((k) => {
                  const future = k > today;
                  const pct = future ? 0 : dayStats(map.get(k), k).pct;
                  const hasJournal = journalByDate.has(k);
                  const hasLesson = lessonDates.has(k);
                  return (
                    <button
                      key={k}
                      type="button"
                      className={cx('hx-cell', future && 'future', k === today && 'today', k === selected && 'sel')}
                      style={{ ['--p' as string]: pct }}
                      onClick={() => !future && setSelected(k)}
                      disabled={future}
                      aria-label={`${k}: ${Math.round(pct * 100)}% complete`}
                    >
                      <span className="d">{fromKey(k).getDate()}</span>
                      {!future && map.has(k) && <span className="p">{Math.round(pct * 100)}%</span>}
                      <span className="hx-dots">
                        {hasJournal && <i title="Journal entry" />}
                        {hasLesson && <i className="lesson" title="Lesson completed" />}
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
            <div className="hx-legend">
              <span>
                <span className="hx-dots" style={{ position: 'static' }}>
                  <i />
                </span>
                Journal entry
              </span>
              <span>
                <span className="hx-dots" style={{ position: 'static' }}>
                  <i className="lesson" />
                </span>
                Lesson completed
              </span>
              <span>Glow = day completion %</span>
            </div>
          </Panel>
        </motion.div>

        <motion.div variants={reveal} initial="hidden" animate="show" custom={2}>
          <DayDetail date={selected} today={today} journal={journalByDate.get(selected)} lessonDone={lessonDates.has(selected)} map={map} />
        </motion.div>
      </div>
    </div>
  );
}

function DayDetail({
  date,
  today,
  journal,
  lessonDone,
  map,
}: {
  date: string;
  today: string;
  journal: JournalEntry | undefined;
  lessonDone: boolean;
  map: ReturnType<typeof useDayLogs>['map'];
}) {
  const { profile } = useProfile();
  const log = map.get(date);
  const sched = scheduleFor(date, log);
  const stats = dayStats(log, date);
  const past = date < today;
  // Tasks of that day's schedule, labelled with their block so repeated names stay clear.
  const tasks = sched.tasks.map((t) => {
    const block = sched.blocks.find((b) => b.id === t.blockId);
    return { ...t, label: sched.version === 2 && block ? `${block.short} · ${t.label}` : t.label };
  });
  const completed = tasks.filter((t) => isTaskDone(log, t.id, date));
  const missed = tasks.filter((t) => !isTaskDone(log, t.id, date));
  const study = sched.blocks.filter((b) => b.category === 'study');
  const score = journalScore(journal);
  const workout = sched.blocks.find((b) => b.id === 'workout') ?? sched.blocks.find((b) => b.category === 'fitness');

  return (
    <Panel hud title={formatHeaderDate(date)} sub={date === today ? 'Today' : undefined}>
      <div className="row" style={{ gap: 18, flexWrap: 'wrap' }}>
        <RingMeter value={stats.pct} size={92} label="Day score" />
        <div className="col" style={{ gap: 4 }}>
          <span className="stat-label">Tasks</span>
          <span className="stat-value sm num">
            {stats.done} / {stats.total}
          </span>
          <span className="stat-label" style={{ marginTop: 6 }}>
            Journal score
          </span>
          <span className="stat-value sm num">{score != null ? `${score}/100` : '—'}</span>
        </div>
      </div>

      <div className="hx-detail-block mt-16">
        <div className="sc-kicker">Trading sessions</div>
        <div className="hx-kv">
          {sched.sessions.map((s) => {
            const st = sessionStats(log, s.id, date);
            return <SessionKV key={s.id} label={s.subtitle} done={st.done} total={st.total} complete={st.complete} />;
          })}
        </div>
      </div>

      <div className="hx-detail-block">
        <div className="sc-kicker">Study sessions · Workout</div>
        <div className="hx-kv">
          {study.map((b) => (
            <DoneKV key={b.id} label={b.label} done={blockDone(log, b, date)} past={past} />
          ))}
          {workout && <DoneKV label={workout.label} done={blockDone(log, workout, date)} past={past} />}
          <DoneKV label="Lesson completed" done={lessonDone} past={past} />
        </div>
      </div>

      <div className="hx-detail-block">
        <div className="sc-kicker">Client acquisition</div>
        <div className="hx-kv">
          {sched.counters.map((c) => {
            const n = log?.counts?.[c.id] ?? 0;
            const target = counterTarget(profile, c.id);
            return (
              <span key={c.id} style={{ display: 'contents' }}>
                <span className={n >= target ? '' : 'muted'}>{c.label}</span>
                <span className={cx('mono', n >= target && 'cyan')}>
                  {n} / {target}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      <div className="hx-detail-block">
        <div className="sc-kicker">Completed tasks ({completed.length})</div>
        {completed.length ? (
          <ul className="hx-list">
            {completed.map((t) => (
              <li key={t.id} className="tag" style={{ color: 'var(--cyan-soft)' }}>
                {t.label}
              </li>
            ))}
          </ul>
        ) : (
          <p className="small dim" style={{ margin: '6px 0 0' }}>
            Nothing logged for this day.
          </p>
        )}
      </div>

      {(past || date === today) && missed.length > 0 && (
        <div className="hx-detail-block">
          <div className="sc-kicker">{past ? `Missed tasks (${missed.length})` : `Remaining today (${missed.length})`}</div>
          <ul className="hx-list">
            {missed.map((t) => (
              <li key={t.id} className="tag" style={{ color: 'var(--muted)' }}>
                {t.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="hx-detail-block">
        <div className="sc-kicker">1% improvement</div>
        <p className="small" style={{ margin: '6px 0 0', color: journal?.improvement?.trim() ? 'var(--text)' : 'var(--dim)' }}>
          {journal?.improvement?.trim() || 'No improvement recorded for this day.'}
        </p>
      </div>

      <div className="row wrap mt-16">
        <Link to={date === today ? '/my-day' : `/my-day?date=${date}`} className="btn btn-primary btn-sm">
          <CalendarCheck size={14} /> Open in My Day
        </Link>
        <Link to={`/daily-journal?date=${date}`} className="btn btn-sm">
          <NotebookPen size={14} /> Open Journal
        </Link>
        {lessonDone && (
          <span className="badge">
            <BookOpen size={12} /> Lesson done
          </span>
        )}
      </div>
    </Panel>
  );
}

function SessionKV({ label, done, total, complete }: { label: string; done: number; total: number; complete: boolean }) {
  return (
    <>
      <span>{label}</span>
      <span className={cx('badge', !complete && 'dim')}>{complete ? 'Complete' : `${done}/${total}`}</span>
    </>
  );
}

function DoneKV({ label, done, past }: { label: string; done: boolean; past: boolean }) {
  return (
    <>
      <span className={done ? '' : 'muted'}>{label}</span>
      <span className={cx('badge', done ? '' : 'dim')}>{done ? 'Done' : past ? 'Missed' : 'Open'}</span>
    </>
  );
}
