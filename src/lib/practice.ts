// Practice Lab — educational replay sessions on historical data.
// Pure types + simulation engine + process scoring. Nothing here is real trading.

import { atr, type Candle, type DataRef, type Interval } from './market';
import { MISTAKES, type MistakeKey } from './journal';
import { LESSONS_BY_DAY, phaseFor } from '../data/curriculum';

export const SESSIONS_COL = 'psessions';
export const CHALLENGES_COL = 'pchallenges';

export const SIM_NOTICE = 'Simulation only — no real-money trading or broker execution.';

// ─── Drawings ──────────────────────────────────────────────────────────────

export type DrawKind = 'trend' | 'hline' | 'support' | 'resistance' | 'entry' | 'stop' | 'target';
export interface Anchor {
  t: number; // candle time (UNIX s) the point is attached to
  p: number; // price
}
export interface Drawing {
  id: string;
  kind: DrawKind;
  a: Anchor;
  b?: Anchor; // trendlines only
}

// ─── Decision ──────────────────────────────────────────────────────────────

export type Decision = 'long' | 'short' | 'notrade';

export const NO_TRADE_REASONS = [
  'No clear setup',
  'Poor risk/reward',
  'Market too volatile',
  'Conflicting signals',
  'Weak market structure',
  'Waiting for confirmation',
  'Outside strategy rules',
  'Other',
] as const;
export type NoTradeReason = (typeof NO_TRADE_REASONS)[number];

// ─── Strategies ────────────────────────────────────────────────────────────

export interface StrategyRule {
  key: string;
  label: string;
}

/** Built-in practice templates, used when the Playbook has no matching strategy. */
export const TEMPLATES: { id: string; name: string; rules: StrategyRule[] }[] = [
  {
    id: 'tpl-breakout',
    name: 'Breakout',
    rules: [
      { key: 'level', label: 'A clear level was tested at least twice' },
      { key: 'close', label: 'A candle closed decisively beyond the level' },
      { key: 'volume', label: 'Volume expanded on the breakout' },
      { key: 'stop', label: 'Stop placed back inside the range' },
      { key: 'rr', label: 'Target gives at least 1.5R' },
    ],
  },
  {
    id: 'tpl-retest',
    name: 'Breakout + Retest',
    rules: [
      { key: 'break', label: 'Level broke with a decisive close' },
      { key: 'retest', label: 'Price returned to retest the level' },
      { key: 'hold', label: 'The retest held (rejection / confirmation candle)' },
      { key: 'stop', label: 'Stop beyond the retest swing' },
      { key: 'rr', label: 'Target gives at least 1.5R' },
    ],
  },
  {
    id: 'tpl-sr',
    name: 'Support / Resistance',
    rules: [
      { key: 'zone', label: 'Entry at a pre-marked support/resistance zone' },
      { key: 'reaction', label: 'A rejection candle formed at the zone' },
      { key: 'context', label: 'Higher-timeframe context agrees' },
      { key: 'stop', label: 'Stop beyond the zone' },
      { key: 'rr', label: 'Room to the next level is at least 1.5R' },
    ],
  },
  {
    id: 'tpl-trend',
    name: 'Trend Continuation',
    rules: [
      { key: 'trend', label: 'Clear higher highs/lows (or lower highs/lows)' },
      { key: 'pullback', label: 'Entry on a pullback, not an extended move' },
      { key: 'confirm', label: 'Pullback ended with a confirmation candle' },
      { key: 'stop', label: 'Stop beyond the pullback swing' },
      { key: 'rr', label: 'Target at the prior swing or ≥ 1.5R' },
    ],
  },
  {
    id: 'tpl-reversal',
    name: 'Reversal',
    rules: [
      { key: 'level', label: 'Move into a major level' },
      { key: 'structure', label: 'Market structure shifted (break of last swing)' },
      { key: 'confirm', label: 'Confirmation candle after the shift' },
      { key: 'stop', label: 'Stop beyond the extreme' },
      { key: 'rr', label: 'Target gives at least 2R' },
    ],
  },
];

