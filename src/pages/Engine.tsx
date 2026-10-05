import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Area, AreaChart, CartesianGrid, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { NotebookPen, TrendingUp } from 'lucide-react';
import { TOTAL_DAYS } from '../data/curriculum';
import { C, emptyJournal, type JournalEntry } from '../lib/domain';
import { useJourney, useJourneyDay } from '../lib/data';
import { useCollection, useDoc, useToday } from '../lib/hooks';
import { formatShort } from '../lib/dates';
import { CountUp, EmptyState, PageHeader, Panel, cx, reveal } from '../components/ui';
import { JourneyTimeline } from '../components/JourneyTimeline';
import '../styles/learn.css';

const QUESTIONS = [
  { key: 'learn', q: 'What did I learn?', ph: 'One concept, explained in your own words…' },
  { key: 'practice', q: 'What did I practice?', ph: 'Charts marked, reps done, simulations run…' },
  { key: 'mistake', q: 'What mistake did I identify?', ph: 'One mistake in process, analysis or mindset…' },
  { key: 'improvement', q: 'What will I improve tomorrow?', ph: 'One specific, 1% improvement…' },
] as const;

const TICK = { fill: '#7f9aa7', fontSize: 11 };
const TOOLTIP_STYLE = { background: 'rgba(6,18,28,0.95)', border: '1px solid rgba(120,225,255,0.3)', borderRadius: 6, fontSize: 12 };

// The 1.01^n learning curve across the full journey (pure math, not market data).
const CURVE = Array.from({ length: TOTAL_DAYS + 1 }, (_, n) => ({ n, v: Math.round(Math.pow(1.01, n) * 1000) / 1000 }));

export function Engine() {
  const today = useToday();
  const current = useJourneyDay(today);
  const navigate = useNavigate();
  const { byDay, completed } = useJourney();
  const fallback = useMemo(() => emptyJournal(today), [today]);
  const [entry, update] = useDoc<JournalEntry>(C.journal, today, fallback);
  const { items: journals } = useCollection<JournalEntry>(C.journal);

  const factor = Math.pow(1.01, completed);
  const data = useMemo(() => CURVE.map((p) => ({ ...p, done: p.n <= completed ? p.v : null })), [completed]);
  const answered = QUESTIONS.filter((q) => entry[q.key].trim()).length;

  const recent = useMemo(
    () =>
      journals
        .filter((j) => (j.improvement ?? '').trim())
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .slice(0, 14),
    [journals],
  );

  return (
    <div>
      <PageHeader
        eyebrow="COMPOUNDING LEARNING"
        title="THE 1% ENGINE"
        description="Four questions, every day. Small, honest reflections compound into real skill."
        actions={
          <Link to="/daily-journal" className="btn btn-sm">
            <NotebookPen size={14} /> Daily Journal
          </Link>
        }
      />

      <div className="grid-2 mb-16">
        <motion.div variants={reveal} initial="hidden" animate="show" custom={0}>
          <Panel hud title="Today's questions" sub={`${answered}/4 answered`} style={{ height: '100%' }}>
            <div className="col gap-16">
              {QUESTIONS.map((q, i) => (
                <div key={q.key} className={cx('engine-q', entry[q.key].trim() && 'answered')}>
                  <span className="n">{i + 1}</span>
                  <label className="field" style={{ margin: 0 }}>
                    <span className="label">{q.q}</span>
                    <textarea
                      className="textarea"
                      rows={2}
                      placeholder={q.ph}
                      value={entry[q.key]}
                      onChange={(e) => update({ [q.key]: e.target.value } as Partial<JournalEntry>)}
                    />
                  </label>
                </div>
              ))}
              <p className="tiny dim" style={{ margin: 0 }}>
                Saved to today's Daily Journal entry automatically.
              </p>
            </div>
          </Panel>
        </motion.div>

        <motion.div variants={reveal} initial="hidden" animate="show" custom={1}>
          <Panel title="Learning compound" sub="1.01ⁿ" style={{ height: '100%' }}>
            <div className="row wrap between" style={{ alignItems: 'flex-end' }}>
              <div>
                <div className="stat-label">Lessons completed</div>
                <div className="compound">
                  1.01<sup>{completed}</sup> = <CountUp value={factor} decimals={2} suffix="×" />
                </div>
              </div>
              <div className="stat" style={{ textAlign: 'right' }}>
                <span className="stat-label">At day 84</span>
                <span className="stat-value sm">{Math.pow(1.01, TOTAL_DAYS).toFixed(2)}×</span>
              </div>
            </div>
            <div style={{ height: 210, marginTop: 14 }}>
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: -18 }}>
                  <defs>
                    <linearGradient id="eng-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3ee6ff" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#3ee6ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(120,225,255,0.08)" vertical={false} />
                  <XAxis dataKey="n" tick={TICK} tickLine={false} axisLine={false} ticks={[0, 14, 28, 42, 56, 70, 84]} />
                  <YAxis tick={TICK} tickLine={false} axisLine={false} domain={[1, 2.4]} tickFormatter={(v: number) => `${v}×`} />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    labelFormatter={(l) => `${l} lessons`}
                    formatter={(v) => [`${Number(v).toFixed(3)}×`, 'Learning factor']}
                  />
                  <Area type="monotone" dataKey="v" stroke="rgba(120,225,255,0.3)" strokeDasharray="4 4" fill="none" isAnimationActive />
                  <Area type="monotone" dataKey="done" stroke="#3ee6ff" strokeWidth={2} fill="url(#eng-fill)" connectNulls={false} isAnimationActive />
                  <ReferenceDot x={completed} y={Math.round(factor * 1000) / 1000} r={5} fill="#3ee6ff" stroke="#c8f6ff" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="tiny dim" style={{ margin: '8px 0 0' }}>
              A model of learning compounding: each completed lesson adds 1% to what you already know. It measures skill-building, never money.
            </p>
          </Panel>
        </motion.div>
      </div>

      <motion.div variants={reveal} initial="hidden" animate="show" custom={2}>
        <Panel title="Journey map" sub={`Day ${current} / ${TOTAL_DAYS}`} className="mb-16">
          <JourneyTimeline current={current} days={byDay} onSelect={(d) => navigate(`/journey/${d}`)} />
        </Panel>
      </motion.div>

      <motion.div variants={reveal} initial="hidden" animate="show" custom={3}>
        <Panel title={<><TrendingUp size={14} style={{ verticalAlign: '-2px', marginRight: 8 }} />Recent 1% improvements</>} sub="last 14">
          {recent.length ? (
            <ul className="improve-list">
              {recent.map((j) => (
                <li key={j.id}>
                  <span className="mono small muted">{formatShort(j.date)}</span>
                  <span>{j.improvement}</span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={<TrendingUp size={22} />}
              title="No improvements logged yet"
              text="Answer “What will I improve tomorrow?” above — each answer appears here."
            />
          )}
        </Panel>
      </motion.div>
    </div>
  );
}
