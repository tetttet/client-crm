export type ApiCacheConfig = {
  key?: string;
  ttlMs?: number;
};

type ApiCacheEntry = {
  expiresAt: number;
  value: unknown;
};

const DEFAULT_CACHE_TTL_MS = 60_000;
const apiCacheStore = new Map<string, ApiCacheEntry>();

function isBrowser() {
  return typeof window !== "undefined";
}

export function createApiCacheKey(method: string, url: string) {
  return `${method.toUpperCase()}:${url}`;
}

export function getCachedApiValue<T>(key: string) {
  if (!isBrowser()) {
    return null;
  }

  const cachedEntry = apiCacheStore.get(key);

  if (!cachedEntry) {
    return null;
  }

  if (cachedEntry.expiresAt <= Date.now()) {
    apiCacheStore.delete(key);
    return null;
  }

  return cachedEntry.value as T;
}

export function setCachedApiValue<T>(
  key: string,
  value: T,
  ttlMs = DEFAULT_CACHE_TTL_MS,
) {
  if (!isBrowser()) {
    return;
  }

  apiCacheStore.set(key, {
    expiresAt: Date.now() + ttlMs,
    value,
  });
}

export function clearApiCache(keyPrefix?: string) {
  if (!keyPrefix) {
    apiCacheStore.clear();
    return;
  }

  for (const key of apiCacheStore.keys()) {
    if (key.startsWith(keyPrefix)) {
      apiCacheStore.delete(key);
    }
  }
}
