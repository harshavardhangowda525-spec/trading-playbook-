// The complete 12-phase, 84-day ETF day-trading learning system.
import { PLAN as PLAN_A } from './lessons/plan01-21';
import { PLAN as PLAN_B } from './lessons/plan22-42';
import { PLAN as PLAN_C } from './lessons/plan43-63';
import { PLAN as PLAN_D } from './lessons/plan64-84';
// Educational content only — nothing here is financial advice.

export interface Phase {
  num: number;
  code: string; // "01"
  name: string;
  short: string;
  days: [number, number];
  topics: string[];
  /** Skill this phase builds — feeds the evaluation scores. */
  skill: SkillKey;
  /** Workspace for hands-on work during this phase. */
  workspace?: { label: string; to: string };
}

export type SkillKey =
  | 'knowledge'
  | 'chart'
  | 'risk'
  | 'strategy'
  | 'backtesting'
  | 'simulation'
  | 'psychology'
  | 'discipline';

export interface Lesson {
  day: number;
  phase: number;
  title: string;
  /** Concise teaching text shown in the learning workspace. */
  concept: string;
  keyPoints: string[];
  learn: string;
  practice: string;
  journal: string;
  review?: boolean;
}

export const PHASES: Phase[] = [
  { num: 1, code: '01', name: 'ETF Foundations', short: 'ETF FOUNDATIONS', days: [1, 7], skill: 'knowledge',
    workspace: { label: 'Markets', to: '/trading/markets' },
    topics: ['What an ETF is', 'How ETFs trade on the NSE', 'Index, sector & gold ETFs', 'Session & order types', 'Liquidity, spread & iNAV', 'Intraday costs'] },
  { num: 2, code: '02', name: 'Reading ETF Charts', short: 'READING ETF CHARTS', days: [8, 14], skill: 'chart',
    workspace: { label: 'Replay', to: '/trading/replay' },
    topics: ['Candlesticks', 'Timeframes 1m/5m/15m', 'Volume & traded value', 'VWAP', 'Opening range', 'Gaps'] },
  { num: 3, code: '03', name: 'Market Context', short: 'MARKET CONTEXT', days: [15, 21], skill: 'chart',
    workspace: { label: 'Replay', to: '/trading/replay' },
    topics: ['ETF vs index', 'Support & resistance', 'Market structure', 'Trend, range or chop', 'Sector rotation', 'Gold ETFs'] },
  { num: 4, code: '04', name: 'Risk Management', short: 'RISK MANAGEMENT', days: [22, 28], skill: 'risk',
    workspace: { label: 'Strategy E · Risk', to: '/trading/learn' },
    topics: ['Position sizing', 'Stop-loss placement', 'R:R after costs', 'Daily loss limit & cooldown', 'Max trades', 'Costs vs edge'] },
  { num: 5, code: '05', name: 'Trend-Following', short: 'STRATEGY A · TREND', days: [29, 35], skill: 'strategy',
    workspace: { label: 'Backtest', to: '/trading/backtest' },
    topics: ['Moving averages', 'Entry rules', 'Exits & trailing', 'Avoiding chop', 'Replay practice', 'Backtest'] },
  { num: 6, code: '06', name: 'Breakout', short: 'STRATEGY B · BREAKOUT', days: [36, 42], skill: 'strategy',
    workspace: { label: 'Backtest', to: '/trading/backtest' },
    topics: ['Levels', 'Volume confirmation', 'False breakouts', 'Entry, stop & target', 'Opening-range breakouts', 'Backtest'] },
  { num: 7, code: '07', name: 'Pullback', short: 'STRATEGY C · PULLBACK', days: [43, 49], skill: 'strategy',
    workspace: { label: 'Backtest', to: '/trading/backtest' },
    topics: ['Trend + pullback', 'EMA, VWAP & levels', 'Trigger & invalidation', 'Failed pullbacks', 'Replay practice', 'Backtest'] },
  { num: 8, code: '08', name: 'Range-Bound', short: 'STRATEGY D · RANGE', days: [50, 56], skill: 'strategy',
    workspace: { label: 'Backtest', to: '/trading/backtest' },
    topics: ['Identifying a range', 'Trading the edges', 'When not to', 'Stops & targets', 'Replay practice', 'Backtest'] },
  { num: 9, code: '09', name: 'Backtesting Properly', short: 'BACKTESTING', days: [57, 63], skill: 'backtesting',
    workspace: { label: 'Backtest', to: '/trading/backtest' },
    topics: ['No look-ahead', 'Costs & slippage', 'Metrics', 'Training vs out-of-sample', 'Overfitting', 'Comparing ETFs'] },
  { num: 10, code: '10', name: 'Paper Trading', short: 'PAPER TRADING', days: [64, 70], skill: 'simulation',
    workspace: { label: 'Paper Trading', to: '/trading/paper' },
    topics: ['Rules & setup', 'Pre-session plan', 'Execution', 'Managing trades', 'Risk limits', 'Paper vs backtest'] },
  { num: 11, code: '11', name: 'Psychology & Playbook', short: 'PSYCHOLOGY & PLAYBOOK', days: [71, 77], skill: 'psychology',
    workspace: { label: 'Playbook', to: '/playbook' },
    topics: ['FOMO & overtrading', 'Losses & cooldown', 'Discipline', 'Playbook: ETFs & strategy', 'Playbook: risk rules', 'Playbook: setups & mistakes'] },
  { num: 12, code: '12', name: 'Final Evaluation', short: 'FINAL EVALUATION', days: [78, 84], skill: 'discipline',
    workspace: { label: 'Evaluation', to: '/evaluation' },
    topics: ['Knowledge', 'Strategy & backtests', 'Paper trading', 'Risk compliance', 'Psychology & discipline', 'Graduation'] },
];

// Lesson outline per day (titles, summaries and the day's three checkboxes).
// Lesson days keep their numbers, so saved progress stays attached to the same day.
const LESSONS = [...PLAN_A, ...PLAN_B, ...PLAN_C, ...PLAN_D].sort((a, b) => a.day - b.day);

export const LESSONS_BY_DAY: Lesson[] = LESSONS.map(({ day, ...l }) => {
  const phase = PHASES.find((p) => day >= p.days[0] && day <= p.days[1])!;
  return { ...l, day, phase: phase.num };
});

export const TOTAL_DAYS = 84;

export function lessonFor(day: number): Lesson {
  return LESSONS_BY_DAY[Math.min(Math.max(day, 1), TOTAL_DAYS) - 1];
}

export function phaseFor(day: number): Phase {
  return PHASES.find((p) => day >= p.days[0] && day <= p.days[1]) ?? PHASES[PHASES.length - 1];
}

if (LESSONS_BY_DAY.length !== TOTAL_DAYS) {
  console.error(`[curriculum] expected ${TOTAL_DAYS} lessons, got ${LESSONS_BY_DAY.length}`);
}
