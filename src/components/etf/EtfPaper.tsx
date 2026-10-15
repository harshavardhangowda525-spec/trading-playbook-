import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ChevronsRight, Clock, FileText, History, NotebookPen, Play, RotateCcw, ShieldAlert, Square, StepForward, Upload, Wallet, X } from 'lucide-react';
import { Field, NumberInput, SegControl, cx } from '../ui';
import { PracticeChart } from '../practice/PracticeChart';
import { DataImport } from '../practice/DataImport';
import { ReportView } from './ReportView';
import { EtfDataGuide } from './EtfDataGuide';
import { RiskCostSettings } from './RiskCostSettings';
import { EligibilityTable } from './EligibilityTable';
import { INTERVALS, intervalSec, type Candle, type Interval } from '../../lib/market';
import { etfBars, intervalsFor, useEtfDatasets, type EtfDataset } from '../../lib/etf/data';
import { SESSIONS, fmtLocal } from '../../lib/etf/calendar';
import { assessEligibility } from '../../lib/etf/eligibility';
import { DEFAULT_PAPER_ACCOUNT, useEtfConfig, usePaperAccount, usePaperSessions } from '../../lib/etf/config';
import {
  advance,
  cancelOrder,
  createSession,
  endSession,
  exitPosition,
  lastPrice,
  modifyBracket,
  nowT,
  placeOrder,
  preTradeCheck,
  realized,
  timeline,
  unrealized,
  type DayBars,
  type OrderInput,
  type PaperSession,
} from '../../lib/etf/paper';
import { paperReport } from '../../lib/etf/report';
import { STRATEGIES, strategyById, type Side, type StrategyId } from '../../lib/etf/strategies';
import { etfBySymbol, fmtMoney, type EtfDef } from '../../lib/etf/universe';
import { JOURNAL_COLLECTION, MISTAKES, blankEntry, type JournalTradeEntry, type MistakeKey } from '../../lib/journal';
import { store, newId } from '../../lib/store';
import '../../styles/etf.css';

const ease = [0.22, 1, 0.36, 1] as const;
const tf = (i: Interval) => INTERVALS.find((x) => x.key === i)!.label;

