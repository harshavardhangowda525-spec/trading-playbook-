import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Copy, FlaskConical, Plus, Trash2, Zap } from 'lucide-react';
import { C, STRATEGY_FIELDS, strategyCompletion, type Strategy } from '../lib/domain';
import { useCollection } from '../lib/hooks';
import { EmptyState, Field, ImageAttach, Modal, PageHeader, Panel, RingMeter, SegControl, cx, reveal } from '../components/ui';
import '../styles/build.css';

const blankStrategy = (): Omit<Strategy, 'id'> => ({
  name: '',
  market: '',
  timeframe: '',
  condition: '',
  setup: '',
  confirmation: '',
  entryTrigger: '',
  stopLoss: '',
  target: '',
  riskReward: '',
  exitRules: '',
  invalidation: '',
  noTrade: '',
  examples: '',
  notes: '',
  images: [],
  status: 'draft',
  updatedAt: Date.now(),
});

const FLOW: { key: keyof Strategy; title: string; hint: string }[] = [
  { key: 'condition', title: 'Market Condition', hint: 'define the market condition' },
  { key: 'setup', title: 'Setup', hint: 'define the setup' },
  { key: 'confirmation', title: 'Confirmation', hint: 'define the confirmation' },
  { key: 'entryTrigger', title: 'Entry', hint: 'define the entry trigger' },
  { key: 'stopLoss', title: 'Stop', hint: 'define the stop-loss' },
  { key: 'target', title: 'Target', hint: 'define the target' },
  { key: 'exitRules', title: 'Exit', hint: 'define the exit rules' },
];

const PLACEHOLDERS: Partial<Record<keyof Strategy, string>> = {
  name: 'e.g. Opening-range pullback',
  market: 'e.g. ES futures, EUR/USD',
  timeframe: 'e.g. 5m entry / 1h bias',
  riskReward: 'e.g. min 1 : 2',
};

const filled = (s: Strategy, k: keyof Strategy) => String(s[k] ?? '').trim().length > 0;

