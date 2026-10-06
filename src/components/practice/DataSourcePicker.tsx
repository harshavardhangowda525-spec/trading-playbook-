import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Database, Loader2, Shuffle, Upload } from 'lucide-react';
import { Field, SegControl, cx } from '../ui';
import { useCollection } from '../../lib/hooks';
import {
  DATASETS,
  INTERVALS,
  PUBLIC_SYMBOLS,
  SOURCE_LABEL,
  availableIntervals,
  fetchBinance,
  fmtTime,
  intervalSec,
  resample,
  type Candle,
  type DataRef,
  type Dataset,
  type Interval,
} from '../../lib/market';
import { DataImport } from './DataImport';
import '../../styles/practice-data.css';

const EASE = [0.22, 1, 0.36, 1] as const;
const DAY = 86_400;
const MAX_BARS = 600;
const MIN_BARS = 60;
const BINANCE_MIN_DATE = '2017-08-17';
const UNAVAILABLE = 'Historical data unavailable — connect/import a dataset to begin practice.';

type Source = 'binance' | 'import';

const toKey = (sec: number) => new Date(sec * 1000).toISOString().slice(0, 10);
const fromKey = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 1000);
};
const nowSec = () => Math.floor(Date.now() / 1000);
const todayStart = () => Math.floor(nowSec() / DAY) * DAY;
const symLabel = (s: string) => s.replace(/USDT$/, '/USDT');
const tfLabel = (i: Interval) => INTERVALS.find((x) => x.key === i)!.label;

