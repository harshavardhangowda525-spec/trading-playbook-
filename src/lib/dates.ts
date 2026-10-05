// All "day keys" are local-calendar dates formatted YYYY-MM-DD.

export const pad = (n: number) => String(n).padStart(2, '0');

export function toKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayKey(): string {
  return toKey(new Date());
}

export function fromKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key: string, n: number): string {
  const d = fromKey(key);
  d.setDate(d.getDate() + n);
  return toKey(d);
}

/** Whole calendar days from a → b (b - a). */
export function diffDays(a: string, b: string): number {
  const ms = fromKey(b).getTime() - fromKey(a).getTime();
  return Math.round(ms / 86_400_000);
}

const WEEKDAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

/** "MONDAY • OCTOBER 5" */
export function formatHeaderDate(key: string): string {
  const d = fromKey(key);
  return `${WEEKDAYS[d.getDay()]} • ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

/** "Mon, Oct 5" */
export function formatShort(key: string): string {
  return fromKey(key).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

/** "Oct 5, 2026" */
export function formatLong(key: string): string {
  return fromKey(key).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function weekdayShort(key: string): string {
  return fromKey(key).toLocaleDateString(undefined, { weekday: 'short' });
}

/** Monday-based start of the week containing `key`. */
export function startOfWeek(key: string): string {
  const d = fromKey(key);
  const offset = (d.getDay() + 6) % 7;
  return addDays(key, -offset);
}

export function startOfMonth(key: string): string {
  const d = fromKey(key);
  return toKey(new Date(d.getFullYear(), d.getMonth(), 1));
}

export function daysInMonth(key: string): number {
  const d = fromKey(key);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

export function rangeKeys(from: string, to: string): string[] {
  const out: string[] = [];
  for (let k = from; k <= to; k = addDays(k, 1)) out.push(k);
  return out;
}

/** "HH:MM" (24h) → minutes since midnight */
export function hmToMin(hm: string): number {
  const [h, m] = hm.split(':').map(Number);
  return h * 60 + m;
}

/** minutes since midnight → "04:30 PM" */
export function minTo12(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = min % 60;
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${pad(h12)}:${pad(m)} ${suffix}`;
}

/** minutes since midnight → "04:30" (12h clock, no suffix — matches the HUD look) */
export function minToClock(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${pad(h12)}:${pad(min % 60)}`;
}

export function nowMinutes(d = new Date()): number {
  return d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60;
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}
