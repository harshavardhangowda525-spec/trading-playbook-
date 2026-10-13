import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ListChecks, ShieldCheck } from 'lucide-react';
import { HoloCheck, cx } from '../ui';
import { EligibilityTable } from './EligibilityTable';
import { useEtfConfig, useWorkflowDays, type WorkflowDay } from '../../lib/etf/config';
import { etfBars, intervalsFor, useEtfDatasets } from '../../lib/etf/data';
import { assessEligibility } from '../../lib/etf/eligibility';
import { regimeMix, buildCtx } from '../../lib/etf/strategies';
import { SESSIONS } from '../../lib/etf/calendar';
import { intervalSec } from '../../lib/market';
import { useToday } from '../../lib/hooks';
import '../../styles/etf.css';

const STEPS: { text: string; to?: string; link?: string }[] = [
  { text: 'Select an ETF with enough history and acceptable simulated liquidity', to: '#eligibility', link: 'Check below' },
  { text: 'Review the broader market context and the ETF’s price behaviour', to: '/trading/markets', link: 'Markets' },
  { text: 'Decide: trending, breaking out, pulling back or range-bound?', to: '/trading/replay', link: 'Replay' },
  { text: 'Pick a strategy and re-read its entry, exit and invalidation rules', to: '/trading/learn', link: 'Course' },
  { text: 'Backtest the strategy on historical data', to: '/trading/backtest', link: 'Backtest' },
  { text: 'Review the trade markers and the training vs out-of-sample statistics', to: '/trading/backtest', link: 'Backtest' },
  { text: 'Start a paper session with virtual money', to: '/trading/paper', link: 'Paper' },
  { text: 'Write the reason for each simulated trade before entering it', to: '/trading/paper', link: 'Paper' },
  { text: 'Record the outcome, costs and whether the rules were followed', to: '/trading/paper', link: 'Report' },
  { text: 'Review mistakes and update the learning journal', to: '/trading-journal', link: 'Journal' },
  { text: 'Compare results across several sessions before concluding anything', to: '/trading/history', link: 'History' },
];

/** The repeatable 11-step daily ETF practice workflow (one checklist per day). */
export function EtfWorkflow() {
  const today = useToday();
  const days = useWorkflowDays();
  const doc: WorkflowDay = days.items.find((d) => d.id === today) ?? { id: today, done: {} };
  const count = Object.keys(doc.done).length;
  const toggle = (i: number, v: boolean) => {
    const done = { ...doc.done };
    if (v) done[i] = Date.now();
    else delete done[i];
    days.save({ ...doc, done });
  };
  return (
    <section className="glass pad etf-panel">
      <div className="etf-head">
        <div>
          <div className="mono-label">Daily ETF practice workflow · {today}</div>
          <div className="etf-title">
            <ListChecks size={16} /> {count} / {STEPS.length} steps
          </div>
        </div>
      </div>
      <ol className="etf-workflow">
        {STEPS.map((s, i) => (
          <li key={i} className={cx(!!doc.done[i] && 'done')}>
            <HoloCheck checked={!!doc.done[i]} onChange={(v) => toggle(i, v)} label={s.text} />
            <span>{s.text}</span>
            {s.to && (s.to.startsWith('#') ? <a href={s.to} className="text-btn">{s.link}</a> : <Link to={s.to} className="text-btn">{s.link}</Link>)}
          </li>
        ))}
      </ol>
      <p className="tiny muted" style={{ margin: 0 }}>
        Never size up after wins or trade more to recover losses. One session proves nothing — consistency across many does.
      </p>
    </section>
  );
}

/** Step 1 & 3 helper: measured eligibility and market regime for an ETF dataset. */
export function EtfEligibilityCheck() {
  const datasets = useEtfDatasets();
  const { cfg } = useEtfConfig();
  const [id, setId] = useState('');
  const x = datasets.find((d) => d.ds.id === id) ?? datasets[0];
  const iv = x ? intervalsFor(x.ds)[0] : undefined;
  const data = useMemo(() => (x && iv ? etfBars(x, iv) : null), [x, iv]);
  const e = useMemo(
    () => (x && data && iv ? assessEligibility(data.bars, intervalSec(iv), x.etf, x.etf.exchange === 'NSE' ? cfg.costsNSE : cfg.costsUS, cfg.risk.capital * 0.5) : null),
    [x, data, iv, cfg],
  );
  const regimes = useMemo(() => {
    if (!x || !data || data.bars.length < 60) return null;
    const recent = data.bars.slice(-Math.min(data.bars.length, 75 * 5));
    return regimeMix(buildCtx(recent, SESSIONS[x.etf.exchange], 0.1));
  }, [x, data]);
  return (
    <section id="eligibility" className="glass pad etf-panel">
      <div className="etf-head">
        <div>
          <div className="mono-label">ETF eligibility & market context</div>
          <div className="etf-title">
            <ShieldCheck size={16} /> Is this ETF suitable for intraday simulation?
          </div>
        </div>
      </div>
      {!x ? (
        <p className="small muted">
          No ETF data yet. <Link to="/trading/replay">Import or fetch</Link> intraday history first — eligibility is measured from real data, never assumed.
        </p>
      ) : (
        <>
          <select className="select" value={x.ds.id} onChange={(ev) => setId(ev.target.value)} aria-label="ETF dataset">
            {datasets.map((d) => (
              <option key={d.ds.id} value={d.ds.id}>
                {d.etf.symbol} · {d.ds.name}
              </option>
            ))}
          </select>
          {e && (
            <div className={cx('etf-elig', e.verdict)}>
              <div className="etf-elig-head">
                <b>{e.verdict === 'eligible' ? 'Eligible' : e.verdict === 'caution' ? 'Usable with caution' : 'Not eligible'}</b>
                <span className="small muted">{x.etf.name} · {x.etf.category}</span>
              </div>
              <EligibilityTable e={e} />
            </div>
          )}
          {regimes && (
            <div className="etf-regimes">
              <span className="mono-label">Measured regime mix · last ~5 sessions</span>
              {Object.entries(regimes).map(([k, v]) => (
                <div key={k} className="etf-regime">
                  <span>{k}</span>
                  <i style={{ width: `${Math.round(v * 100)}%` }} />
                  <b className="mono">{Math.round(v * 100)}%</b>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
