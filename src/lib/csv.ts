// CSV import for the Practice Lab. Parses real OHLCV exports (TradingView,
// Yahoo Finance, broker / MetaTrader exports) into candles. It validates and
// reports — it never invents, interpolates or fills missing bars.

import { INTERVALS, type Candle, type Interval } from './market';

export interface ParseIssue {
  row: number;
  message: string;
}

export interface ParseResult {
  candles: Candle[]; // valid, sorted ascending by time, de-duplicated
  rows: number; // data rows in file
  rejected: number; // invalid (or duplicate) rows skipped
  issues: ParseIssue[]; // first 50 problems (row = 1-based line number in the file)
  gaps: number; // missing bars vs detected interval — never filled
  baseInterval: Interval | null;
  start: number | null;
  end: number | null;
  columns: { time: string; open: string; high: string; low: string; close: string; volume: string | null };
  fatal: string | null;
}

/** Imports keep at most this many of the most recent candles. */
export const MAX_IMPORT_ROWS = 20_000;
const MAX_ISSUES = 50;
const DAY = 86_400;

// ─── Tokenising ────────────────────────────────────────────────────────────

type Delim = ',' | ';' | '\t';

function countOutsideQuotes(line: string, ch: string): number {
  let n = 0;
  let q = false;
  for (const c of line) {
    if (c === '"') q = !q;
    else if (c === ch && !q) n++;
  }
  return n;
}

function detectDelimiter(line: string): Delim {
  const cands: Delim[] = [',', ';', '\t'];
  let best: Delim = ',';
  let bestN = -1;
  for (const d of cands) {
    const n = countOutsideQuotes(line, d);
    if (n > bestN) {
      best = d;
      bestN = n;
    }
  }
  return best;
}

function splitLine(line: string, d: Delim): string[] {
  const out: string[] = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else q = false;
      } else cur += c;
    } else if (c === '"') q = true;
    else if (c === d) {
      out.push(cur.trim());
      cur = '';
    } else cur += c;
  }
  out.push(cur.trim());
  return out;
}

// ─── Headers ───────────────────────────────────────────────────────────────

