// Historical market data for the Practice Lab.
// Two honest sources only: Binance's public market-data feed (real crypto
// history) and datasets the user imports. Nothing here invents prices.

export interface Candle {
  t: number; // bar open time, UNIX seconds (UTC)
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

export type Interval = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d';

export const INTERVALS: { key: Interval; label: string; sec: number }[] = [
  { key: '1m', label: '1m', sec: 60 },
  { key: '5m', label: '5m', sec: 300 },
  { key: '15m', label: '15m', sec: 900 },
  { key: '30m', label: '30m', sec: 1800 },
  { key: '1h', label: '1H', sec: 3600 },
  { key: '4h', label: '4H', sec: 14400 },
  { key: '1d', label: '1D', sec: 86400 },
];

export const intervalSec = (i: Interval) => INTERVALS.find((x) => x.key === i)!.sec;

/** Major crypto pairs available from the public feed. */
export const PUBLIC_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 'ADAUSDT'];

/** Where a chart's candles came from — always shown next to the chart. */
export type DataRef =
  | { source: 'binance'; symbol: string; interval: Interval; start: number; end: number }
  | { source: 'import'; datasetId: string; interval: Interval; start: number; end: number };

export const SOURCE_LABEL = {
  binance: 'Historical data · Binance public market data',
  import: 'USER-IMPORTED DATA',
} as const;

// ─── Imported datasets ─────────────────────────────────────────────────────

export const DATASETS = 'datasets';

export interface Dataset {
  id: string;
  name: string; // e.g. "SPY daily (Yahoo export)"
  symbol: string;
  baseInterval: Interval; // detected native timeframe
  candles: Candle[];
  importedAt: number;
  fileName: string;
  rows: number; // rows in the file
  rejected: number; // invalid rows skipped
  gaps: number; // missing bars detected (never filled)
}

/** Aggregate candles into a higher timeframe. Buckets are aligned to UTC. */
export function resample(candles: Candle[], from: Interval, to: Interval): Candle[] {
  const fs = intervalSec(from);
  const ts = intervalSec(to);
  if (ts <= fs) return candles;
  const out: Candle[] = [];
  let cur: Candle | null = null;
  for (const k of candles) {
    const bucket = Math.floor(k.t / ts) * ts;
    if (!cur || cur.t !== bucket) {
      if (cur) out.push(cur);
      cur = { t: bucket, o: k.o, h: k.h, l: k.l, c: k.c, v: k.v };
    } else {
      cur.h = Math.max(cur.h, k.h);
      cur.l = Math.min(cur.l, k.l);
      cur.c = k.c;
      cur.v += k.v;
    }
  }
  if (cur) out.push(cur);
  return out;
}

/** Intervals a dataset can be shown in (its own, or any coarser one). */
export function availableIntervals(base: Interval): Interval[] {
  const b = intervalSec(base);
  return INTERVALS.filter((i) => i.sec >= b).map((i) => i.key);
}

// ─── Public feed ───────────────────────────────────────────────────────────

const BINANCE = 'https://data-api.binance.vision/api/v3/klines';

/**
 * Fetch up to `limit` real candles starting at `start` (UNIX seconds).
 * Throws with a readable message when the feed can't be reached.
 */
export async function fetchBinance(symbol: string, interval: Interval, start: number, limit = 600): Promise<Candle[]> {
  const out: Candle[] = [];
  let from = start * 1000;
  while (out.length < limit) {
    const n = Math.min(1000, limit - out.length);
    const url = `${BINANCE}?symbol=${encodeURIComponent(symbol)}&interval=${interval}&startTime=${from}&limit=${n}`;
    let res: Response;
    try {
      res = await fetch(url);
    } catch {
      throw new Error('Historical data unavailable — the public market-data feed could not be reached. Check your connection or import a dataset.');
    }
    if (!res.ok) throw new Error(`Historical data unavailable — the feed returned ${res.status}.`);
    const rows = (await res.json()) as [number, string, string, string, string, string][];
    if (!rows.length) break;
    for (const r of rows) out.push({ t: Math.floor(r[0] / 1000), o: +r[1], h: +r[2], l: +r[3], c: +r[4], v: +r[5] });
    from = rows[rows.length - 1][0] + 1;
    if (rows.length < n) break;
  }
  return out;
}

/** Load candles for a stored reference (used to reopen sessions exactly). */
export async function loadRef(ref: DataRef, datasets: Dataset[]): Promise<Candle[]> {
  if (ref.source === 'binance') {
    const bars = Math.ceil((ref.end - ref.start) / intervalSec(ref.interval)) + 1;
    return fetchBinance(ref.symbol, ref.interval, ref.start, Math.min(bars, 1500));
  }
  const ds = datasets.find((d) => d.id === ref.datasetId);
  if (!ds) throw new Error('This session used an imported dataset that has since been removed.');
  return resample(ds.candles, ds.baseInterval, ref.interval).filter((c) => c.t >= ref.start && c.t <= ref.end);
}

export function refLabel(ref: DataRef, datasets: Dataset[]): string {
  if (ref.source === 'binance') return ref.symbol.replace(/USDT$/, '/USDT');
  return datasets.find((d) => d.id === ref.datasetId)?.symbol ?? 'Imported dataset';
}

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Average true range over the last `n` candles (used to describe moves). */
export function atr(candles: Candle[], n = 14): number {
  if (candles.length < 2) return 0;
  const xs = candles.slice(-n - 1);
  let sum = 0;
  for (let i = 1; i < xs.length; i++) {
    const p = xs[i - 1].c;
    const k = xs[i];
    sum += Math.max(k.h - k.l, Math.abs(k.h - p), Math.abs(k.l - p));
  }
  return sum / (xs.length - 1);
}

export function fmtPrice(p: number | null | undefined): string {
  if (p == null || !Number.isFinite(p)) return '—';
  const abs = Math.abs(p);
  const d = abs >= 1000 ? 2 : abs >= 1 ? 4 : 6;
  return p.toLocaleString(undefined, { maximumFractionDigits: d });
}

export function fmtTime(t: number, interval?: Interval): string {
  const d = new Date(t * 1000);
  const date = d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
  if (interval === '1d') return date;
  return `${date} ${d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', timeZone: 'UTC', hour12: false })} UTC`;
}
