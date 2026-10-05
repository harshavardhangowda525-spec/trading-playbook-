import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, ChevronLeft, ChevronRight, NotebookPen, Target } from 'lucide-react';
import { C, dayStats, emptyDayLog, emptyJournal, journalScore, JOURNAL_FIELDS, type DayLog, type JournalEntry } from '../lib/domain';
import { useCollection, useDoc, useToday } from '../lib/hooks';
import { addDays, formatHeaderDate, formatShort } from '../lib/dates';
import { Bar, EmptyState, ImageAttach, PageHeader, Panel, RingMeter, Slider, cx, reveal } from '../components/ui';
import '../styles/build.css';

// ─── Shared helpers (also used by Psychology) ──────────────────────────────

/** Selected date from `?date=`, clamped to today (no future entries). */
export function useDateParam(): [string, (d: string) => void, string] {
  const today = useToday();
  const [params, setParams] = useSearchParams();
  const raw = params.get('date');
  const date = raw && /^\d{4}-\d{2}-\d{2}$/.test(raw) && raw <= today ? raw : today;
  const setDate = useCallback(
    (d: string) => {
      const next = new URLSearchParams(params);
      next.delete('new');
      if (d >= today) next.delete('date');
      else next.set('date', d);
      setParams(next, { replace: true });
    },
    [params, setParams, today],
  );
  return [date, setDate, today];
}

export function DateNav({ date, today, onChange }: { date: string; today: string; onChange: (d: string) => void }) {
  return (
    <div className="date-nav">
      <button className="icon-btn" onClick={() => onChange(addDays(date, -1))} aria-label="Previous day">
        <ChevronLeft size={16} />
      </button>
      <span className="date-label">{formatHeaderDate(date)}</span>
      <button className="icon-btn" onClick={() => onChange(addDays(date, 1))} disabled={date >= today} aria-label="Next day">
        <ChevronRight size={16} />
      </button>
      <input className="input" type="date" max={today} value={date} onChange={(e) => e.target.value && onChange(e.target.value)} aria-label="Pick date" />
      <button className="btn btn-sm" onClick={() => onChange(today)} disabled={date === today}>
        Today
      </button>
    </div>
  );
}

/** Briefly true after `mark()` — drives the "SAVED" indicator. */
export function useSavedFlash(): [boolean, () => void] {
  const [on, setOn] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  const mark = useCallback(() => {
    setOn(true);
    clearTimeout(t.current);
    t.current = setTimeout(() => setOn(false), 1600);
  }, []);
  return [on, mark];
}

