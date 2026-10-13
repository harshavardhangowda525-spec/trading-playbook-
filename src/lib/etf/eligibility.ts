// Is this ETF suitable for intraday simulation? Measured from the learner's
// own historical data — nothing is assumed about an ETF's liquidity.
// Spread cannot be measured from OHLC bars, so the configured spread
// assumption is used and labelled as such.

import type { Candle } from '../market';
import { SESSIONS, localTime } from './calendar';
import { roundTripPct, type CostModel } from './costs';
import { prepareBars } from './quality';
import type { EtfDef } from './universe';

export interface EligibilityThresholds {
  minSessions: number;
  minCoverage: number; // 0..1
  maxZeroVolumeShare: number; // 0..1
  /** Minimum median traded value per bar, scaled to a 5-minute bar (₹ or $). */
  minMedianValue5m: number;
  /** Round-trip cost must be at most this share of the median daily range. */
  maxCostToRange: number; // 0..1
}

export const DEFAULT_THRESHOLDS: Record<'NSE' | 'US', EligibilityThresholds> = {
  NSE: { minSessions: 20, minCoverage: 0.9, maxZeroVolumeShare: 0.05, minMedianValue5m: 500000, maxCostToRange: 0.15 },
  US: { minSessions: 20, minCoverage: 0.9, maxZeroVolumeShare: 0.02, minMedianValue5m: 1000000, maxCostToRange: 0.1 },
};

export type Verdict = 'eligible' | 'caution' | 'not-eligible';

export interface CheckRow {
  label: string;
  value: string;
  pass: boolean | null; // null = informational
  note?: string;
}

export interface Eligibility {
  verdict: Verdict;
  rows: CheckRow[];
  reasons: string[];
  sessions: number;
  medianValue5m: number;
  medianDailyRangePct: number;
  costPct: number;
}

const median = (xs: number[]) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

export function assessEligibility(raw: Candle[], sec: number, etf: EtfDef, costs: CostModel, positionValue: number, th = DEFAULT_THRESHOLDS[etf.exchange]): Eligibility {
  const s = SESSIONS[etf.exchange];
  const { bars, quality: q } = prepareBars(raw, sec, s);
  const values = bars.map((k) => k.v * ((k.h + k.l + k.c) / 3));
  const medianValue5m = median(values) * (300 / sec);
  const byDay = new Map<string, { h: number; l: number; o: number }>();
  for (const k of bars) {
    const d = localTime(k.t, s.timeZone).day;
    const x = byDay.get(d);
    if (!x) byDay.set(d, { h: k.h, l: k.l, o: k.o });
    else {
      x.h = Math.max(x.h, k.h);
      x.l = Math.min(x.l, k.l);
    }
  }
  const medianDailyRangePct = median([...byDay.values()].map((x) => ((x.h - x.l) / x.o) * 100));
  const price = bars.length ? bars[bars.length - 1].c : 0;
  const qty = price > 0 ? Math.max(1, Math.floor(positionValue / price)) : 1;
  const costPct = roundTripPct(price, qty, costs, etf.stt);
  const zeroShare = q.bars ? q.zeroVolumeBars / q.bars : 1;
  const costToRange = medianDailyRangePct > 0 ? costPct / medianDailyRangePct : 1;
  const cur = etf.exchange === 'NSE' ? '₹' : '$';

  const rows: CheckRow[] = [
    { label: 'Trading sessions in data', value: String(q.sessions), pass: q.sessions >= th.minSessions, note: `need ≥ ${th.minSessions}` },
    { label: 'Bar coverage', value: `${Math.round(q.coverage * 100)}%`, pass: q.coverage >= th.minCoverage, note: `need ≥ ${Math.round(th.minCoverage * 100)}%; gaps are never filled` },
    { label: 'Zero-volume bars', value: `${(zeroShare * 100).toFixed(1)}%`, pass: zeroShare <= th.maxZeroVolumeShare, note: `max ${Math.round(th.maxZeroVolumeShare * 100)}%` },
    {
      label: 'Median traded value per 5 min',
      value: `${cur}${Math.round(medianValue5m).toLocaleString(etf.exchange === 'NSE' ? 'en-IN' : 'en-US')}`,
      pass: medianValue5m >= th.minMedianValue5m,
      note: `need ≥ ${cur}${th.minMedianValue5m.toLocaleString(etf.exchange === 'NSE' ? 'en-IN' : 'en-US')} (approx. from volume × typical price)`,
    },
    { label: 'Median daily range', value: `${medianDailyRangePct.toFixed(2)}%`, pass: null },
    {
      label: 'Round-trip cost vs daily range',
      value: `${costPct.toFixed(3)}% / ${medianDailyRangePct.toFixed(2)}%`,
      pass: costToRange <= th.maxCostToRange,
      note: `cost must be ≤ ${Math.round(th.maxCostToRange * 100)}% of the typical day's range`,
    },
    { label: 'Bid-ask spread', value: `${costs.spreadBps} bps`, pass: null, note: 'ASSUMPTION — not measurable from OHLC bars; set it from your broker’s order book' },
  ];
  const reasons = rows.filter((r) => r.pass === false).map((r) => `${r.label}: ${r.value} (${r.note})`);
  const hard = rows.slice(0, 4).some((r) => r.pass === false) || q.sessions === 0;
  const verdict: Verdict = hard ? 'not-eligible' : reasons.length ? 'caution' : 'eligible';
  return { verdict, rows, reasons, sessions: q.sessions, medianValue5m, medianDailyRangePct, costPct };
}
