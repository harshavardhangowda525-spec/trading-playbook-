import '../../styles/journal.css';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RingMeter } from '../ui';
import { useCollection } from '../../lib/hooks';
import { C, type Strategy } from '../../lib/domain';
import { JOURNAL_COLLECTION, strategyStats, type JournalTradeEntry } from '../../lib/journal';

/** Playbook ↔ Trading Journal: how each strategy has been studied in the journal. */
export function StrategyJournal() {
  const { items: strategies } = useCollection<Strategy>(C.strategies);
  const { items: entries } = useCollection<JournalTradeEntry>(JOURNAL_COLLECTION);

  return (
    <section className="sj no-print">
      <div className="sj-head">
        <div>
          <div className="sj-label">Strategy journal</div>
          <h2 className="sj-title">How each strategy is being studied</h2>
        </div>
        <Link to="/trading-journal" className="sj-link">
          Open trading journal →
        </Link>
      </div>
      {!strategies.length ? (
        <p className="sj-empty">
          Create a strategy in the <Link to="/strategy-lab">Strategy Lab</Link>, then choose it as “Strategy used” in your journal entries.
        </p>
      ) : (
        <div className="sj-grid">
          {strategies.map((s, i) => {
            const st = strategyStats(entries, s.id);
            return (
              <motion.article
                key={s.id}
                className="glass sj-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="sj-card-top">
                  <div>
                    <div className="sj-name">{s.name || 'Untitled strategy'}</div>
                    <div className="sj-sub">
                      {[s.market, s.timeframe].filter(Boolean).join(' · ') || 'Market & timeframe not set'}
                    </div>
                  </div>
                  {st.ruleFollowing != null && <RingMeter value={st.ruleFollowing} size={52} stroke={2} />}
                </div>
                <div className="sj-stats">
                  <div>
                    <span className="sj-label">Times studied</span>
                    <b>{st.count}</b>
                  </div>
                  <div>
                    <span className="sj-label">Rule-following</span>
                    <b>{st.ruleFollowing == null ? '—' : `${Math.round(st.ruleFollowing * 100)}%`}</b>
                  </div>
                </div>
                {st.count === 0 ? (
                  <p className="sj-empty">Not used in any journal entry yet.</p>
                ) : (
                  <>
                    <div className="sj-label">Common mistakes</div>
                    <p className="sj-text">{st.mistakes.length ? st.mistakes.map((m) => `${m.label} (${m.count})`).join(' · ') : 'None recorded'}</p>
                    <div className="sj-label">Lessons learned</div>
                    {st.lessons.length ? (
                      <ul className="sj-lessons">
                        {st.lessons.map((l, j) => (
                          <li key={j}>“{l}”</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="sj-text dim">No lessons written yet.</p>
                    )}
                  </>
                )}
              </motion.article>
            );
          })}
        </div>
      )}
    </section>
  );
}
