import { useState } from 'react';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { Field, NumberInput, cx } from '../ui';
import { DEFAULT_ETF_CONFIG, useEtfConfig } from '../../lib/etf/config';
import type { CostModel } from '../../lib/etf/costs';
import type { RiskConfig } from '../../lib/etf/risk';
import type { Exchange } from '../../lib/etf/universe';

type NumKey<T> = { [K in keyof T]: T[K] extends number ? K : never }[keyof T];

const RISK_FIELDS: { key: NumKey<RiskConfig>; label: string; hint: string }[] = [
  { key: 'capital', label: 'Virtual capital', hint: 'Fixed sizing base — never grows with wins' },
  { key: 'riskPct', label: 'Risk per trade (%)', hint: 'Max loss if the stop is hit, incl. costs' },
  { key: 'dailyLossPct', label: 'Daily loss limit (%)', hint: 'Reaching it blocks new trades' },
  { key: 'maxTrades', label: 'Max trades per day', hint: '' },
  { key: 'minRR', label: 'Minimum reward : risk', hint: 'Trades below it are rejected' },
  { key: 'maxPositionPct', label: 'Max position (% of capital)', hint: '100 = no leverage' },
  { key: 'cooldownMin', label: 'Cooldown after limit (min)', hint: 'Before a new paper session' },
  { key: 'skipOpenMin', label: 'No entries after open (min)', hint: '' },
  { key: 'lastEntryBeforeCloseMin', label: 'No entries before close (min)', hint: '' },
  { key: 'squareOffBeforeCloseMin', label: 'Square off before close (min)', hint: '' },
];

const COST_FIELDS: { key: NumKey<CostModel>; label: string }[] = [
  { key: 'brokeragePct', label: 'Brokerage (% per order)' },
  { key: 'brokerageCap', label: 'Brokerage cap per order' },
  { key: 'sttSellPct', label: 'STT on sells (%)' },
  { key: 'exchangePct', label: 'Exchange charge (%)' },
  { key: 'sebiPerCrore', label: 'SEBI fee per crore' },
  { key: 'stampBuyPct', label: 'Stamp duty on buys (%)' },
  { key: 'gstPct', label: 'GST on fees (%)' },
  { key: 'spreadBps', label: 'Assumed spread (bps)' },
  { key: 'slippageBps', label: 'Slippage per fill (bps)' },
];

/** Collapsible editor for risk limits and cost assumptions (shared by Backtest and Paper). */
export function RiskCostSettings({ exchange, compact }: { exchange: Exchange; compact?: boolean }) {
  const { cfg, update } = useEtfConfig();
  const [open, setOpen] = useState(!compact);
  const costKey = exchange === 'NSE' ? 'costsNSE' : 'costsUS';
  const costs = cfg[costKey];
  const setRisk = (k: NumKey<RiskConfig>, v: number | null) => v != null && v >= 0 && update((p) => ({ ...p, risk: { ...cfg.risk, [k]: v } }));
  const setCost = (k: NumKey<CostModel>, v: number | null) => v != null && v >= 0 && update((p) => ({ ...p, [costKey]: { ...costs, [k]: v } }));
  return (
    <div className="etf-settings">
      <button type="button" className="etf-settings-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>
          Risk limits &amp; cost assumptions · {cfg.risk.riskPct}% risk/trade · {cfg.risk.dailyLossPct}% daily limit · {cfg.risk.maxTrades} trades/day · spread {costs.spreadBps} bps
        </span>
        <ChevronDown size={14} className={cx(open && 'flip')} />
      </button>
      {open && (
        <div className="etf-settings-body">
          <div className="etf-grid">
            {RISK_FIELDS.map((f) => (
              <Field key={f.key} label={f.label} hint={f.hint || undefined}>
                <NumberInput value={cfg.risk[f.key]} onChange={(v) => setRisk(f.key, v)} />
              </Field>
            ))}
            <Field label="Short selling (intraday)">
              <select className="select" value={cfg.risk.allowShort ? 'yes' : 'no'} onChange={(e) => update((p) => ({ ...p, risk: { ...cfg.risk, allowShort: e.target.value === 'yes' } }))}>
                <option value="no">Long only</option>
                <option value="yes">Allow shorts</option>
              </select>
            </Field>
          </div>
          <div className="etf-sub">Cost assumptions · {exchange === 'NSE' ? 'India (NSE)' : 'United States'} — editable, check your broker’s contract note</div>
          <div className="etf-grid">
            {COST_FIELDS.map((f) => (
              <Field key={f.key} label={f.label}>
                <NumberInput value={costs[f.key]} onChange={(v) => setCost(f.key, v)} />
              </Field>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={() => update((p) => ({ ...p, risk: DEFAULT_ETF_CONFIG.risk, [costKey]: DEFAULT_ETF_CONFIG[costKey] }))}
          >
            <RotateCcw size={13} /> Restore defaults
          </button>
        </div>
      )}
    </div>
  );
}
