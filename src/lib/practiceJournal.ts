// Practice Lab → Trading Journal: build an editable journal entry from a replay session.

import type { JournalTradeEntry } from './journal';
import { SOURCE_LABEL, fmtTime } from './market';
import type { PracticeSession } from './practice';

const TF: Record<string, string> = { '1m': '1m', '5m': '5m', '15m': '15m', '30m': '30m', '1h': '1h', '4h': '4h', '1d': 'Daily' };

export function practiceToEntry(s: PracticeSession, decisionTime: number | null): Partial<JournalTradeEntry> {
  const trade = s.decision === 'long' || s.decision === 'short';
  const o = s.outcome;
  const r = o?.resultR ?? null;
  const result: JournalTradeEntry['result'] =
    !trade || o?.exitReason === 'not-filled' ? 'notrade' : r == null ? '' : r > 0.05 ? 'success' : r < -0.05 ? 'fail' : 'breakeven';
  const rulesMet = s.strategyRules.length > 0 && s.strategyRules.every((x) => s.ruleChecks[x.key]);
  const happened = [s.after?.summary, s.reflection.well && `What I did well: ${s.reflection.well}`].filter(Boolean).join('\n\n');
  return {
    date: s.date,
    session: 'Evening practice',
    market: s.market,
    timeframe: TF[s.interval] ?? s.interval,
    strategyId: s.strategyId.startsWith('tpl-') ? '' : s.strategyId,
    setup: s.strategyId ? s.strategyName : 'Replay practice',
    direction: s.decision === 'short' ? 'short' : 'long',
    entry: trade ? (o?.fillPrice ?? s.entry) : null,
    stop: s.stop,
    target: s.target,
    exit: o?.exitPrice ?? null,
    why: s.decision === 'notrade' ? `No trade — ${s.noTradeReason}${s.noTradeOther ? `: ${s.noTradeOther}` : ''}\n${s.reason}`.trim() : s.reason,
    context: `Practice Lab historical replay · ${SOURCE_LABEL[s.ref.source]}${decisionTime ? ` · decision on ${fmtTime(decisionTime, s.interval)}` : ''}`,
    checks: {
      confirmation: s.selfCheck.confirmation,
      ...(s.strategyRules.length ? { strategy: rulesMet, rules: rulesMet } : {}),
      ...(trade ? { stop: true } : {}),
    },
    result,
    happened,
    learned: s.reflection.taught,
    improve: s.reflection.improve,
    image: s.image,
    imageNotes: `Historical replay · ${s.market} ${s.interval.toUpperCase()}. Simulated result — not a real financial return.`,
    confidence: s.confidence,
    mistakes: s.mistakes,
    practiceId: s.id,
    processScore: s.score?.total ?? null,
  };
}
