// The daily routine. Times are 24h "HH:MM".
// Completion state lives in the `daylog` collection (one document per calendar date),
// so MY DAY, TRADING SCHEDULE and HOME all read and write the same record.
//
// The schedule is versioned: each day is evaluated against the schedule that was in
// use on that day, so changing the routine never rewrites past completion history.

import { V1_BACKUP, V1_BLOCKS, V1_COUNTERS, V1_SECTIONS, V1_SESSIONS, V1_TASKS } from './scheduleV1';

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
  /** v2: reaching the target ticks this task. */
  completes?: string;
}

export interface BlockTask {
  id: string;
  label: string;
}

export interface Block {
  id: string;
  start: string;
  end?: string;
  label: string;
  short: string; // compact label for the dashboard timetable
  category: Category;
  section: string;
  description?: string;
  /** v2: the block's checklist. Every item is a task that counts toward the day. */
  tasks?: BlockTask[];
  /** Trading sessions: the block's tasks are shared with the Trading Schedule page. */
  tradingSession?: TradingSessionId;
  /** v1 client acquisition: each counter is its own checkbox task. */
  counters?: Counter[];
  /** v2: a single counter (calls / DMs) shown with the block. */
  counter?: Counter;
  /** Offer a backup deep-work task picker. */
  backup?: boolean;
  /** Related pages (Trading Practice Lab, Trading Journal…). */
  links?: { label: string; to: string }[];
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

export interface SectionDef {
  id: string;
  title: string;
  range: string;
}

/** Atomic checklist items used for completion math. */
export interface TaskDef {
  id: string;
  label: string;
  category: Category;
  blockId: string;
  start: string;
  end?: string;
}

export interface ScheduleDef {
  version: 1 | 2;
  sections: SectionDef[];
  blocks: Block[];
  tasks: TaskDef[];
  sessions: TradingSession[];
  counters: Counter[];
  backupTasks: string[];
}

// ─── Schedule v2 ───────────────────────────────────────────────────────────

/** First date evaluated against the v2 schedule. Earlier dates keep v1. */
export const V2_START = '2026-10-06';

const V2_SESSIONS: TradingSession[] = [
  {
    id: 'morning',
    title: 'MORNING — TRADING EDUCATION',
    subtitle: 'Trading Education',
    start: '05:00',
    end: '05:45',
    tasks: [
      { id: 'trading_edu.1', start: '05:00', end: '05:15', label: "Study today's trading concept" },
      { id: 'trading_edu.2', start: '05:15', end: '05:30', label: 'Study historical charts' },
      { id: 'trading_edu.3', start: '05:30', end: '05:40', label: 'Practise using the simulator' },
      { id: 'trading_edu.4', start: '05:40', end: '05:45', label: 'Record one key lesson' },
    ],
  },
  {
    id: 'evening',
    title: 'AFTERNOON — TRADING REVIEW',
    subtitle: 'Trading Review',
    start: '16:30',
    end: '17:00',
    tasks: [
      { id: 'trading_review.1', start: '16:30', end: '16:35', label: 'Review historical chart' },
      { id: 'trading_review.2', start: '16:35', end: '16:50', label: 'Complete replay session' },
      { id: 'trading_review.3', start: '16:50', end: '16:54', label: 'Record reasoning' },
      { id: 'trading_review.4', start: '16:54', end: '16:57', label: 'Review mistakes' },
      { id: 'trading_review.5', start: '16:57', end: '17:00', label: 'Save session to Trading Journal' },
    ],
  },
];

const V2_COUNTERS: Counter[] = [
  { id: 'ca_calls', label: 'Calls', target: 20, completes: 'calls.1' },
  { id: 'ca_dms', label: 'Personalized DMs', target: 25, completes: 'dms.2' },
];

const V2_BACKUP = [
  'Improve portfolio',
  'Build reusable website components',
  'Create an industry demo',
  'Improve sales assets',
  'Create business content',
  'Improve the Infinity Web & Apps website',
];

const V2_SECTIONS: SectionDef[] = [
  { id: 'focus', title: 'MORNING FOCUS', range: '3:00 – 6:30 AM' },
  { id: 'bizprep', title: 'BUSINESS PREPARATION', range: '6:30 – 9:30 AM' },
  { id: 'client', title: 'CLIENT ACQUISITION', range: '9:30 AM – 1:00 PM' },
  { id: 'recovery', title: 'RECOVERY AND STUDIES', range: '1:00 – 3:00 PM' },
  { id: 'ai', title: 'AI CONTROL CENTER', range: '3:00 – 3:30 PM' },
  { id: 'execution', title: 'EXECUTION', range: '3:30 – 5:15 PM' },
  { id: 'evening', title: 'FITNESS AND SHUTDOWN', range: '5:15 – 8:00 PM' },
];

/** Shorthand: block tasks get ids "<blockId>.<n>". */
function b(
  id: string,
  section: string,
  start: string,
  end: string,
  label: string,
  short: string,
  category: Category,
  tasks: string[],
  extra: Partial<Block> = {},
): Block {
  return { id, section, start, end, label, short, category, tasks: tasks.map((t, i) => ({ id: `${id}.${i + 1}`, label: t })), ...extra };
}

// Trading Journal links come from the block's session (Open journal / Log session).
const TRADING_LINKS_AM = [{ label: 'Trading Practice Lab', to: '/trading' }];
const TRADING_LINKS_PM = [{ label: 'Replay in the Practice Lab', to: '/trading/replay' }];

const V2_BLOCKS: Block[] = [
  // 3:00–6:30 AM — Morning Focus
  b('wake', 'focus', '03:00', '03:15', 'Wake Up and Get Ready', 'Wake Up', 'discipline', ['Hydrate', 'Freshen up', 'Prepare workspace'], {
    description: 'Hydrate, freshen up and prepare your workspace.',
  }),
  b('manifest', 'focus', '03:15', '03:35', 'Morning Manifestation', 'Manifestation', 'discipline', ['Visualize goals', 'Review priorities', 'Write down three important tasks'], {
    description: 'Visualize your goals, review your priorities and write down three tasks you must complete today.',
  }),
  b('study_am', 'focus', '03:35', '05:00', 'Study Session', 'Study', 'study', ['Select subject', 'Complete focused study', 'Review what was learned', 'Record unfinished work'], {
    description: 'Focus on school subjects, difficult topics and assignments. Keep your phone away.',
  }),
  {
    id: 'trading_edu',
    section: 'focus',
    start: '05:00',
    end: '05:45',
    label: 'Trading Education',
    short: 'Trading Education',
    category: 'trading',
    description: 'Learn market fundamentals, study historical charts and practise with a simulator. No real-money trades.',
    tradingSession: 'morning',
    tasks: V2_SESSIONS[0].tasks.map((t) => ({ id: t.id, label: t.label })),
    links: TRADING_LINKS_AM,
  },
  b('ai_morning', 'focus', '05:45', '06:15', 'Darwin + Robin + JARVIS Morning Review', 'AI Morning Review', 'business', ['Review Darwin leads', 'Review Robin CRM', 'Check JARVIS status', 'Review errors', 'Set AI priorities'], {
    description: 'Check lead quality, follow-ups, CRM status, agent errors and today’s priorities.',
  }),
  b('break_am', 'focus', '06:15', '06:30', 'Break', 'Break', 'routine', ['Move around', 'Hydrate', 'Reset workspace'], {
    description: 'Move around, hydrate and reset before business work.',
  }),

  // 6:30–9:30 AM — Business Preparation
  b(
    'web_deep',
    'bizprep',
    '06:30',
    '08:20',
    'Infinity Web & Apps Deep Work',
    'Deep Work',
    'business',
    ['Build cafe website demo', 'Add motion graphics', 'Check mobile responsiveness', 'Test navigation', 'Test forms', 'Test important links', 'Prepare website proposal', 'Prepare pricing'],
    { description: 'Build the cafe website demo and prepare it for presentation.' },
  ),
  b('sales_prep', 'bizprep', '08:20', '09:00', 'Sales Preparation', 'Sales Prep', 'business', ['Organize lead list', 'Verify contact details', 'Prepare call script', 'Identify priority prospects', 'Review sales target'], {
    description: 'Organize leads, verify contact details, prepare call scripts and identify priority prospects.',
  }),
  b('breakfast', 'bizprep', '09:00', '09:30', 'Breakfast and Reset', 'Breakfast', 'routine', ['Breakfast', 'Hydrate', 'Prepare workspace', 'Open sales tools'], {
    description: 'Eat breakfast and prepare for calls.',
  }),

  // 9:30 AM–1:00 PM — Client Acquisition
  b('calls', 'client', '09:30', '10:30', 'Cold Calling', 'Cold Calling', 'business', ['Complete priority calls', 'Record conversations', 'Record objections', 'Identify interested prospects', 'Record follow-up requirements'], {
    description: 'Contact local businesses that could benefit from a website. Prioritize meaningful conversations.',
    counter: V2_COUNTERS[0],
  }),
  b('dms', 'client', '10:30', '11:00', 'Instagram Outreach', 'Instagram Outreach', 'business', ['Identify prospects', 'Send personalized DMs', 'Record replies', 'Mark interested prospects', 'Add follow-up dates'], {
    description: 'Send personalized messages to relevant businesses.',
    counter: V2_COUNTERS[1],
  }),
  b('demos', 'client', '11:00', '12:00', 'Demos and Follow-ups', 'Demos', 'business', ['Check demo schedule', 'Prepare demo', 'Conduct demo', 'Follow up with prospects', 'Record objections', 'Set next action'], {
    description: 'Present demos, contact interested prospects and answer questions.',
  }),
  b('proposals', 'client', '12:00', '12:40', 'Proposals and Closing', 'Proposals', 'business', ['Prepare quotations', 'Send proposals', 'Explain deliverables', 'Discuss pricing', 'Discuss timelines', 'Confirm next step'], {
    description: 'Send quotations, explain deliverables, discuss timelines and agree on next steps.',
  }),
  b('crm', 'client', '12:40', '13:00', "Update Robin's CRM", 'Update CRM', 'business', ['Update lead status', 'Add conversation notes', 'Record objections', 'Add follow-up dates', 'Add next actions'], {
    description: 'Record conversations, lead status, objections, follow-up dates and next actions.',
  }),

  // 1:00–3:00 PM — Recovery and Studies
  b('lunch', 'recovery', '13:00', '13:45', 'Lunch and Rest', 'Lunch', 'routine', ['Lunch', 'Hydrate', 'Rest away from the screen']),
  b('study_pm', 'recovery', '13:45', '14:45', 'Study and Assignments', 'Assignments', 'study', ['Complete assignments', 'Revise key concepts', 'Prepare for upcoming tests', 'Record unfinished work']),
  b('break_pm', 'recovery', '14:45', '15:00', 'Short Break', 'Short Break', 'routine', ['Take a break', 'Prepare AI review checklist', 'Review priorities']),

  // 3:00–3:30 PM — AI Control Center
  b('darwin', 'ai', '15:00', '15:10', 'Darwin: Lead Generation', 'Darwin', 'business', ['Review new businesses', 'Verify phone numbers', 'Verify website status', 'Remove duplicates', 'Select priority prospects']),
  b('robin', 'ai', '15:10', '15:20', 'Robin: CRM and Qualified Leads', 'Robin', 'business', ['Check interested prospects', 'Check overdue follow-ups', 'Check demo bookings', 'Check next actions']),
  b('jarvis', 'ai', '15:20', '15:30', 'JARVIS: Coordination', 'JARVIS', 'business', ['Review agent errors', 'Check unfinished tasks', 'Review workflow status', 'Assign next tasks', 'Verify actual outputs']),

  // 3:30–5:15 PM — Execution
  b(
    'client_work',
    'execution',
    '15:30',
    '16:30',
    'Client Projects and Demos',
    'Client Projects',
    'business',
    ['Work on highest-priority client task', 'Improve cafe demo', 'Rehearse demo', 'Prepare proposal', 'Complete active deliverable', 'Record project progress'],
    { description: 'Finish the cafe demo, rehearse the walkthrough, prepare proposals or complete active client deliverables.', backup: true },
  ),
  {
    id: 'trading_review',
    section: 'execution',
    start: '16:30',
    end: '17:00',
    label: 'Trading Review',
    short: 'Trading Review',
    category: 'trading',
    description: 'Review historical charts, document reasoning and practise in the simulator. Educational and simulation-only.',
    tradingSession: 'evening',
    tasks: V2_SESSIONS[1].tasks.map((t) => ({ id: t.id, label: t.label })),
    links: TRADING_LINKS_PM,
  },
  b('workout_prep', 'execution', '17:00', '17:15', 'Workout Preparation', 'Workout Prep', 'fitness', ['Drink water', 'Change', 'Prepare workout equipment', 'Get ready']),

  // 5:15–8:00 PM — Fitness and Shutdown
  b('workout', 'evening', '17:15', '18:15', 'Workout / Gym', 'Workout', 'fitness', ['Warm up', 'Complete planned workout', 'Cool down', 'Hydrate', 'Record completion'], {
    description: 'Follow a balanced, age-appropriate training plan, including warm-up, sensible technique and recovery.',
  }),
  b('dinner', 'evening', '18:15', '19:00', 'Shower, Dinner and Recovery', 'Dinner', 'routine', ['Shower', 'Dinner', 'Hydrate', 'Screen-free recovery']),
  b('evening_manifest', 'evening', '19:00', '19:20', 'Evening Manifestation', 'Evening Manifestation', 'discipline', ['Reflect on the day', 'Visualize long-term goals', 'Identify one improvement', "Write tomorrow's priority"]),
  b(
    'daily_review',
    'evening',
    '19:20',
    '19:40',
    'Daily Review',
    'Daily Review',
    'discipline',
    ['Review calls', 'Review conversations', 'Review follow-ups', 'Review demos', 'Review proposals', 'Review project progress', 'Review AI-agent issues', "Identify tomorrow's priorities"],
  ),
  b('wind_down', 'evening', '19:40', '20:00', 'Wind Down', 'Wind Down', 'discipline', ["Prepare tomorrow's workspace", "Review tomorrow's schedule", 'Switch off work notifications', 'Finish work']),
];

const V2_TASKS: TaskDef[] = V2_BLOCKS.flatMap((blk) =>
  (blk.tasks ?? []).map((t) => ({ id: t.id, label: t.label, category: blk.category, blockId: blk.id, start: blk.start, end: blk.end })),
);

export const SCHEDULE_V1: ScheduleDef = {
  version: 1,
  sections: V1_SECTIONS,
  blocks: V1_BLOCKS,
  tasks: V1_TASKS,
  sessions: V1_SESSIONS,
  counters: V1_COUNTERS,
  backupTasks: V1_BACKUP,
};

export const SCHEDULE_V2: ScheduleDef = {
  version: 2,
  sections: V2_SECTIONS,
  blocks: V2_BLOCKS,
  tasks: V2_TASKS,
  sessions: V2_SESSIONS,
  counters: V2_COUNTERS,
  backupTasks: V2_BACKUP,
};

/** The schedule a given day is evaluated against (an explicit stamp on the log wins). */
export function scheduleFor(date: string, log?: { version?: number } | null): ScheduleDef {
  if (log?.version === 1) return SCHEDULE_V1;
  if (log?.version === 2) return SCHEDULE_V2;
  return date < V2_START ? SCHEDULE_V1 : SCHEDULE_V2;
}

// Current schedule (today and future days).
export const CURRENT_SCHEDULE = SCHEDULE_V2;
export const SECTIONS = SCHEDULE_V2.sections;
export const BLOCKS = SCHEDULE_V2.blocks;
export const TASKS = SCHEDULE_V2.tasks;
export const TRADING_SESSIONS = SCHEDULE_V2.sessions;
export const CLIENT_COUNTERS = SCHEDULE_V2.counters;
export const BACKUP_TASKS = SCHEDULE_V2.backupTasks;
