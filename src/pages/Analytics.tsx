import { useId, useMemo, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Activity, BookOpen, Brain, Crosshair, FlaskConical, Gauge, Scale, ShieldAlert, Target, TrendingUp } from 'lucide-react';
import { CountUp, EmptyState, PageHeader, Panel, SegControl, reveal } from '../components/ui';
import { useDayLogs, useProfile, useSkillInputs, useSkills } from '../lib/data';
import { useToday } from '../lib/hooks';
import {
  STREAK_META,
  computeStreak,
  dayStats,
  journalScore,
  mistakeStats,
  plannedRR,
  tradeStats,
  type Trade,
} from '../lib/domain';
import { addDays, formatLong, fromKey, rangeKeys } from '../lib/dates';
import '../styles/analytics.css';

// ─── Chart styling (shared brief) ──────────────────────────────────────────
const CYAN = '#e9dfcb';
const BLUE = '#a89bd4';
const TEAL = '#d6bd8a';
const TICK = { fill: '#8f8a82', fontSize: 11 };
const GRID = 'rgba(214, 208, 198,0.08)';
const TOOLTIP = {
  contentStyle: { background: 'rgba(20, 19, 23, 0.95)', border: '1px solid rgba(214, 208, 198,0.3)', borderRadius: 6, fontSize: 12 },
  labelStyle: { color: '#bdb7ad' },
  itemStyle: { color: '#f1ece4' },
  cursor: { stroke: 'rgba(232, 220, 196,0.25)' },
};
const LEGEND = { wrapperStyle: { fontSize: 11, color: '#8f8a82' } };
const H = 240;

type Range = '14' | '30' | '84';

const shortDate = (key: string) => fromKey(key).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
const pct = (x: number) => Math.round(x * 100);
const round2 = (x: number) => Math.round(x * 100) / 100;

