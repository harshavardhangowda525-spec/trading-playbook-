import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Database, History, Pause, Play, PlayCircle, RotateCcw, ScanSearch } from 'lucide-react';
import { CountUp, RingMeter, cx } from '../components/ui';
import { DataImport } from '../components/practice/DataImport';
import { PracticeLibrary } from '../components/practice/PracticeLibrary';
import { PracticeLearn } from '../components/practice/PracticeLearn';
import { MistakeHeatmap } from '../components/practice/MistakeHeatmap';
import { ReplayWorkspace } from '../components/practice/ReplayWorkspace';
import { MarketsViewer } from '../components/practice/MarketsViewer';
import { AssistantChat } from '../components/assistant/AssistantChat';
import { useCollection, useDoc, useNow, useToday } from '../lib/hooks';
import { useJourneyDay } from '../lib/data';
import { celebrate } from '../lib/events';
import { formatShort } from '../lib/dates';
import {
  CHALLENGES_COL,
  SESSIONS_COL,
  SIM_NOTICE,
  challengeFor,
  type ChallengeDoc,
  type PracticeSession,
} from '../lib/practice';
import '../styles/practice.css';

const ease = [0.22, 1, 0.36, 1] as const;
const fade = (i = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay: i * 0.07, ease },
});

/** TRADING PRACTICE LAB — /trading, /trading/replay, /trading/markets, /trading/ask, /trading/history, /trading/learn */
export function PracticeLab() {
  const { pathname } = useLocation();
  const sub = pathname.replace(/^\/trading\/?/, '');
  const [importOpen, setImportOpen] = useState(false);

  return (
    <div className="pl">
      <header className="pl-head">
        <div>
          <div className="eyebrow">Simulation only · educational</div>
          <h1 className="pl-title">Trading Practice Lab</h1>
          <p className="pl-tagline">Study the past. Make the decision. Test the setup. Improve the process.</p>
        </div>
        <div className="pl-head-actions">
          <button className="btn" onClick={() => setImportOpen(true)}>
            <Database size={14} /> Import historical data
          </button>
        </div>
      </header>
      <div className="pl-notice mono">{SIM_NOTICE}</div>

      <motion.div key={sub || 'home'} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}>
        {sub === 'replay' ? (
          <ReplayWorkspace onImport={() => setImportOpen(true)} />
        ) : sub === 'history' ? (
          <>
            <PracticeLibrary />
            <div className="pl-other-logs mono">
              Other practice logs · <Link to="/backtesting">Backtesting journal</Link> · <Link to="/simulation">Paper-trade log</Link>
            </div>
          </>
        ) : sub === 'learn' ? (
          <PracticeLearn />
        ) : sub === 'markets' ? (
          <MarketsViewer />
        ) : sub === 'ask' ? (
          <div className="glass ai-page-wrap">
            <AssistantChat variant="page" />
          </div>
        ) : (
          <PracticeHome />
        )}
      </motion.div>

      <DataImport open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}

// ─── Lab home ──────────────────────────────────────────────────────────────

const MODES = [
  {
    key: 'historical',
    title: 'Historical Practice',
    text: 'Study a real historical chart up to a point, make one decision, then reveal what happened.',
    to: '/trading/replay?mode=historical',
    icon: ScanSearch,
  },
  {
    key: 'simulation',
    title: 'Simulation',
    text: 'Replay real market movement candle by candle and manage a simulated decision as it unfolds.',
    to: '/trading/replay?mode=simulation',
    icon: PlayCircle,
  },
  {
    key: 'review',
    title: 'Review',
    text: 'Revisit past sessions, compare decisions with outcomes and study your recurring mistakes.',
    to: '/trading/history',
    icon: History,
  },
];

