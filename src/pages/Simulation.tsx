import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { C } from '../lib/domain';
import { PageHeader, SimBanner } from '../components/ui';
import { TradeLog } from '../components/TradeLog';
import '../styles/trades.css';

export function Simulation() {
  const [, setParams] = useSearchParams();
  return (
    <div className="trades-page">
      <PageHeader
        eyebrow="PHASE 09 · PAPER TRADING"
        title="SIMULATED TRADING"
        description="A paper-trading journal for demo accounts and simulators. Practise execution, follow your rules, and review the statistics — all in R multiples."
        actions={
          <button className="cmd-btn" onClick={() => setParams({ new: '1' })}>
            <Plus size={15} /> Paper trade
          </button>
        }
      />
      <div className="tl-sim-banner">
        <SimBanner text="No real money is involved. Everything here is simulated practice for education only — it is not financial advice and does not encourage trading with real money." />
      </div>
      <TradeLog collection={C.sims} variant="sim" />
    </div>
  );
}
