// Types for every stored collection + pure calculations.
// Every statistic is derived from user-entered data; nothing is invented.

import { CATEGORY_META, CLIENT_COUNTERS, SCHEDULE_V1, scheduleFor, type Block, type Category, type ScheduleDef, type TaskDef, type TradingSessionId } from '../data/schedule';
import { LESSONS_BY_DAY, PHASES, TOTAL_DAYS } from '../data/curriculum';
import { addDays, diffDays, todayKey } from './dates';

// ─── Collection names ──────────────────────────────────────────────────────
export const C = {
  settings: 'settings',
  daylog: 'daylog',
  journey: 'journey',
  journal: 'journal',
  trades: 'trades',
  backtests: 'backtests',
  sims: 'sims',
  mistakes: 'mistakes',
  notes: 'notes',
  strategies: 'strategies',
  playbook: 'playbook',
  psych: 'psych',
  practice: 'practice',
  evaluation: 'evaluation',
  timer: 'timer',
} as const;

// ─── Settings ──────────────────────────────────────────────────────────────
export interface Profile {
  id: 'profile';
  startDate: string | null;
  callsign: string;
  targets: Record<string, number>; // client-acquisition counter overrides
}
export const DEFAULT_PROFILE: Profile = { id: 'profile', startDate: null, callsign: '', targets: {} };

export function journeyDay(profile: Profile, today: string): number {
  if (!profile.startDate) return 1;
  return Math.min(Math.max(diffDays(profile.startDate, today) + 1, 1), TOTAL_DAYS);
}

export function counterTarget(profile: Profile, counterId: string): number {
  return profile.targets[counterId] ?? [...CLIENT_COUNTERS, ...SCHEDULE_V1.counters].find((c) => c.id === counterId)?.target ?? 1;
}

// ─── Day log (timetable completion) ────────────────────────────────────────
export interface ActivityEvent {
  at: number;
  taskId: string;
  label: string;
  action: 'done' | 'undone';
}

export interface DayLog {
  id: string; // date key
  done: Record<string, number>; // task / sub-task id → completedAt
  counts: Record<string, number>;
  backupTask?: string;
  activity: ActivityEvent[];
  /** Schedule version the day is evaluated against (absent on older logs → derived from the date). */
  version?: number;
}

export const emptyDayLog = (date: string): DayLog => ({ id: date, done: {}, counts: {}, activity: [] });

/** Schedule for a log (or for a date that has no log yet). */
export function scheduleOf(log: DayLog | undefined, date?: string): ScheduleDef {
  return scheduleFor(log?.id ?? date ?? todayKey(), log);
}

export function sessionStats(log: DayLog | undefined, session: TradingSessionId, date?: string) {
  const s = scheduleOf(log, date).sessions.find((x) => x.id === session)!;
  const done = s.tasks.filter((t) => log?.done[t.id]).length;
  return { done, total: s.tasks.length, pct: done / s.tasks.length, complete: done === s.tasks.length };
}

/** A task (or, for composite blocks, a whole block) is done. */
export function isTaskDone(log: DayLog | undefined, taskId: string, date?: string): boolean {
  if (!log) return false;
  const sched = scheduleOf(log, date);
  const block = sched.blocks.find((b) => b.id === taskId);
  if (block) return blockDone(log, block, date);
  return !!log.done[taskId];
}

/** Every checklist item of a block is ticked. */
export function blockDone(log: DayLog | undefined, block: Block, date?: string): boolean {
  if (!log) return false;
  if (block.tasks?.length) return block.tasks.every((t) => !!log.done[t.id]);
  if (block.tradingSession) return sessionStats(log, block.tradingSession, date).complete;
  if (block.counters) return block.counters.every((c) => !!log.done[c.id]);
  return !!log.done[block.id];
}

/** Ticked / total checklist items of one block. */
export function blockProgress(log: DayLog | undefined, block: Block): Ratio {
  if (block.tasks?.length) return ratio(block.tasks.filter((t) => !!log?.done[t.id]).length, block.tasks.length);
  return ratio(blockDone(log, block) ? 1 : 0, 1);
}

export interface Ratio {
  done: number;
  total: number;
  pct: number; // 0..1
}
const ratio = (done: number, total: number): Ratio => ({ done, total, pct: total ? done / total : 0 });

export interface DayStats extends Ratio {
  byCategory: Record<Category, Ratio>;
}

