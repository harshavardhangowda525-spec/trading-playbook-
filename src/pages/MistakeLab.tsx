import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Plus, Sparkles, Trash2 } from 'lucide-react';
import { useCollection, useToday } from '../lib/hooks';
import { C, MISTAKE_CATEGORIES, mistakeStats, type Mistake, type Trade } from '../lib/domain';
import { formatLong } from '../lib/dates';
import { CountUp, EmptyState, Field, HoloCheck, Modal, PageHeader, Panel, RingMeter, cx, reveal } from '../components/ui';
import { gridStroke, tick, tooltipStyle, tradeLabel } from '../components/TradeLog';
import '../styles/trades.css';

type StatusFilter = 'all' | 'open' | 'improved';

const emptyMistake = (date: string): Mistake => ({
  id: '',
  title: '',
  category: MISTAKE_CATEGORIES[0],
  date,
  tradeRef: '',
  why: '',
  shouldHave: '',
  prevention: '',
  status: 'open',
});

export function MistakeLab() {
  const { items, save, remove, create } = useCollection<Mistake>(C.mistakes);
  const { items: trades } = useCollection<Trade>(C.trades);
  const { items: backtests } = useCollection<Trade>(C.backtests);
  const { items: sims } = useCollection<Trade>(C.sims);
  const today = useToday();
  const reduce = useReducedMotion();
  const [params, setParams] = useSearchParams();
  const [draft, setDraft] = useState<Mistake | null>(null);
  const [filter, setFilter] = useState<StatusFilter>('all');

  // `?new=1` opens a blank record; `?edit=<id>` opens an existing one (e.g. sent from a trade log).
  useEffect(() => {
    const isNew = params.get('new') === '1';
    const editId = params.get('edit');
    if (!isNew && !editId) return;
    if (isNew) setDraft(emptyMistake(today));
    else {
      const found = items.find((m) => m.id === editId);
      if (!found) return; // wait for the store to deliver it
      setDraft(found);
    }
    const next = new URLSearchParams(params);
    next.delete('new');
    next.delete('edit');
    setParams(next, { replace: true });
  }, [params, setParams, today, items]);

  const stats = useMemo(() => mistakeStats(items), [items]);
  const improvementRate = stats.total ? stats.improved / stats.total : 0;
  const tradeOptions = useMemo(() => {
    const sort = (xs: Trade[]) => [...xs].sort((a, b) => (a.date < b.date ? 1 : -1));
    return [
      ...sort(trades).map((t) => ({ label: tradeLabel(t, 'journal'), date: t.date })),
      ...sort(backtests).map((t) => ({ label: tradeLabel(t, 'backtest'), date: t.date })),
      ...sort(sims).map((t) => ({ label: tradeLabel(t, 'sim'), date: t.date })),
    ];
  }, [trades, backtests, sims]);

  const list = useMemo(
    () =>
      [...items]
        .filter((m) => filter === 'all' || m.status === filter)
        .sort((a, b) => (a.status === b.status ? (a.date < b.date ? 1 : -1) : a.status === 'open' ? -1 : 1)),
    [items, filter],
  );

  const toggleImproved = (m: Mistake, on: boolean) =>
    save(on ? { ...m, status: 'improved', improvedAt: today } : { ...m, status: 'open', improvedAt: undefined });

  const onSave = (m: Mistake) => {
    const clean = { ...m, title: m.title.trim() || m.category };
    if (clean.id) save(clean);
    else {
      const { id: _omit, ...rest } = clean;
      void _omit;
      create(rest);
    }
    setDraft(null);
  };

  const chartData = stats.frequency.slice(0, 8);

  return (
    <div className="trades-page">
      <PageHeader
        eyebrow="RECORDS · CONTINUOUS IMPROVEMENT"
        title="MISTAKE LAB"
        description="Every mistake is data. Record what happened, understand why, and write the rule that prevents it — then mark it improved once it stops repeating. 1% better every day."
        actions={
          <button className="cmd-btn" onClick={() => setDraft(emptyMistake(today))}>
            <Plus size={15} /> Record mistake
          </button>
        }
      />

      {items.length === 0 ? (
        <Panel>
          <EmptyState
            icon={<Sparkles size={30} />}
            title="No mistakes recorded yet"
            text="When something doesn't go to plan, log it here. You can also send a mistake straight from any trade, backtest or paper trade."
            action={
              <button className="btn btn-primary" onClick={() => setDraft(emptyMistake(today))}>
                <Plus size={15} /> Record a mistake
              </button>
            }
          />
        </Panel>
      ) : (
        <div className="col gap-20">
          <motion.div variants={reveal} initial="hidden" animate="show" className="glass hud ml-hero">
            <div className="ml-common">
              <span className="stat-label">Most common mistake</span>
              <span className="ml-common-title">{stats.mostCommon?.label ?? '—'}</span>
              {stats.mostCommon && (
                <span className="stat-note">
                  Logged <span className="num cyan">{stats.mostCommon.count}</span> {stats.mostCommon.count === 1 ? 'time' : 'times'} · your top
                  focus for improvement
                </span>
              )}
            </div>
            <div className="ml-ring">
              <RingMeter value={improvementRate} size={128} stroke={6} label="Improvement rate" />
            </div>
            <div className="stat-grid ml-stat-grid">
              <div className="stat">
                <span className="stat-label">Mistakes improved</span>
                <span className="stat-value" style={{ color: 'var(--good)' }}>
                  <CountUp value={stats.improved} />
                </span>
                <span className="stat-note">of {stats.total} logged</span>
              </div>
              <div className="stat">
                <span className="stat-label">Total logged</span>
                <span className="stat-value">
                  <CountUp value={stats.total} />
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Still open</span>
                <span className="stat-value" style={stats.open ? { color: 'var(--warn)' } : undefined}>
                  <CountUp value={stats.open} />
                </span>
                <span className="stat-note">Working on it</span>
              </div>
            </div>
          </motion.div>

          <div className="ml-split">
            <Panel title="Mistake frequency" sub="by category">
              <ResponsiveContainer width="100%" height={Math.max(160, chartData.length * 38 + 30)}>
                <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ml-bar" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#4b8dff" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#3ee6ff" stopOpacity={0.95} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={gridStroke} horizontal={false} />
                  <XAxis type="number" allowDecimals={false} tick={tick} tickLine={false} axisLine={{ stroke: gridStroke }} />
                  <YAxis type="category" dataKey="label" width={150} tick={tick} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(62,230,255,0.05)' }} formatter={(v) => [v, 'Logged']} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                    {chartData.map((d, i) => (
                      <Cell key={d.label} fill={i === 0 ? '#3ee6ff' : 'url(#ml-bar)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Panel>

            <Panel title="How it works">
              <ol className="ml-steps">
                <li>
                  <b>Record</b> the mistake and the trade it came from.
                </li>
                <li>
                  <b>Diagnose</b> why it happened — the trigger, not the loss.
                </li>
                <li>
                  <b>Write a rule</b> that would have prevented it.
                </li>
                <li>
                  <b>Mark improved</b> once you have followed that rule consistently.
                </li>
              </ol>
              <div className="notice mt-16">
                Improvement rate: <span className="num cyan">{Math.round(improvementRate * 100)}%</span> of logged mistakes have been worked through.
              </div>
            </Panel>
          </div>

          <Panel
            title="Entries"
            sub={`${list.length} shown`}
            actions={
              <div className="row gap-4" style={{ gap: 6 }}>
                {(['all', 'open', 'improved'] as const).map((f) => (
                  <button key={f} type="button" className={cx('chip', filter === f && 'on')} onClick={() => setFilter(f)}>
                    {f === 'all' ? 'All' : f === 'open' ? 'Open' : 'Improved'}
                  </button>
                ))}
              </div>
            }
          >
            {list.length === 0 ? (
              <EmptyState title="Nothing here" text={filter === 'open' ? 'No open mistakes — everything logged has been improved.' : 'No improved mistakes yet.'} />
            ) : (
              <div className="ml-list">
                <AnimatePresence initial={false}>
                  {list.map((m, i) => (
                    <motion.article
                      key={m.id}
                      layout={!reduce}
                      className={cx('ml-item', m.status === 'improved' && 'improved')}
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i, 10) * 0.03 } }}
                      exit={{ opacity: 0 }}
                      onClick={() => setDraft(m)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && e.target === e.currentTarget && setDraft(m)}
                    >
                      <div className="ml-item-head">
                        <div className="ml-check" onClick={(e) => e.stopPropagation()}>
                          <HoloCheck checked={m.status === 'improved'} onChange={(on) => toggleImproved(m, on)} label="Mark improved" />
                          <span className="tiny muted upper display">{m.status === 'improved' ? 'Improved' : 'Mark improved'}</span>
                        </div>
                        <div className="grow">
                          <h4 className="ml-title">{m.title || m.category}</h4>
                          <div className="row wrap gap-4" style={{ gap: 6, marginTop: 4 }}>
                            <span className="tag">{m.category}</span>
                            <span className="small muted num">{m.date ? formatLong(m.date) : '—'}</span>
                            {m.tradeRef && <span className="small cyan">{m.tradeRef}</span>}
                            {m.status === 'improved' && m.improvedAt && (
                              <span className="badge good">Improved {formatLong(m.improvedAt)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      {(m.why || m.shouldHave || m.prevention) && (
                        <div className="ml-item-body">
                          {m.why && (
                            <div>
                              <span className="stat-label">Why it happened</span>
                              <p>{m.why}</p>
                            </div>
                          )}
                          {m.shouldHave && (
                            <div>
                              <span className="stat-label">What I should have done</span>
                              <p>{m.shouldHave}</p>
                            </div>
                          )}
                          {m.prevention && (
                            <div>
                              <span className="stat-label">How I will prevent it</span>
                              <p>{m.prevention}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </Panel>
        </div>
      )}

      <MistakeEditor
        draft={draft}
        tradeOptions={tradeOptions}
        today={today}
        onChange={setDraft}
        onClose={() => setDraft(null)}
        onSave={onSave}
        onDelete={(id) => {
          remove(id);
          setDraft(null);
        }}
      />
    </div>
  );
}

function MistakeEditor({
  draft,
  tradeOptions,
  today,
  onChange,
  onClose,
  onSave,
  onDelete,
}: {
  draft: Mistake | null;
  tradeOptions: { label: string; date: string }[];
  today: string;
  onChange: (m: Mistake) => void;
  onClose: () => void;
  onSave: (m: Mistake) => void;
  onDelete: (id: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const draftId = draft?.id;
  useEffect(() => setConfirmDelete(false), [draftId]);
  const m = draft;
  const set = (patch: Partial<Mistake>) => m && onChange({ ...m, ...patch });
  const categories = m && m.category && !MISTAKE_CATEGORIES.includes(m.category) ? [...MISTAKE_CATEGORIES, m.category] : MISTAKE_CATEGORIES;

  return (
    <Modal
      open={!!m}
      onClose={onClose}
      wide
      title={m?.id ? 'Edit mistake' : 'Record mistake'}
      footer={
        m && (
          <>
            {m.id &&
              (confirmDelete ? (
                <button className="btn btn-danger" onClick={() => onDelete(m.id)}>
                  <Trash2 size={14} /> Confirm delete
                </button>
              ) : (
                <button className="btn btn-ghost btn-danger" onClick={() => setConfirmDelete(true)}>
                  <Trash2 size={14} /> Delete
                </button>
              ))}
            <span className="grow" />
            <button className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={() => onSave(m)} disabled={!m.date}>
              Save
            </button>
          </>
        )
      }
    >
      {m && (
        <form
          className="tl-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(m);
          }}
        >
          <div className="tl-form-grid">
            <Field label="Mistake" className="span-2">
              <input className="input" value={m.title} placeholder="Short description, e.g. Moved stop below swing low" onChange={(e) => set({ title: e.target.value })} />
            </Field>
            <Field label="Category" className="span-2">
              <select className="select" value={m.category} onChange={(e) => set({ category: e.target.value })}>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Date">
              <input type="date" className="input" value={m.date} onChange={(e) => set({ date: e.target.value })} required />
            </Field>
            <Field label="Link a trade" hint="optional" className="span-3">
              <select
                className="select"
                value=""
                onChange={(e) => {
                  const opt = tradeOptions.find((o) => o.label === e.target.value);
                  if (opt) set({ tradeRef: opt.label, date: m.date || opt.date });
                }}
              >
                <option value="">{tradeOptions.length ? 'Pick from your trades, backtests & paper trades…' : 'No recorded trades yet'}</option>
                {tradeOptions.map((o) => (
                  <option key={o.label + o.date} value={o.label}>
                    {o.label} · {o.date}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Trade" hint="or type freely" className="span-all">
              <input className="input" value={m.tradeRef} placeholder="e.g. Trade #4 · EURUSD" onChange={(e) => set({ tradeRef: e.target.value })} />
            </Field>
            <Field label="Why it happened" className="span-all">
              <textarea className="textarea" rows={3} value={m.why} placeholder="The trigger — what were you thinking or feeling?" onChange={(e) => set({ why: e.target.value })} />
            </Field>
            <Field label="What I should have done" className="span-all">
              <textarea className="textarea" rows={3} value={m.shouldHave} placeholder="The correct action according to your plan." onChange={(e) => set({ shouldHave: e.target.value })} />
            </Field>
            <Field label="How I will prevent it" className="span-all">
              <textarea className="textarea" rows={3} value={m.prevention} placeholder="A concrete rule or checklist item." onChange={(e) => set({ prevention: e.target.value })} />
            </Field>
            <div className="span-all row" style={{ gap: 12 }}>
              <HoloCheck
                checked={m.status === 'improved'}
                onChange={(on) => set(on ? { status: 'improved', improvedAt: today } : { status: 'open', improvedAt: undefined })}
                label="Mark improved"
              />
              <span className="small">Mark improved{m.status === 'improved' && m.improvedAt ? ` · ${formatLong(m.improvedAt)}` : ''}</span>
            </div>
          </div>
          <button type="submit" hidden />
        </form>
      )}
    </Modal>
  );
}
