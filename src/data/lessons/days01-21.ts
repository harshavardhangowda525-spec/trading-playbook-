import type { LessonContent } from './types';

// Full lesson content for days 1–21 (Foundations, Candlesticks, Support & Resistance).
// Educational / simulation content only — not financial advice. All numbers are hypothetical.

export const CONTENT: Record<number, LessonContent> = {
  1: {
    what: [
      "Day trading means buying and selling a financial instrument (such as a stock) within the same trading session. A 'position' is simply a trade you currently hold. A day trader opens a position and closes it before the market closes, so nothing is held overnight. This is different from investing, where people hold for months or years based on the long-term value of a business.",
      "Day traders try to profit from short-term price movement — moves that might last minutes or hours. Because those moves are small and noisy, nobody can know for sure what the next candle will do. Instead of predicting, skilled traders think in probabilities: 'In this situation, price has tended to do X more often than Y, so I will risk a small, fixed amount to find out.'",
      "That makes risk control the core skill. 'Risk' here means the amount of money you could lose on a trade if you are wrong. A trader who is right only 45% of the time can still do well over many trades if the losses are kept small and the wins are allowed to be larger. A trader who is right 70% of the time can still fail if a few losses are huge.",
      "It is important to be honest about the odds: most beginners who day trade with real money lose money. That is why this 84-day journey is built around education, structure and simulated practice. Nothing here is a recommendation to trade with real money, and no lesson promises profit."
    ],
    why: [
      "Understanding what day trading really is — a repetitive, rules-based process of managing risk under uncertainty — protects you from the most common beginner belief: that success comes from finding a magic prediction method. If you start with the correct mental model, every later lesson (candles, levels, setups, psychology) fits into a framework of 'how do I take small, controlled risks with a repeatable edge?'",
      "It also sets expectations. Skill-building takes months of deliberate practice in simulation. Treating the first weeks as study time, not money-making time, lets you learn without the pressure that causes bad decisions."
    ],
    how: [
      "Write a one-paragraph definition of day trading in your own words in the Trading Journal, including the phrase 'no positions held overnight'.",
      "List three differences between day trading and long-term investing (time horizon, reason for entering, how risk is managed).",
      "Open the Trading Practice Lab historical replay, pick any session and simply watch price move for 15 minutes without trading — notice how often direction changes.",
      "Write down a personal rule in your Playbook: 'All trades during this journey are simulated. No real money until I have a tested plan and a long simulated track record.'",
      "In the Psychology journal, note why you are interested in trading and what you expect — then reread it at the end of each week.",
      "Save a short note in the Knowledge Vault: 'Trading is probability plus risk control, not prediction.'"
    ],
    example: {
      title: "Hypothetical example: why risk control beats being right",
      lines: [
        "Hypothetical Trader A: wins 6 of 10 simulated trades, average win $50, average loss $150.",
        "Trader A result: (6 × $50) − (4 × $150) = $300 − $600 = −$300.",
        "Hypothetical Trader B: wins 4 of 10 simulated trades, average win $150, average loss $50.",
        "Trader B result: (4 × $150) − (6 × $50) = $600 − $300 = +$300.",
        "Lesson: B was 'wrong' more often but controlled losses, so B came out ahead in this example.",
        "These numbers are invented to show the math; real results vary and can be negative for everyone."
      ]
    },
    mistakes: [
      "Treating day trading as a way to get rich quickly, which leads to oversized positions and fast, large losses.",
      "Focusing on being right instead of on how much is lost when wrong, which lets one bad trade erase many good ones.",
      "Jumping into real money before practising in simulation, so expensive mistakes happen that could have been free lessons.",
      "Holding a losing day trade overnight 'hoping it comes back', which turns a planned short-term trade into an unplanned long-term risk.",
      "Believing any method can predict the next move with certainty, when price action only offers probabilities."
    ],
    quiz: [
      { q: "What makes a trade a day trade?", a: "The position is opened and closed within the same trading session, so nothing is held overnight." },
      { q: "Why is day trading described as a probability game?", a: "No one can know the next move for certain; traders act on situations that have tended to work more often than not and accept that individual trades will lose." },
      { q: "Can a trader who is right less than half the time still have positive results?", a: "Yes, if their average winning trade is sufficiently larger than their average losing trade — which is why risk control matters more than being right." }
    ]
  },

  2: {
    what: [
      "A stock (also called a share or equity) is a small piece of ownership in a single company. When you buy one share, you own a tiny fraction of that business. Stock prices move as buyers and sellers change their opinion of what the company is worth, and in the short term also because of news, earnings reports and overall market mood.",
      "An index is a measurement of a group (a 'basket') of stocks. It is a number, not something you own directly. Examples include the S&P 500 (about 500 large US companies), the NASDAQ-100 (100 large non-financial companies on the Nasdaq exchange) and the NIFTY 50 (50 large companies in India). When people say 'the market is up today', they usually mean a major index is up.",
      "An ETF (exchange-traded fund) is a fund that holds a collection of assets and trades on an exchange just like a stock. Many ETFs are designed to track an index, so buying one share of an index ETF gives you exposure to the whole basket in a single trade. ETFs exist for indices, sectors (like technology or banks), commodities and more.",
      "Because indices summarise the broad market, they act like the 'weather'. On a day when the main indices are falling sharply, most individual stocks are pulled down too, even ones with good news. Individual stocks can move independently, but they usually feel the influence of the overall market."
    ],
    why: [
      "Knowing the difference tells you what you are actually looking at on a chart. A single stock can jump on company-specific news, while an index or index ETF reflects the combined behaviour of many companies and tends to move more smoothly.",
      "Checking the broad market before looking at a single stock gives context. A buy setup on a stock is working against the tide if the whole market is selling off, and many traders use the index direction as a filter for which side to favour."
    ],
    how: [
      "In the Knowledge Vault, write one-line definitions for stock, index and ETF in your own words.",
      "In the Trading Practice Lab historical replay, open an index or index-tracking chart and a single stock chart for the same session if available, and compare their direction through the day.",
      "Note three moments where the stock moved with the index and one where it moved against it.",
      "Before any simulated trade from now on, add a 'market context' line to your Trading Journal: index trending up, down or sideways.",
      "Add a Playbook rule draft: 'Check the broad market direction before looking for setups on individual stocks.'",
      "Look up (in your broker's education pages or the index provider's site) which companies are the largest members of one major index, to understand what drives it."
    ],
    example: {
      title: "Hypothetical example: the market pulls a stock along",
      lines: [
        "Hypothetical index 'IDX' falls from 1,000 to 985 in the first hour (−1.5%).",
        "Hypothetical stock XYZ had positive news overnight and opened at $50.00.",
        "Despite the news, XYZ slides to $49.10 during the same hour as buyers step back market-wide.",
        "When IDX stabilises and bounces to 992, XYZ recovers to $50.40.",
        "Takeaway: XYZ's own news mattered, but the index mood dominated the first hour.",
        "All names and prices here are invented for illustration."
      ]
    },
    mistakes: [
      "Ignoring the broad market and taking buy trades in individual stocks while the major indices are falling hard, which lowers the odds of follow-through.",
      "Thinking an index can be bought directly, when in practice people use ETFs, futures or other products that track it.",
      "Assuming every ETF tracks an index perfectly, when some use leverage or have tracking differences that change their behaviour.",
      "Trading thinly traded stocks without realising how much more erratic they are than a liquid index ETF.",
      "Believing good company news guarantees a rising price, when overall market mood can outweigh it on the day."
    ],
    quiz: [
      { q: "What is the difference between a stock and an index?", a: "A stock is ownership in one company; an index is a number that measures the combined performance of a basket of stocks." },
      { q: "What is an ETF?", a: "An exchange-traded fund — a fund holding a basket of assets that trades like a stock, often designed to track an index." },
      { q: "Why check the index before trading a single stock?", a: "Most stocks are influenced by the overall market, so the index direction provides context for whether a setup is with or against the broad tide." }
    ]
  },

  3: {
    what: [
      "Every market has two sides at any moment. The bid is the highest price that a buyer is currently willing to pay. The ask (also called the offer) is the lowest price that a seller is currently willing to accept. These are live quotes that change constantly as orders arrive and are cancelled.",
      "The spread is the difference between them: spread = ask − bid. If the bid is $20.00 and the ask is $20.03, the spread is $0.03. If you buy immediately you generally pay the ask, and if you sell immediately you generally receive the bid. So a round trip (buy then sell straight away with no price change) loses the spread.",
      "That makes the spread a hidden cost on every trade, separate from any commission. It is easy to overlook because it never appears as a fee line, but it reduces every result.",
      "Liquidity describes how easily something can be bought or sold without moving the price — usually because there are many buyers and sellers and lots of shares trading. Highly liquid instruments (large-company stocks, major index ETFs) tend to have tight spreads of a cent or two. Illiquid ones (small, thinly traded stocks) can have wide spreads, and the quoted size at each price may be small."
    ],
    why: [
      "Day trades often aim for small moves, so costs matter. A $0.10 spread on a trade targeting a $0.30 move gives away a third of the potential gain before the trade even starts. Understanding the spread helps you pick instruments where your edge is not eaten by costs.",
      "It also explains why your simulated fill might look slightly 'worse' than the last traded price: you are crossing from one side of the quote to the other."
    ],
    how: [
      "Write the formula spread = ask − bid in the Knowledge Vault, with a note that buying at market usually pays the ask and selling at market usually receives the bid.",
      "In your Paper-trade/Simulation log, add a column for 'spread at entry' and record it for every simulated trade.",
      "Compare two instruments in a quote screen or the Trading Practice Lab (where quote data is available): one heavily traded and one lightly traded; note their typical spreads.",
      "Calculate spread as a percentage of your planned target: spread ÷ target distance. If it is a large fraction, consider skipping that instrument.",
      "Add a Playbook filter: 'Only practise on liquid instruments with tight spreads relative to my target.'",
      "Watch how spreads behave in the first minutes after the open versus mid-session, and journal what you see."
    ],
    example: {
      title: "Hypothetical stock XYZ: the cost of the spread",
      lines: [
        "Quote for hypothetical XYZ: bid $20.00 / ask $20.04 → spread $0.04.",
        "Buy 100 shares at market → filled at the ask, $20.04 (cost $2,004).",
        "Price does not move. Sell 100 at market → filled at the bid, $20.00 ($2,000).",
        "Result: −$4 (the spread × 100 shares), before any commission.",
        "If your target was a $0.20 move, the spread used up 20% of it.",
        "A wider hypothetical spread of $0.15 would have used up 75% — a much worse deal."
      ]
    },
    mistakes: [
      "Ignoring the spread when planning targets, so trades that looked profitable on paper barely break even.",
      "Trading illiquid stocks with wide spreads, where getting in and out costs far more than expected.",
      "Assuming the last traded price is the price you will get, when market orders fill at the bid or ask instead.",
      "Not noticing that spreads can widen around the open, close and news events, raising costs at exactly the busiest times.",
      "Only counting commissions as trading costs and forgetting that the spread is paid on every round trip."
    ],
    quiz: [
      { q: "What are the bid and the ask?", a: "The bid is the highest price buyers are currently willing to pay; the ask is the lowest price sellers are currently willing to accept." },
      { q: "If the bid is $10.00 and the ask is $10.05, what is the spread?", a: "$0.05 (ask minus bid)." },
      { q: "How does liquidity affect the spread?", a: "More liquid instruments usually have tighter spreads; illiquid ones tend to have wider spreads that raise trading costs." }
    ]
  },

  4: {
    what: [
      "An order is an instruction to your broker to buy or sell. The two basic types are market orders and limit orders. A market order says 'fill me now at the best available price'. It almost always fills quickly, but you do not control the exact price.",
      "A limit order says 'fill me only at this price or better'. A buy limit at $30.00 will only buy at $30.00 or lower; a sell limit at $31.00 will only sell at $31.00 or higher. You control the price, but the order may never fill if the market does not reach your price — or only partly fill.",
      "Slippage is the difference between the price you expected and the price you actually got. It happens most with market orders in fast-moving or thin markets, because the best price can change between the moment you click and the moment the order is filled.",
      "A stop order sits inactive until a trigger price (the stop price) is reached. Once triggered it becomes a market order (a stop-market) or a limit order (a stop-limit). A stop-loss is a stop order placed to exit a losing trade automatically — for example, a sell stop below your entry on a long trade. Stop-market orders can suffer slippage in fast moves; stop-limit orders can fail to fill if price jumps past the limit."
    ],
    why: [
      "Choosing the right order type decides whether you prioritise speed or price. Using market orders everywhere can quietly add slippage costs; using limit orders everywhere can mean missing exits when you most need them.",
      "Stop orders are the mechanical backbone of risk control. Knowing how they behave — including their weaknesses in gaps and fast markets — lets you plan realistic worst-case losses."
    ],
    how: [
      "In the Knowledge Vault, create a small table: order type, what it guarantees, what it does not guarantee.",
      "In the Trading Practice Lab historical replay, place one simulated market entry and one limit entry on the same setup; compare the fill prices.",
      "On every simulated trade, write the expected price and the actual fill in the Paper-trade/Simulation log to measure your slippage.",
      "Practise placing a stop-loss at the same time as each simulated entry so it becomes an automatic habit.",
      "Add a Playbook rule: which order type you use for entries, which for targets, which for stops — and why.",
      "Replay a fast-moving moment (such as just after the open) and observe how far price moves in a few seconds to understand where slippage comes from."
    ],
    example: {
      title: "Hypothetical stock XYZ: three order types",
      lines: [
        "Hypothetical XYZ quote: bid $30.00 / ask $30.02, moving fast.",
        "Market buy 100 shares → expected $30.02, filled at $30.05 → slippage $0.03 per share.",
        "Buy limit at $29.95 → price dips only to $29.97 and rises → order never fills (missed trade).",
        "After a fill at $30.05, sell stop placed at $29.75 → if price trades at $29.75 it becomes a market order.",
        "In a sudden drop, that stop might fill at $29.70 → slippage of $0.05 beyond the stop.",
        "Planned risk: $0.30/share; realistic risk including slippage: about $0.35/share."
      ]
    },
    mistakes: [
      "Using market orders in thin or fast markets without expecting slippage, so fills are worse than planned.",
      "Thinking a stop-loss guarantees the exact exit price, when a stop-market can fill lower in a gap or fast move.",
      "Using a stop-limit as a stop-loss without realising it may not fill at all if price jumps past the limit.",
      "Chasing a limit order higher and higher after it fails to fill, which turns a disciplined entry into an impulsive one.",
      "Entering trades without placing the protective stop at the same time, leaving the position unprotected if attention slips."
    ],
    quiz: [
      { q: "What is the main trade-off between market and limit orders?", a: "A market order prioritises getting filled but not the price; a limit order controls the price but may not be filled." },
      { q: "What is slippage?", a: "The difference between the price you expected and the price you actually received, common in fast or thin markets." },
      { q: "How does a stop order work?", a: "It stays inactive until a trigger price trades, then becomes a market (or limit) order — commonly used as a stop-loss to exit losing trades." }
    ]
  },

  5: {
    what: [
      "A candlestick chart shows price as a series of 'candles'. Each candle summarises everything that happened during one fixed period of time — one minute, five minutes, one day and so on. The period is called the timeframe.",
      "Each candle records four prices, often called OHLC: the Open (first traded price of the period), the High (highest price reached), the Low (lowest price reached) and the Close (last traded price of the period).",
      "The thick part of the candle is the body. It spans from the open to the close. The thin lines above and below the body are the wicks (also called shadows or tails). The top of the upper wick marks the high; the bottom of the lower wick marks the low.",
      "Colour shows direction. If the close is above the open, the period went up — usually drawn green or white (bullish). If the close is below the open, the period went down — usually red or black (bearish). Colours vary between platforms, so always check your chart settings."
    ],
    why: [
      "Candles are the language of the chart. Every concept that follows — levels, breakouts, momentum, rejection, setups — is read from candles. A trader who can quickly glance at a candle and know its open, high, low and close can 'read' what buyers and sellers did without needing indicators.",
      "A line chart only shows closes; a candle shows the whole fight within the period, including attempts that failed, which is far more informative."
    ],
    how: [
      "Open the Chart Practice candle trainer and complete a set of drills identifying open, high, low and close on single candles.",
      "Draw one bullish and one bearish candle by hand in your notebook and label O, H, L, C, body and wicks.",
      "In the Trading Practice Lab replay, pause on 10 random candles and say out loud whether each was bullish or bearish and which wick was longer.",
      "Check your chart colour settings so you know which colour means up and which means down.",
      "Write a Knowledge Vault entry: 'Body = open to close; wicks = high and low extremes.'",
      "Log in your Trading Journal one candle that surprised you and what you think happened inside it."
    ],
    example: {
      title: "Hypothetical 5-minute candle on stock XYZ",
      lines: [
        "Open $40.00 → price first dips to $39.80 (the low).",
        "Buyers push it up to $40.60 (the high).",
        "It settles back and the period ends at $40.40 (the close).",
        "Close $40.40 > Open $40.00 → bullish (green) candle.",
        "Body spans $40.00 to $40.40; upper wick $40.40 → $40.60; lower wick $40.00 → $39.80.",
        "All prices are hypothetical, for learning only."
      ]
    },
    mistakes: [
      "Confusing the body with the full range of the candle, which hides how far price actually travelled.",
      "Assuming green always means buyers 'won big', when a small green body with long wicks shows a contested period.",
      "Reading a candle before it has closed, when its final shape can change completely by the end of the period.",
      "Not checking platform colour settings and misreading up candles as down candles.",
      "Studying single candles in isolation without considering what came before them."
    ],
    quiz: [
      { q: "What four prices does a candle show?", a: "Open, high, low and close (OHLC) for one time period." },
      { q: "What does the body of a candle represent?", a: "The range between the open and the close." },
      { q: "How do you know if a candle is bullish?", a: "Its close is above its open; it is usually drawn green or white." }
    ]
  },

  6: {
    what: [
      "A timeframe is the length of time each candle represents. On a 1-minute chart every candle is one minute; on a daily chart every candle is one whole trading day. The underlying market is the same — only the zoom level changes.",
      "Higher timeframes (such as 1-hour or daily) smooth out noise. They show the bigger picture: the overall direction, called the trend, and the important price areas, called key levels. Lower timeframes (1-minute, 5-minute) show the detail inside those bigger candles, which helps with precise entries and exits.",
      "One daily candle contains many smaller candles. A big green daily candle may have included pullbacks on the 5-minute chart. A pattern that looks dramatic on a 1-minute chart might be a tiny wiggle on the 1-hour chart.",
      "A practical approach is to pick one primary timeframe (where you look for setups and entries) and one higher timeframe for context. Adding many more timeframes rarely adds clarity — usually it adds conflicting signals and hesitation."
    ],
    why: [
      "Timeframe confusion is one of the most common causes of beginner losses: entering on a 1-minute signal while the 1-hour chart is heading the opposite way, or panicking at normal lower-timeframe noise.",
      "Using a consistent pair of timeframes makes your analysis repeatable, which is essential for journaling and backtesting — you cannot compare trades fairly if each was judged on a different chart."
    ],
    how: [
      "In the Trading Practice Lab replay, view the same session on daily, 1-hour, 15-minute and 5-minute charts and note how the story changes.",
      "Choose a primary timeframe (many beginners start with 5-minute) and a context timeframe (such as 1-hour or daily) and write both in your Playbook.",
      "Before each simulated trade, write one sentence about the context timeframe: trending up, down or sideways, and the nearest key level.",
      "Mark the previous day's high and low from the daily chart and see how price reacts to them on your primary timeframe.",
      "In the Chart Practice candle trainer, practise mentally combining several small candles into one larger candle (the first open, the highest high, the lowest low, the last close).",
      "Journal any trade where the two timeframes disagreed and what happened."
    ],
    example: {
      title: "Hypothetical stock XYZ on two timeframes",
      lines: [
        "1-hour chart (context): hypothetical XYZ rising for three days, now near $52, with a prior high at $53.",
        "5-minute chart (primary): XYZ pulls back from $52.20 to $51.70 in the last 30 minutes.",
        "On its own, the 5-minute chart looks bearish.",
        "With context: it is a small pullback inside a larger uptrend, just below a key level at $53.",
        "Plan: watch for buyers to return on the 5-minute chart, while noting $53 as a likely area of selling.",
        "Prices are hypothetical; the pullback could also keep going — context improves odds, it does not guarantee outcomes."
      ]
    },
    mistakes: [
      "Flipping between many timeframes until one confirms what you already want to do, which is bias, not analysis.",
      "Trading lower-timeframe signals against a clear higher-timeframe trend without a specific reason.",
      "Changing timeframes in the middle of a trade and then reacting to noise that was never part of the plan.",
      "Using a very low timeframe (like seconds or 1-minute) as a beginner, where noise and speed overwhelm decision-making.",
      "Forgetting that a large candle on a higher timeframe contains many back-and-forth moves on a lower one."
    ],
    quiz: [
      { q: "What is a timeframe on a chart?", a: "The length of time each candle represents, such as 1 minute, 5 minutes or 1 day." },
      { q: "What is the main job of a higher timeframe?", a: "To give context — the overall direction and the key levels — rather than precise entries." },
      { q: "Why not use five or six timeframes at once?", a: "More timeframes usually create conflicting signals and hesitation; one primary plus one context timeframe is clearer and more repeatable." }
    ]
  },

  7: {
    what: [
      "Day trading (Day 1): opening and closing positions within the same session. It is a probability game of small, controlled risks repeated over time — not prediction — and most beginners lose money, which is why this journey uses simulation first.",
      "Stocks, indices and ETFs (Day 2): a stock is part-ownership of one company; an index measures a basket of stocks; an ETF is a fund that trades like a stock and often tracks an index. The broad market strongly influences most individual charts. Bid, ask and spread (Day 3): the bid is the best buyer price, the ask is the best seller price, and the spread (ask − bid) is a cost paid on every round trip — smaller in liquid instruments.",
      "Order types (Day 4): market orders favour speed but can slip; limit orders control price but may not fill; stop orders trigger at a set price and are the basis of a stop-loss. Candlesticks (Day 5): each candle shows open, high, low and close for one period — the body runs open to close, the wicks mark the extremes, and colour shows direction.",
      "Timeframes (Day 6): higher timeframes give context and key levels, lower timeframes give entry detail. Use one primary and one context timeframe. Today's job is to consolidate: re-read your journal, find your weakest concept, rewrite the ideas from memory and keep the best insights in the Knowledge Vault."
    ],
    why: [
      "Everything in the coming weeks builds on these foundations. If 'spread', 'stop order' or 'close' is still fuzzy, later lessons on breakouts and risk management will be harder. Review is where short-term memory turns into real understanding — the act of recalling and rewriting is what makes knowledge stick."
    ],
    how: [
      "Re-read every Trading Journal and Psychology journal entry from Days 1–6 without editing them.",
      "On a blank page, write each of the six topics from memory in two or three sentences — no notes.",
      "Compare your answers with the lessons; mark any topic where you were vague or wrong as your 'weakest concept'.",
      "Rewrite the weakest concept in your own words with a hypothetical example, and save it to the Knowledge Vault.",
      "Do a 10-minute Chart Practice candle trainer session to keep OHLC reading sharp.",
      "Update your Playbook with the rules drafted this week (simulation only, check market context, liquid instruments, stops placed with entries, fixed timeframes).",
      "Write one sentence in the Psychology journal on how your expectations of trading have changed since Day 1."
    ],
    example: {
      title: "Hypothetical self-review walkthrough",
      lines: [
        "Step 1: Recall test → I could explain candles and timeframes, but stumbled on stop-limit vs stop-market.",
        "Step 2: Weakest concept = stop orders.",
        "Step 3: Rewrite → 'A stop waits until a trigger price trades. Stop-market then fills at whatever is available; stop-limit only fills at my limit or better and might not fill.'",
        "Step 4: Hypothetical example → long XYZ at $25.00, sell stop $24.70; a fast drop could fill a stop-market at $24.65.",
        "Step 5: Saved to Knowledge Vault; Playbook updated: 'Protective stops are stop-market orders in simulation.'",
        "Step 6: Next week's focus noted: read candles more slowly."
      ]
    },
    mistakes: [
      "Skipping review days because they feel less exciting, which lets gaps in the basics carry into harder topics.",
      "Re-reading lessons passively instead of recalling from memory first, which creates an illusion of understanding.",
      "Only reviewing strong topics because it feels good, while avoiding the weakest one that most needs work.",
      "Editing old journal entries to look better, which destroys their value as an honest record of your learning.",
      "Collecting notes without rewriting them in your own words, so they never become usable knowledge."
    ],
    quiz: [
      { q: "Why is the spread considered a cost?", a: "Buying at market usually pays the ask and selling at market usually receives the bid, so an immediate round trip loses the spread." },
      { q: "Which order type controls price but may not fill?", a: "A limit order." },
      { q: "What is the recommended timeframe setup from this week?", a: "One primary timeframe for entries plus one higher timeframe for context." }
    ]
  },

  8: {
    what: [
      "The open is the first traded price of a candle's period. The close is the last traded price of that period. On a daily chart, the open is the first trade of the session and the close is the last trade before the market closes; on a 5-minute chart they are the first and last trades of each five-minute window.",
      "The close is generally treated as the most important price of the candle. While the period is live, price can swing anywhere, but the close is the 'final verdict' — where buyers and sellers ended up agreeing when time ran out. Many traders only act on information from closed candles for this reason.",
      "Comparing the close with the open gives the direction of the candle. Close above open = bullish period (buyers made net progress). Close below open = bearish period (sellers made net progress). Close equal or nearly equal to open = indecision, often called a doji.",
      "Where a candle closes relative to an important price area matters a lot. A candle that pokes above a level but closes back below it tells a very different story from one that closes clearly above it."
    ],
    why: [
      "Using closes rather than live, unfinished movement filters out a lot of noise and false signals. It forces patience: you wait for the market to 'confirm' before acting. This habit becomes essential later for judging breakouts, breakdowns and false breakouts."
    ],
    how: [
      "In the Chart Practice candle trainer, run a drill identifying only open and close on 20 candles, ignoring the wicks.",
      "In the Trading Practice Lab replay, pick a level (such as a previous high) and step candle by candle; note each close relative to that level.",
      "Watch a candle form live in replay and write down how its colour changed during the period before it closed.",
      "Add a Playbook rule draft: 'Signals are judged on closed candles of my primary timeframe.'",
      "In your Trading Journal, record one example where the close told a different story from the intrabar movement.",
      "Save to the Knowledge Vault: 'Close vs open = direction; close vs level = verdict.'"
    ],
    example: {
      title: "Hypothetical stock XYZ: same move, different closes",
      lines: [
        "Hypothetical key level: $60.00.",
        "Candle A: opens $59.70, trades up to $60.30, closes $59.80 → bullish (close > open) but closed back below $60.",
        "Candle B: opens $59.70, trades up to $60.30, closes $60.25 → bullish and closed above $60.",
        "Both touched $60.30, but only B shows buyers holding price above the level at the end of the period.",
        "Waiting for the close avoided treating Candle A as a successful push through $60.",
        "Numbers are hypothetical; even B's close is evidence, not a guarantee."
      ]
    },
    mistakes: [
      "Acting on a candle before it closes, then watching it reverse and close with the opposite meaning.",
      "Treating a green candle as strong even when it closed far below its high, which hides that sellers pushed back.",
      "Ignoring where the close sits relative to key levels and only looking at colour.",
      "Assuming the daily open always equals the previous close, when gaps between sessions are common.",
      "Constantly watching live ticks inside a candle, which increases emotional, impulsive decisions."
    ],
    quiz: [
      { q: "What is the close of a candle?", a: "The last traded price of that candle's time period." },
      { q: "Why is the close often considered the most important price?", a: "It is the final verdict of the period — where price settled when time ran out — so it filters out intrabar noise." },
      { q: "What does a close below the open tell you?", a: "Sellers made net progress during the period, so it is a bearish candle." }
    ]
  },

  9: {
    what: [
      "The high is the highest price traded during a candle's period, and the low is the lowest. Together they form the candle's range (range = high − low). They are shown by the tips of the wicks — or by the body edges if there is no wick.",
      "The high shows the furthest buyers were able to push price before running out of strength. The low shows the furthest sellers were able to push price. If a candle reaches a high and then closes well below it, buyers tried to go higher and failed. If it reaches a low and then closes well above it, sellers tried and failed.",
      "Those failed attempts are valuable information. A price that was reached and quickly rejected is a price where the other side showed up. Traders often watch these extremes to see whether they are revisited and what happens there next time.",
      "When you connect highs and lows across many candles, you get market structure. Higher highs and higher lows describe an uptrend; lower highs and lower lows describe a downtrend; roughly equal highs and lows describe a range (sideways market)."
    ],
    why: [
      "Highs and lows are the raw material of almost every technical concept: support and resistance, trends, breakouts and stop placement. A common practice is to place a stop-loss just beyond a recent high or low, because if price moves past that extreme, the idea behind the trade is likely wrong."
    ],
    how: [
      "In the Chart Practice candle trainer, drill identifying the high, low and range of single candles.",
      "In the Trading Practice Lab replay, mark the session's high and low as they form and note when each was set.",
      "Label the last five swing highs and swing lows (turning points) on your primary timeframe and decide whether structure is up, down or sideways.",
      "Find two candles where the high or low was clearly rejected (closed far away from it) and journal what happened next.",
      "Mark the previous day's high and low in replay and watch how price reacts when it reaches them.",
      "Add to the Knowledge Vault: 'Higher highs + higher lows = uptrend; lower highs + lower lows = downtrend.'"
    ],
    example: {
      title: "Hypothetical stock XYZ: highs and lows build structure",
      lines: [
        "Hypothetical swing lows: $10.00 → $10.40 → $10.70 (each higher).",
        "Hypothetical swing highs: $10.80 → $11.10 → $11.35 (each higher).",
        "Higher highs + higher lows → uptrend structure.",
        "Next pullback falls to $10.55, below the last swing low of $10.70 → first lower low.",
        "Structure warning: the uptrend may be weakening (not certain — it is one data point).",
        "All prices hypothetical."
      ]
    },
    mistakes: [
      "Looking only at closes and ignoring highs and lows, which hides where buyers or sellers failed.",
      "Labelling every small wiggle as a swing high or low, which makes structure look random and confusing.",
      "Placing stops exactly at an obvious high or low instead of with some room beyond it, where normal noise can trigger them.",
      "Declaring a trend change from a single lower low or higher high without further confirmation.",
      "Forgetting that the previous day's high and low are levels many other traders are watching."
    ],
    quiz: [
      { q: "What does a candle's high represent?", a: "The furthest buyers were able to push price during that period." },
      { q: "What do higher highs and higher lows indicate?", a: "An uptrend structure." },
      { q: "Why do failed extremes matter?", a: "A high or low that was reached and rejected shows where the other side stepped in, which can matter when price returns there." }
    ]
  },

  10: {
    what: [
      "A candle has two parts: the body (open to close) and the wicks (from the body to the high and low). The relationship between them tells the story of the period.",
      "A large body with small wicks means one side controlled most of the period — price moved steadily in one direction and closed near the extreme. A large green body means buyers were in control; a large red body means sellers were.",
      "A long wick means price travelled to an extreme but was pushed back before the close. A long upper wick shows prices higher up were rejected (sellers stepped in); a long lower wick shows prices lower down were rejected (buyers stepped in).",
      "A small body with wicks on both sides means price moved up and down but ended near where it started — indecision. Neither side won the period. A very small body with wicks is often called a doji or spinning top. The body-to-wick ratio (how big the body is compared to the full range) is a quick way to summarise control versus rejection."
    ],
    why: [
      "Reading body and wicks lets you understand who was in control without any indicators. It helps you judge whether a move is strong (big bodies), stalling (shrinking bodies, growing wicks) or being rejected (long wicks at a level). This becomes the basis of momentum and rejection candles later in the week."
    ],
    how: [
      "In the Chart Practice candle trainer, classify 20 candles as 'control', 'rejection' or 'indecision'.",
      "Calculate body-to-range ratio for five candles: |close − open| ÷ (high − low). Above roughly 0.7 suggests control; below roughly 0.3 suggests indecision or rejection (these cut-offs are rough guides, not rules).",
      "In the Trading Practice Lab replay, find a move where bodies shrank and wicks grew before a reversal and journal it.",
      "Note where long wicks appear — at prior highs/lows, round numbers or nowhere special.",
      "Add a Knowledge Vault entry with a small sketch of each type: big body, long upper wick, long lower wick, doji.",
      "Write in your Trading Journal one candle you misread today and what you now think it meant."
    ],
    example: {
      title: "Hypothetical candles on stock XYZ",
      lines: [
        "Candle 1: O $15.00 H $15.85 L $14.95 C $15.80 → body $0.80 of $0.90 range (~0.89) → buyers in control.",
        "Candle 2: O $15.80 H $16.40 L $15.75 C $15.90 → upper wick $0.50 → prices near $16.40 rejected.",
        "Candle 3: O $15.90 H $16.10 L $15.70 C $15.92 → body $0.02 of $0.40 range → indecision.",
        "Story: strong buying, then rejection higher up, then neither side in control.",
        "This sequence can precede a pause or a reversal — but it can also resolve upward. It is a clue, not a certainty.",
        "All prices are hypothetical."
      ]
    },
    mistakes: [
      "Judging candles only by colour, which ignores whether the body was strong or the wicks showed rejection.",
      "Treating every long wick as a reversal signal, even when it appears in the middle of a range with no meaningful level nearby.",
      "Comparing candle sizes across different timeframes or instruments as if they were equivalent.",
      "Reading a single indecision candle as a prediction rather than as a pause that could resolve either way.",
      "Forgetting that wicks on a candle that has not closed yet can still disappear or grow."
    ],
    quiz: [
      { q: "What does a large body with small wicks suggest?", a: "One side controlled most of the period and price closed near the extreme." },
      { q: "What does a long upper wick indicate?", a: "Price traded higher but was pushed back down before the close — those higher prices were rejected." },
      { q: "What does a small body with wicks on both sides show?", a: "Indecision — price moved both ways but ended close to where it opened." }
    ]
  },

  11: {
    what: [
      "A bullish candle is one that closes above its open: buyers made net progress during the period. On most charts it is drawn green or white.",
      "Not all bullish candles are equally strong. A strong bullish candle closes near its high and has a small upper wick, meaning there was little selling pressure at the end of the period — buyers held their gains into the close. A bullish candle with a long upper wick closed well below its high, so sellers pushed back even though the candle is still green.",
      "A small lower wick on a strong bullish candle means the price barely dipped below the open; a long lower wick means sellers pushed price down first and buyers then recovered it.",
      "Context — where the candle appears — gives it meaning. A strong bullish candle at a support area (a price zone where declines have stopped before) suggests buyers are defending that area. The same candle in the middle of nowhere, far from any level, carries much less information."
    ],
    why: [
      "Bullish candles are the building blocks of buy setups. Learning to separate strong bullish candles from weak ones, and meaningful locations from random ones, helps you avoid buying into exhaustion and focus on evidence of genuine buying interest. Remember: even a strong candle at a good location only improves the odds; it does not guarantee the next candle goes up."
    ],
    how: [
      "In the Chart Practice candle trainer, sort 20 green candles into 'strong' (closes near the high) and 'weak' (long upper wick).",
      "Use a simple test: where did the close land within the range? Close in the top quarter of the range = strong; below the middle = weak.",
      "In the Trading Practice Lab replay, find three strong bullish candles at prior lows or support and three in the middle of a range; journal what followed each.",
      "In your Backtesting journal, start a tally: strong bullish candle at support — next 3 candles up, down or sideways.",
      "Draft a Playbook note: 'A bullish candle only counts as a signal if it appears at a level I marked beforehand.'",
      "Save your best example screenshots or notes to the Knowledge Vault."
    ],
    example: {
      title: "Hypothetical stock XYZ: strong vs weak bullish candles",
      lines: [
        "Hypothetical support zone: $24.80–$25.00 (price bounced there twice earlier).",
        "Candle A at support: O $24.90 H $25.45 L $24.85 C $25.40 → close in top 10% of range → strong.",
        "Candle B mid-range: O $25.60 H $26.10 L $25.55 C $25.70 → long upper wick → weak, sellers pushed back.",
        "Candle A combines strength + location → more meaningful evidence of buyers.",
        "Candle B is green but tells you sellers are active higher up.",
        "All values hypothetical; outcomes after either candle are not certain."
      ]
    },
    mistakes: [
      "Treating every green candle as a buy signal regardless of strength or location.",
      "Ignoring a long upper wick on a green candle, which can signal selling pressure despite the colour.",
      "Buying after several large bullish candles in a row far from support, which often means chasing an extended move.",
      "Forgetting to check the broader market and higher timeframe, where a bullish candle may be fighting a downtrend.",
      "Expecting a strong bullish candle to always be followed by more upside, when it is only a probability."
    ],
    quiz: [
      { q: "What defines a bullish candle?", a: "Its close is above its open." },
      { q: "What does a small upper wick on a bullish candle suggest?", a: "Little selling pressure at the end of the period — it closed near its high." },
      { q: "Why does location matter for a bullish candle?", a: "At support it suggests buyers defending a known area; in the middle of nowhere it carries much less meaning." }
    ]
  },

  12: {
    what: [
      "A bearish candle is one that closes below its open: sellers made net progress during the period. On most charts it is drawn red or black.",
      "A strong bearish candle closes near its low and has a small lower wick, meaning there was little buying pressure at the end of the period — sellers kept control into the close. A bearish candle with a long lower wick closed well above its low, showing buyers pushed back even though the candle is red.",
      "Bearish candles are the mirror image of bullish candles: everything you learned about strength (where the close sits in the range) and wicks applies in reverse.",
      "Location again gives the candle meaning. Resistance is a price area where rallies have stalled before. A strong bearish candle at resistance is meaningful evidence that sellers are active there. A bearish candle far from any level tells you much less."
    ],
    why: [
      "Recognising strong bearish candles helps in two ways: it highlights possible short (sell-first) setups in simulation, and, just as importantly, it warns you not to buy into strong selling. Many beginners only look for reasons to buy; reading bearish strength keeps you out of trades that are fighting sellers."
    ],
    how: [
      "In the Chart Practice candle trainer, sort 20 red candles into 'strong' (closes near the low) and 'weak' (long lower wick).",
      "Apply the close-location test: close in the bottom quarter of the range = strong bearish; above the middle = weak.",
      "In the Trading Practice Lab replay, find three strong bearish candles at prior highs or resistance and journal what followed.",
      "Add a column to your Backtesting journal: strong bearish candle at resistance — next 3 candles up, down or sideways.",
      "Before any simulated buy, check whether the last few candles show strong bearish closes; if so, note it in the Trading Journal as a caution.",
      "Write a Knowledge Vault entry comparing a strong bullish and a strong bearish candle side by side."
    ],
    example: {
      title: "Hypothetical stock XYZ: bearish candle at resistance",
      lines: [
        "Hypothetical resistance zone: $48.00–$48.20 (rallies stalled there twice).",
        "Price rallies into $48.10.",
        "Candle: O $48.05 H $48.15 L $47.40 C $47.45 → close in bottom 7% of range → strong bearish.",
        "Small lower wick ($0.05) → little buying pressure into the close.",
        "Reading: sellers active at a known level; a simulated buyer should be cautious here.",
        "Values hypothetical; price could still recover — this improves odds, it is not a certainty."
      ]
    },
    mistakes: [
      "Treating every red candle as a reason to sell, regardless of strength or location.",
      "Missing a long lower wick on a red candle, which can show buyers stepping in.",
      "Only studying bullish setups and ignoring bearish evidence that should keep you out of buys.",
      "Selling after a long series of large red candles far from resistance, which often means chasing an exhausted move.",
      "Assuming short selling works exactly like buying, without learning its extra risks — practise only in simulation."
    ],
    quiz: [
      { q: "What defines a bearish candle?", a: "Its close is below its open." },
      { q: "What makes a bearish candle strong?", a: "It closes near its low with a small lower wick, showing little buying pressure into the close." },
      { q: "Why is a bearish candle at resistance meaningful?", a: "It shows sellers active at a price area where rallies have already stalled, adding evidence of seller interest." }
    ]
  },

  13: {
    what: [
      "Momentum candles have large bodies and small wicks. They show urgency: one side was so dominant that price moved steadily and closed near the extreme. Momentum candles often appear at the start of new moves or when price pushes through an important level.",
      "Rejection candles have a long wick into a price level and a relatively small body. They show that a price was tested and refused. Common names include the pin bar (any candle with one very long wick), the hammer (long lower wick, small body near the top, appearing after a decline) and the shooting star (long upper wick, small body near the bottom, appearing after a rise).",
      "A hammer suggests sellers pushed price lower but buyers rejected those prices and pushed it back up. A shooting star suggests buyers pushed price higher but sellers rejected those prices. In both cases, the length of the wick and the level it touched are what matter most.",
      "Neither type is a guaranteed signal. Momentum can fade right after a big candle, and rejection candles can be followed by price breaking through anyway. They are pieces of evidence that are most useful when they appear at a meaningful level and agree with the broader context."
    ],
    why: [
      "These two candle types sum up the main questions a trader asks at any level: is someone pushing urgently through it (momentum), or is it being refused (rejection)? Being able to tell them apart quickly is central to breakouts, retests and reversals later in the program."
    ],
    how: [
      "In the Chart Practice candle trainer, run a drill labelling candles as momentum, rejection or neither.",
      "Define your own simple criteria in the Playbook, for example: momentum = body at least 70% of range; rejection = wick at least twice the body length, touching a marked level.",
      "In the Trading Practice Lab replay, find five hammers or shooting stars at levels and five in random spots; compare what happened next.",
      "Record outcomes in the Backtesting journal so you can see the actual hit rate rather than assuming.",
      "Watch for momentum candles that break through levels and journal whether the next candles continued or reversed.",
      "Save annotated examples of each type to the Knowledge Vault."
    ],
    example: {
      title: "Hypothetical stock XYZ: rejection then momentum",
      lines: [
        "Hypothetical support: $32.00, after a decline from $33.50.",
        "Candle 1 (hammer): O $32.30 H $32.40 L $31.85 C $32.35 → lower wick $0.45 vs body $0.05 → prices below $32 rejected.",
        "Candle 2 (momentum): O $32.35 H $32.95 L $32.30 C $32.90 → body $0.55 of $0.65 range → urgent buying.",
        "Reading: rejection showed refusal at support; momentum showed buyers acting with urgency.",
        "A simulated plan might note a stop below $31.85 (the hammer's low), where the idea would be wrong.",
        "Hypothetical values; the same pattern can fail, which is why the stop exists."
      ]
    },
    mistakes: [
      "Calling any candle with a wick a rejection candle, even when the wick is short or not at a level.",
      "Buying immediately after a huge momentum candle far from any level, often near the end of the move.",
      "Ignoring the trend context, such as treating a hammer in a strong downtrend with no support as a reliable reversal.",
      "Treating pattern names as signals on their own instead of combining them with location and confirmation.",
      "Not tracking outcomes, so beliefs about how well a pattern works are based on memory rather than data."
    ],
    quiz: [
      { q: "What does a momentum candle look like and show?", a: "A large body with small wicks; it shows urgency and control by one side." },
      { q: "What is a shooting star?", a: "A candle with a long upper wick and a small body near the bottom, after a rise, showing higher prices were rejected." },
      { q: "Are rejection candles guaranteed reversal signals?", a: "No — they are evidence that improves odds at a meaningful level, but price can still break through." }
    ]
  },

  14: {
    what: [
      "Open and close (Day 8): the open is the first price of the period and the close is the last. The close is the period's 'final verdict', and close versus open defines direction. Where a candle closes relative to a key level matters more than where it traded during the period. High and low (Day 9): the extremes show how far buyers and sellers pushed — and where they failed. Connecting highs and lows creates market structure: higher highs and higher lows (uptrend), lower highs and lower lows (downtrend) or flat (range).",
      "Body and wicks (Day 10): a big body shows control, a long wick shows rejection of that price, and a small body with wicks on both sides shows indecision. The body-to-range ratio summarises the story. Bullish candles (Day 11): close above open; strong ones close near the high with small upper wicks. Location such as support gives them meaning.",
      "Bearish candles (Day 12): close below open; strong ones close near the low with small lower wicks, and are most meaningful at resistance. Momentum and rejection candles (Day 13): momentum candles (big body, small wicks) show urgency; rejection candles (long wick into a level — pin bars, hammers, shooting stars) show refusal.",
      "The common thread: candles describe a fight between buyers and sellers, and they are probabilities, not certainties. Location and context turn a candle from noise into evidence. Today, consolidate this week by re-reading your journal, finding your weakest concept and rewriting it from memory."
    ],
    why: [
      "Candle reading is the core visual skill for every later lesson. Support and resistance, breakouts and retests all depend on quickly reading closes, wicks and bodies at levels. Locking it in now through deliberate review makes next week's material far easier to absorb."
    ],
    how: [
      "Re-read your Trading Journal, Backtesting journal and Psychology journal entries for Days 8–13.",
      "Without notes, describe from memory: open/close, high/low, body/wicks, strong bullish, strong bearish, momentum and rejection.",
      "Check against the lessons and choose your weakest concept.",
      "Rewrite it in your own words with a hypothetical example and save it to the Knowledge Vault.",
      "Do a 20-candle mixed session in the Chart Practice candle trainer and record your accuracy.",
      "Review your Backtesting journal tallies: how often did candles at levels actually lead to follow-through? Note the sample size.",
      "Update your Playbook candle definitions so they are precise and repeatable."
    ],
    example: {
      title: "Hypothetical self-review walkthrough",
      lines: [
        "Recall test: confident on open/close and bullish/bearish; unsure how to tell a hammer from a random long-wick candle.",
        "Weakest concept = rejection candles.",
        "Rewrite: 'A rejection candle needs a long wick INTO a level I marked beforehand, and a small body. Location is part of the definition.'",
        "Hypothetical example: support at $18.00; candle O $18.20 H $18.25 L $17.80 C $18.22 → valid hammer at support.",
        "Trainer score: 16/20 → misread two small-bodied candles as momentum.",
        "Backtesting tally (hypothetical, small sample of 12): 7 continued, 5 failed → not enough data to conclude anything yet.",
        "Saved to Knowledge Vault; Playbook rejection definition updated."
      ]
    },
    mistakes: [
      "Memorising candle pattern names without understanding the buyer-seller story behind them.",
      "Drawing conclusions from very small backtest samples, which can make a pattern look much better or worse than it is.",
      "Reviewing only by re-reading instead of recalling from memory and testing yourself.",
      "Ignoring the location requirement and treating candle shapes as signals anywhere on the chart.",
      "Skipping the review because candles feel 'easy', leaving subtle misreadings uncorrected."
    ],
    quiz: [
      { q: "Why is the close considered the most important price of a candle?", a: "It is the final agreed price of the period, so it reflects the outcome rather than temporary moves." },
      { q: "What is the difference between a momentum candle and a rejection candle?", a: "A momentum candle has a large body and small wicks (urgency); a rejection candle has a long wick into a level and a small body (refusal)." },
      { q: "What turns a candle shape into useful evidence?", a: "Its location and context — such as appearing at a marked support or resistance level in line with the broader direction." }
    ]
  },

  15: {
    what: [
      "Support is a price area where buying interest has repeatedly stopped declines. When price falls into this area, buyers tend to step in (or sellers stop selling), and the decline pauses or reverses. On a chart it appears as a zone where several lows cluster.",
      "Support is best drawn as a zone, not a razor-thin line. Price rarely turns at exactly the same cent; it might bounce at $19.95 one time and $20.08 the next. A zone (for example $19.95–$20.10) reflects that reality and stops you from treating small overshoots as failures.",
      "The more clearly and more often price has reacted at an area, the more traders are likely watching it — and the more significant it becomes. Sharp, obvious bounces count for more than vague, slow drifts.",
      "Recent levels usually matter more than very old ones, because the traders who acted there are more likely to still care. On intraday charts, common support areas include the previous day's low, the current session's low and recent swing lows. Support is an area of probability, not a floor — it can and does break."
    ],
    why: [
      "Support gives you a reference point for decisions. It tells you where a buy idea might have better odds and, just as importantly, where your idea would be wrong (a decisive move below the zone). That makes it a natural place to plan entries and stop-losses in simulation."
    ],
    how: [
      "In the Trading Practice Lab replay, before pressing play, mark the previous day's low and the two most obvious recent swing lows on your context timeframe.",
      "Draw each as a zone covering the cluster of lows and their nearby candle bodies, not a single line.",
      "Rate each zone: number of clear reactions, how sharp they were, how recent.",
      "Press play and record in your Trading Journal how price behaves on each visit: bounce, pause or break.",
      "Look for the candle types from last week (hammers, strong bullish closes) appearing in the zone.",
      "Add a Playbook step: 'Mark support zones before the session; do not draw new lines mid-trade to justify a position.'"
    ],
    example: {
      title: "Hypothetical stock XYZ: marking a support zone",
      lines: [
        "Hypothetical lows over two days: $20.05, $19.97, $20.10 — each followed by a bounce of $0.40 or more.",
        "Support zone drawn: $19.95–$20.10.",
        "Today price falls into $20.02 and prints a hammer that closes at $20.25.",
        "Reading: buyers defended the zone again — evidence, not proof.",
        "Invalidation: a decisive close below $19.95 would suggest the support has broken.",
        "All prices hypothetical."
      ]
    },
    mistakes: [
      "Drawing support as an exact line and treating a tiny overshoot as a failure.",
      "Marking too many levels until the chart is covered in lines and every price looks like support.",
      "Assuming support will always hold, when every level eventually breaks.",
      "Using very old levels that few traders still watch while ignoring recent obvious ones.",
      "Buying the instant price touches support without waiting for evidence, such as a rejection or strong close."
    ],
    quiz: [
      { q: "What is support?", a: "A price area where buying interest has repeatedly stopped declines." },
      { q: "Why draw support as a zone instead of a line?", a: "Price rarely reverses at the exact same price, so a zone captures the real area of interest and avoids false 'failures'." },
      { q: "What makes a support level more significant?", a: "Multiple clear, sharp reactions there — especially recent ones — because more traders are likely watching it." }
    ]
  },

  16: {
    what: [
      "Resistance is the opposite of support: a price area where selling interest has repeatedly stopped advances. When price rises into the area, sellers tend to step in (or buyers stop buying), and the rally pauses or reverses. Like support, it is best drawn as a zone.",
      "Role reversal is a key idea: once support breaks, it often acts as resistance later, and once resistance breaks, it often acts as support. The reasoning is that traders who bought at old support and are now losing may sell when price returns to their entry, adding selling pressure at the same area.",
      "Round numbers (such as $50.00 or $100.00) often act as levels, because many people place orders at them. They are not magic, but they are psychologically visible.",
      "For day traders, the previous day's high and low are especially important reference levels, along with the current session's high and the opening price. These are widely watched, so reactions there are common — though never guaranteed."
    ],
    why: [
      "Resistance tells a buyer where gains may stall — a natural area to plan a target — and tells a seller where a short idea may have better odds. Knowing role reversal means a level does not disappear once broken; it changes jobs, which sets up the retest concept later this week."
    ],
    how: [
      "Before each replay session in the Trading Practice Lab, mark the previous day's high, previous day's low and any nearby round number.",
      "Mark recent swing highs where rallies stalled and draw them as zones.",
      "Find one example of role reversal (old support acting as resistance) in replay and journal it with a description.",
      "In your Backtesting journal, track how often price reacts (pauses or reverses) at the previous day's high on first touch.",
      "When planning a simulated buy, write the nearest resistance as a potential target or caution area.",
      "Save a Knowledge Vault note: 'Broken support → resistance; broken resistance → support.'"
    ],
    example: {
      title: "Hypothetical stock XYZ: role reversal",
      lines: [
        "Hypothetical support zone: $44.80–$45.00, held three times yesterday.",
        "This morning price closes decisively below it at $44.40 → support broken.",
        "Later, price rallies back up to $44.90.",
        "Sellers appear: a shooting star at $44.95 closes at $44.70.",
        "Old support is now acting as resistance — role reversal (this time).",
        "Hypothetical values; role reversal is a tendency, not a rule."
      ]
    },
    mistakes: [
      "Buying right into a well-defined resistance zone without accounting for likely selling there.",
      "Deleting levels once they break, missing the role reversal that often follows.",
      "Treating round numbers as guaranteed turning points rather than one input among several.",
      "Ignoring the previous day's high and low, which many intraday traders watch closely.",
      "Setting targets far beyond nearby resistance and then being frustrated when price stalls there."
    ],
    quiz: [
      { q: "What is resistance?", a: "A price area where selling interest has repeatedly stopped advances." },
      { q: "What is role reversal?", a: "When a broken support level later acts as resistance, or a broken resistance level later acts as support." },
      { q: "Name two levels many day traders watch.", a: "The previous day's high and low (round numbers and the session open are also common)." }
    ]
  },

  17: {
    what: [
      "A breakout happens when price moves decisively above a resistance zone. 'Decisively' is the key word: the strongest evidence is a candle that closes beyond the level on your primary timeframe, not just a wick that pokes through and falls back.",
      "Quality breakouts often share three features. First, a momentum candle: a large body closing near its high, showing urgency. Second, rising volume: volume is the number of shares traded during the period; higher volume than recent candles suggests broad participation. Third, follow-through: the next candles continue in the breakout direction rather than stalling.",
      "A wick through a level alone is not a breakout. It shows price visited above the level but could not stay there — closer to a rejection than a breakout.",
      "Even quality breakouts fail sometimes. They are a probability setup: the features above improve the odds but do not guarantee the move. That is why a breakout plan always includes a point where the idea is wrong (for example, a close back inside the old range)."
    ],
    why: [
      "Breakouts are among the most common day-trading setups because they can start new moves. But they are also where many beginners get trapped by chasing every poke through a level. Learning to require a close, momentum, volume and follow-through filters out many weak breakouts."
    ],
    how: [
      "Mark a clear resistance zone in the Trading Practice Lab replay before the move happens.",
      "When price reaches it, wait for the candle to close; note whether it closed beyond the zone or only wicked through.",
      "Check the breakout candle's body-to-range ratio and compare its volume with the previous 10 candles.",
      "Watch the next two or three candles and record whether there was follow-through.",
      "Log each breakout in the Backtesting journal with a quality score (close, momentum, volume, follow-through) and the outcome.",
      "In the Strategy Lab, write a draft breakout rule including the entry trigger and invalidation, and test it only in simulation."
    ],
    example: {
      title: "Hypothetical stock XYZ: grading a breakout",
      lines: [
        "Hypothetical resistance zone: $36.80–$37.00 (three prior rejections).",
        "Attempt 1: wick to $37.15, close $36.90 → no breakout (wick only).",
        "Attempt 2: O $36.95 H $37.45 L $36.92 C $37.40 → closes above the zone, body ~85% of range.",
        "Volume on attempt 2: about double the recent average → broad participation.",
        "Next two candles close $37.55 and $37.70 → follow-through.",
        "Invalidation in a simulated plan: a close back below $36.80.",
        "All values hypothetical."
      ]
    },
    mistakes: [
      "Entering on a wick through resistance before the candle closes, then watching it close back below.",
      "Chasing a breakout long after it happened, buying far above the level with poor risk-to-reward.",
      "Ignoring volume, so low-participation breakouts are treated the same as strong ones.",
      "Having no invalidation point, so a failed breakout becomes a large loss.",
      "Trading breakouts into a nearby higher-timeframe resistance level that limits how far price can travel."
    ],
    quiz: [
      { q: "What confirms a breakout better than a wick?", a: "A candle that closes decisively beyond the level." },
      { q: "Name three features of a quality breakout.", a: "A momentum candle, rising volume and follow-through in the next candles." },
      { q: "Do quality breakouts always work?", a: "No — they improve the odds, but some fail, which is why every breakout plan needs an invalidation point." }
    ]
  },

  18: {
    what: [
      "A breakdown is the mirror image of a breakout: price closes decisively below a support zone. It suggests sellers have overwhelmed the buyers who were defending that area.",
      "The same quality checks apply in reverse. Look for bearish momentum (a large red body closing near its low), higher volume than recent candles, and follow-through as the next candles continue lower. A single lower wick that dips below support and recovers is not a breakdown — it is closer to a rejection of lower prices.",
      "Watch for an immediate reclaim. A reclaim is when price quickly moves back above the broken level and closes there. If that happens right after a breakdown, it is a warning that the breakdown may be failing and sellers could be trapped.",
      "Breakdowns can be fast, because buyers who were relying on support may rush to exit at the same time. That speed can also mean more slippage. As always, the features improve odds; they do not guarantee continuation."
    ],
    why: [
      "Even if you mostly practise buy setups, breakdowns matter: a decisive close below support is often the clearest signal that a long idea is wrong and should be exited. For simulated short trades, breakdowns are the equivalent of breakouts. Either way, recognising quality versus failure protects you."
    ],
    how: [
      "Mark a clear support zone before the session in the Trading Practice Lab replay.",
      "When price reaches it, wait for the close and note whether it closed below the zone or only wicked.",
      "Check for bearish momentum (close near the low) and compare volume to the previous 10 candles.",
      "Watch the next few candles for follow-through or a reclaim back above the zone.",
      "Log each breakdown in the Backtesting journal with a quality score and outcome, including whether a reclaim happened.",
      "Add to your Playbook: 'If I am long and price closes decisively below my support zone, the trade idea is invalid.'"
    ],
    example: {
      title: "Hypothetical stock XYZ: breakdown and reclaim watch",
      lines: [
        "Hypothetical support zone: $27.00–$27.15.",
        "Candle: O $27.10 H $27.12 L $26.60 C $26.65 → closes below zone, close near the low → bearish momentum.",
        "Volume: roughly 1.8× the recent average.",
        "Scenario A: next candles close $26.50 and $26.35 → follow-through, breakdown holding.",
        "Scenario B: next candle closes $27.20, back above the zone → reclaim, breakdown failing.",
        "A simulated short plan would treat Scenario B's reclaim as invalidation.",
        "All values hypothetical."
      ]
    },
    mistakes: [
      "Treating a quick wick below support as a breakdown and selling before the candle closes.",
      "Holding a long position after a decisive close below support because you hope it will come back.",
      "Ignoring a fast reclaim, which often signals a failed breakdown and trapped sellers.",
      "Selling into a breakdown that is already far below the level, leaving no sensible place for a stop.",
      "Forgetting that slippage tends to be larger in fast breakdowns, so planned losses can be exceeded."
    ],
    quiz: [
      { q: "What is a breakdown?", a: "A decisive close below a support zone." },
      { q: "What confirms a quality breakdown?", a: "Bearish momentum, higher volume and follow-through lower in the next candles." },
      { q: "What is a reclaim and why does it matter?", a: "Price quickly closing back above the broken level; it warns that the breakdown may be failing." }
    ]
  },

  19: {
    what: [
      "A retest happens when, after breaking a level, price comes back to test that level from the other side. After a breakout above resistance, price may pull back down to the old resistance zone; after a breakdown below support, price may rally back up to the old support zone.",
      "This is role reversal in action. After a breakout, the old resistance should now act as support if the breakout is genuine. A successful retest is when price touches or approaches the level, it holds (candles close on the correct side), and price moves away again in the breakout direction.",
      "Retests are a common, more patient entry location. Instead of chasing the breakout candle, a trader waits for price to return to the level, where the distance to a logical stop (just beyond the level) is smaller. The trade-off is that not every breakout retests — some simply run away and you miss them.",
      "A failed retest is a warning sign. If price returns to the broken level and closes back through it (back inside the old range), the breakout is likely failing. Retests do not always happen and do not always hold; they are probabilities."
    ],
    why: [
      "Waiting for a retest builds patience and often improves risk-to-reward, because entries happen closer to the level that defines when the idea is wrong. It also gives extra information: you get to see whether the market really accepts the new price area before committing."
    ],
    how: [
      "In the Trading Practice Lab replay, find a breakout you graded yesterday and mark the broken level as a zone.",
      "Watch for price to return to that zone; note how many candles it took and how deep it went.",
      "Look for evidence of a hold: rejection candles (long lower wicks) or strong bullish closes inside or just above the zone.",
      "Record the outcome as successful retest, failed retest or no retest in the Backtesting journal.",
      "In the Strategy Lab, draft a retest entry rule with a stop beyond the zone and compare its stop distance with entering on the breakout candle.",
      "Add a Playbook note: 'Missing a breakout that does not retest is acceptable.'"
    ],
    example: {
      title: "Hypothetical stock XYZ: breakout and retest",
      lines: [
        "Hypothetical resistance $37.00 broke with a close at $37.40; price ran to $37.90.",
        "Breakout-candle entry at $37.40 with stop below $36.80 → risk $0.60 per share.",
        "Price pulls back to $37.05, prints a hammer (low $36.95), closes $37.25 → level holding as support.",
        "Retest entry at $37.25 with stop below $36.85 → risk $0.40 per share.",
        "Same idea, smaller risk per share — but only because a retest happened this time.",
        "Failed version: a close back below $36.80 would mark the retest as failed.",
        "All values hypothetical."
      ]
    },
    mistakes: [
      "Assuming every breakout will retest and refusing to accept missed trades.",
      "Entering the moment price touches the level without waiting for evidence that it is holding.",
      "Placing the stop exactly at the level, where normal noise during a retest can trigger it.",
      "Ignoring a failed retest and holding on, even though a close back inside the range suggests the breakout is failing.",
      "Confusing a deep pullback that slices far through the level with a valid retest."
    ],
    quiz: [
      { q: "What is a retest?", a: "Price returning to a level it just broke, to test it from the other side." },
      { q: "After a breakout, what should old resistance do on a successful retest?", a: "Act as support — price holds there and moves away in the breakout direction." },
      { q: "Why are retest entries considered more patient?", a: "They wait for confirmation that the level holds and usually allow a closer stop, though some breakouts never retest." }
    ]
  },

  20: {
    what: [
      "A false breakout (sometimes called a failed breakout or fakeout) happens when price pushes through a level and then quickly reverses back inside the previous range. It looks like a breakout at first, then fails.",
      "False breakouts trap traders. Those who bought the breakout are now holding losing positions; when price falls back inside, many of them exit at the same time, which can speed up the move in the opposite direction. The same happens in reverse with false breakdowns below support.",
      "Early warning signs include a quick reclaim (price closes back inside the range within one or a few candles), long wicks beyond the level, weak volume on the breakout, and a lack of follow-through.",
      "You cannot avoid all false breakouts — they are a normal part of markets, and even the best-looking breakout can fail. What protects you is recognising failure early and having a stop-loss in place, so a failed breakout is a small, planned loss rather than a large one."
    ],
    why: [
      "Every breakout trader will meet false breakouts, often frequently. The difference between a small and a large loss is preparation: a defined invalidation point and a stop. Understanding traps also helps you read when others are trapped, which some traders use as information in its own right."
    ],
    how: [
      "In the Trading Practice Lab replay, find three breakouts that failed and three that worked; compare their candles, volume and follow-through.",
      "For each failure, note how many candles it took before price closed back inside the range.",
      "Write a rule in your Playbook: 'A close back inside the range invalidates a breakout trade; the stop handles exits automatically.'",
      "In every simulated breakout trade, enter the stop-loss at the same moment as the entry and log it in the Paper-trade/Simulation log.",
      "In the Psychology journal, describe how it felt to be 'trapped' in a simulated false breakout and what you did.",
      "Track in the Backtesting journal what percentage of your marked breakouts failed — the number is usually higher than beginners expect."
    ],
    example: {
      title: "Hypothetical stock XYZ: a false breakout with a planned stop",
      lines: [
        "Hypothetical resistance $52.00; breakout candle closes at $52.30 on low volume.",
        "Simulated entry $52.30, stop $51.85 (below the zone), 100 shares → planned risk about $45.",
        "Next candle: wick to $52.40, closes $51.95 → back inside the range (quick reclaim).",
        "Following candle drops to $51.60; stop triggers around $51.85 (could slip a little lower).",
        "Result: about −$45 plus any slippage — a planned, small loss.",
        "Without a stop, price at $51.20 would have meant −$110 and growing.",
        "All values hypothetical."
      ]
    },
    mistakes: [
      "Trading breakouts without a stop-loss, so a false breakout turns into a large loss.",
      "Moving the stop further away after the breakout fails, hoping price will recover.",
      "Ignoring warning signs such as weak volume, long wicks and no follow-through.",
      "Becoming afraid of all breakouts after a few failures instead of tracking the actual statistics.",
      "Immediately flipping to the opposite direction on every failure without a plan, which leads to impulsive overtrading."
    ],
    quiz: [
      { q: "What is a false breakout?", a: "Price breaks through a level and then quickly reverses back inside the previous range." },
      { q: "Name two early warning signs of a false breakout.", a: "A quick close back inside the range and weak volume or lack of follow-through (long wicks beyond the level are another)." },
      { q: "What protects you from large losses on false breakouts?", a: "A predefined invalidation point and a stop-loss placed with the entry." }
    ]
  },

  21: {
    what: [
      "Support (Day 15): an area where buying interest has repeatedly stopped declines. Draw zones, not lines; more and sharper reactions add significance, and recent levels matter most. Resistance (Day 16): an area where selling interest has repeatedly stopped advances. Role reversal means broken support often becomes resistance and vice versa; round numbers and the previous day's high and low are commonly watched levels.",
      "Breakouts (Day 17): a decisive close above resistance. Quality comes from a momentum candle, rising volume and follow-through; a wick alone is not a breakout. Breakdowns (Day 18): a decisive close below support, confirmed by bearish momentum, volume and follow-through — and watch for an immediate reclaim, which suggests failure.",
      "Retests (Day 19): after a break, price often returns to test the level from the other side. A successful retest — the level holds and price moves away — is a common, more patient entry location; a failed retest is a warning. False breakouts (Day 20): price breaks a level, then quickly returns inside, trapping breakout traders. Recognising failure early and always using a stop-loss is what protects you.",
      "The common thread: levels are areas of probability where buyers and sellers have acted before. The candle skills from last week — closes, wicks, momentum and rejection — are how you read what happens at those levels. Today, consolidate: re-read your journal, find your weakest concept and rewrite it from memory."
    ],
    why: [
      "Support and resistance tie together everything learned so far: candles give the evidence, levels give the location, and stops give the protection. Many future setups are built on this foundation. Reviewing now, and checking your actual backtest records rather than impressions, helps you see what really happens at levels."
    ],
    how: [
      "Re-read your Trading Journal, Backtesting journal and Psychology journal entries for Days 15–20.",
      "Without notes, explain from memory: support, resistance, role reversal, breakout, breakdown, retest and false breakout.",
      "Check against the lessons and pick your weakest concept; rewrite it with a hypothetical example and save it to the Knowledge Vault.",
      "Tally your Backtesting journal: how many breakouts worked, failed, or retested? Note the sample size before drawing any conclusion.",
      "Do one full Trading Practice Lab replay session: mark levels before pressing play, then label each interaction as bounce, break, retest or false break.",
      "Update your Playbook with level-drawing rules, breakout criteria and the invalidation rule.",
      "Note in the Psychology journal how you handled simulated false breakouts this week."
    ],
    example: {
      title: "Hypothetical self-review walkthrough",
      lines: [
        "Recall test: clear on support/resistance and breakouts; unsure when a retest becomes a failed retest.",
        "Weakest concept = retests.",
        "Rewrite: 'A retest holds if candles close on the new side of the level. A close back inside the old range = failed retest.'",
        "Hypothetical example: breakout above $37.00; retest low $36.95 with close $37.25 → held; close $36.70 → failed.",
        "Backtesting tally (hypothetical, 15 breakouts): 7 worked, 5 failed, 3 retested and then worked → sample too small to conclude.",
        "Replay session: marked 4 levels; saw 2 bounces, 1 breakout with retest, 1 false breakdown.",
        "Saved to Knowledge Vault; Playbook invalidation rule confirmed."
      ]
    },
    mistakes: [
      "Treating levels as exact lines or guaranteed turning points rather than zones of probability.",
      "Judging breakouts by wicks or live candles instead of waiting for closes.",
      "Concluding a setup 'works' or 'does not work' from a handful of backtests.",
      "Redrawing levels after the fact to make past trades look better, which ruins honest review.",
      "Reviewing without updating the Playbook, so lessons learned never change future behaviour."
    ],
    quiz: [
      { q: "What is role reversal?", a: "A broken support level acting as resistance later, or a broken resistance level acting as support." },
      { q: "What is the difference between a breakout and a false breakout?", a: "A breakout closes decisively beyond the level with follow-through; a false breakout pushes through and then quickly returns inside the range." },
      { q: "What is the non-negotiable protection against failed breakouts?", a: "A predefined invalidation point with a stop-loss placed at entry." }
    ]
  }
};
