// Client for the optional Upstox connector. Calls the project's own Supabase
// Edge Function (`etf-candles`), which holds the Upstox token server-side —
// no secret ever reaches this browser code.

import { supabase } from '../supabase';
import type { Candle, Dataset, Interval } from '../market';
import { countGaps } from '../csv';

export const upstoxAvailable = () => supabase !== null;

export interface UpstoxRequest {
  symbol: string;
  interval: 1 | 5 | 15;
  from: string; // YYYY-MM-DD
  to: string;
  instrumentKey?: string;
}

/** Fetch real candles via the edge function. Throws a readable error; never substitutes data. */
export async function fetchUpstox(req: UpstoxRequest): Promise<{ candles: Candle[]; instrumentKey: string; fetchedAt: string }> {
  if (!supabase) throw new Error('Cloud accounts are not configured, so the Upstox connector is unavailable. Import a CSV instead.');
  const { data, error } = await supabase.functions.invoke('etf-candles', { body: req });
  if (error) {
    let detail = error.message;
    try {
      const ctx = (error as { context?: Response }).context;
      if (ctx) detail = ((await ctx.json()) as { error?: string }).error ?? detail;
    } catch {
      /* keep message */
    }
    throw new Error(`Upstox data unavailable — ${detail}`);
  }
  const rows = (data?.candles ?? []) as [string, number, number, number, number, number][];
  const candles: Candle[] = rows
    .map((r) => ({ t: Math.floor(Date.parse(r[0]) / 1000), o: +r[1], h: +r[2], l: +r[3], c: +r[4], v: +r[5] }))
    .filter((k) => Number.isFinite(k.t) && [k.o, k.h, k.l, k.c].every((x) => Number.isFinite(x) && x > 0))
    .sort((a, b) => a.t - b.t);
  if (!candles.length) throw new Error('Upstox returned no candles for that range (holidays, weekend, or no data).');
  return { candles, instrumentKey: data.instrumentKey, fetchedAt: data.fetchedAt };
}

export function upstoxDataset(id: string, req: UpstoxRequest, res: { candles: Candle[]; fetchedAt: string }): Dataset {
  const base = `${req.interval}m` as Interval;
  return {
    id,
    name: `${req.symbol} ${req.interval}m · Upstox ${req.from} → ${req.to}`,
    symbol: req.symbol,
    baseInterval: base,
    candles: res.candles,
    importedAt: Date.now(),
    fileName: 'Upstox Historical Candle API v3',
    rows: res.candles.length,
    rejected: 0,
    gaps: countGaps(res.candles, base),
    exchange: 'NSE',
    source: 'upstox',
    fetchedAt: Date.parse(res.fetchedAt) || Date.now(),
  };
}