export function EtfPaper() {
  const datasets = useEtfDatasets();
  const sessions = usePaperSessions();
  const [account, updateAccount] = usePaperAccount();
  const [importOpen, setImportOpen] = useState(false);
  const [viewId, setViewId] = useState<string | null>(null);
  const active = sessions.items.find((s) => s.id === account.activeSessionId) ?? null;
  const viewing = viewId ? sessions.items.find((s) => s.id === viewId) ?? null : null;

  const finish = (s: PaperSession) => {
    // Settle the session into the virtual account exactly once.
    const net = realized(s);
    updateAccount((a) => ({
      ...a,
      balance: a.balance + net,
      activeSessionId: null,
      cooldownUntil: s.dayLocked ? Date.now() + s.risk.cooldownMin * 60000 : a.cooldownUntil,
    }));
    setViewId(s.id);
  };

  return (
    <div className="etf">
      <AccountBar account={account} onReset={(start) => updateAccount({ ...DEFAULT_PAPER_ACCOUNT, startingBalance: start, balance: start, resetAt: Date.now(), activeSessionId: null })} hasActive={!!active} />
      {!datasets.length ? (
        <EtfDataGuide onImport={() => setImportOpen(true)} what="start a paper session" />
      ) : active ? (
        <ActiveSession key={active.id} s={active} datasets={datasets} onSave={sessions.save} onFinished={finish} />
      ) : viewing ? (
        <SessionReview s={viewing} onSave={sessions.save} onClose={() => setViewId(null)} />
      ) : (
        <SessionSetup
          datasets={datasets}
          account={account}
          onStart={(s) => {
            sessions.save(s);
            updateAccount({ activeSessionId: s.id });
          }}
          onImport={() => setImportOpen(true)}
        />
      )}
      <SessionHistory sessions={sessions.items.filter((s) => s.status === 'ended')} onOpen={setViewId} />
      <DataImport open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}

// ─── Account ──────────────────────────────────────────────────────────────

function AccountBar({ account, onReset, hasActive }: { account: typeof DEFAULT_PAPER_ACCOUNT; onReset: (start: number) => void; hasActive: boolean }) {
  const [confirm, setConfirm] = useState(false);
  const [start, setStart] = useState<number | null>(account.startingBalance);
  const cooling = account.cooldownUntil && account.cooldownUntil > Date.now();
  const change = account.balance - account.startingBalance;
  return (
    <section className="glass pad etf-panel etf-account">
      <div className="row wrap" style={{ gap: 18 }}>
        <Wallet size={18} />
        <div>
          <div className="mono-label">Virtual account · paper money only</div>
          <div className="etf-balance">{fmtMoney(account.balance, 'NSE')}</div>
          <div className={cx('tiny mono', change >= 0 ? 'pos' : 'neg')}>
            {change >= 0 ? '+' : ''}
            {fmtMoney(change, 'NSE')} since start ({fmtMoney(account.startingBalance, 'NSE', 0)})
          </div>
        </div>
        {cooling && (
          <div className="etf-cooldown">
            <Clock size={14} /> Cooldown until {new Date(account.cooldownUntil!).toLocaleTimeString()} — the daily loss limit was hit. Review the session instead of starting another.
          </div>
        )}
      </div>
      <div className="row wrap" style={{ gap: 8 }}>
        {confirm ? (
          <>
            <Field label="New starting balance">
              <NumberInput value={start} onChange={setStart} />
            </Field>
            <button type="button" className="btn btn-sm" disabled={!start || start < 1000 || hasActive} onClick={() => { onReset(Math.round(start!)); setConfirm(false); }}>
              Confirm reset
            </button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => setConfirm(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button type="button" className="btn btn-sm btn-ghost" disabled={hasActive} onClick={() => setConfirm(true)} title={hasActive ? 'End the active session first' : undefined}>
            <RotateCcw size={13} /> Reset account
          </button>
        )}
      </div>
    </section>
  );
}

// ─── Setup ────────────────────────────────────────────────────────────────

function SessionSetup({ datasets, account, onStart, onImport }: { datasets: EtfDataset[]; account: typeof DEFAULT_PAPER_ACCOUNT; onStart: (s: PaperSession) => void; onImport: () => void }) {
  const { cfg } = useEtfConfig();
  // One dataset per ETF symbol (newest wins).
  const bySymbol = useMemo(() => {
    const m = new Map<string, EtfDataset>();
    for (const d of datasets) if (!m.has(d.etf.symbol)) m.set(d.etf.symbol, d);
    return m;
  }, [datasets]);
  const [watch, setWatch] = useState<string[]>(() => [datasets[0].etf.symbol]);
  const chosen = watch.map((w) => bySymbol.get(w)).filter((x): x is EtfDataset => !!x);
  const exchange = chosen[0]?.etf.exchange ?? 'NSE';
  const ivs = useMemo(() => {
    const sets = chosen.map((c) => intervalsFor(c.ds));
    return sets.length ? sets.reduce((a, b) => a.filter((x) => b.includes(x))) : [];
  }, [chosen]);
  const [interval, setInterval_] = useState<Interval>('5m');
  const iv = ivs.includes(interval) ? interval : ivs[0];
  const days = useMemo(() => {
    if (!chosen.length || !iv) return [];
    const lists = chosen.map((c) => new Set(etfBars(c, iv).quality.days));
    return [...lists[0]].filter((d) => lists.every((l) => l.has(d))).sort();
  }, [chosen, iv]);
  const [day, setDay] = useState('');
  const d = days.includes(day) ? day : days[days.length - 1] ?? '';
  const [strategy, setStrategy] = useState<StrategyId | 'discretionary'>('trend');
  const [plan, setPlan] = useState('');
  const elig = useMemo(
    () => (iv ? chosen.map((c) => ({ c, e: assessEligibility(etfBars(c, iv).bars, intervalSec(iv), c.etf, c.etf.exchange === 'NSE' ? cfg.costsNSE : cfg.costsUS, (cfg.risk.capital * 0.5)) })) : []),
    [chosen, iv, cfg],
  );
  const blocked = elig.filter((x) => x.e.verdict === 'not-eligible');
  const cooling = !!account.cooldownUntil && account.cooldownUntil > Date.now();
  const mixed = new Set(chosen.map((c) => c.etf.exchange)).size > 1;
  const canStart = chosen.length > 0 && !!iv && !!d && plan.trim().length >= 10 && !blocked.length && !cooling && !mixed;

  const toggle = (sym: string) => setWatch((w) => (w.includes(sym) ? w.filter((x) => x !== sym) : w.length < 4 ? [...w, sym] : w));

  const start = () => {
    if (!canStart || !iv) return;
    const s = createSession({
      day: d,
      exchange,
      interval: iv,
      intervalSec: intervalSec(iv),
      symbols: chosen.map((c) => c.etf.symbol),
      sources: Object.fromEntries(chosen.map((c) => [c.etf.symbol, c.ds.id])),
      strategy,
      plan: plan.trim(),
      cash: account.balance,
      // Sizing uses the configured virtual capital, never the post-win balance.
      risk: { ...cfg.risk },
      costs: exchange === 'NSE' ? cfg.costsNSE : cfg.costsUS,
    });
    onStart(s);
  };

  return (
    <motion.section className="glass pad etf-panel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
      <div className="etf-head">
        <div>
          <div className="mono-label">New paper session · virtual money · historical replay</div>
          <div className="etf-title">
            <Play size={16} /> Plan the session before it starts
          </div>
        </div>
        <button className="btn btn-sm btn-ghost" onClick={onImport}>
          <Upload size={13} /> Import / fetch data
        </button>
      </div>
      <div className="etf-sub">1 · Watchlist (up to 4 ETFs with data)</div>
      <div className="etf-chips">
        {[...bySymbol.values()].map((c) => (
          <button key={c.etf.symbol} type="button" className={cx('mv-chip', watch.includes(c.etf.symbol) && 'on')} onClick={() => toggle(c.etf.symbol)}>
            {c.etf.symbol}
          </button>
        ))}
      </div>
      {mixed && <div className="etf-warn"><AlertTriangle size={14} /> Pick ETFs from one exchange per session.</div>}
      <div className="etf-grid">
        <Field label="Timeframe">
          <SegControl<Interval> options={ivs.map((i) => ({ value: i, label: tf(i) }))} value={iv ?? '5m'} onChange={setInterval_} />
        </Field>
        <Field label={`Historical session to replay (${exchange === 'NSE' ? 'IST' : 'ET'})`} hint="Days with data for every ETF in the watchlist">
          <select className="select" value={d} onChange={(e) => setDay(e.target.value)}>
            {days.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Strategy for this session">
          <select className="select" value={strategy} onChange={(e) => setStrategy(e.target.value as StrategyId | 'discretionary')}>
            {STRATEGIES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.letter}. {s.name}
              </option>
            ))}
            <option value="discretionary">Discretionary (no template)</option>
          </select>
        </Field>
      </div>
      <Field label="2 · Pre-session plan (required)" hint="Market context you expect, which setup you will wait for, and what would make you stand aside">
        <textarea className="textarea" rows={3} value={plan} onChange={(e) => setPlan(e.target.value)} placeholder="e.g. Only trade pullbacks to the 20-EMA if NIFTYBEES trends above VWAP; no trades in the first 15 min; stop after 2 losses." />
      </Field>
      <div className="etf-sub">3 · Risk limits for this session</div>
      <RiskCostSettings exchange={exchange} compact />
      <div className="etf-sub">4 · Eligibility</div>
      {elig.map(({ c, e }) => (
        <div key={c.etf.symbol} className={cx('etf-elig', e.verdict)}>
          <div className="etf-elig-head">
            <b>{c.etf.symbol}</b> <span className="small muted">{e.verdict === 'eligible' ? 'eligible' : e.verdict === 'caution' ? 'usable with caution' : 'not eligible — remove it from the watchlist'}</span>
          </div>
          <EligibilityTable e={e} />
        </div>
      ))}
      {cooling && <div className="etf-warn"><Clock size={14} /> Cooldown active after a daily-loss lock — new sessions open at {new Date(account.cooldownUntil!).toLocaleTimeString()}.</div>}
      <button type="button" className="btn btn-primary" style={{ marginTop: 12 }} disabled={!canStart} onClick={start}>
        <Play size={14} /> Start paper session with {fmtMoney(account.balance, exchange)}
      </button>
      {!plan.trim() && <span className="tiny muted" style={{ marginLeft: 10 }}>Write your plan to start.</span>}
    </motion.section>
  );
}

