import { describe, expect, it } from 'vitest';
import type { Candle } from '../../market';
import { runBacktest, type BacktestConfig } from '../backtest';
import { SESSIONS, localTime } from '../calendar';
import { fillCharges, NSE_COSTS, roundTripPct } from '../costs';
import { assessEligibility } from '../eligibility';
import { atr, ema, sessionVwap } from '../indicators';
import { computeMetrics, type SimTrade } from '../metrics';
import { advance, createSession, endSession, placeOrder, preTradeCheck, type DayBars } from '../paper';
import { prepareBars } from '../quality';
import { DEFAULT_RISK, positionSize } from '../risk';
import { buildCtx, defaultParams, STRATEGIES, type StrategyDef } from '../strategies';
import { etfBySymbol } from '../universe';
import { DAYS, day5m, flatDay, ist, walkDay } from './fixtures';

const NIFTYBEES = etfBySymbol('NIFTYBEES')!;
const NSE = SESSIONS.NSE;
type Row = [number, number, number, number, number];

/** A day of 75 flat bars at 100 with chosen bars replaced. */
function scriptedDay(day: string, edits: Record<number, Row>): Candle[] {
  const rows: Row[] = Array.from({ length: 75 }, () => [100, 100.1, 99.9, 100, 10000]);
  for (const [i, r] of Object.entries(edits)) rows[+i] = r;
  return day5m(day, rows);
}

/** Strategy that fires once per listed bar time with a fixed plan. */
function scripted(plans: Record<number, { stop: number; target: number }>): StrategyDef {
  return {
    ...STRATEGIES[0],
    params: [],
    signal: (x, i) => {
      const p = plans[x.c[i].t];
      return p ? { side: 'long', stop: p.stop, target: p.target, rr: null, reason: 'scripted test signal' } : null;
    },
    exit: undefined,
  };
}

function cfg(over: Partial<BacktestConfig> = {}): BacktestConfig {
  return {
    symbol: 'NIFTYBEES',
    exchange: 'NSE',
    interval: '5m',
    intervalSec: 300,
    strategy: 'trend',
    params: defaultParams('trend'),
    risk: { ...DEFAULT_RISK, minRR: 0 },
    costs: { ...NSE_COSTS },
    sttApplies: true,
    trainPct: 70,
    ...over,
  };
}

const warm = flatDay(DAYS[0], 100); // day 1: warm-up bars
const T = (i: number) => ist(DAYS[1], 9, 15) + i * 300; // bar i of day 2

describe('cost model', () => {
  it('matches a hand calculation for 400 units at ₹250', () => {
    const buy = fillCharges('buy', 250, 400, NSE_COSTS, true);
    const sell = fillCharges('sell', 250, 400, NSE_COSTS, true);
    // value 1,00,000: brokerage min(30, 20) = 20; exch 2.97; SEBI 0.10; stamp 3 (buy); STT 25 (sell)
    expect(buy.brokerage).toBe(20);
    expect(buy.stamp).toBe(3);
    expect(buy.stt).toBe(0);
    expect(sell.stt).toBe(25);
    expect(sell.stamp).toBe(0);
    expect(buy.gst).toBeCloseTo(0.18 * (20 + 2.97 + 0.1), 1);
    expect(buy.total + sell.total).toBeCloseTo(20 + 20 + 25 + 2.97 * 2 + 0.2 + 3 + 0.18 * (23.07 * 2), 0);
  });
  it('charges no STT on gold ETFs', () => {
    expect(fillCharges('sell', 60, 1000, NSE_COSTS, etfBySymbol('GOLDBEES')!.stt).stt).toBe(0);
  });
  it('round-trip cost includes spread and slippage', () => {
    const noFriction = roundTripPct(250, 400, { ...NSE_COSTS, spreadBps: 0, slippageBps: 0 }, true);
    expect(roundTripPct(250, 400, NSE_COSTS, true)).toBeGreaterThan(noFriction);
  });
});

