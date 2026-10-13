import type { LessonPlan } from './types';

// Days 22-42: Phase 4 Risk Management, Phase 5 Trend-Following, Phase 6 Breakout (ETF-only).
// Educational and simulation content only — not financial advice.

export const PLAN: LessonPlan[] = [
  {
    day: 22,
    title: "Risk Per Trade & Position Sizing",
    concept: "Before any simulated ETF trade, decide the rupee amount you are willing to lose if the stop is hit. Position size is then calculated from that risk budget and the distance to the stop, not from a feeling about how many units to buy.",
    keyPoints: [
      "Risk budget = account × risk % (e.g. 0.5%)",
      "Units = risk budget ÷ (entry - stop)",
      "Cap position value at available virtual capital",
      "Size is an output of the stop, never a guess"
    ],
    learn: "Learn the position sizing formula",
    practice: "Size five hypothetical NIFTYBEES trades",
    journal: "Log your risk % and why"
  },
  {
    day: 23,
    title: "Stop-Loss Placement",
    concept: "A stop-loss marks the price where your trade idea is proven wrong. On intraday ETF charts that is usually just beyond a swing low, a range edge or a key level, with a small buffer for spread and noise.",
    keyPoints: [
      "Stop goes where the idea is invalidated",
      "Add a buffer beyond the level for spread",
      "Wider stop means fewer units, same ₹ risk",
      "Never move a stop further away mid-trade"
    ],
    learn: "Study structure-based stop placement",
    practice: "Mark stops on ten Replay setups",
    journal: "Note one stop you placed badly"
  },
  {
    day: 24,
    title: "Risk/Reward & Break-even Win Rate After Costs",
    concept: "Risk/reward compares what a trade could make at target with what it loses at the stop. Round-trip costs shrink every win and enlarge every loss, so the win rate you need to break even is always higher than the textbook number.",
    keyPoints: [
      "R = rupees lost if the stop is hit",
      "Gross break-even = 1 ÷ (1 + reward/risk)",
      "Costs make wins smaller and losses bigger",
      "Net break-even = net loss ÷ (net win + net loss)"
    ],
    learn: "Learn break-even win rate after costs",
    practice: "Compute break-even for three R:R ratios",
    journal: "Record your net break-even win rate"
  },
  {
    day: 25,
    title: "Daily Loss Limit & Cooldown",
    concept: "A daily loss limit is the maximum the virtual account may lose in one session before you stop trading. A cooldown is an enforced pause after consecutive losses, so decisions are not made while frustrated.",
    keyPoints: [
      "Set the daily limit as a multiple of R",
      "Stop for the day when the limit is hit",
      "Pause after two consecutive losses",
      "Set limits in Trading → Paper before trading"
    ],
    learn: "Understand daily limits and cooldowns",
    practice: "Configure risk limits in Trading → Paper",
    journal: "Write your daily limit and cooldown rule"
  },
  {
    day: 26,
    title: "Max Trades & No-Trade Rules",
    concept: "Capping the number of trades per day limits cost drag and overtrading. No-trade rules are written conditions under which you stand aside entirely — choppy price, wide spread, thin volume or no setup that matches your rules.",
    keyPoints: [
      "Cap trades per session, e.g. three",
      "Every extra trade adds round-trip costs",
      "Write no-trade conditions before the open",
      "No-Trade is a valid, scored decision"
    ],
    learn: "Learn max-trade and no-trade rules",
    practice: "Lock five No-Trade decisions in Replay",
    journal: "List your personal no-trade conditions"
  },
  {
    day: 27,
    title: "Costs vs Edge: Is the Move Big Enough?",
    concept: "Intraday ETF moves are often small relative to brokerage, STT, exchange charges, stamp duty, GST and spread. Before a setup is worth simulating, the expected move to target should be several times the round-trip cost per unit.",
    keyPoints: [
      "Convert round-trip costs into ₹ per unit",
      "Compare the target move to cost per unit",
      "Aim for a target ≥ 3× cost per unit",
      "Small moves on thin ETFs rarely survive costs"
    ],
    learn: "Learn cost per unit vs target move",
    practice: "Check cost share on five Backtest trades",
    journal: "Note your minimum worthwhile target move"
  },
  {
    day: 28,
    title: "Weekly Review — Risk Management",
    concept: "This week built the risk framework every later strategy uses: rupee risk per trade, structure-based stops, break-even win rate after costs, daily limits, trade caps and the costs-versus-edge check. Review them together as one written risk plan.",
    keyPoints: [
      "Sizing flows from risk budget and stop",
      "Costs raise the break-even win rate",
      "Daily limits and cooldowns cap bad days",
      "No-trade rules protect capital and focus"
    ],
    learn: "Re-read the week's risk lessons",
    practice: "Run one full Trading → Paper session",
    journal: "Write your one-page risk plan",
    review: true
  },
  {
    day: 29,
    title: "Moving Averages as Trend Tools",
    concept: "A moving average smooths price so the direction and slope of the trend are easier to see. The 20-period EMA on a 5-minute ETF chart is a common educational reference for intraday trend direction, alongside VWAP.",
    keyPoints: [
      "EMA weights recent closes more than an SMA",
      "Slope matters more than the line itself",
      "Price above rising 20-EMA suggests uptrend",
      "Moving averages lag — they describe, not predict"
    ],
    learn: "Learn how the 20-EMA is calculated",
    practice: "Mark EMA slope on NIFTYBEES 5m Replay",
    journal: "Note when the EMA flattened"
  },
  {
    day: 30,
    title: "Trend Entry Rules",
    concept: "A trend entry template turns the idea of 'buy strength in an uptrend' into testable rules: price above a rising 20-EMA and above VWAP on 5m, then enter on a close above the prior swing high. It is a template to test, not a system that always works.",
    keyPoints: [
      "Filter: price above rising 20-EMA on 5m",
      "Filter: price above session VWAP",
      "Trigger: close above prior swing high",
      "Fill on the next bar — no look-ahead"
    ],
    learn: "Learn the trend entry template",
    practice: "Find ten trend triggers in Replay",
    journal: "Log which filter failed most often"
  },
  {
    day: 31,
    title: "Trend Exits & Trailing Stops",
    concept: "Exits decide most of a trend strategy's results. The initial stop sits below the last swing low; once the trade moves in your favour, a trailing stop under new higher lows or a close below the 20-EMA locks in part of the move.",
    keyPoints: [
      "Initial stop below the last swing low",
      "Trail under each new higher low",
      "Alternative exit: 5m close below 20-EMA",
      "Flat by session end — no overnight holds"
    ],
    learn: "Study trailing stop methods",
    practice: "Compare two exits in Trading → Backtest",
    journal: "Record which exit you prefer and why"
  },
  {
    day: 32,
    title: "Avoiding Choppy Markets",
    concept: "Trend templates lose money mostly in choppy sessions, where price crosses the EMA and VWAP repeatedly. A flat EMA and a low efficiency ratio are two measurable filters that tell the template to stand aside.",
    keyPoints: [
      "Chop = many crosses of EMA and VWAP",
      "Efficiency ratio = net move ÷ total path",
      "Skip when ER is low or EMA is flat",
      "Filter thresholds must be tested, not assumed"
    ],
    learn: "Learn the efficiency ratio filter",
    practice: "Calculate ER on three Replay sessions",
    journal: "Note how chop felt in real time"
  },
  {
    day: 33,
    title: "Trend Practice in Replay",
    concept: "Replay lets you apply the trend template candle by candle without seeing the future. Locking a Long, Short or No-Trade decision before each reveal trains rule-following, and the process score measures whether you followed the rules, not whether you were lucky.",
    keyPoints: [
      "Write the rules before starting Replay",
      "Lock a decision before the next candle",
      "Score process, not outcome",
      "No-Trade in chop is a correct decision"
    ],
    learn: "Review the trend checklist before Replay",
    practice: "Complete three trend Replay sessions",
    journal: "Log process score and rule breaks"
  },
  {
    day: 34,
    title: "Backtest the Trend Strategy",
    concept: "The backtester applies the trend rules to historical ETF data with next-bar fills and the Indian cost model. Results on a training period must be checked on an out-of-sample period before you believe anything.",
    keyPoints: [
      "Test on 5m with costs switched on",
      "Split training and out-of-sample periods",
      "Read expectancy in R after costs",
      "Small samples prove very little"
    ],
    learn: "Learn to read the backtest report",
    practice: "Run the Trend backtest on NIFTYBEES 5m",
    journal: "Record net expectancy and trade count"
  },
  {
    day: 35,
    title: "Weekly Review — Trend-Following",
    concept: "This week turned trend-following into a testable template: EMA and VWAP filters, swing-high trigger, swing-low stop, trailing exits and a chop filter. Review what Replay and the backtester said after costs, and what is still untested.",
    keyPoints: [
      "Rules: EMA + VWAP filter, swing-high trigger",
      "Exits and chop filter drive results",
      "Replay trains process, backtest measures rules",
      "Judge only out-of-sample, after-cost results"
    ],
    learn: "Re-read the trend module in Trading → Learn",
    practice: "Re-run the Trend backtest on BANKBEES",
    journal: "Write your trend template and its results",
    review: true
  },
  {
    day: 36,
    title: "Levels That Matter for Breakouts",
    concept: "A breakout is a move through a level where price previously stopped. For intraday ETFs, the most objective levels are the prior N-bar high or low, the opening range, and the previous day's high or low.",
    keyPoints: [
      "Use objective levels you can code and test",
      "Prior N-bar high, e.g. last 20 bars on 5m",
      "Opening range high and low",
      "Previous day high and low"
    ],
    learn: "Learn objective breakout levels",
    practice: "Mark levels on five Replay sessions",
    journal: "Note which level types were cleanest"
  },
  {
    day: 37,
    title: "Volume Confirmation",
    concept: "A breakout with little participation is easy to reverse. A common test rule requires the breakout candle's volume to be at least 1.5× the average volume of recent bars, and checks traded value so thin ETFs are filtered out.",
    keyPoints: [
      "Relative volume = bar volume ÷ average volume",
      "Template rule: relative volume ≥ 1.5×",
      "Check traded value and spread, not just units",
      "Volume improves odds; it guarantees nothing"
    ],
    learn: "Learn relative volume calculation",
    practice: "Measure relative volume on ten breakouts",
    journal: "Log breakouts that failed despite volume"
  },
  {
    day: 38,
    title: "False Breakouts",
    concept: "A false breakout happens when price closes beyond a level and then closes back inside the range. Defining it as a rule lets you exit quickly and measure how often it happens on each ETF and timeframe.",
    keyPoints: [
      "False breakout = close back inside the range",
      "Wicks through a level are not closes",
      "Exit rule: close back inside → exit",
      "Count false breakouts in the backtester"
    ],
    learn: "Learn the false breakout definition",
    practice: "Tag false breakouts in Replay",
    journal: "Record false breakout frequency"
  },
  {
    day: 39,
    title: "Breakout Entry, Stop & Target",
    concept: "The breakout template enters on the next bar after a close beyond the level with volume ≥ 1.5× average, places the stop back inside the range, and sets a target as a multiple of R. Position size still comes from the risk budget and stop distance.",
    keyPoints: [
      "Trigger: close beyond level, volume ≥ 1.5×",
      "Entry: next bar open (no look-ahead)",
      "Stop: inside the range, e.g. range midpoint",
      "Target: fixed multiple of R, checked vs costs"
    ],
    learn: "Learn the breakout trade plan",
    practice: "Plan three breakouts in Trading → Paper",
    journal: "Log entry, stop, target and size"
  },
  {
    day: 40,
    title: "Opening-Range Breakouts",
    concept: "The opening range is the high and low of the first few minutes after 09:15 IST, for example the first 15 minutes. An opening-range breakout template trades a close beyond that range, with filters for range width, volume and time of day.",
    keyPoints: [
      "Opening range = high/low of 09:15 to 09:30",
      "Skip ranges too narrow to beat costs",
      "Skip ranges too wide for a sensible stop",
      "Only take signals before a cutoff time"
    ],
    learn: "Learn the opening-range breakout rules",
    practice: "Replay five ORB mornings on JUNIORBEES",
    journal: "Note range width on each morning"
  },
  {
    day: 41,
    title: "Backtest the Breakout Strategy",
    concept: "Run the breakout template in the backtester with and without the volume filter, on training and out-of-sample periods, with costs on. Compare net expectancy, drawdown and trade count rather than win rate alone.",
    keyPoints: [
      "Test with costs and next-bar fills",
      "Compare volume filter on vs off",
      "Check out-of-sample before trusting results",
      "Watch false-breakout share and drawdown"
    ],
    learn: "Review backtest metrics for breakouts",
    practice: "Run the Breakout backtest on NIFTYBEES 5m",
    journal: "Record filter on vs off results"
  },
  {
    day: 42,
    title: "Weekly Review — Breakout",
    concept: "This week built a breakout template: objective levels, volume confirmation, a false-breakout exit, an inside-the-range stop and opening-range variants. Review what the after-cost backtest and your Replay practice actually showed.",
    keyPoints: [
      "Levels must be objective and testable",
      "Volume ≥ 1.5× average is a filter to test",
      "Close back inside = false breakout, exit",
      "Trust only out-of-sample, after-cost results"
    ],
    learn: "Re-read the breakout module in Trading → Learn",
    practice: "Paper-trade one breakout session",
    journal: "Write your breakout template and results",
    review: true
  }
];
