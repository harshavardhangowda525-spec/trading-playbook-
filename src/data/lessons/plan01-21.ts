import type { LessonPlan } from './types';

// Outline for days 1-21 (Phases 1-3: ETF Foundations, Reading ETF Charts, Market Context).
// Educational / simulation content only — not financial advice.

export const PLAN: LessonPlan[] = [
  {
    day: 1,
    title: "What Is an ETF?",
    concept: "An exchange-traded fund (ETF) is a fund that holds a basket of assets and whose units trade on an exchange like a share. This journey studies intraday ETF trading as a skill, using only simulation and historical data.",
    keyPoints: [
      "An ETF holds a basket; you trade units of the fund",
      "Most Indian ETFs track an index or a commodity price",
      "Day trading = open and close within one session",
      "Probabilities and risk control, never certainty or promises"
    ],
    learn: "ETF basics & fund vs index",
    practice: "Open NIFTYBEES chart in Markets",
    journal: "Why I want to learn this"
  },
  {
    day: 2,
    title: "How ETFs Trade on the NSE (units, market makers, iNAV)",
    concept: "ETF units are bought and sold on the NSE between investors, while authorised participants create and redeem units with the fund house in large blocks. Market makers quote prices, and the iNAV shows an estimate of what one unit is worth during the day.",
    keyPoints: [
      "Secondary market: units trade between buyers and sellers",
      "Primary market: APs create/redeem in large creation units",
      "Market makers post bids and asks to add liquidity",
      "iNAV estimates fair value per unit intraday"
    ],
    learn: "ETF structure & iNAV",
    practice: "Compare NIFTYBEES with Nifty 50 in Markets",
    journal: "3 observations"
  },
  {
    day: 3,
    title: "Types of ETFs: Index, Sector, Gold & More",
    concept: "ETFs come in families — broad index, sector, thematic, commodity, international and debt/liquid. Each family moves for different reasons, so knowing what an ETF holds tells you what drives its chart.",
    keyPoints: [
      "Broad index ETFs: NIFTYBEES, JUNIORBEES",
      "Sector ETFs: BANKBEES, ITBEES, PSUBNKBEES",
      "Commodity ETFs: GOLDBEES, SILVERBEES",
      "International and liquid ETFs behave differently again"
    ],
    learn: "ETF families & what drives each",
    practice: "Sort 8 ETFs into families",
    journal: "Which family suits learning first"
  },
  {
    day: 4,
    title: "NSE Session, Hours & Order Types",
    concept: "The NSE regular session runs 09:15-15:30 IST with a pre-open from 09:00. Market, limit and stop-loss orders each trade off speed against price control, and intraday positions must be closed before the session ends.",
    keyPoints: [
      "Pre-open 09:00-09:15, regular 09:15-15:30 IST",
      "Market orders: speed; limit orders: price control",
      "Stop-loss orders trigger at a set price",
      "Brokers square off intraday positions before the close"
    ],
    learn: "Session times & order types",
    practice: "Place market and limit orders in Paper",
    journal: "Which order type and why"
  },
  {
    day: 5,
    title: "Liquidity, Spread & Premium/Discount to iNAV",
    concept: "Liquidity is how easily you can trade without moving the price. The spread is the gap between best bid and best ask, and an ETF can trade above (premium) or below (discount) its iNAV — all three must be checked before any simulated trade.",
    keyPoints: [
      "Check volume, traded value and depth first",
      "Spread = best ask - best bid, paid every round trip",
      "Premium/discount = price vs iNAV, in percent",
      "Thin ETFs can have wide spreads and big gaps from iNAV"
    ],
    learn: "Liquidity, spread & premium/discount",
    practice: "Run the ETF eligibility check in Practice",
    journal: "Spread and premium for 3 ETFs"
  },
  {
    day: 6,
    title: "The Real Cost of an Intraday ETF Trade",
    concept: "Every intraday ETF trade pays brokerage, statutory charges, GST and the spread. Adding them up shows the minimum move a trade needs just to break even — costs that are easy to ignore and impossible to avoid.",
    keyPoints: [
      "Brokerage, STT, exchange fee, SEBI fee, stamp, GST",
      "Gold and liquid ETFs have no STT",
      "Spread and slippage are hidden costs too",
      "Rates change — keep the app's cost model current"
    ],
    learn: "Intraday cost stack & break-even move",
    practice: "Price a hypothetical round trip",
    journal: "My break-even move in percent"
  },
  {
    day: 7,
    title: "Weekly Review — ETF Foundations",
    concept: "Consolidate the week: ETF structure, how units trade, ETF families, session and orders, liquidity checks and costs. Recall first, then check, then fix your weakest concept.",
    keyPoints: [
      "Recall each topic from memory before re-reading",
      "Find and rewrite your weakest concept",
      "Turn the week's lessons into Playbook rules",
      "Simulation only — no real money"
    ],
    learn: "Recap of days 1-6",
    practice: "Eligibility check on 3 ETFs",
    journal: "Weakest concept rewritten",
    review: true
  },
  {
    day: 8,
    title: "Candlesticks on ETF Charts",
    concept: "A candlestick shows the open, high, low and close for one period. On ETF charts, candles reflect both the underlying basket and the quality of trading in the units, so thin ETFs can print odd candles.",
    keyPoints: [
      "Body = open to close; wicks = high and low",
      "Colour shows whether close was above open",
      "Thin ETFs can show gaps and spiky wicks",
      "One candle is a clue, not a signal"
    ],
    learn: "OHLC candles on ETF charts",
    practice: "Read 20 candles in Replay",
    journal: "3 candles described in words"
  },
  {
    day: 9,
    title: "Timeframes: 1m, 5m, 15m",
    concept: "The same session looks different on 1-minute, 5-minute and 15-minute charts. Lower timeframes show detail and noise; higher ones show structure. Pick one primary and one context timeframe and keep them fixed.",
    keyPoints: [
      "1m = detail and noise; 15m = structure",
      "5m is a common primary for intraday ETFs",
      "Use a higher timeframe for context",
      "Keep timeframes consistent across practice"
    ],
    learn: "Choosing primary & context timeframes",
    practice: "View one session on 1m, 5m, 15m",
    journal: "My chosen timeframe pair"
  },
  {
    day: 10,
    title: "Volume & Traded Value",
    concept: "Volume counts units traded; traded value multiplies units by price. Because ETF unit prices vary widely, traded value is the fairer way to compare activity, and both help judge whether a move has participation.",
    keyPoints: [
      "Volume = units traded in a period",
      "Traded value = volume × price, in rupees",
      "Compare ETFs by traded value, not unit count",
      "Rising volume on a move shows participation"
    ],
    learn: "Volume vs traded value",
    practice: "Compare traded value of 4 ETFs",
    journal: "Most and least active ETF"
  },
  {
    day: 11,
    title: "VWAP and the Intraday Session",
    concept: "VWAP (volume-weighted average price) is the average price paid during the session, weighted by volume. Many intraday participants watch it, so it often acts as a reference for whether buyers or sellers have controlled the day so far.",
    keyPoints: [
      "VWAP resets at the start of every session",
      "Price above VWAP: buyers in control so far",
      "Price below VWAP: sellers in control so far",
      "VWAP is a reference, not a guaranteed level"
    ],
    learn: "How VWAP is calculated & used",
    practice: "Track price vs VWAP in Replay",
    journal: "Times price crossed VWAP"
  },
  {
    day: 12,
    title: "Opening Range & Session Phases",
    concept: "The opening range is the high and low of the first minutes of the session. The day then tends to pass through phases — active open, quieter midday and an active close — that change how ETFs move.",
    keyPoints: [
      "Opening range = high/low of first 15 or 30 min",
      "Open is often the most volatile phase",
      "Midday is often slower and choppier",
      "Final hour can pick up as positions close"
    ],
    learn: "Opening range & session phases",
    practice: "Mark the 15-min opening range in Replay",
    journal: "Phase-by-phase session notes"
  },
  {
    day: 13,
    title: "Gaps & Overnight Moves",
    concept: "A gap is when the session opens away from the previous close. ETFs gap because their underlying assets move while the NSE is closed — global markets, news and, for gold or international ETFs, overseas prices.",
    keyPoints: [
      "Gap up/down = open above/below prior close",
      "Underlying moves overnight cause most gaps",
      "Gold and international ETFs follow overseas markets",
      "Gaps can fill or extend — no rule is certain"
    ],
    learn: "Why ETFs gap & how gaps behave",
    practice: "Log 5 gap days in Replay",
    journal: "Gap size and what followed"
  },
  {
    day: 14,
    title: "Weekly Review — Reading ETF Charts",
    concept: "Recap candles, timeframes, volume and traded value, VWAP, the opening range, session phases and gaps. Practise reading a full replayed session and describing it in words.",
    keyPoints: [
      "Describe a session using this week's vocabulary",
      "Check chart reads against volume and VWAP",
      "Fix your weakest chart concept",
      "Reading is not predicting"
    ],
    learn: "Recap of days 8-13",
    practice: "Narrate one full session in Replay",
    journal: "Session story in 6 lines",
    review: true
  },
  {
    day: 15,
    title: "ETF vs Its Index (tracking, NIFTYBEES vs Nifty 50)",
    concept: "An index ETF aims to match its index, but costs, cash holdings and trading frictions create tracking difference and tracking error. Intraday, the unit price can also drift from iNAV — compare percentage moves, not points.",
    keyPoints: [
      "Tracking difference = ETF return - index return",
      "Tracking error = variability of that difference",
      "Compare percentage moves, not rupees vs points",
      "Index leads; the ETF price should follow closely"
    ],
    learn: "Tracking difference vs tracking error",
    practice: "NIFTYBEES vs Nifty 50 % move in Markets",
    journal: "Where ETF and index diverged"
  },
  {
    day: 16,
    title: "Support & Resistance",
    concept: "Support is a price area where falling prices have tended to stop; resistance is an area where rising prices have tended to stall. They are zones built from past reactions, prior day levels and round numbers — not exact lines.",
    keyPoints: [
      "Levels are zones, not single prices",
      "Prior day high, low and close often matter",
      "More clean reactions = more relevant level",
      "Broken support can become resistance and vice versa"
    ],
    learn: "Drawing support & resistance zones",
    practice: "Mark 3 levels before replaying a session",
    journal: "Which levels held or broke"
  },
  {
    day: 17,
    title: "Market Structure: Highs & Lows",
    concept: "Market structure is the sequence of swing highs and swing lows. Higher highs and higher lows describe an uptrend, lower highs and lower lows a downtrend, and overlapping swings a range.",
    keyPoints: [
      "Swing high/low = local turning point",
      "HH + HL = uptrend; LH + LL = downtrend",
      "Overlapping swings = range or chop",
      "A structure break is a warning, not a verdict"
    ],
    learn: "Swing highs, lows & structure",
    practice: "Label swings on 2 sessions in Replay",
    journal: "Structure at open, midday, close"
  },
  {
    day: 18,
    title: "Trending, Ranging or Choppy?",
    concept: "Every session can be roughly classified as trending, ranging or choppy. Classifying the market before choosing a strategy matters because each strategy only fits certain conditions — and choppy sessions often fit none.",
    keyPoints: [
      "Trending: clear structure, price stays one side of VWAP",
      "Ranging: repeated tests of clear upper/lower edges",
      "Choppy: overlapping candles, VWAP crossed often",
      "No-trade is a valid classification outcome"
    ],
    learn: "Classifying market conditions",
    practice: "Classify 5 sessions in Replay",
    journal: "Conditions and my reasons"
  },
  {
    day: 19,
    title: "Sector ETFs & Rotation",
    concept: "Sector ETFs like BANKBEES, ITBEES and PSUBNKBEES track one part of the market. Comparing their relative strength to NIFTYBEES shows where activity is concentrated — rotation — on a given day.",
    keyPoints: [
      "Sector ETFs concentrate exposure to one industry",
      "Relative strength = sector % move vs Nifty % move",
      "Banks are a large weight in Nifty 50",
      "Sector ETFs are often less liquid — check first"
    ],
    learn: "Relative strength & rotation",
    practice: "Rank 4 sector ETFs vs NIFTYBEES",
    journal: "Strongest and weakest sector today"
  },
  {
    day: 20,
    title: "Gold ETFs Behave Differently",
    concept: "Gold ETFs track the domestic price of gold, which is driven by international gold prices and the rupee-dollar rate rather than Indian company earnings. They follow different hours, gaps and costs from equity ETFs.",
    keyPoints: [
      "Driven by global gold price and USD/INR",
      "Gold trades overseas while NSE is closed",
      "No STT on gold ETFs; other charges apply",
      "Often moves independently of Nifty"
    ],
    learn: "What drives gold ETFs",
    practice: "Compare GOLDBEES and NIFTYBEES in Markets",
    journal: "Days gold and Nifty diverged"
  },
  {
    day: 21,
    title: "Weekly Review — Market Context",
    concept: "Recap tracking, support and resistance, structure, condition classification, sector rotation and gold. Build a repeatable pre-session context checklist you will use in every later phase.",
    keyPoints: [
      "Context before setups, always",
      "Classify the condition before choosing a strategy",
      "Check which ETF families are leading",
      "Write your context checklist in the Playbook"
    ],
    learn: "Recap of days 15-20",
    practice: "Full context check on one session",
    journal: "My pre-session context checklist",
    review: true
  }
];
