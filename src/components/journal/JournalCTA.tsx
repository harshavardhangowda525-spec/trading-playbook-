import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, NotebookPen } from 'lucide-react';
import type { TradingSessionId } from '../../data/schedule';

/** Where each trading session leads in the Trading Journal. */
export const JOURNAL_CTA: Record<TradingSessionId, { label: string; to: string }> = {
  morning: { label: 'Open trading journal', to: '/trading-journal' },
  evening: { label: "Log today's session", to: '/trading-journal?new=1&session=evening' },
};

/**
 * Timetable → journal link. `live` (the session window is running now)
 * makes it the prominent call to action; otherwise it stays a quiet link.
 */
export function JournalCTA({ session, live }: { session: TradingSessionId; live: boolean }) {
  const cta = JOURNAL_CTA[session];
  if (!live) {
    return (
      <Link to={cta.to} className="btn btn-ghost btn-sm" onClick={(e) => e.stopPropagation()}>
        <NotebookPen size={13} /> {session === 'morning' ? 'Journal' : 'Log session'}
      </Link>
    );
  }
  return (
    <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ display: 'inline-flex' }}>
      <Link to={cta.to} className="btn btn-primary btn-sm" onClick={(e) => e.stopPropagation()}>
        <NotebookPen size={13} /> {cta.label} <ArrowRight size={13} />
      </Link>
    </motion.span>
  );
}
