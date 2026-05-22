type CacheEntry<T> = { data: T; at: number };

const store = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

export function peekCached<T>(key: string, ttlMs?: number): T | null {
  const hit = store.get(key);
  if (!hit) return null;
  if (ttlMs != null && Date.now() - hit.at >= ttlMs) return null;
  return hit.data as T;
}

export function setCached<T>(key: string, data: T): void {
  store.set(key, { data, at: Date.now() });
}

export function invalidateCached(prefix?: string): void {
  if (!prefix) {
    store.clear();
    inflight.clear();
    return;
  }
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
  for (const key of inflight.keys()) {
    if (key.startsWith(prefix)) inflight.delete(key);
  }
}

/** GET avec cache mémoire, déduplication des requêtes simultanées et TTL. */
export async function fetchCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs = 90_000,
  force = false
): Promise<T> {
  if (!force) {
    const hit = peekCached<T>(key, ttlMs);
    if (hit != null) return hit;
    const pending = inflight.get(key);
    if (pending) return pending as Promise<T>;
  }

  const promise = fetcher()
    .then((data) => {
      setCached(key, data);
      inflight.delete(key);
      return data;
    })
    .catch((err) => {
      inflight.delete(key);
      throw err;
    });

  inflight.set(key, promise);
  return promise;
}