describe('indicators are causal', () => {
  const c = [...walkDay(DAYS[0], 250, 7), ...walkDay(DAYS[1], 251, 9)];
  it('values on a prefix equal the full-series values', () => {
    const closes = c.map((k) => k.c);
    const full = ema(closes, 20);
    const part = ema(closes.slice(0, 60), 20);
    expect(part.slice(19)).toEqual(full.slice(19, 60));
    expect(atr(c.slice(0, 60), 14).slice(14)).toEqual(atr(c, 14).slice(14, 60));
  });
  it('VWAP resets each session', () => {
    const v = sessionVwap(c, (i) => localTime(c[i].t, NSE.timeZone).day);
    const first2 = c[75];
    expect(v[75]).toBeCloseTo((first2.h + first2.l + first2.c) / 3, 6);
  });
  it('no strategy signal changes when future bars are removed (no look-ahead)', () => {
    const data = [...walkDay(DAYS[0], 250, 3, 0.0004), ...walkDay(DAYS[1], 252, 5, -0.0004), ...walkDay(DAYS[2], 250, 11)];
    const full = buildCtx(data, NSE, 0.1);
    for (const st of STRATEGIES) {
      const p = defaultParams(st.id);
      for (let i = 60; i < data.length; i += 7) {
        const prefix = buildCtx(data.slice(0, i + 1), NSE, 0.1);
        expect(st.signal(prefix, i, p, true)).toEqual(st.signal(full, i, p, true));
      }
    }
  });
});

describe('backtest fills', () => {
  it('enters at the NEXT bar open, never the signal bar close', () => {
    const d2 = scriptedDay(DAYS[1], { 11: [100.5, 100.6, 100.4, 100.5, 10000], 12: [100.5, 103.5, 100.3, 103.2, 10000] });
    const r = runBacktest([...warm, ...d2], cfg({ strategyDef: scripted({ [T(10)]: { stop: 99, target: 103 } }) }));
    expect(r.trades).toHaveLength(1);
    const t = r.trades[0];
    expect(t.signalT).toBe(T(10));
    expect(t.entryT).toBe(T(11));
    expect(t.entryRef).toBe(100.5);
    expect(t.entryFill).toBeGreaterThan(100.5); // spread + slippage paid
    expect(t.exitReason).toBe('target');
    expect(t.exitFill).toBe(103);
    expect(t.net).toBeLessThan(t.gross); // charges deducted
  });
  it('assumes the stop first when stop and target are hit in the same bar', () => {
    const d2 = scriptedDay(DAYS[1], { 12: [100, 104, 98.5, 101, 10000] });
    const r = runBacktest([...warm, ...d2], cfg({ strategyDef: scripted({ [T(10)]: { stop: 99, target: 103 } }) }));
    expect(r.trades[0].exitReason).toBe('stop');
    expect(r.trades[0].exitFill).toBeLessThan(99);
  });
  it('fills a gap through the stop at the open, not at the stop', () => {
    const d2 = scriptedDay(DAYS[1], { 12: [97, 97.5, 96.5, 97, 10000] });
    const r = runBacktest([...warm, ...d2], cfg({ strategyDef: scripted({ [T(10)]: { stop: 99, target: 103 } }) }));
    expect(r.trades[0].exitReason).toBe('gap-stop');
    expect(r.trades[0].exitRef).toBe(97);
  });
  it('skips an entry when the next bar opens beyond the stop', () => {
    const d2 = scriptedDay(DAYS[1], { 11: [98.5, 98.8, 98.2, 98.6, 10000] });
    const r = runBacktest([...warm, ...d2], cfg({ strategyDef: scripted({ [T(10)]: { stop: 99, target: 103 } }) }));
    expect(r.trades).toHaveLength(0);
    expect(r.missed[0].reason).toMatch(/beyond the stop/);
  });
  it('squares off before the close and never holds overnight', () => {
    const d2 = scriptedDay(DAYS[1], {});
    const r = runBacktest([...warm, ...d2, ...flatDay(DAYS[2], 100)], cfg({ strategyDef: scripted({ [T(10)]: { stop: 90, target: 120 } }) }));
    const t = r.trades[0];
    expect(t.exitReason).toBe('square-off');
    const lt = localTime(t.exitT, NSE.timeZone);
    expect(lt.day).toBe(DAYS[1]);
    expect(lt.min + 5).toBe(15 * 60 + 15); // bar ending 15:15 = close − 15 min
  });
  it('locks the day after the daily loss limit', () => {
    const d2 = scriptedDay(DAYS[1], { 12: [100, 100.2, 98.5, 98.6, 10000] });
    const risk = { ...DEFAULT_RISK, minRR: 0, dailyLossPct: 0.1 };
    const r = runBacktest([...warm, ...d2], cfg({ risk, strategyDef: scripted({ [T(10)]: { stop: 99, target: 103 }, [T(20)]: { stop: 99, target: 103 } }) }));
    expect(r.trades).toHaveLength(1);
    expect(r.lockedDays).toEqual([DAYS[1]]);
    expect(r.missed.some((m) => /Daily loss limit/.test(m.reason))).toBe(true);
  });
  it('respects the max-trades limit and minimum R:R', () => {
    const d2 = scriptedDay(DAYS[1], {});
    const plans = { [T(10)]: { stop: 99.5, target: 100.4 } }; // R:R < 1 at entry ≈ 100
    const r = runBacktest([...warm, ...d2], cfg({ risk: { ...DEFAULT_RISK, minRR: 1.5 }, strategyDef: scripted(plans) }));
    expect(r.trades).toHaveLength(0);
    expect(r.missed[0].reason).toMatch(/R:R/);
  });
  it('is reproducible: same data and settings give identical results', () => {
    const data = DAYS.flatMap((d, k) => walkDay(d, 250 + k, 100 + k, k % 2 ? 0.0003 : -0.0002));
    for (const st of STRATEGIES) {
      const c = cfg({ strategy: st.id, params: defaultParams(st.id), risk: { ...DEFAULT_RISK, allowShort: true } });
      const a = runBacktest(data, c);
      const b = runBacktest(data, c);
      expect(a.fingerprint).toBe(b.fingerprint);
      expect(a.metrics).toEqual(b.metrics);
      expect(a.trades.map((t) => [t.entryT, t.exitT, t.net])).toEqual(b.trades.map((t) => [t.entryT, t.exitT, t.net]));
      for (const t of a.trades) expect(localTime(t.entryT, NSE.timeZone).day).toBe(localTime(t.exitT, NSE.timeZone).day);
    }
  });
  it('splits training and out-of-sample by trading day', () => {
    const data = DAYS.flatMap((d, k) => walkDay(d, 250, 40 + k, 0.0004));
    const r = runBacktest(data, cfg());
    expect(r.splitDay).toBe(DAYS[7]);
    expect(r.trainDays).toBe(7);
    expect(r.testDays).toBe(3);
    for (const t of r.trades) expect(t.segment).toBe(t.day >= DAYS[7] ? 'test' : 'train');
  });
});

