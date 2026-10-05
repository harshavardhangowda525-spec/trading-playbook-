import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { RotateCcw } from 'lucide-react';
import {
  C,
  DEFAULT_EVALUATION,
  EVAL_AREAS,
  SKILL_RULES,
  autoEvaluation,
  type EvalKey,
  type Evaluation,
  type Skills,
} from '../lib/domain';
import { useSkills } from '../lib/data';
import { useDoc } from '../lib/hooks';
import { CountUp, Field, PageHeader, Panel, RingMeter, Slider, reveal } from '../components/ui';
import '../styles/learn.css';

const RULE_KEY: Record<EvalKey, keyof Skills> = {
  knowledge: 'knowledge',
  technical: 'chart',
  risk: 'risk',
  strategy: 'strategy',
  discipline: 'discipline',
  backtesting: 'backtesting',
  simulation: 'simulation',
  psychology: 'psychology',
};

const TOOLTIP_STYLE = { background: 'rgba(20, 19, 23, 0.95)', border: '1px solid rgba(214, 208, 198,0.3)', borderRadius: 6, fontSize: 12 };

export function EvaluationPage() {
  const skills = useSkills();
  const auto = useMemo(() => autoEvaluation(skills), [skills]);
  const [ev, update] = useDoc<Evaluation>(C.evaluation, 'main', DEFAULT_EVALUATION);

  const rows = EVAL_AREAS.map((a) => {
    const self = ev.self[a.key];
    const combined = self == null ? auto[a.key] : Math.round((auto[a.key] + self) / 2);
    return { ...a, auto: auto[a.key], self, combined };
  });
  const overall = rows.reduce((s, r) => s + r.combined, 0) / rows.length;
  const radar = rows.map((r) => ({ area: r.label, score: r.combined }));

  const setSelf = (k: EvalKey, v: number | undefined) =>
    update((prev) => {
      const self = { ...prev.self };
      if (v == null) delete self[k];
      else self[k] = v;
      return { ...prev, self };
    });

  return (
    <div>
      <PageHeader
        eyebrow="PHASE 12 · FINAL EVALUATION"
        title="EVALUATION"
        description="Eight skill areas, each scored from your own data and your honest self-assessment. Designed for days 78–84, viewable anytime."
      />

      <div className="grid-2 mb-16">
        <motion.div variants={reveal} initial="hidden" animate="show" custom={0}>
          <Panel hud title="Overall progress score" style={{ height: '100%' }}>
            <div className="col" style={{ alignItems: 'center', gap: 14, padding: '6px 0' }}>
              <RingMeter value={overall / 100} size={190} stroke={8} showValue={false}>
                <div>
                  <div className="display" style={{ fontSize: 54, fontWeight: 400, color: '#fff', lineHeight: 1 }}>
                    <CountUp value={Math.round(overall)} />
                  </div>
                  <div className="stat-label">/ 100</div>
                </div>
              </RingMeter>
              <p className="small muted center" style={{ margin: 0, maxWidth: 360 }}>
                Mean of the 8 combined area scores. Combined = average of auto score and self-assessment (auto only until you set one).
              </p>
            </div>
          </Panel>
        </motion.div>
        <motion.div variants={reveal} initial="hidden" animate="show" custom={1}>
          <Panel title="Skill radar" style={{ height: '100%' }}>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radar} outerRadius="72%">
                  <defs>
                    <filter id="eval-glow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="3" result="b" />
                      <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <PolarGrid stroke="rgba(214, 208, 198,0.14)" />
                  <PolarAngleAxis dataKey="area" tick={{ fill: '#8f8a82', fontSize: 11 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}`, 'Score']} />
                  <Radar
                    dataKey="score"
                    stroke="#e9dfcb"
                    strokeWidth={2}
                    fill="#e9dfcb"
                    fillOpacity={0.18}
                    style={{ filter: 'url(#eval-glow)' }}
                    dot={{ r: 3, fill: '#e9dfcb' }}
                    isAnimationActive
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </motion.div>
      </div>

      <motion.div variants={reveal} initial="hidden" animate="show" custom={2}>
        <Panel title="Skill areas" sub="auto + self" className="mb-16">
          {rows.map((r) => (
            <div key={r.key} className="eval-area">
              <RingMeter value={r.combined / 100} size={58} stroke={4} />
              <div className="col" style={{ gap: 8, minWidth: 0 }}>
                <div className="row between wrap">
                  <h4>{r.label}</h4>
                  <div className="eval-scores">
                    <span>
                      Auto <span className="num">{r.auto}</span>
                    </span>
                    <span>
                      Self <span className="num">{r.self ?? '—'}</span>
                    </span>
                    <span>
                      Combined <span className="num cyan">{r.combined}</span>
                    </span>
                  </div>
                </div>
                <div className="tiny dim">Auto: {SKILL_RULES[RULE_KEY[r.key]]}</div>
                <div className="row" style={{ alignItems: 'flex-end' }}>
                  <div className="grow" style={{ flex: 1 }}>
                    <Slider
                      label={r.self == null ? 'Self-assessment · not set' : 'Self-assessment'}
                      value={r.self ?? r.auto}
                      min={0}
                      max={100}
                      step={5}
                      suffix=""
                      onChange={(v) => setSelf(r.key, v)}
                    />
                  </div>
                  {r.self != null && (
                    <button type="button" className="icon-btn" aria-label={`Clear ${r.label} self-assessment`} title="Clear self-assessment" onClick={() => setSelf(r.key, undefined)}>
                      <RotateCcw size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Panel>
      </motion.div>

      <motion.div variants={reveal} initial="hidden" animate="show" custom={3}>
        <Panel title="Reflection">
          <div className="grid-2">
            <Field label="Notes">
              <textarea
                className="textarea"
                rows={6}
                placeholder="What do the scores tell you? Where does the data disagree with how you feel?"
                value={ev.notes}
                onChange={(e) => update({ notes: e.target.value })}
              />
            </Field>
            <Field label="Focus areas for the next cycle">
              <textarea
                className="textarea"
                rows={6}
                placeholder={'1.\n2.\n3.'}
                value={ev.focus}
                onChange={(e) => update({ focus: e.target.value })}
              />
            </Field>
          </div>
          <p className="tiny dim" style={{ margin: '12px 0 0' }}>
            Educational self-evaluation only — it measures learning progress, not trading profitability.
          </p>
        </Panel>
      </motion.div>
    </div>
  );
}
