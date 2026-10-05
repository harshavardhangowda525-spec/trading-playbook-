import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpenText, PenLine, Plus, Printer, Sparkles } from 'lucide-react';
import {
  C,
  DEFAULT_PLAYBOOK,
  PLAYBOOK_SECTIONS,
  mistakeStats,
  playbookCompletion,
  strategyCompletion,
  tradeStats,
  type Mistake,
  type Playbook,
  type Strategy,
  type Trade,
} from '../lib/domain';
import { useCollection, useDoc } from '../lib/hooks';
import { PageHeader, Panel, RingMeter, SegControl, cx, reveal } from '../components/ui';
import '../styles/build.css';

interface Suggestion {
  label: string;
  text: string;
}

function strategySummary(s: Strategy): string {
  const parts: [string, string][] = [
    ['Market', s.market],
    ['Timeframe', s.timeframe],
    ['Condition', s.condition],
    ['Setup', s.setup],
    ['Confirmation', s.confirmation],
    ['Entry', s.entryTrigger],
    ['Stop', s.stopLoss],
    ['Target', s.target],
    ['Risk/Reward', s.riskReward],
    ['Exit', s.exitRules],
  ];
  const body = parts.filter(([, v]) => v.trim()).map(([k, v]) => `${k}: ${v.trim()}`);
  return [s.name.trim() || 'Untitled strategy', ...body].join('\n');
}