/** Day completion, measured against the schedule that applies to that day. */
export function dayStats(log: DayLog | undefined, date?: string): DayStats {
  const sched = scheduleOf(log, date);
  const done = (t: TaskDef) => (sched.version === 1 ? isTaskDone(log, t.id, date) : !!log?.done[t.id]);
  const byCategory = Object.fromEntries(
    (Object.keys(CATEGORY_META) as Category[]).map((c) => {
      const tasks = sched.tasks.filter((t) => t.category === c);
      return [c, ratio(tasks.filter(done).length, tasks.length)];
    }),
  ) as Record<Category, Ratio>;
  return { ...ratio(sched.tasks.filter(done).length, sched.tasks.length), byCategory };
}

/** Client-acquisition section completion for the day. */
export function clientStats(log: DayLog | undefined, date?: string): Ratio {
  const sched = scheduleOf(log, date);
  if (sched.version === 1) return ratio(sched.counters.filter((c) => log?.done[c.id]).length, sched.counters.length);
  const ids = new Set(sched.blocks.filter((b) => b.section === 'client').map((b) => b.id));
  const tasks = sched.tasks.filter((t) => ids.has(t.blockId));
  return ratio(tasks.filter((t) => log?.done[t.id]).length, tasks.length);
}

// ─── Streaks ───────────────────────────────────────────────────────────────
export type StreakKind = 'daily' | 'trading' | 'study' | 'client' | 'full';

export const STREAK_META: Record<StreakKind, { label: string; rule: string }> = {
  daily: { label: 'Daily Streak', rule: 'Days with ≥ 50% of tasks complete' },
  trading: { label: 'Trading Streak', rule: 'Both trading sessions complete' },
  study: { label: 'Study Streak', rule: '≥ 50% of study blocks complete' },
  client: { label: 'Client Acquisition Streak', rule: '≥ 50% of client tasks complete' },
  full: { label: 'Full-Day Streak', rule: '100% of tasks complete' },
};

export function qualifies(kind: StreakKind, log: DayLog | undefined): boolean {
  if (!log) return false;
  const s = dayStats(log);
  switch (kind) {
    case 'daily':
      return s.pct >= 0.5;
    case 'trading':
      return sessionStats(log, 'morning').complete && sessionStats(log, 'evening').complete;
    case 'study':
      return s.byCategory.study.pct >= 0.5;
    case 'client':
      return clientStats(log).pct >= 0.5;
    case 'full':
      return s.pct >= 1;
  }
}

export interface Streak {
  current: number;
  longest: number;
}

/** Missing a day ends the current run, but history and the longest run are kept. */
export function computeStreak(kind: StreakKind, logs: Map<string, DayLog>, today: string): Streak {
  const keys = [...logs.keys()].filter((k) => k <= today).sort();
  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const k of keys) {
    if (qualifies(kind, logs.get(k))) {
      run = prev && diffDays(prev, k) === 1 && run > 0 ? run + 1 : 1;
      longest = Math.max(longest, run);
    } else {
      run = 0;
    }
    prev = k;
  }
  // Current run ends today, or yesterday if today is still in progress.
  let current = 0;
  let cursor = qualifies(kind, logs.get(today)) ? today : addDays(today, -1);
  while (qualifies(kind, logs.get(cursor))) {
    current++;
    cursor = addDays(cursor, -1);
  }
  return { current, longest: Math.max(longest, current) };
}

export function logMap(logs: DayLog[]): Map<string, DayLog> {
  return new Map(logs.map((l) => [l.id, l]));
}

// ─── 84-day journey ────────────────────────────────────────────────────────
export interface JourneyDay {
  id: string; // day number as string
  day: number;
  completed: boolean;
  completedAt?: number;
  completedDate?: string;
  checks: { learn: boolean; practice: boolean; journal: boolean };
  notes: string;
  takeaways: string;
}
export const emptyJourneyDay = (day: number): JourneyDay => ({
  id: String(day),
  day,
  completed: false,
  checks: { learn: false, practice: false, journal: false },
  notes: '',
  takeaways: '',
});

export type DayState = 'complete' | 'current' | 'missed' | 'future';

export function journeyState(day: number, current: number, rec: JourneyDay | undefined): DayState {
  if (rec?.completed) return 'complete';
  if (day === current) return 'current';
  if (day < current) return 'missed';
  return 'future';
}

