// Persisted ETF-module settings and records, stored in the app's existing
// document store (local first, synced to Supabase when signed in).

import { useMemo } from 'react';
import { C } from '../domain';
import { useCollection, useDoc } from '../hooks';
import type { BacktestConfig, BacktestResult } from './backtest';
import { NSE_COSTS, US_COSTS, type CostModel } from './costs';
import type { PaperSession } from './paper';
import { DEFAULT_RISK, type RiskConfig } from './risk';
import type { StrategyId } from './strategies';

export const ETF_RUNS = 'etfRuns';
export const PAPER_SESSIONS = 'paperSessions';
export const ETF_WORKFLOW = 'etfWorkflow';

export interface EtfConfig {
  id: 'etfConfig';
  risk: RiskConfig;
  costsNSE: CostModel;
  costsUS: CostModel;
}
export const DEFAULT_ETF_CONFIG: EtfConfig = { id: 'etfConfig', risk: DEFAULT_RISK, costsNSE: NSE_COSTS, costsUS: US_COSTS };

export function useEtfConfig() {
  const [cfg, update] = useDoc<EtfConfig>(C.settings, 'etfConfig', DEFAULT_ETF_CONFIG);
  // Merge with defaults so new fields get values on older saved configs.
  const merged = useMemo<EtfConfig>(
    () => ({ ...cfg, risk: { ...DEFAULT_RISK, ...cfg.risk }, costsNSE: { ...NSE_COSTS, ...cfg.costsNSE }, costsUS: { ...US_COSTS, ...cfg.costsUS } }),
    [cfg],
  );
  return { cfg: merged, update };
}

/** A saved backtest: configuration + results, without candles (reproducible from the dataset + fingerprint). */
export interface BacktestRun {
  id: string;
  createdAt: number;
  datasetId: string;
  datasetName: string;
  config: Omit<BacktestConfig, 'strategyDef'>;
  result: Omit<BacktestResult, 'quality'> & { quality: Omit<BacktestResult['quality'], 'days'> };
}

export function useBacktestRuns() {
  return useCollection<BacktestRun>(ETF_RUNS);
}

export function usePaperSessions() {
  return useCollection<PaperSession>(PAPER_SESSIONS);
}

export interface PaperAccount {
  id: 'paperAccount';
  startingBalance: number;
  balance: number;
  /** Wall-clock time until which no new paper session can start (after a daily-loss lock). */
  cooldownUntil: number | null;
  activeSessionId: string | null;
  resetAt: number | null;
}
export const DEFAULT_PAPER_ACCOUNT: PaperAccount = { id: 'paperAccount', startingBalance: 100000, balance: 100000, cooldownUntil: null, activeSessionId: null, resetAt: null };

export function usePaperAccount() {
  return useDoc<PaperAccount>(C.settings, 'paperAccount', DEFAULT_PAPER_ACCOUNT);
}

/** Learner progress through strategy modules A–E. */
export interface CourseProgress {
  id: 'etfCourse';
  read: Partial<Record<StrategyId | 'risk', boolean>>;
  replayed: Partial<Record<StrategyId | 'risk', boolean>>;
}
export const DEFAULT_COURSE: CourseProgress = { id: 'etfCourse', read: {}, replayed: {} };

export function useCourseProgress() {
  return useDoc<CourseProgress>(C.settings, 'etfCourse', DEFAULT_COURSE);
}

/** Daily workflow checklist (one document per local date). */
export interface WorkflowDay {
  id: string; // YYYY-MM-DD
  done: Record<number, number>; // step index → timestamp
  etf?: string;
  notes?: string;
}
export function useWorkflowDays() {
  return useCollection<WorkflowDay>(ETF_WORKFLOW);
}
