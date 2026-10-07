import { useMemo, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, Download, PenLine, Plus, Search, Trash2, X } from 'lucide-react';
import { CountUp, EmptyState, RingMeter, cx } from '../components/ui';
import { JournalEditor } from '../components/journal/JournalEditor';
import { JournalAnalytics } from '../components/journal/JournalAnalytics';
import { JournalWeekly } from '../components/journal/JournalWeekly';
import { JournalEntryView } from '../components/journal/JournalEntryView';
import { useCollection, useToday } from '../lib/hooks';
import { formatLong, formatShort } from '../lib/dates';
import {
  CONDITIONS,
  JOURNAL_COLLECTION,
  MISTAKES,
  RESULTS,
  download,
  improvementFor,
  journalStats,
  mainLesson,
  mistakeCounts,
  ruleScore,
  sortEntries,
  toCSV,
  type JournalTradeEntry,
  type Session,
} from '../lib/journal';
import { practiceToEntry } from '../lib/practiceJournal';
import { SESSIONS_COL, type PracticeSession } from '../lib/practice';
import { store } from '../lib/store';
import '../styles/journal.css';

const TABS = [
  { to: '/trading-journal', label: 'Overview', end: true },
  { to: '/trading-journal/history', label: 'History' },
  { to: '/trading-journal/analytics', label: 'Analytics' },
  { to: '/trading-journal/weekly', label: 'Weekly Review' },
];

const ease = [0.22, 1, 0.36, 1] as const;
const fade = (i = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: i * 0.06, ease },
});

const SESSION_PARAM: Record<string, Session> = { morning: 'Morning education', evening: 'Evening practice' };