// ─── Daily journal ─────────────────────────────────────────────────────────
export interface JournalEntry {
  id: string; // date key
  date: string;
  learn: string;
  practice: string;
  observations: string;
  mistake: string;
  improvement: string;
  confidence: number;
  discipline: number;
  images: string[];
}
export const emptyJournal = (date: string): JournalEntry => ({
  id: date,
  date,
  learn: '',
  practice: '',
  observations: '',
  mistake: '',
  improvement: '',
  confidence: 5,
  discipline: 5,
  images: [],
});

export const JOURNAL_FIELDS = ['learn', 'practice', 'observations', 'mistake', 'improvement'] as const;

/**
 * Journal day score (0–100):
 *  50 pts reflection (10 per answered prompt) · 30 pts discipline rating · 20 pts confidence rating.
 */
export function journalScore(e: JournalEntry | undefined): number | null {
  if (!e) return null;
  const answered = JOURNAL_FIELDS.filter((f) => e[f].trim().length > 0).length;
  if (answered === 0) return null;
  return Math.round(answered * 10 + (e.discipline / 10) * 30 + (e.confidence / 10) * 20);
}

// ─── Trades (journal, backtests, simulation) ───────────────────────────────
export type Outcome = 'win' | 'loss' | 'breakeven' | 'open';
export type Direction = 'long' | 'short';

export interface Trade {
  id: string;
  num: number;
  date: string;
  asset: string;
  direction: Direction;
  setup: string;
  entry: number | null;
  stop: number | null;
  target: number | null;
  size: number | null;
  outcome: Outcome;
  /** Result in R multiples. Empty → derived from outcome & planned R:R. */
  resultR: number | null;
  mistake: string;
  emotion: string;
  notes: string;
  images: string[];
  strategyId?: string;
}

export const emptyTrade = (date: string, num: number): Omit<Trade, 'id'> => ({
  num,
  date,
  asset: '',
  direction: 'long',
  setup: '',
  entry: null,
  stop: null,
  target: null,
  size: null,
  outcome: 'open',
  resultR: null,
  mistake: '',
  emotion: '',
  notes: '',
  images: [],
});

export function tradeRisk(t: Trade): number | null {
  if (t.entry == null || t.stop == null) return null;
  return Math.abs(t.entry - t.stop) * (t.size ?? 1);
}
export function tradeReward(t: Trade): number | null {
  if (t.entry == null || t.target == null) return null;
  return Math.abs(t.target - t.entry) * (t.size ?? 1);
}
export function plannedRR(t: Trade): number | null {
  if (t.entry == null || t.stop == null || t.target == null) return null;
  const risk = Math.abs(t.entry - t.stop);
  if (risk === 0) return null;
  return Math.abs(t.target - t.entry) / risk;
}
export function realizedR(t: Trade): number | null {
  if (t.resultR != null) return t.resultR;
  if (t.outcome === 'win') return plannedRR(t);
  if (t.outcome === 'loss') return -1;
  if (t.outcome === 'breakeven') return 0;
  return null;
}

export interface SetupStat {
  setup: string;
  count: number;
  wins: number;
  winRate: number;
  netR: number;
}

export interface TradeStats {
  total: number;
  closed: number;
  wins: number;
  losses: number;
  breakeven: number;
  winRate: number; // 0..1 of closed trades
  avgRR: number | null;
  netR: number;
  expectancy: number | null;
  bySetup: SetupStat[];
  best: SetupStat | null;
  worst: SetupStat | null;
  equity: { n: number; date: string; r: number; cum: number }[];
}

export function tradeStats(trades: Trade[]): TradeStats {
  const sorted = [...trades].sort((a, b) => (a.date === b.date ? a.num - b.num : a.date < b.date ? -1 : 1));
  const closed = sorted.filter((t) => t.outcome !== 'open');
  const wins = closed.filter((t) => t.outcome === 'win').length;
  const losses = closed.filter((t) => t.outcome === 'loss').length;
  const breakeven = closed.filter((t) => t.outcome === 'breakeven').length;
  const rrs = sorted.map(plannedRR).filter((x): x is number => x != null);
  let cum = 0;
  const equity = closed.map((t, i) => {
    const r = realizedR(t) ?? 0;
    cum += r;
    return { n: i + 1, date: t.date, r, cum: Math.round(cum * 100) / 100 };
  });
  const setups = new Map<string, SetupStat>();
  for (const t of closed) {
    const key = t.setup.trim() || 'Unlabelled';
    const s = setups.get(key) ?? { setup: key, count: 0, wins: 0, winRate: 0, netR: 0 };
    s.count++;
    if (t.outcome === 'win') s.wins++;
    s.netR += realizedR(t) ?? 0;
    setups.set(key, s);
  }
  const bySetup = [...setups.values()]
    .map((s) => ({ ...s, winRate: s.count ? s.wins / s.count : 0, netR: Math.round(s.netR * 100) / 100 }))
    .sort((a, b) => b.netR - a.netR);
  return {
    total: sorted.length,
    closed: closed.length,
    wins,
    losses,
    breakeven,
    winRate: closed.length ? wins / closed.length : 0,
    avgRR: rrs.length ? rrs.reduce((a, b) => a + b, 0) / rrs.length : null,
    netR: Math.round(cum * 100) / 100,
    expectancy: closed.length ? cum / closed.length : null,
    bySetup,
    best: bySetup.length ? bySetup[0] : null,
    worst: bySetup.length > 1 ? bySetup[bySetup.length - 1] : null,
    equity,
  };
}

