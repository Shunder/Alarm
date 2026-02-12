import { formatTime } from '../../lib/time.js';

export function renderStopwatch(state, t) {
  const list = state.stopwatches.map((sw, idx) => `<li class="list-item">
    <div>
      <strong>${t('item')} ${idx + 1}</strong>
      <div class="muted">${sw.running ? t('running') : sw.elapsed === 0 ? t('idle') : t('paused')}</div>
      <div class="display small">${formatTime(sw.elapsed, false)}</div>
      <div class="muted">${sw.laps.slice(0, 3).map((lap, i) => `${t('lap')} ${i + 1}: ${formatTime(lap, false)}`).join(' · ') || '-'}</div>    </div>
    <div class="row">
      <button class="btn primary" data-sw-toggle="${sw.id}">${sw.running ? t('pause') : t('start')}</button>
      <button class="btn" data-sw-lap="${sw.id}">${t('lap')}</button>
      <button class="btn" data-sw-reset="${sw.id}">${t('reset')}</button>
      <button class="btn" data-sw-delete="${sw.id}">${t('delete')}</button>    </div>
  </li>`).join('');

  return `<section class="card">
    <h2>${t('tabStopwatch')}</h2>
    <div class="row"><button class="btn primary" id="sw-add">${t('addStopwatch')}</button></div>
    <h3>${t('stopwatchList')}</h3>
    <ul class="entity-list">${list}</ul>
  </section>`;
}
