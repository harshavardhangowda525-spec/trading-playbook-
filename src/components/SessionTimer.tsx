import { useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCheck, Pause, Play, RotateCcw } from 'lucide-react';
import { TRADING_SESSIONS, type TradingSessionId } from '../data/schedule';
import { C, DEFAULT_TIMER, timerElapsed, type TimerState } from '../lib/domain';
import { useDayLog } from '../lib/daylog';
import { formatDuration, hmToMin } from '../lib/dates';
import { useDoc, useNow, useToday } from '../lib/hooks';
import { cx } from './ui';
import '../styles/schedule.css';

const RING = 132;
const STROKE = 5;

/** Optional countdown for one trading session. One shared doc → only one timer runs at a time. */
export function SessionTimer({ sessionId }: { sessionId: TradingSessionId }) {
  const reduce = useReducedMotion();
  const today = useToday();
  const day = useDayLog(today);
  const [timer, setTimer] = useDoc<TimerState>(C.timer, 'current', DEFAULT_TIMER);
  const session = TRADING_SESSIONS.find((s) => s.id === sessionId)!;
  const startMin = hmToMin(session.start);
  const duration = (hmToMin(session.end) - startMin) * 60;

  const mine = timer.session === sessionId && timer.date === today;
  const status: TimerState['status'] = mine ? timer.status : 'idle';
  const otherRunning = !mine && timer.date === today && timer.status === 'running';
  const now = useNow(status === 'running' ? 250 : 5000);

  const elapsed = mine ? timerElapsed(timer, now.getTime()) : 0;
  const remaining = Math.max(0, duration - elapsed);
  const overtime = status === 'running' && elapsed > duration;
  const progress = status === 'complete' ? 1 : Math.min(1, elapsed / duration);
  const elapsedMin = elapsed / 60;
  const current = session.tasks.find((t) => elapsedMin >= hmToMin(t.start) - startMin && elapsedMin < hmToMin(t.end) - startMin);
  const taskLabel =
    status === 'complete' ? 'All tasks logged' : status === 'idle' ? session.tasks[0].label : (current?.label ?? 'Wrap up and log the session');
  const sessionDone = day.session(sessionId).complete;

  const start = useCallback(
    () => setTimer({ id: 'current', session: sessionId, date: today, status: 'running', startedAt: Date.now(), accumulated: 0 }),
    [setTimer, sessionId, today],
  );
  const pause = () => setTimer((p) => ({ ...p, status: 'paused', accumulated: timerElapsed(p), startedAt: null }));
  const resume = () => setTimer((p) => ({ ...p, status: 'running', startedAt: Date.now() }));
  const complete = () => {
    day.completeSession(sessionId);
    setTimer((p) => ({ ...p, session: sessionId, date: today, status: 'complete', accumulated: mine ? timerElapsed(p) : 0, startedAt: null }));
  };
  const reset = () => setTimer({ ...DEFAULT_TIMER, session: sessionId, date: today });

  const r = (RING - STROKE) / 2 - 4;
  const circ = 2 * Math.PI * r;

  const statusLabel =
    status === 'running' ? (overtime ? 'OVERTIME' : 'SESSION ACTIVE') : status === 'paused' ? 'PAUSED' : status === 'complete' ? 'SESSION LOGGED' : 'STANDBY';

  return (
    <div className={cx('sc-timer', status === 'running' && 'running')}>
      <div className="sc-timer-ring" aria-hidden>
        <svg width={RING} height={RING} viewBox={`0 0 ${RING} ${RING}`}>
          <circle
            cx={RING / 2}
            cy={RING / 2}
            r={RING / 2 - 1.5}
            fill="none"
            stroke="rgba(120,225,255,0.22)"
            strokeWidth="2"
            strokeDasharray={`1 ${(2 * Math.PI * (RING / 2 - 1.5)) / 60 - 1}`}
          />
          <circle cx={RING / 2} cy={RING / 2} r={r} fill="none" stroke="rgba(120,225,255,0.1)" strokeWidth={STROKE} />
          <motion.circle
            cx={RING / 2}
            cy={RING / 2}
            r={r}
            fill="none"
            stroke={overtime ? 'var(--warn)' : 'var(--cyan)'}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={circ}
            style={{ filter: 'drop-shadow(0 0 4px rgba(62,230,255,0.8))' }}
            initial={false}
            animate={{ strokeDashoffset: circ * (1 - progress) }}
            transition={{ duration: reduce ? 0 : 0.4, ease: 'linear' }}
          />
        </svg>
        <div className="inner">
          <span className="sc-kicker" style={{ fontSize: 9.5 }}>
            Time remaining
          </span>
          <span className="sc-timer-digits">{formatDuration(status === 'complete' ? 0 : remaining)}</span>
          <span className="tiny dim mono">/{formatDuration(duration)}</span>
        </div>
      </div>

      <div style={{ minWidth: 0 }}>
        <div className={cx('sc-timer-status', status === 'running' && 'running')}>
          <span className={cx('sc-live-dot', status === 'running' ? 'run' : status === 'paused' ? 'paused' : status === 'idle' && 'idle')} />
          <span className={status === 'running' ? 'pulse' : undefined}>{statusLabel}</span>
        </div>
        <div className="sc-kicker" style={{ marginTop: 10 }}>
          {status === 'idle' ? 'First task' : 'Current task'}
        </div>
        <div className="sc-timer-task">
          {taskLabel}
        </div>
        {otherRunning && status === 'idle' && (
          <div className="tiny warn" style={{ marginBottom: 8 }}>
            Starting here stops the {timer.session} session timer.
          </div>
        )}
        <div className="sc-timer-controls">
          {status === 'idle' && (
            <button className="btn btn-primary btn-sm" onClick={start} disabled={!day.editable}>
              <Play size={14} /> Start
            </button>
          )}
          {status === 'running' && (
            <button className="btn btn-sm" onClick={pause}>
              <Pause size={14} /> Pause
            </button>
          )}
          {status === 'paused' && (
            <button className="btn btn-primary btn-sm" onClick={resume}>
              <Play size={14} /> Resume
            </button>
          )}
          {status !== 'complete' && (
            <button className="btn btn-sm" onClick={complete} disabled={!day.editable || (status === 'idle' && sessionDone)}>
              <CheckCheck size={14} /> Complete
            </button>
          )}
          {status !== 'idle' && (
            <button className="btn btn-ghost btn-sm" onClick={reset}>
              <RotateCcw size={14} /> Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