// ─── Mistakes ──────────────────────────────────────────────────────────────
export interface Mistake {
  id: string;
  title: string;
  category: string;
  date: string;
  tradeRef: string;
  why: string;
  shouldHave: string;
  prevention: string;
  status: 'open' | 'improved';
  improvedAt?: string;
}

export const MISTAKE_CATEGORIES = [
  'Entered without setup',
  'FOMO / chasing',
  'Moved stop-loss',
  'No stop-loss',
  'Oversized position',
  'Exited too early',
  'Held past target',
  'Revenge trade',
  'Overtrading',
  'Ignored no-trade rule',
  'Poor level identification',
  'Misread market structure',
  'Other',
];

export function mistakeStats(mistakes: Mistake[]) {
  const counts = new Map<string, number>();
  for (const m of mistakes) counts.set(m.category || m.title, (counts.get(m.category || m.title) ?? 0) + 1);
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return {
    total: mistakes.length,
    improved: mistakes.filter((m) => m.status === 'improved').length,
    open: mistakes.filter((m) => m.status === 'open').length,
    mostCommon: ranked[0] ? { label: ranked[0][0], count: ranked[0][1] } : null,
    frequency: ranked.map(([label, count]) => ({ label, count })),
  };
}

// ─── Knowledge vault ───────────────────────────────────────────────────────
export interface Note {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  date: string;
  importance: number; // 1..5
}
export const NOTE_CATEGORIES = [
  'Concepts',
  'Strategies',
  'Indicators',
  'Candlestick patterns',
  'Market structure',
  'Risk management',
  'Psychology',
  'Mistakes',
  'Useful observations',
];

// ─── Strategy lab ──────────────────────────────────────────────────────────
export interface Strategy {
  id: string;
  name: string;
  market: string;
  timeframe: string;
  condition: string;
  setup: string;
  confirmation: string;
  entryTrigger: string;
  stopLoss: string;
  target: string;
  riskReward: string;
  exitRules: string;
  invalidation: string;
  noTrade: string;
  examples: string;
  notes: string;
  images: string[];
  status: 'draft' | 'active';
  updatedAt: number;
}

export const STRATEGY_FIELDS: { key: keyof Strategy; label: string; long?: boolean }[] = [
  { key: 'name', label: 'Strategy Name' },
  { key: 'market', label: 'Market' },
  { key: 'timeframe', label: 'Timeframe' },
  { key: 'condition', label: 'Market Condition', long: true },
  { key: 'setup', label: 'Setup', long: true },
  { key: 'confirmation', label: 'Confirmation', long: true },
  { key: 'entryTrigger', label: 'Entry Trigger', long: true },
  { key: 'stopLoss', label: 'Stop Loss', long: true },
  { key: 'target', label: 'Target', long: true },
  { key: 'riskReward', label: 'Risk / Reward' },
  { key: 'exitRules', label: 'Exit Rules', long: true },
  { key: 'invalidation', label: 'Invalidation', long: true },
  { key: 'noTrade', label: 'No-Trade Conditions', long: true },
  { key: 'examples', label: 'Examples', long: true },
  { key: 'notes', label: 'Notes', long: true },
];

export function strategyCompletion(s: Strategy | undefined): number {
  if (!s) return 0;
  const filled = STRATEGY_FIELDS.filter((f) => String(s[f.key] ?? '').trim().length > 0).length;
  return filled / STRATEGY_FIELDS.length;
}

