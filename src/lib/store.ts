// Document store: in-memory cache → IndexedDB (always) → Supabase (when signed in).
// Every write lands locally first, so the UI never waits on the network and nothing
// is lost offline. Dirty documents are pushed to the cloud in debounced batches.

import { supabase } from './supabase';
import { docKey, idbLoadUser, idbPutMany, type StoredDoc } from './idb';

export type SyncStatus = 'local' | 'loading' | 'synced' | 'syncing' | 'offline' | 'error';

type Listener = () => void;

const EMPTY: never[] = [];

class DocumentStore {
  private userId: string | null = null;
  private cloud = false;
  private docs = new Map<string, Map<string, StoredDoc>>();
  private listCache = new Map<string, unknown[]>();
  private listeners = new Map<string, Set<Listener>>();
  private statusListeners = new Set<Listener>();
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private flushing = false;
  status: SyncStatus = 'loading';
  ready = false;

  async open(userId: string, cloud: boolean) {
    this.userId = userId;
    this.cloud = cloud && !!supabase;
    this.docs.clear();
    this.listCache.clear();
    this.ready = false;
    this.setStatus('loading');

    try {
      const local = await idbLoadUser(userId);
      for (const d of local) this.bucket(d.c).set(d.id, d);
    } catch (err) {
      console.warn('[store] IndexedDB unavailable', err);
    }

    if (this.cloud) {
      try {
        await this.pull();
        this.setStatus('synced');
      } catch (err) {
        console.warn('[store] cloud pull failed, running from local cache', err);
        this.setStatus(navigator.onLine ? 'error' : 'offline');
      }
      this.scheduleFlush(0);
      window.addEventListener('online', this.onOnline);
    } else {
      this.setStatus('local');
    }

    this.ready = true;
    this.notifyAll();
  }

  close() {
    window.removeEventListener('online', this.onOnline);
    this.userId = null;
    this.docs.clear();
    this.listCache.clear();
    this.ready = false;
    this.notifyAll();
  }

  private onOnline = () => this.scheduleFlush(0);

  private async pull() {
    if (!supabase || !this.userId) return;
    const pageSize = 1000;
    const incoming: StoredDoc[] = [];
    for (let from = 0; ; from += pageSize) {
      const { data, error } = await supabase
        .from('documents')
        .select('collection, doc_id, data, deleted, updated_at')
        .eq('user_id', this.userId)
        .order('updated_at', { ascending: true })
        .range(from, from + pageSize - 1);
      if (error) throw error;
      for (const row of data ?? []) {
        const remote: StoredDoc = {
          k: docKey(this.userId, row.collection, row.doc_id),
          u: this.userId,
          c: row.collection,
          id: row.doc_id,
          data: row.data,
          deleted: row.deleted,
          updatedAt: new Date(row.updated_at).getTime(),
          dirty: false,
        };
        const local = this.bucket(remote.c).get(remote.id);
        if (!local || (remote.updatedAt >= local.updatedAt && !local.dirty) || remote.updatedAt > local.updatedAt) {
          this.bucket(remote.c).set(remote.id, remote);
          incoming.push(remote);
        }
      }
      if (!data || data.length < pageSize) break;
    }
    await idbPutMany(incoming).catch(() => undefined);
  }

  private bucket(collection: string) {
    let b = this.docs.get(collection);
    if (!b) {
      b = new Map();
      this.docs.set(collection, b);
    }
    return b;
  }

  // ---- reads --------------------------------------------------------------

  get<T>(collection: string, id: string): T | undefined {
    const d = this.docs.get(collection)?.get(id);
    return d && !d.deleted ? (d.data as T) : undefined;
  }

  /** Stable array (same reference until the collection changes). */
  list<T>(collection: string): T[] {
    const cached = this.listCache.get(collection);
    if (cached) return cached as T[];
    const b = this.docs.get(collection);
    if (!b) return EMPTY as T[];
    const arr: T[] = [];
    for (const d of b.values()) if (!d.deleted) arr.push(d.data as T);
    this.listCache.set(collection, arr);
    return arr;
  }

  // ---- writes -------------------------------------------------------------