export function StrategyLab() {
  const { items, save, remove, create } = useCollection<Strategy>(C.strategies);
  const [params, setParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmDel, setConfirmDel] = useState<Strategy | null>(null);
  const handledNew = useRef(false);

  const sorted = useMemo(() => [...items].sort((a, b) => b.updatedAt - a.updatedAt), [items]);
  const current = items.find((s) => s.id === selectedId) ?? sorted[0];

  // Dashboard "+ STRATEGY" → ?new=1
  useEffect(() => {
    if (params.get('new') === '1' && !handledNew.current) {
      handledNew.current = true;
      const s = create(blankStrategy());
      setSelectedId(s.id);
      const next = new URLSearchParams(params);
      next.delete('new');
      setParams(next, { replace: true });
    }
  }, [params, setParams, create]);

  const newDraft = () => setSelectedId(create(blankStrategy()).id);
  const duplicate = (s: Strategy) => {
    const { id: _id, ...rest } = s;
    void _id;
    setSelectedId(create({ ...rest, name: `${s.name || 'Untitled'} (copy)`, status: 'draft', updatedAt: Date.now() }).id);
  };
  const patch = (p: Partial<Strategy>) => current && save({ ...current, ...p, updatedAt: Date.now() });

  const activeCount = items.filter((s) => s.status === 'active').length;

  return (
    <div>
      <PageHeader
        eyebrow="Phase 07 · Strategy Lab"
        title="Strategy Lab"
        description="Design your strategies rule by rule. Every field you define lights up the flow — a complete strategy has no dark nodes."
        actions={
          <button className="btn btn-primary" onClick={newDraft}>
            <Plus size={16} /> New strategy
          </button>
        }
      />

      {items.length === 0 ? (
        <Panel>
          <EmptyState
            icon={<FlaskConical size={34} />}
            title="No strategies yet"
            text="Create your first strategy draft and define it step by step: market condition, setup, confirmation, entry, stop, target and exit."
            action={
              <button className="btn btn-primary" onClick={newDraft}>
                <Plus size={16} /> Create first strategy
              </button>
            }
          />
        </Panel>
      ) : (
        <>
          <Panel title="Drafts" sub={`${items.length} total · ${activeCount} active`} className="mb-16">
            <div className="strat-drafts">
              {sorted.map((s, i) => (
                <motion.button
                  key={s.id}
                  type="button"
                  className={cx('strat-card', current?.id === s.id && 'on')}
                  onClick={() => setSelectedId(s.id)}
                  variants={reveal}
                  initial="hidden"
                  animate="show"
                  custom={i}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RingMeter value={strategyCompletion(s)} size={46} stroke={3} ticks={false} />
                  <div className="col" style={{ gap: 3, minWidth: 0 }}>
                    <span className="name">{s.name || 'Untitled strategy'}</span>
                    <span className="row gap-4">
                      <span className={cx('badge', s.status === 'active' ? 'good' : 'dim')}>{s.status === 'active' ? 'ACTIVE' : 'DRAFT'}</span>
                      {s.timeframe && <span className="tiny muted ellipsis">{s.timeframe}</span>}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </Panel>

          {current && (
            <div className="strat-layout">
              <Panel
                hud
                title={current.name || 'Untitled strategy'}
                sub={`${Math.round(strategyCompletion(current) * 100)}% defined`}
                actions={
                  <>
                    <SegControl
                      options={[
                        { value: 'draft', label: 'Draft' },
                        { value: 'active', label: 'Active' },
                      ]}
                      value={current.status}
                      onChange={(v) => patch({ status: v })}
                    />
                    <button className="icon-btn" onClick={() => duplicate(current)} aria-label="Duplicate strategy" title="Duplicate">
                      <Copy size={15} />
                    </button>
                    <button className="icon-btn danger" onClick={() => setConfirmDel(current)} aria-label="Delete strategy" title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </>
                }
              >
                <div className="strat-fields">
                  {STRATEGY_FIELDS.map((f) => (
                    <Field key={f.key} label={f.label} className={f.long ? 'long' : undefined}>
                      {f.long ? (
                        <textarea
                          className="textarea"
                          value={String(current[f.key] ?? '')}
                          onChange={(e) => patch({ [f.key]: e.target.value } as Partial<Strategy>)}
                          placeholder={`Define ${f.label.toLowerCase()}…`}
                        />
                      ) : (
                        <input
                          className="input"
                          value={String(current[f.key] ?? '')}
                          onChange={(e) => patch({ [f.key]: e.target.value } as Partial<Strategy>)}
                          placeholder={PLACEHOLDERS[f.key] ?? ''}
                        />
                      )}
                    </Field>
                  ))}
                  <div className="long field">
                    <span className="label">
                      Example charts <span className="hint">drop, browse or paste</span>
                    </span>
                    <ImageAttach images={current.images ?? []} onChange={(images) => patch({ images })} label="Add example" />
                  </div>
                </div>
                <div className="tiny dim mt-16">Autosaved · last edit {new Date(current.updatedAt).toLocaleString()}</div>
              </Panel>

              <div className="strat-flow-wrap">
                <Panel title="Strategy flow" sub="visual" glow>
                  <StrategyFlow s={current} />
                </Panel>
              </div>
            </div>
          )}
        </>
      )}

      <Modal
        open={!!confirmDel}
        onClose={() => setConfirmDel(null)}
        title="Delete strategy?"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setConfirmDel(null)}>
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                if (confirmDel) remove(confirmDel.id);
                if (confirmDel?.id === selectedId) setSelectedId(null);
                setConfirmDel(null);
              }}
            >
              <Trash2 size={15} /> Delete
            </button>
          </>
        }
      >
        <p className="muted">
          “{confirmDel?.name || 'Untitled strategy'}” and its example charts will be permanently removed. This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

function StrategyFlow({ s }: { s: Strategy }) {
  const reduce = useReducedMotion();
  const done = FLOW.filter((n) => filled(s, n.key)).length;
  return (
    <div>
      <div className="row between mb-16">
        <span className="stat-label">Nodes online</span>
        <span className="mono cyan">
          {done} / {FLOW.length}
        </span>
      </div>
      <div className="flow" aria-label="Strategy flow">
        {FLOW.map((n, i) => {
          const on = filled(s, n.key);
          const nextOn = i < FLOW.length - 1 && on && filled(s, FLOW[i + 1].key);
          return (
            <div key={n.key}>
              <motion.div
                className={cx('flow-node', on && 'on')}
                initial={reduce ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: reduce ? 0 : i * 0.07, duration: 0.4 }}
              >
                <span className="idx">{on ? <Zap size={14} /> : String(i + 1).padStart(2, '0')}</span>
                <div style={{ minWidth: 0 }}>
                  <div className="ttl">{n.title}</div>
                  <div className="txt">{on ? String(s[n.key]) : <span className="hint">{n.hint}…</span>}</div>
                </div>
              </motion.div>
              {i < FLOW.length - 1 && <div className={cx('flow-link', nextOn && 'on')} style={{ ['--d' as string]: `${i * 0.22}s` }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
