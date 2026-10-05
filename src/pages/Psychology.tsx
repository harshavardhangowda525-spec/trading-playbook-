import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Brain, LineChart as LineIcon } from 'lucide-react';
import { Area, AreaChart, Bar as RBar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { C, EMOTIONS, emptyPsych, type EmotionKey, type PsychEntry } from '../lib/domain';
import { useCollection, useDoc } from '../lib/hooks';
import { formatShort } from '../lib/dates';
import { EmptyState, Field, PageHeader, Panel, RingMeter, Slider, cx, reveal } from '../components/ui';
import { DateNav, SavedIndicator, useDateParam, useSavedFlash } from './DailyJournal';
import '../styles/build.css';

const TICK = { fill: '#8f8a82', fontSize: 11 };
const GRID = 'rgba(214, 208, 198,0.08)';
const TOOLTIP = { background: 'rgba(20, 19, 23, 0.95)', border: '1px solid rgba(214, 208, 198,0.3)', borderRadius: 6, fontSize: 12 };
const POSITIVE: EmotionKey[] = ['confidence', 'discipline'];

export function Psychology() {
  const [date, setDate, today] = useDateParam();
  const fallback = useMemo(() => emptyPsych(date), [date]);
  const [entry, update, exists] = useDoc<PsychEntry>(C.psych, date, fallback);
  const { items } = useCollection<PsychEntry>(C.psych);
  const [saved, markSaved] = useSavedFlash();

  const set = (p: Partial<PsychEntry>) => {
    update((prev) => ({ ...prev, ...p, id: date, date }));
    markSaved();
  };
  const setEmotion = (k: EmotionKey, v: number) => set({ emotions: { ...entry.emotions, [k]: v } });

  const sorted = useMemo(() => [...items].sort((a, b) => a.date.localeCompare(b.date)), [items]);
  const trend = useMemo(() => sorted.map((e) => ({ date: formatShort(e.date), rating: e.rating })), [sorted]);
  const averages = useMemo(
    () =>
      EMOTIONS.map((em) => {
        const vals = sorted.map((e) => e.emotions[em.key]).filter((v): v is number => typeof v === 'number');
        return { key: em.key, label: em.label, avg: vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 : 0, n: vals.length };
      }),
    [sorted],
  );
  const hasAvg = averages.some((a) => a.n > 0);
  const avgRating = sorted.length ? sorted.reduce((a, e) => a + e.rating, 0) / sorted.length : 0;

  return (
    <div>
      <PageHeader
        eyebrow="Phase 10 · Psychology"
        title="Psychology Journal"
        description="Name the emotion to tame it. Rate how strongly each one showed up today — patterns appear over time."
        actions={<DateNav date={date} today={today} onChange={setDate} />}
      />

      <div className="row between" style={{ minHeight: 22, marginBottom: 8 }}>
        <span className="tiny muted upper display" style={{ letterSpacing: '0.2em' }}>
          {exists ? 'Entry saved' : 'No entry yet for this day — move a slider to start'}
        </span>
        <SavedIndicator on={saved} />
      </div>

      <div className="grid-2 mb-16" style={{ alignItems: 'start' }}>
        <motion.div variants={reveal} initial="hidden" animate="show" custom={0}>
          <Panel hud glow title="Daily emotional rating" sub="1 – 10">
            <div className="psy-rating">
              <RingMeter value={entry.rating / 10} size={130} stroke={7}>
                <span className="display" style={{ fontSize: 42, fontWeight: 400, color: '#fff' }}>
                  <span className="num">{entry.rating}</span>
                </span>
              </RingMeter>
              <div className="col" style={{ minWidth: 0, width: '100%' }}>
                <Slider label="Overall emotional state" value={entry.rating} onChange={(rating) => set({ rating })} />
                <span className="tiny dim">1 = reactive, unsettled · 10 = calm, focused, in control</span>
              </div>
            </div>
          </Panel>
        </motion.div>
        <motion.div variants={reveal} initial="hidden" animate="show" custom={1}>
          <Panel title="Triggers & notes">
            <div className="col gap-16">
              <Field label="Triggers" hint="what set the emotion off?">
                <textarea className="textarea" value={entry.triggers} onChange={(e) => set({ triggers: e.target.value })} placeholder="A fast candle, a loss, a missed move…" />
              </Field>
              <Field label="Notes">
                <textarea className="textarea" value={entry.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="How did you respond? What will you do next time?" />
              </Field>
            </div>
          </Panel>
        </motion.div>
      </div>

      <motion.div variants={reveal} initial="hidden" animate="show" custom={2}>
        <Panel title="Emotion intensity" sub="0 = absent · 10 = overwhelming" className="mb-16">
          <div className="psy-emotions">
            {EMOTIONS.map((em) => (
              <Slider key={em.key} label={em.label} min={0} max={10} value={entry.emotions[em.key] ?? 0} onChange={(v) => setEmotion(em.key, v)} />
            ))}
          </div>
        </Panel>
      </motion.div>

      <div className="grid-2 mb-16">
        <Panel title="Emotional rating over time" sub={sorted.length ? `avg ${avgRating.toFixed(1)}` : undefined}>
          {trend.length < 2 ? (
            <EmptyState icon={<LineIcon size={26} />} title="Not enough data" text="Log at least two days to see your emotional trend." />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="psyRating" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e9dfcb" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#e9dfcb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="date" tick={TICK} tickLine={false} axisLine={{ stroke: GRID }} minTickGap={20} />
                <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={TICK} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={TOOLTIP} labelStyle={{ color: '#bdb7ad' }} itemStyle={{ color: '#e9dfcb' }} />
                <Area type="monotone" dataKey="rating" name="Rating" stroke="#e9dfcb" strokeWidth={2} fill="url(#psyRating)" dot={{ r: 3, fill: '#e9dfcb' }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Panel>
        <Panel title="Average intensity" sub="per emotion">
          {!hasAvg ? (
            <EmptyState icon={<Brain size={26} />} title="No emotions logged" text="Rate your emotions to see which ones show up most." />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={averages} layout="vertical" margin={{ top: 0, right: 16, left: 10, bottom: 0 }}>
                <CartesianGrid stroke={GRID} horizontal={false} />
                <XAxis type="number" domain={[0, 10]} tick={TICK} tickLine={false} axisLine={{ stroke: GRID }} />
                <YAxis type="category" dataKey="label" tick={TICK} tickLine={false} axisLine={false} width={104} />
                <Tooltip contentStyle={TOOLTIP} labelStyle={{ color: '#bdb7ad' }} itemStyle={{ color: '#e9dfcb' }} cursor={{ fill: 'rgba(232, 220, 196,0.05)' }} />
                <RBar dataKey="avg" name="Avg intensity" radius={[0, 3, 3, 0]} barSize={12}>
                  {averages.map((a) => (
                    <Cell key={a.key} fill={POSITIVE.includes(a.key) ? '#d6bd8a' : '#a89bd4'} />
                  ))}
                </RBar>
              </BarChart>
            </ResponsiveContainer>
          )}
          {hasAvg && <div className="tiny dim">Teal = constructive (confidence, discipline) · blue = disruptive</div>}
        </Panel>
      </div>

      <Panel title="Past entries" sub={`${sorted.length}`}>
        {sorted.length === 0 ? (
          <EmptyState icon={<Brain size={26} />} title="No entries yet" text="Your psychology history will appear here." />
        ) : (
          <div className="entry-list">
            {[...sorted].reverse().map((e) => {
              const top = EMOTIONS.filter((em) => !POSITIVE.includes(em.key))
                .map((em) => ({ label: em.label, v: e.emotions[em.key] ?? 0 }))
                .sort((a, b) => b.v - a.v)[0];
              return (
                <button key={e.id} type="button" className={cx('entry-item', e.date === date && 'on')} onClick={() => setDate(e.date)}>
                  <span className="mono small">{formatShort(e.date)}</span>
                  <span className="mono cyan">{e.rating}/10</span>
                  <span className="snip">
                    {top && top.v > 0 ? `Strongest: ${top.label} ${top.v}/10` : ''}
                    {e.triggers ? `${top && top.v > 0 ? ' · ' : ''}${e.triggers}` : ''}
                    {!e.triggers && !(top && top.v > 0) ? '—' : ''}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </Panel>
    </div>
  );
}
