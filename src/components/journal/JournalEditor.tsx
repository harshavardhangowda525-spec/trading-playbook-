// Full-screen focused editor for one Trading Journal entry (educational / simulated only).

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, ImagePlus, Maximize2, RefreshCw, Trash2, X } from 'lucide-react';
import {
  CHECKS,
  CONDITIONS,
  JOURNAL_COLLECTION,
  MINDSETS,
  MISTAKES,
  RESULTS,
  SESSIONS,
  TIMEFRAMES,
  blankEntry,
  improvementFor,
  plannedRR,
  ruleScore,
  simulatedR,
  type JournalTradeEntry,
  type MistakeKey,
} from '../../lib/journal';
import { useCollection } from '../../lib/hooks';
import { newId } from '../../lib/store';
import { C, type Strategy } from '../../lib/domain';
import { formatLong, todayKey } from '../../lib/dates';
import { pulseCore } from '../../lib/events';
import { fileToDataUrl } from '../../lib/images';
import { HoloCheck, NumberInput, RingMeter, SegControl, Slider, cx } from '../ui';
import '../../styles/journal-editor.css';

const EASE = [0.22, 1, 0.36, 1] as const;

const SECTIONS = [
  { id: 'basic', label: 'Basic' },
  { id: 'setup', label: 'Setup' },
  { id: 'analysis', label: 'Analysis' },
  { id: 'chart', label: 'Chart' },
  { id: 'execution', label: 'Execution' },
  { id: 'mindset', label: 'Mindset' },
  { id: 'mistakes', label: 'Mistakes' },
  { id: 'result', label: 'Result' },
  { id: 'improve', label: '1%' },
] as const;
type SectionId = (typeof SECTIONS)[number]['id'];

const ANALYSIS = [
  { key: 'why', prompt: 'Why did I consider this setup?' },
  { key: 'confirmed', prompt: 'What confirmed the setup?' },
  { key: 'structure', prompt: 'What was the market structure?' },
  { key: 'context', prompt: 'What indicators/context did I study?' },
  { key: 'expected', prompt: 'What was my expected outcome?' },
  { key: 'invalidation', prompt: 'What would invalidate the setup?' },
] as const;

const RESULT_TEXT = [
  { key: 'happened', prompt: 'What happened?' },
  { key: 'learned', prompt: 'What did I learn?' },
  { key: 'improve', prompt: 'What will I improve next time?' },
] as const;

const RESULT_NOTES: Record<string, string> = {
  success: 'The simulation reached its plan.',
  fail: 'The simulation hit its invalidation.',
  breakeven: 'Closed flat — neither target nor stop.',
  notrade: 'No valid setup — staying out is a decision.',
};

function fmt(n: number | null, d = 2): string {
  if (n == null || !Number.isFinite(n)) return '—';
  return String(Number(n.toFixed(d)));
}

function uniq(values: string[]): string[] {
  const seen = new Map<string, string>();
  for (const v of values) {
    const t = v.trim();
    if (t && !seen.has(t.toLowerCase())) seen.set(t.toLowerCase(), t);
  }
  return [...seen.values()];
}

