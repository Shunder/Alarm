export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export function pad(num) {
  return String(num).padStart(2, '0');
}

export function formatTime(ms, showHours = true, showMilliseconds = false) {
  const safeMs = Math.max(0, ms);
  const total = Math.floor(safeMs / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const base = showHours ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  if (!showMilliseconds) return base;
  const milliseconds = String(Math.floor(safeMs % 1000)).padStart(3, '0');
  return `${base}.${milliseconds}`;
}

export function computeNextAlarm(hour, minute, now = new Date()) {
  const next = new Date(now);
  next.setHours(hour, minute, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next.getTime();
}

export function relativeAlarmLabelKey(ts, now = Date.now()) {
  const diff = ts - now;
  return diff < 24 * 3600 * 1000 ? 'today' : 'tomorrow';
}
