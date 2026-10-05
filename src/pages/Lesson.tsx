import { useMemo } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ChevronLeft, ChevronRight, ExternalLink, Lock, NotebookPen, Sparkles, Undo2, Zap } from 'lucide-react';
import { TOTAL_DAYS, lessonFor, phaseFor } from '../data/curriculum';
import { C, emptyJourneyDay, journeyState, type JourneyDay } from '../lib/domain';
import { useJourney, useJourneyDay } from '../lib/data';
import { useDoc, useToday } from '../lib/hooks';
import { celebrate, pulseCore } from '../lib/events';
import { formatLong } from '../lib/dates';
import { Field, HoloCheck, PageHeader, Panel, cx, reveal } from '../components/ui';
import { JourneyTimeline, STATE_LABEL, StateIcon } from '../components/JourneyTimeline';
import '../styles/learn.css';

type CheckKey = keyof JourneyDay['checks'];

export function Lesson() {
  const params = useParams();
  const day = Number(params.day);
  if (!Number.isInteger(day) || day < 1 || day > TOTAL_DAYS) return <Navigate to="/journey" replace />;
  return <LessonDay key={day} day={day} />;
}

function LessonDay({ day }: { day: number }) {
  const today = useToday();
  const current = useJourneyDay(today);
  const navigate = useNavigate();
  const { byDay } = useJourney();
  const fallback = useMemo(() => emptyJourneyDay(day), [day]);
  const [rec, update] = useDoc<JourneyDay>(C.journey, String(day), fallback);

  const lesson = lessonFor(day);
  const phase = phaseFor(day);
  const state = journeyState(day, current, rec);
  const locked = day > current;

  const setCheck = (k: CheckKey, v: boolean) => update((prev) => ({ ...prev, checks: { ...prev.checks, [k]: v } }));

  const complete = () => {
    update({ completed: true, completedAt: Date.now(), completedDate: today });
    celebrate({ kind: 'mission', title: 'MISSION COMPLETE', lines: [`DAY ${day} COMPLETE`, '+1% IMPROVEMENT'] });
    pulseCore();
  };
  const reopen = () => update({ completed: false, completedAt: undefined, completedDate: undefined });

  const improvements: { key: CheckKey; label: string; text: string }[] = [
    { key: 'learn', label: 'LEARN', text: lesson.learn },
    { key: 'practice', label: 'PRACTICE', text: lesson.practice },
    { key: 'journal', label: 'JOURNAL', text: lesson.journal },
  ];

  return (
    <div className="page-narrow">
      <PageHeader
        eyebrow={`PHASE ${phase.code} — ${phase.short} · DAY ${day} / ${TOTAL_DAYS}`}
        title={lesson.title}
        description={
          <span className="row wrap" style={{ gap: 8 }}>
            <StateIcon state={state} />
            <span>{STATE_LABEL[state]}</span>
            {lesson.review && <span className="badge dim">Review day</span>}
          </span>
        }
        actions={
          <Link to="/journey" className="btn btn-ghost btn-sm">
            <ChevronLeft size={15} /> Journey
          </Link>
        }
      />

      {locked && (
        <div className="notice mb-16 row" style={{ gap: 10 }}>
          <Lock size={16} className="cyan" />
          <span>
            Upcoming — this session unlocks on Day {day}. You can read ahead, but completion opens when you get there.
          </span>
        </div>
      )}

      <div className="grid" style={{ gap: 16 }}>
        <motion.div variants={reveal} initial="hidden" animate="show" custom={0}>
          <Panel hud title={<><BookOpen size={14} style={{ verticalAlign: '-2px', marginRight: 8 }} />Concept</>}>
            <p className="lesson-concept">{lesson.concept}</p>
            <div className="section-title mt-24">Key points</div>
            <ul className="key-points mt-8">
              {lesson.keyPoints.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </Panel>
        </motion.div>

        <motion.div variants={reveal} initial="hidden" animate="show" custom={1}>
          <Panel title={<><Zap size={14} style={{ verticalAlign: '-2px', marginRight: 8 }} />Today's 1% improvement</>}>
            {improvements.map((i) => (
              <div key={i.key} className={cx('improve-row', rec.checks[i.key] && 'done')}>
                <HoloCheck checked={rec.checks[i.key]} onChange={(v) => setCheck(i.key, v)} label={`${i.label}: ${i.text}`} />
                <span className="k">{i.label}:</span>
                <span className="v">{i.text}</span>
              </div>
            ))}
          </Panel>
        </motion.div>

        <motion.div variants={reveal} initial="hidden" animate="show" custom={2}>
          <Panel title="Session notes">
            <div className="grid-2">
              <Field label="Notes">
                <textarea
                  className="textarea"
                  rows={6}
                  placeholder="What stood out in today's lesson…"
                  value={rec.notes}
                  onChange={(e) => update({ notes: e.target.value })}
                />
              </Field>
              <Field label="3 key takeaways">
                <textarea
                  className="textarea"
                  rows={6}
                  placeholder={'1.\n2.\n3.'}
                  value={rec.takeaways}
                  onChange={(e) => update({ takeaways: e.target.value })}
                />
              </Field>
            </div>
            <div className="row wrap mt-16">
              {phase.workspace && (
                <Link to={phase.workspace.to} className="btn btn-sm">
                  <ExternalLink size={14} /> {phase.workspace.label}
                </Link>
              )}
              <Link to="/daily-journal" className="btn btn-sm">
                <NotebookPen size={14} /> Open Daily Journal
              </Link>
              <Link to="/vault?new=1" className="btn btn-sm">
                <Sparkles size={14} /> Add Knowledge Note
              </Link>
            </div>
          </Panel>
        </motion.div>

        <AnimatePresence mode="wait" initial={false}>
          {rec.completed ? (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div className="complete-state">
                <div className="row" style={{ gap: 14 }}>
                  <StateIcon state="complete" size={30} />
                  <div>
                    <div className="title">DAY {day} COMPLETE</div>
                    <div className="small muted">
                      {rec.completedDate ? `Completed ${formatLong(rec.completedDate)}` : 'Completed'} · +1% improvement
                    </div>
                  </div>
                </div>
                <button type="button" className="btn btn-sm btn-ghost" onClick={reopen}>
                  <Undo2 size={14} /> Mark incomplete
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="todo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.button
                type="button"
                className="btn btn-primary btn-lg complete-btn"
                disabled={locked}
                onClick={complete}
                whileHover={locked ? undefined : { scale: 1.01 }}
                whileTap={locked ? undefined : { scale: 0.98 }}
              >
                {locked ? (
                  <>
                    <Lock size={18} /> UNLOCKS ON DAY {day}
                  </>
                ) : (
                  'COMPLETE SESSION'
                )}
              </motion.button>
              {state === 'missed' && (
                <p className="small muted center mt-8">Missed days can be completed anytime — nothing resets.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="day-nav">
          <button type="button" className="btn btn-sm btn-ghost" disabled={day <= 1} onClick={() => navigate(`/journey/${day - 1}`)}>
            <ChevronLeft size={15} /> Day {Math.max(1, day - 1)}
          </button>
          {day !== current && (
            <Link to={`/journey/${current}`} className="btn btn-sm btn-ghost">
              Today · Day {current}
            </Link>
          )}
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            disabled={day >= TOTAL_DAYS}
            onClick={() => navigate(`/journey/${day + 1}`)}
          >
            Day {Math.min(TOTAL_DAYS, day + 1)} <ChevronRight size={15} />
          </button>
        </div>

        <Panel title="Journey" sub={`Day ${current} of ${TOTAL_DAYS}`}>
          <JourneyTimeline compact current={current} days={byDay} onSelect={(d) => navigate(`/journey/${d}`)} />
        </Panel>
      </div>
    </div>
  );
}
