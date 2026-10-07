import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BarChart3, BookOpen, Cpu, Download, GraduationCap, Send, Sparkles, Square, Trash2, WifiOff } from 'lucide-react';
import { MODELS } from '../../lib/assistant/engine';
import { visiblePart } from '../../lib/assistant/actions';
import { useAssistant, type AssistantMessage } from '../../lib/assistant/useAssistant';
import { cx } from '../ui';

/** Chat with the in-browser trading coach. Used by the floating dock and Trading → Ask AI. */
export function AssistantChat({ variant, onNavigate }: { variant: 'dock' | 'page'; onNavigate?: () => void }) {
  const a = useAssistant();
  const navigate = useNavigate();
  const [draft, setDraft] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const busy = a.status !== 'idle';

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [a.messages.length, a.streaming]);

  const go = (to: string) => {
    navigate(to);
    onNavigate?.();
  };
  const submit = () => {
    if (!draft.trim() || busy) return;
    void a.ask(draft);
    setDraft('');
  };

  return (
    <div className={cx('ai', `ai-${variant}`)}>
      <div className="ai-head">
        <div className="row" style={{ gap: 10 }}>
          <span className="ai-avatar">
            <Sparkles size={15} />
          </span>
          <div>
            <div className="ai-title">AI Coach</div>
            <div className="mono tiny muted">
              {a.gpu ? (a.prefs.enabled ? `${a.model.label} model · on this device` : 'Runs on this device · free') : 'Lesson search mode'}
            </div>
          </div>
        </div>
        <div className="row" style={{ gap: 6 }}>
          {a.gpu && a.prefs.enabled && (
            <select
              className="select ai-model"
              value={a.model.id}
              disabled={busy}
              onChange={(e) => a.setModel(e.target.value)}
              aria-label="AI model"
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label} ({m.size})
                </option>
              ))}
            </select>
          )}
          {a.messages.length > 0 && (
            <button type="button" className="btn btn-sm btn-ghost ai-icon-btn" onClick={a.clear} disabled={busy} title="Clear chat" aria-label="Clear chat">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="ai-body" ref={listRef}>
        {!a.gpu && (
          <div className="ai-note">
            <WifiOff size={15} />
            <span>
              This browser can't run the AI model (it needs WebGPU — use a recent Chrome or Edge on a laptop or desktop). You can still ask: answers
              come straight from your 84 lessons.
            </span>
          </div>
        )}

        {a.gpu && !a.prefs.enabled && <SetupCard onStart={(id) => void a.enable(id).then(a.warmUp)} current={a.model.id} />}

        {a.progress && (
          <div className="ai-progress">
            <div className="row between small">
              <span>{a.downloaded ? 'Starting the AI model…' : 'Downloading the AI model (first time only)…'}</span>
              <span className="mono">{Math.round(a.progress.progress * 100)}%</span>
            </div>
            <div className="ai-bar">
              <i style={{ width: `${Math.max(2, a.progress.progress * 100)}%` }} />
            </div>
            <div className="mono tiny muted ai-progress-text">{a.progress.text}</div>
          </div>
        )}

        {a.messages.length === 0 && !a.progress && (
          <div className="ai-empty">
            <p>
              Ask anything about trading — candles, levels, risk, strategy, psychology. I answer from your 84-day lessons, can review your journal and
              practice data, quiz you on today's lesson, and open pages for you.
            </p>
          </div>
        )}

        {a.messages.map((m) => (
          <Bubble key={m.id} m={m} onAction={go} />
        ))}

        {a.status === 'thinking' && (
          <div className="ai-msg assistant">
            <div className="ai-text">{a.streaming ? <Markdown text={visiblePart(a.streaming)} /> : <span className="ai-dots" aria-label="Thinking"><i /><i /><i /></span>}</div>
          </div>
        )}

        {a.error && (
          <div className="ai-note warn">
            <span>The AI model hit a problem ({a.error.slice(0, 160)}). Your question was answered from the lessons instead. Try the Light model, or reload the page.</span>
          </div>
        )}
      </div>

      <div className="ai-chips">
        <button type="button" className="ai-chip" disabled={busy} onClick={() => void a.coach()}>
          <GraduationCap size={13} /> Coach me today
        </button>
        <button type="button" className="ai-chip" disabled={busy} onClick={() => void a.review()}>
          <BarChart3 size={13} /> Review my data
        </button>
        <button
          type="button"
          className="ai-chip"
          disabled={busy}
          onClick={() => void a.ask(a.screenDay ? `Explain the Day ${a.screenDay} lesson simply, with an example.` : "Explain today's lesson simply, with an example.")}
        >
          <BookOpen size={13} /> {a.screenDay ? 'Explain this lesson' : "Explain today's lesson"}
        </button>
      </div>

      <form
        className="ai-input"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <textarea
          className="textarea"
          rows={1}
          placeholder={a.quizActive() ? 'Type your answer…' : 'Ask about trading…'}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          aria-label="Message the AI coach"
        />
        {a.status === 'thinking' ? (
          <button type="button" className="btn btn-sm" onClick={a.stop} aria-label="Stop">
            <Square size={13} />
          </button>
        ) : (
          <button type="submit" className="btn btn-sm btn-primary" disabled={!draft.trim() || busy} aria-label="Send">
            <Send size={14} />
          </button>
        )}
      </form>
      <div className="ai-disclaimer tiny muted">Educational only · not financial advice · AI can be wrong — check it against your lessons.</div>
    </div>
  );
}

