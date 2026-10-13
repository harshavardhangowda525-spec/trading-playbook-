// Educational strategy templates (A–D). Each decides at the CLOSE of bar i
// using only bars 0..i; the backtester and paper simulator fill at the next
// bar's open. These are rules to test objectively — not systems that work.

import type { Candle } from '../market';
import { atr, efficiencyRatio, ema, priorAvgVolume, priorHigh, priorLow, sessionVwap } from './indicators';
import { localTime, type SessionSpec } from './calendar';

export type StrategyId = 'trend' | 'breakout' | 'pullback' | 'range';
export type Side = 'long' | 'short';

export interface ParamDef {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
  help: string;
}

export interface Signal {
  side: Side;
  stop: number;
  /** Fixed target price, or null to use `rr` × risk from the actual fill. */
  target: number | null;
  rr: number | null;
  reason: string;
  /** Strategy-specific values remembered for exit checks (e.g. breakout level). */
  meta?: Record<string, number>;
}

export interface Ctx {
  c: Candle[];
  day: string[];
  min: number[];
  ema20: number[];
  ema50: number[];
  atr14: number[];
  vwap: number[];
  er10: number[];
  er30: number[];
  /** Estimated round-trip cost, % of price (for "is the move big enough?"). */
  costPct: number;
}

export function buildCtx(c: Candle[], s: SessionSpec, costPct: number): Ctx {
  const lt = c.map((k) => localTime(k.t, s.timeZone));
  const closes = c.map((k) => k.c);
  return {
    c,
    day: lt.map((x) => x.day),
    min: lt.map((x) => x.min),
    ema20: ema(closes, 20),
    ema50: ema(closes, 50),
    atr14: atr(c, 14),
    vwap: sessionVwap(c, (i) => lt[i].day),
    er10: efficiencyRatio(closes, 10),
    er30: efficiencyRatio(closes, 30),
    costPct,
  };
}

export interface StrategyDef {
  id: StrategyId;
  letter: string;
  name: string;
  summary: string;
  entry: string[];
  exits: string[];
  invalidation: string[];
  avoid: string[];
  params: ParamDef[];
  signal(ctx: Ctx, i: number, p: Record<string, number>, allowShort: boolean): Signal | null;
  /** Rule-based exit checked at bar close (filled next open). */
  exit?(ctx: Ctx, i: number, side: Side, p: Record<string, number>, meta?: Record<string, number>): string | null;
}

const ok = (...xs: number[]) => xs.every((x) => Number.isFinite(x));
const bull = (k: Candle) => k.c > k.o;
const bear = (k: Candle) => k.c < k.o;

