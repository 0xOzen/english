import { AppState } from '../types';
import { createDefaultAppState, migrateAppState } from './appState';

const DB_NAME = 'wortschatz-db';
const DB_VERSION = 1;
const STORE_NAME = 'app';
const STATE_KEY = 'state';
const LEGACY_STORAGE_KEY = 'wortSchatzState';

function supportsIndexedDb(): boolean {
  return typeof window !== 'undefined' && 'indexedDB' in window;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error ?? new Error('IndexedDB open failed'));
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
}

async function readFromIndexedDb(): Promise<AppState | null> {
  if (!supportsIndexedDb()) {
    return null;
  }

  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(STATE_KEY);

    request.onerror = () => reject(request.error ?? new Error('IndexedDB read failed'));
    request.onsuccess = () => {
      const value = request.result;
      resolve(value ? migrateAppState(value) : null);
    };

    transaction.oncomplete = () => database.close();
    transaction.onerror = () => reject(transaction.error ?? new Error('IndexedDB transaction failed'));
  });
}

function readFromLegacyLocalStorage(): AppState | null {
  if (typeof window === 'undefined' || !('localStorage' in window)) {
    return null;
  }

  const saved = window.localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!saved) {
    return null;
  }

  try {
    return migrateAppState(JSON.parse(saved));
  } catch (error) {
    console.error('Legacy localStorage state could not be parsed:', error);
    return null;
  }
}

export async function loadPersistedAppState(): Promise<AppState> {
  try {
    const indexedDbState = await readFromIndexedDb();
    if (indexedDbState) {
      return indexedDbState;
    }
  } catch (error) {
    console.error('IndexedDB read failed, falling back to legacy localStorage:', error);
  }

  return readFromLegacyLocalStorage() ?? createDefaultAppState();
}

export async function savePersistedAppState(state: AppState): Promise<void> {
  if (!supportsIndexedDb()) {
    if (typeof window !== 'undefined' && 'localStorage' in window) {
      window.localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(state));
    }
    return;
  }

  const database = await openDatabase();

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    store.put(state, STATE_KEY);

    transaction.oncomplete = () => {
      database.close();
      resolve();
    };
    transaction.onerror = () => reject(transaction.error ?? new Error('IndexedDB write failed'));
  });
}
