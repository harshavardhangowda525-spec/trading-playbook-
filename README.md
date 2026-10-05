# Quantum Core — Day Trading Playbook & Command Center

A futuristic, JARVIS-style personal trading **academy and journal** that replaces a physical trading notebook. Every day you learn, practice, journal, review — and get **1% better**.

> Educational journaling application only. It is **not** financial advice, shows **no live market data**, and never generates trades, prices or results. Every statistic comes from what you enter, and starts at zero. Backtests, paper trades and the candle trainer are clearly labelled as simulated.

## Features

| Area | Pages |
| --- | --- |
| **Core** | Command Center dashboard — holographic 1% core with orbital rings (Trading · Study · Business · Fitness · Discipline), Today's Mission, Next Task with countdown, streak, Trading Development meters, today's timetable, 84-day journey strip, quick actions, End-of-Day System Check |
| **Schedule** | **My Day** (full daily routine, client-acquisition counters with targets, backup deep-work picker, activity log) · **Trading Schedule** (morning education + evening practice checklists, session timer) · **History** calendar · **Weekly Review** heatmaps |
| **Learn** | **84-Day Journey** (12 phases built in) · daily **learning workspace** · **The 1% Engine** · **Final Evaluation** |
| **Practice** | **Chart Practice** (practice log + synthetic Candle Trainer) · **Backtesting** journal · **Simulation** (paper trading) |
| **Build** | **Strategy Lab** (multiple drafts + visual flow) · **Playbook** (10 editable sections, print view) |
| **Track** | **Trading Journal** (filters) · **Daily Journal** (auto score, screenshots) · **Psychology** journal · **Mistake Lab** · **Analytics** command center |
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