export const STRATEGIES: StrategyDef[] = [
  {
    id: 'trend',
    letter: 'A',
    name: 'Trend-Following',
    summary: 'Trade in the direction of a clear intraday trend, only when price is moving efficiently.',
    entry: [
      'Price closes above a rising 20-EMA and above session VWAP (mirror for shorts).',
      'Efficiency ratio over 10 bars is at least the minimum — the move is clean, not choppy.',
      'The bar closes above the highest high of the previous few bars (fresh push in the trend direction).',
    ],
    exits: ['Target at R:R × risk from the fill.', 'Exit next bar if a bar closes back below the 20-EMA.', 'Square off before the session ends.'],
    invalidation: ['Stop below the lowest low of the last few bars.', 'A close below the 20-EMA means the trend premise has failed.'],
    avoid: ['Flat EMA or low efficiency ratio (choppy, sideways tape).', 'First minutes after the open and the last hour.', 'When the stop distance is tiny compared with costs.'],
    params: [
      { key: 'slopeBars', label: 'EMA slope look-back (bars)', min: 2, max: 20, step: 1, default: 5, help: 'EMA must be higher than it was this many bars ago.' },
      { key: 'breakBars', label: 'Fresh-high look-back (bars)', min: 2, max: 20, step: 1, default: 5, help: 'Close must exceed the high of these prior bars.' },
      { key: 'minEr', label: 'Min efficiency ratio', min: 0.1, max: 0.9, step: 0.05, default: 0.3, help: 'Below this the market is treated as choppy.' },
      { key: 'stopBars', label: 'Stop look-back (bars)', min: 2, max: 20, step: 1, default: 5, help: 'Stop goes beyond the extreme of these bars.' },
      { key: 'rr', label: 'Reward : risk', min: 1, max: 5, step: 0.25, default: 2, help: 'Target distance as a multiple of the stop distance.' },
    ],
    signal(x, i, p, allowShort) {
      const k = x.c[i];
      const e = x.ema20[i];
      const ePrev = x.ema20[i - p.slopeBars];
      if (!ok(e, ePrev, x.er10[i], x.vwap[i])) return null;
      if (x.er10[i] < p.minEr) return null;
      if (k.c > e && e > ePrev && k.c > x.vwap[i] && k.c > priorHigh(x.c, i, p.breakBars)) {
        const stop = Math.min(priorLow(x.c, i, p.stopBars), k.l);
        return { side: 'long', stop, target: null, rr: p.rr, reason: 'Close above rising 20-EMA & VWAP with a fresh high (efficiency ' + x.er10[i].toFixed(2) + ')' };
      }
      if (allowShort && k.c < e && e < ePrev && k.c < x.vwap[i] && k.c < priorLow(x.c, i, p.breakBars)) {
        const stop = Math.max(priorHigh(x.c, i, p.stopBars), k.h);
        return { side: 'short', stop, target: null, rr: p.rr, reason: 'Close below falling 20-EMA & VWAP with a fresh low (efficiency ' + x.er10[i].toFixed(2) + ')' };
      }
      return null;
    },
    exit(x, i, side) {
      const e = x.ema20[i];
      if (!ok(e)) return null;
      if (side === 'long' && x.c[i].c < e) return 'Closed below the 20-EMA';
      if (side === 'short' && x.c[i].c > e) return 'Closed above the 20-EMA';
      return null;
    },
  },
  {
    id: 'breakout',
    letter: 'B',
    name: 'Breakout',
    summary: 'Trade a decisive close through a recent high/low level that comes with above-average volume.',
    entry: [
      'Level = highest high (or lowest low) of the previous N bars.',
      'A bar closes beyond the level in its own direction (bullish bar for longs).',
      'That bar’s volume is at least the multiple of the previous N bars’ average.',
    ],
    exits: ['Target at R:R × risk from the fill.', 'Failed breakout: a close back inside the level exits next bar.', 'Square off before the session ends.'],
    invalidation: ['Stop a fraction of ATR back inside the level.', 'A close back inside the old range = false breakout.'],
    avoid: ['Breakouts without volume.', 'Levels that are tiny compared with costs or ATR.', 'Late-day breakouts with little time left.'],
    params: [
      { key: 'lookback', label: 'Level look-back (bars)', min: 5, max: 60, step: 1, default: 20, help: 'Bars used to find the breakout level.' },
      { key: 'volMult', label: 'Volume multiple', min: 1, max: 4, step: 0.1, default: 1.5, help: 'Breakout bar volume ÷ average volume.' },
      { key: 'stopAtr', label: 'Stop inside level (× ATR)', min: 0.1, max: 2, step: 0.05, default: 0.5, help: 'How far back inside the level the stop sits.' },
      { key: 'rr', label: 'Reward : risk', min: 1, max: 5, step: 0.25, default: 2, help: 'Target distance as a multiple of the stop distance.' },
    ],
    signal(x, i, p, allowShort) {
      const k = x.c[i];
      const a = x.atr14[i];
      if (!ok(a) || i < p.lookback) return null;
      const avgV = priorAvgVolume(x.c, i, p.lookback);
      if (avgV <= 0 || k.v < p.volMult * avgV) return null;
      const hi = priorHigh(x.c, i, p.lookback);
      const lo = priorLow(x.c, i, p.lookback);
      const volNote = `volume ${(k.v / avgV).toFixed(1)}× average`;
      if (k.c > hi && bull(k)) {
        return { side: 'long', stop: hi - p.stopAtr * a, target: null, rr: p.rr, reason: `Closed above ${p.lookback}-bar high with ${volNote}`, meta: { level: hi } };
      }
      if (allowShort && k.c < lo && bear(k)) {
        return { side: 'short', stop: lo + p.stopAtr * a, target: null, rr: p.rr, reason: `Closed below ${p.lookback}-bar low with ${volNote}`, meta: { level: lo } };
      }
      return null;
    },
    exit(x, i, side, _p, meta) {
      if (!meta) return null;
      if (side === 'long' && x.c[i].c < meta.level) return 'False breakout — closed back below the level';
      if (side === 'short' && x.c[i].c > meta.level) return 'False breakout — closed back above the level';
      return null;
    },
  },
  {
    id: 'pullback',
    letter: 'C',
    name: 'Pullback',
    summary: 'In an established trend, wait for price to dip to the 20-EMA/VWAP area and resume before entering.',
    entry: [
      'Trend: 20-EMA rising and price above VWAP (mirror for shorts).',
      'Within the last few bars a low touched the 20-EMA zone (within a fraction of ATR).',
      'Trigger: a bullish bar closes above the previous bar’s high and back above the EMA.',
    ],
    exits: ['Target at R:R × risk from the fill.', 'Exit next bar if the 20-EMA turns down.', 'Square off before the session ends.'],
    invalidation: ['Stop below the pullback low.', 'EMA turning down means the trend may be over — not every pullback resumes.'],
    avoid: ['Pullbacks in flat or choppy markets.', 'Deep pullbacks that break the prior swing low.', 'When there is no clear trigger candle.'],
    params: [
      { key: 'slopeBars', label: 'EMA slope look-back (bars)', min: 2, max: 20, step: 1, default: 5, help: 'EMA must be rising over this many bars.' },
      { key: 'touchBars', label: 'Pullback window (bars)', min: 1, max: 10, step: 1, default: 3, help: 'A low must touch the EMA zone within these bars.' },
      { key: 'tolAtr', label: 'EMA zone (× ATR)', min: 0, max: 1, step: 0.05, default: 0.25, help: 'How close to the EMA counts as a touch.' },
      { key: 'rr', label: 'Reward : risk', min: 1, max: 5, step: 0.25, default: 2, help: 'Target distance as a multiple of the stop distance.' },
    ],
    signal(x, i, p, allowShort) {
      const k = x.c[i];
      const prev = x.c[i - 1];
      const e = x.ema20[i];
      const ePrev = x.ema20[i - p.slopeBars];
      const a = x.atr14[i];
      if (!prev || !ok(e, ePrev, a, x.vwap[i])) return null;
      const from = Math.max(0, i - p.touchBars + 1);
      if (e > ePrev && k.c > x.vwap[i] && bull(k) && k.c > prev.h && k.c > e) {
        let touched = false;
        let low = Infinity;
        for (let j = from; j <= i; j++) {
          if (ok(x.ema20[j]) && x.c[j].l <= x.ema20[j] + p.tolAtr * a) touched = true;
          low = Math.min(low, x.c[j].l);
        }
        if (touched) return { side: 'long', stop: low, target: null, rr: p.rr, reason: 'Pullback to the rising 20-EMA, then a close above the prior bar’s high' };
      }
      if (allowShort && e < ePrev && k.c < x.vwap[i] && bear(k) && k.c < prev.l && k.c < e) {
        let touched = false;
        let high = -Infinity;
        for (let j = from; j <= i; j++) {
          if (ok(x.ema20[j]) && x.c[j].h >= x.ema20[j] - p.tolAtr * a) touched = true;
          high = Math.max(high, x.c[j].h);
        }
        if (touched) return { side: 'short', stop: high, target: null, rr: p.rr, reason: 'Rally to the falling 20-EMA, then a close below the prior bar’s low' };
      }
      return null;
    },
    exit(x, i, side) {
      const e = x.ema20[i];
      const e3 = x.ema20[i - 3];
      if (!ok(e, e3)) return null;
      if (side === 'long' && e < e3) return '20-EMA turned down';
      if (side === 'short' && e > e3) return '20-EMA turned up';
      return null;
    },
  },
  {
    id: 'range',
    letter: 'D',
    name: 'Range-Bound',
    summary: 'In a sideways market, buy rejection near support and sell rejection near resistance.',
    entry: [
      'Range: the last N bars are sideways — low efficiency ratio and a flat 20-EMA.',
      'Range width is at least 2 × ATR and several times the round-trip cost.',
      'Long: a bar dips into the bottom zone and closes back up (rejection). Mirror at the top for shorts.',
    ],
    exits: ['Target near the opposite edge of the range.', 'Square off before the session ends.'],
    invalidation: ['Stop a fraction of ATR beyond the range edge.', 'A close outside the range means it has become a breakout — the range idea is wrong.'],
    avoid: ['Strong trends (high efficiency ratio, sloping EMA).', 'Narrow ranges where costs eat the move.', 'The opening minutes and news-driven sessions.'],
    params: [
      { key: 'lookback', label: 'Range look-back (bars)', min: 10, max: 90, step: 1, default: 30, help: 'Bars that define the range.' },
      { key: 'maxEr', label: 'Max efficiency ratio', min: 0.05, max: 0.6, step: 0.05, default: 0.25, help: 'Above this the market is trending, not ranging.' },
      { key: 'edgePct', label: 'Edge zone (% of width)', min: 5, max: 40, step: 1, default: 20, help: 'How close to the edge an entry must be.' },
      { key: 'minWidthCost', label: 'Min width (× round-trip cost)', min: 1, max: 20, step: 0.5, default: 4, help: 'Skip ranges too narrow to cover costs.' },
      { key: 'stopAtr', label: 'Stop beyond edge (× ATR)', min: 0.05, max: 2, step: 0.05, default: 0.25, help: 'How far outside the range the stop sits.' },
    ],
    signal(x, i, p, allowShort) {
      const k = x.c[i];
      const a = x.atr14[i];
      const e = x.ema20[i];
      const e10 = x.ema20[i - 10];
      if (!ok(a, e, e10, x.er30[i]) || i < p.lookback) return null;
      if (x.er30[i] > p.maxEr || Math.abs(e - e10) > 0.5 * a) return null;
      const hi = priorHigh(x.c, i, p.lookback);
      const lo = priorLow(x.c, i, p.lookback);
      const w = hi - lo;
      if (w < 2 * a || (w / k.c) * 100 < p.minWidthCost * x.costPct) return null;
      const edge = (p.edgePct / 100) * w;
      if (k.l <= lo + edge && bull(k) && k.c > lo && k.c < lo + w / 2) {
        return { side: 'long', stop: lo - p.stopAtr * a, target: hi - edge, rr: null, reason: `Rejection at range support (range ${lo.toFixed(2)}–${hi.toFixed(2)})`, meta: { lo, hi } };
      }
      if (allowShort && k.h >= hi - edge && bear(k) && k.c < hi && k.c > lo + w / 2) {
        return { side: 'short', stop: hi + p.stopAtr * a, target: lo + edge, rr: null, reason: `Rejection at range resistance (range ${lo.toFixed(2)}–${hi.toFixed(2)})`, meta: { lo, hi } };
      }
      return null;
    },
  },
];

