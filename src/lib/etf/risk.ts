// Strategy E — risk management. Position size comes from a fixed, user-set
// virtual account and risk %, never from recent wins (no automatic sizing up),
// and new trades are blocked once a limit is hit.

import { fillCharges, fillPrice, type CostModel } from './costs';
import type { Side } from './strategies';

export interface RiskConfig {
  /** Virtual capital used for sizing (does not compound with wins). */
  capital: number;
  /** Max loss per trade, % of capital (stop distance × qty + est. costs). */
  riskPct: number;
  /** Max net loss per day, % of capital; reaching it locks the day. */
  dailyLossPct: number;
  /** Max entries per day. */
  maxTrades: number;
  /** Max position value, % of capital (no leverage by default). */
  maxPositionPct: number;
  /** Minimum planned reward : risk before a trade is allowed. */
  minRR: number;
  /** Minutes of cooldown after the daily loss limit (paper trading; backtests lock the rest of the day). */
  cooldownMin: number;
  /** Shorts allowed (intraday only). */
  allowShort: boolean;
  /** No new entries this many minutes after the open. */
  skipOpenMin: number;
  /** No new entries this many minutes before the close. */
  lastEntryBeforeCloseMin: number;
  /** Square off open positions this many minutes before the close. */
  squareOffBeforeCloseMin: number;
}

export const DEFAULT_RISK: RiskConfig = {
  capital: 100000,
  riskPct: 0.5,
  dailyLossPct: 1.5,
  maxTrades: 3,
  maxPositionPct: 100,
  minRR: 1.5,
  cooldownMin: 60,
  allowShort: false,
  skipOpenMin: 15,
  lastEntryBeforeCloseMin: 45,
  squareOffBeforeCloseMin: 15,
};

export interface SizeResult {
  qty: number;
  /** Rupee (or dollar) risk if the stop fills exactly, including estimated round-trip charges. */
  riskAmount: number;
  perUnitRisk: number;
  rejected?: string;
}

/**
 * Quantity for a planned trade. Risk per unit = |entry − stop| plus spread &
 * slippage on both fills; charges are added and the size reduced until the
 * total fits the budget.
 */
export function positionSize(side: Side, entry: number, stop: number, r: RiskConfig, m: CostModel, sttApplies: boolean): SizeResult {
  if (!(entry > 0) || !(stop > 0)) return { qty: 0, riskAmount: 0, perUnitRisk: 0, rejected: 'Missing entry or stop price' };
  if ((side === 'long' && stop >= entry) || (side === 'short' && stop <= entry)) {
    return { qty: 0, riskAmount: 0, perUnitRisk: 0, rejected: 'Stop is on the wrong side of the entry' };
  }
  const buyLeg = side === 'long' ? entry : stop;
  const sellLeg = side === 'long' ? stop : entry;
  const perUnit = fillPrice('buy', buyLeg, m) - fillPrice('sell', sellLeg, m);
  const budget = (r.capital * r.riskPct) / 100;
  let qty = Math.floor(budget / perUnit);
  qty = Math.min(qty, Math.floor((r.capital * r.maxPositionPct) / 100 / entry));
  const total = (q: number) => perUnit * q + fillCharges('buy', buyLeg, q, m, sttApplies).total + fillCharges('sell', sellLeg, q, m, sttApplies).total;
  while (qty > 0 && total(qty) > budget) qty--;
  if (qty < 1) return { qty: 0, riskAmount: 0, perUnitRisk: perUnit, rejected: 'Risk budget too small for even 1 unit at this stop distance' };
  return { qty, riskAmount: total(qty), perUnitRisk: perUnit };
}

/** Planned reward : risk from entry, stop and target (before costs). */
export function plannedRR(side: Side, entry: number, stop: number, target: number | null): number | null {
  if (target == null) return null;
  const risk = Math.abs(entry - stop);
  const reward = side === 'long' ? target - entry : entry - target;
  return risk > 0 ? reward / risk : null;
}

/** Round-trip win rate needed to break even at this R:R after costs (for teaching). */
export function breakevenWinRate(rr: number, costR: number): number {
  // win: +rr − cost; loss: −1 − cost  →  p(rr − c) = (1 − p)(1 + c)
  return (1 + costR) / (rr + 1);
}
