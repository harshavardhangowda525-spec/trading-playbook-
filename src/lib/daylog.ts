// Timetable state for one calendar date. Shared by MY DAY, TRADING SCHEDULE,
// the dashboard and the session timer, so a tick anywhere updates everywhere.
// Each date is evaluated against the schedule version that applies to it.

import { useCallback, useMemo } from 'react';
import { SCHEDULE_V1, SCHEDULE_V2, scheduleFor, type TradingSessionId } from '../data/schedule';
import { C, DEFAULT_PROFILE, blockDone, blockProgress, counterTarget, dayStats, emptyDayLog, isTaskDone, sessionStats, type DayLog, type Profile } from './domain';
import { useDoc } from './hooks';
import { celebrate, pulseCore } from './events';
import { todayKey } from './dates';

const fallbacks = new Map<string, DayLog>();
function fallbackFor(date: string): DayLog {
  let f = fallbacks.get(date);
  if (!f) {
    f = emptyDayLog(date);
    fallbacks.set(date, f);
  }
  return f;
}

/** Labels for activity-log entries, across both schedule versions. */
function labelFor(id: string): string {
  for (const s of [SCHEDULE_V2, SCHEDULE_V1]) {
    const t = s.tasks.find((x) => x.id === id) ?? s.sessions.flatMap((x) => x.tasks).find((x) => x.id === id);
    if (t) {
      const block = s.blocks.find((b) => b.tasks?.some((x) => x.id === id));
      return block ? `${block.short} · ${t.label}` : t.label;
    }
  }
  return id;
}

function withActivity(log: DayLog, ids: string[], action: 'done' | 'undone'): DayLog {
  if (!ids.length) return log;
  const at = Date.now();
  const events = ids.map((taskId) => ({ at, taskId, label: labelFor(taskId), action }));
  return { ...log, activity: [...(log.activity ?? []), ...events].slice(-400) };
}

/** Fire celebrations by comparing state before and after a change. */
function announce(before: DayLog, after: DayLog) {
  const b = dayStats(before);
  const a = dayStats(after);
  if (a.done > b.done) pulseCore();
  for (const s of scheduleFor(after.id, after).sessions) {
    if (!sessionStats(before, s.id).complete && sessionStats(after, s.id).complete) {
      celebrate({ kind: 'session', title: 'MISSION COMPLETE', lines: ['TRADING SESSION COMPLETE', '+1% IMPROVEMENT'] });
      return;
    }
  }
  if (b.pct < 1 && a.pct >= 1) {
    celebrate({ kind: 'day', title: 'DAY COMPLETE', lines: ['SYSTEM STATUS: OPTIMAL'] });
  }
}

/** Set a list of task ids done / undone, returning the ids that actually changed. */
function setMany(prev: DayLog, ids: string[], on: boolean): { log: DayLog; changed: string[] } {
  const done = { ...prev.done };
  const changed: string[] = [];
  for (const id of ids) {
    if (on && !done[id]) {
      done[id] = Date.now();
      changed.push(id);
    } else if (!on && done[id]) {
      delete done[id];
      changed.push(id);
    }
  }
  return { log: { ...prev, done }, changed };
}

export function useDayLog(date: string) {
  const [log, update] = useDoc<DayLog>(C.daylog, date, fallbackFor(date));
  const [profile] = useDoc<Profile>(C.settings, 'profile', DEFAULT_PROFILE);
  const editable = date <= todayKey();
  const schedule = scheduleFor(date, log);

  const apply = useCallback(
    (fn: (prev: DayLog) => DayLog) => {
      if (!editable) return;
      update((prev) => {
        // Stamp the schedule version the first time a day is written.
        const base = prev.version ? prev : { ...prev, version: scheduleFor(date, prev).version };
        const next = fn(base);
        announce(base, next);
        return next;
      });
    },
    [update, editable, date],
  );

  /** Toggle a block (all of its tasks) or a single task id. */
  const toggleTask = useCallback(
    (id: string) =>
      apply((prev) => {
        const sched = scheduleFor(date, prev);
        const block = sched.blocks.find((b) => b.id === id);
        if (block) {
          const ids = block.tasks?.length
            ? block.tasks.map((t) => t.id)
            : block.tradingSession
              ? sched.sessions.find((s) => s.id === block.tradingSession)!.tasks.map((t) => t.id)
              : block.counters
                ? block.counters.map((c) => c.id)
                : [block.id];
          const complete = blockDone(prev, block, date);
          const { log: next, changed } = setMany(prev, ids, !complete);
          return withActivity(next, changed, complete ? 'undone' : 'done');
        }
        const wasDone = !!prev.done[id];
        const { log: next, changed } = setMany(prev, [id], !wasDone);
        return withActivity(next, changed, wasDone ? 'undone' : 'done');
      }),
    [apply, date],
  );

  /** Toggle one TRADING SCHEDULE sub-task (same ids as the trading blocks' tasks). */
  const toggleSub = toggleTask;

  /** Mark every sub-task of a trading session complete. */
  const completeSession = useCallback(
    (session: TradingSessionId) =>
      apply((prev) => {
        const s = scheduleFor(date, prev).sessions.find((x) => x.id === session)!;
        const { log: next, changed } = setMany(
          prev,
          s.tasks.map((t) => t.id),
          true,
        );
        return withActivity(next, changed, 'done');
      }),
    [apply, date],
  );

  /** Set a counter (calls / DMs). Reaching the target ticks its linked task. */
  const setCount = useCallback(
    (counterId: string, value: number) =>
      apply((prev) => {
        const sched = scheduleFor(date, prev);
        const counter = [...sched.counters, ...sched.blocks.flatMap((b) => (b.counter ? [b.counter] : []))].find((c) => c.id === counterId);
        const count = Math.max(0, Math.round(value));
        const target = counterTarget(profile, counterId);
        let next: DayLog = { ...prev, counts: { ...prev.counts, [counterId]: count } };
        const taskId = sched.version === 1 ? counterId : counter?.completes;
        if (taskId && count >= target && !prev.done[taskId]) {
          const r = setMany(next, [taskId], true);
          next = withActivity(r.log, r.changed, 'done');
        }
        return next;
      }),
    [apply, profile, date],
  );

  const setBackup = useCallback((task: string | undefined) => apply((prev) => ({ ...prev, backupTask: task })), [apply]);

  const stats = useMemo(() => dayStats(log, date), [log, date]);

  return {
    log,
    stats,
    editable,
    schedule,
    isDone: (taskId: string) => isTaskDone(log, taskId, date),
    blockProgress: (blockId: string) => {
      const b = schedule.blocks.find((x) => x.id === blockId);
      return b ? blockProgress(log, b) : { done: 0, total: 0, pct: 0 };
    },
    session: (id: TradingSessionId) => sessionStats(log, id, date),
    count: (counterId: string) => log.counts?.[counterId] ?? 0,
    target: (counterId: string) => counterTarget(profile, counterId),
    toggleTask,
    toggleSub,
    completeSession,
    setCount,
    setBackup,
  };
}