function PracticeHome() {
  const navigate = useNavigate();
  const today = useToday();
  const day = useJourneyDay(today);
  const { items: sessions } = useCollection<PracticeSession>(SESSIONS_COL);
  const fallback = useMemo<ChallengeDoc>(() => ({ id: String(day), status: 'skipped', at: 0, note: '' }), [day]);
  const [challenge, , hasChallenge] = useDoc<ChallengeDoc>(CHALLENGES_COL, String(day), fallback);
  const done = sessions.filter((s) => s.status === 'complete');
  const avg = done.length ? done.reduce((a, s) => a + (s.score?.total ?? 0), 0) / done.length : null;
  const inProgress = sessions.filter((s) => s.status !== 'complete').sort((a, b) => b.updatedAt - a.updatedAt)[0];
  const recent = [...done].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 3);

  return (
    <div className="pl-home">
      <div className="pl-modes">
        {MODES.map((m, i) => (
          <motion.button key={m.key} className="glass pl-mode" onClick={() => navigate(m.to)} {...fade(i)} whileHover={{ y: -4 }} whileTap={{ scale: 0.985 }}>
            <m.icon size={20} strokeWidth={1.3} className="pl-mode-icon" />
            <span className="pl-mode-title">{m.title}</span>
            <span className="pl-mode-text">{m.text}</span>
            <span className="pl-mode-go mono">
              Enter <ArrowRight size={12} />
            </span>
          </motion.button>
        ))}
      </div>

      {inProgress && (
        <motion.div className="glass pl-resume" {...fade(3)}>
          <span className="mono-label">In progress</span>
          <span>
            {inProgress.market} · {inProgress.interval} · {inProgress.status === 'decided' ? 'decision locked' : 'replaying'}
          </span>
          <button className="btn btn-sm" onClick={() => navigate(`/trading/replay?session=${inProgress.id}`)}>
            Resume <ArrowRight size={13} />
          </button>
        </motion.div>
      )}

      <div className="pl-row">
        <motion.section className="glass pad pl-challenge" {...fade(4)}>
          <div className="mono-label">Daily practice challenge</div>
          <div className="pl-day">DAY {String(day).padStart(2, '0')}</div>
          <p className="pl-challenge-text">“{challengeFor(day)}”</p>
          <div className="row between wrap">
            <span className={cx('badge', hasChallenge ? (challenge.status === 'skipped' ? 'dim' : 'good') : 'dim')}>
              {hasChallenge ? challenge.status : 'not started'}
            </span>
            <Link to="/trading/learn" className="text-btn">
              Open challenge <ArrowRight size={12} />
            </Link>
          </div>
        </motion.section>

        <motion.section className="glass pad pl-next" {...fade(5)}>
          <div className="mono-label">Practice progress</div>
          <p className="small muted" style={{ margin: '12px 0 0' }}>
            Every reviewed session builds your process score, mistake heatmap and learning curve.
          </p>
          <div className="pl-mini-stats">
            <div>
              <span className="mono-label">Sessions</span>
              <b>
                <CountUp value={done.length} />
              </b>
            </div>
            <div>
              <span className="mono-label">Avg process</span>
              <b>{avg == null ? '—' : <CountUp value={Math.round(avg)} />}</b>
            </div>
          </div>
          <Link to="/trading/history" className="text-btn" style={{ marginTop: 14 }}>
            Practice library <ArrowRight size={12} />
          </Link>
        </motion.section>

        <motion.section className="glass pad" {...fade(6)}>
          <PracticeTimer />
        </motion.section>
      </div>

      <motion.section {...fade(7)}>
        <MistakeHeatmap />
      </motion.section>

      {recent.length > 0 && (
        <motion.section {...fade(8)}>
          <div className="row between" style={{ margin: '26px 0 12px' }}>
            <span className="mono-label">Recent sessions</span>
            <Link to="/trading/history" className="text-btn">
              Practice library <ArrowRight size={12} />
            </Link>
          </div>
          <div className="pl-recent">
            {recent.map((s) => (
              <button key={s.id} className="glass pl-recent-card" onClick={() => navigate(`/trading/replay?session=${s.id}`)}>
                {s.image && <img src={s.image} alt="" />}
                <div className="pl-recent-body">
                  <span className="mono tiny muted">{formatShort(s.date).toUpperCase()}</span>
                  <span className="pl-recent-title">
                    {s.market} · {s.interval}
                  </span>
                  <span className="small muted">
                    {s.decision === 'notrade' ? 'No trade' : s.decision?.toUpperCase()} · {s.strategyName}
                  </span>
                </div>
                {s.score && <RingMeter value={s.score.total / 100} size={48} stroke={2} />}
              </button>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}

// ─── Practice session timer ────────────────────────────────────────────────

interface PTimer {
  id: 'practice';
  duration: number; // seconds
  status: 'idle' | 'running' | 'paused' | 'done';
  startedAt: number | null;
  accumulated: number;
}
const DEFAULT_PTIMER: PTimer = { id: 'practice', duration: 25 * 60, status: 'idle', startedAt: null, accumulated: 0 };

export function PracticeTimer() {
  const [t, update] = useDoc<PTimer>('settings', 'practiceTimer', DEFAULT_PTIMER);
  const now = useNow(500);
  const navigate = useNavigate();
  const elapsed = t.accumulated + (t.status === 'running' && t.startedAt ? (now.getTime() - t.startedAt) / 1000 : 0);
  const left = Math.max(0, t.duration - elapsed);

  useEffect(() => {
    if (t.status === 'running' && left <= 0) {
      update({ status: 'done', startedAt: null, accumulated: t.duration });
      celebrate({ kind: 'session', title: 'SESSION COMPLETE', lines: ['Practice session complete', 'Time to review'] });
      navigate('/trading/history');
    }
  }, [left, t.status, t.duration, update, navigate]);

  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(Math.floor(left % 60)).padStart(2, '0');
  return (
    <div className="pl-timer">
      <div className="mono-label">Practice session</div>
      <div className="row" style={{ gap: 16, marginTop: 10 }}>
        <RingMeter value={1 - left / t.duration} size={74} stroke={2} showValue={false} />
        <div>
          <div className="pl-timer-clock">
            {mm}:{ss}
          </div>
          <div className="mono tiny muted">{t.status === 'done' ? 'SESSION COMPLETE' : t.status === 'running' ? 'IN SESSION' : t.status === 'paused' ? 'PAUSED' : 'READY'}</div>
        </div>
      </div>
      <div className="row wrap" style={{ marginTop: 14, gap: 8 }}>
        {t.status === 'running' ? (
          <button className="btn btn-sm" onClick={() => update({ status: 'paused', startedAt: null, accumulated: elapsed })}>
            <Pause size={13} /> Pause
          </button>
        ) : (
          <button className="btn btn-sm btn-primary" disabled={t.status === 'done'} onClick={() => update({ status: 'running', startedAt: Date.now() })}>
            <Play size={13} /> {t.status === 'paused' ? 'Resume' : 'Start'}
          </button>
        )}
        <button className="btn btn-sm btn-ghost" onClick={() => update({ ...DEFAULT_PTIMER, duration: t.duration })}>
          <RotateCcw size={13} /> Reset
        </button>
        <select
          className="select"
          style={{ width: 'auto', height: 32, padding: '0 28px 0 10px', fontSize: 12 }}
          value={t.duration}
          disabled={t.status === 'running'}
          onChange={(e) => update({ ...DEFAULT_PTIMER, duration: Number(e.target.value) })}
          aria-label="Session length"
        >
          {[15, 25, 45, 60].map((m) => (
            <option key={m} value={m * 60}>
              {m} min
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
