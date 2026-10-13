import { Download } from 'lucide-react';
import type { Report } from '../../lib/etf/report';

/** Educational report: measured facts, assumptions and suggestions kept visibly separate. */
export function ReportView({ report }: { report: Report }) {
  const download = () => {
    const lines = [
      report.title,
      report.subtitle,
      '',
      'MEASURED RESULTS',
      ...report.measured.map((r) => `- ${r.label}: ${r.value}`),
      '',
      'MARKET CONDITIONS (measured)',
      ...report.conditions.map((x) => `- ${x}`),
      '',
      'RULES',
      ...report.rules.map((x) => `- ${x}`),
      '',
      'RISK-LIMIT COMPLIANCE',
      ...report.risk.map((x) => `- ${x}`),
      '',
      'MISTAKES & WARNINGS',
      ...report.mistakes.map((x) => `- ${x}`),
      '',
      'ASSUMPTIONS',
      ...report.assumptions.map((x) => `- ${x}`),
      '',
      'WHAT TO PRACTISE NEXT (educational suggestions, not predictions)',
      ...report.next.map((x) => `- ${x}`),
      '',
      report.disclaimer,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/[^\w]+/g, '-').toLowerCase()}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className="etf-report">
      <div className="row between wrap" style={{ gap: 8 }}>
        <div>
          <div className="etf-report-title">{report.title}</div>
          <div className="mono tiny muted">{report.subtitle}</div>
        </div>
        <button type="button" className="btn btn-sm btn-ghost" onClick={download}>
          <Download size={13} /> Download report
        </button>
      </div>
      <Section tag="Measured" title="Results">
        <div className="etf-kv">
          {report.measured.map((r) => (
            <div key={r.label}>
              <span>{r.label}</span>
              <b>{r.value}</b>
            </div>
          ))}
        </div>
      </Section>
      <Section tag="Measured" title="Market conditions" items={report.conditions} />
      <Section tag="Measured" title="Rules followed / violated" items={report.rules} />
      <Section tag="Measured" title="Risk-limit compliance" items={report.risk} />
      <Section tag="Measured" title="Mistakes & warnings" items={report.mistakes.length ? report.mistakes : ['None detected.']} />
      <Section tag="Assumption" title="Costs, slippage & fill rules" items={report.assumptions} />
      <Section tag="Suggestion" title="What to practise next" items={report.next} />
      <p className="tiny muted" style={{ margin: 0 }}>
        {report.disclaimer}
      </p>
    </div>
  );
}

function Section({ tag, title, items, children }: { tag: 'Measured' | 'Assumption' | 'Suggestion'; title: string; items?: string[]; children?: React.ReactNode }) {
  return (
    <section className="etf-report-sec">
      <div className="etf-report-h">
        <span className={`etf-tag ${tag.toLowerCase()}`}>{tag}</span> {title}
      </div>
      {children ?? (
        <ul>
          {items!.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
