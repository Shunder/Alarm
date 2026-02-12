const KEY = 'alarm.app.v1';

function createAlarm(id, hour = 7, minute = 30) {
  return { id, hour, minute, enabled: false, snoozeMinutes: 5, nextAt: null };
}

function createTimer(id, duration = 300) {
  return { id, duration, remaining: duration, running: false, endAt: null };
}

function createStopwatch(id) {
  return { id, elapsed: 0, running: false, laps: [] };
}

const defaults = {
  mode: 'dark',
  theme: 'blue',
  lang: 'en',
  showSeconds: true,
  alarms: [createAlarm('a1')],
  timers: [createTimer('t1')],
  stopwatches: [createStopwatch('s1')],
  sound: { volume: 0.7 },
};

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(defaults);
    const parsed = JSON.parse(raw);
    return normalizeState(parsed);
  } catch {
    return structuredClone(defaults);
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function normalizeState(input) {
  const base = mergeDefaults(defaults, input);

  const alarms = Array.isArray(input?.alarms)
    ? input.alarms
    : input?.alarm
      ? [input.alarm]
      : base.alarms;

  const timers = Array.isArray(input?.timers)
    ? input.timers
    : input?.timer
      ? [input.timer]
      : base.timers;

  const stopwatches = Array.isArray(input?.stopwatches)
    ? input.stopwatches
    : input?.stopwatch
      ? [input.stopwatch]
      : base.stopwatches;

  base.alarms = alarms.map((a, idx) => ({ ...createAlarm(`a${idx + 1}`), ...a, id: a.id ?? `a${idx + 1}` }));
  base.timers = timers.map((t, idx) => ({ ...createTimer(`t${idx + 1}`), ...t, id: t.id ?? `t${idx + 1}` }));
  base.stopwatches = stopwatches.map((s, idx) => ({ ...createStopwatch(`s${idx + 1}`), ...s, id: s.id ?? `s${idx + 1}` }));

  if (!base.alarms.length) base.alarms = [createAlarm('a1')];
  if (!base.timers.length) base.timers = [createTimer('t1')];
  if (!base.stopwatches.length) base.stopwatches = [createStopwatch('s1')];

  return base;
}

function mergeDefaults(base, input) {
  if (Array.isArray(base)) return Array.isArray(input) ? input : base;
  if (typeof base !== 'object' || base === null) return input ?? base;
  const out = {};
  for (const key of Object.keys(base)) out[key] = mergeDefaults(base[key], input?.[key]);
  return out;
}
