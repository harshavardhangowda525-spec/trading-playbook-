// Historical backtester for the ETF strategy templates.
//
// Look-ahead safeguards:
//  • strategies decide at the CLOSE of bar i using bars 0..i only;
//  • entries fill at the OPEN of bar i+1 (plus spread & slippage);
//  • rule exits decided at a close also fill at the next open;
//  • if a bar touches both stop and target, the stop is assumed first;
//  • a bar that opens beyond the stop fills at the open, not the stop;
//  • positions are squared off before the session ends; nothing is held overnight.
// No candle is ever created, interpolated or altered.

import type { Candle, Interval } from '../market';
import { SESSIONS, localTime } from './calendar';
import { fillCharges, fillPrice, roundTripPct, type CostModel } from './costs';
import { computeMetrics, MIN_TRADES, type ExitReason, type Metrics, type SimTrade } from './metrics';
import { prepareBars, fingerprint, type DataQuality } from './quality';
import { plannedRR, positionSize, type RiskConfig } from './risk';
import { buildCtx, regimeMix, strategyById, WARMUP, type Ctx, type Regime, type Side, type Signal, type StrategyDef, type StrategyId } from './strategies';
import type { Exchange } from './universe';

export const ENGINE_VERSION = 'etf-bt-1';

export interface BacktestConfig {
  symbol: string;
  exchange: Exchange;
  interval: Interval;
  intervalSec: number;
  strategy: StrategyId;
  params: Record<string, number>;
  risk: RiskConfig;
  costs: CostModel;
  sttApplies: boolean;
  /** Share of trading days (oldest first) used for training; the rest is out-of-sample. */
  trainPct: number;
  /** Use this definition instead of a built-in template (tests, custom rules). */
  strategyDef?: StrategyDef;
  /** Optional local-date bounds (YYYY-MM-DD, inclusive). */
  from?: string;
  to?: string;
}

export interface MissedSignal {
  t: number;
  side: Side;
  reason: string;
}

export interface BacktestResult {
  engine: string;
  fingerprint: string;
  trades: SimTrade[];
  missed: MissedSignal[];
  quality: DataQuality;
  metrics: { all: Metrics; train: Metrics; test: Metrics };
  /** First out-of-sample trading day. */
  splitDay: string | null;
  trainDays: number;
  testDays: number;
  regimes: Record<Regime, number>;
  costPct: number;
  warnings: string[];
  lockedDays: string[];
}

interface Open {
  side: Side;
  qty: number;
  entryI: number;
  entryT: number;
  entryRef: number;
  entryFill: number;
  stop: number;
  target: number | null;
  plannedRR: number | null;
  riskAmount: number;
  signal: Signal;
  signalT: number;
}

let seq = 0;
const tradeId = (t: number) => `bt-${t}-${++seq}`;