// ─── Playbook ──────────────────────────────────────────────────────────────
export const PLAYBOOK_SECTIONS = [
  { id: 'market', title: 'My Market', prompt: 'What market, instrument and session do you trade?' },
  { id: 'strategy', title: 'My Strategy', prompt: 'Summarise your strategy in a few sentences.' },
  { id: 'entry', title: 'Entry Rules', prompt: 'Every condition that must be true before you enter.' },
  { id: 'stop', title: 'Stop-Loss Rules', prompt: 'Where the stop goes and why.' },
  { id: 'exit', title: 'Exit Rules', prompt: 'Targets, trailing, time exits, early invalidation.' },
  { id: 'risk', title: 'Risk Rules', prompt: 'Risk per trade, max daily loss, max trades, minimum R:R.' },
  { id: 'notrade', title: 'No-Trade Conditions', prompt: 'When you will NOT trade.' },
  { id: 'psychology', title: 'Psychology Rules', prompt: 'Mental rules: pre-session check, post-loss routine, walk-away rules.' },
  { id: 'best', title: 'Best Setups', prompt: 'Your highest-quality setups, backed by your data.' },
  { id: 'mistakes', title: 'Common Mistakes', prompt: 'Your most frequent mistakes and how you prevent them.' },
] as const;

export interface Playbook {
  id: 'main';
  sections: Record<string, string>;
  updatedAt?: number;
}
export const DEFAULT_PLAYBOOK: Playbook = { id: 'main', sections: {} };

export function playbookCompletion(p: Playbook | undefined): number {
  if (!p) return 0;
  return PLAYBOOK_SECTIONS.filter((s) => (p.sections[s.id] ?? '').trim().length > 0).length / PLAYBOOK_SECTIONS.length;
}

// ─── Psychology journal ────────────────────────────────────────────────────
export const EMOTIONS = [
  { key: 'fomo', label: 'FOMO' },
  { key: 'fear', label: 'Fear' },
  { key: 'greed', label: 'Greed' },
  { key: 'revenge', label: 'Revenge trading' },
  { key: 'overtrading', label: 'Overtrading' },
  { key: 'impatience', label: 'Impatience' },
  { key: 'confidence', label: 'Confidence' },
  { key: 'discipline', label: 'Discipline' },
] as const;
export type EmotionKey = (typeof EMOTIONS)[number]['key'];

export interface PsychEntry {
  id: string; // date
  date: string;
  emotions: Partial<Record<EmotionKey, number>>; // 0..10 intensity
  rating: number; // 1..10 overall emotional state
  triggers: string;
  notes: string;
}
export const emptyPsych = (date: string): PsychEntry => ({ id: date, date, emotions: {}, rating: 5, triggers: '', notes: '' });

// ─── Chart practice ────────────────────────────────────────────────────────
export interface PracticeLog {
  id: string;
  date: string;
  kind: string;
  reps: number;
  correct?: number; // trainer results
  notes: string;
  images: string[];
}
export const PRACTICE_KINDS = [
  'Candle identification',
  'Support & resistance marking',
  'Market structure labelling',
  'Breakout / retest spotting',
  'Indicator reading',
  'Full chart markup',
  'Candle Trainer (synthetic)',
];

// ─── Evaluation ────────────────────────────────────────────────────────────
export const EVAL_AREAS = [
  { key: 'knowledge', label: 'Knowledge' },
  { key: 'technical', label: 'Technical Analysis' },
  { key: 'risk', label: 'Risk Management' },
  { key: 'strategy', label: 'Strategy' },
  { key: 'discipline', label: 'Discipline' },
  { key: 'backtesting', label: 'Backtesting' },
  { key: 'simulation', label: 'Simulated Trading' },
  { key: 'psychology', label: 'Psychology' },
] as const;
export type EvalKey = (typeof EVAL_AREAS)[number]['key'];

export interface Evaluation {
  id: 'main';
  self: Partial<Record<EvalKey, number>>; // 0..100
  notes: string;
  focus: string;
}
export const DEFAULT_EVALUATION: Evaluation = { id: 'main', self: {}, notes: '', focus: '' };

// ─── Session timer ─────────────────────────────────────────────────────────
export interface TimerState {
  id: 'current';
  session: TradingSessionId;
  date: string;
  status: 'idle' | 'running' | 'paused' | 'complete';
  startedAt: number | null; // epoch ms of the current running stretch
  accumulated: number; // seconds banked before the current stretch
}
export const DEFAULT_TIMER: TimerState = { id: 'current', session: 'morning', date: '', status: 'idle', startedAt: null, accumulated: 0 };

