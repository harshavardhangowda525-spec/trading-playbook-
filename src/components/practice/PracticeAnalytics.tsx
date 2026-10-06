import { useMemo, type JSX, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertCircle, Compass, TrendingUp } from 'lucide-react';
import { CountUp, EmptyState, RingMeter } from '../ui';
import { useCollection } from '../../lib/hooks';
import { countBy } from '../../lib/journal';
import { SESSIONS_COL, practiceMistakeCounts, type PracticeSession } from '../../lib/practice';
import { fromKey } from '../../lib/dates';
import '../../styles/practice-insights.css';

// ─── Chart styling (shared brief) ──────────────────────────────────────────
const WARM = '#e9dfcb';
const VIOLET = '#c4b9e6';
const CHAMPAGNE = '#d6bd8a';
const TICK = { fill: '#8f8a82', fontSize: 11 };
const GRID = 'rgba(236,228,214,0.06)';
const TOOLTIP = {
  contentStyle: { background: 'rgba(20,19,23,0.95)', border: '1px solid rgba(236,228,214,0.15)', borderRadius: 10, fontSize: 12 },
  labelStyle: { color: '#bdb7ad' },
  itemStyle: { color: '#f1ece4' },
  cursor: { fill: 'rgba(236,228,214,0.04)', stroke: 'rgba(236,228,214,0.15)' },
};
const ease = [0.22, 1, 0.36, 1] as const;
const shortDate = (key: string) => fromKey(key).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

interface Stats {
  complete: PracticeSession[];
  studied: number;
  long: number;
  short: number;
  notrade: number;
  avgScore: number | null;
  ruleFollow: number | null;
  ruleSessions: number;
  progress: { n: number; date: string; score: number; ma: number }[];
  strategies: { label: string; count: number }[];
  mistakes: { label: string; count: number }[];
}

function computeStats(sessions: PracticeSession[]): Stats {
  const complete = sessions
    .filter((s) => s.status === 'complete')
    .sort((a, b) => (a.date === b.date ? a.createdAt - b.createdAt : a.date < b.date ? -1 : 1));
  const long = complete.filter((s) => s.decision === 'long').length;
  const short = complete.filter((s) => s.decision === 'short').length;
  const notrade = complete.filter((s) => s.decision === 'notrade').length;
  const scored = complete.filter((s) => s.score);
  const avgScore = scored.length ? scored.reduce((a, s) => a + s.score!.total, 0) / scored.length : null;
  const withRules = complete.filter((s) => s.strategyRules.length > 0);
  const ruleFollow = withRules.length
    ? withRules.reduce((a, s) => a + s.strategyRules.filter((r) => s.ruleChecks[r.key]).length / s.strategyRules.length, 0) / withRules.length
    : null;
  const progress = scored.map((s, i) => {
    const win = scored.slice(Math.max(0, i - 4), i + 1);
    return {
      n: i + 1,
      date: s.date,
      score: s.score!.total,
      ma: Math.round((win.reduce((a, x) => a + x.score!.total, 0) / win.length) * 10) / 10,
    };
  });
  return {
    complete,
    studied: long + short,
    long,
    short,
    notrade,
    avgScore,
    ruleFollow,
    ruleSessions: withRules.length,
    progress,
    strategies: countBy(complete, (s) => s.strategyName || 'No strategy').slice(0, 8),
    mistakes: practiceMistakeCounts(complete)
      .slice(0, 8)
      .map((m) => ({ label: m.label, count: m.count })),
  };
}

export function PracticeAnalytics({ compact }: { compact?: boolean }): JSX.Element {
  const sessions = useCollection<PracticeSession>(SESSIONS_COL).items;
  const stats = useMemo(() => computeStats(sessions), [sessions]);
  const reduce = useReducedMotion();
  const animate = !reduce;

  const band = <StatBand stats={stats} />;
  const progress = (
    <Panel
      i={compact ? 1 : 3}
      label="Learning progress"
      sub="Process score per completed session · 5-session average"
      empty={stats.progress.length < 2}
      emptyIcon={<TrendingUp size={22} strokeWidth={1.4} />}
      emptyTitle="Not enough sessions yet"
      emptyText="Complete at least two replay sessions to see how your process score develops."
      wide
    >
      <div className="px-legend" style={{ marginBottom: 10 }}>
        <span>
          <i style={{ background: VIOLET, opacity: 0.7 }} />
          Session score
        </span>
        <span>
          <i style={{ background: CHAMPAGNE }} />5-session average
        </span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={stats.progress} margin={{ top: 10, right: 12, bottom: 0, left: -18 }}>
          <CartesianGrid stroke={GRID} vertical={false} />
          <XAxis dataKey="n" tick={TICK} axisLine={false} tickLine={false} minTickGap={16} />
          <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={TICK} axisLine={false} tickLine={false} />
          <Tooltip
            {...TOOLTIP}
            labelFormatter={(n, p) => {
              const d = p?.[0]?.payload?.date as string | undefined;
              return `Session ${n}${d ? ` · ${shortDate(d)}` : ''}`;
            }}
            formatter={(v, name) => [String(v), name === 'ma' ? '5-session avg' : 'Process score']}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke={VIOLET}
            strokeOpacity={0.6}
            strokeWidth={1.2}
            dot={{ r: 2.5, fill: VIOLET, strokeWidth: 0 }}
            isAnimationActive={animate}
            animationDuration={1000}
          />
          <Line
            type="monotone"
            dataKey="ma"
            stroke={CHAMPAGNE}
            strokeWidth={2}
            dot={false}
            isAnimationActive={animate}
            animationDuration={1200}
          />
        </LineChart>
      </ResponsiveContainer>
    </Panel>
  );

  if (compact) {
    return (
      <div className="px-root">
        {band}
        {progress}
      </div>
    );
  }

  return (
    <div className="px-root">
      <div className="px-head">
        <div className="px-head-text">
          <span className="px-label">Practice lab</span>
          <p>How your replay practice is building skill — decisions, process and rule-following. Simulated results are deliberately left out.</p>
        </div>
      </div>
      {band}
      <div className="px-grid">
        <Panel
          i={1}
          label="Strategy usage"
          sub="Completed sessions"
          empty={!stats.strategies.length}
          emptyIcon={<Compass size={22} strokeWidth={1.4} />}
          emptyTitle="No sessions yet"
          emptyText="Strategies you practise appear here."
        >
          <HBars data={stats.strategies} color={WARM} animate={animate} />
        </Panel>
        <Panel
          i={2}
          label="Common mistakes"
          sub="Confirmed in review"
          empty={!stats.mistakes.length}
          emptyIcon={<AlertCircle size={22} strokeWidth={1.4} />}
          emptyTitle="No mistakes recorded"
          emptyText="Mistakes you confirm when reviewing a session appear here."
        >
          <HBars data={stats.mistakes} color={CHAMPAGNE} animate={animate} />
        </Panel>
        {progress}
      </div>
    </div>
  );
}

