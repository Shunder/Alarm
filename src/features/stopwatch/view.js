import { formatTime } from '../../lib/time.js';

export function renderStopwatch(state, t) {
  const list = state.stopwatches.map((sw, idx) => {
    const status = sw.running ? t('running') : sw.elapsed === 0 ? t('stopState') : t('paused');
    const statusIcon = sw.running ? '▶️' : sw.elapsed === 0 ? '⏹️' : '⏸️';
    const cannotDelete = state.stopwatches.length <= 1;
    return `<li class="list-item">
    <div>
      <strong>${t('item')} ${idx + 1}</strong>
      <div class="muted">${statusIcon} ${status}</div>
      <div class="display small">${formatTime(sw.elapsed, false, state.showMilliseconds)}</div>
      <div class="muted">${sw.laps.slice(0, 3).map((lap, i) => `${t('lap')} ${i + 1}: ${formatTime(lap, false, state.showMilliseconds)}`).join(' · ') || '-'}</div>
    </div>
    <div class="row">
      <button class="btn primary" data-sw-toggle="${sw.id}">${sw.running ? t('pause') : t('start')}</button>
      <button class="btn" data-sw-lap="${sw.id}">${t('lap')}</button>
      <button class="btn" data-sw-reset="${sw.id}">${t('reset')}</button>
      <button class="btn" data-sw-delete="${sw.id}" ${cannotDelete ? 'disabled' : ''} title="${cannotDelete ? t('cannotDeleteLastItem') : ''}">${t('delete')}</button>
    </div>
  </li>`;
  }).join('');

  return `<section class="card">
    <h2>${t('tabStopwatch')}</h2>
    <div class="row"><button class="btn primary" id="sw-add">${t('addStopwatch')}</button></div>
    <h3>${t('stopwatchList')}</h3>
    <ul class="entity-list">${list}</ul>
  </section>`;
}