describe('data quality', () => {
  it('drops out-of-session bars and counts — never fills — missing bars', () => {
    const d = flatDay(DAYS[0], 100).filter((_, i) => i % 10 !== 3); // remove some bars
    const pre = { t: ist(DAYS[0], 9, 5), o: 1, h: 1, l: 1, c: 1, v: 1 }; // pre-open bar
    const { bars, quality } = prepareBars([pre, ...d, d[5]], 300, NSE);
    expect(bars).toHaveLength(d.length);
    expect(quality.outOfSession).toBe(1);
    expect(quality.duplicates).toBe(1);
    expect(quality.missingBars).toBe(75 - d.length);
  });
});

describe('risk management', () => {
  it('sizes within the risk budget including costs', () => {
    const s = positionSize('long', 250, 248, { ...DEFAULT_RISK, capital: 100000, riskPct: 0.5 }, NSE_COSTS, true);
    expect(s.qty).toBeGreaterThan(0);
    expect(s.riskAmount).toBeLessThanOrEqual(500);
    expect(s.qty).toBeLessThanOrEqual(Math.floor(500 / 2));
  });
  it('rejects a stop on the wrong side', () => {
    expect(positionSize('long', 250, 251, DEFAULT_RISK, NSE_COSTS, true).rejected).toMatch(/wrong side/);
  });
  it('caps the position at the allowed exposure (no leverage)', () => {
    const s = positionSize('long', 250, 249.99, { ...DEFAULT_RISK, maxPositionPct: 100 }, { ...NSE_COSTS, spreadBps: 0, slippageBps: 0 }, true);
    expect(s.qty * 250).toBeLessThanOrEqual(100000);
  });
});

describe('metrics', () => {
  const mk = (net: number, exitT: number): SimTrade =>
    ({ net, gross: net + 10, charges: 10, friction: 2, exitT, plannedRR: 2, r: net / 100 }) as unknown as SimTrade;
  it('computes win rate, profit factor and drawdown by hand', () => {
    const m = computeMetrics([mk(200, 1), mk(-100, 2), mk(-100, 3), mk(300, 4)], 100000);
    expect(m.trades).toBe(4);
    expect(m.winRate).toBe(0.5);
    expect(m.net).toBe(300);
    expect(m.profitFactor).toBe(2.5);
    expect(m.maxDrawdown).toBe(200);
    expect(m.expectancy).toBe(75);
    expect(m.maxConsecLosses).toBe(2);
    expect(m.charges).toBe(40);
  });
});

