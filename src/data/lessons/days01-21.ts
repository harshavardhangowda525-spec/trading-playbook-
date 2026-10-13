import type { LessonContent } from './types';

// Full lesson content for days 1-21 (ETF Foundations, Reading ETF Charts, Market Context).
// Educational / simulation content only — not financial advice. All numbers are hypothetical.

export const CONTENT: Record<number, LessonContent> = {
  1: {
    what: [
      "An ETF (exchange-traded fund) is an investment fund that holds a basket of assets — for example the 50 companies in the Nifty 50 index, or physical gold — and divides ownership of that basket into 'units'. The units are listed on a stock exchange such as the NSE (National Stock Exchange of India), so you can buy and sell them during market hours just like a share. One unit gives you a small slice of the whole basket.",
      "Most ETFs in India are 'passive': they aim to track an index (a rule-based list of securities, such as the Nifty 50) or a commodity price (such as gold) rather than having a manager pick investments. The fund house that runs the ETF is called an AMC (asset management company). It charges an annual fee called the expense ratio, which is taken out of the fund's assets a little each day.",
      "Day trading means opening and closing a position (a trade you currently hold) within the same trading session, so nothing is held overnight. This curriculum studies day trading using ETFs only — not individual company shares, derivatives, currencies or crypto. ETFs are a sensible learning vehicle because a broad index ETF is diversified and cannot be moved much by one company's news, but they still carry real risk: prices can fall quickly, and costs eat into small intraday moves.",
      "Be honest about the odds from day one. Most people who day trade with real money lose money. Everything in this journey is educational and simulated — historical replay, backtests and paper trading with virtual money. Nothing here is financial advice, and no lesson promises profit. The goal is understanding and disciplined process, measured in simulation."
    ],
    why: [
      "If you do not know what an ETF actually is, you cannot understand why its price moves. A NIFTYBEES chart moves because the 50 Nifty companies move; a GOLDBEES chart moves because gold and the rupee move. Every later lesson — iNAV, tracking, liquidity, costs, setups — builds on the idea that an ETF is a wrapper around a basket.",
      "It also sets your mental model for trading: a repetitive process of taking small, controlled, simulated risks under uncertainty. Patterns you learn later describe probabilities, never certainties. Starting with that expectation protects you from the belief that some method can predict the next candle."
    ],
    how: [
      "In the Trading Journal, write a one-paragraph definition of an ETF in your own words, including the words 'basket', 'units' and 'exchange'.",
      "Open Trading → Markets and view the NIFTYBEES chart, then the Nifty 50 index chart. Do not trade — just notice that the two lines move together.",
      "Open Trading → Learn and skim the introduction of the ETF Strategy Course so you know the five modules you will meet later (Trend, Breakout, Pullback, Range, Risk).",
      "Write a first Playbook rule: 'All trades during this journey are simulated. ETFs only. No real money.'",
      "In the Psychology journal, write why you want to learn ETF day trading and what you expect from it. You will reread this on every review day.",
      "Ask the AI Coach in Trading → Ask AI to explain the difference between an index and an ETF, then check its answer against this lesson."
    ],
    example: {
      title: "Hypothetical example: what one ETF unit represents",
      lines: [
        "A hypothetical index ETF holds shares of all 50 index companies in index weights, worth ₹50,00,00,000 in total.",
        "It has 2,00,00,000 units outstanding, so each unit represents ₹50,00,00,000 ÷ 2,00,00,000 = ₹250 of the basket.",
        "If the basket rises 1% during the day, each unit's underlying value rises to about ₹252.50.",
        "You buy one unit for roughly ₹250 on the exchange; you never deal with the 50 shares individually.",
        "The expense ratio (say a hypothetical 0.05% a year) is deducted gradually from the fund, not charged per trade.",
        "All figures are invented for illustration and do not describe any real ETF."
      ]
    },
    mistakes: [
      "Thinking an ETF is a single company share, which leads to misreading what drives its price.",
      "Assuming a diversified ETF cannot fall sharply in a day, when a broad market sell-off moves the whole basket.",
      "Treating ETF day trading as a quick way to make money, which encourages oversized positions and ignores costs.",
      "Skipping simulation and jumping to real money, turning free learning mistakes into expensive ones.",
      "Believing a chart pattern can tell you what happens next with certainty, when it only shifts the odds."
    ],
    quiz: [
      { q: "What does one ETF unit represent?", a: "A small proportional slice of the whole basket of assets the fund holds." },
      { q: "What is a day trade?", a: "A position opened and closed within the same trading session, with nothing held overnight." },
      { q: "What is an expense ratio?", a: "The ETF's annual management fee, deducted gradually from the fund's assets rather than charged per trade." }
    ]
  },

  2: {
    what: [
      "ETF units change hands in two places. The secondary market is the NSE itself, where ordinary traders buy units from and sell units to each other through brokers during market hours. The primary market is where new units are created or existing units are redeemed (cancelled) directly with the AMC. Most traders only ever use the secondary market.",
      "Creation and redemption happen in large blocks called creation units and are carried out by authorised participants (APs) — large institutions approved by the AMC — and by market makers. To create units, an AP delivers the basket of securities (or cash) to the AMC and receives new ETF units. To redeem, it returns units and gets the basket or cash back. This mechanism lets the supply of units expand or shrink with demand.",
      "A market maker is a firm, often appointed by the AMC, that continuously posts both a bid (a price it will buy at) and an ask (a price it will sell at) on the exchange. This adds liquidity, meaning there is usually someone to trade with. If the ETF's price drifts far above or below the value of its basket, APs and market makers have an incentive to create or redeem units and trade against the gap (arbitrage), which tends to pull the price back toward fair value.",
      "The NAV (net asset value) is the value of the fund's holdings per unit, officially calculated at the end of the day. The iNAV (indicative NAV) is an estimate of that value published repeatedly during the session, based on live prices of the underlying basket. Comparing the ETF's traded price with its iNAV tells you whether units are trading at fair value, at a premium (above) or at a discount (below)."
    ],
    why: [
      "Knowing who is on the other side of your trade explains a lot of ETF behaviour. When market makers are active, spreads are tight and the price hugs iNAV. When they step back — at the open, in fast markets or in thinly traded ETFs — spreads widen and the price can drift from fair value, which directly affects your fills in simulation.",
      "iNAV also gives you a sanity check no single stock offers: you can see roughly what the units are 'worth' right now. Buying well above iNAV means paying extra for nothing."
    ],
    how: [
      "Open Trading → Markets and place NIFTYBEES and the Nifty 50 index side by side on the same timeframe.",
      "Note the percentage change of each from the previous close at three times of day; they should be close, not identical.",
      "Find where your data source or the AMC website publishes iNAV for the ETF, and note how often it updates.",
      "Write the formula in your Trading Journal: premium/discount % = (traded price - iNAV) ÷ iNAV × 100.",
      "Ask the AI Coach in Trading → Ask AI to explain creation units in two sentences, then rewrite its answer in your own words.",
      "Record three observations about how closely the ETF tracked its index today."
    ],
    example: {
      title: "Hypothetical example: arbitrage pulling price back to iNAV",
      lines: [
        "Hypothetical ETF iNAV: ₹250.00. A burst of buying pushes the traded price to ₹251.25.",
        "Premium = (251.25 - 250.00) ÷ 250.00 × 100 = 0.5%.",
        "A market maker can sell units at ₹251.25 and buy the underlying basket worth ₹250.00.",
        "It later delivers the basket to the AMC for new units (creation) to cover what it sold.",
        "That selling pressure tends to pull the price back toward ₹250 — a tendency, not a guarantee.",
        "All prices are hypothetical and simplified (costs ignored)."
      ]
    },
    mistakes: [
      "Assuming you trade with the AMC, when retail traders buy and sell on the exchange with other participants.",
      "Ignoring iNAV and paying a premium without realising it, which raises your effective entry cost.",
      "Thinking market makers guarantee a fair price at all times, when they can widen quotes or pause in fast markets.",
      "Confusing end-of-day NAV with intraday iNAV, which leads to comparing today's price with yesterday's value.",
      "Expecting the ETF to match its index to the paisa, when costs and timing always create small differences."
    ],
    quiz: [
      { q: "Who creates and redeems ETF units in large blocks?", a: "Authorised participants (and market makers) dealing with the AMC in creation units." },
      { q: "What is iNAV?", a: "An indicative, intraday estimate of the value of the ETF's basket per unit, updated during the session." },
      { q: "If the traded price is above iNAV, is the ETF at a premium or a discount?", a: "A premium." }
    ]
  },

  3: {
    what: [
      "Broad-market index ETFs track a wide index. In India the classic examples are NIFTYBEES (tracking the Nifty 50, India's 50 large companies) and JUNIORBEES (tracking the Nifty Next 50, the next 50 by size). They are usually the most liquid ETFs and move with the overall market mood.",
      "Sector ETFs track one industry, such as BANKBEES (Nifty Bank), ITBEES (Nifty IT) or PSUBNKBEES (public-sector banks). Thematic ETFs track a theme, such as CPSEETF (central public-sector enterprises). Because they hold fewer, more similar companies, they are less diversified and can move much more than the broad market on sector news.",
      "Commodity ETFs, such as GOLDBEES and SILVERBEES, hold physical gold or silver (or closely linked instruments) and follow precious-metal prices converted into rupees, not Indian company earnings. International ETFs, such as MON100 (tracking the US Nasdaq-100), hold overseas shares and depend on foreign markets and the exchange rate. Liquid and debt ETFs hold short-term government or money-market instruments and barely move intraday, so they are unsuitable for day trading practice.",
      "A useful habit: before looking at any ETF chart, ask 'what does it hold, and what moves that?' The answer tells you which news, which hours and which other charts matter. Note that US ETFs such as SPY or QQQ follow the same ideas; this course uses NSE ETFs by default."
    ],
    why: [
      "Different ETF families behave differently intraday. A broad index ETF tends to move smoothly with the market; a sector ETF can swing sharply; a gold ETF may rise on a day the Nifty falls; an international ETF may gap because of moves while India was asleep. Choosing practice ETFs without knowing this leads to confusing results.",
      "It also helps with risk. Concentrated sector and thematic ETFs can move further and are often less liquid, so position size and spread checks matter even more."
    ],
    how: [
      "List these ETFs in your Trading Journal and label each with its family: NIFTYBEES, JUNIORBEES, BANKBEES, ITBEES, PSUBNKBEES, CPSEETF, GOLDBEES, SILVERBEES, MON100.",
      "For each, write one line on what drives its price (for example 'BANKBEES — large Indian bank shares').",
      "In Trading → Markets, view NIFTYBEES, BANKBEES and GOLDBEES on the same day and compare their direction.",
      "Open Trading → Practice and run the ETF eligibility check on two ETFs from different families; note what it flags.",
      "Choose one broad index ETF as your main learning instrument for the coming weeks and record it in the Playbook.",
      "Write a Playbook rule: 'Liquid and debt ETFs are excluded from intraday practice.'"
    ],
    example: {
      title: "Hypothetical example: same day, three ETF families",
      lines: [
        "Hypothetical session: the broad market falls 0.8% on weak global cues.",
        "Hypothetical broad index ETF: -0.8%, moving almost in step with its index.",
        "Hypothetical bank ETF: -1.6%, because bank shares fell more than the overall market.",
        "Hypothetical gold ETF: +0.4%, because gold rose overseas and the rupee weakened slightly.",
        "Lesson: the same 'market day' looked very different depending on what each ETF holds.",
        "All moves are invented for illustration and are not historical data."
      ]
    },
    mistakes: [
      "Treating every ETF as 'the market', when sector, gold and international ETFs follow different drivers.",
      "Practising on a thin thematic ETF first, where wide spreads and erratic candles make lessons hard to read.",
      "Trying to day trade liquid or debt ETFs, which barely move and offer nothing to learn about intraday price action.",
      "Ignoring exchange-rate effects on international and gold ETFs, which can move them even when the underlying is flat.",
      "Assuming a sector ETF is as diversified as a broad index ETF, which understates how far it can move."
    ],
    quiz: [
      { q: "Which ETF family tends to be most liquid and smoothest intraday?", a: "Broad-market index ETFs such as NIFTYBEES." },
      { q: "What mainly drives a gold ETF's price?", a: "The international gold price and the rupee-dollar exchange rate, not Indian company earnings." },
      { q: "Why are liquid ETFs unsuitable for day trading practice?", a: "They hold short-term debt instruments and barely move intraday, so there is little price action to study." }
    ]
  },

  4: {
    what: [
      "The NSE regular trading session runs from 09:15 to 15:30 IST (Indian Standard Time), Monday to Friday, except exchange holidays. Before it, a pre-open session from 09:00 to 09:15 collects orders and helps determine an opening price where it applies. After the close there are short post-close sessions, but intraday trading in this course happens only in the 09:15-15:30 window. Always check the exchange's current calendar and timings, because they can change.",
      "A market order buys or sells immediately at the best available price. It favours speed, but in a thin or fast-moving ETF it can fill worse than the price you saw — this difference is called slippage. A limit order buys or sells only at your chosen price or better. It controls price, but it may not fill at all if the market never reaches your price.",
      "A stop-loss order (SL) waits until a trigger price trades, then sends an order to exit. A stop-loss limit order then becomes a limit order (controlled price, but may not fill in a fast drop); a stop-loss market order (SL-M) becomes a market order (fills, but at an uncertain price). Which types your broker offers, and for which products, varies — the app's Paper tool supports market and limit entries with stop-loss and take-profit exits.",
      "Intraday positions (often called MIS or intraday product) must be closed the same day. Brokers typically square off (automatically close) open intraday positions some minutes before 15:30, and charge for doing so. Exchanges also set price bands — limits on how far price can move in a day — and orders outside them are rejected. Rules and cut-off times differ by broker, so in simulation we set our own earlier exit time."
    ],
    why: [
      "Order type is part of your risk, not a technical detail. A market order in a thin ETF can cost more than the move you hoped to capture; a limit order you forgot about can leave you out of the trade or in one you no longer want. Knowing the session clock tells you when liquidity is normal and when it is unusual.",
      "Planning your exit before entering — including a hard 'flat by' time — prevents the most avoidable intraday error: being stuck in a position near the close."
    ],
    how: [
      "Write the session timetable in your Playbook: pre-open 09:00-09:15, regular 09:15-15:30 IST, plus your personal 'no new entries after' and 'flat by' times (for example 15:00 and 15:15).",
      "In Trading → Paper, load a replayed historical session and place a small market buy in a liquid ETF, then note the fill versus the last price.",
      "Place a limit buy slightly below the current price and watch whether it fills; note how long it waits.",
      "Attach a stop-loss and a take-profit to a paper position and watch which one triggers first.",
      "In the Trading Journal, write one sentence for each order type: when you would use it and its main risk.",
      "Ask the AI Coach in Trading → Ask AI: 'When might a stop-loss limit order fail to fill?' and summarise the answer."
    ],
    example: {
      title: "Hypothetical example: market vs limit in a thin moment",
      lines: [
        "Hypothetical ETF quote: best bid ₹99.90 (500 units), best ask ₹100.00 (300 units), next ask ₹100.10.",
        "A market buy for 600 units fills 300 at ₹100.00 and 300 at ₹100.10 — average ₹100.05.",
        "Slippage versus the ₹100.00 you saw: ₹0.05 × 600 = ₹30.",
        "A limit buy at ₹100.00 for 600 units fills 300 now and waits for the rest — which may never fill.",
        "Neither choice is 'right'; each trades speed against price control.",
        "All quotes are hypothetical and simplified."
      ]
    },
    mistakes: [
      "Using market orders in thinly traded ETFs, which can create large slippage on entry and exit.",
      "Leaving forgotten limit orders working, which can open unwanted positions later in the session.",
      "Not knowing the broker's intraday square-off time, which leads to forced exits at poor prices plus extra charges.",
      "Placing a stop-loss limit with no gap between trigger and limit, so it fails to fill in a fast move.",
      "Trading in the first seconds after 09:15 without a plan, when spreads and volatility are often at their highest."
    ],
    quiz: [
      { q: "What are the NSE regular session hours?", a: "09:15 to 15:30 IST, with a pre-open session from 09:00 to 09:15." },
      { q: "What is slippage?", a: "The difference between the price you expected and the price you actually got, common with market orders in thin or fast markets." },
      { q: "What is the main trade-off between a market and a limit order?", a: "A market order gives speed but no price control; a limit order gives price control but may not fill." }
    ]
  },

  5: {
    what: [
      "Liquidity is how easily you can buy or sell without moving the price much. You judge it with volume (how many units traded), traded value (volume × price, in rupees), market depth (the quantities waiting at each price in the order book — NSE shows the best five bid and ask levels) and how consistently market makers quote. Many NSE ETFs are thinly traded, so this check is not optional.",
      "The spread is the best ask minus the best bid. If you buy at the ask and sell at the bid, you lose the spread on a round trip even if the 'price' never moves. Spread is easiest to compare as a percentage: spread % = (ask - bid) ÷ mid-price × 100, where the mid-price is the average of bid and ask. In liquid ETFs the spread may be one tick (the smallest price step); in thin ETFs it can be many ticks.",
      "Premium or discount compares the traded price with iNAV. A premium means you are paying more than the basket is estimated to be worth; a discount means less. In liquid broad index ETFs this gap is usually small; in thin, international or restricted ETFs it can be large and can change quickly — for example, international ETFs have at times traded at notable premiums when the creation of new units was restricted.",
      "These three ideas are linked. Low liquidity usually means wider spreads, and wider spreads make larger premiums and discounts possible. An ETF can look attractive on a chart and still be a poor practice instrument because of its trading quality."
    ],
    why: [
      "For intraday trading, the moves you aim to capture are small. A 0.3% spread plus a 0.3% premium can swallow the whole idea before price moves at all. Checking liquidity first is the cheapest risk control available.",
      "Thin ETFs also produce misleading charts — sudden spikes on a single small order, long flat periods and gaps — so the patterns you study in later phases are less reliable on them."
    ],
    how: [
      "Open Trading → Practice and run the ETF eligibility check on NIFTYBEES and on one sector or thematic ETF.",
      "Record for each: typical traded value, a sample bid/ask, spread in rupees and in percent.",
      "Calculate premium/discount % against iNAV at one moment for each ETF.",
      "Set personal thresholds in your Playbook, for example 'minimum traded value' and 'maximum spread %', and treat ETFs below them as no-trade.",
      "In Trading → Markets, look at a thin ETF on a 1-minute chart and note the gaps and spikes compared with NIFTYBEES.",
      "Write in the Trading Journal which ETFs pass your checks and which do not."
    ],
    example: {
      title: "Hypothetical example: two ETFs, same chart move, different quality",
      lines: [
        "Hypothetical ETF A: bid ₹249.98, ask ₹250.00, mid ₹249.99 — spread ~ 0.008%. iNAV ₹249.97 — premium ~ 0.01%.",
        "Hypothetical ETF B: bid ₹49.70, ask ₹50.00, mid ₹49.85 — spread ~ 0.6%. iNAV ₹49.60 — premium at the ask ~ 0.8%.",
        "Buying B at the ask and immediately selling at the bid loses about 0.6% before any move.",
        "Paying B's ask also means paying roughly 0.8% above the estimated basket value.",
        "In this example ETF A passes a liquidity check; ETF B does not.",
        "All quotes are hypothetical, not real market data."
      ]
    },
    mistakes: [
      "Judging an ETF only by its chart and ignoring spread, which hides an immediate cost on every round trip.",
      "Comparing ETFs by unit volume instead of traded value, which overrates low-priced ETFs.",
      "Buying at a large premium to iNAV, which can disappear and cause a loss even if the underlying index rises.",
      "Assuming liquidity is constant, when spreads often widen at the open, near the close and during sharp moves.",
      "Practising strategies on thin ETFs, where erratic candles teach misleading lessons."
    ],
    quiz: [
      { q: "How do you calculate spread as a percentage?", a: "(ask - bid) ÷ mid-price × 100, where mid-price is the average of bid and ask." },
      { q: "Why is traded value better than volume for comparing ETFs?", a: "Unit prices vary widely, so rupee value traded is a fairer measure of activity than a count of units." },
      { q: "What does a discount to iNAV mean?", a: "The ETF is trading below the estimated value of its basket per unit." }
    ]
  },

  6: {
    what: [
      "An intraday ETF round trip (one buy plus one sell) pays several charges. Typical components in India are: brokerage (many discount brokers charge the lower of ₹20 or 0.03% per executed order); STT (securities transaction tax) of 0.025% on the sell side for intraday trades in equity ETFs, while gold and liquid ETFs have no STT; an NSE transaction charge of around 0.00297% of turnover; a SEBI fee of ₹10 per crore of turnover; stamp duty of 0.003% on the buy side; and GST at 18% on brokerage plus exchange and SEBI charges.",
      "These rates change from time to time and differ between brokers. Treat the figures here as illustrative and keep the app's cost model up to date — the cost settings in the Backtest and Paper tools are configurable, and you should set them to match your own assumptions.",
      "There are also costs that never appear on a contract note. The spread (Day 5) is paid every time you cross it, and slippage (Day 4) adds more in thin or fast markets. Together with charges, these define your break-even move: how far price must move in your favour just to finish at zero.",
      "Turnover means the total value traded — buy value plus sell value. Percentage charges are computed on turnover, so trading more often or in larger size raises costs proportionally, while flat brokerage hurts small trades most."
    ],
    why: [
      "Intraday ETF moves are often fractions of a percent. If a round trip costs around 0.1% of position value, a strategy that averages 0.08% per trade before costs is a losing strategy after costs. Many simulated results look good only because costs were left out.",
      "Knowing your break-even move gives you a simple filter for later lessons: if the realistic move in a setup is not clearly larger than your costs, it is not worth taking — even in simulation."
    ],
    how: [
      "Write the cost stack in your Trading Journal with the rates you will assume, and the date you checked them.",
      "Price a hypothetical round trip (see the example) by hand: brokerage, STT, exchange charge, SEBI fee, stamp duty, GST, then spread.",
      "Divide total cost by position value to get cost as a percentage; divide by units to get the break-even move per unit.",
      "Repeat for a gold ETF (no STT) and for a smaller position, and note how flat brokerage changes the percentage.",
      "Open the cost settings in Trading → Backtest or Trading → Paper and confirm they match your assumptions.",
      "Add a Playbook rule: 'Every simulated result is judged after costs.'"
    ],
    example: {
      title: "Hypothetical example: costing one intraday round trip",
      lines: [
        "Hypothetical equity ETF at ₹250; buy and sell 400 units at about the same price → buy ₹1,00,000, sell ₹1,00,000, turnover ₹2,00,000.",
        "Brokerage: lower of ₹20 or 0.03% (₹30) → ₹20 × 2 orders = ₹40. STT 0.025% of sell value = ₹25.",
        "Exchange charge 0.00297% × ₹2,00,000 ~ ₹5.94. SEBI fee ₹10/crore ~ ₹0.20. Stamp duty 0.003% of buy ~ ₹3.",
        "GST 18% × (₹40 + ₹5.94 + ₹0.20) ~ ₹8.31. Charges total ~ ₹82.45.",
        "Add a one-tick hypothetical spread of ₹0.05 × 400 = ₹20 → all-in ~ ₹102, about 0.10% of position.",
        "Break-even move ~ ₹102 ÷ 400 ~ ₹0.26 per unit. For a gold ETF, remove STT (~ ₹77 all-in).",
        "Rates are illustrative and change over time; set your own in the app's cost model."
      ]
    },
    mistakes: [
      "Ignoring costs when judging a simulated trade, which makes losing ideas look profitable.",
      "Forgetting the spread and slippage because they are not on the contract note, which understates true cost.",
      "Using outdated rates, which quietly distorts every backtest and paper result.",
      "Taking many tiny trades where flat brokerage is a large share of each position, which inflates cost percentage.",
      "Assuming all ETFs carry the same charges, when gold and liquid ETFs have no STT and brokers differ."
    ],
    quiz: [
      { q: "On which side is STT charged for intraday equity ETF trades, and at what illustrative rate?", a: "On the sell side, at 0.025% (gold and liquid ETFs have no STT); rates can change." },
      { q: "What is a break-even move?", a: "The price move in your favour needed to cover all costs, including charges, spread and slippage, so the trade finishes at zero." },
      { q: "Which charges is GST applied to?", a: "Brokerage plus exchange transaction charges and the SEBI fee, at 18%." }
    ]
  },

  7: {
    what: [
      "What an ETF is (Day 1): a fund holding a basket of assets, divided into units that trade on an exchange. Most Indian ETFs track an index or a commodity price. Day trading means opening and closing within one session, and this journey does it only in simulation. How ETFs trade (Day 2): units trade between participants on the NSE; authorised participants create and redeem units with the AMC in large blocks; market makers quote bids and asks; iNAV estimates fair value intraday.",
      "ETF families (Day 3): broad index (NIFTYBEES, JUNIORBEES), sector (BANKBEES, ITBEES, PSUBNKBEES), thematic (CPSEETF), commodity (GOLDBEES, SILVERBEES), international (MON100) and liquid/debt. Each moves for different reasons. Session and orders (Day 4): pre-open 09:00-09:15, regular 09:15-15:30 IST; market orders trade speed for price, limit orders the reverse; stop-loss orders trigger at a set price; intraday positions must be closed the same day.",
      "Liquidity and fair value (Day 5): check traded value, depth and spread before anything else, and compare price with iNAV to see premium or discount. Costs (Day 6): brokerage, STT (not on gold/liquid ETFs), exchange charge, SEBI fee, stamp duty and GST, plus spread and slippage, set a break-even move every trade must beat. Rates change, so keep the app's cost model current.",
      "Today's job is consolidation: recall each topic from memory, check yourself against the lessons, find your weakest concept, rewrite it and turn the week into a short set of Playbook rules."
    ],
    why: [
      "Everything ahead — charts, setups, backtests, paper trading — assumes you understand what you are trading and what it costs. A shaky idea of iNAV or spread now becomes a confusing backtest result later. Recalling and rewriting is what turns a week of reading into usable understanding."
    ],
    how: [
      "Re-read your Trading Journal and Psychology journal entries from Days 1-6 without editing them.",
      "On a blank page, explain each of the six topics from memory in two or three sentences.",
      "Compare with the lessons and mark your weakest concept; rewrite it in your own words with a hypothetical example.",
      "In Trading → Practice, run the ETF eligibility check on three ETFs from different families and record pass/fail with reasons.",
      "Recompute the hypothetical round-trip cost from Day 6 without looking, then check your numbers.",
      "Update the Playbook with this week's rules: simulation only, ETFs only, liquidity thresholds, session times, judge results after costs.",
      "Answer the AI Coach's quiz on ETF basics in Trading → Ask AI, and note any question you got wrong."
    ],
    example: {
      title: "Hypothetical self-review walkthrough",
      lines: [
        "Step 1: Recall test → explained ETF families and session times well; stumbled on premium vs discount.",
        "Step 2: Weakest concept = premium/discount to iNAV.",
        "Step 3: Rewrite → 'Premium = price above iNAV, I overpay for the basket; discount = price below iNAV.'",
        "Step 4: Hypothetical check → price ₹101.00, iNAV ₹100.50 → (101.00 - 100.50) ÷ 100.50 ~ 0.5% premium.",
        "Step 5: Playbook updated → 'Skip entries when premium/discount exceeds my threshold.'",
        "Step 6: Next week's focus noted → read charts slowly and always check spread first."
      ]
    },
    mistakes: [
      "Skipping the review day because it feels less exciting, which carries gaps into harder topics.",
      "Re-reading passively instead of recalling first, which creates an illusion of understanding.",
      "Reviewing only strong topics and avoiding the weakest one that most needs work.",
      "Editing old journal entries to look better, which destroys their value as an honest record.",
      "Leaving rules in your head instead of writing them in the Playbook, where they can be followed and checked."
    ],
    quiz: [
      { q: "Name two checks to run before practising on any ETF.", a: "Liquidity (traded value, depth, spread) and premium/discount to iNAV." },
      { q: "Which ETF family pays no STT on intraday trades?", a: "Gold ETFs (and liquid ETFs)." },
      { q: "Who keeps an ETF's price close to its basket value, and how?", a: "Market makers and authorised participants, by arbitrage — creating or redeeming units and trading against price gaps from iNAV." }
    ]
  },

  8: {
    what: [
      "A candlestick shows four prices for one period: the open (first traded price), the high (highest), the low (lowest) and the close (last traded price) — together called OHLC. The thick part, the body, runs from open to close. The thin lines above and below, the wicks (or shadows), show how far price reached beyond the body. If the close is above the open the candle is usually drawn green (or hollow); if below, red (or filled).",
      "Candle shape describes the battle inside that period. A long body with small wicks means one side controlled the period. A long upper wick means price went up but was pushed back down before the close; a long lower wick means the reverse. A doji — open and close almost equal — shows indecision in that period.",
      "ETF candles reflect two things at once: the movement of the underlying basket, and the quality of trading in the ETF's own units. In a liquid ETF like NIFTYBEES, candles look much like the index's. In a thinly traded ETF, a single small order can print a long wick, and some minutes may have no trades at all, leaving flat or missing candles. That is a trading-quality effect, not a signal about the basket.",
      "A single candle is a clue, not a signal. Its meaning depends on where it appears — near a key level, after a long move, or in the middle of a quiet range — and on volume. Patterns describe what has tended to happen, never what must happen."
    ],
    why: [
      "Candles are the alphabet of every chart you will read in this course. If you can describe each candle accurately — who controlled it, where it closed relative to its range — later concepts like VWAP, structure and breakouts become much easier.",
      "Knowing that thin ETFs print misleading candles protects you from reading meaning into noise caused by one order."
    ],
    how: [
      "Open Trading → Replay with NIFTYBEES on a 5-minute chart and step through 20 candles one at a time.",
      "For each candle, say aloud: open, high, low, close, body size and which wick is longer.",
      "Write three candles in words in the Trading Journal, for example 'small green body, long lower wick — sellers pushed down, buyers recovered'.",
      "In Trading → Markets, compare a 1-minute chart of a thin ETF with NIFTYBEES and note spikes or flat candles.",
      "Lock a No-Trade decision in Replay for each candle you study — today is reading practice only.",
      "Ask the AI Coach in Trading → Ask AI to quiz you on describing five candles."
    ],
    example: {
      title: "Hypothetical example: reading one 5-minute candle",
      lines: [
        "Hypothetical ETF candle: open ₹250.10, high ₹250.60, low ₹249.70, close ₹250.45.",
        "Body: ₹250.10 → ₹250.45 = ₹0.35, green because the close is above the open.",
        "Upper wick: ₹250.60 - ₹250.45 = ₹0.15. Lower wick: ₹250.10 - ₹249.70 = ₹0.40.",
        "Story: sellers pushed price down early, buyers took it back and closed near the high.",
        "Context still needed: where is this candle relative to the day's levels and VWAP?",
        "All prices are hypothetical."
      ]
    },
    mistakes: [
      "Reading a single candle as a buy or sell signal without context, which ignores where it formed.",
      "Treating spikes in thin ETFs as meaningful when they may be one small order hitting an empty order book.",
      "Confusing a candle's colour with the day's direction, when a green 5-minute candle can occur in a falling day.",
      "Ignoring wicks and looking only at bodies, which hides where price was rejected.",
      "Memorising pattern names instead of understanding what the open, high, low and close say about buyers and sellers."
    ],
    quiz: [
      { q: "What four prices does a candlestick show?", a: "Open, high, low and close (OHLC) for one period." },
      { q: "What does a long upper wick suggest?", a: "Price moved up during the period but was pushed back down before the close." },
      { q: "Why can thin ETFs show misleading candles?", a: "Few trades and a sparse order book mean single small orders can create spikes or gaps that do not reflect the basket's movement." }
    ]
  },

  9: {
    what: [
      "A timeframe is the period each candle covers. On a 1-minute (1m) chart each candle is one minute; on a 5-minute (5m) chart, five minutes; on a 15-minute (15m) chart, fifteen. The NSE regular session of 375 minutes (09:15-15:30) produces 375 one-minute candles, 75 five-minute candles or 25 fifteen-minute candles.",
      "Lower timeframes show more detail but also more noise — random wiggles that mean little. Higher timeframes smooth that noise and show the session's structure: the main swings, levels and direction. The same move can look like a trend on 15m and like chaos on 1m.",
      "A common approach is to use one primary timeframe for decisions and one higher context timeframe for the bigger picture — for example 5m primary with 15m context. The daily chart adds further context: prior day high, low and close. In this app, Trading → Replay and Trading → Backtest support 1m, 5m and 15m data.",
      "For ETFs, liquidity affects the best timeframe choice. A thin ETF's 1-minute chart may be full of empty or one-trade candles; a 5m or 15m chart of the same ETF is easier to read. Liquid broad index ETFs read cleanly on all three."
    ],
    why: [
      "Switching timeframes until a chart 'looks right' is a way of finding the answer you wanted rather than the one the chart gives. A fixed pair keeps practice consistent, makes journal entries comparable and makes backtest results meaningful later.",
      "Timeframe also sets how far your stops and targets will be. On 1m charts moves are small and costs (Day 6) take a bigger share; on 15m charts moves are larger but trades are fewer."
    ],
    how: [
      "In Trading → Replay, open one NIFTYBEES session on 1m, then 5m, then 15m, and write one sentence about what each shows.",
      "Count how many direction changes you see in the first hour on each timeframe.",
      "Choose a primary and context timeframe (for example 5m and 15m) and record them in the Playbook.",
      "Compare the typical 1m and 15m candle size against your Day 6 break-even move.",
      "Repeat the 1m view on a thinner ETF and note any empty or spiky candles.",
      "Write a Playbook rule: 'Decisions on my primary timeframe; context from the higher one; no switching mid-trade.'"
    ],
    example: {
      title: "Hypothetical example: one hour, three timeframes",
      lines: [
        "Hypothetical ETF, 09:15-10:15: starts at ₹250.00 and ends at ₹251.00 (+0.4%).",
        "15m view: four candles, three green — a steady upward hour.",
        "5m view: twelve candles with two small pullbacks — still a clear rise.",
        "1m view: sixty candles, many red, several ₹0.10 swings — looks choppy.",
        "Average 1m candle range of ₹0.12 is below a ₹0.26 break-even move; 15m ranges are larger.",
        "All prices are hypothetical."
      ]
    },
    mistakes: [
      "Hopping between timeframes until one supports your idea, which is confirmation bias in action.",
      "Trading 1m charts of thin ETFs, where noise and gaps dominate.",
      "Ignoring the higher timeframe and taking trades straight into a level visible on 15m or daily charts.",
      "Using a timeframe where typical moves are smaller than your costs, which makes profitable trades nearly impossible.",
      "Changing your timeframe in the middle of a trade to justify holding a loser."
    ],
    quiz: [
      { q: "How many 5-minute candles are in a full NSE regular session?", a: "75 (375 minutes ÷ 5)." },
      { q: "What does a higher context timeframe provide?", a: "The bigger picture — main swings, levels and direction — with less noise." },
      { q: "Why might a thin ETF be easier to read on 5m or 15m than on 1m?", a: "Its 1-minute chart can have empty or single-trade candles; longer candles combine more trades and reduce noise." }
    ]
  },

  10: {
    what: [
      "Volume is the number of ETF units traded in a period, usually shown as bars under the price chart. Traded value (or turnover) is volume multiplied by price, measured in rupees. Because ETF unit prices range from a few rupees to thousands, traded value is the fairer way to compare activity between ETFs: a million units of a ₹10 ETF is less activity than 100,000 units of a ₹250 ETF.",
      "Volume shows participation. A price move on rising volume suggests many participants are involved; the same move on very low volume may be one or two orders and is less trustworthy. Relative volume compares current volume with what is normal for that time of day, since volume is naturally higher near the open and the close.",
      "ETF volume has a twist: much of it can come from market makers and arbitrage rather than from directional traders. A spike in volume can reflect creation/redemption activity or a large block, not a change of opinion. And the volume of the ETF is not the same as the volume of its index's shares — the index's underlying market can be very active while the ETF itself is quiet.",
      "Volume is also part of your liquidity check from Day 5: an ETF with tiny daily traded value can be difficult to enter and exit at fair prices regardless of what the chart shows."
    ],
    why: [
      "Volume and traded value help you separate meaningful moves from noise and decide which ETFs are worth studying at all. Later strategies — breakouts in particular — use volume confirmation, so learning to read it now saves confusion later.",
      "It also keeps you realistic: if your simulated position would be a large share of a typical minute's traded value, real-world fills would likely be worse than the simulation assumes."
    ],
    how: [
      "In Trading → Markets, view volume bars for NIFTYBEES, BANKBEES, GOLDBEES and one thin ETF on the same session.",
      "Estimate the session's traded value for each (volume × approximate price) and rank them.",
      "In Trading → Replay, step through a session and mark every candle where volume is at least double the recent average.",
      "For each marked candle, note whether price moved strongly or barely moved.",
      "Compare your planned simulated position size with a typical 5-minute traded value for that ETF.",
      "Record the most and least active ETF in your Trading Journal, with traded value figures."
    ],
    example: {
      title: "Hypothetical example: volume vs traded value",
      lines: [
        "Hypothetical ETF X: price ₹10, 20,00,000 units traded → traded value ₹2,00,00,000 (₹2 crore).",
        "Hypothetical ETF Y: price ₹250, 2,00,000 units traded → traded value ₹5,00,00,000 (₹5 crore).",
        "By volume X looks ten times busier; by traded value Y is 2.5 times more active.",
        "In ETF Y, a 5-minute candle rising ₹0.80 on triple normal volume shows broad participation.",
        "A similar rise on one-tenth normal volume might be a single order — less reliable.",
        "All figures are hypothetical."
      ]
    },
    mistakes: [
      "Comparing ETFs by unit volume, which overstates the activity of low-priced ETFs.",
      "Treating every volume spike as directional conviction, when ETF volume can come from arbitrage or block trades.",
      "Ignoring time-of-day effects and calling normal opening volume 'unusual'.",
      "Assuming a busy index means a busy ETF, when the ETF's own units may trade thinly.",
      "Sizing a simulated position larger than the ETF realistically trades, which makes paper fills unrealistic."
    ],
    quiz: [
      { q: "How is traded value calculated?", a: "Volume (units traded) × price, giving a rupee value." },
      { q: "Why can ETF volume spikes be misleading?", a: "They may come from market makers, arbitrage or block trades rather than directional buying or selling." },
      { q: "What is relative volume?", a: "Current volume compared with the normal volume for that time of day." }
    ]
  },

  11: {
    what: [
      "VWAP (volume-weighted average price) is the average price at which an ETF has traded during the session so far, weighted by how many units traded at each price. For each candle, a typical price is often taken as (high + low + close) ÷ 3; VWAP = the running sum of (typical price × volume) ÷ the running sum of volume. It starts fresh at the open each day.",
      "Because it is weighted by volume, VWAP reflects where most of the session's business has been done. When price is above VWAP, the average buyer today is in profit and buyers have broadly had the upper hand so far; when price is below VWAP, the reverse. Many institutions use VWAP as a benchmark for execution quality, which is one reason intraday traders watch it.",
      "VWAP often acts as a reference level: price may pull back toward it and react, or cross it repeatedly on indecisive days. A session where price stays on one side of VWAP for hours is often trending; one where price crosses VWAP again and again is often ranging or choppy. These are tendencies, not rules.",
      "VWAP is not the same as iNAV. iNAV estimates the basket's value right now; VWAP is a history of where the ETF's units have traded today. Early in the session VWAP is based on few trades and moves a lot; later it becomes steadier."
    ],
    why: [
      "VWAP gives you a single, objective line to judge the session: who has been in control, whether price is stretched far from the day's average, and whether conditions look trending or choppy. It reappears in the pullback and trend strategies later.",
      "It is also a reality check on fills: buying far above VWAP means paying more than most participants did today."
    ],
    how: [
      "In Trading → Replay, open a NIFTYBEES 5-minute session with VWAP shown.",
      "Step through candle by candle and record the time of each VWAP cross.",
      "At 10:15, 12:00 and 14:30, note whether price is above or below VWAP and by how much in percent.",
      "Calculate VWAP by hand for the first three candles of a hypothetical session (see example) to understand the formula.",
      "Classify the session: 'held one side of VWAP' or 'crossed often'.",
      "Write the number of VWAP crosses and your classification in the Trading Journal."
    ],
    example: {
      title: "Hypothetical example: VWAP over three candles",
      lines: [
        "Candle 1: typical price ₹250.00, volume 10,000 → price × volume ₹25,00,000.",
        "Candle 2: typical price ₹250.50, volume 5,000 → ₹12,52,500.",
        "Candle 3: typical price ₹251.00, volume 5,000 → ₹12,55,000.",
        "VWAP = (₹25,00,000 + ₹12,52,500 + ₹12,55,000) ÷ 20,000 = ₹250.375.",
        "The simple average would be ₹250.50; VWAP is lower because more volume traded at ₹250.",
        "All figures are hypothetical."
      ]
    },
    mistakes: [
      "Treating VWAP as a guaranteed support or resistance line, when price can cut through it easily.",
      "Giving early-session VWAP the same weight as later VWAP, when it is based on few trades and unstable.",
      "Confusing VWAP with iNAV, which mixes up 'where units have traded' with 'what the basket is worth'.",
      "Carrying yesterday's VWAP into today, when standard VWAP resets each session.",
      "Using VWAP on a very thin ETF, where a few trades dominate the calculation."
    ],
    quiz: [
      { q: "What does price above VWAP suggest?", a: "Buyers have broadly been in control so far today, and the average buyer is in profit." },
      { q: "When does standard VWAP reset?", a: "At the start of every trading session." },
      { q: "How does VWAP differ from iNAV?", a: "VWAP is the volume-weighted average of today's traded prices; iNAV is an estimate of the basket's current value per unit." }
    ]
  },

  12: {
    what: [
      "The opening range is the high and low of the first part of the session — commonly the first 15 or 30 minutes after 09:15. It captures the market's first reaction to overnight news and the pre-open. Later in the day, price often returns to or reacts around the opening range high and low, and a move beyond them is a reference point several strategies (such as opening-range breakouts in Phase 6) use.",
      "The session tends to pass through phases. The open (roughly 09:15-10:00) is often the most volatile, with wider spreads in some ETFs while market makers settle quotes. Mid-morning can bring the day's clearest directional moves. Midday (roughly 11:30-13:30) is often quieter, with lower volume and more choppy, overlapping candles. The final part (roughly 14:30-15:30) can pick up again as participants close positions; intraday positions are squared off before the close.",
      "These phases are tendencies seen across many sessions, not a timetable. News, global markets and event days can change the pattern completely. The closing price on the NSE is calculated from trading in the last part of the session, not simply the very last trade, so the final minutes can look different from the 'official' close.",
      "For ETFs, session phases also affect trading quality. Spreads may be wider in the first minutes and in thin ETFs during midday, which raises costs exactly when price action is least clear."
    ],
    why: [
      "Knowing the opening range gives you two objective levels for the rest of the day. Knowing the session phases tells you when to expect clean movement and when to expect noise — which helps you decide when not to trade at all.",
      "Many beginner losses come from trading the first frantic minutes or forcing trades in a dead midday market. A time-of-day plan prevents both."
    ],
    how: [
      "In Trading → Replay, open a 5-minute session and mark the 15-minute opening range (the high and low of the first three candles).",
      "Step forward and record each time price returns to or breaks the opening range high or low.",
      "Split the session into open, mid-morning, midday and close, and write one line on each phase's behaviour.",
      "Note average candle size and volume in each phase.",
      "Repeat on two more sessions and look for what was similar and what was different.",
      "Add a Playbook draft rule: 'No entries in the first 5 minutes; extra caution midday; no new entries after my cut-off time.'"
    ],
    example: {
      title: "Hypothetical example: opening range in a replayed session",
      lines: [
        "Hypothetical ETF, 09:15-09:30: high ₹251.20, low ₹249.80 → opening range ₹1.40 wide.",
        "10:05: price breaks above ₹251.20 on rising volume and reaches ₹252.10 by 11:00.",
        "11:30-13:30: price drifts in a ₹0.40 band between ₹251.60 and ₹252.00 on low volume.",
        "14:45: activity picks up; price slips back to ₹251.40 into the close.",
        "Takeaway: one session's phases — another session could look entirely different.",
        "All prices are hypothetical."
      ]
    },
    mistakes: [
      "Trading the first minutes after 09:15 without a plan, when spreads and volatility are often highest.",
      "Treating session phases as fixed rules, when news and global markets can override them.",
      "Forcing trades in quiet midday sessions, where small moves rarely cover costs.",
      "Using a different opening range length every day, which makes observations impossible to compare.",
      "Holding trades into the broker's square-off window, which risks forced exits at poor prices."
    ],
    quiz: [
      { q: "What is the opening range?", a: "The high and low of the first part of the session, commonly the first 15 or 30 minutes after 09:15." },
      { q: "Which session phase is often quietest?", a: "Midday, roughly 11:30-13:30, though this is a tendency, not a rule." },
      { q: "Why can the opening minutes be costly for ETF traders?", a: "Spreads can be wider and volatility higher while market makers settle their quotes." }
    ]
  },

  13: {
    what: [
      "A gap occurs when the session opens at a price different from the previous session's close, leaving empty space on the chart. A gap up opens above the prior close; a gap down opens below it. Gap size is usually measured in percent: (open - previous close) ÷ previous close × 100.",
      "ETFs gap mainly because their underlying assets change value while the NSE is closed. For Indian index ETFs, overnight moves in global markets, news and events change expectations for the basket. Gold and silver ETFs follow international metal prices, which trade nearly around the clock, plus the exchange rate. International ETFs such as MON100 follow overseas markets that trade during Indian night hours.",
      "After a gap, price can 'fill' it (move back toward the previous close), hold near the open, or extend further in the gap direction. Which happens varies; no outcome is reliable enough to treat as certain. Larger gaps on major news are often treated differently from small routine gaps.",
      "Because ETF prices are anchored to iNAV, a gap in the ETF usually reflects a gap in the basket's value. If the ETF opens well away from iNAV — a bigger premium or discount than normal — that is a separate trading-quality issue that market makers usually correct, not a signal about the market."
    ],
    why: [
      "Gaps change the starting conditions of the day: the prior close is no longer where price is, levels are skipped, and the opening range is often wider. Knowing why an ETF gapped helps you decide whether the gap is likely to matter.",
      "Gaps are also the main reason intraday traders close positions before the end of the session: overnight moves cannot be controlled by a stop-loss."
    ],
    how: [
      "In Trading → Replay, find five sessions with gaps in a broad index ETF and record each gap size in percent.",
      "For each, note what happened in the first hour: filled, held or extended.",
      "Do the same for a gold ETF and compare how often it gaps relative to the index ETF.",
      "At the open of each replayed gap day, compare price with iNAV if available.",
      "Write a Playbook draft rule for gap days, for example 'wait for the opening range to form before any entry'.",
      "Record gap sizes and outcomes in the Trading Journal; avoid conclusions from a handful of examples."
    ],
    example: {
      title: "Hypothetical example: measuring and following a gap",
      lines: [
        "Hypothetical ETF previous close ₹250.00; today's open ₹252.50.",
        "Gap = (252.50 - 250.00) ÷ 250.00 × 100 = +1.0% gap up.",
        "First 30 minutes: price dips to ₹251.30, then recovers to ₹252.80.",
        "The gap partly filled (₹1.20 of ₹2.50) but did not close completely.",
        "On another hypothetical day, a similar gap might fill fully or extend — outcomes vary.",
        "All prices are hypothetical."
      ]
    },
    mistakes: [
      "Assuming every gap will fill, which treats a possibility as a certainty.",
      "Chasing a large gap at the open, when spreads and volatility are at their highest.",
      "Ignoring why the ETF gapped, missing that a gold or international ETF is following overseas markets.",
      "Holding an intraday position overnight 'to catch the gap', which turns a day trade into an uncontrolled risk.",
      "Drawing firm conclusions from a few gap examples, which is far too small a sample."
    ],
    quiz: [
      { q: "How do you measure gap size?", a: "(open - previous close) ÷ previous close × 100, in percent." },
      { q: "Why do gold ETFs often gap?", a: "International gold prices and exchange rates keep moving while the NSE is closed." },
      { q: "Name three things price can do after a gap.", a: "Fill the gap, hold near the open, or extend in the gap direction — none is certain." }
    ]
  },

  14: {
    what: [
      "Candlesticks (Day 8): each candle shows open, high, low and close; bodies and wicks show who controlled the period. Thin ETFs can print misleading candles. Timeframes (Day 9): 1m shows detail and noise, 15m shows structure; use one fixed primary and one context timeframe.",
      "Volume and traded value (Day 10): volume counts units; traded value (volume × price) compares activity fairly across ETFs. ETF volume can come from arbitrage, so spikes are not always conviction. VWAP (Day 11): the volume-weighted average price for the session, resetting each day; price above or below it shows who has been in control so far.",
      "Opening range and phases (Day 12): the first 15-30 minutes set two reference levels; the open is volatile, midday often quiet, the close active again — as tendencies. Gaps (Day 13): ETFs gap because their underlying moves overnight; gaps may fill, hold or extend.",
      "Today you combine all of this to read a full session and describe it in words — what happened and how — without predicting what comes next."
    ],
    why: [
      "Reading a chart fluently is the foundation for every strategy in later phases. If you can tell the story of a session — gap, opening range, VWAP behaviour, volume, phases — you will recognise conditions that suit a strategy and, just as importantly, conditions that suit none."
    ],
    how: [
      "Re-read your journal entries from Days 8-13 and write each concept from memory in two sentences.",
      "In Trading → Replay, choose a NIFTYBEES session on your chosen timeframe and step through it from 09:15 to 15:30.",
      "At each phase, note: candle character, volume, position versus VWAP and the opening range.",
      "Lock a No-Trade decision throughout — the aim is narration, not trading — and review the process score.",
      "Write the session's story in six lines in the Trading Journal.",
      "Identify your weakest chart concept and rewrite it with a hypothetical example.",
      "Add the week's rules to the Playbook (fixed timeframes, no first-minutes entries, gap-day caution)."
    ],
    example: {
      title: "Hypothetical self-review walkthrough: narrating a session",
      lines: [
        "Gap: opened 0.4% above the prior close (hypothetical).",
        "Opening range: first 15 minutes formed a ₹1.10 range with high volume.",
        "Mid-morning: broke above the range high; held above VWAP with rising volume.",
        "Midday: small overlapping candles, volume faded, price stayed above VWAP.",
        "Close: slipped back toward VWAP in the final hour. Weakest concept noted: relative volume.",
        "Rewrite saved; next week's focus: market context. All details hypothetical."
      ]
    },
    mistakes: [
      "Narrating with hindsight ('it obviously went up'), which hides how unclear the chart was in real time.",
      "Skipping volume and VWAP in the review, leaving the story incomplete.",
      "Turning a review session into trading practice and losing the focus on reading.",
      "Reviewing only sessions that trended nicely, which builds a biased picture of what normal looks like.",
      "Not recording the weakest concept, so the same confusion returns next week."
    ],
    quiz: [
      { q: "Which is better for comparing activity across ETFs: volume or traded value?", a: "Traded value, because unit prices differ widely." },
      { q: "What does price staying above VWAP for most of a session suggest?", a: "Buyers were broadly in control, and the session may have been trending — a description, not a prediction." },
      { q: "Why do ETFs gap?", a: "Their underlying assets change value while the NSE is closed, for example through global markets, news or overseas metal prices." }
    ]
  },

  15: {
    what: [
      "An index ETF aims to match the return of its index, but never does so perfectly. Tracking difference is the gap between the ETF's return and the index's return over a period (ETF return - index return); it is usually slightly negative because of the expense ratio, cash held in the fund and trading costs. Tracking error is the variability of that difference over time — how consistently the ETF follows the index. Lower is better for both.",
      "NIFTYBEES and the Nifty 50 illustrate this. The index is a number published from the prices of its 50 companies; NIFTYBEES is a fund whose units trade on the NSE. The unit price is a fraction of the index level, so the rupee move of a unit and the point move of the index are not comparable — always compare percentage moves.",
      "Intraday, two extra effects appear. First, the ETF's traded price can drift above or below its iNAV (premium/discount) because of order flow and market-maker activity. Second, the index and the iNAV update continuously from live share prices, while the ETF price only changes when its units trade — so in a quiet moment the ETF can appear to 'lag'. These gaps are normally small and short-lived in liquid ETFs.",
      "Because the index is the underlying driver, many intraday traders watch the index chart for context while trading the ETF, and use the ETF's own chart for exact levels, volume and costs."
    ],
    why: [
      "Knowing how closely your ETF follows its index tells you whether index-based analysis applies to it. If an ETF tracks poorly or trades at shifting premiums, a 'perfect' setup on the index chart can produce a disappointing result in the ETF.",
      "It also prevents a common confusion: a ₹0.30 move in a unit and a large point move in the index can be the same percentage move."
    ],
    how: [
      "In Trading → Markets, open NIFTYBEES and the Nifty 50 side by side on 5-minute charts for the same session.",
      "Record each one's percentage change from the previous close at 09:30, 11:30, 13:30 and 15:15.",
      "Calculate the intraday difference at each time and note where it was largest.",
      "If iNAV is available, record the ETF's premium/discount at those same times.",
      "From the AMC's factsheet, note the expense ratio and published tracking error for the ETF.",
      "In the Trading Journal, describe where the ETF and index diverged and give a possible reason (spread, quiet trading, premium)."
    ],
    example: {
      title: "Hypothetical example: tracking difference over a year",
      lines: [
        "Hypothetical index return over one year: +12.00%.",
        "Hypothetical index ETF return over the same year: +11.90%.",
        "Tracking difference = 11.90% - 12.00% = -0.10% (roughly the cost of running the fund).",
        "Intraday: index +0.50% at 11:30; ETF last traded +0.46% because its units had not traded for a minute.",
        "A minute later the ETF trades again at +0.50% — the gap closed. Such gaps are usually small in liquid ETFs.",
        "All figures are hypothetical, not real ETF or index data."
      ]
    },
    mistakes: [
      "Comparing rupee moves in the ETF with point moves in the index, instead of comparing percentages.",
      "Assuming an ETF tracks its index perfectly, which ignores costs, cash and premiums.",
      "Mistaking a momentary lag in a quiet ETF for a trading signal.",
      "Using the index chart for exact entry levels, when the ETF's own price, spread and volume determine your fills.",
      "Ignoring tracking error when choosing which ETF to study, which can make results noisier than necessary."
    ],
    quiz: [
      { q: "What is tracking difference?", a: "The ETF's return minus the index's return over a period — usually slightly negative due to costs." },
      { q: "Why compare percentage moves rather than rupee or point moves?", a: "The ETF unit price is a fraction of the index level, so only percentages are comparable." },
      { q: "Why can a quiet ETF appear to lag its index intraday?", a: "The index updates continuously from its shares, while the ETF price only changes when its units trade." }
    ]
  },

  16: {
    what: [
      "Support is a price area where a falling price has tended to stop and turn up, because buyers became more willing than sellers there. Resistance is a price area where a rising price has tended to stall or turn down. They are zones — a band a few ticks wide — not exact lines, because different participants act at slightly different prices.",
      "Common sources of intraday levels for ETFs are: the previous day's high, low and close; the current day's opening range high and low (Day 12); prior swing highs and lows on the chart; VWAP (Day 11); and round numbers such as ₹250.00. Levels visible on a higher timeframe (15m or daily) usually carry more weight than ones seen only on 1m.",
      "A level becomes more relevant the more clearly price has reacted to it — for example two or three clean turns with visible volume. When support breaks decisively, it often acts as resistance on a later retest, and broken resistance may become support. This 'role reversal' is a tendency, not a law.",
      "For index ETFs, it is sensible to note levels on the ETF's own chart (where your orders fill) and to check whether the index has a level at the equivalent percentage point. When both agree, the zone is often more widely watched."
    ],
    why: [
      "Support and resistance give structure to your decisions: they suggest where a move may pause, where a setup is invalidated and where a target is realistic. Almost every strategy in later phases uses them to place entries, stops and targets.",
      "Marking levels before the session also reduces impulsive decisions — you already know where you care about price, instead of reacting to every tick."
    ],
    how: [
      "Before replaying a session in Trading → Replay, mark the previous day's high, low and close for your ETF.",
      "Add any clear swing highs and lows from the 15-minute chart of the prior two sessions, drawn as zones, not lines.",
      "Step through the session and note at each level: held, broke, or broke and retested.",
      "After the opening range forms, add its high and low as levels.",
      "Record which levels mattered and which were ignored in the Trading Journal.",
      "Repeat on two sessions and look for any repeat behaviour — without assuming it will continue."
    ],
    example: {
      title: "Hypothetical example: a support zone and role reversal",
      lines: [
        "Hypothetical ETF: previous day low ₹248.80; earlier swing low ₹248.70 → support zone ₹248.70-₹248.85.",
        "10:20: price falls to ₹248.78 and turns up to ₹249.60 on rising volume — the zone held.",
        "13:10: price falls again and closes a 15-minute candle at ₹248.30 — the zone broke.",
        "14:05: price rises back to ₹248.75 and stalls — the old support acted as resistance.",
        "None of these reactions was guaranteed; each was one possible outcome.",
        "All prices are hypothetical."
      ]
    },
    mistakes: [
      "Drawing levels as exact lines and expecting price to turn to the paisa, which leads to stops placed too tight.",
      "Marking so many levels that every price is 'near a level', which makes them meaningless.",
      "Drawing levels after the move with hindsight, which inflates how reliable they seem.",
      "Ignoring higher-timeframe levels and focusing only on 1-minute swings.",
      "Assuming a level that held before must hold again, rather than treating it as a zone to watch."
    ],
    quiz: [
      { q: "What is support?", a: "A price zone where falling prices have tended to stop and turn up because buyers outweighed sellers." },
      { q: "Name three common sources of intraday ETF levels.", a: "Any three of: previous day high/low/close, opening range high/low, prior swing highs/lows, VWAP, round numbers." },
      { q: "What is role reversal?", a: "The tendency for broken support to act as resistance later, and broken resistance as support — a tendency, not a rule." }
    ]
  },

  17: {
    what: [
      "Market structure is the sequence of swing highs and swing lows on a chart. A swing high is a local peak: a candle whose high is higher than the highs of the candles on either side (often using two or three candles each side). A swing low is the mirror image. Connecting them shows the shape of the move.",
      "Higher highs (HH) and higher lows (HL) describe an uptrend: each push goes further and each pullback stops higher. Lower highs (LH) and lower lows (LL) describe a downtrend. When swings overlap — highs and lows at similar prices without progress — the market is in a range or chop.",
      "A structure break happens when the pattern changes: for example, in an uptrend price makes a lower low by falling below the last higher low. A break is a warning that the existing trend may be weakening, not proof that it has reversed. Often price shifts from trend to range before any reversal.",
      "Structure depends on timeframe. A 15-minute uptrend can contain several 1-minute downtrends. Use your context timeframe (Day 9) to define the main structure and your primary timeframe for detail."
    ],
    why: [
      "Structure is an objective way to answer 'what is the market doing?' without indicators. It defines trends for the trend and pullback strategies, ranges for the range strategy, and the breaks that matter for breakouts.",
      "Labelling swings also slows you down and replaces gut feeling with a checklist, which is exactly what consistent simulated practice needs."
    ],
    how: [
      "In Trading → Replay, open a 5-minute ETF session and pick a swing definition (for example two candles each side).",
      "Step through and label each confirmed swing high and low as HH, HL, LH or LL.",
      "Note the time of any structure break and what price did in the next hour.",
      "Describe the structure in three parts: open, midday, close.",
      "Repeat on a second session and compare with the 15-minute chart's structure.",
      "Save your swing definition in the Playbook so you label the same way every time."
    ],
    example: {
      title: "Hypothetical example: labelling structure",
      lines: [
        "Hypothetical ETF swing lows: ₹249.20 (09:40), ₹249.70 (10:50) → higher low.",
        "Swing highs: ₹250.40 (10:15), ₹251.00 (11:30) → higher high. Structure: uptrend.",
        "13:00: price falls to ₹249.50, below the ₹249.70 higher low → structure break.",
        "13:00-15:00: highs and lows overlap between ₹249.50 and ₹250.60 → range, not a clear reversal.",
        "A swing is only confirmed after the following candles form — labels come with a delay.",
        "All prices are hypothetical."
      ]
    },
    mistakes: [
      "Labelling swings with hindsight before they are confirmed, which makes structure look clearer than it was in real time.",
      "Treating one structure break as a guaranteed reversal, when it often leads to a range instead.",
      "Mixing timeframes so the 1-minute structure contradicts the 15-minute one without noticing.",
      "Changing the swing definition from day to day, which makes your observations inconsistent.",
      "Calling every small wiggle a swing, which turns structure into noise."
    ],
    quiz: [
      { q: "What sequence defines an uptrend?", a: "Higher highs and higher lows." },
      { q: "What is a structure break in an uptrend?", a: "Price falling below the most recent higher low, creating a lower low." },
      { q: "Does a structure break mean the trend has reversed?", a: "No — it is a warning that the trend may be weakening; price often ranges before any reversal, and nothing is certain." }
    ]
  },

  18: {
    what: [
      "Each session — or part of a session — can be roughly classified into one of three conditions. Trending: clear structure (HH/HL or LH/LL), price staying mostly on one side of VWAP, pullbacks that are shallow relative to the moves. Ranging: price moving between a fairly clear upper and lower zone, repeatedly testing both, with VWAP near the middle. Choppy: overlapping candles, frequent VWAP crosses, no clean swings and no reliable edges.",
      "Conditions can change during the day. A trending morning often becomes a quiet midday range; a choppy open can turn into a trend after news. Classification is therefore something you repeat at fixed check-points, using the context timeframe for the overall picture.",
      "Some simple, objective clues help: the number of VWAP crosses so far; whether recent swings make progress or overlap; the session's range so far compared with a typical range; and volume relative to normal. None of these is decisive alone, and a classification is always a probability-based judgement.",
      "Each strategy in this course fits a condition: trend-following and pullbacks need trending conditions; range trading needs a range; breakouts need a clear level and a shift out of balance. Choppy conditions usually fit no strategy, and the right response is no trade."
    ],
    why: [
      "Using the right tool in the wrong condition is one of the most common causes of losing simulated trades: trend entries in chop get stopped out repeatedly; range trades in a strong trend fight the move. Classifying first makes strategy selection deliberate.",
      "It also makes 'no trade' a legitimate, planned outcome, which reduces overtrading."
    ],
    how: [
      "In Trading → Replay, pick five different ETF sessions on your primary timeframe.",
      "At 10:30, 12:30 and 14:30 in each, pause and classify: trending, ranging or choppy.",
      "Write your reasons for each classification: VWAP crosses, swing structure, range size, volume.",
      "Lock a Long / Short / No-Trade decision at each checkpoint consistent with your classification, and review the process score.",
      "After finishing each session, compare your checkpoint calls with how the rest of the session unfolded — without rewriting them.",
      "Record in the Playbook: 'Choppy = no trade.'"
    ],
    example: {
      title: "Hypothetical example: classifying at checkpoints",
      lines: [
        "Hypothetical ETF session, 10:30: two higher highs, price above VWAP all morning, 0 VWAP crosses → trending.",
        "12:30: price between ₹251.40 and ₹251.90 for 90 minutes, 4 VWAP crosses, falling volume → ranging.",
        "14:30: overlapping candles, 7 VWAP crosses since noon, no clean swings → choppy.",
        "Checkpoint decisions: 10:30 consider trend setups; 12:30 range rules only; 14:30 no trade.",
        "Later checks may show a classification was wrong — that is normal, it is a probability call.",
        "All details are hypothetical."
      ]
    },
    mistakes: [
      "Classifying only once at the open and ignoring that conditions change during the day.",
      "Calling every move a trend because trends are exciting, which leads to entries in chop.",
      "Refusing to classify anything as choppy, which removes the most useful no-trade signal.",
      "Using a single clue (like one VWAP cross) instead of several, which makes classification unstable.",
      "Revising checkpoint calls afterwards to look correct, which hides how hard real-time classification is."
    ],
    quiz: [
      { q: "Name two signs of a choppy market.", a: "Any two of: overlapping candles, frequent VWAP crosses, no clean swings, no reliable range edges." },
      { q: "Which strategies fit trending conditions?", a: "Trend-following and pullback strategies." },
      { q: "What is the usual best response to choppy conditions?", a: "No trade." }
    ]
  },

  19: {
    what: [
      "Sector ETFs track one part of the market: BANKBEES follows the Nifty Bank index, ITBEES the Nifty IT index, PSUBNKBEES public-sector banks. Because they hold similar companies, they react strongly to sector news — interest-rate expectations for banks, global technology demand and currency moves for IT — and can move far more or less than the broad market on a given day.",
      "Relative strength compares a sector ETF's percentage move with a benchmark, usually NIFTYBEES or the Nifty 50: relative strength = sector % change - benchmark % change. A positive figure means the sector is outperforming today; negative means underperforming. It says nothing about the future on its own.",
      "Rotation describes money moving between sectors — some leading while others lag. Intraday, you can see it as one sector ETF rising while another falls on a flat market day. Banks have a large weight in the Nifty 50, so bank ETFs and the broad index often move together; IT can move against them when currency or global tech news dominates.",
      "Sector ETFs are often less liquid than NIFTYBEES, so spreads, traded value and premium/discount (Day 5) must be checked before using any of them in simulation. A strong-looking sector chart is no use if the ETF cannot be traded at fair prices."
    ],
    why: [
      "Relative strength adds context: a broad market rise led by one sector is different from a rise shared by all. It helps you choose which ETF to focus on in later strategies and helps explain why your chosen ETF behaved as it did.",
      "It also warns you about concentration: holding a sector ETF is a bet on one industry, with larger moves and less diversification than an index ETF."
    ],
    how: [
      "In Trading → Markets, open NIFTYBEES, BANKBEES, ITBEES and PSUBNKBEES on the same day.",
      "Record each ETF's percentage change from the previous close at 10:30, 12:30 and 15:00.",
      "Calculate relative strength versus NIFTYBEES at each time and rank the sectors.",
      "Run the ETF eligibility check in Trading → Practice on each sector ETF and note which pass.",
      "Note any day where sectors moved in opposite directions and write a possible reason.",
      "Record the strongest and weakest sector of the day in the Trading Journal."
    ],
    example: {
      title: "Hypothetical example: ranking sectors by relative strength",
      lines: [
        "Hypothetical day at 12:30: broad index ETF +0.30%.",
        "Hypothetical bank ETF +0.70% → relative strength +0.40%.",
        "Hypothetical IT ETF -0.40% → relative strength -0.70%.",
        "Hypothetical PSU bank ETF +1.20% → relative strength +0.90%, but its spread is 0.25% vs 0.02% for the bank ETF.",
        "Ranking: PSU bank > bank > broad index > IT. Liquidity check favours the bank ETF for practice.",
        "All figures are hypothetical."
      ]
    },
    mistakes: [
      "Treating today's strongest sector as certain to stay strong, when leadership can change within the session.",
      "Comparing sector ETFs by rupee moves rather than percentages.",
      "Ignoring liquidity and choosing a thin sector ETF just because its chart moved the most.",
      "Forgetting that sector ETFs are concentrated, which understates how far they can move.",
      "Reading relative strength from a single time point instead of watching how it develops."
    ],
    quiz: [
      { q: "How is relative strength calculated here?", a: "Sector ETF % change minus benchmark (NIFTYBEES or Nifty 50) % change." },
      { q: "What is sector rotation?", a: "Money moving between sectors, so some lead while others lag." },
      { q: "Why check liquidity before practising on a sector ETF?", a: "Sector ETFs are often thinner, with wider spreads and premiums that make fair fills harder." }
    ]
  },

  20: {
    what: [
      "Gold ETFs such as GOLDBEES hold physical gold (or closely linked instruments) and aim to track the domestic price of gold. That price is driven mainly by the international gold price, quoted in US dollars, and the USD/INR exchange rate — a weaker rupee makes gold more expensive in rupees. Domestic factors such as import duties and local demand also play a part. Indian company earnings do not drive gold.",
      "International gold trades almost around the clock. While the NSE is closed, gold keeps moving overseas, so gold ETFs often open with gaps that reflect those moves (Day 13). During NSE hours, gold ETFs may be quieter in the morning and more active when European and other markets are open, but this varies.",
      "Gold often moves independently of the Nifty and sometimes in the opposite direction, for example on days of global risk aversion. This is a tendency, not a reliable inverse relationship — on some days both rise or both fall. Silver ETFs such as SILVERBEES follow similar drivers but are usually more volatile.",
      "Costs differ too: gold ETFs carry no STT on intraday trades, while brokerage, exchange charges, SEBI fee, stamp duty and GST still apply (Day 6). Their iNAV is based on the gold price rather than a basket of shares, and spreads and premiums should be checked as with any ETF."
    ],
    why: [
      "Applying equity-ETF thinking to gold leads to confusion: Indian market news may not matter, while an overnight dollar move does. Knowing what drives gold ETFs tells you which context to check and why their charts can look so different from NIFTYBEES.",
      "It also shows that 'the market' is not one thing — a useful idea when you later compare strategies across different ETFs."
    ],
    how: [
      "In Trading → Markets, open GOLDBEES and NIFTYBEES side by side over several sessions.",
      "Record each day's percentage change for both and mark days when they moved in opposite directions.",
      "Note gold ETF gap sizes at the open over those sessions and compare them with NIFTYBEES gaps.",
      "Write the gold cost stack (no STT) and recompute your Day 6 break-even move for a gold ETF.",
      "Run the ETF eligibility check in Trading → Practice on GOLDBEES and SILVERBEES.",
      "In the Trading Journal, list the drivers of gold ETFs and the days gold and Nifty diverged."
    ],
    example: {
      title: "Hypothetical example: why a gold ETF rose on a weak day",
      lines: [
        "Hypothetical overnight: international gold +0.6% in US dollars; rupee weakens 0.2% versus the dollar.",
        "Approximate effect on the rupee gold price: about +0.8%.",
        "Hypothetical gold ETF opens 0.7% above its previous close — a gap driven by overseas moves.",
        "Same hypothetical day: the broad index ETF falls 0.5% on weak global cues.",
        "Gold and the index moved in opposite directions here; on other days they may move together.",
        "All figures are hypothetical."
      ]
    },
    mistakes: [
      "Using Indian market news to explain gold ETF moves, when global gold prices and the rupee matter more.",
      "Assuming gold always rises when the Nifty falls, which treats a loose tendency as a rule.",
      "Forgetting that gold gaps overnight because international gold keeps trading.",
      "Applying equity-ETF STT to gold ETF cost calculations, which overstates costs.",
      "Ignoring spread and premium checks because gold feels 'safe', when ETF trading quality still varies."
    ],
    quiz: [
      { q: "What two factors mainly drive gold ETF prices in India?", a: "The international gold price in US dollars and the USD/INR exchange rate." },
      { q: "Do gold ETFs pay STT on intraday trades?", a: "No, though brokerage, exchange charges, SEBI fee, stamp duty and GST still apply." },
      { q: "Does gold always move opposite to the Nifty?", a: "No — it often moves independently and sometimes opposite, but this is a tendency, not a rule." }
    ]
  },

  21: {
    what: [
      "ETF vs index (Day 15): an index ETF follows its index with small tracking differences caused by costs, cash and trading; compare percentage moves, and expect brief intraday gaps from iNAV. Support and resistance (Day 16): zones where price has tended to stop or stall, from prior day levels, opening range, swings, VWAP and round numbers; broken levels may reverse roles.",
      "Market structure (Day 17): swing highs and lows define trends (HH/HL or LH/LL) and ranges (overlapping swings); a structure break is a warning, not a verdict. Conditions (Day 18): classify each phase as trending, ranging or choppy at fixed checkpoints; each strategy fits certain conditions and choppy usually fits none.",
      "Sector ETFs and rotation (Day 19): relative strength versus NIFTYBEES shows which sectors lead or lag today; sector ETFs are concentrated and often thinner. Gold ETFs (Day 20): driven by international gold and the rupee, gap overnight, carry no STT and often move independently of the Nifty.",
      "Today you combine these into a pre-session context checklist — the routine you will run before every simulated session for the rest of the journey."
    ],
    why: [
      "Strategies in the coming phases only work in the right context. A trend setup in a choppy session, a breakout into a higher-timeframe level, or a thin sector ETF with a wide spread can all turn a reasonable idea into a poor trade. A context checklist catches these before you act and makes 'no trade' a planned decision."
    ],
    how: [
      "Recall each topic from Days 15-20 in two sentences without notes, then check against the lessons.",
      "Draft a pre-session context checklist: ETF passes eligibility check; prior day levels marked; gap size noted; index and sector relative strength; gold and Nifty direction; condition at first checkpoint.",
      "In Trading → Replay, run the full checklist on one session before stepping forward, then classify conditions at 10:30, 12:30 and 14:30.",
      "Lock Long / Short / No-Trade decisions consistent with your checklist and review the process score.",
      "Save the checklist in the Playbook as 'My pre-session context checklist'.",
      "Identify your weakest concept from this phase and rewrite it with a hypothetical example.",
      "In the Psychology journal, note one moment this week when you wanted to act without context."
    ],
    example: {
      title: "Hypothetical self-review walkthrough: a context check",
      lines: [
        "Eligibility: hypothetical index ETF passes (spread 0.02%, adequate traded value).",
        "Levels: prior day high ₹252.00, low ₹249.50, close ₹251.00 (hypothetical).",
        "Gap: +0.3%; index and ETF agree within 0.02%. Banks leading (+0.4% relative), IT lagging.",
        "10:30 check: HH/HL above VWAP → trending; 12:30: overlapping swings → ranging; 14:30: choppy → no trade.",
        "Weakest concept: tracking error vs tracking difference — rewritten and saved.",
        "All details are hypothetical; this is a reading exercise, not a trade recommendation."
      ]
    },
    mistakes: [
      "Skipping the context check when a chart 'looks obvious', which is when it is most needed.",
      "Building a checklist so long it is never used; keep it to items you will actually check.",
      "Treating context as prediction, when it only shifts the odds about which approach fits.",
      "Reviewing only sessions that matched your expectations, which hides weaknesses in your reading.",
      "Leaving the checklist out of the Playbook, so it is not applied consistently."
    ],
    quiz: [
      { q: "Why compare NIFTYBEES and the Nifty 50 in percentages?", a: "The unit price is a fraction of the index level, so only percentage moves are comparable." },
      { q: "What does relative strength tell you?", a: "Whether an ETF or sector is outperforming or underperforming a benchmark so far today — not what it will do next." },
      { q: "What should happen when your checklist classifies the market as choppy?", a: "No trade — choppy conditions usually fit none of the course strategies." }
    ]
  }
};
