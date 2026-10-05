import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CandlestickChart, FilterX, Plus, Send, Trash2 } from 'lucide-react';
import { useCollection, useToday } from '../lib/hooks';
import {
  C,
  MISTAKE_CATEGORIES,
  emptyTrade,
  plannedRR,
  realizedR,
  tradeReward,
  tradeRisk,
  tradeStats,
  type Direction,
  type Mistake,
  type Outcome,
  type Strategy,
  type Trade,
  type TradeStats,
} from '../lib/domain';
import { CountUp, EmptyState, Field, ImageAttach, Modal, NumberInput, Panel, RingMeter, SegControl, Thumbs, cx, reveal } from './ui';
import '../styles/trades.css';

export type TradeVariant = 'journal' | 'backtest' | 'sim';

export const EMOTION_OPTIONS = ['Calm', 'Confident', 'FOMO', 'Fear', 'Greed', 'Revenge', 'Impatient', 'Bored', 'Anxious', 'Disciplined'];

const PREFIX: Record<TradeVariant, string> = { journal: 'Trade', backtest: 'Backtest', sim: 'Sim' };
const NOUN: Record<TradeVariant, string> = { journal: 'trade', backtest: 'backtest', sim: 'paper trade' };

/** "Backtest #12 · EURUSD" */
export function tradeLabel(t: Pick<Trade, 'num' | 'asset'>, variant: TradeVariant): string {
  return `${PREFIX[variant]} #${t.num}${t.asset ? ` · ${t.asset}` : ''}`;
}

// ─── Formatting ────────────────────────────────────────────────────────────

const fmtPrice = (n: number | null | undefined) => (n == null ? '—' : String(+n.toFixed(6)));
const fmtNum = (n: number | null | undefined, d = 2) => (n == null ? '—' : n.toFixed(d));
const fmtR = (n: number | null | undefined) => (n == null ? '—' : `${n > 0 ? '+' : ''}${n.toFixed(2)}R`);
const toneOf = (n: number | null | undefined) => (n == null || n === 0 ? undefined : n > 0 ? 'var(--good)' : 'var(--bad)');

const OUTCOME_LABEL: Record<Outcome, string> = { win: 'Win', loss: 'Loss', breakeven: 'B/E', open: 'Open' };
const OUTCOME_CLASS: Record<Outcome, string> = { win: 'win', loss: 'loss', breakeven: 'be', open: 'dim' };

function ResultCell({ t }: { t: Trade }) {
  const r = realizedR(t);
  return (
    <span className="row gap-4" style={{ gap: 8 }}>
      <span className={cx('badge', OUTCOME_CLASS[t.outcome])}>{OUTCOME_LABEL[t.outcome]}</span>
      {t.outcome !== 'open' && (
        <span className="num" style={{ color: toneOf(r) }}>
          {fmtR(r)}
        </span>
      )}
    </span>
  );
}

// ─── Chart styling ─────────────────────────────────────────────────────────

export const tick = { fill: '#7f9aa7', fontSize: 11 };
export const gridStroke = 'rgba(120,225,255,0.08)';
export const tooltipStyle = { background: 'rgba(6,18,28,0.95)', border: '1px solid rgba(120,225,255,0.3)', borderRadius: 6, fontSize: 12 };

// ─── Columns ───────────────────────────────────────────────────────────────

interface Col {
  key: string;
  label: string;
  cell: (t: Trade) => ReactNode;
  wrap?: boolean;
  num?: boolean;
}

