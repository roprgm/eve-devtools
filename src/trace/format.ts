export function formatDuration(ms: number): string {
  if (ms < 1000) {
    const milliseconds = Math.min(999, Math.max(0, Math.round(ms)));
    return `${milliseconds}ms`;
  }
  const seconds = ms / 1000;
  if (seconds < 60) {
    const formattedSeconds = seconds.toPrecision(3);
    if (Number(formattedSeconds) < 60) {
      return `${formattedSeconds}s`;
    }
    return `${(Number(formattedSeconds) / 60).toPrecision(3)}m`;
  }
  const minutes = seconds / 60;
  if (minutes < 60) {
    const formattedMinutes = minutes.toPrecision(3);
    if (Number(formattedMinutes) < 60) {
      return `${formattedMinutes}m`;
    }
    return `${(Number(formattedMinutes) / 60).toPrecision(3)}h`;
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
