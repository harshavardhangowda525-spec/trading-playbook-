// A compact, factual summary of the learner's own data for the assistant.
// Built on the device from the local store; nothing is sent anywhere.

import { useMemo } from 'react';
import { useCollection, useToday } from '../hooks';
import { useDayLogs, useJourney, useJourneyDay } from '../data';
import { C, computeStreak, dayStats, type Mistake } from '../domain';
import { lessonFor, phaseFor, TOTAL_DAYS } from '../../data/curriculum';
import { JOURNAL_COLLECTION, journalStats, mistakeCounts, type JournalTradeEntry } from '../journal';
import { SESSIONS_COL, type PracticeSession } from '../practice';

export interface Snapshot {
  today: string;
  day: number;
  lessonTitle: string;
  lessonDone: boolean;
  /** Plain-text facts, one per line, for the model. */
  text: string;
  /** True when the learner has logged anything worth reviewing. */
  hasData: boolean;
}

const pct = (x: number | null | undefined) => (x == null ? '—' : `${Math.round(x * 100)}%`);
const num = (x: number | null | undefined, d = 2) => (x == null ? '—' : x.toFixed(d));

export function useSnapshot(): Snapshot {
  const today = useToday();
  const day = useJourneyDay(today);
  const journey = useJourney();
  const { map: logs } = useDayLogs();
  const { items: entries } = useCollection<JournalTradeEntry>(JOURNAL_COLLECTION);
  const { items: sessions } = useCollection<PracticeSession>(SESSIONS_COL);
  const { items: mistakes } = useCollection<Mistake>(C.mistakes);

  return useMemo(() => {
    const lesson = lessonFor(day);
    const lessonDone = !!journey.byDay.get(day)?.completed;
    const completedDays = [...journey.byDay.values()].filter((d) => d.completed).length;
    const todayStats = dayStats(logs.get(today), today);
    const streak = computeStreak('daily', logs, today);
    const js = journalStats(entries, today);
    const top = mistakeCounts(entries).slice(0, 3);
    const done = sessions.filter((s) => s.status === 'complete');
    const scores = done.map((s) => s.score?.total).filter((x): x is number => x != null);
    const avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
    const recent = [...done].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 3);
    const weakParts = new Map<string, number[]>();
    for (const s of done) for (const p of s.score?.parts ?? []) weakParts.set(p.label, [...(weakParts.get(p.label) ?? []), p.score]);
    const weakest = [...weakParts.entries()]
      .map(([label, v]) => ({ label, avg: v.reduce((a, b) => a + b, 0) / v.length }))
      .sort((a, b) => a.avg - b.avg)[0];
    const open = mistakes.filter((m) => m.status === 'open').slice(0, 3);
    const lastEntry = [...entries].sort((a, b) => b.updatedAt - a.updatedAt)[0];

    const lines = [
      `Today: ${today}. Journey day ${day}/${TOTAL_DAYS} (${phaseFor(day).name}): "${lesson.title}" — ${lessonDone ? 'completed' : 'not completed yet'}. Lessons completed: ${completedDays}.`,
      `Timetable today: ${todayStats.done}/${todayStats.total} tasks (${pct(todayStats.pct)}). Daily streak: ${streak.current} days (best ${streak.longest}).`,
      `Trading Journal (simulated/educational): ${js.total} entries, ${js.wins} successful, ${js.losses} failed; rule-following ${pct(js.ruleFollowing)}; avg planned R:R ${num(js.avgRR)}; avg simulated R ${num(js.avgSimR)}; journal streak ${js.streak.current}.`,
      top.length ? `Most frequent journal mistakes: ${top.map((m) => `${m.label} ×${m.count} (fix: ${m.lesson})`).join('; ')}.` : 'No journal mistakes tagged yet.',
      `Practice Lab: ${done.length} completed sessions; average process score ${avgScore == null ? '—' : Math.round(avgScore)}/100${weakest ? `; weakest score area: ${weakest.label} (${Math.round(weakest.avg)})` : ''}.`,
      recent.length
        ? `Recent practice: ${recent.map((s) => `${s.date} ${s.market} ${s.interval} ${s.decision === 'notrade' ? 'no trade' : s.decision ?? '—'} score ${s.score?.total ?? '—'}${s.mistakes.length ? ` mistakes: ${s.mistakes.join(',')}` : ''}`).join('; ')}.`
        : 'No completed practice sessions yet.',
      open.length ? `Open Mistake Lab items: ${open.map((m) => `"${m.title}" (prevention: ${m.prevention || '—'})`).join('; ')}.` : 'No open Mistake Lab items.',
      lastEntry ? `Latest journal entry: ${lastEntry.date} ${lastEntry.market || '—'} setup "${lastEntry.setup || '—'}" result ${lastEntry.result || '—'}; learned: "${lastEntry.learned || '—'}".` : '',
    ].filter(Boolean);

    return {
      today,
      day,
      lessonTitle: lesson.title,
      lessonDone,
      text: lines.join('\n'),
      hasData: entries.length + done.length + mistakes.length > 0,
    };
  }, [today, day, journey, logs, entries, sessions, mistakes]);
}
