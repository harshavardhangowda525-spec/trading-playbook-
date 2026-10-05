import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, ArrowRight, ChevronLeft, ChevronRight, Crosshair, Lock, Minus, Plus } from 'lucide-react';
import { BACKUP_TASKS, BLOCKS, CATEGORY_META, CORE_CATEGORIES, SECTIONS, TASKS, type Block, type Counter } from '../data/schedule';
import { clientStats, dayStats, type DayLog } from '../lib/domain';
import { useDayLog } from '../lib/daylog';
import { useDayLogs } from '../lib/data';
import { addDays, daysInMonth, formatHeaderDate, hmToMin, minTo12, nowMinutes, rangeKeys, startOfMonth, startOfWeek } from '../lib/dates';
import { useNow, useToday } from '../lib/hooks';
import { Bar, CountUp, EmptyState, HoloCheck, PageHeader, Panel, RingMeter, SegBar, cx, reveal } from '../components/ui';
import '../styles/schedule.css';

const KEY_RE = /^\d{4}-\d{2}-\d{2}$/;
const t12 = (hm: string) => minTo12(hmToMin(hm));
type Day = ReturnType<typeof useDayLog>;

/** Σdone ÷ Σtotal over the given dates (dates without a log count as 0 done). */
function periodPct(keys: string[], map: Map<string, DayLog>): number {
  if (!keys.length) return 0;
  const done = keys.reduce((a, k) => a + dayStats(map.get(k)).done, 0);
  return done / (keys.length * TASKS.length);
}

