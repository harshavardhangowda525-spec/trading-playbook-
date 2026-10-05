import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { C } from '../lib/domain';
import { PageHeader, SimBanner } from '../components/ui';
import { TradeLog } from '../components/TradeLog';

export function Backtesting() {
  const [, setParams] = useSearchParams();
  return (
    <div className="trades-page">
      <PageHeader
        eyebrow="PHASE 08 · HISTORICAL REPLAY"
        title="BACKTESTING JOURNAL"
        description="Replay past charts, log every setup you would have taken, and let the numbers show which setups deserve your attention. Results are measured in R multiples."
        actions={
          <button className="cmd-btn" onClick={() => setParams({ new: '1' })}>
            <Plus size={15} /> Backtest
          </button>
        }
      />
      <SimBanner text="Historical replay — every result on this page is simulated from past data and is not predictive of future results. Educational practice only, not financial advice." />
      <TradeLog collection={C.backtests} variant="backtest" />
    </div>
  );
}
