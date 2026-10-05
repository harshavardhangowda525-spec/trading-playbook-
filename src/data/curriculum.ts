// The complete 12-phase, 84-day learning system.
// Educational content only — nothing here is financial advice.

export interface Phase {
  num: number;
  code: string; // "01"
  name: string;
  short: string;
  days: [number, number];
  topics: string[];
  /** Skill this phase builds — feeds the evaluation scores. */
  skill: SkillKey;
  /** Workspace for hands-on work during this phase. */
  workspace?: { label: string; to: string };
}

export type SkillKey =
  | 'knowledge'
  | 'chart'
  | 'risk'
  | 'strategy'
  | 'backtesting'
  | 'simulation'
  | 'psychology'
  | 'discipline';

export interface Lesson {
  day: number;
  phase: number;
  title: string;
  /** Concise teaching text shown in the learning workspace. */
  concept: string;
  keyPoints: string[];
  learn: string;
  practice: string;
  journal: string;
  review?: boolean;
}

export const PHASES: Phase[] = [
  { num: 1, code: '01', name: 'Foundations', short: 'FOUNDATIONS', days: [1, 7], skill: 'knowledge',
    topics: ['What is day trading?', 'Stocks, indices and ETFs', 'Bid/ask/spread', 'Market orders vs limit orders', 'Candlesticks', 'Timeframes', 'Weekly review'] },
  { num: 2, code: '02', name: 'Candlesticks', short: 'CANDLESTICKS', days: [8, 14], skill: 'chart',
    workspace: { label: 'Chart Practice', to: '/chart-practice' },
    topics: ['Open', 'High', 'Low', 'Close', 'Candle body', 'Wicks', 'Bullish candles', 'Bearish candles', 'Momentum candles', 'Rejection candles'] },
  { num: 3, code: '03', name: 'Support & Resistance', short: 'SUPPORT & RESISTANCE', days: [15, 21], skill: 'chart',
    workspace: { label: 'Chart Practice', to: '/chart-practice' },
    topics: ['Support', 'Resistance', 'Breakouts', 'Breakdowns', 'Retests', 'False breakouts'] },
  { num: 4, code: '04', name: 'Market Structure', short: 'MARKET STRUCTURE', days: [22, 28], skill: 'chart',
    workspace: { label: 'Chart Practice', to: '/chart-practice' },
    topics: ['Higher High', 'Higher Low', 'Lower High', 'Lower Low', 'Uptrend', 'Downtrend', 'Range', 'Reversal'] },
  { num: 5, code: '05', name: 'Indicators', short: 'INDICATORS', days: [29, 35], skill: 'knowledge',
    topics: ['Moving averages', 'RSI', 'Volume', 'VWAP', 'Understanding indicator limitations'] },
  { num: 6, code: '06', name: 'Risk Management', short: 'RISK MANAGEMENT', days: [36, 42], skill: 'risk',
    topics: ['Stop-loss', 'Position sizing', 'Risk/reward', 'Maximum daily loss', 'Maximum number of trades', 'Risk per trade'] },
  { num: 7, code: '07', name: 'Strategy Development', short: 'STRATEGY DEVELOPMENT', days: [43, 49], skill: 'strategy',
    workspace: { label: 'Strategy Lab', to: '/strategy-lab' },
    topics: ['Strategy name', 'Market & timeframe', 'Setup', 'Entry conditions & confirmation', 'Stop-loss & target rules', 'Exit rules', 'No-trade conditions'] },
  { num: 8, code: '08', name: 'Backtesting', short: 'BACKTESTING', days: [50, 56], skill: 'backtesting',
    workspace: { label: 'Backtesting Journal', to: '/backtesting' },
    topics: ['Backtesting method', 'Recording trades', 'Win rate', 'Average R:R', 'Best & worst setups'] },
  { num: 9, code: '09', name: 'Simulated Trading', short: 'SIMULATED TRADING', days: [57, 63], skill: 'simulation',
    workspace: { label: 'Simulation Journal', to: '/simulation' },
    topics: ['Paper-trading rules', 'Executing the plan', 'Tracking every simulated trade', 'Reviewing performance'] },
  { num: 10, code: '10', name: 'Trading Psychology', short: 'TRADING PSYCHOLOGY', days: [64, 70], skill: 'psychology',
    workspace: { label: 'Psychology Journal', to: '/psychology' },
    topics: ['FOMO', 'Fear', 'Greed', 'Revenge trading', 'Overtrading', 'Impatience', 'Confidence', 'Discipline'] },
  { num: 11, code: '11', name: 'Playbook Creation', short: 'PLAYBOOK CREATION', days: [71, 77], skill: 'strategy',
    workspace: { label: 'Playbook', to: '/playbook' },
    topics: ['My Market', 'My Strategy', 'Entry Rules', 'Stop-Loss Rules', 'Exit Rules', 'Risk Rules', 'No-Trade Conditions', 'Psychology Rules', 'Best Setups', 'Common Mistakes'] },
  { num: 12, code: '12', name: 'Final Evaluation', short: 'FINAL EVALUATION', days: [78, 84], skill: 'discipline',
    workspace: { label: 'Evaluation', to: '/evaluation' },
    topics: ['Knowledge', 'Technical Analysis', 'Risk Management', 'Strategy', 'Discipline', 'Backtesting', 'Simulated Trading', 'Psychology'] },
];

