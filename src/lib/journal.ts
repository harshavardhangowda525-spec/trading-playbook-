// Trading Journal — educational / simulated entries only.
// Types, option lists and pure calculations shared by every journal page.

import { addDays, diffDays, startOfWeek, toKey } from './dates';

export const JOURNAL_COLLECTION = 'jentries';
export const JOURNAL_WEEKLY = 'jweekly';

// ─── Options ───────────────────────────────────────────────────────────────

export const SESSIONS = ['Morning education', 'Evening practice', 'Other'] as const;
export type Session = (typeof SESSIONS)[number];

export const CONDITIONS = ['Trending Up', 'Trending Down', 'Range', 'Volatile', 'Unclear'] as const;
export type Condition = (typeof CONDITIONS)[number];

export const TIMEFRAMES = ['1m', '5m', '15m', '30m', '1h', '4h', 'Daily'];

export const CHECKS = [
  { key: 'strategy', label: 'I followed my strategy' },
  { key: 'confirmation', label: 'I waited for confirmation' },
  { key: 'entry', label: 'I respected my planned entry' },
  { key: 'stop', label: 'I respected my stop' },
  { key: 'fomo', label: 'I avoided FOMO' },
  { key: 'revenge', label: 'I avoided revenge trading' },
  { key: 'rules', label: 'I followed my trading rules' },
] as const;
export type CheckKey = (typeof CHECKS)[number]['key'];

export const RESULTS = [
  { key: 'success', label: 'Successful Simulation', short: 'Successful' },
  { key: 'fail', label: 'Unsuccessful Simulation', short: 'Unsuccessful' },
  { key: 'breakeven', label: 'Break-even', short: 'Break-even' },
  { key: 'notrade', label: 'No Trade', short: 'No trade' },
] as const;
export type ResultKey = (typeof RESULTS)[number]['key'];

export const MINDSETS = ['Calm', 'Focused', 'Uncertain', 'Impulsive', 'Emotional'] as const;
export type Mindset = (typeof MINDSETS)[number];

/** Each mistake carries the lesson and next-day focus used by the 1% engine. */
export const MISTAKES = [
  { key: 'fomo', label: 'FOMO', lesson: 'Let the setup come to you instead of chasing price.', focus: 'Only study setups that are fully formed before entry.' },
  { key: 'early', label: 'Entered too early', lesson: 'Wait for confirmation before entering.', focus: 'Only study setups with clear confirmation.' },
  { key: 'late', label: 'Entered too late', lesson: 'Prepare levels in advance so entries are not delayed.', focus: 'Mark entry levels before the session starts.' },
  { key: 'structure', label: 'Ignored market structure', lesson: 'Read market structure before looking for an entry.', focus: 'Label highs and lows before analysing any setup.' },
  { key: 'confirmation', label: 'Ignored confirmation', lesson: 'A setup without confirmation is only an idea.', focus: 'Write the confirmation rule down before each entry.' },
  { key: 'risk', label: 'Poor risk planning', lesson: 'Define stop and target before the entry, not after.', focus: 'Calculate R:R before every simulated entry.' },
  { key: 'overtrading', label: 'Overtrading', lesson: 'Fewer, higher-quality setups beat many average ones.', focus: 'Limit tomorrow to your best one or two setups.' },
  { key: 'rules', label: 'Broke strategy rules', lesson: 'The plan only works if it is followed every time.', focus: 'Read your playbook rules before the session.' },
  { key: 'stop', label: 'Moved stop unnecessarily', lesson: 'The stop marks where the idea is wrong — respect it.', focus: 'Set the stop once and leave it.' },
  { key: 'exit', label: 'Exited too early', lesson: 'Let the trade reach its planned target or invalidation.', focus: 'Hold simulations to the planned target or stop.' },
  { key: 'nosetup', label: 'No clear setup', lesson: 'No clear setup means no trade.', focus: 'Only act when every setup condition is visible.' },
  { key: 'other', label: 'Other', lesson: 'Review what went wrong and write a rule to prevent it.', focus: 'Turn today’s mistake into one written rule.' },
] as const;
export type MistakeKey = (typeof MISTAKES)[number]['key'];

