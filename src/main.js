import { renderClock } from './features/clock/view.js';
import { renderAlarm } from './features/alarm/view.js';
import { renderTimer } from './features/timer/view.js';
import { renderStopwatch } from './features/stopwatch/view.js';
import { renderSettings } from './features/settings/view.js';
import { loadState, saveState } from './lib/storage.js';
import { applyTheme } from './lib/theme.js';
import { computeNextAlarm } from './lib/time.js';
import { canPlayAudio, playAlarm, unlockAudio } from './lib/audio.js';
import { notify, requestNotificationPermission } from './lib/notifications.js';
import { t as translate } from './lib/i18n.js';

const app = document.querySelector('#app');
const toastEl = document.querySelector('#toast');
let state = loadState();
let activeTab = 'clock';
let modal = null;
let lastTick = Date.now();
let lastClockRenderAt = 0;
let lastTimerRenderAt = 0;
let lastStopwatchRenderAt = 0;

applyTheme(state.mode, state.theme);

const t = (key) => translate(state.lang, key);
const uid = (prefix) => `${prefix}${Math.random().toString(36).slice(2, 8)}`;

function toast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 1800);
}
function persist() { saveState(state); }
function isEditing() {
  const tag = document.activeElement?.tagName;
  return tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA';
}

function triggerRing(sourceKey, targetId = null) {
  const source = t(sourceKey);
  if (canPlayAudio()) playAlarm(state.sound.volume);
  else notify(t('alarmNotice'), `${source} ${t('soundBlockedNotice')}`);
  modal = {
    sourceKey,
    targetId,
    html: `<div class="modal"><div class="card"><h3>${source}</h3><p class="muted">${t('ringTimeUp')}</p><div class="row"><button class="btn primary" id="ring-stop">${t('stop')}</button><button class="btn" id="ring-snooze">${t('snooze')} 5m</button></div></div></div>`,
  };
  render();
}

function tick(now = Date.now()) {
  const dt = now - lastTick;
  lastTick = now;
  let dirty = false;

  state.timers.forEach((timer) => {
    if (!timer.running || !timer.endAt) return;
    const nextRemaining = Math.max(0, Math.ceil((timer.endAt - now) / 1000));
    if (nextRemaining !== timer.remaining) {
      timer.remaining = nextRemaining;
      dirty = true;
    }
    if (timer.remaining === 0) {
      timer.running = false;
      timer.endAt = null;
      dirty = true;
      triggerRing('timer', timer.id);
    }
  });

  state.stopwatches.forEach((sw) => {
    if (sw.running) {
      sw.elapsed += dt;
      dirty = true;
    }
  });

  state.alarms.forEach((alarm) => {
    if (!alarm.enabled || !alarm.nextAt) return;
    if (now >= alarm.nextAt) {
      alarm.enabled = false;
      dirty = true;
      triggerRing('tabAlarm', alarm.id);
    }
  });

  if (dirty) persist();
  if (document.hidden || isEditing()) return;

  if (activeTab === 'clock') {
    const needsSubSecond = state.showSeconds;
    const minInterval = needsSubSecond ? 250 : 1000;
    if (now - lastClockRenderAt >= minInterval) {
      lastClockRenderAt = now;
      render();
    }
    return;
  }

  if (activeTab === 'timer') {
    const runningTimer = state.timers.some((timer) => timer.running);
    if (!runningTimer) return;
    const minInterval = state.showMilliseconds ? 100 : 250;
    if (now - lastTimerRenderAt >= minInterval) {
      lastTimerRenderAt = now;
      render();
    }
    return;
  }

  if (activeTab === 'stopwatch') {
    const runningStopwatch = state.stopwatches.some((sw) => sw.running);
    if (!runningStopwatch) return;
    const minInterval = state.showMilliseconds ? 100 : 250;
    if (now - lastStopwatchRenderAt >= minInterval) {
      lastStopwatchRenderAt = now;
      render();
    }
  }
}

function viewByTab() {
  if (activeTab === 'clock') return renderClock(state, t);
  if (activeTab === 'alarm') return renderAlarm(state, t);
  if (activeTab === 'timer') return renderTimer(state, t);
  if (activeTab === 'stopwatch') return renderStopwatch(state, t);
  return renderSettings(state, t);
}