export function JournalEditor(props: {
  editing?: JournalTradeEntry;
  base?: Partial<JournalTradeEntry>;
  onClose: () => void;
  onSaved: (entry: JournalTradeEntry) => void;
}): React.JSX.Element {
  const { editing, base, onClose, onSaved } = props;
  const reduce = useReducedMotion();
  const { items: entries, save } = useCollection<JournalTradeEntry>(JOURNAL_COLLECTION);
  const { items: strategies } = useCollection<Strategy>(C.strategies);

  const [initial] = useState<JournalTradeEntry>(() => {
    if (editing) return { ...blankEntry(editing.date || todayKey()), ...editing };
    const now = Date.now();
    return {
      ...blankEntry(todayKey()),
      ...base,
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : newId(),
      createdAt: now,
      updatedAt: now,
    } as JournalTradeEntry;
  });
  const [draft, setDraft] = useState<JournalTradeEntry>(initial);
  const set = useCallback(<K extends keyof JournalTradeEntry>(k: K, v: JournalTradeEntry[K]) => setDraft((d) => ({ ...d, [k]: v })), []);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(initial), [draft, initial]);
  const [confirming, setConfirming] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  // ─── derived ────────────────────────────────────────────────────────────
  const markets = useMemo(() => uniq(entries.map((e) => e.market ?? '')), [entries]);
  const setups = useMemo(() => uniq(entries.map((e) => e.setup ?? '')), [entries]);
  const rr = plannedRR(draft);
  const simR = simulatedR(draft);
  const riskUnit = draft.entry != null && draft.stop != null ? Math.abs(draft.entry - draft.stop) : null;
  const score = ruleScore(draft);
  const improvement = improvementFor(draft);
  const isNoTrade = draft.result === 'notrade';
  const missing: string[] = [];
  if (!draft.market.trim()) missing.push('Market / Instrument');
  if (!isNoTrade && !draft.setup.trim()) missing.push('Setup name');
  const canSave = missing.length === 0;

  // ─── close / save ───────────────────────────────────────────────────────
  const requestClose = useCallback(() => {
    if (dirty) setConfirming(true);
    else onClose();
  }, [dirty, onClose]);

  const doSave = () => {
    if (!canSave) return;
    const entry: JournalTradeEntry = {
      ...draft,
      market: draft.market.trim(),
      setup: draft.setup.trim(),
      otherMistake: draft.mistakes.includes('other') ? draft.otherMistake : '',
      updatedAt: Date.now(),
    };
    save(entry);
    pulseCore();
    onSaved(entry);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      if (lightbox) setLightbox(false);
      else if (confirming) setConfirming(false);
      else requestClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, confirming, requestClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // ─── section index ──────────────────────────────────────────────────────
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<SectionId>('basic');
  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (list) => {
        const vis = list.filter((x) => x.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id.replace('je-', '') as SectionId);
      },
      { root, rootMargin: '-20% 0px -65% 0px' },
    );
    root.querySelectorAll('.je-section').forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  const goTo = (id: SectionId) => {
    const root = scroller.current;
    const el = root?.querySelector<HTMLElement>(`#je-${id}`);
    if (!root || !el) return;
    root.scrollTo({ top: el.offsetTop - 70, behavior: reduce ? 'auto' : 'smooth' });
    setActive(id);
  };

  // ─── image ──────────────────────────────────────────────────────────────
  const fileInput = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const addImage = useCallback(
    async (files: FileList | File[] | null | undefined) => {
      const file = files ? Array.from(files).find((f) => f.type.startsWith('image/')) : undefined;
      if (!file) return;
      setBusy(true);
      try {
        const url = await fileToDataUrl(file);
        set('image', url);
      } finally {
        setBusy(false);
      }
    },
    [set],
  );
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const files = Array.from(e.clipboardData?.files ?? []).filter((f) => f.type.startsWith('image/'));
      if (!files.length) return;
      e.preventDefault();
      void addImage(files);
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [addImage]);

  const toggleMistake = (k: MistakeKey) =>
    set('mistakes', draft.mistakes.includes(k) ? draft.mistakes.filter((m) => m !== k) : [...draft.mistakes, k]);

  const strategyExists = !draft.strategyId || strategies.some((s) => s.id === draft.strategyId);
  const timeframeIsPreset = TIMEFRAMES.includes(draft.timeframe);

  const sectionMotion = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay: 0.12 + i * 0.05, ease: EASE },
        };

  // Plain render helper (called as a function, not a component) so inputs keep focus across renders.
  const S = ({ id, n, title, sub, children, i }: { id: SectionId; n: number; title: string; sub?: ReactNode; children: ReactNode; i: number }) => (
    <motion.section id={`je-${id}`} className="je-section glass" {...sectionMotion(i)}>
      <header className="je-sec-head">
        <span className="je-sec-n">{String(n).padStart(2, '0')}</span>
        <div>
          <h2 className="je-sec-title">{title}</h2>
          {sub && <p className="je-sec-sub">{sub}</p>}
        </div>
      </header>
      {children}
    </motion.section>
  );

  return createPortal(
    <motion.div
      className="je-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={editing ? 'Edit Journal Entry' : 'New Journal Entry'}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <div className="je-scroll" ref={scroller}>
        <motion.div
          className="je-column"
          initial={reduce ? false : { opacity: 0, y: 24, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {/* Header */}
          <header className="je-head">
            <div className="je-head-main">
              <div className="je-mono-label">
                <i className="je-dot" /> SIMULATION / EDUCATIONAL MODE
              </div>
              <h1 className="je-title">{editing ? 'Edit Journal Entry' : 'New Journal Entry'}</h1>
              <div className="je-date">{draft.date ? formatLong(draft.date) : '—'}</div>
            </div>
            <button type="button" className="icon-btn je-close" onClick={requestClose} aria-label="Close editor">
              <X size={18} />
            </button>
          </header>

          {/* Sticky index */}
          <nav className="je-index" aria-label="Sections">
            {SECTIONS.map((s) => (
              <button key={s.id} type="button" className={cx('je-index-item', active === s.id && 'on')} onClick={() => goTo(s.id)}>
                {s.label}
              </button>
            ))}
          </nav>

          {/* 1. BASIC */}
          {S({
            id: 'basic',
            n: 1,
            i: 0,
            title: 'Basic Information',
            children: (
              <div className="je-grid">
                <label className="field">
                  <span className="label">Date</span>
                  <input className="input" type="date" value={draft.date} onChange={(e) => set('date', e.target.value)} />
                </label>
                <div className="field">
                  <span className="label">Session</span>
                  <div className="je-seg-wrap">
                    <SegControl options={SESSIONS.map((s) => ({ value: s, label: s }))} value={draft.session} onChange={(v) => set('session', v)} />
                  </div>
                </div>
                <label className="field">
                  <span className="label">
                    Market / Instrument {!draft.market.trim() && <span className="je-req">required</span>}
                  </span>
                  <input className="input" list="je-markets" placeholder="e.g. EURUSD, NQ, AAPL" value={draft.market} onChange={(e) => set('market', e.target.value)} />
                  <datalist id="je-markets">
                    {markets.map((m) => (
                      <option key={m} value={m} />
                    ))}
                  </datalist>
                </label>
                <label className="field">
                  <span className="label">Strategy used</span>
                  <select className="select" value={draft.strategyId} onChange={(e) => set('strategyId', e.target.value)}>
                    <option value="">None</option>
                    {strategies.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name || 'Untitled strategy'}
                      </option>
                    ))}
                    {!strategyExists && <option value={draft.strategyId}>Deleted strategy</option>}
                  </select>
                  {strategies.length === 0 && (
                    <Link
                      to="/strategy-lab"
                      className="je-link"
                      onClick={(e) => {
                        if (dirty && !window.confirm('Leave the editor? Unsaved changes will be lost.')) e.preventDefault();
                        else onClose();
                      }}
                    >
                      No strategies yet — Create one in Strategy Lab →
                    </Link>
                  )}
                </label>
                <div className="field je-span">
                  <span className="label">Timeframe</span>
                  <div className="je-chips">
                    {TIMEFRAMES.map((t) => (
                      <motion.button key={t} type="button" whileTap={{ scale: 0.95 }} className={cx('chip', draft.timeframe === t && 'on')} onClick={() => set('timeframe', t)}>
                        {t}
                      </motion.button>
                    ))}
                    <input
                      className="input je-tf-input"
                      placeholder="Other…"
                      value={timeframeIsPreset ? '' : draft.timeframe}
                      onChange={(e) => set('timeframe', e.target.value)}
                      aria-label="Custom timeframe"
                    />
                  </div>
                </div>
                <div className="field je-span">
                  <span className="label">Market condition</span>
                  <div className="je-chips">
                    {CONDITIONS.map((c) => (
                      <motion.button
                        key={c}
                        type="button"
                        whileTap={{ scale: 0.95 }}
                        className={cx('chip', draft.condition === c && 'on')}
                        onClick={() => set('condition', draft.condition === c ? '' : c)}
                      >
                        {c}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            ),
          })}

          {/* 2. SETUP */}
          {S({
            id: 'setup',
            n: 2,
            i: 1,
            title: 'Setup',
            children: (
              <>
                <div className="je-grid">
                  <label className="field">
                    <span className="label">
                      Setup name {!isNoTrade && !draft.setup.trim() && <span className="je-req">required</span>}
                    </span>
                    <input className="input" list="je-setups" placeholder="e.g. Break & retest" value={draft.setup} onChange={(e) => set('setup', e.target.value)} />
                    <datalist id="je-setups">
                      {setups.map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                  </label>
                  <div className="field">
                    <span className="label">Direction</span>
                    <div className="je-seg-wrap">
                      <SegControl
                        options={[
                          { value: 'long', label: 'Long' },
                          { value: 'short', label: 'Short' },
                        ]}
                        value={draft.direction}
                        onChange={(v) => set('direction', v)}
                      />
                    </div>
                  </div>
                </div>
                <div className="je-grid je-grid-prices">
                  <label className="field">
                    <span className="label">Entry price</span>
                    <NumberInput value={draft.entry} onChange={(v) => set('entry', v)} placeholder="0.00" />
                  </label>
                  <label className="field">
                    <span className="label">Stop loss</span>
                    <NumberInput value={draft.stop} onChange={(v) => set('stop', v)} placeholder="0.00" />
                  </label>
                  <label className="field">
                    <span className="label">Target</span>
                    <NumberInput value={draft.target} onChange={(v) => set('target', v)} placeholder="0.00" />
                  </label>
                  <label className="field">
                    <span className="label">Simulated exit</span>
                    <NumberInput value={draft.exit} onChange={(v) => set('exit', v)} placeholder="0.00" />
                  </label>
                  <label className="field">
                    <span className="label">
                      Position size <span className="hint">educational</span>
                    </span>
                    <NumberInput value={draft.size} onChange={(v) => set('size', v)} placeholder="optional" />
                  </label>
                </div>
                <div className="je-metrics">
                  <div className="je-metric">
                    <span className="je-mono-label">Planned R:R</span>
                    <span className="je-metric-v">{rr == null ? '—' : `1 : ${fmt(rr)}`}</span>
                  </div>
                  <div className="je-metric">
                    <span className="je-mono-label">Simulated result</span>
                    <span className={cx('je-metric-v', simR != null && (simR > 0 ? 'good' : simR < 0 ? 'bad' : ''))}>
                      {simR == null ? '—' : `${simR > 0 ? '+' : ''}${fmt(simR)}R`}
                    </span>
                  </div>
                  <div className="je-metric">
                    <span className="je-mono-label">Risk per unit</span>
                    <span className="je-metric-v">{fmt(riskUnit, 5)}</span>
                    {riskUnit != null && draft.size != null && <span className="je-metric-note">× {fmt(draft.size)} = {fmt(riskUnit * draft.size)} simulated</span>}
                  </div>
                </div>
              </>
            ),
          })}

          {/* 3. ANALYSIS */}
          {S({
            id: 'analysis',
            n: 3,
            i: 2,
            title: 'Setup Analysis',
            sub: 'Think it through in your own words.',
            children: (
              <div className="je-stack">
                {ANALYSIS.map((a) => (
                  <label key={a.key} className="field">
                    <span className="je-prompt">{a.prompt}</span>
                    <textarea className="textarea je-textarea" rows={3} value={draft[a.key]} onChange={(e) => set(a.key, e.target.value)} />
                  </label>
                ))}
              </div>
            ),
          })}

          {/* 4. CHART */}
          {S({
            id: 'chart',
            n: 4,
            i: 3,
            title: 'Chart',
            sub: 'One screenshot of the setup. Paste, drop or browse.',
            children: (
              <div className="je-stack">
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    void addImage(e.target.files);
                    e.target.value = '';
                  }}
                />
                <AnimatePresence mode="wait" initial={false}>
                  {draft.image ? (
                    <motion.div
                      key={draft.image.slice(-32)}
                      className="je-preview"
                      initial={reduce ? false : { opacity: 0, filter: 'blur(14px)', scale: 0.985 }}
                      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                      exit={reduce ? undefined : { opacity: 0, filter: 'blur(8px)' }}
                      transition={{ duration: 0.7, ease: EASE }}
                    >
                      <button type="button" className="je-preview-img" onClick={() => setLightbox(true)} aria-label="Zoom chart">
                        <img src={draft.image} alt="Chart screenshot" />
                      </button>
                      <div className="je-preview-actions">
                        <button type="button" className="btn btn-sm" onClick={() => fileInput.current?.click()}>
                          <RefreshCw size={13} /> Replace
                        </button>
                        <button type="button" className="btn btn-sm" onClick={() => set('image', null)}>
                          <Trash2 size={13} /> Remove
                        </button>
                        <button type="button" className="btn btn-sm" onClick={() => setLightbox(true)}>
                          <Maximize2 size={13} /> Zoom
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="drop"
                      type="button"
                      className={cx('je-drop', drag && 'drag')}
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => fileInput.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDrag(true);
                      }}
                      onDragLeave={() => setDrag(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDrag(false);
                        void addImage(e.dataTransfer.files);
                      }}
                    >
                      <ImagePlus size={22} strokeWidth={1.4} />
                      <span className="je-drop-title">{busy ? 'PROCESSING…' : 'DROP CHART SCREENSHOT HERE'}</span>
                      <span className="je-drop-sub">or click to browse · paste with ⌘V / Ctrl+V</span>
                    </motion.button>
                  )}
                </AnimatePresence>
                <label className="field">
                  <span className="label">Chart notes</span>
                  <textarea className="textarea je-textarea" rows={3} value={draft.imageNotes} onChange={(e) => set('imageNotes', e.target.value)} placeholder="Levels, structure, what the chart shows…" />
                </label>
              </div>
            ),
          })}

          {/* 5. EXECUTION */}
          {S({
            id: 'execution',
            n: 5,
            i: 4,
            title: 'Execution Review',
            children: (
              <div className="je-exec">
                <div className="je-checks">
                  {CHECKS.map((c) => {
                    const on = !!draft.checks[c.key];
                    const toggle = () => set('checks', { ...draft.checks, [c.key]: !on });
                    return (
                      <motion.div
                        key={c.key}
                        className={cx('je-check', on && 'on')}
                        whileTap={reduce ? undefined : { scale: 0.985 }}
                        onClick={toggle}
                        role="presentation"
                      >
                        <HoloCheck size="lg" checked={on} onChange={toggle} label={c.label} />
                        <span>{c.label}</span>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="je-score">
                  <RingMeter value={score} size={112} stroke={3} />
                  <span className="je-mono-label center">Rule-following</span>
                </div>
              </div>
            ),
          })}

          {/* 6. MINDSET */}
          {S({
            id: 'mindset',
            n: 6,
            i: 5,
            title: 'Mindset Check',
            sub: 'A personal reflection — not a diagnosis.',
            children: (
              <div className="je-stack">
                <div className="je-chips">
                  {MINDSETS.map((m) => (
                    <motion.button
                      key={m}
                      type="button"
                      whileTap={{ scale: 0.95 }}
                      className={cx('chip je-chip-lg', draft.mindset === m && 'on')}
                      onClick={() => set('mindset', draft.mindset === m ? '' : m)}
                    >
                      {m}
                    </motion.button>
                  ))}
                </div>
                <div className="je-grid je-grid-3">
                  <Slider label="Confidence before analysis" value={draft.confidence} onChange={(v) => set('confidence', v)} />
                  <Slider label="Discipline" value={draft.discipline} onChange={(v) => set('discipline', v)} />
                  <Slider label="Focus" value={draft.focus} onChange={(v) => set('focus', v)} />
                </div>
              </div>
            ),
          })}

          {/* 7. MISTAKES */}
          {S({
            id: 'mistakes',
            n: 7,
            i: 6,
            title: 'Mistakes',
            sub: 'Selections build your Mistake Database automatically.',
            children: (
              <div className="je-stack">
                <div className="je-chips">
                  {MISTAKES.map((m) => {
                    const on = draft.mistakes.includes(m.key);
                    return (
                      <motion.button key={m.key} type="button" whileTap={{ scale: 0.95 }} className={cx('chip', on && 'on')} aria-pressed={on} onClick={() => toggleMistake(m.key)}>
                        {on && <Check size={12} />}
                        {m.label}
                      </motion.button>
                    );
                  })}
                </div>
                <AnimatePresence initial={false}>
                  {draft.mistakes.includes('other') && (
                    <motion.label
                      className="field"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      style={{ overflow: 'hidden' }}
                    >
                      <span className="label">Describe the other mistake</span>
                      <input className="input" value={draft.otherMistake} onChange={(e) => set('otherMistake', e.target.value)} placeholder="What went wrong?" />
                    </motion.label>
                  )}
                </AnimatePresence>
              </div>
            ),
          })}

          {/* 8. RESULT */}
          {S({
            id: 'result',
            n: 8,
            i: 7,
            title: 'Result',
            children: (
              <div className="je-stack">
                <div className="je-results">
                  {RESULTS.map((r) => {
                    const on = draft.result === r.key;
                    return (
                      <motion.button
                        key={r.key}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        className={cx('je-result', `r-${r.key}`, on && 'on')}
                        aria-pressed={on}
                        onClick={() => set('result', on ? '' : r.key)}
                      >
                        <span className="je-result-dot" />
                        <span className="je-result-label">{r.label}</span>
                        <span className="je-result-note">{RESULT_NOTES[r.key]}</span>
                      </motion.button>
                    );
                  })}
                </div>
                {RESULT_TEXT.map((t) => (
                  <label key={t.key} className="field">
                    <span className="je-prompt">{t.prompt}</span>
                    <textarea className="textarea je-textarea" rows={3} value={draft[t.key]} onChange={(e) => set(t.key, e.target.value)} />
                  </label>
                ))}
              </div>
            ),
          })}

          {/* 9. 1% */}
          {S({
            id: 'improve',
            n: 9,
            i: 8,
            title: 'Today’s 1% Improvement',
            sub: 'Generated live from your mistakes, execution review and reflection.',
            children: (
              <div className="je-improve">
                <div>
                  <span className="je-mono-label">Your main improvement today:</span>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={improvement.lesson}
                      className="je-lesson"
                      initial={reduce ? false : { opacity: 0, y: 6, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={reduce ? undefined : { opacity: 0, y: -4 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      “{improvement.lesson}”
                    </motion.p>
                  </AnimatePresence>
                </div>
                <div className="je-focus">
                  <span className="je-mono-label">Tomorrow’s Focus</span>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={improvement.focus}
                      className="je-focus-text"
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={reduce ? undefined : { opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {improvement.focus}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            ),
          })}
          <div className="je-bottom-space" />
        </motion.div>
      </div>

      {/* Sticky footer */}
      <footer className="je-footer">
        <div className="je-footer-inner">
          <span className={cx('je-missing', canSave && 'ok')}>
            {canSave ? (dirty ? 'Unsaved changes' : editing ? 'No changes' : 'Ready to save') : `Missing: ${missing.join(' · ')}`}
          </span>
          <div className="je-footer-actions">
            <button type="button" className="btn btn-ghost" onClick={requestClose}>
              Cancel
            </button>
            <motion.button
              type="button"
              className="btn btn-primary"
              disabled={!canSave}
              whileTap={canSave && !reduce ? { scale: 0.98 } : undefined}
              onClick={doSave}
              title={canSave ? undefined : `Missing: ${missing.join(', ')}`}
            >
              Save entry
            </motion.button>
          </div>
        </div>
      </footer>

      {/* Discard confirmation */}
      <AnimatePresence>
        {confirming && (
          <motion.div className="je-confirm-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setConfirming(false)}>
            <motion.div
              className="glass pad-lg je-confirm"
              role="alertdialog"
              aria-modal="true"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.3, ease: EASE }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <span className="je-mono-label">Unsaved changes</span>
              <h3 className="je-confirm-title">Discard this entry’s changes?</h3>
              <p className="muted small">Your edits will be lost. This cannot be undone.</p>
              <div className="je-confirm-actions">
                <button type="button" className="btn" autoFocus onClick={() => setConfirming(false)}>
                  Keep editing
                </button>
                <button type="button" className="btn btn-danger" onClick={onClose}>
                  Discard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>{lightbox && draft.image && <ChartLightbox src={draft.image} onClose={() => setLightbox(false)} />}</AnimatePresence>
    </motion.div>,
    document.body,
  );
}

function ChartLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  const [zoom, setZoom] = useState(1);
  const box = useRef<HTMLDivElement>(null);
  const toggle = (e: React.MouseEvent<HTMLImageElement>) => {
    e.stopPropagation();
    const el = box.current;
    if (zoom === 1 && el) {
      const rect = e.currentTarget.getBoundingClientRect();
      const fx = (e.clientX - rect.left) / rect.width;
      const fy = (e.clientY - rect.top) / rect.height;
      setZoom(2);
      requestAnimationFrame(() => {
        el.scrollLeft = fx * el.scrollWidth - el.clientWidth / 2;
        el.scrollTop = fy * el.scrollHeight - el.clientHeight / 2;
      });
    } else setZoom(1);
  };
  return (
    <motion.div className="je-lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={onClose}>
      <div className="je-lightbox-bar" onClick={(e) => e.stopPropagation()}>
        <span className="je-mono-label">{zoom === 1 ? 'Click image to zoom 2×' : '2× · scroll to pan · click to reset'}</span>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close preview">
          <X size={16} />
        </button>
      </div>
      <div ref={box} className={cx('je-lightbox-stage', zoom === 2 && 'zoomed')}>
        <motion.img
          src={src}
          alt="Chart screenshot, enlarged"
          onClick={toggle}
          initial={{ opacity: 0, scale: 0.97, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, ease: EASE }}
          style={zoom === 2 ? { width: '200%', maxWidth: 'none', maxHeight: 'none', cursor: 'zoom-out' } : { cursor: 'zoom-in' }}
        />
      </div>
    </motion.div>
  );
}
