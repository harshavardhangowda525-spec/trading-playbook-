// Educational reports after a backtest or paper session. Every section is
// tagged: MEASURED facts come straight from the simulation; SUGGESTIONS are
// rule-based educational prompts, not predictions.

import type { BacktestConfig, BacktestResult } from './backtest';
import type { CostModel } from './costs';
import { computeMetrics, MIN_TRADES, type Metrics } from './metrics';
import type { PaperSession } from './paper';
import { strategyById, type Regime } from './strategies';
import { etfBySymbol, fmtMoney, type Exchange } from './universe';

export interface Report {
  title: string;
  subtitle: string;
  measured: { label: string; value: string }[];
  conditions: string[];
  rules: string[];
  risk: string[];
  mistakes: string[];
  assumptions: string[];
  next: string[];
  disclaimer: string;
}

const pct = (x: number | null, d = 1) => (x == null ? '—' : `${(x * 100).toFixed(d)}%`);
const num = (x: number | null, d = 2) => (x == null || !Number.isFinite(x) ? '—' : x.toFixed(d));

export const DISCLAIMER =
  'Simulated, educational results on historical data with assumed costs. Past performance does not predict future results. Not financial advice; no real orders were placed.';

export function metricRows(m: Metrics, x: Exchange): { label: string; value: string }[] {
  return [
    { label: 'Simulated trades', value: String(m.trades) },
    { label: 'Wins / losses', value: `${m.wins} / ${m.losses}` },
    { label: 'Win rate', value: pct(m.winRate) },
    { label: 'Gross P&L', value: fmtMoney(m.gross, x) },
    { label: 'Net P&L (after charges)', value: fmtMoney(m.net, x) },
    { label: 'Charges (brokerage, taxes, fees)', value: fmtMoney(m.charges, x) },
    { label: 'Spread & slippage paid', value: fmtMoney(m.friction, x) },
    { label: 'Profit factor', value: m.profitFactor == null ? (m.trades ? 'no losing trades' : '—') : num(m.profitFactor) },
    { label: 'Max drawdown', value: `${fmtMoney(m.maxDrawdown, x)} (${m.maxDrawdownPct.toFixed(2)}%)` },
    { label: 'Average win / loss', value: `${fmtMoney(m.avgWin, x)} / ${fmtMoney(m.avgLoss, x)}` },
    { label: 'Expectancy per trade', value: fmtMoney(m.expectancy, x) },
    { label: 'Average planned R:R', value: num(m.avgPlannedRR) },
    { label: 'Average result (R)', value: num(m.avgR) },
    { label: 'Longest losing streak', value: String(m.maxConsecLosses) },
  ];
}

export function costAssumptions(c: CostModel, stt: boolean): string[] {
  if (c.exchange === 'US')
    return [`Commission ${c.brokeragePct}% per order`, `Spread ${c.spreadBps} bps (half paid per fill)`, `Slippage ${c.slippageBps} bps per market/stop fill`];
  return [
    `Brokerage ${c.brokeragePct}% per order, capped at ₹${c.brokerageCap}`,
    stt ? `STT ${c.sttSellPct}% on sells` : 'No STT (not an equity-oriented ETF)',
    `Exchange charge ${c.exchangePct}% · SEBI ₹${c.sebiPerCrore}/crore · stamp ${c.stampBuyPct}% on buys · GST ${c.gstPct}% on fees`,
    `Spread ${c.spreadBps} bps (assumed; half paid per fill) · slippage ${c.slippageBps} bps per market/stop fill`,
    'All rates are editable assumptions — check them against your broker’s contract note.',
  ];
}

