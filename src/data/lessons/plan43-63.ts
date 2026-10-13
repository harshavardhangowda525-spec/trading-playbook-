import type { LessonPlan } from './types';

// Days 43-63: Strategy C (Pullback), Strategy D (Range-Bound), Backtesting Properly.
// Educational and simulated only — not financial advice. ETF-only scope.

export const PLAN: LessonPlan[] = [
  {
    day: 43,
    title: "Trend + Pullback Basics",
    concept: "A pullback is a temporary move against an established intraday trend. The pullback template tries to join a trend that already exists at a better price, instead of chasing it. It is a rule set to test, not a guaranteed pattern.",
    keyPoints: [
      "First the trend must already exist: rising 20-EMA, price above VWAP",
      "A pullback is a pause or dip, not a reversal",
      "Pullbacks offer a nearer stop than chasing extended moves",
      "No clear trend means no pullback setup"
    ],
    learn: "Read the pullback template basics",
    practice: "Mark 3 pullbacks on NIFTYBEES charts",
    journal: "Write the pullback setup in words"
  },
  {
    day: 44,
    title: "Pullbacks to Moving Averages, VWAP & Levels",
    concept: "Pullbacks often pause near areas many participants watch: the 20-EMA, VWAP, or a prior breakout level. These are zones, not exact prices. The template defines which zone counts and how close is close enough.",
    keyPoints: [
      "Three pullback zones: 20-EMA, VWAP, prior level",
      "Treat each as a zone, not an exact tick",
      "Confluence of two zones is a stronger area to watch",
      "Write a measurable 'near the zone' rule"
    ],
    learn: "Study EMA, VWAP and level pullbacks",
    practice: "Tag pullback zones on 5 sessions",
    journal: "Note which zone held most often"
  },
  {
    day: 45,
    title: "Entry Trigger & Invalidation",
    concept: "Being at a pullback zone is not an entry. The template waits for a bullish trigger candle that closes back up, and defines invalidation in advance: a close below the pullback low or the 20-EMA turning down.",
    keyPoints: [
      "Trigger: bullish candle closing back up from the zone",
      "Enter on the next bar, never mid-candle in hindsight",
      "Stop just below the pullback low",
      "Invalidate if the 20-EMA turns down"
    ],
    learn: "Learn the trigger and invalidation rules",
    practice: "Find 3 valid triggers in Replay",
    journal: "Write your exact stop rule"
  },
  {
    day: 46,
    title: "When Pullbacks Fail",
    concept: "Some pullbacks turn into reversals. Deep pullbacks, pullbacks on heavy selling volume, a VWAP loss and late-day timing are common warning signs. Learning to skip or exit quickly is part of the template.",
    keyPoints: [
      "Deep pullbacks often signal trend damage",
      "Close below VWAP or pullback low = setup failed",
      "Late-session pullbacks have little time to work",
      "A small, planned loss is a normal outcome"
    ],
    learn: "Study failed pullback warning signs",
    practice: "Find 2 failed pullbacks in Replay",
    journal: "List your pullback skip conditions"
  },
  {
    day: 47,
    title: "Pullback Practice in Replay",
    concept: "Replay lets you face pullback decisions candle by candle without knowing what comes next. You lock Long or No-Trade before the next bar appears, and the process score judges whether you followed your written rules.",
    keyPoints: [
      "Decide before the next candle is revealed",
      "No-Trade is a valid, often correct decision",
      "Judge process score, not single outcomes",
      "Log every decision with the rule that applied"
    ],
    learn: "Review the full pullback checklist",
    practice: "Replay 3 sessions, lock decisions",
    journal: "Record process scores and rule breaks"
  },
  {
    day: 48,
    title: "Backtest the Pullback Strategy",
    concept: "The Backtest tool runs the pullback template on historical ETF data with next-bar fills and the Indian cost model. Results describe the past for one set of rules; they do not predict the future.",
    keyPoints: [
      "Fix rules before you run the test",
      "Use a training period and an out-of-sample period",
      "Read net P&L after all costs",
      "Under ~30 trades, results are mostly noise"
    ],
    learn: "Write the pullback rules for testing",
    practice: "Backtest pullback on one ETF",
    journal: "Record net metrics and trade count"
  },
  {
    day: 49,
    title: "Weekly Review — Pullback",
    concept: "Recap the pullback template: trend filter, pullback zones, trigger, invalidation, failure signs, Replay practice and the backtest. Decide what to keep, what to clarify, and what to re-test.",
    keyPoints: [
      "Trend first, pullback second, trigger third",
      "Invalidation is defined before entry",
      "Compare Replay decisions with backtest rules",
      "Only change one rule at a time"
    ],
    learn: "Reread week 7 key points",
    practice: "Complete the week 7 quiz",
    journal: "Write pullback v1 summary in Playbook",
    review: true
  },
  {
    day: 50,
    title: "Identifying a Range",
    concept: "A range is a sideways market where price repeatedly turns at roughly the same support and resistance. The template requires at least two touches of each boundary and a flat 20-EMA before calling it a range.",
    keyPoints: [
      "At least 2 touches of support and of resistance",
      "Flat 20-EMA, price crossing VWAP often",
      "Ranges are zones, not exact lines",
      "Measure range width in % and in ₹"
    ],
    learn: "Learn the range identification rules",
    practice: "Mark 3 ranges on ETF charts",
    journal: "Record range width vs typical costs"
  },
  {
    day: 51,
    title: "Trading the Edges of a Range",
    concept: "The range template only considers buying near support or selling near resistance, and only after a rejection candle shows the edge holding. The middle of a range offers poor reward for the risk.",
    keyPoints: [
      "Act only near the edges, never in the middle",
      "Wait for a rejection candle at the edge",
      "Long near support; short only where allowed and simulated",
      "Rejection is a template rule, not a guarantee"
    ],
    learn: "Study edge entries with rejection",
    practice: "Find 3 edge rejections in Replay",
    journal: "Note how many edges failed"
  },
  {
    day: 52,
    title: "When Not to Range-Trade",
    concept: "Range rules break down in strong trends, around news, during the opening minutes, and when the range is too narrow to cover costs. Knowing when to stand aside is a core part of the template.",
    keyPoints: [
      "No range trades in a strong trend",
      "Avoid the open and scheduled news times",
      "Skip ranges too narrow versus costs",
      "Thin ETFs with wide spreads are unsuitable"
    ],
    learn: "Learn the range no-trade filters",
    practice: "Find 3 sessions to skip",
    journal: "Add no-trade rules to Playbook"
  },
  {
    day: 53,
    title: "Range Stops & Targets",
    concept: "Range stops sit just outside the boundary that should hold; targets sit before the opposite boundary or at the range midpoint. A range breaking is the clearest invalidation.",
    keyPoints: [
      "Stop just beyond the edge you traded from",
      "Target near midpoint or before the far edge",
      "Check reward ÷ risk after costs",
      "A close outside the range ends the setup"
    ],
    learn: "Learn range stop and target rules",
    practice: "Plan 3 range trades on paper",
    journal: "Write R:R after costs for each"
  },
  {
    day: 54,
    title: "Range Practice in Replay",
    concept: "Use Replay to apply the range checklist candle by candle: identify the range, wait for an edge rejection, or choose No-Trade. Process score matters more than any single result.",
    keyPoints: [
      "Confirm the range before looking for entries",
      "Lock decisions before the next candle",
      "Prefer No-Trade when filters fail",
      "Review each decision against the checklist"
    ],
    learn: "Review the full range checklist",
    practice: "Replay 3 sessions with range rules",
    journal: "Log process scores and rule breaks"
  },
  {
    day: 55,
    title: "Backtest the Range Strategy",
    concept: "Run the range template in the Backtest tool with fixed rules, realistic costs and a train vs out-of-sample split. Narrow ranges often look fine before costs and poor after them.",
    keyPoints: [
      "Write testable range rules first",
      "Compare gross vs net results",
      "Check how many trades the test produced",
      "Past results do not predict future results"
    ],
    learn: "Convert range rules into test settings",
    practice: "Backtest range on one ETF",
    journal: "Record gross vs net difference"
  },
  {
    day: 56,
    title: "Weekly Review — Range-Bound",
    concept: "Recap the range template: identification, edge entries with rejection, no-trade filters, stops and targets, Replay practice and backtesting. Compare it with the pullback template.",
    keyPoints: [
      "Range = 2+ touches each side, flat EMA",
      "Trade edges only with rejection",
      "Stand aside in trends, news, open, narrow ranges",
      "Costs decide whether a range is tradable"
    ],
    learn: "Reread week 8 key points",
    practice: "Complete the week 8 quiz",
    journal: "Write range v1 summary in Playbook",
    review: true
  },
  {
    day: 57,
    title: "How the Backtester Works (no look-ahead, next-bar fills)",
    concept: "A fair backtest only uses information available at the time. Signals are computed on a bar's close and filled at the next bar's open plus slippage, with conservative rules for stops, gaps and end-of-day square-off.",
    keyPoints: [
      "Signal on bar close, fill at next bar open",
      "Stop and target in same bar: assume stop first",
      "Gaps through a stop fill at the open",
      "All positions squared off at end of day"
    ],
    learn: "Learn the backtester's fill rules",
    practice: "Trace 3 trades bar by bar",
    journal: "Explain look-ahead bias in words"
  },
  {
    day: 58,
    title: "Costs, Spread & Slippage Assumptions",
    concept: "Every simulated intraday ETF trade pays brokerage, STT, exchange charges, SEBI fees, stamp duty, GST, the spread and slippage. Small ETF moves can be wiped out by these costs, so assumptions must be realistic.",
    keyPoints: [
      "List every cost on both sides of a trade",
      "Spread and slippage are hidden but real",
      "Rates change; check app cost settings",
      "Test with pessimistic slippage too"
    ],
    learn: "Study the Indian ETF cost model",
    practice: "Calculate costs for one round trip",
    journal: "Record cost as % of average move"
  },
  {
    day: 59,
    title: "Reading the Metrics (win rate, profit factor, drawdown, expectancy)",
    concept: "A backtest report is a set of numbers that must be read together. Win rate alone misleads; profit factor, drawdown, average win and loss, and expectancy show the shape of the results.",
    keyPoints: [
      "Win rate means little without win/loss size",
      "Profit factor = gross wins ÷ gross losses",
      "Max drawdown shows the worst equity dip",
      "Expectancy = average net result per trade"
    ],
    learn: "Learn the definition of each metric",
    practice: "Read one full backtest report",
    journal: "Calculate expectancy by hand"
  },
  {
    day: 60,
    title: "Training vs Out-of-Sample Results",
    concept: "Split history by date: build and adjust rules on the training period, then run them unchanged on a later out-of-sample period. A large gap between the two usually means the rules were fitted to the past.",
    keyPoints: [
      "Split by date, earlier = training",
      "Never tune rules on out-of-sample data",
      "Compare net metrics side by side",
      "A big drop out-of-sample is a warning"
    ],
    learn: "Learn the train/test split",
    practice: "Run train and out-of-sample tests",
    journal: "Compare the two result sets"
  },
  {
    day: 61,
    title: "Overfitting & Sample Size",
    concept: "Overfitting is tuning rules until they match past noise. Small samples make any result look meaningful. Fewer parameters, more trades and out-of-sample checks reduce, but never remove, this risk.",
    keyPoints: [
      "More tweaks = more risk of fitting noise",
      "Below ~30 trades, treat results as unreliable",
      "Prefer simple rules with few parameters",
      "Past results do not predict future results"
    ],
    learn: "Study overfitting warning signs",
    practice: "Check trade counts on your tests",
    journal: "Log every rule change you made"
  },
  {
    day: 62,
    title: "Comparing Strategies Across ETFs",
    concept: "A template that tests well on one ETF may fail on another with different volatility, liquidity and costs. Compare strategies on the same dates, timeframe and cost settings, using net metrics.",
    keyPoints: [
      "Same dates, timeframe and costs for fair comparison",
      "Liquidity and spread differ by ETF",
      "Gold ETFs behave differently from equity ETFs",
      "Compare net expectancy and drawdown, not just P&L"
    ],
    learn: "Learn fair comparison rules",
    practice: "Test one strategy on 3 ETFs",
    journal: "Fill in a comparison table"
  },
  {
    day: 63,
    title: "Weekly Review — Backtesting",
    concept: "Recap how the backtester works, the cost model, the key metrics, train vs out-of-sample testing, overfitting and fair comparisons. These checks prepare you for paper trading next phase.",
    keyPoints: [
      "No look-ahead: close signal, next-open fill",
      "Net results after every cost",
      "Out-of-sample and sample size checks",
      "Backtests describe the past only"
    ],
    learn: "Reread week 9 key points",
    practice: "Complete the week 9 quiz",
    journal: "Write your backtest checklist",
    review: true
  }
];