export function SavedIndicator({ on }: { on: boolean }) {
  return (
    <AnimatePresence>
      {on && (
        <motion.span className="saved-ind" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} aria-live="polite">
          <Check size={13} /> SAVED
        </motion.span>
      )}
    </AnimatePresence>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

const PROMPTS: { key: (typeof JOURNAL_FIELDS)[number]; tag: string; q: string; ph: string }[] = [
  { key: 'learn', tag: 'Learn', q: 'What did I learn today?', ph: 'Concepts, lessons, insights…' },
  { key: 'practice', tag: 'Practice', q: 'What did I practice?', ph: 'Chart reps, backtests, simulated trades…' },
  { key: 'observations', tag: 'Observations', q: 'What did I notice on the chart?', ph: 'Structure, levels, behaviour around the open…' },
  { key: 'mistake', tag: 'Mistake', q: 'What mistake did I make?', ph: 'Be honest — mistakes are data.' },
];

export function DailyJournal() {
  const [date, setDate, today] = useDateParam();
  const fallback = useMemo(() => emptyJournal(date), [date]);
  const [entry, update] = useDoc<JournalEntry>(C.journal, date, fallback);
  const logFallback = useMemo(() => emptyDayLog(date), [date]);
  const [log] = useDoc<DayLog>(C.daylog, date, logFallback);
  const { items: all } = useCollection<JournalEntry>(C.journal);
  const [saved, markSaved] = useSavedFlash();

  const set = (p: Partial<JournalEntry>) => {
    update((prev) => ({ ...prev, ...p, id: date, date }));
    markSaved();
  };

  const score = journalScore(entry);
  const answered = JOURNAL_FIELDS.filter((f) => entry[f].trim()).length;
  const pts = {
    reflection: answered * 10,
    discipline: Math.round((entry.discipline / 10) * 30),
    confidence: Math.round((entry.confidence / 10) * 20),
  };
  const ds = dayStats(log);

  const past = useMemo(
    () =>
      all
        .filter((e) => journalScore(e) != null || e.images?.length)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 60),
    [all],
  );

  return (
    <div>
      <PageHeader
        eyebrow="Daily Journal · 1% better"
        title="Daily Journal"
        description="Reflect for five minutes. Learn, practise, observe, own the mistake — and choose one thing to improve tomorrow."
        actions={<DateNav date={date} today={today} onChange={setDate} />}
      />

      <div className="dj-layout">
        <div className="col gap-16">
          <div className="row between" style={{ minHeight: 20 }}>
            <span className="tiny muted upper display" style={{ letterSpacing: '0.2em' }}>
              {date === today ? 'Today’s entry' : `Entry for ${formatShort(date)}`}
            </span>
            <SavedIndicator on={saved} />
          </div>

          {PROMPTS.map((p, i) => (
            <motion.div key={p.key} variants={reveal} initial="hidden" animate="show" custom={i}>
              <Panel>
                <div className="row between wrap">
                  <span className="prompt-title">{p.tag}</span>
                  {p.key === 'mistake' && (
                    <Link to="/mistakes?new=1" className="btn btn-sm btn-ghost">
                      Log it in Mistake Lab <ArrowRight size={13} />
                    </Link>
                  )}
                </div>
                <div className="prompt-q">{p.q}</div>
                <textarea
                  className={cx('textarea', p.key === 'learn' && 'lg')}
                  value={entry[p.key]}
                  placeholder={p.ph}
                  onChange={(e) => set({ [p.key]: e.target.value } as Partial<JournalEntry>)}
                />
              </Panel>
            </motion.div>
          ))}

          <motion.div variants={reveal} initial="hidden" animate="show" custom={4}>
            <Panel hud glow className="dj-improve">
              <span className="prompt-title row gap-4">
                <Target size={14} /> 1% Improvement
              </span>
              <div className="prompt-q">What ONE thing will I improve tomorrow?</div>
              <input
                className="input"
                style={{ fontSize: 16, height: 48 }}
                value={entry.improvement}
                placeholder="One specific, actionable thing."
                onChange={(e) => set({ improvement: e.target.value })}
              />
            </Panel>
          </motion.div>

          <motion.div variants={reveal} initial="hidden" animate="show" custom={5}>
            <Panel title="Self-rating">
              <div className="grid-2">
                <Slider label="Confidence" value={entry.confidence} onChange={(confidence) => set({ confidence })} />
                <Slider label="Discipline" value={entry.discipline} onChange={(discipline) => set({ discipline })} />
              </div>
            </Panel>
          </motion.div>

          <motion.div variants={reveal} initial="hidden" animate="show" custom={6}>
            <Panel title="Chart screenshots" sub="drop, browse or paste">
              <ImageAttach images={entry.images ?? []} onChange={(images) => set({ images })} label="Add screenshot" />
            </Panel>
          </motion.div>
        </div>

        <aside className="dj-side">
          <Panel hud title="Daily score">
            <div className="col" style={{ alignItems: 'center', gap: 18 }}>
              <RingMeter value={(score ?? 0) / 100} size={170} stroke={8}>
                <div className="col" style={{ gap: 0, alignItems: 'center' }}>
                  <span className="display" style={{ fontSize: 46, fontWeight: 400, color: '#fff', lineHeight: 1 }}>
                    {score == null ? <span className="dim">—</span> : <span className="num">{score}</span>}
                  </span>
                  <span className="tiny muted">/ 100</span>
                </div>
              </RingMeter>
              {score == null && <div className="tiny muted center">Answer a prompt to score your day.</div>}
              <div className="breakdown">
                <BreakLine label="Reflection" note={`${answered}/5 answered`} value={score == null ? 0 : pts.reflection} max={50} />
                <BreakLine label="Discipline" note={`${entry.discipline}/10`} value={score == null ? 0 : pts.discipline} max={30} />
                <BreakLine label="Confidence" note={`${entry.confidence}/10`} value={score == null ? 0 : pts.confidence} max={20} />
              </div>
            </div>
          </Panel>

          <Panel title="Timetable" sub={formatShort(date)}>
            <div className="row" style={{ gap: 16 }}>
              <RingMeter value={ds.pct} size={70} stroke={5} />
              <div className="col" style={{ gap: 2 }}>
                <span className="stat-label">Tasks complete</span>
                <span className="display" style={{ fontSize: 22, fontWeight: 400 }}>
                  <span className="num">{ds.done}</span> <span className="muted">/ {ds.total}</span>
                </span>
                <Link to="/my-day" className="tiny cyan">
                  Open My Day →
                </Link>
              </div>
            </div>
          </Panel>

          <Panel title="Past entries" sub={`${past.length}`}>
            {past.length === 0 ? (
              <EmptyState icon={<NotebookPen size={26} />} title="No entries yet" text="Your journal history will appear here." />
            ) : (
              <div className="entry-list">
                {past.map((e) => {
                  const s = journalScore(e);
                  return (
                    <button key={e.id} type="button" className={cx('entry-item', e.date === date && 'on')} onClick={() => setDate(e.date)}>
                      <span className="mono small">{formatShort(e.date)}</span>
                      <span className="mono cyan">{s ?? '—'}</span>
                      <span className="snip">{e.improvement || e.learn || '—'}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function BreakLine({ label, note, value, max }: { label: string; note: string; value: number; max: number }) {
  return (
    <div className="line">
      <span>
        <span className="stat-label">{label}</span> <span className="tiny dim">· {note}</span>
      </span>
      <span className="mono small">
        {value}
        <span className="dim">/{max}</span>
      </span>
      <Bar value={value / max} />
    </div>
  );
}
