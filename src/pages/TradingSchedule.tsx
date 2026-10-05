import { JournalCTA } from '../components/journal/JournalCTA';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BookOpen, CalendarCheck, Zap } from 'lucide-react';
import { TRADING_SESSIONS, type TradingSession } from '../data/schedule';
import { lessonFor } from '../data/curriculum';
import { useDayLog } from '../lib/daylog';
import { useJourneyDay } from '../lib/data';
import { formatHeaderDate, hmToMin, minTo12, minToClock, nowMinutes } from '../lib/dates';
import { useNow, useToday } from '../lib/hooks';
import { CountUp, HoloCheck, PageHeader, Panel, SegBar, cx, reveal } from '../components/ui';
import { SessionTimer } from '../components/SessionTimer';
import '../styles/schedule.css';

const clock = (hm: string) => minToClock(hmToMin(hm)).replace(/^0/, '');
const time12 = (hm: string) => minTo12(hmToMin(hm)).replace(/^0/, '');

export function TradingSchedule() {
  const today = useToday();
  const now = useNow(30_000);
  const day = useDayLog(today);
  const journeyDay = useJourneyDay(today);
  const lesson = lessonFor(journeyDay);
  const nowMin = nowMinutes(now);

  return (
    <div>
      <PageHeader
        eyebrow={formatHeaderDate(today)}
        title="TRADING SCHEDULE"
        description="Two focused sessions a day. Tick each block as you finish it — progress syncs with My Day."
        actions={
          <Link to="/my-day" className="btn btn-sm">
            <CalendarCheck size={14} /> My Day
          </Link>
        }
      />
      <div className="sc-sessions">
        {TRADING_SESSIONS.map((s, i) => (
          <motion.div key={s.id} variants={reveal} initial="hidden" animate="show" custom={i}>
            <SessionPanel session={s} day={day} nowMin={nowMin}>
              {s.id === 'morning' && (
                <Link to={`/journey/${journeyDay}`} className="sc-concept">
                  <span className="row between">
                    <span className="sc-kicker">
                      <BookOpen size={12} style={{ verticalAlign: '-2px', marginRight: 6 }} />
                      Today&apos;s concept · Day {journeyDay}
                    </span>
                    <ArrowRight size={14} className="cyan" />
                  </span>
                  <h4>{lesson.title}</h4>
                  <p>{lesson.concept}</p>
                </Link>
              )}
            </SessionPanel>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SessionPanel({
  session,
  day,
  nowMin,
  children,
}: {
  session: TradingSession;
  day: ReturnType<typeof useDayLog>;
  nowMin: number;
  children?: React.ReactNode;
}) {
  const stats = day.session(session.id);
  const live = nowMin >= hmToMin(session.start) && nowMin < hmToMin(session.end);
  return (
    <Panel hud glow={live || stats.complete}>
      <div className="sc-session-head">
        <h2>{session.title}</h2>
        <span className="sc-session-range">
          {time12(session.start)} – {time12(session.end)}
        </span>
      </div>
      <div className="row" style={{ justifyContent: 'flex-end', marginTop: -6, marginBottom: 12 }}>
        <JournalCTA session={session.id} live={live} />
      </div>
      {children}
      <div className="sc-thead sc-kicker" aria-hidden>
        <span>Time</span>
        <span>Task</span>
        <span>Completed</span>
      </div>
      <div role="list">
        {session.tasks.map((t) => {
          const done = !!day.log.done[t.id];
          const current = nowMin >= hmToMin(t.start) && nowMin < hmToMin(t.end);
          return (
            <motion.div
              key={t.id}
              role="listitem"
              className={cx('task-row sc-row', done && 'done', current && 'current')}
              whileHover={{ x: 2 }}
              onClick={() => day.toggleSub(t.id)}
              style={{ cursor: day.editable ? 'pointer' : undefined }}
            >
              <span className="task-time">
                {clock(t.start)}–{clock(t.end)}
              </span>
              <span className="row" style={{ gap: 8, minWidth: 0 }}>
                <span className="task-label">{t.label}</span>
                {current && !done && <span className="sc-now-tag">NOW</span>}
              </span>
              <HoloCheck checked={done} onChange={() => day.toggleSub(t.id)} label={t.label} disabled={!day.editable} />
            </motion.div>
          );
        })}
      </div>

      <div className="sc-progress">
        <span className="sc-kicker">Trading session</span>
        <SegBar value={stats.pct} segments={10} />
        <span className="pct">
          <CountUp value={Math.round(stats.pct * 100)} duration={600} />%
        </span>
      </div>
      <AnimatePresence>
        {stats.complete && (
          <motion.div
            className="sc-complete"
            initial={{ opacity: 0, scale: 0.96, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Zap size={16} /> SESSION COMPLETE · +1% IMPROVEMENT
          </motion.div>
        )}
      </AnimatePresence>
      <SessionTimer sessionId={session.id} />
    </Panel>
  );
}
