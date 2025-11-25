import { useEffect, useState } from "react";

const defaultParser = (value) => {
  if (value === undefined || value === null || value === "") return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const defaultSerializer = (value) => JSON.stringify(value);

const getStorage = (provided) => {
  if (provided) return provided;
  if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
  if (typeof globalThis !== "undefined" && globalThis.localStorage) return globalThis.localStorage;
  return null;
};

const safeGet = (storage, key) => {
  try {
    return storage?.getItem?.(key) ?? null;
  } catch {
    return null;
  }
};

const safeSet = (storage, key, value) => {
  try {
    storage?.setItem?.(key, value);
  } catch {
    // ignore write errors (e.g., private mode)
  }
};

const safeRemove = (storage, key) => {
  try {
    storage?.removeItem?.(key);
  } catch {
    // noop
  }
};

const resolveInitial = (value) => (typeof value === "function" ? value() : value);

export function usePersistentState(
  key,
  {
    initialValue = null,
    parser = defaultParser,
    serializer = defaultSerializer,
    storage: storageOption,
    enabled = true,
    persistNull = false,
  } = {},
) {
  const storage = getStorage(storageOption);
  const canUseStorage = Boolean(enabled && storage);
  const fallback = resolveInitial(initialValue);

  const [state, setState] = useState(() => {
    if (!canUseStorage) return fallback;
    const raw = safeGet(storage, key);
    if (raw === null || raw === undefined) return fallback;
    const parsed = parser(raw);
    return parsed !== undefined ? parsed : fallback;
  });

  useEffect(() => {
    if (!canUseStorage) return undefined;

    if (state === undefined) {
      safeRemove(storage, key);
      return undefined;
    }

    if (state === null && !persistNull) {
      safeRemove(storage, key);
      return undefined;
    }

    try {
      const serialized = serializer(state);
      if (serialized === undefined) {
        safeRemove(storage, key);
        return undefined;
      }
      safeSet(storage, key, serialized);
    } catch {
      // ignore serialization errors
    }

    return undefined;
  }, [state, key, serializer, canUseStorage, storage, persistNull]);

  return [state, setState];
}
