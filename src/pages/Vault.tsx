import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Library, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { C, NOTE_CATEGORIES, type Note } from '../lib/domain';
import { useCollection, useToday } from '../lib/hooks';
import { formatLong } from '../lib/dates';
import { EmptyState, Field, Modal, PageHeader, Panel, cx } from '../components/ui';
import '../styles/build.css';

type Sort = 'newest' | 'importance' | 'title';
type Draft = Omit<Note, 'id'> & { id?: string };

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Wraps every occurrence of `q` in a glowing <mark>. */
function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escapeRe(q)})`, 'gi'));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === q.toLowerCase() ? (
          <mark key={i} className="hl">
            {p}
          </mark>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

/** Content excerpt centred on the first search hit. */
function excerpt(content: string, q: string): string {
  if (!q) return content;
  const i = content.toLowerCase().indexOf(q.toLowerCase());
  if (i < 80) return content;
  return '…' + content.slice(i - 60);
}

function Pips({ value, onChange, big }: { value: number; onChange?: (v: number) => void; big?: boolean }) {
  return (
    <span className={cx('pips', big && 'big')} role={onChange ? 'radiogroup' : undefined} aria-label={`Importance ${value} of 5`}>
      {[1, 2, 3, 4, 5].map((n) =>
        onChange ? (
          <button key={n} type="button" className={cx('pip', n <= value && 'on')} onClick={() => onChange(n)} aria-label={`Importance ${n}`} role="radio" aria-checked={n === value} />
        ) : (
          <i key={n} className={cx('pip', n <= value && 'on')} />
        ),
      )}
    </span>
  );
}

export function Vault() {
  const { items, save, remove, create } = useCollection<Note>(C.notes);
  const today = useToday();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<string | null>(null);
  const [minImp, setMinImp] = useState(0);
  const [sort, setSort] = useState<Sort>('newest');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [confirmDel, setConfirmDel] = useState<Note | null>(null);
  const handledNew = useRef(false);

  const blank = (): Draft => ({ title: '', category: cat ?? NOTE_CATEGORIES[0], content: '', tags: [], date: today, importance: 3 });

  useEffect(() => {
    if (params.get('new') === '1' && !handledNew.current) {
      handledNew.current = true;
      setDraft({ title: '', category: NOTE_CATEGORIES[0], content: '', tags: [], date: today, importance: 3 });
      const next = new URLSearchParams(params);
      next.delete('new');
      setParams(next, { replace: true });
    }
  }, [params, setParams, today]);

  const query = q.trim();
  const matches = useMemo(() => {
    const ql = query.toLowerCase();
    return items.filter(
      (n) =>
        !ql ||
        n.title.toLowerCase().includes(ql) ||
        n.content.toLowerCase().includes(ql) ||
        n.tags.some((t) => t.toLowerCase().includes(ql)),
    );
  }, [items, query]);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const n of matches) if (n.importance >= minImp) m.set(n.category, (m.get(n.category) ?? 0) + 1);
    return m;
  }, [matches, minImp]);

  const shown = useMemo(() => {
    const list = matches.filter((n) => (!cat || n.category === cat) && n.importance >= minImp);
    return list.sort((a, b) =>
      sort === 'importance'
        ? b.importance - a.importance || b.date.localeCompare(a.date)
        : sort === 'title'
          ? a.title.localeCompare(b.title)
          : b.date.localeCompare(a.date) || a.title.localeCompare(b.title),
    );
  }, [matches, cat, minImp, sort]);

  const commit = () => {
    if (!draft) return;
    const clean = { ...draft, title: draft.title.trim() || 'Untitled note' };
    if (clean.id) save(clean as Note);
    else create(clean);
    setDraft(null);
  };

  const totalMatching = [...counts.values()].reduce((a, b) => a + b, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Knowledge Vault"
        title="Knowledge Vault"
        description="Your personal trading knowledge base — concepts, patterns, observations and lessons in your own words."
        actions={
          <button className="btn btn-primary" onClick={() => setDraft(blank())}>
            <Plus size={16} /> New note
          </button>
        }
      />

      <Panel className="mb-16">
        <div className="col gap-16">
          <div className="row wrap" style={{ gap: 12 }}>
            <div className="input-icon grow" style={{ minWidth: 220 }}>
              <Search size={15} />
              <input className="input" placeholder="Search title, content or tags…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search notes" />
            </div>
            <select className="select" style={{ width: 'auto' }} value={minImp} onChange={(e) => setMinImp(Number(e.target.value))} aria-label="Minimum importance">
              <option value={0}>Any importance</option>
              {[2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  Importance ≥ {n}
                </option>
              ))}
            </select>
            <select className="select" style={{ width: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort notes">
              <option value="newest">Newest first</option>
              <option value="importance">Most important</option>
              <option value="title">Title A–Z</option>
            </select>
          </div>
          <div className="row wrap" style={{ gap: 6 }}>
            <button className={cx('chip', !cat && 'on')} onClick={() => setCat(null)}>
              All <span className="mono tiny">{totalMatching}</span>
            </button>
            {NOTE_CATEGORIES.map((c) => (
              <button key={c} className={cx('chip', cat === c && 'on')} onClick={() => setCat(cat === c ? null : c)}>
                {c} <span className="mono tiny">{counts.get(c) ?? 0}</span>
              </button>
            ))}
          </div>
        </div>
      </Panel>

      {items.length === 0 ? (
        <Panel>
          <EmptyState
            icon={<Library size={34} />}
            title="Your vault is empty"
            text="Capture what you learn — a concept, an indicator, a candlestick pattern, an observation from today's chart."
            action={
              <button className="btn btn-primary" onClick={() => setDraft(blank())}>
                <Plus size={16} /> Write first note
              </button>
            }
          />
        </Panel>
      ) : shown.length === 0 ? (
        <Panel>
          <EmptyState icon={<Search size={30} />} title="No matching notes" text="Try a different search term or clear the filters." />
        </Panel>
      ) : (
        <motion.div className="vault-grid" layout>
          <AnimatePresence initial={false}>
            {shown.map((n) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
              >
                <Panel className="note-card" onClick={() => setDraft({ ...n })}>
                  <div className="row between">
                    <span className="tag">{n.category}</span>
                    <Pips value={n.importance} />
                  </div>
                  <h4>
                    <Highlight text={n.title} q={query} />
                  </h4>
                  <div className="content">
                    <Highlight text={excerpt(n.content, query)} q={query} />
                  </div>
                  {n.tags.length > 0 && (
                    <div className="row wrap" style={{ gap: 4 }}>
                      {n.tags.map((t) => (
                        <span key={t} className="tag">
                          #<Highlight text={t} q={query} />
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="row between">
                    <span className="tiny muted mono">{n.date ? formatLong(n.date) : ''}</span>
                    <span className="row gap-4">
                      <button className="icon-btn" aria-label="Edit note" onClick={(e) => (e.stopPropagation(), setDraft({ ...n }))}>
                        <Pencil size={14} />
                      </button>
                      <button className="icon-btn danger" aria-label="Delete note" onClick={(e) => (e.stopPropagation(), setConfirmDel(n))}>
                        <Trash2 size={14} />
                      </button>
                    </span>
                  </div>
                </Panel>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <Modal
        open={!!draft}
        onClose={() => setDraft(null)}
        title={draft?.id ? 'Edit note' : 'New note'}
        wide
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setDraft(null)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={commit}>
              Save note
            </button>
          </>
        }
      >
        {draft && <NoteEditor draft={draft} onChange={setDraft} />}
      </Modal>

      <Modal
        open={!!confirmDel}
        onClose={() => setConfirmDel(null)}
        title="Delete note?"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setConfirmDel(null)}>
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                if (confirmDel) remove(confirmDel.id);
                setConfirmDel(null);
              }}
            >
              <Trash2 size={15} /> Delete
            </button>
          </>
        }
      >
        <p className="muted">“{confirmDel?.title}” will be permanently removed.</p>
      </Modal>
    </div>
  );
}

function NoteEditor({ draft, onChange }: { draft: Draft; onChange: (d: Draft) => void }) {
  const set = (p: Partial<Draft>) => onChange({ ...draft, ...p });
  return (
    <div className="col gap-16">
      <Field label="Title">
        <input className="input" autoFocus value={draft.title} onChange={(e) => set({ title: e.target.value })} placeholder="e.g. Break of structure vs. change of character" />
      </Field>
      <div className="grid-3">
        <Field label="Category">
          <select className="select" value={draft.category} onChange={(e) => set({ category: e.target.value })}>
            {NOTE_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Date">
          <input className="input" type="date" value={draft.date} onChange={(e) => set({ date: e.target.value })} />
        </Field>
        <div className="field">
          <span className="label">
            Importance <span className="mono cyan">{draft.importance}/5</span>
          </span>
          <div style={{ padding: '10px 2px' }}>
            <Pips value={draft.importance} onChange={(importance) => set({ importance })} big />
          </div>
        </div>
      </div>
      <Field label="Content">
        <textarea className="textarea lg" style={{ minHeight: 220 }} value={draft.content} onChange={(e) => set({ content: e.target.value })} placeholder="Explain it in your own words…" />
      </Field>
      <div className="field">
        <span className="label">
          Tags <span className="hint">Enter or comma to add</span>
        </span>
        <TagInput tags={draft.tags} onChange={(tags) => set({ tags })} />
      </div>
    </div>
  );
}

function TagInput({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [text, setText] = useState('');
  const add = (raw: string) => {
    const next = raw
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t && !tags.includes(t));
    if (next.length) onChange([...tags, ...next]);
    setText('');
  };
  let chips: ReactNode = null;
  if (tags.length)
    chips = tags.map((t) => (
      <span key={t} className="tag">
        #{t}
        <button type="button" aria-label={`Remove tag ${t}`} onClick={() => onChange(tags.filter((x) => x !== t))}>
          <X size={11} />
        </button>
      </span>
    ));
  return (
    <div className="tag-input">
      {chips}
      <input
        value={text}
        placeholder={tags.length ? '' : 'e.g. liquidity, NY open'}
        onChange={(e) => (e.target.value.includes(',') ? add(e.target.value) : setText(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            add(text);
          } else if (e.key === 'Backspace' && !text && tags.length) onChange(tags.slice(0, -1));
        }}
        onBlur={() => text.trim() && add(text)}
      />
    </div>
  );
}
