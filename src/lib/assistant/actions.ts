// Actions the assistant can suggest. The model writes a tag such as
// [[lesson:12]], [[open:replay]] or [[journal:{"market":"…"}]]; the app turns
// each tag into a button, and nothing runs until the learner taps it.

import { TOTAL_DAYS } from '../../data/curriculum';

export const PAGES: Record<string, { to: string; label: string }> = {
  replay: { to: '/trading/replay', label: 'Start a Replay' },
  practice: { to: '/trading', label: 'Open Practice Lab' },
  markets: { to: '/trading/markets', label: 'Open Markets' },
  library: { to: '/trading/history', label: 'Open practice library' },
  journal: { to: '/trading-journal', label: 'Open Trading Journal' },
  mistakes: { to: '/mistakes', label: 'Open Mistake Lab' },
  playbook: { to: '/playbook', label: 'Open Playbook' },
  strategy: { to: '/strategy-lab', label: 'Open Strategy Lab' },
  timetable: { to: '/my-day', label: 'Open My Day' },
  analytics: { to: '/analytics', label: 'Open Analytics' },
  psychology: { to: '/psychology', label: 'Open Psychology journal' },
  journey: { to: '/journey', label: 'Open 84-Day Journey' },
};

export interface JournalDraft {
  market?: string;
  setup?: string;
  timeframe?: string;
  why?: string;
  learned?: string;
  improve?: string;
}

export type Action =
  | { kind: 'lesson'; day: number; label: string; to: string }
  | { kind: 'open'; page: string; label: string; to: string }
  | { kind: 'journal'; draft: JournalDraft; label: string; to: string };

const TAG = /\[\[\s*(lesson|open|journal)\s*:\s*([\s\S]*?)\]\]/gi;

export function journalDraftUrl(d: JournalDraft): string {
  const p = new URLSearchParams({ new: '1', from: 'assistant' });
  for (const [k, v] of Object.entries(d)) if (typeof v === 'string' && v.trim()) p.set(k, v.trim().slice(0, 600));
  return `/trading-journal?${p.toString()}`;
}

function toAction(kind: string, arg: string): Action | null {
  arg = arg.trim();
  if (kind.toLowerCase() === 'lesson') {
    const day = Number(arg.replace(/\D/g, ''));
    return day >= 1 && day <= TOTAL_DAYS ? { kind: 'lesson', day, label: `Open Day ${day} lesson`, to: `/journey/${day}` } : null;
  }
  if (kind.toLowerCase() === 'open') {
    const page = PAGES[arg.toLowerCase()];
    return page ? { kind: 'open', page: arg.toLowerCase(), label: page.label, to: page.to } : null;
  }
  try {
    const raw = JSON.parse(arg) as Record<string, unknown>;
    const draft: JournalDraft = {};
    for (const k of ['market', 'setup', 'timeframe', 'why', 'learned', 'improve'] as const) if (typeof raw[k] === 'string') draft[k] = raw[k] as string;
    return { kind: 'journal', draft, label: 'Review journal draft', to: journalDraftUrl(draft) };
  } catch {
    return null;
  }
}

/** Split a reply into display text and the actions it suggests. */
export function parseActions(reply: string): { text: string; actions: Action[] } {
  const actions: Action[] = [];
  const seen = new Set<string>();
  const text = reply
    .replace(TAG, (_, kind: string, arg: string) => {
      const a = toAction(kind, arg);
      if (a && !seen.has(a.to)) {
        seen.add(a.to);
        actions.push(a);
      }
      return '';
    })
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return { text, actions };
}

/** While streaming, hide a tag that has started but not closed yet. */
export function visiblePart(partial: string): string {
  const i = partial.lastIndexOf('[[');
  const shown = i >= 0 && partial.indexOf(']]', i) < 0 ? partial.slice(0, i) : partial;
  return parseActions(shown).text;
}
