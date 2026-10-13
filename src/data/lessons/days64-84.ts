import type { LessonContent } from './types';

// Days 64-84: Paper Trading, Psychology & Playbook, Final Evaluation (ETF-only).
// Educational content only — not financial advice. All practice in this app is simulated:
// Trading → Paper uses virtual money on replayed HISTORICAL sessions. Every number in an
// example is hypothetical. Cost rates change over time and are configurable in the app.

export const CONTENT: Record<number, LessonContent> = {
  64: {
    what: [
      "Paper trading means placing simulated orders with virtual money. In this app, Trading → Paper replays a real historical NSE session for the ETFs you choose, bar by bar, and lets you trade it as if it were live. Every price you see is labelled HISTORICAL — nothing is a live quote and no real order ever reaches an exchange or broker.",
      "The Paper simulator has the tools a real trading screen has: a watchlist, market and limit orders, stop-loss and take-profit, and position tracking. It also has guard rails: risk limits that reject orders that are too big, a maximum number of trades, a daily loss limit that triggers a cooldown, and a required trade reason before any entry. At the end you get a session journal and report.",
      "Setup comes before the first order. You decide your virtual account size, risk per trade (for example 0.5% of the virtual account), daily loss limit, maximum trades per session, which ETFs you are allowed to trade and which tested strategy you will use. These numbers should match what you studied in Phase 4 and tested in Phase 9.",
      "The most important rule is attitude: treat virtual rupees as if they mattered. If you trade paper money carelessly — huge size, no stops, random entries — the results tell you nothing about your process. The point of paper trading is to rehearse disciplined execution, not to chase a big simulated number."
    ],
    why: [
      "A backtest shows how fixed rules behaved on past data; it cannot show how you behave when bars arrive one at a time and you must decide without knowing what comes next. Paper trading on replayed sessions adds that human element while keeping everything simulated and risk-free.",
      "Rules written before the first session are your defence against making them up as you go. If the limits are set in advance and enforced by the simulator, every session becomes a clean test of whether you can follow a plan."
    ],
    how: [
      "Open Trading → Paper and read the session settings. Confirm that the session date shown is a HISTORICAL replay and that the account is virtual.",
      "Set the virtual account size and risk per trade. Use the same numbers you used in Backtest so results can be compared later.",
      "Set the daily loss limit (for example 2R or 1% of the virtual account) and the maximum trades per session (for example 3). Leave the cooldown switched on.",
      "Add two or three liquid ETFs to the watchlist, such as NIFTYBEES and BANKBEES. Run the ETF eligibility check in Trading → Practice first: volume, traded value and spread.",
      "Choose the one strategy you will trade — the one with the most honest backtest from Phase 9 — and write its entry, stop and exit rules in the session notes.",
      "Confirm the cost model in the app reflects current brokerage, STT, exchange charges, stamp duty and GST. Rates change, so check the settings rather than assuming.",
      "Write a short paper-trading rules list in the Trading Journal: what you will trade, how much you will risk, and when you will stop for the day."
    ],
    example: {
      title: "Sample paper-trading setup (HYPOTHETICAL numbers)",
      lines: [
        "Virtual account: ₹1,00,000 (simulated). Risk per trade: 0.5% = ₹500.",
        "Daily loss limit: ₹1,000 (2R) → cooldown for the rest of the session.",
        "Max trades per session: 3. Trade reason required before every entry.",
        "Watchlist: NIFTYBEES, BANKBEES (both passed the eligibility check on volume and spread).",
        "Strategy: VWAP pullback in an uptrend, 5m chart — rules copied from my backtest notes.",
        "Session window: 09:30-14:45 IST; flat before 15:15. Prices shown are HISTORICAL replay data."
      ]
    },
    mistakes: [
      "Treating virtual money as play money — oversized or random trades make the results meaningless.",
      "Starting without setting risk limits, then inventing them halfway through the session.",
      "Using a different account size or risk per trade than the backtest, so results cannot be compared.",
      "Adding many thinly traded ETFs to the watchlist instead of two or three liquid ones.",
      "Trading a strategy that was never backtested because it 'looked good' on one chart.",
      "Forgetting that paper fills on replayed data can be kinder than reality, especially in illiquid ETFs."
    ],
    quiz: [
      { q: "What does Trading → Paper actually replay?", a: "Real historical NSE sessions, bar by bar, with virtual money and prices labelled HISTORICAL." },
      { q: "Name three limits you should set before the first paper order.", a: "Risk per trade, daily loss limit (with cooldown) and maximum trades per session." },
      { q: "Why match paper settings to your backtest settings?", a: "So paper results and backtest results can be compared fairly later." }
    ]
  },

  65: {
    what: [
      "A pre-session plan is a short written document you complete before the first bar of the paper session. It answers four questions: which ETFs am I watching, where are the key levels, what exact setup am I looking for, and under what conditions will I not trade at all today.",
      "The watchlist should be small — two or three ETFs. More symbols means more screens, more temptation and less attention for each. Choose ETFs that pass the liquidity check: enough volume and traded value, a tight spread and price close to iNAV. For a beginner, broad index ETFs like NIFTYBEES or BANKBEES are usually easier to read than thin sector ETFs.",
      "Key levels give the plan structure: previous day high and low, previous close, any gap, the opening range once it forms, and VWAP during the session. You mark these on the chart before trading so that entries happen at levels you chose calmly, not at prices that simply look exciting.",
      "No-trade conditions are as important as the setup. Examples: the spread is wider than usual, the ETF is trading at an unusual premium or discount to iNAV, the first 15 minutes are wildly volatile, the market is choppy around VWAP, or you feel tired, rushed or upset. If any condition is true, the plan says to wait or skip the session."
    ],
    why: [
      "Decisions made in advance, while calm, are better than decisions made in the middle of a fast bar. A written plan moves most of the thinking out of the session so that in the moment you only need to check whether the conditions match.",
      "The plan also makes your review honest. After the session you can compare what you did with what you said you would do, which is the real measure of progress in simulation."
    ],
    how: [
      "In Trading → Paper, pick the historical session date and add your two or three ETFs to the watchlist. Do not look ahead at the session's later bars.",
      "Check each ETF's previous-day chart in the replay view and mark previous high, low and close as levels.",
      "Run the ETF eligibility check in Trading → Practice: volume, traded value, spread and premium/discount to iNAV. Remove any ETF that fails.",
      "Write the one setup you will trade, with its entry trigger, stop placement and target, copied from your strategy notes.",
      "Write at least three no-trade conditions, including one about your own state (tired, rushed, upset).",
      "Set your session window, for example no entries in the first 15 minutes and none after 14:45 IST.",
      "Save the plan in the Paper session journal so it appears next to the session report afterwards."
    ],
    example: {
      title: "Sample pre-session plan (HYPOTHETICAL, historical replay)",
      lines: [
        "Watchlist: NIFTYBEES, BANKBEES. Both passed liquidity and spread checks.",
        "NIFTYBEES levels: prev high ₹262.40, prev low ₹259.80, prev close ₹261.10 (hypothetical).",
        "Setup: long pullback to VWAP in an uptrend on 5m, after the opening range breaks up.",
        "Stop: below the pullback low. Target: 2R or previous high, whichever comes first.",
        "No-trade: spread above 0.05%, price chopping across VWAP 4+ times, gap larger than 1%, me feeling rushed.",
        "Window: entries 09:30-14:45 IST only; max 3 trades; stop for the day at -2R."
      ]
    },
    mistakes: [
      "Watching ten ETFs and missing the setup on the two that mattered.",
      "Writing a vague setup such as 'buy if strong' that cannot be checked in the moment.",
      "Skipping no-trade conditions, so every session becomes a trading session.",
      "Peeking at later bars of the historical session while planning, which ruins the simulation.",
      "Not saving the plan, which makes the post-session review guesswork."
    ],
    quiz: [
      { q: "What four questions does a pre-session plan answer?", a: "Which ETFs, where the key levels are, what exact setup, and when not to trade." },
      { q: "Why keep the watchlist to two or three ETFs?", a: "Fewer symbols means more attention per chart and less temptation to take unplanned trades." },
      { q: "Give one no-trade condition about yourself.", a: "Feeling tired, rushed or upset before the session." }
    ]
  },

  66: {
    what: [
      "Executing the plan means the session follows the document you wrote, not the other way around. As historical bars appear one by one in Trading → Paper, your only job is to ask: is my planned setup present right now, on a watchlist ETF, inside my session window, with no no-trade condition active?",
      "When the answer is yes, you place the order with all parts attached: entry (market or limit), stop-loss, take-profit or exit plan, and a size calculated from your risk per trade. The Paper simulator asks for a trade reason before it accepts the entry. A good reason names the setup and the level, for example 'VWAP pullback long, uptrend, held VWAP with a bullish close'.",
      "Order type matters. A limit order sets the price you are willing to pay and may not fill; a market order fills at the next available simulated price and can include slippage. In thin ETFs a market order can fill noticeably away from the last price, so many traders prefer limits near the level.",
      "When the answer is no, you do nothing. A session with zero trades because the setup never appeared is a perfectly executed session. In your review, a skipped invalid trade counts exactly as much as a well-executed valid one."
    ],
    why: [
      "Execution is where most strategies fail in practice. The same rules that look good in a backtest stop working if you enter early, late, without a stop or with the wrong size. Practising clean execution in simulation builds the habit without any real-money consequences.",
      "The required trade reason forces a pause between impulse and click. If you cannot write the reason in one sentence that matches your plan, you have found a trade you should not take."
    ],
    how: [
      "Open your saved plan next to the Paper chart before starting the replay.",
      "Advance the replay bar by bar. Do not skip ahead; make every decision with only the bars visible.",
      "When the setup appears, calculate size: risk per trade / (entry - stop). Round down to whole units.",
      "Choose the order type. Prefer a limit near your level in thinner ETFs; note expected slippage if you use market.",
      "Attach the stop-loss and take-profit when placing the order, then write the trade reason the simulator asks for.",
      "If the setup does not appear, log 'no valid setup' at the end of each hour so you stay engaged without forcing trades.",
      "At session end, open the session report and compare each trade with the plan line by line."
    ],
    example: {
      title: "Sample paper trade execution (HYPOTHETICAL numbers)",
      lines: [
        "10:20 — NIFTYBEES pulls back to VWAP at ₹261.40 and closes bullish (historical replay).",
        "Plan check: uptrend yes, VWAP pullback yes, inside window yes, no-trade conditions none.",
        "Stop below pullback low: ₹260.90 → risk per unit ₹0.50.",
        "Size: ₹500 / ₹0.50 = 1,000 units. Limit buy at ₹261.40, take-profit at ₹262.40 (2R).",
        "Trade reason: 'VWAP pullback long in uptrend, bullish close at VWAP, stop below swing low.'",
        "Later, BANKBEES spikes up with no pullback → not my setup → no trade, logged as skipped."
      ]
    },
    mistakes: [
      "Entering before the trigger bar closes because you 'know' it will work.",
      "Placing the order first and adding the stop later — or forgetting it.",
      "Writing a vague trade reason like 'looks good' just to get past the prompt.",
      "Using market orders in thin ETFs and ignoring the slippage in the review.",
      "Feeling a zero-trade session was wasted and forcing a trade near the close.",
      "Calculating size from feeling instead of from the stop distance."
    ],
    quiz: [
      { q: "What four checks come before every paper entry?", a: "Planned setup present, watchlist ETF, inside session window, no no-trade condition active." },
      { q: "How do you calculate position size?", a: "Risk per trade divided by the distance from entry to stop, rounded down." },
      { q: "Is a session with no trades a failure?", a: "No — if the setup never appeared, not trading is correct execution." }
    ]
  },

  67: {
    what: [
      "Managing an open trade means following the exit plan you wrote before entry. There are only a few legitimate reasons to exit: the stop is hit, the target is hit, the trailing rule says exit, the setup is invalidated by a specific condition you defined, or the session window is ending.",
      "The stop-loss is the one thing you must never move against yourself. Widening a stop to avoid being stopped out turns a planned 1R loss into an unplanned larger one. Moving it in your favour — for example to break-even after price reaches 1R, if your rules say so — is allowed when it is written in advance.",
      "Take-profit orders and trailing rules decide winners. If your plan says target 2R, the take-profit order does the work. If your plan says trail below each higher swing low on the 5m chart, you update the stop only at those points. What you avoid is exiting early because a red candle scared you, or removing the target because you hope for more.",
      "Intraday means flat by the close. In Paper you should close all positions before your session end time, for example 15:15 IST, so you practise the habit of not carrying intraday trades overnight."
    ],
    why: [
      "The time between entry and exit is where emotion is strongest. Fear says exit now; hope says hold longer. Both replace your tested rules with a guess. If your exits change from trade to trade, your results no longer reflect the strategy you backtested.",
      "Clean trade management keeps losses small and lets valid winners reach their planned target, which is what makes a positive expectancy possible at all."
    ],
    how: [
      "Before entering, write the exit plan in the trade reason: stop level, target or trailing rule, and invalidation condition.",
      "Place the stop-loss and take-profit orders in Paper at entry so the simulator handles them.",
      "While the trade is open, advance bar by bar and only touch the orders when a written rule says to.",
      "If you feel the urge to exit early or widen the stop, write the urge and the reason in the session journal instead of acting.",
      "If using a trailing stop, move it only at the predefined points and only in your favour.",
      "Close any open position before your session end time and mark it 'time exit' in the journal.",
      "After the session, label each exit as rule-based or emotional and count them."
    ],
    example: {
      title: "Sample trade-management rules (HYPOTHETICAL)",
      lines: [
        "Entry: BANKBEES long ₹505.20, stop ₹504.20 (1R = ₹1.00 per unit), target ₹507.20 (2R).",
        "Rule 1: If price reaches ₹506.20 (+1R), then move stop to entry ₹505.20.",
        "Rule 2: If a 5m bar closes back below VWAP, then exit at market (invalidation).",
        "Rule 3: If 15:10 IST arrives and the trade is open, then close it.",
        "Replay: price reached +1R, stop moved to break-even; target filled at ₹507.20 (+2R simulated).",
        "Journal: wanted to exit at +0.6R on a red bar — logged the urge, did not act."
      ]
    },
    mistakes: [
      "Widening the stop when price approaches it — the most expensive habit in trading.",
      "Closing winners early on the first pullback because of fear of giving back gains.",
      "Removing the take-profit to 'let it run' without a written trailing rule.",
      "Moving the stop to break-even too early, so normal noise stops out valid trades.",
      "Holding an intraday position past the planned session end."
    ],
    quiz: [
      { q: "Which direction may a stop-loss be moved during a trade?", a: "Only in your favour, and only when a written rule says so — never wider." },
      { q: "Name three legitimate exit reasons.", a: "Stop hit, target hit, trailing or invalidation rule triggered (or the session end time)." },
      { q: "What should you do with an urge to exit early?", a: "Write it in the session journal and follow the written exit rule." }
    ]
  },

  68: {
    what: [
      "Trading → Paper enforces risk limits automatically. If an order's risk (size × distance to stop) exceeds your risk per trade, the simulator rejects it. If you have reached your maximum trades for the session, new entries are rejected. If losses reach the daily loss limit, the session enters a cooldown and no new trades are accepted.",
      "A rejected order is not a bug or an obstacle; it is the system doing exactly what you asked it to do when you were calm. The right response is to read the rejection message, fix the order (smaller size, or no trade) and move on — never to raise the limit so the order goes through.",
      "The daily loss limit and cooldown deserve special respect. After two or three losses, judgement is affected: people trade faster, bigger and with worse setups to get the money back. The cooldown removes that option. The plan is to stop, step away, write in the journal and review the session later.",
      "Two habits complete this: never increase size after a winning streak because you feel confident, and never increase size after losses to recover faster. Size comes from the risk rule and the stop distance, nothing else."
    ],
    why: [
      "A strategy with a positive expectancy can still be wiped out by a few oversized trades. Risk limits protect the simulated account so that the strategy has enough trades to show what it really does.",
      "Practising inside hard limits builds the habit you would need anywhere: respecting rules even when you are frustrated or excited. That habit is scored directly in the Evaluation's risk and discipline skills."
    ],
    how: [
      "Before the session, confirm in Paper settings: risk per trade, max trades, daily loss limit and cooldown are all set and switched on.",
      "Write in your plan what you will do if an order is rejected: reduce size or skip, never change the limit.",
      "When an order is rejected, read the message, write it in the session journal and recalculate size from the stop distance.",
      "Track your running result in R during the session so you know how close you are to the daily limit.",
      "If the cooldown starts, stop the replay, close the Paper tab and write three lines in the Psychology journal: what happened, how you feel, what you would do differently.",
      "Never edit risk settings during a session. Changes are allowed only between sessions and must be written with a reason.",
      "In the session report, count rejected orders and cooldowns — each one is a learning prompt, not a failure."
    ],
    example: {
      title: "Sample if-then risk rules (HYPOTHETICAL)",
      lines: [
        "Limits: risk ₹500 per trade, max 3 trades, daily loss limit ₹1,000, cooldown on.",
        "If an order is rejected for size, then I recalculate size from the stop, or I skip.",
        "If I lose 2 trades in a row, then I pause 15 minutes before the next decision.",
        "If the daily loss limit is hit, then the cooldown runs and I journal instead of trading.",
        "If I just had a big winner, then my next size stays exactly the same.",
        "Replay note: order for 2,000 units rejected (risk ₹1,000 > ₹500) → resized to 1,000 units."
      ]
    },
    mistakes: [
      "Raising risk limits mid-session so a rejected order can go through.",
      "Opening a new paper session immediately after a cooldown to keep trading.",
      "Doubling size after losses to win the money back — revenge sizing.",
      "Increasing size after a winning streak because you 'are on form'.",
      "Not tracking the running result, so the daily limit arrives as a surprise.",
      "Treating cooldowns as embarrassing and leaving them out of the journal."
    ],
    quiz: [
      { q: "What should you do when Paper rejects an order for risk?", a: "Recalculate size from the stop distance or skip the trade — never raise the limit." },
      { q: "What happens when the daily loss limit is reached?", a: "A cooldown starts: no new trades, step away, journal and review later." },
      { q: "What decides position size after a big win?", a: "The same risk rule and stop distance as always — size never grows because of feelings." }
    ]
  },

  69: {
    what: [
      "You already backtested your strategy in Trading → Backtest. Paper trading is a second, slower test that includes you. Comparing the two answers a key question: when a human executes these rules bar by bar, do the results look like the backtest?",
      "Compare like with like: same ETFs, same timeframe, same rules, same cost model and similar market conditions. Useful metrics are number of trades, win rate, average win and loss in R, expectancy per trade, total costs and maximum drawdown. Both the Paper report and the Backtest report show these.",
      "Expect differences. A handful of paper sessions is a tiny sample, so win rate can swing wildly by chance. But some gaps have clear causes: fewer paper trades than the backtest (you skipped valid setups out of fear), more paper trades (you added unplanned trades), smaller average winners (you exited early), or bigger average losers (you widened stops or had slippage).",
      "The goal of the comparison is not to decide whether to trade for real. It is to find where your execution differs from your rules so you can practise that specific part."
    ],
    why: [
      "If paper results differ from the backtest, the difference is information. It usually points at behaviour — skipped trades, early exits, unplanned entries — rather than at the strategy itself.",
      "This comparison also keeps you honest about the backtest. If even disciplined paper execution cannot come close, the backtest assumptions (fills, costs, slippage) may have been too kind."
    ],
    how: [
      "Open the Paper session reports for your recent sessions and note trades, win rate, average R, costs and drawdown.",
      "Run Trading → Backtest on the same ETFs and the same dates you paper traded, with the same strategy and cost model.",
      "Put the two sets of numbers side by side in your Trading Journal.",
      "List trades the backtest took that you did not (missed or skipped) and trades you took that the backtest did not (unplanned).",
      "Compare average winner and loser in R to spot early exits or widened stops.",
      "Check whether paper fills had more slippage than the backtest assumed, especially in thinner ETFs.",
      "Write one execution change to practise in the next paper session."
    ],
    example: {
      title: "Sample comparison — same ETF and dates (HYPOTHETICAL numbers)",
      lines: [
        "Backtest (NIFTYBEES, 5m, 10 sessions): 14 trades, win rate 43%, avg win +1.9R, avg loss -1.0R.",
        "Paper (same 10 sessions): 11 trades, win rate 45%, avg win +1.3R, avg loss -1.1R.",
        "Missing trades: 4 valid setups skipped after a loss. Extra trade: 1 unplanned chase.",
        "Avg win lower → exited before target on 3 trades out of fear.",
        "Avg loss slightly higher → slippage on two market orders.",
        "Next focus: hold to target unless a written invalidation rule triggers. Small sample — no conclusions about edge."
      ]
    },
    mistakes: [
      "Comparing paper results on different ETFs or dates with an unrelated backtest.",
      "Drawing big conclusions from three or four paper sessions.",
      "Blaming the strategy when the gap clearly comes from skipped or early-exited trades.",
      "Ignoring costs and slippage differences between the two reports.",
      "Treating good paper results as a signal to start trading real money."
    ],
    quiz: [
      { q: "What should match when comparing paper and backtest results?", a: "Same ETFs, dates, timeframe, strategy rules and cost model." },
      { q: "Paper average winner is much smaller than backtest. Likely cause?", a: "Exiting winners early instead of holding to the planned target." },
      { q: "Why be careful with conclusions from a few paper sessions?", a: "The sample is small, so results can vary a lot by chance." }
    ]
  },

  70: {
    what: [
      "This week moved you from historical testing to simulated execution. Day 64 set the paper-trading rules: virtual account, risk per trade, daily loss limit, max trades and one tested strategy. Day 65 built the pre-session plan with a small watchlist, key levels, one setup and no-trade conditions.",
      "Days 66 and 67 practised executing and managing trades: enter only the planned setup, attach stop and target, write a trade reason, size from the stop distance, and exit only by rule. Day 68 focused on risk limits: rejected orders and cooldowns are the system protecting you, and size never changes because of wins or losses.",
      "Day 69 compared paper results with the backtest on the same ETFs and dates. Gaps usually point at execution — skipped setups, unplanned entries, early exits or slippage — rather than at the strategy.",
      "The weekly review asks one thing above all: how well did you follow your own rules? Virtual P&L is a side note; rule-following is the skill you are building."
    ],
    why: [
      "Reviewing a whole week shows patterns that one session hides, such as always skipping trades after a loss or always overtrading on gap days. Patterns are what you can actually fix.",
      "A weekly review also resets your focus. Picking one change for next week is more effective than trying to fix everything at once."
    ],
    how: [
      "Open every Paper session report from this week and list trades, rule breaks, rejected orders and cooldowns.",
      "Score each session for plan adherence: trades that matched the plan / all trades taken, plus skipped valid setups.",
      "Check the Mistake Lab for the mistake tag that appeared most often this week.",
      "Re-read your comparison from Day 69 and confirm the main execution gap.",
      "Answer this week's quizzes without looking, then check the answers.",
      "Write a weekly review in the Trading Journal: what went well, the most repeated mistake, one change for next week.",
      "Update your paper-trading rules if the review showed a rule that was unclear."
    ],
    example: {
      title: "Sample weekly paper review (HYPOTHETICAL)",
      lines: [
        "Sessions: 4 historical replays, NIFTYBEES and BANKBEES, 5m VWAP pullback.",
        "Trades: 9. Matched plan: 7 (78%). Unplanned: 2. Valid setups skipped: 3.",
        "Rejected orders: 1 (size too big). Cooldowns: 1, respected fully.",
        "Most repeated mistake: exiting before 2R target (4 times).",
        "Virtual result: -0.4R (simulated) — not the focus.",
        "Change for next week: let the take-profit order work; log urges instead of exiting."
      ]
    },
    mistakes: [
      "Judging the week by virtual profit instead of rule-following.",
      "Skipping the review because sessions 'went fine'.",
      "Picking five changes at once and following none of them.",
      "Not counting skipped valid setups as part of execution quality.",
      "Changing strategy because of one losing week of paper trades."
    ],
    quiz: [
      { q: "What is the main measure of a good paper-trading week?", a: "How closely you followed your plan and rules, not virtual P&L." },
      { q: "Name two things the Paper simulator enforces automatically.", a: "Risk limits that reject oversized orders and a cooldown after the daily loss limit (also max trades and a required trade reason)." },
      { q: "What usually explains gaps between paper and backtest results?", a: "Execution — skipped setups, unplanned trades, early exits or slippage." }
    ]
  },

  71: {
    what: [
      "FOMO — fear of missing out — is the urge to enter an ETF because it is already moving and you feel left behind. On an intraday chart it usually looks like a large green candle breaking away from VWAP or the opening range, and a voice saying 'this is the move, get in now'.",
      "FOMO trades are usually chases: the entry is far from any level, so the stop has to be wide or is skipped, and the room left to a sensible target is small. The reward-to-risk collapses before the trade even starts, and costs take a bigger share of what little move is left.",
      "Overtrading is the close cousin of FOMO. It means taking more trades than your plan allows, often small, low-quality ones, because sitting still feels unproductive. With ETFs, every round trip pays brokerage, STT, exchange charges, stamp duty and GST, so extra trades add cost even when they break even on price.",
      "The fix is structural, not heroic: a max-trades rule enforced by Paper, a required trade reason that must name your setup, and a missed-trades list where you record moves you did not chase. Markets open every session; missing one move costs nothing."
    ],
    why: [
      "FOMO and overtrading are among the most common mistakes in beginner journals because they feel urgent and exciting. They break several rules at once — no setup, bad location, unclear stop, rushed size.",
      "If your paper results are full of chases and extra trades, they measure impulses, not your strategy. Removing them is the quickest way to get honest data."
    ],
    how: [
      "In your pre-session plan, write the exact setup you will take. Anything else is not a trade today.",
      "Add a Psychology Rules line to your Playbook: 'If price is already more than 1R away from my entry level, then I do not chase — I log it as missed.'",
      "Use Trading → Replay on a trending ETF session and mark every moment you feel the urge to chase. Lock No-Trade on those bars and check later what happened.",
      "Keep the max-trades limit in Paper at 3 or fewer and leave it unchanged during the session.",
      "When the urge hits, take a 60-second pause: hands off the mouse, four slow breaths, read the entry checklist. Any unticked box means no.",
      "Log every FOMO urge in the Psychology journal with intensity 1-10 and what you saw on the chart.",
      "Tag chases and extra trades in the Mistake Lab so Analytics can compare them with planned trades."
    ],
    example: {
      title: "Sample replay journal — a FOMO near-miss (HYPOTHETICAL)",
      lines: [
        "Historical replay: BANKBEES, 5m. Plan: long pullback to VWAP only.",
        "10:05 — one bar jumps ₹2.10 above VWAP (about 3× my normal stop). Urge to buy: 8/10.",
        "Checklist: 'pullback to VWAP' unticked → No-Trade locked. Logged as missed.",
        "10:45 — price pulls back to VWAP, bullish close → valid setup, normal 1R stop.",
        "Comparison: chase entry would have needed a stop 3× wider for the same target.",
        "Takeaway: waiting cost nothing; chasing would have broken the risk rule."
      ]
    },
    mistakes: [
      "Entering after a big candle because it 'looks strong'.",
      "Widening the stop to make a chase trade fit the rules.",
      "Trading ETFs that were not on the pre-session watchlist.",
      "Treating a missed move as a loss, which fuels the next impulsive entry.",
      "Taking small extra trades out of boredom and ignoring the cost of each round trip."
    ],
    quiz: [
      { q: "Why does a chase entry hurt reward-to-risk?", a: "The late entry forces a wider stop and leaves less room to the target." },
      { q: "Why does overtrading hurt even break-even trades in ETFs?", a: "Every round trip pays brokerage, STT, exchange charges, stamp duty and GST." },
      { q: "What do you do with a move you did not chase?", a: "Log it on the missed-trades list — missing a move costs nothing." }
    ]
  },

  72: {
    what: [
      "Losses are a normal, unavoidable part of any trading strategy. A strategy that wins 45% of the time loses more than half its trades by design. A loss taken at your planned stop, with planned size, on a valid setup is not a mistake — it is the cost of testing the setup.",
      "Revenge trading is what happens when a loss feels personal. You want the money back now, so you take the next thing that moves, often with bigger size and a looser stop. One revenge trade tends to lead to another, and a normal -1R day becomes -4R or worse.",
      "The daily loss limit and cooldown are designed for exactly this moment. When losses reach the limit, Trading → Paper stops accepting new trades for the rest of the session. That is not a punishment; it removes the option to act on a state of mind you already know is unreliable.",
      "The most important rule is about size: never increase size to recover losses, and never increase size after wins either. Size is calculated from your risk rule and the stop distance, and it stays the same whatever the last trade did."
    ],
    why: [
      "Most large drawdowns in trading journals come not from one bad trade but from a chain of revenge trades after a normal loss. Breaking the chain early protects your simulated account and the quality of your data.",
      "Learning to accept losses calmly is also what lets you take the next valid setup without fear, which keeps execution consistent."
    ],
    how: [
      "Write your post-loss rules as if-then statements in the Psychology Rules section of the Playbook before your next session.",
      "Set the daily loss limit in Paper (for example 2R) and confirm the cooldown is on.",
      "After any loss, pause at least 5 minutes before the next decision and rate your emotion 1-10 in the Psychology journal.",
      "If the emotion rating is 7 or higher, end the session even if the limit has not been reached.",
      "When the cooldown starts, close Paper, step away from the screen and come back only to journal.",
      "Review revenge-trade tags in the Mistake Lab weekly to see whether the chain is getting shorter.",
      "Read your size rule aloud before each entry: 'Size comes from risk / stop distance, nothing else.'"
    ],
    example: {
      title: "Sample post-loss if-then rules (HYPOTHETICAL)",
      lines: [
        "If I take a full -1R loss, then I wait 5 minutes and rate my emotion 1-10.",
        "If my emotion rating is 7+, then I end the session and journal.",
        "If I lose two trades in a row, then my next trade needs an A-quality setup from my Best Setups list.",
        "If the daily loss limit (-2R) is hit, then the cooldown runs — no new session today.",
        "If I feel the urge to 'make it back', then I write that sentence in the journal instead of trading.",
        "Size rule: same ₹500 risk per trade after wins and after losses."
      ]
    },
    mistakes: [
      "Treating every loss as a mistake, even when the trade followed the plan.",
      "Doubling size after a loss to recover faster.",
      "Starting a fresh paper session right after a cooldown.",
      "Lowering setup standards after a loss — 'anything will do'.",
      "Not journaling emotions after losses, so the pattern stays hidden.",
      "Increasing size after a winning streak and giving it all back."
    ],
    quiz: [
      { q: "Is a loss at your planned stop on a valid setup a mistake?", a: "No — it is a normal cost of running the strategy." },
      { q: "What is the purpose of the cooldown after the daily loss limit?", a: "To stop trading while judgement is affected and prevent a chain of revenge trades." },
      { q: "When may you increase position size to recover losses?", a: "Never — size always comes from the risk rule and stop distance." }
    ]
  },

  73: {
    what: [
      "Discipline in trading means doing what the plan says even when it feels wrong at that moment: skipping a tempting non-setup, taking a valid setup after two losses, holding to target when you want to exit, or stopping when the limit is hit.",
      "Discipline is not a personality trait you either have or lack. It is mostly the result of habits and structure. A pre-session checklist makes sure you start prepared. If-then rules decide difficult moments in advance. A rule-following score after each session makes progress visible.",
      "If-then rules are especially useful. Instead of a vague intention like 'I will be patient', you write 'If price is more than 1R from my level, then I do not enter.' The trigger is specific and observable, and the action is already decided, so there is nothing to negotiate in the moment.",
      "A simple rule-following score is: trades that followed every rule / total trades, plus a note on valid setups you skipped. Track it per session in the Trading Journal. A rising score matters more than any virtual profit figure."
    ],
    why: [
      "Your backtest results only apply if you follow the rules that produced them. Every rule break means you are trading an untested strategy.",
      "Discipline is one of the eight skills in the Evaluation dashboard, and it improves the other seven — risk compliance, psychology and paper-trading scores all depend on it."
    ],
    how: [
      "Write a pre-session checklist of 5-7 items: plan saved, watchlist checked, levels marked, limits set in Paper, emotion rating noted, no-trade conditions read.",
      "Turn your three most common rule breaks into if-then rules and add them to the Psychology Rules section of the Playbook.",
      "Run the checklist before every paper session. If an item is not done, the session does not start.",
      "After each session, calculate the rule-following score in the Trading Journal.",
      "Mark every rule break in the Mistake Lab with the rule that was broken.",
      "Review the score trend weekly in Analytics and celebrate process wins, not virtual profits."
    ],
    example: {
      title: "Sample pre-session checklist and if-then rules (HYPOTHETICAL)",
      lines: [
        "Checklist: plan saved · watchlist liquid · levels marked · Paper limits on · emotion < 6/10 · no-trade list read.",
        "If I have not completed the checklist, then I do not start the replay.",
        "If my setup is not fully present, then I lock No-Trade and wait.",
        "If I want to exit before target without an invalidation signal, then I write the urge down instead.",
        "Session score: 4 of 5 trades followed every rule = 80%; 1 valid setup skipped.",
        "Next session goal: 100% rules followed on fewer, cleaner trades."
      ]
    },
    mistakes: [
      "Relying on willpower in the moment instead of rules decided in advance.",
      "Writing vague rules ('be patient') that cannot be checked.",
      "Skipping the checklist on days you feel confident.",
      "Measuring progress by virtual profit instead of rule-following.",
      "Excusing rule breaks when the trade happened to win."
    ],
    quiz: [
      { q: "What makes an if-then rule better than a general intention?", a: "It has a specific, observable trigger and a pre-decided action." },
      { q: "How do you calculate a simple rule-following score?", a: "Trades that followed every rule divided by total trades, noting skipped valid setups." },
      { q: "Is a rule-breaking trade that won a good trade?", a: "No — it still broke the plan and makes your data less reliable." }
    ]
  },

  74: {
    what: [
      "The Playbook is your personal rulebook for how you practise trading ETFs in this app. It has ten sections: My Market, My Strategy, Entry Rules, Stop-Loss Rules, Exit Rules, Risk Rules, No-Trade Conditions, Psychology Rules, Best Setups and Common Mistakes. Over the next three days you fill them in from your own evidence.",
      "My Market describes where you practise: which ETFs (for example NIFTYBEES and BANKBEES), why they suit you (liquidity, tight spread, price close to iNAV), which session times you trade (for example 09:30-14:45 IST) and which ETFs you avoid (thinly traded or wide-spread ones).",
      "My Strategy describes the one strategy you have tested most honestly — trend, breakout, pullback or range — in plain words: what market condition it needs, what the setup looks like, which timeframe and indicators it uses, and what your backtest and paper results showed.",
      "Entry Rules, Stop-Loss Rules and Exit Rules belong with the strategy. Write them so precisely that a stranger could follow them and get the same trades. Vague rules ('enter when it looks strong') are the first thing to fix."
    ],
    why: [
      "A written Playbook turns everything you learned into one reference you can check before and during every session. Without it, rules drift from week to week and your results stop meaning anything.",
      "Writing it also exposes gaps. If you cannot describe your exit rule clearly, you probably have not been following one."
    ],
    how: [
      "Open the Playbook and read the ten section headings before writing anything.",
      "In My Market, list your ETFs with their liquidity check results from Trading → Practice and the session times you trade.",
      "List ETFs you will not trade and why (low volume, wide spread, large premium/discount to iNAV).",
      "In My Strategy, describe one strategy and summarise its Backtest and Paper results, including out-of-sample numbers.",
      "Fill Entry Rules, Stop-Loss Rules and Exit Rules with specific, checkable conditions.",
      "Read each rule and ask: 'Could a stranger follow this and take the same trade?' Rewrite any that fail.",
      "Note the evidence behind each rule in the Trading Journal (which backtest, which paper sessions)."
    ],
    example: {
      title: "Sample Playbook sections — My Market & My Strategy (HYPOTHETICAL)",
      lines: [
        "My Market: NIFTYBEES and BANKBEES on NSE. Both pass volume, traded value and spread checks.",
        "Avoid: thin sector ETFs with wide spreads; any ETF trading far from iNAV.",
        "Session: entries 09:30-14:45 IST, flat by 15:15. No entries in the first 15 minutes.",
        "My Strategy: VWAP pullback in an intraday uptrend, 5m chart.",
        "Entry: price above VWAP and rising 20 EMA; pullback touches VWAP; bullish close → limit buy.",
        "Stop: below pullback low. Exit: 2R target, or close below VWAP, or 15:10 IST.",
        "Evidence: 10-session backtest plus 8 paper sessions (small sample, still learning)."
      ]
    },
    mistakes: [
      "Listing many ETFs and strategies instead of the few you actually tested.",
      "Copying rules from somewhere else instead of from your own evidence.",
      "Writing vague entry rules that cannot be checked bar by bar.",
      "Leaving out the exit rule, or writing 'exit when it feels right'.",
      "Overstating results — a small sample is a learning stage, not proof."
    ],
    quiz: [
      { q: "What belongs in the My Market section?", a: "Which ETFs and session times you practise, why, and which ETFs you avoid." },
      { q: "What test should every entry rule pass?", a: "A stranger could follow it and take the same trade." },
      { q: "Why describe only one strategy?", a: "It is the one you have tested; focus keeps the data clean and execution consistent." }
    ]
  },

  75: {
    what: [
      "Risk Rules are the numbers that keep your simulated account safe: risk per trade (for example 0.5% of the virtual account), daily loss limit (for example 2R), maximum trades per session, the cooldown after the limit, and the rule that size never increases after wins or to recover losses.",
      "These rules should match your Trading → Paper settings exactly. The Playbook says what the rules are and why; the simulator enforces them. If the two ever differ, update one or the other between sessions — never during one.",
      "No-Trade Conditions cover both the market and you. Market conditions: low volume or traded value, a spread wider than usual, a large premium or discount to iNAV, a choppy session crossing VWAP many times, the expected move too small to cover costs. Personal conditions: tired, ill, rushed, upset, or still thinking about the last loss.",
      "No-trade conditions are powerful because they remove whole groups of bad trades at once. One line such as 'no trades when the spread is wider than 0.05%' can prevent many losing entries in thin ETFs."
    ],
    why: [
      "Risk Rules and No-Trade Conditions are the parts of the Playbook that should change least. Strategies evolve, but protecting the account and knowing when to sit out stay constant.",
      "Writing why each rule exists makes it easier to keep when you are tempted to break it, because you remember what the rule protects you from."
    ],
    how: [
      "Open the Playbook's Risk Rules section and write each limit as a number, not a feeling.",
      "Open Trading → Paper settings and confirm every number matches.",
      "Add the size rule: 'Size = risk per trade / stop distance. It never grows after wins or losses.'",
      "Add the cooldown rule: what you do when the daily loss limit is hit, step by step.",
      "In No-Trade Conditions, write at least four market conditions and two personal conditions.",
      "Use Trading → Backtest cost settings to set a minimum expected move that covers round-trip costs; add it as a no-trade condition.",
      "Under each rule, write one sentence on why it exists."
    ],
    example: {
      title: "Sample Risk Rules and No-Trade Conditions (HYPOTHETICAL)",
      lines: [
        "Risk per trade: 0.5% of virtual account (₹500 on ₹1,00,000). Max 3 trades per session.",
        "Daily loss limit: -2R → cooldown, journal, no new session today.",
        "Size never increases after wins or to recover losses.",
        "No trade if: spread > 0.05%; price far from iNAV; VWAP crossed 4+ times by 11:00.",
        "No trade if: target move < 3× round-trip costs (costs from the app's cost model).",
        "No trade if: I slept badly, I feel rushed, or emotion rating is 7+/10."
      ]
    },
    mistakes: [
      "Writing risk rules as feelings ('small size') instead of numbers.",
      "Playbook limits that differ from Paper settings.",
      "Only listing market no-trade conditions and ignoring your own state.",
      "Forgetting costs — trading moves too small to cover round-trip charges.",
      "Treating the cooldown as optional on 'special' days."
    ],
    quiz: [
      { q: "Where are risk rules written and where are they enforced?", a: "Written in the Playbook's Risk Rules; enforced by Trading → Paper's risk limits." },
      { q: "Give two personal no-trade conditions.", a: "Feeling tired, rushed or upset; high emotion rating after a loss." },
      { q: "Why add a minimum expected move to no-trade conditions?", a: "So you skip trades whose likely move would not cover round-trip costs." }
    ]
  },

  76: {
    what: [
      "Best Setups is the section where you describe the specific versions of your strategy that you execute best. Your evidence comes from the Trading Journal, Paper session reports and Analytics: which setups did you follow cleanly, with good location and planned exits?",
      "Each best setup should have a name, the market context it needs, a precise checklist of what must be present, and a reference to a chart example from a replay or paper session. For example: 'A-setup: first VWAP pullback after an opening-range breakout up, on NIFTYBEES, before 11:30 IST.'",
      "Common Mistakes is the opposite list. The Mistake Lab and Psychology journal show which errors repeat: chasing, early exits, widening stops, trading thin ETFs, revenge trades after losses. Pick your top three by frequency or by damage in R.",
      "Each mistake needs a prevention rule, ideally written as an if-then rule and linked to Psychology Rules. A mistake with no prevention rule is just a confession; with one, it becomes a plan."
    ],
    why: [
      "Narrowing down to the setups you execute best focuses your attention on the moments where your process is strongest, and helps you skip the marginal ones.",
      "Naming your repeated mistakes, with rules to prevent them, turns past losses in simulation into protection for future sessions."
    ],
    how: [
      "Open Analytics and filter paper trades by setup tag. Note which tags you executed with the fewest rule breaks.",
      "Write one to three Best Setups, each with context, checklist and a reference chart from Replay or Paper.",
      "Open the Mistake Lab and sort mistakes by frequency and by total R lost.",
      "Write your top three in Common Mistakes, each with a short description of what it looks like on the chart.",
      "Add a prevention if-then rule for each mistake and copy the rules into Psychology Rules.",
      "Add the emotions that usually come before each mistake from your Psychology journal.",
      "Ask Trading → Ask AI to review a section for vague wording, then rewrite it in your own words."
    ],
    example: {
      title: "Sample Best Setups and Common Mistakes (HYPOTHETICAL)",
      lines: [
        "A-setup: first VWAP pullback after opening-range breakout up — NIFTYBEES, 5m, before 11:30 IST.",
        "Checklist: OR high broken on above-average volume · pullback holds VWAP · bullish close · spread normal.",
        "Mistake 1: chasing breakouts (5 times, -4.5R simulated). Rule: if > 1R from level, no entry.",
        "Mistake 2: exiting before target (6 times). Rule: if no invalidation signal, the take-profit order stays.",
        "Mistake 3: trading after two losses with lower standards. Rule: after 2 losses, A-setup only.",
        "Emotion before Mistake 1: excitement 8/10. Before Mistake 3: frustration 7/10."
      ]
    },
    mistakes: [
      "Choosing best setups from memory instead of from your own data.",
      "Describing setups too loosely to check bar by bar.",
      "Listing ten mistakes and fixing none — focus on the top three.",
      "Writing mistakes without prevention rules.",
      "Calling a setup 'best' because of one big simulated winner."
    ],
    quiz: [
      { q: "Where does evidence for Best Setups come from?", a: "Your Trading Journal, Paper session reports and Analytics." },
      { q: "What should each Common Mistake be paired with?", a: "A prevention rule, ideally an if-then rule in Psychology Rules." },
      { q: "How do you choose the top three mistakes?", a: "By how often they occur and how much R they cost in the Mistake Lab." }
    ]
  },

  77: {
    what: [
      "This week turned from charts to the trader. Day 71 covered FOMO and overtrading: chasing ruins reward-to-risk, extra trades add costs, and a missed-trades list and max-trades limit keep them in check. Day 72 covered losses, revenge trading and the cooldown: losses are normal, and size never grows to recover them.",
      "Day 73 built discipline from habits: a pre-session checklist, if-then rules and a rule-following score. Days 74-76 wrote the Playbook: My Market and My Strategy, Entry, Stop-Loss and Exit Rules, Risk Rules and No-Trade Conditions, then Best Setups, Common Mistakes and Psychology Rules — all from your own evidence.",
      "Today you read the whole Playbook end to end in one sitting, check each rule against your journals, and test it in one paper session. Any rule you cannot follow or check in the moment gets rewritten.",
      "A Playbook is a living document. It should be updated between sessions as evidence grows, but never edited mid-session to justify a trade."
    ],
    why: [
      "Writing a Playbook in parts can leave gaps and contradictions between sections. Reading it whole and testing it reveals them before they matter.",
      "Linking psychology habits to written rules is what makes them last; the weekly review checks that the link is real."
    ],
    how: [
      "Read all ten Playbook sections in order without editing, and mark anything unclear.",
      "Check that Risk Rules match Trading → Paper settings exactly.",
      "Compare Psychology Rules with your Psychology journal: does each rule address a trigger you actually logged?",
      "Run one paper session using only the Playbook, with the pre-session checklist first.",
      "After the session, score rule-following and note any rule that was hard to apply.",
      "Rewrite vague or contradictory rules and date the change.",
      "Answer this week's quizzes from memory, then check."
    ],
    example: {
      title: "Sample weekly psychology & Playbook review (HYPOTHETICAL)",
      lines: [
        "Playbook read-through: 2 vague rules found (exit 'if weak', avoid 'thin' ETFs).",
        "Rewritten: exit if a 5m bar closes below VWAP; avoid ETFs with spread > 0.05%.",
        "Psychology journal: FOMO urges 7 this week (down from 11), 1 revenge trade, 1 cooldown respected.",
        "Test session (historical replay): 3 trades, 3 rule-compliant, 1 urge logged not acted on.",
        "Virtual result: +0.8R (simulated, small sample).",
        "Next week focus: keep the checklist streak going into the Final Evaluation phase."
      ]
    },
    mistakes: [
      "Writing the Playbook and never reading it again.",
      "Editing rules mid-session to justify a trade.",
      "Keeping psychology rules that do not match any trigger you actually experience.",
      "Leaving contradictions between sections, such as different risk numbers.",
      "Judging the Playbook by one session's virtual P&L."
    ],
    quiz: [
      { q: "When is it acceptable to change a Playbook rule?", a: "Between sessions, based on evidence, with the change dated — never mid-session." },
      { q: "What is the size rule after wins or losses?", a: "Size never increases after wins or to recover losses; it comes from risk / stop distance." },
      { q: "Why test the Playbook in a paper session?", a: "To find rules that are vague or hard to follow in the moment." }
    ]
  },

  78: {
    what: [
      "The final phase begins with a knowledge review. Before judging your strategy, execution or psychology, you check that the foundations are solid: what an ETF is, how it trades on the NSE, and what affects the price you actually get.",
      "Core ideas to revisit: ETF units trade on the exchange like shares while tracking an index or asset; market makers provide liquidity; iNAV is the indicative value of the underlying basket, and the ETF can trade at a premium or discount to it. Many ETFs are thinly traded, so volume, traded value and spread must be checked before any trade.",
      "Costs: an intraday ETF round trip pays brokerage (often the lower of ₹20 or 0.03% per order at discount brokers), STT of 0.025% on the sell side for equity ETFs (none for gold or liquid ETFs), an NSE transaction charge around 0.00297%, SEBI fee of ₹10 per crore, stamp duty of 0.003% on buys and 18% GST on brokerage plus exchange and SEBI charges. Rates change, and the app lets you configure them.",
      "Charts and context: candlesticks, 1m/5m/15m timeframes, volume, VWAP, opening range and session phases (09:15-15:30 IST, pre-open 09:00-09:15), gaps, support and resistance, market structure, trending vs ranging vs choppy conditions, sector rotation and why gold ETFs behave differently from equity ETFs."
    ],
    why: [
      "Every later skill sits on these foundations. A strategy that ignores spread or costs, or a chart read that ignores iNAV and liquidity, can look fine in theory and fail in simulation.",
      "The Evaluation dashboard scores knowledge as one of its eight skills; reviewing now shows you which topics need another pass."
    ],
    how: [
      "Re-read the key points for Days 1-21 on the Journey page and mark any you cannot explain in one sentence.",
      "Retake the quizzes for Phases 1-3 without looking at answers, then check and note wrong answers.",
      "Recalculate the cost of one hypothetical NIFTYBEES round trip using the cost model in Trading → Backtest settings.",
      "Open Trading → Markets and explain to yourself VWAP, the opening range and today's structure on an ETF chart.",
      "Run the ETF eligibility check in Trading → Practice on three ETFs and explain each result.",
      "Ask Trading → Ask AI to quiz you on your weakest topic.",
      "List your three weakest topics in the Trading Journal with a date to revisit each."
    ],
    example: {
      title: "Sample cost recalculation (HYPOTHETICAL — rates change, check app settings)",
      lines: [
        "Trade: buy and sell 1,000 NIFTYBEES at about ₹260 → turnover ~ ₹5,20,000.",
        "Brokerage: lower of ₹20 or 0.03% per order → ₹20 × 2 = ₹40.",
        "STT: 0.025% of sell value ₹2,60,000 = ₹65. Stamp duty: 0.003% of buy ₹2,60,000 = ₹7.80.",
        "Exchange charge ~ 0.00297% × ₹5,20,000 ~ ₹15.44. SEBI fee ~ ₹0.52.",
        "GST 18% on (₹40 + ₹15.44 + ₹0.52) ~ ₹10.07.",
        "Total ~ ₹139 per round trip → the price must move about ₹0.14 per unit just to break even."
      ]
    },
    mistakes: [
      "Skipping the knowledge review because the early lessons 'feel easy'.",
      "Forgetting that STT and stamp duty apply on different sides of the trade.",
      "Ignoring premium/discount to iNAV when judging an ETF's price.",
      "Assuming cost rates never change instead of checking the app settings.",
      "Reviewing passively by re-reading rather than testing yourself with quizzes."
    ],
    quiz: [
      { q: "What is iNAV and why does it matter?", a: "The indicative value of the ETF's basket; the ETF can trade at a premium or discount to it." },
      { q: "On which side is STT charged for intraday equity ETF trades?", a: "The sell side, at 0.025% (gold and liquid ETFs have none) — rates can change." },
      { q: "What should you check before trading any ETF intraday?", a: "Volume, traded value, spread and premium/discount to iNAV." }
    ]
  },

  79: {
    what: [
      "Today you review the four strategies you studied — trend-following, breakout, pullback and range-bound — and the backtests you ran on them. The aim is not to pick the one that made the most simulated money but to find the one you understand best and tested most honestly.",
      "For each strategy, check that you can state the exact rules: the market condition it needs, entry trigger, stop placement, exit rule and when not to use it. If you cannot write the rules in a few lines, the backtest results are hard to trust because you do not know exactly what was tested.",
      "Then review backtest quality. Did it use next-bar fills and no look-ahead? Did it include the Indian cost model and realistic slippage? Did you separate training and out-of-sample periods, and did out-of-sample results hold up? How many trades were in the sample?",
      "Warning signs include a great training result that collapses out-of-sample, very few trades, many tweaked parameters, or results that only work on one ETF in one period. These suggest overfitting or luck rather than a robust edge."
    ],
    why: [
      "Your Playbook strategy should rest on the most honest evidence you have. Reviewing strategies and backtests together shows whether that evidence is solid or fragile.",
      "Strategy and backtesting are both scored skills in the Evaluation; this review prepares you for them."
    ],
    how: [
      "Open Strategy Lab and write the rules of each strategy in five lines or fewer.",
      "Open your saved Trading → Backtest reports and note trades, win rate, profit factor, max drawdown and expectancy for each.",
      "For each report, confirm costs and slippage were on and that training and out-of-sample results were both recorded.",
      "Re-run your Playbook strategy on a new out-of-sample date range you have not used before.",
      "Compare results across at least two ETFs, such as NIFTYBEES and BANKBEES.",
      "Flag any strategy with fewer than about 30 trades as 'insufficient sample'.",
      "Summarise what your backtests do and do not show in the Trading Journal."
    ],
    example: {
      title: "Sample strategy & backtest review table (HYPOTHETICAL)",
      lines: [
        "Pullback, NIFTYBEES 5m: training 42 trades, PF 1.25; out-of-sample 18 trades, PF 1.08.",
        "Breakout, BANKBEES 5m: training 35 trades, PF 1.60; out-of-sample 15 trades, PF 0.82 → possible overfit.",
        "Range, GOLDBEES 15m: 12 trades total → insufficient sample.",
        "All runs: next-bar fills, Indian cost model on, 0.02% slippage assumed.",
        "Conclusion: pullback is the most consistent and best understood — still a small sample.",
        "No result here is a prediction of future performance."
      ]
    },
    mistakes: [
      "Choosing the strategy with the best training result and ignoring out-of-sample.",
      "Trusting backtests that had costs or slippage switched off.",
      "Treating 10-15 trades as proof of an edge.",
      "Not being able to state a strategy's rules precisely.",
      "Tweaking parameters again until the new out-of-sample period looks good."
    ],
    quiz: [
      { q: "What is a warning sign of overfitting?", a: "Strong training results that collapse out-of-sample, especially after many parameter tweaks." },
      { q: "Name two things a trustworthy backtest must include.", a: "No look-ahead with next-bar fills, and realistic costs and slippage." },
      { q: "Why might a strategy with few trades be unreliable?", a: "A small sample can look good or bad purely by chance." }
    ]
  },

  80: {
    what: [
      "The paper-trading review looks at every Trading → Paper session from Phase 10 onward. The question is how well you executed your plans in simulation, session by session, and whether that improved over time.",
      "Useful measures: plan adherence (trades that matched the written plan / all trades), valid setups skipped, unplanned trades, exits by rule vs by emotion, rejected orders, cooldowns, average R per trade and costs paid. The session journals add context about why things happened.",
      "Compare the combined paper statistics with the backtest on the same ETFs and dates, as you did on Day 69, but now with a larger sample. Look for gaps that shrank because of practice and gaps that are still there.",
      "Remember that paper fills on historical data can be kinder than reality, particularly in thinly traded ETFs where real slippage and partial fills may be worse. Paper results show execution skill in simulation; they do not predict real-money results."
    ],
    why: [
      "Paper trading is the closest the app gets to rehearsing real decisions. An honest review shows which execution skills are now reliable and which still need deliberate practice.",
      "Paper trading is one of the eight Evaluation skills, and its score is built from exactly these measures."
    ],
    how: [
      "Open all Paper session reports and copy key numbers into one table in the Trading Journal.",
      "Calculate plan adherence and rule-based exits per session and plot the trend in Analytics.",
      "Count unplanned trades and skipped valid setups across all sessions.",
      "Compare total paper statistics with a backtest on the same ETFs and dates.",
      "Read three session journals — your best, your worst and your most recent — and note what changed.",
      "Write your two strongest execution habits and your two biggest remaining gaps."
    ],
    example: {
      title: "Sample paper-trading summary (HYPOTHETICAL, simulated)",
      lines: [
        "Sessions: 14 historical replays. Trades: 31.",
        "Plan adherence: 68% in week 1 → 90% in latest week.",
        "Exits by rule: 74% overall; early exits fell from 6 to 1 per week.",
        "Unplanned trades: 5 (4 in the first week). Cooldowns: 2, both respected.",
        "Paper vs backtest avg win: 1.5R vs 1.8R — still some early exits.",
        "Note: fills may be optimistic vs reality; this measures process, not real-money readiness."
      ]
    },
    mistakes: [
      "Reviewing only your best sessions.",
      "Focusing on virtual P&L instead of adherence and rule-based exits.",
      "Ignoring the trend over time — improvement matters more than totals.",
      "Assuming paper fills equal real fills in thin ETFs.",
      "Treating a good paper record as permission to trade real money."
    ],
    quiz: [
      { q: "What is plan adherence?", a: "Trades that matched the written plan divided by all trades taken." },
      { q: "Why might paper fills look better than reality?", a: "Simulated fills on historical data can understate slippage and partial fills, especially in thin ETFs." },
      { q: "Which three sessions are useful to re-read?", a: "Your best, your worst and your most recent." }
    ]
  },

  81: {
    what: [
      "Risk compliance means you did what your risk rules said on every trade, not just most of them. Today you audit your Trading Journal and Trading → Paper history trade by trade against the Risk Rules section of your Playbook.",
      "Check four things for every trade: it had a stop-loss placed at entry; its size fit the risk per trade (risk / stop distance); it had a written trade reason; and it was inside the session window and max-trades limit. Then check each session: was the daily loss limit respected and did the cooldown run when triggered?",
      "Also look for the two quiet size errors: increasing size after a winning streak because you felt confident, and increasing size after losses to recover faster. Both may pass the simulator's limit if the limit was loose, but both break the principle that size comes only from the rule.",
      "Record a compliance percentage — compliant trades / all trades — and list every non-compliant trade with the rule it broke. Rejected orders that you corrected count as compliant: the system and you did their jobs."
    ],
    why: [
      "Risk management is what keeps any strategy alive long enough for its statistics to matter. One non-compliant trade can erase many compliant ones.",
      "Risk compliance is one of the eight Evaluation skills and is usually the clearest to measure: each trade either followed the rule or did not."
    ],
    how: [
      "Export or list all paper trades with entry, stop, size, reason and result.",
      "For each trade, recalculate the planned risk and compare it with your risk per trade.",
      "Mark trades with no stop, a widened stop, missing reason or oversize as non-compliant.",
      "For each session, check whether the daily loss limit was hit and whether the cooldown was respected.",
      "Look at size after wins and after losses to spot drift.",
      "Calculate your compliance percentage and record it in the Trading Journal.",
      "Turn each type of non-compliance into a new or sharper rule in the Playbook."
    ],
    example: {
      title: "Sample risk-compliance audit (HYPOTHETICAL)",
      lines: [
        "Trades audited: 31. Risk per trade rule: ₹500.",
        "No stop at entry: 1. Stop widened: 2. Oversized (risk ₹700+): 1. Missing reason: 0.",
        "Compliant: 27 of 31 = 87%.",
        "Daily loss limit hit: 2 sessions, cooldown respected both times.",
        "Size drift: after 3 wins in a row, size rose 20% once → flagged.",
        "New rule: size is recalculated from scratch before every order, never carried over."
      ]
    },
    mistakes: [
      "Auditing only losing trades — winners can break rules too.",
      "Calling a widened stop 'adjusting' instead of a rule break.",
      "Ignoring size creep after winning streaks.",
      "Treating corrected rejected orders as failures.",
      "Rounding compliance up to make the number look better."
    ],
    quiz: [
      { q: "Name four checks for each trade in a compliance audit.", a: "Stop at entry, size within risk rule, written trade reason, inside window and max-trades limit." },
      { q: "How is the compliance percentage calculated?", a: "Compliant trades divided by all trades." },
      { q: "Is a winning trade with a widened stop compliant?", a: "No — it broke the stop-loss rule regardless of the result." }
    ]
  },

  82: {
    what: [
      "Today you review your Psychology journal and Mistake Lab from start to finish to see how your emotional habits changed over the journey. The question is practical: which triggers still lead to rule breaks, and which habits actually worked?",
      "Look at counts over time: FOMO urges and chases, revenge trades after losses, early exits from fear, size changes after wins or losses, sessions ended by cooldown. Look at emotion ratings before and after sessions and before your worst trades.",
      "Then test your habits against the data. Did the pre-session checklist correlate with fewer rule breaks? Did the post-loss pause shorten revenge chains? Did logging urges reduce early exits? Keep habits that clearly helped; rewrite or replace those that did not.",
      "Progress in psychology is rarely a straight line. A few bad sessions after a good streak are normal. What matters is whether the overall trend shows fewer rule breaks and faster recovery."
    ],
    why: [
      "Strategy and risk rules only work if you follow them, and following them depends on managing emotions. This review connects your emotional patterns to your actual results.",
      "Psychology and discipline are both Evaluation skills; this review gives you the evidence to understand those scores."
    ],
    how: [
      "Open the Psychology journal and count entries by emotion: FOMO, fear, frustration, overconfidence.",
      "Open the Mistake Lab and chart mistake tags by week in Analytics.",
      "Compare sessions where you completed the checklist with sessions where you did not.",
      "Check each if-then rule in Psychology Rules: was it triggered, and did you follow it?",
      "Keep rules that worked, rewrite rules that did not, and remove rules for triggers that never appeared.",
      "Write your number-one remaining trigger and the rule that will handle it."
    ],
    example: {
      title: "Sample psychology trend review (HYPOTHETICAL)",
      lines: [
        "FOMO chases: 6 in weeks 10-11 → 1 in the latest week.",
        "Revenge trades: 3 early on → 0 since adding the 5-minute post-loss pause.",
        "Early exits: still 2-3 per week — fear after a red bar remains my main trigger.",
        "Checklist completed: 12 of 14 sessions; both skipped sessions had rule breaks.",
        "Keep: post-loss pause, missed-trades list. Rewrite: 'stay calm' → 'if red bar, log urge, keep take-profit'.",
        "Top trigger now: fear of giving back gains → handled by the take-profit rule."
      ]
    },
    mistakes: [
      "Reviewing emotions from memory instead of from journal entries.",
      "Expecting zero emotions — the goal is managing them, not removing them.",
      "Keeping if-then rules that never trigger or never get followed.",
      "Ignoring the link between a skipped checklist and later rule breaks.",
      "Being harsh on yourself instead of curious about the pattern."
    ],
    quiz: [
      { q: "What should you do with an if-then rule that was never followed?", a: "Rewrite it to be more specific or replace it with a habit that works." },
      { q: "Is the goal to stop feeling emotions while trading?", a: "No — it is to notice them and let written rules decide." },
      { q: "Name one habit you can test against your data.", a: "The pre-session checklist, the post-loss pause, or logging urges instead of acting." }
    ]
  },

  83: {
    what: [
      "The Evaluation dashboard brings everything together. It scores you across eight skills using your own data from the journey: quizzes and lessons, Replay decisions, Backtest reports, Paper sessions, Trading Journal, Mistake Lab, Psychology journal and Playbook.",
      "The eight skills reflect the curriculum: knowledge, chart reading, risk management, strategy, backtesting, paper-trading simulation, psychology and discipline. Each score shows how consistently you applied that skill in practice, not how much virtual money you made.",
      "Read the results as a map, not a verdict. A high score means a skill is reliable in simulation; a low score points to exactly where your next practice should go. A mixed profile is normal after 84 days.",
      "The Final Evaluation is a learning checkpoint. It is not a certificate of trading ability and not a signal to trade real money. Simulated success, even strong and consistent, does not include the real costs, slippage, pressure and risks of live markets."
    ],
    why: [
      "Seeing all eight skills side by side shows how they depend on each other — for example, how weak discipline can drag down risk compliance and paper results at the same time.",
      "A clear picture of strengths and gaps lets you plan the next stage of learning with purpose instead of repeating what you already do well."
    ],
    how: [
      "Make sure your journals, Paper reports, backtests and Playbook are up to date before opening Evaluation.",
      "Open Evaluation and complete any remaining assessment items it asks for.",
      "Read each of the eight skill scores and the evidence listed under it.",
      "Mark your two strongest and two weakest skills.",
      "For each weak skill, open the related lessons and tools and note one specific practice activity.",
      "Write your result and your next focus in the Trading Journal.",
      "Remind yourself in writing: this is a learning score, not permission to trade real money."
    ],
    example: {
      title: "Sample Evaluation reflection (HYPOTHETICAL scores)",
      lines: [
        "Knowledge 85 · Charts 72 · Risk 88 · Strategy 70 · Backtesting 65 · Paper 74 · Psychology 62 · Discipline 78.",
        "Strongest: risk management and knowledge.",
        "Weakest: psychology (early exits from fear) and backtesting (small samples).",
        "Next practice: 10 Replay sessions focused on holding to target; extend backtests to 60+ trades.",
        "Note to self: these scores describe my simulated practice only.",
        "Real money is not the next step; more learning and simulation is."
      ]
    },
    mistakes: [
      "Reading a high score as proof you are ready for real money.",
      "Feeling discouraged by low scores instead of using them to plan practice.",
      "Opening Evaluation with incomplete journals, so scores miss evidence.",
      "Focusing only on the overall number and ignoring individual skills.",
      "Trying to raise scores by gaming inputs rather than practising."
    ],
    quiz: [
      { q: "What does the Evaluation dashboard score?", a: "Eight skills measured from your own practice data — process, not virtual P&L." },
      { q: "What should you do with your two weakest skills?", a: "Plan specific practice activities for them in the app." },
      { q: "Does a strong Final Evaluation mean you should trade real money?", a: "No — it is a learning checkpoint for simulated practice only." }
    ]
  },

  84: {
    what: [
      "Congratulations — you have completed the 84-day ETF learning journey. You started with what an ETF is and how it trades on the NSE, learned to read intraday charts and market context, studied risk, four strategies and proper backtesting, practised in Paper, worked on psychology and wrote your own Playbook.",
      "Graduation does not mean you are ready to trade real money. It means you have a structured foundation for continued study and simulated practice. Many skills — especially psychology and discipline — take far longer than 84 days to become reliable, and simulations never capture every real-world cost and pressure.",
      "The next 84 days are about deepening, not escalating. Use your Evaluation results to choose two or three skills to strengthen. Keep using Replay, Backtest and Paper on historical sessions, keep journaling, and keep updating the Playbook as evidence grows.",
      "A good learning plan has a weekly rhythm: lessons or reading, replay practice, a backtest or two, paper sessions with full journals, and a weekly review. The 1% daily habit you built during the journey is the most valuable thing you take forward."
    ],
    why: [
      "Learning stops when people treat a course as a finish line. Planning the next stage keeps the habits of study, practice and honest review going.",
      "Staying in simulation lets you keep improving without risking real money, while your evidence and understanding continue to grow."
    ],
    how: [
      "Re-read your Day 1 journal entry and your Final Evaluation reflection side by side.",
      "Pick two or three weakest skills from Evaluation as the focus for the next 84 days.",
      "Write a weekly practice rhythm: for example two Replay sessions, one backtest, two Paper sessions and one weekly review.",
      "Schedule a Playbook review every two weeks, changing rules only with evidence.",
      "Plan to repeat Evaluation at the end of the next cycle to measure progress.",
      "Explore an ETF you have not studied yet (for example GOLDBEES or JUNIORBEES) in Replay and Backtest only.",
      "Write a short letter to day-1 you about what you learned and how you will keep learning."
    ],
    example: {
      title: "Sample next-84-days learning plan (HYPOTHETICAL)",
      lines: [
        "Focus skills: psychology (early exits) and backtesting (larger samples).",
        "Weekly rhythm: Mon lesson review · Tue Replay · Wed Backtest · Thu Paper · Fri Paper · Sat weekly review.",
        "Targets: 60+ out-of-sample backtest trades; plan adherence 90%+ for 6 weeks running.",
        "Playbook review every second Saturday; changes dated with evidence.",
        "New study ETF: GOLDBEES — simulation and replay only.",
        "Day 168: repeat Evaluation and compare. Everything stays educational and simulated."
      ]
    },
    mistakes: [
      "Treating graduation as a signal to start trading real money.",
      "Stopping practice and journaling once the course is finished.",
      "Trying to improve all eight skills at once instead of focusing on two or three.",
      "Changing the Playbook based on feelings rather than evidence.",
      "Forgetting the daily 1% habit that built your progress."
    ],
    quiz: [
      { q: "What does graduating from this journey mean?", a: "A foundation for continued learning and simulated practice — not readiness for real money." },
      { q: "How should you choose focus skills for the next 84 days?", a: "Use your Final Evaluation results and pick the two or three weakest skills." },
      { q: "Which app tools keep your practice simulated?", a: "Trading → Replay, Trading → Backtest and Trading → Paper on historical data with virtual money." }
    ]
  }
};
