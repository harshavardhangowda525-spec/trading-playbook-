import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Download, HardDrive, LogOut, Upload } from 'lucide-react';
import { Field, NumberInput, PageHeader, Panel, reveal } from '../components/ui';
import { CLIENT_COUNTERS } from '../data/schedule';
import { useAuth } from '../lib/auth';
import { useProfile } from '../lib/data';
import { useSyncStatus, useToday } from '../lib/hooks';
import { journeyDay } from '../lib/domain';
import { store, type SyncStatus } from '../lib/store';
import '../styles/analytics.css';

const SYNC_LABEL: Record<SyncStatus, { text: string; tone: string }> = {
  local: { text: 'Saved on this device', tone: 'dim' },
  loading: { text: 'Loading…', tone: 'dim' },
  synced: { text: 'Synced', tone: 'good' },
  syncing: { text: 'Syncing…', tone: 'warn' },
  offline: { text: 'Offline — changes queued', tone: 'warn' },
  error: { text: 'Sync error — retrying', tone: 'bad' },
};

const ENV_EXAMPLE = `VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key`;

type Dump = Record<string, Record<string, unknown>>;

function isDump(x: unknown): x is Dump {
  if (!x || typeof x !== 'object' || Array.isArray(x)) return false;
  return Object.values(x).every((v) => v && typeof v === 'object' && !Array.isArray(v));
}