export const strategyById = (id: StrategyId) => STRATEGIES.find((s) => s.id === id)!;
export const defaultParams = (id: StrategyId): Record<string, number> => Object.fromEntries(strategyById(id).params.map((p) => [p.key, p.default]));

/** Bars needed before any strategy can decide (indicator warm-up). */
export const WARMUP = 50;

// ─── Market regime (for context, reports and the practice workflow) ─────

export type Regime = 'Trending up' | 'Trending down' | 'Range-bound' | 'Choppy / unclear';

export function regimeAt(x: Ctx, i: number): Regime | null {
  const e = x.ema20[i];
  const e10 = x.ema20[i - 10];
  const a = x.atr14[i];
  const er = x.er30[i];
  if (!ok(e, e10, a, er)) return null;
  const slope = (e - e10) / a;
  if (er >= 0.35 && slope > 0.5) return 'Trending up';
  if (er >= 0.35 && slope < -0.5) return 'Trending down';
  if (er <= 0.2 && Math.abs(slope) <= 0.5) return 'Range-bound';
  return 'Choppy / unclear';
}

/** Share of bars in each regime — a measured description of the period. */
export function regimeMix(x: Ctx, from = 0, to = x.c.length - 1): Record<Regime, number> {
  const out: Record<Regime, number> = { 'Trending up': 0, 'Trending down': 0, 'Range-bound': 0, 'Choppy / unclear': 0 };
  let n = 0;
  for (let i = from; i <= to; i++) {
    const r = regimeAt(x, i);
    if (!r) continue;
    out[r]++;
    n++;
  }
  if (n) for (const k of Object.keys(out) as Regime[]) out[k] = out[k] / n;
  return out;
}
