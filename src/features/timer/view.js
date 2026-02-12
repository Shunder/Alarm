import { formatTime, pad } from '../../lib/time.js';

export function renderTimer(state, t) {
  const list = state.timers.map((timer, idx) => {
<<<<<<< HEAD
    const status = timer.running ? t('running') : timer.remaining === timer.duration ? t('idle') : timer.remaining === 0 ? t('done') : t('paused');
    const d = timer.duration;
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = d % 60;
=======
    const status = timer.running ? t('running') : timer.remainingMs === timer.durationMs ? t('idle') : timer.remainingMs <= 0 ? t('done') : t('paused');
    const total = Math.floor(timer.durationMs / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
>>>>>>> 9c4646c (fix: eliminate UI flicker and add ms precision/theme i18n improvements)
    return `<li class="list-item">
      <div>
        <strong>${t('item')} ${idx + 1}</strong>
        <div class="muted">${status}</div>
<<<<<<< HEAD
        <div class="display small">${formatTime(timer.remaining * 1000)}</div>
=======
        <div class="display small" data-timer-display="${timer.id}">${formatTime(timer.remainingMs, { showMilliseconds: state.showTimerMilliseconds })}</div>
>>>>>>> 9c4646c (fix: eliminate UI flicker and add ms precision/theme i18n improvements)
      </div>
      <div class="row">
        <input data-timer-h="${timer.id}" type="number" min="0" max="99" value="${pad(h)}" />
        <input data-timer-m="${timer.id}" type="number" min="0" max="59" value="${pad(m)}" />
        <input data-timer-s="${timer.id}" type="number" min="0" max="59" value="${pad(s)}" />
        <button class="btn" data-timer-save="${timer.id}">${t('save')}</button>
<<<<<<< HEAD
        <button class="btn primary" data-timer-toggle="${timer.id}">${timer.running ? t('pause') : timer.remaining !== timer.duration ? t('resume') : t('start')}</button>
        <button class="btn" data-timer-reset="${timer.id}">${t('reset')}</button>
        <button class="btn" data-timer-delete="${timer.id}">${t('delete')}</button>
=======
        <button class="btn primary" data-timer-toggle="${timer.id}">${timer.running ? t('pause') : timer.remainingMs !== timer.durationMs ? t('resume') : t('start')}</button>
        <button class="btn" data-timer-reset="${timer.id}">${t('reset')}</button>
        <button class="btn" data-timer-delete="${timer.id}" ${state.timers.length <= 1 ? 'disabled' : ''}>${t('delete')}</button>
>>>>>>> 9c4646c (fix: eliminate UI flicker and add ms precision/theme i18n improvements)
      </div>
    </li>`;
  }).join('');

  return `<section class="card">
    <h2>${t('tabTimer')}</h2>
    <div class="row"><button class="btn primary" id="timer-add">${t('addTimer')}</button></div>
    <h3>${t('timerList')}</h3>
    <ul class="entity-list">${list}</ul>
  </section>`;
}
