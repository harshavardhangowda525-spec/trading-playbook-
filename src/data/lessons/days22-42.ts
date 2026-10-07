import type { LessonContent } from './types';

// Days 22–42: Market Structure, Indicators, Risk Management.
// Educational and simulation content only — not financial advice. All prices are hypothetical.

export const CONTENT: Record<number, LessonContent> = {
  22: {
    what: [
      "Market structure is the pattern that price swings make over time. A swing high is a peak where price turned down, with lower highs on both sides of it. A swing low is a trough where price turned up, with higher lows on both sides. Instead of looking at every single candle, structure reading looks only at these turning points.",
      "A higher high (HH) is a swing high that is above the previous swing high. A higher low (HL) is a swing low (the bottom of a pullback) that holds above the previous swing low. A pullback is simply a temporary move against the main direction before price continues.",
      "When price keeps printing HH followed by HL, it means buyers are willing to pay more on each push and step in earlier on each dip. That sequence — HH, HL, HH, HL — is called bullish structure, and it is the basic definition of an uptrend.",
      "You label swings, not every candle. A single green candle that closes slightly higher is not a higher high. A swing needs a visible turn: price pushes up, then pulls back enough that you can see a peak. The cleaner the swings, the clearer the structure."
    ],
    why: [
      "Structure is the foundation that every later topic in this journey builds on. Trends, ranges, reversals, stop placement and target selection all depend on knowing where the last important highs and lows are. If you cannot label HH and HL, indicators will not save you, because you will not know what they are confirming.",
      "Structure is also an honest description of what has happened, not a prediction. A series of HH and HL tells you buyers have been in control so far. It does not guarantee the next swing will be higher — it just tells you which side currently has the evidence."
    ],
    how: [
      "Open a chart in Chart Practice or the Trading Practice Lab replay and zoom out until you can see 50–100 candles.",
      "Find the obvious peaks and troughs first. Mark only turns that stand out — ignore tiny wiggles of one or two candles.",
      "Starting from the left, label each swing high as HH or LH (compared to the prior high) and each swing low as HL or LL (compared to the prior low).",
      "Ask: is the most recent sequence HH + HL? If yes, note 'bullish structure' and write down the price of the last HL — that is the level that keeps the structure intact.",
      "Step the replay forward candle by candle and update your labels as new swings form, without peeking ahead.",
      "Log three labelled screenshots or descriptions in your Trading Journal with a one-line note on how clear (or messy) the swings were."
    ],
    example: {
      title: "Hypothetical stock XYZ, 5-minute chart (practice replay)",
      lines: [
        "Swing low at $20.00, then price rallies to a swing high at $21.00.",
        "Pullback bottoms at $20.40 — above $20.00, so that is a higher low (HL).",
        "Price rallies to $21.30 — above $21.00, so that is a higher high (HH).",
        "Next pullback holds at $20.80 — another HL above $20.40.",
        "Sequence so far: HH + HL + HH + HL → bullish structure.",
        "The key level to watch is the last HL at $20.80; while it holds, the structure stays bullish (not a guarantee of anything)."
      ]
    },
    mistakes: [
      "Labelling every candle as a high or low, which turns the chart into noise and hides the real swings.",
      "Calling a new high 'bullish structure' before a higher low has formed, because one HH alone does not complete the sequence.",
      "Mixing timeframes while labelling, so a 1-minute swing gets compared to a 1-hour swing and the labels contradict each other.",
      "Treating bullish structure as a guarantee, when it only describes what buyers have done so far.",
      "Redrawing swings after the fact to fit the answer you wanted, which defeats the purpose of practice."
    ],
    quiz: [
      { q: "What is a higher low (HL)?", a: "A pullback swing low that holds above the previous swing low." },
      { q: "What two-part sequence defines bullish structure?", a: "Higher highs followed by higher lows, repeating — HH + HL." },
      { q: "Why should you label swings rather than individual candles?", a: "Single candles are noise; only clear turning points show who is in control." }
    ]
  },

  23: {
    what: [
      "Bearish structure is the mirror image of yesterday's lesson. A lower high (LH) is a rally that fails and turns down below the previous swing high. A lower low (LL) is a new swing low that breaks below the previous swing low.",
      "When price keeps producing LH followed by LL, sellers are in control: each bounce runs out of buyers sooner, and each decline pushes further than the last. That LH + LL sequence is the basic definition of a downtrend.",
      "The first lower high inside an uptrend is an early warning. It means buyers could not push past the last peak. It is not yet a downtrend — the higher low below it is still intact — but it tells you momentum has weakened and you should pay closer attention.",
      "As with highs and lows in an uptrend, you label swings, not candles. A single red candle is not a lower low; a lower low is a clear trough below the previous one."
    ],
    why: [
      "Recognising bearish structure keeps you from buying into something that keeps making lower prices just because it 'looks cheap'. Price that keeps making LL is telling you that, so far, sellers have been stronger.",
      "Spotting the first LH early helps with risk: it is a reason to tighten your plan, reduce expectations, or simply stand aside — not a reason to jump into a short position on its own."
    ],
    how: [
      "Open a replay in the Trading Practice Lab and find a section where price is clearly falling.",
      "Mark the obvious swing highs and swing lows, skipping small one- or two-candle wiggles.",
      "Label each swing high LH or HH and each swing low LL or HL relative to the one before it.",
      "Find a chart that was in an uptrend and mark the first LH. Note what happened next — sometimes it led to a downtrend, sometimes the uptrend resumed.",
      "Write down the most recent LH price; in a downtrend, that is the level whose break would challenge bearish structure.",
      "Record in your Trading Journal how often the first LH was followed by a broken HL in your samples. This builds realistic expectations."
    ],
    example: {
      title: "Hypothetical stock XYZ, 15-minute chart (practice replay)",
      lines: [
        "Swing high at $50.00, then price drops to a swing low at $48.50.",
        "Bounce stalls at $49.40 — below $50.00, so that is a lower high (LH).",
        "Price falls to $48.00 — below $48.50, so that is a lower low (LL).",
        "Next bounce fails at $48.90 — another LH.",
        "Sequence: LH + LL + LH → bearish structure; the last LH at $48.90 is the level to watch.",
        "Nothing here predicts the next candle — it only describes who has been in control."
      ]
    },
    mistakes: [
      "Buying because price 'has fallen a lot', ignoring that LH + LL says sellers are still in control.",
      "Treating the first lower high as a confirmed downtrend, when the prior higher low has not broken yet.",
      "Labelling a single red candle as a lower low instead of waiting for a clear swing.",
      "Assuming bearish structure means you should short, when the lesson is about reading, not acting.",
      "Ignoring the most recent LH, which is the level that tells you when bearish structure is being challenged."
    ],
    quiz: [
      { q: "What is a lower high (LH)?", a: "A rally that fails and turns down below the previous swing high." },
      { q: "What does LH + LL repeating tell you?", a: "Sellers have been in control — bearish structure, the basic definition of a downtrend." },
      { q: "Why is the first LH in an uptrend only an early warning?", a: "The last higher low is still intact, so the uptrend structure has not actually broken yet." }
    ]
  },

  24: {
    what: [
      "An uptrend is a series of higher highs and higher lows. One HH + HL is the start; several in a row is a trend. The more clean swings in the sequence, the more established the trend appears — though no trend lasts forever.",
      "Trend traders usually look to buy pullbacks rather than chase. Chasing means buying after a big, extended move straight up, far from any logical stop. Buying a pullback means waiting for price to dip back toward the area of a likely higher low, where the risk to a logical stop is smaller.",
      "The trend is considered intact until a higher low breaks. If price falls below the most recent HL, the HH + HL sequence is broken and the uptrend is in question. That broken HL is the structural line in the sand.",
      "Higher timeframe context matters. A 'timeframe' is the period each candle covers (1-minute, 5-minute, daily). An uptrend on a 5-minute chart that sits inside a daily downtrend is fighting a bigger current. Checking one higher timeframe gives you that context."
    ],
    why: [
      "Most trend-following approaches are built on this simple idea: trade in the direction structure is already moving, enter on pullbacks, and accept you are wrong if the last higher low breaks. It gives you a direction, a location and an invalidation point all from price itself.",
      "Chasing extended moves is one of the most common beginner habits. It usually means a far-away stop, a poor risk/reward and buying right before a natural pullback. Learning to wait is a skill you can practise safely in simulation."
    ],
    how: [
      "In the Trading Practice Lab, find an uptrend on a higher timeframe (for example 1-hour) and note the direction.",
      "Drop to your trading timeframe (for example 5-minute) and label the last three swings to confirm HH + HL.",
      "Mark the most recent HL — that is where the uptrend would be in question if broken.",
      "Instead of entering on a big green candle, wait in replay for a pullback toward a prior level or the previous swing area.",
      "Log a hypothetical entry on the pullback in your Paper-trade/Simulation log, with the stop just beyond the HL.",
      "Step forward and record whether the trend continued, ranged or broke the HL — every outcome is useful data.",
      "Add a 'buy pullbacks, don't chase' rule to your Playbook in your own words."
    ],
    example: {
      title: "Hypothetical stock XYZ, 5-minute chart, $10,000 practice account",
      lines: [
        "1-hour chart: HH + HL sequence → higher timeframe context is up.",
        "5-minute chart: last HL at $30.20, latest HH at $31.00.",
        "Option A (chase): buy at $31.00 after a fast run; stop below HL at $30.10 → $0.90 risk per share.",
        "Option B (pullback): wait for a dip to $30.50; stop at $30.10 → $0.40 risk per share.",
        "Same invalidation level, but the pullback entry risks less than half as much per share.",
        "If price later closes below $30.20, the HL has broken and the uptrend read is no longer valid."
      ]
    },
    mistakes: [
      "Chasing a big candle far from structure, which forces a wide stop or no logical stop at all.",
      "Calling something an uptrend after one up move, before a higher low has formed.",
      "Ignoring a broken higher low because you still 'feel' bullish.",
      "Trading a small-timeframe uptrend straight into a higher-timeframe downtrend without noticing.",
      "Expecting every pullback to hold, when some pullbacks become the start of a reversal."
    ],
    quiz: [
      { q: "When is an uptrend considered broken structurally?", a: "When price breaks below the most recent higher low." },
      { q: "Why do trend traders prefer buying pullbacks to chasing?", a: "A pullback entry sits closer to a logical stop, so risk per share is smaller and the trade plan is clearer." },
      { q: "What does checking a higher timeframe add?", a: "Context — it shows whether your smaller-timeframe trend agrees with or fights the bigger move." }
    ]
  },

  25: {
    what: [
      "A downtrend is a series of lower highs and lower lows. Each rally fails below the last peak, and each decline pushes below the last trough.",
      "In a downtrend, sellers tend to 'fade' rallies into lower highs. To fade means to trade against a short-term move — here, selling into a bounce rather than chasing price lower after a big drop. In this app you study this in simulation only; short selling carries extra risks and rules in real markets.",
      "The downtrend is considered intact until a lower high breaks. If price rallies above the most recent LH, the LH + LL sequence is broken and the downtrend is in question.",
      "'Don't fight the dominant direction' means: if structure is clearly bearish, buying every dip in hope of a bottom is betting against the evidence. You do not have to trade the downtrend — standing aside is always a valid choice — but you should not ignore it."
    ],
    why: [
      "Many beginners lose in simulation (and in real life) by repeatedly trying to catch the exact bottom of a falling chart. Reading downtrend structure gives you a clear, objective reason not to do that until structure actually changes.",
      "Understanding downtrends also makes your uptrend reads better: you start to see trends as symmetric, defined by the same swing logic, rather than as 'good' and 'bad' markets."
    ],
    how: [
      "In the Trading Practice Lab, find a replay with clear LH + LL on your trading timeframe.",
      "Label the last three swings and mark the most recent LH — the level that would break bearish structure.",
      "Check one higher timeframe to see whether it agrees with the downtrend.",
      "Practise patience: in replay, note where a rally stalls into a prior level near an LH rather than reacting to every red candle.",
      "If you log a simulated trade, record the plan only (entry area, stop above the LH, reason) in your Paper-trade/Simulation log.",
      "Mark every time you felt the urge to 'buy the bottom' in your Psychology journal and note what structure said at that moment."
    ],
    example: {
      title: "Hypothetical stock XYZ, 15-minute chart (simulation only)",
      lines: [
        "Swings: LH $42.00 → LL $40.50 → LH $41.40 → LL $39.80.",
        "Structure: LH + LL repeating → bearish.",
        "Most recent LH is $41.40; a move above it would challenge the downtrend.",
        "Price bounces to $41.10 and stalls near the prior LH area — a rally fading below the last high.",
        "A simulated plan would place invalidation above $41.40, not at a random distance.",
        "If price instead closes above $41.40, the downtrend read is invalid and you reassess."
      ]
    },
    mistakes: [
      "Repeatedly buying a falling chart to catch the exact bottom, against clear LH + LL structure.",
      "Selling after a large drop far from any lower high, which is the downtrend version of chasing.",
      "Ignoring a broken lower high because you were attached to the bearish view.",
      "Assuming you must trade every trend, when standing aside is often the best simulated decision.",
      "Forgetting that short selling has extra real-world risks that a simulation does not show."
    ],
    quiz: [
      { q: "What defines a downtrend?", a: "A series of lower highs and lower lows." },
      { q: "When is a downtrend structurally in question?", a: "When price breaks above the most recent lower high." },
      { q: "What does 'fade a rally' mean in a downtrend?", a: "Trading against the short-term bounce, typically near a lower high, instead of chasing price lower." }
    ]
  },

  26: {
    what: [
      "A range is a period where price moves back and forth between two levels without making new higher highs or new lower lows. The top boundary is resistance (a level where selling has repeatedly stopped price) and the bottom is support (a level where buying has repeatedly stopped price).",
      "In a range, structure is neutral. You might see a high, a low, a similar high, a similar low — no clear HH + HL or LH + LL sequence. Neither buyers nor sellers are in control.",
      "Trend strategies tend to struggle in ranges. A 'breakout' through the top often fails and drops back inside; a pullback that looks like a higher low becomes just another touch of the middle. Recognising a range helps you avoid low-quality trades.",
      "Ranges eventually break. When price finally closes and holds outside the range, a new trend may begin. Until then, the range is the context."
    ],
    why: [
      "A large share of trading time is spent in ranges or choppy conditions. If you only know how to read trends, you will try to force trend trades into sideways markets and collect small, frustrating losses.",
      "Simply labelling the market 'range' is a valuable decision. It can mean smaller size, waiting for the edges, or not trading at all — all of which protect your simulated account."
    ],
    how: [
      "In Chart Practice or a Trading Practice Lab replay, look for an area where price touched a similar high and a similar low at least twice each.",
      "Draw the range top and bottom as zones, not single exact prices.",
      "Confirm there is no new HH or LL inside the zone — if there is, it may be a trend, not a range.",
      "Mark the middle of the range; trades taken in the middle have poor location on both sides.",
      "Step the replay forward and note how many times price poked outside the range and came back before a real break.",
      "Add a 'range → be selective or stand aside' rule to your Playbook and log observations in your Trading Journal."
    ],
    example: {
      title: "Hypothetical stock XYZ, 5-minute chart (practice replay)",
      lines: [
        "Price tops near $15.00 three times and bottoms near $14.20 twice.",
        "No HH above $15.00 and no LL below $14.20 → range.",
        "Range height: $15.00 − $14.20 = $0.80; midpoint ≈ $14.60.",
        "A buy at $14.60 has $0.40 to resistance and $0.40 to support — no edge in location.",
        "Price pokes to $15.08 then closes back inside — a failed breakout, common in ranges.",
        "Later, price closes and holds above $15.00 with rising volume — the range may be breaking (still not certain)."
      ]
    },
    mistakes: [
      "Applying trend-pullback setups inside a range, where they fail more often.",
      "Entering in the middle of the range, where both directions have equal room and the location is poor.",
      "Treating every poke above resistance as a confirmed breakout.",
      "Drawing range edges as exact prices instead of zones, then being surprised by small overshoots.",
      "Forgetting that ranges eventually end, and assuming the boundaries will hold forever."
    ],
    quiz: [
      { q: "What defines a range?", a: "Price oscillating between support and resistance without making new higher highs or lower lows." },
      { q: "Why is the middle of a range a poor place to enter?", a: "There is roughly equal distance to both boundaries, so there is no location advantage." },
      { q: "Why do trend strategies struggle in ranges?", a: "There is no directional follow-through, so breakouts and pullbacks often fail and reverse." }
    ]
  },

  27: {
    what: [
      "A reversal is when a trend changes direction. In structure terms, an uptrend reversal begins when price fails to make a new higher high (often forming a lower high instead) and then breaks below its last higher low. A downtrend reversal is the opposite: failure to make a new lower low, then a break above the last lower high.",
      "That two-step process — failure to make a new extreme, then a break of the last HL or LH — is called a structure change (sometimes 'change of character'). It is what confirms a reversal.",
      "One candle is not a reversal. A big red candle in an uptrend might just be a pullback that forms the next higher low. Only when the structural level breaks do you have evidence the trend has changed.",
      "Calling reversals early — trying to pick the exact top or bottom — is low probability. Trends often continue longer than expected, and many 'tops' turn out to be pauses."
    ],
    why: [
      "Reversals are where trends end, so they matter for both protecting simulated profits and avoiding new trades in a dying direction. They are also where beginners lose the most trying to predict the turn.",
      "Waiting for structure to confirm means you will never catch the exact top or bottom. That is the trade-off: you give up part of the move in exchange for evidence instead of hope."
    ],
    how: [
      "In the Trading Practice Lab, find a replay where an uptrend ended. Label swings until the last HH.",
      "Mark the point where price failed to exceed that HH (the lower high).",
      "Mark the last HL and note the candle that closed below it — that is the structure change.",
      "Compare how far price had moved from the top to the confirmation point; this is the 'cost' of waiting for evidence.",
      "Repeat for a downtrend that reversed upward.",
      "In your Trading Journal, note any reversal you would have called early and whether it was a real reversal or just a pullback."
    ],
    example: {
      title: "Hypothetical stock XYZ, 15-minute chart (practice replay)",
      lines: [
        "Uptrend swings: HL $60.00 → HH $63.00 → HL $61.50 → HH $64.00.",
        "Next rally stalls at $63.40 — failed to exceed $64.00, so this is a lower high.",
        "Price then closes at $61.30, below the last HL of $61.50 → structure change.",
        "Top was $64.00; confirmation came near $61.30 — about $2.70 below the high.",
        "Early sellers at $64.00 'guessed right' this time, but many similar guesses fail.",
        "The reversal is now confirmed by structure, though the new direction is still not guaranteed."
      ]
    },
    mistakes: [
      "Calling a reversal from a single large candle without any structural break.",
      "Trying to pick the exact top or bottom, which has a low success rate.",
      "Ignoring a confirmed structure change because you are still attached to the old trend.",
      "Confusing a deep pullback that holds the last HL with a reversal.",
      "Assuming a confirmed reversal guarantees a new trend, when price can also move into a range."
    ],
    quiz: [
      { q: "What two steps confirm an uptrend reversal?", a: "Price fails to make a new higher high, then breaks below the last higher low." },
      { q: "Why is one big candle not a reversal?", a: "It may just be a pullback; only a break of the structural level gives evidence the trend changed." },
      { q: "What is the trade-off of waiting for confirmation?", a: "You miss the exact top or bottom but act on evidence rather than a guess." }
    ]
  },

  28: {
    what: [
      "This week you learned to read market structure — the pattern of swing highs and lows. Here is the recap before you review.",
      "Higher highs and higher lows (Day 22): each peak above the last and each pullback holding above the last low shows buyers in control. Lower highs and lower lows (Day 23): rallies failing below the last high and declines breaking the last low show sellers in control; the first LH in an uptrend is an early warning.",
      "Uptrend (Day 24) and downtrend (Day 25): a series of HH + HL or LH + LL. Trend traders wait for pullbacks rather than chasing, and treat a broken HL (uptrend) or broken LH (downtrend) as the invalidation. Higher timeframes give context.",
      "Range (Day 26): price bounded by support and resistance with no new HH or LL; trend setups fail more often and the middle is poor location. Reversal (Day 27): a failure to make a new extreme followed by a break of the last HL or LH — structure change confirms, single candles do not."
    ],
    why: [
      "Review days are where knowledge turns into understanding. Reading about swings is easy; labelling them consistently on unfamiliar charts is the real skill. Revisiting your own notes shows you where your labelling was sloppy or where you jumped to conclusions.",
      "Every later topic — indicators, stops, targets — assumes you can read structure. Fixing weak spots now makes the next two weeks much easier."
    ],
    how: [
      "Re-read this week's Trading Journal entries and practice-replay notes from Days 22–27.",
      "Without looking at notes, write one sentence each defining HH, HL, LH, LL, range and reversal.",
      "Open three fresh replays in the Trading Practice Lab and label each as uptrend, downtrend or range, marking the key invalidation swing.",
      "Identify your weakest concept (for many it is telling a pullback from a reversal) and rewrite it in your own words.",
      "Compare your new definitions to the lessons and correct any gaps.",
      "Save your best insight or cleanest labelled example to the Knowledge Vault."
    ],
    example: {
      title: "Hypothetical self-review walkthrough",
      lines: [
        "Journal re-read: on Day 24 I labelled a single up candle as an HH — mistake noted.",
        "From memory: 'Uptrend = HH + HL; broken when the last HL breaks.' ✓",
        "Replay 1: clear HH + HL → uptrend, invalidation at last HL.",
        "Replay 2: similar highs and lows, no new extremes → range.",
        "Replay 3: LH formed, then HL broke → structure change (reversal).",
        "Weakest concept: pullback vs reversal. Rewritten: 'A pullback holds the last HL; a reversal breaks it.' Saved to Knowledge Vault."
      ]
    },
    mistakes: [
      "Skimming notes instead of re-labelling fresh charts, which tests recognition rather than skill.",
      "Only reviewing the concepts you already find easy and skipping your weakest one.",
      "Writing definitions while looking at the lesson, which hides what you actually remember.",
      "Treating review day as a day off rather than the step that consolidates the week.",
      "Not saving anything to the Knowledge Vault, so the insight is lost by next month."
    ],
    quiz: [
      { q: "What is the difference between a pullback and a reversal in an uptrend?", a: "A pullback holds above the last higher low; a reversal fails to make a new high and then breaks the last higher low." },
      { q: "How do you recognise a range?", a: "Price moves between support and resistance without making new higher highs or lower lows." },
      { q: "What level invalidates a downtrend?", a: "A break above the most recent lower high." }
    ]
  },

  29: {
    what: [
      "A moving average (MA) is the average closing price over the last N candles, recalculated as each new candle closes. Because it 'moves' with each new candle, it draws a smooth line that shows the general direction of price without every wiggle.",
      "There are two common types. A simple moving average (SMA) weights every candle equally. An exponential moving average (EMA) gives more weight to recent candles, so it reacts faster. Common lengths for day traders are 9, 20 and 50 periods.",
      "Many traders use moving averages as dynamic levels: in a trend, price sometimes pulls back to a rising MA and bounces. 'Dynamic' means the level moves over time, unlike a horizontal support line. This is a tendency, not a rule — price slices through MAs all the time.",
      "Moving averages always lag. They are built entirely from past prices, so they describe what has already happened. A faster MA (like the 9) lags less but gives more false signals; a slower one (like the 50) is smoother but slower to react."
    ],
    why: [
      "A moving average gives a quick visual read of direction: rising line and price above it suggests upward bias; falling line and price below suggests downward. It can help a beginner see the trend that structure is already describing.",
      "Knowing that MAs lag protects you from treating them as predictions. In a range, price crosses back and forth over the MA repeatedly, producing many misleading signals."
    ],
    how: [
      "In the Trading Practice Lab, add a 20-period EMA to a replay chart.",
      "Label structure first (HH/HL or LH/LL), then check whether the MA slope agrees.",
      "Step forward and note each time price touched the MA: did it bounce, or slice through?",
      "Add a 9 EMA and a 50 SMA and compare how quickly each reacts to a sharp move.",
      "Find a range section and count how many times price crossed the 20 EMA — this shows the lag and whipsaw problem.",
      "Write in your Trading Journal which MA length you will use for practice, and why — then stick with one."
    ],
    example: {
      title: "Hypothetical stock XYZ, 5-minute chart with a 20 EMA (practice replay)",
      lines: [
        "Structure: HH + HL; price at $25.40, 20 EMA rising at $25.10.",
        "Pullback dips to $25.12 near the EMA, then the next candle closes at $25.35.",
        "The EMA acted as a dynamic level here — this time.",
        "Later, price falls to $24.70 and the EMA only begins to flatten after the move.",
        "The MA reacted after price did — that is the lag.",
        "In the next range section, price crosses the EMA 6 times in 40 candles with no follow-through."
      ]
    },
    mistakes: [
      "Treating a moving average as a prediction, when it only summarises past prices.",
      "Expecting price to bounce exactly off an MA every time, when it often slices through.",
      "Using MA crossovers in a range, where whipsaws make them unreliable.",
      "Stacking many MA lengths on one chart until it becomes unreadable.",
      "Ignoring structure and trading only the MA, which puts the lagging tool ahead of price itself."
    ],
    quiz: [
      { q: "What is the main difference between an SMA and an EMA?", a: "An SMA weights all periods equally; an EMA gives more weight to recent prices, so it reacts faster." },
      { q: "Why do moving averages lag?", a: "They are calculated only from past prices, so they react after price has moved." },
      { q: "In what market condition do MAs give the most misleading signals?", a: "In ranges or choppy markets, where price crosses back and forth over the average." }
    ]
  },

  30: {
    what: [
      "The Relative Strength Index (RSI) is a momentum oscillator. Momentum is how fast price is changing; an oscillator is an indicator that moves between fixed bounds. RSI compares the size of recent up moves to recent down moves (commonly over 14 periods) and plots the result on a scale from 0 to 100.",
      "By convention, readings above 70 are called 'overbought' and below 30 'oversold'. These are reference zones, not buy or sell signals. Overbought simply means price has risen quickly relative to recent history — it does not mean price must fall.",
      "Strong trends can stay extended. In a powerful uptrend, RSI can sit above 70 for a long time while price keeps rising; in a strong downtrend it can stay below 30. Selling just because RSI is above 70 has hurt many beginners.",
      "Divergence is when price and RSI disagree. Bearish divergence: price makes a higher high but RSI makes a lower high, suggesting momentum is weakening. Bullish divergence is the opposite. Divergence is a warning, not a reversal signal — structure still needs to confirm."
    ],
    why: [
      "RSI gives you a quick sense of whether a move is speeding up or slowing down. Used alongside structure, it can help you notice a trend losing energy or a pullback that is unusually deep.",
      "Understanding its limits matters just as much. Treating 70 and 30 as automatic signals is one of the most common indicator misuses."
    ],
    how: [
      "Add RSI (14) to a replay chart in the Trading Practice Lab.",
      "Find a strong uptrend and count how many candles RSI stayed above 70 while price kept rising.",
      "Find a swing where price made a higher high and check whether RSI also made a higher high or diverged.",
      "For each divergence you find, step forward and record whether structure actually changed (an HL broke) or the trend continued.",
      "Write down the RSI reading at pullback lows in an uptrend — you may notice they stay well above 30.",
      "Summarise in your Trading Journal: 'RSI 70/30 are zones, divergence is a warning, structure confirms.'"
    ],
    example: {
      title: "Hypothetical stock XYZ, 5-minute chart with RSI(14) (practice replay)",
      lines: [
        "Price rallies from $12.00 to $13.20; RSI rises to 78 ('overbought').",
        "Price continues to $13.60 while RSI stays between 70 and 80 for 15 candles.",
        "Selling at the first 70+ reading would have meant fighting a still-rising trend.",
        "Next: price makes a higher high at $13.75, but RSI peaks at 66 — bearish divergence.",
        "Price then breaks the last HL at $13.30 → structure confirms the warning.",
        "Divergence alone did not decide anything; the structure break did."
      ]
    },
    mistakes: [
      "Selling simply because RSI is above 70, ignoring that strong trends stay overbought.",
      "Buying simply because RSI is below 30, when downtrends can stay oversold for a long time.",
      "Acting on divergence alone without waiting for a structure change.",
      "Changing RSI settings repeatedly to make past charts look better (curve-fitting).",
      "Forgetting that RSI is calculated from price, so it cannot know something price does not."
    ],
    quiz: [
      { q: "What range does RSI move within, and what are the common reference zones?", a: "0 to 100; above 70 is often called overbought and below 30 oversold." },
      { q: "Is RSI above 70 a sell signal?", a: "No — it is a reference zone; strong trends can stay above 70 for a long time." },
      { q: "What is bearish divergence?", a: "Price makes a higher high while RSI makes a lower high, warning that momentum may be weakening." }
    ]
  },

  31: {
    what: [
      "Volume is the number of shares (or contracts) traded during a candle. It is usually shown as bars under the price chart. High volume means many participants were active; low volume means few were.",
      "Volume measures participation. When price breaks above resistance with volume clearly higher than recent bars, it suggests many traders are acting on that move — what traders call conviction. A breakout on thin volume has less participation behind it and is more likely to fail.",
      "Volume confirms; it rarely leads on its own. A big volume bar tells you something important happened, but not always which direction will follow. Read it alongside structure and levels.",
      "Volume has a daily rhythm. In many stock markets the session open usually has the most volume, it tends to drop around midday, and it often picks up again into the close. Comparing a bar to the volume typical for that time of day is more useful than comparing it to the open."
    ],
    why: [
      "Volume helps you judge how much weight to put on a move. Two identical-looking breakouts can have very different participation behind them, and volume is one of the few direct measures of that.",
      "It also explains why the open is so volatile and why midday moves are often slow and unreliable — useful context for when you choose to practise."
    ],
    how: [
      "Turn on volume bars in a Trading Practice Lab replay.",
      "Mark the first 30 minutes and note how volume compares to the middle of the day.",
      "Find three breakouts through a level and compare each breakout bar's volume to the average of the previous 10–20 bars.",
      "Step forward and record whether high-volume breakouts held more often than low-volume ones in your sample.",
      "Look for big volume spikes at swing highs or lows and note what happened next — sometimes continuation, sometimes reversal.",
      "Log your findings in the Backtesting journal; small samples are noisy, so keep adding over time."
    ],
    example: {
      title: "Hypothetical stock XYZ, 5-minute chart with volume (practice replay)",
      lines: [
        "Resistance at $8.00; average volume of last 20 bars ≈ 50,000 shares.",
        "Breakout A at 10:05: close $8.06 on 140,000 shares (~2.8× average) — strong participation.",
        "Price holds above $8.00 and the next pullback forms a higher low.",
        "Breakout B at 12:40: close $8.48 above $8.45 on 35,000 shares (~0.7× average).",
        "Price drifts back below $8.45 within 4 bars — a low-participation move that failed.",
        "Higher volume did not guarantee A would work; it just added evidence."
      ]
    },
    mistakes: [
      "Treating a volume spike as a directional signal on its own, without structure.",
      "Comparing midday volume to the open and concluding every midday bar is 'low'.",
      "Trusting low-volume breakouts as much as high-volume ones.",
      "Assuming high volume guarantees follow-through, when it only shows participation.",
      "Drawing firm conclusions from a handful of examples instead of a larger logged sample."
    ],
    quiz: [
      { q: "What does volume measure?", a: "How many shares or contracts were traded — a measure of participation." },
      { q: "Why is a low-volume breakout considered suspect?", a: "Fewer participants are behind it, so it is more likely to fail and fall back." },
      { q: "When does volume usually peak during the trading day?", a: "Usually around the session open, with activity often picking up again near the close." }
    ]
  },

  32: {
    what: [
      "VWAP stands for Volume-Weighted Average Price. It is the average price traded during the session, where prices that traded on more volume count more. It is calculated by summing (price × volume) for each bar and dividing by total volume so far.",
      "VWAP resets every session. At the open it starts fresh, so early in the day it moves a lot; later, with more volume included, it becomes steadier. It is an intraday tool and has no meaning carried over from yesterday (unless you use special anchored versions).",
      "Many intraday traders treat VWAP as a fair-value reference — roughly the average price participants have paid today. When price is above VWAP, buyers have been in control intraday on average; below VWAP, sellers have. Some large participants also benchmark their execution against it.",
      "Like any indicator, VWAP is derived from past price and volume, so it lags. Price often crosses VWAP back and forth in choppy sessions, and a single cross is not a signal on its own."
    ],
    why: [
      "VWAP gives a simple, widely watched intraday reference. Because many traders look at it, price reactions around it are common — which makes it useful context for location and bias.",
      "It also helps you avoid chasing: buying far above VWAP after a big run often means paying well above the day's average with little nearby support."
    ],
    how: [
      "Add VWAP to an intraday replay in the Trading Practice Lab and confirm it starts fresh at the session open.",
      "Note where price is relative to VWAP at 30 minutes, 1 hour and 2 hours into the session.",
      "Combine with structure: an uptrend holding above VWAP is a more consistent read than an uptrend constantly crossing it.",
      "Watch pullbacks to VWAP and record whether price held, sliced through, or chopped around it.",
      "Measure how far price got from VWAP before snapping back on extended days.",
      "Record a VWAP rule for practice in your Playbook, e.g. 'only consider long simulations above VWAP when structure is bullish'."
    ],
    example: {
      title: "Hypothetical stock XYZ, intraday 5-minute chart (practice replay)",
      lines: [
        "Bar 1: price $10.00, volume 1,000 → price × volume = 10,000.",
        "Bar 2: price $10.20, volume 3,000 → 30,600.",
        "VWAP = (10,000 + 30,600) ÷ (1,000 + 3,000) = 40,600 ÷ 4,000 = $10.15.",
        "Note it is closer to $10.20 because more volume traded there.",
        "Mid-morning: price $10.60, VWAP $10.30, structure HH + HL → buyers in control intraday.",
        "Next day VWAP resets at the open; yesterday's $10.30 no longer applies."
      ]
    },
    mistakes: [
      "Carrying yesterday's VWAP into today, forgetting that it resets every session.",
      "Treating every VWAP cross as a buy or sell signal in choppy conditions.",
      "Trusting VWAP heavily in the first few minutes, when it is based on very little volume.",
      "Chasing far above VWAP and assuming the line will act as nearby support.",
      "Using VWAP alone without structure or levels."
    ],
    quiz: [
      { q: "How is VWAP calculated?", a: "Sum of (price × volume) divided by total volume, accumulated through the session." },
      { q: "How often does standard VWAP reset?", a: "Every trading session — it starts fresh at the open." },
      { q: "What does price above VWAP suggest intraday?", a: "Buyers have been in control on average today; it is context, not a guarantee." }
    ]
  },

  33: {
    what: [
      "Every indicator — moving averages, RSI, VWAP and the rest — is a calculation of past price and/or volume. They do not contain hidden information; they repackage what is already on the chart.",
      "Because they use past data, indicators lag. By the time an MA turns or RSI crosses a level, price has already moved. Faster settings lag less but produce more false signals; slower settings are smoother but later. There is no setting that removes this trade-off.",
      "Indicators also conflict. RSI can say 'overbought' while price is above VWAP and a rising EMA. If you stack several indicators, you can usually find one that agrees with whatever you already wanted to do — which creates false confidence.",
      "More indicators does not mean more accuracy. Many of them measure similar things, so adding them just repeats the same information. The practical approach is: price, structure and levels first; one indicator, used only as confirmation."
    ],
    why: [
      "Beginners often believe the right combination of indicators will reveal what price will do next. That search wastes months and leads to cluttered charts and hesitant decisions. Knowing the limits early lets you focus on what actually drives your read.",
      "Accepting uncertainty is part of trading education. No indicator, alone or combined, makes outcomes certain."
    ],
    how: [
      "Open a replay with MA, RSI and VWAP all on, then remove all but one.",
      "On the clean chart, label structure and key levels first, then glance at the one indicator.",
      "Find two moments where your indicators disagreed and write down what structure said instead.",
      "Measure the lag: note the candle where price turned and the candle where your indicator turned.",
      "Choose a single indicator for the next two weeks of practice and record why in your Strategy Lab notes.",
      "In your Psychology journal, note any time you added an indicator just to justify a trade you already wanted."
    ],
    example: {
      title: "Hypothetical stock XYZ, 5-minute chart (practice replay)",
      lines: [
        "Price turns down from a high at $18.40 on bar 50.",
        "9 EMA starts sloping down on bar 53; 20 EMA on bar 57 → 3 and 7 bars of lag.",
        "At bar 52, RSI reads 72 ('overbought'), price is above VWAP, 20 EMA still rising.",
        "Three indicators, mixed messages — easy to pick the one that agrees with you.",
        "Structure: the last HL at $17.90 is still intact, so the uptrend read stands until it breaks.",
        "Lesson: the structural level gave the clearest decision point; the indicators came later."
      ]
    },
    mistakes: [
      "Believing an indicator knows something price does not, when it is only derived from price.",
      "Adding indicators until one agrees with the trade you already wanted.",
      "Constantly tweaking indicator settings to fit past charts.",
      "Letting a lagging signal override a clear structural break.",
      "Cluttering the chart so much that you cannot see price and levels."
    ],
    quiz: [
      { q: "What are indicators calculated from?", a: "Past price and/or volume — they do not contain extra information." },
      { q: "Why doesn't stacking many indicators improve accuracy?", a: "They often measure similar things, can conflict, and give false confidence by letting you pick one that agrees." },
      { q: "What should come first in your chart read?", a: "Price, structure and levels; one indicator is used only as confirmation." }
    ]
  },

  34: {
    what: [
      "Today you combine three things into one simple read: structure for direction, levels for location, and one indicator for confirmation.",
      "Direction (structure): is the market making HH + HL, LH + LL, or ranging? This tells you which side, if any, you would consider in simulation.",
      "Location (levels): where is price relative to support, resistance, prior swings or the day's high and low? A good location is near a level where you can define a nearby invalidation point, rather than in the middle of nowhere.",
      "Confirmation (one indicator): does your single chosen indicator agree, for example price holding above VWAP or a rising 20 EMA? If it disagrees, you either wait or skip. This three-step read — direction, location, confirmation — is the foundation of a strategy. Simple beats complex because you can repeat it, journal it and test it."
    ],
    why: [
      "A clear, repeatable read lets you compare trades fairly. If every trade uses a different reason, your journal cannot tell you what works. If every trade passes the same three checks, you can backtest and improve it.",
      "Keeping it simple also reduces decision fatigue, which matters most in fast intraday conditions."
    ],
    how: [
      "Write your three-step checklist in your Playbook: Structure → direction, Level → location, Indicator → confirmation.",
      "Open a Trading Practice Lab replay and, before stepping forward, answer each step in one line.",
      "If any step fails, write 'no trade' and continue — skipping is a valid outcome.",
      "When all three agree, log a hypothetical entry, stop and target in your Paper-trade/Simulation log.",
      "Repeat for at least 10 setups and record results in the Backtesting journal.",
      "Review which step most often caused you to skip — that tells you what conditions you see most."
    ],
    example: {
      title: "Hypothetical stock XYZ, 5-minute chart, three-step read",
      lines: [
        "Structure: HH $22.50, HL $22.00, HH $22.80 → direction up.",
        "Location: pullback to $22.30, near prior resistance-turned-support at $22.30.",
        "Confirmation (one indicator): price holding above VWAP at $22.15. ✓",
        "Plan (simulation): entry $22.35, stop $21.95 (below the HL), risk $0.40 per share.",
        "Target near the prior high area $23.15 → reward $0.80 → about 2R.",
        "If VWAP had been above price, the read fails confirmation → no trade."
      ]
    },
    mistakes: [
      "Skipping the structure step and starting with the indicator.",
      "Taking trades in poor locations because direction and indicator agreed.",
      "Adding a second and third indicator 'just to be sure', which brings back conflict.",
      "Forcing a trade when one step fails instead of writing 'no trade'.",
      "Changing the checklist after every losing trade, so it never gets tested properly."
    ],
    quiz: [
      { q: "What are the three steps of the simple read?", a: "Structure for direction, levels for location, one indicator for confirmation." },
      { q: "What should you do if one of the three steps fails?", a: "Wait or skip — 'no trade' is a valid result." },
      { q: "Why does a simple, repeatable read help learning?", a: "Every trade uses the same criteria, so your journal and backtests can show what actually works." }
    ]
  },

  35: {
    what: [
      "This week you learned what indicators are, how the common ones work, and — most importantly — their limits. Here is the recap.",
      "Moving averages (Day 29): average price over N periods (SMA equal weights, EMA favours recent bars). They show direction and can act as dynamic levels, but always lag. RSI (Day 30): momentum oscillator on a 0–100 scale; 70/30 are reference zones, not signals; strong trends stay extended; divergence is a warning that structure must confirm.",
      "Volume (Day 31): measures participation; breakouts with clearly higher volume show conviction, low-volume moves are suspect, and the open usually has the most volume. VWAP (Day 32): volume-weighted average price that resets each session; above it buyers have controlled the day on average, below it sellers have.",
      "Indicator limitations (Day 33): all indicators are derived from price, they lag and can conflict, and more of them does not mean more accuracy. Context + one indicator (Day 34): structure → direction, levels → location, indicator → confirmation. Simple beats complex."
    ],
    why: [
      "Review is where you check that you understand indicators as tools, not answers. If you still feel tempted to trade off RSI 70 or every VWAP cross, this is the day to catch it.",
      "Next week is risk management, which uses structure and levels to place stops. A clean, consistent chart read makes that much easier."
    ],
    how: [
      "Re-read this week's Trading Journal and Backtesting journal entries from Days 29–34.",
      "From memory, write one sentence each on MA, RSI, volume and VWAP, including one limitation of each.",
      "Run the three-step read on three new replays in the Trading Practice Lab using only your chosen indicator.",
      "Identify your weakest concept (often RSI divergence or VWAP behaviour early in the session) and rewrite it in your own words.",
      "Check your definitions against the lessons and fix any errors.",
      "Save your three-step checklist and your best insight to the Knowledge Vault."
    ],
    example: {
      title: "Hypothetical self-review walkthrough",
      lines: [
        "Journal re-read: on Day 30 I wrote 'RSI 75 → sell' — corrected to 'RSI 75 = extended, not a signal'.",
        "From memory: 'VWAP = Σ(price × volume) ÷ Σ volume, resets daily.' ✓",
        "Replay 1: uptrend, pullback to level, above VWAP → all three checks pass.",
        "Replay 2: range, price around VWAP → structure fails → no trade.",
        "Replay 3: downtrend but price above VWAP → conflict → no trade.",
        "Weakest concept: divergence. Rewritten: 'Divergence warns; a structure break confirms.' Saved to Knowledge Vault."
      ]
    },
    mistakes: [
      "Reviewing indicator definitions but not their limitations.",
      "Adding a new indicator during review week instead of consolidating the one you chose.",
      "Writing answers while looking at the lessons, which hides gaps in memory.",
      "Skipping the no-trade replays, which are just as important as the trades.",
      "Not saving the checklist to the Knowledge Vault, so you rebuild it from scratch later."
    ],
    quiz: [
      { q: "Name one limitation shared by all indicators.", a: "They are derived from past price/volume, so they lag (and can conflict with each other)." },
      { q: "What is the difference between VWAP and a moving average?", a: "VWAP weights prices by volume and resets each session; a moving average covers a fixed number of periods regardless of session." },
      { q: "What role should a single indicator play in your read?", a: "Confirmation only, after structure has given direction and levels have given location." }
    ]
  },

  36: {
    what: [
      "A stop-loss (or 'stop') is the price at which you exit a trade because your idea has been proven wrong. It is decided before you enter. In this app you practise stops in simulation; in real markets a stop order may also fill at a worse price than planned (called slippage), especially in fast moves.",
      "A good stop sits at a logical invalidation point — a price that, if reached, means the reason for the trade no longer holds. For a long trade in an uptrend, that is usually just beyond the last higher low or below a support level. A random distance like 'always 10 cents' ignores what the chart is saying.",
      "Every trade needs a stop, decided before entry. Without one, you have no way to calculate position size or risk/reward, and a small loss can quietly become a large one.",
      "Never widen a stop mid-trade. Moving it further away when price approaches it means you are increasing risk on a trade that is already going against you — the opposite of the plan."
    ],
    why: [
      "The stop is the single most important number in a trade plan, because it defines how much you can lose. Position sizing, risk/reward and daily loss limits all depend on it.",
      "Placing stops at logical levels also improves your learning: when a stop is hit, you know your idea was actually wrong, not that you were shaken out by normal noise."
    ],
    how: [
      "Before any simulated entry, identify the structural level that would invalidate the idea (last HL, support, range edge).",
      "Place the stop a small buffer beyond that level, not exactly on it, to allow for normal noise.",
      "Write the stop price in your Paper-trade/Simulation log before you click enter.",
      "If the stop would be so far away that the trade no longer makes sense, skip the trade rather than moving the stop closer to an illogical spot.",
      "During the trade, allow the stop to stay or move in your favour only — never further away.",
      "After each stopped-out trade, note in your Trading Journal whether the invalidation was real or the stop was placed poorly."
    ],
    example: {
      title: "Hypothetical stock XYZ, long setup in simulation",
      lines: [
        "Structure: uptrend; last higher low at $40.00.",
        "Planned entry on a pullback: $40.60.",
        "Logical stop: just below the HL with a small buffer → $39.90.",
        "Stop distance = $40.60 − $39.90 = $0.70 per share.",
        "Random stop alternative: 'always $0.20' → $40.40, inside normal pullback noise above the HL.",
        "If price reaches $39.90, the HL has broken — the idea is wrong and the trade is closed as planned."
      ]
    },
    mistakes: [
      "Entering without a stop and 'deciding later', which usually means deciding emotionally.",
      "Using a fixed random distance that ignores structure and levels.",
      "Placing the stop exactly on an obvious level, where normal noise often tags it.",
      "Widening the stop when price approaches it, which increases risk on a losing trade.",
      "Assuming a stop always fills at the exact price, forgetting slippage in fast real markets."
    ],
    quiz: [
      { q: "Where should a stop-loss be placed?", a: "At a logical invalidation point, slightly beyond a level or swing that would prove the idea wrong." },
      { q: "When should you decide your stop?", a: "Before entering the trade." },
      { q: "Why should you never widen a stop mid-trade?", a: "It increases risk on a trade that is already going against you and breaks your plan." }
    ]
  },

  37: {
    what: [
      "Position size is how many shares (or units) you trade. It should be calculated from your risk, not guessed or chosen because a round number 'feels right'.",
      "The formula is: position size = risk amount ÷ stop distance. The risk amount is the money you are willing to lose if the stop is hit (for example 1% of the account). The stop distance is the gap between your entry and your stop, per share.",
      "This means a wider stop leads to a smaller size, and a tighter stop leads to a larger size. The money at risk stays roughly the same on every trade; only the share count changes.",
      "You calculate before every trade. Also check that the resulting position value fits within your simulated account's buying power, and remember real trading adds costs (commissions, spreads, slippage) not included in the basic formula."
    ],
    why: [
      "Position sizing is what turns a stop-loss into actual risk control. Two traders with identical stops can have wildly different results if one buys 100 shares and the other 1,000.",
      "Keeping risk constant per trade also makes your journal meaningful: every loss is about the same size, so you can measure results in R (multiples of risk) and compare trades fairly."
    ],
    how: [
      "Decide your risk per trade as a percentage (this course uses 1% or less in examples).",
      "Convert it to money: account × risk % = risk amount.",
      "Mark your entry and logical stop, then compute stop distance = entry − stop (for a long).",
      "Divide: risk amount ÷ stop distance = shares. Round down, never up.",
      "Check position value (shares × entry) against your simulated buying power.",
      "Record the full calculation in your Paper-trade/Simulation log before entering.",
      "Practise the calculation on five different stop distances until it is automatic."
    ],
    example: {
      title: "Hypothetical $10,000 practice account, stock XYZ",
      lines: [
        "Risk per trade: 1% × $10,000 = $100.",
        "Trade A: entry $20.00, stop $19.50 → stop distance $0.50.",
        "Size A = $100 ÷ $0.50 = 200 shares (position value $4,000).",
        "Trade B: entry $20.00, stop $19.00 → stop distance $1.00.",
        "Size B = $100 ÷ $1.00 = 100 shares (position value $2,000).",
        "Both trades lose about $100 if stopped (before costs) — the wider stop simply gets a smaller size."
      ]
    },
    mistakes: [
      "Choosing a round share count like 100 or 500 regardless of the stop distance.",
      "Rounding the share count up, which risks more than planned.",
      "Moving the stop closer just to buy more shares, instead of using the logical stop.",
      "Forgetting to check whether the position value exceeds simulated buying power.",
      "Ignoring commissions, spreads and slippage, which make actual losses slightly larger than planned."
    ],
    quiz: [
      { q: "What is the position size formula?", a: "Position size = risk amount ÷ stop distance per share." },
      { q: "With a $10,000 account, 1% risk and a $0.25 stop, how many shares?", a: "$100 ÷ $0.25 = 400 shares." },
      { q: "What happens to size when the stop gets wider?", a: "Size gets smaller, so the money at risk stays the same." }
    ]
  },

  38: {
    what: [
      "Risk/reward (R:R) compares what you could lose on a trade to what you hope to gain. Risk is the distance from entry to stop; reward is the distance from entry to target.",
      "Traders often call one unit of risk '1R'. If your stop is $0.50 away, 1R = $0.50 per share. A target $1.00 away is then 2R, and the trade is described as 1:2 risk/reward. Measuring results in R lets you compare trades of different sizes.",
      "R:R and win rate must be considered together. Win rate is the percentage of trades that hit the target. Breakeven win rate = 1 ÷ (1 + reward/risk). At 1:2, that is 1 ÷ 3 ≈ 33%, so you need to be right about 34% of the time just to break even before costs. Higher R:R needs a lower win rate — but higher targets are also hit less often.",
      "Targets must be realistic. A 1:5 target that sits beyond strong resistance looks good on paper but rarely gets hit. Base targets on levels — prior highs, range edges, the day's high — then check what R that gives."
    ],
    why: [
      "Without R:R, you might take trades that risk $1 to make $0.20 and need to be right almost every time to survive. Thinking in R lets you judge whether a setup is worth taking before you enter.",
      "It also explains why a strategy can lose more often than it wins and still be positive in a simulation — or win often and still lose overall."
    ],
    how: [
      "For each simulated setup, mark entry and logical stop; calculate 1R = entry − stop.",
      "Find the nearest realistic target at a level (prior high, resistance, range edge).",
      "Compute R:R = (target − entry) ÷ (entry − stop).",
      "Set a minimum R:R for your Playbook (many educational examples use 1.5R or 2R) and skip setups below it.",
      "Record results in R in your Backtesting journal: +2R, −1R, +0.5R, and so on.",
      "After 20+ trades, compute win rate and average R to see whether they work together."
    ],
    example: {
      title: "Hypothetical stock XYZ, long setup in simulation",
      lines: [
        "Entry $15.00, stop $14.60 → 1R = $0.40 per share.",
        "Nearest resistance at $15.80 → reward $0.80 → 0.80 ÷ 0.40 = 2R (1:2).",
        "Breakeven win rate at 1:2 = 1 ÷ (1 + 2) ≈ 33.3% before costs.",
        "10 trades at 1:2 with 4 wins: 4 × (+2R) + 6 × (−1R) = +8R − 6R = +2R.",
        "Same 10 trades with 3 wins: 3 × (+2R) + 7 × (−1R) = −1R.",
        "A 1:5 target at $17.00 would sit beyond resistance — unrealistic, so 2R is used."
      ]
    },
    mistakes: [
      "Looking only at win rate and ignoring how big wins are compared with losses.",
      "Setting large R targets beyond obvious resistance just to make the ratio look good.",
      "Moving targets closer mid-trade out of fear, which shrinks your average win.",
      "Calculating R:R after entering instead of before.",
      "Forgetting that costs (commissions, slippage) raise the real breakeven win rate."
    ],
    quiz: [
      { q: "What is 1R?", a: "The distance from entry to stop — one unit of risk." },
      { q: "What breakeven win rate does a 1:2 risk/reward need (before costs)?", a: "About 33% — 1 ÷ (1 + 2)." },
      { q: "Where should targets come from?", a: "Realistic levels such as prior highs, resistance or range edges, then converted to R." }
    ]
  },

  39: {
    what: [
      "A maximum daily loss is a hard limit on how much you can lose in one day. When you hit it, you stop trading for the rest of the day — no exceptions. In this course it is expressed in R, typically 2R to 3R.",
      "If your risk per trade is 1% and your daily max is 3R, you stop after losing 3% in a day. That can be three full losing trades, or a mix of losses and partial losses that add up to −3R.",
      "The limit protects against tilt. Tilt is an emotional state after losses where frustration leads to rushed, oversized or off-plan trades to 'win it back'. Tilt is how one bad day becomes a disaster.",
      "The limit is non-negotiable once hit. It only works if you treat it as a rule decided in advance, not a suggestion you reconsider in the moment."
    ],
    why: [
      "Losing streaks are normal for any strategy. What separates survivable bad days from account-damaging ones is usually not the first losses, but what you do after them. A daily limit cuts that chain.",
      "Practising the rule in simulation builds the habit before it ever matters with real consequences."
    ],
    how: [
      "Choose a daily max in R (for example 3R) and write it at the top of your Playbook.",
      "Convert it to money at the start of each practice session: daily max = risk per trade × R limit.",
      "Track your running total in R in your Paper-trade/Simulation log after every trade.",
      "When the total reaches the limit, close the practice session immediately.",
      "Write a short Psychology journal entry about how you felt when you hit it.",
      "Review weekly: on days you hit the limit, what happened in the trades leading up to it?"
    ],
    example: {
      title: "Hypothetical $10,000 practice account, 1% risk, 3R daily max",
      lines: [
        "1R = 1% × $10,000 = $100; daily max = 3 × $100 = $300.",
        "Trade 1: −1R (−$100). Running total: −1R.",
        "Trade 2: +0.5R (+$50). Running total: −0.5R.",
        "Trade 3: −1R; Trade 4: −1R. Running total: −2.5R (−$250).",
        "Trade 5: −0.5R. Running total: −3R (−$300) → daily max hit, session ends.",
        "Without the rule, a frustrated 'win it back' trade at triple size could have turned −3R into −6R."
      ]
    },
    mistakes: [
      "Not setting a daily limit until after a bad day has already happened.",
      "Raising the limit mid-session because you feel the next trade will recover the losses.",
      "Switching to a different account or simulation after hitting the limit.",
      "Increasing size after losses to win it back, which is the core of tilt.",
      "Only counting full losses and ignoring partial losses in the running total."
    ],
    quiz: [
      { q: "What is a maximum daily loss?", a: "A hard limit, often 2–3R, after which you stop trading for the day." },
      { q: "With 1% risk on a $10,000 account and a 2R daily max, what is the limit in money?", a: "2 × $100 = $200." },
      { q: "What is tilt?", a: "An emotional state after losses that leads to rushed, oversized or off-plan trades." }
    ]
  },

  40: {
    what: [
      "A maximum number of trades is a daily cap — for example three trades — after which you stop, regardless of whether you are up or down.",
      "Overtrading means taking more trades than your plan supports, usually low-quality ones taken out of boredom, excitement or frustration. It is one of the most common beginner mistakes.",
      "Each trade carries costs — commissions, spreads and slippage in real markets — and every extra low-quality trade dilutes the results of your good ones. This is what traders mean when they say overtrading 'erodes your edge'. An edge is a small statistical advantage a strategy may have over many trades; it is never a guarantee.",
      "A trade cap forces selectivity. Knowing you only have three trades makes you wait for setups that pass your full checklist. Fewer, higher-quality trades usually beat many average ones."
    ],
    why: [
      "Beginners often feel they must be trading to be learning. In practice, the skill is in waiting and choosing. A cap turns that into a concrete rule.",
      "Stopping after the cap even when you are winning also matters: a good start often breeds overconfidence and sloppy trades that give the gains back."
    ],
    how: [
      "Set a daily trade cap in your Playbook (for example 3) before your practice session starts.",
      "Before each simulated trade, confirm it passes your full checklist (structure, level, one indicator, stop, size, R:R).",
      "Number your trades in the Paper-trade/Simulation log: 1/3, 2/3, 3/3.",
      "After trade 3, close the session — win or lose.",
      "Grade each trade A/B/C for quality in your Trading Journal.",
      "After two weeks, compare results from A-grade trades to C-grade trades."
    ],
    example: {
      title: "Hypothetical practice comparison over 10 sessions",
      lines: [
        "Without a cap: 80 trades, average −0.05R after costs → total −4R.",
        "Many trades were mid-range entries graded C.",
        "With a 3-trade cap: 28 trades (some days fewer), average +0.25R → total +7R.",
        "The capped sessions skipped most C-grade trades.",
        "These numbers are hypothetical and illustrate selectivity — they are not a promise of results.",
        "Takeaway logged: 'The cap made me wait for my checklist.'"
      ]
    },
    mistakes: [
      "Treating the cap as a target to reach every day instead of a maximum.",
      "Continuing after the cap because you are winning and feel in the zone.",
      "Continuing after the cap because you are losing and want to recover.",
      "Taking quick 'scratch' trades that you do not count toward the cap.",
      "Lowering your checklist standards to use up the remaining trades."
    ],
    quiz: [
      { q: "Why does a daily trade cap help?", a: "It forces selectivity, so you only take trades that fully meet your plan." },
      { q: "Should you stop after the cap if you are winning?", a: "Yes — the cap applies win or lose, protecting against overconfidence." },
      { q: "What is overtrading?", a: "Taking more trades than your plan supports, usually low-quality ones driven by emotion." }
    ]
  },

  41: {
    what: [
      "Risk per trade is the fixed fraction of your account you are willing to lose if a single trade hits its stop. Educational material commonly uses 0.5% to 1%.",
      "Keeping it small means a normal losing streak cannot destroy the account. Ten losses in a row at 1% leaves about 90% of the account — a setback. Ten losses at 10% leaves about 35% — devastating, and you then need roughly a 187% gain just to get back to where you started.",
      "Losses and recoveries are not symmetrical. A 10% drawdown needs about an 11% gain to recover; a 50% drawdown needs 100%. A drawdown is the decline from an account's peak to its low. Small risk keeps drawdowns in the range you can recover from.",
      "Risk is chosen before reward. You decide how much you can lose first, then calculate size and check the target. Consistency over excitement: the same small risk on every trade beats big bets on 'sure things', because nothing in trading is sure."
    ],
    why: [
      "Any strategy, even a sound one, will have losing streaks. Your risk per trade decides whether you survive them long enough to learn. It is the most important protection you control.",
      "A fixed risk also keeps your emotions steadier: no single trade can hurt you badly, so you can follow your plan instead of reacting to fear."
    ],
    how: [
      "Choose a fixed risk per trade for practice (for example 0.5% or 1%) and write it in your Playbook.",
      "Use the Day 37 formula on every simulated trade: risk amount ÷ stop distance = shares.",
      "Do not increase risk because a setup 'looks perfect' — every trade uses the same percentage.",
      "Simulate a 10-trade losing streak on paper at your chosen risk and at 5% or 10%, and compare the ending balances.",
      "Track your simulated account's peak and current drawdown in your Trading Journal weekly.",
      "Write in your Psychology journal how a 1% loss feels versus how you imagine a 10% loss would feel."
    ],
    example: {
      title: "Hypothetical $10,000 practice account, 10 losses in a row",
      lines: [
        "At 1% risk per trade (compounding): $10,000 × 0.99^10 ≈ $9,044 → down ~9.6%.",
        "Gain needed to recover: 10,000 ÷ 9,044 − 1 ≈ 10.6%.",
        "At 10% risk per trade: $10,000 × 0.90^10 ≈ $3,487 → down ~65%.",
        "Gain needed to recover: 10,000 ÷ 3,487 − 1 ≈ 187%.",
        "Same strategy, same losing streak — risk per trade decided the outcome.",
        "Losing streaks of this length are possible even for reasonable strategies over many trades."
      ]
    },
    mistakes: [
      "Raising risk on a 'high-confidence' trade, which assumes certainty that does not exist.",
      "Increasing risk after losses to recover faster, which deepens drawdowns.",
      "Choosing size first and only then working out how much is at risk.",
      "Underestimating how common long losing streaks are over hundreds of trades.",
      "Ignoring the asymmetry between losses and the gains needed to recover them."
    ],
    quiz: [
      { q: "What range of risk per trade is commonly used in educational material?", a: "About 0.5% to 1% of the account per trade." },
      { q: "Roughly what gain is needed to recover from a 50% drawdown?", a: "100%." },
      { q: "What does 'risk is chosen before reward' mean?", a: "You decide the maximum you can lose first, then size the position and check the target." }
    ]
  },

  42: {
    what: [
      "This week you learned the rules that keep a practice account alive. Here is the recap.",
      "Stop-loss (Day 36): the price where your idea is proven wrong, placed at a logical invalidation point beyond a level or swing, decided before entry and never widened. Position sizing (Day 37): size = risk amount ÷ stop distance; wider stops mean smaller size; risk stays constant; calculate every time.",
      "Risk/reward (Day 38): 1R is the distance to your stop; targets are measured in R and should sit at realistic levels; at 1:2 the breakeven win rate is about 33% before costs, so R:R and win rate must be read together. Maximum daily loss (Day 39): a hard limit, often 2–3R, that ends the session and protects against tilt.",
      "Maximum number of trades (Day 40): a daily cap that forces selectivity and stops overtrading, win or lose. Risk per trade (Day 41): a small, fixed fraction (commonly 0.5–1%) so losing streaks are survivable; losses and recoveries are asymmetric, and risk is chosen before reward."
    ],
    why: [
      "Risk management is the part of trading education that most directly decides whether a learner survives long enough to improve. It does not make any trade more likely to win; it makes losing trades survivable.",
      "These rules only work as a system: stop → size → R:R → daily limits. Reviewing them together shows where one weak link could undo the others."
    ],
    how: [
      "Re-read this week's Trading Journal, Paper-trade/Simulation log and Psychology journal entries from Days 36–41.",
      "From memory, write your full risk rule set: risk %, daily max in R, trade cap, minimum R:R, stop rules.",
      "Work through three hypothetical setups by hand: stop, size, target, R:R.",
      "Check your simulation log for any rule breaks (widened stop, extra trade, oversized position) and note the trigger.",
      "Identify your weakest concept and rewrite it in your own words.",
      "Save your final risk rule set to the Playbook and your best insight to the Knowledge Vault."
    ],
    example: {
      title: "Hypothetical self-review walkthrough, $10,000 practice account",
      lines: [
        "Rules from memory: 1% risk, 3R daily max, 3-trade cap, min 2R, stops at structure. ✓",
        "Setup check: entry $30.00, stop $29.60 → 1R = $0.40; size = $100 ÷ $0.40 = 250 shares.",
        "Target at resistance $30.80 → reward $0.80 → 2R ✓ meets minimum.",
        "Log review: on Day 39 I took a 4th trade after hitting the cap — rule break found.",
        "Trigger noted in Psychology journal: frustration after two losses.",
        "Weakest concept: breakeven win rate. Rewritten: '1 ÷ (1 + R:R)'. Saved to Knowledge Vault."
      ]
    },
    mistakes: [
      "Reviewing each rule on its own instead of how they work together as a system.",
      "Ignoring rule breaks in your log because the trade happened to be profitable.",
      "Doing the position size maths in your head instead of writing it out.",
      "Loosening a rule during review because it 'cost' you a winner.",
      "Not saving the final rule set, so it drifts from week to week."
    ],
    quiz: [
      { q: "With a $10,000 practice account, 1% risk and a $0.50 stop, what is the position size?", a: "$100 ÷ $0.50 = 200 shares." },
      { q: "Why should a stop never be widened mid-trade?", a: "It increases risk on a trade already going against you and breaks the size calculation." },
      { q: "Why use a daily loss limit and a trade cap together?", a: "The loss limit caps damage on bad days, and the trade cap prevents overtrading on any day — together they protect against tilt." }
    ]
  }
};
