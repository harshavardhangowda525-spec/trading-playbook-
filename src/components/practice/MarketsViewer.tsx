import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { useDoc } from '../../lib/hooks';
import { C } from '../../lib/domain';
import { cx } from '../ui';

// View-only market charts through TradingView's free embeddable chart widget.
// The data is TradingView's; nothing here is stored, simulated or scored.

interface MarketDef {
  symbol: string; // TradingView symbol
  label: string;
  note?: string;
}

const GROUPS: { title: string; markets: MarketDef[] }[] = [
  {
    title: 'Global indices',
    markets: [
      { symbol: 'FOREXCOM:SPXUSD', label: 'S&P 500', note: 'US 500 index CFD that tracks the S&P 500' },
      { symbol: 'FOREXCOM:NSXUSD', label: 'Nasdaq 100', note: 'US Tech 100 CFD that tracks the Nasdaq-100' },
      { symbol: 'FOREXCOM:DJI', label: 'Dow Jones', note: 'US 30 CFD that tracks the Dow Jones Industrial Average' },
      { symbol: 'FOREXCOM:UKXGBP', label: 'FTSE 100', note: 'UK 100 CFD that tracks the FTSE 100' },
      { symbol: 'INDEX:NKY', label: 'Nikkei 225' },
      { symbol: 'XETR:DAX', label: 'DAX' },
    ],
  },
  {
    title: 'India',
    markets: [
      { symbol: 'NSE:NIFTY', label: 'Nifty 50' },
      { symbol: 'NSE:BANKNIFTY', label: 'Bank Nifty' },
      { symbol: 'BSE:SENSEX', label: 'Sensex' },
    ],
  },
  {
    title: 'ETFs',
    markets: [
      { symbol: 'AMEX:SPY', label: 'SPY', note: 'SPDR S&P 500 ETF' },
      { symbol: 'NASDAQ:QQQ', label: 'QQQ', note: 'Invesco QQQ (Nasdaq-100) ETF' },
      { symbol: 'AMEX:DIA', label: 'DIA', note: 'SPDR Dow Jones Industrial Average ETF' },
      { symbol: 'AMEX:IWM', label: 'IWM', note: 'iShares Russell 2000 ETF' },
      { symbol: 'NSE:NIFTYBEES', label: 'NIFTYBEES', note: 'Nippon India Nifty 50 BeES ETF' },
    ],
  },
];

const INTERVALS = [
  { v: '5', label: '5m' },
  { v: '15', label: '15m' },
  { v: '60', label: '1h' },
  { v: 'D', label: '1D' },
  { v: 'W', label: '1W' },
];

interface MarketsPrefs {
  id: 'marketsViewer';
  symbol: string;
  interval: string;
}
const DEFAULT_PREFS: MarketsPrefs = { id: 'marketsViewer', symbol: 'FOREXCOM:SPXUSD', interval: 'D' };

const tvUrl = (symbol: string) => `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(symbol)}`;

export function MarketsViewer() {
  const [prefs, update] = useDoc<MarketsPrefs>(C.settings, 'marketsViewer', DEFAULT_PREFS);
  const [custom, setCustom] = useState('');
  const all = GROUPS.flatMap((g) => g.markets);
  const current = all.find((m) => m.symbol === prefs.symbol);

  return (
    <div className="mv">
      <div className="glass pad mv-picker">
        {GROUPS.map((g) => (
          <div key={g.title} className="mv-group">
            <span className="mono-label">{g.title}</span>
            <div className="mv-chips">
              {g.markets.map((m) => (
                <button
                  key={m.symbol}
                  type="button"
                  className={cx('mv-chip', prefs.symbol === m.symbol && 'on')}
                  onClick={() => update({ symbol: m.symbol })}
                  title={m.note ?? m.symbol}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        ))}
        <form
          className="mv-custom"
          onSubmit={(e) => {
            e.preventDefault();
            const s = custom.trim().toUpperCase();
            if (s) update({ symbol: s });
            setCustom('');
          }}
        >
          <Search size={14} className="muted" />
          <input
            className="input"
            placeholder="Any symbol, e.g. NSE:NIFTYIT or AMEX:EFA"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            aria-label="Chart symbol"
          />
          <button type="submit" className="btn btn-sm" disabled={!custom.trim()}>
            Show
          </button>
        </form>
      </div>

      <div className="glass mv-chart-wrap">
        <div className="mv-bar">
          <div>
            <div className="mv-name">{current?.label ?? prefs.symbol}</div>
            <div className="mono tiny muted">{current?.note ? `${prefs.symbol} · ${current.note}` : prefs.symbol}</div>
          </div>
          <div className="row wrap" style={{ gap: 6 }}>
            {INTERVALS.map((i) => (
              <button key={i.v} type="button" className={cx('mv-chip', prefs.interval === i.v && 'on')} onClick={() => update({ interval: i.v })}>
                {i.label}
              </button>
            ))}
            <a className="btn btn-sm btn-ghost" href={tvUrl(prefs.symbol)} target="_blank" rel="noreferrer">
              <ExternalLink size={13} /> Open on TradingView
            </a>
          </div>
        </div>
        <TradingViewChart key={`${prefs.symbol}|${prefs.interval}`} symbol={prefs.symbol} interval={prefs.interval} />
      </div>

      <p className="small muted mv-foot">
        Real market charts provided by TradingView, view-only and possibly delayed. Use them to study structure, levels and indicators;
        nothing here places orders, and it is not financial advice. Some exchange data (for example certain NSE/BSE indices) is only
        licensed on TradingView's own site — if the chart says so, use “Open on TradingView”. For candle-by-candle replay with a scored
        decision, import that market's history as a CSV in Replay.
      </p>
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
    return () => el.replaceChildren();
  }, [symbol, interval]);

  return (
    <div className="mv-chart">
      <div className="tradingview-widget-container" ref={host} style={{ height: '100%', width: '100%' }} />
      {failed && <div className="mv-failed small muted">The chart couldn't load. Check your connection, or open it on TradingView.</div>}
      <div className="mv-credit tiny muted">
        <a href={tvUrl(symbol)} target="_blank" rel="noreferrer">
          Chart by TradingView
        </a>
      </div>
    </div>
  );
}