/** Trading Journal module: overview, history, analytics, weekly review + editor. */
export function TradingJournal() {
  const { pathname } = useLocation();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { items } = useCollection<JournalTradeEntry>(JOURNAL_COLLECTION);
  const entries = useMemo(() => sortEntries(items), [items]);
  const today = useToday();

  // Editor state lives in the URL so dashboard / timetable links can open it.
  const editId = params.get('edit');
  const practiceId = params.get('practice');
  const { items: practiceSessions } = useCollection<PracticeSession>(SESSIONS_COL);
  const practiceSession = practiceId ? practiceSessions.find((p) => p.id === practiceId) : undefined;
  const dupId = params.get('duplicate');
  const isNew = params.get('new') === '1';
  const editing = editId ? items.find((e) => e.id === editId) : undefined;
  const dupSource = dupId ? items.find((e) => e.id === dupId) : undefined;
  const base = useMemo<Partial<JournalTradeEntry> | undefined>(() => {
    if (dupSource) {
      const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = dupSource;
      void _id;
      void _c;
      void _u;
      return { ...rest, date: today };
    }
    if (practiceSession) return practiceToEntry(practiceSession, null);
    const s = params.get('session');
    const fromSession = s && SESSION_PARAM[s] ? { session: SESSION_PARAM[s] } : undefined;
    // Draft fields suggested by the AI assistant (reviewed in the editor before saving).
    if (params.get('from') === 'assistant') {
      const draft: Partial<JournalTradeEntry> = { ...fromSession };
      for (const k of ['market', 'setup', 'timeframe', 'why', 'learned', 'improve'] as const) {
        const v = params.get(k);
        if (v) draft[k] = v;
      }
      return draft;
    }
    return fromSession;
  }, [dupSource, params, today, practiceSession]);
  const editorOpen = isNew || !!editing || !!dupSource;
  const closeEditor = () => setParams({}, { replace: true });

  const sub = pathname.replace(/^\/trading-journal\/?/, '');
  const entryMatch = sub.match(/^entry\/(.+)$/);

  const exportAs = (kind: 'json' | 'csv') => {
    const stamp = today;
    if (kind === 'json') download(`trading-journal-${stamp}.json`, JSON.stringify(entries, null, 2), 'application/json');
    else download(`trading-journal-${stamp}.csv`, toCSV(entries), 'text/csv');
  };

  return (
    <div className="tj">
      <header className="tj-head">
        <div>
          <div className="eyebrow">Simulation / Educational mode</div>
          <h1 className="tj-title">Trading Journal</h1>
          <p className="tj-tagline">Study the market. Record the decision. Review the result. Improve.</p>
        </div>
        <div className="tj-head-actions">
          <ExportMenu disabled={!entries.length} onExport={exportAs} />
          <button className="btn btn-primary" onClick={() => setParams({ new: '1' })}>
            <Plus size={15} /> New journal entry
          </button>
        </div>
      </header>

      {!entryMatch && (
        <nav className="tj-tabs" aria-label="Trading journal views">
          {TABS.map((t) => (
            <NavLink key={t.to} to={t.to} end={t.end}>
              {({ isActive }) => (
                <>
                  {isActive && <motion.span layoutId="tj-tab" className="tj-tab-pill" transition={{ type: 'spring', stiffness: 300, damping: 32 }} />}
                  <span>{t.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      )}

      <motion.div key={sub || 'overview'} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}>
      {entryMatch ? (
        <EntryRoute id={entryMatch[1]} entries={entries} />
      ) : sub === 'history' ? (
        <History entries={entries} />
      ) : sub === 'analytics' ? (
        <JournalAnalytics />
      ) : sub === 'weekly' ? (
        <JournalWeekly />
      ) : (
        <Overview entries={entries} today={today} onNew={() => setParams({ new: '1' })} />
      )}
      </motion.div>

      {editorOpen && (
        <JournalEditor
          key={editId ?? dupId ?? 'new'}
          editing={editing}
          base={editing ? undefined : base}
          onClose={closeEditor}
          onSaved={(e) => {
            if (practiceSession) store.put(SESSIONS_COL, practiceSession.id, { ...practiceSession, journalEntryId: e.id, updatedAt: Date.now() });
            setParams({}, { replace: true });
            navigate(`/trading-journal/entry/${e.id}`);
          }}
        />
      )}
    </div>
  );
}

// ─── Overview ──────────────────────────────────────────────────────────────

function Overview({ entries, today, onNew }: { entries: JournalTradeEntry[]; today: string; onNew: () => void }) {
  const stats = useMemo(() => journalStats(entries, today), [entries, today]);
  const mistakes = useMemo(() => mistakeCounts(entries).slice(0, 5), [entries]);
  const latest = entries[0];
  const latestToday = entries.find((e) => e.date === today);
  const imp = latestToday ? improvementFor(latestToday) : null;

  if (!entries.length) {
    return (
      <motion.section className="glass tj-empty" {...fade(1)}>
        <div className="mono-label">Your journal is empty</div>
        <h2 className="tj-empty-title">Every improvement starts with one honest entry.</h2>
        <p className="muted">
          Record a setup you studied — what you saw, what you decided, what happened and what you learned. Statistics,
          your mistake database and weekly reviews build from here.
        </p>
        <button className="btn btn-primary" onClick={onNew}>
          <Plus size={15} /> Record your first entry
        </button>
      </motion.section>
    );
  }

  const maxMistake = mistakes[0]?.count ?? 1;
  return (
    <div className="tj-overview">
      <motion.section className="tj-stats" {...fade(0)}>
        <StatCell label="Total journal entries" value={<CountUp value={stats.total} />} />
        <StatCell label="Setups studied" value={<CountUp value={stats.setups} />} />
        <StatCell label="Winning simulations" value={<CountUp value={stats.wins} />} />
        <StatCell label="Losing simulations" value={<CountUp value={stats.losses} />} />
        <StatCell
          label="Rule-following"
          value={
            stats.ruleFollowing == null ? (
              '—'
            ) : (
              <span className="row" style={{ gap: 12 }}>
                <RingMeter value={stats.ruleFollowing} size={44} stroke={2} showValue={false} />
                <span>
                  <CountUp value={Math.round(stats.ruleFollowing * 100)} />%
                </span>
              </span>
            )
          }
        />
        <StatCell label="Average R:R" value={stats.avgRR == null ? '—' : <CountUp value={stats.avgRR} decimals={2} prefix="1:" />} note="planned" />
        <StatCell label="Most common mistake" value={<span className="tj-stat-text">{stats.topMistake?.label ?? 'None yet'}</span>} note={stats.topMistake ? `${stats.topMistake.count}×` : undefined} />
        <StatCell
          label="Improvement streak"
          value={
            <>
              <CountUp value={stats.streak.current} />
              <small> days</small>
            </>
          }
          note={`best ${stats.streak.longest}`}
        />
      </motion.section>

      <div className="tj-overview-grid">
        <motion.section className="glass pad tj-today" {...fade(2)}>
          <div className="mono-label">Today's 1% improvement</div>
          {imp ? (
            <>
              <p className="tj-quote">“{imp.lesson}”</p>
              <div className="mono-label" style={{ marginTop: 14 }}>
                Tomorrow's focus
              </div>
              <p className="tj-focus">{imp.focus}</p>
            </>
          ) : (
            <>
              <p className="tj-quote dim">No entry recorded today yet.</p>
              <button className="btn btn-sm" onClick={onNew}>
                <Plus size={13} /> Log today's session
              </button>
            </>
          )}
        </motion.section>

        <motion.section className="glass pad tj-mistakes" {...fade(3)}>
          <div className="row between">
            <div className="mono-label">Most repeated mistakes</div>
            <Link to="/trading-journal/analytics" className="mono-label tj-link">
              Analytics →
            </Link>
          </div>
          {mistakes.length ? (
            <ul className="tj-mistake-list">
              {mistakes.map((m, i) => (
                <li key={m.key}>
                  <div className="row between">
                    <span>{m.label}</span>
                    <span className="mono muted">{m.count}×</span>
                  </div>
                  <div className="tj-bar">
                    <motion.i initial={{ width: 0 }} animate={{ width: `${(m.count / maxMistake) * 100}%` }} transition={{ duration: 0.9, delay: 0.2 + i * 0.08, ease }} />
                  </div>
                  <p className="tj-suggest">{m.lesson}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted small">No mistakes selected yet — they'll appear here as you journal.</p>
          )}
        </motion.section>
      </div>

      <motion.section {...fade(4)}>
        <div className="row between" style={{ margin: '8px 0 14px' }}>
          <div className="mono-label">Recent entries</div>
          <Link to="/trading-journal/history" className="mono-label tj-link">
            Full history →
          </Link>
        </div>
        <div className="tj-recent">
          {entries.slice(0, 3).map((e, i) => (
            <EntryCard key={e.id} entry={e} index={i} />
          ))}
        </div>
      </motion.section>
      {latest && <div className="tiny dim mono" style={{ marginTop: 18 }}>LAST ENTRY · {formatLong(latest.date).toUpperCase()}</div>}
    </div>
  );
}

function StatCell({ label, value, note }: { label: string; value: React.ReactNode; note?: string }) {
  return (
    <div className="tj-stat">
      <div className="mono-label">{label}</div>
      <div className="tj-stat-value">{value}</div>
      {note && <div className="tj-stat-note mono">{note}</div>}
    </div>
  );
}

// ─── Entry card (history + overview) ───────────────────────────────────────

function EntryCard({ entry: e, index = 0, actions }: { entry: JournalTradeEntry; index?: number; actions?: React.ReactNode }) {
  const navigate = useNavigate();
  const rule = Object.keys(e.checks).length ? Math.round(ruleScore(e) * 100) : null;
  return (
    <motion.article
      className="glass tj-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, delay: Math.min(index, 8) * 0.04, ease }}
      whileHover={{ y: -3 }}
      onClick={() => navigate(`/trading-journal/entry/${e.id}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(ev) => ev.key === 'Enter' && navigate(`/trading-journal/entry/${e.id}`)}
    >
      <div className="tj-card-top">
        <span className="mono tj-card-date">{formatShort(e.date).toUpperCase()}</span>
        <ResultBadge result={e.result} />
      </div>
      <div className="tj-card-title">
        {e.market || 'Unnamed market'}
        <span className="dim"> · </span>
        <span className="tj-card-setup">{e.setup || (e.result === 'notrade' ? 'No trade' : 'No setup')}</span>
      </div>
      <p className="tj-card-lesson">{mainLesson(e)}</p>
      <div className="tj-card-foot">
        <span className="mono">{rule == null ? 'RULES —' : `RULES ${rule}%`}</span>
        {e.condition && <span className="mono">{e.condition.toUpperCase()}</span>}
        {actions && (
          <span className="tj-card-actions" onClick={(ev) => ev.stopPropagation()}>
            {actions}
          </span>
        )}
      </div>
    </motion.article>
  );
}

export function ResultBadge({ result }: { result: JournalTradeEntry['result'] }) {
  if (!result) return <span className="badge dim">No result</span>;
  const cls = result === 'success' ? 'good' : result === 'fail' ? 'bad' : result === 'breakeven' ? 'warn' : 'dim';
  return <span className={`badge ${cls}`}>{RESULTS.find((r) => r.key === result)!.short}</span>;
}

// ─── History ───────────────────────────────────────────────────────────────

const RULE_BANDS = [
  { key: '', label: 'Any rule-following' },
  { key: 'high', label: '80% and above' },
  { key: 'mid', label: '50–79%' },
  { key: 'low', label: 'Below 50%' },
];

function History({ entries }: { entries: JournalTradeEntry[] }) {
  const [, setParams] = useSearchParams();
  const { remove } = useCollection<JournalTradeEntry>(JOURNAL_COLLECTION);
  const [q, setQ] = useState('');
  const [f, setF] = useState({ from: '', to: '', market: '', setup: '', result: '', condition: '', mistake: '', rule: '' });
  const set = (patch: Partial<typeof f>) => setF((x) => ({ ...x, ...patch }));
  const markets = useMemo(() => [...new Set(entries.map((e) => e.market).filter(Boolean))].sort(), [entries]);
  const setups = useMemo(() => [...new Set(entries.map((e) => e.setup).filter(Boolean))].sort(), [entries]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return entries.filter((e) => {
      if (f.from && e.date < f.from) return false;
      if (f.to && e.date > f.to) return false;
      if (f.market && e.market !== f.market) return false;
      if (f.setup && e.setup !== f.setup) return false;
      if (f.result && e.result !== f.result) return false;
      if (f.condition && e.condition !== f.condition) return false;
      if (f.mistake && !e.mistakes.includes(f.mistake as never)) return false;
      if (f.rule) {
        const r = ruleScore(e);
        if (f.rule === 'high' && r < 0.8) return false;
        if (f.rule === 'mid' && (r < 0.5 || r >= 0.8)) return false;
        if (f.rule === 'low' && r >= 0.5) return false;
      }
      if (needle) {
        const hay = [e.market, e.setup, e.why, e.confirmed, e.structure, e.context, e.expected, e.invalidation, e.happened, e.learned, e.improve, e.imageNotes, e.otherMistake]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [entries, f, q]);

  const active = q || Object.values(f).some(Boolean);
  const groups = useMemo(() => {
    const map = new Map<string, JournalTradeEntry[]>();
    for (const e of shown) {
      const k = e.date.slice(0, 7);
      map.set(k, [...(map.get(k) ?? []), e]);
    }
    return [...map.entries()];
  }, [shown]);

  if (!entries.length) {
    return <EmptyState title="No entries yet" text="Your chronological journal timeline will appear here." />;
  }

  return (
    <div className="tj-history">
      <motion.div className="glass tj-filters" {...fade(0)}>
        <label className="tj-search">
          <Search size={15} />
          <input className="input" placeholder="Search markets, setups, lessons…" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <div className="tj-filter-grid">
          <input className="input" type="date" value={f.from} onChange={(e) => set({ from: e.target.value })} aria-label="From date" />
          <input className="input" type="date" value={f.to} onChange={(e) => set({ to: e.target.value })} aria-label="To date" />
          <select className="select" value={f.market} onChange={(e) => set({ market: e.target.value })} aria-label="Market">
            <option value="">All markets</option>
            {markets.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <select className="select" value={f.setup} onChange={(e) => set({ setup: e.target.value })} aria-label="Setup">
            <option value="">All setups</option>
            {setups.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select className="select" value={f.result} onChange={(e) => set({ result: e.target.value })} aria-label="Result">
            <option value="">All results</option>
            {RESULTS.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
          <select className="select" value={f.condition} onChange={(e) => set({ condition: e.target.value })} aria-label="Market condition">
            <option value="">All conditions</option>
            {CONDITIONS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select className="select" value={f.mistake} onChange={(e) => set({ mistake: e.target.value })} aria-label="Mistake">
            <option value="">All mistakes</option>
            {MISTAKES.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
          <select className="select" value={f.rule} onChange={(e) => set({ rule: e.target.value })} aria-label="Rule-following">
            {RULE_BANDS.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <div className="row between">
          <span className="mono tiny muted">
            SHOWING {shown.length} OF {entries.length}
          </span>
          {active && (
            <button
              className="text-btn"
              onClick={() => {
                setQ('');
                setF({ from: '', to: '', market: '', setup: '', result: '', condition: '', mistake: '', rule: '' });
              }}
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </div>
      </motion.div>

      {!shown.length ? (
        <EmptyState title="Nothing matches" text="Try a different search or clear the filters." />
      ) : (
        <div className="tj-timeline">
          {groups.map(([month, list]) => (
            <section key={month} className="tj-month">
              <div className="tj-month-label mono">{new Date(month + '-01T00:00').toLocaleDateString(undefined, { month: 'long', year: 'numeric' }).toUpperCase()}</div>
              <AnimatePresence initial={false}>
                {list.map((e, i) => (
                  <div key={e.id} className="tj-tl-item">
                    <span className={cx('tj-tl-dot', e.result)} />
                    <EntryCard
                      entry={e}
                      index={i}
                      actions={
                        <>
                          <button className="icon-btn" title="Edit" aria-label="Edit entry" onClick={() => setParams({ edit: e.id })}>
                            <PenLine size={13} />
                          </button>
                          <button className="icon-btn" title="Duplicate" aria-label="Duplicate entry" onClick={() => setParams({ duplicate: e.id })}>
                            <Copy size={13} />
                          </button>
                          <button
                            className="icon-btn danger"
                            title="Delete"
                            aria-label="Delete entry"
                            onClick={() => window.confirm('Delete this journal entry? This cannot be undone.') && remove(e.id)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </>
                      }
                    />
                  </div>
                ))}
              </AnimatePresence>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Entry detail ──────────────────────────────────────────────────────────

function EntryRoute({ id, entries }: { id: string; entries: JournalTradeEntry[] }) {
  const entry = entries.find((e) => e.id === id);
  if (!entry) {
    return (
      <EmptyState
        title="Entry not found"
        text="It may have been deleted."
        action={
          <Link className="btn btn-sm" to="/trading-journal/history">
            Back to history
          </Link>
        }
      />
    );
  }
  return <JournalEntryView entry={entry} />;
}

function ExportMenu({ disabled, onExport }: { disabled: boolean; onExport: (k: 'json' | 'csv') => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="tj-export">
      <button className="btn" disabled={disabled} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <Download size={14} /> Export
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="glass tj-export-menu" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25 }}>
            <button onClick={() => (onExport('csv'), setOpen(false))}>CSV · spreadsheet</button>
            <button onClick={() => (onExport('json'), setOpen(false))}>JSON · full backup</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