/** Turn a Strategy Lab strategy's written rules into a checklist. */
export function rulesFromStrategy(s: {
  condition?: string;
  setup?: string;
  confirmation?: string;
  entryTrigger?: string;
  stopLoss?: string;
  target?: string;
  noTrade?: string;
}): StrategyRule[] {
  const rows: [string, string, string | undefined][] = [
    ['condition', 'Market condition', s.condition],
    ['setup', 'Setup present', s.setup],
    ['confirmation', 'Confirmation', s.confirmation],
    ['entry', 'Entry trigger', s.entryTrigger],
    ['stop', 'Stop-loss rule', s.stopLoss],
    ['target', 'Target rule', s.target],
    ['notrade', 'No no-trade condition applied', s.noTrade],
  ];
  return rows.filter(([, , v]) => v && v.trim()).map(([key, label, v]) => ({ key, label: `${label}: ${v!.trim()}` }));
}

// ─── Session ───────────────────────────────────────────────────────────────

export interface Reflection {
  well: string;
  improve: string;
  taught: string;
}

export interface SelfCheck {
  confirmation: boolean; // I waited for confirmation
  calm: boolean; // I stayed calm / no impulse
  plan: boolean; // I followed my plan after the decision
}

export interface SimOutcome {
  filled: boolean;
  fillTime: number | null;
  fillPrice: number | null;
  exitTime: number | null;
  exitPrice: number | null;
  exitReason: 'target' | 'stop' | 'manual' | 'end' | 'not-filled' | 'open';
  resultR: number | null;
  mfeR: number;
  maeR: number;
  bars: number; // candles revealed after the decision
  ambiguous: boolean; // stop and target touched in the same candle (stop assumed)
}

export interface AfterMove {
  bars: number;
  upPct: number;
  downPct: number;
  upAtr: number;
  downAtr: number;
  summary: string;
}

export interface ProcessScore {
  total: number; // 0..100
  parts: { key: string; label: string; score: number; weight: number; note: string }[];
  explanation: string;
  setupQuality: 'High' | 'Moderate' | 'Low';
  decisionQuality: 'Strong process' | 'Sound with gaps' | 'Needs work';
}

export interface PracticeSession {
  id: string;
  createdAt: number;
  updatedAt: number;
  date: string; // practice date (local key)
  mode: 'historical' | 'simulation';
  ref: DataRef;
  market: string;
  interval: Interval;
  startIndex: number; // candles visible when the replay started
  decisionIndex: number | null; // index of the candle the decision was made on
  revealed: number; // total candles revealed so far
  strategyId: string; // Strategy Lab id, template id, or '' for none
  strategyName: string;
  strategyRules: StrategyRule[];
  ruleChecks: Record<string, boolean>;
  decision: Decision | null;
  entry: number | null;
  stop: number | null;
  target: number | null;
  reason: string;
  confidence: number;
  noTradeReason: NoTradeReason | '';
  noTradeOther: string;
  manualExit: { t: number; price: number } | null;
  outcome: SimOutcome | null;
  after: AfterMove | null;
  selfCheck: SelfCheck;
  mistakes: MistakeKey[];
  reflection: Reflection;
  score: ProcessScore | null;
  drawings: Drawing[];
  image: string | null;
  status: 'replaying' | 'decided' | 'complete';
  journalEntryId: string | null;
}

export function blankSession(): Omit<PracticeSession, 'id' | 'createdAt' | 'updatedAt' | 'date' | 'ref' | 'market' | 'interval' | 'startIndex'> {
  return {
    mode: 'simulation',
    decisionIndex: null,
    revealed: 0,
    strategyId: '',
    strategyName: 'Practice without strategy',
    strategyRules: [],
    ruleChecks: {},
    decision: null,
    entry: null,
    stop: null,
    target: null,
    reason: '',
    confidence: 5,
    noTradeReason: '',
    noTradeOther: '',
    manualExit: null,
    outcome: null,
    after: null,
    selfCheck: { confirmation: false, calm: false, plan: false },
    mistakes: [],
    reflection: { well: '', improve: '', taught: '' },
    score: null,
    drawings: [],
    image: null,
    status: 'replaying',
    journalEntryId: null,
  };
}

