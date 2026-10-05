import { useEffect, useMemo, useState, type JSX, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, NotebookPen } from 'lucide-react';
import { CountUp, EmptyState, cx } from '../ui';
import { useCollection, useDoc, useToday } from '../../lib/hooks';
import { JOURNAL_COLLECTION, JOURNAL_WEEKLY, weeklySummary, type JournalTradeEntry, type WeeklyDoc } from '../../lib/journal';
import { addDays, fromKey, startOfWeek } from '../../lib/dates';
import '../../styles/journal-insights.css';

const ease = [0.22, 1, 0.36, 1] as const;
const weekLabel = (key: string) => fromKey(key).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

function Section({ label, index, children, className }: { label: string; index: number; children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      className={cx('glass ji-panel', className)}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: reduce ? 0 : 0.06 * index, ease }}
    >
      <div className="ji-panel-head">
        <span className="ji-label">{label}</span>
      </div>
      {children}
    </motion.section>
  );
}

const Quiet = ({ children }: { children: ReactNode }) => <p className="ji-quiet">{children}</p>;

/** Shows "Saved" briefly after `stamp` changes. */
function SavedHint({ stamp }: { stamp: number }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!stamp) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 1600);
    return () => clearTimeout(t);
  }, [stamp]);
  return (
    <AnimatePresence>
      {show && (
        <motion.span className="ji-saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          Saved
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export function JournalWeekly(): JSX.Element {
  const { items: entries } = useCollection<JournalTradeEntry>(JOURNAL_COLLECTION);
  const today = useToday();
  const currentWeek = startOfWeek(today);
  const [weekStart, setWeekStart] = useState(currentWeek);
  const ws = weekStart > currentWeek ? currentWeek : weekStart;
  const prevWeek = addDays(ws, -7);

  const fallback = useMemo<WeeklyDoc>(() => ({ id: ws, target: '', reflection: '' }), [ws]);
  const prevFallback = useMemo<WeeklyDoc>(() => ({ id: prevWeek, target: '', reflection: '' }), [prevWeek]);
  const [doc, updateDoc] = useDoc<WeeklyDoc>(JOURNAL_WEEKLY, ws, fallback);
  const [prevDoc] = useDoc<WeeklyDoc>(JOURNAL_WEEKLY, prevWeek, prevFallback);

  const summary = useMemo(() => weeklySummary(entries, ws), [entries, ws]);
  const [savedStamp, setSavedStamp] = useState(0);

  const save = (patch: Partial<WeeklyDoc>) => {
    updateDoc({ ...patch, id: ws });
    setSavedStamp(Date.now());
  };

  const isCurrent = ws === currentWeek;
  const empty = summary.count === 0;
  const rf = summary.ruleFollowing;

  return (
    <div className="ji-root">
      {/* ── Header / selector ── */}
      <div className="ji-week-head">
        <div>
          <span className="ji-label">Weekly trading review</span>
          <h2 className="ji-week-title">Week of {weekLabel(ws)}</h2>
          <span className="ji-sub">
            {weekLabel(ws)} — {weekLabel(addDays(ws, 6))} · {summary.count} entr{summary.count === 1 ? 'y' : 'ies'}
            {rf != null && <> · {Math.round(rf * 100)}% rules followed</>}
          </span>
        </div>
        <div className="ji-week-nav">
          <button className="icon-btn" aria-label="Previous week" onClick={() => setWeekStart(addDays(ws, -7))}>
            <ChevronLeft size={16} strokeWidth={1.6} />
          </button>
          <button className="cmd-btn" disabled={isCurrent} onClick={() => setWeekStart(currentWeek)}>
            This week
          </button>
          <button className="icon-btn" aria-label="Next week" disabled={isCurrent} onClick={() => setWeekStart(addDays(ws, 7))}>
            <ChevronRight size={16} strokeWidth={1.6} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={ws}
          className="ji-week-body"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease }}
        >
          {prevDoc.target.trim() && (
            <Section label="Last week's target" index={0} className="ji-last-target">
              <p className="ji-serif-sm">“{prevDoc.target.trim()}”</p>
              <Quiet>Did you hit it? Check it against what you studied this week.</Quiet>
            </Section>
          )}

          {empty ? (
            <Section label="This week" index={1}>
              <EmptyState
                icon={<NotebookPen size={22} strokeWidth={1.4} />}
                title="No entries this week"
                text="Your review builds itself from the week's journal entries. You can still set next week's 1% target below."
              />
            </Section>
          ) : (
            <div className="ji-grid">
              <Section label="What I studied" index={1}>
                {summary.studied.length ? (
                  <ul className="ji-list">
                    {summary.studied.map((s) => (
                      <li key={s.label}>
                        <span>{s.label}</span>
                        <span className="ji-count">×{s.count}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Quiet>Record the market and setup on each entry to see what you studied.</Quiet>
                )}
              </Section>

              <Section label="What I did well" index={2}>
                {summary.didWell.length ? (
                  <ul className="ji-list ji-good">
                    {summary.didWell.map((s) => (
                      <li key={s}>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Quiet>Complete the execution review on each entry — consistent habits will show up here.</Quiet>
                )}
              </Section>

              <Section label="What mistakes repeated" index={3}>
                {summary.repeated.length ? (
                  <ul className="ji-mistakes">
                    {summary.repeated.map((m) => (
                      <li key={m.key}>
                        <div className="ji-mistake-row">
                          <span>{m.label}</span>
                          <span className="ji-count">
                            <CountUp value={m.count} />×
                          </span>
                        </div>
                        <p className="ji-lesson">{m.lesson}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Quiet>No mistake repeated this week. Calm and clean.</Quiet>
                )}
              </Section>

              <Section label="What improved" index={4}>
                {summary.improved.length ? (
                  <ul className="ji-list ji-good">
                    {summary.improved.map((s) => (
                      <li key={s}>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Quiet>
                    {summary.prevRuleFollowing == null ? 'Nothing to compare yet — last week has no reviewed entries.' : 'Holding steady versus last week.'}
                  </Quiet>
                )}
              </Section>

              <Section label="Biggest lesson" index={5} className="ji-wide">
                {summary.biggestLesson ? (
                  <blockquote className="ji-quote">“{summary.biggestLesson}”</blockquote>
                ) : (
                  <Quiet>Write what you learned on each entry — the latest lesson appears here.</Quiet>
                )}
              </Section>

              <Section label="One thing to fix next week" index={6} className="ji-wide">
                {summary.fixNext ? <p className="ji-fix">{summary.fixNext}</p> : <Quiet>No recurring mistake to fix — keep the same process.</Quiet>}
              </Section>
            </div>
          )}

          {/* ── 1% target ── */}
          <Section label="Next week's 1% target" index={7} className="ji-target">
            <div className="ji-target-head">
              <p className="ji-quiet">One small, specific improvement for the week of {weekLabel(addDays(ws, 7))}.</p>
              <SavedHint stamp={savedStamp} />
            </div>
            <input
              className="input ji-target-input"
              value={doc.target}
              placeholder={summary.fixNext ?? 'e.g. Wait for a candle close before every simulated entry'}
              onChange={(e) => save({ target: e.target.value })}
              aria-label="Next week's 1% target"
            />
            {!doc.target && summary.fixNext && (
              <button className="ji-use" onClick={() => save({ target: summary.fixNext ?? '' })}>
                Use suggestion
              </button>
            )}
            <label className="ji-label ji-reflection-label" htmlFor={`refl-${ws}`}>
              My reflection <span className="dim">· optional</span>
            </label>
            <textarea
              id={`refl-${ws}`}
              className="textarea"
              value={doc.reflection}
              placeholder="How did this week feel? What will you carry forward?"
              onChange={(e) => save({ reflection: e.target.value })}
            />
          </Section>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
