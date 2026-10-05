import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Bar as RBar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CATEGORY_META, TASKS, type Category } from '../data/schedule';
import { dayStats, type DayLog } from '../lib/domain';
import { useDayLogs } from '../lib/data';
import { addDays, formatLong, fromKey, rangeKeys, startOfWeek } from '../lib/dates';
import { useToday } from '../lib/hooks';
import { CountUp, EmptyState, PageHeader, Panel, RingMeter, Stat, cx, reveal } from '../components/ui';
import '../styles/schedule.css';

const DOW = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const HEAT_ROWS: (Category | 'overall')[] = ['trading', 'study', 'business', 'fitness', 'discipline', 'routine', 'overall'];
const WEEKS = 12;
const pct = (x: number) => Math.round(x * 100);
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

function rowPct(log: DayLog | undefined, row: Category | 'overall') {
  const s = dayStats(log);
  return row === 'overall' ? s.pct : s.byCategory[row].pct;
}

export function WeeklyReview() {
  const today = useToday();
  const thisWeek = startOfWeek(today);
  const [week, setWeek] = useState(thisWeek);
  const { map } = useDayLogs();

  const days = useMemo(() => rangeKeys(week, addDays(week, 6)), [week]);
  const elapsed = useMemo(() => days.filter((k) => k <= today), [days, today]);

  const s = useMemo(() => {
    const per = elapsed.map((k) => ({ k, st: dayStats(map.get(k)) }));
    const total = TASKS.length * elapsed.length;
    const completed = per.reduce((a, p) => a + p.st.done, 0);
    const ranked = [...per].sort((a, b) => b.st.pct - a.st.pct);
    const cons = (c: Category) => avg(per.map((p) => p.st.byCategory[c].pct));
    return {
      total,
      completed,
      missed: total - completed,
      pct: total ? completed / total : 0,
      best: ranked.length && ranked[0].st.done > 0 ? ranked[0] : null,
      worst: ranked.length > 1 ? ranked[ranked.length - 1] : null,
      trading: cons('trading'),
      study: cons('study'),
      business: cons('business'),
      fitness: cons('fitness'),
    };
  }, [elapsed, map]);

  const chart = days.map((k, i) => ({ day: DOW[i], pct: k <= today ? pct(dayStats(map.get(k)).pct) : 0 }));
  const dayName = (k: string) => fromKey(k).toLocaleDateString(undefined, { weekday: 'long' });

  // 12-week grid ending with the selected week.
  const gridStart = addDays(week, -7 * (WEEKS - 1));
  const gridDays = rangeKeys(gridStart, addDays(week, 6));

  return (
    <div>
      <PageHeader
        eyebrow="PERFORMANCE DEBRIEF"
        title="WEEKLY REVIEW"
        description="How consistent was the week? Every number comes from your own timetable log."
        actions={
          <div className="md-nav">
            <button className="icon-btn" onClick={() => setWeek(addDays(week, -7))} aria-label="Previous week">
              <ChevronLeft size={16} />
            </button>
            <span className="tag" style={{ height: 34, padding: '0 12px' }}>
              {formatLong(week)} – {formatLong(addDays(week, 6))}
            </span>
            <button className="icon-btn" onClick={() => setWeek(addDays(week, 7))} disabled={week >= thisWeek} aria-label="Next week">
              <ChevronRight size={16} />
            </button>
            {week !== thisWeek && (
              <button className="btn btn-sm" onClick={() => setWeek(thisWeek)}>
                This week
              </button>
            )}
          </div>
        }
      />

      <motion.div variants={reveal} initial="hidden" animate="show" custom={0}>
        <div className="stat-grid">
          <Stat label="Total tasks" value={<CountUp value={s.total} />} note={`${elapsed.length} day${elapsed.length === 1 ? '' : 's'} × ${TASKS.length}`} />
          <Stat label="Completed" value={<CountUp value={s.completed} />} />
          <Stat label="Missed" value={<CountUp value={s.missed} />} />
          <Stat label="Completion" value={<CountUp value={pct(s.pct)} suffix="%" />} />
          <Stat label="Best day" size="sm" value={s.best ? dayName(s.best.k) : '—'} note={s.best ? `${pct(s.best.st.pct)}%` : 'No tasks yet'} />
          <Stat label="Weakest day" size="sm" value={s.worst ? dayName(s.worst.k) : '—'} note={s.worst ? `${pct(s.worst.st.pct)}%` : 'Needs 2+ days'} />
        </div>
      </motion.div>

      <motion.div variants={reveal} initial="hidden" animate="show" custom={1}>
        <Panel title="Consistency" className="mt-16">
          <div className="md-rings">
            <RingMeter value={s.trading} size={86} color={CATEGORY_META.trading.color} label="Trading" />
            <RingMeter value={s.study} size={86} color={CATEGORY_META.study.color} label="Study" delay={0.08} />
            <RingMeter value={s.business} size={86} color={CATEGORY_META.business.color} label="Business" delay={0.16} />
            <RingMeter value={s.fitness} size={86} color={CATEGORY_META.fitness.color} label="Workout" delay={0.24} />
          </div>
        </Panel>
      </motion.div>

      <div className="grid-2 mt-16">
        <motion.div variants={reveal} initial="hidden" animate="show" custom={2}>
          <Panel hud title="Weekly heatmap" sub="completion by category">
            <div className="wk-heat" role="table">
              <span />
              {days.map((k, i) => (
                <span key={k} className="ch" style={k === today ? { color: 'var(--cyan)' } : undefined}>
                  {DOW[i]}
                </span>
              ))}
              {HEAT_ROWS.map((row) => (
                <HeatRow key={row} row={row} days={days} today={today} map={map} />
              ))}
            </div>
          </Panel>
        </motion.div>
        <motion.div variants={reveal} initial="hidden" animate="show" custom={3}>
          <Panel hud title="Daily completion" sub="this week">
            {elapsed.length === 0 ? (
              <EmptyState title="Week not started" text="This week has no elapsed days yet." />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chart} margin={{ top: 8, right: 6, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="wk-bar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3ee6ff" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#3ee6ff" stopOpacity={0.12} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(120,225,255,0.08)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fill: '#7f9aa7', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#7f9aa7', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip
                    cursor={{ fill: 'rgba(62,230,255,0.06)' }}
                    contentStyle={{ background: 'rgba(6,18,28,0.95)', border: '1px solid rgba(120,225,255,0.3)', borderRadius: 6, fontSize: 12 }}
                    formatter={(v) => [`${v}%`, 'Completion']}
                  />
                  <RBar dataKey="pct" fill="url(#wk-bar)" radius={[3, 3, 0, 0]} maxBarSize={34} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Panel>
        </motion.div>
      </div>

      <motion.div variants={reveal} initial="hidden" animate="show" custom={4}>
        <Panel hud title="12-week consistency grid" sub="daily completion" className="mt-16">
          <div className="wk-year-wrap">
            <div className="wk-year-days">
              {DOW.map((d, i) => (
                <span key={d}>{i % 2 === 0 ? d : ''}</span>
              ))}
            </div>
            <div className="wk-year" style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(14px, 1fr))` }}>
              {gridDays.map((k) => {
                const future = k > today;
                const p = future ? 0 : dayStats(map.get(k)).pct;
                return (
                  <i
                    key={k}
                    className={cx(future && 'future', k >= week && k <= addDays(week, 6) && 'sel')}
                    style={{ ['--p' as string]: p }}
                    title={`${formatLong(k)} · ${future ? 'upcoming' : `${pct(p)}%`}`}
                  />
                );
              })}
            </div>
          </div>
        </Panel>
      </motion.div>
    </div>
  );
}

function HeatRow({ row, days, today, map }: { row: Category | 'overall'; days: string[]; today: string; map: Map<string, DayLog> }) {
  const overall = row === 'overall';
  return (
    <>
      <span className={cx('rl', overall && 'overall')}>{overall ? 'Overall' : CATEGORY_META[row].label}</span>
      {days.map((k, i) => {
        const future = k > today;
        const p = future ? 0 : rowPct(map.get(k), row);
        return (
          <motion.span
            key={k}
            className={cx('wk-cell', future && 'future', overall && 'overall')}
            style={{ ['--p' as string]: p }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03, duration: 0.3 }}
            title={`${CATEGORY_META[row as Category]?.label ?? 'Overall'} · ${future ? 'upcoming' : `${pct(p)}%`}`}
          >
            {future ? '' : `${pct(p)}`}
          </motion.span>
        );
      })}
    </>
  );
}
