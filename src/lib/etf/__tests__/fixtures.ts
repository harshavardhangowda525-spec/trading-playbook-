// TEST FIXTURES ONLY — hand-built candles with round numbers to exercise the
// engine's rules. They are not market data and are never used by the app.

import type { Candle } from '../../market';

/** UTC seconds for an IST wall-clock time on a day (IST = UTC+05:30). */
export function ist(day: string, hh: number, mm: number): number {
  return Date.UTC(+day.slice(0, 4), +day.slice(5, 7) - 1, +day.slice(8, 10), hh, mm) / 1000 - 19800;
}

/** Consecutive 5-minute NSE bars from 09:15 IST: rows are [open, high, low, close, volume]. */
export function day5m(day: string, rows: [number, number, number, number, number][], startMin = 9 * 60 + 15): Candle[] {
  return rows.map(([o, h, l, c, v], i) => {
    const m = startMin + i * 5;
    return { t: ist(day, Math.floor(m / 60), m % 60), o, h, l, c, v };
  });
}

/** A full 75-bar session of flat bars at `price` (for padding / warm-up). */
export function flatDay(day: string, price: number, v = 10000): Candle[] {
  return day5m(day, Array.from({ length: 75 }, () => [price, price + 0.1, price - 0.1, price, v] as [number, number, number, number, number]));
}

/** Deterministic pseudo-random walk (seeded) — synthetic, labelled test data. */
export function walkDay(day: string, start: number, seed: number, drift = 0): Candle[] {
  let x = seed;
  const rnd = () => ((x = (x * 1103515245 + 12345) % 2147483648) / 2147483648);
  let p = start;
  const rows: [number, number, number, number, number][] = [];
  for (let i = 0; i < 75; i++) {
    const o = p;
    const c = Math.max(1, o * (1 + (rnd() - 0.5) * 0.004 + drift));
    const h = Math.max(o, c) * (1 + rnd() * 0.0015);
    const l = Math.min(o, c) * (1 - rnd() * 0.0015);
    rows.push([+o.toFixed(2), +h.toFixed(2), +l.toFixed(2), +c.toFixed(2), Math.round(20000 + rnd() * 30000)]);
    p = c;
  }
  return day5m(day, rows);
}

export const DAYS = ['2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08', '2026-01-09', '2026-01-12', '2026-01-13', '2026-01-14', '2026-01-15', '2026-01-16'];
