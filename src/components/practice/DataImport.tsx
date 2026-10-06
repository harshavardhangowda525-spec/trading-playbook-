import { useCallback, useRef, useState, type DragEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ChevronRight, Database, FileText, Info, Trash2, UploadCloud } from 'lucide-react';
import { Field, Modal, cx } from '../ui';
import { useCollection } from '../../lib/hooks';
import { newId } from '../../lib/store';
import { DATASETS, INTERVALS, fmtPrice, fmtTime, type Dataset, type Interval } from '../../lib/market';
import { MAX_IMPORT_ROWS, countGaps, parseMarketCSV, type ParseResult } from '../../lib/csv';
import '../../styles/practice-data.css';

const EASE = [0.22, 1, 0.36, 1] as const;
const EXCHANGES = new Set(['BINANCE', 'COINBASE', 'KRAKEN', 'BITSTAMP', 'BYBIT', 'NASDAQ', 'NYSE', 'AMEX', 'ARCA', 'BATS', 'CBOE', 'CME', 'CME_MINI', 'FX', 'FX_IDC', 'OANDA', 'FOREXCOM', 'FXCM', 'PEPPERSTONE', 'TVC', 'SP', 'CAPITALCOM', 'ICMARKETS', 'SAXO']);

const tfLabel = (i: Interval | null) => (i ? INTERVALS.find((x) => x.key === i)!.label : '—');
const n0 = (n: number) => n.toLocaleString();

/** Best guess at a ticker from a file name, e.g. "BINANCE_BTCUSDT, 60.csv" → BTCUSDT. */
function guessSymbol(fileName: string): string {
  const tokens = fileName
    .replace(/\.[^.]+$/, '')
    .split(/[\s,_]+/)
    .filter((t) => /^[A-Za-z0-9.^=/-]{1,15}$/.test(t) && /[A-Za-z]/.test(t));
  if (!tokens.length) return '';
  const pick = EXCHANGES.has(tokens[0].toUpperCase()) && tokens[1] ? tokens[1] : tokens[0];
  return pick.toUpperCase().slice(0, 15);
}

function Badge() {
  return (
    <span className="pd-badge-import">
      <Database size={11} /> USER-IMPORTED DATA
    </span>
  );
}

interface Parsed {
  fileName: string;
  result: ParseResult;
  truncated: number; // rows dropped by the 50k limit (oldest)
  candles: ParseResult['candles'];
  gaps: number;
}

