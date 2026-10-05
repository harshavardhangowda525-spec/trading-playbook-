// The fixed daily routine. Times are 24h "HH:MM".
// Completion state lives in the `daylog` collection (one document per calendar date),
// so both the TRADING SCHEDULE and MY DAY pages read and write the same record.

export type Category = 'trading' | 'study' | 'business' | 'fitness' | 'discipline' | 'routine';

export const CATEGORY_META: Record<Category, { label: string; color: string }> = {
  trading: { label: 'Trading', color: 'var(--c-trading)' },
  study: { label: 'Study', color: 'var(--c-study)' },
  business: { label: 'Business', color: 'var(--c-business)' },
  fitness: { label: 'Fitness', color: 'var(--c-fitness)' },
  discipline: { label: 'Discipline', color: 'var(--c-discipline)' },
  routine: { label: 'Routine', color: 'var(--c-routine)' },
};

/** The five categories shown as rings on the dashboard. */
export const CORE_CATEGORIES: Category[] = ['trading', 'study', 'business', 'fitness', 'discipline'];

export interface SubTask {
  id: string;
  start: string;
  end: string;
  label: string;
}

export interface Counter {
  id: string;
  label: string;
  target: number;
  unit?: string;
}

export interface Block {
  id: string;
  start: string;
  end?: string;
  label: string;
  short: string; // compact label for the dashboard timetable
  category: Category;
  section: 'start' | 'morning' | 'client' | 'afternoon' | 'trading' | 'evening';
  /** Trading sessions: completion derives from these sub-tasks (shared with Trading Schedule). */
  tradingSession?: TradingSessionId;
  /** Client acquisition: each counter is its own checkbox task. */
  counters?: Counter[];
  /** Offer a backup deep-work task picker. */
  backup?: boolean;
  hint?: string;
}

export type TradingSessionId = 'morning' | 'evening';

export interface TradingSession {
  id: TradingSessionId;
  title: string;
  subtitle: string;
  start: string;
  end: string;
  tasks: SubTask[];
}

export const TRADING_SESSIONS: TradingSession[] = [
  {
    id: 'morning',
    title: 'MORNING — TRADING EDUCATION',
    subtitle: 'Trading Education',
    start: '05:15',
    end: '06:15',
    tasks: [
      { id: 'tm1', start: '05:15', end: '05:20', label: "Review yesterday's lesson" },
      { id: 'tm2', start: '05:20', end: '05:45', label: "Learn today's trading concept" },
      { id: 'tm3', start: '05:45', end: '06:05', label: 'Chart study' },
      { id: 'tm4', start: '06:05', end: '06:15', label: 'Write 3 key takeaways' },
    ],
  },
  {
    id: 'evening',
    title: 'EVENING — TRADING PRACTICE',
    subtitle: 'Trading Practice',
    start: '16:30',
    end: '17:15',
    tasks: [
      { id: 'te1', start: '16:30', end: '16:35', label: 'Market/chart review' },
      { id: 'te2', start: '16:35', end: '17:00', label: 'Backtesting / simulated practice' },
      { id: 'te3', start: '17:00', end: '17:10', label: 'Trading journal' },
      { id: 'te4', start: '17:10', end: '17:15', label: "Identify tomorrow's 1% improvement" },
    ],
  },
];

export const CLIENT_COUNTERS: Counter[] = [
  { id: 'ca_calls', label: 'Cold calls', target: 20 },
  { id: 'ca_dms', label: 'Instagram DMs', target: 25 },
  { id: 'ca_followups', label: 'Follow-ups', target: 10 },
  { id: 'ca_demo', label: 'Demo preparation', target: 1 },
  { id: 'ca_conversations', label: 'Client conversations', target: 3 },
  { id: 'ca_proposals', label: 'Proposals / quotations', target: 2 },
];

export const BACKUP_TASKS = [
  'Portfolio improvement',
  'Demo website improvement',
  'Content creation',
  'Website development',
  'Sales script improvement',
  'Lead research',
  'Client portal development',
];

export const SECTIONS: { id: Block['section']; title: string; range: string }[] = [
  { id: 'start', title: '3:00 AM — START', range: '03:00 – 04:30' },
  { id: 'morning', title: 'MORNING', range: '04:30 – 09:30' },
  { id: 'client', title: 'CLIENT ACQUISITION', range: '09:30 AM – 1:00 PM' },
  { id: 'afternoon', title: 'AFTERNOON', range: '1:00 PM – 4:30 PM' },
  { id: 'trading', title: 'TRADING PRACTICE', range: '4:30 PM – 5:15 PM' },
  { id: 'evening', title: 'EVENING', range: '5:15 PM – 9:00 PM' },
];