// ─── Active session ───────────────────────────────────────────────────────

function useDayBars(s: PaperSession, datasets: EtfDataset[]): { bars: DayBars; context: Record<string, Candle[]>; etfs: EtfDef[]; missing: string[] } {
  return useMemo(() => {
    const bars: DayBars = {};
    const context: Record<string, Candle[]> = {};
    const etfs: EtfDef[] = [];
    const missing: string[] = [];
    for (const sym of s.symbols) {
      const x = datasets.find((d) => d.ds.id === s.sources[sym]);
      const etf = etfBySymbol(sym);
      if (!x || !etf) {
        missing.push(sym);
        continue;
      }
      etfs.push(etf);
      const all = etfBars(x, s.interval as Interval).bars;
      const day = etfBars(x, s.interval as Interval, s.day, s.day).bars;
      bars[sym] = day;
      // Previous sessions are fully in the past → shown for context.
      const firstT = day[0]?.t ?? Infinity;
      context[sym] = all.filter((k) => k.t < firstT).slice(-150);
    }
    return { bars, context, etfs, missing };
  }, [s.symbols, s.sources, s.interval, s.day, datasets]);
}

function ActiveSession({ s, datasets, onSave, onFinished }: { s: PaperSession; datasets: EtfDataset[]; onSave: (s: PaperSession) => void; onFinished: (s: PaperSession) => void }) {
  const { bars, context, etfs, missing } = useDayBars(s, datasets);
  const [sym, setSym] = useState(s.symbols[0]);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [note, setNote] = useState('');
  const session = SESSIONS[s.exchange];
  const tl = timeline(bars);
  const t = nowT(s, bars);
  const etf = etfBySymbol(sym)!;
  const commit = (next: PaperSession) => {
    onSave(next);
    if (next.status === 'ended') onFinished(next);
  };
  const step = (n: number) => commit(advance(s, bars, etfs, n));
  const dayNet = realized(s);
  const limit = (s.risk.capital * s.risk.dailyLossPct) / 100;
  const visibleDay = (bars[sym] ?? []).filter((k) => k.t <= t);
  const candles = [...(context[sym] ?? []), ...visibleDay];
  const pos = s.positions.find((p) => p.symbol === sym);
  const markers = [
    ...s.trades.filter((x) => x.symbol === sym).flatMap((x) => [
      { t: x.entryT, kind: 'fill' as const, text: `${x.side === 'long' ? 'B' : 'S'} ${x.entryFill.toFixed(2)}` },
      { t: x.exitT, kind: 'exit' as const, text: `${x.exitReason}` },
    ]),
    ...(pos ? [{ t: pos.entryT, kind: 'fill' as const, text: `${pos.side === 'long' ? 'B' : 'S'} ${pos.entryFill.toFixed(2)}` }] : []),
  ];

  if (missing.length) {
    return (
      <div className="glass pad etf-panel">
        <div className="etf-warn">
          <AlertTriangle size={14} /> The data for {missing.join(', ')} was removed, so this session can’t continue. End it to settle the account.
        </div>
        <button className="btn" onClick={() => commit(endSession(s, bars))}>
          End session
        </button>
      </div>
    );
  }

  return (
    <div className="etf-paper">
      <section className="glass pad etf-panel etf-session-bar">
        <span className="etf-hist-badge">
          <History size={12} /> HISTORICAL REPLAY · {s.day} · not live prices
        </span>
        <span className="mono">{t ? fmtLocal(t, session, false) : '—'}</span>
        <span className="mono small">
          bar {s.cursor + 1}/{tl.length}
        </span>
        <div className="row wrap" style={{ gap: 6 }}>
          <button className="btn btn-sm" onClick={() => step(1)}>
            <StepForward size={13} /> Next bar
          </button>
          <button className="btn btn-sm" onClick={() => step(5)}>
            <ChevronsRight size={13} /> +5
          </button>
          <button className="btn btn-sm btn-ghost" onClick={() => step(15)}>
            +15
          </button>
          {confirmEnd ? (
            <>
              <button className="btn btn-sm" onClick={() => commit(endSession(s, bars))}>
                Confirm: square off & end
              </button>
              <button className="btn btn-sm btn-ghost" onClick={() => setConfirmEnd(false)}>
                Cancel
              </button>
            </>
          ) : (
            <button className="btn btn-sm btn-ghost" onClick={() => setConfirmEnd(true)}>
              <Square size={12} /> End session
            </button>
          )}
        </div>
      </section>

      <div className="etf-stats">
        <Stat label="Cash (realised)" value={fmtMoney(s.cash, s.exchange)} />
        <Stat label="Unrealised P&L" value={fmtMoney(unrealized(s, bars), s.exchange)} tone={unrealized(s, bars) >= 0 ? 'pos' : 'neg'} />
        <Stat label="Realised today" value={fmtMoney(dayNet, s.exchange)} tone={dayNet >= 0 ? 'pos' : 'neg'} />
        <Stat label="Daily loss used" value={`${fmtMoney(Math.max(0, -dayNet), s.exchange, 0)} / ${fmtMoney(limit, s.exchange, 0)}`} tone={s.dayLocked ? 'neg' : undefined} />
        <Stat label="Trades" value={`${s.trades.length + s.positions.length} / ${s.risk.maxTrades}`} />
      </div>
      {s.dayLocked && (
        <div className="etf-warn">
          <ShieldAlert size={14} /> Daily loss limit reached — new orders are blocked for the rest of this session. Let open positions finish, then end and review.
        </div>
      )}

      <div className="etf-paper-main">
        <section className="glass etf-chart">
          <div className="etf-symbols">
            {s.symbols.map((x) => (
              <button key={x} type="button" className={cx('mv-chip', sym === x && 'on')} onClick={() => setSym(x)}>
                {x} <span className="mono tiny">{lastPrice(s, bars, x)?.toFixed(2) ?? '—'}</span>
              </button>
            ))}
          </div>
          <PracticeChart
            candles={candles}
            visible={candles.length}
            interval={s.interval as Interval}
            drawings={[]}
            tool="cursor"
            readOnly
            markers={markers}
            levels={pos ? { entry: pos.entryFill, stop: pos.stop, target: pos.target } : undefined}
            timeZone={session.timeZone}
            height={400}
          />
          <div className="mono tiny muted etf-chart-head">
            Bars up to {t ? fmtLocal(t, session, false) : '—'} only — future candles are hidden · earlier sessions shown for context
          </div>
        </section>
        <OrderTicket s={s} bars={bars} etf={etf} onPlace={(o) => commit(placeOrder(s, bars, etf, o))} />
      </div>

      <section className="glass pad etf-panel">
        <div className="mono-label">Open positions</div>
        {s.positions.length === 0 ? (
          <p className="small muted">No open positions.</p>
        ) : (
          s.positions.map((p) => <PositionRow key={p.symbol} s={s} bars={bars} p={p} onModify={(stop, target) => commit(modifyBracket(s, bars, p.symbol, stop, target))} onExit={() => commit(exitPosition(s, bars, p.symbol, 'Manual exit'))} />)
        )}
        <div className="mono-label" style={{ marginTop: 14 }}>
          Orders
        </div>
        {s.orders.length === 0 ? (
          <p className="small muted">No orders yet.</p>
        ) : (
          <div className="etf-orders">
            {[...s.orders].reverse().map((o) => (
              <div key={o.id} className={cx('etf-order', o.status)}>
                <span className="mono tiny">{fmtLocal(o.placedT, session, false)}</span>
                <span>
                  {o.purpose === 'exit' ? 'EXIT' : o.side === 'long' ? 'BUY' : 'SELL SHORT'} {o.qty} {o.symbol} · {o.type}
                  {o.limit ? ` @ ${o.limit}` : ''}
                </span>
                <span className="etf-status">{o.status}</span>
                {o.note && <span className="tiny muted">{o.note}</span>}
                {o.status === 'working' && (
                  <button className="btn btn-sm btn-ghost" onClick={() => commit(cancelOrder(s, bars, o.id))} aria-label="Cancel order">
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="glass pad etf-panel">
        <div className="mono-label">Session log & journal</div>
        <div className="etf-log">
          {[...s.events].reverse().slice(0, 40).map((e, i) => (
            <div key={i} className={cx('etf-log-row', e.kind)}>
              <span className="mono tiny">{fmtLocal(e.t, session, false)}</span>
              <span>{e.text}</span>
            </div>
          ))}
          {s.journal.map((j, i) => (
            <div key={`j${i}`} className="etf-log-row note">
              <span className="mono tiny">{fmtLocal(j.t, session, false)}</span>
              <span>📝 {j.text}</span>
            </div>
          ))}
        </div>
        <div className="row" style={{ gap: 8, marginTop: 8 }}>
          <input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Journal note — what you see, how you feel…" aria-label="Journal note" />
          <button
            className="btn btn-sm"
            disabled={!note.trim()}
            onClick={() => {
              commit({ ...s, journal: [...s.journal, { t, text: note.trim() }], updatedAt: Date.now() });
              setNote('');
            }}
          >
            <NotebookPen size={13} /> Add
          </button>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'pos' | 'neg' }) {
  return (
    <div className="glass etf-stat">
      <span className="mono-label">{label}</span>
      <b className={cx('mono', tone)}>{value}</b>
    </div>
  );
}

function OrderTicket({ s, bars, etf, onPlace }: { s: PaperSession; bars: DayBars; etf: EtfDef; onPlace: (o: OrderInput) => void }) {
  const [side, setSide] = useState<Side>('long');
  const [type, setType] = useState<'market' | 'limit'>('market');
  const [qty, setQty] = useState<number | null>(null);
  const [limit, setLimit] = useState<number | null>(null);
  const [stop, setStop] = useState<number | null>(null);
  const [target, setTarget] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const o: OrderInput = { symbol: etf.symbol, side, type, qty: qty ?? 0, limit, stop, target, reason };
  const chk = preTradeCheck(s, bars, etf, o);
  const px = lastPrice(s, bars, etf.symbol);
  return (
    <section className="glass pad etf-ticket">
      <div className="mono-label">Order ticket · {etf.symbol} · simulated</div>
      <div className="tiny muted">Last close {px?.toFixed(2) ?? '—'} (historical). Market orders fill at the next bar’s open.</div>
      <SegControl<Side> options={[{ value: 'long', label: 'Buy' }, ...(s.risk.allowShort ? [{ value: 'short' as Side, label: 'Sell short' }] : [])]} value={side} onChange={setSide} />
      <SegControl<'market' | 'limit'> options={[{ value: 'market', label: 'Market' }, { value: 'limit', label: 'Limit' }]} value={type} onChange={setType} />
      <div className="etf-grid two">
        <Field label="Quantity (units)">
          <NumberInput value={qty} onChange={setQty} />
        </Field>
        {type === 'limit' && (
          <Field label="Limit price">
            <NumberInput value={limit} onChange={setLimit} />
          </Field>
        )}
        <Field label="Stop-loss *">
          <NumberInput value={stop} onChange={setStop} />
        </Field>
        <Field label="Take-profit">
          <NumberInput value={target} onChange={setTarget} />
        </Field>
      </div>
      <Field label="Why this trade? *" hint="Written before entering — the setup, the trigger, the invalidation">
        <textarea className="textarea" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} />
      </Field>
      <div className="etf-pretrade">
        <span>Max size at this stop: <b className="mono">{chk.maxQty || '—'}</b></span>
        <span>Risk if stopped: <b className="mono">{chk.riskAmount ? fmtMoney(chk.riskAmount, s.exchange) : '—'}</b></span>
        <span>Planned R:R: <b className="mono">{chk.rr != null ? chk.rr.toFixed(2) : '—'}</b></span>
        {chk.maxQty > 0 && !qty && (
          <button type="button" className="text-btn" onClick={() => setQty(chk.maxQty)}>
            use max
          </button>
        )}
      </div>
      {!chk.ok && (qty || stop || reason) ? (
        <ul className="etf-errors">
          {chk.errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      ) : null}
      <button
        type="button"
        className="btn btn-primary"
        disabled={!chk.ok}
        onClick={() => {
          onPlace(o);
          setReason('');
          setQty(null);
        }}
      >
        Place simulated order
      </button>
      <p className="tiny muted" style={{ margin: 0 }}>
        Virtual money only. No broker is connected; nothing leaves this browser.
      </p>
    </section>
  );
}

function PositionRow({ s, bars, p, onModify, onExit }: { s: PaperSession; bars: DayBars; p: PaperSession['positions'][number]; onModify: (stop: number, target: number | null) => void; onExit: () => void }) {
  const [stop, setStop] = useState<number | null>(p.stop);
  const [target, setTarget] = useState<number | null>(p.target);
  const px = lastPrice(s, bars, p.symbol);
  const upl = px == null ? null : (px - p.entryFill) * p.qty * (p.side === 'long' ? 1 : -1);
  return (
    <div className="etf-pos">
      <b>
        {p.side === 'long' ? 'Long' : 'Short'} {p.qty} {p.symbol}
      </b>
      <span className="mono small">
        entry {p.entryFill.toFixed(2)} · last {px?.toFixed(2) ?? '—'} · <span className={upl != null && upl >= 0 ? 'pos' : 'neg'}>{fmtMoney(upl, s.exchange)}</span>
      </span>
      <div className="row wrap" style={{ gap: 6 }}>
        <Field label="Stop">
          <NumberInput value={stop} onChange={setStop} />
        </Field>
        <Field label="Target">
          <NumberInput value={target} onChange={setTarget} />
        </Field>
        <button className="btn btn-sm" disabled={stop == null} onClick={() => stop != null && onModify(stop, target)}>
          Update
        </button>
        <button className="btn btn-sm btn-ghost" onClick={onExit}>
          Exit at next open
        </button>
      </div>
    </div>
  );
}

// ─── Review & history ─────────────────────────────────────────────────────

function SessionReview({ s, onSave, onClose }: { s: PaperSession; onSave: (s: PaperSession) => void; onClose: () => void }) {
  const report = paperReport(s);
  const [logged, setLogged] = useState<Record<string, boolean>>({});
  const setReview = (id: string, patch: Partial<PaperSession['review'][string]>) =>
    onSave({ ...s, review: { ...s.review, [id]: { ...{ followed: true, mistakes: [] as string[], note: '' }, ...(s.review[id] as Partial<PaperSession['review'][string]> | undefined), ...patch } }, updatedAt: Date.now() });
  const logToJournal = (tradeId: string) => {
    const t = s.trades.find((x) => x.id === tradeId)!;
    const rv = s.review[tradeId];
    const base = blankEntry(s.day);
    const now = Date.now();
    const entry: JournalTradeEntry = {
      ...base,
      id: newId(),
      createdAt: now,
      updatedAt: now,
      market: t.symbol,
      timeframe: s.interval,
      setup: s.strategy === 'discretionary' ? 'Discretionary' : strategyById(s.strategy).name,
      direction: t.side,
      entry: +t.entryFill.toFixed(2),
      stop: +t.stop.toFixed(2),
      target: t.target != null ? +t.target.toFixed(2) : null,
      exit: +t.exitFill.toFixed(2),
      size: t.qty,
      why: t.reason,
      result: t.net > 0 ? 'success' : t.net < 0 ? 'fail' : 'breakeven',
      happened: `Paper trade (historical replay of ${s.day}): exit ${t.exitReason}; net ${t.net.toFixed(2)} after ${t.charges.toFixed(2)} charges.`,
      learned: rv?.note ?? '',
      mistakes: (rv?.mistakes ?? []) as MistakeKey[],
    };
    store.put(JOURNAL_COLLECTION, entry.id, entry);
    setLogged((l) => ({ ...l, [tradeId]: true }));
  };
  return (
    <section className="glass pad etf-panel">
      <div className="etf-head">
        <div className="etf-title">
          <FileText size={16} /> Session report
        </div>
        <button className="btn btn-sm btn-ghost" onClick={onClose}>
          Close
        </button>
      </div>
      {s.trades.length > 0 && (
        <>
          <div className="etf-sub">Self-review each trade — be honest; it feeds the report</div>
          {s.trades.map((t) => {
            const rv = s.review[t.id];
            return (
              <div key={t.id} className="etf-review">
                <div className="mono small">
                  {t.symbol} {t.side} {t.qty} · {t.exitReason} · <span className={t.net >= 0 ? 'pos' : 'neg'}>{fmtMoney(t.net, s.exchange)}</span>
                </div>
                <div className="tiny muted">Reason given: “{t.reason}”</div>
                <div className="row wrap" style={{ gap: 6 }}>
                  <SegControl<'yes' | 'no'> options={[{ value: 'yes', label: 'Followed my rules' }, { value: 'no', label: 'Broke a rule' }]} value={rv && !rv.followed ? 'no' : 'yes'} onChange={(v) => setReview(t.id, { followed: v === 'yes' })} />
                  <select className="select" style={{ width: 'auto' }} value="" onChange={(e) => e.target.value && setReview(t.id, { mistakes: [...new Set([...(rv?.mistakes ?? []), e.target.value])] })} aria-label="Tag a mistake">
                    <option value="">+ Tag a mistake</option>
                    {MISTAKES.map((m) => (
                      <option key={m.key} value={m.key}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                  {(rv?.mistakes ?? []).map((m) => (
                    <span key={m} className="badge">
                      {MISTAKES.find((x) => x.key === m)?.label ?? m}
                    </span>
                  ))}
                  <button className="btn btn-sm btn-ghost" disabled={logged[t.id]} onClick={() => logToJournal(t.id)}>
                    <NotebookPen size={12} /> {logged[t.id] ? 'Logged' : 'Log to Trading Journal'}
                  </button>
                </div>
                <input className="input" placeholder="Lesson from this trade" value={rv?.note ?? ''} onChange={(e) => setReview(t.id, { note: e.target.value })} />
              </div>
            );
          })}
        </>
      )}
      <ReportView report={report} />
    </section>
  );
}

function SessionHistory({ sessions, onOpen }: { sessions: PaperSession[]; onOpen: (id: string) => void }) {
  if (!sessions.length) return null;
  return (
    <section className="glass pad etf-panel">
      <div className="mono-label">Past paper sessions · compare several before drawing conclusions</div>
      <div className="etf-runs">
        {[...sessions].sort((a, b) => (b.endedAt ?? 0) - (a.endedAt ?? 0)).map((s) => {
          const net = realized(s);
          return (
            <button key={s.id} type="button" className="etf-run btnlike" onClick={() => onOpen(s.id)}>
              <div>
                <b>
                  {s.day} · {s.symbols.join(', ')} · {s.interval}
                </b>
                <div className="tiny muted">{s.strategy === 'discretionary' ? 'Discretionary' : strategyById(s.strategy).name} · {s.trades.length} trades{s.dayLocked ? ' · loss limit hit' : ''}</div>
              </div>
              <span className={cx('mono small', net >= 0 ? 'pos' : 'neg')}>{fmtMoney(net, s.exchange)}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
