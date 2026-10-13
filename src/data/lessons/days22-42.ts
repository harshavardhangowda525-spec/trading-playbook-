import type { LessonContent } from './types';

// Days 22-42: Phase 4 Risk Management, Phase 5 Trend-Following, Phase 6 Breakout.
// ETF-only, educational and simulation content — not financial advice. All prices, volumes and results are hypothetical.
// Cost figures use typical published rates at the time of writing; rates change and are configurable in the app.

export const CONTENT: Record<number, LessonContent> = {
  22: {
    what: [
      "Risk per trade is the number of rupees you accept losing on one simulated trade if your stop-loss is hit. It is usually set as a small percentage of the account. With a hypothetical ₹1,00,000 virtual account and a 0.5% rule, the risk budget is ₹500 per trade. This number is decided before you look for a trade, not after.",
      "Position sizing is the step that converts that rupee risk into a number of ETF units. The formula is: units = risk budget ÷ (entry - stop). The gap between entry and stop is the risk per unit. A tight stop allows more units; a wide stop allows fewer units — but the rupee loss at the stop stays the same.",
      "There is a second limit: capital. In the simulator you cannot buy more ETF units than your virtual capital allows (the app does not assume leverage). If the formula says 400 units but 400 units cost more than the account, you cap the size at what the capital can pay for, and your actual rupee risk becomes smaller than the budget.",
      "R is shorthand for the rupee risk of one trade. A loss at the stop is -1R; a win of twice the risk is +2R. Thinking in R lets you compare trades on NIFTYBEES at around ₹270 with trades on GOLDBEES or JUNIORBEES at very different prices."
    ],
    why: [
      "Most beginner accounts are damaged not by one bad idea but by inconsistent size: a few oversized losses wipe out many small wins. Fixed-percentage risk keeps every loss roughly the same size, so a losing streak is survivable and your results reflect your rules rather than random sizing.",
      "Sizing from the stop also forces you to define the stop first. If you cannot say where the idea is wrong, you cannot calculate a size — which is a useful signal that there is no trade yet."
    ],
    how: [
      "Decide your risk % for all simulated trades this phase (0.25% to 1% is common in education; 0.5% is used in these examples) and write it in your Playbook.",
      "Open Trading → Replay on a NIFTYBEES 5m session and pick a hypothetical entry price and a logical stop price.",
      "Calculate risk per unit = entry - stop, then units = risk budget ÷ risk per unit, rounding down to a whole unit.",
      "Calculate position value = units × entry. If it is more than your virtual capital, cap units at capital ÷ entry, rounded down.",
      "Recalculate the actual rupee risk = final units × risk per unit, and note it in R terms.",
      "In Trading → Paper, check the risk limit settings so the per-trade risk matches the number you wrote down.",
      "Repeat for five different setups and log each calculation in the Trading Journal."
    ],
    example: {
      title: "Hypothetical NIFTYBEES 5m trade — position sizing (illustrative numbers only)",
      lines: [
        "Virtual account ₹1,00,000 × 0.5% risk = ₹500 risk budget.",
        "Hypothetical entry ₹270.00, stop ₹268.75 → risk per unit = ₹1.25.",
        "Units = ₹500 ÷ ₹1.25 = 400 units.",
        "Position value = 400 × ₹270.00 = ₹1,08,000 — more than the ₹1,00,000 capital.",
        "Capital cap: ₹1,00,000 ÷ ₹270.00 = 370.37 → 370 units (₹99,900).",
        "Actual risk = 370 × ₹1.25 = ₹462.50, about 0.93R of the ₹500 budget.",
        "Same idea with a stop at ₹268.50 (₹1.50 per unit): ₹500 ÷ ₹1.50 = 333 units, value ₹89,910 — within capital."
      ]
    },
    mistakes: [
      "Choosing the number of units first and the stop afterwards, which makes the rupee risk random.",
      "Forgetting the capital cap and assuming you can always buy the full formula size.",
      "Rounding units up instead of down, which quietly pushes risk above the budget.",
      "Raising the risk % after a loss to 'win it back faster'.",
      "Comparing ETFs by rupee profit instead of by R, which hides that one trade risked far more than another."
    ],
    quiz: [
      { q: "What is the position sizing formula?", a: "Units = risk budget ÷ (entry - stop), rounded down." },
      { q: "With ₹500 risk and a ₹2.00 stop distance, how many units?", a: "₹500 ÷ ₹2.00 = 250 units (then check the capital cap)." },
      { q: "What happens to your rupee risk when the capital cap reduces the size?", a: "It becomes smaller than the risk budget: final units × risk per unit." }
    ]
  },

  23: {
    what: [
      "A stop-loss is a pre-decided price at which a simulated position is closed because the trade idea has been proven wrong. It is not a guess about how much pain you can bear; it is the price at which the reason for the trade no longer holds.",
      "For a long trade in an intraday uptrend, the idea is usually 'buyers are defending higher lows'. So the logical stop sits just below the last swing low — if price trades there, the higher-low structure has broken. For a breakout, the idea is 'price has left the range', so the stop sits back inside the range.",
      "A buffer is a small extra distance beyond the level, so the stop is not triggered by the spread or a single wick. On a liquid ETF like NIFTYBEES a few paise to ₹0.10 may be enough; thinly traded ETFs with wide spreads need more room — or should be skipped.",
      "A stop-loss order in Trading → Paper is triggered when price reaches the stop price. In fast moves the fill can be worse than the stop price; this difference is called slippage, and it is why the backtester also models costs and spread."
    ],
    why: [
      "The stop decides both your rupee risk and your position size. A stop that is too tight gets hit by normal noise, turning good ideas into losses plus costs. A stop that is too wide forces a tiny position or invites oversized losses.",
      "Placing the stop at a structural level also makes your trades testable: the rule 'stop ₹0.10 below the last swing low' can be coded and measured in Trading → Backtest, whereas 'stop where it feels right' cannot."
    ],
    how: [
      "Open Trading → Replay on a NIFTYBEES or BANKBEES 5m session and pause on a candidate long setup.",
      "Write one sentence describing the trade idea, then identify the level that would prove it wrong (last swing low, range low or range midpoint).",
      "Place the stop just beyond that level, adding a buffer at least as wide as the typical spread.",
      "Calculate the stop distance and the resulting position size with the Day 22 formula.",
      "If the stop is so wide that the size becomes tiny, or so tight that it sits inside normal candle noise, mark the setup as No-Trade.",
      "In Trading → Paper, attach the stop-loss to the order before it is filled, never after.",
      "Log ten stops in the Trading Journal with the level used and whether the stop was hit by structure or by noise."
    ],
    example: {
      title: "Hypothetical NIFTYBEES 5m long — structure-based stop (illustrative numbers only)",
      lines: [
        "Last swing low ₹268.60; buffer ₹0.10 → stop ₹268.50.",
        "Hypothetical entry ₹270.00 → risk per unit = ₹270.00 - ₹268.50 = ₹1.50.",
        "Units = ₹500 ÷ ₹1.50 = 333.33 → 333 units; value 333 × ₹270 = ₹89,910 (within capital).",
        "Rupee risk at the stop = 333 × ₹1.50 = ₹499.50 = 1R (before costs).",
        "A 'tight' stop at ₹269.80 (₹0.20) sits inside normal 5m noise — likely to be hit randomly.",
        "Rule: the stop follows the structure; the size adjusts to the stop, not the other way round."
      ]
    },
    mistakes: [
      "Placing the stop at a round rupee amount ('I will lose ₹300') instead of at a level that invalidates the idea.",
      "Putting the stop exactly at the swing low with no buffer, where spread and wicks trigger it.",
      "Moving the stop further away once price approaches it, which turns a 1R loss into a much larger one.",
      "Trading thin ETFs where the spread alone is a large share of the stop distance.",
      "Entering first and deciding the stop later."
    ],
    quiz: [
      { q: "Where does a logical stop go for a long trade based on higher lows?", a: "Just below the last swing low, plus a small buffer." },
      { q: "If the stop gets wider, what should happen to position size?", a: "It should get smaller so the rupee risk stays the same." },
      { q: "What is slippage?", a: "The difference between the stop or intended price and the actual fill price." }
    ]
  },

  24: {
    what: [
      "Risk/reward (R:R) compares the planned gain at the target with the planned loss at the stop. A trade that risks ₹500 to aim for ₹750 is 1:1.5, or a 1.5R target.",
      "The break-even win rate is the percentage of trades you must win just to finish flat. Before costs it is 1 ÷ (1 + reward/risk). At 1:1 you need 50%; at 1:1.5 you need 40%; at 1:2 you need about 33.3%.",
      "Costs change that. Every round trip pays brokerage (typically the lower of ₹20 or 0.03% per order at discount brokers), STT on intraday equity ETFs (about 0.025% on the sell side; gold and liquid ETFs differ), NSE transaction charges (about 0.00297%), SEBI fees (₹10 per crore), stamp duty (0.003% on the buy side) and 18% GST on brokerage, exchange and SEBI charges — plus spread and slippage. These rates change and are configurable in the app.",
      "With costs, a win is smaller (gross win - costs) and a loss is bigger (gross loss + costs). The net break-even win rate = net loss ÷ (net win + net loss). This is the number to compare with your backtest win rate."
    ],
    why: [
      "A strategy that looks profitable before costs can be a slow loser after them, especially intraday where moves are small and trades are frequent. Knowing your net break-even win rate stops you from celebrating a 45% win rate that actually loses money.",
      "R:R and win rate always trade off. Bigger targets are hit less often; smaller targets are hit more often but costs take a larger share. Only the backtester, run after costs, can tell you where a given template lands."
    ],
    how: [
      "Use the cost calculator settings in Trading → Backtest to see the round-trip cost for your typical position size on NIFTYBEES.",
      "Write your typical 1R in rupees (from Day 22) and the planned target in R.",
      "Compute net win = target R × 1R - costs, and net loss = 1R + costs.",
      "Compute net break-even win rate = net loss ÷ (net win + net loss).",
      "Repeat for 1R, 1.5R and 2R targets and compare the gap between gross and net break-even.",
      "Open a recent backtest report and compare its after-cost win rate with your net break-even number.",
      "Record all three break-even rates in your Playbook."
    ],
    example: {
      title: "Hypothetical break-even calculation, ~₹1,00,000 position on NIFTYBEES (illustrative)",
      lines: [
        "Per side ~₹99,900: brokerage ₹20 + ₹20 = ₹40; STT 0.025% on sell ~ ₹24.98; exchange 0.00297% on ₹1,99,800 ~ ₹5.93.",
        "SEBI ~ ₹0.20; stamp 0.003% on buy ~ ₹3.00; GST 18% × (₹40 + ₹5.93 + ₹0.20) ~ ₹8.30.",
        "Round-trip cost ~ ₹82, rounded to ₹80 here, before spread and slippage.",
        "Plan: risk 1R = ₹500, target 1.5R = ₹750.",
        "Gross break-even = 1 ÷ (1 + 1.5) = 40%.",
        "Net win = ₹750 - ₹80 = ₹670; net loss = ₹500 + ₹80 = ₹580.",
        "Net break-even = ₹580 ÷ (₹670 + ₹580) = ₹580 ÷ ₹1,250 = 46.4%.",
        "Costs alone raised the required win rate by 6.4 percentage points."
      ]
    },
    mistakes: [
      "Using the textbook break-even (40% at 1:1.5) and ignoring costs entirely.",
      "Forgetting that STT and brokerage apply to every round trip, including scratch trades.",
      "Choosing a far target only to improve R:R, without checking how often the backtest reaches it.",
      "Assuming gold ETF cost structure is the same as equity ETFs — the STT treatment differs.",
      "Comparing a backtest run without costs to a paper session with costs."
    ],
    quiz: [
      { q: "What is the gross break-even win rate at 1:2?", a: "1 ÷ (1 + 2) ~ 33.3%." },
      { q: "How do costs change a win and a loss?", a: "A win becomes gross win - costs; a loss becomes gross loss + costs." },
      { q: "Write the net break-even formula.", a: "Net loss ÷ (net win + net loss)." }
    ]
  },

  25: {
    what: [
      "A daily loss limit is the maximum the virtual account may lose in one session. When it is reached, you stop placing new trades for the day — no exceptions. It is usually set as a multiple of R, for example 3R.",
      "A cooldown is a forced pause after a defined trigger, such as two consecutive losing trades. During the cooldown you may watch the chart and journal, but you cannot enter. Trading → Paper can enforce a daily loss cooldown so the rule does not depend on willpower.",
      "Both rules exist because losses affect decisions. After a few losses, traders tend to enlarge size, loosen criteria or chase moves to recover — often called revenge trading. A hard limit removes that option.",
      "These limits apply to closed and open losses. If an open position would push the day past the limit at its stop, the trade is too large for the remaining allowance."
    ],
    why: [
      "A single bad day can undo weeks of careful simulated results. Capping the day at a few R keeps any one session from dominating your record, so your statistics reflect the strategy rather than one emotional afternoon.",
      "The cooldown also protects data quality: trades taken in frustration are not trades from your template, and they pollute the results you will compare with the backtest."
    ],
    how: [
      "Choose a daily loss limit in R (e.g. 3R) and convert it to rupees using your risk per trade.",
      "Choose a cooldown trigger (e.g. two consecutive losses) and a length (e.g. 30 minutes).",
      "Enter both in Trading → Paper risk limits before starting the session.",
      "Write the rules at the top of your Playbook and read them before each session.",
      "During the session, after each loss, update your running daily P&L in R.",
      "When the limit or cooldown triggers, stop, and write what you were feeling in the Psychology journal.",
      "At session end, review the Paper session report to confirm the rules were respected."
    ],
    example: {
      title: "Hypothetical paper session with a 3R daily limit (illustrative numbers only)",
      lines: [
        "Virtual account ₹1,00,000; 1R = ₹500; daily limit 3R = ₹1,500.",
        "Trade 1: -1R (-₹500 - ₹80 costs = -₹580).",
        "Trade 2: -1R (-₹580). Two consecutive losses → 30-minute cooldown starts.",
        "Running P&L = -₹1,160, which is 2.32R once costs are counted.",
        "Remaining allowance = ₹1,500 - ₹1,160 = ₹340 — less than a full 1R trade at ₹580 all-in.",
        "Rule outcome: no further trades today, even if a setup appears after the cooldown."
      ]
    },
    mistakes: [
      "Setting the limit after the session has started, when emotions are already involved.",
      "Counting the limit before costs, so the real loss exceeds the limit.",
      "Overriding the cooldown 'because this setup is perfect'.",
      "Doubling size on the next trade to recover the day's losses.",
      "Ignoring open-position risk when calculating the remaining allowance."
    ],
    quiz: [
      { q: "With 1R = ₹500, what is a 3R daily limit in rupees?", a: "₹1,500." },
      { q: "What is a cooldown?", a: "A forced pause in trading after a trigger such as two consecutive losses." },
      { q: "Why include costs when tracking the daily limit?", a: "Costs are real losses; ignoring them lets the day exceed the limit." }
    ]
  },

  26: {
    what: [
      "A max-trades rule caps how many simulated trades you may take in one session, for example three. Once the cap is reached, you stop, regardless of results.",
      "No-trade rules are written conditions under which you take no position at all. Examples for intraday ETFs: the spread is wider than a set number of paise; traded value is below a threshold; the session is choppy (Day 32); the first five minutes after 09:15 IST; an ETF trading at an unusual premium or discount to iNAV; or simply no setup that matches your template.",
      "In Trading → Replay, No-Trade is one of the three decisions you can lock, alongside Long and Short. It is scored like any other decision: standing aside when the rules say stand aside is a correct process.",
      "Every trade has a fixed cost drag. With round-trip costs around ₹80 on a ₹1,00,000 position, ten trades cost about ₹800 before a single rupee of edge — more than 1.5R at a ₹500 risk."
    ],
    why: [
      "Overtrading is one of the most common ways intraday traders lose: each extra trade adds costs and usually has lower quality than the first ones. A cap forces you to choose the best setups.",
      "Written no-trade conditions make 'doing nothing' a deliberate decision instead of a failure, which reduces the urge to trade out of boredom."
    ],
    how: [
      "Decide a max-trades number for each paper session and enter it in Trading → Paper risk limits.",
      "Write at least five no-trade conditions in your Playbook, each one measurable (spread, traded value, time, EMA slope, iNAV deviation).",
      "Use Trading → Practice to run the ETF eligibility check on your watchlist before the open.",
      "In Trading → Replay, play three sessions and lock No-Trade whenever a written condition applies.",
      "Count how many decisions were No-Trade and note which condition triggered each one.",
      "Review the Replay process score to see whether your No-Trade calls followed your rules."
    ],
    example: {
      title: "Hypothetical cost of overtrading (illustrative numbers only)",
      lines: [
        "Round-trip cost ~ ₹80 per trade on a ~₹1,00,000 NIFTYBEES position; 1R = ₹500.",
        "Session A: 3 trades → costs = 3 × ₹80 = ₹240 = 0.48R.",
        "Session B: 10 trades → costs = 10 × ₹80 = ₹800 = 1.6R.",
        "Session B must earn 1.6R of gross edge just to break even on costs.",
        "No-trade example: spread ₹0.05 on a ₹0.40 target = 12.5% of the move lost to spread alone → skip."
      ]
    },
    mistakes: [
      "Treating a No-Trade day as wasted, then forcing a low-quality trade late in the session.",
      "Writing vague no-trade rules ('if it looks messy') that cannot be checked.",
      "Raising the max-trades cap mid-session after early losses.",
      "Trading illiquid ETFs because they 'moved a lot', ignoring spread and traded value.",
      "Counting only winning trades toward the cap."
    ],
    quiz: [
      { q: "Ten trades at ₹80 round-trip cost each costs how much in R if 1R = ₹500?", a: "₹800 ÷ ₹500 = 1.6R." },
      { q: "Name two measurable no-trade conditions.", a: "For example: spread above a set limit; traded value below a threshold; flat EMA; first five minutes." },
      { q: "How is No-Trade treated in Trading → Replay?", a: "As a lockable decision that is scored for process like Long or Short." }
    ]
  },

  27: {
    what: [
      "Edge is the average amount a set of rules makes per trade over many trades. Costs are what you pay per trade regardless of outcome. A setup is only worth simulating if the expected move is large enough for edge to survive costs.",
      "A practical way to compare them is cost per unit: round-trip cost ÷ units. On a ~₹1,00,000 position of 370 NIFTYBEES units at ₹270 with ~₹82 costs, cost per unit ~ ₹0.22 — about 0.08% of price. A target move of ₹0.30 would lose most of its value to costs.",
      "A simple educational filter is: target move ≥ 3× cost per unit (plus spread). This is a starting threshold to test, not a law. Intraday ETF moves are often smaller than the same index's moves feel, so this filter removes many setups.",
      "Price level, position size and ETF type all change cost per unit. Brokerage is capped at ₹20 per order, so very small positions pay a higher percentage; gold ETFs have no STT on intraday sells in the cost facts used here, so their cost per unit differs."
    ],
    why: [
      "Many beginner intraday plans are built around tiny moves that look fine on a chart but are mostly consumed by brokerage, STT and spread. Checking cost per unit against the target before trading keeps you from building a strategy whose only reliable result is paying costs.",
      "It also explains why the backtester must always be run with costs switched on: a gross-profitable template can be net-negative."
    ],
    how: [
      "In Trading → Backtest, look at a trade list and note the cost charged per trade.",
      "Divide that cost by the number of units to get cost per unit.",
      "For each trade, compare the planned target move per unit with cost per unit.",
      "Flag trades where the target is less than 3× cost per unit, and compare their net results with the rest.",
      "Check the spread on the ETF in Trading → Markets or the Replay data and add it to the cost per unit.",
      "Write your minimum worthwhile target move for NIFTYBEES and one other ETF in your Playbook."
    ],
    example: {
      title: "Hypothetical cost vs target check on NIFTYBEES (illustrative numbers only)",
      lines: [
        "370 units at ₹270; round-trip cost ~ ₹82 → cost per unit = ₹82 ÷ 370 ~ ₹0.22.",
        "Setup A: target move ₹0.30 → gross ₹111; net ₹111 - ₹82 = ₹29 — costs took about 74%.",
        "Setup B: target move ₹1.20 → gross ₹444; net ₹444 - ₹82 = ₹362 — costs took about 18%.",
        "Filter: target ≥ 3 × ₹0.22 = ₹0.66 per unit, plus spread.",
        "Setup A fails the filter; Setup B passes. Passing does not mean B will work — only that costs do not rule it out."
      ]
    },
    mistakes: [
      "Planning targets in ticks or paise without converting costs to the same per-unit terms.",
      "Ignoring the spread, which is an extra cost on every entry and exit.",
      "Assuming lower brokerage makes small moves profitable — STT and other charges remain.",
      "Using a small position size where the ₹20-or-0.03% brokerage rule makes costs a larger percentage.",
      "Reporting backtest results without costs because they 'look better'."
    ],
    quiz: [
      { q: "How do you calculate cost per unit?", a: "Round-trip cost ÷ number of units." },
      { q: "With cost per unit ₹0.22, what minimum target does a 3× filter require?", a: "About ₹0.66 per unit, plus spread." },
      { q: "Why can a gross-profitable strategy lose money net?", a: "Costs on every trade can exceed the small average gross edge." }
    ]
  },

  28: {
    what: [
      "This week you built a risk framework that every strategy in later phases uses. Day 22: size positions from a fixed rupee risk budget with units = risk budget ÷ (entry - stop), capped by virtual capital. Day 23: place stops where the trade idea is invalidated, with a buffer for spread.",
      "Day 24: convert R:R into a net break-even win rate that includes round-trip costs. Day 25: cap each session with a daily loss limit and enforce a cooldown after consecutive losses. Day 26: limit trades per day and write measurable no-trade rules.",
      "Day 27: compare target moves with cost per unit, so setups too small to survive costs are filtered out before you test them.",
      "Together these rules do not create an edge — they protect the account while you find out, in the backtester and on paper, whether a template has one."
    ],
    why: [
      "Strategies in Phases 5 to 8 will have losing streaks; that is normal. Whether a losing streak is a learning experience or an account-ending event in your simulation depends on this week's rules.",
      "Writing the rules down now means you will judge each strategy with the same yardstick, instead of changing risk rules to fit results."
    ],
    how: [
      "Re-read the Risk module in Trading → Learn.",
      "Write a one-page risk plan in your Playbook: risk %, sizing formula, stop rule, daily limit, cooldown, max trades, no-trade list, minimum target vs cost.",
      "Set the matching limits in Trading → Paper.",
      "Run one full Trading → Paper session on a replayed NIFTYBEES day, following the plan strictly.",
      "Review the session report: did any trade exceed 1R, any rule get broken?",
      "Record rule breaks in the Mistake Lab with the trigger that caused them.",
      "Answer the quiz questions from Days 22-27 without notes."
    ],
    example: {
      title: "Hypothetical one-page risk plan summary (illustrative numbers only)",
      lines: [
        "Virtual account ₹1,00,000; risk 0.5% → 1R = ₹500.",
        "Units = ₹500 ÷ (entry - stop), rounded down, capped by capital.",
        "Stop beyond swing low / range edge + buffer; never widened mid-trade.",
        "Costs ~ ₹80 per round trip at ~₹1,00,000; 1.5R target → net break-even ~ 46.4%.",
        "Daily limit 3R (₹1,500) incl. costs; cooldown 30 min after 2 losses; max 3 trades.",
        "Skip if target < 3× cost per unit, spread too wide, or session choppy."
      ]
    },
    mistakes: [
      "Writing a risk plan but not setting the matching limits in Trading → Paper.",
      "Treating the risk plan as permanent before any strategy has been tested.",
      "Changing risk % between strategies, which makes their results incomparable.",
      "Skipping the review because the week was 'just theory'.",
      "Believing good risk rules turn a negative-edge strategy into a positive one."
    ],
    quiz: [
      { q: "What two inputs determine position size?", a: "The rupee risk budget and the distance from entry to stop (then the capital cap)." },
      { q: "Why is net break-even higher than gross break-even?", a: "Costs shrink wins and enlarge losses." },
      { q: "Can risk management create an edge?", a: "No — it limits damage while the edge (if any) is measured." }
    ]
  },

  29: {
    what: [
      "A moving average is the average of the last N closing prices, recalculated on every new bar. A simple moving average (SMA) weights every close equally. An exponential moving average (EMA) gives more weight to recent closes, so it reacts faster.",
      "The EMA is calculated as: new EMA = previous EMA + k × (close - previous EMA), where k = 2 ÷ (N + 1). For a 20-period EMA, k = 2 ÷ 21 ~ 0.0952. On a 5-minute chart, the 20-EMA covers roughly the last 100 minutes of trading.",
      "Slope is the direction the EMA is moving. A rising 20-EMA means recent closes are, on average, above older ones; a flat EMA means price is going sideways. Price above a rising EMA is a simple description of an intraday uptrend; price below a falling EMA describes a downtrend.",
      "VWAP (volume-weighted average price, from Day 11) is a second reference. When price is above both a rising 20-EMA and VWAP, both the short-term average and the session's volume-weighted average agree that buyers have been in control so far."
    ],
    why: [
      "Moving averages turn a subjective impression ('it looks like it is going up') into a rule a backtester can check. That is the first step from opinion to a testable template.",
      "They also lag: by definition an average reacts after price moves. That is why they work better as filters for direction than as precise entry signals, and why they struggle in choppy sessions."
    ],
    how: [
      "Open Trading → Replay on a NIFTYBEES 5m session with the 20-EMA and VWAP displayed.",
      "Step through the first hour and note where the EMA is rising, falling and flat.",
      "Mark each bar where price crosses the EMA, and count crosses per hour.",
      "Note whether price is above or below VWAP at each EMA cross.",
      "Repeat on GOLDBEES and compare how often the EMA flattens.",
      "Write a one-line definition of 'rising EMA' you could test, e.g. the 20-EMA now is higher than it was 5 bars ago."
    ],
    example: {
      title: "Hypothetical 20-EMA update on NIFTYBEES 5m (illustrative numbers only)",
      lines: [
        "k = 2 ÷ (20 + 1) ~ 0.0952.",
        "Previous EMA ₹270.00; new close ₹270.60.",
        "New EMA = ₹270.00 + 0.0952 × (₹270.60 - ₹270.00) = ₹270.00 + ₹0.057 ~ ₹270.06.",
        "EMA five bars ago ₹269.70 → now ₹270.06 → rising by ₹0.36.",
        "Price ₹270.60 is above the rising EMA and above VWAP ₹269.90 → uptrend filter passes on this bar."
      ]
    },
    mistakes: [
      "Treating a price cross of the EMA as a buy or sell signal by itself.",
      "Ignoring slope: price above a flat EMA says little about trend.",
      "Changing the EMA length every day to match what just happened.",
      "Forgetting that EMA values depend on the timeframe — a 20-EMA on 1m is very different from one on 15m.",
      "Expecting moving averages to predict turns rather than describe them."
    ],
    quiz: [
      { q: "What is k for a 20-period EMA?", a: "2 ÷ 21 ~ 0.0952." },
      { q: "Why does an EMA react faster than an SMA?", a: "It gives more weight to recent closes." },
      { q: "What does a flat 20-EMA suggest?", a: "Price is moving sideways; there is no clear intraday trend." }
    ]
  },

  30: {
    what: [
      "The trend entry template in this course has two filters and one trigger, all for long trades on a 5-minute chart. Filter 1: the close is above a rising 20-EMA. Filter 2: the close is above session VWAP. Trigger: a candle closes above the prior swing high. The short version mirrors these rules and can be tested in simulation.",
      "The prior swing high is the most recent peak with lower highs on both sides (Day 17). A close above it means buyers pushed price past the last point where sellers had won — a continuation of higher highs.",
      "Entry happens at the open of the next bar after the trigger candle closes. This matches how the backtester fills orders: it cannot know a candle's close until the candle has finished, so filling inside that same candle would be look-ahead bias.",
      "This is a template to test, not a system that always works. Its value is that every part is objective, so you can measure it in Trading → Backtest after costs and see whether it has any edge on a given ETF and timeframe."
    ],
    why: [
      "Without written rules, entries drift with mood: chasing after big candles, hesitating on clean setups. A fixed trigger lets you compare your Replay decisions with the rules and measure where you deviate.",
      "Requiring both filters reduces trades in sessions without direction, which reduces cost drag — though it also means fewer trades to learn from."
    ],
    how: [
      "Write the template in your Playbook: 5m, close > rising 20-EMA, close > VWAP, close > prior swing high, enter next bar open.",
      "Open Trading → Replay on a NIFTYBEES 5m session and mark swing highs as they form, without looking ahead.",
      "On each candle close, check filter 1, filter 2, then the trigger, in that order.",
      "When all three pass, lock Long and record the next bar's open as the hypothetical entry.",
      "Calculate the stop below the last swing low and size the position with the Day 22 formula.",
      "Check the target move against cost per unit (Day 27) and skip if it fails.",
      "Log ten triggers and which filter blocked any setups that looked tempting."
    ],
    example: {
      title: "Hypothetical NIFTYBEES 5m trend entry (illustrative numbers only)",
      lines: [
        "20-EMA ₹269.80 and rising; VWAP ₹269.60; prior swing high ₹270.40.",
        "Candle closes at ₹270.45 → above EMA, above VWAP, above swing high → trigger.",
        "Entry at next bar open: ₹270.50.",
        "Last swing low ₹269.10; buffer ₹0.10 → stop ₹269.00 → risk per unit ₹1.50.",
        "Units = ₹500 ÷ ₹1.50 = 333; value 333 × ₹270.50 = ₹90,076.50 (within capital).",
        "Risk at stop = 333 × ₹1.50 = ₹499.50 (1R) before costs of about ₹80."
      ]
    },
    mistakes: [
      "Entering intrabar before the trigger candle has closed, which a backtest cannot reproduce.",
      "Accepting a falling or flat EMA because price is 'above it anyway'.",
      "Using a minor one-candle wiggle as the prior swing high.",
      "Skipping the VWAP filter on days you feel bullish.",
      "Assuming the template works because a few Replay examples looked good."
    ],
    quiz: [
      { q: "What are the two filters in the trend template?", a: "Close above a rising 20-EMA and close above VWAP on 5m." },
      { q: "Why enter at the next bar's open?", a: "The trigger candle's close is only known after it finishes; filling earlier is look-ahead." },
      { q: "What is the trigger?", a: "A candle close above the prior swing high." }
    ]
  },

  31: {
    what: [
      "The initial stop for a trend long sits below the last swing low plus a buffer (Day 23). It defines 1R and does not move further away.",
      "A trailing stop moves in the direction of the trade as it progresses. In this template, each time a new higher low forms, the stop is raised to just below it. The stop never moves down.",
      "An alternative exit is a 5-minute close below the 20-EMA: the trend filter that justified the entry no longer holds. This usually exits earlier than a swing-low trail and gives up less profit but also catches fewer large moves.",
      "Intraday templates also have a time exit: all positions are closed before the end of the session (for example by 15:15 IST), because this course does not hold positions overnight."
    ],
    why: [
      "Entries get most of the attention, but exits decide the size of wins and losses, and therefore expectancy. Two traders with the same entry and different exits can have opposite results.",
      "Testing exits separately in the backtester shows which one suits a given ETF: quieter ETFs may need a fixed target, trending sessions may favour a trail."
    ],
    how: [
      "Write two exit variants in your Playbook: (A) trail under each new higher low; (B) exit on a 5m close below the 20-EMA.",
      "Add a time exit at a fixed time before 15:30 IST to both variants.",
      "In Trading → Backtest, run the trend template on NIFTYBEES 5m with exit A, costs on.",
      "Run it again with exit B on the same period and ETF.",
      "Compare net expectancy in R, average win, average loss and maximum drawdown — not just win rate.",
      "In Trading → Replay, practise moving the stop only when a new higher low is confirmed.",
      "Record which exit you will use going forward and why."
    ],
    example: {
      title: "Hypothetical trailing stop on a NIFTYBEES long (illustrative numbers only)",
      lines: [
        "Entry ₹270.50; initial stop ₹269.00 (1R = ₹1.50 per unit, 333 units).",
        "New higher low at ₹270.20 → stop raised to ₹270.10 (risk now reduced).",
        "Next higher low at ₹271.00 → stop raised to ₹270.90.",
        "Price drops and stop fills at ₹270.90 → gain ₹0.40 per unit × 333 = ₹133.20 gross.",
        "Net after ~₹80 costs ~ ₹53 ~ +0.11R — a small win despite a ₹1.00 move in the trade's favour at one point.",
        "Exit B (close below EMA) might have exited earlier or later — only the backtest can compare them."
      ]
    },
    mistakes: [
      "Moving the trailing stop down to 'give the trade room'.",
      "Trailing so tightly that normal pullbacks always stop you out.",
      "Switching exit methods mid-trade based on emotion.",
      "Holding past the time exit hoping for a bigger move.",
      "Judging exits by one memorable trade instead of a full backtest sample."
    ],
    quiz: [
      { q: "When is the trailing stop raised in this template?", a: "When a new higher low forms; it moves to just below it." },
      { q: "What is the alternative exit described?", a: "A 5m close below the 20-EMA." },
      { q: "Why is there a time exit?", a: "The course is intraday only; positions are closed before the session ends." }
    ]
  },

  32: {
    what: [
      "A choppy session is one where price moves back and forth without making progress: it repeatedly crosses the 20-EMA and VWAP, and swing highs and lows overlap. Trend templates tend to produce a string of small losses plus costs in these conditions.",
      "The efficiency ratio (ER) measures how directly price travelled. ER = |close now - close N bars ago| ÷ sum of |close-to-close changes| over those N bars. An ER near 1 means price moved almost in a straight line; an ER near 0 means lots of movement with little net progress.",
      "A flat EMA is a second chop signal. One testable definition: the absolute change in the 20-EMA over the last 10 bars is less than a small percentage of price (for example 0.05%).",
      "The template rule is: skip trend entries when ER over the last 10 bars is below a threshold (e.g. 0.30) or the EMA is flat. These thresholds are starting values to test in the backtester, not proven settings."
    ],
    why: [
      "Filters that remove losing conditions often help more than better entries. Avoiding chop reduces the number of trades, cost drag and the frustration that leads to rule breaks.",
      "Measuring chop with numbers rather than impressions also stops you from deciding after the fact that a losing day 'was obviously choppy'."
    ],
    how: [
      "Open Trading → Replay on three NIFTYBEES or BANKBEES 5m sessions.",
      "At several points, record the close now, the close 10 bars ago, and the 10 bar-to-bar changes.",
      "Calculate ER and note whether it is above or below 0.30.",
      "Check the 20-EMA change over 10 bars as a percentage of price.",
      "Compare your calculations with whether trend triggers at those times worked.",
      "In Trading → Backtest, run the trend template with and without the chop filter and compare trade count and net expectancy.",
      "Write the filter you will keep in your Playbook, with the test result that supports it."
    ],
    example: {
      title: "Hypothetical efficiency ratio on NIFTYBEES 5m (illustrative numbers only)",
      lines: [
        "Close now ₹270.40; close 10 bars ago ₹270.00 → net move = ₹0.40.",
        "Sum of the 10 absolute bar-to-bar changes = ₹2.00.",
        "ER = ₹0.40 ÷ ₹2.00 = 0.20 → below 0.30 → choppy → skip.",
        "Another stretch: net move ₹1.20, path ₹1.60 → ER = 0.75 → directional.",
        "EMA check: 20-EMA moved ₹0.08 over 10 bars; 0.05% of ₹270 = ₹0.135 → flat → skip."
      ]
    },
    mistakes: [
      "Labelling a day choppy only after it produced losses.",
      "Picking a threshold that perfectly fits one week of data (overfitting).",
      "Using ER on too few bars, where a single candle dominates.",
      "Overriding the filter because a breakout 'looked strong'.",
      "Expecting the filter to remove all losing trades — it only reduces some."
    ],
    quiz: [
      { q: "What is the efficiency ratio formula?", a: "|close now - close N bars ago| ÷ sum of |bar-to-bar changes| over N bars." },
      { q: "Net move ₹0.30, total path ₹1.50 — what is ER?", a: "0.20, which suggests chop." },
      { q: "Are the ER and EMA thresholds proven settings?", a: "No — they are starting values to test in the backtester." }
    ]
  },

  33: {
    what: [
      "Trading → Replay plays historical ETF sessions candle by candle. Before each new candle is revealed, you lock one decision: Long, Short or No-Trade. You cannot change it after the reveal.",
      "The process score measures whether your decisions followed your written rules — filters, trigger, stop and size — rather than whether the trade made money. A rule-following trade that loses still scores well on process; a lucky rule-breaking trade does not.",
      "This separation matters because short-term outcomes are noisy. A good process can lose several times in a row, and a bad process can win by chance. Over many trades, process is what you control.",
      "Today is practice for the trend template from Days 29-32: EMA and VWAP filters, swing-high trigger, swing-low stop, trailing exit and chop filter."
    ],
    why: [
      "Backtests apply rules perfectly. Humans do not. Replay reveals the gap between the rules and how you actually apply them in real time — hesitation, chasing, skipping the chop filter.",
      "Building that consistency in Replay first means your later paper-trading results are more likely to resemble the backtest."
    ],
    how: [
      "Write the full trend checklist on one card: filters, trigger, entry, stop, size, exit, chop filter, cost check.",
      "Open Trading → Replay on a NIFTYBEES 5m session you have not seen before.",
      "On each candle, run the checklist and lock Long, Short or No-Trade before revealing the next bar.",
      "When you enter, note entry, stop, units and planned exit immediately.",
      "Complete three sessions, including at least one on BANKBEES or ITBEES.",
      "Review the process score and list every rule deviation.",
      "Log deviations in the Mistake Lab with what you felt at the time."
    ],
    example: {
      title: "Hypothetical Replay session review (illustrative numbers only)",
      lines: [
        "Decisions locked: 48 candles → 41 No-Trade, 5 Long, 2 Short.",
        "Rule-following trades: 4 of 7; process score shown as 4 ÷ 7 ~ 57%.",
        "Deviation 1: entered before the trigger candle closed (chasing).",
        "Deviation 2: ignored ER below 0.30; trade lost 1R plus costs.",
        "Deviation 3: moved the stop down once.",
        "Outcome P&L was slightly positive, but the process score shows the rules were not followed."
      ]
    },
    mistakes: [
      "Judging the session by P&L instead of process score.",
      "Skipping the checklist on fast candles.",
      "Replaying a session you remember, which leaks future information.",
      "Locking Long on most candles because No-Trade feels unproductive.",
      "Not recording deviations, so the same mistake repeats."
    ],
    quiz: [
      { q: "What does the process score measure?", a: "Whether decisions followed your written rules, not whether they made money." },
      { q: "Why replay unfamiliar sessions?", a: "Remembering the outcome is a form of look-ahead." },
      { q: "Is a losing rule-following trade a bad trade?", a: "Not on process; it can be a correct decision with an unlucky outcome." }
    ]
  },

  34: {
    what: [
      "Trading → Backtest applies a strategy's rules to historical ETF data. You choose the ETF, date range, timeframe (1m, 5m or 15m) and strategy. Signals use only completed bars and fill on the next bar, so there is no look-ahead. The Indian cost model deducts brokerage, STT, exchange charges, SEBI fees, stamp duty and GST.",
      "The data is split into a training period and an out-of-sample period. You may adjust settings while looking at training results; the out-of-sample period is a separate check that you have not tuned on. If performance collapses out-of-sample, the training result was probably fitted to noise.",
      "Expectancy is the average result per trade: (win rate × average win) - (loss rate × average loss). Measured in R after costs, it tells you whether the template made or lost money per unit of risk on that data.",
      "Trade count matters. Thirty or forty trades can produce a positive result by chance. Treat small samples as 'not enough evidence', not as proof."
    ],
    why: [
      "Replay shows whether you can follow the rules; the backtester shows what the rules did on a lot more historical data than you could replay by hand. Both are needed.",
      "Running the backtest after costs is where many intraday ideas fail. Better to learn that here, with simulated data, than to assume an edge exists."
    ],
    how: [
      "Open Trading → Backtest, select NIFTYBEES, 5m, and the Trend strategy.",
      "Set a date range with a training period and a later out-of-sample period.",
      "Confirm costs are switched on and review the cost settings.",
      "Run the backtest and read trade count, win rate, average win and loss in R, expectancy, profit factor and maximum drawdown.",
      "Run the out-of-sample period without changing settings and compare.",
      "Repeat on BANKBEES or JUNIORBEES to see if results transfer across ETFs.",
      "Save the report and log net expectancy and trade count in the Trading Journal."
    ],
    example: {
      title: "Hypothetical Trend backtest report — invented numbers for learning",
      lines: [
        "Training: 60 trades; win rate 41%; average win +1.8R; average loss -1.0R (gross).",
        "Gross expectancy = 0.41 × 1.8 - 0.59 × 1.0 = 0.738 - 0.590 = +0.148R.",
        "Costs ~ ₹80 on ₹500 risk = 0.16R per trade.",
        "Net expectancy ~ 0.148R - 0.16R = -0.012R per trade — roughly break-even to slightly negative.",
        "Out-of-sample: 25 trades; net expectancy -0.10R; too few trades to conclude much either way.",
        "Reading: no demonstrated edge after costs on this hypothetical sample; next step is to test the chop filter or another ETF, not to trade it."
      ]
    },
    mistakes: [
      "Running the backtest with costs off and reporting the gross result.",
      "Tuning settings on the out-of-sample period until it looks good.",
      "Trusting a result built on a handful of trades.",
      "Focusing on win rate while ignoring average win, average loss and drawdown.",
      "Assuming a backtest result will repeat in the future."
    ],
    quiz: [
      { q: "What is expectancy?", a: "(Win rate × average win) - (loss rate × average loss), ideally in R after costs." },
      { q: "Why keep an out-of-sample period?", a: "To check results on data the settings were not tuned on." },
      { q: "Gross expectancy +0.15R and costs 0.16R per trade — net?", a: "About -0.01R per trade." }
    ]
  },

  35: {
    what: [
      "This week turned trend-following into a testable template. Day 29: the 20-EMA and VWAP describe intraday direction; slope matters. Day 30: enter on a close above the prior swing high when price is above a rising 20-EMA and above VWAP, filling on the next bar.",
      "Day 31: the initial stop sits below the last swing low; exits either trail under new higher lows or trigger on a close below the 20-EMA, with a time exit before the session ends. Day 32: skip trades when the efficiency ratio is low or the EMA is flat.",
      "Day 33: Replay measured whether you could follow the rules, through the process score. Day 34: the backtester measured what the rules did on historical data, after costs, on training and out-of-sample periods.",
      "The honest conclusion for most learners at this point is uncertain: the template is clearly defined, but whether it has an edge on a given ETF and timeframe depends on after-cost, out-of-sample evidence that may be weak or negative."
    ],
    why: [
      "Reviewing the whole template together shows how each part interacts: a chop filter changes trade count, which changes cost drag, which changes expectancy.",
      "It also builds the habit of writing down what the evidence says, including 'not proven', rather than keeping only the parts that feel good."
    ],
    how: [
      "Re-read the Trend module in Trading → Learn.",
      "Write the complete trend template in your Playbook with every rule and parameter.",
      "Re-run the Trend backtest on BANKBEES 5m with costs on and the chop filter on.",
      "Compare training and out-of-sample expectancy, trade count and maximum drawdown with your NIFTYBEES run.",
      "Review your Replay process scores from Day 33 and note the most frequent deviation.",
      "Ask the AI Coach in Trading → Ask AI to quiz you on the template rules.",
      "Write a three-line verdict: what worked, what did not, what to test next."
    ],
    example: {
      title: "Hypothetical trend template summary (illustrative numbers only)",
      lines: [
        "Filters: 5m close > rising 20-EMA and > VWAP; skip if ER(10) < 0.30 or EMA flat.",
        "Trigger: close > prior swing high; enter next bar open.",
        "Stop: below last swing low + ₹0.10; size = ₹500 ÷ stop distance, capped by capital.",
        "Exit: trail under new higher lows; close all by the time exit.",
        "Hypothetical results: NIFTYBEES net -0.01R (60 trades), BANKBEES net +0.04R (45 trades).",
        "Verdict: no clear after-cost edge yet; samples too small; keep testing, do not assume."
      ]
    },
    mistakes: [
      "Keeping only the ETF or period that looked best and discarding the rest.",
      "Changing several parameters at once, so you cannot tell which change mattered.",
      "Treating a weekly review as optional.",
      "Calling the template 'working' based on Replay P&L rather than backtest evidence.",
      "Forgetting that the same template can behave very differently on gold or sector ETFs."
    ],
    quiz: [
      { q: "List the trend template's entry conditions.", a: "Close above a rising 20-EMA, above VWAP, and above the prior swing high; enter next bar open." },
      { q: "What does the chop filter do?", a: "Skips trades when ER is low or the EMA is flat." },
      { q: "What evidence should decide whether the template has an edge?", a: "Out-of-sample backtest results after costs, with enough trades." }
    ]
  },

  36: {
    what: [
      "A breakout is a move through a price level where price previously stalled. For a strategy to be testable, the level must be objective — something a backtester can calculate without judgement.",
      "The prior N-bar high is the highest high of the last N completed bars, for example the last 20 bars on a 5m chart (about 100 minutes). A close above it means price has exceeded every high in that window.",
      "The opening range is the high and low of the first part of the session, for example 09:15 to 09:30 IST. The previous day's high and low are also widely watched, especially on liquid index ETFs like NIFTYBEES and BANKBEES.",
      "Hand-drawn trendlines and 'zones' can be useful for reading charts, but they are hard to test consistently. This course's breakout template uses only the objective levels above."
    ],
    why: [
      "Using objective levels means your Replay decisions and your backtest are testing the same thing. If you draw levels by eye, the backtester and you will disagree about which breakouts happened.",
      "Levels where many participants look are more likely to see increased activity when crossed — though that activity can go either way, which is why false breakouts get their own lesson."
    ],
    how: [
      "Open Trading → Replay on a NIFTYBEES 5m session.",
      "Mark the previous day's high and low before the session starts.",
      "After 09:30 IST, mark the opening range high and low.",
      "As the session progresses, track the rolling 20-bar high and low.",
      "Each time price closes beyond one of these levels, note which level it was and what happened in the next five bars.",
      "Repeat on four more sessions, including one on GOLDBEES.",
      "Record which level types produced the cleanest follow-through in your sample."
    ],
    example: {
      title: "Hypothetical levels on a NIFTYBEES 5m session (illustrative numbers only)",
      lines: [
        "Previous day high ₹271.60; previous day low ₹268.40.",
        "Opening range (09:15 to 09:30): high ₹271.00, low ₹269.80 → width ₹1.20.",
        "At 11:00, 20-bar high = ₹270.90 (it includes only completed bars).",
        "Candle closes at ₹271.05 → above the 20-bar high and the opening range high.",
        "Next level overhead: previous day high ₹271.60, ₹0.55 away — a possible limit on the move."
      ]
    },
    mistakes: [
      "Drawing levels by eye that cannot be reproduced in a backtest.",
      "Including the current, unfinished bar in the N-bar high, which is look-ahead.",
      "Ignoring a nearby higher level that leaves too little room before resistance.",
      "Treating every touch of a level as a breakout, without requiring a close.",
      "Using too many levels until every candle is near one."
    ],
    quiz: [
      { q: "What is a prior N-bar high?", a: "The highest high of the last N completed bars." },
      { q: "Give the opening range in this course's example.", a: "High and low from 09:15 to 09:30 IST." },
      { q: "Why prefer objective levels for this template?", a: "They can be calculated the same way in Replay and in the backtester." }
    ]
  },

  37: {
    what: [
      "Relative volume compares a bar's volume with recent average volume: relative volume = bar volume ÷ average volume of the last N bars. A value of 1.5× means the bar traded 50% more units than usual.",
      "The breakout template requires the breakout candle's relative volume to be ≥ 1.5×. The idea is that a move through a level with more participation is less likely to be a few small orders pushing price through.",
      "Intraday volume follows a pattern: it is usually high near the open and close and lower around midday. Comparing a midday bar with an average that includes the opening bars can understate relative volume, so compare like with like where possible.",
      "For ETFs, also check traded value (price × volume) and spread. Many NSE ETFs are thinly traded; a 2× spike on a tiny base can still be very little money. Market makers provide quotes, but quoted size may be small."
    ],
    why: [
      "Volume is one of the few independent pieces of information beyond price. As a filter it can reduce the number of low-participation breakouts — though it cannot guarantee follow-through.",
      "Filtering on traded value and spread protects the simulation from setups that would be expensive or unrealistic to fill."
    ],
    how: [
      "In Trading → Replay, display volume and a 20-bar average volume on NIFTYBEES 5m.",
      "For each close beyond a level, calculate relative volume = bar volume ÷ 20-bar average.",
      "Mark breakouts with relative volume ≥ 1.5× and those below it.",
      "Note what happened over the next five bars for each group.",
      "Calculate traded value for the breakout bar and compare with your minimum traded value rule.",
      "Repeat on a less liquid ETF such as CPSEETF or PSUBNKBEES and note how volume and spread differ.",
      "Record ten breakouts and their relative volume in the Trading Journal."
    ],
    example: {
      title: "Hypothetical relative volume checks (illustrative numbers only)",
      lines: [
        "20-bar average volume on NIFTYBEES 5m: 40,000 units.",
        "Breakout bar A: 70,000 units → 70,000 ÷ 40,000 = 1.75× → passes (≥ 1.5×).",
        "Breakout bar B: 50,000 units → 1.25× → fails the filter.",
        "Traded value of bar A ~ 70,000 × ₹271 ~ ₹1.9 crore.",
        "Thin ETF bar C: 3,000 units vs 1,500 average → 2.0×, but traded value ~ ₹1.5 lakh and spread wide → skip.",
        "Passing the volume filter only means the rule is met — not that the breakout will hold."
      ]
    },
    mistakes: [
      "Looking only at units and ignoring traded value.",
      "Comparing midday volume with an opening-heavy average without thinking about the session pattern.",
      "Using the volume of the unfinished current bar.",
      "Treating a high-volume breakout as certain to follow through.",
      "Lowering the threshold whenever a favourite setup fails it."
    ],
    quiz: [
      { q: "Bar volume 60,000, average 40,000 — relative volume?", a: "1.5×, which meets the ≥ 1.5× rule." },
      { q: "Why check traded value for ETFs?", a: "A big relative spike on a thin ETF can still be very little money and a wide spread." },
      { q: "Does volume confirmation guarantee a breakout holds?", a: "No — it is a filter to test, not a guarantee." }
    ]
  },

  38: {
    what: [
      "A false breakout (sometimes called a failed breakout) happens when price closes beyond a level and then closes back inside the range. The move through the level did not hold.",
      "A wick through a level is not a breakout in this course: the template requires a candle close beyond the level. That avoids reacting to brief spikes, but even a close beyond the level can still fail.",
      "The template's false-breakout rule is: if, after entry, a 5m candle closes back inside the range (below the breakout level for a long), exit at the next bar open, even if the stop has not been hit. This often cuts the loss to less than 1R.",
      "False breakouts are common. In many backtests a large share of breakout signals fail. The aim is not to avoid them all but to keep their cost small and measure how often they happen on each ETF."
    ],
    why: [
      "Without a defined false-breakout exit, traders often hold a failed breakout down to the full stop, or worse, hope it recovers. A written rule turns the failure into a small, planned loss.",
      "Counting false breakouts in the backtester shows which ETFs and times of day produce cleaner breakouts — information you cannot get from a few memorable examples."
    ],
    how: [
      "Write the false-breakout rule in your Playbook: close back inside the level → exit next bar open.",
      "In Trading → Replay, find five breakouts on NIFTYBEES or BANKBEES 5m.",
      "After each simulated entry, check every candle close against the breakout level.",
      "When a candle closes back inside, lock the exit and record the loss in R.",
      "Tag each breakout as held or false, and note the time of day.",
      "In Trading → Backtest, check the breakout report for the share of trades closed by the false-breakout rule.",
      "Log the false-breakout frequency for each ETF you tested."
    ],
    example: {
      title: "Hypothetical false breakout on NIFTYBEES 5m (illustrative numbers only)",
      lines: [
        "Opening range high ₹271.00; candle closes at ₹271.15 with volume 1.6× → entry next open ₹271.20.",
        "Stop at ₹270.45 (inside the range) → risk per unit ₹0.75.",
        "Two bars later a candle closes at ₹270.90 — back inside the range → false breakout.",
        "Exit next bar open ₹270.85 → loss ₹0.35 per unit, about 0.47R before costs.",
        "Without the rule, price later touched ₹270.45 → full -1R loss."
      ]
    },
    mistakes: [
      "Treating a wick beyond the level as a breakout.",
      "Ignoring a close back inside because 'it might go back up'.",
      "Exiting on any small pullback rather than a close back inside the range.",
      "Assuming volume confirmation removes false breakouts.",
      "Remembering only the breakouts that worked."
    ],
    quiz: [
      { q: "Define a false breakout in this course.", a: "A close beyond a level followed by a close back inside the range." },
      { q: "What does the false-breakout rule tell you to do?", a: "Exit at the next bar open after a close back inside, even before the stop." },
      { q: "Why count false breakouts in the backtester?", a: "To measure how often they happen per ETF and time of day instead of relying on memory." }
    ]
  },

  39: {
    what: [
      "The breakout template's long version: the level is the prior 20-bar high or opening range high. Trigger: a 5m candle closes above the level with relative volume ≥ 1.5×. Entry: the next bar's open.",
      "Stop: inside the range — either the range midpoint or just below the range low — so the stop is placed where 'price has left the range' is clearly wrong. A midpoint stop is tighter; a range-low stop is wider and gives more room.",
      "Target: a fixed multiple of R (for example 2R), checked against costs with the Day 27 filter. Exits also include the false-breakout rule and a time exit before the session ends.",
      "Size still comes from the risk budget: units = ₹500 ÷ (entry - stop), capped by virtual capital. Tight breakout stops often hit the capital cap, which makes the actual rupee risk smaller and costs a larger share of R."
    ],
    why: [
      "A complete plan — entry, stop, target, size, exits — written before entry is what makes a breakout trade testable and repeatable. Missing any one part leaves room for improvisation.",
      "Seeing how the capital cap and costs interact with tight stops explains why some breakout setups look attractive on a chart but are weak in R after costs."
    ],
    how: [
      "Write the full breakout plan in your Playbook: level, trigger, entry, stop choice, target, false-breakout exit, time exit.",
      "Open Trading → Paper on a replayed NIFTYBEES session and set your watchlist and risk limits.",
      "When a candle closes above the level, check relative volume ≥ 1.5×.",
      "Calculate stop, units (with capital cap) and target before placing the order.",
      "Check that the target move per unit is ≥ 3× cost per unit.",
      "Place the order with stop-loss and take-profit attached.",
      "Manage only by the written exits and log the trade in the session journal."
    ],
    example: {
      title: "Hypothetical breakout plan on NIFTYBEES 5m (illustrative numbers only)",
      lines: [
        "Opening range ₹269.80 to ₹271.00; midpoint ₹270.40.",
        "Close ₹271.15 with 1.6× volume → entry next open ₹271.20.",
        "Stop just below midpoint: ₹270.45 → risk per unit ₹0.75.",
        "Units = ₹500 ÷ ₹0.75 = 666; value 666 × ₹271.20 = ₹1,80,619 → over capital.",
        "Capital cap: ₹1,00,000 ÷ ₹271.20 = 368 units; actual risk = 368 × ₹0.75 = ₹276.",
        "Target 2R = ₹271.20 + 2 × ₹0.75 = ₹272.70 → gross win 368 × ₹1.50 = ₹552.",
        "Costs ~ ₹82 = 0.30R of ₹276; net win ~ ₹470 (1.70R), net loss ~ ₹358 (1.30R).",
        "Net break-even = ₹358 ÷ (₹470 + ₹358) ~ 43.2%, versus 33.3% before costs."
      ]
    },
    mistakes: [
      "Placing the stop just below the breakout level, where normal retests trigger it.",
      "Ignoring the capital cap and assuming the full ₹500 risk applies.",
      "Setting a 2R target that sits beyond a nearby previous-day high without noting it.",
      "Removing the take-profit mid-trade to 'let it run' outside the written rules.",
      "Forgetting to convert costs into R when the actual risk is smaller than the budget."
    ],
    quiz: [
      { q: "What are the two trigger conditions?", a: "A 5m close above the level and relative volume ≥ 1.5×." },
      { q: "Where does the stop go in the breakout template?", a: "Inside the range — the midpoint or just below the range low." },
      { q: "Why can costs be a bigger share of R on breakouts?", a: "Tight stops hit the capital cap, so the actual rupee risk is smaller while costs stay the same." }
    ]
  },

  40: {
    what: [
      "An opening-range breakout (ORB) uses the high and low of the first part of the session as the level. In this course the default opening range is 09:15 to 09:30 IST (three 5m bars), after the pre-open session from 09:00 to 09:15.",
      "The ORB template: wait for the opening range to complete; go long on a 5m close above the range high with relative volume ≥ 1.5× (short version mirrors on the range low). Stop inside the range; exit on a close back inside; target in R; time exit before the close.",
      "Two width filters matter. If the range is too narrow, the stop is tiny, the capital cap binds and costs dominate. If the range is too wide, the stop is far and the target may be unrealistic. One testable rule: skip if range width is below 3× cost per unit or above a set percentage of price.",
      "A signal cutoff time — for example no new ORB entries after 11:00 IST — keeps the template focused on the opening move and avoids late-session signals that have little time to work."
    ],
    why: [
      "The open is often the most active period for liquid index ETFs, and the opening range gives a clear, objective level each day. That makes ORB one of the simplest breakout variants to test.",
      "It also has a common failure: in quiet sessions the range is narrow and both sides get broken. The width filter and false-breakout rule are designed to limit that cost."
    ],
    how: [
      "Write the ORB rules in your Playbook, including width filters and cutoff time.",
      "Open Trading → Replay on a JUNIORBEES 5m session and pause at 09:30 IST.",
      "Record the opening range high, low and width, and compare width with your filters.",
      "Step forward and lock Long, Short or No-Trade on each candle until the cutoff.",
      "Apply the false-breakout exit and time exit to any position.",
      "Repeat for five mornings and note which were skipped by the width filter.",
      "Compare JUNIORBEES with NIFTYBEES for range width, volume and spread."
    ],
    example: {
      title: "Hypothetical ORB morning on JUNIORBEES 5m (illustrative numbers only)",
      lines: [
        "Opening range 09:15 to 09:30: high ₹720.00, low ₹716.40 → width ₹3.60 (0.50% of price).",
        "Filters (hypothetical): width ≥ 3× cost per unit and ≤ 0.80% of price → passes.",
        "10:05: candle closes ₹720.60 with 1.8× volume → entry next open ₹720.70.",
        "Stop at midpoint ₹718.20 - ₹0.10 = ₹718.10 → risk per unit ₹2.60.",
        "Units = ₹500 ÷ ₹2.60 = 192; value 192 × ₹720.70 = ₹1,38,374 → capital cap 138 units.",
        "Actual risk = 138 × ₹2.60 = ₹358.80; target 2R = ₹720.70 + ₹5.20 = ₹725.90.",
        "Another morning: range width ₹0.90 (0.13%) → too narrow vs costs → No-Trade."
      ]
    },
    mistakes: [
      "Entering inside the first 15 minutes before the range is complete.",
      "Trading every ORB regardless of range width.",
      "Taking late-session ORB signals after the cutoff.",
      "Treating the ORB on gold ETFs the same as on equity index ETFs, though their opens behave differently.",
      "Forgetting that both sides of a narrow range can be broken in the same session."
    ],
    quiz: [
      { q: "What is the opening range in this course?", a: "The high and low from 09:15 to 09:30 IST." },
      { q: "Why skip a very narrow opening range?", a: "The stop is tiny, the capital cap binds and costs take a large share of R." },
      { q: "What does a signal cutoff time do?", a: "It prevents new ORB entries late in the session, e.g. after 11:00 IST." }
    ]
  },

  41: {
    what: [
      "Today you run the breakout template in Trading → Backtest: ETF, date range, 5m timeframe, Breakout strategy, costs on. The backtester uses only completed bars for levels and volume, fills on the next bar, and applies the Indian cost model.",
      "An ablation test compares a strategy with and without one rule. Running the breakout template with the volume filter on and off shows whether the filter improves net expectancy, or only reduces trade count.",
      "Key metrics: trade count, win rate, average win and loss in R, net expectancy, profit factor (gross profits ÷ gross losses), maximum drawdown, and the share of trades closed by the false-breakout rule.",
      "As with the trend backtest, training results are only a hypothesis. The out-of-sample period is the check, and a few dozen trades are rarely enough to draw firm conclusions."
    ],
    why: [
      "The volume filter, range-width filter and false-breakout rule all sound sensible. Only the backtest, after costs and out-of-sample, can show whether they help on a specific ETF and timeframe.",
      "Comparing variants on the same data and periods also teaches you to change one thing at a time, which is the core habit of honest testing."
    ],
    how: [
      "Open Trading → Backtest, select NIFTYBEES, 5m, Breakout strategy, costs on.",
      "Set the same training and out-of-sample periods you used for the trend backtest.",
      "Run with the volume filter on (≥ 1.5×) and save the report.",
      "Run again with the volume filter off and save the report.",
      "Compare net expectancy, trade count, profit factor, drawdown and false-breakout share.",
      "Run the better variant on the out-of-sample period without changing settings.",
      "Log both variants and the out-of-sample result in the Trading Journal."
    ],
    example: {
      title: "Hypothetical Breakout backtest comparison — invented numbers for learning",
      lines: [
        "Volume filter OFF (training): 120 trades; win 36%; avg win +1.9R; avg loss -0.8R (gross).",
        "Gross expectancy = 0.36 × 1.9 - 0.64 × 0.8 = 0.684 - 0.512 = +0.172R; costs 0.25R → net -0.078R.",
        "Volume filter ON (training): 55 trades; win 42%; avg win +1.9R; avg loss -0.8R (gross).",
        "Gross = 0.42 × 1.9 - 0.58 × 0.8 = 0.798 - 0.464 = +0.334R; costs 0.25R → net +0.084R.",
        "Out-of-sample, filter ON: 22 trades, net -0.03R — the training advantage did not clearly hold.",
        "Reading: the filter may help, but evidence is thin; more data and other ETFs are needed."
      ]
    },
    mistakes: [
      "Changing several rules between runs, so the effect of the volume filter cannot be isolated.",
      "Comparing variants on different date ranges.",
      "Preferring the variant with the highest win rate regardless of net expectancy.",
      "Ignoring that the filtered version has far fewer trades, which makes its result less reliable.",
      "Tuning the volume threshold on the out-of-sample period."
    ],
    quiz: [
      { q: "What is an ablation test?", a: "Comparing a strategy with and without one rule on the same data." },
      { q: "Gross expectancy +0.33R, costs 0.25R — net?", a: "About +0.08R per trade, before checking out-of-sample." },
      { q: "Why is a 22-trade out-of-sample result weak evidence?", a: "Small samples can swing positive or negative by chance." }
    ]
  },

  42: {
    what: [
      "This week built a breakout template. Day 36: use objective levels — prior N-bar high/low, opening range, previous day high/low. Day 37: require relative volume ≥ 1.5× and check traded value and spread. Day 38: a close back inside the range is a false breakout, and the rule is to exit.",
      "Day 39: enter on the next bar after a close beyond the level, stop inside the range, target in R, size from the risk budget with the capital cap. Day 40: the opening-range breakout adds width filters and a signal cutoff time.",
      "Day 41: the backtester compared the template with and without the volume filter, after costs, on training and out-of-sample periods.",
      "As with the trend template, the honest summary is that this is a clearly defined template to keep testing. Results in your backtests — not the logic of the rules — decide whether it deserves more practice."
    ],
    why: [
      "Breakout and trend templates often overlap — a trend entry above a swing high is a kind of breakout. Reviewing both shows where they differ: breakouts depend on levels and volume, trends on slope and structure.",
      "A written review now gives you a baseline to compare with the pullback and range strategies in the next two phases."
    ],
    how: [
      "Re-read the Breakout module in Trading → Learn.",
      "Write the complete breakout template in your Playbook with all parameters.",
      "Run one Trading → Paper session on a replayed NIFTYBEES day using only the breakout rules and your risk plan.",
      "Review the Paper session report: rule-following, risk limits, costs, false-breakout exits.",
      "Compare paper results with your Day 41 backtest, noting differences caused by your execution.",
      "Use the Strategy Lab to note the template's version and test results.",
      "Write a three-line verdict: what the evidence shows, what is untested, what to test next."
    ],
    example: {
      title: "Hypothetical breakout template summary (illustrative numbers only)",
      lines: [
        "Level: opening range high or prior 20-bar high (completed bars only).",
        "Trigger: 5m close above level, relative volume ≥ 1.5×; enter next bar open.",
        "Stop: inside range (midpoint); size = ₹500 ÷ stop distance, capped by ₹1,00,000 capital.",
        "Exits: 2R target; close back inside → exit; time exit; no entries after 11:00 IST for ORB.",
        "Hypothetical backtest: training net +0.08R (55 trades), out-of-sample net -0.03R (22 trades).",
        "Verdict: not proven; continue testing on more ETFs and periods, after costs."
      ]
    },
    mistakes: [
      "Calling the template 'working' after a good training result alone.",
      "Mixing trend and breakout rules mid-session without writing a new template.",
      "Skipping the paper session because the backtest already ran.",
      "Ignoring how the capital cap and costs change R on tight breakout stops.",
      "Moving on to the next strategy without recording this week's results."
    ],
    quiz: [
      { q: "What three objective levels does the breakout template use?", a: "Prior N-bar high/low, opening range high/low, previous day high/low." },
      { q: "What is the volume rule?", a: "The breakout candle's volume must be ≥ 1.5× the recent average." },
      { q: "What decides whether the template deserves more practice?", a: "After-cost, out-of-sample backtest evidence with enough trades." }
    ]
  }
};
