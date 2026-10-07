import type { LessonContent } from './types';

// Days 64-84: Trading Psychology, Playbook Creation, Final Evaluation.
// Educational content only — not financial advice. All practice in this app is simulated
// (paper trading / historical replay). Every number in an example is hypothetical.

export const CONTENT: Record<number, LessonContent> = {
  64: {
    what: [
      "FOMO stands for Fear Of Missing Out. In trading it is the urge to jump into a move because price is already running and you feel you will be left behind. The trigger is not your setup — it is the sight of a big green (or red) candle and the story in your head that this is the move everyone else is catching.",
      "FOMO usually shows up as chasing: entering after the move is already extended, far away from any level where your stop would make sense. Because the entry is late, the stop has to be wide (or is skipped entirely) and the remaining room to a target is small, so the reward-to-risk ratio quietly collapses.",
      "A second form is entering without a setup at all. You did not plan the trade before the session, the conditions on your checklist are not met, but price is moving so you click anyway. In your journal these trades tend to share one feature: you cannot name the setup that justified them.",
      "The antidote is simple to say and hard to do: plan before price moves, and accept that there is always another trade. Markets open every day. Missing one move costs you nothing; chasing one can cost you a full R or more, plus the confidence and discipline you have been building."
    ],
    why: [
      "FOMO trades are among the most common entries in beginner Mistake Labs because they feel urgent and exciting. They break almost every rule at once — no setup, poor location, unclear stop, rushed sizing. Learning to recognise the feeling early protects both your simulated account and the integrity of your practice data.",
      "If your simulation results are full of FOMO trades, your statistics stop measuring your strategy and start measuring your impulses. Removing them is the fastest way to get honest data about whether your setup actually works."
    ],
    how: [
      "Before each practice session, write your watchlist and the exact setup you are looking for in the Trading Journal mindset check. If a trade is not on that list, it is not a trade today.",
      "Add an if-then rule to the Psychology Rules section of your Playbook: 'If price has already moved more than my planned distance from the level, then I do not enter — I mark it as a missed trade.'",
      "In the Trading Practice Lab, replay a session and deliberately note every moment you felt the urge to chase. Do not take those trades; just timestamp them. Afterwards, check what happened — often the chased move reversed or offered a better pullback.",
      "When you feel FOMO, use a 60-second breathing pause: hands off the mouse, four slow breaths, then read your entry checklist out loud. If any box is unticked, the answer is no.",
      "Log every FOMO entry (or near-entry) in the Psychology journal with the emotion, intensity (1-10) and what you saw on the chart that triggered it.",
      "Tag FOMO trades in the Mistake Lab so Analytics can show you how they perform compared with planned trades. Seeing the numbers side by side is a powerful deterrent.",
      "Keep a 'missed trades' list. Recording a missed move without taking it trains your brain that missing a trade is a normal, safe outcome."
    ],
    example: {
      title: "Hypothetical journal entry — a FOMO near-miss in replay",
      lines: [
        "Session: historical replay, hypothetical practice account.",
        "Plan: only take pullbacks to the morning support level with a confirmation candle.",
        "10:05 — price ran hard away from the level, about 3× my normal stop distance in one candle. Urge to buy: 8/10.",
        "Action: breathing pause, re-read entry checklist. 'Pullback to level' was unticked → no trade. Logged as a missed trade.",
        "10:40 — price pulled back toward the level, a valid setup formed and I took it with a normal stop (hypothetical 1R risk).",
        "Lesson: the chase entry would have needed a stop three times wider for the same target. Waiting cost me nothing."
      ]
    },
    mistakes: [
      "Entering after a large candle because it 'looks strong' — late entries force wide stops and shrink your reward-to-risk.",
      "Moving your stop further away to make a chase trade 'fit' — this raises your risk without improving the setup.",
      "Trading tickers that were not on your pre-session plan — unplanned trades bypass all the thinking you did when calm.",
      "Treating a missed move as a loss — it is not, and believing it is fuels the next impulsive entry.",
      "Not journaling near-misses — the urges you resisted are valuable data about your triggers."
    ],
    quiz: [
      { q: "What are the two most common forms of FOMO trading?", a: "Chasing an already-extended move, and entering without a planned setup." },
      { q: "Why does a chase entry damage reward-to-risk?", a: "The late entry forces a wider stop while leaving less room to the target." },
      { q: "What simple belief helps neutralise FOMO?", a: "There is always another trade — missing one move costs nothing." }
    ]
  },

  65: {
    what: [
      "Fear and greed are the two emotions most traders name first, and both are normal human reactions to uncertainty and money (even simulated money). They are not character flaws; they are signals. The problem is when they make your decisions instead of your rules.",
      "Fear shows up as hesitation and early exits. You see a valid setup but do not take it, or you take it and close at the first wiggle against you, long before your stop or target is reached. Over time fear cuts off your winners and leaves your strategy unable to show its real edge.",
      "Greed shows up as oversizing and refusing to exit. You increase position size because you feel sure, or you hold past your target hoping for more, sometimes watching a winner turn into a loss. Greed also appears as removing the target entirely 'just this once'.",
      "Both are reduced by the same tools: fixed risk per trade and fixed rules decided before the trade. When the risk is small and predetermined, a single outcome matters less, so fear eases. When the exit is written in advance, there is nothing to negotiate in the moment, so greed has less room."
    ],
    why: [
      "Your strategy's statistics assume you take every valid setup and manage it the same way. Fear-driven skipped trades and greed-driven held trades both distort that. You end up trading a different, untested strategy without realising it.",
      "Learning to notice which emotion is active, and letting the written rule decide, is one of the core skills measured by the psychology and discipline areas of your Evaluation dashboard."
    ],
    how: [
      "Fix your risk per trade in the Risk Rules section of your Playbook (for example, a hypothetical 1% of the practice account) and never change it mid-session.",
      "Before entering any trade in the Trading Practice Lab, write the stop and target first. If you cannot write both, you are not ready to enter.",
      "Add two if-then rules to Psychology Rules: 'If I want to exit before stop or target, then I wait for the candle to close and re-check my exit rules' and 'If I want to hold past target, then I take the planned exit — no exceptions.'",
      "After each trade, rate fear and greed from 0-10 in the Psychology journal. Look for patterns: which one is louder for you?",
      "Use the Mistake Lab tags 'early exit', 'skipped valid setup', 'oversized' and 'moved target' so Analytics can show how often each one occurs.",
      "Review your process score in the Practice Lab rather than profit. A trade that followed the rules and lost is a good trade; one that broke rules and won is a mistake."
    ],
    example: {
      title: "Hypothetical if-then rule set for fear and greed",
      lines: [
        "Fixed risk: hypothetical 1% of the practice account per trade, calculated before entry.",
        "IF a valid setup appears and I hesitate → THEN I read the checklist; if all boxes are ticked, I enter at my planned size.",
        "IF price moves against me but has not hit my stop → THEN I do nothing until the stop or a written exit rule triggers.",
        "IF price reaches my target → THEN I exit as planned, even if it 'looks like it will keep going'.",
        "IF I feel sure enough to size up → THEN I keep the same size and note the feeling in my journal.",
        "Post-trade: rate fear and greed 0-10; review weekly in Analytics."
      ]
    },
    mistakes: [
      "Closing a trade at the first small pullback — fear-driven early exits cut winners short and break your R:R.",
      "Skipping valid setups after a loss — your edge only works if you take every qualifying trade.",
      "Increasing size because you 'feel confident' — feelings are not evidence and larger size amplifies emotions.",
      "Removing or moving the target to hold for more — this replaces a tested rule with a hope.",
      "Judging trades by profit instead of process — it rewards greed and punishes correct, disciplined losses."
    ],
    quiz: [
      { q: "How does fear typically show up in trading behaviour?", a: "Hesitating on valid setups and exiting trades too early." },
      { q: "How does greed typically show up?", a: "Oversizing positions and holding past planned targets." },
      { q: "What reduces both fear and greed?", a: "Fixed, small risk per trade and exit rules written before entering." }
    ]
  },

  66: {
    what: [
      "Revenge trading is trying to win back a loss immediately. After a losing trade, frustration or embarrassment creates a strong urge to 'get it back' — so you enter again quickly, often with bigger size and a weaker setup than usual.",
      "It is triggered by losses, especially unexpected or quick ones, or a loss that came from breaking a rule. The emotional logic is that the next trade will fix the feeling. In reality, the next trade is taken in the worst possible mental state: rushed, angry and focused on money rather than process.",
      "Revenge trading tends to spiral. One revenge trade loses, which creates more frustration, which leads to another, larger trade. A normal small losing day can become a very large one within an hour. This pattern appears often in simulation journals too, which is why it is worth fixing while practice is still risk-free.",
      "Two structural rules stop the spiral: a mandatory pause after a loss, and a maximum daily loss after which you stop for the day. These rules work because they are decided in advance, when you are calm, and do not rely on willpower in the heated moment."
    ],
    why: [
      "A single revenge spiral can undo weeks of careful work. Your strategy might be sound, but if one bad day per month wipes out the gains, your results will look like the strategy failed when in fact the process did.",
      "Building the habit of pausing in simulation means the reflex already exists if you ever trade in any other context. It also keeps your practice data clean so your Analytics reflect your real strategy."
    ],
    how: [
      "Set a max daily loss in the Risk Rules section of your Playbook (for example, a hypothetical 2R or 3R) and a max number of losing trades per session.",
      "Add a post-loss cool-off rule to Psychology Rules: 'After any loss, I step away from the screen for at least 10 minutes before considering another trade.' Use a phone timer.",
      "During the cool-off, write a short Psychology journal entry: what happened, did I follow my rules, what am I feeling (1-10), what do I want to do next?",
      "Before the next entry, complete the Trading Journal mindset check again. If anger or frustration is above your threshold (for example 6/10), the session ends.",
      "Tag any trade taken within 10 minutes of a loss as 'post-loss' in the Mistake Lab. Compare its results with your normal trades in Analytics.",
      "In the Trading Practice Lab, practise the routine: replay a session, and when a loss occurs, actually take the full pause before continuing the replay.",
      "If you hit the max daily loss, close the platform and do a non-trading review task instead — this keeps the streak habit without adding risk."
    ],
    example: {
      title: "Hypothetical post-loss routine log",
      lines: [
        "Trade 1 (hypothetical): valid setup, stopped out for -1R. Rules followed: yes.",
        "Feeling: frustrated 7/10, urge to re-enter immediately with double size.",
        "Action: started 10-minute timer, walked away, wrote this entry.",
        "After pause: frustration 4/10. Mindset check passed. Re-read entry rules.",
        "Next 30 minutes: no valid setup appeared, so no trade. Daily loss stayed at -1R, well within the hypothetical 3R limit.",
        "Note: without the pause I would have taken an unplanned trade at twice the size."
      ]
    },
    mistakes: [
      "Re-entering within minutes of a loss — your judgement is at its weakest right after a frustrating outcome.",
      "Doubling size to recover faster — it doubles the damage if the revenge trade also loses.",
      "Having no written max daily loss — without a hard limit there is nothing to stop a spiral.",
      "Skipping the pause because 'this setup is obvious' — the feeling of obviousness is itself a sign of emotional bias.",
      "Ignoring rule-following losses — a loss that followed the plan is normal and needs no 'revenge' at all."
    ],
    quiz: [
      { q: "What usually triggers revenge trading?", a: "A loss, especially a fast or frustrating one, creating an urge to win it back immediately." },
      { q: "Name two rules that stop a revenge spiral.", a: "A mandatory pause after a loss and a maximum daily loss limit." },
      { q: "Why decide these rules in advance?", a: "Because in the heated moment willpower is weak; pre-commitments made while calm do the work." }
    ]
  },

  67: {
    what: [
      "Overtrading means taking more trades than your strategy actually produces. It usually comes from boredom and impatience: the market is quiet, nothing on your checklist has appeared, and sitting still feels unproductive, so you start finding reasons to trade.",
      "Your edge lives only in your setup. The backtest you ran measured a specific set of conditions. Any trade outside those conditions is, by definition, untested — statistically it is noise, and once costs and errors are added it tends to have a negative expectancy.",
      "Waiting is a skill, not a lack of action. Professional processes in many fields involve long periods of observation with brief periods of execution. A session where you watched carefully and took zero trades because none qualified is a successful session.",
      "A trade cap — a maximum number of trades per session — is the simplest guardrail. It forces you to be selective, because each trade 'spends' one of a limited number of slots."
    ],
    why: [
      "Overtrading dilutes your results. Ten trades of which four are real setups will look worse than the four alone, and you may wrongly conclude your strategy does not work.",
      "Patience also protects attention. Every unnecessary trade uses mental energy you need for the real setup when it finally comes."
    ],
    how: [
      "Write a trade cap in Risk Rules (for example, a maximum of 3 trades per session) and track it on a sticky note or in the Trading Journal as you go.",
      "In the Trading Practice Lab, run a replay of a slow session and practise waiting. Count how many times you felt the urge to trade and how many valid setups actually appeared.",
      "Before every entry ask the setup question: 'Which named setup from my Playbook is this?' If you cannot answer in one sentence, do not trade.",
      "Give boredom a job: during quiet periods, mark levels, update your watchlist, or write in the Psychology journal instead of looking for trades.",
      "Use Analytics to compare trades tagged with a named setup against trades tagged 'no setup' or 'boredom'.",
      "Log a 'no-trade session' as a win in your timetable streak if you followed your process. Consistency counts, not activity."
    ],
    example: {
      title: "Hypothetical session tally — patience practice",
      lines: [
        "Replay session, hypothetical practice account, trade cap: 3.",
        "Urges to trade noted: 9.",
        "Valid setups per Playbook checklist: 2.",
        "Trades taken: 2 (both named setups). Result: +1.8R and -1R, net +0.8R (hypothetical).",
        "If I had taken all 9 urges, my backtest suggests most would have had no measurable edge.",
        "Process score: 9/10 — waited, respected the cap, journaled boredom twice."
      ]
    },
    mistakes: [
      "Trading because the market is quiet and you feel you 'should' be doing something — boredom is not a setup.",
      "Loosening your entry criteria during slow sessions — it turns a tested strategy into an untested one.",
      "Ignoring your trade cap after a win — feeling good leads to extra trades just as easily as feeling bad.",
      "Counting a no-trade day as a failure — it hurts consistency because you will force trades to avoid that feeling.",
      "Watching too many charts at once — more screens create more temptations, not more edge."
    ],
    quiz: [
      { q: "What are the main drivers of overtrading?", a: "Boredom and impatience." },
      { q: "Where does your edge exist?", a: "Only in your defined, tested setup; other trades are noise." },
      { q: "What simple rule limits overtrading?", a: "A maximum number of trades per session (a trade cap)." }
    ]
  },

  68: {
    what: [
      "Confidence in trading is the ability to act on your plan without hesitation. Healthy confidence is evidence-based: it comes from your backtest sample, your simulation results and your journal, not from how the last few trades turned out.",
      "Streaks distort feelings. After five wins in a row you may feel unstoppable; after five losses you may feel the strategy is broken. Both reactions read too much into a small sample. Even a strategy with a solid edge will produce long winning and losing streaks purely through randomness.",
      "Trusting the sample means asking 'What does my larger data set say?' rather than 'What happened yesterday?'. If your backtest of a hypothetical 100 trades showed a positive expectancy, a run of a few losses is expected, not alarming — as long as you are still following the rules.",
      "Over-confidence after a streak is as dangerous as fear after a loss. It shows up as larger size, relaxed rules and skipping the checklist. Staying humble after wins keeps your process stable."
    ],
    why: [
      "Your behaviour changes with your mood, and your results change with your behaviour. Anchoring confidence to data instead of recent outcomes keeps your execution consistent across good and bad weeks.",
      "This also prepares you for an honest Final Evaluation: you will rate skills based on evidence, not on how the last session felt."
    ],
    how: [
      "Open Analytics and write down your key numbers from backtesting and simulation: sample size, win rate, average R, expectancy. Put them in your Playbook under My Strategy.",
      "Before each session, read those numbers as part of the Trading Journal mindset check. This reminds you what 'normal' looks like.",
      "Add a streak rule to Psychology Rules: 'After 3 wins in a row, I re-read my checklist and keep size the same. After 3 losses in a row, I review whether rules were followed before changing anything.'",
      "In the Psychology journal, rate confidence 1-10 each session and compare it with your actual process score from the Trading Practice Lab. Notice when they diverge.",
      "Look at your longest losing streak in the backtest. Write it down so you are not surprised when a similar streak appears in simulation.",
      "Change your strategy only after reviewing a meaningful sample (for example, 30+ simulated trades), never after one streak."
    ],
    example: {
      title: "Hypothetical evidence card for confidence",
      lines: [
        "Backtest sample (hypothetical): 100 trades, 45% win rate, average winner +2.1R, average loser -1R.",
        "Expectancy (hypothetical): 0.45 × 2.1 - 0.55 × 1 = +0.40R per trade.",
        "Longest losing streak in backtest: 7 trades.",
        "Current simulation: 4 losses in a row, all rules followed.",
        "Conclusion: within normal range; no rule change. Keep size fixed and keep executing.",
        "Reminder after wins: the same math applies — a winning streak is not proof I should size up."
      ]
    },
    mistakes: [
      "Basing confidence on the last few trades — small samples are dominated by luck.",
      "Sizing up after a winning streak — over-confidence increases risk exactly when you are least careful.",
      "Abandoning a strategy after a normal losing streak — you never get to see its edge play out.",
      "Not knowing your backtest's longest losing streak — every streak then feels like an emergency.",
      "Confusing confidence with certainty — no single trade is ever certain, however good the setup."
    ],
    quiz: [
      { q: "Where should real trading confidence come from?", a: "Evidence — a meaningful backtest and simulation sample — not recent results." },
      { q: "Why are streaks misleading?", a: "Random variation creates streaks even in a strategy with a real edge; small samples mislead." },
      { q: "What is a sensible response to a winning streak?", a: "Keep size the same, re-read the checklist and stay humble." }
    ]
  },

  69: {
    what: [
      "Discipline is doing what your plan says, especially when you do not feel like it. It is not about being rigid or emotionless; it is about letting a decision you made calmly (your Playbook) override the impulse of the moment.",
      "The useful thing about discipline is that it can be measured. For each trade, ask: did I follow every rule — entry, stop, size, exit, and psychology rules? Your rule adherence rate is the percentage of trades where the answer was yes.",
      "Process over outcome means judging a trade by whether it followed the plan, not by whether it made money. A rule-following loss is a good trade. A rule-breaking win is a mistake that happened to pay, and it teaches the wrong lesson.",
      "Discipline compounds. Each time you follow a rule under pressure, it becomes slightly easier next time. Each exception makes the next exception easier too. Over 84 days, those small choices add up to a habit in one direction or the other."
    ],
    why: [
      "No strategy can be evaluated if it is not executed consistently. Discipline is what turns your backtest into a real test: if adherence is low, your simulation results describe your impulses, not your strategy.",
      "Discipline is one of the 8 skill areas on your Evaluation dashboard, and it is the one that makes all the others usable."
    ],
    how: [
      "Create a rule checklist in your Trading Journal with one line per rule: setup valid, size correct, stop placed, target set, exit followed, psychology rules respected.",
      "After every trade, tick each line honestly. A trade with all ticks counts as 'disciplined'.",
      "Calculate your weekly adherence rate (disciplined trades / total trades) and log it in Analytics or your journal. Set a target such as 90%.",
      "Use the process score in the Trading Practice Lab as your main success metric for each session.",
      "When you break a rule, log it in the Mistake Lab with which rule, what you felt, and a specific if-then fix.",
      "Keep your timetable streak going: showing up at the planned time, even for a short review, is itself a discipline rep."
    ],
    example: {
      title: "Hypothetical weekly discipline scorecard",
      lines: [
        "Simulated trades this week: 12.",
        "Trades following every rule: 10 → adherence 83% (target 90%).",
        "Rule breaks: 1 × moved stop wider, 1 × entered without confirmation candle.",
        "Results (hypothetical): disciplined trades net +3.5R; rule-break trades net -1.6R.",
        "If-then fix: IF I want to move my stop → THEN I close the trade at the original stop or leave it untouched.",
        "Next week's goal: 90%+ adherence, regardless of P&L."
      ]
    },
    mistakes: [
      "Judging a session by profit alone — it hides rule breaks that happened to work.",
      "Not measuring adherence — what is not measured tends to drift.",
      "Making 'just this once' exceptions — every exception weakens the habit you are building.",
      "Having vague rules — you cannot follow or check a rule like 'enter on strength'.",
      "Being harsh with yourself after a break — shame leads to hiding mistakes instead of fixing them."
    ],
    quiz: [
      { q: "How can discipline be measured?", a: "As rule adherence — the percentage of trades that followed every rule." },
      { q: "Is a losing trade that followed every rule a good or bad trade?", a: "A good trade — process matters more than a single outcome." },
      { q: "What does 'discipline compounds' mean?", a: "Each rule followed makes the habit stronger; each exception makes the next one easier." }
    ]
  },

  70: {
    what: [
      "This review day consolidates the Trading Psychology week. You covered six topics: FOMO (chasing and unplanned entries), fear and greed (early exits and oversizing), revenge trading (trying to win back losses), overtrading and impatience (boredom trades and trade caps), confidence (evidence over streaks) and discipline (measuring rule adherence).",
      "These topics share one thread: emotions are normal, but decisions should come from rules made in advance. Every lesson this week used the same toolkit — pre-session checks, if-then rules, cool-off timers, walk-away limits and honest journaling.",
      "A review day is not about learning new material. It is about re-reading what you wrote, finding the concept you understand least and rewriting it in your own words. That is where knowledge turns into understanding.",
      "By the end of today you should know which one or two emotional patterns show up most often in your own journal. Those will become the core of the Psychology Rules section of your Playbook next week."
    ],
    why: [
      "Psychology is the area most people skip because it feels vague. Reviewing your own journal turns it into concrete, personal data: which emotion, which trigger, which rule fixes it.",
      "The Playbook Creation week starts tomorrow, and the Psychology Rules and No-Trade Conditions sections depend directly on what you identify today."
    ],
    how: [
      "Re-read every Psychology journal entry from this week. Highlight the emotion that appeared most often and the situation that triggered it.",
      "Open the Mistake Lab and filter by this week. Count how many mistakes were emotional (FOMO, revenge, early exit, oversizing, boredom) versus technical.",
      "Identify your weakest concept from the six topics. Close your notes and write a three-sentence explanation of it from memory, then compare with the lesson.",
      "Write your top three if-then rules from the week (for example, one for FOMO, one for losses, one for streaks).",
      "Check Analytics: compare your adherence rate and process score with last week's.",
      "Save your best insight and your three if-then rules to the Knowledge Vault so they are ready for the Playbook.",
      "Update the psychology and discipline self-ratings on the Evaluation dashboard based on this evidence, not on mood."
    ],
    example: {
      title: "Hypothetical self-review walkthrough",
      lines: [
        "Most frequent emotion this week: impatience (5 journal mentions), mostly in quiet midday replays.",
        "Mistake Lab: 6 mistakes logged — 4 emotional (2 boredom trades, 1 FOMO chase, 1 early exit), 2 technical.",
        "Weakest concept: confidence vs. streaks. Rewritten: 'A streak is a small sample; I trust my 100-trade data, not my last 5 trades.'",
        "If-then 1: IF price is extended from my level → THEN no entry, log as missed.",
        "If-then 2: IF I take a loss → THEN 10-minute break and journal before the next trade.",
        "If-then 3: IF it is a quiet period → THEN I update levels instead of looking for trades."
      ]
    },
    mistakes: [
      "Skimming the journal instead of re-reading it carefully — patterns only appear when you look at all entries together.",
      "Picking your strongest topic to review — the value of a review comes from working on the weakest one.",
      "Writing generic rules like 'be more patient' — rules must be specific if-then statements to be usable.",
      "Rating psychology skills by how you feel today — use counts from the journal and Mistake Lab instead.",
      "Skipping the review because no new material is taught — consolidation is what makes the week stick."
    ],
    quiz: [
      { q: "What common thread links all six psychology topics this week?", a: "Emotions are normal, but decisions should come from pre-written rules, not feelings in the moment." },
      { q: "Name two tools that stop revenge trading and two that limit overtrading.", a: "Revenge: post-loss pause and max daily loss. Overtrading: trade cap and the 'which named setup is this?' check." },
      { q: "Why should confidence be anchored to your sample rather than recent trades?", a: "Recent trades are a tiny, luck-dominated sample; the larger data set reflects the strategy's real behaviour." }
    ]
  },

  71: {
    what: [
      "Your Playbook is the single document you read before every practice session. It captures what you trade, how you trade it, and the rules that keep you consistent. This week you will fill in all ten sections, starting today with My Market and My Strategy.",
      "My Market describes where and when you practise: the type of instrument (for example, liquid large-cap stocks or a major index product), the session window you focus on, and the timeframes you use for context and for entries. It is deliberately narrow — a focused scope makes patterns easier to learn.",
      "My Strategy is a short summary of your approach: the market condition you look for, the setup you trade, and the basic logic of why it might work. It is not the full rulebook — entry, stop, exit and risk rules come in later sections.",
      "Keep it clear and short. A good test is that the whole Playbook should be readable in about two minutes. If a section needs a paragraph to explain, it probably needs to be simplified."
    ],
    why: [
      "Without a defined market and strategy, every session becomes a new experiment and your data cannot be compared from day to day. Writing them down turns weeks of lessons into one consistent practice plan.",
      "These two sections also act as a filter: anything outside your market, session or strategy is automatically a no-trade, which reduces FOMO and overtrading."
    ],
    how: [
      "Open the Playbook and go to My Market. Write one line each for instrument type, session window, context timeframe and entry timeframe.",
      "Add one line for what you avoid (for example, very low-volume instruments or the first minutes after the open, if your data shows they hurt you).",
      "Go to My Strategy. Write one sentence for the market condition (trend, range), one for the setup, and one for why you think it has an edge.",
      "Add your key evidence from Analytics: backtest sample size and simulation sample size, with win rate and average R marked as your own practice data.",
      "Read both sections aloud and time yourself. If it takes more than about 40 seconds, cut words.",
      "Link this to your Trading Journal mindset check: the first question each session becomes 'Am I trading my market, in my session, with my strategy?'"
    ],
    example: {
      title: "Hypothetical fill-in template — My Market & My Strategy",
      lines: [
        "MY MARKET — Instrument type: ______ (e.g. liquid large-cap stocks in simulation)",
        "Session window: ______ (e.g. first two hours of the regular session) · Context TF: ______ · Entry TF: ______",
        "I avoid: ______ (e.g. low-volume names, major scheduled news minutes)",
        "MY STRATEGY — Condition: ______ (e.g. clear intraday uptrend with higher highs and higher lows)",
        "Setup: ______ (e.g. pullback to prior support / VWAP with a bullish confirmation candle)",
        "Why it may work: ______ (e.g. trades with the trend at a level where buyers previously stepped in)",
        "Evidence (hypothetical practice data): backtest ___ trades, simulation ___ trades, win rate ___%, average R ___."
      ]
    },
    mistakes: [
      "Listing too many markets or setups — a broad scope makes it impossible to build real skill or clean data.",
      "Writing the strategy as a long essay — if you cannot read it in seconds, you will not read it before every session.",
      "Leaving out the session window — trading all day multiplies boredom trades and fatigue.",
      "Copying someone else's strategy without your own backtest — your Playbook should rest on your data.",
      "Mixing rules into the summary — keep detailed rules in their own sections so each part stays clear."
    ],
    quiz: [
      { q: "What four items belong in My Market?", a: "Instrument type, session window, context timeframe and entry timeframe (plus what you avoid)." },
      { q: "What should the My Strategy section contain?", a: "A short summary: market condition, setup and why it might have an edge, with your evidence." },
      { q: "How long should the whole Playbook take to read?", a: "About two minutes." }
    ]
  },

  72: {
    what: [
      "Entry Rules are the exact conditions that must all be true before you enter a trade. They turn your setup from a picture in your head into a checklist anyone could verify by looking at the chart.",
      "Checklist format matters. Each rule is one line that can be answered yes or no. If even one answer is no, there is no trade. This all-must-be-true structure is what keeps FOMO and boredom trades out of your data.",
      "Rules must be objective. 'Strong trend' is subjective; 'price above the 20-period moving average with at least two higher highs and higher lows on the context timeframe' is objective. If two people could disagree about whether a rule is met, rewrite it.",
      "No exceptions. The power of a checklist comes from using it every time. A rule that is skipped 'when the setup looks really good' is not a rule, and those exceptions are exactly the trades your backtest never measured."
    ],
    why: [
      "Clear entry rules make your backtest repeatable and your simulation results comparable. They also remove the in-the-moment debate that drains focus and invites emotional decisions.",
      "Most rule breaks found in the Mistake Lab start at entry. A tight checklist prevents mistakes before they happen rather than fixing them afterwards."
    ],
    how: [
      "Open the Playbook Entry Rules section. List 4-6 conditions, each as a yes/no line.",
      "Order them from big picture to trigger: market context, structure, level, confirmation candle, risk check.",
      "For each rule, test objectivity: could you check it on a screenshot without explanation? If not, rewrite it with numbers or clear definitions.",
      "Include a final line: 'Stop and target are defined and R:R meets my minimum.' This links entry to your risk rules.",
      "Replay five past sessions in the Trading Practice Lab and apply the checklist strictly. Note any rule that was hard to judge and sharpen it.",
      "Copy the checklist into your Trading Journal template so every trade entry shows the ticked boxes."
    ],
    example: {
      title: "Hypothetical entry checklist (long pullback setup)",
      lines: [
        "[ ] Context timeframe shows higher highs and higher lows (uptrend).",
        "[ ] Price has pulled back to a marked support level or the session VWAP.",
        "[ ] A bullish confirmation candle has closed at the level (e.g. hammer or bullish engulfing).",
        "[ ] Entry is no further than a pre-set distance from the level (no chasing).",
        "[ ] Stop and target are defined; planned R:R is at least 2:1.",
        "[ ] Mindset check passed; within my trade cap and daily loss limit.",
        "ALL boxes ticked → enter at planned size. ANY box empty → no trade."
      ]
    },
    mistakes: [
      "Using vague words like 'strong' or 'clean' — subjective rules allow emotions to decide.",
      "Writing too many conditions — an overly long checklist rarely triggers and invites shortcuts.",
      "Allowing 'almost' setups — a nearly-met rule is an unmet rule, and the backtest did not include it.",
      "Leaving risk out of the entry checklist — a valid pattern with poor R:R is still a bad trade.",
      "Not testing the checklist on replays — untested rules often turn out to be ambiguous in real time."
    ],
    quiz: [
      { q: "What format should entry rules use?", a: "A checklist of yes/no conditions." },
      { q: "How many conditions must be true to enter?", a: "All of them — any unmet condition means no trade." },
      { q: "How do you know a rule is objective?", a: "Two people could check it on a chart and agree without discussion." }
    ]
  },

  73: {
    what: [
      "The Stop-Loss Rules and Exit Rules sections describe where your stop goes and every way a trade can end. Every trade has to end somehow; writing all the possible endings before you enter removes in-trade guesswork.",
      "Stop placement is the price level where your trade idea is proven wrong — usually just beyond the level or structure point that justified the entry, such as below the swing low of a pullback. The stop is set at entry and is never moved further away.",
      "Target rules define where you take profit: a fixed R multiple (for example 2R), the next key level, or a partial exit at one point and the remainder at another. Time exits close a trade that has not worked within a set period, or before the end of your session window.",
      "Early invalidation covers situations where the setup breaks before the stop is hit — for example, a strong candle closing back through the level against you. Writing these in advance lets you exit early for a planned reason, not out of fear."
    ],
    why: [
      "Undefined exits are where fear and greed do the most damage: holding losers, cutting winners and moving stops. Exit rules turn those decisions into routine actions.",
      "Consistent exits also make your average R stable, which is essential for an honest comparison of backtest and simulation results later in the course."
    ],
    how: [
      "In the Playbook Stop-Loss Rules section, write where the stop goes for your setup and the small buffer you use beyond the level.",
      "Add the non-negotiable: 'The stop can be moved closer to reduce risk (by rule) but never further away.'",
      "In Exit Rules, write your target rule, any partial-exit rule, and when (if ever) you move the stop to breakeven.",
      "Add a time exit: for example, 'If the trade has not reached 1R within a set number of candles, exit' and 'Close all positions before the end of my session window.'",
      "List 1-3 early invalidation signals specific to your setup.",
      "Test these exits on ten historical replays in the Trading Practice Lab and compare the average R with your backtest.",
      "Log any exit that did not follow these rules in the Mistake Lab with the emotion behind it."
    ],
    example: {
      title: "Hypothetical stop-loss & exit rules template",
      lines: [
        "STOP: just below the pullback swing low, plus a small fixed buffer. Set at entry. Never moved further away.",
        "TARGET: exit at 2R or at the next marked resistance level, whichever comes first.",
        "PARTIAL (optional): take half at 1R, move stop on the remainder to breakeven.",
        "TIME EXIT: if 1R is not reached within ___ candles, exit at market. Flat before the session window ends.",
        "EARLY INVALIDATION: a full-bodied candle closes back below the support level → exit, logged as planned.",
        "Hypothetical check: entry 50.00, stop 49.50 (risk 0.50 = 1R), target 51.00 (2R)."
      ]
    },
    mistakes: [
      "Placing stops at round numbers or random distances instead of where the idea is invalidated — they get hit for no structural reason.",
      "Moving a stop further away to avoid a loss — it turns a planned small loss into an unplanned large one.",
      "Having no time exit — trades that go nowhere tie up attention and often drift into losses.",
      "Exiting early without a written reason — that is fear, and it shrinks your average winner.",
      "Changing exit rules after every trade — you need a consistent sample to know whether they work."
    ],
    quiz: [
      { q: "Where should a stop-loss be placed?", a: "At the point where the trade idea is invalidated, usually just beyond the structure or level that justified entry." },
      { q: "Name three ways a trade can be exited by rule other than the stop.", a: "Target (R multiple or level), time exit, and early invalidation signal." },
      { q: "In which direction can a stop be moved?", a: "Only closer to reduce risk by rule — never further away." }
    ]
  },

  74: {
    what: [
      "Risk Rules are the numbers that keep any single trade, day or week from doing serious damage. There are four core rules: risk per trade, maximum daily loss, maximum trades per session, and minimum reward-to-risk (R:R).",
      "Risk per trade is usually expressed as a percentage of the (simulated) account — for example a hypothetical 0.5% or 1%. Position size is then calculated from that amount divided by the distance from entry to stop, so every trade risks the same amount regardless of where the stop sits.",
      "Max daily loss is the point at which you stop practising for the day, often expressed in R (for example 3R). Max trades caps how many trades you take per session. Together they stop revenge trading and overtrading from turning a normal day into a disaster.",
      "Minimum R:R is the smallest planned reward relative to risk that you will accept, such as 2:1. It filters out trades where the target is too close to justify the risk, and links directly back to the last line of your entry checklist."
    ],
    why: [
      "Risk rules are what allow a strategy with a modest edge to survive normal losing streaks. Without them, one emotional session can outweigh weeks of careful work.",
      "Fixed risk is also the main psychological stabiliser: when each loss is small and expected, fear and greed have far less to grab onto."
    ],
    how: [
      "In the Playbook Risk Rules section, write your risk per trade as a percentage of the practice account.",
      "Write the position-size formula next to it: size = (account × risk %) / (entry - stop distance). Use the app's calculator if available, or work it out before each simulated trade.",
      "Set a max daily loss in R and a max weekly loss in R.",
      "Set a max number of trades per session, based on how many valid setups your backtest typically produced.",
      "Set a minimum R:R and add it as a line in your entry checklist.",
      "Check Analytics for your largest daily loss in simulation so far. If it exceeds your new limit, note what happened and which rule would have stopped it."
    ],
    example: {
      title: "Hypothetical risk rules with a sizing calculation",
      lines: [
        "Practice account (hypothetical): 10,000 simulated units.",
        "Risk per trade: 1% → 100 units per trade.",
        "Example trade: entry 40.00, stop 39.60 → stop distance 0.40 → size = 100 / 0.40 = 250 shares (simulated).",
        "Max daily loss: 3R (300 units). Max weekly loss: 6R.",
        "Max trades per session: 3. Minimum planned R:R: 2:1.",
        "If any limit is hit → stop, journal, and switch to review tasks for the rest of the session."
      ]
    },
    mistakes: [
      "Using a fixed share size instead of a fixed risk amount — risk then varies wildly with stop distance.",
      "Setting a max daily loss but continuing 'just one more' — a limit you ignore is not a limit.",
      "Choosing a risk percentage that feels exciting — larger risk magnifies emotions and drawdowns.",
      "Accepting trades below your minimum R:R because the setup looks good — it erodes expectancy over many trades.",
      "Not recalculating size each trade — different stop distances need different sizes for the same risk."
    ],
    quiz: [
      { q: "What are the four core risk rules?", a: "Risk per trade, max daily loss, max trades per session, and minimum R:R." },
      { q: "How is position size calculated from fixed risk?", a: "Risk amount (account × risk %) divided by the entry-to-stop distance." },
      { q: "Why have a max daily loss?", a: "It stops a normal losing day from spiralling, especially through revenge trading." }
    ]
  },

  75: {
    what: [
      "The No-Trade Conditions and Psychology Rules sections describe when you will not trade and the mental rules you commit to. They are just as important as entry rules, because some of the best decisions in a session are the trades you do not take.",
      "A no-trade list covers market conditions (choppy price with no structure, major scheduled news, very low volume, outside your session window) and personal conditions (tired, unwell, rushed, upset). If any item applies, you do not trade — you can still review or replay.",
      "A pre-session state check is a short honest look at yourself before starting: sleep, stress, focus and mood, each rated quickly. It turns 'I feel fine' into a number you can compare with your results over time.",
      "The post-loss routine and walk-away rules are your pre-commitments for difficult moments: what you do after a loss, after hitting your limits, or when a specific emotion passes a threshold. These are the if-then rules you developed during the psychology week, now made official."
    ],
    why: [
      "Most large losses — in simulation too — come from trading in the wrong conditions or the wrong state, not from the strategy itself. Written no-trade rules remove those situations before they begin.",
      "Linking psychology to specific, observable rules makes the psychology skill on your Evaluation dashboard measurable instead of vague."
    ],
    how: [
      "In the Playbook No-Trade Conditions section, list 4-6 market conditions and 3-4 personal conditions that mean no trading today.",
      "In Psychology Rules, write your pre-session state check: sleep, stress, focus and mood rated 1-5, with a minimum total to trade.",
      "Write your post-loss routine as numbered steps (pause timer, breathing, journal, re-check).",
      "Write 2-3 walk-away rules: for example, hitting max daily loss, two rule breaks in one session, or an emotion rated above 7/10.",
      "Add your top three if-then rules from the Day 70 review (from the Knowledge Vault).",
      "Connect the state check to the Trading Journal mindset check so you complete it before every session.",
      "After a week, compare state-check scores with process scores in Analytics to see whether your thresholds are set correctly."
    ],
    example: {
      title: "Hypothetical no-trade & psychology rules template",
      lines: [
        "NO-TRADE (market): no clear structure on context TF · within ___ minutes of major scheduled news · outside session window.",
        "NO-TRADE (personal): under ___ hours of sleep · unwell · rushed or distracted · already upset before starting.",
        "STATE CHECK: sleep __/5 · stress __/5 (5 = calm) · focus __/5 · mood __/5 → trade only if total >= 14.",
        "POST-LOSS: 1) 10-minute timer 2) four slow breaths 3) journal entry 4) re-read checklist before any new trade.",
        "WALK AWAY IF: max daily loss hit · two rule breaks in one session · any emotion above 7/10.",
        "IF-THEN: IF I feel the urge to chase → THEN I log it as a missed trade and wait for the next setup."
      ]
    },
    mistakes: [
      "Only listing market conditions — your own state is often the bigger risk factor.",
      "Making walk-away rules optional — they must be automatic or they will be negotiated away.",
      "Skipping the state check on 'good' days — over-confidence is also a state worth noticing.",
      "Writing psychology rules as wishes ('stay calm') instead of actions — only actions can be followed and measured.",
      "Never reviewing thresholds — rules should be adjusted with data from your journal."
    ],
    quiz: [
      { q: "What two kinds of conditions belong on a no-trade list?", a: "Market conditions (choppy, news, low volume, outside session) and personal conditions (tired, unwell, upset)." },
      { q: "What is the purpose of a pre-session state check?", a: "To rate your readiness honestly before trading and stop if it is below your threshold." },
      { q: "Give an example of a walk-away rule.", a: "Stop for the day after hitting max daily loss, or after two rule breaks in one session." }
    ]
  },

  76: {
    what: [
      "The Best Setups and Common Mistakes sections are built from your data, not from opinion. Best Setups documents the variations of your strategy that performed best in backtesting and simulation. Common Mistakes documents the errors you make most often, from the Mistake Lab.",
      "Best setups from data means sorting your trades by setup variant, time of day, or market condition and finding where your results were strongest — with enough trades in each group to mean something. A variant with a hypothetical 5 trades is a hint; one with 40 is evidence.",
      "Screenshot examples make each setup concrete. A marked-up chart of a textbook example, with entry, stop and target drawn, is faster to recognise in real time than any written description.",
      "The prevention plan pairs each common mistake with a specific fix — usually an if-then rule or a change to your checklist. The goal is not to list your faults but to build guardrails around them."
    ],
    why: [
      "Focusing on what works and guarding against what repeatedly goes wrong is the most efficient way to improve. These two sections make your Playbook personal and grounded in evidence.",
      "Reading them before each session primes you to spot your best setups and to catch your typical mistakes before they happen."
    ],
    how: [
      "Open Analytics and group your backtest and simulation trades by setup variant. Note sample size, win rate and average R for each.",
      "Choose your top 1-3 variants with a reasonable sample and list them in Best Setups with one-line descriptions.",
      "Attach or describe one marked-up screenshot per setup from your Trading Practice Lab replays: entry, stop, target, and why it qualified.",
      "Open the Mistake Lab, sort by frequency, and pick your top 3-5 mistakes.",
      "For each mistake, write: what it looks like, the trigger, its typical cost in R, and a prevention if-then rule.",
      "Add the prevention rules to the relevant Playbook sections (Entry, Exit, Risk or Psychology) so they are enforced, not just listed."
    ],
    example: {
      title: "Hypothetical Best Setups & Common Mistakes section",
      lines: [
        "BEST SETUP A (hypothetical data): trend pullback to VWAP in first 90 min — 42 trades, 48% win rate, average +0.5R per trade.",
        "BEST SETUP B: pullback to prior-day high retest — 25 trades, 44% win rate, average +0.3R (smaller sample; keep testing).",
        "AVOID: same setup after midday — 30 trades, average -0.2R → added to No-Trade Conditions.",
        "MISTAKE 1: early exit before target (9 times, about -0.6R lost vs. plan) → IF trade is between entry and target THEN no action until rule triggers.",
        "MISTAKE 2: chasing extended moves (6 times) → IF entry is beyond max distance from level THEN no trade.",
        "MISTAKE 3: trading after a loss without pause (4 times) → mandatory 10-minute timer."
      ]
    },
    mistakes: [
      "Picking best setups from memory — memorable trades are not the same as profitable ones.",
      "Trusting tiny samples — a few lucky trades can make a variant look great.",
      "Listing mistakes without a prevention rule — awareness alone rarely changes behaviour.",
      "Skipping screenshots — visual examples are much faster to recognise during a live replay.",
      "Hiding embarrassing mistakes from the list — the most uncomfortable ones are usually the most costly."
    ],
    quiz: [
      { q: "Where should your Best Setups list come from?", a: "Your backtest and simulation data, grouped by setup variant with adequate sample sizes." },
      { q: "What should each Common Mistake entry include?", a: "What it looks like, its trigger, its typical cost, and a specific prevention rule." },
      { q: "Why add screenshot examples?", a: "Marked-up charts make setups faster and more reliable to recognise in real time." }
    ]
  },

  77: {
    what: [
      "This review day consolidates the Playbook Creation week. You have written all ten Playbook sections: My Market, My Strategy, Entry Rules, Stop-Loss Rules, Exit Rules, Risk Rules, No-Trade Conditions, Psychology Rules, Best Setups and Common Mistakes.",
      "Together they form one document that answers every question a session can raise: what to trade, when, how to enter, where to exit, how much to risk, when to stand aside, how to manage yourself, what works best and what to watch out for.",
      "Today's job is quality control. Re-read your journal entries and the Playbook itself, find the section you are least sure about, and rewrite it more clearly. A Playbook is only useful if it is specific, short and actually read.",
      "Then test it: run a full practice session using only the Playbook as your guide and see where it leaves you uncertain. Any moment of uncertainty marks a rule that needs sharpening."
    ],
    why: [
      "A Playbook that is vague, too long or contradictory will be ignored under pressure. Reviewing it now, before the Final Evaluation week, ensures the evaluation measures a clear process.",
      "The act of re-reading and rewriting also moves the rules from paper into memory, so you can apply them quickly during replays."
    ],
    how: [
      "Read the entire Playbook aloud and time it. Aim for about two minutes; cut or simplify anything that slows you down.",
      "For each of the ten sections, mark it green (clear and tested), amber (written but untested) or red (vague or missing).",
      "Pick your weakest section and rewrite it from memory, then compare with the original and keep the clearer version.",
      "Check for contradictions — for example, a minimum R:R in Risk Rules that your Exit Rules targets cannot achieve.",
      "Run one Trading Practice Lab replay using only the Playbook. Note every moment you were unsure what to do.",
      "Re-read this week's journal entries and save your best insight to the Knowledge Vault.",
      "Update the strategy and discipline ratings on the Evaluation dashboard based on how well the replay followed the Playbook."
    ],
    example: {
      title: "Hypothetical Playbook self-review",
      lines: [
        "Read-through time: 3 min 10 s → trimmed My Strategy and Best Setups → 2 min 5 s.",
        "Green: My Market, Entry Rules, Risk Rules, No-Trade Conditions.",
        "Amber: Exit Rules (time exit never tested), Best Setups (setup B sample still small).",
        "Red: Psychology Rules — 'stay calm after losses' rewritten as 'IF loss THEN 10-min timer + journal'.",
        "Contradiction found: minimum R:R 2:1, but partial exit at 1R lowers average R → noted to compare both in next replays.",
        "Replay test: one moment of uncertainty (news candle) → added a no-trade rule for scheduled news."
      ]
    },
    mistakes: [
      "Treating the Playbook as finished — it is a living document that should improve with data.",
      "Letting it grow too long — a Playbook that takes ten minutes to read will not be read before each session.",
      "Ignoring contradictions between sections — they create in-the-moment confusion and inconsistent execution.",
      "Reviewing only the sections you like — the weak section is where the review pays off.",
      "Not testing the Playbook in a replay — uncertainty only shows up when you try to use it."
    ],
    quiz: [
      { q: "Name the ten Playbook sections.", a: "My Market, My Strategy, Entry Rules, Stop-Loss Rules, Exit Rules, Risk Rules, No-Trade Conditions, Psychology Rules, Best Setups, Common Mistakes." },
      { q: "What three qualities should a good Playbook have?", a: "Specific, short (readable in about two minutes) and actually read before every session." },
      { q: "How do you find rules that need sharpening?", a: "Run a replay using only the Playbook and note every moment of uncertainty." }
    ]
  },

  78: {
    what: [
      "The Final Evaluation week begins with a knowledge review of Phases 1-5: foundations, candlesticks, support and resistance levels, and market structure and indicators. The goal is to explain each concept without notes, then mark the areas where you hesitate.",
      "Foundations include how markets and orders work, bid and ask, spread, liquidity, volume, timeframes and the difference between investing, swing trading and day trading. Candles cover anatomy (open, high, low, close, body, wicks) and common patterns such as hammers, engulfing candles and dojis.",
      "Levels include support, resistance, role reversal, prior-day highs and lows and why price reacts at certain areas. Structure and indicators cover trends (higher highs and higher lows), ranges, breakouts and pullbacks, moving averages, VWAP, volume and momentum indicators — and their limitations.",
      "Explaining without notes is a well-known learning technique: if you can teach it simply, you understand it. Where you cannot, you have found a gap — which is useful information, not a failure."
    ],
    why: [
      "Every later skill — chart reading, strategy, risk — rests on these foundations. Gaps here quietly cause errors later, like misreading a candle or mislabelling a trend.",
      "This review provides the evidence for the knowledge score on your Evaluation dashboard, so the final rating reflects what you actually know."
    ],
    how: [
      "Make a list of 20-30 key terms from Phases 1-5 (use your lesson history and Knowledge Vault).",
      "For each term, explain it out loud or in writing in two sentences without looking anything up.",
      "Mark each one: confident, shaky or unknown.",
      "Re-read the lessons for every shaky or unknown term and rewrite the explanation in your own words.",
      "Retake the quizzes from the weekly review days in Phases 1-5 and note your scores.",
      "Record your knowledge rating on the Evaluation dashboard, backed by the count of confident terms.",
      "Add your weakest two topics to next week's timetable for focused revision."
    ],
    example: {
      title: "Hypothetical knowledge self-check grid",
      lines: [
        "Foundations — spread, liquidity, order types: confident · timeframes: confident · market vs. limit orders: shaky.",
        "Candles — anatomy, hammer, engulfing: confident · doji in context: shaky.",
        "Levels — support/resistance, role reversal: confident · prior-day levels: confident.",
        "Structure & indicators — trend definition: confident · VWAP use: shaky · momentum indicator limits: unknown.",
        "Score: 22 of 28 confident (hypothetical self-assessment) → 79%.",
        "Focus list: order types, doji context, VWAP, indicator limitations."
      ]
    },
    mistakes: [
      "Reviewing with notes open — recognition feels like understanding but is not the same as recall.",
      "Skipping topics that feel basic — foundation gaps cause errors in advanced work.",
      "Rating knowledge by gut feeling — count confident terms so the score reflects evidence.",
      "Only re-reading shaky topics — rewriting them in your own words is what fixes the gap.",
      "Trying to review everything in one sitting — split it into blocks to keep recall honest."
    ],
    quiz: [
      { q: "What four areas does today's knowledge review cover?", a: "Foundations, candles, levels, and structure & indicators." },
      { q: "Why explain concepts without notes?", a: "Recall without notes shows real understanding; it exposes gaps that re-reading hides." },
      { q: "What should you do with shaky topics?", a: "Re-read the lesson, rewrite the idea in your own words and schedule focused revision." }
    ]
  },

  79: {
    what: [
      "The Technical Analysis Review tests your chart-reading skill: you mark up five fresh charts completely, using only historical data in the Trading Practice Lab, and decide whether your setup is present or not.",
      "Full chart markup follows a fixed order. Structure first: is the context timeframe trending up, down or ranging? Where are the swing highs and lows? Levels second: mark support, resistance, prior-day highs and lows and any other key areas.",
      "Then candles: what are the candles doing at or near those levels — rejection, indecision, strong continuation? Finally the setup decision: does the chart meet every line of your entry checklist, yes or no?",
      "'No setup' is a perfectly valid answer and often the most common one. The skill being tested is not finding trades — it is reading the chart accurately and applying your rules consistently."
    ],
    why: [
      "Chart reading underpins every simulated trade. A consistent markup routine reduces errors such as trading against the trend or ignoring a nearby level.",
      "This exercise produces the evidence for the chart-reading score on your Evaluation dashboard."
    ],
    how: [
      "In the Trading Practice Lab, choose five historical charts you have not seen before (use random or unfamiliar replay dates).",
      "For each chart, mark structure on the context timeframe first: label trend or range and the last two swing points.",
      "Mark key levels second: at least support, resistance and prior-day high/low.",
      "Read the candles at those levels and write one sentence on what they suggest.",
      "Run your entry checklist and record: setup present (with entry, stop, target) or no setup (with the reason).",
      "Play the replay forward and compare what happened. Note any markup errors, not just whether a trade would have won.",
      "Score yourself out of 5 for markup accuracy and record it on the Evaluation dashboard."
    ],
    example: {
      title: "Hypothetical markup log for one replay chart",
      lines: [
        "Chart 3 (historical replay, unnamed instrument, hypothetical prices).",
        "Structure: context TF uptrend — higher lows at 21.40 and 21.85.",
        "Levels: support 22.00 (prior-day high), resistance 22.90.",
        "Candles: pullback to 22.00 printed a hammer with a long lower wick.",
        "Checklist: all boxes ticked → setup present. Entry 22.10, stop 21.95, target 22.40 (2:1).",
        "Replay outcome noted; markup accurate. Session total: 4 of 5 markups judged correct."
      ]
    },
    mistakes: [
      "Marking levels before structure — without context, levels can be read in the wrong direction.",
      "Using charts you have already seen — hindsight makes markup look better than it is.",
      "Judging accuracy by whether the trade won — a correct read can still lose; grade the process.",
      "Forcing a setup on every chart — 'no setup' is often the correct answer.",
      "Drawing too many lines — clutter hides the levels that matter."
    ],
    quiz: [
      { q: "What is the correct markup order?", a: "Structure first, then levels, then candles, then the setup decision." },
      { q: "Is 'no setup' an acceptable result?", a: "Yes — it is often the correct and most common answer." },
      { q: "How should you grade the exercise?", a: "By accuracy of the markup and rule application, not by whether the trade would have won." }
    ]
  },

  80: {
    what: [
      "The Risk & Strategy Review checks whether your rules meet three standards: specific, written and followed. A rule that fails any one of these does not really function as a rule.",
      "Specific means a rule can be checked objectively — it has a number, a level or a clear yes/no condition. Written means it lives in your Playbook, not in your head. Followed means your journal and Analytics show you actually applied it.",
      "The fourth principle is to adjust only with data. It is tempting to change rules after a few bad trades, but changes should come from a meaningful sample — and ideally be tested in backtesting or replay before they enter the Playbook.",
      "This review covers the Strategy, Entry, Stop-Loss, Exit and Risk Rules sections and compares what is written with what your trade records show."
    ],
    why: [
      "Rules that are vague, unwritten or ignored give a false sense of control. Checking all three standards shows whether your process actually exists in practice.",
      "This provides the evidence for the risk and strategy scores on your Evaluation dashboard."
    ],
    how: [
      "List every rule from the Strategy, Entry, Stop-Loss, Exit and Risk sections of your Playbook.",
      "For each rule, mark: Specific (Y/N), Written (Y/N), Followed (% of trades from your journal).",
      "Rewrite any rule marked not specific with a number or clear condition.",
      "In Analytics, check actual risk per trade, largest daily loss and average R:R against your written limits.",
      "For any rule followed less than about 90% of the time, find the reason in the Mistake Lab and add a prevention step.",
      "List any changes you want to make, the data that supports them, and how you will test them in replay before adopting them.",
      "Record your risk and strategy ratings on the Evaluation dashboard."
    ],
    example: {
      title: "Hypothetical rule audit table",
      lines: [
        "Risk 1% per trade — Specific: Y · Written: Y · Followed: 96% (one oversized trade).",
        "Max daily loss 3R — Specific: Y · Written: Y · Followed: 100%.",
        "'Enter on strong momentum' — Specific: N → rewritten as 'confirmation candle closes above prior candle high'.",
        "Time exit — Specific: Y · Written: Y · Followed: 70% → often forgotten; added a timer reminder.",
        "Proposed change: tighter stop buffer. Data: 12 trades only → test on 30+ replays first.",
        "Actual average R:R (hypothetical simulation data): 1.8 vs. planned 2.0 → investigate early exits."
      ]
    },
    mistakes: [
      "Assuming a rule is followed without checking the records — memory is biased toward good behaviour.",
      "Changing rules based on a few recent trades — small samples cannot tell you if a rule works.",
      "Keeping vague rules because they 'feel right' — they cannot be measured or improved.",
      "Changing several rules at once — you will not know which change made the difference.",
      "Ignoring rules with low adherence — they point straight to the biggest improvement opportunity."
    ],
    quiz: [
      { q: "What three standards should every rule meet?", a: "Specific, written and followed." },
      { q: "When should you adjust a rule?", a: "Only when a meaningful data sample supports it, ideally after testing the change in replay." },
      { q: "Why change only one rule at a time?", a: "So you can tell which change caused any difference in results." }
    ]
  },

  81: {
    what: [
      "The Backtest & Simulation Review puts your two main data sets side by side. Backtesting measured how your rules would have performed on historical charts; simulation (paper trading and replay) measured how you actually executed them in a more realistic setting.",
      "The win rate comparison asks whether you won roughly as often in simulation as the backtest suggested. The R:R comparison asks whether your average winner and average loser matched the planned values.",
      "Differences reveal execution gaps — places where your behaviour differs from the plan. Common gaps include early exits (lower average winner), late entries (worse R:R), skipped setups (fewer trades) and extra unplanned trades (lower win rate).",
      "Each gap becomes a candidate for a next experiment: a small, specific change you will test over a set number of simulated trades. Some difference between backtest and simulation is normal; the question is whether the gap has a clear, fixable cause."
    ],
    why: [
      "If simulation results fall short of the backtest, it is tempting to blame the strategy. Often the strategy is fine and execution is the issue — and execution is something you can train.",
      "This review provides the evidence for the backtesting and simulation scores on your Evaluation dashboard."
    ],
    how: [
      "In Analytics, export or note these metrics for both data sets: number of trades, win rate, average winner (R), average loser (R) and expectancy.",
      "Put them in a two-column comparison and calculate the difference for each.",
      "For each meaningful difference, look at the Mistake Lab and journal to find the most likely execution cause.",
      "Check trades per session too: more trades in simulation than in the backtest often signals overtrading.",
      "Choose one or two next experiments, each with a clear rule, a sample size (for example 20 trades) and a success measure.",
      "Schedule the experiments in your timetable and note them in the Common Mistakes section of your Playbook.",
      "Record backtesting and simulation ratings on the Evaluation dashboard."
    ],
    example: {
      title: "Hypothetical side-by-side comparison",
      lines: [
        "Backtest (hypothetical): 100 trades · win rate 46% · avg winner +2.0R · avg loser -1.0R · expectancy +0.38R.",
        "Simulation (hypothetical): 40 trades · win rate 44% · avg winner +1.5R · avg loser -1.1R · expectancy +0.04R.",
        "Gap 1: average winner 0.5R lower → journal shows frequent early exits.",
        "Gap 2: average loser slightly larger → two trades with late stop placement.",
        "Experiment 1: no manual exits between entry and target for the next 20 simulated trades.",
        "Experiment 2: stop order placed in the same action as entry for the next 20 trades."
      ]
    },
    mistakes: [
      "Comparing tiny simulation samples with large backtests — wait until you have enough trades for a fair comparison.",
      "Blaming the strategy before checking execution — most gaps come from behaviour, not rules.",
      "Looking only at win rate — average R and expectancy often reveal the bigger story.",
      "Running several experiments at once — overlapping changes make results impossible to interpret.",
      "Ignoring that backtests can be optimistic — hindsight and perfect fills make some gap expected."
    ],
    quiz: [
      { q: "What two key comparisons does this review make?", a: "Win rate and R:R (average winner and loser) between backtest and simulation." },
      { q: "What is an execution gap?", a: "A difference between planned and actual results caused by how you executed, such as early exits or late entries." },
      { q: "What makes a good next experiment?", a: "One specific change, a set sample size and a clear success measure." }
    ]
  },

  82: {
    what: [
      "The Psychology & Discipline Review looks back over your Psychology journal and timetable to answer two questions: which emotions repeated, and how consistent were you?",
      "Recurring emotions are the patterns that showed up again and again — for example impatience in quiet periods, frustration after losses, or over-confidence after wins. Counting them turns vague impressions into data.",
      "Your discipline score is your rule adherence rate across the course: the percentage of simulated trades that followed every rule. Consistency streaks come from your timetable — how often you showed up for your planned session, review or lesson.",
      "Finally, identify the rules that helped. Some if-then rules, cool-off timers or walk-away limits will have made a clear difference; others may have been ignored or unnecessary. Keep what works and simplify the rest."
    ],
    why: [
      "Psychology and discipline are the skills that turn a good plan into consistent behaviour. Reviewing them with data shows whether your habits are actually changing.",
      "This review provides the evidence for the psychology and discipline scores on your Evaluation dashboard."
    ],
    how: [
      "Read through your Psychology journal and tally each emotion mentioned, with its typical trigger.",
      "Rank your top three recurring emotions and note the average intensity (1-10) for each.",
      "From your Trading Journal or Analytics, calculate overall rule adherence and the trend from early weeks to recent weeks.",
      "Check your timetable and streaks: total planned sessions, sessions completed, and longest streak.",
      "List each Psychology Rule from your Playbook and mark whether it helped, was ignored or was not needed — use journal evidence.",
      "Update the Psychology Rules section: keep effective rules, rewrite ignored ones, remove unnecessary ones.",
      "Record psychology and discipline ratings on the Evaluation dashboard."
    ],
    example: {
      title: "Hypothetical psychology & discipline summary",
      lines: [
        "Top emotions (journal tally): impatience 18 · frustration after loss 11 · over-confidence after wins 6.",
        "Rule adherence: weeks 7-8 about 72% → weeks 11-12 about 91% (hypothetical simulation data).",
        "Timetable: 60 of 70 planned sessions completed (86%); longest streak 19 days.",
        "Helped most: 10-minute post-loss timer — no revenge trades logged since it was introduced.",
        "Ignored: 'breathing pause before every entry' → simplified to 'before entries after a loss or a missed move'.",
        "Next focus: impatience in midday replays → shorter session window."
      ]
    },
    mistakes: [
      "Reviewing from memory instead of the journal — memory softens patterns that the written record shows clearly.",
      "Focusing only on negative emotions — noticing over-confidence after wins is just as important.",
      "Treating missed timetable days as failures to hide — they are data about your schedule and energy.",
      "Keeping every rule out of habit — unused rules clutter the Playbook and reduce attention to the useful ones.",
      "Rating discipline without calculating adherence — a percentage is more honest than a feeling."
    ],
    quiz: [
      { q: "What two questions does this review answer?", a: "Which emotions repeated, and how consistent you were." },
      { q: "How is a discipline score calculated?", a: "As the percentage of trades that followed every rule (rule adherence)." },
      { q: "What should you do with a psychology rule you kept ignoring?", a: "Rewrite or simplify it so it is practical, or remove it if it is not needed." }
    ]
  },

  83: {
    what: [
      "The Final Evaluation brings together everything from this week. You complete the full evaluation across all 8 skill areas on the Evaluation dashboard — knowledge, chart reading, risk, strategy, backtesting, simulation, psychology and discipline — and record your overall score.",
      "Be honest. This is a self-assessment for your learning, not a test you can fail. An inflated score hides the areas that need work; an honest one shows you exactly where the next cycle of practice should go.",
      "Compare with the data. Each rating should be backed by evidence from this week's reviews: knowledge recall counts, markup accuracy, rule audit results, backtest-versus-simulation gaps, emotion tallies and adherence percentages.",
      "Finally, pick three focus areas — usually your lowest scores, or the area where improvement would help the others most. These become the theme of your next learning cycle."
    ],
    why: [
      "A structured evaluation turns 84 days of learning into a clear picture of your strengths and gaps. Without it, it is easy to over- or under-estimate your progress.",
      "Choosing three focus areas keeps the next cycle targeted instead of trying to improve everything at once."
    ],
    how: [
      "Gather your notes from Days 78-82: knowledge grid, markup scores, rule audit, comparison table and psychology summary.",
      "Open the Evaluation dashboard and rate each of the 8 skills, writing one sentence of evidence next to each score.",
      "Where your gut rating and the data disagree, use the data.",
      "Record your overall score and compare it with any earlier evaluation snapshots to see the trend.",
      "Choose three focus areas and write one measurable goal for each (for example, 'adherence above 90% over the next 40 simulated trades').",
      "Add those goals to your timetable and the top of your Playbook so they are visible every session."
    ],
    example: {
      title: "Hypothetical 8-skill evaluation",
      lines: [
        "Knowledge 8/10 (79% confident recall) · Chart reading 7/10 (4 of 5 markups correct).",
        "Risk 9/10 (100% max daily loss adherence) · Strategy 7/10 (two vague rules rewritten).",
        "Backtesting 8/10 (100-trade sample) · Simulation 6/10 (expectancy gap from early exits).",
        "Psychology 6/10 (impatience recurring) · Discipline 8/10 (adherence 91% recently).",
        "Overall (hypothetical self-assessment): 59/80 = 74%.",
        "Focus areas: 1) simulation exits 2) impatience 3) chart-reading speed — each with a measurable goal."
      ]
    },
    mistakes: [
      "Scoring generously to feel good — it hides the exact areas the next cycle should target.",
      "Scoring harshly out of self-criticism — an unfairly low score is as inaccurate as a high one.",
      "Rating without evidence — every score should point to a number or record from the reviews.",
      "Choosing too many focus areas — spreading effort thin slows improvement everywhere.",
      "Treating the score as a verdict on readiness for real money — it measures learning progress in a simulated environment only."
    ],
    quiz: [
      { q: "What are the 8 skill areas on the Evaluation dashboard?", a: "Knowledge, chart reading, risk, strategy, backtesting, simulation, psychology and discipline." },
      { q: "If your feeling and your data disagree, which should decide the score?", a: "The data." },
      { q: "How many focus areas should you choose, and what should each have?", a: "Three, each with a specific, measurable goal." }
    ]
  },

  84: {
    what: [
      "Congratulations — you have reached the end of the 84-day journey. Over twelve weeks you learned market foundations, read charts, built and backtested a strategy, practised in simulation, studied your own psychology, wrote a complete Playbook and evaluated yourself honestly.",
      "The most valuable thing you built is not any single rule — it is a process and the habit of improving about 1% every day: plan, practise, journal, review, adjust. That loop works for any skill and keeps working long after the course ends.",
      "Graduation is not a signal to start trading real money. This app is an educational simulator, and nothing here is financial advice or evidence that real-money trading would be profitable. The natural next step is another cycle of learning and simulated practice, guided by the three focus areas you chose yesterday.",
      "Keep simulating, keep journaling and keep improving. Many skilled practitioners in any field spend far longer than 84 days practising before considering themselves competent, and that patience is part of the skill."
    ],
    why: [
      "Skills fade without practice, and the habits you built — pre-session checks, rule adherence, honest journaling — need repetition to stay strong. Planning the next cycle now keeps the momentum.",
      "Celebrating the process (not profits) reinforces the right lesson: consistent, disciplined practice is what you control and what you are proud of."
    ],
    how: [
      "Celebrate the process: look back at your timetable streaks, the number of lessons completed, journal entries written and Playbook sections finished.",
      "Write a short reflection in your journal: the three biggest lessons from the 84 days and the habit you are proudest of.",
      "Plan your next learning cycle around the three focus areas from Day 83, each with a measurable goal and a set number of simulated trades or replays.",
      "Schedule regular sessions in the timetable — consistency matters more than length.",
      "Keep using the Trading Practice Lab, Psychology journal and Mistake Lab, and review Analytics weekly.",
      "Set a date to repeat the Evaluation dashboard (for example, in 4-6 weeks) to measure progress.",
      "Keep the Playbook alive: re-read it before every session and update it only with data."
    ],
    example: {
      title: "Hypothetical plan for the next learning cycle",
      lines: [
        "Reflection: biggest lessons — process over outcome, fixed risk calms emotions, waiting is a skill.",
        "Proudest habit: completing the pre-session mindset check before every practice session.",
        "Focus 1 — simulation exits: 40 replay trades with no manual exits between entry and target.",
        "Focus 2 — impatience: trade only the first 90 minutes of replay sessions for 4 weeks.",
        "Focus 3 — chart reading: mark up 3 unseen historical charts per week and score accuracy.",
        "Schedule: 4 simulated sessions + 1 weekly review; re-evaluate all 8 skills in 6 weeks.",
        "Reminder: this remains educational, simulated practice — no real-money trading is part of this plan."
      ]
    },
    mistakes: [
      "Treating graduation as a green light for real-money trading — the course builds learning habits, not proof of profitability.",
      "Stopping practice entirely — habits like journaling and rule adherence fade quickly without repetition.",
      "Starting the next cycle without focus areas — unfocused practice repeats the same mistakes.",
      "Throwing out the Playbook to try something new — refine with data instead of starting over.",
      "Measuring the next cycle by simulated profit alone — keep process score and adherence as the main metrics."
    ],
    quiz: [
      { q: "What is the most valuable thing built during the 84 days?", a: "A repeatable process and the habit of improving a little every day — plan, practise, journal, review, adjust." },
      { q: "What is the recommended next step after graduation?", a: "Another cycle of learning and simulated practice focused on your three focus areas — not real-money trading." },
      { q: "Name three habits to keep going.", a: "Simulating, journaling and reviewing/improving (plus reading the Playbook before every session)." }
    ]
  }
};