export function MyDay() {
  const today = useToday();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const raw = params.get('date');
  const date = raw && KEY_RE.test(raw) ? raw : today;
  const focusTask = params.get('task');
  const isToday = date === today;
  const isFuture = date > today;

  const day = useDayLog(date);
  const { map } = useDayLogs();
  const now = useNow(30_000);
  const nowMin = isToday ? nowMinutes(now) : -1;

  const { week, month } = useMemo(() => {
    const cap = (keys: string[]) => keys.filter((k) => k <= today);
    const ws = startOfWeek(date);
    const ms = startOfMonth(date);
    return {
      week: periodPct(cap(rangeKeys(ws, addDays(ws, 6))), map),
      month: periodPct(cap(rangeKeys(ms, addDays(ms, daysInMonth(date) - 1))), map),
    };
  }, [date, today, map]);

  // Deep-link: ?task=<id> scrolls that row into view and flashes it.
  const [flash, setFlash] = useState<string | null>(null);
  useEffect(() => {
    if (!focusTask) return;
    const t = setTimeout(() => {
      const el = document.getElementById(`task-${focusTask}`);
      if (!el) return;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setFlash(focusTask);
    }, 380);
    const t2 = setTimeout(() => setFlash(null), 2800);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [focusTask, date]);

  const go = (k: string) => navigate(k === today ? '/my-day' : `/my-day?date=${k}`);
  const { stats } = day;

  return (
    <div>
      <PageHeader
        eyebrow={`${isToday ? 'TODAY · ' : ''}${formatHeaderDate(date)}`}
        title="MY DAY"
        description="Your timetable for the day. Tick each block as you complete it."
        actions={
          <div className="md-nav">
            <button className="icon-btn" onClick={() => go(addDays(date, -1))} aria-label="Previous day">
              <ChevronLeft size={16} />
            </button>
            <button className={cx('btn btn-sm', isToday && 'btn-primary')} onClick={() => go(today)}>
              Today
            </button>
            <button className="icon-btn" onClick={() => go(addDays(date, 1))} aria-label="Next day">
              <ChevronRight size={16} />
            </button>
            <input
              type="date"
              className="input"
              style={{ height: 34, width: 150 }}
              value={date}
              onChange={(e) => KEY_RE.test(e.target.value) && go(e.target.value)}
              aria-label="Choose date"
            />
          </div>
        }
      />

      {isFuture && (
        <div className="notice md-readonly row">
          <Lock size={14} className="cyan" /> Future day — read-only preview. You can tick tasks once the day arrives.
        </div>
      )}

      <motion.div variants={reveal} initial="hidden" animate="show" custom={0}>
        <Panel hud glow className="md-top">
          <div className="md-hero">
            <div>
              <div className="sc-kicker">{isToday ? "Today's progress" : 'Day progress'}</div>
              <div style={{ marginTop: 12 }}>
                <SegBar value={stats.pct} segments={24} height={14} />
              </div>
              <div className="md-hero-pct">
                <span className="sc-big">
                  <CountUp value={Math.round(stats.pct * 100)} />
                  <span style={{ fontSize: '0.45em', color: 'var(--muted)' }}>%</span>
                </span>
                <span className="muted">
                  <span className="mono" style={{ color: '#fff' }}>
                    {stats.done} / {stats.total}
                  </span>{' '}
                  tasks completed
                </span>
              </div>
              <div className="md-periods">
                <div className="md-period">
                  <span className="sc-kicker">Week</span>
                  <span className="display" style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>
                    <CountUp value={Math.round(week * 100)} />%
                  </span>
                  <Bar value={week} />
                </div>
                <div className="md-period">
                  <span className="sc-kicker">Month</span>
                  <span className="display" style={{ fontSize: 24, fontWeight: 700, color: '#fff' }}>
                    <CountUp value={Math.round(month * 100)} />%
                  </span>
                  <Bar value={month} />
                </div>
              </div>
            </div>
            <div className="md-rings">
              {CORE_CATEGORIES.map((c, i) => (
                <RingMeter key={c} value={stats.byCategory[c].pct} size={78} color={CATEGORY_META[c].color} label={CATEGORY_META[c].label} delay={i * 0.08} />
              ))}
            </div>
          </div>
        </Panel>
      </motion.div>

      <div className="md-sections">
        {SECTIONS.map((sec, i) => {
          const blocks = BLOCKS.filter((b) => b.section === sec.id);
          const tasks = TASKS.filter((t) => blocks.some((b) => b.id === t.blockId));
          const done = tasks.filter((t) => day.isDone(t.id)).length;
          return (
            <motion.div key={sec.id} variants={reveal} initial="hidden" animate="show" custom={i + 1}>
              <Panel>
                <div className="md-section-head">
                  <h2>{sec.title}</h2>
                  <span className="row" style={{ gap: 12 }}>
                    <span className="tiny mono muted">{sec.range}</span>
                    <span className="badge dim">
                      {done}/{tasks.length}
                    </span>
                  </span>
                </div>
                <div className="col" style={{ gap: 2 }}>
                  {blocks.map((b) => (
                    <BlockView key={b.id} block={b} day={day} nowMin={nowMin} flash={flash} />
                  ))}
                </div>
              </Panel>
            </motion.div>
          );
        })}
      </div>

      <Panel title={<span className="row" style={{ gap: 8 }}><Activity size={15} className="cyan" /> Daily activity log</span>} className="mt-16">
        <ActivityLog log={day.log} />
      </Panel>
    </div>
  );
}

// ─── Blocks ────────────────────────────────────────────────────────────────

function isCurrent(b: Block, nowMin: number) {
  return nowMin >= 0 && nowMin >= hmToMin(b.start) && nowMin < hmToMin(b.end ?? b.start);
}

function CatTag({ block }: { block: Block }) {
  return (
    <span className="md-cat" style={{ ['--cc' as string]: CATEGORY_META[block.category].color }}>
      <i />
      {CATEGORY_META[block.category].label}
    </span>
  );
}

function TimeRange({ block }: { block: Block }) {
  return (
    <span className="task-time">
      {t12(block.start)}
      {block.end && ` – ${t12(block.end)}`}
    </span>
  );
}

function BlockView({ block, day, nowMin, flash }: { block: Block; day: Day; nowMin: number; flash: string | null }) {
  const current = isCurrent(block, nowMin);
  if (block.counters) return <ClientBlock block={block} day={day} current={current} flash={flash} />;

  const done = day.isDone(block.id);
  const sub = block.tradingSession ? day.session(block.tradingSession) : null;
  return (
    <div className={cx(block.backup && 'md-group')}>
      <motion.div
        id={`task-${block.id}`}
        className={cx('task-row md-block-row', done && 'done', current && 'current', flash === block.id && 'sc-flash')}
        whileHover={{ x: 2 }}
      >
        <HoloCheck checked={done} onChange={() => day.toggleTask(block.id)} disabled={!day.editable} label={block.label} />
        <div className="md-main">
          <TimeRange block={block} />
          <span className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
            <span className="task-label">{block.label}</span>
            {current && !done && <span className="sc-now-tag">NOW</span>}
          </span>
          {block.hint && <span className="tiny dim">{block.hint}</span>}
          {block.backup && day.log.backupTask && <span className="tiny cyan">Backup: {day.log.backupTask}</span>}
        </div>
        <div className="md-aside">
          {sub && (
            <>
              <span className="md-subdots" aria-label={`${sub.done} of ${sub.total} sub-tasks`}>
                {Array.from({ length: sub.total }, (_, i) => (
                  <i key={i} className={i < sub.done ? 'on' : ''} />
                ))}
              </span>
              <span className="mono tiny">
                {sub.done}/{sub.total}
              </span>
              <Link to="/trading-schedule" className="btn btn-ghost btn-sm" aria-label="Open trading schedule">
                Schedule <ArrowRight size={13} />
              </Link>
            </>
          )}
          <CatTag block={block} />
        </div>
      </motion.div>
      {block.backup && <BackupPicker day={day} />}
    </div>
  );
}

function BackupPicker({ day }: { day: Day }) {
  const on = day.log.backupTask !== undefined;
  return (
    <div className="md-backup-wrap">
      <button
        type="button"
        className={cx('md-switch', on && 'on')}
        onClick={() => day.setBackup(on ? undefined : '')}
        disabled={!day.editable}
        aria-pressed={on}
      >
        <span className="track" />
        No client work today
      </button>
      <AnimatePresence initial={false}>
        {on && (
          <motion.div
            className="md-backup"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="sc-kicker" style={{ marginBottom: 8 }}>
              <Crosshair size={12} style={{ verticalAlign: '-2px', marginRight: 6 }} />
              Backup deep-work task
            </div>
            <div className="row wrap" style={{ gap: 6 }}>
              {BACKUP_TASKS.map((t) => (
                <motion.button
                  key={t}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  className={cx('chip', day.log.backupTask === t && 'on')}
                  onClick={() => day.setBackup(day.log.backupTask === t ? '' : t)}
                  disabled={!day.editable}
                >
                  {t}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ClientBlock({ block, day, current, flash }: { block: Block; day: Day; current: boolean; flash: string | null }) {
  const cs = clientStats(day.log);
  return (
    <div id={`task-${block.id}`} className={cx('md-group', flash === block.id && 'sc-flash')}>
      <div className={cx('task-row md-block-row', cs.pct >= 1 && 'done', current && 'current')} style={{ gridTemplateColumns: 'minmax(0,1fr) auto' }}>
        <div className="md-main">
          <TimeRange block={block} />
          <span className="row" style={{ gap: 8 }}>
            <span className="task-label">{block.label}</span>
            {current && cs.pct < 1 && <span className="sc-now-tag">NOW</span>}
          </span>
        </div>
        <div className="md-aside">
          <span className="mono tiny">
            {cs.done}/{cs.total}
          </span>
          <CatTag block={block} />
        </div>
      </div>
      {block.counters!.map((c) => (
        <CounterRow key={c.id} counter={c} day={day} flash={flash === c.id} />
      ))}
    </div>
  );
}

function CounterRow({ counter, day, flash }: { counter: Counter; day: Day; flash: boolean }) {
  const count = day.count(counter.id);
  const target = day.target(counter.id);
  const done = day.isDone(counter.id);
  const set = (v: number) => day.setCount(counter.id, v);
  const [text, setText] = useState(String(count));
  useEffect(() => setText(String(count)), [count]);

  return (
    <div id={`task-${counter.id}`} className={cx('task-row md-counter', done && 'done', flash && 'sc-flash')}>
      <HoloCheck checked={done} onChange={() => day.toggleTask(counter.id)} disabled={!day.editable} label={counter.label} />
      <div className="md-main">
        <span className="task-label">{counter.label}</span>
        <span className="md-counter-meta">
          Target: <b>{target}</b> · Completed:{' '}
          <b>
            {count} / {target}
          </b>
        </span>
        <Bar value={target ? count / target : 0} />
      </div>
      <div className="md-ctrl">
        <button className="icon-btn" onClick={() => set(count - 1)} disabled={!day.editable || count <= 0} aria-label={`Decrease ${counter.label}`}>
          <Minus size={14} />
        </button>
        <input
          className="input num md-count-input"
          inputMode="numeric"
          value={text}
          disabled={!day.editable}
          aria-label={`${counter.label} count`}
          onChange={(e) => {
            const v = e.target.value.replace(/[^\d]/g, '');
            setText(v);
            if (v !== '') set(Number(v));
          }}
          onBlur={() => text === '' && setText(String(count))}
        />
        <button className="icon-btn" onClick={() => set(count + 1)} disabled={!day.editable} aria-label={`Increase ${counter.label}`}>
          <Plus size={14} />
        </button>
        <button className="btn btn-sm" onClick={() => set(count + 5)} disabled={!day.editable}>
          +5
        </button>
      </div>
    </div>
  );
}

// ─── Activity log ──────────────────────────────────────────────────────────

function ActivityLog({ log }: { log: DayLog }) {
  const items = [...(log.activity ?? [])].reverse();
  if (!items.length) return <EmptyState title="No activity yet" text="Every task you tick or untick is logged here with its time." />;
  return (
    <ul className="md-activity">
      {items.map((a, i) => (
        <li key={`${a.at}-${a.taskId}-${i}`}>
          <span className="mono tiny cyan">{new Date(a.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span className="ellipsis">{a.label}</span>
          <span className={cx('badge', a.action === 'done' ? '' : 'dim')}>{a.action === 'done' ? 'Done' : 'Undone'}</span>
        </li>
      ))}
    </ul>
  );
}
