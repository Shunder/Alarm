import { formatTime, pad } from '../../lib/time.js';

export function renderTimer(state, t, now = Date.now()) {
  const list = state.timers.map((timer, idx) => {
    const status = timer.running ? t('running') : timer.remaining === timer.duration ? t('idle') : timer.remaining === 0 ? t('done') : t('paused');
    const statusIcon = timer.running ? '⏳' : timer.remaining === 0 ? '⏹️' : timer.remaining === timer.duration ? '⏱️' : '⏸️';
    const d = timer.duration;
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = d % 60;
    const cannotDelete = state.timers.length <= 1;
    const displayMs = timer.running && timer.endAt
      ? Math.max(0, timer.endAt - now)
      : timer.remaining * 1000;
    return `<li class="list-item">
      <div>
        <strong>${t('item')} ${idx + 1}</strong>
        <div class="muted">${statusIcon} ${status}</div>
        <div class="display small">${formatTime(displayMs, true, state.showMilliseconds)}</div>
      </div>
      <div class="row">
        <input data-timer-h="${timer.id}" type="number" min="0" max="99" value="${pad(h)}" />
        <input data-timer-m="${timer.id}" type="number" min="0" max="59" value="${pad(m)}" />
        <input data-timer-s="${timer.id}" type="number" min="0" max="59" value="${pad(s)}" />
        <button class="btn" data-timer-save="${timer.id}">${t('save')}</button>
        <button class="btn primary" data-timer-toggle="${timer.id}">${timer.running ? t('pause') : timer.remaining !== timer.duration ? t('resume') : t('start')}</button>
        <button class="btn" data-timer-reset="${timer.id}">${t('reset')}</button>
        <button class="btn" data-timer-delete="${timer.id}" ${cannotDelete ? 'disabled' : ''} title="${cannotDelete ? t('cannotDeleteLastItem') : ''}">${t('delete')}</button>
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