  put<T>(collection: string, id: string, data: T) {
    if (!this.userId) return;
    const doc: StoredDoc = {
      k: docKey(this.userId, collection, id),
      u: this.userId,
      c: collection,
      id,
      data,
      deleted: false,
      updatedAt: Date.now(),
      dirty: this.cloud,
    };
    this.bucket(collection).set(id, doc);
    this.changed(collection);
    void idbPutMany([doc]).catch((err) => console.warn('[store] local save failed', err));
    if (this.cloud) this.scheduleFlush();
  }

  remove(collection: string, id: string) {
    if (!this.userId) return;
    const prev = this.docs.get(collection)?.get(id);
    if (!prev) return;
    const doc: StoredDoc = { ...prev, data: {}, deleted: true, updatedAt: Date.now(), dirty: this.cloud };
    this.bucket(collection).set(id, doc);
    this.changed(collection);
    void idbPutMany([doc]).catch(() => undefined);
    if (this.cloud) this.scheduleFlush();
  }

  // ---- cloud push ---------------------------------------------------------

  private scheduleFlush(delay = 700) {
    if (this.flushTimer) clearTimeout(this.flushTimer);
    this.flushTimer = setTimeout(() => void this.flush(), delay);
  }

  private async flush() {
    if (!supabase || !this.userId || this.flushing) return;
    const dirty: StoredDoc[] = [];
    for (const b of this.docs.values()) for (const d of b.values()) if (d.dirty) dirty.push(d);
    if (!dirty.length) {
      if (this.status !== 'synced') this.setStatus('synced');
      return;
    }
    if (!navigator.onLine) {
      this.setStatus('offline');
      return;
    }
    this.flushing = true;
    this.setStatus('syncing');
    try {
      for (let i = 0; i < dirty.length; i += 200) {
        const chunk = dirty.slice(i, i + 200);
        const { error } = await supabase.from('documents').upsert(
          chunk.map((d) => ({
            user_id: d.u,
            collection: d.c,
            doc_id: d.id,
            data: d.data,
            deleted: d.deleted,
            updated_at: new Date(d.updatedAt).toISOString(),
          })),
        );
        if (error) throw error;
        const confirmed: StoredDoc[] = [];
        for (const d of chunk) {
          const current = this.docs.get(d.c)?.get(d.id);
          // Only clear the flag if nothing newer was written while we were uploading.
          if (current && current.updatedAt === d.updatedAt) {
            current.dirty = false;
            confirmed.push(current);
          }
        }
        await idbPutMany(confirmed).catch(() => undefined);
      }
      this.setStatus('synced');
    } catch (err) {
      console.warn('[store] cloud push failed; will retry', err);
      this.setStatus(navigator.onLine ? 'error' : 'offline');
      this.flushing = false;
      this.scheduleFlush(8000);
      return;
    }
    this.flushing = false;
    // Anything written during the upload goes out in the next round.
    for (const b of this.docs.values()) for (const d of b.values()) if (d.dirty) return this.scheduleFlush();
  }

  // ---- subscriptions ------------------------------------------------------

  subscribe(collection: string, fn: Listener) {
    let set = this.listeners.get(collection);
    if (!set) {
      set = new Set();
      this.listeners.set(collection, set);
    }
    set.add(fn);
    return () => set!.delete(fn);
  }

  subscribeStatus(fn: Listener) {
    this.statusListeners.add(fn);
    return () => this.statusListeners.delete(fn);
  }

  private setStatus(s: SyncStatus) {
    this.status = s;
    this.statusListeners.forEach((fn) => fn());
  }

  private changed(collection: string) {
    this.listCache.delete(collection);
    this.listeners.get(collection)?.forEach((fn) => fn());
  }

  private notifyAll() {
    this.listCache.clear();
    for (const set of this.listeners.values()) set.forEach((fn) => fn());
    this.statusListeners.forEach((fn) => fn());
  }

  /** Full export of the signed-in user's data (backup). */
  exportAll(): Record<string, Record<string, unknown>> {
    const out: Record<string, Record<string, unknown>> = {};
    for (const [c, b] of this.docs) {
      for (const d of b.values()) {
        if (d.deleted) continue;
        (out[c] ??= {})[d.id] = d.data;
      }
    }
    return out;
  }

  importAll(dump: Record<string, Record<string, unknown>>) {
    for (const [c, docs] of Object.entries(dump)) {
      for (const [id, data] of Object.entries(docs)) this.put(c, id, data);
    }
  }
}

export const store = new DocumentStore();

export function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
