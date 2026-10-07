# Obsidian — Personal Performance OS

A calm, premium personal operating system — a trading **academy and journal** that replaces a physical trading notebook. Every day you learn, practice, journal, review — and get **1% better**.

> Educational journaling application only. It is **not** financial advice, shows **no live market data**, and never generates trades, prices or results. Every statistic comes from what you enter, and starts at zero. Backtests, paper trades and the candle trainer are clearly labelled as simulated.

## Features

Navigation is a floating glass bar with six sections — Home, Trading, Journal, Playbook, Timetable, Analytics — each with its own tab row.

| Area | Pages |
| --- | --- |
| **Home** | Hero, floating glass orb, Today's Objective, Next Action, aurora progress ring, vertical daily timeline, Trading Development rings, Today's 1% quote, streak and the flowing 84-day path |
| **Timetable** | **My Day** (3:00 AM – 8:00 PM routine in 28 blocks with task checklists, call/DM counters with targets, backup deep-work picker, activity log; past days keep the schedule they were recorded with) · **Trading Schedule** (Trading Education 5:00–5:45 AM + Trading Review 4:30–5:00 PM checklists, session timer) · **History** calendar · **Weekly Review** heatmaps |
| **Learn** | **84-Day Journey** (12 phases built in) · daily **learning workspace** with a full written lesson for every day (what it is, why it matters, how to use it, hypothetical worked example, common mistakes, 3-question self-check) and a reference video (suggested pick, YouTube search, or your own link) · **The 1% Engine** · **Final Evaluation** |
| **Trading Practice Lab** | Simulation-only historical chart lab (Trading → Learn · Practice · Replay · Strategies · History): candlestick chart with zoom/pan/crosshair/volume and drawing tools, candle-by-candle **Replay** (×1–×10) with future candles hidden, locked Long / Short / **No Trade** decisions, simulated trade tracking (fill, stop/target, MFE/MAE), process-first **Practice Quality Score**, decision-vs-market review, one-click **Save to Trading Journal**, practice library, mistake heatmap + next 1% improvement, daily 84-day practice challenge, practice timer, CSV dataset import. Data: real crypto history from Binance's public market-data feed, or your own CSV (labelled USER-IMPORTED DATA) — never generated. Also: Chart Practice candle trainer, Backtesting and paper-trade logs |
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

Without these keys the app runs in **LOCAL MODE** (no login, data stays in this browser). **Settings → Export** downloads a full JSON backup at any time, and **Import** restores it.

Writes always land locally first and sync to Supabase in the background, so the app keeps working offline and catches up when you reconnect.

## Tech

React 19 · TypeScript · Vite · framer-motion · Recharts · Supabase · lucide icons. Motion respects the operating system's *reduce motion* setting.