export function DataSourcePicker({ onLoad, busy }: { onLoad: (ref: DataRef, candles: Candle[], market: string) => void; busy?: boolean }) {
  const { items: datasets } = useCollection<Dataset>(DATASETS);
  const [source, setSource] = useState<Source>('binance');
  const [importOpen, setImportOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  // Public feed
  const [symbol, setSymbol] = useState(PUBLIC_SYMBOLS[0]);
  const [pubInterval, setPubInterval] = useState<Interval>('1h');
  const [pubDate, setPubDate] = useState(() => toKey(todayStart() - 60 * DAY));
  const yesterday = toKey(todayStart() - DAY);

  // Imported
  const [dsId, setDsId] = useState<string>('');
  const ds = useMemo(() => datasets.find((d) => d.id === dsId) ?? datasets[0] ?? null, [datasets, dsId]);
  const dsIntervals = useMemo(() => (ds ? availableIntervals(ds.baseInterval) : []), [ds]);
  const [impInterval, setImpInterval] = useState<Interval>('1h');
  const [impDate, setImpDate] = useState('');
  const dsMin = ds && ds.candles.length ? toKey(ds.candles[0].t) : '';
  const dsMax = ds && ds.candles.length ? toKey(ds.candles[ds.candles.length - 1].t) : '';

  // Keep imported controls valid when the dataset changes.
  useEffect(() => {
    if (!ds) return;
    setImpInterval((cur) => (availableIntervals(ds.baseInterval).includes(cur) ? cur : ds.baseInterval));
    setImpDate((cur) => (cur && cur >= dsMin && cur <= dsMax ? cur : dsMin));
  }, [ds, dsMin, dsMax]);

  useEffect(() => {
    setError(null);
    setUnavailable(false);
  }, [source]);

  const randomPublicDate = () => {
    const long = pubInterval === '1d' || pubInterval === '4h';
    const span = long ? 3 * 365 * DAY : 365 * DAY;
    const lo = Math.max(fromKey(BINANCE_MIN_DATE), todayStart() - span);
    // leave room for a full session after the start where possible
    const hi = Math.max(lo, todayStart() - Math.min(MAX_BARS * intervalSec(pubInterval), span / 2));
    setPubDate(toKey(lo + Math.floor(Math.random() * ((hi - lo) / DAY + 1)) * DAY));
  };

  const randomImportDate = () => {
    if (!ds) return;
    const bars = resample(ds.candles, ds.baseInterval, impInterval);
    if (bars.length <= MIN_BARS) {
      setImpDate(dsMin);
      return;
    }
    // any start that still leaves at least MIN_BARS candles to replay
    // (the day containing bar i starts at or before it, so ≥ len − i bars follow)
    const lastIdx = bars.length - MIN_BARS;
    const idx = Math.floor(Math.random() * (lastIdx + 1));
    setImpDate(toKey(bars[idx].t));
  };

  const load = async () => {
    setError(null);
    setUnavailable(false);
    setLoading(true);
    try {
      if (source === 'binance') {
        const start = fromKey(pubDate || yesterday);
        let candles: Candle[];
        try {
          candles = await fetchBinance(symbol, pubInterval, start, MAX_BARS);
        } catch (e) {
          setUnavailable(true);
          throw e;
        }
        if (candles.length < MIN_BARS) {
          throw new Error(
            candles.length === 0
              ? 'No historical candles exist for this start date. Choose an earlier date.'
              : `Only ${candles.length} ${tfLabel(pubInterval)} candles exist after this start date — at least ${MIN_BARS} are needed to practise. Choose an earlier date or a smaller timeframe.`,
          );
        }
        const ref: DataRef = { source: 'binance', symbol, interval: pubInterval, start: candles[0].t, end: candles[candles.length - 1].t };
        onLoad(ref, candles, symLabel(symbol));
      } else {
        if (!ds) {
          setUnavailable(true);
          throw new Error('No imported dataset selected.');
        }
        const start = impDate ? fromKey(impDate) : 0;
        const candles = resample(ds.candles, ds.baseInterval, impInterval)
          .filter((c) => c.t >= start)
          .slice(0, MAX_BARS);
        if (candles.length < MIN_BARS) {
          throw new Error(
            `Only ${candles.length} ${tfLabel(impInterval)} candles are available from this start date — at least ${MIN_BARS} are needed to practise. Choose an earlier date or a smaller timeframe.`,
          );
        }
        const ref: DataRef = { source: 'import', datasetId: ds.id, interval: impInterval, start: candles[0].t, end: candles[candles.length - 1].t };
        onLoad(ref, candles, ds.symbol);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Historical data could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  const working = loading || !!busy;
  const noDatasets = source === 'import' && datasets.length === 0;

  return (
    <motion.div className="glass pad pd-picker" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE }}>
      <div className="pd-picker-head">
        <span className="pd-label">Practice data</span>
        <SegControl<Source>
          options={[
            { value: 'binance', label: 'Public crypto data' },
            { value: 'import', label: 'Imported dataset' },
          ]}
          value={source}
          onChange={setSource}
        />
        <div className="pd-source-line">
          {source === 'import' ? (
            <span className="pd-badge-import">
              <Database size={11} /> {SOURCE_LABEL.import}
            </span>
          ) : (
            <span>{SOURCE_LABEL.binance}</span>
          )}
          {source === 'import' && <span>Your own CSV history</span>}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={source} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.35, ease: EASE }}>
          {source === 'binance' ? (
            <div className="pd-picker-grid">
              <Field label="Market">
                <select className="select" value={symbol} onChange={(e) => setSymbol(e.target.value)}>
                  {PUBLIC_SYMBOLS.map((s) => (
                    <option key={s} value={s}>
                      {symLabel(s)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Start date (UTC)">
                <div className="pd-date-row">
                  <input className="input" type="date" value={pubDate} min={BINANCE_MIN_DATE} max={yesterday} onChange={(e) => setPubDate(e.target.value)} />
                  <button type="button" className="btn btn-sm btn-ghost" onClick={randomPublicDate} title="Random historical date — prices still come from the real feed">
                    <Shuffle size={13} /> Random
                  </button>
                </div>
              </Field>
              <div className="full">
                <span className="pd-label">Timeframe</span>
                <Chips options={INTERVALS.map((i) => i.key)} value={pubInterval} onChange={setPubInterval} />
              </div>
            </div>
          ) : noDatasets ? (
            <div className="pd-unavailable">
              <div className="pd-note warn">
                <AlertTriangle size={14} />
                <span>{UNAVAILABLE}</span>
              </div>
              <button type="button" className="btn btn-sm" onClick={() => setImportOpen(true)}>
                <Upload size={13} /> Import historical data
              </button>
            </div>
          ) : (
            <div className="pd-picker-grid">
              <Field label="Dataset">
                <select className="select" value={ds?.id ?? ''} onChange={(e) => setDsId(e.target.value)}>
                  {datasets.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.symbol} · {d.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Start date (UTC)">
                <div className="pd-date-row">
                  <input className="input" type="date" value={impDate} min={dsMin} max={dsMax} onChange={(e) => setImpDate(e.target.value)} />
                  <button type="button" className="btn btn-sm btn-ghost" onClick={randomImportDate} title="Random date within this dataset">
                    <Shuffle size={13} /> Random
                  </button>
                </div>
              </Field>
              <div className="full">
                <span className="pd-label">Timeframe</span>
                <Chips options={dsIntervals} value={impInterval} onChange={setImpInterval} />
              </div>
              {ds && ds.candles.length > 0 && (
                <div className="full pd-range">
                  Available: {fmtTime(ds.candles[0].t, '1d')} → {fmtTime(ds.candles[ds.candles.length - 1].t, '1d')} · {ds.candles.length.toLocaleString()} {tfLabel(ds.baseInterval)} candles
                  {ds.gaps ? ` · ${ds.gaps.toLocaleString()} gaps (never filled)` : ''}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: EASE }}>
            <div className="pd-unavailable">
              <div className="pd-note bad" role="alert">
                <AlertTriangle size={14} />
                <span>{error}</span>
              </div>
              {unavailable && (
                <>
                  <div className="pd-range">{UNAVAILABLE}</div>
                  <button type="button" className="btn btn-sm" onClick={() => setImportOpen(true)}>
                    <Upload size={13} /> Import historical data
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pd-load">
        <span className="pd-range">Up to {MAX_BARS} real candles from the start date · minimum {MIN_BARS}</span>
        <motion.button type="button" className="btn btn-primary" disabled={working || noDatasets} onClick={() => void load()} whileTap={{ scale: 0.98 }} aria-busy={working}>
          {working ? (
            <>
              <Loader2 size={14} className="pd-spin" /> Loading…
            </>
          ) : (
            'Load chart'
          )}
        </motion.button>
      </div>

      <DataImport
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImported={(d) => {
          setDsId(d.id);
          setSource('import');
          setImportOpen(false);
        }}
      />
    </motion.div>
  );
}

function Chips({ options, value, onChange }: { options: Interval[]; value: Interval; onChange: (i: Interval) => void }) {
  return (
    <div className="pd-chips" role="radiogroup" style={{ marginTop: 8 }}>
      {options.map((k) => (
        <button key={k} type="button" role="radio" aria-checked={value === k} className={cx('chip', value === k && 'on')} onClick={() => onChange(k)}>
          {tfLabel(k)}
        </button>
      ))}
    </div>
  );
}