// ─── Validation ────────────────────────────────────────────────────────────

/** Returns a list of problems with a trade decision (empty = valid). */
export function validateDecision(
  d: Decision,
  v: { entry: number | null; stop: number | null; target: number | null; reason: string },
  price: number,
): string[] {
  if (d === 'notrade') return [];
  const out: string[] = [];
  if (v.entry == null) out.push('Entry level is required');
  if (v.stop == null) out.push('Stop-loss is required');
  if (v.target == null) out.push('Target is required');
  if (!v.reason.trim()) out.push('Write the reason for the trade');
  const e = v.entry ?? price;
  if (v.stop != null && v.target != null) {
    if (d === 'long' && !(v.stop < e && v.target > e)) out.push('For a long, the stop must be below the entry and the target above it');
    if (d === 'short' && !(v.stop > e && v.target < e)) out.push('For a short, the stop must be above the entry and the target below it');
  }
  return out;
}

export function plannedRRFor(s: Pick<PracticeSession, 'entry' | 'stop' | 'target'>): number | null {
  if (s.entry == null || s.stop == null || s.target == null) return null;
  const risk = Math.abs(s.entry - s.stop);
  return risk ? Math.abs(s.target - s.entry) / risk : null;
}

// ─── Simulation engine ─────────────────────────────────────────────────────

/**
 * Simulate a locked decision over the candles revealed after it.
 * Rules: the order fills when price trades through the entry (at the open
 * if price gaps past it); it is cancelled if the target is reached first
 * or after 30 candles unfilled. Once filled the stop and target are fixed —
 * if both are touched in one candle the stop is assumed (conservative).
 */
export function simulate(s: Pick<PracticeSession, 'decision' | 'entry' | 'stop' | 'target' | 'manualExit'>, after: Candle[]): SimOutcome {
  const base: SimOutcome = {
    filled: false,
    fillTime: null,
    fillPrice: null,
    exitTime: null,
    exitPrice: null,
    exitReason: 'open',
    resultR: null,
    mfeR: 0,
    maeR: 0,
    bars: after.length,
    ambiguous: false,
  };
  if (s.decision !== 'long' && s.decision !== 'short') return base;
  if (s.entry == null || s.stop == null || s.target == null) return base;
  const long = s.decision === 'long';
  const risk = Math.abs(s.entry - s.stop);
  if (!risk) return base;
  const dir = long ? 1 : -1;
  const out = { ...base };

  let i = 0;
  // 1) Fill
  for (; i < after.length; i++) {
    const k = after[i];
    if (s.manualExit && k.t > s.manualExit.t) break;
    const above = s.entry >= after[0].o; // entry was above the market when the order started
    const touched = above ? k.h >= s.entry : k.l <= s.entry;
    const targetFirst = long ? k.h >= s.target && !touched : k.l <= s.target && !touched;
    if (touched) {
      const gapped = above ? k.o >= s.entry : k.o <= s.entry;
      out.filled = true;
      out.fillTime = k.t;
      out.fillPrice = gapped ? k.o : s.entry;
      break;
    }
    if (targetFirst || i >= 29) {
      out.exitReason = 'not-filled';
      out.exitTime = k.t;
      return out;
    }
  }
  if (!out.filled) {
    if (s.manualExit) out.exitReason = 'not-filled';
    return out;
  }

  // 2) Manage
  const fill = out.fillPrice!;
  for (; i < after.length; i++) {
    const k = after[i];
    if (s.manualExit && k.t >= s.manualExit.t) {
      out.exitReason = 'manual';
      out.exitTime = s.manualExit.t;
      out.exitPrice = s.manualExit.price;
      break;
    }
    const fav = long ? k.h - fill : fill - k.l;
    const adv = long ? fill - k.l : k.h - fill;
    out.mfeR = Math.max(out.mfeR, fav / risk);
    out.maeR = Math.max(out.maeR, adv / risk);
    const hitStop = long ? k.l <= s.stop : k.h >= s.stop;
    const hitTarget = long ? k.h >= s.target : k.l <= s.target;
    if (hitStop) {
      out.exitReason = 'stop';
      out.exitTime = k.t;
      out.exitPrice = s.stop;
      out.ambiguous = hitTarget;
      break;
    }
    if (hitTarget) {
      out.exitReason = 'target';
      out.exitTime = k.t;
      out.exitPrice = s.target;
      break;
    }
  }
  if (out.exitPrice != null) out.resultR = ((out.exitPrice - fill) * dir) / risk;
  else if (after.length) out.resultR = ((after[after.length - 1].c - fill) * dir) / risk; // still open: mark-to-market
  out.mfeR = Math.round(out.mfeR * 100) / 100;
  out.maeR = Math.round(out.maeR * 100) / 100;
  return out;
}