export const BLOCKS: Block[] = [
  { id: 'wake', section: 'start', start: '03:00', end: '03:15', label: 'Wake up + water + freshen up', short: 'Wake Up', category: 'discipline' },
  { id: 'manifest', section: 'start', start: '03:15', end: '03:35', label: 'Manifestation / visualization', short: 'Manifestation', category: 'discipline' },
  { id: 'personal_dev', section: 'start', start: '03:35', end: '04:30', label: 'Personal development / focused work', short: 'Personal Dev', category: 'study' },

  { id: 'trading_prep', section: 'morning', start: '04:30', end: '05:15', label: 'Trading preparation / market education', short: 'Trading Prep', category: 'trading' },
  { id: 'trading_edu', section: 'morning', start: '05:15', end: '06:15', label: 'Trading Education', short: 'Trading Education', category: 'trading', tradingSession: 'morning' },
  { id: 'break1', section: 'morning', start: '06:15', end: '06:30', label: 'Break', short: 'Break', category: 'routine' },
  { id: 'deep_work', section: 'morning', start: '06:30', end: '07:30', label: 'Deep Work / Priority Work', short: 'Deep Work', category: 'business' },
  { id: 'recovery', section: 'morning', start: '07:30', end: '08:00', label: 'Freshen up / recovery', short: 'Recovery', category: 'routine' },
  { id: 'study_am', section: 'morning', start: '08:00', end: '09:00', label: 'Study', short: 'Study', category: 'study' },
  { id: 'breakfast', section: 'morning', start: '09:00', end: '09:30', label: 'Breakfast', short: 'Breakfast', category: 'routine' },

  { id: 'client_acq', section: 'client', start: '09:30', end: '13:00', label: 'Client Acquisition', short: 'Client Acquisition', category: 'business', counters: CLIENT_COUNTERS },

  { id: 'lunch', section: 'afternoon', start: '13:00', end: '14:00', label: 'Lunch + rest', short: 'Lunch', category: 'routine' },
  { id: 'skill_dev', section: 'afternoon', start: '14:00', end: '15:00', label: 'Study / skill development', short: 'Skill Dev', category: 'study' },
  { id: 'darwin', section: 'afternoon', start: '15:00', end: '15:30', label: 'Darwin lead generation', short: 'Darwin', category: 'business' },
  { id: 'client_work', section: 'afternoon', start: '15:30', end: '16:30', label: 'Client work / website development', short: 'Client Work', category: 'business', backup: true },

  { id: 'trading_practice', section: 'trading', start: '16:30', end: '17:15', label: 'Trading Practice', short: 'Trading Practice', category: 'trading', tradingSession: 'evening', hint: 'Backtest today’s setup and record your observations.' },

  { id: 'workout', section: 'evening', start: '17:15', end: '18:15', label: 'Workout', short: 'Workout', category: 'fitness' },
  { id: 'dinner', section: 'evening', start: '18:15', end: '19:00', label: 'Dinner / recovery', short: 'Dinner', category: 'routine' },
  { id: 'study_pm', section: 'evening', start: '19:00', end: '20:00', label: 'Study / revision', short: 'Revision', category: 'study' },
  { id: 'biz_review', section: 'evening', start: '20:00', end: '20:30', label: 'Review business progress', short: 'Business Review', category: 'business' },
  { id: 'daily_review', section: 'evening', start: '20:30', end: '21:00', label: 'Daily review + journal', short: 'Daily Review', category: 'discipline' },
  { id: 'wind_down', section: 'evening', start: '21:00', end: '21:30', label: 'Wind down / prepare for sleep', short: 'Wind Down', category: 'discipline' },
];

/**
 * Atomic checklist items used for completion math. Most blocks are one task;
 * client acquisition contributes one task per counter.
 */
export interface TaskDef {
  id: string;
  label: string;
  category: Category;
  blockId: string;
  start: string;
  end?: string;
}

export const TASKS: TaskDef[] = BLOCKS.flatMap((b): TaskDef[] =>
  b.counters
    ? b.counters.map((c) => ({ id: c.id, label: c.label, category: b.category, blockId: b.id, start: b.start, end: b.end }))
    : [{ id: b.id, label: b.label, category: b.category, blockId: b.id, start: b.start, end: b.end }],
);
