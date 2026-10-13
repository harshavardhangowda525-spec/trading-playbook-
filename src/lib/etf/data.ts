// ETF datasets for the module: imported CSVs and Upstox fetches, filtered to
// ETFs on the universe list. Older non-ETF datasets stay stored but are not
// offered for new ETF practice.

import { useMemo } from 'react';
import { useCollection } from '../hooks';
import { DATASETS, intervalSec, resample, type Candle, type Dataset, type Interval } from '../market';
import { SESSIONS, localTime } from './calendar';
import { prepareBars, type DataQuality } from './quality';
import { etfBySymbol, type EtfDef } from './universe';

/** ETF intraday timeframes supported by the module (aligned to NSE's 09:15 open). */
export const ETF_INTERVALS: Interval[] = ['1m', '5m', '15m'];

export interface EtfDataset {
  ds: Dataset;
  etf: EtfDef;
}

export function useEtfDatasets(): EtfDataset[] {
  const { items } = useCollection<Dataset>(DATASETS);
  return useMemo(
    () =>
      items
        .map((ds) => ({ ds, etf: etfBySymbol(ds.symbol) }))
        .filter((x): x is EtfDataset => !!x.etf && ETF_INTERVALS.includes(x.ds.baseInterval))
        .sort((a, b) => b.ds.importedAt - a.ds.importedAt),
    [items],
  );
}

export function intervalsFor(ds: Dataset): Interval[] {
  const base = intervalSec(ds.baseInterval);
  return ETF_INTERVALS.filter((i) => intervalSec(i) >= base);
}

/** Session-only bars of a dataset at a timeframe, optionally limited to local dates. */
export function etfBars(x: EtfDataset, interval: Interval, from?: string, to?: string): { bars: Candle[]; quality: DataQuality } {
  const s = SESSIONS[x.etf.exchange];
  const res = resample(x.ds.candles, x.ds.baseInterval, interval);
  const ranged = from || to ? res.filter((k) => {
    const d = localTime(k.t, s.timeZone).day;
    return (!from || d >= from) && (!to || d <= to);
  }) : res;
  return prepareBars(ranged, intervalSec(interval), s);
}

/** Human description of where a dataset came from — shown next to every chart. */
export function sourceLabel(ds: Dataset): string {
  if (ds.source === 'upstox') return `HISTORICAL · Upstox API · fetched ${new Date(ds.fetchedAt ?? ds.importedAt).toLocaleString()}`;
  return `USER-IMPORTED DATA · ${ds.fileName}${ds.tz ? ` · read as ${ds.tz}` : ''}`;
}
