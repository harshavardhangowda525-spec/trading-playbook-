import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate, useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import {
  Activity,
  BarChart3,
  BookMarked,
  BookOpen,
  Brain,
  CalendarClock,
  CalendarDays,
  CandlestickChart,
  ChevronDown,
  ClipboardCheck,
  Cpu,
  FlaskConical,
  Gauge,
  History,
  LayoutDashboard,
  Library,
  ListChecks,
  LogOut,
  Map,
  Menu,
  NotebookPen,
  Settings,
  Sparkles,
  Target,
  Timer,
  TriangleAlert,
  Waypoints,
  X,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useDoc, useNow, useSyncStatus, useToday } from '../lib/hooks';
import { formatHeaderDate } from '../lib/dates';
import { useEnsureStartDate } from '../lib/data';
import { C, DEFAULT_TIMER, timerElapsed, type TimerState } from '../lib/domain';
import { TRADING_SESSIONS } from '../data/schedule';
import { hmToMin } from '../lib/dates';
import { PageFade } from './ui';

const NAV: { group: string; icon: typeof Cpu; items: { to: string; label: string; icon: typeof Cpu }[] }[] = [
  { group: 'Core', icon: Cpu, items: [{ to: '/', label: 'Dashboard', icon: LayoutDashboard }] },
  {
    group: 'Schedule',
    icon: CalendarClock,
    items: [
      { to: '/my-day', label: 'My Day', icon: ListChecks },
      { to: '/trading-schedule', label: 'Trading Schedule', icon: Timer },
      { to: '/history', label: 'History', icon: History },
      { to: '/weekly', label: 'Weekly Review', icon: CalendarDays },
    ],
  },
  {
    group: 'Learn',
    icon: BookOpen,
    items: [
      { to: '/journey', label: '84-Day Journey', icon: Map },
      { to: '/engine', label: 'The 1% Engine', icon: Sparkles },
      { to: '/evaluation', label: 'Evaluation', icon: Gauge },
    ],
  },
  {
    group: 'Practice',
    icon: Target,
    items: [
      { to: '/chart-practice', label: 'Chart Practice', icon: CandlestickChart },
      { to: '/backtesting', label: 'Backtesting', icon: History },
      { to: '/simulation', label: 'Simulation', icon: Activity },
    ],
  },
  {
    group: 'Build',
    icon: FlaskConical,
    items: [
      { to: '/strategy-lab', label: 'Strategy Lab', icon: Waypoints },
      { to: '/playbook', label: 'Playbook', icon: BookMarked },
    ],
  },
  {
    group: 'Track',
    icon: BarChart3,
    items: [
      { to: '/trading-journal', label: 'Trading Journal', icon: ClipboardCheck },
      { to: '/daily-journal', label: 'Daily Journal', icon: NotebookPen },
      { to: '/psychology', label: 'Psychology', icon: Brain },
      { to: '/mistakes', label: 'Mistake Lab', icon: TriangleAlert },
      { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  { group: 'Vault', icon: Library, items: [{ to: '/vault', label: 'Knowledge Vault', icon: Library }] },
];

const SYNC_LABEL: Record<string, string> = {
  local: 'LOCAL MODE · this browser',
  loading: 'LOADING…',
  synced: 'CLOUD SYNCED',
  syncing: 'SYNCING…',
  offline: 'OFFLINE · saved locally',
  error: 'SYNC RETRYING · saved locally',
};

function Sidebar({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => {
    try {
      return JSON.parse(localStorage.getItem('qc-nav') ?? '{}');
    } catch {
      return {};
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem('qc-nav', JSON.stringify(collapsed));
    } catch {
      /* ignore */
    }
  }, [collapsed]);
  const { mode, email, signOut } = useAuth();
  const sync = useSyncStatus();

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Primary navigation">
      <div className="brand">
        <span className="brand-mark">
          <Cpu size={17} />
        </span>
        QUANTUM CORE
      </div>
      <nav>
        {NAV.map((g) => {
          const isCollapsed = !!collapsed[g.group];
          return (
            <div className="nav-group" key={g.group}>
              <button
                className="nav-group-title"
                aria-expanded={!isCollapsed}
                onClick={() => setCollapsed((c) => ({ ...c, [g.group]: !c[g.group] }))}
              >
                <g.icon size={14} />
                {g.group}
                <ChevronDown size={14} className="chev" />
              </button>
              {!isCollapsed &&
                g.items.map((item) => (
                  <NavLink key={item.to} to={item.to} end={item.to === '/'} className="nav-link" onClick={onNavigate}>
                    <item.icon size={16} />
                    {item.label}
                  </NavLink>
                ))}
            </div>
          );
        })}
      </nav>
      <div className="sidebar-footer col gap-4">
        <span className="tiny mono" style={{ color: sync === 'synced' || sync === 'local' ? 'var(--muted)' : 'var(--warn)' }}>
          {SYNC_LABEL[sync]}
        </span>
        {email && <span className="tiny ellipsis">{email}</span>}
        <div className="row mt-8">
          <NavLink to="/settings" className="nav-link grow" onClick={onNavigate} style={{ margin: 0 }}>
            <Settings size={15} /> Settings
          </NavLink>
          {mode === 'cloud' && (
            <button className="icon-btn" onClick={() => void signOut()} aria-label="Sign out" title="Sign out">
              <LogOut size={15} />
            </button>
          )}
        </div>
        <p className="tiny dim" style={{ margin: '8px 0 0' }}>
          Educational journaling tool. Not financial advice.
        </p>
      </div>
    </aside>
  );
}

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
      <Timer size={12} /> {timer.status === 'paused' ? 'PAUSED' : 'SESSION'} {mm}:{ss}
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
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const today = useToday();
  useEnsureStartDate(today);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <Sidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
      {menuOpen && <div className="sidebar-scrim" onClick={() => setMenuOpen(false)} />}
      <div className="main">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn menu-btn" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle navigation">
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
            <span className="topbar-title">MY COMMAND CENTER</span>
          </div>
          <div className="topbar-center">{formatHeaderDate(today)}</div>
          <div className="topbar-right">
            <TimerChip />
            <span className="status-online">
              <span className="label-text">SYSTEM ONLINE</span>
              <span className="status-dot" />
              <span className="status-bars" aria-hidden>
                <i />
                <i />
                <i />
                <i />
              </span>
            </span>
          </div>
        </header>
        <main className="page">
          <AnimatePresence mode="wait">
            <PageFade key={location.pathname}>
              <FrozenOutlet />
            </PageFade>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