export function PlaybookPage() {
  const [pb, update] = useDoc<Playbook>(C.playbook, 'main', DEFAULT_PLAYBOOK);
  const { items: strategies } = useCollection<Strategy>(C.strategies);
  const { items: backtests } = useCollection<Trade>(C.backtests);
  const { items: sims } = useCollection<Trade>(C.sims);
  const { items: mistakes } = useCollection<Mistake>(C.mistakes);
  const [mode, setMode] = useState<'edit' | 'read'>('edit');

  const completion = playbookCompletion(pb);
  const filledCount = PLAYBOOK_SECTIONS.filter((s) => (pb.sections[s.id] ?? '').trim()).length;

  const setSection = (id: string, text: string) =>
    update((prev) => ({ ...prev, sections: { ...prev.sections, [id]: text }, updatedAt: Date.now() }));
  const insert = (id: string, text: string) => {
    const cur = (pb.sections[id] ?? '').trimEnd();
    setSection(id, cur ? `${cur}\n\n${text}` : text);
  };

  // Data-assist suggestions — derived only from the user's own records.
  const suggestions = useMemo(() => {
    const out: Record<string, Suggestion | null> = {};
    const strat =
      strategies.find((s) => s.status === 'active') ??
      [...strategies].sort((a, b) => strategyCompletion(b) - strategyCompletion(a))[0];
    if (strat && strategyCompletion(strat) > 0) {
      const src = strat.status === 'active' ? 'your Active strategy' : 'your most complete strategy draft';
      out.strategy = { label: `From ${src}`, text: strategySummary(strat) };
      const entry = [strat.confirmation, strat.entryTrigger].filter((x) => x.trim()).join('\n');
      if (entry) out.entry = { label: `From ${src}`, text: entry };
      if (strat.stopLoss.trim()) out.stop = { label: `From ${src}`, text: strat.stopLoss.trim() };
      const exit = [strat.target, strat.exitRules, strat.invalidation].filter((x) => x.trim()).join('\n');
      if (exit) out.exit = { label: `From ${src}`, text: exit };
      if (strat.noTrade.trim()) out.notrade = { label: `From ${src}`, text: strat.noTrade.trim() };
    }
    const stats = tradeStats([...backtests, ...sims]);
    const top = stats.bySetup.filter((s) => s.count > 0).slice(0, 3);
    if (top.length) {
      out.best = {
        label: `Top setups from ${stats.closed} closed backtest + simulated trades`,
        text: top
          .map((s) => `• ${s.setup} — ${s.count} trades, ${Math.round(s.winRate * 100)}% win rate, net ${s.netR >= 0 ? '+' : ''}${s.netR}R (practice data)`)
          .join('\n'),
      };
    }
    const ms = mistakeStats(mistakes);
    if (ms.frequency.length) {
      out.mistakes = {
        label: `Most frequent of your ${ms.total} logged mistakes`,
        text: ms.frequency
          .slice(0, 3)
          .map((f) => {
            const prev = mistakes.find((m) => (m.category || m.title) === f.label && m.prevention.trim())?.prevention.trim();
            return `• ${f.label} (${f.count}×)${prev ? ` — prevention: ${prev}` : ''}`;
          })
          .join('\n'),
      };
    }
    return out;
  }, [strategies, backtests, sims, mistakes]);

  const jump = (id: string) => document.getElementById(`pb-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const print = () => {
    setMode('read');
    setTimeout(() => window.print(), 120);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Phase 11 · Playbook"
        title="My Trading Playbook"
        description="Your personal rulebook — written by you, backed by your own data. Every section autosaves."
        actions={
          <>
            <SegControl
              options={[
                { value: 'edit', label: <span className="row gap-4"><PenLine size={14} /> Edit</span> },
                { value: 'read', label: <span className="row gap-4"><BookOpenText size={14} /> Read</span> },
              ]}
              value={mode}
              onChange={setMode}
            />
            <button className="btn" onClick={print}>
              <Printer size={15} /> Print
            </button>
          </>
        }
      />

      <div className="pb-layout">
        <aside className="pb-index no-print">
          <Panel>
            <div className="row" style={{ gap: 16, marginBottom: 14 }}>
              <RingMeter value={completion} size={78} stroke={5} />
              <div className="col" style={{ gap: 2 }}>
                <span className="stat-label">Completion</span>
                <span className="display" style={{ fontSize: 22, fontWeight: 400 }}>
                  <span className="num">{filledCount}</span> <span className="muted">/ 10</span>
                </span>
                <span className="tiny muted">sections</span>
              </div>
            </div>
            <div className="list">
              {PLAYBOOK_SECTIONS.map((s, i) => (
                <button key={s.id} type="button" onClick={() => jump(s.id)}>
                  <span className="n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="ellipsis">{s.title}</span>
                  <span className={cx('dot', (pb.sections[s.id] ?? '').trim() && 'on')} />
                </button>
              ))}
            </div>
            {pb.updatedAt && <div className="tiny dim mt-16">Saved {new Date(pb.updatedAt).toLocaleString()}</div>}
          </Panel>
        </aside>

        {mode === 'read' ? (
          <Panel className="pb-doc">
            <h2>My Trading Playbook</h2>
            <div className="center tiny muted">{pb.updatedAt ? `Last updated ${new Date(pb.updatedAt).toLocaleDateString()}` : 'Not started yet'} · educational use only</div>
            {PLAYBOOK_SECTIONS.map((s, i) => {
              const text = (pb.sections[s.id] ?? '').trim();
              return (
                <section key={s.id} id={`pb-${s.id}`} className="pb-section">
                  <h3>
                    {i + 1}. {s.title}
                  </h3>
                  {text ? <div className="body">{text}</div> : <div className="blank">Not written yet — {s.prompt}</div>}
                </section>
              );
            })}
          </Panel>
        ) : (
          <div className="col gap-16">
            {PLAYBOOK_SECTIONS.map((s, i) => {
              const sug = suggestions[s.id];
              const text = pb.sections[s.id] ?? '';
              return (
                <motion.div key={s.id} id={`pb-${s.id}`} className="pb-section" variants={reveal} initial="hidden" animate="show" custom={i}>
                  <Panel
                    title={
                      <>
                        <span className="pb-num">{String(i + 1).padStart(2, '0')}</span>
                        {s.title}
                      </>
                    }
                    actions={text.trim() ? <span className="badge good">WRITTEN</span> : <span className="badge dim">EMPTY</span>}
                  >
                    <textarea className="textarea" value={text} placeholder={s.prompt} onChange={(e) => setSection(s.id, e.target.value)} rows={4} />
                    {sug && (
                      <div className="pb-suggest">
                        <div className="row between wrap">
                          <span className="row gap-4 cyan small">
                            <Sparkles size={13} /> {sug.label}
                          </span>
                          <button className="btn btn-sm" onClick={() => insert(s.id, sug.text)}>
                            <Plus size={13} /> Insert
                          </button>
                        </div>
                        <pre>{sug.text}</pre>
                      </div>
                    )}
                    {s.id === 'risk' && (
                      <div className="tiny dim mt-8">Write your own limits — risk per trade, max daily loss, max trades, minimum R:R. Nothing here is auto-filled.</div>
                    )}
                  </Panel>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