describe('eligibility', () => {
  it('rejects an ETF with too little data', () => {
    const e = assessEligibility(flatDay(DAYS[0], 250), 300, NIFTYBEES, NSE_COSTS, 50000);
    expect(e.verdict).toBe('not-eligible');
  });
  it('rejects zero-volume data', () => {
    const data = DAYS.flatMap((d) => flatDay(d, 250, 0));
    expect(assessEligibility(data, 300, NIFTYBEES, NSE_COSTS, 50000).verdict).toBe('not-eligible');
  });
});

describe('paper trading (virtual money only)', () => {
  const sym = 'NIFTYBEES';
  const bars: DayBars = { [sym]: scriptedDay(DAYS[1], { 4: [100, 100.2, 99.8, 100, 10000], 5: [100.4, 100.6, 100.2, 100.5, 10000], 6: [100.5, 102.5, 100.4, 102, 10000] }) };
  const start = () =>
    advance(
      createSession({ day: DAYS[1], exchange: 'NSE', interval: '5m', intervalSec: 300, symbols: [sym], sources: { [sym]: 'test fixture' }, strategy: 'trend', plan: 'test', cash: 100000, risk: { ...DEFAULT_RISK, minRR: 0 }, costs: { ...NSE_COSTS } }),
      bars,
      [NIFTYBEES],
      4, // reveal bars 0..4 (09:35 bar closed)
    );
  it('requires a reason and a stop before entering', () => {
    const s = start();
    const chk = preTradeCheck(s, bars, NIFTYBEES, { symbol: sym, side: 'long', type: 'market', qty: 10, stop: null, reason: '' });
    expect(chk.ok).toBe(false);
    expect(chk.errors.join(' ')).toMatch(/reason/);
    expect(chk.errors.join(' ')).toMatch(/stop-loss is required/);
  });
  it('fills a market order at the next bar open, not the visible close', () => {
    let s = start();
    s = placeOrder(s, bars, NIFTYBEES, { symbol: sym, side: 'long', type: 'market', qty: 50, stop: 99, target: 102.2, reason: 'Test entry after a close above VWAP' });
    expect(s.orders[0].status).toBe('working');
    s = advance(s, bars, [NIFTYBEES], 1);
    expect(s.positions[0].entryRef).toBe(100.4); // bar 5 open
    s = advance(s, bars, [NIFTYBEES], 1);
    expect(s.trades[0].exitReason).toBe('target');
    expect(s.cash).toBeCloseTo(100000 + s.trades[0].net, 6);
  });
  it('rejects orders above the risk budget and logs them', () => {
    let s = start();
    s = placeOrder(s, bars, NIFTYBEES, { symbol: sym, side: 'long', type: 'market', qty: 5000, stop: 99, reason: 'Oversized test order to trigger limits' });
    expect(s.orders[0].status).toBe('rejected');
    expect(s.events.at(-1)!.kind).toBe('reject');
  });
  it('a limit order needs price to trade through the limit', () => {
    let s = start();
    s = placeOrder(s, bars, NIFTYBEES, { symbol: sym, side: 'long', type: 'limit', limit: 100.2, qty: 10, stop: 99, reason: 'Limit test — touch should not fill' });
    s = advance(s, bars, [NIFTYBEES], 1); // bar 5 low 100.2 = limit → touched, not through
    expect(s.positions).toHaveLength(0);
  });
  it('ends with everything squared off', () => {
    let s = start();
    s = placeOrder(s, bars, NIFTYBEES, { symbol: sym, side: 'long', type: 'market', qty: 10, stop: 90, reason: 'Hold to the end of the session test' });
    s = endSession(advance(s, bars, [NIFTYBEES], 1), bars);
    expect(s.positions).toHaveLength(0);
    expect(s.status).toBe('ended');
  });
  it('has no network or broker code path', () => {
    const sources = import.meta.glob(['../paper.ts', '../backtest.ts', '../risk.ts', '../costs.ts', '../metrics.ts'], { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
    expect(Object.keys(sources)).toHaveLength(5);
    for (const src of Object.values(sources)) {
      expect(src).not.toMatch(/\bfetch\(|XMLHttpRequest|WebSocket|axios/);
    }
  });
});
