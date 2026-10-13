import { Check, Info, X } from 'lucide-react';
import type { Eligibility } from '../../lib/etf/eligibility';

/** Measured liquidity / data / cost checks for an ETF (spread is an assumption, labelled). */
export function EligibilityTable({ e }: { e: Eligibility }) {
  return (
    <div className="etf-checks">
      {e.rows.map((r) => (
        <div key={r.label} className={`etf-check ${r.pass === true ? 'pass' : r.pass === false ? 'fail' : 'info'}`}>
          {r.pass === true ? <Check size={13} /> : r.pass === false ? <X size={13} /> : <Info size={13} />}
          <span className="l">{r.label}</span>
          <span className="v mono">{r.value}</span>
          {r.note && <span className="n tiny muted">{r.note}</span>}
        </div>
      ))}
    </div>
  );
}
