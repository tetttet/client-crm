import { STORAGE_KEYS, type StorageKey } from "@/lib/constants/storage-keys";

function isBrowser() {
  return typeof window !== "undefined";
}

function readStorageValue(key: StorageKey) {
  if (!isBrowser()) {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorageValue(key: StorageKey, value: string) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {
    return;
  }
}

function removeStorageValue(key: StorageKey) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    return;
  }
}

export function getAccessToken() {
  return readStorageValue(STORAGE_KEYS.accessToken);
}

export function setAccessToken(accessToken: string) {
  writeStorageValue(STORAGE_KEYS.accessToken, accessToken);
}

export function clearAccessToken() {
  removeStorageValue(STORAGE_KEYS.accessToken);
}

export function getStoredValue(key: StorageKey) {
  return readStorageValue(key);
}

export function setStoredValue(key: StorageKey, value: string) {
  writeStorageValue(key, value);
}

export function removeStoredValue(key: StorageKey) {
  removeStorageValue(key);
}
