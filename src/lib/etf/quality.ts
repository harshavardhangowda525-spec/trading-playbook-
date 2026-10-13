// Prepares real candles for simulation: keeps regular-session bars only,
// sorts and de-duplicates, and measures (never repairs) missing data.

import type { Candle } from '../market';
import { barsPerSession, inSession, localTime, type SessionSpec } from './calendar';

export interface DataQuality {
  bars: number;
  sessions: number;
  days: string[];
  expectedBars: number;
  missingBars: number;
  /** Share of expected in-session bars that are present (0..1). */
  coverage: number;
  /** Bars dropped because they fall outside the regular session. */
  outOfSession: number;
  duplicates: number;
  zeroVolumeBars: number;
  /** Days with fewer than 80% of the expected bars. */
  partialDays: string[];
  /** Weekdays between the first and last session with no bars (holiday or missing). */
  noDataWeekdays: string[];
  first: number | null;
  last: number | null;
}

export function prepareBars(raw: Candle[], sec: number, s: SessionSpec): { bars: Candle[]; quality: DataQuality } {
  const sorted = [...raw].filter((k) => [k.t, k.o, k.h, k.l, k.c].every(Number.isFinite)).sort((a, b) => a.t - b.t);
  const bars: Candle[] = [];
  let duplicates = 0;
  let outOfSession = 0;
  for (const k of sorted) {
    if (bars.length && bars[bars.length - 1].t === k.t) {
      duplicates++;
      continue;
    }
    if (!inSession(k.t, sec, s)) {
      outOfSession++;
      continue;
    }
    bars.push(k);
  }
  const perDay = new Map<string, number>();
  for (const k of bars) {
    const d = localTime(k.t, s.timeZone).day;
    perDay.set(d, (perDay.get(d) ?? 0) + 1);
  }
  const days = [...perDay.keys()];
  const expectedPerDay = barsPerSession(sec, s);
  const expectedBars = expectedPerDay * days.length;
  const partialDays = days.filter((d) => (perDay.get(d) ?? 0) < 0.8 * expectedPerDay);
  const noDataWeekdays: string[] = [];
  if (days.length > 1) {
    const end = new Date(days[days.length - 1] + 'T00:00:00Z').getTime();
    for (let t = new Date(days[0] + 'T00:00:00Z').getTime(); t <= end; t += 86400000) {
      const d = new Date(t);
      const key = d.toISOString().slice(0, 10);
      if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6 && !perDay.has(key)) noDataWeekdays.push(key);
    }
  }
  return {
    bars,
    quality: {
      bars: bars.length,
      sessions: days.length,
      days,
      expectedBars,
      missingBars: Math.max(0, expectedBars - bars.length),
      coverage: expectedBars ? Math.min(1, bars.length / expectedBars) : 0,
      outOfSession,
      duplicates,
      zeroVolumeBars: bars.filter((k) => k.v <= 0).length,
      partialDays,
      noDataWeekdays,
      first: bars[0]?.t ?? null,
      last: bars[bars.length - 1]?.t ?? null,
    },
  };
}

/** Stable fingerprint of a candle series, so a saved run can be reproduced on identical data. */
export function fingerprint(c: Candle[]): string {
  let h = 2166136261;
  for (const k of c) {
    for (const x of [k.t, k.o, k.h, k.l, k.c, k.v]) {
      const s = String(x);
      for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
    }
  }
  return `${c.length}:${c[0]?.t ?? 0}:${c[c.length - 1]?.t ?? 0}:${(h >>> 0).toString(16)}`;
}
