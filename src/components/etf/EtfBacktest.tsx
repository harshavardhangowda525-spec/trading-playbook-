import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Database, FlaskConical, Play, Save, ShieldCheck, Trash2, Upload } from 'lucide-react';
import { Field, NumberInput, SegControl, cx } from '../ui';
import { PracticeChart } from '../practice/PracticeChart';
import { DataImport } from '../practice/DataImport';
import { ReportView } from './ReportView';
import { RiskCostSettings } from './RiskCostSettings';
import { EligibilityTable } from './EligibilityTable';
import { INTERVALS, intervalSec, type Interval } from '../../lib/market';
import { etfBars, intervalsFor, sourceLabel, useEtfDatasets } from '../../lib/etf/data';
import { runBacktest, type BacktestConfig, type BacktestResult } from '../../lib/etf/backtest';
import { assessEligibility } from '../../lib/etf/eligibility';
import { useBacktestRuns, useEtfConfig, type BacktestRun } from '../../lib/etf/config';
import { metricsBy, type Metrics } from '../../lib/etf/metrics';
import { backtestReport } from '../../lib/etf/report';
import { SESSIONS, fmtLocal } from '../../lib/etf/calendar';
import { STRATEGIES, defaultParams, strategyById, type StrategyId } from '../../lib/etf/strategies';
import { fmtMoney } from '../../lib/etf/universe';
import { newId } from '../../lib/store';
import '../../styles/etf.css';

const ease = [0.22, 1, 0.36, 1] as const;
const tf = (i: Interval) => INTERVALS.find((x) => x.key === i)!.label;