/** SVG defs: glow filter + vertical fade gradients, ids namespaced per chart. */
function ChartDefs({ id, colors }: { id: string; colors: string[] }) {
  return (
    <defs>
      <filter id={`${id}-glow`} x="-20%" y="-50%" width="140%" height="200%">
        <feGaussianBlur stdDeviation="3" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      {colors.map((c, i) => (
        <linearGradient key={c + i} id={`${id}-g${i}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c} stopOpacity={0.4} />
          <stop offset="100%" stopColor={c} stopOpacity={0} />
        </linearGradient>
      ))}
    </defs>
  );
}

function useChartId() {
  return 'c' + useId().replace(/[^a-zA-Z0-9]/g, '');
}

function ChartPanel({
  title,
  sub,
  icon,
  index,
  empty,
  emptyTitle,
  emptyText,
  aside,
  wide,
  children,
}: {
  title: string;
  sub?: ReactNode;
  icon: ReactNode;
  index: number;
  empty: boolean;
  emptyTitle: string;
  emptyText: ReactNode;
  aside?: ReactNode;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <motion.div variants={reveal} initial="hidden" animate="show" custom={index} className={wide ? 'span-all' : undefined}>
      <Panel title={title} sub={sub} className="an-panel">
        {empty ? (
          <EmptyState icon={icon} title={emptyTitle} text={emptyText} />
        ) : (
          <>
            {aside && <div className="an-aside">{aside}</div>}
            {children}
          </>
        )}
      </Panel>
    </motion.div>
  );
}

function Mini({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="an-mini">
      <span className="stat-label">{label}</span>
      <span className="an-mini-value num">{value}</span>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export function Analytics() {
  const today = useToday();
  const reduce = useReducedMotion();
  const animate = !reduce;
  const { profile } = useProfile();
  const { logs, map } = useDayLogs();
  const inputs = useSkillInputs();
  const skills = useSkills();
  const [range, setRange] = useState<Range>('30');
  const days = Number(range);

  // Top metrics
  const { best, worst } = useMemo(() => {
    const ranked = logs
      .filter((l) => l.id <= today)
      .map((l) => ({ date: l.id, pct: dayStats(l).pct }))
      .sort((a, b) => b.pct - a.pct || (a.date < b.date ? 1 : -1));
    if (!ranked.length) return { best: null, worst: null };
    const worstPct = ranked[ranked.length - 1].pct;
    return {
      best: ranked[0],
      // most recent day sharing the lowest completion
      worst: ranked.filter((r) => r.pct === worstPct).sort((a, b) => (a.date < b.date ? 1 : -1))[0],
    };
  }, [logs, today]);
  const streak = useMemo(() => computeStreak('daily', map, today), [map, today]);

  const radar = useMemo(
    () => [
      { axis: 'Knowledge', v: pct(skills.knowledge) },
      { axis: 'Strategy', v: pct(skills.strategy) },
      { axis: 'Risk', v: pct(skills.risk) },
      { axis: 'Discipline', v: pct(skills.discipline) },
      { axis: 'Psychology', v: pct(skills.psychology) },
    ],
    [skills],
  );
  const radarEmpty = radar.every((r) => r.v === 0);

  // Window for time series: never before Day 1.
  const windowKeys = useMemo(() => {
    let from = addDays(today, -(days - 1));
    if (profile.startDate && profile.startDate > from) from = profile.startDate;
    return from <= today ? rangeKeys(from, today) : [today];
  }, [today, days, profile.startDate]);
  const windowStart = windowKeys[0];

  const journalByDate = useMemo(() => new Map(inputs.journals.map((j) => [j.date, j])), [inputs.journals]);

  // Learning progress — cumulative lessons by completion date
  const learning = useMemo(() => {
    const dates = inputs.journey
      .filter((j) => j.completed && j.completedDate)
      .map((j) => j.completedDate!)
      .sort();
    const out: { date: string; lessons: number }[] = [];
    dates.forEach((d, i) => {
      if (out.length && out[out.length - 1].date === d) out[out.length - 1].lessons = i + 1;
      else out.push({ date: d, lessons: i + 1 });
    });
    return out;
  }, [inputs.journey]);

  // Daily improvement
  const daily = useMemo(
    () =>
      windowKeys.map((k) => {
        const log = map.get(k);
        return {
          date: k,
          completion: log ? pct(dayStats(log).pct) : 0,
          journal: journalScore(journalByDate.get(k)),
        };
      }),
    [windowKeys, map, journalByDate],
  );
  const dailyEmpty = !windowKeys.some((k) => map.has(k) || journalScore(journalByDate.get(k)) != null);

  // Discipline / confidence ratings
  const discipline = useMemo(
    () =>
      inputs.journals
        .filter((j) => j.date >= windowStart && j.date <= today && journalScore(j) != null)
        .sort((a, b) => (a.date < b.date ? -1 : 1))
        .map((j) => ({ date: j.date, discipline: j.discipline, confidence: j.confidence })),
    [inputs.journals, windowStart, today],
  );

  // Strategy performance (backtests + sims)
  const setups = useMemo(
    () => tradeStats([...inputs.backtests, ...inputs.sims]).bySetup.slice(0, 10).map((s) => ({ ...s, winPct: pct(s.winRate) })),
    [inputs.backtests, inputs.sims],
  );

  // Cumulative win rate per series
  const winRate = useMemo(() => {
    const series = (ts: Trade[]) => {
      const closed = [...ts]
        .filter((t) => t.outcome !== 'open')
        .sort((a, b) => (a.date === b.date ? a.num - b.num : a.date < b.date ? -1 : 1));
      let w = 0;
      return closed.map((t, i) => {
        if (t.outcome === 'win') w++;
        return Math.round((w / (i + 1)) * 1000) / 10;
      });
    };
    const b = series(inputs.backtests);
    const s = series(inputs.sims);
    const j = series(inputs.trades);
    const n = Math.max(b.length, s.length, j.length);
    return Array.from({ length: n }, (_, i) => ({ n: i + 1, backtest: b[i] ?? null, simulation: s[i] ?? null, journal: j[i] ?? null }));
  }, [inputs.backtests, inputs.sims, inputs.trades]);

  // Risk / reward distribution
  const rr = useMemo(() => {
    const vals = [...inputs.trades, ...inputs.backtests, ...inputs.sims].map(plannedRR).filter((x): x is number => x != null);
    const buckets = [
      { label: '< 1', test: (x: number) => x < 1 },
      { label: '1–1.5', test: (x: number) => x >= 1 && x < 1.5 },
      { label: '1.5–2', test: (x: number) => x >= 1.5 && x < 2 },
      { label: '2–3', test: (x: number) => x >= 2 && x < 3 },
      { label: '≥ 3', test: (x: number) => x >= 3 },
    ].map((b) => ({ label: b.label, trades: vals.filter(b.test).length }));
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
    const atLeast2 = vals.length ? vals.filter((x) => x >= 2).length / vals.length : 0;
    return { buckets, avg, count: vals.length, atLeast2 };
  }, [inputs.trades, inputs.backtests, inputs.sims]);

  const simStats = useMemo(() => tradeStats(inputs.sims), [inputs.sims]);
  const mistakes = useMemo(() => mistakeStats(inputs.mistakes), [inputs.mistakes]);
  const mistakeBars = mistakes.frequency.slice(0, 10);

  // Emotional consistency
  const emotional = useMemo(() => {
    const pts = inputs.psych
      .filter((p) => p.date >= windowStart && p.date <= today)
      .sort((a, b) => (a.date < b.date ? -1 : 1))
      .map((p) => ({ date: p.date, rating: p.rating }));
    const xs = pts.map((p) => p.rating);
    const mean = xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
    const sd = xs.length ? Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / xs.length) : 0;
    return { pts, mean, sd };
  }, [inputs.psych, windowStart, today]);

  const ids = {
    radar: useChartId(),
    learn: useChartId(),
    daily: useChartId(),
    disc: useChartId(),
    strat: useChartId(),
    win: useChartId(),
    rr: useChartId(),
    sim: useChartId(),
    mis: useChartId(),
    emo: useChartId(),
  };

  const rangeCtl = (
    <SegControl<Range>
      value={range}
      onChange={setRange}
      options={[
        { value: '14', label: '14D' },
        { value: '30', label: '30D' },
        { value: '84', label: '84D' },
      ]}
    />
  );

  let i = 0;
  return (
    <div className="analytics">
      <PageHeader
        eyebrow="PERFORMANCE INTELLIGENCE"
        title="ANALYTICS COMMAND CENTER"
        description="Every chart is drawn only from what you have logged — timetable, lessons, journals, backtests, simulations and mistakes."
        actions={rangeCtl}
      />

      {/* ── Top metrics ─────────────────────────────────────────────── */}
      <div className="an-top">
        <motion.div variants={reveal} initial="hidden" animate="show" custom={0} className="an-metric glass hud">
          <span className="stat-label">Best Day</span>
          {best ? (
            <>
              <span className="an-big">
                <CountUp value={pct(best.pct)} />
                <small>%</small>
              </span>
              <span className="an-note">{formatLong(best.date)}</span>
            </>
          ) : (
            <>
              <span className="an-big dim">—</span>
              <span className="an-note">No timetable days logged yet</span>
            </>
          )}
        </motion.div>
        <motion.div variants={reveal} initial="hidden" animate="show" custom={1} className="an-metric glass hud">
          <span className="stat-label">Worst Day</span>
          {worst ? (
            <>
              <span className="an-big">
                <CountUp value={pct(worst.pct)} />
                <small>%</small>
              </span>
              <span className="an-note">{formatLong(worst.date)}</span>
            </>
          ) : (
            <>
              <span className="an-big dim">—</span>
              <span className="an-note">No timetable days logged yet</span>
            </>
          )}
        </motion.div>
        <motion.div variants={reveal} initial="hidden" animate="show" custom={2} className="an-metric glass hud">
          <span className="stat-label">Current Streak</span>
          <span className="an-big">
            <CountUp value={streak.current} />
            <small>{streak.current === 1 ? 'day' : 'days'}</small>
          </span>
          <span className="an-note">{STREAK_META.daily.rule}</span>
        </motion.div>
        <motion.div variants={reveal} initial="hidden" animate="show" custom={3} className="an-metric glass hud">
          <span className="stat-label">Longest Streak</span>
          <span className="an-big">
            <CountUp value={streak.longest} />
            <small>{streak.longest === 1 ? 'day' : 'days'}</small>
          </span>
          <span className="an-note">{STREAK_META.daily.rule}</span>
        </motion.div>
      </div>

      <div className="an-grid">
        {/* ── Radar ─────────────────────────────────────────────────── */}
        <ChartPanel
          index={i++}
          title="Performance Radar"
          sub="skill model"
          icon={<Crosshair size={22} />}
          empty={radarEmpty}
          emptyTitle="Radar offline"
          emptyText="Complete lessons, draft a strategy, log journals with ratings and psychology days to light up the radar."
        >
          <div className="an-radar">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radar} outerRadius="72%">
                <ChartDefs id={ids.radar} colors={[CYAN]} />
                <PolarGrid stroke="rgba(214, 208, 198,0.14)" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: '#bdb7ad', fontSize: 11, letterSpacing: 1.5 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  dataKey="v"
                  name="Score"
                  stroke={CYAN}
                  strokeWidth={2}
                  fill={CYAN}
                  fillOpacity={0.18}
                  filter={`url(#${ids.radar}-glow)`}
                  dot={{ r: 3, fill: CYAN, strokeWidth: 0 }}
                  isAnimationActive={animate}
                />
                <Tooltip {...TOOLTIP} formatter={(v) => [`${v}%`, 'Score']} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ChartPanel>

        {/* ── Learning progress ─────────────────────────────────────── */}
        <ChartPanel
          index={i++}
          title="Learning Progress"
          sub="cumulative lessons"
          icon={<BookOpen size={22} />}
          empty={!learning.length}
          emptyTitle="No lessons completed"
          emptyText="Complete a lesson in the 84-day Journey and its completion date will plot here."
          aside={<Mini label="Lessons" value={`${learning[learning.length - 1]?.lessons ?? 0} / 84`} />}
        >
          <ResponsiveContainer width="100%" height={H}>
            <AreaChart data={learning} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <ChartDefs id={ids.learn} colors={[CYAN]} />
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="date" tickFormatter={shortDate} tick={TICK} axisLine={false} tickLine={false} minTickGap={24} />
              <YAxis allowDecimals={false} tick={TICK} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP} labelFormatter={(l) => formatLong(String(l))} />
              <Area
                type="stepAfter"
                dataKey="lessons"
                name="Lessons"
                stroke={CYAN}
                strokeWidth={2}
                fill={`url(#${ids.learn}-g0)`}
                filter={`url(#${ids.learn}-glow)`}
                isAnimationActive={animate}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>

        {/* ── Daily improvement ─────────────────────────────────────── */}
        <ChartPanel
          index={i++}
          wide
          title="Daily Improvement"
          sub={`last ${windowKeys.length} days`}
          icon={<TrendingUp size={22} />}
          empty={dailyEmpty}
          emptyTitle="No days in range"
          emptyText="Tick tasks in MY DAY and write your daily journal — completion % and journal score will chart day by day."
        >
          <ResponsiveContainer width="100%" height={H + 20}>
            <ComposedChart data={daily} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <ChartDefs id={ids.daily} colors={[CYAN, BLUE]} />
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="date" tickFormatter={shortDate} tick={TICK} axisLine={false} tickLine={false} minTickGap={20} />
              <YAxis domain={[0, 100]} tick={TICK} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP} labelFormatter={(l) => formatLong(String(l))} />
              <Legend {...LEGEND} />
              <Area
                type="monotone"
                dataKey="completion"
                name="Timetable %"
                stroke={CYAN}
                strokeWidth={2}
                fill={`url(#${ids.daily}-g0)`}
                filter={`url(#${ids.daily}-glow)`}
                isAnimationActive={animate}
              />
              <Line
                type="monotone"
                dataKey="journal"
                name="Journal score"
                stroke={BLUE}
                strokeWidth={2}
                dot={{ r: 2.5, fill: BLUE, strokeWidth: 0 }}
                connectNulls
                isAnimationActive={animate}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartPanel>

        {/* ── Discipline ───────────────────────────────────────────── */}
        <ChartPanel
          index={i++}
          title="Discipline"
          sub="journal ratings"
          icon={<ShieldAlert size={22} />}
          empty={!discipline.length}
          emptyTitle="No rated journals"
          emptyText="Answer at least one prompt in the Daily Journal and set your discipline and confidence ratings."
          aside={
            <>
              <Mini label="Avg discipline" value={(discipline.reduce((a, d) => a + d.discipline, 0) / (discipline.length || 1)).toFixed(1)} />
              <Mini label="Avg confidence" value={(discipline.reduce((a, d) => a + d.confidence, 0) / (discipline.length || 1)).toFixed(1)} />
            </>
          }
        >
          <ResponsiveContainer width="100%" height={H}>
            <LineChart data={discipline} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <ChartDefs id={ids.disc} colors={[CYAN]} />
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="date" tickFormatter={shortDate} tick={TICK} axisLine={false} tickLine={false} minTickGap={20} />
              <YAxis domain={[0, 10]} tick={TICK} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP} labelFormatter={(l) => formatLong(String(l))} />
              <Legend {...LEGEND} />
              <Line
                type="monotone"
                dataKey="discipline"
                name="Discipline"
                stroke={CYAN}
                strokeWidth={2}
                dot={{ r: 2.5, fill: CYAN, strokeWidth: 0 }}
                filter={`url(#${ids.disc}-glow)`}
                isAnimationActive={animate}
              />
              <Line
                type="monotone"
                dataKey="confidence"
                name="Confidence"
                stroke={BLUE}
                strokeWidth={2}
                dot={{ r: 2.5, fill: BLUE, strokeWidth: 0 }}
                isAnimationActive={animate}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>

        {/* ── Emotional consistency ────────────────────────────────── */}
        <ChartPanel
          index={i++}
          title="Emotional Consistency"
          sub="psychology rating"
          icon={<Brain size={22} />}
          empty={!emotional.pts.length}
          emptyTitle="No psychology entries"
          emptyText="Log your overall emotional state in the Psychology journal. Lower spread = steadier mindset."
          aside={
            <>
              <Mini label="Average" value={emotional.mean.toFixed(1)} />
              <Mini label="Consistency (σ)" value={emotional.sd.toFixed(2)} />
            </>
          }
        >
          <ResponsiveContainer width="100%" height={H}>
            <AreaChart data={emotional.pts} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <ChartDefs id={ids.emo} colors={[TEAL]} />
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="date" tickFormatter={shortDate} tick={TICK} axisLine={false} tickLine={false} minTickGap={20} />
              <YAxis domain={[0, 10]} tick={TICK} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP} labelFormatter={(l) => formatLong(String(l))} />
              <ReferenceLine y={round2(emotional.mean)} stroke="rgba(79,247,201,0.4)" strokeDasharray="4 4" />
              <Area
                type="monotone"
                dataKey="rating"
                name="Rating"
                stroke={TEAL}
                strokeWidth={2}
                fill={`url(#${ids.emo}-g0)`}
                filter={`url(#${ids.emo}-glow)`}
                dot={{ r: 2.5, fill: TEAL, strokeWidth: 0 }}
                isAnimationActive={animate}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>

        {/* ── Strategy performance ─────────────────────────────────── */}
        <ChartPanel
          index={i++}
          title="Strategy Performance"
          sub="by setup · backtests + sims"
          icon={<Target size={22} />}
          empty={!setups.length}
          emptyTitle="No closed practice trades"
          emptyText="Log backtests or simulated trades with a setup name and an outcome to compare setups."
        >
          <ResponsiveContainer width="100%" height={H}>
            <BarChart data={setups} margin={{ top: 8, right: -10, left: -18, bottom: 0 }}>
              <ChartDefs id={ids.strat} colors={[CYAN, BLUE]} />
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="setup" tick={TICK} axisLine={false} tickLine={false} interval={0} tickFormatter={(s: string) => (s.length > 10 ? s.slice(0, 9) + '…' : s)} />
              <YAxis yAxisId="r" tick={TICK} axisLine={false} tickLine={false} />
              <YAxis yAxisId="w" orientation="right" domain={[0, 100]} tick={TICK} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP} cursor={{ fill: 'rgba(232, 220, 196,0.06)' }} />
              <Legend {...LEGEND} />
              <ReferenceLine yAxisId="r" y={0} stroke="rgba(214, 208, 198,0.25)" />
              <Bar yAxisId="r" dataKey="netR" name="Net R" fill={CYAN} fillOpacity={0.75} radius={[3, 3, 0, 0]} isAnimationActive={animate} />
              <Bar yAxisId="w" dataKey="winPct" name="Win rate %" fill={BLUE} fillOpacity={0.6} radius={[3, 3, 0, 0]} isAnimationActive={animate} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        {/* ── Win rate ─────────────────────────────────────────────── */}
        <ChartPanel
          index={i++}
          title="Win Rate"
          sub="cumulative over trade count"
          icon={<Gauge size={22} />}
          empty={!winRate.length}
          emptyTitle="No closed trades"
          emptyText="Close a trade (win, loss or breakeven) in Backtesting, Simulation or the Trading Journal."
        >
          <ResponsiveContainer width="100%" height={H}>
            <LineChart data={winRate} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <ChartDefs id={ids.win} colors={[CYAN]} />
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="n" tick={TICK} axisLine={false} tickLine={false} minTickGap={16} />
              <YAxis domain={[0, 100]} tick={TICK} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP} labelFormatter={(l) => `Trade #${l}`} formatter={(v) => (v == null ? '—' : `${v}%`)} />
              <Legend {...LEGEND} />
              <Line type="monotone" dataKey="backtest" name="Backtest" stroke={CYAN} strokeWidth={2} dot={false} connectNulls filter={`url(#${ids.win}-glow)`} isAnimationActive={animate} />
              <Line type="monotone" dataKey="simulation" name="Simulation" stroke={BLUE} strokeWidth={2} dot={false} connectNulls isAnimationActive={animate} />
              <Line type="monotone" dataKey="journal" name="Journal" stroke={TEAL} strokeWidth={2} dot={false} connectNulls isAnimationActive={animate} />
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>

        {/* ── Risk / reward ────────────────────────────────────────── */}
        <ChartPanel
          index={i++}
          title="Risk / Reward"
          sub="planned R:R distribution"
          icon={<Scale size={22} />}
          empty={!rr.count}
          emptyTitle="No planned R:R"
          emptyText="Enter entry, stop and target on any trade, backtest or simulation to measure planned risk/reward."
          aside={
            <>
              <Mini label="Average R:R" value={rr.avg != null ? `1 : ${rr.avg.toFixed(2)}` : '—'} />
              <Mini label="≥ 1:2" value={`${pct(rr.atLeast2)}%`} />
              <Mini label="Trades" value={rr.count} />
            </>
          }
        >
          <ResponsiveContainer width="100%" height={H}>
            <BarChart data={rr.buckets} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <ChartDefs id={ids.rr} colors={[CYAN]} />
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="label" tick={TICK} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={TICK} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP} cursor={{ fill: 'rgba(232, 220, 196,0.06)' }} labelFormatter={(l) => `R:R ${l}`} />
              <Bar dataKey="trades" name="Trades" fill={`url(#${ids.rr}-g0)`} stroke={CYAN} strokeWidth={1} radius={[3, 3, 0, 0]} isAnimationActive={animate} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        {/* ── Simulated performance ─────────────────────────────────── */}
        <ChartPanel
          index={i++}
          title="Simulated Performance"
          sub="SIMULATED · paper trades only"
          icon={<FlaskConical size={22} />}
          empty={!simStats.equity.length}
          emptyTitle="No simulated trades"
          emptyText="Close paper trades in the Simulation module to draw a cumulative R equity curve. Simulated — not real money."
          aside={
            <>
              <span className="badge warn">SIMULATED</span>
              <Mini label="Net R" value={simStats.netR.toFixed(2)} />
              <Mini label="Expectancy" value={simStats.expectancy != null ? `${simStats.expectancy.toFixed(2)}R` : '—'} />
            </>
          }
        >
          <ResponsiveContainer width="100%" height={H}>
            <AreaChart data={simStats.equity} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <ChartDefs id={ids.sim} colors={[BLUE]} />
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="n" tick={TICK} axisLine={false} tickLine={false} minTickGap={16} />
              <YAxis tick={TICK} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP} labelFormatter={(l) => `Simulated trade #${l}`} formatter={(v) => [`${v}R`, 'Cumulative']} />
              <ReferenceLine y={0} stroke="rgba(214, 208, 198,0.25)" />
              <Area
                type="monotone"
                dataKey="cum"
                name="Cumulative R"
                stroke={BLUE}
                strokeWidth={2}
                fill={`url(#${ids.sim}-g0)`}
                filter={`url(#${ids.sim}-glow)`}
                isAnimationActive={animate}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>

        {/* ── Mistake frequency ─────────────────────────────────────── */}
        <ChartPanel
          index={i++}
          wide
          title="Mistake Frequency"
          sub={mistakes.total ? `${mistakes.total} logged · ${mistakes.improved} improved` : undefined}
          icon={<Activity size={22} />}
          empty={!mistakeBars.length}
          emptyTitle="No mistakes logged"
          emptyText="Record mistakes in the Mistake Lab to see which patterns repeat most."
        >
          <ResponsiveContainer width="100%" height={Math.max(H, mistakeBars.length * 30 + 20)}>
            <BarChart data={mistakeBars} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
              <ChartDefs id={ids.mis} colors={[CYAN]} />
              <CartesianGrid stroke={GRID} horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={TICK} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="label"
                width={120}
                tick={TICK}
                axisLine={false}
                tickLine={false}
                tickFormatter={(s: string) => (s.length > 18 ? s.slice(0, 17) + '…' : s)}
              />
              <Tooltip {...TOOLTIP} cursor={{ fill: 'rgba(232, 220, 196,0.06)' }} />
              <Bar dataKey="count" name="Occurrences" fill={CYAN} fillOpacity={0.7} radius={[0, 3, 3, 0]} barSize={14} isAnimationActive={animate} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>

      <p className="an-foot tiny dim">
        Educational analytics from your own records. Backtest and simulation figures are practice results, not real trading performance or financial advice.
      </p>
    </div>
  );
}
