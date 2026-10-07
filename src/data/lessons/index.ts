// Full lesson content and reference videos, keyed by journey day.
// Lesson text is split into four chunks that load on demand.
import { useEffect, useState } from 'react';
import type { LessonContent } from './types';
import { VIDEOS, type LessonVideo } from './videos';

export type { LessonContent, LessonVideo };

type Chunk = Record<number, LessonContent>;
const loaders: [number, () => Promise<{ CONTENT: Chunk }>][] = [
  [21, () => import('./days01-21')],
  [42, () => import('./days22-42')],
  [63, () => import('./days43-63')],
  [84, () => import('./days64-84')],
];

export function loadLessonContent(day: number): Promise<LessonContent | undefined> {
  const entry = loaders.find(([last]) => day <= last);
  return entry ? entry[1]().then((m) => m.CONTENT[day]) : Promise.resolve(undefined);
}

/** Every lesson's content, keyed by day (loads all four chunks). */
export async function loadAllLessonContent(): Promise<Chunk> {
  const parts = await Promise.all(loaders.map(([, load]) => load()));
  return Object.assign({}, ...parts.map((m) => m.CONTENT));
}

/** Lesson content for a day; `undefined` while loading, `null` if unavailable. */
export function useLessonContent(day: number): LessonContent | null | undefined {
  const [state, setState] = useState<{ day: number; content: LessonContent | null } | null>(null);
  useEffect(() => {
    let alive = true;
    loadLessonContent(day)
      .then((c) => alive && setState({ day, content: c ?? null }))
      .catch(() => alive && setState({ day, content: null }));
    return () => {
      alive = false;
    };
  }, [day]);
  return state?.day === day ? state.content : undefined;
}

export function lessonVideo(day: number): LessonVideo | undefined {
  return VIDEOS[day];
}
