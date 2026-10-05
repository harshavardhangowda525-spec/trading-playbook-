// Convenience hooks over the store for app-wide data.

import { useEffect, useMemo } from 'react';
import { useCollection, useDoc } from './hooks';
import {
  C,
  DEFAULT_PLAYBOOK,
  DEFAULT_PROFILE,
  computeSkills,
  journeyDay,
  logMap,
  type DayLog,
  type JournalEntry,
  type JourneyDay,
  type Mistake,
  type Playbook,
  type PracticeLog,
  type Profile,
  type PsychEntry,
  type SkillInputs,
  type Strategy,
  type Trade,
} from './domain';
import { store } from './store';

export function useProfile() {
  const [profile, update, exists] = useDoc<Profile>(C.settings, 'profile', DEFAULT_PROFILE);
  return { profile, update, exists };
}

/** Day 1 is the first day the command center was opened (adjustable in settings). */
export function useEnsureStartDate(today: string) {
  const { profile, update } = useProfile();
  useEffect(() => {
    if (store.ready && !profile.startDate) update({ startDate: today });
  }, [profile.startDate, today, update]);
}

export function useJourneyDay(today: string): number {
  const { profile } = useProfile();
  return journeyDay(profile, today);
}

export function useJourney() {
  const col = useCollection<JourneyDay>(C.journey);
  const byDay = useMemo(() => new Map(col.items.map((j) => [j.day, j])), [col.items]);
  const completed = useMemo(() => col.items.filter((j) => j.completed).length, [col.items]);
  return { ...col, byDay, completed };
}

export function useDayLogs() {
  const { items } = useCollection<DayLog>(C.daylog);
  const map = useMemo(() => logMap(items), [items]);
  return { logs: items, map };
}

export function useSkillInputs(): SkillInputs {
  const journey = useCollection<JourneyDay>(C.journey).items;
  const backtests = useCollection<Trade>(C.backtests).items;
  const sims = useCollection<Trade>(C.sims).items;
  const trades = useCollection<Trade>(C.trades).items;
  const journals = useCollection<JournalEntry>(C.journal).items;
  const psych = useCollection<PsychEntry>(C.psych).items;
  const practice = useCollection<PracticeLog>(C.practice).items;
  const strategies = useCollection<Strategy>(C.strategies).items;
  const logs = useCollection<DayLog>(C.daylog).items;
  const mistakes = useCollection<Mistake>(C.mistakes).items;
  const [playbook] = useDoc<Playbook>(C.playbook, 'main', DEFAULT_PLAYBOOK);
  return useMemo(
    () => ({ journey, backtests, sims, trades, journals, psych, practice, strategies, playbook, logs, mistakes }),
    [journey, backtests, sims, trades, journals, psych, practice, strategies, playbook, logs, mistakes],
  );
}

export function useSkills() {
  const inputs = useSkillInputs();
  return useMemo(() => computeSkills(inputs), [inputs]);
}
