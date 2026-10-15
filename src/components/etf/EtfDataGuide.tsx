import { Database, Upload } from 'lucide-react';
import '../../styles/etf.css';

/** What to do when there is no ETF data yet — shown wherever a chart needs history. */
export function EtfDataGuide({ onImport, what = 'draw this chart' }: { onImport: () => void; what?: string }) {
  return (
    <div className="glass pad etf-guide">
      <div className="row" style={{ gap: 10 }}>
        <Database size={18} />
        <b>Add real ETF history to {what}</b>
      </div>
      <p className="small muted" style={{ margin: 0 }}>
        The app never generates prices, so charts here need real candles. Either way takes a minute:
      </p>
      <ol className="etf-guide-steps">
        <li>
          <b>Import a CSV.</b> From your broker or charting tool, export <em>intraday</em> candles (1, 5 or 15 minutes) for an ETF such as NIFTYBEES. The file needs
          columns for date/time, open, high, low, close and volume, for example:
          <code>Date,Open,High,Low,Close,Volume</code>
          <code>2026-10-09 09:15:00,271.40,271.85,271.10,271.60,184500</code>
          Choose the ETF and “IST” when importing.
        </li>
        <li>
          <b>Or fetch from Upstox.</b> If you set up the optional connector (Cloud accounts + your read-only Upstox token, see <code>docs/upstox-setup.md</code>),
          pick an ETF and date range in the same window and press “Fetch &amp; save”.
        </li>
      </ol>
      <button type="button" className="btn btn-primary" onClick={onImport}>
        <Upload size={14} /> Import or fetch ETF data
      </button>
    </div>
  );
}
