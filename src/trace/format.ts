export function formatDuration(ms: number): string {
  if (ms < 1000) {
    const milliseconds = Math.min(999, Math.max(0, Math.round(ms)));
    return `${milliseconds}ms`;
  }
  const seconds = ms / 1000;
  if (seconds < 60) {
    return `${seconds.toPrecision(3)}s`;
  }
  const minutes = seconds / 60;
  if (minutes < 60) {
    return `${minutes.toPrecision(3)}m`;
  }
  return `${(minutes / 60).toPrecision(3)}h`;
}

export function formatTokens(count: number): string {
  if (count < 1000) {
    return `${count}`;
  }
  const thousands = Math.round(count / 1000);
  if (thousands < 1000) {
    return `${thousands}k`;
  }
  return `${Math.round(count / 1_000_000)}m`;
}

export function formatTime(iso: string): string {
  const date = new Date(iso);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export function stringifyJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}