function SetupCard({ onStart, current }: { onStart: (id: string) => void; current: string }) {
  const [pick, setPick] = useState(current);
  return (
    <div className="ai-setup">
      <div className="row" style={{ gap: 8 }}>
        <Cpu size={16} />
        <b>Turn on the free AI coach</b>
      </div>
      <p className="small muted">
        The AI runs entirely on this device — no account, no API key, no cost, and your questions never leave your browser. It downloads once, then
        works offline. Pick a size:
      </p>
      <div className="ai-models">
        {MODELS.map((m) => (
          <button key={m.id} type="button" className={cx('ai-model-card', pick === m.id && 'on')} onClick={() => setPick(m.id)}>
            <span className="row between">
              <b>{m.label}</b>
              <span className="mono tiny">{m.size}</span>
            </span>
            <span className="tiny muted">{m.note}</span>
          </button>
        ))}
      </div>
      <button type="button" className="btn btn-primary btn-sm" onClick={() => onStart(pick)}>
        <Download size={14} /> Download &amp; start
      </button>
      <p className="tiny muted" style={{ margin: 0 }}>
        Until then, questions are answered from your lessons.
      </p>
    </div>
  );
}

function Bubble({ m, onAction }: { m: AssistantMessage; onAction: (to: string) => void }) {
  return (
    <div className={cx('ai-msg', m.role)}>
      <div className="ai-text">{m.role === 'assistant' ? <Markdown text={m.text} /> : m.text}</div>
      {m.actions && m.actions.length > 0 && (
        <div className="ai-actions">
          {m.actions.map((act) => (
            <button key={act.to} type="button" className="btn btn-sm" onClick={() => onAction(act.to)}>
              {act.label} <ArrowRight size={13} />
            </button>
          ))}
        </div>
      )}
      {m.offline && <div className="mono tiny muted ai-offline">From your lessons</div>}
    </div>
  );
}

/** Minimal, safe Markdown: paragraphs, bullet/numbered lists, **bold**, `code`. */
function Markdown({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <>
      {blocks.map((b, i) => {
        const lines = b.split('\n').filter((l) => l.trim());
        if (lines.length && lines.every((l) => /^\s*([-*•]|\d+[.)])\s+/.test(l))) {
          const ordered = /^\s*\d/.test(lines[0]);
          const items = lines.map((l, j) => <li key={j}>{inline(l.replace(/^\s*([-*•]|\d+[.)])\s+/, ''))}</li>);
          return ordered ? <ol key={i}>{items}</ol> : <ul key={i}>{items}</ul>;
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {inline(l.replace(/^#+\s*/, ''))}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

function inline(s: string): ReactNode[] {
  return s.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') && part.length > 4 ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : part.startsWith('`') && part.endsWith('`') && part.length > 2 ? (
      <code key={i}>{part.slice(1, -1)}</code>
    ) : (
      part
    ),
  );
}
