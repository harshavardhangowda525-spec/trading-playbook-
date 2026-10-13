// Transaction-cost model. Every rate is an editable assumption, never a quote:
// defaults follow published Indian discount-broker rates (Oct 2026) and must
// be checked against your own broker's contract note.

import type { Exchange } from './universe';

export interface CostModel {
  exchange: Exchange;
  /** Brokerage per executed order: pct of order value, capped at `brokerageCap`. */
  brokeragePct: number;
  brokerageCap: number;
  /** Securities transaction tax on intraday sells (equity-oriented ETFs only). */
  sttSellPct: number;
  /** Exchange transaction charge, both sides. */
  exchangePct: number;
  /** SEBI turnover fee per crore (1e7) of turnover. */
  sebiPerCrore: number;
  /** Stamp duty on intraday buys. */
  stampBuyPct: number;
  /** GST on brokerage + exchange + SEBI fees. */
  gstPct: number;
  /** Assumed bid-ask spread in basis points; half is paid on each fill. */
  spreadBps: number;
  /** Assumed extra slippage per fill in basis points (market & stop orders). */
  slippageBps: number;
}

export const NSE_COSTS: CostModel = {
  exchange: 'NSE',
  brokeragePct: 0.03,
  brokerageCap: 20,
  sttSellPct: 0.025,
  exchangePct: 0.00297,
  sebiPerCrore: 10,
  stampBuyPct: 0.003,
  gstPct: 18,
  spreadBps: 5,
  slippageBps: 2,
};

export const US_COSTS: CostModel = {
  exchange: 'US',
  brokeragePct: 0,
  brokerageCap: 0,
  sttSellPct: 0,
  exchangePct: 0,
  sebiPerCrore: 0,
  stampBuyPct: 0,
  gstPct: 0,
  spreadBps: 1,
  slippageBps: 1,
};

export const defaultCosts = (x: Exchange): CostModel => ({ ...(x === 'NSE' ? NSE_COSTS : US_COSTS) });

export interface Charges {
  brokerage: number;
  stt: number;
  exchange: number;
  sebi: number;
  stamp: number;
  gst: number;
  total: number;
}

const r2 = (x: number) => Math.round(x * 100) / 100;

/** Statutory and broker charges for one fill (spread & slippage are in the fill price). */
export function fillCharges(side: 'buy' | 'sell', price: number, qty: number, m: CostModel, sttApplies: boolean): Charges {
  const value = price * qty;
  const brokerage = m.brokerageCap > 0 ? Math.min((value * m.brokeragePct) / 100, m.brokerageCap) : (value * m.brokeragePct) / 100;
  const stt = side === 'sell' && sttApplies ? (value * m.sttSellPct) / 100 : 0;
  const exchange = (value * m.exchangePct) / 100;
  const sebi = (value * m.sebiPerCrore) / 1e7;
  const stamp = side === 'buy' ? (value * m.stampBuyPct) / 100 : 0;
  const gst = ((brokerage + exchange + sebi) * m.gstPct) / 100;
  const total = brokerage + stt + exchange + sebi + stamp + gst;
  return { brokerage: r2(brokerage), stt: r2(stt), exchange: r2(exchange), sebi: r2(sebi), stamp: r2(stamp), gst: r2(gst), total: r2(total) };
}

/**
 * Price actually paid/received for a fill. Buys pay half the spread plus
 * slippage above the reference price; sells receive that much below.
 * Limit orders fill at their limit (no slippage), so pass `slip = false`.
 */
export function fillPrice(side: 'buy' | 'sell', ref: number, m: CostModel, slip = true): number {
  const bps = m.spreadBps / 2 + (slip ? m.slippageBps : 0);
  return side === 'buy' ? ref * (1 + bps / 1e4) : ref * (1 - bps / 1e4);
}

/** Estimated round-trip cost (charges + spread + slippage) as a % of price. */
export function roundTripPct(price: number, qty: number, m: CostModel, sttApplies: boolean): number {
  if (price <= 0 || qty <= 0) return 0;
  const buy = fillPrice('buy', price, m);
  const sell = fillPrice('sell', price, m);
  const charges = fillCharges('buy', buy, qty, m, sttApplies).total + fillCharges('sell', sell, qty, m, sttApplies).total;
  return (((buy - sell) * qty + charges) / (price * qty)) * 100;
}
