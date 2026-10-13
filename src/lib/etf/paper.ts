// Paper-trading simulator — virtual money only, replaying a real historical
// session bar by bar. There is no broker connection and no code path that can
// send an order anywhere: orders are plain objects resolved against stored
// historical candles.
//
// Fill rules (conservative):
//  • orders are placed after the latest visible bar has closed;
//  • market orders fill at the NEXT bar's open (+ spread & slippage);
//  • limit orders fill only if price trades THROUGH the limit (touching is not enough);
//  • protective stops fill at the stop (− slippage), or at the open if the bar gaps through;
//  • stop and target in the same bar → stop first;
//  • everything is squared off before the session ends.

import type { Candle } from '../market';
import { SESSIONS, localTime } from './calendar';
import { fillCharges, fillPrice, type CostModel } from './costs';
import type { ExitReason, SimTrade } from './metrics';
import { plannedRR, positionSize, type RiskConfig } from './risk';
import type { Side, StrategyId } from './strategies';
import type { EtfDef, Exchange } from './universe';

export type OrderType = 'market' | 'limit';
export type OrderStatus = 'working' | 'filled' | 'cancelled' | 'rejected' | 'expired';

export interface PaperOrder {
  id: string;
  symbol: string;
  purpose: 'entry' | 'exit';
  side: Side; // position side the order opens/closes
  type: OrderType;
  qty: number;
  limit: number | null;
  stop: number | null;
  target: number | null;
  reason: string;
  /** Time of the last visible bar when the order was placed. */
  placedT: number;
  status: OrderStatus;
  note?: string;
  fillT?: number;
  fillPrice?: number;
}

export interface PaperPosition {
  symbol: string;
  side: Side;
  qty: number;
  entryT: number;
  entryRef: number;
  entryFill: number;
  stop: number;
  target: number | null;
  plannedRR: number | null;
  riskAmount: number;
  reason: string;
  /** Initial stop, to detect a widened stop. */
  initialStop: number;
}

export interface PaperEvent {
  t: number;
  kind: 'info' | 'fill' | 'reject' | 'risk' | 'violation';
  text: string;
}

export interface PaperSession {
  id: string;
  day: string;
  exchange: Exchange;
  interval: string;
  intervalSec: number;
  symbols: string[];
  /** Data source per symbol (dataset id or provider ref), recorded for reproducibility. */
  sources: Record<string, string>;
  strategy: StrategyId | 'discretionary';
  plan: string;
  /** Index into the merged timeline of the latest visible bar. */
  cursor: number;
  startCash: number;
  cash: number;
  positions: PaperPosition[];
  orders: PaperOrder[];
  trades: SimTrade[];
  events: PaperEvent[];
  risk: RiskConfig;
  costs: CostModel;
  dayLocked: boolean;
  status: 'active' | 'ended';
  journal: { t: number; text: string }[];
  /** Learner's self-review per trade id. */
  review: Record<string, { followed: boolean; mistakes: string[]; note: string }>;
  createdAt: number;
  updatedAt: number;
  endedAt?: number;
}

export type DayBars = Record<string, Candle[]>;

