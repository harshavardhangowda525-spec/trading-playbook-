// The ETF universe for the ETF day-trading module. Static reference data only:
// names, categories and how charges apply. No prices, volumes or liquidity
// figures live here — those are measured from real data (see eligibility.ts).

export type Exchange = 'NSE' | 'US';
export type EtfCategory = 'Broad market' | 'Mid & small cap' | 'Sector' | 'Gold' | 'Silver' | 'International' | 'Thematic';

export interface EtfDef {
  symbol: string;
  name: string;
  exchange: Exchange;
  category: EtfCategory;
  /** What the fund tracks. */
  benchmark: string;
  /** Whether securities transaction tax applies on an intraday sell (equity-oriented ETFs in India). */
  stt: boolean;
  /** TradingView symbol for the view-only Markets chart. */
  tv: string;
  note?: string;
}

export const ETFS: EtfDef[] = [
  // ── India (NSE) — default market ──
  { symbol: 'NIFTYBEES', name: 'Nippon India ETF Nifty 50 BeES', exchange: 'NSE', category: 'Broad market', benchmark: 'Nifty 50', stt: true, tv: 'NSE:NIFTYBEES' },
  { symbol: 'JUNIORBEES', name: 'Nippon India ETF Nifty Next 50 Junior BeES', exchange: 'NSE', category: 'Broad market', benchmark: 'Nifty Next 50', stt: true, tv: 'NSE:JUNIORBEES' },
  { symbol: 'BANKBEES', name: 'Nippon India ETF Nifty Bank BeES', exchange: 'NSE', category: 'Sector', benchmark: 'Nifty Bank', stt: true, tv: 'NSE:BANKBEES' },
  { symbol: 'ITBEES', name: 'Nippon India ETF Nifty IT', exchange: 'NSE', category: 'Sector', benchmark: 'Nifty IT', stt: true, tv: 'NSE:ITBEES' },
  { symbol: 'PSUBNKBEES', name: 'Nippon India ETF Nifty PSU Bank BeES', exchange: 'NSE', category: 'Sector', benchmark: 'Nifty PSU Bank', stt: true, tv: 'NSE:PSUBNKBEES' },
  { symbol: 'CPSEETF', name: 'CPSE ETF', exchange: 'NSE', category: 'Thematic', benchmark: 'Nifty CPSE', stt: true, tv: 'NSE:CPSEETF' },
  { symbol: 'MID150BEES', name: 'Nippon India ETF Nifty Midcap 150', exchange: 'NSE', category: 'Mid & small cap', benchmark: 'Nifty Midcap 150', stt: true, tv: 'NSE:MID150BEES' },
  { symbol: 'GOLDBEES', name: 'Nippon India ETF Gold BeES', exchange: 'NSE', category: 'Gold', benchmark: 'Domestic gold price', stt: false, tv: 'NSE:GOLDBEES', note: 'No STT on gold ETFs.' },
  { symbol: 'SILVERBEES', name: 'Nippon India Silver ETF', exchange: 'NSE', category: 'Silver', benchmark: 'Domestic silver price', stt: false, tv: 'NSE:SILVERBEES', note: 'No STT on silver ETFs.' },
  { symbol: 'MON100', name: 'Motilal Oswal Nasdaq 100 ETF', exchange: 'NSE', category: 'International', benchmark: 'Nasdaq-100 (in ₹)', stt: false, tv: 'NSE:MON100', note: 'Not equity-oriented for Indian tax; trades during NSE hours while its index is closed, so premium/discount to iNAV can be large.' },
  // ── United States — optional, data via CSV import ──
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', exchange: 'US', category: 'Broad market', benchmark: 'S&P 500', stt: false, tv: 'AMEX:SPY' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', exchange: 'US', category: 'Broad market', benchmark: 'Nasdaq-100', stt: false, tv: 'NASDAQ:QQQ' },
  { symbol: 'IWM', name: 'iShares Russell 2000 ETF', exchange: 'US', category: 'Mid & small cap', benchmark: 'Russell 2000', stt: false, tv: 'AMEX:IWM' },
  { symbol: 'XLF', name: 'Financial Select Sector SPDR', exchange: 'US', category: 'Sector', benchmark: 'S&P Financials', stt: false, tv: 'AMEX:XLF' },
  { symbol: 'GLD', name: 'SPDR Gold Shares', exchange: 'US', category: 'Gold', benchmark: 'Gold bullion', stt: false, tv: 'AMEX:GLD' },
];

export const etfBySymbol = (s: string): EtfDef | undefined => ETFS.find((e) => e.symbol === s.trim().toUpperCase());

/** Currency symbol for an exchange. */
export const ccy = (x: Exchange) => (x === 'NSE' ? '₹' : '$');

export function fmtMoney(v: number | null | undefined, x: Exchange = 'NSE', digits = 2): string {
  if (v == null || !Number.isFinite(v)) return '—';
  const sign = v < 0 ? '−' : '';
  const abs = Math.abs(v).toLocaleString(x === 'NSE' ? 'en-IN' : 'en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  return `${sign}${ccy(x)}${abs}`;
}