// ─── Pieces ────────────────────────────────────────────────────────────────

function StatBand({ stats }: { stats: Stats }) {
  const none = stats.complete.length === 0;
  const cells: { label: string; body: ReactNode; foot: string }[] = [
    {
      label: 'Practice sessions',
      body: <span className={none ? 'px-big dim' : 'px-big'}>{<CountUp value={stats.complete.length} />}</span>,
      foot: 'Completed replays',
    },
    {
      label: 'Setups studied',
      body: <span className={none ? 'px-big dim' : 'px-big'}>{<CountUp value={stats.studied} />}</span>,
      foot: 'Historical setups with a trade decision',
    },
    {
      label: 'Long / Short / No trade',
      body: (
        <div className="px-lsn">
          {(
            [
              ['L', stats.long],
              ['S', stats.short],
              ['N', stats.notrade],
            ] as const
          ).map(([k, v]) => (
            <div key={k}>
              <span className={none ? 'px-big dim' : 'px-big'}>
                <CountUp value={v} />
              </span>
              <span className="px-sub">{k === 'L' ? 'Long' : k === 'S' ? 'Short' : 'No trade'}</span>
            </div>
          ))}
        </div>
      ),
      foot: 'Decisions made',
    },
    {
      label: 'Avg process score',
      body:
        stats.avgScore == null ? (
          <span className="px-big dim">—</span>
        ) : (
          <div className="row" style={{ gap: 14, alignItems: 'center' }}>
            <RingMeter value={stats.avgScore / 100} size={46} stroke={2.5} showValue={false} />
            <span className="px-big">
              <CountUp value={stats.avgScore} />
              <small> /100</small>
            </span>
          </div>
        ),
      foot: 'Process, not result',
    },
    {
      label: 'Rule-following',
      body:
        stats.ruleFollow == null ? (
          <span className="px-big dim">—</span>
        ) : (
          <span className="px-big">
            <CountUp value={stats.ruleFollow * 100} />
            <small>%</small>
          </span>
        ),
      foot: stats.ruleSessions ? `Across ${stats.ruleSessions} session${stats.ruleSessions === 1 ? '' : 's'} with strategy rules` : 'No strategy rules used yet',
    },
  ];
  return (
    <div className="px-stats">
      {cells.map((c, i) => (
        <motion.div
          key={c.label}
          className="glass px-stat"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.05, ease }}
        >
          <span className="px-label">{c.label}</span>
          {c.body}
          <span className="px-sub">{c.foot}</span>
        </motion.div>
      ))}
    </div>
  );
}

function Panel({
  i,
  label,
  sub,
  empty,
  emptyIcon,
  emptyTitle,
  emptyText,
  wide,
  children,
}: {
  i: number;
  label: string;
  sub?: string;
  empty: boolean;
  emptyIcon: ReactNode;
  emptyTitle: string;
  emptyText: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <motion.section
      className={wide ? 'glass px-panel px-wide' : 'glass px-panel'}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.1 + i * 0.05, ease }}
    >
      <div className="px-panel-head">
        <span className="px-label">{label}</span>
        {sub && <span className="px-sub">{sub}</span>}
      </div>
      {empty ? <EmptyState icon={emptyIcon} title={emptyTitle} text={emptyText} /> : children}
    </motion.section>
  );
}

function HBars({ data, color, animate }: { data: { label: string; count: number }[]; color: string; animate: boolean }) {
  const h = Math.max(140, data.length * 34 + 16);
  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 18, bottom: 4, left: 4 }} barCategoryGap={8}>
        <CartesianGrid stroke={GRID} horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={TICK} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="label" width={130} tick={TICK} axisLine={false} tickLine={false} />
        <Tooltip {...TOOLTIP} formatter={(v) => [`${v} sessions`, '']} separator="" />
        <Bar
          dataKey="count"
          fill={color}
          fillOpacity={0.4}
          stroke={color}
          strokeOpacity={0.55}
          radius={[0, 4, 4, 0]}
          maxBarSize={22}
          isAnimationActive={animate}
          animationDuration={900}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
