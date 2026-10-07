import { useState } from 'react';
import { AlertTriangle, ChevronDown, Compass, HelpCircle, Lightbulb, ListOrdered, Target } from 'lucide-react';
import type { LessonContent } from '../../data/lessons';
import { cx } from '../ui';

/** The full written lesson: what, why, how, example, mistakes, self-check. */
export function LessonGuide({ content }: { content: LessonContent }) {
  return (
    <article className="lg">
      <Section icon={Compass} title="What it is">
        {content.what.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </Section>
      <Section icon={Target} title="Why it matters">
        {content.why.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </Section>
      <Section icon={ListOrdered} title="How to use it">
        <ol className="lg-steps">
          {content.how.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </Section>
      <Section icon={Lightbulb} title="Example">
        <div className="lg-example">
          <div className="lg-example-title">{content.example.title}</div>
          {content.example.lines.map((l, i) => (
            <div key={i} className="lg-example-line">
              {l}
            </div>
          ))}
        </div>
      </Section>
      <Section icon={AlertTriangle} title="Common mistakes">
        <ul className="lg-mistakes">
          {content.mistakes.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </Section>
      <Section icon={HelpCircle} title="Quick self-check">
        <div className="lg-quiz">
          {content.quiz.map((q, i) => (
            <QuizItem key={i} n={i + 1} q={q.q} a={q.a} />
          ))}
        </div>
      </Section>
    </article>
  );
}

function Section({ icon: Icon, title, children }: { icon: typeof Compass; title: string; children: React.ReactNode }) {
  return (
    <section className="lg-section">
      <h3 className="lg-h">
        <Icon size={15} strokeWidth={1.5} /> {title}
      </h3>
      <div className="lg-body">{children}</div>
    </section>
  );
}

function QuizItem({ n, q, a }: { n: number; q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cx('lg-q', open && 'open')}>
      <button type="button" className="lg-q-btn" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span className="lg-q-n mono">{n}</span>
        <span className="lg-q-text">{q}</span>
        <span className="lg-q-reveal mono">
          {open ? 'Hide' : 'Answer'} <ChevronDown size={13} />
        </span>
      </button>
      {open && <div className="lg-a">{a}</div>}
    </div>
  );
}
