import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Database, Loader2, Shuffle, Upload } from 'lucide-react';
import { Field, cx } from '../ui';
import { INTERVALS, type Candle, type DataRef, type Interval } from '../../lib/market';
import { etfBars, intervalsFor, sourceLabel, useEtfDatasets } from '../../lib/etf/data';
import { SESSIONS, localTime } from '../../lib/etf/calendar';
import { DataImport } from './DataImport';
import '../../styles/practice-data.css';

const EASE = [0.22, 1, 0.36, 1] as const;
const MAX_BARS = 600;
const MIN_BARS = 60;
const UNAVAILABLE = 'No ETF data yet — import an intraday CSV or fetch from Upstox to begin practice.';

const tfLabel = (i: Interval) => INTERVALS.find((x) => x.key === i)!.label;

/** ETF-only data picker for Replay: real imported/fetched ETF history, regular session only. */
export function DataSourcePicker({ onLoad, busy }: { onLoad: (ref: DataRef, candles: Candle[], market: string) => void; busy?: boolean }) {
  const datasets = useEtfDatasets();
  const [importOpen, setImportOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dsId, setDsId] = useState<string>('');
  const x = useMemo(() => datasets.find((d) => d.ds.id === dsId) ?? datasets[0] ?? null, [datasets, dsId]);
  const ivs = useMemo(() => (x ? intervalsFor(x.ds) : []), [x]);
  const [interval, setInterval_] = useState<Interval>('5m');
  const days = useMemo(() => (x ? etfBars(x, x.ds.baseInterval).quality.days : []), [x]);
  const [day, setDay] = useState('');

  useEffect(() => {
    if (!x) return;
    setInterval_((cur) => (intervalsFor(x.ds).includes(cur) ? cur : x.ds.baseInterval));
    setDay((cur) => (cur && days.includes(cur) ? cur : days[Math.max(0, days.length - 3)] ?? ''));
  }, [x, days]);

  const randomDay = () => {
    if (days.length) setDay(days[Math.floor(Math.random() * days.length)]);
  };

  const load = () => {
    setError(null);
    if (!x) {
      setError('No ETF dataset selected.');
      return;
    }
    setLoading(true);
    try {
      const { bars } = etfBars(x, interval);
      const startIdx = bars.findIndex((k) => localTime(k.t, SESSIONS[x.etf.exchange].timeZone).day >= day);
      const candles = bars.slice(Math.max(0, startIdx), Math.max(0, startIdx) + MAX_BARS);
      if (candles.length < MIN_BARS) {
        throw new Error(`Only ${candles.length} ${tfLabel(interval)} session candles from this day — at least ${MIN_BARS} are needed. Pick an earlier day or a smaller timeframe.`);
      }
      const ref: DataRef = { source: 'import', datasetId: x.ds.id, interval, start: candles[0].t, end: candles[candles.length - 1].t };
      onLoad(ref, candles, x.etf.symbol);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Historical data could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  const working = loading || !!busy;
  const none = datasets.length === 0;

  return (
    <motion.div className="glass pad pd-picker" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: EASE }}>
      <div className="pd-picker-head">
        <span className="pd-label">ETF practice data</span>
        <div className="pd-source-line">
          <span className="pd-badge-import">
            <Database size={11} /> HISTORICAL ETF DATA
          </span>
          {x && <span>{sourceLabel(x.ds)}</span>}
        </div>
      </div>

      {none ? (
        <div className="pd-unavailable">
          <div className="pd-note warn">
            <AlertTriangle size={14} />
            <span>{UNAVAILABLE}</span>
          </div>
          <button type="button" className="btn btn-sm" onClick={() => setImportOpen(true)}>
            <Upload size={13} /> Import or fetch ETF data
          </button>
        </div>
      ) : (
        <div className="pd-picker-grid">
          <Field label="ETF dataset">
            <select className="select" value={x?.ds.id ?? ''} onChange={(e) => setDsId(e.target.value)}>
              {datasets.map((d) => (
                <option key={d.ds.id} value={d.ds.id}>
                  {d.etf.symbol} · {d.ds.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label={`Start session (${x?.etf.exchange === 'US' ? 'ET' : 'IST'})`}>
            <div className="pd-date-row">
              <select className="select" value={day} onChange={(e) => setDay(e.target.value)} aria-label="Start session">
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <button type="button" className="btn btn-sm btn-ghost" onClick={randomDay} title="Random session from this dataset">
                <Shuffle size={13} /> Random
              </button>
            </div>
          </Field>
          <div className="full">
            <span className="pd-label">Timeframe</span>
            <Chips options={ivs} value={interval} onChange={setInterval_} />
          </div>
          {x && (
            <div className="full pd-range">
              {x.etf.name} · {days.length} sessions · {days[0]} → {days[days.length - 1]} · regular session only
              {x.ds.gaps ? ` · ${x.ds.gaps.toLocaleString()} gaps (never filled)` : ''}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="pd-unavailable">
          <div className="pd-note bad" role="alert">
            <AlertTriangle size={14} />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="pd-load">
        <button type="button" className="btn btn-sm btn-ghost" onClick={() => setImportOpen(true)}>
          <Upload size={13} /> Import / fetch
        </button>
        <span className="pd-range">Up to {MAX_BARS} real session candles · minimum {MIN_BARS}</span>
        <motion.button type="button" className="btn btn-primary" disabled={working || none} onClick={load} whileTap={{ scale: 0.98 }} aria-busy={working}>
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
