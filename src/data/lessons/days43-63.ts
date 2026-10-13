import type { LessonContent } from './types';

// Days 43-63: Strategy C (Pullback), Strategy D (Range-Bound), Backtesting Properly.
// Educational and simulated only — not financial advice. ETF-only scope (NSE ETFs by default).
// All numbers in examples are hypothetical and exist only to illustrate the arithmetic.

export const CONTENT: Record<number, LessonContent> = {
  43: {
    what: [
      "A pullback is a short, temporary move against an intraday trend that already exists. In an uptrend on an ETF such as NIFTYBEES, price rises, pauses or dips for a few candles, and then may continue higher. The pullback template is a set of rules that tries to join the existing trend during that dip, rather than buying after a long run when price is stretched far from any sensible stop.",
      "The template starts with a trend filter, because without a trend there is nothing to pull back from. In this course an uptrend for pullback purposes means: the 20-period EMA on your primary timeframe (for example 5-minute) is rising, and price is trading above the session VWAP. Both conditions are observable — anyone looking at the chart would agree whether they are true.",
      "A pullback is different from a reversal. A pullback dips toward a support zone while the trend structure (higher highs and higher lows, rising EMA, price mostly above VWAP) stays intact. A reversal breaks that structure: price closes below the prior higher low, below VWAP, and the EMA flattens or turns down. The rules you write over this week are designed to tell these apart as early as possible — imperfectly.",
      "Everything in this phase is a template to test in Replay, Backtest and Paper with historical data and virtual money. It is not a pattern that works every time, and nothing here is a recommendation to trade any ETF with real money."
    ],
    why: [
      "Chasing a move that has already run tends to put your entry far from the nearest logical stop, which makes risk per unit large and reward small. Waiting for a pullback can shorten the distance to the stop, which improves the risk/reward of the plan — if the trend resumes. That 'if' is why the template must be tested.",
      "ETFs like NIFTYBEES or BANKBEES often move in smaller percentage swings than the headlines suggest, and intraday costs eat into small moves. A clear, rule-based setup helps you take fewer, better-defined trades instead of many impulsive ones."
    ],
    how: [
      "Open Trading → Learn and read the Pullback module introduction in the ETF Strategy Course.",
      "Open Trading → Markets and load a 5-minute chart of a liquid ETF such as NIFTYBEES, with the 20-EMA and VWAP visible.",
      "Find a session where the 20-EMA is rising and price stays above VWAP for at least an hour; mark it as 'trend present'.",
      "Inside that trend, mark each dip of 2-6 candles that did not close below the previous higher low — these are candidate pullbacks.",
      "Find one session with no clear trend (flat EMA, price crossing VWAP repeatedly) and note that the template says 'no pullback setup' there.",
      "In Strategy Lab, create a draft called 'ETF Pullback v1' and write the trend filter in one sentence.",
      "Add a Trading Journal note: 'Trend first. No trend = no pullback trade.'"
    ],
    example: {
      title: "Hypothetical trend + pullback on a 5-minute NIFTYBEES chart",
      lines: [
        "All prices are hypothetical and chosen only to illustrate the idea.",
        "09:45-10:30: price climbs from ₹261.20 to ₹262.60; 20-EMA rising; price above VWAP (₹261.70).",
        "10:30-10:50: four candles drift down to ₹262.10 — near the 20-EMA (₹262.05). Higher low at ₹261.90 is not broken.",
        "Template reading: trend present, pullback in progress, structure intact → 'watch for trigger' (no entry yet).",
        "Counter-case: had price closed at ₹261.60, below VWAP and the prior higher low, the template would say 'pullback failed — no trade'.",
        "This is a description of a chart, not a prediction or a recommendation."
      ]
    },
    mistakes: [
      "Calling any red candle a pullback, even when there is no established trend.",
      "Buying a dip in a market where the 20-EMA is flat or falling, which is catching a falling price rather than joining a trend.",
      "Confusing a pullback with a reversal and ignoring the broken higher low.",
      "Treating the template as a guaranteed pattern instead of a hypothesis to test.",
      "Skipping the trend filter because the dip 'looks cheap'."
    ],
    quiz: [
      { q: "What two conditions define an uptrend for the pullback template in this course?", a: "A rising 20-EMA on the primary timeframe and price trading above VWAP." },
      { q: "How is a pullback different from a reversal?", a: "A pullback dips while trend structure stays intact; a reversal breaks it (close below the prior higher low and VWAP, EMA turning down)." },
      { q: "What does the template say when there is no clear trend?", a: "No pullback setup — no trade." }
    ]
  },

  44: {
    what: [
      "Pullbacks in a trend often pause near areas that many participants watch. The template uses three: the 20-EMA (a moving average of recent price), VWAP (the session's volume-weighted average price), and a prior level (for example the high of an earlier consolidation that price broke above, which may now act as support).",
      "These are zones, not exact prices. On NIFTYBEES a zone might be a few paise wide; on a more volatile sector ETF such as ITBEES it might be wider. A testable rule makes 'near' measurable, for example: 'the pullback candle's low is within 0.10% of the 20-EMA, VWAP or the marked level'.",
      "Confluence means two or more zones sit close together — for example the 20-EMA and a prior breakout level both near ₹262.10. Confluence does not guarantee a bounce, but it gives you a more clearly defined area to watch, and a more obvious place for invalidation below it.",
      "Each zone tends to behave a little differently. Shallow pullbacks in strong trends often only reach the 20-EMA. Deeper pullbacks may reach VWAP. A pullback that slices through all three zones is no longer a typical pullback, and the next lessons treat it as a warning sign."
    ],
    why: [
      "Without a defined zone, 'buy the dip' becomes 'buy whenever it feels low', which cannot be tested or reviewed. A written zone rule lets the Backtest tool and your own Replay notes apply the same definition every time.",
      "Zones also anchor the stop. If the plan is 'price should hold the 20-EMA/VWAP area', then a clear close below that area is objective evidence the idea was wrong."
    ],
    how: [
      "In Trading → Learn, read the Pullback module section on pullback zones.",
      "In Trading → Markets, open 5 recent 5-minute sessions of one liquid ETF with the 20-EMA and VWAP shown.",
      "On each trend day, draw the most recent breakout level (prior swing high that price moved above).",
      "For every pullback, tag which zone it reached first: 20-EMA, VWAP, prior level, or 'through all'.",
      "Write a measurable 'near the zone' rule, such as 'low within 0.10% of the zone', and add it to ETF Pullback v1 in Strategy Lab.",
      "Count how often each zone was reached and whether the trend later resumed; record the counts, not impressions.",
      "Ask Trading → Ask AI to explain VWAP versus EMA in your own words, and check its answer against the course."
    ],
    example: {
      title: "Hypothetical zone tagging across five sessions",
      lines: [
        "Hypothetical study counts for one ETF over 5 sessions — not real data.",
        "Trend days found: 3. Pullbacks tagged: 9.",
        "Reached 20-EMA only: 4 · reached VWAP: 3 · reached prior level with EMA confluence: 1 · went through all zones: 1.",
        "'Near' rule used: candle low within 0.10% of the zone (on ₹262 that is about ₹0.26).",
        "Note: 9 pullbacks is far too few to draw conclusions — this is practice in labelling, not evidence.",
        "Next step: carry the same zone rule into Replay and Backtest without changing it."
      ]
    },
    mistakes: [
      "Treating the EMA or VWAP as an exact line and calling a 1-paisa miss a failure (or a success).",
      "Moving the zone after the fact to fit what price did.",
      "Drawing so many levels that every price is 'near a level'.",
      "Ignoring that zone width should suit the ETF's volatility and tick size.",
      "Drawing conclusions from a handful of pullbacks."
    ],
    quiz: [
      { q: "Name the three pullback zones used in the template.", a: "The 20-EMA, VWAP, and a prior level such as an earlier breakout point." },
      { q: "What is confluence?", a: "Two or more zones sitting close together, giving a clearer area to watch and to invalidate below." },
      { q: "Why make 'near the zone' a measurable rule?", a: "So the same definition is applied every time and can be backtested and reviewed honestly." }
    ]
  },

  45: {
    what: [
      "Reaching a pullback zone is not an entry signal. The template waits for a trigger: a bullish candle at or near the zone that closes back up — for example a candle that closes above the prior candle's high, or closes in the upper part of its range after dipping into the zone. The exact trigger definition is yours to write, but it must be observable at the candle's close.",
      "The entry is taken on the next bar, not inside the trigger candle. In Replay, Backtest and Paper this mirrors reality: you only know a candle closed bullish once it has closed, so the earliest realistic fill is at the next bar's open (plus slippage).",
      "Invalidation is decided before entry. The template uses two rules: (1) a close below the pullback low means the dip was not a pullback after all — exit or do not enter; (2) if the 20-EMA turns down, the trend filter has failed — no new entries, and an open trade is managed toward exit. The initial stop goes just below the pullback low, with a small buffer for normal noise.",
      "A target can be a fixed multiple of risk (for example 1.5R or 2R), the prior swing high, or a trailing stop — the important thing is to choose one approach and test it consistently."
    ],
    why: [
      "A trigger filters out pullbacks that keep falling. Without it you buy every dip into the zone, including the ones that turn into reversals.",
      "Pre-defined invalidation turns a vague hope into a measurable risk. It also makes position sizing possible: risk per unit = entry − stop, and units = planned risk in ₹ ÷ risk per unit."
    ],
    how: [
      "In Trading → Learn, read the Pullback module section on triggers and invalidation.",
      "Write your trigger rule in Strategy Lab, e.g. 'bullish candle whose low touches the zone and which closes above the prior candle's high'.",
      "Write the stop rule: 'initial stop = pullback low − buffer (e.g. ₹0.05 or 0.02%)' and the two invalidation rules.",
      "Open Trading → Replay on a trend session; step candle by candle until price reaches a zone.",
      "Lock Long only when a trigger candle has closed; otherwise lock No-Trade. Note entry as the next bar's open.",
      "Calculate position size: planned risk in ₹ ÷ (entry − stop), rounded down to whole units.",
      "Repeat until you have 3 valid triggers, and log each in the Trading Journal with a screenshot."
    ],
    example: {
      title: "Hypothetical trigger, entry, stop and size",
      lines: [
        "Hypothetical NIFTYBEES 5-minute bars; numbers for illustration only.",
        "Pullback low ₹262.02 near rising 20-EMA ₹262.05; price above VWAP ₹261.70.",
        "Trigger candle closes ₹262.34, above prior candle high ₹262.20 → valid trigger at close.",
        "Entry: next bar opens ₹262.36 + ₹0.01 slippage = ₹262.37. Stop: ₹262.02 − ₹0.05 buffer = ₹261.97.",
        "Risk per unit = ₹0.40. Planned virtual risk ₹300 → 300 ÷ 0.40 = 750 units (≈ ₹1.97 lakh notional).",
        "Target at 2R: ₹262.37 + ₹0.80 = ₹263.17 — before costs; costs still have to be subtracted.",
        "Invalidation: a 5-minute close below ₹262.02 or the 20-EMA turning down → exit plan."
      ]
    },
    mistakes: [
      "Entering inside the trigger candle before it has closed, which a backtest cannot reproduce honestly.",
      "Placing the stop at a round number far from the pullback low, without a reason.",
      "Moving the stop lower after entry to 'give it room'.",
      "Forgetting that a large notional on a tight stop still has to pay costs on the full traded value.",
      "Ignoring the EMA-turning-down rule because the trade is 'almost' back to breakeven."
    ],
    quiz: [
      { q: "When is the earliest realistic entry after a trigger candle?", a: "At the next bar's open (plus slippage), once the trigger candle has closed." },
      { q: "What are the two invalidation rules in the template?", a: "A close below the pullback low, or the 20-EMA turning down." },
      { q: "How is position size calculated?", a: "Planned risk in ₹ ÷ (entry − stop), rounded down to whole units." }
    ]
  },

  46: {
    what: [
      "Many pullbacks do not resume the trend. Some become reversals, some turn into sideways chop, and some simply run out of time before the session ends. A failed pullback is not a mistake by itself — it is a normal outcome that the stop is designed to handle. What matters is recognising warning signs and keeping losses at the planned size.",
      "Common warning signs: the pullback is deep (it goes through the 20-EMA, VWAP and the prior level all at once); the selling candles have noticeably higher volume than the rising candles before them; price closes below VWAP and stays there; the 20-EMA flattens or turns down; or the move happens late in the session, when there is little time left before square-off.",
      "Market-wide context matters too. Sector ETFs such as BANKBEES or ITBEES can be pulled around by their underlying index, and broad-market news can override any intraday pattern. Around scheduled events (policy announcements, major data releases) the template is safer skipped.",
      "The aim is not to predict which pullbacks will fail — that is not reliably possible — but to write skip conditions and exit rules that keep the failures small and comparable."
    ],
    why: [
      "If you treat every failure as a surprise, you are tempted to hold, average down or move the stop. Expecting failures as part of the template makes it easier to accept a planned, small loss.",
      "Skip conditions also reduce trade count in poor conditions, which reduces costs paid on low-quality setups."
    ],
    how: [
      "In Trading → Learn, read the Pullback module section on failure signs.",
      "In Trading → Replay, find 2 sessions where a pullback started normally and then failed; step through them candle by candle.",
      "For each, note the first candle where a warning sign appeared and whether the invalidation rule would have exited.",
      "Write skip conditions in Strategy Lab, e.g. 'no entry if the pullback closes below VWAP' and 'no new entries after 14:45 IST'.",
      "Open Mistake Lab and add 'holding a failed pullback' and 'averaging down' as mistakes to watch for.",
      "In the Psychology journal, write how you felt watching a planned stop get hit in Replay."
    ],
    example: {
      title: "Hypothetical failed pullback on BANKBEES",
      lines: [
        "Hypothetical 5-minute bars; prices for illustration only.",
        "Morning trend: 20-EMA rising, price above VWAP ₹519.80.",
        "11:20: pullback begins; three red candles on volume about 2× the prior rising candles.",
        "11:35: close at ₹519.55 — below VWAP and below the prior higher low ₹519.70 → template says 'pullback failed, no entry'.",
        "If a trade had been open from an earlier trigger, the stop below the pullback low would have closed it at a planned loss of about 1R.",
        "Lesson: the template did its job by limiting the damage, not by being right."
      ]
    },
    mistakes: [
      "Averaging down into a failing pullback.",
      "Removing or widening the stop after the warning signs appear.",
      "Entering late-day pullbacks with no time for the move to develop before square-off.",
      "Treating one failed pullback as proof the template is useless — single outcomes prove nothing.",
      "Ignoring broad-market or event risk that affects the whole ETF."
    ],
    quiz: [
      { q: "Name three warning signs of a failing pullback.", a: "Any three of: very deep pullback through all zones, heavy selling volume, close below VWAP, 20-EMA flattening or turning down, late-session timing." },
      { q: "Is a stopped-out pullback trade a mistake?", a: "Not by itself — a planned, rule-based loss is a normal outcome. Breaking the rules is the mistake." },
      { q: "Why add a time-of-day skip rule?", a: "Late in the session there is little time for the move to work before end-of-day square-off." }
    ]
  },

  47: {
    what: [
      "Replay shows a historical session one candle at a time. You do not see the future, so each decision is made with the same information you would have had then. At each step you can lock Long, Short or No-Trade, and the tool gives a process score based on whether the decision matched your written rules — not on whether it made money.",
      "Today you bring the whole pullback checklist into Replay: trend filter (rising 20-EMA, price above VWAP), pullback to a zone, trigger candle closing back up, entry at the next bar, stop below the pullback low, invalidation rules and skip conditions. The template in this course is long-only; any short-side version would need its own rules and its own testing.",
      "No-Trade is an important decision. On many sessions the correct answer, according to your rules, is to do nothing. A good process score often includes many No-Trade decisions.",
      "Process score and P&L measure different things. A rule-following trade can lose and a rule-breaking trade can win; over many decisions, consistent process is what makes results interpretable."
    ],
    why: [
      "Reading about a template is not the same as applying it under uncertainty. Replay exposes the hesitation, early entries and second-guessing that never show up when you look at a finished chart.",
      "Logging each decision creates a record you can compare with the backtest next lesson, which checks whether you apply the rules the same way the computer does."
    ],
    how: [
      "Open your ETF Pullback v1 checklist from Strategy Lab and keep it visible.",
      "In Trading → Replay, choose a liquid ETF, a 5-minute timeframe and a session you have not looked at before.",
      "Step candle by candle. At each decision point, lock Long or No-Trade before revealing the next bar.",
      "For every Long, record entry (next open), stop, target and the rule that justified it.",
      "Complete 3 sessions and note the process score for each.",
      "In the Trading Journal, list any rule you broke or hesitated on, and add repeat errors to Mistake Lab."
    ],
    example: {
      title: "Hypothetical Replay log — three sessions",
      lines: [
        "Hypothetical results for illustration only.",
        "Session A (trend day): 1 Long on 20-EMA pullback, stopped out −1R. Rules followed → process score high.",
        "Session B (choppy day): 0 trades, 6 No-Trade locks (EMA flat). Process score high.",
        "Session C (trend day): 1 Long entered before trigger candle closed → rule break; trade won +1.2R. Process score low.",
        "Takeaway: the winning trade in C was the worst decision of the three.",
        "Action: add 'wait for candle close' to Mistake Lab."
      ]
    },
    mistakes: [
      "Peeking ahead or replaying a session you remember, which removes the uncertainty.",
      "Judging the day by P&L instead of process score.",
      "Avoiding No-Trade because it feels like 'not practising'.",
      "Changing the checklist mid-session after a loss.",
      "Not recording the rule behind each decision."
    ],
    quiz: [
      { q: "What does the Replay process score measure?", a: "Whether each decision followed your written rules, not whether it made money." },
      { q: "Can a winning trade be a bad decision?", a: "Yes — if it broke the rules, it is a bad process even with a good outcome." },
      { q: "Why is No-Trade a valid decision?", a: "When the conditions in your rules are not met, doing nothing is the rule-following choice." }
    ]
  },

  48: {
    what: [
      "The Backtest tool applies your written rules to historical ETF data automatically. You pick an ETF, a date range, a timeframe (1m, 5m or 15m) and the strategy settings; it then simulates every signal using next-bar fills and the Indian cost model, and produces a report.",
      "To backtest the pullback template, each rule must be mechanical: trend filter (20-EMA rising, close above VWAP), zone (low within X% of 20-EMA or VWAP), trigger (bullish close above prior high), entry (next bar open), stop (below pullback low), target (e.g. 2R) and exits (invalidation, end-of-day square-off). Anything that relies on 'feel' cannot be tested.",
      "Split the data by date: an earlier training period where you study results and may adjust rules, and a later out-of-sample period you run once, unchanged. Phase 9 covers this in detail; for now, set it up and do not tune on the out-of-sample section.",
      "Results describe how one set of rules would have behaved on past data under the tool's assumptions. They do not predict future results, and a small number of trades says very little."
    ],
    why: [
      "Replay gives you a feel for a few sessions; a backtest checks the same rules across many sessions consistently. It is the first place where costs, trade frequency and drawdown become visible together.",
      "Fixing the rules before running the test protects you from adjusting them to fit what you see — the beginning of overfitting."
    ],
    how: [
      "Write the full rule list for ETF Pullback v1 in Strategy Lab and save it as fixed for this test.",
      "Open Trading → Backtest and choose one liquid ETF, e.g. NIFTYBEES, on the 5-minute timeframe.",
      "Pick a date range with enough sessions to produce at least ~30 trades; set the training/out-of-sample split by date.",
      "Confirm the cost model settings (brokerage, STT, exchange, SEBI, stamp duty, GST, slippage) are switched on.",
      "Run the training period first; record trade count, win rate, net P&L, profit factor, max drawdown and expectancy.",
      "Run the out-of-sample period once with no rule changes and record the same metrics.",
      "In the Trading Journal, note any differences between backtest trades and your Replay decisions."
    ],
    example: {
      title: "Hypothetical pullback backtest summary",
      lines: [
        "Hypothetical numbers for illustration only — not real results.",
        "ETF: NIFTYBEES · 5m · training: 6 months · out-of-sample: next 3 months.",
        "Training: 46 trades · win rate 43% · gross P&L ₹4,100 · costs ₹3,200 · net P&L ₹900 · profit factor 1.09.",
        "Out-of-sample: 21 trades · win rate 38% · net P&L −₹650.",
        "Reading: costs absorbed most of the gross edge; out-of-sample has fewer than 30 trades, so it is inconclusive.",
        "Next step: record, do not tune to make the numbers look better."
      ]
    },
    mistakes: [
      "Changing rules after looking at results, then re-running until the numbers look good.",
      "Reporting gross P&L and ignoring costs.",
      "Testing a date range so short that only a handful of trades occur.",
      "Testing on a thinly traded ETF where the fills in the report are unrealistic.",
      "Reading a positive backtest as a forecast or a reason to trade real money."
    ],
    quiz: [
      { q: "Why must rules be fixed before running the backtest?", a: "So you do not adjust them to fit the data you are looking at, which leads to overfitting." },
      { q: "What is the out-of-sample period for?", a: "A later date range run once, unchanged, to see how the rules behaved on data not used to build them." },
      { q: "What does a backtest result tell you about the future?", a: "Nothing guaranteed — it only describes past behaviour under the tool's assumptions." }
    ]
  },

  49: {
    what: [
      "This week built the pullback template step by step. Day 43 set the trend filter: rising 20-EMA and price above VWAP. Day 44 defined the pullback zones: 20-EMA, VWAP and prior levels, treated as measurable zones. Day 45 added the bullish trigger candle, next-bar entry, stop below the pullback low and two invalidation rules (close below the pullback low, EMA turning down).",
      "Day 46 covered failure: deep pullbacks, heavy selling volume, VWAP loss, a turning EMA and late-session timing as warning signs, and skip conditions to avoid them. Day 47 applied the checklist in Replay with locked decisions and process scores. Day 48 ran the rules in Backtest with costs and a train/out-of-sample split.",
      "Together these form ETF Pullback v1: a complete, testable template. It is not a proven edge. Whatever your backtest showed, the sample is likely small and the results describe only the past.",
      "Review day is for consolidating and clarifying — not for adding new indicators or rewriting the strategy based on a few trades."
    ],
    why: [
      "Writing a clean summary now makes the next phases easier: range trading will be compared to this template, and Phase 9 will test it more rigorously.",
      "Clarifying ambiguous rules is more valuable than adding new ones. Every vague word is a place where your Replay and Backtest decisions can drift apart."
    ],
    how: [
      "Reread the key points for days 43-48 and answer this week's quiz questions without notes.",
      "In Strategy Lab, check that every rule of ETF Pullback v1 is observable at a candle close.",
      "Compare your Replay log (Day 47) with the backtest trade list (Day 48) and note any rule you applied differently.",
      "Write a one-paragraph summary in the Playbook: trend filter, zones, trigger, stop, target, invalidation, skip rules.",
      "List at most one rule to clarify for a future v2 — record it, but do not test it yet.",
      "Log this week's most common mistake in Mistake Lab."
    ],
    example: {
      title: "Hypothetical Playbook summary — ETF Pullback v1",
      lines: [
        "Template only; numbers are hypothetical settings to be tested, not recommendations.",
        "Trend: 5m 20-EMA rising and close above VWAP.",
        "Zone: pullback low within 0.10% of 20-EMA, VWAP or prior breakout level.",
        "Trigger: bullish candle closing above prior candle high; enter next bar open.",
        "Stop: pullback low − small buffer. Target: 2R. Square-off at end of day.",
        "Invalidate: close below pullback low or 20-EMA turning down. Skip: after 14:45 IST, around scheduled news.",
        "Evidence so far: Replay 3 sessions, one backtest with < 30 out-of-sample trades — inconclusive."
      ]
    },
    mistakes: [
      "Rewriting the template after a single bad Replay session.",
      "Adding extra indicators to 'fix' losses without testing.",
      "Calling the strategy 'proven' after one backtest.",
      "Leaving rules vague because they feel obvious.",
      "Skipping the comparison between Replay decisions and backtest trades."
    ],
    quiz: [
      { q: "List the pullback template steps in order.", a: "Trend filter, pullback to a zone, bullish trigger close, next-bar entry with stop below the pullback low, target/exit, invalidation rules." },
      { q: "Why compare Replay decisions with backtest trades?", a: "To find rules you apply differently from the mechanical version, which means a rule is unclear." },
      { q: "How many rule changes should go into v2 at once?", a: "One at a time, so you can tell what caused any difference." }
    ]
  },

  50: {
    what: [
      "A range is a period when price moves sideways between a support area below and a resistance area above, turning back from each more than once. Many ETF sessions — especially quiet days on NIFTYBEES or GOLDBEES — spend hours inside a range.",
      "The template requires objective evidence before calling something a range: at least two touches of support and at least two touches of resistance on the primary timeframe, a flat 20-EMA (no clear slope), and price crossing back and forth over VWAP. A 'touch' means the candle's low (or high) comes within a defined distance of the boundary and price then turns away.",
      "Boundaries are zones, not exact lines. A range might be 'support ₹518.20-518.35, resistance ₹520.25-520.40'. Measure the width both in rupees and as a percentage of price; that width decides whether a range is even worth considering after costs.",
      "A range is a description of the recent past. It can end at any moment with a breakout. The range template is a rule set to test, not an assumption that the boundaries will hold."
    ],
    why: [
      "Trend and pullback rules perform poorly in sideways markets, and range rules perform poorly in trends. Identifying the market type first decides which template, if any, applies.",
      "Many intraday ranges on large index ETFs are narrow. Measuring width early prevents you from studying ranges that could never cover round-trip costs."
    ],
    how: [
      "In Trading → Learn, read the Range module introduction in the ETF Strategy Course.",
      "In Trading → Markets, open a 5-minute chart of a liquid ETF with the 20-EMA and VWAP visible.",
      "Find a session where the 20-EMA is flat; mark the highest and lowest turning points that were touched at least twice.",
      "Draw the support and resistance zones and record the touch times.",
      "Measure width: resistance − support in ₹, and divide by price for %.",
      "Compare the width with the round-trip cost estimate from Day 6 (or the Backtest cost settings) and note the ratio in the Trading Journal.",
      "Repeat for 3 ranges on at least two different ETFs."
    ],
    example: {
      title: "Hypothetical BANKBEES range identification",
      lines: [
        "Hypothetical 5-minute bars; numbers for illustration only.",
        "Support touches: 10:20 low ₹518.25, 11:35 low ₹518.30. Resistance touches: 10:50 high ₹520.35, 12:10 high ₹520.30.",
        "20-EMA flat around ₹519.30; price crossed VWAP 5 times since 10:00.",
        "Width: ₹520.35 − ₹518.25 = ₹2.10 → about 0.40% of price.",
        "Template reading: valid range (2+ touches each side, flat EMA). Next lesson decides whether and where to act.",
        "If width had been ₹0.40 (about 0.08%), the template would flag it as too narrow versus costs."
      ]
    },
    mistakes: [
      "Calling a range after one touch on each side.",
      "Drawing boundaries at exact prices and treating a small overshoot as a breakout.",
      "Ignoring a sloping EMA — a gently trending channel is not a flat range.",
      "Forgetting to measure width relative to costs.",
      "Assuming the range will keep holding because it held before."
    ],
    quiz: [
      { q: "What evidence does the template require to call a range?", a: "At least two touches of support and of resistance, a flat 20-EMA, and price crossing VWAP repeatedly." },
      { q: "Why measure range width as a percentage?", a: "To compare it with round-trip costs and see whether the range could even cover them." },
      { q: "Are range boundaries exact prices?", a: "No — they are zones with some tolerance." }
    ]
  },

  51: {
    what: [
      "The range template only considers trades near the edges: buying near support, or selling near resistance. The middle of a range offers roughly equal distance to both boundaries, so the reward available is small relative to the risk — the template ignores it.",
      "Being near an edge is not enough. The template requires a rejection: a candle that pushes into the boundary zone and then closes back inside the range, away from the edge — for example a long lower wick at support with a close in the upper half of the candle. Entry is at the next bar's open, just as in the pullback template.",
      "Selling near resistance means either exiting an existing long or, in simulation, opening a short. Intraday short selling of ETFs has its own rules, margins and risks in real markets; in this course the short side is studied only as a simulated exercise in Replay and Backtest, and you may choose to keep your template long-only.",
      "A rejection is evidence that the edge is holding for now, not a promise. Edges break, and the next lessons cover when to stand aside and where to place stops."
    ],
    why: [
      "Edge entries with a rejection create a natural stop location (just beyond the boundary) and a natural target (the midpoint or opposite edge). That structure is what makes the setup testable.",
      "Waiting for rejection filters out many touches that break straight through the boundary, at the cost of a slightly worse entry price."
    ],
    how: [
      "In Trading → Learn, read the Range module section on edge entries.",
      "Write the rejection rule in Strategy Lab, e.g. 'candle low inside the support zone and close in the upper half of the candle, above the zone'.",
      "Define 'near the edge': within the outer 25% of the range width.",
      "In Trading → Replay, open a session where you can confirm a range; step candle by candle.",
      "Lock Long only after a rejection candle closes at support; lock No-Trade in the middle of the range.",
      "If you practise the short side, label it clearly as simulated and log it separately.",
      "Record 3 edge rejections, including any that failed, in the Trading Journal."
    ],
    example: {
      title: "Hypothetical support rejection on BANKBEES",
      lines: [
        "Hypothetical numbers continuing from Day 50; for illustration only.",
        "Range: support ₹518.25, resistance ₹520.35, width ₹2.10. Outer 25% near support = ₹518.25-518.78.",
        "13:05 candle: low ₹518.28, close ₹518.72 (upper half of candle, back above zone) → rejection.",
        "Entry: next bar open ₹518.74 + ₹0.02 slippage = ₹518.76.",
        "Middle of range (₹519.30) at 12:40: template says No-Trade.",
        "Outcome is not shown here on purpose — the decision is judged by the rules, not the result."
      ]
    },
    mistakes: [
      "Buying in the middle of the range because price 'is going up'.",
      "Entering on the touch instead of waiting for the rejection candle to close.",
      "Treating every touch as a rejection even when the candle closes at its low.",
      "Practising shorts without understanding they are a simulated exercise with extra real-world risks.",
      "Forgetting that a rejection can still fail."
    ],
    quiz: [
      { q: "Why does the template ignore the middle of the range?", a: "The distance to both boundaries is similar, so available reward is small relative to risk." },
      { q: "What is a rejection candle at support?", a: "A candle that pushes into the support zone and closes back inside the range, away from the edge (e.g. long lower wick, close in the upper half)." },
      { q: "When is the entry after a rejection?", a: "At the next bar's open, plus slippage." }
    ]
  },

  52: {
    what: [
      "Range rules assume price will keep turning at the boundaries. Several conditions make that assumption especially weak, and the template lists them as no-trade filters. The first is a strong trend: a sloping 20-EMA, price staying on one side of VWAP, and a series of higher highs or lower lows. Buying 'support' in a downtrend means fighting the trend.",
      "The second is timing. The first 15-30 minutes after the 09:15 IST open are often volatile as overnight news is absorbed, and ranges identified then are unreliable. Around scheduled news — policy announcements, major data releases, index events — boundaries can break abruptly. Late in the session there may not be enough time before square-off.",
      "The third is cost. If the range is narrow, the distance from edge entry to target may be close to the round-trip cost of brokerage, taxes, spread and slippage. A rule such as 'range width must be at least 4× the estimated round-trip cost in %' makes this testable.",
      "The fourth is liquidity. Thinly traded ETFs can have wide spreads and jumpy prints that create fake 'touches'. Check volume, traded value and the bid-ask spread before treating any range as real."
    ],
    why: [
      "Many losses in range trading come not from bad entries but from trading ranges that should have been skipped. Filters reduce the number of low-quality trades and the costs paid on them.",
      "Written filters also give you a reason to say No-Trade calmly instead of forcing a setup on a quiet day."
    ],
    how: [
      "In Trading → Learn, read the Range module section on when not to range-trade.",
      "Write four filters in Strategy Lab: trend filter, time filter (e.g. no entries before 09:45 IST or after 14:45 IST), news filter, cost filter.",
      "Use Trading → Practice and its ETF eligibility check to confirm the ETF has adequate volume and a tight spread.",
      "Calculate the cost filter: estimated round-trip cost % × 4 = minimum range width %.",
      "In Trading → Replay, find 3 sessions where at least one filter says skip, and lock No-Trade with the reason.",
      "Add the filters to the Risk & No-Trade section of your Playbook."
    ],
    example: {
      title: "Hypothetical cost filter check",
      lines: [
        "Hypothetical figures for illustration; actual rates change and are configurable in the app.",
        "Estimated round trip (brokerage, STT, exchange, SEBI, stamp, GST, spread, slippage) on ~₹1 lakh: about 0.10%.",
        "Filter: minimum range width = 4 × 0.10% = 0.40%.",
        "Range A on NIFTYBEES: width 0.12% → skip (too narrow versus costs).",
        "Range B on BANKBEES: width 0.42% → passes cost filter; still check trend, time and news filters.",
        "Range C: width 0.50% but formed 09:15-09:35 → skip (opening period)."
      ]
    },
    mistakes: [
      "Range-trading against a strong, sloping trend.",
      "Taking edge trades during the opening minutes or right before scheduled news.",
      "Ignoring that a narrow range cannot cover costs.",
      "Trading a range on a thinly traded ETF with a wide spread.",
      "Treating the filters as optional on days you feel confident."
    ],
    quiz: [
      { q: "Name four situations where the template says do not range-trade.", a: "Strong trend, the opening period, around scheduled news, and when range width is too small versus costs (also illiquid ETFs)." },
      { q: "How can the cost filter be made testable?", a: "Set a minimum range width as a multiple of estimated round-trip cost %, e.g. 4×." },
      { q: "Why check spread and volume first?", a: "Thin ETFs can have wide spreads and fake touches, making ranges unreliable and fills costly." }
    ]
  },

  53: {
    what: [
      "In a range trade, the boundary you entered from is the reason for the trade, so the stop goes just beyond it. For a long from support, the stop sits below the support zone (or below the rejection candle's low, whichever is lower) plus a small buffer. If price closes outside the range, the range idea has failed.",
      "The target sits before the opposite boundary or at the range midpoint. Placing the target slightly inside resistance (rather than exactly at it) accounts for the fact that other participants also watch that level. A midpoint target gives a higher hit rate but a smaller reward; a near-opposite-edge target gives the reverse. Pick one and test it.",
      "Reward ÷ risk must be checked after costs. Gross R:R might look like 1.8, but if costs equal 20% of the reward, the net figure is lower. A rule such as 'skip unless net reward ÷ risk ≥ 1.5' prevents trades where costs eat the edge.",
      "A time stop can also apply: if price has not moved toward the target after a set number of bars, or square-off time is near, exit. Ranges that stall often break."
    ],
    why: [
      "Clear stops and targets turn a range idea into a defined trade with known risk, which is required for sizing and backtesting.",
      "Because ranges are often narrow, small differences in stop and target placement change the result a lot. Writing them down prevents decisions in the moment."
    ],
    how: [
      "In Trading → Learn, read the Range module section on stops and targets.",
      "Write the stop rule in Strategy Lab: 'below support zone or rejection low, minus buffer'.",
      "Choose one target rule: midpoint, or a set distance before resistance, and write it down.",
      "Add an invalidation rule: 'a 5-minute close outside the range ends the setup'.",
      "Plan 3 hypothetical range trades from your Day 50-51 charts: entry, stop, target, units.",
      "For each, calculate gross R:R, estimated costs in ₹, and net reward ÷ risk; record them in the Trading Journal.",
      "Set the matching stop-loss and take-profit fields when you later practise in Trading → Paper."
    ],
    example: {
      title: "Hypothetical range trade plan on BANKBEES",
      lines: [
        "Hypothetical numbers continuing from Day 51; for illustration only.",
        "Entry ₹518.76. Stop: below support zone ₹518.25 − ₹0.10 buffer = ₹518.15. Risk ₹0.61 per unit.",
        "Target: ₹0.20 before resistance ₹520.35 = ₹520.15. Reward ₹1.39 per unit → gross R:R about 2.3.",
        "Size: planned virtual risk ₹300 ÷ 0.61 = 491 units (≈ ₹2.55 lakh notional).",
        "Estimated costs at about 0.10% of ₹2.55 lakh ≈ ₹255 → net reward ≈ 491 × 1.39 − 255 ≈ ₹428; net loss if stopped ≈ ₹300 + ₹255 = ₹555.",
        "Net reward ÷ net risk ≈ 0.77 — below a 1.5 rule, so the template says skip or reduce size and re-check.",
        "Lesson: on narrow ranges, costs scale with notional, not with risk."
      ]
    },
    mistakes: [
      "Setting the target exactly at resistance and watching price turn just short of it.",
      "Using a stop inside the range where normal noise will hit it.",
      "Calculating R:R before costs only.",
      "Holding after a close outside the range because 'it will come back'.",
      "Ignoring that a tight stop forces a large position, which raises costs."
    ],
    quiz: [
      { q: "Where does the stop go on a long from range support?", a: "Just below the support zone or rejection low, whichever is lower, plus a small buffer." },
      { q: "What are the two common range target choices?", a: "The range midpoint, or a point slightly before the opposite boundary." },
      { q: "Why can a tight range stop make costs worse?", a: "A tight stop allows a larger position for the same risk, and costs are charged on the full traded value." }
    ]
  },

  54: {
    what: [
      "Today you apply the full range checklist in Trading → Replay. The order matters: first decide whether a range exists (2+ touches each side, flat 20-EMA), then check the no-trade filters (trend, time, news, cost, liquidity), then wait for an edge rejection, then plan stop and target with net R:R.",
      "Most candles will be No-Trade. That is expected: ranges take time to form, filters remove many of them, and the template only acts at the edges after a rejection.",
      "Lock decisions before revealing the next candle. The process score reflects whether the decision matched your written rules. If your template is long-only, locking Short is a rule break; if you also study the simulated short side, follow its own written rules.",
      "Watch for the moment a range ends. A strong close outside the boundary means the range template no longer applies — and may be where the breakout template from Phase 6 becomes relevant instead."
    ],
    why: [
      "Range trading feels easy on a finished chart because the boundaries are obvious in hindsight. Replay removes hindsight and shows how often a 'range' was unclear at the time.",
      "Comparing your Replay decisions with the backtest you run next lesson shows whether your rules are mechanical enough."
    ],
    how: [
      "Open your range checklist from Strategy Lab next to Trading → Replay.",
      "Choose a liquid ETF, 5-minute timeframe, and an unfamiliar session.",
      "Step candle by candle; write down the moment you first consider the range confirmed.",
      "Run through the filters each time price approaches an edge; lock No-Trade if any filter fails.",
      "When a rejection closes at an edge, lock the decision and record entry, stop, target and net R:R.",
      "Complete 3 sessions and record each process score.",
      "Add any repeated rule break to Mistake Lab and note feelings in the Psychology journal."
    ],
    example: {
      title: "Hypothetical range Replay log",
      lines: [
        "Hypothetical results for illustration only.",
        "Session 1 (GOLDBEES): range confirmed at 11:40; one support rejection → Long; target hit. Rules followed.",
        "Session 2 (NIFTYBEES): range width 0.15% → cost filter fails → No-Trade all day. Rules followed.",
        "Session 3 (BANKBEES): range broke down at 13:20; I bought 'support' after the break → rule break, −1R.",
        "Process scores: high, high, low.",
        "Action: add 'close outside range = no range trades' to the top of the checklist."
      ]
    },
    mistakes: [
      "Confirming a range too early, after only one touch per side.",
      "Skipping the filter check when price reaches an edge quickly.",
      "Continuing to trade the 'range' after a clear close outside it.",
      "Judging the session by P&L instead of process score.",
      "Replaying sessions you already know."
    ],
    quiz: [
      { q: "What is the correct order of the range checklist?", a: "Confirm the range, check no-trade filters, wait for an edge rejection, then plan stop, target and net R:R." },
      { q: "What should happen when price closes clearly outside the range?", a: "The range template no longer applies — no more range trades on that range." },
      { q: "Why expect many No-Trade decisions?", a: "Ranges take time to confirm, filters remove many, and entries only happen at edges after rejection." }
    ]
  },

  55: {
    what: [
      "Backtesting the range template uses the same Trading → Backtest tool as the pullback template, but the rules must capture range-specific ideas mechanically: range detection (for example, highest high and lowest low over the last N bars with at least two touches within a tolerance, and a 20-EMA slope below a threshold), the edge zone, the rejection candle, the filters and the stop/target rules.",
      "Translating visual ideas into code often reveals ambiguity. 'Two touches' needs a tolerance; 'flat EMA' needs a slope limit; 'narrow range' needs a minimum width. Write each one down before running anything.",
      "Range strategies often show a reasonable win rate before costs and a much weaker result after costs, because targets are small. Always compare gross and net P&L side by side.",
      "Use the same date split approach as before: training period for study, out-of-sample period run once unchanged. Fewer than ~30 trades in either period means the result is mostly noise."
    ],
    why: [
      "A backtest shows whether the range template's small, frequent targets survive the Indian cost model over many sessions — something Replay cannot show.",
      "Comparing the range and pullback backtests on the same ETF and dates shows how different templates behave in different conditions."
    ],
    how: [
      "In Strategy Lab, convert each range rule into a measurable setting: lookback N, touch tolerance, EMA slope limit, minimum width, edge zone, rejection rule.",
      "Open Trading → Backtest and choose the same ETF, timeframe and dates you used for the pullback test (Day 48).",
      "Confirm all cost settings are on, including a realistic slippage assumption.",
      "Run the training period; record trade count, win rate, gross P&L, total costs, net P&L, profit factor, max drawdown and expectancy.",
      "Run the out-of-sample period once without changes and record the same metrics.",
      "Write the gross-to-net difference as a % of gross profit in the Trading Journal.",
      "Note in Analytics or your journal how the range results compare with the pullback results."
    ],
    example: {
      title: "Hypothetical range backtest summary",
      lines: [
        "Hypothetical numbers for illustration only — not real results.",
        "ETF: NIFTYBEES · 5m · same dates as pullback test.",
        "Training: 58 trades · win rate 55% · gross P&L ₹3,600 · costs ₹4,100 · net P&L −₹500 · profit factor 0.95.",
        "Out-of-sample: 24 trades · net P&L −₹380.",
        "Reading: a positive gross result turned negative after costs; ranges were mostly too narrow.",
        "Possible next test (one change only): raise the minimum width filter, then re-test on new out-of-sample dates."
      ]
    },
    mistakes: [
      "Looking only at win rate, which is often high for range strategies.",
      "Ignoring costs, which hit small-target strategies hardest.",
      "Leaving range detection vague so the backtest does something different from your Replay rules.",
      "Tweaking the minimum width on the out-of-sample data until it turns positive.",
      "Treating a negative backtest as a failure of learning — it is useful information."
    ],
    quiz: [
      { q: "Why do range strategies often look worse after costs?", a: "Their targets are small, so fixed and percentage costs take a large share of each win." },
      { q: "Name two range rules that need a numeric setting to backtest.", a: "Any two of: lookback length, touch tolerance, EMA slope limit, minimum width, edge zone size." },
      { q: "Why use the same dates as the pullback test?", a: "So the two templates are compared under the same market conditions." }
    ]
  },

  56: {
    what: [
      "This week built the range template. Day 50 defined a range objectively: at least two touches of support and of resistance, a flat 20-EMA and price crossing VWAP, with width measured in ₹ and %. Day 51 limited entries to the edges, only after a rejection candle, with next-bar entries.",
      "Day 52 added the no-trade filters: strong trend, the opening period, scheduled news, ranges too narrow versus costs, and illiquid ETFs. Day 53 placed stops beyond the traded boundary, targets at the midpoint or before the far edge, and checked net reward ÷ risk after costs.",
      "Day 54 practised the full checklist in Replay, and Day 55 backtested it with costs and a train/out-of-sample split. A common finding is that range templates look acceptable before costs and weaker after them — your own results may differ, and any sample is limited.",
      "The pullback and range templates are opposites: one needs a trend, the other needs its absence. Knowing which conditions apply, and when neither does, is as important as either set of rules."
    ],
    why: [
      "Consolidating the range template now gives you two complete, comparable templates to examine properly in the backtesting phase.",
      "Seeing how costs affect a small-target strategy is one of the most practical lessons for intraday ETF study."
    ],
    how: [
      "Reread key points for days 50-55 and answer the quiz questions without notes.",
      "In Strategy Lab, check every range rule is observable at a candle close and has a number where needed.",
      "Compare Replay decisions (Day 54) with backtest trades (Day 55) and note any mismatch.",
      "Write ETF Range v1 in the Playbook: identification, filters, entry, stop, target, invalidation.",
      "Write two sentences comparing it with ETF Pullback v1: which market conditions each needs.",
      "Log the week's most common mistake in Mistake Lab."
    ],
    example: {
      title: "Hypothetical Playbook summary — ETF Range v1",
      lines: [
        "Template only; numbers are hypothetical settings to be tested, not recommendations.",
        "Range: 2+ touches each side within 0.05%, 20-EMA slope near zero, price crossing VWAP.",
        "Filters: no entries before 09:45 or after 14:45 IST, no scheduled news, width ≥ 4× round-trip cost %, liquid ETF only.",
        "Entry: rejection candle in the outer 25% of range; enter next bar open.",
        "Stop: beyond the boundary plus buffer. Target: slightly before the far edge. Net R:R ≥ 1.5.",
        "Invalidate: a close outside the range.",
        "Evidence so far: Replay 3 sessions, one backtest negative after costs — inconclusive and not a basis for real trading."
      ]
    },
    mistakes: [
      "Mixing pullback and range rules on the same chart without deciding the market type first.",
      "Dropping the cost filter because it removes most trades.",
      "Concluding the range template 'works' or 'doesn't work' from one small backtest.",
      "Adding new rules on review day instead of clarifying existing ones.",
      "Not writing the summary in the Playbook."
    ],
    quiz: [
      { q: "What market condition does each template need?", a: "Pullback needs an established trend; range needs a sideways market with a flat EMA and repeated boundary touches." },
      { q: "What are the range no-trade filters?", a: "Strong trend, opening period, scheduled news, range too narrow versus costs, and illiquid ETFs." },
      { q: "Where are range stops and targets placed?", a: "Stop just beyond the boundary traded from; target at the midpoint or slightly before the opposite boundary." }
    ]
  },

  57: {
    what: [
      "A backtest is only as honest as its assumptions. The most important is no look-ahead: a decision can only use information that existed at the time. In Trading → Backtest, indicators and signals are computed on a bar's close. The earliest possible fill is the next bar's open, and the simulator adds slippage to that price.",
      "Stops and targets are checked against each later bar's high and low. If both the stop and the target fall inside the same bar, the simulator cannot know which was hit first from OHLC data alone, so it assumes the stop was hit first. This is deliberately conservative: it may understate results, but it avoids flattering them.",
      "If a bar opens beyond your stop — a gap through the stop, for example after a sudden move between bars — the fill happens at that bar's open, not at your stop price. The loss can be larger than planned, which is what happens in real markets too.",
      "Because this is an intraday course, all open positions are squared off at the end of the session at the square-off time set in the app. No positions are carried overnight, so overnight gaps cannot rescue or ruin a trade."
    ],
    why: [
      "Look-ahead bias is the most common reason backtests look far better than reality: using a bar's close to enter at that same close, or using a day's high to decide something during that day. Knowing the fill rules lets you trust (and question) the report.",
      "Understanding the conservative assumptions also explains why Replay or Paper results may differ from the backtest."
    ],
    how: [
      "In Trading → Learn, review how signals, fills and exits are simulated (or read the notes inside Trading → Backtest).",
      "Run a short backtest of ETF Pullback v1 on one week of NIFTYBEES 5-minute data.",
      "Open the trade list and pick 3 trades; for each, find the signal bar, the next bar's open and the recorded fill.",
      "Check that fill = next bar open + slippage, and that stops were checked from the bar after entry.",
      "Look for any trade where stop and target were both inside one bar and confirm it was recorded as a stop.",
      "Find the last trade of a session and confirm it was squared off at the square-off time.",
      "In the Trading Journal, explain look-ahead bias in two sentences in your own words."
    ],
    example: {
      title: "Hypothetical bar-by-bar trace",
      lines: [
        "Hypothetical 5-minute bars; numbers for illustration only.",
        "10:15 bar closes ₹250.38 and the trigger condition is true → signal on close.",
        "10:20 bar opens ₹250.40 → fill ₹250.40 + ₹0.02 slippage = ₹250.42. Stop ₹250.00, target ₹251.20.",
        "10:35 bar: high ₹251.30, low ₹249.95 — both target and stop inside one bar → recorded as stop (conservative).",
        "Alternative: if the 10:35 bar had opened at ₹249.90 (below the stop), the exit would be ₹249.90, not ₹250.00.",
        "Any trade still open at the square-off time is closed then; nothing is held overnight."
      ]
    },
    mistakes: [
      "Assuming a signal on a bar's close can be filled at that same close.",
      "Expecting stops always to fill at the exact stop price.",
      "Thinking 'stop first' on ambiguous bars is a bug rather than a conservative choice.",
      "Using indicators that repaint or rely on future bars.",
      "Comparing backtest results with Paper results without accounting for fill differences."
    ],
    quiz: [
      { q: "When is a backtest signal computed and when is it filled?", a: "Computed on the bar's close; filled at the next bar's open plus slippage." },
      { q: "If stop and target are both hit in the same bar, what does the backtester assume?", a: "That the stop was hit first — a conservative assumption." },
      { q: "What happens if a bar opens beyond the stop?", a: "The exit fills at that bar's open, which can be worse than the stop price." }
    ]
  },

  58: {
    what: [
      "Every simulated intraday ETF trade carries several costs. Brokerage is typically the lower of ₹20 or 0.03% per executed order on discount brokers. STT on intraday equity ETF trades is about 0.025% on the sell side (gold and liquid ETFs typically have none). The NSE transaction charge is about 0.00297% of turnover, the SEBI fee is ₹10 per crore, stamp duty is about 0.003% on the buy side, and GST at 18% applies to brokerage plus exchange and SEBI charges.",
      "There are also costs that never appear on a contract note: the bid-ask spread (buying near the ask and selling near the bid) and slippage (getting a slightly worse price than expected, especially in fast moves or thin ETFs). In a backtest these must be assumed; the app lets you set a slippage value per trade.",
      "These rates change over time and differ between brokers. The figures here are illustrative; the cost model in Trading → Backtest and Trading → Paper is configurable, and you should keep it in line with current published rates.",
      "Costs matter more for intraday ETF trading than many beginners expect, because typical intraday moves on index ETFs are small percentages. A strategy that captures 0.15% per trade on average may keep only a fraction of that after costs."
    ],
    why: [
      "A strategy that looks positive before costs and negative after them has no edge in practice. Modelling costs honestly is the difference between a useful backtest and a misleading one.",
      "Testing with pessimistic slippage shows how fragile results are: if a small increase in slippage turns the result negative, the template has very little margin for error."
    ],
    how: [
      "Open the cost settings in Trading → Backtest and read each line item and its current value.",
      "Calculate one round trip by hand (buy then sell) using the example below as a template.",
      "Express total cost as a % of the buy value, then compare it with the average move your strategy targets.",
      "Use Trading → Practice's ETF eligibility check to review spread and traded value for your chosen ETF.",
      "Re-run your Day 48 or Day 55 backtest with slippage doubled and record the change in net P&L.",
      "Record the cost % and the slippage sensitivity in the Trading Journal."
    ],
    example: {
      title: "Hypothetical round-trip cost on NIFTYBEES",
      lines: [
        "Hypothetical: buy 400 units at ₹250.00 (₹1,00,000), sell at ₹251.00 (₹1,00,400). Rates illustrative and configurable.",
        "Brokerage: lower of ₹20 or 0.03% per order → ₹20 + ₹20 = ₹40.00.",
        "STT 0.025% on sell ₹1,00,400 = ₹25.10 · NSE charge 0.00297% on ₹2,00,400 = ₹5.95 · SEBI ₹0.20.",
        "Stamp duty 0.003% on buy ₹1,00,000 = ₹3.00 · GST 18% × (₹40 + ₹5.95 + ₹0.20) = ₹8.31.",
        "Explicit costs ≈ ₹82.56. Spread/slippage assumed ₹0.01 per unit each side = ₹8.00. Total ≈ ₹90.56.",
        "Gross profit ₹400 → net ≈ ₹309. Costs took about 23% of the gross gain on a 0.40% move.",
        "On a 0.10% move (gross ₹100), the same costs would leave about ₹9 — almost nothing."
      ]
    },
    mistakes: [
      "Backtesting with costs switched off or with zero slippage.",
      "Forgetting that brokerage applies on both the buy and the sell order.",
      "Assuming every ETF has the same spread as NIFTYBEES.",
      "Using outdated rates without checking the app's current cost settings.",
      "Ignoring that STT does not apply the same way to gold or liquid ETFs."
    ],
    quiz: [
      { q: "List the explicit cost items in an Indian intraday ETF trade.", a: "Brokerage, STT, exchange transaction charge, SEBI fee, stamp duty and GST." },
      { q: "Which two costs are not on the contract note but still matter?", a: "The bid-ask spread and slippage." },
      { q: "Why test with higher slippage?", a: "To see how fragile the result is; if a small increase turns it negative, the template has little margin." }
    ]
  },

  59: {
    what: [
      "A backtest report is a set of numbers that only make sense together. Win rate is the % of trades that made money after costs. On its own it says little: a 70% win rate with small wins and large losses can lose money, and a 35% win rate with large wins can be positive.",
      "Gross P&L is the result before costs; net P&L is after all costs. Profit factor = gross wins ÷ gross losses, where gross wins is the sum of all winning trades and gross losses is the sum of all losing trades (as a positive number), usually measured on net trade results. Above 1.0 means winners outweighed losers; close to 1.0 means a thin margin.",
      "Max drawdown is the largest fall in the equity curve from a peak to a later low. It shows the worst run of losses you would have had to sit through. Average win and average loss show the typical size of each; average R:R (reward-to-risk) is average win ÷ average loss, or the average realised R multiple.",
      "Expectancy is the average net result per trade: (win rate × average win) − (loss rate × average loss), or simply net P&L ÷ number of trades. It combines how often and how much. A positive expectancy in a backtest describes the past sample only."
    ],
    why: [
      "Focusing on one number — usually win rate or total P&L — leads to wrong conclusions. Reading the metrics together shows whether results came from many small wins, a few large ones, or a lucky streak.",
      "Drawdown in particular tells you about the emotional and risk-limit side: could you have followed the rules through that losing run in Paper trading?"
    ],
    how: [
      "Open the report from your Day 48 backtest in Trading → Backtest.",
      "Write down: trades, win rate, gross P&L, net P&L, profit factor, max drawdown, average win, average loss, expectancy.",
      "Recalculate expectancy by hand from win rate, average win and average loss; check it matches net P&L ÷ trades.",
      "Recalculate profit factor from gross wins and gross losses.",
      "Look at the equity curve in the report or in Analytics: is the result spread across the period or from one or two trades?",
      "Write one sentence per metric in the Trading Journal on what it says about this template."
    ],
    example: {
      title: "Hypothetical metrics worked by hand",
      lines: [
        "Hypothetical report, net of costs; for illustration only.",
        "40 trades: 18 wins, 22 losses → win rate 45%.",
        "Gross wins ₹9,000 · gross losses ₹7,200 → profit factor = 9,000 ÷ 7,200 = 1.25. Net P&L ₹1,800.",
        "Average win = 9,000 ÷ 18 = ₹500 · average loss = 7,200 ÷ 22 ≈ ₹327 → average R:R ≈ 1.53.",
        "Expectancy = 0.45 × 500 − 0.55 × 327 ≈ ₹45 per trade (= 1,800 ÷ 40).",
        "Max drawdown ₹2,100 — larger than the entire net result.",
        "Reading: a thin, positive past result with a deep drawdown; 40 trades is still a small sample."
      ]
    },
    mistakes: [
      "Judging a strategy by win rate alone.",
      "Quoting gross P&L as if it were net.",
      "Ignoring max drawdown because the final number is positive.",
      "Not checking whether one or two outlier trades produced most of the profit.",
      "Treating a positive expectancy as a promise of future profit."
    ],
    quiz: [
      { q: "How is profit factor calculated?", a: "Gross wins ÷ gross losses." },
      { q: "What is expectancy?", a: "The average net result per trade: (win rate × average win) − (loss rate × average loss), equal to net P&L ÷ trades." },
      { q: "What does max drawdown measure?", a: "The largest peak-to-low fall in the equity curve during the test." }
    ]
  },

  60: {
    what: [
      "If you build and adjust a strategy on the same data you then use to judge it, the result is biased: the rules have been shaped to fit that data. The fix is to split history by date. The earlier part is the training period — you study it, adjust rules and choose settings there. The later part is the out-of-sample period — you run the finished rules on it once, without changes.",
      "Splitting by date (not randomly) matters because markets change over time. Out-of-sample data that comes after the training period is the closest a backtest can get to 'the future' while still using history.",
      "Once you have looked at out-of-sample results, that data is no longer truly out-of-sample. If you change rules because of it and re-run, you are training on it. A new, later period would be needed for a fresh check.",
      "Expect out-of-sample results to be somewhat worse than training results. A modest drop is normal; a large drop, or a flip from positive to negative, usually means the rules were fitted to noise in the training data."
    ],
    why: [
      "Out-of-sample testing is the simplest guard against fooling yourself. It does not prove a strategy works, but it can reveal one that only worked on the data it was built on.",
      "It also builds a habit you will need in Paper trading: rules are fixed before you see the results."
    ],
    how: [
      "In Trading → Backtest, choose an ETF and a long date range (for example 9 months of 5-minute data).",
      "Set the split by date, e.g. first 6 months training, last 3 months out-of-sample.",
      "Run and study the training period; make at most one documented rule change and re-run training.",
      "Freeze the rules in Strategy Lab with a version number.",
      "Run the out-of-sample period once and record the same metrics side by side.",
      "In the Trading Journal, note the drop (or rise) in net expectancy and profit factor, and the trade count in each period."
    ],
    example: {
      title: "Hypothetical training vs out-of-sample table",
      lines: [
        "Hypothetical results for illustration only.",
        "Training (Jan-Jun): 64 trades · win rate 47% · profit factor 1.30 · expectancy ₹38 · max DD ₹2,400.",
        "Out-of-sample (Jul-Sep): 31 trades · win rate 42% · profit factor 1.05 · expectancy ₹6 · max DD ₹1,900.",
        "Reading: performance dropped sharply; the out-of-sample edge is close to zero after costs.",
        "Interpretation: possibly fitted to the training period, or market conditions changed — inconclusive either way.",
        "Not allowed: tweaking rules now and re-running Jul-Sep to 'fix' the result."
      ]
    },
    mistakes: [
      "Splitting randomly instead of by date.",
      "Re-running the out-of-sample period after changing rules and calling it out-of-sample.",
      "Making many rule changes in training and keeping the best version.",
      "Using an out-of-sample period with only a handful of trades.",
      "Reading similar train and out-of-sample results as proof of a future edge."
    ],
    quiz: [
      { q: "Why split history by date rather than randomly?", a: "Later data is the closest a backtest gets to the future, and markets change over time." },
      { q: "What should you never do with out-of-sample data?", a: "Adjust rules based on it and re-run — that turns it into training data." },
      { q: "What does a large drop from training to out-of-sample suggest?", a: "The rules were probably fitted to noise in the training data (or conditions changed)." }
    ]
  },

  61: {
    what: [
      "Overfitting means adjusting a strategy until it matches the past so closely that it is describing random noise rather than a repeatable behaviour. Signs include many parameters, oddly specific settings (an EMA of 17 with a 0.13% zone and no trades on Tuesdays), large gains from small setting changes, and a big drop in out-of-sample results.",
      "Every time you test a variation and keep the best one, you increase the chance that the winner looks good by luck. Testing 20 variations of a template and choosing the top one almost guarantees an impressive-looking backtest, even if none has any edge.",
      "Sample size is the other half of the problem. A handful of trades can produce almost any result by chance. As a rough working rule in this course, treat any result with fewer than about 30 trades as unreliable, and remember that even a few hundred trades only describe the period tested.",
      "Past results do not predict future results. More trades, fewer parameters and out-of-sample checks reduce the risk of fooling yourself, but nothing removes it."
    ],
    why: [
      "Overfitted backtests are the most convincing way to believe a strategy works when it does not. Recognising the signs protects you from treating noise as skill.",
      "Keeping a log of every variation you tested makes the risk visible: if you tried 15 versions, the best one deserves extra suspicion."
    ],
    how: [
      "List every parameter in ETF Pullback v1 and ETF Range v1 in Strategy Lab; count them.",
      "Check the trade count in every backtest you have run; mark any with fewer than ~30 trades as 'insufficient sample'.",
      "In Trading → Backtest, change one parameter slightly (e.g. EMA 20 → 22) and re-run training; note how much results change.",
      "If a small change swings results a lot, write 'fragile' next to that parameter.",
      "Create a variation log in the Trading Journal: date, version, change, trade count, net expectancy.",
      "Ask Trading → Ask AI to explain overfitting in a simple example, and compare with this lesson."
    ],
    example: {
      title: "Hypothetical overfitting warning",
      lines: [
        "Hypothetical results for illustration only.",
        "Variation log: 14 versions of the range template tested on the same training data.",
        "Best version: 22 trades · profit factor 2.10 · settings: lookback 37 bars, tolerance 0.07%, no entries 12:00-12:30.",
        "Neighbouring settings (lookback 35 or 40): profit factor 0.90 and 0.85.",
        "Out-of-sample for best version: 11 trades · profit factor 0.70.",
        "Reading: tiny sample, fragile settings, many attempts → strong signs of overfitting. Do not trust it."
      ]
    },
    mistakes: [
      "Testing many variations and reporting only the best one.",
      "Trusting results from fewer than about 30 trades.",
      "Adding filters to remove specific past losing trades.",
      "Choosing oddly precise settings because they scored highest.",
      "Believing a large sample proves future performance."
    ],
    quiz: [
      { q: "What is overfitting?", a: "Tuning rules until they match random noise in past data rather than a repeatable behaviour." },
      { q: "Below roughly how many trades should results be treated as unreliable in this course?", a: "About 30 trades." },
      { q: "Name two signs of overfitting.", a: "Any two of: many parameters, oddly specific settings, big swings from small setting changes, large drop out-of-sample, many variations tested." }
    ]
  },

  62: {
    what: [
      "A template that tested reasonably on NIFTYBEES might behave very differently on BANKBEES, ITBEES, JUNIORBEES or GOLDBEES. ETFs differ in volatility, typical intraday range, liquidity, spread and what drives them. Gold ETFs follow gold prices and currency moves rather than the equity market, and their tax and cost treatment differs (for example STT).",
      "A fair comparison keeps everything else equal: same date range, same timeframe, same rules, same cost and slippage settings, same train/out-of-sample split. Change only the ETF — or, when comparing strategies, only the strategy.",
      "Compare net metrics: net expectancy per trade, profit factor, max drawdown and trade count. Total P&L alone is misleading, because a strategy with more trades or a higher-priced ETF can show a larger number without being better.",
      "Thinly traded ETFs can show results that would never be achievable, because the backtest's slippage assumption may be far too optimistic for their real spreads. Check liquidity before including an ETF in a comparison."
    ],
    why: [
      "Comparing across ETFs shows whether a template's result depends on one instrument's history. A result that appears on only one ETF and one period deserves less confidence.",
      "It also helps you choose which ETF and template to practise in Paper trading — as a learning choice, not a profit decision."
    ],
    how: [
      "Choose 3 liquid ETFs, e.g. NIFTYBEES, BANKBEES and GOLDBEES; check each with Trading → Practice's ETF eligibility check.",
      "In Trading → Backtest, run ETF Pullback v1 on each with identical dates, timeframe, costs and split.",
      "Repeat with ETF Range v1 on the same three.",
      "Build a table in the Trading Journal: ETF × strategy, with trades, net expectancy, profit factor and max drawdown (out-of-sample).",
      "Mark any cell with fewer than ~30 trades as 'insufficient'.",
      "Use Evaluation or Analytics to review the comparison, and write two sentences on what it does and does not show."
    ],
    example: {
      title: "Hypothetical out-of-sample comparison table",
      lines: [
        "Hypothetical results for illustration only; same dates, 5m, same costs.",
        "Pullback · NIFTYBEES: 34 trades · expectancy ₹12 · PF 1.08 · max DD ₹1,600.",
        "Pullback · BANKBEES: 39 trades · expectancy ₹21 · PF 1.14 · max DD ₹2,300.",
        "Pullback · GOLDBEES: 18 trades · insufficient sample.",
        "Range · NIFTYBEES: 41 trades · expectancy −₹9 · PF 0.94 · max DD ₹1,800.",
        "Range · GOLDBEES: 33 trades · expectancy ₹4 · PF 1.03 · max DD ₹1,200.",
        "Reading: all results are thin and close to breakeven; none is evidence of a reliable edge."
      ]
    },
    mistakes: [
      "Comparing tests that used different dates, timeframes or cost settings.",
      "Ranking strategies by total P&L instead of net expectancy and drawdown.",
      "Including illiquid ETFs whose backtest fills are unrealistic.",
      "Picking the best cell in the table and ignoring the rest.",
      "Assuming gold ETFs behave like equity index ETFs."
    ],
    quiz: [
      { q: "What must be kept the same for a fair comparison?", a: "Dates, timeframe, rules, cost and slippage settings, and the train/out-of-sample split — change only one thing." },
      { q: "Why is total P&L a poor comparison metric?", a: "It depends on trade count and price level; net expectancy, profit factor and drawdown are more comparable." },
      { q: "Why might a thinly traded ETF's backtest be misleading?", a: "Its real spread and slippage may be much larger than the backtest assumes." }
    ]
  },

  63: {
    what: [
      "This week explained how to backtest properly. Day 57 covered the simulator: signals on bar close, fills at the next bar's open plus slippage, stops checked first when stop and target share a bar, gaps through stops filling at the open, and end-of-day square-off. Day 58 covered the Indian cost model: brokerage, STT, exchange charges, SEBI fee, stamp duty, GST, plus spread and slippage.",
      "Day 59 explained the metrics: win rate, gross versus net P&L, profit factor (gross wins ÷ gross losses), max drawdown, average win and loss, average R:R and expectancy. Day 60 split history by date into training and out-of-sample periods. Day 61 covered overfitting and sample size, with fewer than about 30 trades treated as unreliable. Day 62 compared strategies across ETFs fairly.",
      "The central idea: a backtest is a careful description of how fixed rules would have behaved on past data under stated assumptions. It is a tool for rejecting weak ideas and understanding risk, not for predicting profit. Past results do not predict future results.",
      "Next phase moves to Paper trading with virtual money on replayed sessions, where you will compare live-style decisions with what the backtest expected."
    ],
    why: [
      "A written backtest checklist makes every future test comparable and honest, and helps you notice when a result is too good to be true.",
      "Understanding the gap between backtest assumptions and real execution prepares you to interpret Paper results calmly."
    ],
    how: [
      "Reread key points for days 57-62 and answer the quiz questions without notes.",
      "Write a backtest checklist in the Playbook: fixed rules, no look-ahead, costs on, realistic slippage, date split, ≥ ~30 trades, net metrics, variation log.",
      "Review your variation log and count how many versions you tested.",
      "Re-read your cross-ETF table and choose one template and one ETF to practise in Paper next phase — as a learning choice.",
      "Write down the backtest metrics you expect to compare against in Paper trading.",
      "Log the week's most important lesson in the Trading Journal."
    ],
    example: {
      title: "Hypothetical backtest checklist",
      lines: [
        "A template checklist; settings are hypothetical.",
        "1. Rules written and versioned before running (e.g. Pullback v1.1).",
        "2. Signal on close, fill next open + slippage; stop-first on ambiguous bars; square-off at end of day.",
        "3. Cost model on and current; slippage also tested at 2×.",
        "4. Training vs out-of-sample split by date; out-of-sample run once.",
        "5. Trade count ≥ ~30 in each period, else 'inconclusive'.",
        "6. Read net expectancy, profit factor, max drawdown, average win/loss together.",
        "7. Reminder: past results do not predict future results."
      ]
    },
    mistakes: [
      "Skipping the checklist when a result looks exciting.",
      "Treating a backtest as proof that a strategy will work.",
      "Forgetting to compare Paper results against the backtest's assumptions next phase.",
      "Hiding the number of variations tested.",
      "Choosing the Paper strategy purely by the highest backtest P&L."
    ],
    quiz: [
      { q: "Summarise the backtester's fill rules.", a: "Signal on bar close; fill at next bar open plus slippage; stop assumed first if stop and target share a bar; gaps fill at the open; square-off at end of day." },
      { q: "Which metrics should be read together?", a: "Win rate, net P&L, profit factor, max drawdown, average win and loss, average R:R and expectancy — with trade count." },
      { q: "What can a good backtest tell you about the future?", a: "Nothing guaranteed — past results do not predict future results." }
    ]
  }
};