export function timerElapsed(t: TimerState, now = Date.now()): number {
  return t.accumulated + (t.status === 'running' && t.startedAt ? (now - t.startedAt) / 1000 : 0);
}

// ─── Skill model (dashboard rings, radar, evaluation) ──────────────────────
export interface SkillInputs {
  journey: JourneyDay[];
  backtests: Trade[];
  sims: Trade[];
  trades: Trade[];
  journals: JournalEntry[];
  psych: PsychEntry[];
  practice: PracticeLog[];
  strategies: Strategy[];
  playbook: Playbook | undefined;
  logs: DayLog[];
  mistakes: Mistake[];
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const recent = <T extends { date: string }>(xs: T[], n: number) => [...xs].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, n);

function phaseRatio(journey: JourneyDay[], phases: number[]): number {
  const days = LESSONS_BY_DAY.filter((l) => phases.includes(l.phase)).map((l) => l.day);
  const done = journey.filter((j) => j.completed && days.includes(j.day)).length;
  return days.length ? done / days.length : 0;
}

export interface Skills {
  knowledge: number;
  chart: number;
  risk: number;
  strategy: number;
  backtesting: number;
  simulation: number;
  discipline: number;
  psychology: number;
}

export const SKILL_RULES: Record<keyof Skills, string> = {
  knowledge: 'Lessons completed out of 84',
  chart: '60% candles/levels/structure lessons + 40% chart-practice reps (target 300)',
  risk: '50% risk lessons + 25% risk playbook section + 25% logged trades with a stop',
  strategy: '50% strategy lessons + 50% completeness of your best strategy draft',
  backtesting: 'Backtested trades logged (target 50)',
  simulation: 'Simulated trades logged (target 30)',
  discipline: 'Average journal discipline rating (last 14) blended with timetable discipline blocks',
  psychology: '50% psychology lessons + 50% psychology journal days (target 14)',
};

export function computeSkills(d: SkillInputs): Skills {
  const allTrades = [...d.trades, ...d.backtests, ...d.sims];
  const withStop = allTrades.length ? allTrades.filter((t) => t.stop != null).length / allTrades.length : 0;
  const bestStrategy = Math.max(0, ...d.strategies.map(strategyCompletion));
  const reps = d.practice.reduce((a, p) => a + (p.reps || 0), 0);
  const journals = recent(d.journals.filter((j) => journalScore(j) != null), 14);
  const disciplineRating = journals.length ? avg(journals.map((j) => j.discipline / 10)) : 0;
  const disciplineLogs = recent(d.logs.map((l) => ({ ...l, date: l.id })), 14).map((l) => dayStats(l).byCategory.discipline.pct);
  const disciplineBlocks = disciplineLogs.length ? avg(disciplineLogs) : 0;
  const disciplineParts = [journals.length ? disciplineRating : null, disciplineLogs.length ? disciplineBlocks : null].filter(
    (x): x is number => x != null,
  );
  return {
    knowledge: clamp01(d.journey.filter((j) => j.completed).length / TOTAL_DAYS),
    chart: clamp01(phaseRatio(d.journey, [2, 3, 4]) * 0.6 + clamp01(reps / 300) * 0.4),
    risk: clamp01(
      phaseRatio(d.journey, [6]) * 0.5 + ((d.playbook?.sections.risk ?? '').trim() ? 0.25 : 0) + withStop * 0.25,
    ),
    strategy: clamp01(phaseRatio(d.journey, [7]) * 0.5 + bestStrategy * 0.5),
    backtesting: clamp01(d.backtests.length / 50),
    simulation: clamp01(d.sims.length / 30),
    discipline: clamp01(avg(disciplineParts)),
    psychology: clamp01(phaseRatio(d.journey, [10]) * 0.5 + clamp01(d.psych.length / 14) * 0.5),
  };
}

/** Auto scores for the final evaluation (0..100). */
export function autoEvaluation(s: Skills): Record<EvalKey, number> {
  const pct = (x: number) => Math.round(x * 100);
  return {
    knowledge: pct(s.knowledge),
    technical: pct(s.chart),
    risk: pct(s.risk),
    strategy: pct(s.strategy),
    discipline: pct(s.discipline),
    backtesting: pct(s.backtesting),
    simulation: pct(s.simulation),
    psychology: pct(s.psychology),
  };
}

export { PHASES, TOTAL_DAYS };