/** What the market did after a decision — used for No Trade and the comparison panel. */
export function describeAfter(before: Candle[], after: Candle[]): AfterMove {
  const ref = before[before.length - 1]?.c ?? after[0]?.o ?? 0;
  const a = atr(before) || 1;
  const hi = Math.max(...after.map((k) => k.h), ref);
  const lo = Math.min(...after.map((k) => k.l), ref);
  const up = hi - ref;
  const down = ref - lo;
  const pct = (x: number) => (ref ? (x / ref) * 100 : 0);
  const upAtr = up / a;
  const downAtr = down / a;
  let summary: string;
  if (!after.length) summary = 'No candles revealed after the decision yet.';
  else if (upAtr < 1.5 && downAtr < 1.5) summary = `Price stayed in a narrow range over the next ${after.length} candles.`;
  else if (upAtr >= downAtr * 1.5) summary = `Price later rose ${pct(up).toFixed(2)}% (${upAtr.toFixed(1)}× ATR) over the next ${after.length} candles.`;
  else if (downAtr >= upAtr * 1.5) summary = `Price later fell ${pct(down).toFixed(2)}% (${downAtr.toFixed(1)}× ATR) over the next ${after.length} candles.`;
  else summary = `Price swung both ways (+${pct(up).toFixed(2)}% / −${pct(down).toFixed(2)}%) — a choppy, two-sided move.`;
  return { bars: after.length, upPct: pct(up), downPct: pct(down), upAtr, downAtr, summary };
}

// ─── Mistake suggestions ───────────────────────────────────────────────────

/** Mistakes the session data suggests. The user confirms them in review. */
export function suggestMistakes(s: PracticeSession): MistakeKey[] {
  const out = new Set<MistakeKey>();
  const observed = s.decisionIndex != null ? s.decisionIndex - s.startIndex + 1 : 0;
  if (s.decision && s.decision !== 'notrade') {
    const rr = plannedRRFor(s);
    if (rr == null || rr < 1) out.add('risk');
    if (observed < 3) out.add('early');
    if (!s.selfCheck.confirmation) out.add('confirmation');
    if (s.strategyRules.length && s.strategyRules.some((r) => !s.ruleChecks[r.key])) out.add('rules');
    if (!s.drawings.some((d) => d.kind === 'support' || d.kind === 'resistance' || d.kind === 'trend' || d.kind === 'hline') && s.reason.trim().length < 30)
      out.add('structure');
    if (s.outcome?.exitReason === 'manual' && (s.outcome.mfeR ?? 0) >= (plannedRRFor(s) ?? 99)) out.add('exit');
    if (s.confidence >= 9 && observed < 5) out.add('fomo');
  }
  return [...out];
}

