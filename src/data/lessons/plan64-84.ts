import type { LessonPlan } from './types';

// Days 64-84: Paper Trading, Psychology & Playbook, Final Evaluation (ETF-only).
// Educational and simulated only — not financial advice. Paper trading uses virtual money.

export const PLAN: LessonPlan[] = [
  {
    day: 64,
    title: "Paper-Trading Rules & Setup",
    concept: "Paper trading in this app replays real historical ETF sessions bar by bar with virtual money. Before your first session you set the rules — risk per trade, daily loss limit, max trades and which ETFs and strategy you will trade — so the simulation tests your process, not your impulses.",
    keyPoints: [
      "Paper uses virtual money on HISTORICAL sessions",
      "Set risk limits before the first order",
      "Treat virtual rupees as if they were real",
      "One tested strategy, a short ETF watchlist"
    ],
    learn: "Read the paper-trading ground rules",
    practice: "Configure risk limits in Paper",
    journal: "Write your paper-trading rules"
  },
  {
    day: 65,
    title: "Pre-Session Plan & Watchlist",
    concept: "A paper session starts before the first bar. You pick two or three liquid ETFs, mark key levels, decide which setup you are looking for and write the conditions under which you will not trade at all. The plan is written while calm so the session only has to follow it.",
    keyPoints: [
      "Keep the watchlist to two or three ETFs",
      "Mark levels: prior high/low, VWAP, opening range",
      "Name the one setup you will trade",
      "Write no-trade conditions in advance"
    ],
    learn: "Learn the pre-session plan template",
    practice: "Build a Paper watchlist and plan",
    journal: "Save the written session plan"
  },
  {
    day: 66,
    title: "Paper Session: Executing the Plan",
    concept: "Today you run a full paper session and practise one thing: entering only when the planned setup appears. Each order needs a written trade reason, a stop-loss and a size that fits your risk limit. Skipping a trade that does not match the plan is a successful outcome.",
    keyPoints: [
      "Enter only the setup named in the plan",
      "Write the trade reason before entry",
      "Stop-loss and size set with every order",
      "A skipped bad trade counts as a win"
    ],
    learn: "Review the entry checklist for Paper",
    practice: "Run one full paper session",
    journal: "Log each trade reason and outcome"
  },
  {
    day: 67,
    title: "Paper Session: Managing Open Trades",
    concept: "Once a paper trade is open, the job is to follow the exit plan: leave the stop alone or only move it in your favour, take the target or trail as written, and exit on invalidation. Most damage happens between entry and exit when rules get renegotiated.",
    keyPoints: [
      "Never widen a stop once the trade is open",
      "Exit by rule: target, trail or invalidation",
      "Use take-profit and stop orders in Paper",
      "Flat before the session close"
    ],
    learn: "Study trade-management rules",
    practice: "Manage trades by rule in Paper",
    journal: "Note every mid-trade rule change urge"
  },
  {
    day: 68,
    title: "Paper Session: Respecting Risk Limits",
    concept: "The Paper simulator enforces risk limits: it rejects orders that exceed your per-trade risk or max trades, and starts a cooldown after the daily loss limit. Today you practise treating those limits as hard walls, and you study why you hit them when you do.",
    keyPoints: [
      "Rejected orders are the system protecting you",
      "Daily loss limit triggers a cooldown",
      "Never raise limits mid-session",
      "Never size up to recover losses"
    ],
    learn: "Learn how Paper enforces risk limits",
    practice: "Trade a session inside every limit",
    journal: "Record any limit you nearly broke"
  },
  {
    day: 69,
    title: "Paper Results vs Backtest Results",
    concept: "Paper trading is a second test of a strategy you already backtested. Comparing the two — win rate, average R, costs and number of trades — shows whether you executed the rules as tested. Gaps usually come from execution, not from the strategy itself.",
    keyPoints: [
      "Compare like with like: same ETFs and rules",
      "Small paper samples are noisy",
      "Gaps often reveal execution mistakes",
      "Costs and slippage must match in both"
    ],
    learn: "Learn how to compare paper vs backtest",
    practice: "Compare Paper report with Backtest",
    journal: "Write the biggest gap and its cause"
  },
  {
    day: 70,
    title: "Weekly Review — Paper Trading",
    concept: "This week you set up paper-trading rules, planned sessions, executed and managed trades and respected the simulator's risk limits, then compared paper results with your backtest. Today you review the week's paper reports and pick one process improvement.",
    keyPoints: [
      "Review every paper session report",
      "Score rule-following, not virtual P&L",
      "Find your most repeated mistake",
      "Choose one change for next week"
    ],
    learn: "Re-read this week's key points",
    practice: "Review all paper session reports",
    journal: "Write your weekly paper review",
    review: true
  },
  {
    day: 71,
    title: "FOMO & Overtrading",
    concept: "FOMO is the urge to chase an ETF that is already moving; overtrading is taking more trades than your plan allows. Both replace your setup with an emotion. A max-trades rule, a required trade reason and a missed-trades list are simple habits that keep them in check.",
    keyPoints: [
      "There is always another session",
      "Chasing forces wide stops and poor R:R",
      "Max trades per session is a hard cap",
      "Log missed moves instead of chasing"
    ],
    learn: "Learn the signs of FOMO",
    practice: "Mark chase urges in a replay",
    journal: "Log FOMO urges with intensity 1-10"
  },
  {
    day: 72,
    title: "Losses, Revenge Trading & the Cooldown",
    concept: "Losses are a normal cost of any strategy. Revenge trading is trying to win the money back immediately, usually with bigger size and worse setups. The daily loss limit and the cooldown that follows it exist to stop one bad session becoming a disaster.",
    keyPoints: [
      "A loss within plan is not a mistake",
      "Revenge trades break size and setup rules",
      "Cooldown means stop, step away, review",
      "Never increase size to recover losses"
    ],
    learn: "Learn the revenge-trading cycle",
    practice: "Write your post-loss if-then rules",
    journal: "Journal emotions after a paper loss"
  },
  {
    day: 73,
    title: "Discipline & Rule-Following",
    concept: "Discipline is doing what your plan says even when it feels wrong in the moment. It is built with habits — a pre-session checklist, if-then rules and a rule-following score after each session — rather than with willpower alone.",
    keyPoints: [
      "Discipline is a habit, not a mood",
      "Use a pre-session checklist every time",
      "If-then rules decide in advance",
      "Score rule-following after every session"
    ],
    learn: "Learn how if-then rules work",
    practice: "Score your last three paper sessions",
    journal: "Write three if-then rules"
  },
  {
    day: 74,
    title: "Playbook: My ETFs & My Strategy",
    concept: "Your Playbook is the written rulebook for how you practise. Today you fill in My Market (which ETFs, which session times, why) and My Strategy (the one strategy you have tested and how it is defined), using your own backtest and paper evidence.",
    keyPoints: [
      "Write it so a stranger could follow it",
      "List ETFs with liquidity checks",
      "Describe one tested strategy only",
      "Base every rule on your own evidence"
    ],
    learn: "Review the Playbook sections",
    practice: "Fill My Market and My Strategy",
    journal: "Note what evidence supports each rule"
  },
  {
    day: 75,
    title: "Playbook: Risk & No-Trade Rules",
    concept: "Today you write the Playbook sections that protect you: Risk Rules (risk per trade, daily loss limit, max trades, cooldown) and No-Trade Conditions (low liquidity, wide spread, choppy market, emotional state). These are the rules you keep even when everything else changes.",
    keyPoints: [
      "Risk rules use fixed numbers, not feelings",
      "Daily loss limit always triggers cooldown",
      "No-trade conditions cover market and mind",
      "Match rules to Paper risk settings"
    ],
    learn: "Review risk and no-trade concepts",
    practice: "Fill Risk and No-Trade sections",
    journal: "Write why each risk rule exists"
  },
  {
    day: 76,
    title: "Playbook: Best Setups & Common Mistakes",
    concept: "Your journal, Mistake Lab and Analytics show which setups you execute well and which mistakes keep repeating. Today you turn that evidence into the Best Setups and Common Mistakes sections, plus Psychology Rules for the emotions that drive those mistakes.",
    keyPoints: [
      "Best setups come from your own data",
      "Describe each setup with a chart example",
      "Name your top three repeated mistakes",
      "Pair each mistake with a prevention rule"
    ],
    learn: "Review Mistake Lab and Analytics",
    practice: "Fill Best Setups and Mistakes",
    journal: "Write one prevention rule per mistake"
  },
  {
    day: 77,
    title: "Weekly Review — Psychology & Playbook",
    concept: "This week covered FOMO, revenge trading, the cooldown and discipline, then you wrote your Playbook section by section. Today you read the whole Playbook end to end, check it against your Psychology journal and test it in one paper session.",
    keyPoints: [
      "Read the full Playbook in one sitting",
      "Check rules against journal evidence",
      "Test the Playbook in a paper session",
      "Fix vague rules into specific ones"
    ],
    learn: "Re-read this week's key points",
    practice: "Run a paper session by Playbook",
    journal: "Write your weekly psychology review",
    review: true
  },
  {
    day: 78,
    title: "Knowledge Review",
    concept: "The final phase starts by checking what you know. You review the foundations — how ETFs trade on the NSE, iNAV, liquidity and spread, costs, charts, VWAP and market context — and find any gaps before the Final Evaluation.",
    keyPoints: [
      "Revisit ETF structure, iNAV and spread",
      "Recalculate the cost of one trade",
      "Explain VWAP and session phases",
      "Mark weak topics to revisit"
    ],
    learn: "Review phases 1-3 key points",
    practice: "Retake earlier lesson quizzes",
    journal: "List your three weakest topics"
  },
  {
    day: 79,
    title: "Strategy & Backtest Review",
    concept: "You review the strategies you studied and the backtests you ran. The question is not which made the most simulated money but which one you understand, can define precisely and tested honestly, with costs and out-of-sample data.",
    keyPoints: [
      "Re-read each strategy's exact rules",
      "Check backtests included realistic costs",
      "Compare training vs out-of-sample results",
      "Watch for small samples and overfitting"
    ],
    learn: "Review strategy and backtest lessons",
    practice: "Re-run one backtest out-of-sample",
    journal: "Summarise what your backtests show"
  },
  {
    day: 80,
    title: "Paper-Trading Review",
    concept: "You review every paper session from Phase 10 onward: how closely you followed your plans, how execution compared with your backtest and which errors repeated. The goal is an honest picture of your execution skill in simulation.",
    keyPoints: [
      "Review all paper session reports",
      "Measure plan adherence per session",
      "Compare paper metrics with backtest",
      "Identify repeated execution errors"
    ],
    learn: "Review paper-trading lessons",
    practice: "Compile your paper-session statistics",
    journal: "Write your execution strengths and gaps"
  },
  {
    day: 81,
    title: "Risk-Compliance Review",
    concept: "Risk compliance means every trade had a stop, every size fit your risk rule, and every daily loss limit was respected with a cooldown. Today you audit your trading journal and Paper history for each of these, trade by trade.",
    keyPoints: [
      "Every trade needs a stop and a reason",
      "Check size against risk per trade",
      "Count daily loss limit breaches",
      "Look for size increases after wins/losses"
    ],
    learn: "Review risk management lessons",
    practice: "Audit trades for risk compliance",
    journal: "Record your compliance percentage"
  },
  {
    day: 82,
    title: "Psychology & Discipline Review",
    concept: "You review your Psychology journal and Mistake Lab to see how your emotional habits changed over the journey. Which triggers still cause rule breaks, and which if-then rules and cooldowns actually worked?",
    keyPoints: [
      "Review emotion logs for patterns",
      "Count FOMO and revenge entries over time",
      "Keep if-then rules that worked",
      "Rewrite rules that did not hold"
    ],
    learn: "Review psychology lessons",
    practice: "Analyse Mistake Lab trends",
    journal: "Write your top trigger and its rule"
  },
  {
    day: 83,
    title: "Final Evaluation",
    concept: "The Evaluation dashboard scores you across eight skills using your quizzes, backtests, paper sessions, journal and playbook. It is a learning checkpoint, not a licence to trade real money — it shows where to keep practising.",
    keyPoints: [
      "Eight skills, scored from your own data",
      "Score measures process, not virtual P&L",
      "Low scores point to next practice",
      "Not a signal to trade real money"
    ],
    learn: "Read how the Evaluation scores work",
    practice: "Complete the Final Evaluation",
    journal: "Write your result and next focus"
  },
  {
    day: 84,
    title: "Graduation — The Next 84 Days",
    concept: "You have finished the 84-day ETF learning journey. Graduation means a solid foundation for continued study and simulated practice, not readiness for real money. Today you plan the next 84 days of learning, replay, backtesting and paper trading around your weakest skills.",
    keyPoints: [
      "Graduation means keep learning",
      "Keep practising in simulation",
      "Plan around your weakest skills",
      "Real money is not the next step here"
    ],
    learn: "Reflect on the whole journey",
    practice: "Write your next 84-day practice plan",
    journal: "Write a letter to day-1 you"
  }
];