let seq = 0;
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${(++seq).toString(36)}`;

/** Sorted unique bar times across the watchlist for the session day. */
export function timeline(bars: DayBars): number[] {
  return [...new Set(Object.values(bars).flatMap((xs) => xs.map((k) => k.t)))].sort((a, b) => a - b);
}

export function nowT(s: PaperSession, bars: DayBars): number {
  return timeline(bars)[s.cursor] ?? 0;
}

/** Bars of a symbol visible at the cursor (never later ones). */
export function visibleBars(s: PaperSession, bars: DayBars, symbol: string): Candle[] {
  const t = nowT(s, bars);
  return (bars[symbol] ?? []).filter((k) => k.t <= t);
}

export function lastPrice(s: PaperSession, bars: DayBars, symbol: string): number | null {
  const v = visibleBars(s, bars, symbol);
  return v.length ? v[v.length - 1].c : null;
}

export function createSession(o: {
  day: string;
  exchange: Exchange;
  interval: string;
  intervalSec: number;
  symbols: string[];
  sources: Record<string, string>;
  strategy: PaperSession['strategy'];
  plan: string;
  cash: number;
  risk: RiskConfig;
  costs: CostModel;
}): PaperSession {
  const now = Date.now();
  return {
    id: uid('ps'),
    ...o,
    cursor: 0,
    startCash: o.cash,
    cash: o.cash,
    positions: [],
    orders: [],
    trades: [],
    events: [],
    dayLocked: false,
    status: 'active',
    journal: [],
    review: {},
    createdAt: now,
    updatedAt: now,
  };
}

// ─── Risk & accounting helpers ─────────────────────────────────────────

const dir = (s: Side) => (s === 'long' ? 1 : -1);

export function unrealized(s: PaperSession, bars: DayBars): number {
  return s.positions.reduce((sum, p) => {
    const px = lastPrice(s, bars, p.symbol);
    return px == null ? sum : sum + (px - p.entryFill) * p.qty * dir(p.side);
  }, 0);
}

export const realized = (s: PaperSession) => s.trades.reduce((a, t) => a + t.net, 0);

/** Position value already committed (no leverage: entries must fit in cash). */
const committed = (s: PaperSession) => s.positions.reduce((a, p) => a + p.entryFill * p.qty, 0);

export interface OrderInput {
  symbol: string;
  side: Side;
  type: OrderType;
  qty: number;
  limit?: number | null;
  stop: number | null;
  target?: number | null;
  reason: string;
}

export interface PreTrade {
  ok: boolean;
  errors: string[];
  maxQty: number;
  riskAmount: number;
  rr: number | null;
  refPrice: number | null;
}

/** Everything the order ticket shows before submitting: limits, max size, R:R. */
export function preTradeCheck(s: PaperSession, bars: DayBars, etf: EtfDef, o: OrderInput): PreTrade {
  const errors: string[] = [];
  const ref = o.type === 'limit' && o.limit ? o.limit : lastPrice(s, bars, o.symbol);
  const t = nowT(s, bars);
  const session = SESSIONS[s.exchange];
  const lt = localTime(t, session.timeZone);
  const tradesToday = s.trades.length + s.positions.length;
  if (s.status !== 'active') errors.push('Session has ended.');
  if (s.dayLocked) errors.push('Daily loss limit reached — no new trades this session (cooldown).');
  if (!o.reason.trim() || o.reason.trim().length < 8) errors.push('Write the reason for this trade before entering (at least a short sentence).');
  if (o.side === 'short' && !s.risk.allowShort) errors.push('Short selling is switched off in risk settings.');
  if (s.positions.some((p) => p.symbol === o.symbol)) errors.push(`Already holding ${o.symbol} — one position per ETF.`);
  if (tradesToday >= s.risk.maxTrades) errors.push(`Max ${s.risk.maxTrades} trades per session reached.`);
  if (lt.min < session.open + s.risk.skipOpenMin) errors.push(`No entries in the first ${s.risk.skipOpenMin} minutes.`);
  if (lt.min + s.intervalSec / 60 > session.close - s.risk.lastEntryBeforeCloseMin) errors.push(`No new entries in the last ${s.risk.lastEntryBeforeCloseMin} minutes.`);
  if (!(o.qty >= 1) || !Number.isInteger(o.qty)) errors.push('Quantity must be a whole number of units.');
  if (o.type === 'limit' && !(o.limit && o.limit > 0)) errors.push('Enter a limit price.');
  if (o.stop == null || !(o.stop > 0)) errors.push('A stop-loss is required for every entry.');
  let maxQty = 0;
  let riskAmount = 0;
  let rr: number | null = null;
  if (ref && o.stop) {
    const size = positionSize(o.side, ref, o.stop, s.risk, s.costs, etf.stt);
    if (size.rejected) errors.push(size.rejected);
    maxQty = size.qty;
    const perUnit = size.perUnitRisk;
    riskAmount = perUnit * o.qty + (size.qty ? (size.riskAmount - perUnit * size.qty) * (o.qty / size.qty) : 0);
    if (o.qty > maxQty) errors.push(`Quantity exceeds the risk budget — max ${maxQty} units at this stop.`);
    rr = plannedRR(o.side, ref, o.stop, o.target ?? null);
    if (rr != null && rr < s.risk.minRR) errors.push(`Planned R:R ${rr.toFixed(2)} is below your minimum ${s.risk.minRR}.`);
    if (o.target != null && rr != null && rr <= 0) errors.push('Target is on the wrong side of the entry.');
    if (ref * o.qty > s.cash + realized(s) - committed(s)) errors.push('Not enough virtual cash for this position.');
  }
  return { ok: errors.length === 0, errors, maxQty, riskAmount, rr, refPrice: ref ?? null };
}

const touch = (s: PaperSession): PaperSession => ({ ...s, updatedAt: Date.now() });

export function placeOrder(s: PaperSession, bars: DayBars, etf: EtfDef, o: OrderInput): PaperSession {
  const t = nowT(s, bars);
  const check = preTradeCheck(s, bars, etf, o);
  const order: PaperOrder = {
    id: uid('po'),
    symbol: o.symbol,
    purpose: 'entry',
    side: o.side,
    type: o.type,
    qty: o.qty,
    limit: o.type === 'limit' ? (o.limit ?? null) : null,
    stop: o.stop,
    target: o.target ?? null,
    reason: o.reason.trim(),
    placedT: t,
    status: check.ok ? 'working' : 'rejected',
    note: check.ok ? undefined : check.errors.join(' '),
  };
  const events = [...s.events, { t, kind: check.ok ? ('info' as const) : ('reject' as const), text: check.ok ? `${o.type.toUpperCase()} ${o.side} ${o.qty} ${o.symbol} placed` : `Order rejected: ${check.errors.join(' ')}` }];
  return touch({ ...s, orders: [...s.orders, order], events });
}

export function cancelOrder(s: PaperSession, bars: DayBars, id: string): PaperSession {
  const t = nowT(s, bars);
  return touch({
    ...s,
    orders: s.orders.map((o) => (o.id === id && o.status === 'working' ? { ...o, status: 'cancelled' } : o)),
    events: [...s.events, { t, kind: 'info', text: 'Order cancelled' }],
  });
}

/** Close a position at the next bar's open (market). */
export function exitPosition(s: PaperSession, bars: DayBars, symbol: string, reason: string): PaperSession {
  const p = s.positions.find((x) => x.symbol === symbol);
  if (!p || s.orders.some((o) => o.status === 'working' && o.purpose === 'exit' && o.symbol === symbol)) return s;
  const t = nowT(s, bars);
  const order: PaperOrder = { id: uid('po'), symbol, purpose: 'exit', side: p.side, type: 'market', qty: p.qty, limit: null, stop: null, target: null, reason, placedT: t, status: 'working' };
  return touch({ ...s, orders: [...s.orders, order], events: [...s.events, { t, kind: 'info', text: `Exit ${symbol} at next open: ${reason}` }] });
}

/** Move a protective stop or target. Widening the stop is allowed but logged as a rule violation. */
export function modifyBracket(s: PaperSession, bars: DayBars, symbol: string, stop: number, target: number | null): PaperSession {
  const t = nowT(s, bars);
  const events = [...s.events];
  const positions = s.positions.map((p) => {
    if (p.symbol !== symbol) return p;
    const px = lastPrice(s, bars, symbol) ?? p.entryFill;
    if ((p.side === 'long' && stop >= px) || (p.side === 'short' && stop <= px)) {
      events.push({ t, kind: 'reject', text: 'Stop must stay on the losing side of the current price.' });
      return p;
    }
    const widened = p.side === 'long' ? stop < p.stop : stop > p.stop;
    if (widened) events.push({ t, kind: 'violation', text: `Stop widened on ${symbol} from ${p.stop.toFixed(2)} to ${stop.toFixed(2)} — risk increased after entry.` });
    else events.push({ t, kind: 'info', text: `Bracket updated on ${symbol}` });
    return { ...p, stop, target };
  });
  return touch({ ...s, positions, events });
}

// ─── Advancing time ───────────────────────────────────────────────────

function closePosition(s: PaperSession, p: PaperPosition, k: Candle, ref: number, fill: number, reason: ExitReason, note?: string): PaperSession {
  const etfStt = (s as PaperSession & { _stt?: Record<string, boolean> })._stt?.[p.symbol] ?? true;
  const gross = (fill - p.entryFill) * p.qty * dir(p.side);
  const buyFill = p.side === 'long' ? p.entryFill : fill;
  const sellFill = p.side === 'long' ? fill : p.entryFill;
  const charges = fillCharges('buy', buyFill, p.qty, s.costs, etfStt).total + fillCharges('sell', sellFill, p.qty, s.costs, etfStt).total;
  const friction = (Math.abs(p.entryFill - p.entryRef) + Math.abs(fill - ref)) * p.qty;
  const net = gross - charges;
  const trade: SimTrade = {
    id: uid('pt'),
    strategy: s.strategy === 'discretionary' ? 'manual' : s.strategy,
    symbol: p.symbol,
    side: p.side,
    qty: p.qty,
    day: s.day,
    signalT: p.entryT,
    entryT: p.entryT,
    entryRef: p.entryRef,
    entryFill: p.entryFill,
    stop: p.initialStop,
    target: p.target,
    exitT: k.t,
    exitRef: ref,
    exitFill: fill,
    exitReason: reason,
    exitNote: note,
    gross,
    charges,
    friction,
    net,
    plannedRR: p.plannedRR,
    r: p.riskAmount > 0 ? net / p.riskAmount : 0,
    reason: p.reason,
  };
  let next: PaperSession = {
    ...s,
    positions: s.positions.filter((x) => x !== p),
    trades: [...s.trades, trade],
    cash: s.cash + net,
    events: [...s.events, { t: k.t, kind: 'fill', text: `${p.symbol} closed (${reason}${note ? ` — ${note}` : ''}) · net ${net.toFixed(2)}` }],
  };
  const dayNet = realized(next);
  const limit = (s.risk.capital * s.risk.dailyLossPct) / 100;
  if (!next.dayLocked && dayNet <= -limit) {
    next = {
      ...next,
      dayLocked: true,
      orders: next.orders.map((o) => (o.status === 'working' && o.purpose === 'entry' ? { ...o, status: 'cancelled', note: 'Cancelled — daily loss limit' } : o)),
      events: [...next.events, { t: k.t, kind: 'risk', text: `Daily loss limit (${s.risk.dailyLossPct}% = ${limit.toFixed(0)}) reached. New trades are blocked and a ${s.risk.cooldownMin}-minute cooldown starts.` }],
    };
  }
  return next;
}

/** Process one bar for one symbol: fills, stops/targets, square-off. */
function processBar(s: PaperSession, symbol: string, k: Candle, isLastOfDay: boolean): PaperSession {
  const session = SESSIONS[s.exchange];
  // Exit orders first (market → this open).
  for (const o of s.orders.filter((x) => x.status === 'working' && x.purpose === 'exit' && x.symbol === symbol && x.placedT < k.t)) {
    const p = s.positions.find((x) => x.symbol === symbol);
    s = { ...s, orders: s.orders.map((x) => (x.id === o.id ? { ...x, status: p ? 'filled' : 'cancelled', fillT: k.t, fillPrice: k.o } : x)) };
    if (p) s = closePosition(s, p, k, k.o, fillPrice(p.side === 'long' ? 'sell' : 'buy', k.o, s.costs), 'manual', o.reason);
  }
  // Entry orders.
  for (const o of s.orders.filter((x) => x.status === 'working' && x.purpose === 'entry' && x.symbol === symbol && x.placedT < k.t)) {
    const long = o.side === 'long';
    let ref: number | null = null;
    let fill: number | null = null;
    if (o.type === 'market') {
      ref = k.o;
      fill = fillPrice(long ? 'buy' : 'sell', k.o, s.costs);
    } else if (o.limit != null) {
      const through = long ? k.l < o.limit : k.h > o.limit;
      if (through) {
        ref = long ? Math.min(k.o, o.limit) : Math.max(k.o, o.limit);
        fill = long ? Math.min(fillPrice('buy', ref, s.costs, false), o.limit) : Math.max(fillPrice('sell', ref, s.costs, false), o.limit);
      }
    }
    if (ref == null || fill == null) continue;
    const pos: PaperPosition = {
      symbol,
      side: o.side,
      qty: o.qty,
      entryT: k.t,
      entryRef: ref,
      entryFill: fill,
      stop: o.stop!,
      initialStop: o.stop!,
      target: o.target,
      plannedRR: plannedRR(o.side, ref, o.stop!, o.target),
      riskAmount: Math.abs(fill - o.stop!) * o.qty,
      reason: o.reason,
    };
    s = {
      ...s,
      positions: [...s.positions, pos],
      orders: s.orders.map((x) => (x.id === o.id ? { ...x, status: 'filled', fillT: k.t, fillPrice: fill! } : x)),
      events: [...s.events, { t: k.t, kind: 'fill', text: `${o.side === 'long' ? 'Bought' : 'Sold short'} ${o.qty} ${symbol} at ${fill.toFixed(2)}` }],
    };
  }
  // Protective stop / target.
  const p = s.positions.find((x) => x.symbol === symbol);
  if (p) {
    const long = p.side === 'long';
    const exitSide = long ? 'sell' : 'buy';
    const gapped = long ? k.o <= p.stop : k.o >= p.stop;
    const stopHit = long ? k.l <= p.stop : k.h >= p.stop;
    const targetHit = p.target != null && (long ? k.h > p.target : k.l < p.target);
    if (gapped) s = closePosition(s, p, k, k.o, fillPrice(exitSide, k.o, s.costs), 'gap-stop', 'Opened through the stop — filled at the open');
    else if (stopHit) s = closePosition(s, p, k, p.stop, fillPrice(exitSide, p.stop, s.costs), 'stop', targetHit ? 'Stop and target in the same bar — stop assumed first' : undefined);
    else if (targetHit) s = closePosition(s, p, k, p.target!, p.target!, 'target');
  }
  // Square-off.
  const lt = localTime(k.t, session.timeZone);
  const endMin = lt.min + s.intervalSec / 60;
  const q = s.positions.find((x) => x.symbol === symbol);
  if (q && (endMin >= session.close - s.risk.squareOffBeforeCloseMin || isLastOfDay)) {
    s = closePosition(s, q, k, k.c, fillPrice(q.side === 'long' ? 'sell' : 'buy', k.c, s.costs), isLastOfDay && endMin < session.close - s.risk.squareOffBeforeCloseMin ? 'data-end' : 'square-off');
  }
  return s;
}

/** Reveal the next `n` bars, resolving orders as each one closes. */
export function advance(s: PaperSession, bars: DayBars, etfs: EtfDef[], n = 1): PaperSession {
  if (s.status !== 'active') return s;
  const tl = timeline(bars);
  const stt = Object.fromEntries(etfs.map((e) => [e.symbol, e.stt]));
  let cur: PaperSession = { ...s, _stt: stt } as PaperSession;
  for (let step = 0; step < n && cur.cursor < tl.length - 1; step++) {
    const j = cur.cursor + 1;
    const t = tl[j];
    for (const sym of cur.symbols) {
      const xs = bars[sym] ?? [];
      const idx = xs.findIndex((k) => k.t === t);
      if (idx < 0) continue;
      cur = processBar(cur, sym, xs[idx], idx === xs.length - 1);
    }
    cur = { ...cur, cursor: j };
  }
  if (cur.cursor >= tl.length - 1) cur = endSession(cur, bars);
  const { _stt, ...clean } = cur as PaperSession & { _stt?: unknown };
  void _stt;
  return touch(clean as PaperSession);
}

/** End the session: square off at the latest visible close and expire working orders. */
export function endSession(s: PaperSession, bars: DayBars): PaperSession {
  if (s.status === 'ended') return s;
  let cur = s;
  for (const p of [...cur.positions]) {
    const v = visibleBars(cur, bars, p.symbol);
    const k = v[v.length - 1];
    if (k) cur = closePosition(cur, p, k, k.c, fillPrice(p.side === 'long' ? 'sell' : 'buy', k.c, cur.costs), 'square-off', 'Session ended');
  }
  return touch({
    ...cur,
    status: 'ended',
    endedAt: Date.now(),
    orders: cur.orders.map((o) => (o.status === 'working' ? { ...o, status: 'expired' } : o)),
    events: [...cur.events, { t: nowT(cur, bars), kind: 'info', text: 'Session ended' }],
  });
}
