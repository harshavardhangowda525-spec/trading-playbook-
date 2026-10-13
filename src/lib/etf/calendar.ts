// Exchange sessions. Bars are stored with UTC open times (UNIX seconds); all
// session logic converts to exchange-local time first.

import type { Exchange } from './universe';

export interface SessionSpec {
  exchange: Exchange;
  timeZone: string;
  /** Minutes after local midnight. */
  open: number;
  close: number;
  label: string;
}

export const SESSIONS: Record<Exchange, SessionSpec> = {
  NSE: { exchange: 'NSE', timeZone: 'Asia/Kolkata', open: 9 * 60 + 15, close: 15 * 60 + 30, label: '09:15–15:30 IST' },
  US: { exchange: 'US', timeZone: 'America/New_York', open: 9 * 60 + 30, close: 16 * 60, label: '09:30–16:00 ET' },
};

// Holidays are not hard-coded: the engine never invents sessions, so a weekday
// without bars is reported as "no data (holiday or missing)" rather than guessed.

const fmtCache = new Map<string, Intl.DateTimeFormat>();
function fmt(tz: string) {
  let f = fmtCache.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', weekday: 'short' });
    fmtCache.set(tz, f);
  }
  return f;
}

export interface LocalTime {
  /** Local calendar day, YYYY-MM-DD. */
  day: string;
  /** Minutes after local midnight. */
  min: number;
  weekday: number; // 0 = Sunday
}

const WD: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

export function localTime(t: number, tz: string): LocalTime {
  if (tz === 'Asia/Kolkata') {
    // Fixed offset (+05:30, no DST) — fast path.
    const d = new Date((t + 19800) * 1000);
    return { day: d.toISOString().slice(0, 10), min: d.getUTCHours() * 60 + d.getUTCMinutes(), weekday: d.getUTCDay() };
  }
  const parts = Object.fromEntries(fmt(tz).formatToParts(new Date(t * 1000)).map((p) => [p.type, p.value]));
  return { day: `${parts.year}-${parts.month}-${parts.day}`, min: Number(parts.hour) * 60 + Number(parts.minute), weekday: WD[parts.weekday] ?? 0 };
}

export const hhmm = (min: number) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

/** True when a bar of `sec` seconds starting at `t` lies inside the regular session. */
export function inSession(t: number, sec: number, s: SessionSpec): boolean {
  const lt = localTime(t, s.timeZone);
  if (lt.weekday === 0 || lt.weekday === 6) return false;
  return lt.min >= s.open && lt.min + sec / 60 <= s.close;
}

/** Bars expected in one full session at this bar size. */
export const barsPerSession = (sec: number, s: SessionSpec) => Math.floor(((s.close - s.open) * 60) / sec);

export function fmtLocal(t: number, s: SessionSpec, withDate = true): string {
  const lt = localTime(t, s.timeZone);
  const zone = s.exchange === 'NSE' ? 'IST' : 'ET';
  return withDate ? `${lt.day} ${hhmm(lt.min)} ${zone}` : `${hhmm(lt.min)} ${zone}`;
}
