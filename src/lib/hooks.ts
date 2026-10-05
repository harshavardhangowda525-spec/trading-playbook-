import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { newId, store, type SyncStatus } from './store';
import { todayKey } from './dates';

/** Every document in a collection. Items must carry their own `id`. */
export function useCollection<T extends { id: string }>(collection: string) {
  const items = useSyncExternalStore(
    useCallback((fn) => store.subscribe(collection, fn), [collection]),
    () => store.list<T>(collection),
  );
  const save = useCallback((item: T) => store.put(collection, item.id, item), [collection]);
  const remove = useCallback((id: string) => store.remove(collection, id), [collection]);
  const create = useCallback(
    (item: Omit<T, 'id'> & { id?: string }) => {
      const full = { ...item, id: item.id ?? newId() } as T;
      store.put(collection, full.id, full);
      return full;
    },
    [collection],
  );
  return { items, save, remove, create };
}

/**
 * A single document. Returns `fallback` until something is saved.
 * `update` accepts a partial patch or an updater function.
 */
export function useDoc<T extends object>(collection: string, id: string, fallback: T) {
  const stored = useSyncExternalStore(
    useCallback((fn) => store.subscribe(collection, fn), [collection]),
    () => store.get<T>(collection, id),
  );
  const value = useMemo(() => (stored ? { ...fallback, ...stored } : fallback), [stored, fallback]);
  const update = useCallback(
    (patch: Partial<T> | ((prev: T) => T)) => {
      const prev = { ...fallback, ...(store.get<T>(collection, id) ?? {}) } as T;
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
      store.put(collection, id, next);
    },
    [collection, id, fallback],
  );
  return [value, update, stored !== undefined] as const;
}

export function useSyncStatus(): SyncStatus {
  return useSyncExternalStore(
    (fn) => store.subscribeStatus(fn),
    () => store.status,
  );
}

/** Ticks every `ms` milliseconds; returns the current Date. */
export function useNow(ms = 1000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return now;
}

/** Today's local date key; rolls over automatically at midnight. */
export function useToday(): string {
  const [key, setKey] = useState(todayKey);
  useEffect(() => {
    const t = setInterval(() => {
      const k = todayKey();
      setKey((prev) => (prev === k ? prev : k));
    }, 20_000);
    return () => clearInterval(t);
  }, []);
  return key;
}

export function usePrefersReducedMotion(): boolean {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const fn = () => setReduced(mql.matches);
    mql.addEventListener('change', fn);
    return () => mql.removeEventListener('change', fn);
  }, []);
  return reduced;
}
