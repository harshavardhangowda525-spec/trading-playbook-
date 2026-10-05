// Minimal IndexedDB wrapper: one object store holding every document for every user.

export interface StoredDoc {
  k: string; // `${userId}|${collection}|${id}`
  u: string; // userId
  c: string; // collection
  id: string;
  data: unknown;
  updatedAt: number;
  deleted: boolean;
  dirty: boolean; // not yet confirmed by the cloud
}

const DB_NAME = 'quantum-core';
const STORE = 'docs';
let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        const store = db.createObjectStore(STORE, { keyPath: 'k' });
        store.createIndex('u', 'u');
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}

function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T> | void): Promise<T | undefined> {
  return openDb().then(
    (db) =>
      new Promise<T | undefined>((resolve, reject) => {
        const t = db.transaction(STORE, mode);
        const req = fn(t.objectStore(STORE));
        t.oncomplete = () => resolve(req ? req.result : undefined);
        t.onerror = () => reject(t.error);
        t.onabort = () => reject(t.error);
      }),
  );
}

export async function idbLoadUser(userId: string): Promise<StoredDoc[]> {
  const res = await tx<StoredDoc[]>('readonly', (s) => s.index('u').getAll(userId));
  return res ?? [];
}

export async function idbPutMany(docs: StoredDoc[]): Promise<void> {
  if (!docs.length) return;
  await tx('readwrite', (s) => {
    for (const d of docs) s.put(d);
  });
}

export const docKey = (u: string, c: string, id: string) => `${u}|${c}|${id}`;