export function EtfBacktest() {
  const datasets = useEtfDatasets();
  const { cfg } = useEtfConfig();
  const runs = useBacktestRuns();
  const [importOpen, setImportOpen] = useState(false);
  const [dsId, setDsId] = useState('');
  const x = useMemo(() => datasets.find((d) => d.ds.id === dsId) ?? datasets[0] ?? null, [datasets, dsId]);
  const [interval, setInterval_] = useState<Interval>('5m');
  const [strategy, setStrategy] = useState<StrategyId>('trend');
  const [params, setParams] = useState<Record<string, number>>(defaultParams('trend'));
  const [trainPct, setTrainPct] = useState(70);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [result, setResult] = useState<{ cfg: BacktestConfig; r: BacktestResult; datasetId: string } | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const all = useMemo(() => (x ? etfBars(x, x.ds.baseInterval) : null), [x]);
  const days = all?.quality.days ?? [];
  useEffect(() => {
    if (!x) return;
    setInterval_((cur) => (intervalsFor(x.ds).includes(cur) ? cur : x.ds.baseInterval));
    setFrom(days[0] ?? '');
    setTo(days[days.length - 1] ?? '');
    setResult(null);
  }, [x]); // eslint-disable-line react-hooks/exhaustive-deps

  const pickStrategy = (s: StrategyId) => {
    setStrategy(s);
    setParams(defaultParams(s));
  };

  const range = useMemo(() => (x ? etfBars(x, interval, from || undefined, to || undefined) : null), [x, interval, from, to]);
  const costs = x?.etf.exchange === 'US' ? cfg.costsUS : cfg.costsNSE;
  const elig = useMemo(
    () => (x && range ? assessEligibility(range.bars, intervalSec(interval), x.etf, costs, (cfg.risk.capital * Math.min(cfg.risk.maxPositionPct, 50)) / 100) : null),
    [x, range, interval, costs, cfg.risk],
  );

  // Parameter-tweaking guard: how many different settings were already tested on this data?
  const tries = useMemo(() => {
    if (!x) return 0;
    const sets = new Set(runs.items.filter((r) => r.datasetId === x.ds.id && r.config.strategy === strategy && r.config.interval === interval).map((r) => JSON.stringify(r.config.params)));
    return sets.size;
  }, [runs.items, x, strategy, interval]);

  const run = () => {
    if (!x || !elig || elig.verdict === 'not-eligible') return;
    const c: BacktestConfig = {
      symbol: x.etf.symbol,
      exchange: x.etf.exchange,
      interval,
      intervalSec: intervalSec(interval),
      strategy,
      params,
      risk: cfg.risk,
      costs,
      sttApplies: x.etf.stt,
      trainPct,
      from: from || undefined,
      to: to || undefined,
    };
    const bars = etfBars(x, interval).bars;
    setResult({ cfg: c, r: runBacktest(bars, c), datasetId: x.ds.id });
    setSavedId(null);
  };

  const save = () => {
    if (!result || !x) return;
    const { days: _d, ...q } = result.r.quality;
    void _d;
    const rec: BacktestRun = { id: newId(), createdAt: Date.now(), datasetId: result.datasetId, datasetName: x.ds.name, config: result.cfg, result: { ...result.r, quality: q } };
    runs.save(rec);
    setSavedId(rec.id);
  };

  const st = strategyById(strategy);
  const report = result ? backtestReport(result.cfg, result.r) : null;
  const chartBars = range?.bars ?? [];
  const markers = useMemo(
    () =>
      (result?.r.trades ?? []).flatMap((t) => [
        { t: t.entryT, kind: 'fill' as const, text: `${t.side === 'long' ? 'L' : 'S'} ${t.entryFill.toFixed(2)}`, position: t.side === 'long' ? ('below' as const) : ('above' as const) },
        { t: t.exitT, kind: 'exit' as const, text: `${t.exitReason} ${t.net >= 0 ? '+' : ''}${t.net.toFixed(0)}` },
      ]),
    [result],
  );

  if (!datasets.length) {
    return (
      <div className="glass pad etf-empty">
        <Database size={20} />
        <div>
          <b>No ETF data yet</b>
          <p className="small muted">
            Backtests run only on real historical ETF candles. Import an intraday CSV (IST timestamps) or fetch from Upstox. No sample or generated data is ever used.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setImportOpen(true)}>
          <Upload size={14} /> Import or fetch ETF data
        </button>
        <DataImport open={importOpen} onClose={() => setImportOpen(false)} onImported={(d) => setDsId(d.id)} />
      </div>
    );
  }

  return (
    <div className="etf">
      <motion.section className="glass pad etf-panel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
        <div className="etf-head">
          <div>
            <div className="mono-label">Historical backtest</div>
            <div className="etf-title">
              <FlaskConical size={16} /> Test a strategy objectively
            </div>
          </div>
          <button className="btn btn-sm btn-ghost" onClick={() => setImportOpen(true)}>
            <Upload size={13} /> Import / fetch data
          </button>
        </div>

        <div className="etf-grid">
          <Field label="ETF dataset">
            <select className="select" value={x?.ds.id ?? ''} onChange={(e) => setDsId(e.target.value)}>
              {datasets.map((d) => (
                <option key={d.ds.id} value={d.ds.id}>
                  {d.etf.symbol} · {d.ds.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="From session">
            <select className="select" value={from} onChange={(e) => setFrom(e.target.value)}>
              {days.map((d) => (
                <option key={d} value={d} disabled={!!to && d > to}>
                  {d}
                </option>
              ))}
            </select>
          </Field>
          <Field label="To session">
            <select className="select" value={to} onChange={(e) => setTo(e.target.value)}>
              {days.map((d) => (
                <option key={d} value={d} disabled={!!from && d < from}>
                  {d}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Timeframe">
            <SegControl<Interval> options={(x ? intervalsFor(x.ds) : []).map((i) => ({ value: i, label: tf(i) }))} value={interval} onChange={setInterval_} />
          </Field>
        </div>
        {x && <div className="etf-source mono tiny">{sourceLabel(x.ds)} · times in {SESSIONS[x.etf.exchange].label}</div>}

        <div className="etf-sub">Strategy</div>
        <div className="etf-strats" role="radiogroup" aria-label="Strategy">
          {STRATEGIES.map((s) => (
            <button key={s.id} type="button" role="radio" aria-checked={strategy === s.id} className={cx('etf-strat', strategy === s.id && 'on')} onClick={() => pickStrategy(s.id)}>
              <b>
                {s.letter}. {s.name}
              </b>
              <span>{s.summary}</span>
            </button>
          ))}
        </div>
        <details className="etf-rules">
          <summary>Rules of {st.name} (educational template — test it, don’t trust it)</summary>
          <RuleList title="Entry" items={st.entry} />
          <RuleList title="Exit" items={st.exits} />
          <RuleList title="Invalidation" items={st.invalidation} />
          <RuleList title="Don’t use it when" items={st.avoid} />
        </details>
        <div className="etf-grid">
          {st.params.map((p) => (
            <Field key={p.key} label={p.label} hint={p.help}>
              <NumberInput value={params[p.key]} onChange={(v) => v != null && setParams((cur) => ({ ...cur, [p.key]: Math.min(p.max, Math.max(p.min, v)) }))} />
            </Field>
          ))}
          <Field label="Training share of sessions (%)" hint="The rest is out-of-sample">
            <NumberInput value={trainPct} onChange={(v) => v != null && setTrainPct(Math.min(90, Math.max(50, Math.round(v))))} />
          </Field>
        </div>
        <RiskCostSettings exchange={x?.etf.exchange ?? 'NSE'} compact />

        {elig && (
          <div className={cx('etf-elig', elig.verdict)}>
            <div className="etf-elig-head">
              <ShieldCheck size={15} />
              <b>
                {elig.verdict === 'eligible' ? 'Eligible for simulation' : elig.verdict === 'caution' ? 'Usable with caution' : 'Not eligible for simulation'}
              </b>
              <span className="small muted">
                {x?.etf.symbol} · {from} → {to}
              </span>
            </div>
            <EligibilityTable e={elig} />
          </div>
        )}
        {tries >= 3 && (
          <div className="etf-warn">
            <AlertTriangle size={14} /> You have already saved {tries} different parameter sets for this strategy on this data. More tuning makes the training result look better without making it more reliable (overfitting). Judge the out-of-sample column.
          </div>
        )}
        <div className="row wrap" style={{ gap: 8, marginTop: 14 }}>
          <button type="button" className="btn btn-primary" disabled={!elig || elig.verdict === 'not-eligible'} onClick={run}>
            <Play size={14} /> Run backtest
          </button>
          {result && (
            <button type="button" className="btn" onClick={save} disabled={!!savedId}>
              <Save size={14} /> {savedId ? 'Saved' : 'Save run'}
            </button>
          )}
        </div>
      </motion.section>

      {result && x && (
        <motion.section className="etf-results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
          {result.r.warnings.length > 0 && (
            <div className="glass pad etf-panel">
              <div className="mono-label">Read these first</div>
              <ul className="etf-warnings">
                {result.r.warnings.map((w) => (
                  <li key={w}>
                    <AlertTriangle size={13} /> {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="glass pad etf-panel">
            <div className="mono-label">Performance · training vs out-of-sample</div>
            <MetricsTable
              cols={[
                { label: `All (${result.r.quality.sessions} sessions)`, m: result.r.metrics.all },
                { label: `Training (${result.r.trainDays})`, m: result.r.metrics.train },
                { label: `Out-of-sample (${result.r.testDays}${result.r.splitDay ? ` from ${result.r.splitDay}` : ''})`, m: result.r.metrics.test },
              ]}
              x={x.etf.exchange}
            />
          </div>
          <div className="glass etf-chart">
            <div className="etf-chart-head mono tiny">
              {x.etf.symbol} · {tf(interval)} · HISTORICAL · entries ▲ / exits ■ · {sourceLabel(x.ds)}
            </div>
            <PracticeChart candles={chartBars} visible={chartBars.length} interval={interval} drawings={[]} tool="cursor" readOnly markers={markers} timeZone={SESSIONS[x.etf.exchange].timeZone} height={420} />
          </div>
          <div className="glass pad etf-panel">
            <div className="mono-label">
              Simulated trades · {result.r.trades.length} · skipped signals {result.r.missed.length}
            </div>
            <TradesTable trades={result.r.trades} exchange={x.etf.exchange} tz={SESSIONS[x.etf.exchange]} />
          </div>
          {report && (
            <div className="glass pad etf-panel">
              <ReportView report={report} />
            </div>
          )}
        </motion.section>
      )}

      <RunHistory runs={runs.items} onDelete={runs.remove} />
      <DataImport open={importOpen} onClose={() => setImportOpen(false)} onImported={(d) => setDsId(d.id)} />
    </div>
  );
}

function RuleList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="etf-rule">
      <b>{title}</b>
      <ul>
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

const pct = (v: number | null) => (v == null ? '—' : `${(v * 100).toFixed(1)}%`);
const n2 = (v: number | null) => (v == null || !Number.isFinite(v) ? '—' : v.toFixed(2));

export function MetricsTable({ cols, x }: { cols: { label: string; m: Metrics }[]; x: 'NSE' | 'US' }) {
  const rows: { label: string; get: (m: Metrics) => string }[] = [
    { label: 'Trades', get: (m) => String(m.trades) },
    { label: 'Wins / losses', get: (m) => `${m.wins} / ${m.losses}` },
    { label: 'Win rate', get: (m) => pct(m.winRate) },
    { label: 'Gross P&L', get: (m) => fmtMoney(m.gross, x) },
    { label: 'Net P&L', get: (m) => fmtMoney(m.net, x) },
    { label: 'Charges', get: (m) => fmtMoney(m.charges, x) },
    { label: 'Spread & slippage', get: (m) => fmtMoney(m.friction, x) },
    { label: 'Profit factor', get: (m) => (m.profitFactor == null ? '—' : n2(m.profitFactor)) },
    { label: 'Max drawdown', get: (m) => `${fmtMoney(m.maxDrawdown, x, 0)} · ${m.maxDrawdownPct.toFixed(2)}%` },
    { label: 'Avg win / loss', get: (m) => `${fmtMoney(m.avgWin, x, 0)} / ${fmtMoney(m.avgLoss, x, 0)}` },
    { label: 'Expectancy / trade', get: (m) => fmtMoney(m.expectancy, x) },
    { label: 'Avg planned R:R', get: (m) => n2(m.avgPlannedRR) },
    { label: 'Avg result (R)', get: (m) => n2(m.avgR) },
  ];
  return (
    <div className="etf-table-wrap">
      <table className="etf-table">
        <thead>
          <tr>
            <th />
            {cols.map((c) => (
              <th key={c.label}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <td>{r.label}</td>
              {cols.map((c) => (
                <td key={c.label} className="mono">
                  {r.get(c.m)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TradesTable({ trades, exchange, tz }: { trades: BacktestResult['trades']; exchange: 'NSE' | 'US'; tz: (typeof SESSIONS)['NSE'] }) {
  if (!trades.length) return <p className="small muted">No trades — the rules never triggered, or every signal was skipped (see the report).</p>;
  return (
    <div className="etf-table-wrap">
      <table className="etf-table">
        <thead>
          <tr>
            <th>Entry</th>
            <th>Side</th>
            <th>Qty</th>
            <th>Entry fill</th>
            <th>Stop</th>
            <th>Exit</th>
            <th>Exit fill</th>
            <th>Costs</th>
            <th>Net</th>
            <th>R</th>
            <th>Set</th>
          </tr>
        </thead>
        <tbody>
          {trades.slice(0, 300).map((t) => (
            <tr key={t.id} title={t.reason}>
              <td className="mono">{fmtLocal(t.entryT, tz)}</td>
              <td>{t.side}</td>
              <td className="mono">{t.qty}</td>
              <td className="mono">{t.entryFill.toFixed(2)}</td>
              <td className="mono">{t.stop.toFixed(2)}</td>
              <td>{t.exitReason}</td>
              <td className="mono">{t.exitFill.toFixed(2)}</td>
              <td className="mono">{(t.charges + t.friction).toFixed(2)}</td>
              <td className={cx('mono', t.net >= 0 ? 'pos' : 'neg')}>{fmtMoney(t.net, exchange)}</td>
              <td className="mono">{t.r.toFixed(2)}</td>
              <td>{t.segment === 'test' ? 'OOS' : 'train'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {trades.length > 300 && <p className="tiny muted">Showing the first 300 of {trades.length} trades.</p>}
    </div>
  );
}

function RunHistory({ runs, onDelete }: { runs: BacktestRun[]; onDelete: (id: string) => void }) {
  if (!runs.length) return null;
  const all = runs.flatMap((r) => r.result.trades);
  const capital = runs[0].config.risk.capital;
  const byStrat = metricsBy(all, (t) => strategyById(t.strategy as StrategyId)?.name ?? t.strategy, capital);
  const byEtf = metricsBy(all, (t) => t.symbol, capital);
  const sorted = [...runs].sort((a, b) => b.createdAt - a.createdAt);
  return (
    <section className="glass pad etf-panel">
      <div className="mono-label">Saved runs · results by strategy and ETF</div>
      <p className="tiny muted">Aggregated across all saved runs (overlapping runs on the same data count twice — compare like with like).</p>
      <div className="etf-two">
        <GroupTable title="By strategy" rows={byStrat} />
        <GroupTable title="By ETF" rows={byEtf} />
      </div>
      <div className="etf-runs">
        {sorted.map((r) => {
          const m = r.result.metrics;
          return (
            <div key={r.id} className="etf-run">
              <div>
                <b>
                  {strategyById(r.config.strategy).letter}. {strategyById(r.config.strategy).name} · {r.config.symbol} {r.config.interval}
                </b>
                <div className="tiny muted">
                  {new Date(r.createdAt).toLocaleString()} · {r.config.from ?? '…'} → {r.config.to ?? '…'} · data {r.result.fingerprint}
                </div>
              </div>
              <div className="mono small">
                {m.all.trades} trades · net {fmtMoney(m.all.net, r.config.exchange, 0)} · OOS {fmtMoney(m.test.net, r.config.exchange, 0)}
              </div>
              <button type="button" className="btn btn-sm btn-ghost" onClick={() => onDelete(r.id)} aria-label="Delete run">
                <Trash2 size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function GroupTable({ title, rows }: { title: string; rows: { key: string; m: Metrics }[] }) {
  return (
    <div className="etf-table-wrap">
      <table className="etf-table">
        <thead>
          <tr>
            <th>{title}</th>
            <th>Trades</th>
            <th>Win rate</th>
            <th>Net</th>
            <th>PF</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key}>
              <td>{r.key}</td>
              <td className="mono">{r.m.trades}</td>
              <td className="mono">{pct(r.m.winRate)}</td>
              <td className={cx('mono', r.m.net >= 0 ? 'pos' : 'neg')}>{r.m.net.toFixed(0)}</td>
              <td className="mono">{r.m.profitFactor == null ? '—' : r.m.profitFactor.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

