import { formatTime } from '../../lib/time.js';

export function renderStopwatch(state, t) {
  const list = state.stopwatches.map((sw, idx) => `<li class="list-item">
    <div>
      <strong>${t('item')} ${idx + 1}</strong>
      <div class="muted">${sw.running ? t('running') : sw.elapsed === 0 ? t('idle') : t('paused')}</div>
<<<<<<< HEAD
      <div class="display small">${formatTime(sw.elapsed, false)}</div>
      <div class="muted">${sw.laps.slice(0, 3).map((lap, i) => `${t('lap')} ${i + 1}: ${formatTime(lap, false)}`).join(' · ') || '-'}</div>
=======
      <div class="display small" data-sw-display="${sw.id}">${formatTime(sw.elapsed, { showHours: false, showMilliseconds: state.showStopwatchMilliseconds })}</div>
      <div class="muted">${sw.laps.slice(0, 3).map((lap, i) => `${t('lap')} ${i + 1}: ${formatTime(lap, { showHours: false, showMilliseconds: state.showStopwatchMilliseconds })}`).join(' · ') || '-'}</div>
>>>>>>> 9c4646c (fix: eliminate UI flicker and add ms precision/theme i18n improvements)
    </div>
    <div class="row">
      <button class="btn primary" data-sw-toggle="${sw.id}">${sw.running ? t('pause') : t('start')}</button>
      <button class="btn" data-sw-lap="${sw.id}">${t('lap')}</button>
      <button class="btn" data-sw-reset="${sw.id}">${t('reset')}</button>
<<<<<<< HEAD
      <button class="btn" data-sw-delete="${sw.id}">${t('delete')}</button>
=======
      <button class="btn" data-sw-delete="${sw.id}" ${state.stopwatches.length <= 1 ? 'disabled' : ''}>${t('delete')}</button>
>>>>>>> 9c4646c (fix: eliminate UI flicker and add ms precision/theme i18n improvements)
    </div>
  </li>`).join('');

  return `<section class="card">
    <h2>${t('tabStopwatch')}</h2>
    <div class="row"><button class="btn primary" id="sw-add">${t('addStopwatch')}</button></div>
    <h3>${t('stopwatchList')}</h3>
    <ul class="entity-list">${list}</ul>
  </section>`;
}