/** Lessons for an unchecked execution-review item (used when no mistake is selected). */
const CHECK_LESSONS: Record<CheckKey, { lesson: string; focus: string }> = {
  strategy: { lesson: 'Stay inside your strategy — it is your edge.', focus: 'Only study setups your strategy defines.' },
  confirmation: { lesson: 'Wait for confirmation before entering.', focus: 'Only study setups with clear confirmation.' },
  entry: { lesson: 'Respect the planned entry price.', focus: 'Write the entry level down before the setup triggers.' },
  stop: { lesson: 'Respect the stop — it defines your risk.', focus: 'Keep every stop exactly where you planned it.' },
  fomo: { lesson: 'Avoid chasing moves you missed.', focus: 'If you missed the entry, let it go and wait for the next one.' },
  revenge: { lesson: 'Never try to win back a previous result.', focus: 'Pause for five minutes after any unsuccessful simulation.' },
  rules: { lesson: 'Follow every written trading rule.', focus: 'Read your playbook rules before the session.' },
};

// ─── Entry ─────────────────────────────────────────────────────────────────

export interface JournalTradeEntry {
  id: string;
  createdAt: number;
  updatedAt: number;
  // basic
  date: string;
  session: Session;
  market: string;
  timeframe: string;
  condition: Condition | '';
  strategyId: string;
  // setup
  setup: string;
  direction: 'long' | 'short';
  entry: number | null;
  stop: number | null;
  target: number | null;
  exit: number | null;
  size: number | null;
  // analysis
  why: string;
  confirmed: string;
  structure: string;
  context: string;
  expected: string;
  invalidation: string;
  // execution
  checks: Partial<Record<CheckKey, boolean>>;
  // result
  result: ResultKey | '';
  happened: string;
  learned: string;
  improve: string;
  // chart
  image: string | null;
  imageNotes: string;
  // mindset
  mindset: Mindset | '';
  confidence: number;
  discipline: number;
  focus: number;
  // mistakes
  mistakes: MistakeKey[];
  otherMistake: string;
  // Practice Lab link (entries saved from a replay session)
  practiceId?: string;
  processScore?: number | null;
}

export function blankEntry(date: string): Omit<JournalTradeEntry, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    date,
    session: 'Evening practice',
    market: '',
    timeframe: '5m',
    condition: '',
    strategyId: '',
    setup: '',
    direction: 'long',
    entry: null,
    stop: null,
    target: null,
    exit: null,
    size: null,
    why: '',
    confirmed: '',
    structure: '',
    context: '',
    expected: '',
    invalidation: '',
    checks: {},
    result: '',
    happened: '',
    learned: '',
    improve: '',
    image: null,
    imageNotes: '',
    mindset: '',
    confidence: 5,
    discipline: 5,
    focus: 5,
    mistakes: [],
    otherMistake: '',
  };
}

// ─── Calculations ──────────────────────────────────────────────────────────

/** Planned reward ÷ risk from entry, stop and target. */
export function plannedRR(e: Pick<JournalTradeEntry, 'entry' | 'stop' | 'target'>): number | null {
  if (e.entry == null || e.stop == null || e.target == null) return null;
  const risk = Math.abs(e.entry - e.stop);
  return risk ? Math.abs(e.target - e.entry) / risk : null;
}

/** Simulated outcome in R using the simulated exit price. */
export function simulatedR(e: Pick<JournalTradeEntry, 'entry' | 'stop' | 'exit' | 'direction'>): number | null {
  if (e.entry == null || e.stop == null || e.exit == null) return null;
  const risk = Math.abs(e.entry - e.stop);
  if (!risk) return null;
  const move = e.direction === 'long' ? e.exit - e.entry : e.entry - e.exit;
  return move / risk;
}

/** Share of execution-review items ticked (0..1). */
export function ruleScore(e: Pick<JournalTradeEntry, 'checks'>): number {
  return CHECKS.filter((c) => e.checks[c.key]).length / CHECKS.length;
}

export const mistakeLabel = (k: MistakeKey) => MISTAKES.find((m) => m.key === k)?.label ?? k;
export const resultLabel = (k: ResultKey | '') => RESULTS.find((r) => r.key === k)?.short ?? '—';

export interface Improvement {
  lesson: string;
  focus: string;
  source: 'mistake' | 'checklist' | 'reflection' | 'success' | 'empty';
}

/**
 * TODAY'S 1% IMPROVEMENT — rule-based summary of the main lesson.
 * Priority: the most important selected mistake → the first unticked
 * execution check → the user's own "improve next time" answer.
 */