// ─── Process score ─────────────────────────────────────────────────────────

const clamp = (x: number) => Math.max(0, Math.min(100, Math.round(x)));

/**
 * Practice Quality Score — process first. The simulated result is not an
 * input: a well-planned losing simulation can score higher than a lucky win.
 */
export function scoreSession(s: PracticeSession): ProcessScore {
  const trade = s.decision === 'long' || s.decision === 'short';
  const observed = s.decisionIndex != null ? s.decisionIndex - s.startIndex + 1 : 0;
  const rr = plannedRRFor(s);
  const parts: ProcessScore['parts'] = [];

  // Strategy adherence
  let strat: number;
  let stratNote: string;
  if (s.strategyRules.length) {
    const met = s.strategyRules.filter((r) => s.ruleChecks[r.key]).length;
    strat = (met / s.strategyRules.length) * 100;
    if (s.decision === 'notrade') strat = Math.max(strat, s.noTradeReason === 'Outside strategy rules' ? 100 : 70);
    stratNote = `${met}/${s.strategyRules.length} strategy rules met`;
  } else {
    strat = 50;
    stratNote = 'No strategy selected — neutral score';
  }
  parts.push({ key: 'strategy', label: 'Strategy adherence', score: clamp(strat), weight: 20, note: stratNote });

  // Risk planning
  let risk: number;
  let riskNote: string;
  if (trade) {
    risk = 0;
    if (s.stop != null) risk += 40;
    if (s.target != null) risk += 30;
    if (rr != null) risk += rr >= 1.5 ? 30 : rr >= 1 ? 15 : 0;
    riskNote = rr == null ? 'Incomplete risk plan' : `Planned R:R 1:${rr.toFixed(2)}`;
  } else {
    risk = s.noTradeReason ? (s.noTradeReason === 'Poor risk/reward' ? 100 : 85) : 60;
    riskNote = 'Capital protected by standing aside';
  }
  parts.push({ key: 'risk', label: 'Risk planning', score: clamp(risk), weight: 20, note: riskNote });

  // Confirmation
  const waitReasons: string[] = ['Waiting for confirmation', 'Conflicting signals', 'No clear setup'];
  const conf = trade ? (s.selfCheck.confirmation ? 100 : 30) : waitReasons.includes(s.noTradeReason) ? 100 : 75;
  parts.push({ key: 'confirmation', label: 'Confirmation', score: conf, weight: 15, note: trade ? (s.selfCheck.confirmation ? 'Waited for confirmation' : 'Entered without confirmation') : 'Waited instead of forcing a trade' });

  // Patience
  const pat = observed >= 10 ? 100 : observed >= 5 ? 75 : observed >= 3 ? 55 : 35;
  parts.push({ key: 'patience', label: 'Patience', score: clamp(trade ? pat : Math.max(pat, 80)), weight: 15, note: `${observed} candle${observed === 1 ? '' : 's'} studied before deciding` });

  // Market structure analysis
  const structural = s.drawings.filter((d) => d.kind === 'support' || d.kind === 'resistance' || d.kind === 'trend' || d.kind === 'hline').length;
  const reasonLen = (trade ? s.reason : `${s.reason} ${s.noTradeOther}`).trim().length;
  const struct = (structural ? Math.min(60, 35 + structural * 10) : 0) + (reasonLen >= 60 ? 40 : reasonLen >= 20 ? 25 : reasonLen ? 10 : 0);
  parts.push({ key: 'structure', label: 'Market structure analysis', score: clamp(struct), weight: 15, note: `${structural} level/trendline drawing${structural === 1 ? '' : 's'}, ${reasonLen ? 'written reasoning' : 'no written reasoning'}` });

  // Emotional discipline
  let emo = s.confidence >= 4 && s.confidence <= 8 ? 90 : s.confidence === 3 || s.confidence === 9 ? 70 : 45;
  if (s.selfCheck.calm) emo += 10;
  if (s.mistakes.includes('fomo') || s.mistakes.includes('overtrading')) emo -= 40;
  if (trade && s.selfCheck.plan) emo += 0;
  else if (trade) emo -= 15;
  parts.push({ key: 'emotion', label: 'Emotional discipline', score: clamp(emo), weight: 15, note: `Confidence ${s.confidence}/10${s.selfCheck.calm ? ', calm' : ''}` });

  const total = clamp(parts.reduce((a, p) => a + (p.score * p.weight) / 100, 0));
  const weakest = [...parts].sort((a, b) => a.score - b.score).slice(0, 2);
  const explanation =
    total >= 80
      ? `A disciplined process. Keep refining ${weakest[0].label.toLowerCase()}.`
      : `Biggest gains available in ${weakest.map((w) => w.label.toLowerCase()).join(' and ')}.`;
  const setupScore = (parts[0].score + parts[1].score + parts[4].score) / 3;
  return {
    total,
    parts,
    explanation: `${explanation} The simulated result is not part of this score.`,
    setupQuality: setupScore >= 75 ? 'High' : setupScore >= 50 ? 'Moderate' : 'Low',
    decisionQuality: total >= 80 ? 'Strong process' : total >= 60 ? 'Sound with gaps' : 'Needs work',
  };
}

