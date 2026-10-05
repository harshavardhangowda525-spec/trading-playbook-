import { useMemo, type JSX, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertCircle, BarChart3, BookOpen, CalendarDays, Compass, Globe2, ListChecks, Waves } from 'lucide-react';
import { CountUp, EmptyState, RingMeter, cx } from '../ui';
import { useCollection, useToday } from '../../lib/hooks';
import {
  CHECKS,
  CONDITIONS,
  JOURNAL_COLLECTION,
  countBy,
  journalStats,
  mistakeCounts,
  ruleScore,
  type JournalTradeEntry,
} from '../../lib/journal';
import { addDays, fromKey, startOfMonth, startOfWeek } from '../../lib/dates';
import '../../styles/journal-insights.css';

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
const H = 220;
const ease = [0.22, 1, 0.36, 1] as const;

const shortDate = (key: string) => fromKey(key).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
const monthShort = (key: string) => fromKey(key).toLocaleDateString(undefined, { month: 'short' });
const isReviewed = (e: JournalTradeEntry) => CHECKS.some((c) => e.checks[c.key] !== undefined);

function addMonths(key: string, n: number): string {
  const d = fromKey(startOfMonth(key));
  d.setMonth(d.getMonth() + n);
  return startOfMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`);
}

// ─── Building blocks ───────────────────────────────────────────────────────

function Block({
  label,
  sub,
  index,
  wide,
  empty,
  emptyIcon,
  emptyTitle,
  emptyText,
  children,
}: {
  label: string;
  sub?: ReactNode;
  index: number;
  wide?: boolean;
  empty?: boolean;
  emptyIcon?: ReactNode;
  emptyTitle?: string;
  emptyText?: ReactNode;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.section
      className={cx('glass ji-panel', wide && 'ji-wide')}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: reduce ? 0 : 0.06 * index, ease }}
    >
      <div className="ji-panel-head">
        <span className="ji-label">{label}</span>
        {sub && <span className="ji-sub">{sub}</span>}
      </div>
      {empty ? <EmptyState icon={emptyIcon} title={emptyTitle ?? 'Nothing recorded yet'} text={emptyText} /> : children}
    </motion.section>
  );
}

function Metric({ label, index, children, foot }: { label: string; index: number; children: ReactNode; foot?: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="glass ji-metric"
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: reduce ? 0 : 0.05 * index, ease }}
    >
      <span className="ji-label">{label}</span>
      <div className="ji-metric-body">{children}</div>
      {foot && <span className="ji-metric-foot">{foot}</span>}
    </motion.div>
  );
}

function HBars({ data, color, animate, unit = 'entries' }: { data: { label: string; count: number }[]; color: string; animate: boolean; unit?: string }) {
  const height = Math.max(120, data.length * 34 + 20);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 18, bottom: 4, left: 4 }} barCategoryGap={8}>
        <CartesianGrid stroke={GRID} horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={TICK} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="label" width={118} tick={TICK} axisLine={false} tickLine={false} />
        <Tooltip {...TOOLTIP} formatter={(v) => [`${v} ${unit}`, '']} separator="" />
        <Bar dataKey="count" fill={color} fillOpacity={0.4} stroke={color} strokeOpacity={0.55} radius={[0, 4, 4, 0]} isAnimationActive={animate} animationDuration={900} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function VBars({ data, color, animate }: { data: { label: string; count: number }[]; color: string; animate: boolean }) {
  return (
    <ResponsiveContainer width="100%" height={H}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis dataKey="label" tick={TICK} axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={8} />
        <YAxis allowDecimals={false} tick={TICK} axisLine={false} tickLine={false} />
        <Tooltip {...TOOLTIP} formatter={(v) => [`${v} entries`, '']} separator="" />
        <Bar dataKey="count" fill={color} fillOpacity={0.35} stroke={color} strokeOpacity={0.5} radius={[4, 4, 0, 0]} maxBarSize={28} isAnimationActive={animate} animationDuration={900} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export function JournalAnalytics(): JSX.Element {
  const { items: entries } = useCollection<JournalTradeEntry>(JOURNAL_COLLECTION);
  const today = useToday();
  const reduce = useReducedMotion();
  const animate = !reduce;

  const data = useMemo(() => {
    const stats = journalStats(entries, today);
    const perDay = new Map<string, number>();
    for (const e of entries) perDay.set(e.date, (perDay.get(e.date) ?? 0) + 1);

    // last 28 days consistency
    let active28 = 0;
    for (let i = 0; i < 28; i++) if (perDay.has(addDays(today, -i))) active28++;

    // weeks
    const thisWeek = startOfWeek(today);
    const weeks = Array.from({ length: 12 }, (_, i) => {
      const ws = addDays(thisWeek, -7 * (11 - i));
      const we = addDays(ws, 6);
      return { label: shortDate(ws), count: entries.filter((e) => e.date >= ws && e.date <= we).length };
    });

    // months
    const thisMonth = startOfMonth(today);
    const months = Array.from({ length: 6 }, (_, i) => {
      const ms = addMonths(thisMonth, -(5 - i));
      const next = addMonths(ms, 1);
      return { label: monthShort(ms), count: entries.filter((e) => e.date >= ms && e.date < next).length };
    });

    // rule-following over time — weekly average of reviewed entries (last 12 weeks)
    const ruleWeeks = Array.from({ length: 12 }, (_, i) => {
      const ws = addDays(thisWeek, -7 * (11 - i));
      const we = addDays(ws, 6);
      const xs = entries.filter((e) => e.date >= ws && e.date <= we && isReviewed(e));
      return { label: shortDate(ws), value: xs.length ? Math.round((xs.reduce((a, e) => a + ruleScore(e), 0) / xs.length) * 100) : null };
    });
    const hasRule = ruleWeeks.some((w) => w.value != null);

    const setups = countBy(entries, (e) => e.setup).slice(0, 8);
    const mistakes = mistakeCounts(entries).map((m) => ({ label: m.label, count: m.count }));
    const markets = countBy(entries, (e) => e.market.toUpperCase()).slice(0, 8);
    const conditions = CONDITIONS.map((c) => ({ label: c, count: entries.filter((e) => e.condition === c).length }));
    const hasConditions = conditions.some((c) => c.count > 0);

    // 84-day strip, aligned to Monday columns
    const stripEnd = today;
    const stripStart = startOfWeek(addDays(today, -83));
    const days: { key: string; count: number; future: boolean }[] = [];
    for (let k = stripStart; k <= addDays(startOfWeek(stripEnd), 6); k = addDays(k, 1)) {
      days.push({ key: k, count: perDay.get(k) ?? 0, future: k > stripEnd });
    }
    const maxDay = Math.max(1, ...days.map((d) => d.count));
    const activeDays = days.filter((d) => d.count > 0).length;

    return { stats, active28, weeks, months, ruleWeeks, hasRule, setups, mistakes, markets, conditions, hasConditions, days, maxDay, activeDays };
  }, [entries, today]);

  const { stats } = data;
  const has = entries.length > 0;
  const consistency = data.active28 / 28;

  // month labels for the strip (one per column where a new month begins)
  const columns: { key: string; count: number; future: boolean }[][] = [];
  for (let i = 0; i < data.days.length; i += 7) columns.push(data.days.slice(i, i + 7));
  let lastMonth = '';
  const monthLabels = columns.map((col) => {
    const m = monthShort(col[0].key);
    if (m !== lastMonth) {
      lastMonth = m;
      return m;
    }
    return '';
  });

  return (
    <div className="ji-root">
      <div className="ji-intro">
        <span className="ji-label">Journal analytics</span>
        <p className="ji-intro-text">Learning and discipline over time — how often you study, how closely you follow your rules, and what keeps repeating.</p>
      </div>

      {/* ── Metrics ── */}
      <div className="ji-metrics">
        <Metric
          label="Avg simulated R:R"
          index={0}
          foot={stats.avgSimR != null ? <>Avg simulated R · {stats.avgSimR >= 0 ? '+' : ''}{stats.avgSimR.toFixed(2)}R</> : 'Planned from entry, stop & target'}
        >
          {stats.avgRR != null ? (
            <span className="ji-big">
              1 : <CountUp value={stats.avgRR} decimals={2} />
            </span>
          ) : (
            <span className="ji-big dim">—</span>
          )}
        </Metric>
        <Metric label="Rule-following" index={1} foot={stats.ruleFollowing != null ? 'Across reviewed entries' : 'Complete the execution review'}>
          <div className="ji-ring-row">
            <RingMeter value={stats.ruleFollowing ?? 0} size={58} stroke={2.5} showValue={false} delay={0.2} />
            {stats.ruleFollowing != null ? (
              <span className="ji-big">
                <CountUp value={Math.round(stats.ruleFollowing * 100)} />
                <small>%</small>
              </span>
            ) : (
              <span className="ji-big dim">—</span>
            )}
          </div>
        </Metric>
        <Metric label="Improvement streak" index={2} foot={<>Longest · {stats.streak.longest} day{stats.streak.longest === 1 ? '' : 's'}</>}>
          <span className="ji-big">
            <CountUp value={stats.streak.current} />
            <small> day{stats.streak.current === 1 ? '' : 's'}</small>
          </span>
        </Metric>
        <Metric label="Learning consistency" index={3} foot={<>{data.active28} of the last 28 days</>}>
          <span className="ji-big">
            <CountUp value={Math.round(consistency * 100)} />
            <small>%</small>
          </span>
          <div className="ji-thin-bar" aria-hidden>
            <motion.i initial={{ width: reduce ? `${consistency * 100}%` : 0 }} animate={{ width: `${consistency * 100}%` }} transition={{ duration: reduce ? 0 : 1.2, ease }} />
          </div>
        </Metric>
      </div>

      {/* ── Consistency strip ── */}
      <Block label="Learning consistency" sub={`${data.activeDays} active days · last 12 weeks`} index={4} wide>
        <div className="ji-strip-wrap">
          <div className="ji-strip" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
            {monthLabels.map((m, i) => (
              <span key={'m' + i} className="ji-strip-month">
                {m}
              </span>
            ))}
            {columns.map((col, ci) => (
              <div key={ci} className="ji-strip-col">
                {col.map((d) => {
                  const level = d.count ? 0.25 + 0.75 * (d.count / data.maxDay) : 0;
                  return (
                    <span
                      key={d.key}
                      className={cx('ji-dot', d.count > 0 && 'on', d.future && 'future', d.key === today && 'today')}
                      style={d.count ? ({ '--lvl': level } as React.CSSProperties) : undefined}
                      title={d.future ? undefined : `${shortDate(d.key)} · ${d.count} entr${d.count === 1 ? 'y' : 'ies'}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="ji-strip-legend">
            <span>Less</span>
            {[0, 0.35, 0.6, 1].map((l) => (
              <span key={l} className={cx('ji-dot', l > 0 && 'on')} style={l ? ({ '--lvl': l } as React.CSSProperties) : undefined} />
            ))}
            <span>More</span>
          </div>
        </div>
      </Block>

      {/* ── Charts ── */}
      <div className="ji-grid">
        <Block
          label="Entries per week"
          sub="Last 12 weeks"
          index={5}
          empty={!has}
          emptyIcon={<CalendarDays size={22} strokeWidth={1.4} />}
          emptyTitle="No entries yet"
          emptyText="Record a simulated trade or a no-trade study session to start tracking your weekly rhythm."
        >
          <VBars data={data.weeks} color={WARM} animate={animate} />
        </Block>
        <Block
          label="Entries per month"
          sub="Last 6 months"
          index={6}
          empty={!has}
          emptyIcon={<BarChart3 size={22} strokeWidth={1.4} />}
          emptyTitle="No entries yet"
          emptyText="Monthly volume appears once you begin journaling."
        >
          <VBars data={data.months} color={VIOLET} animate={animate} />
        </Block>
        <Block
          label="Rule-following over time"
          sub="Weekly average"
          index={7}
          empty={!data.hasRule}
          emptyIcon={<ListChecks size={22} strokeWidth={1.4} />}
          emptyTitle="No reviews yet"
          emptyText="Tick the execution review checklist on each entry to see your discipline trend."
          wide
        >
          <ResponsiveContainer width="100%" height={H}>
            <LineChart data={data.ruleWeeks} margin={{ top: 10, right: 12, bottom: 0, left: -18 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="label" tick={TICK} axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={10} />
              <YAxis domain={[0, 100]} ticks={[0, 50, 100]} tick={TICK} axisLine={false} tickLine={false} unit="%" />
              <Tooltip {...TOOLTIP} formatter={(v) => [`${v}%`, 'Rule-following']} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={CHAMPAGNE}
                strokeWidth={1.6}
                dot={{ r: 2.5, fill: CHAMPAGNE, strokeWidth: 0 }}
                activeDot={{ r: 4, fill: CHAMPAGNE, stroke: 'rgba(236,228,214,0.3)', strokeWidth: 4 }}
                connectNulls
                isAnimationActive={animate}
                animationDuration={1100}
              />
            </LineChart>
          </ResponsiveContainer>
        </Block>
        <Block
          label="Setup frequency"
          sub="Top 8"
          index={8}
          empty={!data.setups.length}
          emptyIcon={<Compass size={22} strokeWidth={1.4} />}
          emptyTitle="No setups named"
          emptyText="Name the setup on each entry (e.g. “Opening range breakout”) to see which ones you study most."
        >
          <HBars data={data.setups} color={WARM} animate={animate} />
        </Block>
        <Block
          label="Most common mistakes"
          sub={data.mistakes.length ? `${data.mistakes.reduce((a, m) => a + m.count, 0)} tagged` : undefined}
          index={9}
          empty={!data.mistakes.length}
          emptyIcon={<AlertCircle size={22} strokeWidth={1.4} />}
          emptyTitle="No mistakes tagged"
          emptyText="Tag mistakes honestly on each entry — patterns here become your next lessons."
        >
          <HBars data={data.mistakes} color={VIOLET} animate={animate} unit="times" />
        </Block>
        <Block
          label="Most studied markets"
          sub="Top 8"
          index={10}
          empty={!data.markets.length}
          emptyIcon={<Globe2 size={22} strokeWidth={1.4} />}
          emptyTitle="No markets recorded"
          emptyText="Record the market (e.g. ES, EURUSD, AAPL) on each entry."
        >
          <HBars data={data.markets} color={CHAMPAGNE} animate={animate} />
        </Block>
        <Block
          label="Market conditions"
          sub="Distribution"
          index={11}
          empty={!data.hasConditions}
          emptyIcon={<Waves size={22} strokeWidth={1.4} />}
          emptyTitle="No conditions recorded"
          emptyText="Choose the market condition — trending, range, volatile — when you log an entry."
        >
          <HBars data={data.conditions} color={WARM} animate={animate} />
        </Block>
      </div>

      {!has && (
        <p className="ji-footnote">
          <BookOpen size={13} strokeWidth={1.5} /> Simulation / educational mode — analytics are built only from your own journal entries.
        </p>
      )}
    </div>
  );
}
