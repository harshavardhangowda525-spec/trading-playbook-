import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { cloudEnabled, supabase } from './supabase';
import { store } from './store';

interface AuthState {
  mode: 'cloud' | 'local';
  /** null while the session is being restored */
  loading: boolean;
  userId: string | null;
  email: string | null;
  dataReady: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

const LOCAL_USER = 'local-operator';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(cloudEnabled);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = cloudEnabled ? (session?.user.id ?? null) : LOCAL_USER;

  useEffect(() => {
    if (!userId) {
      store.close();
      setDataReady(false);
      return;
    }
    let cancelled = false;
    setDataReady(false);
    store.open(userId, cloudEnabled).then(() => {
      if (!cancelled) setDataReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const value: AuthState = {
    mode: cloudEnabled ? 'cloud' : 'local',
    loading,
    userId,
    email: session?.user.email ?? null,
    dataReady,
    async signIn(email, password) {
      if (!supabase) return 'Cloud sign-in is not configured.';
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return error ? error.message : null;
    },
    async signUp(email, password) {
      if (!supabase) return 'Cloud sign-up is not configured.';
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return error.message;
      if (!data.session) return 'CHECK_EMAIL';
      return null;
    },
    async signOut() {
      if (supabase) await supabase.auth.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth outside AuthProvider');
  return ctx;
}
