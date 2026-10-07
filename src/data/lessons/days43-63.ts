import type { LessonContent } from './types';

// Days 43-63: Strategy Development, Backtesting, Simulated Trading.
// Educational content only — not financial advice. All practice is simulated.

export const CONTENT: Record<number, LessonContent> = {
  43: {
    what: [
      "A trading strategy is a written set of rules that tells you what to look for, when to act, and when to stay out. Before any of those rules can be written, a strategy needs a focus: which market you will study, which part of the trading day you will study it in, and which chart timeframe you will make decisions on.",
      "Your market is the single instrument or small group of similar instruments you study (for example, one large, liquid index fund or one futures contract). Your session is the window of the day you commit to, such as the first 90 minutes after the open. Your primary timeframe is the chart you base decisions on, such as the 5-minute or 15-minute chart; higher timeframes can give context, but one chart is in charge.",
      "Giving the strategy a name sounds trivial, but it changes how you treat it. 'Opening Pullback v1' is a system with a version number that can be tested, measured and improved. 'Whatever looks good today' is a feeling, and feelings cannot be backtested.",
      "This lesson is about narrowing, not about finding the 'best' market. Any choice you make now is a study choice for learning purposes inside the app's simulated environment."
    ],
    why: [
      "Every market and session behaves differently: volatility, typical range, spreads and the times of day when moves happen all change. If you switch markets and timeframes from day to day, your notes and statistics mix together and become meaningless. A narrow focus lets you collect comparable observations, which is the only way to learn whether a set of rules has any edge in historical data.",
      "Focus also protects attention. A beginner watching ten charts misses the details on all of them; a beginner watching one chart starts to recognise how it normally behaves, which makes unusual behaviour easier to spot."
    ],
    how: [
      "Open the Strategy Lab and create a new strategy draft.",
      "Write the market you will study and one sentence on why (for example: liquid, plenty of historical data available in the Trading Practice Lab, moves during your available hours).",
      "Write the session window you will study, with start and end times, and commit to ignoring charts outside it.",
      "Pick one primary timeframe for decisions and, optionally, one higher timeframe for context only.",
      "Name the strategy and give it a version number, e.g. 'Opening Pullback v1'. Every future rule change creates v2, v3 and so on.",
      "Copy the name, market, session and timeframe into the top of your Playbook so every later lesson builds on the same foundation.",
      "In the Trading Journal, write two sentences on what you expect this market to do in your chosen session — you will compare this with reality during backtesting."
    ],
    example: {
      title: "Hypothetical strategy header",
      lines: [
        "Name: Opening Pullback v1 (hypothetical study strategy).",
        "Market: one large, liquid index ETF (no specific ticker — study only).",
        "Session: 09:45-11:15 local exchange time; no decisions outside this window.",
        "Primary timeframe: 5-minute chart. Context timeframe: 60-minute chart.",
        "Version log: v1 created Day 43 — no rules tested yet.",
        "Note: this header describes what will be studied, not a recommendation to trade anything."
      ]
    },
    mistakes: [
      "Picking several markets at once, which splits your sample and makes the statistics impossible to interpret.",
      "Switching primary timeframe mid-study because a different chart 'looked better' on one day, which is hindsight disguised as flexibility.",
      "Choosing a session you cannot actually be present for, so your practice never matches your real schedule.",
      "Skipping the name and version number, which makes it impossible to tell later which rules produced which results.",
      "Treating the choice of market as a prediction of profit rather than a choice of what to study."
    ],
    quiz: [
      { q: "What three things define a strategy's focus?", a: "One market, one session (time window) and one primary timeframe." },
      { q: "Why give a strategy a name and version number?", a: "It turns a feeling into a testable system and lets you link results to a specific set of rules." },
      { q: "What is the role of a higher timeframe if you use one?", a: "Context only — the primary timeframe is where decisions are made." }
    ]
  },

  44: {
    what: [
      "A setup is the specific market condition you wait for before even considering a trade. It describes the structure (what the trend or range looks like) and the location (where price is relative to important levels). Example: 'On the 15-minute chart, price is making higher highs and higher lows, and has pulled back to a prior resistance level that is now acting as support.'",
      "A good setup definition is observable. That means anyone looking at the same chart, with your written rule in hand, would agree whether the setup is present or not. Words like 'strong', 'looks bullish' or 'feels like' are not observable. Words like 'two consecutive higher highs' or 'price within 0.2% of the level' are.",
      "The setup is not the entry. It only tells you that conditions are right to start watching closely. The next lesson covers confirmation and the trigger that actually gets you in.",
      "The rule 'no setup = no trade' is the backbone of discipline. If the condition you wrote down is not present, the correct action is to do nothing."
    ],
    why: [
      "Vague setups make honest testing impossible. If your definition can stretch to fit any chart, you will unconsciously include the charts that worked and exclude the ones that failed. A specific, observable definition is what lets a backtest measure the rules rather than your mood.",
      "A clear setup also reduces decision fatigue. Instead of asking 'should I trade?' on every candle, you ask the narrower question 'is my setup present?', which is much easier to answer calmly."
    ],
    how: [
      "In your Strategy Lab draft, add a 'Setup' section under the strategy name.",
      "Write the structure requirement in measurable terms (e.g. 'at least two higher highs and two higher lows on the primary timeframe').",
      "Write the location requirement (e.g. 'pullback reaches a prior swing high that was broken earlier in the session, within a stated distance').",
      "Add any context filter from the higher timeframe, written just as precisely.",
      "Test the definition: open the Trading Practice Lab, replay three historical charts candle-by-candle and mark where you think the setup appears. Lock in 'No-Trade' whenever it does not appear.",
      "Ask: would someone else, reading only my words, mark the same spots? Rewrite any phrase that relies on judgement.",
      "Copy the final setup wording into your Playbook and save a screenshot of one clear example."
    ],
    example: {
      title: "Turning a vague setup into a specific one (hypothetical)",
      lines: [
        "Vague: 'Price is trending up and pulls back to a good level.'",
        "Specific: 'Primary (15-min) chart shows 2+ higher highs and higher lows since the open.'",
        "Plus: 'Price pulls back to within 0.15% of a prior swing high that was broken earlier in the session.'",
        "Plus: 'The 60-min chart is not making lower lows.'",
        "Hypothetical replay check: 3 charts reviewed, setup present 4 times, absent on 1 entire chart → 'No-Trade' recorded there.",
        "These numbers are for illustration only, not real market data."
      ]
    },
    mistakes: [
      "Using subjective words like 'strong trend', which let you redefine the setup after you see the outcome.",
      "Describing only structure and forgetting location, so the setup could appear anywhere on the chart.",
      "Packing confirmation and entry into the setup definition, which blurs three separate decisions into one.",
      "Writing a setup so loose that it appears on almost every chart, which usually means it captures nothing special.",
      "Looking at the finished chart instead of replaying it candle-by-candle, which makes setups look clearer than they were in real time."
    ],
    quiz: [
      { q: "What two elements should every setup describe?", a: "Structure (trend or range shape) and location (where price is relative to key levels)." },
      { q: "What is the test for whether a setup is specific enough?", a: "Two people reading the rule would independently agree it is present on the same chart." },
      { q: "What should you do when the setup is not present?", a: "Nothing — no setup means no trade (record 'No-Trade' in practice)." }
    ]
  },

  45: {
    what: [
      "Once your setup is present, you still need evidence that the market is actually responding to it. That evidence is called confirmation. For a long pullback setup, confirmation might be a bullish rejection candle at the level: a candle with a long lower wick that closes in the upper part of its range.",
      "The entry trigger is the exact, single event that gets you into the trade. It should be so specific that there is no debate: 'enter when price trades above the high of the confirmation candle' is a trigger; 'enter when it starts going up' is not.",
      "Setup, confirmation and trigger are three separate checkpoints. Setup says 'conditions are right'. Confirmation says 'the market is reacting the way my idea expects'. Trigger says 'now'. If any one is missing, there is no entry.",
      "Confirmation can fail. Sometimes the setup appears and no confirmation candle forms, or the trigger level is never reached. In that case the setup expires and you wait for the next one."
    ],
    why: [
      "Entering on the setup alone means acting before the market has shown anything. Entering on a vague feeling of confirmation means your entries will drift depending on mood. A precise confirmation and trigger make your entries repeatable, which is what lets backtesting and simulation measure the strategy rather than your guesswork.",
      "A defined trigger also gives you a defined entry price, which you need to compute risk in R (the distance from entry to stop) in the next lesson."
    ],
    how: [
      "In the Strategy Lab, add a 'Confirmation' section and describe the candle or pattern you need, using measurable terms (e.g. 'lower wick at least 50% of the candle range, close in the top third').",
      "Add an 'Entry trigger' section with one exact event (e.g. 'a trade 1 tick above the confirmation candle high').",
      "Add an expiry rule: how long you will wait for the trigger before the setup is cancelled (e.g. '3 candles').",
      "In the Trading Practice Lab, replay a historical chart. When your setup appears, pause and decide: is confirmation present? Lock your Long/Short/No-Trade decision before revealing the next candle.",
      "Note every case where you hesitated about confirmation — these show where the wording is still ambiguous.",
      "Rewrite unclear wording, then copy the final version into your Playbook."
    ],
    example: {
      title: "Setup → confirmation → trigger (hypothetical numbers)",
      lines: [
        "Setup: uptrend on 5-min, pullback reaches prior resistance near a hypothetical level of 100.00.",
        "Confirmation: candle range 99.80-100.30, low wick touches 99.80, closes at 100.22 (top third) → confirmed.",
        "Trigger: enter if price trades above 100.31 (one tick above the candle high) within the next 3 candles.",
        "Outcome A: next candle trades to 100.40 → simulated entry at 100.31.",
        "Outcome B: price never exceeds 100.30 in 3 candles → setup expires, record 'No-Trade'.",
        "All prices are hypothetical and chosen only to illustrate the sequence."
      ]
    },
    mistakes: [
      "Treating the setup itself as confirmation, which means entering before the market has reacted.",
      "Using a trigger with no precise price or event, so the entry changes with emotion.",
      "Having no expiry rule, which leads to late entries long after the original idea has gone stale.",
      "Lowering the confirmation standard after a few missed moves, which is fear of missing out rewriting the rules.",
      "Stacking many indicators as 'confirmation' so that a valid entry almost never occurs."
    ],
    quiz: [
      { q: "What is the difference between confirmation and a trigger?", a: "Confirmation is evidence the setup is working; the trigger is the exact event that puts you in." },
      { q: "What happens if confirmation never appears?", a: "There is no entry; the setup expires and you wait for the next one." },
      { q: "Why does an exact trigger matter for later lessons?", a: "It defines the entry price, which is needed to measure risk (R) and test the rules consistently." }
    ]
  },

  46: {
    what: [
      "The stop-loss rule says exactly where you exit if the trade idea is wrong. A well-placed stop sits at the point of invalidation: the price where your setup no longer makes sense. For a long pullback with a rejection candle, that is often just below the rejection wick.",
      "The distance between your entry and your stop is called 1R (one unit of risk). Expressing results in R instead of money lets you compare trades of different sizes: a trade that gains twice the amount it risked is a +2R trade; a full stop-out is −1R.",
      "The target rule says where you plan to take profit. Two common approaches are a structural target (the next resistance level for a long) or a fixed R multiple (for example, 2R). Many plans also include a minimum reward-to-risk rule, such as 'skip the trade if the nearest obstacle is less than 1.5R away'.",
      "All of this is written before the trade, not decided during it."
    ],
    why: [
      "Decisions made with a position open are made under stress, and stress pushes beginners to widen stops and cut winners early. Fixed rules remove that in-the-moment choice. They also make backtesting possible: you cannot test a rule that only exists in your head.",
      "Measuring in R makes your statistics honest. A strategy that wins often but loses 3R on each loser can look good on win rate alone and still lose overall."
    ],
    how: [
      "In the Strategy Lab, write the stop rule using a chart reference (e.g. 'one tick below the low of the confirmation candle').",
      "Add a maximum stop distance; if the invalidation point is too far, the trade is skipped.",
      "Write your target rule: structural level, fixed R multiple, or both (e.g. 'the nearer of the next resistance or 2R').",
      "Write a minimum R:R rule and test it on a few historical charts in the Trading Practice Lab.",
      "Before each practice decision, write entry, stop and target in the replay notes, then lock your decision.",
      "Record the outcome of each practice trade in R in the Trading Journal.",
      "Copy the final stop and target rules into your Playbook."
    ],
    example: {
      title: "Computing R and checking the minimum R:R (hypothetical)",
      lines: [
        "Hypothetical entry 50.40, stop 50.10 → risk per share 0.30 = 1R.",
        "Next resistance at 50.90 → reward 0.50 → 0.50 / 0.30 = 1.67R.",
        "Rule: minimum 1.5R → trade qualifies. Target = the nearer of resistance (1.67R) or 2R → 50.90.",
        "If price hits 50.90: result +1.67R. If price hits 50.10: result −1R.",
        "If resistance had been at 50.70 (1.0R), the rule says skip the trade.",
        "Numbers are illustrative only and not real market prices."
      ]
    },
    mistakes: [
      "Placing the stop at a round money amount instead of the invalidation point, so it gets hit by normal noise or sits far too wide.",
      "Moving the stop further away once the trade is open, which turns a −1R loss into a much larger one.",
      "Measuring results in money instead of R, which hides whether losses are larger than wins.",
      "Setting targets beyond obvious obstacles, so price repeatedly stalls before reaching them.",
      "Leaving the rules unwritten and 'deciding when I see it'."
    ],
    quiz: [
      { q: "What is 1R?", a: "The distance (risk) between your entry price and your stop-loss price." },
      { q: "Where should a stop be placed in principle?", a: "At the invalidation point — where the setup idea is proven wrong." },
      { q: "Hypothetical: risk 0.40, reward 0.60. What is the R:R?", a: "0.60 / 0.40 = 1.5R." }
    ]
  },

  47: {
    what: [
      "Exit rules cover every way a trade can end other than the original stop or target. They answer questions like: What if the trade goes nowhere for an hour? What if it moves halfway to target and stalls? What if the setup is clearly broken before the stop is hit?",
      "Time exits close a trade after a set number of candles or at a fixed clock time (for example, at the end of your session) if neither stop nor target has been reached. Trailing stops move the stop in the direction of the trade according to a rule, such as 'below each new higher low'. Partial profits mean closing part of a position at one level and leaving the rest for a further target.",
      "Early invalidation exits close the trade when the reason for it disappears before the stop is hit — for example, a long trade where price closes back below the support level that defined the setup.",
      "The key idea: every exit is decided before entry, and each one is written as a rule, not a feeling."
    ],
    why: [
      "Without exit rules, open trades become a stream of emotional decisions: grabbing a small profit out of fear, or holding a dead trade out of hope. Pre-written exits keep management consistent, and consistency is what makes simulated results comparable to backtested ones.",
      "Exit choices also change your statistics. Partial profits raise win rate but lower average win; trailing stops do the opposite. You need to know which rules you are using to understand your numbers."
    ],
    how: [
      "In the Strategy Lab, add an 'Exits' section with four headings: time exit, trailing rule, partial rule, early invalidation.",
      "Write a time exit (e.g. 'close if neither stop nor target is hit within 12 candles, and always by session end').",
      "Decide whether you use a trailing stop; if yes, define exactly when it starts and how it moves.",
      "Decide whether you take partials; if yes, define the level and size (e.g. 'half at 1R, stop to entry').",
      "Write one early invalidation rule tied to your setup (e.g. 'a candle closes back below the support level').",
      "Replay two historical charts in the Trading Practice Lab, apply the exits candle-by-candle, and note any situation the rules did not cover.",
      "Update the rules for the gaps you found and copy them into your Playbook — this is v1 of your exits; later changes become v2."
    ],
    example: {
      title: "Same hypothetical trade, three exit rules",
      lines: [
        "Hypothetical long: entry 20.00, stop 19.80 (1R = 0.20), target 20.40 (2R).",
        "Price rises to 20.25, stalls, then drifts back and hits 19.80.",
        "Rule set A (stop/target only): −1R.",
        "Rule set B (half off at 1R = 20.20, stop to entry): +0.5R on half, 0R on the rest → +0.5R total.",
        "Rule set C (time exit after 12 candles, price at 20.05 then): +0.25R.",
        "Lesson: the exit rule changes the result, so pick one in advance and test that exact rule."
      ]
    },
    mistakes: [
      "Deciding how to exit only after the trade is open, which invites fear and hope to take over.",
      "Moving the stop to break-even too early by habit, so normal pullbacks knock you out of valid trades.",
      "Using partials and trailing stops without recording them, so backtest and simulation stats cannot be compared.",
      "Ignoring early invalidation and waiting for the full stop even when the setup is clearly broken.",
      "Having no session-end rule, so practice trades are held into periods your strategy was never designed for."
    ],
    quiz: [
      { q: "Name the four exit types covered in this lesson.", a: "Time exits, trailing stops, partial profits and early invalidation exits." },
      { q: "When should exit rules be decided?", a: "Before entry, as written rules." },
      { q: "How do partial profits typically affect statistics?", a: "They tend to raise win rate while lowering the average winning R." }
    ]
  },

  48: {
    what: [
      "No-trade conditions are rules that tell you when to stay out, even if a setup appears. They are just as much a part of your strategy as entry rules.",
      "Common categories: scheduled news and low-liquidity times (major economic releases, the first minutes after the open, holiday sessions), choppy conditions (price overlapping in a tight range with no clear structure), limits already hit (you have reached your maximum daily loss or maximum number of trades), and personal state (tired, ill, angry, distracted, or trying to 'win back' a loss).",
      "Choppy conditions can be defined objectively, for example: 'the last 10 candles overlap and the range is less than X% of the session average range'. Personal-state rules can be a short checklist answered honestly before the session.",
      "'No-Trade' is a valid decision. In the Trading Practice Lab it is one of the three locked choices for exactly this reason."
    ],
    why: [
      "Many losses for beginners come not from a bad strategy but from trading it in conditions it was never designed for. Excluding those conditions removes a large source of random results and emotional mistakes.",
      "Written no-trade rules also protect you from yourself. After a loss or a long boring wait, the urge to 'do something' is strong; a rule that was written when you were calm is much harder to argue with."
    ],
    how: [
      "In the Strategy Lab, add a 'No-Trade Conditions' section.",
      "List time-based exclusions: scheduled high-impact news windows, the first minutes of the session, and any holiday or half-day sessions.",
      "Define choppy conditions in measurable terms you can see on your primary chart.",
      "Write your limits: maximum daily loss in R and maximum number of trades per session; after either is hit, the session ends.",
      "Write a three-question readiness check (sleep, mood, distractions) to answer before every practice session.",
      "In the Trading Practice Lab, replay a choppy historical chart and practise locking 'No-Trade' each time the setup appears inside the chop.",
      "Copy the conditions into your Playbook and add a 'No-Trade log' column to your Trading Journal."
    ],
    example: {
      title: "A hypothetical pre-session no-trade check",
      lines: [
        "Scheduled high-impact release in 20 minutes → no new entries until 15 minutes after it.",
        "Last 10 candles on 5-min chart overlap, range 40% of the session average → 'choppy' rule active.",
        "Daily limits: −2R max loss, 3 trades max. Current: −1R, 1 trade → still allowed.",
        "Readiness: slept 5 hours, feeling irritable → readiness check fails.",
        "Decision: no session today; log reasons in the Trading Journal.",
        "Scenario is hypothetical and for practice only."
      ]
    },
    mistakes: [
      "Treating no-trade rules as optional suggestions that can be skipped when a setup 'looks too good'.",
      "Defining 'choppy' by feel, which lets you decide after the fact whether the rule applied.",
      "Continuing after hitting the daily loss limit to win it back, which tends to compound losses.",
      "Ignoring personal state, as if fatigue or anger did not affect decisions.",
      "Not recording no-trade decisions, so you never see how much discipline actually saved you."
    ],
    quiz: [
      { q: "Name four categories of no-trade conditions.", a: "News/low-liquidity times, choppy conditions, after hitting limits, and when not mentally ready." },
      { q: "What should happen after the maximum daily loss is reached?", a: "The session ends — no further trades that day." },
      { q: "Is 'No-Trade' a valid decision in practice?", a: "Yes — it is a rule-based decision and should be recorded like any other." }
    ]
  },

  49: {
    what: [
      "This week you built a strategy from scratch. Day 43 gave it a focus: one market, one session, one primary timeframe and a name with a version number. Day 44 defined the setup — the specific, observable structure and location you wait for.",
      "Day 45 separated confirmation (evidence the setup is working) from the entry trigger (the exact event that gets you in). Day 46 set the stop at the invalidation point, defined 1R, and added target and minimum R:R rules. Day 47 added exit rules beyond stop and target: time exits, trailing stops, partials and early invalidation. Day 48 added no-trade conditions.",
      "Put together, these form a complete, testable strategy document. A review day is where you check that the pieces fit together and that you can explain each one without looking at your notes."
    ],
    why: [
      "Next week you will backtest this strategy. Any ambiguity left in the rules now will show up as inconsistent decisions in the backtest, which makes the results unreliable. Fixing wording today is far cheaper than discovering after 50 samples that you applied a rule two different ways.",
      "Rewriting ideas from memory is also how learning sticks. If you cannot explain a rule in your own words, you will not apply it consistently under pressure."
    ],
    how: [
      "Re-read this week's Trading Journal entries and your Strategy Lab draft from top to bottom.",
      "Without looking, write the full strategy from memory on a blank page: name, focus, setup, confirmation, trigger, stop, target, exits, no-trade conditions.",
      "Compare with the draft. Any rule you forgot or wrote differently is your weakest concept — re-read that lesson.",
      "Run a 'second-person test': read only the written rules and replay one historical chart in the Trading Practice Lab, applying them literally. Note every moment you had to interpret.",
      "Tighten the wording for each interpretation point and save as v1 final in the Strategy Lab and Playbook.",
      "Save the two or three most useful insights from the week to the Knowledge Vault."
    ],
    example: {
      title: "Hypothetical self-review walkthrough",
      lines: [
        "Wrote the strategy from memory: forgot the trigger expiry rule and the time exit.",
        "Weakest concept: exits (Day 47) → re-read and summarised in 3 sentences.",
        "Second-person replay test on one historical chart: 2 interpretation points found.",
        "Point 1: 'near the level' → rewritten as 'within 0.15% of the level'.",
        "Point 2: 'choppy' undefined → rewritten as 'last 10 candles overlap'.",
        "Saved 'Opening Pullback v1 final' to the Playbook; 2 insights added to the Knowledge Vault."
      ]
    },
    mistakes: [
      "Skimming notes instead of recalling them, which feels productive but builds little understanding.",
      "Starting to backtest with rules that still contain vague words, which makes the results unreliable.",
      "Adding lots of new rules on review day, creating a complicated strategy before any evidence exists.",
      "Skipping the no-trade section because it feels less important than entries.",
      "Treating a tidy strategy document as proof that it works — only testing can show that, and even then not guarantee future results."
    ],
    quiz: [
      { q: "List the main sections of a complete strategy document.", a: "Name and focus, setup, confirmation, entry trigger, stop, target/min R:R, exit rules, no-trade conditions." },
      { q: "Why fix vague wording before backtesting?", a: "Ambiguous rules get applied inconsistently, which makes backtest results unreliable." },
      { q: "What is the 'second-person test'?", a: "Applying only the written rules literally to a chart to find places where interpretation is needed." }
    ]
  },

  50: {
    what: [
      "Backtesting means going through historical charts and applying your written rules to find every instance of your setup, then recording what would have happened under those rules. It is a way to gather evidence about how a set of rules behaved in the past.",
      "Manual backtesting is done bar by bar: you hide the future, reveal one candle at a time, and decide as if it were happening live. The app's Trading Practice Lab is built for this — historical replay, candle-by-candle, with locked Long/Short/No-Trade decisions so you cannot change your mind after seeing the next candle.",
      "Two rules make or break a backtest. First, record every valid setup, including every loser; skipping losses produces a fantasy. Second, follow the rules exactly as written; if you improvise, you are testing your improvisation, not the strategy.",
      "Even an honest backtest has limits. Historical results do not guarantee future results, and replay cannot fully reproduce slippage, fills, or the emotions of real-time decisions."
    ],
    why: [
      "Without a backtest, you have no idea whether your rules have any edge at all — you only have a story. A backtest gives you a baseline: how often the setup appears, a rough win rate, an average R, and how bad losing streaks can be.",
      "That baseline is what you later compare your simulated trading against. If simulation results are far worse than the backtest, the gap tells you where your execution or psychology is breaking down."
    ],
    how: [
      "Choose a historical date range in the Trading Practice Lab before you start, and commit to testing every session in it — no skipping days.",
      "Open your strategy v1 rules from the Strategy Lab beside the chart.",
      "Reveal candles one at a time. Only decide when your setup and confirmation are present; otherwise lock 'No-Trade'.",
      "For each trade, write entry, stop and target before revealing the next candle, then lock the decision.",
      "Step forward until the trade exits under your rules, and record the result in R.",
      "Log every trade in the Backtesting journal, including date, setup quality, result and a screenshot.",
      "Never edit rules during the test; write improvement ideas in a separate 'later' list."
    ],
    example: {
      title: "First hour of a hypothetical backtest",
      lines: [
        "Date range chosen in advance: 20 historical sessions in the replay library.",
        "Session 1: setup appears twice. First: no confirmation → 'No-Trade' logged. Second: confirmed → simulated long.",
        "Hypothetical entry 30.20, stop 30.05 (1R = 0.15), target 30.50 (2R).",
        "Revealed candle-by-candle: stop hit after 4 candles → −1R, logged with screenshot.",
        "Temptation: 'that one shouldn't count, the candle was a bit small' → logged anyway, idea noted for later.",
        "All figures hypothetical; backtest results never guarantee future performance."
      ]
    },
    mistakes: [
      "Hindsight bias: looking at the right side of the chart before deciding, which makes setups look cleaner than they were.",
      "Cherry-picking dates or charts that 'look interesting', which skews the sample toward obvious moves.",
      "Skipping losers because they were 'not really' the setup, which inflates results.",
      "Changing rules mid-test, which means no single set of rules has actually been tested.",
      "Ignoring realistic costs and slippage, which makes small-R strategies look better than they would be."
    ],
    quiz: [
      { q: "What are the two most important rules for honest backtesting?", a: "Record every valid setup including losers, and follow the written rules exactly." },
      { q: "Why replay candle-by-candle instead of viewing the whole chart?", a: "To avoid hindsight bias — you decide with only the information available at that moment." },
      { q: "Does a good backtest guarantee future results?", a: "No. It is evidence about past data only and cannot predict the future." }
    ]
  },

  51: {
    what: [
      "Backtest Session 1 is about building the recording habit. The goal is not to find out whether the strategy 'works' — ten trades cannot tell you that. The goal is to log your first ten or so samples with complete, consistent detail.",
      "Each Backtesting journal entry should contain: date and time, direction, entry, stop, target, result in R, setup quality (for example A/B/C against your written definition), a screenshot of the chart at entry and at exit, and any mistake you made applying the rules.",
      "Setup quality is a grade of how cleanly the chart matched your written setup, not a guess about the outcome. Grade it before you reveal the result.",
      "Mistakes here mean rule-application errors: you entered without confirmation, misplaced the stop, forgot the time exit. These are logged honestly, because they reveal ambiguity in the rules and gaps in your attention."
    ],
    why: [
      "Every later statistic depends on clean records. If the first sessions are sloppy — missing stops, results in money instead of R, no screenshots — the data cannot be trusted or reviewed later. Habits formed in session 1 tend to last for the whole test.",
      "Screenshots matter more than they seem: in Session 4 and 5 you will compare setups and review mistakes, which is impossible from numbers alone."
    ],
    how: [
      "Start where your pre-chosen date range begins in the Trading Practice Lab; do not skip ahead to 'interesting' days.",
      "Before revealing each confirmation candle, grade the setup quality A/B/C and write it down.",
      "When the trigger fires, record entry, stop and target, then lock your decision.",
      "Step forward to the exit and record the result in R; take a screenshot at entry and at exit.",
      "Log every rule-application mistake in the 'mistakes' field, even small ones.",
      "Stop after roughly 10 logged trades (or the end of your session time) and check that every entry has all fields filled.",
      "Write one line in the Trading Journal about how the recording process felt and what slowed you down."
    ],
    example: {
      title: "A complete hypothetical journal entry",
      lines: [
        "Sample #4 · historical session 3 · Long.",
        "Setup grade: B (pullback reached the level but structure had only one clear higher low).",
        "Hypothetical entry 45.10 · stop 44.92 (1R = 0.18) · target 45.46 (2R).",
        "Result: time exit after 12 candles at 45.19 → +0.5R.",
        "Mistake logged: placed stop under the wrong candle at first, corrected before locking.",
        "Screenshots: entry and exit attached. Prices are hypothetical, not real data."
      ]
    },
    mistakes: [
      "Recording results in money instead of R, which makes trades of different sizes impossible to compare.",
      "Grading setup quality after seeing the result, which turns the grade into hindsight.",
      "Leaving fields blank to 'fill in later', which usually means never.",
      "Skipping screenshots, which makes later reviews of setups and mistakes impossible.",
      "Drawing conclusions about the strategy from ten trades — the sample is far too small."
    ],
    quiz: [
      { q: "What is the main goal of Backtest Session 1?", a: "Building a complete, consistent recording habit for the first ~10 samples." },
      { q: "When should setup quality be graded?", a: "Before the result is revealed, based only on how well the chart matched the written setup." },
      { q: "Name four fields every backtest entry should include.", a: "Any four of: date/time, direction, entry, stop, target, result in R, setup grade, screenshots, mistakes." }
    ]
  },

  52: {
    what: [
      "Session 2 is about sample size and market conditions. Small samples lie: with 10 trades, a few lucky or unlucky results can swing your win rate by 20 percentage points or more. Around 30 trades starts to show a rough picture; 100 or more is better.",
      "To make the sample representative, it needs to include different market conditions — trending days, range days, high-volatility and quiet sessions. A strategy tested only on strong trend days will look much better than it really is.",
      "This session adds a 'conditions' tag to each trade (e.g. trend day, range day, high or low volatility, news day) and keeps tracking R:R for each trade. The rules themselves stay exactly the same as in Session 1.",
      "Keeping rules unchanged is essential. If you adjust the stop rule after trade 15, trades 1-14 and 15-30 are testing two different strategies, and neither sample is large enough to mean anything."
    ],
    why: [
      "Most false confidence in trading comes from small, one-sided samples. A run of five winners in a strong trend can convince a beginner they have found something, when the same rules may struggle in other conditions.",
      "Tagging conditions now gives you the data for Session 4, where you compare which conditions favour or hurt the strategy."
    ],
    how: [
      "Before starting, write in the Backtesting journal: 'Rules: v1, unchanged'.",
      "Continue from where Session 1 ended in your date range — no skipping to different periods.",
      "Before each session's replay, tag the day's condition using a simple rule (e.g. 'trend day' if the first hour moves more than X in one direction).",
      "Log each trade with all Session 1 fields plus the condition tag and the planned R:R at entry.",
      "If the range so far is all one condition type, extend the pre-chosen date range to include different conditions, and note why.",
      "Aim to bring your running total toward 30 samples.",
      "Write any rule-change ideas in the 'later' list, not in the rules."
    ],
    example: {
      title: "How small samples mislead (hypothetical)",
      lines: [
        "After 10 hypothetical trades: 7 wins, 3 losses → 70% win rate. All 10 on trend days.",
        "After 30 hypothetical trades (now including 12 range days): 14 wins, 16 losses → 47% win rate.",
        "Range-day trades alone: 3 wins, 9 losses.",
        "Same rules, very different picture — the first 10 were not representative.",
        "Even 30 trades is still a small sample; conclusions remain tentative.",
        "Numbers are invented to illustrate the point, not real results."
      ]
    },
    mistakes: [
      "Stopping the test after a good early streak, which locks in a misleadingly positive result.",
      "Only testing periods with strong trends, which overstates how often the setup works.",
      "Tweaking a rule mid-sample, which splits the data into two small, meaningless tests.",
      "Not tagging conditions, which makes it impossible to see where the strategy struggles.",
      "Assuming 30 trades is 'proof' rather than a first rough picture."
    ],
    quiz: [
      { q: "Roughly how many trades start to give a picture, and what is better?", a: "Around 30 starts to give a rough picture; 100 or more is better." },
      { q: "Why tag market conditions on each trade?", a: "To make sure the sample is representative and to compare performance across conditions later." },
      { q: "What happens to your data if you change a rule mid-test?", a: "It splits into two smaller tests of different strategies, and neither is reliable." }
    ]
  },

  53: {
    what: [
      "Session 3 adds a checkpoint: looking at your running statistics. The three basics are win rate (wins / total trades), average R per trade, and net R (the sum of all results in R).",
      "Looking at stats mid-test is useful only if you stay objective. It tells you whether your recording is consistent and gives an early, rough picture. It is not a signal to change anything.",
      "This session also practises A+ discipline inside the backtest: when a setup is only partly present — a C-grade — your rules decide whether it counts. If the rules say it qualifies, it is recorded; if not, it is a 'No-Trade'. You do not get to decide based on how the chart looks afterwards.",
      "Improvement ideas are written in a separate list with the trade number that inspired them. They will be tested later as a new version, not slipped into this one."
    ],
    why: [
      "The moment people see a weak running stat, they want to fix it. Changing rules mid-test is one of the most common ways backtests become worthless. Writing ideas down satisfies the urge without corrupting the data.",
      "Objectivity also guards against the opposite error: seeing a good number and deciding to stop testing early."
    ],
    how: [
      "Before replaying, export or total your Backtesting journal so far and calculate win rate, average R and net R.",
      "Write these numbers in the Trading Journal with the sample size beside them (e.g. '47% over 30 trades').",
      "Continue the backtest from where you left off in the Trading Practice Lab.",
      "For every borderline setup, re-read the written rule and apply it literally; if it is not met, lock 'No-Trade' and log it as a skipped setup.",
      "Every time you think 'this rule should be different', add it to the 'v2 ideas' list with the sample number.",
      "At the end, recompute the running stats and note whether they changed much — large swings show the sample is still small."
    ],
    example: {
      title: "Hypothetical running stats check",
      lines: [
        "Hypothetical sample: 32 trades, 15 wins, 17 losses → win rate 15 / 32 ~ 47%.",
        "Net result: +9.4R → average R per trade = 9.4 / 32 ~ +0.29R.",
        "Borderline setups this session: 4 → rules applied literally, 3 logged as 'No-Trade'.",
        "v2 ideas list: '#27 — maybe require the higher-timeframe trend filter', '#31 — time exit might be too short'.",
        "Rules unchanged: still v1.",
        "All numbers hypothetical; past test results do not guarantee future results."
      ]
    },
    mistakes: [
      "Changing a rule because of a few recent losses, which invalidates the sample.",
      "Reading too much into running stats from a small sample.",
      "Counting C-grade setups when they win and excluding them when they lose.",
      "Calculating stats in money rather than R, which distorts the picture when trade sizes differ.",
      "Losing improvement ideas because they were not written down with the sample that triggered them."
    ],
    quiz: [
      { q: "How do you calculate win rate and average R?", a: "Win rate = wins / total trades; average R = net R / total trades." },
      { q: "What should you do with a rule-change idea during a test?", a: "Write it on a separate 'later' / v2 list; do not apply it to the current test." },
      { q: "How should borderline setups be handled?", a: "Apply the written rules literally; if not met, record a 'No-Trade' regardless of what happened next." }
    ]
  },

  54: {
    what: [
      "Session 4 turns from collecting to comparing. Using the setup grades and condition tags you have been recording, you split the sample into groups: A vs B vs C setups, trend days vs range days, morning vs late-session trades, different locations (e.g. pullback to a prior high vs pullback to a moving average).",
      "Session 4 also includes a focused review of losing trades. For each loser, you ask: was this a valid trade that simply lost (a normal part of any strategy), or did a rule-application error or an unhelpful condition contribute?",
      "The principle is evidence over opinion. You may 'feel' that afternoon trades are worse, but the journal either supports that or it does not.",
      "Be careful with small groups. If one group has only five trades, its stats are almost noise. Comparisons are a source of hypotheses to test next, not final answers."
    ],
    why: [
      "Strategies rarely work equally well everywhere. Finding where your rules perform best and worst can show which no-trade conditions to add later — but only if the evidence is solid.",
      "Reviewing losers separately is important because losses are where you learn the most about rule ambiguity and conditions, and they are the trades people most want to forget."
    ],
    how: [
      "Continue the backtest for this session's planned samples, still on v1 rules.",
      "Then sort the Backtesting journal by setup grade and compute win rate and average R for each grade.",
      "Do the same for each condition tag and each time-of-day window.",
      "Filter to losing trades only and review each screenshot: label it 'valid loss', 'rule error', or 'bad condition'.",
      "Write the sample size beside every group statistic; mark any group with fewer than ~15 trades as 'not enough data'.",
      "Add the strongest findings to the v2 ideas list as hypotheses (e.g. 'Hypothesis: skip range days').",
      "Note in your Playbook that these are findings from historical data only."
    ],
    example: {
      title: "Hypothetical comparison by condition and grade",
      lines: [
        "Hypothetical sample: 48 trades total.",
        "Trend days: 28 trades, avg +0.55R. Range days: 20 trades, avg −0.20R.",
        "A-grade: 18 trades, avg +0.70R. B-grade: 22 trades, avg +0.10R. C-grade: 8 trades → too few to judge.",
        "Loser review (24 losses): 17 valid losses, 4 rule errors, 3 bad conditions.",
        "Hypothesis for v2: add a range-day no-trade filter — to be tested separately, not assumed.",
        "Invented numbers for illustration; not a forecast."
      ]
    },
    mistakes: [
      "Drawing firm conclusions from tiny subgroups, which is noise mistaken for signal.",
      "Slicing the data in dozens of ways until something looks good, which finds patterns that are pure chance.",
      "Treating every loser as a mistake, when valid losses are a normal part of any rule set.",
      "Applying findings straight to the current test instead of saving them for a new version.",
      "Trusting your memory of 'which trades worked' over what the journal actually shows."
    ],
    quiz: [
      { q: "What is the purpose of comparing setup variations?", a: "To find, with evidence, which conditions or locations the rules perform best and worst in." },
      { q: "What three labels can you give a losing trade in review?", a: "Valid loss, rule-application error, or bad condition." },
      { q: "Why be cautious with a group of only five trades?", a: "The sample is too small; its statistics are mostly noise." }
    ]
  },

  55: {
    what: [
      "Session 5 completes the sample and computes the full statistics. The core measures are win rate, average winning R, average losing R, net R, maximum drawdown in R (the largest peak-to-trough fall in cumulative R) and the longest losing streak.",
      "The headline number is expectancy: the average result per trade you would expect if future trades looked like the sample. Expectancy = (win% × average win R) − (loss% × average loss R). A positive expectancy means the rules made money on average in this historical sample, before costs; a negative one means they did not.",
      "This session also reviews your most common rule-application mistakes and any rule ambiguity — places where the written rule could be read two ways. These become the basis for refinements in a future version.",
      "Remember what the numbers are: a description of how the rules performed on a particular set of historical data. They are not a prediction or a guarantee, and live or simulated results usually come in lower."
    ],
    why: [
      "Win rate alone is misleading. A 40% win rate can have positive expectancy if winners are much larger than losers; a 70% win rate can have negative expectancy if losers are large. Expectancy combines both.",
      "Drawdown and losing streaks prepare you psychologically. If the backtest shows a six-loss streak, experiencing four in a row in simulation is within expectations, not a reason to abandon the plan."
    ],
    how: [
      "Finish the remaining samples in your pre-chosen date range, still on v1 rules.",
      "In the Backtesting journal, compute: total trades, win rate, average win R, average loss R, net R.",
      "Compute expectancy = (win% × avg win R) − (loss% × avg loss R).",
      "Plot or list cumulative R trade by trade and find the maximum drawdown and longest losing streak.",
      "Count mistakes by type (e.g. late entry, wrong stop placement, ignored time exit) and list the top three.",
      "List every rule where you hesitated or interpreted — these are ambiguity points.",
      "Write a one-paragraph summary in the Trading Journal and save the stats to the strategy page in the Strategy Lab, noting 'historical only'."
    ],
    example: {
      title: "Computing expectancy (hypothetical sample)",
      lines: [
        "Hypothetical sample: 60 trades, 27 wins (45%), 33 losses (55%).",
        "Average win: +1.8R. Average loss: −1.0R.",
        "Expectancy = (0.45 × 1.8) − (0.55 × 1.0) = 0.81 − 0.55 = +0.26R per trade.",
        "Max drawdown: −6.0R. Longest losing streak: 6 trades.",
        "Top mistakes: late entry (5), ignored time exit (3). Ambiguity: 'near the level'.",
        "Hypothetical figures only; a historical result like this does not guarantee anything about the future."
      ]
    },
    mistakes: [
      "Judging the strategy on win rate alone, ignoring the size of wins and losses.",
      "Forgetting costs and slippage, which can erase a small positive expectancy.",
      "Ignoring drawdown, then panicking at a normal losing streak later.",
      "Treating a positive backtest as proof the strategy will work in the future.",
      "Fixing ambiguity by quietly re-grading old trades instead of documenting it for a new version."
    ],
    quiz: [
      { q: "What is the expectancy formula?", a: "Expectancy = (win% × average win R) − (loss% × average loss R)." },
      { q: "Hypothetical: 50% win rate, avg win 1.5R, avg loss 1R. Expectancy?", a: "(0.5 × 1.5) − (0.5 × 1) = +0.25R per trade." },
      { q: "Why record maximum drawdown and losing streaks?", a: "They show how bad normal bad runs were, so you can recognise them later instead of abandoning the plan." }
    ]
  },

  56: {
    what: [
      "This week you tested your strategy on historical data. Day 50 covered how to backtest honestly: bar-by-bar replay, every valid setup recorded, no skipped losers, rules followed exactly.",
      "Session 1 built the recording habit with complete entries. Session 2 grew the sample and tagged market conditions. Session 3 checked running stats while keeping rules frozen. Session 4 compared setup grades and conditions and reviewed losers. Session 5 completed the sample and computed expectancy, drawdown and losing streaks, and listed mistakes and ambiguities.",
      "You now have a baseline description of how strategy v1 behaved on one set of historical data, along with a list of ideas for v2. Today is about understanding that baseline and its limits."
    ],
    why: [
      "Next week you move to simulated trading, and the backtest becomes the yardstick. If you do not understand what your backtest numbers mean — and what they cannot tell you — you will either over-trust them or ignore them.",
      "Review is also where you decide, calmly, whether any refinements are worth making before simulation, and how to do so without throwing away the evidence you collected."
    ],
    how: [
      "Re-read this week's Backtesting journal and Trading Journal entries.",
      "From memory, write the expectancy formula and explain each part in your own words; check against Day 55.",
      "Rewrite your backtest summary in five lines: sample size, win rate, average win/loss R, expectancy, max drawdown.",
      "Write three limits of your backtest (e.g. sample size, period covered, no real slippage or emotions).",
      "Decide whether to keep v1 for simulation or create v2; if you make changes, record them as a new version and note that v2 is untested.",
      "Identify your weakest concept from the week and re-read that lesson.",
      "Save the key insights to the Knowledge Vault."
    ],
    example: {
      title: "Hypothetical weekly self-review",
      lines: [
        "Sample: 60 hypothetical trades, v1 rules unchanged throughout.",
        "Win rate 45%, avg win +1.8R, avg loss −1.0R → expectancy +0.26R (historical, before costs).",
        "Max drawdown −6R; longest losing streak 6.",
        "Limits: one market, one historical period, replay only — no real fills or emotions.",
        "Decision: keep v1 for simulation; v2 idea (range-day filter) parked for a later test.",
        "Weakest concept: drawdown → re-read Day 55 and rewrote the definition."
      ]
    },
    mistakes: [
      "Treating the backtest result as a promise of future performance.",
      "Making several rule changes at once before simulation, so you cannot tell which change mattered.",
      "Calling a modified strategy 'tested' when only the old version was tested.",
      "Skipping the limits list, which leads to overconfidence.",
      "Forgetting the losing-streak number, which you will need for perspective during simulation."
    ],
    quiz: [
      { q: "What were the distinct focuses of Backtest Sessions 1-5?", a: "1 recording discipline, 2 sample size and conditions, 3 running stats with rules frozen, 4 comparing variations and losers, 5 full stats and mistakes." },
      { q: "If you change rules after the backtest, what is the status of the new version?", a: "Untested — it needs its own test before being compared with v1." },
      { q: "Name two limits of a manual backtest.", a: "Any two of: limited sample, one historical period, no real slippage or fills, no real-time emotions, possible hindsight bias." }
    ]
  },

  57: {
    what: [
      "Simulated trading, often called paper trading, means applying your strategy in market conditions without real money. In this app, simulation happens through historical replay in the Trading Practice Lab and is recorded in the Paper-trade/Simulation log.",
      "The difference from backtesting is the mindset. In backtesting you are collecting data about the rules. In simulation you are practising execution: following the plan in sequence, under time pressure, as if each decision counted.",
      "Paper trading only teaches anything if you treat it seriously. That means the same written rules, the same risk limits (risk per trade in R, maximum daily loss, maximum trades), and the same journaling as a full trading plan would require.",
      "Good simulation results are a sign you are applying your process consistently. They are not a signal or a recommendation to trade real money, and they do not show how you would behave with real money at risk."
    ],
    why: [
      "Many people discover that following rules is much harder than writing them. Simulation exposes the gap between plan and behaviour — hesitation, impulsive entries, moved stops — in a setting where mistakes cost nothing.",
      "The habits you build here (pre-session planning, logging every trade, stopping at limits) are the process. Treating simulation casually builds casual habits."
    ],
    how: [
      "Write a 'Simulation Rules' page in your Playbook: strategy version, risk per trade (1R), max daily loss (e.g. −2R), max trades per session (e.g. 3).",
      "Set up the Paper-trade/Simulation log with the same fields as your Backtesting journal, plus 'followed plan? yes/no' and 'emotion' fields.",
      "Write a pre-session checklist: readiness check, no-trade conditions, today's limits.",
      "Practise one short replay session in the Trading Practice Lab, locking Long/Short/No-Trade decisions in real time.",
      "After the session, check your process score and compare it with your own plan-adherence rating.",
      "Write one line in the Trading Journal stating: 'This is practice. Results here are not a reason to trade real money.'"
    ],
    example: {
      title: "Hypothetical simulation rules card",
      lines: [
        "Strategy: Opening Pullback v1 (hypothetical).",
        "Risk per trade: 1R (simulated account only). Max daily loss: −2R. Max trades: 3.",
        "Session ends at whichever comes first: −2R, 3 trades, or end of time window.",
        "Every simulated trade logged with entry, stop, target, result in R, followed-plan Y/N, emotion.",
        "Readiness check before every session; failed check = no session.",
        "Reminder: simulated results are practice only, not evidence of future profits."
      ]
    },
    mistakes: [
      "Taking bigger simulated risks 'because it isn't real', which trains the wrong habits.",
      "Skipping journal entries for simulated trades, which wastes the main benefit of practising.",
      "Ignoring daily limits in simulation, so the limit is never practised.",
      "Treating a good simulation week as a reason to start trading real money.",
      "Restarting a replay after a bad decision, which hides exactly the behaviour you need to see."
    ],
    quiz: [
      { q: "What is the main purpose of simulated trading?", a: "Practising execution of the plan — rules, limits and journaling — without real money." },
      { q: "Should simulation rules differ from your written plan?", a: "No — same rules, same risk limits, same journal." },
      { q: "Do good simulation results mean you should trade real money?", a: "No. They reflect practice consistency only and are not a signal to trade real money." }
    ]
  },

  58: {
    what: [
      "Simulation Session 1 focuses on the pre-session plan and simply following it. Before any replay starts, you write a short plan: which strategy version, today's limits, the levels or conditions you are watching, and what you will do if no setup appears.",
      "During the session you execute in the Trading Practice Lab and record each simulated trade in the Paper-trade/Simulation log. You respect your maximum number of trades — when you reach it, the session is over, even if another setup appears.",
      "A new field matters here: emotion. Before and after each trade, note in one or two words how you feel (calm, anxious, impatient, excited). Over time these notes reveal patterns that numbers alone do not."
    ],
    why: [
      "A plan written before the session is made with a clear head. Decisions made mid-session, after a few candles of excitement or boredom, are much less reliable. Starting the simulation phase with a planning habit sets the tone for everything after.",
      "Recording emotions from the very first session gives you a baseline to compare against later, when you start to notice which feelings come before your worst decisions."
    ],
    how: [
      "Write a pre-session plan in the Trading Journal: strategy version, max trades, max daily loss, conditions to avoid, and the context from the higher timeframe.",
      "Do the readiness check; if it fails, record that and stop.",
      "Start a historical replay in the Trading Practice Lab and advance candle-by-candle.",
      "When your setup appears, check confirmation and trigger against the written rules, then lock your decision.",
      "Log each simulated trade in the Simulation log with all fields, including emotion before and after.",
      "Stop at your max trades or max daily loss, whichever comes first.",
      "After the session, write 'plan vs actual' in three lines: what you planned, what you did, any differences."
    ],
    example: {
      title: "Hypothetical Simulation Session 1",
      lines: [
        "Plan: v1 rules, max 3 trades, max −2R; watching a prior swing level around a hypothetical 75.00.",
        "Trade 1: setup + confirmation → simulated long, result +2R. Emotion: calm → excited.",
        "Trade 2: entered before trigger fired (impulsive) → −1R. Emotion: excited → frustrated.",
        "Trade 3: valid setup, followed plan → −1R. Emotion: anxious → calm.",
        "Max trades reached → session ended. Net 0R. Plan followed on 2 of 3 trades.",
        "Hypothetical session; outcomes are illustrative, not real market data."
      ]
    },
    mistakes: [
      "Starting the replay without a written plan, so every decision becomes improvised.",
      "Taking a fourth trade 'because it looked perfect', which breaks the max-trades rule you are practising.",
      "Judging the session by net R instead of by plan adherence.",
      "Leaving the emotion field empty because it feels unimportant.",
      "Not noting impulsive entries as mistakes when they happen to win."
    ],
    quiz: [
      { q: "What should a pre-session plan contain?", a: "Strategy version, max trades, max daily loss, conditions to avoid and current context." },
      { q: "What happens when you hit your max trades?", a: "The session ends, even if another setup appears." },
      { q: "Why record emotions before and after each trade?", a: "To reveal patterns linking feelings to decisions that numbers alone would miss." }
    ]
  },

  59: {
    what: [
      "Session 2 focuses on patience: taking only A-quality setups. An A-setup is one where every element of the written setup, confirmation and trigger is clearly present — no 'almost', no 'close enough'.",
      "Skipping a mediocre setup is a win for discipline, even if that setup would have worked. Over a sample, your backtest grades from Week 2 likely showed that A-setups and lower grades behaved differently; this session practises acting on that evidence.",
      "You also record skipped setups. Each time you see a B or C setup and choose not to trade it, log it as 'skipped', with its grade and the reason. This proves to yourself that you saw it and made a choice rather than missing it.",
      "Locking 'No-Trade' in the Trading Practice Lab counts as a decision and contributes to your process score."
    ],
    why: [
      "Overtrading is one of the most common beginner problems: taking marginal setups out of boredom or fear of missing out. Practising patience in simulation is how you build the habit before it matters.",
      "Logging skipped setups also guards against regret-driven decisions. When a skipped B-setup runs, the log reminds you that over many samples, skipping lower-grade setups was part of the plan."
    ],
    how: [
      "In your pre-session plan, write the A-setup checklist: every element that must be present.",
      "Add a rule: 'If any element is uncertain, it is not an A — lock No-Trade.'",
      "Replay a historical session candle-by-candle in the Trading Practice Lab.",
      "For every setup you see, grade it A/B/C before the next candle; trade only As.",
      "Log every skipped setup in the Simulation log with grade, reason and emotion.",
      "After the session, reveal what skipped setups did — and note your emotion about it, without changing the plan.",
      "Count: A-setups taken, setups skipped, impulsive entries (target: zero)."
    ],
    example: {
      title: "Hypothetical patience session",
      lines: [
        "Setups seen: 6. Graded: 1 A, 3 B, 2 C.",
        "Taken: the A-setup → simulated result +1.4R (exited at session-end time rule).",
        "Skipped: 5 setups logged with reasons, e.g. 'B — no higher-timeframe alignment'.",
        "Afterwards: 2 of the skipped B-setups would have reached target. Emotion noted: 'frustrated'.",
        "Process view: 0 impulsive entries, 6 of 6 decisions followed the plan.",
        "Hypothetical session; a skipped winner does not mean the rule was wrong."
      ]
    },
    mistakes: [
      "Upgrading a B-setup to an A because you have been waiting a long time.",
      "Not logging skipped setups, so you cannot tell missed setups from deliberate skips.",
      "Changing the A-only rule after one skipped setup works out, based on a single example.",
      "Treating a session with no trades as a failure, when patience was the goal.",
      "Grading setups after seeing the outcome, which turns grades into hindsight."
    ],
    quiz: [
      { q: "What makes a setup A-quality?", a: "Every element of the written setup, confirmation and trigger is clearly present." },
      { q: "Why log skipped setups?", a: "To show you made a deliberate choice and to judge the skip rule over many samples instead of by regret." },
      { q: "A skipped B-setup hit its target. What should you do?", a: "Note it and your emotion, but don't change the rule based on one example." }
    ]
  },

  60: {
    what: [
      "Session 3 focuses on managing open trades: honouring stops and targets exactly as written. Once a simulated trade is open, the only actions allowed are the ones your exit rules describe — stop, target, time exit, partials, trailing, early invalidation.",
      "'No moving stops' means you never move the stop further away from entry. A stop can only move in the direction your written trailing or break-even rule allows, at the point the rule says.",
      "Honouring targets matters just as much. Closing early because a winner 'feels like it might reverse', or holding past target 'to see if it goes further', both replace your rules with emotion.",
      "Management is where the most emotion appears, so this session pays close attention to what you feel while a trade is open."
    ],
    why: [
      "Moving a stop to avoid a loss turns a planned −1R into a potentially much larger loss; doing it even occasionally can wipe out a positive expectancy. Cutting winners early lowers average win R, which also erodes expectancy.",
      "Your backtest statistics assumed perfect management. Every deviation in simulation makes your real behaviour diverge from those numbers."
    ],
    how: [
      "In your pre-session plan, copy your exit rules word for word.",
      "Run a replay in the Trading Practice Lab, taking only setups that meet your rules.",
      "When a trade is open, before each new candle, write which exit rule (if any) applies.",
      "Act only on rule-defined exits. If you feel an urge to intervene, write the urge and the emotion in the notes instead.",
      "Log each trade with a 'management followed plan? Y/N' field and the type of any deviation.",
      "After the session, compute what each trade would have returned with perfect rule management, and compare."
    ],
    example: {
      title: "Hypothetical management log",
      lines: [
        "Trade 1: hypothetical long, entry 12.50, stop 12.38, target 12.74 (2R).",
        "Price drops to 12.41 → urge to move stop lower noted ('fear') → stop left in place.",
        "Price reverses and hits 12.74 → +2R, managed exactly as planned.",
        "Trade 2: at +1.5R, urge to close early ('greed/fear of giving back') → held per rule → time exit at +1.2R.",
        "Deviations: 0. Urges recorded: 2. Emotion pattern: fear peaks near the stop.",
        "Hypothetical prices only; illustrative of process, not real market data."
      ]
    },
    mistakes: [
      "Widening the stop when price approaches it, which turns small planned losses into large ones.",
      "Taking profits early out of fear, which lowers average win R and damages expectancy.",
      "Moving the stop to break-even without a written rule, then getting stopped out of valid trades.",
      "Not recording urges you resisted, which hides the emotional pattern you need to see.",
      "Excusing a deviation because the trade ended well."
    ],
    quiz: [
      { q: "What does 'no moving stops' mean?", a: "Never move the stop further from entry; only move it as a written rule allows." },
      { q: "How do early exits from winners affect expectancy?", a: "They lower average win R, which reduces expectancy." },
      { q: "What should you do with an urge to intervene in an open trade?", a: "Write down the urge and the emotion, and act only on rule-defined exits." }
    ]
  },

  61: {
    what: [
      "Session 4 compares your simulation results to your backtest. Both used the same rules, so differences usually come from execution (late entries, missed triggers, management deviations) and psychology (fear, impatience, frustration after losses).",
      "Compare like with like: win rate, average win R, average loss R, expectancy and the percentage of trades where the plan was followed. With few simulated trades, differences in win rate may be just noise, but process gaps — e.g. an average loss of −1.3R when the plan says −1.0R — are a clear signal.",
      "This session also introduces a post-loss routine: a short, fixed sequence you follow after every losing trade, such as pausing for a set number of candles, re-reading the plan, and writing one line on whether the loss was a valid loss or a mistake.",
      "Many execution gaps appear right after losses, which is why the routine and the comparison belong together."
    ],
    why: [
      "The gap between backtest and simulation tells you what to work on. If your simulated losses average larger than −1R, you are not honouring stops. If wins are smaller than in the backtest, you are cutting them early. These are fixable behaviours, not strategy flaws.",
      "A post-loss routine interrupts the most dangerous emotional sequence in trading: loss → frustration → impulsive revenge trade."
    ],
    how: [
      "Total your Simulation log so far: trades, win rate, avg win R, avg loss R, expectancy, % plan followed.",
      "Put these beside your backtest numbers from Day 55 in the Trading Journal.",
      "For each difference, label the likely cause: execution, psychology, or sample size.",
      "Write your post-loss routine (e.g. pause 3 candles, re-read setup rules, label the loss, emotion check).",
      "Run a new replay session in the Trading Practice Lab and apply the routine after every loss.",
      "Log which trades came immediately after a loss and whether they followed the plan.",
      "Pick the single biggest execution gap as next session's focus."
    ],
    example: {
      title: "Hypothetical backtest vs simulation comparison",
      lines: [
        "Backtest (60 trades): win 45%, avg win +1.8R, avg loss −1.0R, expectancy +0.26R.",
        "Simulation (15 trades): win 47%, avg win +1.2R, avg loss −1.3R.",
        "Sim expectancy = (0.47 × 1.2) − (0.53 × 1.3) = 0.564 − 0.689 ~ −0.13R.",
        "Gap 1: smaller wins → early exits (psychology: fear of giving back).",
        "Gap 2: losses beyond −1R → stop moved twice; both trades came right after a loss.",
        "Hypothetical numbers; 15 trades is a small sample, so focus on process gaps, not the win rate."
      ]
    },
    mistakes: [
      "Blaming the strategy when the numbers show execution gaps.",
      "Comparing only win rate and ignoring average win and loss size.",
      "Over-reading differences from a small simulation sample.",
      "Skipping the post-loss routine 'just this once' after a frustrating loss.",
      "Trying to fix every gap at once instead of picking the biggest one."
    ],
    quiz: [
      { q: "Where do most differences between backtest and simulation come from?", a: "Execution and psychology, since the rules are the same." },
      { q: "Simulated average loss is −1.3R while the plan is −1R. What does that suggest?", a: "Stops are not being honoured — losses are exceeding the planned risk." },
      { q: "What is the purpose of a post-loss routine?", a: "To interrupt the frustration → impulsive trade cycle and return to the plan after a loss." }
    ]
  },

  62: {
    what: [
      "Session 5 is the final simulation session of the phase. The focus is a complete cycle: plan, execute only the plan, respect limits, and finish with a full statistical and behavioural review.",
      "The full review covers both numbers and behaviour. Numbers: trades, win rate, average win and loss R, expectancy, net R, maximum drawdown across all simulation sessions. Behaviour: plan adherence percentage, number of impulsive entries, management deviations, skipped setups, and the emotions that came before mistakes.",
      "This session applies everything from the week: pre-session plan (Session 1), A-setups only (Session 2), honouring stops and targets (Session 3), and the post-loss routine (Session 4)."
    ],
    why: [
      "A complete review turns a week of sessions into conclusions you can act on: what your process does well, where it breaks, and what to practise next. Without it, the sessions are just isolated experiences.",
      "Ending the phase with a clean, plan-only session also gives you a reference point — a session you can look back on as an example of the process working as intended, regardless of the R result."
    ],
    how: [
      "Write the full pre-session plan, including limits and the post-loss routine.",
      "Run a replay session in the Trading Practice Lab: A-setups only, rule-based management, stop at limits.",
      "Log every trade and every skipped setup in the Simulation log with emotions.",
      "Combine all five simulation sessions and compute the full statistics, including expectancy.",
      "Compute behaviour statistics: % plan followed, impulsive entries, management deviations, trades after losses.",
      "Compare with your backtest and with Session 4's gaps — did the biggest gap shrink?",
      "Write a one-page phase summary in the Trading Journal and update your Playbook with the lessons learned."
    ],
    example: {
      title: "Hypothetical full simulation review",
      lines: [
        "All sessions: 20 hypothetical simulated trades, 9 wins (45%), 11 losses (55%).",
        "Avg win +1.6R, avg loss −1.05R → expectancy = (0.45 × 1.6) − (0.55 × 1.05) = 0.72 − 0.58 ~ +0.14R.",
        "Plan followed: 17 of 20 trades (85%). Impulsive entries: 2 (both in Session 1). Stop moves: 2 (Sessions 1-3), 0 since.",
        "Session 5: 2 trades, both by plan; 3 setups skipped. Net −0.3R — still a good process session.",
        "Main finding: early exits are the remaining gap; next practice focus is holding to target.",
        "Hypothetical and small-sample; not evidence of real-money performance."
      ]
    },
    mistakes: [
      "Judging the phase only by net R, ignoring the improvement in process.",
      "Breaking limits on the last session because 'it's the final one'.",
      "Skipping the behavioural statistics, which are the most useful part of simulation.",
      "Concluding from 20 simulated trades that the strategy is proven.",
      "Treating the end of simulation as a signal to trade real money."
    ],
    quiz: [
      { q: "What two kinds of statistics belong in the full review?", a: "Performance stats (win rate, avg R, expectancy, drawdown) and behaviour stats (plan adherence, impulsive entries, deviations)." },
      { q: "Can a losing session be a good session?", a: "Yes — if every decision followed the plan, the process was good regardless of the result." },
      { q: "Hypothetical: 40% wins, avg win 2R, avg loss 1R. Expectancy?", a: "(0.4 × 2) − (0.6 × 1) = +0.2R per trade." }
    ]
  },

  63: {
    what: [
      "This week moved from testing rules to practising execution in simulation. Day 57 set the paper-trading rules: no real money, same plan, same limits, same journal. Session 1 built the pre-session plan and logged emotions. Session 2 practised patience with A-setups only and logged skipped setups.",
      "Session 3 focused on managing open trades: honouring stops and targets, never moving stops away. Session 4 compared simulation with the backtest to find execution and psychology gaps and introduced a post-loss routine. Session 5 ran a complete plan-only session and a full review of performance and behaviour.",
      "The big idea of the week: differences between a strategy on paper and a strategy in practice usually come from the person executing it. Simulation is where you find and work on those differences without real money at stake."
    ],
    why: [
      "Knowing your rules is not the same as following them. This review turns a week of simulated experience into a short list of personal habits to keep and to fix.",
      "It also resets expectations. A handful of simulated sessions is a small sample, and neither good nor bad results here say much about the future. What they do show clearly is your process."
    ],
    how: [
      "Re-read this week's Simulation log entries and Trading Journal notes.",
      "From memory, write the five simulation session focuses and one thing you learned from each.",
      "Write your plan adherence percentage, your most common deviation, and the emotion that most often preceded it.",
      "Rewrite your post-loss routine and simulation rules card from memory; compare with the originals.",
      "Identify your weakest concept from the week and re-read that lesson.",
      "Update the Playbook with one habit to keep and one habit to fix.",
      "Save the best insights to the Knowledge Vault."
    ],
    example: {
      title: "Hypothetical weekly self-review",
      lines: [
        "Sessions 1-5 recalled: plan, patience, management, comparison, full review.",
        "Plan adherence: 85% across 20 hypothetical simulated trades.",
        "Most common deviation: early exit from winners; emotion before it: 'fear of giving back'.",
        "Post-loss routine rewritten from memory — forgot the 'label the loss' step → re-added.",
        "Keep: pre-session plan. Fix: hold to target unless a written exit rule applies.",
        "Reminder: simulated practice only — not a signal to trade real money."
      ]
    },
    mistakes: [
      "Focusing only on simulated profit and loss rather than on process and behaviour.",
      "Assuming good simulation results mean real-money trading would go the same way.",
      "Listing many things to fix instead of choosing the single most important one.",
      "Skipping the emotion review because it feels less concrete than numbers.",
      "Not updating the Playbook, so the week's lessons are not carried forward."
    ],
    quiz: [
      { q: "What were the focuses of Simulation Sessions 1-5?", a: "1 pre-session plan, 2 A-setups only/patience, 3 honouring stops and targets, 4 comparing with backtest and post-loss routine, 5 full plan-only session and review." },
      { q: "Where do differences between backtest and simulation usually come from?", a: "Execution and psychology." },
      { q: "What does simulation success tell you about real-money trading?", a: "Nothing definitive — it shows process consistency in practice, not future results, and is not a signal to trade real money." }
    ]
  }
};
