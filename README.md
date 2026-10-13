# Obsidian — Personal Performance OS

A calm, premium personal operating system — a trading **academy and journal** that replaces a physical trading notebook. Every day you learn, practice, journal, review — and get **1% better**.

> Educational journaling application only. It is **not** financial advice, shows **no live market data**, and never generates trades, prices or results. Every statistic comes from what you enter, and starts at zero. Backtests, paper trades and the candle trainer are clearly labelled as simulated.

## Features

Navigation is a floating glass bar with six sections — Home, Trading, Journal, Playbook, Timetable, Analytics — each with its own tab row.

| Area | Pages |
| --- | --- |
| **Home** | Hero, floating glass orb, Today's Objective, Next Action, aurora progress ring, vertical daily timeline, Trading Development rings, Today's 1% quote, streak and the flowing 84-day path |
| **Timetable** | **My Day** (3:00 AM – 8:00 PM routine in 28 blocks with task checklists, call/DM counters with targets, backup deep-work picker, activity log; past days keep the schedule they were recorded with) · **Trading Schedule** (Trading Education 5:00–5:45 AM + Trading Review 4:30–5:00 PM checklists, session timer) · **History** calendar · **Weekly Review** heatmaps |
| **Learn** | **84-Day ETF Day-Trading Journey** (12 phases: ETF foundations → charts → market context → risk → strategies A–D → backtesting → paper trading → psychology & playbook → evaluation) · daily lesson workspace with a full written lesson (what, why, how, hypothetical example, mistakes, 3-question self-check) and a reference video (suggested, YouTube search, or your own) · **The 1% Engine** · **Final Evaluation** |
| **ETF Trading Lab** | ETF-only learning, backtesting and paper trading — simulation only, virtual money, no broker (Trading → Learn · Practice · Replay · Backtest · Paper · Markets · Ask AI · Strategies · History). **Learn**: ETF Strategy Course — A Trend-Following, B Breakout, C Pullback, D Range-Bound, E Risk Management (rules, invalidation, when not to use, position-size / R:R / break-even calculator, progress). **Practice**: 11-step daily workflow + measured ETF eligibility (sessions, coverage, zero-volume bars, traded value, cost vs range) + market-regime mix. **Replay**: candle-by-candle historical ETF replay with locked decisions and process score. **Backtest**: 1m/5m/15m, signals at bar close → fills at next open, stop-before-target, gap fills at the open, end-of-day square-off, Indian cost model (brokerage, STT, NSE, SEBI, stamp, GST) + spread/slippage, daily loss limit & max trades, training vs out-of-sample split, overfitting & sample-size warnings, entry/exit markers, reproducible saved runs (data fingerprint), results by strategy and ETF, educational report. **Paper**: replays a real historical session bar by bar (labelled HISTORICAL), watchlist, market/limit orders, stop-loss/take-profit, risk checks that reject and log orders, required trade reason, daily-loss lock + cooldown, rule-violation log, session journal, self-review, report, log to Trading Journal, resettable virtual account. **Markets**: view-only TradingView ETF charts. Data: your intraday CSV (IST timestamps) or the optional Upstox connector (see [docs/upstox-setup.md](docs/upstox-setup.md)) — never generated |
| **AI Coach** | Free trading tutor that runs entirely in your browser (WebLLM, open-source Qwen 2.5 model — no API key, no server, questions never leave the device; needs WebGPU, downloads once). Floating **Ask AI** button on every page + **Trading → Ask AI**. Answers from your 84 lessons, reviews your journal / practice / Mistake Lab data, quizzes you on today's lesson (Coach me today), and suggests actions (open a lesson or page, draft a journal entry) that run only when you tap them. Without WebGPU it answers from lesson search |
| **Build** | **Strategy Lab** (multiple drafts + visual flow) · **Playbook** (10 editable sections, print view) |
| **Trading Journal** | Simulation / educational journal: full-screen entry editor (basic info, setup & R:R, six analysis prompts, chart screenshot with notes & zoom, execution review, mindset check, mistakes, result, auto-generated Today's 1% Improvement + Tomorrow's Focus), overview stats, searchable/filterable history timeline, journal analytics, weekly review with next week's 1% target, JSON/CSV export. Linked to the timetable (Open journal / Log today's session) and to strategies in the Playbook |
| **Track** | **Daily Journal** (auto score, screenshots) · **Psychology** journal · **Mistake Lab** · **Analytics** command center |
| **Vault** | Searchable **Knowledge Vault** |

Ticking a trading task on **Trading Schedule** also ticks it on **My Day** (they share one record per date). Tasks reset each calendar day; history is kept forever. Missed days never reset streak history or the 84-day journey.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm test           # ETF engine unit tests (vitest)
```

## Data & accounts

All data is saved instantly to **IndexedDB** in the browser, so it survives refreshes and closing the browser.

To get **real accounts with cloud sync** (data follows you across devices and survives logout):

1. Create a free project at [supabase.com](https://supabase.com).
2. In the Supabase **SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql). It creates one `documents` table protected by row-level security, so each user can only read their own data.
3. Copy `.env.example` to `.env` and fill in the values from *Project Settings → API*:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
4. Restart `npm run dev` (or rebuild). The app now opens with an email/password login.

Without these keys the app runs in **LOCAL MODE** (no login, data stays in this browser). **Settings → Export** downloads a full JSON backup at any time, and **Import** restores it. **Settings → Start over** erases all progress (after downloading a backup automatically) and restarts the 84-day journey with Day 1 today or tomorrow; preferences and imported CSV data are kept.

Writes always land locally first and sync to Supabase in the background, so the app keeps working offline and catches up when you reconnect.

## Tech

React 19 · TypeScript · Vite · framer-motion · Recharts · Supabase · lucide icons. Motion respects the operating system's *reduce motion* setting.