function nav() {
  const runningTimer = state.timers.some((timer) => timer.running);
  const runningStopwatch = state.stopwatches.some((sw) => sw.running);
  const tabs = [
    { key: 'clock', label: t('tabClock'), icon: '🕒' },
    { key: 'alarm', label: t('tabAlarm'), icon: '⏰' },
    { key: 'timer', label: t('tabTimer'), icon: runningTimer ? '⏳' : '⏱️' },
    { key: 'stopwatch', label: t('tabStopwatch'), icon: runningStopwatch ? '▶️' : '⏸️' },
    { key: 'settings', label: t('tabSettings'), icon: '⚙️' },
  ];
  return `<nav class="nav">${tabs.map((tab) => `<button class="tab" data-tab="${tab.key}" aria-selected="${activeTab === tab.key}">${tab.icon} ${tab.label}</button>`).join('')}</nav>`;
}

function render() {
  app.innerHTML = `<main class="app">${nav()}${viewByTab()}</main>${modal?.html ?? ''}`;
  bindEvents();
}

function bindEvents() {
  app.querySelectorAll('[data-tab]').forEach((el) => el.addEventListener('click', () => {
    activeTab = el.dataset.tab;
    render();
  }));

  app.querySelector('#show-seconds')?.addEventListener('change', (e) => {
    state.showSeconds = e.target.checked;
    persist();
    render();
  });

  app.querySelector('#alarm-add')?.addEventListener('click', () => {
    state.alarms.push({ id: uid('a'), hour: 7, minute: 30, enabled: false, snoozeMinutes: 5, nextAt: null });
    persist(); render();
  });
  app.querySelectorAll('[data-alarm-hour]').forEach((el) => el.addEventListener('change', () => {
    const a = state.alarms.find((x) => x.id === el.dataset.alarmHour);
    if (!a) return;
    a.hour = Math.min(23, Math.max(0, Number(el.value) || 0));
    a.nextAt = computeNextAlarm(a.hour, a.minute);
    toast(t('alarmSaved')); persist(); render();
  }));
  app.querySelectorAll('[data-alarm-minute]').forEach((el) => el.addEventListener('change', () => {
    const a = state.alarms.find((x) => x.id === el.dataset.alarmMinute);
    if (!a) return;
    a.minute = Math.min(59, Math.max(0, Number(el.value) || 0));
    a.nextAt = computeNextAlarm(a.hour, a.minute);
    toast(t('alarmSaved')); persist(); render();
  }));
  app.querySelectorAll('[data-alarm-enabled]').forEach((el) => el.addEventListener('change', () => {
    const a = state.alarms.find((x) => x.id === el.dataset.alarmEnabled);
    if (!a) return;
    a.enabled = el.checked;
    if (a.enabled) a.nextAt = computeNextAlarm(a.hour, a.minute);
    persist(); render();
  }));
  app.querySelectorAll('[data-alarm-snooze]').forEach((el) => el.addEventListener('change', () => {
    const a = state.alarms.find((x) => x.id === el.dataset.alarmSnooze);
    if (!a) return;
    a.snoozeMinutes = Number(el.value) || 5;
    persist();
  }));
  app.querySelectorAll('[data-alarm-delete]').forEach((el) => el.addEventListener('click', () => {
    if (state.alarms.length <= 1) {
      toast(t('cannotDeleteLastItem'));
      return;
    }
    state.alarms = state.alarms.filter((x) => x.id !== el.dataset.alarmDelete);
    persist(); render();
  }));

  app.querySelector('#timer-add')?.addEventListener('click', () => {
    state.timers.push({ id: uid('t'), duration: 300, remaining: 300, running: false, endAt: null });    persist(); render();
  });
  app.querySelectorAll('[data-timer-save]').forEach((el) => el.addEventListener('click', () => {
    const id = el.dataset.timerSave;
    const timer = state.timers.find((x) => x.id === id);
    if (!timer) return;
    const h = Number(app.querySelector(`[data-timer-h="${id}"]`)?.value) || 0;
    const m = Number(app.querySelector(`[data-timer-m="${id}"]`)?.value) || 0;
    const s = Number(app.querySelector(`[data-timer-s="${id}"]`)?.value) || 0;
    timer.duration = h * 3600 + m * 60 + s;
    timer.remaining = timer.duration;    timer.running = false;
    timer.endAt = null;
    toast(t('timerSet'));
    persist(); render();
  }));
  app.querySelectorAll('[data-timer-toggle]').forEach((el) => el.addEventListener('click', () => {
    const timer = state.timers.find((x) => x.id === el.dataset.timerToggle);
    if (!timer) return;
    if (!timer.running) {
      timer.running = true;
      timer.endAt = Date.now() + timer.remaining * 1000;    } else {
      timer.running = false;
      timer.endAt = null;
    }
    persist(); render();
  }));
  app.querySelectorAll('[data-timer-reset]').forEach((el) => el.addEventListener('click', () => {
    const timer = state.timers.find((x) => x.id === el.dataset.timerReset);
    if (!timer) return;
    timer.running = false;
    timer.endAt = null;
    timer.remaining = timer.duration;
    persist(); render();
  }));
  app.querySelectorAll('[data-timer-delete]').forEach((el) => el.addEventListener('click', () => {
    if (state.timers.length <= 1) {
      toast(t('cannotDeleteLastItem'));
      return;
    }
    state.timers = state.timers.filter((x) => x.id !== el.dataset.timerDelete);
    persist(); render();
  }));
  app.querySelector('#sw-add')?.addEventListener('click', () => {
    state.stopwatches.push({ id: uid('s'), elapsed: 0, running: false, laps: [] });
    persist(); render();
  });
  app.querySelectorAll('[data-sw-toggle]').forEach((el) => el.addEventListener('click', () => {
    const sw = state.stopwatches.find((x) => x.id === el.dataset.swToggle);
    if (!sw) return;
    sw.running = !sw.running;
    persist(); render();
  }));
  app.querySelectorAll('[data-sw-lap]').forEach((el) => el.addEventListener('click', () => {
    const sw = state.stopwatches.find((x) => x.id === el.dataset.swLap);
    if (!sw || !sw.running) return;
    sw.laps.unshift(sw.elapsed);
    sw.laps = sw.laps.slice(0, 20);
    persist(); render();
  }));
  app.querySelectorAll('[data-sw-reset]').forEach((el) => el.addEventListener('click', () => {
    const sw = state.stopwatches.find((x) => x.id === el.dataset.swReset);
    if (!sw) return;
    sw.running = false;
    sw.elapsed = 0;
    sw.laps = [];
    persist(); render();
  }));
  app.querySelectorAll('[data-sw-delete]').forEach((el) => el.addEventListener('click', () => {
    if (state.stopwatches.length <= 1) {
      toast(t('cannotDeleteLastItem'));
      return;
    }
    state.stopwatches = state.stopwatches.filter((x) => x.id !== el.dataset.swDelete);
    persist(); render();
  }));
  app.querySelector('#show-milliseconds')?.addEventListener('change', (e) => {
    state.showMilliseconds = e.target.checked;
    persist();
    render();
  });
  app.querySelector('#mode-toggle')?.addEventListener('click', () => {
    state.mode = state.mode === 'dark' ? 'light' : 'dark';
    applyTheme(state.mode, state.theme);
    persist(); render();
  });
  app.querySelectorAll('[data-theme]').forEach((el) => el.addEventListener('click', () => {
    state.theme = el.dataset.theme;
    applyTheme(state.mode, state.theme);
    persist(); render();
  }));
  app.querySelector('#language-select')?.addEventListener('change', (e) => {
    state.lang = e.target.value;
    persist(); render();
  });
  app.querySelector('#volume')?.addEventListener('input', (e) => {
    state.sound.volume = Number(e.target.value); persist();
  });
  app.querySelector('#audio-test')?.addEventListener('click', async () => {
    await unlockAudio();
    playAlarm(state.sound.volume);
    toast(t('soundTestPlayed'));
  });
  app.querySelector('#notification-permission')?.addEventListener('click', async () => {
    const result = await requestNotificationPermission();
    toast(`${t('notification')}: ${result}`);
    render();
  });

  app.querySelector('#ring-stop')?.addEventListener('click', () => {
    modal = null; render();
  });
  app.querySelector('#ring-snooze')?.addEventListener('click', () => {
    if (modal?.sourceKey === 'tabAlarm' && modal.targetId) {
      const alarm = state.alarms.find((x) => x.id === modal.targetId);
      if (alarm) {
        alarm.enabled = true;
        alarm.nextAt = Date.now() + alarm.snoozeMinutes * 60000;
      }
    }
    modal = null;
    persist(); render();
  });
}

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) tick(Date.now());
});
setInterval(() => tick(Date.now()), 100);render();

if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => undefined);
