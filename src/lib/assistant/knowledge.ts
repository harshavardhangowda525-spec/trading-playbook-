// Finds the lessons most relevant to a question, so the assistant answers
// from the app's own 84-day curriculum.

import { LESSONS_BY_DAY, PHASES } from '../../data/curriculum';
import { loadAllLessonContent, type LessonContent } from '../../data/lessons';

export interface LessonHit {
  day: number;
  title: string;
  phase: string;
  content: LessonContent | undefined;
  score: number;
}

const STOP = new Set(
  'a an and are as at be by can do does for from how i if in is it me my of on or so that the this to was what when where which who why will with you your about explain tell please'.split(' '),
);

const tokens = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9%/ ]+/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map((w) => w.replace(/(ing|es|s)$/, ''));

let index: Promise<{ day: number; title: string; phase: string; content?: LessonContent; title_t: string[]; body_t: string[] }[]> | null = null;

function buildIndex() {
  index ??= loadAllLessonContent()
    .catch(() => ({}) as Record<number, LessonContent>)
    .then((all) =>
      LESSONS_BY_DAY.map((l) => {
        const c = all[l.day];
        const body = [l.concept, ...l.keyPoints, ...(c ? [...c.what, ...c.why, ...c.how, ...c.mistakes] : [])].join(' ');
        return {
          day: l.day,
          title: l.title,
          phase: PHASES[l.phase - 1].name,
          content: c,
          title_t: tokens(`${l.title} ${PHASES[l.phase - 1].name}`),
          body_t: tokens(body),
        };
      }),
    );
  return index;
}

/** Top lessons for a question. `preferDay` (the lesson on screen) gets a boost. */
export async function searchLessons(question: string, preferDay?: number, limit = 2): Promise<LessonHit[]> {
  const q = new Set(tokens(question));
  const docs = await buildIndex();
  const hits = docs.map((d) => {
    let score = 0;
    for (const w of q) {
      if (d.title_t.includes(w)) score += 6;
      const n = d.body_t.filter((t) => t === w).length;
      score += Math.min(n, 6);
    }
    if (d.day === preferDay) score += 4;
    return { day: d.day, title: d.title, phase: d.phase, content: d.content, score };
  });
  return hits
    .filter((h) => h.score > 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/** Compact lesson text for the model's context window. */
export function lessonBrief(h: LessonHit, long = false): string {
  const c = h.content;
  if (!c) return `Day ${h.day} — ${h.title} (${h.phase})`;
  const what = long ? c.what.join(' ') : c.what.slice(0, 2).join(' ');
  return [
    `Day ${h.day} — ${h.title} (${h.phase})`,
    `What: ${what}`,
    `How: ${c.how.slice(0, long ? 7 : 4).join(' | ')}`,
    `Common mistakes: ${c.mistakes.slice(0, 3).join(' | ')}`,
  ].join('\n');
}