export function runBacktest(raw: Candle[], cfg: BacktestConfig): BacktestResult {
  const session = SESSIONS[cfg.exchange];
  const prepared = prepareBars(raw, cfg.intervalSec, session);
  let bars = prepared.bars;
  if (cfg.from || cfg.to) {
    bars = bars.filter((k) => {
      const d = localTime(k.t, session.timeZone).day;
      return (!cfg.from || d >= cfg.from) && (!cfg.to || d <= cfg.to);
    });
  }
  const quality = cfg.from || cfg.to ? prepareBars(bars, cfg.intervalSec, session).quality : prepared.quality;
  const midPrice = bars.length ? bars[Math.floor(bars.length / 2)].c : 0;
  const typicalQty = midPrice > 0 ? Math.max(1, Math.floor((cfg.risk.capital * Math.min(cfg.risk.maxPositionPct, 50)) / 100 / midPrice)) : 1;
  const costPct = roundTripPct(midPrice, typicalQty, cfg.costs, cfg.sttApplies);
  const ctx = buildCtx(bars, session, costPct);
  const strat = cfg.strategyDef ?? strategyById(cfg.strategy);
  const days = quality.days;
  const splitIdx = Math.max(1, Math.min(days.length - 1, Math.round((days.length * cfg.trainPct) / 100)));
  const splitDay = days.length > 1 ? days[splitIdx] : null;
  const segment = (d: string): 'train' | 'test' => (splitDay && d >= splitDay ? 'test' : 'train');

  const trades: SimTrade[] = [];
  const missed: MissedSignal[] = [];
  const lockedDays: string[] = [];
  let pos: Open | null = null;
  let pending: { sig: Signal; i: number } | null = null;
  let pendingExit: string | null = null;
  let curDay = '';
  let tradesToday = 0;
  let netToday = 0;
  let locked = false;
  const dailyLimit = (cfg.risk.capital * cfg.risk.dailyLossPct) / 100;
  const entryFrom = session.open + cfg.risk.skipOpenMin;
  const entryUntil = session.close - cfg.risk.lastEntryBeforeCloseMin;
  const squareOffAt = session.close - cfg.risk.squareOffBeforeCloseMin;
  const barMin = cfg.intervalSec / 60;

  const close = (i: number, ref: number, fill: number, reason: ExitReason, note?: string) => {
    const p = pos!;
    const k = bars[i];
    const dir = p.side === 'long' ? 1 : -1;
    const gross = (fill - p.entryFill) * p.qty * dir;
    const buyFill = p.side === 'long' ? p.entryFill : fill;
    const sellFill = p.side === 'long' ? fill : p.entryFill;
    const charges = fillCharges('buy', buyFill, p.qty, cfg.costs, cfg.sttApplies).total + fillCharges('sell', sellFill, p.qty, cfg.costs, cfg.sttApplies).total;
    const friction = (Math.abs(p.entryFill - p.entryRef) + Math.abs(fill - ref)) * p.qty;
    const net = gross - charges;
    const day = ctx.day[i];
    trades.push({
      id: tradeId(k.t),
      strategy: cfg.strategy,
      symbol: cfg.symbol,
      side: p.side,
      qty: p.qty,
      day,
      signalT: p.signalT,
      entryT: p.entryT,
      entryRef: p.entryRef,
      entryFill: p.entryFill,
      stop: p.stop,
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
      reason: p.signal.reason,
      segment: segment(day),
    });
    netToday += net;
    pos = null;
    pendingExit = null;
    if (!locked && netToday <= -dailyLimit) {
      locked = true;
      lockedDays.push(day);
    }
  };

  for (let i = 0; i < bars.length; i++) {
    const k = bars[i];
    const d = ctx.day[i];
    if (d !== curDay) {
      curDay = d;
      tradesToday = 0;
      netToday = 0;
      locked = false;
    }
    const lastOfDay = i === bars.length - 1 || ctx.day[i + 1] !== d;

    // 1) Fill a pending entry at this bar's open.
    if (pending && !pos) {
      const { sig } = pending;
      const ref = k.o;
      const long = sig.side === 'long';
      if (ctx.day[pending.i] !== d) {
        missed.push({ t: bars[pending.i].t, side: sig.side, reason: 'Signal on the last bar of the session — no next bar to fill' });
      } else if ((long && ref <= sig.stop) || (!long && ref >= sig.stop)) {
        missed.push({ t: k.t, side: sig.side, reason: 'Opened beyond the stop — trade skipped' });
      } else {
        const target = sig.target ?? (sig.rr != null ? ref + (long ? 1 : -1) * sig.rr * Math.abs(ref - sig.stop) : null);
        const rr = plannedRR(sig.side, ref, sig.stop, target);
        const size = positionSize(sig.side, ref, sig.stop, cfg.risk, cfg.costs, cfg.sttApplies);
        if (target != null && rr != null && rr < cfg.risk.minRR) {
          missed.push({ t: k.t, side: sig.side, reason: `Planned R:R ${rr.toFixed(2)} below minimum ${cfg.risk.minRR}` });
        } else if (target != null && ((long && target <= ref) || (!long && target >= ref))) {
          missed.push({ t: k.t, side: sig.side, reason: 'Target already passed at the open' });
        } else if (size.qty < 1) {
          missed.push({ t: k.t, side: sig.side, reason: size.rejected ?? 'Position size is zero' });
        } else {
          pos = {
            side: sig.side,
            qty: size.qty,
            entryI: i,
            entryT: k.t,
            entryRef: ref,
            entryFill: fillPrice(long ? 'buy' : 'sell', ref, cfg.costs),
            stop: sig.stop,
            target,
            plannedRR: rr,
            riskAmount: size.riskAmount,
            signal: sig,
            signalT: bars[pending.i].t,
          };
          tradesToday++;
        }
      }
      pending = null;
    }

    // 2) A rule exit decided at the previous close fills at this open.
    if (pos && pendingExit) {
      const p = pos as Open;
      close(i, k.o, fillPrice(p.side === 'long' ? 'sell' : 'buy', k.o, cfg.costs), 'rule', pendingExit);
    }

    // 3) Stops and targets inside this bar (conservative ordering).
    if (pos) {
      const p = pos as Open;
      const long = p.side === 'long';
      const exitSide = long ? 'sell' : 'buy';
      const gapped = p.entryI !== i && (long ? k.o <= p.stop : k.o >= p.stop);
      const stopHit = long ? k.l <= p.stop : k.h >= p.stop;
      const targetHit = p.target != null && (long ? k.h > p.target : k.l < p.target);
      if (gapped) close(i, k.o, fillPrice(exitSide, k.o, cfg.costs), 'gap-stop', 'Opened through the stop — filled at the open');
      else if (stopHit) close(i, p.stop, fillPrice(exitSide, p.stop, cfg.costs), 'stop', targetHit ? 'Stop and target in the same bar — stop assumed first' : undefined);
      else if (targetHit) close(i, p.target!, p.target!, 'target');
    }

    // 4) Square off before the close (or when the day's data runs out).
    const endMin = ctx.min[i] + barMin;
    if (pos && (endMin >= squareOffAt || lastOfDay)) {
      const p = pos as Open;
      close(i, k.c, fillPrice(p.side === 'long' ? 'sell' : 'buy', k.c, cfg.costs), endMin >= squareOffAt ? 'square-off' : 'data-end');
    }

    // 5) Rule-based exit decided at this close → next open.
    if (pos && strat.exit && !lastOfDay) {
      const p = pos as Open;
      const why = strat.exit(ctx, i, p.side, cfg.params, p.signal.meta);
      if (why) pendingExit = why;
    }

    // 6) New entry signal at this close → next open.
    if (!pos && !pending && i >= WARMUP && !lastOfDay) {
      if (ctx.min[i] + barMin < entryFrom || endMin > entryUntil) continue;
      const sig = strat.signal(ctx, i, cfg.params, cfg.risk.allowShort);
      if (!sig) continue;
      if (locked) missed.push({ t: k.t, side: sig.side, reason: 'Daily loss limit reached — no new trades today' });
      else if (tradesToday >= cfg.risk.maxTrades) missed.push({ t: k.t, side: sig.side, reason: `Max ${cfg.risk.maxTrades} trades per day reached` });
      else pending = { sig, i };
    }
  }

  const train = trades.filter((t) => t.segment === 'train');
  const test = trades.filter((t) => t.segment === 'test');
  const metrics = {
    all: computeMetrics(trades, cfg.risk.capital),
    train: computeMetrics(train, cfg.risk.capital),
    test: computeMetrics(test, cfg.risk.capital),
  };
  return {
    engine: ENGINE_VERSION,
    fingerprint: fingerprint(bars),
    trades,
    missed,
    quality,
    metrics,
    splitDay,
    trainDays: splitDay ? days.filter((d) => d < splitDay).length : days.length,
    testDays: splitDay ? days.filter((d) => d >= splitDay).length : 0,
    regimes: regimeMix(ctx as Ctx),
    costPct,
    warnings: warningsFor(metrics, quality, costPct),
    lockedDays,
  };
}

