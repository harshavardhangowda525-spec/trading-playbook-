import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Calculator, ChevronDown, FlaskConical, PlayCircle, ShieldCheck } from 'lucide-react';
import { Field, HoloCheck, NumberInput, RingMeter, cx } from '../ui';
import { RiskCostSettings } from './RiskCostSettings';
import { useBacktestRuns, useCourseProgress, useEtfConfig, usePaperSessions } from '../../lib/etf/config';
import { fillCharges, fillPrice } from '../../lib/etf/costs';
import { breakevenWinRate, plannedRR, positionSize } from '../../lib/etf/risk';
import { STRATEGIES, type StrategyId } from '../../lib/etf/strategies';
import { ETFS, fmtMoney } from '../../lib/etf/universe';
import '../../styles/etf.css';

const ease = [0.22, 1, 0.36, 1] as const;
const LESSON_DAYS: Record<StrategyId | 'risk', number> = { risk: 22, trend: 29, breakout: 36, pullback: 43, range: 50 };

type ModuleId = StrategyId | 'risk';

/** ETF Strategy Course: modules A–E with rules, progress and links into practice. */
export function EtfCourse() {
  const [progress, update] = useCourseProgress();
  const runs = useBacktestRuns().items;
  const paper = usePaperSessions().items;
  const [open, setOpen] = useState<ModuleId | null>(null);

  const status = (id: ModuleId) => {
    const backtested = id === 'risk' ? runs.length > 0 : runs.some((r) => r.config.strategy === id);
    const papered = id === 'risk' ? paper.some((p) => p.status === 'ended') : paper.some((p) => p.status === 'ended' && p.strategy === id);
    const steps = [!!progress.read[id], !!progress.replayed[id], backtested, papered];
    return { steps, backtested, papered, pct: steps.filter(Boolean).length / steps.length };
  };
  const overall = (['trend', 'breakout', 'pullback', 'range', 'risk'] as ModuleId[]).reduce((a, id) => a + status(id).pct, 0) / 5;
  const mark = (k: 'read' | 'replayed', id: ModuleId, v: boolean) => update((p) => ({ ...p, [k]: { ...p[k], [id]: v } }));

  const modules: { id: ModuleId; letter: string; name: string; summary: string }[] = [
    ...STRATEGIES.map((s) => ({ id: s.id as ModuleId, letter: s.letter, name: s.name, summary: s.summary })),
    { id: 'risk', letter: 'E', name: 'Risk Management', summary: 'Size every position from a fixed risk budget, plan the stop first, respect the daily loss limit and cooldown.' },
  ];

  return (
    <motion.section className="glass pad etf-panel" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
      <div className="etf-head">
        <div>
          <div className="mono-label">ETF Strategy Course</div>
          <div className="etf-title">
            <BookOpen size={16} /> Five modules · learn → replay → backtest → paper
          </div>
          <p className="small muted" style={{ margin: '6px 0 0' }}>
            Templates to test objectively on real ETF history — none of them is a system that “always works”. ETFs only: {ETFS.filter((e) => e.exchange === 'NSE').map((e) => e.symbol).slice(0, 6).join(', ')}…
          </p>
        </div>
        <RingMeter value={overall} size={64} stroke={2} />
      </div>
      <div className="etf-modules">
        {modules.map((m) => {
          const st = status(m.id);
          const s = STRATEGIES.find((x) => x.id === m.id);
          const isOpen = open === m.id;
          return (
            <div key={m.id} className={cx('etf-module', isOpen && 'open')}>
              <button type="button" className="etf-module-head" onClick={() => setOpen(isOpen ? null : m.id)} aria-expanded={isOpen}>
                <span className="etf-letter">{m.letter}</span>
                <span className="etf-module-text">
                  <b>{m.name}</b>
                  <span className="small muted">{m.summary}</span>
                </span>
                <span className="etf-steps" aria-label={`${Math.round(st.pct * 100)}% complete`}>
                  {st.steps.map((d, i) => (
                    <i key={i} className={cx(d && 'on')} />
                  ))}
                </span>
                <ChevronDown size={14} className={cx(isOpen && 'flip')} />
              </button>
              {isOpen && (
                <div className="etf-module-body">
                  {s ? (
                    <div className="etf-two">
                      <Rules title="Entry conditions" items={s.entry} />
                      <Rules title="Exit rules" items={s.exits} />
                      <Rules title="Invalidation" items={s.invalidation} />
                      <Rules title="Do not use it when" items={s.avoid} />
                    </div>
                  ) : (
                    <RiskModule />
                  )}
                  <div className="etf-progress">
                    <HoloCheck checked={!!progress.read[m.id]} onChange={(v) => mark('read', m.id, v)} label="Studied the rules" />
                    <span>Studied the rules</span>
                    <HoloCheck checked={!!progress.replayed[m.id]} onChange={(v) => mark('replayed', m.id, v)} label="Practised in Replay" />
                    <span>Practised in Replay</span>
                    <HoloCheck checked={st.backtested} onChange={() => undefined} disabled label="Backtested" />
                    <span>Backtested {st.backtested ? '✓ (saved run)' : '— save a run in Backtest'}</span>
                    <HoloCheck checked={st.papered} onChange={() => undefined} disabled label="Paper-traded" />
                    <span>Paper-traded {st.papered ? '✓' : '— finish a paper session with it'}</span>
                  </div>
                  <div className="row wrap" style={{ gap: 8 }}>
                    <Link className="btn btn-sm btn-ghost" to={`/journey/${LESSON_DAYS[m.id]}`}>
                      <BookOpen size={13} /> Lessons (Day {LESSON_DAYS[m.id]}+)
                    </Link>
                    <Link className="btn btn-sm btn-ghost" to="/trading/replay">
                      <PlayCircle size={13} /> Replay
                    </Link>
                    <Link className="btn btn-sm" to="/trading/backtest">
                      <FlaskConical size={13} /> Backtest
                    </Link>
                    <Link className="btn btn-sm" to="/trading/paper">
                      <ShieldCheck size={13} /> Paper trade
                    </Link>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}

function Rules({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="etf-rule">
      <b>{title}</b>
      <ul>
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

/** Module E: interactive position-size and R:R calculator using your saved limits and cost assumptions. */
function RiskModule() {
  const { cfg } = useEtfConfig();
  const [entry, setEntry] = useState<number | null>(250);
  const [stop, setStop] = useState<number | null>(248.5);
  const [target, setTarget] = useState<number | null>(253);
  const [stt, setStt] = useState(true);
  const side = entry != null && stop != null && stop > entry ? 'short' : 'long';
  const size = entry && stop ? positionSize(side, entry, stop, cfg.risk, cfg.costsNSE, stt) : null;
  const rr = entry && stop ? plannedRR(side, entry, stop, target) : null;
  const q = size?.qty ?? 0;
  const roundTrip = entry && q ? (fillPrice('buy', entry, cfg.costsNSE) - fillPrice('sell', entry, cfg.costsNSE)) * q + fillCharges('buy', entry, q, cfg.costsNSE, stt).total + fillCharges('sell', entry, q, cfg.costsNSE, stt).total : 0;
  const riskOnly = entry && stop && q ? Math.abs(entry - stop) * q : 0;
  const costR = riskOnly ? roundTrip / riskOnly : 0;
  return (
    <div>
      <ul className="etf-rule-list">
        <li>Risk per trade is a fixed % of a fixed virtual capital — size never increases after wins or to “win back” losses.</li>
        <li>Plan the stop first; position size = risk budget ÷ (stop distance + costs).</li>
        <li>Reaching the daily loss limit blocks new trades and starts a cooldown. Max trades per day stops overtrading.</li>
        <li>Check reward : risk <em>before</em> entering; costs raise the win rate you need to break even.</li>
      </ul>
      <div className="etf-sub">
        <Calculator size={13} /> Position-size calculator (hypothetical prices · your saved limits)
      </div>
      <div className="etf-grid">
        <Field label="Entry (₹)">
          <NumberInput value={entry} onChange={setEntry} />
        </Field>
        <Field label="Stop (₹)">
          <NumberInput value={stop} onChange={setStop} />
        </Field>
        <Field label="Target (₹)">
          <NumberInput value={target} onChange={setTarget} />
        </Field>
        <Field label="STT applies">
          <select className="select" value={stt ? 'y' : 'n'} onChange={(e) => setStt(e.target.value === 'y')}>
            <option value="y">Yes — equity ETF</option>
            <option value="n">No — gold / silver ETF</option>
          </select>
        </Field>
      </div>
      <div className="etf-kv">
        <div>
          <span>Risk budget</span>
          <b>{fmtMoney((cfg.risk.capital * cfg.risk.riskPct) / 100)}</b>
        </div>
        <div>
          <span>Quantity</span>
          <b>{size?.rejected ?? q}</b>
        </div>
        <div>
          <span>Loss if stopped (incl. costs)</span>
          <b>{fmtMoney(size?.riskAmount ?? null)}</b>
        </div>
        <div>
          <span>Position value</span>
          <b>{entry ? fmtMoney(entry * q) : '—'}</b>
        </div>
        <div>
          <span>Planned R:R</span>
          <b>{rr == null ? '—' : rr.toFixed(2)}</b>
        </div>
        <div>
          <span>Round-trip costs</span>
          <b>
            {fmtMoney(roundTrip)} ({costR.toFixed(2)} R)
          </b>
        </div>
        <div>
          <span>Break-even win rate</span>
          <b>{rr && rr > 0 ? `${(breakevenWinRate(rr, costR) * 100).toFixed(1)}%` : '—'}</b>
        </div>
      </div>
      <RiskCostSettings exchange="NSE" compact />
    </div>
  );
}
