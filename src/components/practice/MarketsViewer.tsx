import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import { useDoc } from '../../lib/hooks';
import { C } from '../../lib/domain';
import { cx } from '../ui';
import { ETFS } from '../../lib/etf/universe';

// View-only market charts through TradingView's free embeddable chart widget.
// The data is TradingView's; nothing here is stored, simulated or scored.

interface MarketDef {
  symbol: string; // TradingView symbol
  label: string;
  note?: string;
}

const GROUPS: { title: string; markets: MarketDef[] }[] = [
  {
    title: 'India · NSE ETFs',
    markets: ETFS.filter((e) => e.exchange === 'NSE').map((e) => ({ symbol: e.tv, label: e.symbol, note: `${e.name} · tracks ${e.benchmark}` })),
  },
  {
    title: 'US ETFs',
    markets: ETFS.filter((e) => e.exchange === 'US').map((e) => ({ symbol: e.tv, label: e.symbol, note: `${e.name} · tracks ${e.benchmark}` })),
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
const DEFAULT_PREFS: MarketsPrefs = { id: 'marketsViewer', symbol: 'NSE:NIFTYBEES', interval: '5' };

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
            placeholder="Another ETF, e.g. NSE:MOM100 or AMEX:EFA"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            aria-label="ETF symbol"
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
        Real ETF charts provided by TradingView — view-only and possibly delayed (never treat them as a live feed). Use them to study context and price behaviour; nothing here places orders, and it is not financial advice. Some NSE ETF data is only licensed on TradingView’s own site — if the chart says so, use “Open on TradingView”. For backtests and paper trading, import or fetch that ETF’s history. </p>
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
