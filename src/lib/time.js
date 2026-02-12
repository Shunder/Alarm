export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function pad(num) {
  return String(num).padStart(2, '0');
}

export function formatTime(ms, showHours = true) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return showHours ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
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
