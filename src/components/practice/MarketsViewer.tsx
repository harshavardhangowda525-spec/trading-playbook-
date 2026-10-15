import { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { useDoc } from '../../lib/hooks';
import { C } from '../../lib/domain';
import { SegControl, cx } from '../ui';
import { ETFS, etfBySymbol } from '../../lib/etf/universe';
import { SESSIONS } from '../../lib/etf/calendar';
import { etfBars, intervalsFor, sourceLabel, useEtfDatasets } from '../../lib/etf/data';
import { INTERVALS as BAR_INTERVALS, type Interval } from '../../lib/market';
import { PracticeChart } from './PracticeChart';
import { DataImport } from './DataImport';
import { EtfDataGuide } from '../etf/EtfDataGuide';

// Two ways to see an ETF chart:
//  • TradingView's free embeddable chart (view-only, possibly delayed). Many
//    exchange feeds — often NSE — are licensed only on TradingView's own site
//    and show "only available on TradingView" inside embeds, so Indian ETFs can
//    be loaded from their BSE listing instead, with an NSE switch.
//  • "My data": the app's own chart of real candles you imported or fetched.
// Nothing here is stored as market data, simulated or scored.

type Source = 'tv' | 'mine';
type IndiaExchange = 'BSE' | 'NSE';

interface MarketsPrefs {
  id: 'marketsViewer';
  /** Legacy: full TradingView symbol from earlier versions. */
  symbol: string;
  interval: string;
  source?: Source;
  etf?: string;
  exch?: IndiaExchange;
  custom?: string | null;
}
const DEFAULT_PREFS: MarketsPrefs = { id: 'marketsViewer', symbol: 'NSE:NIFTYBEES', interval: '5', source: 'tv', etf: 'NIFTYBEES', exch: 'BSE', custom: null };

const INTERVALS = [
  { v: '5', label: '5m' },
  { v: '15', label: '15m' },
  { v: '60', label: '1h' },
  { v: 'D', label: '1D' },
  { v: 'W', label: '1W' },
];

const tvUrl = (symbol: string) => `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(symbol)}`;

/** TradingView symbol for an ETF; Indian ETFs use the chosen exchange listing. */
function tvSymbol(etf: string, exch: IndiaExchange): string {
  const e = etfBySymbol(etf);
  if (!e) return etf;
  return e.exchange === 'NSE' ? `${exch}:${e.symbol}` : e.tv;
}

export function MarketsViewer() {
  const [prefs, update] = useDoc<MarketsPrefs>(C.settings, 'marketsViewer', DEFAULT_PREFS);
  const datasets = useEtfDatasets();
  const [customText, setCustomText] = useState('');
  const [importOpen, setImportOpen] = useState(false);
  // Migrate the older single-symbol preference.
  const etf = prefs.etf ?? (etfBySymbol(prefs.symbol.split(':').pop() ?? '')?.symbol || 'NIFTYBEES');
  const exch: IndiaExchange = prefs.exch ?? 'BSE';
  const source: Source = prefs.source ?? 'tv';
  const def = etfBySymbol(etf);
  const symbol = prefs.custom || tvSymbol(etf, exch);

  return (
    <div className="mv">
      <div className="glass pad mv-picker">
        <div className="row between wrap" style={{ gap: 10 }}>
          <SegControl<Source>
            options={[
              { value: 'tv', label: 'TradingView chart' },
              { value: 'mine', label: 'My data' },
            ]}
            value={source}
            onChange={(v) => update({ source: v })}
          />
          {source === 'tv' && def?.exchange !== 'US' && !prefs.custom && (
            <div className="row" style={{ gap: 8 }}>
              <span className="tiny muted">Indian ETF listing</span>
              <SegControl<IndiaExchange>
                options={[
                  { value: 'BSE', label: 'BSE' },
                  { value: 'NSE', label: 'NSE' },
                ]}
                value={exch}
                onChange={(v) => update({ exch: v })}
              />
            </div>
          )}
        </div>
        {(['NSE', 'US'] as const).map((x) => (
          <div key={x} className="mv-group">
            <span className="mono-label">{x === 'NSE' ? 'India ETFs' : 'US ETFs'}</span>
            <div className="mv-chips">
              {ETFS.filter((e) => e.exchange === x).map((e) => (
                <button
                  key={e.symbol}
                  type="button"
                  className={cx('mv-chip', !prefs.custom && etf === e.symbol && 'on')}
                  onClick={() => update({ etf: e.symbol, custom: null })}
                  title={`${e.name} · tracks ${e.benchmark}`}
                >
                  {e.symbol}
                </button>
              ))}
            </div>
          </div>
        ))}
        {source === 'tv' && (
          <form
            className="mv-custom"
            onSubmit={(e) => {
              e.preventDefault();
              const s = customText.trim().toUpperCase();
              if (s) update({ custom: s });
              setCustomText('');
            }}
          >
            <Search size={14} className="muted" />
            <input className="input" placeholder="Another ETF, e.g. BSE:MOM100 or AMEX:EFA" value={customText} onChange={(e) => setCustomText(e.target.value)} aria-label="ETF symbol" />
            <button type="submit" className="btn btn-sm" disabled={!customText.trim()}>
              Show
            </button>
          </form>
        )}
      </div>

      {source === 'tv' ? (
        <div className="glass mv-chart-wrap">
          <div className="mv-bar">
            <div>
              <div className="mv-name">{prefs.custom ?? etf}</div>
              <div className="mono tiny muted">{prefs.custom ? symbol : `${symbol} · ${def?.name ?? ''}`}</div>
            </div>
            <div className="row wrap" style={{ gap: 6 }}>
              {INTERVALS.map((i) => (
                <button key={i.v} type="button" className={cx('mv-chip', prefs.interval === i.v && 'on')} onClick={() => update({ interval: i.v })}>
                  {i.label}
                </button>
              ))}
              <a className="btn btn-sm btn-ghost" href={tvUrl(symbol)} target="_blank" rel="noreferrer">
                <ExternalLink size={13} /> Open on TradingView
              </a>
            </div>
          </div>
          <TradingViewChart key={`${symbol}|${prefs.interval}`} symbol={symbol} interval={prefs.interval} />
          <div className="mv-help small">
            <b>Chart blank or saying “only available on TradingView”?</b> TradingView licenses some exchange data only on its own site.
            {def?.exchange === 'NSE' && !prefs.custom ? (
              <>
                {' '}
                Try the{' '}
                <button type="button" className="text-btn" onClick={() => update({ exch: exch === 'BSE' ? 'NSE' : 'BSE' })}>
                  {exch === 'BSE' ? 'NSE' : 'BSE'} listing
                </button>
                , switch to{' '}
                <button type="button" className="text-btn" onClick={() => update({ source: 'mine' })}>
                  My data
                </button>
                , or use “Open on TradingView”.
              </>
            ) : (
              <> Use “Open on TradingView”, or switch to My data.</>
            )}
          </div>
        </div>
      ) : (
        <MyDataChart etf={etf} datasets={datasets} onImport={() => setImportOpen(true)} />
      )}

      <p className="small muted mv-foot">
        TradingView charts are view-only and may be delayed — never treat them as a live feed. “My data” shows the real historical candles you imported or fetched, labelled with their source. Nothing here places orders, and it is not financial advice.
      </p>
      <DataImport open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}

/** The app's own chart of the learner's imported / fetched ETF candles (last few sessions). */
function MyDataChart({ etf, datasets, onImport }: { etf: string; datasets: ReturnType<typeof useEtfDatasets>; onImport: () => void }) {
  const mine = datasets.filter((d) => d.etf.symbol === etf);
  const [dsId, setDsId] = useState('');
  const x = mine.find((d) => d.ds.id === dsId) ?? mine[0];
  const ivs = x ? intervalsFor(x.ds) : [];
  const [iv, setIv] = useState<Interval>('5m');
  const interval = ivs.includes(iv) ? iv : ivs[0];
  const [sessions, setSessions] = useState(5);
  const bars = useMemo(() => {
    if (!x || !interval) return [];
    const days = etfBars(x, interval).quality.days;
    return etfBars(x, interval, days[Math.max(0, days.length - sessions)]).bars;
  }, [x, interval, sessions]);

  if (!x) {
    return <EtfDataGuide onImport={onImport} what={`chart ${etf} from your own data`} />;
  }
  const label = (i: Interval) => BAR_INTERVALS.find((b) => b.key === i)!.label;
  return (
    <div className="glass mv-chart-wrap">
      <div className="mv-bar">
        <div>
          <div className="mv-name">{etf} · my data</div>
          <div className="mono tiny muted">HISTORICAL · {sourceLabel(x.ds)}</div>
        </div>
        <div className="row wrap" style={{ gap: 6 }}>
          {mine.length > 1 && (
            <select className="select" style={{ width: 'auto' }} value={x.ds.id} onChange={(e) => setDsId(e.target.value)} aria-label="Dataset">
              {mine.map((d) => (
                <option key={d.ds.id} value={d.ds.id}>
                  {d.ds.name}
                </option>
              ))}
            </select>
          )}
          {ivs.map((i) => (
            <button key={i} type="button" className={cx('mv-chip', interval === i && 'on')} onClick={() => setIv(i)}>
              {label(i)}
            </button>
          ))}
          {[1, 5, 20].map((n) => (
            <button key={n} type="button" className={cx('mv-chip', sessions === n && 'on')} onClick={() => setSessions(n)}>
              {n}d
            </button>
          ))}
        </div>
      </div>
      {bars.length ? (
        <PracticeChart candles={bars} visible={bars.length} interval={interval} drawings={[]} tool="cursor" readOnly timeZone={SESSIONS[x.etf.exchange].timeZone} height={460} />
      ) : (
        <p className="small muted">No session candles in this dataset.</p>
      )}
    </div>
  );
}

function TradingViewChart({ symbol, interval }: { symbol: string; interval: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const widget = document.createElement('div');
    widget.className = 'tradingview-widget-container__widget';
    widget.style.height = '100%';
    widget.style.width = '100%';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.onerror = () => setFailed(true);
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval,
      timezone: 'exchange',
      theme: 'dark',
      style: '1',
      locale: 'en',
      backgroundColor: 'rgba(14, 14, 17, 1)',
      gridColor: 'rgba(236, 228, 214, 0.06)',
      allow_symbol_change: true,
      hide_side_toolbar: false,
      save_image: false,
      calendar: false,
      support_host: 'https://www.tradingview.com',
    });
    el.replaceChildren(widget, script);
    // If no chart frame appears (blocked script, offline), say so instead of leaving a blank box.
    const timer = window.setTimeout(() => {
      if (!el.querySelector('iframe')) setFailed(true);
    }, 12000);
    return () => {
      window.clearTimeout(timer);
      el.replaceChildren();
    };
  }, [symbol, interval]);

  return (
    <div className="mv-chart">
      <div className="tradingview-widget-container" ref={host} style={{ height: '100%', width: '100%' }} />
      {failed && (
        <div className="mv-failed small muted">
          TradingView’s chart didn’t load (blocked by the network, an ad-blocker, or offline). Use “Open on TradingView”, or switch to My data.
        </div>
      )}
      <div className="mv-credit tiny muted">
        <a href={tvUrl(symbol)} target="_blank" rel="noreferrer">
          Chart by TradingView
        </a>
      </div>
    </div>
  );
}