export function warningsFor(m: BacktestResult['metrics'], q: DataQuality, costPct: number): string[] {
  const w: string[] = [];
  if (q.sessions < 20) w.push(`Only ${q.sessions} trading sessions of data — too little history to judge any strategy.`);
  if (q.coverage < 0.95) w.push(`${Math.round((1 - q.coverage) * 100)}% of expected bars are missing. Gaps were not filled; results may be distorted.`);
  if (q.zeroVolumeBars > 0.05 * q.bars) w.push(`${q.zeroVolumeBars} bars have zero volume — this ETF may be too illiquid for intraday simulation.`);
  if (m.all.trades < MIN_TRADES) w.push(`Only ${m.all.trades} trades. Fewer than ${MIN_TRADES} is too small a sample — treat every number here as anecdotal.`);
  if (m.train.trades && m.test.trades < 10) w.push(`Only ${m.test.trades} out-of-sample trades — the out-of-sample check is weak.`);
  if (m.train.net > 0 && m.test.trades > 0 && m.test.net <= 0) w.push('Profitable in training but not out-of-sample: a classic sign of overfitting or a regime change.');
  if (m.train.profitFactor != null && m.test.profitFactor != null && m.test.profitFactor < m.train.profitFactor * 0.5)
    w.push('Out-of-sample profit factor is less than half the training one — the edge did not hold up.');
  const grossWins = m.all.gross > 0 ? m.all.gross : 0;
  if (grossWins > 0 && m.all.costs > 0.5 * grossWins) w.push(`Costs and slippage were ${Math.round((m.all.costs / grossWins) * 100)}% of gross P&L.`);
  if (costPct > 0.15) w.push(`Estimated round-trip cost is ${costPct.toFixed(2)}% of price — small intraday moves cannot cover it.`);
  return w;
}
