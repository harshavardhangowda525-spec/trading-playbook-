// Timetable state for one calendar date. Shared by MY DAY, TRADING SCHEDULE,
// the dashboard and the session timer, so a tick anywhere updates everywhere.

import { useCallback, useMemo } from 'react';
import { BLOCKS, CLIENT_COUNTERS, TASKS, TRADING_SESSIONS, type TradingSessionId } from '../data/schedule';
import { C, DEFAULT_PROFILE, counterTarget, dayStats, emptyDayLog, isTaskDone, sessionStats, type DayLog, type Profile } from './domain';
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

function labelFor(id: string): string {
  return (
    TASKS.find((t) => t.id === id)?.label ??
    TRADING_SESSIONS.flatMap((s) => s.tasks).find((t) => t.id === id)?.label ??
    id
  );
}

function withActivity(log: DayLog, ids: string[], action: 'done' | 'undone'): DayLog {
  const at = Date.now();
  const events = ids.map((taskId) => ({ at, taskId, label: labelFor(taskId), action }));
  return { ...log, activity: [...(log.activity ?? []), ...events].slice(-300) };
}

/** Fire celebrations by comparing state before and after a change. */
function announce(before: DayLog, after: DayLog) {
  const b = dayStats(before);
  const a = dayStats(after);
  if (a.done > b.done) pulseCore();
  for (const s of TRADING_SESSIONS) {
    if (!sessionStats(before, s.id).complete && sessionStats(after, s.id).complete) {
      celebrate({ kind: 'session', title: 'MISSION COMPLETE', lines: ['TRADING SESSION COMPLETE', '+1% IMPROVEMENT'] });
      return;
    }
  }
  if (b.pct < 1 && a.pct >= 1) {
    celebrate({ kind: 'day', title: 'DAY COMPLETE', lines: ['SYSTEM STATUS: OPTIMAL'] });
  }
}

export function useDayLog(date: string) {
  const [log, update] = useDoc<DayLog>(C.daylog, date, fallbackFor(date));
  const [profile] = useDoc<Profile>(C.settings, 'profile', DEFAULT_PROFILE);
  const editable = date <= todayKey();

  const apply = useCallback(
    (fn: (prev: DayLog) => DayLog) => {
      if (!editable) return;
      update((prev) => {
        const next = fn(prev);
        announce(prev, next);
        return next;
      });
    },
    [update, editable],
  );

  /** Toggle any MY DAY task (block id or client counter id). */
  const toggleTask = useCallback(
    (taskId: string) =>
      apply((prev) => {
        const block = BLOCKS.find((b) => b.id === taskId);
        if (block?.tradingSession) {
          const session = TRADING_SESSIONS.find((s) => s.id === block.tradingSession)!;
          const complete = sessionStats(prev, session.id).complete;
          const done = { ...prev.done };
          const changed: string[] = [];
          for (const t of session.tasks) {
            if (complete) {
              delete done[t.id];
              changed.push(t.id);
            } else if (!done[t.id]) {
              done[t.id] = Date.now();
              changed.push(t.id);
            }
          }
          return withActivity({ ...prev, done }, changed, complete ? 'undone' : 'done');
        }
        const done = { ...prev.done };
        const wasDone = !!done[taskId];
        if (wasDone) delete done[taskId];
        else done[taskId] = Date.now();
        return withActivity({ ...prev, done }, [taskId], wasDone ? 'undone' : 'done');
      }),
    [apply],
  );

  /** Toggle one TRADING SCHEDULE sub-task. */
  const toggleSub = useCallback(
    (subId: string) =>
      apply((prev) => {
        const done = { ...prev.done };
        const wasDone = !!done[subId];
        if (wasDone) delete done[subId];
        else done[subId] = Date.now();
        return withActivity({ ...prev, done }, [subId], wasDone ? 'undone' : 'done');
      }),
    [apply],
  );

  /** Mark every sub-task of a trading session complete. */
  const completeSession = useCallback(
    (session: TradingSessionId) =>
      apply((prev) => {
        const s = TRADING_SESSIONS.find((x) => x.id === session)!;
        const done = { ...prev.done };
        const changed = s.tasks.filter((t) => !done[t.id]).map((t) => t.id);
        for (const id of changed) done[id] = Date.now();
        return withActivity({ ...prev, done }, changed, 'done');
      }),
    [apply],
  );

  /** Set a client-acquisition counter. Reaching the target ticks the task. */
  const setCount = useCallback(
    (counterId: string, value: number) =>
      apply((prev) => {
        const count = Math.max(0, Math.round(value));
        const target = counterTarget(profile, counterId);
        const counts = { ...prev.counts, [counterId]: count };
        let next: DayLog = { ...prev, counts };
        if (count >= target && !prev.done[counterId]) {
          next = withActivity({ ...next, done: { ...prev.done, [counterId]: Date.now() } }, [counterId], 'done');
        }
        return next;
      }),
    [apply, profile],
  );

  const setBackup = useCallback((task: string | undefined) => apply((prev) => ({ ...prev, backupTask: task })), [apply]);

  const stats = useMemo(() => dayStats(log), [log]);

  return {
    log,
    stats,
    editable,
    isDone: (taskId: string) => isTaskDone(log, taskId),
    session: (id: TradingSessionId) => sessionStats(log, id),
    count: (counterId: string) => log.counts?.[counterId] ?? 0,
    target: (counterId: string) => counterTarget(profile, counterId),
    toggleTask,
    toggleSub,
    completeSession,
    setCount,
    setBackup,
  };
}

export { CLIENT_COUNTERS };
