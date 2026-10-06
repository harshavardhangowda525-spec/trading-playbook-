import { useEffect, useMemo, useState, type JSX } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, CandlestickChart, Check, Eye, Play, SkipForward } from 'lucide-react';
import { useCollection, useToday } from '../../lib/hooks';
import { useJourneyDay } from '../../lib/data';
import { lessonFor, phaseFor, TOTAL_DAYS } from '../../data/curriculum';
import { CHALLENGES_COL, SESSIONS_COL, challengeFor, type ChallengeDoc, type ChallengeStatus, type PracticeSession } from '../../lib/practice';
import { addDays, formatShort } from '../../lib/dates';
import { cx } from '../ui';
import '../../styles/practice-insights.css';

const STATUSES: { key: ChallengeStatus; label: string; icon: JSX.Element }[] = [
  { key: 'completed', label: 'Completed', icon: <Check size={14} /> },
  { key: 'skipped', label: 'Skipped', icon: <SkipForward size={14} /> },
  { key: 'reviewed', label: 'Reviewed', icon: <Eye size={14} /> },
];
const statusLabel = (s: ChallengeStatus) => STATUSES.find((x) => x.key === s)!.label;
const ease = [0.22, 1, 0.36, 1] as const;

export function PracticeLearn(): JSX.Element {
  const today = useToday();
  const day = Math.min(Math.max(useJourneyDay(today), 1), TOTAL_DAYS);
  const lesson = lessonFor(day);
  const phase = phaseFor(day);
  const challenge = challengeFor(day);

  const challenges = useCollection<ChallengeDoc>(CHALLENGES_COL);
  const sessions = useCollection<PracticeSession>(SESSIONS_COL).items;
  const byId = useMemo(() => new Map(challenges.items.map((c) => [c.id, c])), [challenges.items]);
  const current = byId.get(String(day));

  const [note, setNote] = useState(current?.note ?? '');
  useEffect(() => {
    setNote(current?.note ?? '');
    // only resync when the day or the stored note changes
  }, [day, current?.note]);

  const setStatus = (status: ChallengeStatus) => {
    if (current?.status === status) {
      challenges.remove(String(day));
      return;
    }
    challenges.save({ id: String(day), status, at: Date.now(), note: note.trim() });
  };
  const saveNote = () => {
    if (current) challenges.save({ ...current, note: note.trim(), at: Date.now() });
  };

  const todayCount = sessions.filter((s) => s.status === 'complete' && s.date === today).length;

  const recent = useMemo(() => {
    const out: { day: number; date: string; title: string; doc?: ChallengeDoc }[] = [];
    for (let d = Math.max(1, day - 13); d <= day; d++) {
      out.push({ day: d, date: addDays(today, d - day), title: lessonFor(d).title, doc: byId.get(String(d)) });
    }
    return out.reverse();
  }, [day, today, byId]);

  return (
    <div className="px-root">
      <motion.section
        className="glass px-panel"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
      >
        <div className="px-panel-head">
          <span className="px-label">Daily practice challenge</span>
          <span className="px-sub">
            Phase {phase.code} · {phase.name}
          </span>
        </div>
        <div className="px-challenge">
          <div className="px-day">
            <span className="px-label">Day</span>
            <span className="px-day-num">{day}</span>
            <span className="px-sub">of {TOTAL_DAYS}</span>
          </div>
          <div className="px-challenge-body">
            <h3 className="px-lesson-title">{lesson.title}</h3>
            <p className="px-quote">{challenge}</p>

            <div className="px-status-row" role="group" aria-label="Challenge status">
              {STATUSES.map((s) => (
                <button
                  key={s.key}
                  className={cx('px-status-btn', current?.status === s.key && 'on')}
                  aria-pressed={current?.status === s.key}
                  onClick={() => setStatus(s.key)}
                >
                  {s.icon} {s.label}
                </button>
              ))}
              <span className="px-sub">{current ? `Marked ${statusLabel(current.status).toLowerCase()}` : 'Not marked yet'}</span>
            </div>

            <label className="px-filter">
              <span className="px-label">Note (optional)</span>
              <textarea
                className="textarea"
                rows={2}
                value={note}
                placeholder="What did you notice?"
                onChange={(e) => setNote(e.target.value)}
                onBlur={saveNote}
              />
            </label>

            <span className="px-context">
              {todayCount === 0
                ? 'No replay sessions logged today yet.'
                : `${todayCount} replay session${todayCount === 1 ? '' : 's'} logged today.`}
            </span>

            <div className="px-links">
              <Link to={`/journey/${day}`} className="btn btn-sm btn-ghost">
                <BookOpen size={14} /> Open today’s lesson
              </Link>
              <Link to="/trading/replay" className="btn btn-sm btn-primary">
                <Play size={14} /> Start a replay
              </Link>
              <Link to="/chart-practice" className="btn btn-sm btn-ghost">
                <CandlestickChart size={14} /> Candle trainer
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="glass px-panel"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08, ease }}
      >
        <div className="px-panel-head">
          <span className="px-label">Last 14 days</span>
          <span className="px-sub">Challenge status by journey day</span>
        </div>
        <div className="px-days">
          {recent.map((r) => (
            <Link
              key={r.day}
              to={`/journey/${r.day}`}
              className={cx('px-day-cell', r.day === day && 'today', r.doc?.status === 'completed' && 'completed')}
              title={`${formatShort(r.date)} · ${challengeFor(r.day)}${r.doc?.note ? `\n\n${r.doc.note}` : ''}`}
            >
              <span className="px-sub">{formatShort(r.date)}</span>
              <span className="n">{r.day}</span>
              <span className="t">{r.title}</span>
              <span className={cx('s', r.doc?.status)}>{r.doc ? statusLabel(r.doc.status) : ' '}</span>
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