export function SettingsPage() {
  const today = useToday();
  const { profile, update } = useProfile();
  const auth = useAuth();
  const sync = useSyncStatus();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ tone: 'good' | 'bad'; text: string } | null>(null);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(store.exportAll(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum-core-backup-${today}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMsg({ tone: 'good', text: 'Backup exported.' });
  };

  const importData = async (file: File) => {
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!isDump(parsed)) throw new Error('Not a Quantum Core backup file.');
      const count = Object.values(parsed).reduce((n, docs) => n + Object.keys(docs).length, 0);
      if (
        !window.confirm(
          `Import ${count} records from "${file.name}"?\n\nRecords with the same id will be overwritten. Other existing data is kept.`,
        )
      )
        return;
      store.importAll(parsed);
      setMsg({ tone: 'good', text: `Imported ${count} records.` });
    } catch (err) {
      setMsg({ tone: 'bad', text: `Import failed: ${err instanceof Error ? err.message : 'invalid file'}` });
    }
  };

  const setTarget = (id: string, v: number | null) =>
    update((prev) => {
      const targets = { ...prev.targets };
      if (v == null || v < 1) delete targets[id];
      else targets[id] = Math.round(v);
      return { ...prev, targets };
    });

  const s = SYNC_LABEL[sync];
  const cloud = auth.mode === 'cloud';

  return (
    <div className="settings">
      <PageHeader eyebrow="CONFIGURATION" title="SYSTEM SETTINGS" description="Operator profile, data backup and sync." />

      <div className="set-grid">
        {/* ── Operator ─────────────────────────────────────────────── */}
        <motion.div variants={reveal} initial="hidden" animate="show" custom={0} className="span-all">
          <Panel title="Operator" sub="profile">
            <div className="grid-2">
              <Field label="Callsign" hint="shown across the command center">
                <input
                  className="input"
                  value={profile.callsign}
                  maxLength={32}
                  placeholder="e.g. NOVA"
                  onChange={(e) => update({ callsign: e.target.value })}
                />
              </Field>
              <Field label="Journey start date" hint={`Day 1 · today is Day ${journeyDay(profile, today)}`}>
                <input
                  className="input mono"
                  type="date"
                  value={profile.startDate ?? ''}
                  max={today}
                  onChange={(e) => e.target.value && update({ startDate: e.target.value })}
                />
              </Field>
            </div>
            <p className="small muted mt-8">
              Day 1 of the 84-day journey. The journey day advances with the calendar; missed days are never reset — they stay visible as missed so you
              can catch up, and your history and longest streaks are always kept.
            </p>

            <div className="section-title mt-24">Client acquisition daily targets</div>
            <p className="small muted" style={{ marginTop: 4 }}>
              Override the default daily target for each counter. Leave blank to use the default.
            </p>
            <div className="set-targets mt-16">
              {CLIENT_COUNTERS.map((c) => (
                <Field key={c.id} label={c.label} hint={`default ${c.target}`}>
                  <NumberInput value={profile.targets[c.id] ?? null} placeholder={String(c.target)} step="1" onChange={(v) => setTarget(c.id, v)} />
                </Field>
              ))}
            </div>
          </Panel>
        </motion.div>

        {/* ── Data & sync ─────────────────────────────────────────── */}
        <motion.div variants={reveal} initial="hidden" animate="show" custom={1}>
          <Panel title="Data & Sync" className="an-panel">
            <div className="row between wrap">
              <div className="row">
                {cloud ? <Cloud size={22} className="cyan" /> : <HardDrive size={22} className="cyan" />}
                <span className="set-mode">{cloud ? 'CLOUD' : 'LOCAL MODE'}</span>
              </div>
              {cloud && (
                <button className="btn btn-sm" onClick={() => void auth.signOut()}>
                  <LogOut size={14} /> Sign out
                </button>
              )}
            </div>
            <div className="set-kv mt-16">
              <span>Account</span>
              <span className="mono">{cloud ? (auth.email ?? '—') : 'This device only'}</span>
              <span>Status</span>
              <span>
                <span className={`badge ${s.tone}`}>{s.text}</span>
              </span>
              <span>Storage</span>
              <span className="small muted">{cloud ? 'IndexedDB cache + Supabase cloud' : 'IndexedDB in this browser'}</span>
            </div>

            <div className="section-title mt-24">Backup</div>
            <p className="small muted" style={{ marginTop: 4 }}>
              Export every record as JSON, or restore from a previous backup. Import merges by record id.
            </p>
            <div className="row wrap mt-16">
              <button className="btn btn-primary" onClick={exportData}>
                <Download size={15} /> Export JSON
              </button>
              <button className="btn" onClick={() => fileRef.current?.click()}>
                <Upload size={15} /> Import JSON
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void importData(f);
                  e.target.value = '';
                }}
              />
            </div>
            {msg && (
              <div className={`notice ${msg.tone} mt-16`} role="status">
                {msg.text}
              </div>
            )}
          </Panel>
        </motion.div>

        {/* ── Cloud setup (local mode) or about ───────────────────── */}
        <motion.div variants={reveal} initial="hidden" animate="show" custom={2}>
          {cloud ? (
            <Panel title="Cloud Accounts" sub="enabled" className="an-panel">
              <p className="small muted" style={{ margin: 0 }}>
                Every change is saved locally first, then pushed to your private Supabase row set. Row-level security keeps each account&apos;s data visible
                only to its owner. Works offline — queued changes sync when you reconnect.
              </p>
            </Panel>
          ) : (
            <Panel title="Enable Cloud Accounts" sub="optional" className="an-panel">
              <p className="small muted" style={{ marginTop: 0 }}>
                You are running in local mode — data lives only in this browser. To sync across devices with email sign-in:
              </p>
              <ol className="set-steps">
                <li>Create a free project at supabase.com.</li>
                <li>
                  Open <b>SQL Editor</b>, paste the contents of <code>supabase/schema.sql</code> and run it.
                </li>
                <li>
                  Copy the project URL and <b>anon public</b> key from Project Settings → API into a <code>.env</code> file in the project root:
                </li>
              </ol>
              <pre className="set-code mt-8">{ENV_EXAMPLE}</pre>
              <ol className="set-steps mt-8" start={4}>
                <li>
                  Rebuild / restart the app (<code>npm run build</code> or <code>npm run dev</code>). A sign-in screen appears.
                </li>
                <li>Export a backup here first, then import it after signing in to move your local data to the cloud.</li>
              </ol>
            </Panel>
          )}
        </motion.div>

        {/* ── Accessibility + disclaimer ─────────────────────────── */}
        <motion.div variants={reveal} initial="hidden" animate="show" custom={3}>
          <Panel title="Accessibility" className="an-panel">
            <p className="small muted" style={{ margin: 0 }}>
              Animations — page transitions, count-ups, chart drawing and celebrations — follow your operating system&apos;s <b>Reduce motion</b> setting.
              Turn it on in your OS accessibility preferences to make the interface static.
            </p>
          </Panel>
        </motion.div>
        <motion.div variants={reveal} initial="hidden" animate="show" custom={4}>
          <Panel title="Disclaimer" className="an-panel">
            <p className="small muted" style={{ margin: 0 }}>
              Quantum Core is an educational journaling and learning tool. Nothing here is financial advice or a recommendation to trade. It shows no live
              market data; backtests, simulations and training charts are practice only and do not represent real results. Trading involves substantial
              risk of loss.
            </p>
          </Panel>
        </motion.div>
      </div>
    </div>
  );
}
