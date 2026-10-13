// Performance metrics — pure functions over simulated trades, independently
// testable. Win/loss is judged on NET P&L (after all costs).

import type { Side, StrategyId } from './strategies';

export type ExitReason = 'stop' | 'gap-stop' | 'target' | 'rule' | 'square-off' | 'data-end' | 'manual';

export interface SimTrade {
  id: string;
  strategy: StrategyId | 'manual';
  symbol: string;
  side: Side;
  qty: number;
  day: string;
  /** Bar whose close produced the signal (UTC seconds). */
  signalT: number;
  entryT: number;
  /** Reference price before spread/slippage (bar open, or limit price). */
  entryRef: number;
  entryFill: number;
  stop: number;
  target: number | null;
  exitT: number;
  exitRef: number;
  exitFill: number;
  exitReason: ExitReason;
  exitNote?: string;
  /** P&L at the fill prices, before charges. */
  gross: number;
  /** Brokerage, taxes and exchange fees. */
  charges: number;
  /** Spread + slippage paid versus the reference prices. */
  friction: number;
  net: number;
  /** Planned reward : risk at entry (null when no target). */
  plannedRR: number | null;
  /** Net result in units of initial risk. */
  r: number;
  reason: string;
  segment?: 'train' | 'test';
}

export interface Metrics {
  trades: number;
  wins: number;
  losses: number;
  winRate: number | null;
  gross: number;
  net: number;
  charges: number;
  friction: number;
  costs: number;
  profitFactor: number | null;
  maxDrawdown: number;
  maxDrawdownPct: number;
  avgWin: number | null;
  avgLoss: number | null;
  expectancy: number | null;
  avgPlannedRR: number | null;
  avgR: number | null;
  largestWin: number | null;
  largestLoss: number | null;
  maxConsecLosses: number;
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const mean = (xs: number[]) => (xs.length ? sum(xs) / xs.length : null);

export function computeMetrics(trades: SimTrade[], capital: number): Metrics {
  const wins = trades.filter((t) => t.net > 0);
  const losses = trades.filter((t) => t.net <= 0);
  const winSum = sum(wins.map((t) => t.net));
  const lossSum = sum(losses.map((t) => t.net));
  let equity = 0;
  let peak = 0;
  let dd = 0;
  let streak = 0;
  let maxStreak = 0;
  for (const t of [...trades].sort((a, b) => a.exitT - b.exitT)) {
    equity += t.net;
    peak = Math.max(peak, equity);
    dd = Math.max(dd, peak - equity);
    streak = t.net <= 0 ? streak + 1 : 0;
    maxStreak = Math.max(maxStreak, streak);
  }
  const planned = trades.map((t) => t.plannedRR).filter((x): x is number => x != null);
  const charges = sum(trades.map((t) => t.charges));
  const friction = sum(trades.map((t) => t.friction));
  return {
    trades: trades.length,
    wins: wins.length,
    losses: losses.length,
    winRate: trades.length ? wins.length / trades.length : null,
    gross: sum(trades.map((t) => t.gross)),
    net: sum(trades.map((t) => t.net)),
    charges,
    friction,
    costs: charges + friction,
    profitFactor: lossSum < 0 ? winSum / -lossSum : null,
    maxDrawdown: dd,
    maxDrawdownPct: capital > 0 ? (dd / capital) * 100 : 0,
    avgWin: mean(wins.map((t) => t.net)),
    avgLoss: mean(losses.map((t) => t.net)),
    expectancy: mean(trades.map((t) => t.net)),
    avgPlannedRR: mean(planned),
    avgR: mean(trades.map((t) => t.r)),
    largestWin: wins.length ? Math.max(...wins.map((t) => t.net)) : null,
    largestLoss: losses.length ? Math.min(...losses.map((t) => t.net)) : null,
    maxConsecLosses: maxStreak,
  };
}

/** Group trades by a key (strategy, ETF, …) and compute metrics per group. */
export function metricsBy(trades: SimTrade[], key: (t: SimTrade) => string, capital: number): { key: string; m: Metrics }[] {
  const groups = new Map<string, SimTrade[]>();
  for (const t of trades) groups.set(key(t), [...(groups.get(key(t)) ?? []), t]);
  return [...groups.entries()].map(([k, ts]) => ({ key: k, m: computeMetrics(ts, capital) }));
}

/** Cumulative net equity after each trade, for the equity curve. */
export function equityCurve(trades: SimTrade[]): { t: number; equity: number }[] {
  let e = 0;
  return [...trades].sort((a, b) => a.exitT - b.exitT).map((t) => ({ t: t.exitT, equity: (e += t.net) }));
}

export const MIN_TRADES = 30;
