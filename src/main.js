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

/**
 * 应用主控制器：负责状态流转、事件分发、渲染节流与可靠性兜底。
 */
class AlarmApp {
  constructor({ appEl, toastEl }) {
    this.appEl = appEl;
    this.toastEl = toastEl;
    this.state = loadState();
    this.activeTab = 'clock';
    this.modal = null;
    this.isPointerInteracting = false;
    this.lastTick = Date.now();
    this.lastRenderAt = {
      clock: 0,
      timer: 0,
      stopwatch: 0,
    };

    applyTheme(this.state.mode, this.state.theme);
  }

  /** i18n 翻译入口 */
  t = (key) => translate(this.state.lang, key);

  /** 统一持久化，避免散落调用 */
  persist = () => saveState(this.state);

  uid = (prefix) => `${prefix}${Math.random().toString(36).slice(2, 8)}`;

  start() {
    this.render();
    this.bindRootEvents();
    setInterval(() => this.tick(Date.now()), 100);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => undefined);
    }
  }

  toast(message) {
    this.toastEl.textContent = message;
    this.toastEl.classList.add('show');
    setTimeout(() => this.toastEl.classList.remove('show'), 1800);
  }

  isEditing() {
    const tag = document.activeElement?.tagName;
    return tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA';
  }

  triggerRing(sourceKey, targetId = null) {
    const source = this.t(sourceKey);
    if (canPlayAudio()) playAlarm(this.state.sound.volume);
    else notify(this.t('alarmNotice'), `${source} ${this.t('soundBlockedNotice')}`);

    this.modal = {
      sourceKey,
      targetId,
      html: `<div class="modal"><div class="card"><h3>${source}</h3><p class="muted">${this.t('ringTimeUp')}</p><div class="row"><button class="btn primary" data-action="ring-stop">${this.t('stop')}</button><button class="btn" data-action="ring-snooze">${this.t('snooze')} 5m</button></div></div></div>`,
    };

    this.render();
  }

  /**
   * 心跳：推进计时器、秒表、闹钟状态，并按需触发渲染。
   */
  tick(now = Date.now()) {
    const dt = now - this.lastTick;
    this.lastTick = now;
    let dirty = false;

    this.state.timers.forEach((timer) => {
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
        this.triggerRing('timer', timer.id);
      }
    });

    this.state.stopwatches.forEach((sw) => {
      if (!sw.running) return;
      sw.elapsed += dt;
      dirty = true;
    });

    this.state.alarms.forEach((alarm) => {
      if (!alarm.enabled || !alarm.nextAt) return;
      if (now >= alarm.nextAt) {
        alarm.enabled = false;
        dirty = true;
        this.triggerRing('tabAlarm', alarm.id);
      }
    });

    if (dirty) this.persist();
    if (document.hidden || this.isEditing() || this.isPointerInteracting) return;

    if (this.activeTab === 'clock') {
      const min = this.state.showSeconds ? 250 : 1000;
      if (now - this.lastRenderAt.clock >= min) {
        this.lastRenderAt.clock = now;
        this.render();
      }
      return;
    }

    if (this.activeTab === 'timer') {
      if (!this.state.timers.some((timer) => timer.running)) return;
      const min = this.state.showMilliseconds ? 16 : 250;
      if (now - this.lastRenderAt.timer >= min) {
        this.lastRenderAt.timer = now;
        this.render();
      }
      return;
    }

    if (this.activeTab === 'stopwatch') {
      if (!this.state.stopwatches.some((sw) => sw.running)) return;
      const min = this.state.showMilliseconds ? 16 : 250;
      if (now - this.lastRenderAt.stopwatch >= min) {
        this.lastRenderAt.stopwatch = now;
        this.render();
      }
    }
  }

  getView() {
    if (this.activeTab === 'clock') return renderClock(this.state, this.t);
    if (this.activeTab === 'alarm') return renderAlarm(this.state, this.t);
    if (this.activeTab === 'timer') return renderTimer(this.state, this.t, Date.now());
    if (this.activeTab === 'stopwatch') return renderStopwatch(this.state, this.t);
    return renderSettings(this.state, this.t);
  }

  getNav() {
    const runningTimer = this.state.timers.some((timer) => timer.running);
    const runningStopwatch = this.state.stopwatches.some((sw) => sw.running);
    const tabs = [
      { key: 'clock', label: this.t('tabClock'), icon: '🕒' },
      { key: 'alarm', label: this.t('tabAlarm'), icon: '⏰' },
      { key: 'timer', label: this.t('tabTimer'), icon: runningTimer ? '⏳' : '⏱️' },
      { key: 'stopwatch', label: this.t('tabStopwatch'), icon: runningStopwatch ? '▶️' : '⏸️' },
      { key: 'settings', label: this.t('tabSettings'), icon: '⚙️' },
    ];

    return `<nav class="nav">${tabs
      .map(
        (tab) =>
          `<button class="tab" data-tab="${tab.key}" aria-selected="${this.activeTab === tab.key}">${tab.icon} ${tab.label}</button>`,
      )
      .join('')}</nav>`;
  }

  render() {
    this.appEl.innerHTML = `<main class="app">${this.getNav()}${this.getView()}</main>${this.modal?.html ?? ''}`;
  }

  bindRootEvents() {
    this.appEl.addEventListener('click', (event) => this.onClick(event));
    this.appEl.addEventListener('change', (event) => this.onChange(event));
    this.appEl.addEventListener('input', (event) => this.onInput(event));

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) this.tick(Date.now());
    });
    document.addEventListener('pointerdown', (event) => {
      if (this.appEl.contains(event.target)) this.isPointerInteracting = true;
    });
    document.addEventListener('pointerup', () => {
      this.isPointerInteracting = false;
    });
    document.addEventListener('pointercancel', () => {
      this.isPointerInteracting = false;
    });
  }

  onClick(event) {
    const actionEl = event.target.closest('[data-action], [data-tab], [data-theme], [data-alarm-delete], [data-timer-save], [data-timer-toggle], [data-timer-reset], [data-timer-delete], [data-sw-toggle], [data-sw-lap], [data-sw-reset], [data-sw-delete]');
    if (!actionEl) return;

    if (actionEl.dataset.tab) {
      this.activeTab = actionEl.dataset.tab;
      this.render();
      return;
    }

    if (actionEl.dataset.theme) {
      this.state.theme = actionEl.dataset.theme;
      applyTheme(this.state.mode, this.state.theme);
      this.persist();
      this.render();
      return;
    }

    const action = actionEl.dataset.action;
    if (action) {
      this.handleSimpleAction(action);
      return;
    }

    if (actionEl.dataset.alarmDelete) {
      if (this.state.alarms.length <= 1) {
        this.toast(this.t('cannotDeleteLastItem'));
        return;
      }
      this.state.alarms = this.state.alarms.filter((x) => x.id !== actionEl.dataset.alarmDelete);
      this.persist();
      this.render();
      return;
    }

    if (actionEl.dataset.timerSave) {
      const id = actionEl.dataset.timerSave;
      const timer = this.state.timers.find((x) => x.id === id);
      if (!timer) return;
      const h = Number(this.appEl.querySelector(`[data-timer-h="${id}"]`)?.value) || 0;
      const m = Number(this.appEl.querySelector(`[data-timer-m="${id}"]`)?.value) || 0;
      const s = Number(this.appEl.querySelector(`[data-timer-s="${id}"]`)?.value) || 0;
      timer.duration = h * 3600 + m * 60 + s;
      timer.remaining = timer.duration;
      timer.running = false;
      timer.endAt = null;
      this.toast(this.t('timerSet'));
      this.persist();
      this.render();
      return;
    }

    if (actionEl.dataset.timerToggle) {
      const timer = this.state.timers.find((x) => x.id === actionEl.dataset.timerToggle);
      if (!timer) return;
      if (!timer.running) {
        timer.running = true;
        timer.endAt = Date.now() + timer.remaining * 1000;
      } else {
        timer.running = false;
        timer.endAt = null;
      }
      this.persist();
      this.render();
      return;
    }

    if (actionEl.dataset.timerReset) {
      const timer = this.state.timers.find((x) => x.id === actionEl.dataset.timerReset);
      if (!timer) return;
      timer.running = false;
      timer.endAt = null;
      timer.remaining = timer.duration;
      this.persist();
      this.render();
      return;
    }

    if (actionEl.dataset.timerDelete) {
      if (this.state.timers.length <= 1) {
        this.toast(this.t('cannotDeleteLastItem'));
        return;
      }
      this.state.timers = this.state.timers.filter((x) => x.id !== actionEl.dataset.timerDelete);
      this.persist();
      this.render();
      return;
    }

    if (actionEl.dataset.swToggle) {
      const sw = this.state.stopwatches.find((x) => x.id === actionEl.dataset.swToggle);
      if (!sw) return;
      sw.running = !sw.running;
      this.persist();
      this.render();
      return;
    }

    if (actionEl.dataset.swLap) {
      const sw = this.state.stopwatches.find((x) => x.id === actionEl.dataset.swLap);
      if (!sw || !sw.running) return;
      sw.laps.unshift(sw.elapsed);
      sw.laps = sw.laps.slice(0, 20);
      this.persist();
      this.render();
      return;
    }

    if (actionEl.dataset.swReset) {
      const sw = this.state.stopwatches.find((x) => x.id === actionEl.dataset.swReset);
      if (!sw) return;
      sw.running = false;
      sw.elapsed = 0;
      sw.laps = [];
      this.persist();
      this.render();
      return;
    }

    if (actionEl.dataset.swDelete) {
      if (this.state.stopwatches.length <= 1) {
        this.toast(this.t('cannotDeleteLastItem'));
        return;
      }
      this.state.stopwatches = this.state.stopwatches.filter((x) => x.id !== actionEl.dataset.swDelete);
      this.persist();
      this.render();
    }
  }

  async handleSimpleAction(action) {
    if (action === 'alarm-add') {
      this.state.alarms.push({
        id: this.uid('a'),
        hour: 7,
        minute: 30,
        enabled: false,
        snoozeMinutes: 5,
        nextAt: null,
      });
      this.persist();
      this.render();
      return;
    }

    if (action === 'timer-add') {
      this.state.timers.push({ id: this.uid('t'), duration: 300, remaining: 300, running: false, endAt: null });
      this.persist();
      this.render();
      return;
    }

    if (action === 'sw-add') {
      this.state.stopwatches.push({ id: this.uid('s'), elapsed: 0, running: false, laps: [] });
      this.persist();
      this.render();
      return;
    }

    if (action === 'mode-toggle') {
      this.state.mode = this.state.mode === 'dark' ? 'light' : 'dark';
      applyTheme(this.state.mode, this.state.theme);
      this.persist();
      this.render();
      return;
    }

    if (action === 'audio-test') {
      await unlockAudio();
      playAlarm(this.state.sound.volume);
      this.toast(this.t('soundTestPlayed'));
      return;
    }

    if (action === 'notification-permission') {
      const result = await requestNotificationPermission();
      this.toast(`${this.t('notification')}: ${result}`);
      this.render();
      return;
    }

    if (action === 'ring-stop') {
      this.modal = null;
      this.render();
      return;
    }

    if (action === 'ring-snooze') {
      if (this.modal?.sourceKey === 'tabAlarm' && this.modal.targetId) {
        const alarm = this.state.alarms.find((x) => x.id === this.modal.targetId);
        if (alarm) {
          alarm.enabled = true;
          alarm.nextAt = Date.now() + alarm.snoozeMinutes * 60000;
        }
      }
      this.modal = null;
      this.persist();
      this.render();
    }
  }

  onChange(event) {
    const el = event.target;
    if (!(el instanceof HTMLElement)) return;

    if (el.id === 'show-seconds') {
      this.state.showSeconds = el.checked;
      this.persist();
      this.render();
      return;
    }

    if (el.id === 'show-milliseconds') {
      this.state.showMilliseconds = el.checked;
      this.persist();
      this.render();
      return;
    }

    if (el.id === 'language-select') {
      this.state.lang = el.value;
      this.persist();
      this.render();
      return;
    }

    if (el.dataset.alarmHour) {
      const alarm = this.state.alarms.find((x) => x.id === el.dataset.alarmHour);
      if (!alarm) return;
      alarm.hour = Math.min(23, Math.max(0, Number(el.value) || 0));
      alarm.nextAt = computeNextAlarm(alarm.hour, alarm.minute);
      this.toast(this.t('alarmSaved'));
      this.persist();
      this.render();
      return;
    }

    if (el.dataset.alarmMinute) {
      const alarm = this.state.alarms.find((x) => x.id === el.dataset.alarmMinute);
      if (!alarm) return;
      alarm.minute = Math.min(59, Math.max(0, Number(el.value) || 0));
      alarm.nextAt = computeNextAlarm(alarm.hour, alarm.minute);
      this.toast(this.t('alarmSaved'));
      this.persist();
      this.render();
      return;
    }

    if (el.dataset.alarmEnabled) {
      const alarm = this.state.alarms.find((x) => x.id === el.dataset.alarmEnabled);
      if (!alarm) return;
      alarm.enabled = el.checked;
      if (alarm.enabled) alarm.nextAt = computeNextAlarm(alarm.hour, alarm.minute);
      this.persist();
      this.render();
      return;
    }

    if (el.dataset.alarmSnooze) {
      const alarm = this.state.alarms.find((x) => x.id === el.dataset.alarmSnooze);
      if (!alarm) return;
      alarm.snoozeMinutes = Number(el.value) || 5;
      this.persist();
    }
  }

  onInput(event) {
    const el = event.target;
    if (!(el instanceof HTMLElement)) return;
    if (el.id === 'volume') {
      this.state.sound.volume = Number(el.value);
      this.persist();
    }
  }
}

const app = document.querySelector('#app');
const toastEl = document.querySelector('#toast');

if (app && toastEl) {
  const alarmApp = new AlarmApp({ appEl: app, toastEl });
  alarmApp.start();
}