export function improvementFor(e: JournalTradeEntry): Improvement {
  const own = e.improve.trim();
  const m = MISTAKES.find((x) => e.mistakes.includes(x.key));
  if (m) {
    const lesson = m.key === 'other' && e.otherMistake.trim() ? `Prevent this: ${e.otherMistake.trim()}.` : m.lesson;
    return { lesson, focus: own || m.focus, source: 'mistake' };
  }
  const anyChecked = CHECKS.some((c) => e.checks[c.key]);
  const missed = CHECKS.find((c) => !e.checks[c.key]);
  if (anyChecked && missed) {
    const l = CHECK_LESSONS[missed.key];
    return { lesson: l.lesson, focus: own || l.focus, source: 'checklist' };
  }
  if (own) return { lesson: e.learned.trim() || own, focus: own, source: 'reflection' };
  if (anyChecked && !missed) {
    return { lesson: 'You followed every rule — repeat the same process.', focus: 'Keep the same preparation routine tomorrow.', source: 'success' };
  }
  return { lesson: 'Complete the execution review to generate a lesson.', focus: 'Record what you will improve next time.', source: 'empty' };
}

export function mainLesson(e: JournalTradeEntry): string {
  return e.learned.trim() || improvementFor(e).lesson;
}

export interface MistakeCount {
  key: MistakeKey;
  label: string;
  count: number;
  lesson: string;
  focus: string;
}

export function mistakeCounts(entries: JournalTradeEntry[]): MistakeCount[] {
  return MISTAKES.map((m) => ({ key: m.key, label: m.label, lesson: m.lesson, focus: m.focus, count: entries.filter((e) => e.mistakes.includes(m.key)).length }))
    .filter((m) => m.count > 0)
    .sort((a, b) => b.count - a.count);
}

export function countBy<T>(items: T[], key: (t: T) => string): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const it of items) {
    const k = key(it).trim();
    if (!k) continue;
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
}

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);

/** Consecutive days (ending today, or yesterday if today has none yet) with at least one entry. */
export function journalStreak(entries: JournalTradeEntry[], today: string): { current: number; longest: number } {
  const days = new Set(entries.map((e) => e.date));
  let current = 0;
  let cursor = days.has(today) ? today : addDays(today, -1);
  while (days.has(cursor)) {
    current++;
    cursor = addDays(cursor, -1);
  }
  const sorted = [...days].filter((d) => d <= today).sort();
  let longest = 0;
  let run = 0;
  for (let i = 0; i < sorted.length; i++) {
    run = i > 0 && diffDays(sorted[i - 1], sorted[i]) === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }
  return { current, longest: Math.max(longest, current) };
}

export interface JournalStats {
  total: number;
  setups: number;
  wins: number;
  losses: number;
  ruleFollowing: number | null;
  avgRR: number | null;
  avgSimR: number | null;
  topMistake: MistakeCount | null;
  streak: { current: number; longest: number };
}

export function journalStats(entries: JournalTradeEntry[], today: string): JournalStats {
  const reviewed = entries.filter((e) => CHECKS.some((c) => e.checks[c.key] !== undefined));
  return {
    total: entries.length,
    setups: new Set(entries.map((e) => e.setup.trim().toLowerCase()).filter(Boolean)).size,
    wins: entries.filter((e) => e.result === 'success').length,
    losses: entries.filter((e) => e.result === 'fail').length,
    ruleFollowing: avg(reviewed.map(ruleScore)),
    avgRR: avg(entries.map(plannedRR).filter((x): x is number => x != null)),
    avgSimR: avg(entries.map(simulatedR).filter((x): x is number => x != null)),
    topMistake: mistakeCounts(entries)[0] ?? null,
    streak: journalStreak(entries, today),
  };
}

export function sortEntries(entries: JournalTradeEntry[]): JournalTradeEntry[] {
  return [...entries].sort((a, b) => (a.date === b.date ? b.createdAt - a.createdAt : a.date < b.date ? 1 : -1));
}

// ─── Weekly review ─────────────────────────────────────────────────────────

export interface WeeklyDoc {
  id: string; // Monday date key
  target: string;
  reflection: string;
}

export function weekEntries(entries: JournalTradeEntry[], weekStart: string) {
  const end = addDays(weekStart, 6);
  return entries.filter((e) => e.date >= weekStart && e.date <= end);
}

export interface WeeklySummary {
  studied: { label: string; count: number }[];
  didWell: string[];
  repeated: MistakeCount[];
  improved: string[];
  biggestLesson: string | null;
  fixNext: string | null;
  ruleFollowing: number | null;
  prevRuleFollowing: number | null;
  count: number;
}