// ─── Insights ──────────────────────────────────────────────────────────────

export function practiceMistakeCounts(sessions: PracticeSession[]) {
  return MISTAKES.map((m) => ({ ...m, count: sessions.filter((s) => s.mistakes.includes(m.key)).length }))
    .filter((m) => m.count > 0)
    .sort((a, b) => b.count - a.count);
}

/** YOUR NEXT 1% IMPROVEMENT, from the most frequent confirmed mistake. */
export function nextImprovement(sessions: PracticeSession[]): { headline: string; focus: string } | null {
  const top = practiceMistakeCounts(sessions.filter((s) => s.status === 'complete'))[0];
  if (!top) return null;
  return { headline: `Your most frequent issue is “${top.label.toLowerCase()}” (${top.count}×).`, focus: top.focus };
}

// ─── Daily practice challenge (84-day system) ──────────────────────────────

export type ChallengeStatus = 'completed' | 'skipped' | 'reviewed';
export interface ChallengeDoc {
  id: string; // day number
  status: ChallengeStatus;
  at: number;
  note: string;
}

const PHASE_CHALLENGES: Record<number, (topic: string) => string> = {
  1: (t) => `Replay one day of BTC/USDT and note how "${t}" shows up on the chart.`,
  2: (t) => `Replay 20 candles and label each one — focus on "${t}".`,
  3: (t) => `Find 3 historical examples of ${t.toLowerCase()} reactions.`,
  4: (t) => `Replay a trend and mark every swing — focus on "${t}".`,
  5: (t) => `Replay 3 setups and note what ${t.toLowerCase()} suggested before each move.`,
  6: (t) => `Make 3 replay decisions with a written stop and target — focus on "${t}".`,
  7: () => `Replay 3 setups using your own strategy and tick every rule honestly.`,
  8: () => `Run 5 replay decisions with one strategy and record each in the journal.`,
  9: () => `Run a full simulation session and let every trade reach its stop or target.`,
  10: (t) => `Make 3 replay decisions and rate your mindset — watch for "${t}".`,
  11: () => `Replay your best setup twice and copy the lesson into your playbook.`,
  12: () => `Run 3 replay decisions and compare your process scores with week 1.`,
};

export function challengeFor(day: number): string {
  const lesson = LESSONS_BY_DAY[Math.min(Math.max(day, 1), 84) - 1];
  const phase = phaseFor(lesson.day);
  if (lesson.review) return 'Review this week’s practice sessions and pick the one decision you would change.';
  return PHASE_CHALLENGES[phase.num](lesson.title);
}