const COLS: Record<string, Col> = {
  num: { key: 'num', label: 'Trade #', cell: (t) => <span className="num cyan">#{t.num}</span> },
  date: { key: 'date', label: 'Date', cell: (t) => <span className="num">{t.date}</span> },
  asset: { key: 'asset', label: 'Asset', cell: (t) => <strong className="tl-asset">{t.asset || '—'}</strong> },
  direction: {
    key: 'direction',
    label: 'Direction',
    cell: (t) => <span className={cx('tl-dir', t.direction)}>{t.direction === 'long' ? '▲ LONG' : '▼ SHORT'}</span>,
  },
  setup: { key: 'setup', label: 'Setup', cell: (t) => (t.setup ? <span className="tag">{t.setup}</span> : <span className="dim">—</span>) },
  entry: { key: 'entry', label: 'Entry', num: true, cell: (t) => fmtPrice(t.entry) },
  stop: { key: 'stop', label: 'Stop', num: true, cell: (t) => fmtPrice(t.stop) },
  stopLoss: { key: 'stopLoss', label: 'Stop Loss', num: true, cell: (t) => fmtPrice(t.stop) },
  target: { key: 'target', label: 'Target', num: true, cell: (t) => fmtPrice(t.target) },
  risk: { key: 'risk', label: 'Risk', num: true, cell: (t) => fmtPrice(tradeRisk(t)) },
  reward: { key: 'reward', label: 'Reward', num: true, cell: (t) => fmtPrice(tradeReward(t)) },
  rr: { key: 'rr', label: 'R:R', num: true, cell: (t) => (plannedRR(t) == null ? '—' : `1:${fmtNum(plannedRR(t))}`) },
  result: { key: 'result', label: 'Result', cell: (t) => <ResultCell t={t} /> },
  shot: { key: 'shot', label: 'Screenshot', cell: (t) => (t.images.length ? <Thumbs images={t.images.slice(0, 1)} /> : <span className="dim">—</span>) },
  mistake: {
    key: 'mistake',
    label: 'Mistake',
    cell: (t) => (t.mistake ? <span className="badge bad">{t.mistake}</span> : <span className="dim">—</span>),
  },
  emotion: { key: 'emotion', label: 'Emotion', cell: (t) => (t.emotion ? <span className="tag">{t.emotion}</span> : <span className="dim">—</span>) },
  notes: { key: 'notes', label: 'Notes', wrap: true, cell: (t) => <span className="tl-notes">{t.notes || '—'}</span> },
};

const COLUMNS: Record<TradeVariant, Col[]> = {
  backtest: ['num', 'date', 'asset', 'setup', 'entry', 'stop', 'target', 'result', 'rr', 'shot', 'mistake', 'notes'].map((k) => COLS[k]),
  sim: ['num', 'date', 'asset', 'direction', 'setup', 'entry', 'stop', 'target', 'result', 'rr', 'shot', 'mistake', 'emotion', 'notes'].map((k) => COLS[k]),
  journal: ['date', 'asset', 'direction', 'setup', 'entry', 'stopLoss', 'target', 'risk', 'reward', 'rr', 'result', 'mistake', 'emotion', 'shot'].map(
    (k) => COLS[k],
  ),
};

// ─── Filters (journal) ─────────────────────────────────────────────────────

interface Filters {
  outcomes: ('win' | 'loss')[];
  setup: string;
  from: string;
  to: string;
  asset: string;
  mistake: string;
  emotion: string;
}
const NO_FILTERS: Filters = { outcomes: [], setup: '', from: '', to: '', asset: '', mistake: '', emotion: '' };

const uniq = (xs: string[]) => [...new Set(xs.map((x) => x.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));

function applyFilters(trades: Trade[], f: Filters): Trade[] {
  return trades.filter(
    (t) =>
      (!f.outcomes.length || (f.outcomes as string[]).includes(t.outcome)) &&
      (!f.setup || t.setup.trim() === f.setup) &&
      (!f.from || t.date >= f.from) &&
      (!f.to || t.date <= f.to) &&
      (!f.asset || t.asset.trim() === f.asset) &&
      (!f.mistake || t.mistake.trim() === f.mistake) &&
      (!f.emotion || t.emotion.trim() === f.emotion),
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export function TradeLog({ collection, variant }: { collection: string; variant: TradeVariant }) {
  const { items, save, remove, create } = useCollection<Trade>(collection);
  const { create: createMistake } = useCollection<Mistake>(C.mistakes);
  const { items: strategies } = useCollection<Strategy>(C.strategies);
  const today = useToday();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [draft, setDraft] = useState<Trade | null>(null);
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const simulated = variant !== 'journal';

  const nextNum = useMemo(() => items.reduce((m, t) => Math.max(m, t.num || 0), 0) + 1, [items]);

  const openNew = () => setDraft({ id: '', ...emptyTrade(today, nextNum) });

  // `?new=1` opens the add form immediately (dashboard quick actions).
  useEffect(() => {
    if (params.get('new') === '1') {
      setDraft({ id: '', ...emptyTrade(today, nextNum) });
      const next = new URLSearchParams(params);
      next.delete('new');
      setParams(next, { replace: true });
    }
  }, [params, setParams, today, nextNum]);

  const sorted = useMemo(
    () => [...items].sort((a, b) => (a.date === b.date ? b.num - a.num : a.date < b.date ? 1 : -1)),
    [items],
  );
  const filtering = variant === 'journal' && JSON.stringify(filters) !== JSON.stringify(NO_FILTERS);
  const visible = useMemo(() => (variant === 'journal' ? applyFilters(sorted, filters) : sorted), [sorted, filters, variant]);
  const stats = useMemo(() => tradeStats(visible), [visible]);

  const sendToLab = (t: Trade) => {
    const isCategory = MISTAKE_CATEGORIES.includes(t.mistake.trim());
    const m = createMistake({
      title: t.mistake.trim(),
      category: isCategory ? t.mistake.trim() : 'Other',
      date: t.date,
      tradeRef: tradeLabel(t, variant),
      why: '',
      shouldHave: '',
      prevention: '',
      status: 'open',
    });
    navigate(`/mistakes?edit=${m.id}`);
  };

  const onSave = (t: Trade) => {
    if (t.id) save(t);
    else {
      const { id: _omit, ...rest } = t;
      void _omit;
      create(rest);
    }
    setDraft(null);
  };

  const cols = COLUMNS[variant];
  const reduce = useReducedMotion();

  return (
    <div className="col gap-20 tl">
      <StatsHeader stats={stats} variant={variant} filtered={filtering} />

      {simulated && stats.closed > 0 && (
        <div className="grid-2 tl-split">
          <EquityCurve stats={stats} />
          <SetupBreakdown stats={stats} />
        </div>
      )}

      <Panel
        title={variant === 'journal' ? 'Trade log' : variant === 'backtest' ? 'Backtest log' : 'Paper trade log'}
        sub={`${items.length} recorded`}
        actions={
          <button className="btn btn-primary btn-sm" onClick={openNew}>
            <Plus size={14} /> Add {NOUN[variant]}
          </button>
        }
      >
        {variant === 'journal' && items.length > 0 && (
          <FilterBar trades={items} filters={filters} onChange={setFilters} shown={visible.length} total={items.length} />
        )}

        {items.length === 0 ? (
          <EmptyState
            icon={<CandlestickChart size={30} />}
            title={`No ${NOUN[variant]}s yet`}
            text={
              variant === 'journal'
                ? 'Record each trade you take — entry, stop, target, outcome and how you felt. Statistics build from your own entries only.'
                : variant === 'backtest'
                  ? 'Replay historical charts bar by bar and log every setup you would have taken. Stats build from your entries only.'
                  : 'Log every paper trade you place on a demo account or simulator. No real money involved.'
            }
            action={
              <button className="btn btn-primary" onClick={openNew}>
                <Plus size={15} /> Record first {NOUN[variant]}
              </button>
            }
          />
        ) : visible.length === 0 ? (
          <EmptyState icon={<FilterX size={28} />} title="No matches" text="No trades match the current filters." />
        ) : (
          <div className="table-wrap">
            <table className="table tl-table">
              <thead>
                <tr>
                  {cols.map((c) => (
                    <th key={c.key}>{c.label}</th>
                  ))}
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {visible.map((t, i) => (
                  <motion.tr
                    key={t.id}
                    className="clickable"
                    onClick={() => setDraft(t)}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i, 12) * 0.025, duration: 0.3 }}
                  >
                    {cols.map((c) => (
                      <td key={c.key} className={cx(c.wrap && 'wrap', c.num && 'num')}>
                        {c.cell(t)}
                      </td>
                    ))}
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="row gap-4" style={{ justifyContent: 'flex-end' }}>
                        {t.mistake.trim() && (
                          <button className="icon-btn" title="Send to Mistake Lab" aria-label="Send to Mistake Lab" onClick={() => sendToLab(t)}>
                            <Send size={14} />
                          </button>
                        )}
                        <button
                          className="icon-btn danger"
                          title="Delete"
                          aria-label="Delete trade"
                          onClick={() => window.confirm(`Delete ${tradeLabel(t, variant)}? This cannot be undone.`) && remove(t.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <TradeEditor
        draft={draft}
        variant={variant}
        trades={items}
        strategies={strategies}
        onChange={setDraft}
        onClose={() => setDraft(null)}
        onSave={onSave}
        onDelete={(id) => {
          remove(id);
          setDraft(null);
        }}
        onSendToLab={(t) => {
          if (t.id) save(t);
          setDraft(null);
          sendToLab(t);
        }}
      />
    </div>
  );
}

// ─── Stats header ──────────────────────────────────────────────────────────

function StatsHeader({ stats, variant, filtered }: { stats: TradeStats; variant: TradeVariant; filtered: boolean }) {
  const simulated = variant !== 'journal';
  const netLabel = simulated ? 'Net simulated result' : 'Net result';
  return (
    <motion.div variants={reveal} initial="hidden" animate="show" className="glass hud tl-stats">
      <div className="tl-stats-ring">
        <RingMeter value={stats.winRate} size={118} stroke={6} label="Win rate" />
        <span className="tiny muted">of {stats.closed} closed</span>
      </div>
      <div className="stat-grid tl-stat-grid">
        <StatCell label="Total trades" value={<CountUp value={stats.total} />} note={filtered ? 'Filtered view' : undefined} />
        <StatCell label="Wins" value={<CountUp value={stats.wins} />} tone="good" />
        <StatCell label="Losses" value={<CountUp value={stats.losses} />} tone="bad" />
        <StatCell
          label="Win rate"
          value={<CountUp value={stats.winRate * 100} decimals={1} suffix="%" />}
          note={stats.breakeven ? `${stats.breakeven} breakeven` : undefined}
        />
        <StatCell label="Average R:R" value={stats.avgRR == null ? '—' : <CountUp value={stats.avgRR} decimals={2} prefix="1:" />} note="Planned" />
        <StatCell
          label={netLabel}
          value={<CountUp value={stats.netR} decimals={2} prefix={stats.netR > 0 ? '+' : ''} suffix="R" />}
          tone={stats.netR > 0 ? 'good' : stats.netR < 0 ? 'bad' : undefined}
          note={simulated ? 'Simulated · R multiples' : 'R multiples'}
        />
        <StatCell
          label="Best setup"
          value={stats.best ? <span className="tl-setup-name">{stats.best.setup}</span> : '—'}
          note={stats.best ? `${fmtR(stats.best.netR)} · ${stats.best.count} trades` : 'Needs closed trades'}
        />
        <StatCell
          label="Worst setup"
          value={stats.worst ? <span className="tl-setup-name">{stats.worst.setup}</span> : '—'}
          note={stats.worst ? `${fmtR(stats.worst.netR)} · ${stats.worst.count} trades` : 'Needs 2+ setups'}
        />
      </div>
    </motion.div>
  );
}

function StatCell({ label, value, note, tone }: { label: string; value: ReactNode; note?: string; tone?: 'good' | 'bad' }) {
  return (
    <div className="stat">
      <span className="stat-label">{label}</span>
      <span className="stat-value sm" style={tone ? { color: `var(--${tone})` } : undefined}>
        {value}
      </span>
      {note && <span className="stat-note">{note}</span>}
    </div>
  );
}

// ─── Equity curve & setup breakdown ────────────────────────────────────────

function EquityCurve({ stats }: { stats: TradeStats }) {
  const data = [{ n: 0, date: '', r: 0, cum: 0 }, ...stats.equity];
  return (
    <Panel title="Simulated R curve" sub="cumulative R · not predictive">
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="tl-eq" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3ee6ff" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#3ee6ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={gridStroke} vertical={false} />
          <XAxis dataKey="n" tick={tick} tickLine={false} axisLine={{ stroke: gridStroke }} />
          <YAxis tick={tick} tickLine={false} axisLine={false} tickFormatter={(v: number) => `${v}R`} />
          <ReferenceLine y={0} stroke="rgba(120,225,255,0.25)" strokeDasharray="4 4" />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={{ color: '#7f9aa7' }}
            labelFormatter={(n) => (Number(n) === 0 ? 'Start' : `Trade ${n}`)}
            formatter={(v) => [`${Number(v).toFixed(2)}R`, 'Cumulative']}
          />
          <Area type="monotone" dataKey="cum" stroke="#3ee6ff" strokeWidth={2} fill="url(#tl-eq)" dot={false} activeDot={{ r: 4 }} />
        </AreaChart>
      </ResponsiveContainer>
    </Panel>
  );
}

function SetupBreakdown({ stats }: { stats: TradeStats }) {
  return (
    <Panel title="Setup breakdown" sub="closed trades">
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Setup</th>
              <th>Count</th>
              <th>Win rate</th>
              <th>Net R</th>
            </tr>
          </thead>
          <tbody>
            {stats.bySetup.map((s) => (
              <tr key={s.setup}>
                <td>
                  <span className="tag">{s.setup}</span>
                </td>
                <td className="num">{s.count}</td>
                <td className="num">
                  <div className="tl-mini-bar">
                    <i style={{ width: `${s.winRate * 100}%` }} />
                  </div>
                  {(s.winRate * 100).toFixed(0)}%
                </td>
                <td className="num" style={{ color: toneOf(s.netR) }}>
                  {fmtR(s.netR)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

// ─── Filter bar ────────────────────────────────────────────────────────────

function FilterBar({
  trades,
  filters,
  onChange,
  shown,
  total,
}: {
  trades: Trade[];
  filters: Filters;
  onChange: (f: Filters) => void;
  shown: number;
  total: number;
}) {
  const setups = useMemo(() => uniq(trades.map((t) => t.setup)), [trades]);
  const assets = useMemo(() => uniq(trades.map((t) => t.asset)), [trades]);
  const mistakes = useMemo(() => uniq(trades.map((t) => t.mistake)), [trades]);
  const emotions = useMemo(() => uniq(trades.map((t) => t.emotion)), [trades]);
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const toggle = (o: 'win' | 'loss') =>
    set({ outcomes: filters.outcomes.includes(o) ? filters.outcomes.filter((x) => x !== o) : [...filters.outcomes, o] });
  const active = JSON.stringify(filters) !== JSON.stringify(NO_FILTERS);

  const select = (label: string, value: string, options: string[], key: 'setup' | 'asset' | 'mistake' | 'emotion') => (
    <label className="tl-filter">
      <span className="stat-label">{label}</span>
      <select className="select" value={value} onChange={(e) => set({ [key]: e.target.value })}>
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="tl-filters">
      <div className="tl-filter">
        <span className="stat-label">Outcome</span>
        <div className="row gap-4" style={{ gap: 6 }}>
          <button type="button" className={cx('chip', filters.outcomes.includes('win') && 'on')} onClick={() => toggle('win')}>
            Wins
          </button>
          <button type="button" className={cx('chip', filters.outcomes.includes('loss') && 'on')} onClick={() => toggle('loss')}>
            Losses
          </button>
        </div>
      </div>
      {select('Setup', filters.setup, setups, 'setup')}
      <label className="tl-filter">
        <span className="stat-label">From</span>
        <input type="date" className="input" value={filters.from} onChange={(e) => set({ from: e.target.value })} />
      </label>
      <label className="tl-filter">
        <span className="stat-label">To</span>
        <input type="date" className="input" value={filters.to} onChange={(e) => set({ to: e.target.value })} />
      </label>
      {select('Asset', filters.asset, assets, 'asset')}
      {select('Mistake', filters.mistake, mistakes, 'mistake')}
      {select('Emotion', filters.emotion, emotions, 'emotion')}
      <div className="tl-filter-foot">
        <span className="small muted">
          Showing <span className="num cyan">{shown}</span> of <span className="num">{total}</span>
        </span>
        <button type="button" className="btn btn-ghost btn-sm" disabled={!active} onClick={() => onChange(NO_FILTERS)}>
          <FilterX size={14} /> Clear filters
        </button>
      </div>
    </div>
  );
}

// ─── Editor ────────────────────────────────────────────────────────────────

function TradeEditor({
  draft,
  variant,
  trades,
  strategies,
  onChange,
  onClose,
  onSave,
  onDelete,
  onSendToLab,
}: {
  draft: Trade | null;
  variant: TradeVariant;
  trades: Trade[];
  strategies: Strategy[];
  onChange: (t: Trade) => void;
  onClose: () => void;
  onSave: (t: Trade) => void;
  onDelete: (id: string) => void;
  onSendToLab: (t: Trade) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const draftId = draft?.id;
  useEffect(() => setConfirmDelete(false), [draftId]);

  const setups = useMemo(() => uniq([...trades.map((t) => t.setup), ...strategies.map((s) => s.name)]), [trades, strategies]);
  const mistakes = useMemo(() => uniq([...MISTAKE_CATEGORIES, ...trades.map((t) => t.mistake)]), [trades]);
  const assets = useMemo(() => uniq(trades.map((t) => t.asset)), [trades]);

  const t = draft;
  const set = (patch: Partial<Trade>) => t && onChange({ ...t, ...patch });
  const risk = t ? tradeRisk(t) : null;
  const reward = t ? tradeReward(t) : null;
  const rr = t ? plannedRR(t) : null;
  const r = t ? realizedR(t) : null;
  const listId = `tl-${variant}`;

  return (
    <Modal
      open={!!t}
      onClose={onClose}
      wide
      title={t ? (t.id ? `Edit ${tradeLabel(t, variant)}` : `New ${NOUN[variant]}`) : ''}
      footer={
        t && (
          <>
            {t.id &&
              (confirmDelete ? (
                <button className="btn btn-danger" onClick={() => onDelete(t.id)}>
                  <Trash2 size={14} /> Confirm delete
                </button>
              ) : (
                <button className="btn btn-ghost btn-danger" onClick={() => setConfirmDelete(true)}>
                  <Trash2 size={14} /> Delete
                </button>
              ))}
            <span className="grow" />
            {t.mistake.trim() && (
              <button className="btn btn-ghost" onClick={() => onSendToLab(t)}>
                <Send size={14} /> Send to Mistake Lab
              </button>
            )}
            <button className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={() => onSave(t)} disabled={!t.date}>
              Save {NOUN[variant]}
            </button>
          </>
        )
      }
    >
      {t && (
        <form
          className="tl-form"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(t);
          }}
        >
          {variant !== 'journal' && (
            <div className="notice tl-form-note">
              {variant === 'backtest'
                ? 'Backtest entry · historical replay · simulated result.'
                : 'Paper trade · no real money · simulated result.'}
            </div>
          )}
          <div className="tl-form-grid">
            <Field label="Trade #">
              <NumberInput value={t.num} onChange={(v) => set({ num: v == null ? t.num : Math.max(1, Math.round(v)) })} step="1" />
            </Field>
            <Field label="Date">
              <input type="date" className="input" value={t.date} onChange={(e) => set({ date: e.target.value })} required />
            </Field>
            <Field label="Asset">
              <input
                className="input"
                list={`${listId}-assets`}
                value={t.asset}
                placeholder="e.g. EURUSD"
                onChange={(e) => set({ asset: e.target.value.toUpperCase() })}
              />
            </Field>
            <Field label="Direction">
              <SegControl<Direction>
                options={[
                  { value: 'long', label: '▲ Long' },
                  { value: 'short', label: '▼ Short' },
                ]}
                value={t.direction}
                onChange={(v) => set({ direction: v })}
              />
            </Field>
            <Field label="Setup" className="span-2">
              <input className="input" list={`${listId}-setups`} value={t.setup} placeholder="e.g. Breakout retest" onChange={(e) => set({ setup: e.target.value })} />
            </Field>
            <Field label="Strategy" hint="optional" className="span-2">
              <select className="select" value={t.strategyId ?? ''} onChange={(e) => set({ strategyId: e.target.value || undefined })}>
                <option value="">— None —</option>
                {strategies.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name || 'Untitled strategy'}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Entry">
              <NumberInput value={t.entry} onChange={(v) => set({ entry: v })} placeholder="0.00" />
            </Field>
            <Field label="Stop">
              <NumberInput value={t.stop} onChange={(v) => set({ stop: v })} placeholder="0.00" />
            </Field>
            <Field label="Target">
              <NumberInput value={t.target} onChange={(v) => set({ target: v })} placeholder="0.00" />
            </Field>
            <Field label="Size" hint="optional">
              <NumberInput value={t.size} onChange={(v) => set({ size: v })} placeholder="units" />
            </Field>
          </div>

          <div className="tl-calc">
            <div>
              <span className="stat-label">Risk</span>
              <span className="num">{risk == null ? '—' : +risk.toFixed(6)}</span>
            </div>
            <div>
              <span className="stat-label">Reward</span>
              <span className="num">{reward == null ? '—' : +reward.toFixed(6)}</span>
            </div>
            <div>
              <span className="stat-label">Planned R:R</span>
              <span className="num cyan">{rr == null ? '—' : `1:${rr.toFixed(2)}`}</span>
            </div>
            <div>
              <span className="stat-label">Result</span>
              <span className="num" style={{ color: toneOf(r) }}>
                {t.outcome === 'open' ? 'Open' : fmtR(r)}
              </span>
            </div>
          </div>

          <div className="tl-form-grid">
            <Field label="Outcome" className="span-2">
              <SegControl<Outcome>
                options={[
                  { value: 'win', label: 'Win' },
                  { value: 'loss', label: 'Loss' },
                  { value: 'breakeven', label: 'B/E' },
                  { value: 'open', label: 'Open' },
                ]}
                value={t.outcome}
                onChange={(v) => set({ outcome: v })}
              />
            </Field>
            <Field label="Result (R)" hint="optional override" className="span-2">
              <NumberInput value={t.resultR} onChange={(v) => set({ resultR: v })} placeholder="auto from outcome & R:R" />
            </Field>
            <Field label="Mistake" hint="if any" className="span-2">
              <input className="input" list={`${listId}-mistakes`} value={t.mistake} placeholder="None" onChange={(e) => set({ mistake: e.target.value })} />
            </Field>
            <Field label="Emotion" className="span-2">
              <input className="input" list={`${listId}-emotions`} value={t.emotion} placeholder="e.g. Calm" onChange={(e) => set({ emotion: e.target.value })} />
            </Field>
            <Field label="Notes" className="span-all">
              <textarea className="textarea" rows={3} value={t.notes} placeholder="What did you see? What would you repeat?" onChange={(e) => set({ notes: e.target.value })} />
            </Field>
            <Field label="Screenshots" hint="drop, paste or click" className="span-all">
              <ImageAttach images={t.images} onChange={(images) => set({ images })} label="Add chart" />
            </Field>
          </div>
          <button type="submit" hidden />

          <datalist id={`${listId}-assets`}>
            {assets.map((a) => (
              <option key={a} value={a} />
            ))}
          </datalist>
          <datalist id={`${listId}-setups`}>
            {setups.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
          <datalist id={`${listId}-mistakes`}>
            {mistakes.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
          <datalist id={`${listId}-emotions`}>
            {EMOTION_OPTIONS.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </form>
      )}
    </Modal>
  );
}

