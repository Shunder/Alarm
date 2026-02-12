import { pad } from '../../lib/time.js';

export function renderClock(state, t) {
  const now = new Date();
  const hh = pad(now.getHours());
  const mm = pad(now.getMinutes());
  const ss = pad(now.getSeconds());
  const locale = state.lang === 'zh' ? 'zh-CN' : 'en-US';
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(now);
  return `<section class="card">
    <h2>${t('tabClock')}</h2>
    <div class="display">${hh}:${mm}${state.showSeconds ? `:${ss}` : ''}</div>
    <p class="muted">${now.toLocaleDateString(locale)} · ${weekday}</p>
    <label class="row"><input id="show-seconds" type="checkbox" ${state.showSeconds ? 'checked' : ''}/> ${t('showSeconds')}</label>
  </section>`;
}
