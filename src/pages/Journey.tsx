import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { LESSONS_BY_DAY, PHASES, TOTAL_DAYS, phaseFor } from '../data/curriculum';
import { journeyState } from '../lib/domain';
import { useJourney, useJourneyDay } from '../lib/data';
import { useToday } from '../lib/hooks';
import { CountUp, PageHeader, Panel, RingMeter, cx, reveal } from '../components/ui';
import { JourneyTimeline, StateIcon } from '../components/JourneyTimeline';
import '../styles/learn.css';

export function Journey() {
  const today = useToday();
  const current = useJourneyDay(today);
  const { byDay, completed } = useJourney();
  const navigate = useNavigate();
  const phase = phaseFor(current);

  const missed = useMemo(() => {
    let n = 0;
    for (let d = 1; d < current; d++) if (!byDay.get(d)?.completed) n++;
    return n;
  }, [byDay, current]);

  return (
    <div>
      <PageHeader
        eyebrow="12-WEEK LEARNING SYSTEM"
        title="84-DAY JOURNEY"
        description="Twelve phases, one lesson a day. Each completed session lights up the map — 1% better every day."
        actions={
          <Link to={`/journey/${current}`} className="btn btn-primary">
            Open Day {current} <ArrowRight size={16} />
          </Link>
        }
      />

      <motion.div variants={reveal} initial="hidden" animate="show" custom={0}>
        <Panel hud className="mb-16">
          <div className="jo">
            <RingMeter value={completed / TOTAL_DAYS} size={150} stroke={7} label="Overall progress" />
            <div className="col gap-16">
              <div>
                <div className="stat-label">Current day</div>
                <div className="jo-day">
                  DAY <CountUp value={current} />
                  <small>/ {TOTAL_DAYS}</small>
                </div>
              </div>
              <div className="stat-grid">
                <div className="stat">
                  <span className="stat-label">Lessons completed</span>
                  <span className="stat-value">
                    <CountUp value={completed} />
                    <span className="dim" style={{ fontSize: '0.55em' }}> / {TOTAL_DAYS}</span>
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Missed days</span>
                  <span className="stat-value" style={missed ? { color: 'var(--warn)' } : undefined}>
                    <CountUp value={missed} />
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Current phase</span>
                  <span className="stat-value sm">
                    <span className="mono cyan">{phase.code}</span> {phase.short}
                  </span>
                </div>
              </div>
              <div className="notice small">
                Missed days stay visible and can be completed anytime — they never reset the journey.
              </div>
            </div>
          </div>
        </Panel>
      </motion.div>

      <motion.div variants={reveal} initial="hidden" animate="show" custom={1}>
        <Panel title="Journey map" sub="84 days" className="mb-16">
          <JourneyTimeline current={current} days={byDay} onSelect={(d) => navigate(`/journey/${d}`)} />
        </Panel>
      </motion.div>

      <motion.div variants={reveal} initial="hidden" animate="show" custom={2}>
        <Panel title="The 12 phases">
          <div className="phase-list">
            {PHASES.map((p) => {
              const lessons = LESSONS_BY_DAY.filter((l) => l.phase === p.num);
              const done = lessons.filter((l) => byDay.get(l.day)?.completed).length;
              return (
                <div key={p.num} className={cx('phase-item', p.num === phase.num && 'active')}>
                  <RingMeter value={done / lessons.length} size={58} stroke={4} />
                  <div style={{ minWidth: 0 }}>
                    <div className="phase-head">
                      <h3>
                        PHASE {p.code} — {p.short}{' '}
                        <span className="days">
                          · Days {p.days[0]}–{p.days[1]}
                        </span>
                      </h3>
                      <div className="row gap-4">
                        <span className="tag">
                          {done}/{lessons.length}
                        </span>
                        {p.workspace && (
                          <Link to={p.workspace.to} className="btn btn-sm btn-ghost">
                            {p.workspace.label} <ExternalLink size={13} />
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="phase-topics">
                      {p.topics.map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="phase-lessons">
                      {lessons.map((l) => {
                        const s = journeyState(l.day, current, byDay.get(l.day));
                        return (
                          <Link key={l.day} to={`/journey/${l.day}`} className="lesson-link" title={l.title}>
                            <StateIcon state={s} />
                            <span className="d">{String(l.day).padStart(2, '0')}</span>
                            <span className="t">{l.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </motion.div>
    </div>
  );
}