export function DataImport({ open, onClose, onImported }: { open: boolean; onClose: () => void; onImported?: (ds: Dataset) => void }) {
  const { items: datasets, save, remove } = useCollection<Dataset>(DATASETS);
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [reading, setReading] = useState(false);
  const [readError, setReadError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [showIssues, setShowIssues] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const reset = useCallback(() => {
    setParsed(null);
    setSymbol('');
    setName('');
    setShowIssues(false);
    setReadError(null);
    setSaveError(null);
  }, []);

  const handleFile = useCallback(async (file: File | undefined) => {
    if (!file) return;
    setReading(true);
    setReadError(null);
    setSavedMsg(null);
    setSaveError(null);
    setShowIssues(false);
    try {
      if (file.size > 80 * 1024 * 1024) throw new Error('This file is larger than 80 MB — export a shorter date range.');
      const text = await file.text();
      const result = parseMarketCSV(text, file.name);
      const truncated = Math.max(0, result.candles.length - MAX_IMPORT_ROWS);
      const candles = truncated ? result.candles.slice(-MAX_IMPORT_ROWS) : result.candles;
      setParsed({ fileName: file.name, result, truncated, candles, gaps: truncated ? countGaps(candles, result.baseInterval) : result.gaps });
      setSymbol(guessSymbol(file.name));
      setName('');
    } catch (e) {
      setParsed(null);
      setReadError(e instanceof Error ? e.message : 'The file could not be read.');
    } finally {
      setReading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }, []);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    void handleFile(e.dataTransfer.files?.[0]);
  };

  const r = parsed?.result;
  const canSave = !!parsed && !!r && !r.fatal && !!r.baseInterval && parsed.candles.length >= 2 && symbol.trim().length > 0;
  const autoName = parsed && r ? `${symbol.trim().toUpperCase() || 'Dataset'} ${tfLabel(r.baseInterval)} · ${parsed.fileName.replace(/\.[^.]+$/, '')}` : '';

  const doSave = () => {
    if (!parsed || !r || !r.baseInterval || !canSave) return;
    const ds: Dataset = {
      id: newId(),
      name: name.trim() || autoName,
      symbol: symbol.trim().toUpperCase(),
      baseInterval: r.baseInterval,
      candles: parsed.candles,
      importedAt: Date.now(),
      fileName: parsed.fileName,
      rows: r.rows,
      rejected: r.rejected,
      gaps: parsed.gaps,
    };
    try {
      save(ds);
    } catch (e) {
      setSaveError(e instanceof Error ? `Could not save the dataset: ${e.message}` : 'Could not save the dataset.');
      return;
    }
    setSavedMsg(`Saved “${ds.name}” — ${n0(ds.candles.length)} candles.`);
    reset();
    onImported?.(ds);
  };

  const first = parsed ? parsed.candles.slice(0, 3) : [];
  const last = parsed && parsed.candles.length > 6 ? parsed.candles.slice(-3) : parsed ? parsed.candles.slice(3, 6) : [];
  const ordered = [...datasets].sort((a, b) => b.importedAt - a.importedAt);

  return (
    <Modal open={open} onClose={onClose} title="Import historical data" wide>
      <div className="pd-import">
        <div className="pd-import-intro">
          <p>Bring your own real market history — a CSV export from TradingView, Yahoo Finance or your broker. It stays in your workspace and is used for chart replay practice only.</p>
          <Badge />
        </div>

        <div
          className={cx('pd-drop', over && 'over')}
          role="button"
          tabIndex={0}
          aria-label="Drop a CSV file here or click to browse"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), inputRef.current?.click())}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={onDrop}
        >
          <UploadCloud size={26} strokeWidth={1.2} />
          <div className="pd-drop-title">{reading ? 'READING FILE…' : 'DROP A CSV FILE HERE'}</div>
          <div className="pd-drop-sub">or click to browse · .csv / .txt</div>
          <input ref={inputRef} type="file" accept=".csv,.txt,.tsv,text/csv,text/plain" onChange={(e) => void handleFile(e.target.files?.[0])} />
        </div>

        <div className="pd-formats">
          Supported: TradingView, Yahoo Finance and broker/MetaTrader CSV exports with a header row — <code>Date</code> (or <code>Date</code> + <code>Time</code>, <code>Datetime</code>, <code>Timestamp</code>),{' '}
          <code>Open</code>, <code>High</code>, <code>Low</code>, <code>Close</code> and optional <code>Volume</code>. Comma, semicolon or tab separated. Dates as ISO, YYYY-MM-DD [HH:MM], MM/DD/YYYY, DD/MM/YYYY or UNIX
          seconds/milliseconds; times without a zone are read as UTC. Timeframes 1m – 1D.
        </div>

        {readError && (
          <div className="pd-note bad" role="alert">
            <AlertTriangle size={15} />
            {readError}
          </div>
        )}
        {savedMsg && !parsed && <div className="pd-saved">{savedMsg}</div>}

        <AnimatePresence mode="wait">
          {parsed && r && (
            <motion.section
              key={parsed.fileName + r.rows}
              className="pd-report"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <div className="pd-report-head">
                <div className="pd-file">
                  <FileText size={16} strokeWidth={1.4} />
                  <span>{parsed.fileName}</span>
                </div>
                <span className="pd-label">Validation report</span>
              </div>

              {r.fatal ? (
                <div className="pd-note bad" role="alert">
                  <AlertTriangle size={15} />
                  <span>
                    {r.fatal} Nothing from this file can be imported.
                  </span>
                </div>
              ) : (
                <>
                  <div className="pd-stats">
                    <Stat label="Rows in file" value={n0(r.rows)} />
                    <Stat label="Valid candles" value={n0(parsed.candles.length)} />
                    <Stat label="Rejected rows" value={n0(r.rejected)} tone={r.rejected ? 'bad' : undefined} />
                    <Stat label="Timeframe" value={r.baseInterval ? tfLabel(r.baseInterval) : 'Unsupported'} tone={r.baseInterval ? undefined : 'warn'} />
                    <Stat label="Gaps (missing bars)" value={n0(parsed.gaps)} tone={parsed.gaps ? 'warn' : undefined} />
                    <Stat
                      label="Available range"
                      small
                      value={
                        parsed.candles.length
                          ? `${fmtTime(parsed.candles[0].t, r.baseInterval ?? undefined)} → ${fmtTime(parsed.candles[parsed.candles.length - 1].t, r.baseInterval ?? undefined)}`
                          : '—'
                      }
                    />
                  </div>

                  <div className="pd-note">
                    <Info size={14} />
                    <span>
                      Missing bars are shown as gaps — never filled. Columns read: {r.columns.time}, {r.columns.open}, {r.columns.high}, {r.columns.low}, {r.columns.close}
                      {r.columns.volume ? `, ${r.columns.volume}` : ' (no volume column — volume set to 0)'}.
                    </span>
                  </div>

                  {parsed.truncated > 0 && (
                    <div className="pd-note warn">
                      <AlertTriangle size={14} />
                      <span>
                        This file has more than {n0(MAX_IMPORT_ROWS)} rows. Only the most recent {n0(MAX_IMPORT_ROWS)} candles will be kept ({n0(parsed.truncated)} older candles dropped).
                      </span>
                    </div>
                  )}
                  {!r.baseInterval && (
                    <div className="pd-note warn">
                      <AlertTriangle size={14} />
                      <span>The spacing between bars doesn’t match a supported timeframe (1m, 5m, 15m, 30m, 1H, 4H, 1D), so this file can’t be used for replay.</span>
                    </div>
                  )}
                  {r.baseInterval && parsed.candles.length < 60 && (
                    <div className="pd-note warn">
                      <AlertTriangle size={14} />
                      <span>Only {parsed.candles.length} valid candles — practice sessions need at least 60.</span>
                    </div>
                  )}

                  {r.issues.length > 0 && (
                    <div>
                      <button type="button" className={cx('pd-issues-toggle', showIssues && 'open')} onClick={() => setShowIssues((v) => !v)} aria-expanded={showIssues}>
                        <ChevronRight size={13} />
                        {showIssues ? 'Hide' : 'Show'} issues ({r.rejected > r.issues.length ? `first ${r.issues.length} of ${n0(r.rejected)}` : r.issues.length})
                      </button>
                      <AnimatePresence initial={false}>
                        {showIssues && (
                          <motion.ul
                            className="pd-issues"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: EASE }}
                          >
                            {r.issues.map((i, k) => (
                              <li key={k}>
                                <span>Row {i.row}</span>
                                <span>{i.message}</span>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {parsed.candles.length > 0 && (
                    <div>
                      <div className="pd-label" style={{ marginBottom: 8 }}>
                        Preview · first / last rows
                      </div>
                      <div className="table-wrap">
                        <table className="table pd-preview">
                          <thead>
                            <tr>
                              <th>Time (UTC)</th>
                              <th>Open</th>
                              <th>High</th>
                              <th>Low</th>
                              <th>Close</th>
                              <th>Volume</th>
                            </tr>
                          </thead>
                          <tbody>
                            {first.map((k) => (
                              <PreviewRow key={k.t} k={k} interval={r.baseInterval} />
                            ))}
                            {parsed.candles.length > 6 && (
                              <tr className="pd-sep">
                                <td colSpan={6}>· · ·</td>
                              </tr>
                            )}
                            {last.map((k) => (
                              <PreviewRow key={k.t} k={k} interval={r.baseInterval} />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="pd-form">
                    <Field label="Symbol / market *">
                      <input className="input" value={symbol} maxLength={24} placeholder="e.g. SPY, EURUSD" onChange={(e) => setSymbol(e.target.value)} />
                    </Field>
                    <Field label="Dataset name">
                      <input className="input" value={name} maxLength={80} placeholder={autoName} onChange={(e) => setName(e.target.value)} />
                    </Field>
                  </div>
                  {saveError && (
                    <div className="pd-note bad" role="alert">
                      <AlertTriangle size={14} />
                      {saveError}
                    </div>
                  )}
                </>
              )}

              <div className="pd-actions">
                <button type="button" className="btn btn-ghost" onClick={reset}>
                  {r.fatal ? 'Choose another file' : 'Discard'}
                </button>
                {!r.fatal && (
                  <motion.button type="button" className="btn btn-primary" disabled={!canSave} onClick={doSave} whileTap={{ scale: 0.98 }} title={!symbol.trim() ? 'Enter a symbol first' : undefined}>
                    Save dataset
                  </motion.button>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <section className="pd-datasets">
          <div className="pd-label">Imported datasets · {datasets.length}</div>
          {ordered.length === 0 ? (
            <div className="pd-range">No datasets yet. Imported data appears here and in the Practice Lab’s data source picker.</div>
          ) : (
            ordered.map((ds) => (
              <motion.div key={ds.id} className="pd-ds" layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }}>
                <div className="pd-ds-main">
                  <div className="pd-ds-title">
                    <strong>{ds.symbol}</strong>
                    <span>{ds.name}</span>
                  </div>
                  <div className="pd-ds-meta">
                    {tfLabel(ds.baseInterval)} · {ds.candles.length ? `${fmtTime(ds.candles[0].t, '1d')} → ${fmtTime(ds.candles[ds.candles.length - 1].t, '1d')}` : 'empty'} · {n0(ds.candles.length)} candles
                    {ds.gaps ? ` · ${n0(ds.gaps)} gaps` : ''}
                  </div>
                </div>
                <div className="pd-ds-actions">
                  {confirmId === ds.id ? (
                    <>
                      <button type="button" className="btn btn-sm btn-ghost" onClick={() => setConfirmId(null)}>
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          remove(ds.id);
                          setConfirmId(null);
                        }}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button type="button" className="btn btn-sm btn-ghost" onClick={() => setConfirmId(ds.id)} aria-label={`Delete ${ds.name}`}>
                      <Trash2 size={13} /> Delete
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </section>
      </div>
    </Modal>
  );
}

function Stat({ label, value, tone, small }: { label: string; value: string; tone?: 'bad' | 'warn'; small?: boolean }) {
  return (
    <div className="pd-stat">
      <span className="pd-label">{label}</span>
      <span className={cx('pd-stat-value', small && 'sm', tone)}>{value}</span>
    </div>
  );
}

function PreviewRow({ k, interval }: { k: { t: number; o: number; h: number; l: number; c: number; v: number }; interval: Interval | null }) {
  return (
    <tr>
      <td>{fmtTime(k.t, interval ?? undefined)}</td>
      <td>{fmtPrice(k.o)}</td>
      <td>{fmtPrice(k.h)}</td>
      <td>{fmtPrice(k.l)}</td>
      <td>{fmtPrice(k.c)}</td>
      <td>{n0(k.v)}</td>
    </tr>
  );
}