export function weeklySummary(entries: JournalTradeEntry[], weekStart: string): WeeklySummary {
  const cur = weekEntries(entries, weekStart);
  const prev = weekEntries(entries, addDays(weekStart, -7));
  const reviewedRule = (xs: JournalTradeEntry[]) => avg(xs.filter((e) => Object.keys(e.checks).length).map(ruleScore));

  const studied = countBy(cur, (e) => [e.market, e.setup].filter(Boolean).join(' · '));

  const didWell: string[] = [];
  for (const c of CHECKS) {
    const reviewed = cur.filter((e) => Object.keys(e.checks).length);
    if (reviewed.length && reviewed.every((e) => e.checks[c.key])) didWell.push(c.label);
  }
  const successes = cur.filter((e) => e.result === 'success').length;
  if (successes) didWell.push(`${successes} successful simulation${successes > 1 ? 's' : ''}`);
  const notrade = cur.filter((e) => e.result === 'notrade').length;
  if (notrade) didWell.push(`Chose not to trade ${notrade} time${notrade > 1 ? 's' : ''} — patience counts`);

  const repeated = mistakeCounts(cur).filter((m) => m.count >= 2);

  const improved: string[] = [];
  const prevCounts = new Map(mistakeCounts(prev).map((m) => [m.key, m.count]));
  const curCounts = new Map(mistakeCounts(cur).map((m) => [m.key, m.count]));
  for (const [k, n] of prevCounts) {
    const now = curCounts.get(k) ?? 0;
    if (now < n) improved.push(`${mistakeLabel(k)}: ${n} → ${now}`);
  }
  const rf = reviewedRule(cur);
  const prf = reviewedRule(prev);
  if (rf != null && prf != null && rf > prf) improved.push(`Rule-following up from ${Math.round(prf * 100)}% to ${Math.round(rf * 100)}%`);

  const lessons = cur.map((e) => e.learned.trim()).filter(Boolean);
  const top = mistakeCounts(cur)[0];
  return {
    studied,
    didWell,
    repeated,
    improved,
    biggestLesson: lessons.length ? lessons[lessons.length - 1] : top ? top.lesson : null,
    fixNext: top ? top.focus : null,
    ruleFollowing: rf,
    prevRuleFollowing: prf,
    count: cur.length,
  };
}

// ─── Strategy connection ───────────────────────────────────────────────────

export interface StrategyJournalStats {
  count: number;
  ruleFollowing: number | null;
  mistakes: MistakeCount[];
  lessons: string[];
}

export function strategyStats(entries: JournalTradeEntry[], strategyId: string): StrategyJournalStats {
  const xs = sortEntries(entries.filter((e) => e.strategyId === strategyId));
  return {
    count: xs.length,
    ruleFollowing: avg(xs.filter((e) => Object.keys(e.checks).length).map(ruleScore)),
    mistakes: mistakeCounts(xs).slice(0, 3),
    lessons: xs.map((e) => e.learned.trim()).filter(Boolean).slice(0, 3),
  };
}

// ─── Export ────────────────────────────────────────────────────────────────

const CSV_COLUMNS: (keyof JournalTradeEntry)[] = [
  'date', 'session', 'market', 'timeframe', 'condition', 'setup', 'direction', 'entry', 'stop', 'target', 'exit', 'size',
  'result', 'why', 'confirmed', 'structure', 'context', 'expected', 'invalidation', 'happened', 'learned', 'improve',
  'mindset', 'confidence', 'discipline', 'focus', 'imageNotes',
];

export function toCSV(entries: JournalTradeEntry[]): string {
  const esc = (v: unknown) => {
    const s = v == null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = [...CSV_COLUMNS, 'plannedRR', 'simulatedR', 'ruleFollowingPct', 'mistakes'];
  const rows = sortEntries(entries).map((e) => [
    ...CSV_COLUMNS.map((k) => esc(e[k])),
    esc(plannedRR(e)?.toFixed(2)),
    esc(simulatedR(e)?.toFixed(2)),
    esc(Math.round(ruleScore(e) * 100)),
    esc(e.mistakes.map(mistakeLabel).join('; ')),
  ]);
  return [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function download(filename: string, text: string, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const weekKey = (date: string) => startOfWeek(date);
export const todayKeyLocal = () => toKey(new Date());
