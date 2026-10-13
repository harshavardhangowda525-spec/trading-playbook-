// Causal indicators: the value at index i depends only on bars 0..i, so a
// strategy reading index i can never see the future.

import type { Candle } from '../market';

export function ema(xs: number[], n: number): number[] {
  const out = new Array<number>(xs.length).fill(NaN);
  if (!xs.length || n < 1) return out;
  const k = 2 / (n + 1);
  let prev = NaN;
  let sum = 0;
  for (let i = 0; i < xs.length; i++) {
    if (i < n - 1) {
      sum += xs[i];
      continue;
    }
    if (i === n - 1) {
      sum += xs[i];
      prev = sum / n; // seed with SMA
    } else prev = xs[i] * k + prev * (1 - k);
    out[i] = prev;
  }
  return out;
}

export function sma(xs: number[], n: number): number[] {
  const out = new Array<number>(xs.length).fill(NaN);
  let sum = 0;
  for (let i = 0; i < xs.length; i++) {
    sum += xs[i];
    if (i >= n) sum -= xs[i - n];
    if (i >= n - 1) out[i] = sum / n;
  }
  return out;
}

/** Wilder's average true range; first value at index n (mean of the first n true ranges). */
export function atr(c: Candle[], n = 14): number[] {
  const out = new Array<number>(c.length).fill(NaN);
  let prev = 0;
  let sum = 0;
  for (let i = 1; i < c.length; i++) {
    const tr = Math.max(c[i].h - c[i].l, Math.abs(c[i].h - c[i - 1].c), Math.abs(c[i].l - c[i - 1].c));
    if (i <= n) {
      sum += tr;
      if (i === n) out[i] = prev = sum / n;
    } else out[i] = prev = (prev * (n - 1) + tr) / n;
  }
  return out;
}

/** Session VWAP, reset whenever `dayOf(i)` changes. Uses typical price. */
export function sessionVwap(c: Candle[], dayOf: (i: number) => string): number[] {
  const out = new Array<number>(c.length).fill(NaN);
  let day = '';
  let pv = 0;
  let vol = 0;
  for (let i = 0; i < c.length; i++) {
    const d = dayOf(i);
    if (d !== day) {
      day = d;
      pv = 0;
      vol = 0;
    }
    const tp = (c[i].h + c[i].l + c[i].c) / 3;
    pv += tp * c[i].v;
    vol += c[i].v;
    out[i] = vol > 0 ? pv / vol : tp;
  }
  return out;
}

/**
 * Kaufman efficiency ratio over `n` bars: |net move| / sum of |bar moves|.
 * Near 1 = clean trend, near 0 = choppy.
 */
export function efficiencyRatio(closes: number[], n = 10): number[] {
  const out = new Array<number>(closes.length).fill(NaN);
  for (let i = n; i < closes.length; i++) {
    const net = Math.abs(closes[i] - closes[i - n]);
    let path = 0;
    for (let j = i - n + 1; j <= i; j++) path += Math.abs(closes[j] - closes[j - 1]);
    out[i] = path > 0 ? net / path : 0;
  }
  return out;
}

/** Highest high of the `n` bars before i (excludes bar i). */
export function priorHigh(c: Candle[], i: number, n: number): number {
  let h = -Infinity;
  for (let j = Math.max(0, i - n); j < i; j++) h = Math.max(h, c[j].h);
  return h;
}

/** Lowest low of the `n` bars before i (excludes bar i). */
export function priorLow(c: Candle[], i: number, n: number): number {
  let l = Infinity;
  for (let j = Math.max(0, i - n); j < i; j++) l = Math.min(l, c[j].l);
  return l;
}

/** Average volume of the `n` bars before i. */
export function priorAvgVolume(c: Candle[], i: number, n: number): number {
  let s = 0;
  let k = 0;
  for (let j = Math.max(0, i - n); j < i; j++) {
    s += c[j].v;
    k++;
  }
  return k ? s / k : 0;
}
