import { useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { C } from '../lib/domain';
import { PageHeader } from '../components/ui';
import { TradeLog } from '../components/TradeLog';

export function TradingJournal() {
  const [, setParams] = useSearchParams();
  return (
    <div className="trades-page">
      <PageHeader
        eyebrow="RECORDS · TRADE REVIEW"
        title="TRADING JOURNAL"
        description="Your digital trade notebook. Statistics reflect only what you record here and exist for educational review — not as financial advice or a measure of future performance."
        actions={
          <button className="cmd-btn" onClick={() => setParams({ new: '1' })}>
            <Plus size={15} /> New trade
          </button>
        }
      />
      <TradeLog collection={C.trades} variant="journal" />
    </div>
  );
}