function describeRegimes(r: Record<Regime, number>): string {
  return (Object.entries(r) as [Regime, number][])
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k} ${Math.round(v * 100)}%`)
    .join(' · ');
}

function suggestions(m: Metrics, extra: { costsShare?: number; rejects?: number; violations?: number; overfit?: boolean }): string[] {
  const s: string[] = [];
  if (m.trades < MIN_TRADES) s.push(`Collect more trades before judging: test more sessions or another ETF until you have at least ${MIN_TRADES}.`);
  if (extra.overfit) s.push('Re-test with the default parameters on a fresh date range instead of tuning further — the out-of-sample results disagreed with training.');
  if (extra.costsShare != null && extra.costsShare > 0.4) s.push('Costs are eating a large share of the moves: practise with fewer, higher-quality setups or a higher timeframe.');
  if (m.winRate != null && m.avgWin != null && m.avgLoss != null && m.winRate < 0.4 && Math.abs(m.avgWin) < Math.abs(m.avgLoss) * 1.5)
    s.push('Wins are too small for this win rate. Review exits: are targets realistic, and are trades cut before reaching them?');
  if (m.maxConsecLosses >= 4) s.push(`You met a ${m.maxConsecLosses}-trade losing streak. Rehearse your post-loss routine and the daily loss limit in Paper Trading.`);
  if (extra.violations) s.push('Review the rule violations below and write one if-then rule to prevent each.');
  if (extra.rejects) s.push('Several orders were rejected by risk limits — plan size and stop before the session so the ticket passes first time.');
  if (!s.length) s.push('Repeat the same test on another ETF and date range. One good sample proves nothing; consistency across samples matters.');
  return s;
}

export function backtestReport(cfg: BacktestConfig, r: BacktestResult): Report {
  const st = strategyById(cfg.strategy);
  const m = r.metrics.all;
  const overfit = r.metrics.train.net > 0 && r.metrics.test.trades > 0 && r.metrics.test.net <= 0;
  const missedByReason = new Map<string, number>();
  for (const x of r.missed) missedByReason.set(x.reason, (missedByReason.get(x.reason) ?? 0) + 1);
  const exitCounts = new Map<string, number>();
  for (const t of r.trades) exitCounts.set(t.exitReason, (exitCounts.get(t.exitReason) ?? 0) + 1);
  return {
    title: `${st.letter}. ${st.name} on ${cfg.symbol} · ${cfg.interval}`,
    subtitle: `${r.quality.sessions} sessions${r.splitDay ? ` · out-of-sample from ${r.splitDay}` : ''} · engine ${r.engine} · data ${r.fingerprint}`,
    measured: [
      ...metricRows(m, cfg.exchange),
      { label: 'Training net / trades', value: `${fmtMoney(r.metrics.train.net, cfg.exchange)} / ${r.metrics.train.trades}` },
      { label: 'Out-of-sample net / trades', value: `${fmtMoney(r.metrics.test.net, cfg.exchange)} / ${r.metrics.test.trades}` },
    ],
    conditions: [
      `Measured market regimes over the period: ${describeRegimes(r.regimes) || 'not enough data'}.`,
      `Data: ${r.quality.bars} bars, ${Math.round(r.quality.coverage * 100)}% coverage, ${r.quality.partialDays.length} partial sessions, ${r.quality.noDataWeekdays.length} weekdays without data (holiday or missing).`,
    ],
    rules: [
      `Entries: ${st.entry.join(' ')}`,
      `Exits by type: ${[...exitCounts.entries()].map(([k, v]) => `${k} ${v}`).join(', ') || 'none'}.`,
      'A backtest follows its rules exactly — rule violations only happen in paper trading.',
    ],
    risk: [
      `Risk per trade ${cfg.risk.riskPct}% of ${fmtMoney(cfg.risk.capital, cfg.exchange, 0)} · daily loss limit ${cfg.risk.dailyLossPct}% · max ${cfg.risk.maxTrades} trades/day · min R:R ${cfg.risk.minRR}.`,
      `Daily loss limit reached on ${r.lockedDays.length} day(s).`,
      ...[...missedByReason.entries()].map(([k, v]) => `Skipped signals — ${k}: ${v}`),
    ],
    mistakes: r.warnings,
    assumptions: [
      ...costAssumptions(cfg.costs, cfg.sttApplies),
      'Signals at bar close, fills at the next bar’s open; stop assumed before target in the same bar; gaps through stops fill at the open; square-off before the close.',
      `Estimated round-trip cost ≈ ${r.costPct.toFixed(3)}% of price.`,
    ],
    next: suggestions(m, { costsShare: m.gross > 0 ? m.costs / m.gross : undefined, overfit }),
    disclaimer: DISCLAIMER,
  };
}

export function paperReport(s: PaperSession): Report {
  const m = computeMetrics(s.trades, s.risk.capital);
  const rejects = s.events.filter((e) => e.kind === 'reject').length;
  const violations = s.events.filter((e) => e.kind === 'violation');
  const reviewed = Object.values(s.review);
  const notFollowed = reviewed.filter((r) => !r.followed).length;
  const tags = new Map<string, number>();
  for (const r of reviewed) for (const t of r.mistakes) tags.set(t, (tags.get(t) ?? 0) + 1);
  const dayLoss = -Math.min(0, m.net);
  const limit = (s.risk.capital * s.risk.dailyLossPct) / 100;
  return {
    title: `Paper session · ${s.day}`,
    subtitle: `${s.symbols.join(', ')} · ${s.interval} · ${s.strategy === 'discretionary' ? 'discretionary' : strategyById(s.strategy).name} · HISTORICAL replay, virtual money`,
    measured: metricRows(m, s.exchange),
    conditions: s.plan ? [`Your pre-session plan: “${s.plan}”`] : ['No pre-session plan was written.'],
    rules: [
      `${reviewed.length} of ${s.trades.length} trades self-reviewed; ${notFollowed} marked as not following the rules.`,
      ...violations.map((v) => `Violation: ${v.text}`),
    ],
    risk: [
      `Daily loss used: ${fmtMoney(dayLoss, s.exchange)} of ${fmtMoney(limit, s.exchange)} limit${s.dayLocked ? ' — limit reached, trading locked' : ''}.`,
      `${rejects} order(s) rejected by the risk checks.`,
      `Trades: ${s.trades.length} of max ${s.risk.maxTrades}.`,
    ],
    mistakes: tags.size ? [...tags.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ×${v}`) : ['No mistakes tagged in the self-review.'],
    assumptions: [
      ...costAssumptions(s.costs, s.symbols.some((x) => etfBySymbol(x)?.stt ?? true)),
      'Market orders fill at the next bar’s open; limits only when price trades through; stops before targets in the same bar; square-off before the close.',
      `Data: ${Object.entries(s.sources).map(([k, v]) => `${k} — ${v}`).join('; ')}.`,
    ],
    next: suggestions(m, { rejects, violations: violations.length + notFollowed }),
    disclaimer: DISCLAIMER,
  };
}