const norm = (h: string) => h.toLowerCase().replace(/[<>"'\s_\-.()]/g, '');

const DATETIME_ALIASES = ['datetime', 'date/time', 'timestamp', 'opentime', 'gmttime', 'localtime', 'unix', 'unixtime', 'time(utc)', 'timeutc'];
const DATE_ALIASES = ['date', 'day', 'tradedate', 'datum'];
const TIME_ALIASES = ['time', 'hour', 'zeit'];
const OPEN_ALIASES = ['open', 'o', 'openprice', 'opening'];
const HIGH_ALIASES = ['high', 'h', 'highprice', 'max'];
const LOW_ALIASES = ['low', 'l', 'lowprice', 'min'];
const CLOSE_ALIASES = ['close', 'c', 'closeprice', 'closing', 'last', 'price'];
const VOLUME_ALIASES = ['volume', 'vol', 'tickvol', 'tickvolume', 'realvolume', 'basevolume', 'volumefrom', 'qty'];

function findCol(names: string[], aliases: string[]): number {
  for (const a of aliases) {
    const i = names.indexOf(a);
    if (i >= 0) return i;
  }
  return -1;
}

// ─── Values ────────────────────────────────────────────────────────────────

/** Parse a price/volume, tolerating thousands separators and decimal commas. */
function parseNum(raw: string, delim: Delim): number {
  let s = raw.replace(/[\s'$€£]/g, '');
  if (!s || /^(null|nan|n\/a|na|-|—)$/i.test(s)) return NaN;
  const hasComma = s.includes(',');
  const hasDot = s.includes('.');
  if (hasComma && hasDot) {
    // whichever comes last is the decimal mark
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) s = s.replace(/\./g, '').replace(',', '.');
    else s = s.replace(/,/g, '');
  } else if (hasComma) {
    const thousands = /^-?\d{1,3}(,\d{3})+$/.test(s);
    if (thousands && delim !== ';') s = s.replace(/,/g, '');
    else if ((s.match(/,/g) ?? []).length === 1) s = s.replace(',', '.');
    else s = s.replace(/,/g, '');
  }
  if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(s)) return NaN;
  return Number(s);
}

type DateOrder = 'mdy' | 'dmy';

const ISO_RE = /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})(?:[T\s,]+(\d{1,2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?)?\s*(Z|[+-]\d{2}:?\d{2})?$/i;
const SLASH_RE = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2}|\d{4})(?:[T\s,]+(\d{1,2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?\s*(am|pm)?)?$/i;
const COMPACT_RE = /^(\d{4})(\d{2})(\d{2})(?:[T\s]?(\d{2}):?(\d{2})(?::?(\d{2}))?)?$/;

function utc(y: number, mo: number, d: number, h = 0, mi = 0, s = 0): number {
  if (mo < 1 || mo > 12 || d < 1 || d > 31 || h > 23 || mi > 59 || s > 59) return NaN;
  const ms = Date.UTC(y, mo - 1, d, h, mi, s);
  const chk = new Date(ms);
  if (chk.getUTCDate() !== d) return NaN; // e.g. 31 Feb
  return Math.floor(ms / 1000);
}

/** Returns UNIX seconds (UTC) or NaN. Times without a zone are UTC. */
function parseTime(raw: string, order: DateOrder): number {
  const s = raw.trim().replace(/\s+(utc|gmt)$/i, '');
  if (!s) return NaN;
  // UNIX seconds / milliseconds (9+ digits; 8 digits is YYYYMMDD)
  if (/^\d{9,}(\.\d+)?$/.test(s)) {
    const n = Number(s);
    return Math.floor(n >= 1e11 ? n / 1000 : n);
  }
  let m = ISO_RE.exec(s);
  if (m) {
    let t = utc(+m[1], +m[2], +m[3], +(m[4] ?? 0), +(m[5] ?? 0), +(m[6] ?? 0));
    const z = m[7];
    if (z && z.toUpperCase() !== 'Z' && Number.isFinite(t)) {
      const zm = /([+-])(\d{2}):?(\d{2})/.exec(z)!;
      const off = (+zm[2] * 60 + +zm[3]) * 60;
      t -= zm[1] === '+' ? off : -off;
    }
    return t;
  }
  m = SLASH_RE.exec(s);
  if (m) {
    const a = +m[1];
    const b = +m[2];
    let y = +m[3];
    if (m[3].length === 2) y += y >= 70 ? 1900 : 2000;
    let h = +(m[4] ?? 0);
    const ap = m[7]?.toLowerCase();
    if (ap === 'pm' && h < 12) h += 12;
    if (ap === 'am' && h === 12) h = 0;
    const [mo, d] = order === 'dmy' ? [b, a] : [a, b];
    return utc(y, mo, d, h, +(m[5] ?? 0), +(m[6] ?? 0));
  }
  m = COMPACT_RE.exec(s);
  if (m) return utc(+m[1], +m[2], +m[3], +(m[4] ?? 0), +(m[5] ?? 0), +(m[6] ?? 0));
  // Last resort: other ISO-like strings the platform understands.
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) {
    const ms = Date.parse(/[zZ]|[+-]\d{2}:?\d{2}$/.test(s) ? s : `${s}Z`);
    return Number.isFinite(ms) ? Math.floor(ms / 1000) : NaN;
  }
  return NaN;
}

/** Slash/dot dates are ambiguous: decide by values > 12. Dots default to D.M.Y. */
function detectDateOrder(samples: string[]): DateOrder {
  let firstBig = false;
  let secondBig = false;
  let dots = false;
  for (const raw of samples) {
    const m = SLASH_RE.exec(raw.trim().replace(/\s+(utc|gmt)$/i, ''));
    if (!m) continue;
    if (raw.includes('.')) dots = true;
    if (+m[1] > 12) firstBig = true;
    if (+m[2] > 12) secondBig = true;
  }
  if (firstBig && !secondBig) return 'dmy';
  if (secondBig && !firstBig) return 'mdy';
  return dots ? 'dmy' : 'mdy';
}

// ─── Interval & gaps ───────────────────────────────────────────────────────

export function detectInterval(candles: Candle[]): Interval | null {
  if (candles.length < 2) return null;
  const deltas: number[] = [];
  for (let i = 1; i < candles.length; i++) deltas.push(candles[i].t - candles[i - 1].t);
  deltas.sort((a, b) => a - b);
  const med = deltas[Math.floor((deltas.length - 1) / 2)];
  for (const iv of INTERVALS) if (Math.abs(med - iv.sec) <= iv.sec * 0.1) return iv.key;
  return null;
}

function weekdaysBetween(a: number, b: number): number {
  // whole days strictly between a and b that fall Mon–Fri (UTC)
  let n = 0;
  for (let t = Math.floor(a / DAY) * DAY + DAY; t < Math.floor(b / DAY) * DAY; t += DAY) {
    const wd = new Date(t * 1000).getUTCDay();
    if (wd !== 0 && wd !== 6) n++;
  }
  return n;
}

/**
 * Count missing bars. Daily: only gaps longer than 4 days count (weekends and
 * holidays are normal), measured in missing weekdays. Intraday: gaps over 2
 * days are market closures, and so are overnight session breaks (≥ 8h across a
 * UTC date change). Nothing is ever filled — gaps stay visible on the chart.
 */
export function countGaps(candles: Candle[], interval: Interval | null): number {
  if (!interval || candles.length < 2) return 0;
  const sec = INTERVALS.find((i) => i.key === interval)!.sec;
  let gaps = 0;
  for (let i = 1; i < candles.length; i++) {
    const a = candles[i - 1].t;
    const b = candles[i].t;
    const d = b - a;
    if (d <= sec * 1.5) continue;
    if (interval === '1d') {
      if (d > 4 * DAY) gaps += weekdaysBetween(a, b);
      continue;
    }
    if (d > 2 * DAY) continue;
    if (d >= 8 * 3600 && Math.floor(a / DAY) !== Math.floor(b / DAY)) continue;
    gaps += Math.round(d / sec) - 1;
  }
  return gaps;
}

// ─── Main ──────────────────────────────────────────────────────────────────

const EMPTY_COLS = { time: '', open: '', high: '', low: '', close: '', volume: null };

export function parseMarketCSV(text: string, fileName: string): ParseResult {
  void fileName; // kept for API symmetry / future format hints
  const base: ParseResult = {
    candles: [],
    rows: 0,
    rejected: 0,
    issues: [],
    gaps: 0,
    baseInterval: null,
    start: null,
    end: null,
    columns: { ...EMPTY_COLS },
    fatal: null,
  };

  const lines = text.replace(/^﻿/, '').split(/\r\n|\n|\r/);
  let hi = lines.findIndex((l) => l.trim() !== '');
  if (hi < 0) return { ...base, fatal: 'The file is empty.' };
  // Skip "sep=;" hints written by Excel
  const sepHint = /^sep=(.)$/i.exec(lines[hi].trim());
  let delim: Delim | null = null;
  if (sepHint) {
    const ch = sepHint[1];
    delim = ch === ';' ? ';' : ch === '\t' ? '\t' : ',';
    hi = lines.findIndex((l, i) => i > hi && l.trim() !== '');
    if (hi < 0) return { ...base, fatal: 'The file has no header row.' };
  }
  const d = delim ?? detectDelimiter(lines[hi]);
  const header = splitLine(lines[hi], d);
  const names = header.map(norm);

  const iDateTime = findCol(names, DATETIME_ALIASES);
  const iDate = findCol(names, DATE_ALIASES);
  const iTime = findCol(names, TIME_ALIASES);
  let timeCols: number[];
  if (iDate >= 0 && iTime >= 0 && iDateTime < 0) timeCols = [iDate, iTime];
  else if (iDateTime >= 0) timeCols = [iDateTime];
  else if (iDate >= 0) timeCols = [iDate];
  else if (iTime >= 0) timeCols = [iTime];
  else timeCols = [];

  const iO = findCol(names, OPEN_ALIASES);
  const iH = findCol(names, HIGH_ALIASES);
  const iL = findCol(names, LOW_ALIASES);
  const iC = findCol(names, CLOSE_ALIASES);
  const iV = findCol(names, VOLUME_ALIASES);

  const columns = {
    time: timeCols.map((i) => header[i]).join(' + '),
    open: iO >= 0 ? header[iO] : '',
    high: iH >= 0 ? header[iH] : '',
    low: iL >= 0 ? header[iL] : '',
    close: iC >= 0 ? header[iC] : '',
    volume: iV >= 0 ? header[iV] : null,
  };

  const missing = !timeCols.length ? 'Date/Time' : iO < 0 ? 'Open' : iH < 0 ? 'High' : iL < 0 ? 'Low' : iC < 0 ? 'Close' : null;

  // Collect data lines (1-based line numbers for reporting)
  const data: { line: number; f: string[] }[] = [];
  for (let i = hi + 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue;
    data.push({ line: i + 1, f: splitLine(lines[i], d) });
  }
  const rows = data.length;

  if (missing) {
    const looksHeaderless = /^[\d"\s.,;:/\-+T]+$/.test(lines[hi]);
    return {
      ...base,
      rows,
      columns,
      fatal: looksHeaderless
        ? 'No header row found — the first line must name the columns (Date, Open, High, Low, Close, Volume).'
        : `Missing a ${missing} column. Found: ${header.filter(Boolean).join(', ') || 'nothing'}.`,
    };
  }
  if (!rows) return { ...base, columns, fatal: 'The file has a header but no data rows.' };

  const timeOf = (f: string[]) => timeCols.map((i) => f[i] ?? '').join(' ').trim();
  const order = detectDateOrder(data.slice(0, 5000).map((r) => timeOf(r.f)));

  const issues: ParseIssue[] = [];
  let rejected = 0;
  const reject = (row: number, message: string) => {
    rejected++;
    if (issues.length < MAX_ISSUES) issues.push({ row, message });
  };

  const parsed: { line: number; k: Candle }[] = [];
  for (const { line, f } of data) {
    const rawT = timeOf(f);
    const t = parseTime(rawT, order);
    if (!Number.isFinite(t)) {
      reject(line, rawT ? `Unrecognised date/time "${rawT.slice(0, 40)}"` : 'Missing date/time');
      continue;
    }
    const o = parseNum(f[iO] ?? '', d);
    const h = parseNum(f[iH] ?? '', d);
    const l = parseNum(f[iL] ?? '', d);
    const c = parseNum(f[iC] ?? '', d);
    if (![o, h, l, c].every(Number.isFinite)) {
      reject(line, 'Open/High/Low/Close must all be numbers');
      continue;
    }
    if (o <= 0 || h <= 0 || l <= 0 || c <= 0) {
      reject(line, 'Prices must be greater than 0');
      continue;
    }
    if (h < l) {
      reject(line, `High (${h}) is below Low (${l})`);
      continue;
    }
    if (h < Math.max(o, c)) {
      reject(line, `High (${h}) is below Open/Close`);
      continue;
    }
    if (l > Math.min(o, c)) {
      reject(line, `Low (${l}) is above Open/Close`);
      continue;
    }
    let v = iV >= 0 ? parseNum(f[iV] ?? '', d) : 0;
    if (!Number.isFinite(v) || v < 0) v = 0;
    parsed.push({ line, k: { t, o, h, l, c, v } });
  }

  // Stable sort keeps file order among equal timestamps → "keep first".
  parsed.sort((a, b) => a.k.t - b.k.t);
  const candles: Candle[] = [];
  let prev: { line: number; k: Candle } | null = null;
  for (const p of parsed) {
    if (prev && prev.k.t === p.k.t) {
      reject(p.line, `Duplicate timestamp (row ${prev.line} kept)`);
      continue;
    }
    candles.push(p.k);
    prev = p;
  }
  issues.sort((a, b) => a.row - b.row);

  if (!candles.length) {
    return { ...base, rows, rejected, issues, columns, fatal: 'No valid candles were found in this file.' };
  }

  const baseInterval = detectInterval(candles);
  return {
    candles,
    rows,
    rejected,
    issues,
    gaps: countGaps(candles, baseInterval),
    baseInterval,
    start: candles[0].t,
    end: candles[candles.length - 1].t,
    columns,
    fatal: null,
  };
}