type L = Omit<Lesson, 'day' | 'phase'>;

const weeklyReview = (phase: string, practice: string): L => ({
  title: `Weekly Review — ${phase}`,
  review: true,
  concept: `Consolidate everything from the ${phase} week. Re-read your journal entries, find the idea you understand least, and rewrite it in your own words. Review days are where knowledge turns into understanding.`,
  keyPoints: ['Re-read this week’s journal entries', 'Identify your weakest concept', 'Rewrite the key ideas from memory', 'Save the best insights to the Knowledge Vault'],
  learn: `Review the full ${phase} week`,
  practice,
  journal: '3 lessons you will carry forward',
});

const LESSONS: L[] = [
  // ── PHASE 01 — FOUNDATIONS ────────────────────────────────────────────
  { title: 'What is Day Trading?',
    concept: 'Day trading means opening and closing positions within the same session, so no position is held overnight. It is a skill of probabilities, risk control and repetition — not prediction. Most beginners lose money; the goal of these 84 days is education, structure and practice, not profit.',
    keyPoints: ['Positions open and close the same day', 'It is a probability game, not prediction', 'Risk control matters more than being right', 'Learning and simulation come before any real money'],
    learn: 'What day trading is (and is not)', practice: 'Write your personal reason for learning to trade', journal: '3 observations about trading you did not know' },
  { title: 'Stocks, Indices & ETFs',
    concept: 'A stock is a share in one company. An index (e.g. S&P 500, NASDAQ-100, NIFTY 50) measures a basket of stocks. An ETF is a fund that trades like a stock and often tracks an index. Indices show the overall market mood that individual stocks usually follow.',
    keyPoints: ['Stock = one company', 'Index = basket that measures a market', 'ETF = tradable fund, often tracks an index', 'The broad market influences most individual charts'],
    learn: 'Stocks, indices and ETFs', practice: 'Open a chart of one index and one ETF and compare them', journal: '3 differences between an index and a single stock' },
  { title: 'Bid, Ask & Spread',
    concept: 'The bid is the highest price buyers will pay; the ask is the lowest price sellers will accept. The gap between them is the spread — a hidden cost on every trade. Liquid instruments have tight spreads; illiquid ones have wide spreads that eat into results.',
    keyPoints: ['Bid = best buyer price', 'Ask = best seller price', 'Spread = ask − bid (a cost)', 'Liquidity tightens spreads'],
    learn: 'Bid / ask / spread', practice: 'Note the spread on 3 instruments with different liquidity', journal: '3 observations about spreads' },
  { title: 'Market Orders vs Limit Orders',
    concept: 'A market order fills immediately at the best available price, but the price is not guaranteed (slippage). A limit order sets the exact price you will accept, but may not fill. Stop orders become active only when a trigger price is reached — the basis of a stop-loss.',
    keyPoints: ['Market order = speed, price not guaranteed', 'Limit order = price control, fill not guaranteed', 'Slippage happens in fast markets', 'Stop orders trigger at a set price'],
    learn: 'Order types', practice: 'Place one market and one limit order in a paper-trading simulator', journal: 'When would you use each order type?' },
  { title: 'Candlesticks — Introduction',
    concept: 'Each candlestick summarises price for one period: where it opened, the highest and lowest prices reached, and where it closed. The body shows open→close; the wicks show the extremes. Candles are the language of the chart.',
    keyPoints: ['One candle = one time period', 'Body = open to close', 'Wicks = high and low extremes', 'Colour shows direction of the period'],
    learn: 'Candlestick structure', practice: 'Identify 20 candles (open, high, low, close)', journal: '3 observations' },
  { title: 'Timeframes',
    concept: 'The same market looks different on 1-minute, 5-minute, 15-minute, 1-hour and daily charts. Higher timeframes show context and key levels; lower timeframes show entries. Choose a primary timeframe and one higher timeframe for context.',
    keyPoints: ['Higher timeframe = context and direction', 'Lower timeframe = entry detail', 'Use one primary + one context timeframe', 'More timeframes ≠ more clarity'],
    learn: 'How timeframes relate', practice: 'Mark the daily trend, then view the same chart on 5-minute', journal: '3 things the higher timeframe revealed' },
  weeklyReview('Foundations', 'Explain day trading, order types and spreads out loud in 2 minutes'),

  // ── PHASE 02 — CANDLESTICKS ───────────────────────────────────────────
  { title: 'Open & Close',
    concept: 'The open is the first traded price of the period; the close is the last. The close is the most important price — it is the final verdict buyers and sellers agreed on. Close above open = bullish period; close below open = bearish period.',
    keyPoints: ['Open = first price of the period', 'Close = final verdict of the period', 'Close vs open defines candle direction', 'Watch where candles close relative to key levels'],
    learn: 'Open and close', practice: 'Mark the open and close on 20 candles', journal: '3 observations about closes near levels' },
  { title: 'High & Low',
    concept: 'The high and low are the extremes reached during the period. They show how far buyers and sellers were able to push price — and where they failed. A series of highs and lows becomes market structure.',
    keyPoints: ['High = furthest buyers pushed', 'Low = furthest sellers pushed', 'Extremes reveal failed attempts', 'Highs and lows build structure'],
    learn: 'High and low', practice: 'Mark the high and low of the last 20 candles', journal: '3 observations' },
  { title: 'Candle Body & Wicks',
    concept: 'A large body means one side controlled the period. Long wicks mean price was pushed away from an extreme — evidence of rejection. Small bodies with wicks on both sides show indecision.',
    keyPoints: ['Big body = control', 'Long wick = rejection of that price', 'Small body = indecision', 'Body-to-wick ratio tells the story'],
    learn: 'Body vs wick anatomy', practice: 'Classify 20 candles: big body / long wick / indecision', journal: '3 observations' },
  { title: 'Bullish Candles',
    concept: 'A bullish candle closes above its open. Strong bullish candles close near their high with small upper wicks. Context matters: a bullish candle at support says more than one in the middle of nowhere.',
    keyPoints: ['Close > open', 'Strong = closes near the high', 'Small upper wick = little selling pressure', 'Location gives it meaning'],
    learn: 'Reading bullish candles', practice: 'Find 10 strong and 10 weak bullish candles', journal: '3 observations' },
  { title: 'Bearish Candles',
    concept: 'A bearish candle closes below its open. Strong bearish candles close near their low with small lower wicks. A bearish candle at resistance is a meaningful signal of seller interest.',
    keyPoints: ['Close < open', 'Strong = closes near the low', 'Small lower wick = little buying pressure', 'Location gives it meaning'],
    learn: 'Reading bearish candles', practice: 'Find 10 strong and 10 weak bearish candles', journal: '3 observations' },
  { title: 'Momentum & Rejection Candles',
    concept: 'Momentum candles have large bodies and small wicks — they show urgency and often start moves. Rejection candles have long wicks at a level (pin bars, hammers, shooting stars) — they show a price was tested and refused.',
    keyPoints: ['Momentum = large body, small wicks', 'Rejection = long wick into a level', 'Momentum shows urgency', 'Rejection shows refusal'],
    learn: 'Momentum vs rejection candles', practice: 'Identify 10 momentum and 10 rejection candles', journal: '3 observations' },
  weeklyReview('Candlesticks', 'Run the Candle Trainer in Chart Practice until you score 80%+'),

  // ── PHASE 03 — SUPPORT & RESISTANCE ───────────────────────────────────
  { title: 'Support',
    concept: 'Support is a price area where buying interest has repeatedly stopped declines. Think of zones, not exact lines. The more clearly price reacted there before, the more traders are watching it.',
    keyPoints: ['Area where declines stalled', 'Draw zones, not razor lines', 'Multiple reactions add significance', 'Recent levels matter most'],
    learn: 'Support zones', practice: 'Draw 3 support zones on a 5-minute and a daily chart', journal: '3 observations' },
  { title: 'Resistance',
    concept: 'Resistance is a price area where selling interest has repeatedly stopped advances. Old support often becomes new resistance after it breaks (role reversal), and vice versa.',
    keyPoints: ['Area where advances stalled', 'Role reversal: broken support → resistance', 'Round numbers often act as levels', 'Prior day high/low are key levels'],
    learn: 'Resistance zones & role reversal', practice: 'Mark prior-day high/low and 2 resistance zones', journal: '3 observations' },
  { title: 'Breakouts',
    concept: 'A breakout happens when price closes decisively above resistance. Quality breakouts show momentum candles, rising volume and follow-through. A wick through a level is not a breakout — the close confirms it.',
    keyPoints: ['Close beyond the level confirms', 'Momentum candle + volume = quality', 'Follow-through matters', 'Wicks alone are not breakouts'],
    learn: 'Breakouts', practice: 'Find 5 breakouts and grade their quality', journal: '3 observations' },
  { title: 'Breakdowns',
    concept: 'A breakdown is a decisive close below support. The same rules apply in reverse: momentum, volume and follow-through confirm; a lone wick does not.',
    keyPoints: ['Close below support confirms', 'Look for bearish momentum', 'Volume adds confirmation', 'Watch for immediate reclaim (failure)'],
    learn: 'Breakdowns', practice: 'Find 5 breakdowns and grade their quality', journal: '3 observations' },
  { title: 'Retests',
    concept: 'After a breakout, price often returns to test the broken level from the other side. A successful retest — the level holds and price moves away — is a common, more patient entry location.',
    keyPoints: ['Price revisits the broken level', 'Old resistance should hold as support', 'Patient entries often come on retests', 'Failed retest = warning sign'],
    learn: 'Retests', practice: 'Find 5 breakout-retest sequences', journal: '3 observations' },
  { title: 'False Breakouts',
    concept: 'A false breakout pushes through a level and then quickly reverses back inside. Many traders get trapped. Recognising failure early — and having a stop — is what protects you.',
    keyPoints: ['Price breaks, then returns inside', 'Traps breakout traders', 'Watch for quick reclaims', 'A stop-loss is non-negotiable'],
    learn: 'False breakouts (traps)', practice: 'Find 5 false breakouts and note what warned you', journal: '3 observations' },
  weeklyReview('Support & Resistance', 'Mark levels on 5 fresh charts before looking at what happened next'),

  // ── PHASE 04 — MARKET STRUCTURE ───────────────────────────────────────
  { title: 'Higher Highs & Higher Lows',
    concept: 'When each swing high exceeds the previous one (HH) and each pullback holds above the previous low (HL), buyers are in control. This sequence defines an uptrend.',
    keyPoints: ['HH = new swing high above the last', 'HL = pullback holds above the last low', 'HH + HL = bullish structure', 'Label swings, not every candle'],
    learn: 'HH and HL', practice: 'Label HH/HL on 3 trending charts', journal: '3 observations' },
  { title: 'Lower Highs & Lower Lows',
    concept: 'When rallies fail below the previous high (LH) and declines break the previous low (LL), sellers are in control. This sequence defines a downtrend.',
    keyPoints: ['LH = rally fails below the last high', 'LL = new swing low below the last', 'LH + LL = bearish structure', 'The first LH is an early warning in uptrends'],
    learn: 'LH and LL', practice: 'Label LH/LL on 3 trending charts', journal: '3 observations' },
  { title: 'Uptrend',
    concept: 'An uptrend is a series of HH and HL. Trend traders look to buy pullbacks to higher lows rather than chase extended moves. The trend is intact until a higher low breaks.',
    keyPoints: ['Series of HH + HL', 'Buy pullbacks, don’t chase', 'Trend holds until an HL breaks', 'Higher timeframe trend gives context'],
    learn: 'Uptrends', practice: 'Find 3 uptrends and mark where the trend would be invalidated', journal: '3 observations' },
  { title: 'Downtrend',
    concept: 'A downtrend is a series of LH and LL. Sellers fade rallies into lower highs. The downtrend is intact until a lower high breaks.',
    keyPoints: ['Series of LH + LL', 'Rallies into LH are sold', 'Trend holds until an LH breaks', 'Don’t fight the dominant direction'],
    learn: 'Downtrends', practice: 'Find 3 downtrends and mark their invalidation points', journal: '3 observations' },
  { title: 'Range',
    concept: 'In a range, price oscillates between support and resistance without making new highs or lows. Trend strategies struggle in ranges; recognising one helps you avoid low-quality trades.',
    keyPoints: ['Price bounded by two levels', 'No new HH or LL', 'Trend setups fail more often', 'Ranges eventually break'],
    learn: 'Ranges', practice: 'Identify 3 ranges and their boundaries', journal: '3 observations' },
  { title: 'Reversal',
    concept: 'A reversal begins when structure changes: an uptrend fails to make a HH, then breaks its last HL (or the opposite in a downtrend). One candle is not a reversal — structure change confirms it.',
    keyPoints: ['Failure to make a new extreme', 'Break of the last HL / LH', 'Structure change confirms', 'Early reversal calls are low probability'],
    learn: 'Reversals & structure change', practice: 'Find 3 reversals and mark the exact structure break', journal: '3 observations' },
  weeklyReview('Market Structure', 'Label structure on 5 charts: trend, range or reversal?'),

  // ── PHASE 05 — INDICATORS ─────────────────────────────────────────────
  { title: 'Moving Averages',
    concept: 'A moving average smooths price over N periods (e.g. 9, 20, 50). It shows trend direction and acts as dynamic support/resistance. Moving averages lag — they describe what already happened.',
    keyPoints: ['Smooths price to show direction', 'Common: 9 / 20 / 50 EMA or SMA', 'Can act as dynamic levels', 'Always lags price'],
    learn: 'Moving averages', practice: 'Add a 20 EMA and note 5 reactions to it', journal: '3 observations' },
  { title: 'RSI',
    concept: 'The Relative Strength Index measures the speed of recent price changes on a 0–100 scale. Above 70 is often called overbought, below 30 oversold — but strong trends can stay "overbought" for a long time.',
    keyPoints: ['Momentum oscillator, 0–100', '70 / 30 are reference zones, not signals', 'Divergence can warn of weakening momentum', 'Strong trends stay extended'],
    learn: 'RSI', practice: 'Find 3 cases where RSI > 70 kept rising', journal: '3 observations' },
  { title: 'Volume',
    concept: 'Volume shows how much was traded. Rising volume on a breakout shows participation; low volume moves are less reliable. Volume confirms — it rarely leads on its own.',
    keyPoints: ['Measures participation', 'Breakouts + volume = conviction', 'Low volume moves are suspect', 'Session open usually has the most volume'],
    learn: 'Volume', practice: 'Compare volume on 5 breakouts that worked vs failed', journal: '3 observations' },
  { title: 'VWAP',
    concept: 'VWAP (Volume-Weighted Average Price) is the average price weighted by volume, reset each session. Many intraday traders use it as a fair-value reference: above VWAP buyers are in control intraday, below it sellers are.',
    keyPoints: ['Average price weighted by volume', 'Resets every session', 'Intraday fair-value reference', 'Price vs VWAP shows intraday control'],
    learn: 'VWAP', practice: 'Watch how price behaves at VWAP on 3 sessions', journal: '3 observations' },
  { title: 'Indicator Limitations',
    concept: 'Indicators are calculations of past price and volume. They lag, they conflict, and stacking many of them creates false confidence. Price, structure and levels come first; an indicator should only confirm.',
    keyPoints: ['All indicators are derived from price', 'They lag and can conflict', 'More indicators ≠ more accuracy', 'Use one, as confirmation only'],
    learn: 'Why indicators fail', practice: 'Find 3 examples where indicators gave a false signal', journal: '3 observations' },
  { title: 'Context + One Indicator',
    concept: 'Combine structure, levels and one indicator into a simple read: trend direction (structure), location (level), confirmation (indicator). This three-step read is the foundation of a strategy.',
    keyPoints: ['Structure → direction', 'Levels → location', 'Indicator → confirmation', 'Simple beats complex'],
    learn: 'Building a 3-step chart read', practice: 'Apply the 3-step read to 5 charts', journal: '3 observations' },
  weeklyReview('Indicators', 'Choose the ONE indicator you will use and explain why'),

  // ── PHASE 06 — RISK MANAGEMENT ────────────────────────────────────────
  { title: 'Stop-Loss',
    concept: 'A stop-loss is the price where your trade idea is proven wrong and you exit. It belongs at a logical invalidation point (beyond a level or swing), not at a random distance. Every trade needs one, decided before entry.',
    keyPoints: ['Exit point where the idea is wrong', 'Place at logical invalidation', 'Decided before entry', 'Never widen a stop mid-trade'],
    learn: 'Stop-loss placement', practice: 'Mark logical stops on 10 historical setups', journal: '3 observations' },
  { title: 'Position Sizing',
    concept: 'Position size = account risk ÷ distance to stop. If you risk 1% of a 10,000 simulated account (100) and your stop is 0.50 away, size is 200 units. Size is calculated, never guessed.',
    keyPoints: ['Size = risk amount ÷ stop distance', 'Wider stop → smaller size', 'Risk stays constant per trade', 'Calculate before every trade'],
    learn: 'Position sizing formula', practice: 'Calculate size for 10 hypothetical trades', journal: '3 observations' },
  { title: 'Risk / Reward',
    concept: 'Risk/reward compares potential loss (entry→stop) to potential gain (entry→target). At 1:2, you can be right only 34% of the time and still break even before costs. R:R and win rate must be considered together.',
    keyPoints: ['R = distance to stop', 'Target in multiples of R', 'Higher R:R needs lower win rate', 'Targets must be realistic (levels)'],
    learn: 'Risk/reward & expectancy', practice: 'Compute R:R for 10 historical setups', journal: '3 observations' },
  { title: 'Maximum Daily Loss',
    concept: 'A maximum daily loss is a hard limit (e.g. 2–3R) after which you stop for the day. It protects you from emotional spirals and keeps one bad day from becoming a disaster.',
    keyPoints: ['Hard stop for the whole day', 'Usually 2–3R', 'Protects against tilt', 'Non-negotiable once hit'],
    learn: 'Daily loss limits', practice: 'Write your max daily loss rule', journal: '3 observations' },
  { title: 'Maximum Number of Trades',
    concept: 'Capping trades per day (e.g. 3) forces selectivity. Overtrading is one of the most common beginner mistakes — fewer, higher-quality trades usually beat many average ones.',
    keyPoints: ['A daily trade cap forces quality', 'Overtrading erodes edge', 'Stop after the cap, win or lose', 'Quality over quantity'],
    learn: 'Trade limits', practice: 'Write your max-trades rule', journal: '3 observations' },
  { title: 'Risk Per Trade',
    concept: 'Risking a small, fixed fraction (commonly 0.5–1%) per trade means a losing streak cannot destroy an account. Ten losses at 1% is a setback; ten losses at 10% is ruin.',
    keyPoints: ['Small, fixed % per trade', 'Survive losing streaks', 'Consistency over excitement', 'Risk is chosen before reward'],
    learn: 'Risk per trade', practice: 'Simulate a 10-trade losing streak at 1% and at 5%', journal: '3 observations' },
  weeklyReview('Risk Management', 'Write your complete risk rules into the Playbook'),

  // ── PHASE 07 — STRATEGY DEVELOPMENT ───────────────────────────────────
  { title: 'Name Your Strategy & Market',
    concept: 'A strategy starts with a focus: one market, one session, one primary timeframe. Give it a name — it becomes a system you can test, not a feeling.',
    keyPoints: ['One market', 'One session', 'One primary timeframe', 'A name makes it a system'],
    learn: 'Choosing focus', practice: 'Create your strategy draft in the Strategy Lab', journal: 'Why this market and timeframe?' },
  { title: 'Define the Setup',
    concept: 'The setup is the market condition you are waiting for: e.g. "uptrend on 15-min, pullback to prior resistance turned support". It must be specific enough that two people would agree it is present.',
    keyPoints: ['Describes the condition you wait for', 'Specific and observable', 'Includes structure and location', 'No setup = no trade'],
    learn: 'Setup definition', practice: 'Write the setup in the Strategy Lab', journal: '3 examples of your setup' },
  { title: 'Entry & Confirmation',
    concept: 'Confirmation is the evidence the setup is working (e.g. bullish rejection candle at the level). The entry trigger is the exact event that gets you in (e.g. break of that candle’s high).',
    keyPoints: ['Confirmation = evidence', 'Trigger = exact entry event', 'Objective and repeatable', 'No confirmation = no entry'],
    learn: 'Entry rules', practice: 'Write your confirmation + entry trigger', journal: '3 observations' },
  { title: 'Stop-Loss & Target Rules',
    concept: 'Define exactly where the stop goes (e.g. below the rejection wick) and where targets go (e.g. next resistance, or 2R). Rules remove in-the-moment decisions.',
    keyPoints: ['Stop at invalidation', 'Target at a level or R multiple', 'Minimum R:R rule', 'Written before trading'],
    learn: 'Stop & target rules', practice: 'Write stop + target rules in the Strategy Lab', journal: '3 observations' },
  { title: 'Exit Rules',
    concept: 'Exit rules cover everything besides stop and target: time-based exits, trailing stops, partial profits, and exits when the setup is invalidated early.',
    keyPoints: ['Time exits', 'Trailing / partial rules', 'Early invalidation exits', 'Know exits before entry'],
    learn: 'Exit management', practice: 'Write your exit rules', journal: '3 observations' },
  { title: 'No-Trade Conditions',
    concept: 'Knowing when NOT to trade is a strategy rule: major news releases, choppy ranges, after max daily loss, when tired or emotional. Write them down.',
    keyPoints: ['News & low-liquidity times', 'Choppy conditions', 'After hitting limits', 'When not mentally ready'],
    learn: 'No-trade filters', practice: 'Write at least 5 no-trade conditions', journal: '3 observations' },
  weeklyReview('Strategy Development', 'Read your strategy start-to-finish and remove anything vague'),

  // ── PHASE 08 — BACKTESTING ────────────────────────────────────────────
  { title: 'How to Backtest',
    concept: 'Backtesting means scrolling historical charts and recording every instance of your setup — wins and losses — without skipping any. Honesty is the whole point: a backtest that hides losses is useless.',
    keyPoints: ['Scroll forward bar-by-bar', 'Record every valid setup', 'Never skip losers', 'Follow the rules exactly'],
    learn: 'Backtesting method', practice: 'Record your first 5 backtest trades', journal: '3 observations' },
  { title: 'Backtest Session 1',
    concept: 'Run your strategy on historical data and log each trade in the Backtesting Journal with entry, stop, target and result.',
    keyPoints: ['Record trade details', 'Note the setup quality', 'Add a screenshot', 'Log mistakes honestly'],
    learn: 'Applying rules consistently', practice: 'Backtest 10 trades', journal: '3 observations' },
  { title: 'Backtest Session 2',
    concept: 'Continue building your sample. Small samples lie — 30+ trades start to show a picture; 100+ is better.',
    keyPoints: ['Sample size matters', 'Keep rules unchanged', 'Track R:R', 'Note conditions'],
    learn: 'Sample size', practice: 'Backtest 10 trades', journal: '3 observations' },
  { title: 'Backtest Session 3',
    concept: 'Look at your running statistics: win rate, average R:R, net R. Do not change rules mid-test — note ideas for later.',
    keyPoints: ['Review running stats', 'Don’t change rules mid-test', 'Write improvement ideas', 'Stay objective'],
    learn: 'Reading statistics', practice: 'Backtest 10 trades', journal: '3 observations' },
  { title: 'Backtest Session 4',
    concept: 'Compare setup variations. Which locations or conditions produce the best results? Which are worst?',
    keyPoints: ['Compare setups', 'Find best conditions', 'Find worst conditions', 'Evidence over opinion'],
    learn: 'Setup comparison', practice: 'Backtest 10 trades', journal: '3 observations' },
  { title: 'Backtest Session 5',
    concept: 'Complete your sample and look for the most common mistakes you made while applying the rules.',
    keyPoints: ['Complete the sample', 'Review mistakes', 'Note rule ambiguity', 'Prepare refinements'],
    learn: 'Mistake patterns', practice: 'Backtest 10 trades', journal: '3 observations' },
  weeklyReview('Backtesting', 'Write a backtest summary: win rate, avg R:R, best & worst setup'),

  // ── PHASE 09 — SIMULATED TRADING ──────────────────────────────────────
  { title: 'Paper-Trading Rules',
    concept: 'Simulated (paper) trading applies your strategy in live market conditions with no real money. Treat it seriously: same rules, same limits, same journal. This is practice, not a signal to trade real money.',
    keyPoints: ['No real money', 'Same rules as a real plan', 'Same risk limits', 'Journal every simulated trade'],
    learn: 'Simulation discipline', practice: 'Set up your paper-trading account and rules', journal: '3 observations' },
  { title: 'Simulation Session 1', concept: 'Execute your plan in the simulator. Record each simulated trade in the Simulation Journal.', keyPoints: ['Follow the plan', 'Respect max trades', 'Record every trade', 'Note emotions'], learn: 'Execution', practice: 'Paper trade your setup', journal: '3 observations' },
  { title: 'Simulation Session 2', concept: 'Focus on waiting for A-quality setups only. Skipping a mediocre setup is a win for discipline.', keyPoints: ['A-setups only', 'Patience', 'Record skipped setups', 'Note emotions'], learn: 'Selectivity', practice: 'Paper trade your setup', journal: '3 observations' },
  { title: 'Simulation Session 3', concept: 'Focus on trade management: honour stops and targets exactly as written.', keyPoints: ['Honour stops', 'Honour targets', 'No moving stops', 'Note emotions'], learn: 'Management', practice: 'Paper trade your setup', journal: '3 observations' },
  { title: 'Simulation Session 4', concept: 'Compare simulation results to your backtest. Differences usually come from execution and psychology.', keyPoints: ['Compare to backtest', 'Find execution gaps', 'Identify emotional errors', 'Note emotions'], learn: 'Backtest vs simulation', practice: 'Paper trade your setup', journal: '3 observations' },
  { title: 'Simulation Session 5', concept: 'Final simulation session of the phase. Trade only your plan and finish with a full review.', keyPoints: ['Plan only', 'Respect limits', 'Full review', 'Note emotions'], learn: 'Consistency', practice: 'Paper trade your setup', journal: '3 observations' },
  weeklyReview('Simulated Trading', 'Write a simulation summary and compare it to your backtest'),

  // ── PHASE 10 — TRADING PSYCHOLOGY ─────────────────────────────────────
  { title: 'FOMO', concept: 'Fear Of Missing Out pushes you into trades after the move has started, without a setup. The cure is a written plan and accepting that there is always another trade.', keyPoints: ['Chasing extended moves', 'Entering without a setup', 'There is always another trade', 'Plan before price moves'], learn: 'Recognising FOMO', practice: 'Log FOMO in the Psychology Journal', journal: 'When did you feel FOMO today?' },
  { title: 'Fear & Greed', concept: 'Fear makes you skip valid setups or exit too early; greed makes you hold past targets or size up. Both are reduced by fixed rules and fixed risk.', keyPoints: ['Fear → hesitation, early exits', 'Greed → oversizing, no exits', 'Fixed risk calms both', 'Rules decide, not feelings'], learn: 'Fear & greed', practice: 'Rate fear and greed in the Psychology Journal', journal: '3 observations' },
  { title: 'Revenge Trading', concept: 'Revenge trading is trying to "win back" a loss immediately, usually with bigger size and worse setups. A max daily loss and a mandatory pause after a loss stop the spiral.', keyPoints: ['Triggered by losses', 'Bigger size, worse setups', 'Pause after a loss', 'Max daily loss protects you'], learn: 'Revenge trading', practice: 'Write your post-loss routine', journal: '3 observations' },
  { title: 'Overtrading & Impatience', concept: 'Overtrading comes from boredom and impatience. Your edge exists only in your setup — every other trade is noise. Waiting is a skill.', keyPoints: ['Boredom → bad trades', 'Edge lives only in the setup', 'Waiting is a skill', 'Respect your trade cap'], learn: 'Patience', practice: 'Count setups you correctly skipped', journal: '3 observations' },
  { title: 'Confidence', concept: 'Real confidence comes from evidence — your backtest and simulation data — not from recent wins. Over-confidence after a streak is as dangerous as fear after a loss.', keyPoints: ['Evidence-based confidence', 'Streaks distort feelings', 'Trust the sample', 'Stay humble after wins'], learn: 'Confidence', practice: 'Rate your confidence and justify it with data', journal: '3 observations' },
  { title: 'Discipline', concept: 'Discipline is doing what your plan says, especially when you do not feel like it. Measure it: what percentage of your trades followed every rule?', keyPoints: ['Follow the plan every time', 'Measure rule adherence', 'Process over outcome', 'Discipline compounds'], learn: 'Discipline', practice: 'Score your rule adherence for the week', journal: '3 observations' },
  weeklyReview('Trading Psychology', 'Write your psychology rules into the Playbook'),

  // ── PHASE 11 — PLAYBOOK CREATION ──────────────────────────────────────
  { title: 'My Market & My Strategy', concept: 'Your playbook is the single document you read before every session. Start with what you trade and the strategy you use.', keyPoints: ['Market, session, timeframe', 'Strategy summary', 'Clear and short', 'Readable in 2 minutes'], learn: 'Playbook structure', practice: 'Write sections 1–2 of the Playbook', journal: '3 observations' },
  { title: 'Entry Rules', concept: 'Write the exact conditions that must ALL be true before you enter.', keyPoints: ['Checklist format', 'Objective conditions', 'All must be true', 'No exceptions'], learn: 'Entry checklist', practice: 'Write section 3', journal: '3 observations' },
  { title: 'Stop-Loss & Exit Rules', concept: 'Write where the stop goes and every way a trade can be exited.', keyPoints: ['Stop placement', 'Target rules', 'Time exits', 'Early invalidation'], learn: 'Exit rules', practice: 'Write sections 4–5', journal: '3 observations' },
  { title: 'Risk Rules', concept: 'Risk per trade, max daily loss, max trades, R:R minimum.', keyPoints: ['% per trade', 'Max daily loss', 'Max trades', 'Minimum R:R'], learn: 'Risk rules', practice: 'Write section 6', journal: '3 observations' },
  { title: 'No-Trade & Psychology Rules', concept: 'When you will not trade, and the mental rules you commit to.', keyPoints: ['No-trade list', 'Pre-session state check', 'Post-loss routine', 'Walk-away rules'], learn: 'Protective rules', practice: 'Write sections 7–8', journal: '3 observations' },
  { title: 'Best Setups & Common Mistakes', concept: 'Use your backtest and Mistake Lab data to document your best setups and your most common mistakes.', keyPoints: ['Best setups from data', 'Most common mistakes', 'Screenshot examples', 'Prevention plan'], learn: 'Data-driven playbook', practice: 'Write sections 9–10', journal: '3 observations' },
  weeklyReview('Playbook Creation', 'Read the full playbook and simplify every section'),

  // ── PHASE 12 — FINAL EVALUATION ───────────────────────────────────────
  { title: 'Knowledge Review', concept: 'Review Phases 1–5. Explain each concept without notes. Mark weak areas.', keyPoints: ['Foundations', 'Candles', 'Levels', 'Structure & indicators'], learn: 'Knowledge recap', practice: 'Self-assess knowledge in the Evaluation', journal: '3 weak areas' },
  { title: 'Technical Analysis Review', concept: 'Mark up 5 fresh charts completely: structure, levels, candles, setup present or not.', keyPoints: ['Full chart markup', 'Structure first', 'Levels second', 'Setup decision'], learn: 'Chart reading recap', practice: 'Mark up 5 charts', journal: '3 observations' },
  { title: 'Risk & Strategy Review', concept: 'Review your risk rules and strategy. Are they specific, written and followed?', keyPoints: ['Rules are specific', 'Rules are written', 'Rules are followed', 'Adjust only with data'], learn: 'Risk & strategy recap', practice: 'Self-assess risk & strategy', journal: '3 observations' },
  { title: 'Backtest & Simulation Review', concept: 'Compare backtest and simulation statistics side by side. Where does execution differ from the plan?', keyPoints: ['Win rate comparison', 'R:R comparison', 'Execution gaps', 'Next experiments'], learn: 'Performance recap', practice: 'Review Analytics', journal: '3 observations' },
  { title: 'Psychology & Discipline Review', concept: 'Review your psychology journal and timetable consistency. Which emotions repeated? How consistent were you?', keyPoints: ['Recurring emotions', 'Discipline score', 'Consistency streaks', 'Rules that helped'], learn: 'Mindset recap', practice: 'Self-assess psychology & discipline', journal: '3 observations' },
  { title: 'Final Evaluation', concept: 'Complete the full evaluation across all 8 skill areas and record your overall score.', keyPoints: ['Score all 8 areas', 'Be honest', 'Compare with the data', 'Pick 3 focus areas'], learn: 'Self-evaluation', practice: 'Complete the Evaluation dashboard', journal: '3 focus areas for the next cycle' },
  { title: 'Graduation — The Next 84 Days', concept: 'You have built a process, a playbook and a habit of improving 1% every day. Decide what the next cycle of learning and simulated practice will focus on.', keyPoints: ['Celebrate the process', 'Keep simulating', 'Keep journaling', 'Keep improving 1%'], learn: 'What you have built', practice: 'Write your next-cycle plan', journal: 'Your biggest 3 improvements' },
];

export const LESSONS_BY_DAY: Lesson[] = LESSONS.map((l, i) => {
  const day = i + 1;
  const phase = PHASES.find((p) => day >= p.days[0] && day <= p.days[1])!;
  return { ...l, day, phase: phase.num };
});

export const TOTAL_DAYS = 84;

export function lessonFor(day: number): Lesson {
  return LESSONS_BY_DAY[Math.min(Math.max(day, 1), TOTAL_DAYS) - 1];
}

export function phaseFor(day: number): Phase {
  return PHASES.find((p) => day >= p.days[0] && day <= p.days[1]) ?? PHASES[PHASES.length - 1];
}

if (LESSONS_BY_DAY.length !== TOTAL_DAYS) {
  console.error(`[curriculum] expected ${TOTAL_DAYS} lessons, got ${LESSONS_BY_DAY.length}`);
}
