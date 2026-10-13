// Full written lesson content for the 84-day journey.
// Educational content only — nothing here is financial advice.

export interface LessonContent {
  /** "What it is" — plain-English explanation, one string per paragraph. */
  what: string[];
  /** "Why it matters" — one string per paragraph. */
  why: string[];
  /** "How to use it" — ordered, actionable steps. */
  how: string[];
  /** Worked example. Hypothetical numbers only, always labelled as such. */
  example: { title: string; lines: string[] };
  /** Common mistakes beginners make with this topic. */
  mistakes: string[];
  /** Quick self-check: exactly three questions with short answers. */
  quiz: { q: string; a: string }[];
}

/** One day of the curriculum outline (shown on the Journey and lesson header). */
export interface LessonPlan {
  day: number;
  title: string;
  /** Two or three sentence summary shown at the top of the lesson. */
  concept: string;
  /** Exactly four short key points. */
  keyPoints: string[];
  /** Short labels for the day's three 1% checkboxes. */
  learn: string;
  practice: string;
  journal: string;
  review?: boolean;
}
