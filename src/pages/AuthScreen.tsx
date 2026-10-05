import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Lock, Mail } from 'lucide-react';
import { useAuth } from '../lib/auth';

export function BootScreen({ label }: { label: string }) {
  return (
    <div className="boot">
      <div className="boot-core">
        <span className="boot-ring" />
        <span className="boot-ring r2" />
        <Cpu size={26} className="cyan" />
      </div>
      <div className="display upper muted" style={{ letterSpacing: '0.3em' }}>
        {label}
      </div>
    </div>
  );
}

export function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: 'bad' | 'good'; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    const err = mode === 'in' ? await signIn(email, password) : await signUp(email, password);
    setBusy(false);
    if (err === 'CHECK_EMAIL') setMessage({ tone: 'good', text: 'Access requested. Confirm your email, then sign in.' });
    else if (err) setMessage({ tone: 'bad', text: err });
  };

  return (
    <div className="boot">
      <motion.form
        onSubmit={submit}
        className="glass hud pad-lg auth-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="row" style={{ justifyContent: 'center', marginBottom: 8 }}>
          <div className="boot-core sm">
            <span className="boot-ring" />
            <Cpu size={20} className="cyan" />
          </div>
        </div>
        <div className="eyebrow" style={{ justifyContent: 'center', width: '100%' }}>
          Quantum Core
        </div>
        <h1 className="center" style={{ fontSize: 26, letterSpacing: '0.14em', margin: '8px 0 4px' }}>
          {mode === 'in' ? 'OPERATOR LOGIN' : 'CREATE OPERATOR'}
        </h1>
        <p className="center muted small" style={{ marginTop: 0 }}>
          Your personal trading academy & command center. 1% better every day.
        </p>
        <div className="col gap-16 mt-16">
          <label className="field">
            <span className="label">Email</span>
            <div className="input-icon">
              <Mail size={15} />
              <input className="input" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </label>
          <label className="field">
            <span className="label">Password</span>
            <div className="input-icon">
              <Lock size={15} />
              <input
                className="input"
                type="password"
                required
                minLength={6}
                autoComplete={mode === 'in' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </label>
          {message && <div className={`notice ${message.tone}`}>{message.text}</div>}
          <button className="btn btn-primary btn-lg btn-block" disabled={busy}>
            {busy ? 'AUTHENTICATING…' : mode === 'in' ? 'ENTER COMMAND CENTER' : 'INITIALISE ACCOUNT'}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setMode(mode === 'in' ? 'up' : 'in')}>
            {mode === 'in' ? 'New operator? Create an account' : 'Have an account? Sign in'}
          </button>
        </div>
        <p className="tiny dim center" style={{ marginBottom: 0, marginTop: 18 }}>
          Educational journaling app — not financial advice. No live market data.
        </p>
      </motion.form>
    </div>
  );
}
