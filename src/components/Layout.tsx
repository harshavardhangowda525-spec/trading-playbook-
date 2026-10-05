import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, BookMarked, CalendarClock, Home, LineChart, LogOut, NotebookPen, Settings } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useDoc, useNow, useSyncStatus, useToday } from '../lib/hooks';
import { formatHeaderDate, hmToMin } from '../lib/dates';
import { useEnsureStartDate } from '../lib/data';
import { C, DEFAULT_TIMER, timerElapsed, type TimerState } from '../lib/domain';
import { TRADING_SESSIONS } from '../data/schedule';
import { PageFade } from './ui';

interface Section {
  id: string;
  label: string;
  icon: typeof Home;
  pages: { to: string; label: string }[];
}

/** Six command sections; each groups related pages behind a quiet tab row. */
export const SECTIONS: Section[] = [
  { id: 'home', label: 'Home', icon: Home, pages: [{ to: '/', label: 'Home' }] },
  {
    id: 'trading',
    label: 'Trading',
    icon: LineChart,
    pages: [
      { to: '/trading-schedule', label: 'Sessions' },
      { to: '/backtesting', label: 'Backtest' },
      { to: '/simulation', label: 'Simulation' },
      { to: '/chart-practice', label: 'Chart Practice' },
      { to: '/strategy-lab', label: 'Strategy Lab' },
    ],
  },
  {
    id: 'journal',
    label: 'Journal',
    icon: NotebookPen,
    pages: [
      { to: '/trading-journal', label: 'Trading Journal' },
      { to: '/daily-journal', label: 'Daily Journal' },
      { to: '/engine', label: '1% Engine' },
      { to: '/psychology', label: 'Psychology' },
      { to: '/mistakes', label: 'Mistake Lab' },
      { to: '/vault', label: 'Knowledge Vault' },
    ],
  },
  {
    id: 'playbook',
    label: 'Playbook',
    icon: BookMarked,
    pages: [
      { to: '/playbook', label: 'Playbook' },
      { to: '/journey', label: '84-Day Journey' },
      { to: '/evaluation', label: 'Evaluation' },
    ],
  },
  {
    id: 'timetable',
    label: 'Timetable',
    icon: CalendarClock,
    pages: [
      { to: '/my-day', label: 'My Day' },
      { to: '/history', label: 'History' },
      { to: '/weekly', label: 'Weekly Review' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    pages: [
      { to: '/analytics', label: 'Analytics' },
      { to: '/settings', label: 'Settings' },
    ],
  },
];

function sectionFor(path: string): Section {
  if (path === '/') return SECTIONS[0];
  return (
    SECTIONS.find((s) => s.pages.some((p) => p.to !== '/' && (path === p.to || path.startsWith(p.to + '/')))) ?? SECTIONS[0]
  );
}

const SYNC_LABEL: Record<string, string> = {
  local: 'LOCAL',
  loading: 'LOADING',
  synced: 'SYNCED',
  syncing: 'SYNCING',
  offline: 'OFFLINE',
  error: 'RETRYING',
};

function TimerChip() {
  const [timer] = useDoc<TimerState>(C.timer, 'current', DEFAULT_TIMER);
  const now = useNow(1000);
  const navigate = useNavigate();
  if (timer.status !== 'running' && timer.status !== 'paused') return null;
  const s = TRADING_SESSIONS.find((x) => x.id === timer.session)!;
  const total = (hmToMin(s.end) - hmToMin(s.start)) * 60;
  const left = Math.max(0, total - timerElapsed(timer, now.getTime()));
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(Math.floor(left % 60)).padStart(2, '0');
  return (
    <button className="badge" style={{ cursor: 'pointer' }} onClick={() => navigate('/trading-schedule')} title="Session timer">
      {timer.status === 'paused' ? 'PAUSED' : 'SESSION'} {mm}:{ss}
    </button>
  );
}

/** Keeps the outgoing page rendered during its exit transition. */
function FrozenOutlet() {
  const outlet = useOutlet();
  const [frozen] = useState(outlet);
  return frozen;
}

export function Layout() {
  const location = useLocation();
  const today = useToday();
  const { mode, signOut } = useAuth();
  const sync = useSyncStatus();
  useEnsureStartDate(today);
  const section = sectionFor(location.pathname);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <div className="main">
        <header className="topbar">
          <div className="topbar-left">
            <NavLink to="/" className="brand" aria-label="Home">
              <span className="brand-mark" />
              OBSIDIAN<span className="dim"> / OS</span>
            </NavLink>
          </div>
          <div className="topbar-center">{formatHeaderDate(today)}</div>
          <div className="topbar-right">
            <TimerChip />
            <span className="status-online" title={`Data: ${SYNC_LABEL[sync]}`}>
              <span className="label-text">
                SYSTEM STATUS / <b>{sync === 'error' || sync === 'offline' ? SYNC_LABEL[sync] : 'ACTIVE'}</b>
              </span>
              <span className="status-dot" />
            </span>
            <NavLink to="/settings" className="icon-btn" aria-label="Settings" title="Settings">
              <Settings size={14} />
            </NavLink>
            {mode === 'cloud' && (
              <button className="icon-btn" onClick={() => void signOut()} aria-label="Sign out" title="Sign out">
                <LogOut size={14} />
              </button>
            )}
          </div>
        </header>

        <main className="page">
          {section.pages.length > 1 && (
            <nav className="section-tabs" aria-label={`${section.label} pages`}>
              {section.pages.map((p) => (
                <NavLink key={p.to} to={p.to} end={p.to === '/journey' ? false : true}>
                  {p.label}
                </NavLink>
              ))}
            </nav>
          )}
          <AnimatePresence mode="wait">
            <PageFade key={location.pathname}>
              <FrozenOutlet />
            </PageFade>
          </AnimatePresence>
        </main>
      </div>

      <nav className="bottom-nav" aria-label="Primary">
        {SECTIONS.map((s) => {
          const active = s.id === section.id;
          return (
            <NavLink key={s.id} to={s.pages[0].to} className={active ? 'active' : ''} end>
              {active && (
                <motion.span layoutId="nav-pill" className="nav-pill" transition={{ type: 'spring', stiffness: 260, damping: 30 }} />
              )}
              <s.icon size={16} strokeWidth={1.5} />
              {s.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
