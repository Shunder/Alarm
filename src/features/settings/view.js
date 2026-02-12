import { themes } from '../../lib/theme.js';
import { getNotificationPermission } from '../../lib/notifications.js';
import { languages } from '../../lib/i18n.js';

export function renderSettings(state, t) {
  const permission = getNotificationPermission();
  return `<section class="card">
    <h2>${t('settings')}</h2>
    <div class="split">
      <div>
        <h3>${t('theme')}</h3>
        <div class="row">
          <button class="btn" id="mode-toggle">${state.mode === 'dark' ? t('switchToLight') : t('switchToDark')}</button>
<<<<<<< HEAD
          ${themes.map((th) => `<button class="btn ${state.theme === th ? 'primary' : ''}" data-theme="${th}">${th}</button>`).join('')}
=======
          ${themes.map((th) => `<button class="btn ${state.theme === th ? 'primary' : ''}" data-theme="${th}">${t(`theme_${th}`)}</button>`).join('')}
>>>>>>> 9c4646c (fix: eliminate UI flicker and add ms precision/theme i18n improvements)
        </div>
        <label class="row" style="margin-top:12px;">${t('language')}
          <select id="language-select">
            ${languages.map((lang) => `<option value="${lang.value}" ${state.lang === lang.value ? 'selected' : ''}>${lang.label}</option>`).join('')}
          </select>
        </label>
<<<<<<< HEAD
=======
        <h3 style="margin-top:16px;">${t('displayPrecision')}</h3>
        <label class="row"><input type="checkbox" id="timer-ms" ${state.showTimerMilliseconds ? 'checked' : ''}/> ${t('timerMilliseconds')}</label>
        <label class="row"><input type="checkbox" id="stopwatch-ms" ${state.showStopwatchMilliseconds ? 'checked' : ''}/> ${t('stopwatchMilliseconds')}</label>
>>>>>>> 9c4646c (fix: eliminate UI flicker and add ms precision/theme i18n improvements)
      </div>
      <div>
        <h3>${t('soundAndNotification')}</h3>
        <label>${t('volume')} <input id="volume" type="range" min="0" max="1" step="0.05" value="${state.sound.volume}" /></label>
        <div class="row" style="margin-top:10px;">
          <button class="btn" id="audio-test">${t('testSound')}</button>
          <button class="btn" id="notification-permission">${t('requestNotification')}</button>
        </div>
        <p class="muted">${t('notification')}: ${permission}</p>
      </div>
    </div>
  </section>`;
}
