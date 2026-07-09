import { useState } from "preact/hooks";

const prefix = "eve-devtools";

function readStored<T>(key: string, defaultValue: T): T {
  const stored = localStorage.getItem(`${prefix}:${key}`);
  if (stored === null) {
    return defaultValue;
  }
  return JSON.parse(stored) as T;
}

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const [value, setValue] = useState(() => readStored(key, defaultValue));

  function save(next: T) {
    setValue(next);
    localStorage.setItem(`${prefix}:${key}`, JSON.stringify(next));
  }

  return [value, save];
}
